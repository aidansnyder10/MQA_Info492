-- AI vs AI Experiment Database Schema
-- This creates the tables needed for AI attacker vs AI defender experiments

-- 1. Business Rules Table (Scoring Parameters)
CREATE TABLE IF NOT EXISTS business_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_type TEXT NOT NULL, -- 'vendor_fraud', 'payroll_theft', 'card_abuse', 'invoice_fraud'
    parameter_name TEXT NOT NULL, -- 'newVendor', 'largeAmount', etc.
    weight INTEGER NOT NULL, -- -20, -15, +5, +20, etc.
    description TEXT, -- 'Suspicious', 'Less suspicious', 'Trusted'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Attack Attempts Table (Generated Attacks)
CREATE TABLE IF NOT EXISTS attack_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_type TEXT NOT NULL,
    attacker_ai_model TEXT NOT NULL, -- 'microsoft/DialoGPT-medium', etc.
    attack_data JSONB NOT NULL, -- Generated attack details
    suspicion_score INTEGER, -- Calculated total score
    defender_decision TEXT, -- 'APPROVE' or 'REJECT'
    success BOOLEAN, -- Did attack succeed?
    attacker_reasoning TEXT, -- Why AI attacker chose this approach
    defender_reasoning TEXT, -- Why AI defender made this decision
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Experiment Sessions Table (Track experiment runs)
CREATE TABLE IF NOT EXISTS experiment_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_name TEXT NOT NULL,
    attacker_model TEXT NOT NULL,
    total_attempts INTEGER DEFAULT 0,
    successful_attacks INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2),
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    status TEXT DEFAULT 'running' -- 'running', 'completed', 'paused'
);

-- 4. Attack Results Table (Aggregated statistics)
CREATE TABLE IF NOT EXISTS attack_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES experiment_sessions(id),
    scenario_type TEXT NOT NULL,
    total_attempts INTEGER DEFAULT 0,
    successful_attacks INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2),
    avg_suspicion_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default business rules for vendor fraud
INSERT INTO business_rules (scenario_type, parameter_name, weight, description) VALUES
('vendor_fraud', 'newVendor', -20, 'Suspicious - new vendors need verification'),
('vendor_fraud', 'largeAmount', -15, 'Suspicious - amounts over $10,000'),
('vendor_fraud', 'genericName', -10, 'Suspicious - generic company names like "Solutions LLC"'),
('vendor_fraud', 'hasPhoneNumber', +5, 'Less suspicious - has contact information'),
('vendor_fraud', 'hasWebsite', +5, 'Less suspicious - has web presence'),
('vendor_fraud', 'hasEmail', +3, 'Less suspicious - has email contact'),
('vendor_fraud', 'historicalVendor', +20, 'Trusted - known vendor with history'),
('vendor_fraud', 'roundAmount', -5, 'Suspicious - round numbers like $15,000'),
('vendor_fraud', 'urgentRequest', -8, 'Suspicious - urgent payment requests');

-- Insert default business rules for payroll theft
INSERT INTO business_rules (scenario_type, parameter_name, weight, description) VALUES
('payroll_theft', 'sameDayRequest', -25, 'Very suspicious - immediate banking change'),
('payroll_theft', 'unknownEmail', -20, 'Suspicious - email from unverified sender'),
('payroll_theft', 'noVerification', -15, 'Suspicious - no identity verification provided'),
('payroll_theft', 'verifiedEmployee', +20, 'Trusted - confirmed employee identity'),
('payroll_theft', 'normalHours', +5, 'Less suspicious - request during business hours'),
('payroll_theft', 'previousChanges', -10, 'Suspicious - frequent banking changes'),
('payroll_theft', 'completeInfo', +8, 'Less suspicious - provides complete bank details'),
('payroll_theft', 'followsProcedure', +15, 'Trusted - follows company procedures');

-- Insert default business rules for card abuse
INSERT INTO business_rules (scenario_type, parameter_name, weight, description) VALUES
('card_abuse', 'largeIncrease', -20, 'Suspicious - increase over $15,000'),
('card_abuse', 'sameDayRequest', -15, 'Suspicious - immediate limit increase'),
('card_abuse', 'noJustification', -25, 'Very suspicious - no business justification'),
('card_abuse', 'urgentReason', -10, 'Suspicious - urgent spending claims'),
('card_abuse', 'detailedJustification', +10, 'Less suspicious - detailed business case'),
('card_abuse', 'historicalApproval', +15, 'Trusted - team has approval history'),
('card_abuse', 'reasonableAmount', +8, 'Less suspicious - reasonable increase amount'),
('card_abuse', 'followsPolicy', +12, 'Trusted - follows company card policies');

-- Insert default business rules for invoice fraud
INSERT INTO business_rules (scenario_type, parameter_name, weight, description) VALUES
('invoice_fraud', 'inflatedAmount', -20, 'Suspicious - amount significantly higher than usual'),
('invoice_fraud', 'newVendor', -15, 'Suspicious - invoice from new vendor'),
('invoice_fraud', 'genericServices', -12, 'Suspicious - vague service descriptions'),
('invoice_fraud', 'hasReceipts', +8, 'Less suspicious - provides supporting documentation'),
('invoice_fraud', 'historicalVendor', +18, 'Trusted - established vendor relationship'),
('invoice_fraud', 'detailedBreakdown', +10, 'Less suspicious - detailed cost breakdown'),
('invoice_fraud', 'normalAmount', +15, 'Trusted - amount within normal range'),
('invoice_fraud', 'properFormatting', +5, 'Less suspicious - professionally formatted invoice');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_rules_scenario ON business_rules(scenario_type);
CREATE INDEX IF NOT EXISTS idx_attack_attempts_scenario ON attack_attempts(scenario_type);
CREATE INDEX IF NOT EXISTS idx_attack_attempts_model ON attack_attempts(attacker_ai_model);
CREATE INDEX IF NOT EXISTS idx_attack_attempts_created ON attack_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_experiment_sessions_status ON experiment_sessions(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_business_rules_updated_at 
    BEFORE UPDATE ON business_rules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
