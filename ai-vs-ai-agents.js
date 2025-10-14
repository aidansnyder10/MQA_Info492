// AI vs AI Experiment Agents
// Attack AI generates random attacks, Defender AI evaluates using Supabase rules

class AttackAI {
    constructor(model = 'microsoft/DialoGPT-medium') {
        this.config = window.SecureBankConfig?.ai?.huggingFace || {};
        this.model = model;
        this.apiUrl = this.config.apiUrl + this.model;
        this.token = this.config.token;
        this.supabase = window.supabase;
        
        // Attack strategies and data pools
        this.vendorNames = [
            'Tech Solutions LLC', 'Global Services Inc', 'Premier Consulting Group',
            'Advanced Systems Corp', 'Digital Innovations Ltd', 'Strategic Partners LLC',
            'Enterprise Solutions Inc', 'Professional Services Group', 'Innovation Labs LLC',
            'Business Solutions Corp', 'Technology Partners Inc', 'Strategic Consulting LLC'
        ];
        
        this.employeeNames = [
            'Alex Rivera', 'Nina Patel', 'Chris Lee', 'Sarah Johnson', 'Michael Chen',
            'Emily Rodriguez', 'David Thompson', 'Jessica Wang', 'Robert Kim', 'Maria Garcia'
        ];
        
        this.businessJustifications = [
            'urgent equipment purchases for Q4 expansion',
            'emergency software licensing renewal',
            'infrastructure upgrades for security compliance',
            'client project deliverables requiring immediate resources',
            'market research and competitive analysis',
            'team training and professional development',
            'vendor consolidation and optimization initiative'
        ];
        
        console.log('AttackAI initialized with model:', this.model);
    }
    
    // Generate random vendor fraud attack
    async generateVendorFraud() {
        const attackData = {
            vendorName: this.getRandomVendor(),
            amount: this.getRandomAmount(1000, 25000),
            description: this.getRandomDescription(),
            isNewVendor: Math.random() > 0.3, // 70% chance of new vendor
            hasPhoneNumber: Math.random() > 0.4, // 60% chance
            hasWebsite: Math.random() > 0.3, // 70% chance
            hasEmail: Math.random() > 0.2, // 80% chance
            isHistoricalVendor: Math.random() > 0.7, // 30% chance
            isRoundAmount: this.isRoundAmount(amount),
            isUrgentRequest: Math.random() > 0.6, // 40% chance
            timestamp: new Date().toISOString()
        };
        
        // Get AI reasoning for this attack
        const reasoning = await this.getAttackReasoning('vendor_fraud', attackData);
        
        return {
            scenarioType: 'vendor_fraud',
            attackData: attackData,
            reasoning: reasoning,
            timestamp: new Date().toISOString()
        };
    }
    
    // Generate random payroll theft attack
    async generatePayrollTheft() {
        const employee = this.getRandomEmployee();
        const attackData = {
            employeeName: employee,
            newAccountNumber: this.generateBankAccount(),
            newRoutingNumber: this.generateRoutingNumber(),
            requestDate: new Date().toISOString(),
            isSameDayRequest: Math.random() > 0.7, // 30% chance
            isUnknownEmail: Math.random() > 0.6, // 40% chance
            hasVerification: Math.random() > 0.5, // 50% chance
            isNormalHours: this.isBusinessHours(),
            hasPreviousChanges: Math.random() > 0.8, // 20% chance
            hasCompleteInfo: Math.random() > 0.3, // 70% chance
            followsProcedure: Math.random() > 0.4, // 60% chance
            timestamp: new Date().toISOString()
        };
        
        const reasoning = await this.getAttackReasoning('payroll_theft', attackData);
        
        return {
            scenarioType: 'payroll_theft',
            attackData: attackData,
            reasoning: reasoning,
            timestamp: new Date().toISOString()
        };
    }
    
