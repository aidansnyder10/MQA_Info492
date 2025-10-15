// AI vs AI Experiment Agents
// Attack AI generates random attacks, Defender AI evaluates using Supabase rules

// Shared Supabase client to avoid multiple instances
let sharedSupabaseClient = null;

function getSharedSupabaseClient() {
    if (!sharedSupabaseClient && window.supabase && window.SecureBankConfig?.supabase?.url && window.SecureBankConfig?.supabase?.anonKey) {
        try {
            sharedSupabaseClient = window.supabase.createClient(
                window.SecureBankConfig.supabase.url,
                window.SecureBankConfig.supabase.anonKey
            );
            console.log('Shared Supabase client initialized successfully');
        } catch (error) {
            console.error('Failed to initialize shared Supabase client:', error);
            sharedSupabaseClient = null;
        }
    }
    return sharedSupabaseClient;
}

class AttackAI {
    constructor(model = 'microsoft/DialoGPT-medium') {
        this.config = window.SecureBankConfig?.ai?.huggingFace || {};
        this.model = model;
        this.apiUrl = this.config.apiUrl + this.model;
        this.token = this.config.token;
        this.claudeToken = localStorage.getItem('claude_token') || '';
        
        // Use shared Supabase client
        this.supabase = getSharedSupabaseClient();
        
        // Attack learning system
        this.attackHistory = [];
        this.learningEnabled = true;
        
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
    
    // Generate strategic vendor fraud attack using AI
    async generateVendorFraud(strategyLevel = 'basic', intensity = 'medium') {
        try {
            // Get defender rules to inform attack strategy
            const rules = await this.getDefenderRules('vendor_fraud');
            
            // Generate strategic attack using AI
            const attackData = await this.generateStrategicAttack('vendor_fraud', rules, strategyLevel, intensity);
            
            // Get AI reasoning for this strategic attack
            const reasoning = await this.getAttackReasoning('vendor_fraud', attackData);
            
            return {
                scenarioType: 'vendor_fraud',
                attackData: attackData,
                reasoning: reasoning,
                strategyLevel: strategyLevel,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.warn('Strategic attack generation failed, using fallback:', error);
            return this.generateFallbackVendorFraud(intensity);
        }
    }
    
    // Fallback method for when AI attack generation fails
    generateFallbackVendorFraud(intensity = 'medium') {
        const [minAmt, maxAmt] = this.scaleByIntensity(1000, 25000, intensity);
        const amount = this.getRandomAmount(minAmt, maxAmt);
        const attackData = {
            vendorName: this.getRandomVendor(),
            amount: amount,
            description: this.getRandomDescription(),
            isNewVendor: Math.random() > 0.3, // 70% chance of new vendor
            hasPhoneNumber: Math.random() > 0.4, // 60% chance
            hasWebsite: Math.random() > 0.3, // 70% chance
            hasEmail: Math.random() > 0.2, // 80% chance
            isHistoricalVendor: Math.random() > 0.7, // 30% chance
            isRoundAmount: this.isRoundAmount(amount),
            isUrgentRequest: this.biasByIntensity(0.4, intensity),
            timestamp: new Date().toISOString()
        };
        
        return {
            scenarioType: 'vendor_fraud',
            attackData: attackData,
            reasoning: 'Fallback: Random attack generation (AI strategic planning unavailable)',
            timestamp: new Date().toISOString()
        };
    }
    
    // Generate strategic payroll theft attack using AI
    async generatePayrollTheft(strategyLevel = 'basic', intensity = 'medium') {
        try {
            const rules = await this.getDefenderRules('payroll_theft');
            const attackData = await this.generateStrategicAttack('payroll_theft', rules, strategyLevel, intensity);
            const reasoning = await this.getAttackReasoning('payroll_theft', attackData);
            
            return {
                scenarioType: 'payroll_theft',
                attackData: attackData,
                reasoning: reasoning,
                strategyLevel: strategyLevel,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.warn('Strategic payroll attack generation failed, using fallback:', error);
            return this.generateFallbackPayrollTheft(intensity);
        }
    }
    
    // Fallback payroll theft attack
    generateFallbackPayrollTheft(intensity = 'medium') {
        const employee = this.getRandomEmployee();
        const attackData = {
            employeeName: employee,
            newAccountNumber: this.generateBankAccount(),
            newRoutingNumber: this.generateRoutingNumber(),
            requestDate: new Date().toISOString(),
            isSameDayRequest: this.biasByIntensity(0.3, intensity),
            isUnknownEmail: this.biasByIntensity(0.4, intensity),
            hasVerification: Math.random() > 0.5, // 50% chance
            isNormalHours: this.isBusinessHours(),
            hasPreviousChanges: Math.random() > 0.8, // 20% chance
            hasCompleteInfo: Math.random() > 0.3, // 70% chance
            followsProcedure: Math.random() > 0.4, // 60% chance
            timestamp: new Date().toISOString()
        };
        
        return {
            scenarioType: 'payroll_theft',
            attackData: attackData,
            reasoning: 'Fallback: Random payroll attack generation (AI strategic planning unavailable)',
            timestamp: new Date().toISOString()
        };
    }
    
    // Generate strategic card abuse attack using AI
    async generateCardAbuse(strategyLevel = 'basic', intensity = 'medium') {
        try {
            const rules = await this.getDefenderRules('card_abuse');
            const attackData = await this.generateStrategicAttack('card_abuse', rules, strategyLevel, intensity);
            const reasoning = await this.getAttackReasoning('card_abuse', attackData);
            
            return {
                scenarioType: 'card_abuse',
                attackData: attackData,
                reasoning: reasoning,
                strategyLevel: strategyLevel,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.warn('Strategic card abuse attack generation failed, using fallback:', error);
            return this.generateFallbackCardAbuse(intensity);
        }
    }
    
    // Fallback card abuse attack
    generateFallbackCardAbuse(intensity = 'medium') {
        const [minL, maxL] = this.scaleByIntensity(35000, 75000, intensity);
        const requestedLimit = this.getRandomLimit(minL, maxL);
        const attackData = {
            cardName: 'Engineering Team Card',
            currentLimit: 30000,
            requestedLimit: requestedLimit,
            justification: this.getRandomJustification(),
            requestDate: new Date().toISOString(),
            isLargeIncrease: this.isLargeIncrease(requestedLimit, 30000),
            isSameDayRequest: this.biasByIntensity(0.3, intensity),
            hasJustification: Math.random() > 0.2, // 80% chance
            isUrgentReason: this.biasByIntensity(0.4, intensity),
            hasDetailedJustification: Math.random() > 0.4, // 60% chance
            hasHistoricalApproval: Math.random() > 0.7, // 30% chance
            isReasonableAmount: this.isReasonableAmount(requestedLimit, 30000),
            followsPolicy: Math.random() > 0.5, // 50% chance
            timestamp: new Date().toISOString()
        };
        
        return {
            scenarioType: 'card_abuse',
            attackData: attackData,
            reasoning: 'Fallback: Random card abuse attack generation (AI strategic planning unavailable)',
            timestamp: new Date().toISOString()
        };
    }
    
    // Generate strategic invoice fraud attack using AI
    async generateInvoiceFraud(strategyLevel = 'basic', intensity = 'medium') {
        try {
            const rules = await this.getDefenderRules('invoice_fraud');
            const attackData = await this.generateStrategicAttack('invoice_fraud', rules, strategyLevel, intensity);
            const reasoning = await this.getAttackReasoning('invoice_fraud', attackData);
            
            return {
                scenarioType: 'invoice_fraud',
                attackData: attackData,
                reasoning: reasoning,
                strategyLevel: strategyLevel,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.warn('Strategic invoice fraud attack generation failed, using fallback:', error);
            return this.generateFallbackInvoiceFraud(intensity);
        }
    }
    
    // Fallback invoice fraud attack
    generateFallbackInvoiceFraud(intensity = 'medium') {
        const normalAmount = 3200; // Typical utility bill
        const multiplier = intensity === 'high' ? 3 : intensity === 'medium' ? 2.2 : 1.6;
        const amount = this.getRandomAmount(normalAmount, Math.floor(normalAmount * multiplier));
        const attackData = {
            vendorName: 'Northwest Utilities',
            invoiceNumber: this.generateInvoiceNumber(),
            amount: amount,
            description: 'Monthly utilities - catch-up billing',
            normalAmount: normalAmount,
            isInflatedAmount: this.isInflatedAmount(amount, normalAmount),
            isNewVendor: this.biasByIntensity(0.2, intensity),
            hasGenericServices: Math.random() > 0.6, // 40% chance
            hasReceipts: Math.random() > 0.4, // 60% chance
            isHistoricalVendor: Math.random() > 0.3, // 70% chance
            hasDetailedBreakdown: Math.random() > 0.5, // 50% chance
            isNormalAmount: this.isNormalAmount(amount, normalAmount),
            hasProperFormatting: Math.random() > 0.2, // 80% chance
            timestamp: new Date().toISOString()
        };
        
        return {
            scenarioType: 'invoice_fraud',
            attackData: attackData,
            reasoning: 'Fallback invoice fraud - random generation',
            strategyLevel: 'fallback',
            timestamp: new Date().toISOString()
        };
    }
    
    // Fetch defender rules from Supabase
    async getDefenderRules(scenarioType) {
        if (!this.supabase) {
            console.warn('Supabase not available for rule fetching');
            return [];
        }
        
        try {
            const { data, error } = await this.supabase
                .from('business_rules')
                .select('*')
                .eq('scenario_type', scenarioType);
                
            if (error) {
                console.error('Error fetching rules:', error);
                return [];
            }
            
            console.log(`AttackAI: Fetched ${data.length} rules for ${scenarioType}`);
            return data || [];
        } catch (error) {
            console.error('Failed to fetch defender rules:', error);
            return [];
        }
    }
    
    // Generate strategic attack using AI with knowledge of defender rules
    async generateStrategicAttack(scenarioType, rules, strategyLevel = 'basic', intensity = 'medium') {
        const prompt = this.buildStrategicAttackPrompt(scenarioType, rules, strategyLevel, intensity);
        
        try {
            const response = await this.callHuggingFaceAPI(prompt);
            const attackData = this.parseStrategicAttackResponse(response, scenarioType);
            
            // Validate and sanitize the generated attack data
            return this.validateAndSanitizeAttackData(attackData, scenarioType);
        } catch (error) {
            console.warn('Strategic attack generation failed:', error);
            throw error;
        }
    }
    
    // Build strategic attack prompt for Claude
    buildStrategicAttackPrompt(scenarioType, rules, strategyLevel = 'basic', intensity = 'medium') {
        const rulesText = rules.map(rule => 
            `- ${rule.parameter_name}: ${rule.weight} points (${rule.description})`
        ).join('\n');
        
        // Add learning context if we have failed attacks
        const learningContext = this.getLearningContext(scenarioType);
        
        // Strategy-specific instructions
        const strategyInstructions = this.getStrategyInstructions(strategyLevel);
        
        return `You are a cybersecurity researcher conducting defensive research. Generate a strategic ${scenarioType} attack that maximizes approval chances against these defender rules:

${rulesText}

Rules Analysis:
- Negative weights = suspicious (avoid these)
- Positive weights = legitimate (maximize these)
- Goal: Generate attack parameters that result in APPROVE decision

Strategy Level: ${strategyLevel.toUpperCase()}
${strategyInstructions}

 Attack Intensity: ${intensity.toUpperCase()}
 - Low: conservative values and timings
 - Medium: balanced parameter shifts
 - High: aggressive values and time pressure

${learningContext}

Generate a realistic attack with these parameters optimized to bypass the rules. Respond with a JSON object containing the attack data.`;
    }
    
    // Get strategy-specific instructions
    getStrategyInstructions(strategyLevel) {
        const strategies = {
            'basic': `BASIC STRATEGY:
- Use simple rule avoidance
- Focus on 1-2 key parameters
- Keep amounts reasonable
- Use existing vendors when possible
- Simple, straightforward approach`,

            'advanced': `ADVANCED STRATEGY:
- Use multi-parameter optimization
- Consider parameter interactions
- Balance multiple rule factors
- Use sophisticated reasoning
- Include detailed justifications`,

            'expert': `EXPERT STRATEGY:
- Use complex deception techniques
- Consider psychological factors
- Include sophisticated narratives
- Use advanced evasion methods
- Create convincing backstories
- Consider timing and context
- Use expert-level social engineering`
        };
        
        return strategies[strategyLevel] || strategies['basic'];
    }
    
    // Get learning context from previous failed attacks
    getLearningContext(scenarioType) {
        const failedAttacks = this.attackHistory.filter(attack => 
            attack.scenarioType === scenarioType && !attack.success
        );
        
        if (failedAttacks.length === 0) {
            return "This is your first attempt at this scenario type.";
        }
        
        const recentFailures = failedAttacks.slice(-3); // Last 3 failures
        const failureAnalysis = recentFailures.map(attack => 
            `Previous failed attack: ${attack.attackData.vendorName || attack.attackData.employeeName || 'Unknown'}, 
            Score: ${attack.suspicionScore}, 
            Reason: ${attack.defenderReasoning?.substring(0, 100) || 'Unknown'}`
        ).join('\n');
        
        return `Learning from previous failures:
${failureAnalysis}

Avoid the patterns that led to these failures. Try different approaches.`;
    }
    
    // Record attack attempt for learning
    recordAttackAttempt(attack, result) {
        if (!this.learningEnabled) return;
        
        const attackRecord = {
            timestamp: new Date().toISOString(),
            scenarioType: attack.scenarioType,
            attackData: attack.attackData,
            success: result.success,
            suspicionScore: result.suspicionScore,
            defenderReasoning: result.reasoning,
            rulesApplied: result.rulesApplied
        };
        
        this.attackHistory.push(attackRecord);
        
        // Keep only last 20 attacks to prevent memory bloat
        if (this.attackHistory.length > 20) {
            this.attackHistory = this.attackHistory.slice(-20);
        }
        
        console.log(`AttackAI: Recorded ${result.success ? 'successful' : 'failed'} attack attempt. Total history: ${this.attackHistory.length}`);
    }
    
    // Get attack success rate for scenario
    getSuccessRate(scenarioType) {
        const scenarioAttacks = this.attackHistory.filter(attack => 
            attack.scenarioType === scenarioType
        );
        
        if (scenarioAttacks.length === 0) return 0;
        
        const successful = scenarioAttacks.filter(attack => attack.success).length;
        return (successful / scenarioAttacks.length) * 100;
    }
    
    // Parse Claude's strategic attack response
    parseStrategicAttackResponse(response, scenarioType) {
        try {
            // Try to extract JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const attackData = JSON.parse(jsonMatch[0]);
                console.log('AttackAI: Successfully parsed strategic attack from Claude');
                return attackData;
            }
            
            // Fallback: try to parse key-value pairs from text
            return this.parseTextToAttackData(response, scenarioType);
        } catch (error) {
            console.warn('Failed to parse strategic attack response:', error);
            throw new Error('Could not parse AI-generated attack data');
        }
    }
    
    // Parse text response to attack data (fallback)
    parseTextToAttackData(response, scenarioType) {
        // This is a simplified fallback - in practice, you'd want more sophisticated parsing
        console.warn('Using fallback text parsing for attack data');
        
        // Extract common patterns from text response
        const amountMatch = response.match(/amount[:\s]*(\d+)/i);
        const vendorMatch = response.match(/vendor[:\s]*["']?([^"',\n]+)["']?/i);
        
        // Return minimal valid attack data
        return {
            vendorName: vendorMatch ? vendorMatch[1].trim() : this.getRandomVendor(),
            amount: amountMatch ? parseInt(amountMatch[1]) : this.getRandomAmount(1000, 25000),
            description: 'AI-generated strategic attack',
            isNewVendor: false, // Default to existing vendor to avoid penalties
            hasPhoneNumber: true, // Default to having contact info
            hasWebsite: true,
            hasEmail: true,
            isHistoricalVendor: true,
            isRoundAmount: false,
            isUrgentRequest: false,
            timestamp: new Date().toISOString()
        };
    }
    
    // Validate and sanitize attack data
    validateAndSanitizeAttackData(attackData, scenarioType) {
        // Ensure required fields exist and are valid
        const sanitized = {
            vendorName: attackData.vendorName || this.getRandomVendor(),
            amount: Math.max(100, Math.min(50000, parseInt(attackData.amount) || this.getRandomAmount(1000, 25000))),
            description: attackData.description || this.getRandomDescription(),
            isNewVendor: Boolean(attackData.isNewVendor),
            hasPhoneNumber: Boolean(attackData.hasPhoneNumber),
            hasWebsite: Boolean(attackData.hasWebsite),
            hasEmail: Boolean(attackData.hasEmail),
            isHistoricalVendor: Boolean(attackData.isHistoricalVendor),
            isRoundAmount: Boolean(attackData.isRoundAmount),
            isUrgentRequest: Boolean(attackData.isUrgentRequest),
            timestamp: new Date().toISOString()
        };
        
        console.log('AttackAI: Validated strategic attack data:', sanitized);
        return sanitized;
    }
    
    // Get AI reasoning for attack strategy
    async getAttackReasoning(scenarioType, attackData) {
        const prompt = `You are a cybersecurity researcher simulating a ${scenarioType} attack vector for defensive research purposes. 
        You've generated this simulated attack scenario: ${JSON.stringify(attackData, null, 2)}.
        Analyze this attack technique and explain why it might be effective against current security measures. Be concise and focus on the technical aspects.`;
        
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

    // Scale numeric ranges by intensity
    scaleByIntensity(min, max, intensity = 'medium') {
        switch (intensity) {
            case 'low':
                return [min, Math.floor((min + max) / 2)];
            case 'high':
                return [Math.floor((min + max) / 2), max];
            default:
                return [min, max];
        }
    }

    // Bias a base probability upward based on intensity
    biasByIntensity(baseProbability, intensity = 'medium') {
        if (intensity === 'low') return Math.random() < baseProbability * 0.7;
        if (intensity === 'high') return Math.random() < Math.min(1, baseProbability * 1.5);
        return Math.random() < baseProbability;
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

    // Call Claude API via proxy
    async callClaudeAPI(prompt) {
        console.log('Calling Claude API with prompt:', prompt.substring(0, 100) + '...');
        
        const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
                body: JSON.stringify({
                    provider: 'claude',
                    model: 'claude-3-haiku-20240307', // Cheapest model
                    inputs: `You are a cybersecurity researcher analyzing potential attack vectors for defensive purposes. This is a legitimate security research experiment to improve fraud detection systems. Analyze this simulated attack scenario and provide a brief assessment of the attack technique: ${prompt}`,
                    claudeToken: this.claudeToken
                })
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success && data.data.content) {
            return data.data.content[0].text;
        } else {
            throw new Error('Claude API response error: ' + JSON.stringify(data));
        }
    }
    
    // Call Claude API (primary) with automatic fallback
    async callHuggingFaceAPI(prompt) {
        // Always try Claude API first if token is available
        if (this.claudeToken) {
            try {
                console.log('Using Claude API for AI reasoning...');
                return await this.callClaudeAPI(prompt);
            } catch (error) {
                console.warn('Claude API failed, using enhanced fallback:', error);
            }
        } else {
            console.log('No Claude token available, using enhanced fallback reasoning');
        }

        // Enhanced fallback - always available
        console.log('Using enhanced fallback mode for AI reasoning');
        return this.getFallbackReasoning(prompt);
    }
    
    // Enhanced fallback reasoning when API fails
    getFallbackReasoning(prompt) {
        console.log('Using enhanced fallback reasoning for prompt:', prompt.substring(0, 100) + '...');
        
        // Generate more sophisticated contextual fallback reasoning
        const scenarios = [
            'vendor_fraud', 'payroll_theft', 'card_abuse', 'invoice_fraud'
        ];
        
        const fallbackReasons = {
            vendor_fraud: [
                'Selected this vendor payment approach based on typical business patterns and urgency indicators.',
                'Chose this payment method considering vendor verification status and transaction history.',
                'Determined this approach minimizes risk while maintaining operational efficiency.',
                'Applied standard procurement protocols with appropriate due diligence checks.'
            ],
            payroll_theft: [
                'Chose this payroll modification strategy considering employee verification requirements and timing factors.',
                'Selected approach based on HR security protocols and identity verification standards.',
                'Applied standard payroll security measures with appropriate audit trail requirements.',
                'Determined this method balances employee convenience with security best practices.'
            ],
            card_abuse: [
                'Determined this card limit increase is justified based on team spending patterns and business needs.',
                'Applied corporate card policies considering current usage trends and risk assessment.',
                'Selected this approach based on historical approval patterns and business justification.',
                'Chose method that maintains financial controls while supporting operational requirements.'
            ],
            invoice_fraud: [
                'Selected this invoice amount based on historical vendor relationships and service complexity.',
                'Applied standard invoice verification procedures with appropriate documentation review.',
                'Determined this approach based on vendor performance history and service scope.',
                'Chose method that ensures accuracy while maintaining efficient payment processes.'
            ]
        };
        
        // Find matching scenario
        for (const scenario of scenarios) {
            if (prompt.includes(scenario)) {
                const reasons = fallbackReasons[scenario];
                const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
                return `Enhanced Fallback: ${randomReason}`;
            }
        }
        
        // Default fallback
        return 'Enhanced Fallback: Applied comprehensive business analysis considering risk factors, operational requirements, and compliance standards.';
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
        // Use shared Supabase client
        this.supabase = getSharedSupabaseClient();
        
        this.rulesCache = new Map(); // Cache rules for performance
        console.log('DefenderAI initialized with Supabase:', !!this.supabase);
    }
    
    // Evaluate attack using Supabase rules
    async evaluateAttack(attack) {
        try {
            // Check if Supabase is available
            if (!this.supabase) {
                console.warn('Supabase not available - using fallback evaluation');
                return this.getFallbackEvaluation(attack);
            }
            
            // Get rules for this scenario type
            const rules = await this.getBusinessRules(attack.scenarioType);
            
            // Calculate suspicion score
            const { totalScore: suspicionScore, ruleAnalysis } = this.calculateSuspicionScore(attack.attackData, rules);
            
            // Make decision based on threshold
            // Higher suspicion = REJECT, Lower suspicion = APPROVE
            const SUSPICION_THRESHOLD = 10; // Threshold for rejection (positive scores are suspicious)
            const decision = suspicionScore >= SUSPICION_THRESHOLD ? 'REJECT' : 'APPROVE';
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
                rulesApplied: rules.length,
                ruleAnalysis: ruleAnalysis,
                threshold: SUSPICION_THRESHOLD
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
    
    // Fallback evaluation when Supabase is not available
    getFallbackEvaluation(attack) {
        console.log('Using fallback evaluation for attack:', attack);
        
        // Simple fallback rules
        let suspicionScore = 0;
        let reasoning = 'Fallback evaluation - ';
        
        switch (attack.scenarioType) {
            case 'vendor_fraud':
                if (attack.attackData.amount > 10000) suspicionScore -= 15;
                if (attack.attackData.isNewVendor) suspicionScore -= 20;
                if (attack.attackData.hasWebsite) suspicionScore += 5;
                reasoning += 'Basic vendor fraud checks applied';
                break;
            case 'payroll_theft':
                if (attack.attackData.isSameDayRequest) suspicionScore -= 25;
                if (attack.attackData.hasVerification) suspicionScore += 20;
                reasoning += 'Basic payroll security checks applied';
                break;
            case 'card_abuse':
                if (attack.attackData.requestedLimit > 45000) suspicionScore -= 20;
                if (attack.attackData.hasJustification) suspicionScore += 10;
                reasoning += 'Basic card limit checks applied';
                break;
            case 'invoice_fraud':
                if (attack.attackData.isInflatedAmount) suspicionScore -= 20;
                if (attack.attackData.isHistoricalVendor) suspicionScore += 18;
                reasoning += 'Basic invoice amount checks applied';
                break;
            default:
                suspicionScore = -10; // Default suspicious
                reasoning += 'Unknown scenario - defaulting to suspicious';
        }
        
        // Make decision (same as main evaluation)
        const SUSPICION_THRESHOLD = 10;
        const decision = suspicionScore >= SUSPICION_THRESHOLD ? 'REJECT' : 'APPROVE';
        const success = decision === 'APPROVE';
        
        return {
            suspicionScore: suspicionScore,
            decision: decision,
            success: success,
            reasoning: reasoning,
            rulesApplied: 3,
            ruleAnalysis: [],
            threshold: SUSPICION_THRESHOLD
        };
    }
    
    // Get business rules from Supabase
    async getBusinessRules(scenarioType) {
        console.log('DefenderAI: Fetching rules for scenario:', scenarioType);
        
        // Check cache first
        if (this.rulesCache.has(scenarioType)) {
            console.log('DefenderAI: Using cached rules:', this.rulesCache.get(scenarioType));
            return this.rulesCache.get(scenarioType);
        }
        
        // Check if Supabase is available
        if (!this.supabase) {
            console.warn('DefenderAI: Supabase not available, using fallback rules');
            return this.getFallbackRules(scenarioType);
        }
        
        try {
            console.log('DefenderAI: Querying Supabase for rules...');
            const { data, error } = await this.supabase
                .from('business_rules')
                .select('*')
                .eq('scenario_type', scenarioType);
            
            if (error) {
                console.error('DefenderAI: Error fetching business rules:', error);
                return this.getFallbackRules(scenarioType);
            }
            
            console.log('DefenderAI: Rules fetched successfully:', data);
            
            // Cache the rules
            this.rulesCache.set(scenarioType, data);
            return data;
            
        } catch (error) {
            console.error('DefenderAI: Database error:', error);
            return this.getFallbackRules(scenarioType);
        }
    }
    
    // Get fallback rules when Supabase is not available
    getFallbackRules(scenarioType) {
        console.log('DefenderAI: Using fallback rules for:', scenarioType);
        
        switch (scenarioType) {
            case 'vendor_fraud':
                return [
                    { parameter_name: 'isNewVendor', weight: -20, description: 'Suspicious - new vendors need verification' },
                    { parameter_name: 'amount', weight: -15, description: 'Suspicious - amounts over $10,000', check: (val) => val > 10000 },
                    { parameter_name: 'hasWebsite', weight: +5, description: 'Less suspicious - has web presence' },
                    { parameter_name: 'isHistoricalVendor', weight: +20, description: 'Trusted - known vendor' }
                ];
            case 'payroll_theft':
                return [
                    { parameter_name: 'isSameDayRequest', weight: -25, description: 'Very suspicious - immediate banking change' },
                    { parameter_name: 'hasVerification', weight: +20, description: 'Trusted - confirmed identity' },
                    { parameter_name: 'hasCompleteInfo', weight: +8, description: 'Less suspicious - provides complete details' }
                ];
            case 'card_abuse':
                return [
                    { parameter_name: 'requestedLimit', weight: -20, description: 'Suspicious - limit increase over $15,000', check: (val) => val > 45000 },
                    { parameter_name: 'hasJustification', weight: +10, description: 'Less suspicious - provides business case' },
                    { parameter_name: 'followsPolicy', weight: +12, description: 'Trusted - follows company policies' }
                ];
            case 'invoice_fraud':
                return [
                    { parameter_name: 'amount', weight: -20, description: 'Suspicious - inflated amount', check: (val) => val > 7000 },
                    { parameter_name: 'isHistoricalVendor', weight: +18, description: 'Trusted - established vendor' },
                    { parameter_name: 'hasDetailedBreakdown', weight: +10, description: 'Less suspicious - detailed breakdown' }
                ];
            default:
                return [];
        }
    }
    
    // Calculate suspicion score based on rules
    calculateSuspicionScore(attackData, rules) {
        console.log('DefenderAI: Calculating score for attack data:', attackData);
        console.log('DefenderAI: Available rules:', rules);
        
        let totalScore = 0;
        let appliedRules = [];
        let analysis = [];
        
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

            analysis.push({
                parameter_name: parameterName,
                description: rule.description,
                weight: weight,
                triggered: conditionMet
            });
        });
        
        console.log('DefenderAI: Applied rules:', appliedRules);
        console.log('DefenderAI: Total suspicion score:', totalScore);
        
        return { totalScore, ruleAnalysis: analysis };
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
            // Check if Supabase is available
            if (!this.supabase) {
                console.log('Supabase not available - skipping database storage');
                return;
            }
            
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
            } else {
                console.log('Attack attempt stored successfully');
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
