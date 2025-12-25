import { supabase } from '@/lib/supabaseClient';
import { ProbabilisticNeuron } from './ProbabilisticNeuron';
import { matrix } from 'mathjs';

export class MatchingService {

    /**
     * Finds matches for a target user based on Mahalanobis distance.
     * @param userId The ID of the user looking for a match
     * @param threshold Distance threshold (lower is better, 0 = perfect overlap)
     */
    public async findMatches(userId: string, threshold: number = 2.0) {
        // 1. Fetch target user's skills
        const { data: mySkills, error: myError } = await supabase
            .from('skills')
            .select('*')
            .eq('user_id', userId);

        if (myError || !mySkills || mySkills.length === 0) {
            console.error("Error fetching user skills", myError);
            return [];
        }

        // For simplicity, we assume one primary skill/neuron per user for now, or we match skill-to-skill
        const mySkillParams = mySkills[0];
        const myNeuron = new ProbabilisticNeuron(
            matrix(mySkillParams.mean_vector),
            matrix(this.reshapeMatrix(mySkillParams.covariance_matrix, 5)) // Assuming 5 dims
        );

        // 2. Fetch candidate skills (everyone else)
        const { data: candidates, error: cError } = await supabase
            .from('skills')
            .select('*, profiles(username)')
            .neq('user_id', userId);

        if (cError || !candidates) return [];

        const matches = [];

        // 3. Probabilistic Inference
        for (const candidate of candidates) {
            const candidateNeuron = new ProbabilisticNeuron(
                matrix(candidate.mean_vector),
                matrix(this.reshapeMatrix(candidate.covariance_matrix, 5))
            );

            const distance = myNeuron.calculateAlignment(candidateNeuron);

            if (distance <= threshold) {
                matches.push({
                    user: candidate.profiles,
                    skill: candidate.name,
                    compatibility_score: 1 / (1 + distance), // Normalize to 0-1 score
                    distance
                });
            }
        }

        // Sort by best match (lowest distance / highest score)
        return matches.sort((a, b) => b.compatibility_score - a.compatibility_score);
    }

    /**
     * Helper to reshape flat array from DB back into Matrix
     */
    private reshapeMatrix(flatArray: number[], size: number): number[][] {
        const res = [];
        for (let i = 0; i < size; i++) {
            res.push(flatArray.slice(i * size, (i + 1) * size));
        }
        return res;
    }
}
