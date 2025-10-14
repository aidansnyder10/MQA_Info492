-- Supabase Permissions Setup for AI vs AI Experiment
-- Run this AFTER creating the main schema from ai-vs-ai-schema.sql

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE business_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE attack_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attack_results ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (for web app)
-- This allows your web app to read/write data without authentication

-- Business Rules: Allow anonymous users to read rules
CREATE POLICY "Allow anonymous read on business_rules" 
ON business_rules FOR SELECT 
TO anon 
USING (true);

-- Attack Attempts: Allow anonymous users to insert new attempts
CREATE POLICY "Allow anonymous insert on attack_attempts" 
ON attack_attempts FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow anonymous users to read their own attempts
CREATE POLICY "Allow anonymous read on attack_attempts" 
ON attack_attempts FOR SELECT 
TO anon 
USING (true);

-- Experiment Sessions: Allow anonymous users to insert new sessions
CREATE POLICY "Allow anonymous insert on experiment_sessions" 
ON experiment_sessions FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow anonymous users to read their own sessions
CREATE POLICY "Allow anonymous read on experiment_sessions" 
ON experiment_sessions FOR SELECT 
TO anon 
USING (true);

-- Attack Results: Allow anonymous users to insert new results
CREATE POLICY "Allow anonymous insert on attack_results" 
ON attack_results FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow anonymous users to read their own results
CREATE POLICY "Allow anonymous read on attack_results" 
ON attack_results FOR SELECT 
TO anon 
USING (true);

-- Grant necessary permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON business_rules TO anon;
GRANT INSERT, SELECT ON attack_attempts TO anon;
GRANT INSERT, SELECT ON experiment_sessions TO anon;
GRANT INSERT, SELECT ON attack_results TO anon;

-- Optional: Create a function to get experiment statistics
CREATE OR REPLACE FUNCTION get_experiment_stats()
RETURNS TABLE (
    total_attacks BIGINT,
    successful_attacks BIGINT,
    success_rate NUMERIC,
    avg_suspicion_score NUMERIC
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        COUNT(*) as total_attacks,
        COUNT(*) FILTER (WHERE success = true) as successful_attacks,
        ROUND(
            (COUNT(*) FILTER (WHERE success = true)::NUMERIC / COUNT(*)::NUMERIC) * 100, 
            2
        ) as success_rate,
        ROUND(AVG(suspicion_score), 2) as avg_suspicion_score
    FROM attack_attempts;
$$;

-- Grant execute permission on the stats function
GRANT EXECUTE ON FUNCTION get_experiment_stats() TO anon;
