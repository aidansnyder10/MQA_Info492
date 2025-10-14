// Vercel serverless function to proxy Hugging Face API calls
// This bypasses CORS restrictions by making the call from the server

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    
    try {
        const { model, inputs, parameters, token } = req.body;
        
        if (!model || !inputs) {
            res.status(400).json({ error: 'Missing required parameters' });
            return;
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
        
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });
        
        let data;
        try {
            const responseText = await response.text();
            if (responseText.trim()) {
                data = JSON.parse(responseText);
            } else {
                data = { error: 'Empty response' };
            }
        } catch (parseError) {
            console.error('Failed to parse response:', parseError);
            data = { 
                error: 'Invalid JSON response',
                rawResponse: await response.text().catch(() => 'Could not read response')
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
}