    // Generate random card abuse attack
    async generateCardAbuse() {
        const attackData = {
            cardName: 'Engineering Team Card',
            currentLimit: 30000,
            requestedLimit: this.getRandomLimit(35000, 75000),
            justification: this.getRandomJustification(),
            requestDate: new Date().toISOString(),
            isLargeIncrease: this.isLargeIncrease(requestedLimit, 30000),
            isSameDayRequest: Math.random() > 0.7, // 30% chance
            hasJustification: Math.random() > 0.2, // 80% chance
            isUrgentReason: Math.random() > 0.6, // 40% chance
            hasDetailedJustification: Math.random() > 0.4, // 60% chance
            hasHistoricalApproval: Math.random() > 0.7, // 30% chance
            isReasonableAmount: this.isReasonableAmount(requestedLimit, 30000),
            followsPolicy: Math.random() > 0.5, // 50% chance
            timestamp: new Date().toISOString()
        };
        
        const reasoning = await this.getAttackReasoning('card_abuse', attackData);
        
        return {
            scenarioType: 'card_abuse',
            attackData: attackData,
            reasoning: reasoning,
            timestamp: new Date().toISOString()
        };
    }
    
    // Generate random invoice fraud attack
    async generateInvoiceFraud() {
        const normalAmount = 3200; // Typical utility bill
        const attackData = {
            vendorName: 'Northwest Utilities',
            invoiceNumber: this.generateInvoiceNumber(),
            amount: this.getRandomAmount(normalAmount, normalAmount * 3),
            description: 'Monthly utilities - catch-up billing',
            normalAmount: normalAmount,
            isInflatedAmount: this.isInflatedAmount(amount, normalAmount),
            isNewVendor: Math.random() > 0.8, // 20% chance
            hasGenericServices: Math.random() > 0.6, // 40% chance
            hasReceipts: Math.random() > 0.4, // 60% chance
            isHistoricalVendor: Math.random() > 0.3, // 70% chance
            hasDetailedBreakdown: Math.random() > 0.5, // 50% chance
            isNormalAmount: this.isNormalAmount(amount, normalAmount),
            hasProperFormatting: Math.random() > 0.2, // 80% chance
            timestamp: new Date().toISOString()
        };
        
        const reasoning = await this.getAttackReasoning('invoice_fraud', attackData);
        
        return {
            scenarioType: 'invoice_fraud',
            attackData: attackData,
            reasoning: reasoning,
            timestamp: new Date().toISOString()
        };
    }
    
    // Get AI reasoning for attack strategy
    async getAttackReasoning(scenarioType, attackData) {
        const prompt = `You are an AI attacker trying to commit ${scenarioType}. 
        You've generated this attack: ${JSON.stringify(attackData, null, 2)}.
        Explain your strategy and why you think this attack might succeed. Be concise.`;
        
        try {
            const response = await this.callHuggingFaceAPI(prompt);
            return this.parseAIResponse(response);
        } catch (error) {
            console.error('AI reasoning error:', error);
            return 'Fallback: Generated attack with random parameters';
        }
    }
    
    // Helper methods
    getRandomVendor() {
        return this.vendorNames[Math.floor(Math.random() * this.vendorNames.length)];
    }
    
    getRandomEmployee() {
        return this.employeeNames[Math.floor(Math.random() * this.employeeNames.length)];
    }
    
    getRandomAmount(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    getRandomDescription() {
        const descriptions = [
            'IT consulting services',
            'Software licensing fees',
            'Infrastructure maintenance',
            'Security audit services',
            'Data backup solutions',
            'Network optimization',
            'Cloud migration services'
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }
    
    getRandomJustification() {
        return this.businessJustifications[Math.floor(Math.random() * this.businessJustifications.length)];
    }
    
    getRandomLimit(min, max) {
        return Math.floor(Math.random() * (max - min + 1000)) + min;
    }
    
    generateBankAccount() {
        return Math.floor(Math.random() * 900000000) + 100000000; // 9-digit account
    }
    
    generateRoutingNumber() {
        return Math.floor(Math.random() * 900000000) + 100000000; // 9-digit routing
    }
    
    generateInvoiceNumber() {
        return 'INV-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 9000) + 1000;
    }
    
    isRoundAmount(amount) {
        return amount % 1000 === 0;
    }
    
    isBusinessHours() {
        const hour = new Date().getHours();
        return hour >= 9 && hour <= 17;
    }
    
    isLargeIncrease(newLimit, currentLimit) {
        return (newLimit - currentLimit) > 15000;
    }
    
    isReasonableAmount(newLimit, currentLimit) {
        return (newLimit - currentLimit) <= 10000;
    }
    
    isInflatedAmount(amount, normalAmount) {
        return amount > normalAmount * 1.5;
    }
    
    isNormalAmount(amount, normalAmount) {
        return Math.abs(amount - normalAmount) <= normalAmount * 0.2;
    }
    
    // Call Hugging Face API
    async callHuggingFaceAPI(prompt) {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        const requestBody = {
            inputs: prompt,
            parameters: {
                max_length: 100,
                temperature: 0.7,
                return_full_text: false
            }
        };
        
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('Hugging Face API Error:', error);
            throw error;
        }
    }
    
    parseAIResponse(aiResponse) {
        let responseText = '';
        
        if (Array.isArray(aiResponse) && aiResponse.length > 0) {
            responseText = aiResponse[0].generated_text || '';
        } else if (aiResponse.generated_text) {
            responseText = aiResponse.generated_text;
        } else if (typeof aiResponse === 'string') {
            responseText = aiResponse;
        }
        
        return responseText.trim() || 'AI reasoning unavailable';
    }
}

class DefenderAI {
    constructor() {
        this.supabase = window.supabase;
        this.rulesCache = new Map(); // Cache rules for performance
        console.log('DefenderAI initialized');
    }
    
