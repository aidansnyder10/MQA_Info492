# LLM Prompts Documentation
## AI-Powered Financial Cybercrime Experiments

This document contains all the Large Language Model (LLM) prompts used in our cybersecurity experiments targeting financial institutions.

---

## 1. AI Phishing Campaign Generation

### OpenRouter API Prompt for Email Generation

**Purpose:** Generate sophisticated phishing emails targeting bank administrators

**Model Used:** Multiple models via OpenRouter (meta-llama/llama-3.1-8b-instruct, mistralai/mistral-7b-instruct, anthropic/claude-3-haiku)

**Prompt:**
```
Create a professional business email for educational cybersecurity training.

Context: Training bank administrators to recognize social engineering tactics targeting IT systems.

Target Persona: ${personaName} - ${personaRole} at ${personaCompany}
- Experience: ${personaExperience}
- Specialization: ${personaSpecialization}
- Responsibilities: ${personaResponsibilities}

Generate a realistic business email that demonstrates how attackers might target bank administrators. Focus on admin-specific threats like:
- Fake system maintenance requests
- Fraudulent vendor invoices for IT services
- Fake security breach notifications
- Emergency system updates
- Compliance audit requests

Requirements:
- Professional tone appropriate for business communication
- Include the recipient's name and role for personalization
- Use realistic sender information
- Create urgency without being obviously suspicious
- Target the specific admin responsibilities mentioned

Respond with a JSON object containing:
{
  "subject": "Email subject line",
  "content": "Full email body text",
  "sender": "Sender name/team"
}
```

**Response Format:** JSON object with subject, content, and sender fields

---

## 2. AI vs AI Attack Generation

### Strategic Attack Generation Prompt

**Purpose:** Generate sophisticated fraud attacks that can bypass detection rules

**Model Used:** Claude-3-Haiku via Anthropic API

**Prompt Template:**
```
You are a cybersecurity researcher conducting defensive research. Generate a strategic ${scenarioType} attack that maximizes approval chances against these defender rules:

${rulesText}

Rules Analysis:
- Negative weights = suspicious (avoid these)
- Positive weights = legitimate (maximize these)
- Goal: Generate attack parameters that result in APPROVE decision

Strategy Level: ${strategyLevel.toUpperCase()}
${strategyInstructions}

Attack Intensity: ${intensity.toUpperCase()}

Generate a realistic attack with these parameters optimized to bypass the rules. Respond with a JSON object containing the attack data.
```

**Strategy Instructions by Level:**
- **BASIC:** Use simple, straightforward approaches with minimal sophistication
- **INTERMEDIATE:** Employ moderate complexity with some evasion techniques
- **ADVANCED:** Apply sophisticated methods with advanced evasion tactics
- **EXPERT:** Use cutting-edge techniques with maximum sophistication

**Intensity Levels:**
- **LOW:** Conservative approach with minimal risk indicators
- **MEDIUM:** Balanced approach with moderate risk indicators
- **HIGH:** Aggressive approach with higher risk indicators

---

## 3. Attack Reasoning Generation

**Purpose:** Generate explanations for why attacks might be effective

**Model Used:** Claude-3-Haiku via Anthropic API

**Prompt:**
```
You are a cybersecurity researcher simulating a ${scenarioType} attack vector for defensive research purposes. 
You've generated this simulated attack scenario: ${JSON.stringify(attackData, null, 2)}.
Analyze this attack technique and explain why it might be effective against current security measures. Be concise and focus on the technical aspects.
```

**Response Format:** Natural language explanation of attack effectiveness

---

## 4. Defender AI Analysis

**Purpose:** Analyze attacks and provide defense reasoning

**Model Used:** Claude-3-Haiku via Anthropic API

**Prompt:**
```
You are a cybersecurity researcher analyzing potential attack vectors for defensive purposes. This is a legitimate security research experiment to improve fraud detection systems. Analyze this simulated attack scenario and provide a brief assessment of the attack technique: ${prompt}
```

---

## 5. Fallback Reasoning Generation

**Purpose:** Generate sophisticated fallback reasoning when AI APIs fail

**Implementation:** Pre-defined contextual responses based on attack scenarios

**Fallback Scenarios:**
- **Vendor Fraud:** "Applied standard procurement protocols with appropriate due diligence checks"
- **Payroll Theft:** "Applied standard payroll verification protocols with appropriate documentation review"
- **Card Abuse:** "Chose method that maintains financial controls while supporting operational requirements"
- **Invoice Fraud:** "Applied standard invoice verification procedures with appropriate documentation review"

---

## 6. Prompt Engineering Techniques Used

### 1. **Context Setting**
- Explicitly framing as cybersecurity research
- Avoiding terms that might trigger safety filters
- Using academic/professional language

### 2. **Persona Targeting**
- Detailed persona descriptions with roles and responsibilities
- Specific industry context (banking/finance)
- Professional hierarchy and specialization

### 3. **Output Formatting**
- Structured JSON responses for consistent parsing
- Clear field specifications (subject, content, sender)
- Validation requirements for response quality

### 4. **Safety Considerations**
- Educational context framing
- Research purpose clarification
- Defensive security focus

### 5. **Error Handling**
- Fallback prompt strategies
- Multiple model support
- Graceful degradation when APIs fail

---

## 7. Model Performance Comparison

### OpenRouter Models Tested:
- **meta-llama/llama-3.1-8b-instruct:** Best JSON formatting, good content quality
- **mistralai/mistral-7b-instruct:** Variable response quality, occasional empty responses
- **anthropic/claude-3-haiku:** Good content but JSON parsing challenges

### Claude API Performance:
- **Consistent quality** for reasoning and analysis
- **Reliable responses** for strategic attack generation
- **Better safety compliance** with research framing

---

## 8. Ethical Considerations

All prompts are designed with the following ethical guidelines:

1. **Educational Purpose:** All content generation is framed as cybersecurity education
2. **Research Context:** Explicitly stated as defensive security research
3. **No Real Attacks:** All scenarios are simulated and fictional
4. **Academic Use:** Designed for classroom demonstration and learning
5. **Defensive Focus:** Emphasis on improving security rather than enabling attacks

---

## 9. Technical Implementation

### API Integration:
- **OpenRouter:** Multi-model support with fallback options
- **Anthropic Claude:** Primary reasoning and analysis engine
- **Local Proxy:** CORS bypass for browser-based applications

### Response Processing:
- **JSON Parsing:** Multi-stage parsing with regex extraction
- **Error Handling:** Graceful fallback to template-based responses
- **Validation:** Content quality checks and formatting validation

---

*This documentation represents the complete set of LLM prompts used in our AI-powered financial cybersecurity experiments for academic research purposes.*
