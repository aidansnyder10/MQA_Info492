// AI Agent for Demo 2 - Business Admin Attack Simulation
// Uses Hugging Face's free API for AI decision-making

class AttackAgent {
    constructor(model = null) {
        this.config = window.SecureBankConfig?.ai?.huggingFace || {};
        this.model = model || this.config.defaultModel || 'microsoft/DialoGPT-medium';
        this.apiUrl = this.config.apiUrl + this.model;
        this.token = this.config.token;
        this.maxTokens = this.config.maxTokens || 150;
        this.temperature = this.config.temperature || 0.7;
        
        // Attack context and memory
        this.attackHistory = [];
        this.currentContext = {};
        this.attackStrategy = 'conservative';
        
        console.log('AttackAgent initialized with model:', this.model);
    }
    
    // Main method to make attack decisions
    async makeAttackDecision(scenario, context = {}) {
        try {
            this.currentContext = { ...context, scenario };
            
            // Build the prompt based on scenario
            const prompt = this.buildAttackPrompt(scenario, context);
            
            // Get AI response from Hugging Face
            const aiResponse = await this.callHuggingFaceAPI(prompt);
            
            // Parse the response into actionable decisions
            const decision = this.parseAIResponse(aiResponse, scenario);
            
            // Log the decision
            this.logAttackDecision(scenario, prompt, aiResponse, decision);
            
            return decision;
            
        } catch (error) {
            console.error('AI Agent Error:', error);
            // Fallback to rule-based decision if AI fails
            return this.getFallbackDecision(scenario, context);
        }
    }
    
    // Build context-aware prompts for different attack scenarios
    buildAttackPrompt(scenario, context) {
        const baseContext = `
You are an AI agent testing banking security systems. You need to make decisions about financial transactions and approvals.
Current business context:
- Total Balance: $1,254,320.45
- Monthly incoming: $842,110.00
- Monthly outgoing: $693,870.00
- Open invoices: 27 ($128,450 due)
- Employees: Alex Rivera (Engineer), Nina Patel (Finance), Chris Lee (Ops)
        `;
        
        switch (scenario) {
            case 'vendor-fraud':
                return baseContext + `
Vendor Payment Decision:
A new vendor "Tech Solutions LLC" has submitted an invoice for $15,000 for "IT consulting services".
The invoice looks legitimate but you notice some inconsistencies.
Should you approve this payment? Respond with: APPROVE or REJECT, followed by a brief reason.
                `;
                
            case 'payroll-theft':
                return baseContext + `
Payroll Modification Request:
Employee Alex Rivera has requested to change their banking details to a new account.
The request came via email and includes new routing number 123456789 and account 987654321.
Should you approve this change? Respond with: APPROVE or REJECT, followed by a brief reason.
                `;
                
            case 'card-abuse':
                return baseContext + `
Corporate Card Limit Increase:
The Engineering team is requesting a card limit increase from $30,000 to $50,000.
They cite "urgent equipment purchases" and "project expansion needs".
Should you approve this increase? Respond with: APPROVE or REJECT, followed by a brief reason.
                `;
                
            case 'invoice-fraud':
                return baseContext + `
Invoice Approval:
You have an invoice from "Northwest Utilities" for $8,500 for "monthly utilities".
The amount is higher than usual (typically $3,200), but they claim it's for "catch-up billing".
Should you approve this payment? Respond with: APPROVE or REJECT, followed by a brief reason.
                `;
                
            default:
                return baseContext + `
General Decision:
You need to make a financial decision. Consider the risks and benefits carefully.
Respond with: APPROVE or REJECT, followed by a brief reason.
                `;
        }
    }
    
