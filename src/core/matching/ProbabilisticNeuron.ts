import { Matrix, multiply, inv, subtract, transpose, sqrt } from 'mathjs';

export class ProbabilisticNeuron {
    // Mean vector representing the central tendency of the skill
    public mean: Matrix;
    // Covariance matrix representing the uncertainty/spread
    public covariance: Matrix;
    public inverseCovariance: Matrix;

    constructor(mean: Matrix, covariance: Matrix) {
        this.mean = mean;
        this.covariance = covariance;
        // Pre-compute inverse for performance in Mahalanobis distance
        this.inverseCovariance = inv(covariance);
    }

    /**
     * Calculates the geometric alignment (Mahalanobis distance) between this neuron and another.
     * Lower distance implies better alignment.
     */
    public calculateAlignment(other: ProbabilisticNeuron): number {
        // Difference between means
        const diff = subtract(this.mean, other.mean);

        // Mahalanobis distance formula: sqrt((x-u)^T * S^-1 * (x-u))
        // We use the average precision (inverse covariance) or just this neuron's perspective
        // For symmetric probabilistic matching, we might combine covariances.
        // Here we check how well 'other' fits into 'this' distribution.

        const diffT = transpose(diff);
        const step1 = multiply(diffT, this.inverseCovariance);
        const step2 = multiply(step1, diff);

        // Result is a scalar inside a matrix/value
        const distSq = typeof step2 === 'number' ? step2 : (step2 as any).get([0]);

        return sqrt(distSq);
    }
}
