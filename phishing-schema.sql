-- Supabase schema for AI Phishing Campaign Experiment
-- This table stores the results of phishing email experiments

CREATE TABLE IF NOT EXISTS phishing_experiment_results (
    id BIGSERIAL PRIMARY KEY,
    experiment_type TEXT NOT NULL DEFAULT 'ai_vs_manual_phishing',
    total_personas INTEGER NOT NULL,
    manual_avg_score DECIMAL(5,2) NOT NULL,
    ai_avg_score DECIMAL(5,2) NOT NULL,
    ai_advantage DECIMAL(5,2) NOT NULL,
    results_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create an index on timestamp for faster queries
CREATE INDEX IF NOT EXISTS idx_phishing_experiment_timestamp 
ON phishing_experiment_results (timestamp);

-- Create an index on experiment_type for filtering
CREATE INDEX IF NOT EXISTS idx_phishing_experiment_type 
ON phishing_experiment_results (experiment_type);

-- Enable Row Level Security (RLS)
ALTER TABLE phishing_experiment_results ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anonymous inserts (for the demo)
CREATE POLICY "Allow anonymous inserts" ON phishing_experiment_results
    FOR INSERT TO anon
    WITH CHECK (true);

-- Create a policy that allows anonymous selects (for viewing results)
CREATE POLICY "Allow anonymous selects" ON phishing_experiment_results
    FOR SELECT TO anon
    USING (true);

-- Sample data structure for results_data JSONB field:
-- {
--   "personaResults": [
--     {
--       "personaId": 1,
--       "personaName": "John Doe",
--       "personaRole": "Investment Analyst",
--       "manualScore": {
--         "grammar": 3,
--         "contextual": 2,
--         "urgency": 3,
--         "evasion": 2,
--         "personalization": 1,
--       },
--       "aiScore": {
--         "grammar": 4,
--         "contextual": 4,
--         "urgency": 4,
--         "evasion": 3,
--         "personalization": 4,
--         "total": 19
--       },
--       "difference": 6.0
--     }
--   ]
-- }

-- Optional: Create a view for easier analysis
CREATE OR REPLACE VIEW phishing_experiment_summary AS
SELECT 
    id,
    experiment_type,
    total_personas,
    manual_avg_score,
    ai_avg_score,
    ai_advantage,
    ROUND((ai_advantage / manual_avg_score * 100), 2) as improvement_percentage,
    created_at,
    timestamp
FROM phishing_experiment_results
ORDER BY timestamp DESC;
