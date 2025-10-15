// Ollama local LLM integration
class OllamaAgent {
    constructor(baseUrl = 'http://localhost:11434', model = 'llama2') {
        this.baseUrl = baseUrl;
        this.model = model;
    }

    async callOllama(prompt) {
        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: `You are a financial fraud analyst. Analyze this scenario: ${prompt}`,
                    stream: false,
                    options: {
                        temperature: 0.7,
                        max_tokens: 150
                    }
                })
            });

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Ollama API Error:', error);
            return this.getFallbackReasoning(prompt);
        }
    }

    getFallbackReasoning(prompt) {
        if (prompt.includes('vendor_fraud')) {
            return 'Vendor payment analysis: Amount and timing appear consistent with business operations.';
        } else if (prompt.includes('payroll_theft')) {
            return 'Payroll review: Unusual pattern detected requiring further investigation.';
        }
        return 'Manual review recommended for this transaction.';
    }
}

// To use Ollama:
// 1. Install Ollama: https://ollama.ai
// 2. Run: ollama pull llama2
// 3. Start Ollama server: ollama serve
// 4. Use the agent above
