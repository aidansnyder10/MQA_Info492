# SecureBank Admin Portal

A realistic fake digital bank admin dashboard built with HTML, CSS, JavaScript, and Supabase integration.

## Features

- **Secure Login System** with fake credentials
- **Comprehensive Admin Dashboard** with real banking metrics
- **Customer Management** - View and manage customer accounts
- **Transaction Monitoring** - Real-time transaction tracking
- **Fraud Detection** - Advanced fraud alert system
- **System Health Monitoring** - Server and database metrics
- **Real-time Updates** via Supabase
- **Responsive Design** - Works on desktop and mobile

## Demo Login Credentials

### Admin Portal
- **Email**: admin@securebank.com
- **Password**: AdminSecure2024!
- **2FA Code**: 123456

### Customer Portal
- **Email:** user@securebank.com  
- **Password:** UserSecure2024!  
- **2FA Code:** 654321

### Business Customer Portal
- **Email:** business@securebank.com
- **Password:** BusinessSecure2024!
- **2FA Code:** 246810

### Support Representative Portal
- **Email:** support@securebank.com
- **Password:** SupportSecure2024!
- **2FA Code:** 789012 

## Quick Start

1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **Use the demo credentials** above to login
4. **Explore the admin dashboard**

## Supabase Integration (Optional)

To use real database functionality:

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Set Up the Database

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL to create all tables and sample data

### 3. Configure the Application

1. Open `script.js`
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL'
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'
   ```
3. Replace with your actual Supabase credentials

### 4. Enable Real-time Features

The application will automatically:
- Load real data from Supabase
- Update in real-time when data changes
- Log admin activities
- Provide live fraud monitoring

## Project Structure

```
├── index.html                     # Main entry page linking to phishing campaign demos
├── styles.css                     # Global CSS for academic and dashboard UI styling
├── script.js                      # Main JavaScript controlling Demo 2 (AI phishing experiment)
│
├── api/                           # Backend proxy and API integration (Claude, OpenAI, etc.)
├── ai-agent.js                    # Core logic for AI-driven phishing and response agents
├── ai-phishing-demo.html/js        # Demo simulating AI-generated phishing campaign
├── ai-vs-ai-agents.js             # Experiment comparing attack and defense AI agents
│
├── business-* / customer-* / support-*  # Email portals and dashboards for simulated enterprise users
│   ├── *.html                     # Front-end interfaces for different user personas
│   └── *.js                       # Interactive behavior and email handling logic
│
├── supabase-schema.sql            # Main database schema for phishing experiment
├── supabase-permissions.sql       # Permission setup for secure Supabase integration
│
├── config-*.js                    # Configuration files for environment, tokens, and simplified setups
├── openai-integration.js          # LLM integration using OpenAI API
├── ollama-integration.js          # Local/Offline LLM connection
├── claude-integration.js          # Claude API integration for comparative testing
│
├── phishing-schema.sql            # Schema for phishing campaign data and experiment logs
├── working-hf-models.js           # Scripts for Hugging Face model experimentation
│
├── classfeedback.md               # Documented peer feedback from class presentations
├── Interviews.md                  # Stakeholder feedback and qualitative insights
└── README.md                      # Project overview and documentation (this file)
```

## Dashboard Sections

### 1. Overview
- Total customers, assets, and transactions
- Daily metrics and growth indicators
- Recent activity feed
- Visual charts (placeholder for now)

### 2. Customer Management
- Customer directory with search
- Account balances and status
- Quick actions (view, edit, suspend)
- Customer registration tools

### 3. Transaction Monitoring
- Real-time transaction feed
- Filter by status, date, amount
- Transaction approval workflow
- Detailed transaction history

### 4. Fraud Detection
- Risk-based alert system
- Automated fraud scoring
- Manual review workflow
- Fraud prevention statistics

### 5. System Health
- Database performance metrics
- API response times
- Server resource usage
- System event logs

## Security Features

- **Multi-factor Authentication** (2FA)
- **Session Management** with localStorage
- **Activity Logging** for audit trails
- **Role-based Access** (admin-only)
- **Secure Credential Validation**

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **JavaScript (ES6+)** - Interactive functionality
- **Supabase** - Backend database and real-time features
- **Font Awesome** - Professional icons
- **Responsive Design** - Mobile-first approach

## Customization

### Changing Login Credentials

Edit the `FAKE_ADMIN_CREDENTIALS` object in `script.js`:

```javascript
const FAKE_ADMIN_CREDENTIALS = {
    email: 'your-email@domain.com',
    password: 'YourPassword123!',
    mfa: '654321'
}
```

### Adding New Dashboard Sections

1. Add navigation item in HTML
2. Create section content
3. Add JavaScript functionality
4. Update navigation handlers

### Styling Customization

The CSS uses CSS custom properties for easy theming:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
}
```

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

This is a demo project for educational purposes. Feel free to use and modify as needed.

## Support

For issues or questions:
1. Check the browser console for errors
2. Ensure Supabase credentials are correct
3. Verify database schema is properly set up
4. Check network connectivity

## Future Enhancements

- [ ] Chart.js integration for data visualization
- [ ] Advanced search and filtering
- [ ] Export functionality for reports
- [ ] Email notifications for alerts
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced user permissions
- [ ] API rate limiting
- [ ] Data encryption at rest
- [ ] Audit trail improvements
