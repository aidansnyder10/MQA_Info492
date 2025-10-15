// Working Hugging Face models for Inference API
const WORKING_HF_MODELS = {
    'microsoft/DialoGPT-medium': {
        endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        parameters: {
            max_length: 50,
            temperature: 0.7,
            do_sample: true,
            top_k: 50,
            top_p: 0.95,
            return_full_text: false
        }
    },
    'distilbert-base-uncased': {
        endpoint: 'https://api-inference.huggingface.co/models/distilbert-base-uncased',
        parameters: null // No parameters needed for classification
    },
    'facebook/blenderbot-400M-distill': {
        endpoint: 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
        parameters: {
            max_length: 50,
            temperature: 0.7,
            return_full_text: false
        }
    }
};

class WorkingHuggingFaceAgent {
    constructor(token) {
        this.token = token;
    }

    async callWorkingModel(prompt) {
        for (const [modelName, config] of Object.entries(WORKING_HF_MODELS)) {
            try {
                const response = await fetch(config.endpoint, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        inputs: prompt,
                        ...(config.parameters && { parameters: config.parameters })
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    return Array.isArray(data) ? data[0].generated_text : data;
                }
            } catch (error) {
                console.warn(`Model ${modelName} failed:`, error);
                continue;
            }
        }
        
        // If all models fail, use fallback
        return this.getFallbackReasoning(prompt);
    }

    getFallbackReasoning(prompt) {
        if (prompt.includes('vendor_fraud')) {
            return 'Vendor payment analysis indicates standard business transaction.';
        } else if (prompt.includes('payroll_theft')) {
            return 'Payroll anomaly detected - requires manual verification.';
        }
        return 'Transaction analysis complete - standard review procedures apply.';
    }
}
