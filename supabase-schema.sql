-- SecureBank Database Schema for Supabase
-- Run this SQL in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    account_number VARCHAR(20) UNIQUE NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    description TEXT,
    reference_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fraud_alerts table
CREATE TABLE IF NOT EXISTS fraud_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    risk_level VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    amount DECIMAL(15,2),
    location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'resolved', 'false_positive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID
);

-- Create system_metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    database_performance DECIMAL(5,2),
    api_response_time INTEGER,
    memory_usage DECIMAL(5,2),
    storage_usage DECIMAL(5,2),
    cpu_usage DECIMAL(5,2),
    active_connections INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table (for authentication)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_account_number ON customers(account_number);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_customer_id ON fraud_alerts(customer_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_status ON fraud_alerts(status);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_risk_level ON fraud_alerts(risk_level);
CREATE INDEX IF NOT EXISTS idx_system_logs_event_type ON system_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);

-- Insert sample data
INSERT INTO customers (name, email, phone, account_number, balance, status) VALUES
('Sarah Johnson', 'sarah.johnson@email.com', '+1-555-0123', '****5678', 45230.50, 'active'),
('Michael Chen', 'michael.chen@email.com', '+1-555-0124', '****9012', 78945.20, 'active'),
('Emily Rodriguez', 'emily.rodriguez@email.com', '+1-555-0125', '****3456', 12340.75, 'suspended'),
('David Thompson', 'david.thompson@email.com', '+1-555-0126', '****7890', 156780.90, 'active'),
('Lisa Wang', 'lisa.wang@email.com', '+1-555-0127', '****2345', 67500.00, 'active'),
('James Wilson', 'james.wilson@email.com', '+1-555-0128', '****6789', 32100.25, 'active');

-- Insert sample transactions
INSERT INTO transactions (id, customer_id, type, amount, status, description) 
SELECT 
    'TXN-2024-' || LPAD(ROW_NUMBER() OVER()::TEXT, 3, '0'),
    c.id,
    CASE (ROW_NUMBER() OVER() % 6)
        WHEN 0 THEN 'Wire Transfer'
        WHEN 1 THEN 'ATM Withdrawal'
        WHEN 2 THEN 'Online Purchase'
        WHEN 3 THEN 'Deposit'
        WHEN 4 THEN 'Bill Payment'
        ELSE 'Transfer'
    END,
    (RANDOM() * 10000 + 100)::DECIMAL(10,2),
    CASE (ROW_NUMBER() OVER() % 4)
        WHEN 0 THEN 'completed'
        WHEN 1 THEN 'completed'
        WHEN 2 THEN 'pending'
        ELSE 'completed'
    END,
    'Sample transaction description'
FROM customers c
CROSS JOIN generate_series(1, 20);

-- Insert sample fraud alerts
INSERT INTO fraud_alerts (customer_id, alert_type, title, description, risk_level, amount, location) 
SELECT 
    c.id,
    CASE (ROW_NUMBER() OVER() % 3)
        WHEN 0 THEN 'high_risk_transaction'
        WHEN 1 THEN 'unusual_pattern'
        ELSE 'new_device_login'
    END,
    CASE (ROW_NUMBER() OVER() % 3)
        WHEN 0 THEN 'High Risk Transaction'
        WHEN 1 THEN 'Unusual Spending Pattern'
        ELSE 'New Device Login'
    END,
    CASE (ROW_NUMBER() OVER() % 3)
        WHEN 0 THEN 'Multiple large withdrawals detected'
        WHEN 1 THEN 'Atypical purchasing behavior detected'
        ELSE 'Account accessed from new device'
    END,
    CASE (ROW_NUMBER() OVER() % 3)
        WHEN 0 THEN 'high'
        WHEN 1 THEN 'medium'
        ELSE 'low'
    END,
    (RANDOM() * 5000 + 500)::DECIMAL(10,2),
    CASE (ROW_NUMBER() OVER() % 3)
        WHEN 0 THEN 'International'
        WHEN 1 THEN 'Local'
        ELSE 'New York'
    END