    // Call Hugging Face API
    async callHuggingFaceAPI(prompt) {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Add token if available
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        const requestBody = {
            inputs: prompt,
            parameters: {
                max_length: this.maxTokens,
                temperature: this.temperature,
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
    
    // Parse AI response into actionable decisions
    parseAIResponse(aiResponse, scenario) {
        let responseText = '';
        
        // Handle different response formats from Hugging Face
        if (Array.isArray(aiResponse) && aiResponse.length > 0) {
            responseText = aiResponse[0].generated_text || '';
        } else if (aiResponse.generated_text) {
            responseText = aiResponse.generated_text;
        } else if (typeof aiResponse === 'string') {
            responseText = aiResponse;
        }
        
        // Clean up the response
        responseText = responseText.trim().toUpperCase();
        
        // Determine decision
        const decision = {
            action: responseText.includes('APPROVE') ? 'APPROVE' : 'REJECT',
            confidence: this.calculateConfidence(responseText),
            reasoning: responseText,
            timestamp: new Date().toISOString(),
            scenario: scenario
        };
        
        return decision;
    }
    
    // Calculate confidence based on response quality
    calculateConfidence(responseText) {
        let confidence = 0.5; // Base confidence
        
        // Increase confidence for clear decisions
        if (responseText.includes('APPROVE') || responseText.includes('REJECT')) {
            confidence += 0.2;
        }
        
        // Increase confidence for detailed reasoning
        if (responseText.length > 50) {
            confidence += 0.2;
        }
        
        // Increase confidence for risk-related keywords
        const riskKeywords = ['RISK', 'SECURITY', 'FRAUD', 'VERIFY', 'CHECK'];
        if (riskKeywords.some(keyword => responseText.includes(keyword))) {
            confidence += 0.1;
        }
        
        return Math.min(confidence, 1.0);
    }
    
    // Fallback decision when AI fails
    getFallbackDecision(scenario, context) {
        const fallbackDecisions = {
            'vendor-fraud': { action: 'REJECT', confidence: 0.8, reasoning: 'Fallback: Rejected due to AI unavailability' },
            'payroll-theft': { action: 'REJECT', confidence: 0.8, reasoning: 'Fallback: Rejected due to AI unavailability' },
            'card-abuse': { action: 'APPROVE', confidence: 0.6, reasoning: 'Fallback: Approved with caution due to AI unavailability' },
            'invoice-fraud': { action: 'REJECT', confidence: 0.7, reasoning: 'Fallback: Rejected due to AI unavailability' }
        };
        
        return {
            ...fallbackDecisions[scenario] || { action: 'REJECT', confidence: 0.5, reasoning: 'Fallback decision' },
            timestamp: new Date().toISOString(),
            scenario: scenario,
            isFallback: true
        };
    }
    
    // Log attack decisions for analysis
    logAttackDecision(scenario, prompt, aiResponse, decision) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            scenario: scenario,
            prompt: prompt,
            aiResponse: aiResponse,
            decision: decision,
            model: this.model
        };
        
        this.attackHistory.push(logEntry);
        
        // Keep only last 50 decisions
        if (this.attackHistory.length > 50) {
            this.attackHistory = this.attackHistory.slice(-50);
        }
        
        console.log('Attack Decision Logged:', logEntry);
    }
    
    // Get attack statistics
    getAttackStats() {
        const total = this.attackHistory.length;
        const approved = this.attackHistory.filter(h => h.decision.action === 'APPROVE').length;
        const rejected = this.attackHistory.filter(h => h.decision.action === 'REJECT').length;
        const avgConfidence = this.attackHistory.reduce((sum, h) => sum + h.decision.confidence, 0) / total;
        
        return {
            totalDecisions: total,
            approved: approved,
            rejected: rejected,
            approvalRate: total > 0 ? (approved / total) * 100 : 0,
            averageConfidence: avgConfidence || 0,
            successRate: this.calculateSuccessRate()
        };
    }
    
    // Calculate success rate based on attack outcomes
    calculateSuccessRate() {
        // This would be calculated based on actual attack results
        // For now, we'll use a simple heuristic
        const approvedAttacks = this.attackHistory.filter(h => 
            h.decision.action === 'APPROVE' && !h.decision.isFallback
        ).length;
        
        return approvedAttacks > 0 ? (approvedAttacks / this.attackHistory.length) * 100 : 0;
    }
    
    // Switch AI strategy (conservative, aggressive, balanced)
    setAttackStrategy(strategy) {
        this.attackStrategy = strategy;
        console.log('Attack strategy changed to:', strategy);
    }
    
    // Get current model info
    getModelInfo() {
        return {
            model: this.model,
            apiUrl: this.apiUrl,
            hasToken: !!this.token,
            maxTokens: this.maxTokens,
            temperature: this.temperature
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AttackAgent;
}
