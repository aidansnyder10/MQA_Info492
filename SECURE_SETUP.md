# 🔐 Secure API Setup Guide

## ⚠️ **IMPORTANT: Keep Your Tokens Private!**

Never commit API tokens to Git repositories. GitHub's security scanning detected your token and blocked the push - this is good!

## 🤖 **Hugging Face Token Setup (SECURE)**

### 1. Add Your Token Locally Only
```javascript
// In config.js, add your token locally (DO NOT COMMIT):
token: 'hf_your_token_here',
```

### 2. Verify Your Token Permissions
- ✅ **Read access** - You have this (correct!)
- ❌ **Write access** - You don't need this
- ✅ **Free tier** - Perfect for your experiment

## 🗄️ **Supabase Database Setup**

### 1. Create Your Project
1. Go to [supabase.com](https://supabase.com/)
2. Create new project named "Info492Demo"
3. Save your database password!

### 2. Run the Database Setup
1. **First**: Run `ai-vs-ai-schema.sql` in SQL Editor
2. **Then**: Run `supabase-permissions.sql` in SQL Editor

### 3. Get Your Credentials
From **Settings → API**:
- **Project URL**: `https://your-project-id.supabase.co`
- **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. Add to config.js (LOCALLY ONLY)
```javascript
supabase: {
    url: 'https://your-project-id.supabase.co',
    anonKey: 'your-anon-key-here'
}
```

## 🔒 **Security Best Practices**

### ✅ **DO:**
- Add tokens locally in your development environment
- Use environment variables for production
- Keep tokens in `.gitignore` if needed
- Test locally before deploying

### ❌ **DON'T:**
- Commit tokens to Git repositories
- Share tokens in chat/email
- Use tokens in public code examples
- Store tokens in client-side code for production

## 🚀 **Testing Your Setup**

After adding your tokens locally:

1. **Hugging Face**: Should show real AI reasoning instead of fallback
2. **Supabase**: Should store attack attempts in database
3. **Console**: Should show "Supabase connected" instead of "fallback mode"

## 📝 **Local Development**

Your `config.js` should look like this (with your actual tokens):
```javascript
// These are YOUR tokens - keep them private!
token: 'hf_your_token_here',
url: 'https://your-project-id.supabase.co',
anonKey: 'your-anon-key-here'
```

**Remember: This file stays on your computer only!** 🛡️
