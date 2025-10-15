// Anthropic Claude API integration
class ClaudeAgent {
    constructor(apiKey, model = 'claude-3-haiku-20240307') {
        this.apiKey = apiKey;
        this.model = model;
    }

    async callClaude(prompt) {
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': this.apiKey,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: this.model,
                    max_tokens: 150,
                    messages: [
                        {
                            role: 'user',
                            content: `You are analyzing financial fraud scenarios. Provide a concise assessment: ${prompt}`
                        }
                    ]
                })
            });

            const data = await response.json();
            return data.content[0].text;
        } catch (error) {
            console.error('Claude API Error:', error);
            return this.getFallbackReasoning(prompt);
        }
    }

    getFallbackReasoning(prompt) {
        // Same fallback logic as OpenAI
        if (prompt.includes('vendor_fraud')) {
            return 'Vendor payment appears legitimate based on standard verification procedures.';
        } else if (prompt.includes('payroll_theft')) {
            return 'Payroll anomaly detected - amount exceeds normal range for this employee.';
        }
        return 'Transaction requires additional manual review.';
    }
}