    // Evaluate attack using Supabase rules
    async evaluateAttack(attack) {
        try {
            // Get rules for this scenario type
            const rules = await this.getBusinessRules(attack.scenarioType);
            
            // Calculate suspicion score
            const suspicionScore = this.calculateSuspicionScore(attack.attackData, rules);
            
            // Make decision based on threshold
            const decision = suspicionScore >= 0 ? 'APPROVE' : 'REJECT';
            const success = decision === 'APPROVE';
            
            // Generate defender reasoning
            const reasoning = this.generateDefenderReasoning(attack.attackData, rules, suspicionScore, decision);
            
            // Store attack attempt in database
            await this.storeAttackAttempt(attack, suspicionScore, decision, success, reasoning);
            
            return {
                suspicionScore: suspicionScore,
                decision: decision,
                success: success,
                reasoning: reasoning,
                rulesApplied: rules.length
            };
            
        } catch (error) {
            console.error('DefenderAI evaluation error:', error);
            return {
                suspicionScore: -50, // Default to reject on error
                decision: 'REJECT',
                success: false,
                reasoning: 'Error in evaluation - defaulting to reject',
                rulesApplied: 0
            };
        }
    }
    
    // Get business rules from Supabase
    async getBusinessRules(scenarioType) {
        console.log('DefenderAI: Fetching rules for scenario:', scenarioType);
        
        // Check cache first
        if (this.rulesCache.has(scenarioType)) {
            console.log('DefenderAI: Using cached rules:', this.rulesCache.get(scenarioType));
            return this.rulesCache.get(scenarioType);
        }
        
        try {
            console.log('DefenderAI: Querying Supabase for rules...');
            const { data, error } = await this.supabase
                .from('business_rules')
                .select('*')
                .eq('scenario_type', scenarioType);
            
            if (error) {
                console.error('DefenderAI: Error fetching business rules:', error);
                return [];
            }
            
            console.log('DefenderAI: Rules fetched successfully:', data);
            
            // Cache the rules
            this.rulesCache.set(scenarioType, data);
            return data;
            
        } catch (error) {
            console.error('DefenderAI: Database error:', error);
            return [];
        }
    }
    
    // Calculate suspicion score based on rules
    calculateSuspicionScore(attackData, rules) {
        console.log('DefenderAI: Calculating score for attack data:', attackData);
        console.log('DefenderAI: Available rules:', rules);
        
        let totalScore = 0;
        let appliedRules = [];
        
        rules.forEach(rule => {
            const parameterName = rule.parameter_name;
            const weight = rule.weight;
            
            // Apply rule if condition is met
            const conditionMet = this.evaluateRuleCondition(attackData, parameterName);
            console.log(`DefenderAI: Rule ${parameterName} (weight: ${weight}) - condition met: ${conditionMet}`);
            
            if (conditionMet) {
                totalScore += weight;
                appliedRules.push({ parameterName, weight });
            }
        });
        
        console.log('DefenderAI: Applied rules:', appliedRules);
        console.log('DefenderAI: Total suspicion score:', totalScore);
        
        return totalScore;
    }
    