FROM customers c
LIMIT 5;

-- Insert current system metrics
INSERT INTO system_metrics (database_performance, api_response_time, memory_usage, storage_usage, cpu_usage, active_connections) 
VALUES (99.8, 45, 67.2, 78.5, 23.1, 1247);

-- Insert sample system logs
INSERT INTO system_logs (event_type, event_data, severity) VALUES
('admin_login', '{"user_id": "admin_001", "email": "admin@securebank.com"}', 'info'),
('database_backup', '{"backup_size": "2.3GB", "duration": "15 minutes"}', 'info'),
('high_cpu_usage', '{"server": "server-02", "cpu_usage": 85.2}', 'warning'),
('security_patch', '{"patch_version": "v2.1.4", "affected_systems": ["core", "auth"]}', 'info'),
('scheduled_maintenance', '{"duration": "30 minutes", "services_affected": ["api", "database"]}', 'info');

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access (adjust based on your authentication setup)
-- Note: These are basic policies - you should customize based on your security requirements

-- Allow all operations for authenticated users (you may want to restrict this further)
CREATE POLICY "Allow all operations for authenticated users" ON customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON transactions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON fraud_alerts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON system_metrics FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON system_logs FOR ALL TO authenticated USING (true);

-- For anonymous access (if needed for demo purposes)
CREATE POLICY "Allow read access for anonymous users" ON customers FOR SELECT TO anon USING (true);
CREATE POLICY "Allow read access for anonymous users" ON transactions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow read access for anonymous users" ON fraud_alerts FOR SELECT TO anon USING (true);
CREATE POLICY "Allow read access for anonymous users" ON system_metrics FOR SELECT TO anon USING (true);
CREATE POLICY "Allow read access for anonymous users" ON system_logs FOR SELECT TO anon USING (true);

-- Create a function to get customer name for transactions (helper function)
CREATE OR REPLACE FUNCTION get_customer_name(customer_uuid UUID)
RETURNS TEXT AS $$
BEGIN
    RETURN (SELECT name FROM customers WHERE id = customer_uuid);
END;
$$ LANGUAGE plpgsql;

-- Create a view for transaction details with customer names
CREATE OR REPLACE VIEW transaction_details AS
SELECT 
    t.*,
    c.name as customer_name,
    c.email as customer_email,
    c.account_number as customer_account
FROM transactions t
LEFT JOIN customers c ON t.customer_id = c.id;

-- Grant permissions on the view
GRANT SELECT ON transaction_details TO authenticated;
GRANT SELECT ON transaction_details TO anon;

-- Create admin_emails table for email portal
CREATE TABLE IF NOT EXISTS admin_emails (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255) DEFAULT 'admin@securebank.com',
    subject VARCHAR(500) NOT NULL,
    preview TEXT,
    body TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'fraud', 'system', 'customer', 'compliance')),
    attachments JSONB DEFAULT '[]'::jsonb,
    sent BOOLEAN DEFAULT false,
    draft BOOLEAN DEFAULT false,
    archived BOOLEAN DEFAULT false,
    deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for admin_emails
CREATE INDEX IF NOT EXISTS idx_admin_emails_recipient ON admin_emails(recipient_email);
CREATE INDEX IF NOT EXISTS idx_admin_emails_category ON admin_emails(category);
CREATE INDEX IF NOT EXISTS idx_admin_emails_read ON admin_emails(read);
CREATE INDEX IF NOT EXISTS idx_admin_emails_created_at ON admin_emails(created_at);

