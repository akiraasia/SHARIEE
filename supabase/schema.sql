-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table profiles (
  id uuid references auth.users on delete cascade,
  username text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- NEURAL CELLS (Digital Twins)
create table neural_cells (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  local_dna jsonb not null default '{}'::jsonb, -- Stores traits, history
  global_dna jsonb not null default '{}'::jsonb, -- Stores ethics, compliance rules
  current_status text default 'active', -- active, healing, offline
  failure_metric float default 0.0,
  last_snapshot jsonb, -- For immunity block healing
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SKILLS (Probabilistic Neurons)
create table skills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  
  -- Probabilistic Representation
  -- We store Mean vector and Covariance matrix as Arrays
  -- Assuming 5-dimensional skill vector for matches (e.g. [Tempo, Pitch, Tone, Rhythm, Sentiment])
  mean_vector float8[] not null, 
  
  -- Covariance is a Flattened Matrix (5x5 = 25 float array) or we can use JSONB for structure
  -- Using double precision array for potential PostGIS/pgvector operations later if needed
  covariance_matrix float8[] not null,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MATCHES (Collaboration Events)
create table matches (
  id uuid default uuid_generate_v4() primary key,
  initiator_id uuid references profiles(id) not null,
  target_id uuid references profiles(id) not null,
  
  -- SVD / Laplace Result
  compatibility_score float not null, 
  predicted_outcome text, -- 'Success', 'Failure'
  
  status text default 'pending', -- pending, accepted, rejected, completed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table profiles enable row level security;
alter table neural_cells enable row level security;
alter table skills enable row level security;
alter table matches enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);

create policy "Users can view all skills." on skills for select using (true);
create policy "Users can update own skills." on skills for update using (auth.uid() = user_id);
