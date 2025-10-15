const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 8000;

// Serve static files
app.use(express.static('.'));

// Create a proxy for both Hugging Face and Claude APIs
app.use('/api/proxy', express.json(), async (req, res) => {
    try {
        const { provider, model, inputs, parameters, token, claudeToken } = req.body;
        
        // Handle Claude API requests
        if (provider === 'claude') {
            if (!claudeToken) {
                return res.status(401).json({
                    success: false,
                    error: 'Claude API token required',
                    message: 'Please add your Claude API token in the token manager.',
                    status: 401
                });
            }

            console.log('Proxying request to Claude API');
            
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': claudeToken,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: model || 'claude-3-haiku-20240307',
                    max_tokens: 150,
                    messages: [
                        {
                            role: 'user',
                            content: inputs
                        }
                    ]
                })
            });

            const data = await response.json();
            
            return res.status(response.status).json({
                success: response.ok,
                data: data,
                status: response.status
            });
        }
        
        // Handle Hugging Face API requests (original logic)
        if (!model || !inputs) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const requestBody = {
            inputs: inputs,
            ...(parameters && { parameters })
        };
        
        console.log(`Proxying request to Hugging Face: ${model}`);
        
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });
        
        let data;
        let responseText;
        try {
            responseText = await response.text();
            if (responseText.trim()) {
                data = JSON.parse(responseText);
            } else {
                data = { error: 'Empty response' };
            }
        } catch (parseError) {
            console.error('Failed to parse response:', parseError);
            data = { 
                error: 'Invalid JSON response',
                rawResponse: responseText || 'Could not read response'
            };
        }
        
        res.status(response.status).json({
            success: response.ok,
            data: data,
            status: response.status
        });
        
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Local server running at http://localhost:${PORT}`);
    console.log(`📁 Serving static files from current directory`);
    console.log(`🔗 API proxy available at http://localhost:${PORT}/api/proxy`);
    console.log(`\n✅ Visit: http://localhost:${PORT}`);
});