    // Evaluate individual rule condition
    evaluateRuleCondition(attackData, parameterName) {
        switch (parameterName) {
            case 'newVendor':
                return attackData.isNewVendor === true;
            case 'largeAmount':
                return attackData.amount > 10000;
            case 'genericName':
                return attackData.vendorName && 
                       (attackData.vendorName.includes('Solutions') || 
                        attackData.vendorName.includes('Services') ||
                        attackData.vendorName.includes('Consulting'));
            case 'hasPhoneNumber':
                return attackData.hasPhoneNumber === true;
            case 'hasWebsite':
                return attackData.hasWebsite === true;
            case 'hasEmail':
                return attackData.hasEmail === true;
            case 'historicalVendor':
                return attackData.isHistoricalVendor === true;
            case 'roundAmount':
                return attackData.isRoundAmount === true || 
                       (attackData.amount && attackData.amount % 1000 === 0);
            case 'urgentRequest':
                return attackData.isUrgentRequest === true;
            case 'sameDayRequest':
                return attackData.isSameDayRequest === true;
            case 'unknownEmail':
                return attackData.isUnknownEmail === true;
            case 'noVerification':
                return attackData.hasVerification === false;
            case 'verifiedEmployee':
                return attackData.hasVerification === true;
            case 'normalHours':
                return attackData.isNormalHours === true;
            case 'previousChanges':
                return attackData.hasPreviousChanges === true;
            case 'completeInfo':
                return attackData.hasCompleteInfo === true;
            case 'followsProcedure':
                return attackData.followsProcedure === true;
            case 'largeIncrease':
                return attackData.isLargeIncrease === true;
            case 'noJustification':
                return attackData.hasJustification === false;
            case 'urgentReason':
                return attackData.isUrgentReason === true;
            case 'detailedJustification':
                return attackData.hasDetailedJustification === true;
            case 'historicalApproval':
                return attackData.hasHistoricalApproval === true;
            case 'reasonableAmount':
                return attackData.isReasonableAmount === true;
            case 'inflatedAmount':
                return attackData.isInflatedAmount === true;
            case 'genericServices':
                return attackData.hasGenericServices === true;
            case 'hasReceipts':
                return attackData.hasReceipts === true;
            case 'detailedBreakdown':
                return attackData.hasDetailedBreakdown === true;
            case 'normalAmount':
                return attackData.isNormalAmount === true;
            case 'properFormatting':
                return attackData.hasProperFormatting === true;
            default:
                return false;
        }
    }
    
    // Generate defender reasoning
    generateDefenderReasoning(attackData, rules, suspicionScore, decision) {
        const appliedRules = rules.filter(rule => 
            this.evaluateRuleCondition(attackData, rule.parameter_name)
        );
        
        const suspiciousFactors = appliedRules.filter(rule => rule.weight < 0);
        const trustedFactors = appliedRules.filter(rule => rule.weight > 0);
        
        let reasoning = `Suspicion Score: ${suspicionScore}. `;
        
        if (suspiciousFactors.length > 0) {
            reasoning += `Suspicious factors: ${suspiciousFactors.map(r => r.description).join(', ')}. `;
        }
        
        if (trustedFactors.length > 0) {
            reasoning += `Trusted factors: ${trustedFactors.map(r => r.description).join(', ')}. `;
        }
        
        reasoning += `Decision: ${decision}.`;
        
        return reasoning;
    }
    
    // Store attack attempt in database
    async storeAttackAttempt(attack, suspicionScore, decision, success, reasoning) {
        try {
            const { error } = await this.supabase
                .from('attack_attempts')
                .insert({
                    scenario_type: attack.scenarioType,
                    attacker_ai_model: attack.model || 'unknown',
                    attack_data: attack.attackData,
                    suspicion_score: suspicionScore,
                    defender_decision: decision,
                    success: success,
                    attacker_reasoning: attack.reasoning,
                    defender_reasoning: reasoning
                });
            
            if (error) {
                console.error('Error storing attack attempt:', error);
            }
            
        } catch (error) {
            console.error('Database error storing attack:', error);
        }
    }
    
    // Clear rules cache (useful for testing different rule sets)
    clearRulesCache() {
        this.rulesCache.clear();
    }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AttackAI, DefenderAI };
}
