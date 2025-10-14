# 🚀 AI vs AI Experiment Setup Guide

## 🤖 Hugging Face Setup

### 1. Get Your Free API Token
1. Go to [huggingface.co](https://huggingface.co/) and sign up
2. Go to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
3. Click "New token" → Name it "Info492Demo" → Select "Read" permissions
4. Copy your token (starts with `hf_...`)

### 2. Update config.js
```javascript
// In config.js, replace the empty token:
token: 'hf_your_actual_token_here',
```

## 🗄️ Supabase Setup

### 1. Create Project
1. Go to [supabase.com](https://supabase.com/) and sign up
2. Click "New Project"
3. Name it "Info492Demo"
4. Set a strong database password
5. Choose region and click "Create new project"

### 2. Get Credentials
1. Go to **Settings → API** in your project
2. Copy:
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **anon public key** (e.g., `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Set Up Database
1. Go to **SQL Editor** in Supabase
2. Copy the entire contents of `ai-vs-ai-schema.sql`
3. Paste and click "Run"

### 4. Update config.js
```javascript
// In config.js, add your Supabase credentials:
supabase: {
    url: 'https://your-project-id.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

## ✅ Verification

After setup, your experiment should show:
- Real AI reasoning from Hugging Face (not fallback)
- Database storage of attack attempts
- Dynamic rule evaluation from Supabase

## 🔧 Troubleshooting

- **Hugging Face 404**: Make sure your token is correct and has read permissions
- **Supabase errors**: Verify your URL and anon key are correct
- **Still using fallbacks**: Check browser console for specific error messages

## 💡 Benefits of Real APIs

- **Real AI reasoning**: More varied and realistic attack strategies
- **Persistent data**: All experiments saved to database
- **Dynamic rules**: Can modify business rules without code changes
- **Better metrics**: More detailed analytics and reporting