-- Insert sample emails
INSERT INTO admin_emails (sender, sender_email, subject, preview, body, read, priority, category, attachments) VALUES
('Security Team', 'security@securebank.com', 'URGENT: Multiple Failed Login Attempts Detected', 'We have detected 5 failed login attempts on account ****1234 within the last 10 minutes...', 'Dear Admin,

We have detected multiple failed login attempts on customer account ****1234 within the last 10 minutes. This could indicate a potential security breach or brute force attack.

Details:
- Account: ****1234 (Sarah Johnson)
- Failed attempts: 5
- Time period: Last 10 minutes
- IP Address: 192.168.1.100
- Location: New York, NY

Recommended actions:
1. Temporarily lock the account
2. Contact the customer to verify legitimacy
3. Review recent transaction activity
4. Consider additional security measures

Please review and take appropriate action.

Best regards,
Security Team
SecureBank', false, 'high', 'fraud', '[]'::jsonb),

('Compliance Department', 'compliance@securebank.com', 'Monthly Compliance Report - January 2024', 'Please find attached the monthly compliance report for January 2024. All regulatory requirements...', 'Dear Admin,

Please find attached the monthly compliance report for January 2024. All regulatory requirements have been met and documented.

Key highlights:
- AML compliance: 100%
- KYC verification: 98.5%
- Transaction monitoring: Active
- Suspicious activity reports: 3 filed
- Regulatory updates: 2 implemented

Please review the attached report and confirm receipt.

Regards,
Compliance Department
SecureBank', true, 'medium', 'compliance', '[{"name": "Compliance_Report_Jan2024.pdf", "size": "2.3 MB"}]'::jsonb),

('Customer Support', 'support@securebank.com', 'Customer Complaint - Account Suspension', 'Customer Michael Chen has filed a complaint regarding the suspension of his account ****9012...', 'Dear Admin,

Customer Michael Chen has filed a formal complaint regarding the suspension of his account ****9012. 

Customer details:
- Name: Michael Chen
- Account: ****9012
- Suspension date: 2024-01-19
- Reason: Unusual transaction pattern

Customer''s complaint:
"The suspension of my account is unjustified. I was making legitimate purchases for my business and the transactions were within my normal spending patterns. I need immediate access to my funds."

Support team recommendation:
- Review transaction history
- Verify customer''s business documentation
- Consider temporary account reactivation with monitoring

Please review and provide guidance on resolution.

Best regards,
Customer Support Team
SecureBank', false, 'high', 'customer', '[]'::jsonb),

('System Administrator', 'sysadmin@securebank.com', 'Scheduled Maintenance - Database Upgrade', 'Scheduled maintenance window for database upgrade has been confirmed for Sunday, February 4th...', 'Dear Admin,

Scheduled maintenance window for database upgrade has been confirmed.

Maintenance details:
- Date: Sunday, February 4th, 2024
- Time: 2:00 AM - 6:00 AM EST
- Duration: 4 hours
- Impact: All online services will be unavailable
- Backup systems: Activated

Services affected:
- Online banking portal
- Mobile app
- API services
- Customer support portal

Customer notifications:
- Email notifications sent
- Website banner posted
- Mobile app notification scheduled

Please ensure all critical processes are completed before maintenance window.

Regards,
System Administrator
SecureBank', true, 'medium', 'system', '[]'::jsonb),

('Fraud Detection Team', 'fraud@securebank.com', 'Fraud Alert: Suspicious Wire Transfer', 'High-risk wire transfer detected for account ****5678. Amount: $15,000 to international destination...', 'Dear Admin,

High-risk wire transfer detected requiring immediate review.

Transaction details:
- Account: ****5678 (Sarah Johnson)
- Amount: $15,000.00
- Destination: International (Country: Unknown)
- Time: 2024-01-20 14:23:15
- Risk score: 95/100

Risk factors:
- Unusual destination country
- Amount exceeds normal transaction patterns
- No prior international transfers
- Customer not responding to verification calls

Recommended action:
- BLOCK transaction pending verification
- Contact customer immediately
- Review account for additional suspicious activity

This requires immediate attention.

Best regards,
Fraud Detection Team
SecureBank', false, 'high', 'fraud', '[]'::jsonb);

-- Disable RLS for admin_emails table
ALTER TABLE admin_emails DISABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
CREATE TRIGGER update_admin_emails_updated_at BEFORE UPDATE ON admin_emails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
