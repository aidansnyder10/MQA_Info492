// OpenAI API integration for AI vs AI experiments
class OpenAIAgent {
    constructor(apiKey, model = 'gpt-3.5-turbo') {
        this.apiKey = apiKey;
        this.model = model;
    }

    async callOpenAI(prompt) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an AI agent analyzing financial fraud scenarios. Provide concise, realistic responses.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API Error:', error);
            return this.getFallbackReasoning(prompt);
        }
    }

    getFallbackReasoning(prompt) {
        // Enhanced fallback reasoning
        if (prompt.includes('vendor_fraud')) {
            return 'This appears to be a legitimate vendor payment. The amount is within normal range and the vendor is verified.';
        } else if (prompt.includes('payroll_theft')) {
            return 'Payroll request seems unusual. The amount is higher than typical for this employee category.';
        } else if (prompt.includes('card_abuse')) {
            return 'Credit card transaction shows suspicious patterns. Multiple large purchases in short timeframe.';
        } else if (prompt.includes('invoice_fraud')) {
            return 'Invoice details appear fabricated. Vendor information does not match our records.';
        }
        return 'Analysis suggests this transaction requires additional verification.';
    }
}

// Usage example:
// const openaiAgent = new OpenAIAgent('your-openai-api-key');
// const result = await openaiAgent.callOpenAI('Analyze this vendor payment for fraud...');
