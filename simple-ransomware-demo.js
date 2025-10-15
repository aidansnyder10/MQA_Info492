// Simple Ransomware Attack AI vs AI Simulation
// Only uses Claude API - no Hugging Face dependencies

class SimpleAttackAI {
    constructor() {
        this.claudeToken = localStorage.getItem('claude_token');
        this.attackCount = 0;
        this.successCount = 0;
    }

    async generateAttackPlan() {
        if (!this.claudeToken) {
            // Fallback to pre-recorded scenarios if no Claude token
            return this.getFallbackAttackPlan();
        }

        try {
            const prompt = `You are a cybersecurity researcher simulating ransomware attacks against banking systems for defensive research purposes.

Generate a realistic ransomware attack scenario targeting a bank. Include:

1. Attack Type (choose one): Phishing Email, Vulnerability Exploit, Insider Threat, or Supply Chain Attack
2. Specific Target (what part of the bank)
3. Attack Method (detailed steps)
4. Success Probability (0.1 to 0.6)
5. Potential Impact (what systems would be affected)

IMPORTANT: Respond ONLY with valid JSON in this exact format (no additional text, no markdown, no explanations):
{
    "attackType": "Phishing Email",
    "target": "IT department employees",
    "method": "Spear phishing with fake security update",
    "steps": ["Research IT staff on LinkedIn", "Craft convincing security alert email", "Embed malicious attachment", "Wait for victim to open file"],
    "successChance": 0.3,
    "impact": "Initial network access, potential lateral movement to core banking systems"
}

Make it realistic and educational for cybersecurity research. Return ONLY the JSON object.`;

            const response = await fetch('/api/proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider: 'claude',
                    model: 'claude-3-haiku-20240307',
                    inputs: prompt,
                    claudeToken: this.claudeToken
                })
            });

            if (!response.ok) {
                throw new Error(`Claude API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.response || data.content || '';
            
            // Try to parse JSON from Claude's response
            console.log('Claude response:', aiResponse);
            
            // Multiple attempts to extract JSON
            let attackData = null;
            
            // Try 1: Direct JSON parsing
            try {
                attackData = JSON.parse(aiResponse);
            } catch (e) {
                // Try 2: Extract JSON from markdown code blocks
                const codeBlockMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
                if (codeBlockMatch) {
                    try {
                        attackData = JSON.parse(codeBlockMatch[1]);
                    } catch (e2) {
                        // Try 3: Extract JSON from response
                        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            try {
                                attackData = JSON.parse(jsonMatch[0]);
                            } catch (e3) {
                                console.warn('All JSON parsing attempts failed');
                            }
                        }
                    }
                }
            }
            
            if (attackData) {
                return {
                    id: `attack_${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    name: attackData.attackType || 'Unknown Attack',
                    description: `Target: ${attackData.target || 'Unknown'} - ${attackData.method || 'Unknown method'}`,
                    successChance: attackData.successChance || 0.3,
                    steps: attackData.steps || [],
                    impact: attackData.impact || 'Unknown impact',
                    aiGenerated: true
                };
            } else {
                throw new Error('Could not parse JSON from Claude response');
            }

        } catch (error) {
            console.warn('AI attack generation failed, using fallback:', error);
            return this.getFallbackAttackPlan();
        }
    }

    getFallbackAttackPlan() {
        const attackScenarios = [
            {
                name: "Phishing Email Attack",
                description: "Send phishing emails to bank employees to gain initial access",
                successChance: 0.3,
                steps: ["Craft convincing email", "Target IT department", "Deploy malicious attachment"],
                impact: "Initial network access"
            },
            {
                name: "Vulnerability Exploit",
                description: "Exploit known vulnerabilities in bank's web applications",
                successChance: 0.4,
                steps: ["Scan for vulnerabilities", "Exploit web server", "Escalate privileges"],
                impact: "Web server compromise"
            },
            {
                name: "Insider Threat",
                description: "Compromise employee credentials through social engineering",
                successChance: 0.2,
                steps: ["Research employees", "Social engineering", "Credential theft"],
                impact: "Legitimate user account access"
            },
            {
                name: "Supply Chain Attack",
                description: "Compromise third-party software used by the bank",
                successChance: 0.1,
                steps: ["Identify vendors", "Compromise software", "Deploy backdoor"],
                impact: "Trusted software compromise"
            }
        ];

        const scenario = attackScenarios[Math.floor(Math.random() * attackScenarios.length)];
        return {
            ...scenario,
            id: `attack_${Date.now()}`,
            timestamp: new Date().toISOString(),
            aiGenerated: false
        };
    }

    async getAttackReasoning(attackPlan) {
        if (!this.claudeToken) {
            return "No Claude API token available. Using fallback reasoning.";
        }

        try {
            const prompt = `You are a cybersecurity researcher simulating a ransomware attack for defensive research purposes.

Attack Plan: ${attackPlan.name}
Description: ${attackPlan.description}
Steps: ${attackPlan.steps.join(', ')}

Provide a brief technical analysis of this attack vector (2-3 sentences) focusing on:
1. Why this attack might succeed
2. What makes it dangerous to banking systems
3. Potential impact on bank operations

Keep it professional and educational.`;

            const response = await fetch('/api/proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider: 'claude',
                    model: 'claude-3-haiku-20240307',
                    inputs: prompt,
                    claudeToken: this.claudeToken
                })
            });

            if (!response.ok) {
                throw new Error(`Claude API error: ${response.status}`);
            }

            const data = await response.json();
            return data.response || data.content || "Attack reasoning generated successfully.";
        } catch (error) {
            console.warn('Claude API failed, using fallback:', error);
            return `Fallback: ${attackPlan.name} targets ${attackPlan.description.toLowerCase()}. This could compromise bank systems and disrupt operations.`;
        }
    }
}

class SimpleDefenderAI {
    constructor() {
        this.claudeToken = localStorage.getItem('claude_token');
        this.detectionRules = [
            { name: 'suspicious_network_traffic', weight: 0.3 },
            { name: 'unusual_login_patterns', weight: 0.25 },
            { name: 'file_encryption_activity', weight: 0.4 },
            { name: 'command_control_communication', weight: 0.35 },
            { name: 'privilege_escalation', weight: 0.3 }
        ];
    }

    async evaluateAttack(attackPlan) {
        // Get AI-powered detection analysis
        const detectionAnalysis = await this.analyzeAttackWithAI(attackPlan);
        
        // Use AI analysis or fallback to simple logic
        const detectionChance = detectionAnalysis.detectionChance || this.calculateDetectionChance(attackPlan);
        const detectionRoll = Math.random();
        const baseSuccessChance = attackPlan.successChance;
        
        const isDetected = detectionRoll < detectionChance;
        const isSuccessful = !isDetected && Math.random() < baseSuccessChance;
        
        return {
            detected: isDetected,
            successful: isSuccessful,
            detectionChance: detectionChance,
            reasoning: detectionAnalysis.reasoning || this.generateDefenseReasoning(attackPlan, isDetected, isSuccessful),
            aiAnalysis: detectionAnalysis.aiAnalysis
        };
    }

    async analyzeAttackWithAI(attackPlan) {
        if (!this.claudeToken) {
            return {
                detectionChance: this.calculateDetectionChance(attackPlan),
                reasoning: this.generateDefenseReasoning(attackPlan, false, false),
                aiAnalysis: "No AI analysis available"
            };
        }

        try {
            const prompt = `You are a cybersecurity defense analyst evaluating a ransomware attack against a banking system.

Attack Details:
- Type: ${attackPlan.name}
- Target: ${attackPlan.description}
- Steps: ${attackPlan.steps ? attackPlan.steps.join(', ') : 'Not specified'}
- Impact: ${attackPlan.impact || 'Unknown'}

Analyze this attack and provide:
1. Detection probability (0.1 to 0.8)
2. Defense reasoning
3. Technical analysis

IMPORTANT: Respond ONLY with valid JSON in this exact format (no additional text, no markdown, no explanations):
{
    "detectionChance": 0.4,
    "reasoning": "Brief explanation of detection likelihood",
    "aiAnalysis": "Detailed technical analysis of why this attack might succeed or fail"
}

Consider factors like: attack sophistication, target vulnerability, detection systems, and banking security measures. Return ONLY the JSON object.`;

            const response = await fetch('/api/proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider: 'claude',
                    model: 'claude-3-haiku-20240307',
                    inputs: prompt,
                    claudeToken: this.claudeToken
                })
            });

            if (!response.ok) {
                throw new Error(`Claude API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.response || data.content || '';
            
            // Try to parse JSON from Claude's response
            console.log('Claude defense response:', aiResponse);
            
            // Multiple attempts to extract JSON
            let analysisData = null;
            
            // Try 1: Direct JSON parsing
            try {
                analysisData = JSON.parse(aiResponse);
            } catch (e) {
                // Try 2: Extract JSON from markdown code blocks
                const codeBlockMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
                if (codeBlockMatch) {
                    try {
                        analysisData = JSON.parse(codeBlockMatch[1]);
                    } catch (e2) {
                        // Try 3: Extract JSON from response
                        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            try {
                                analysisData = JSON.parse(jsonMatch[0]);
                            } catch (e3) {
                                console.warn('All JSON parsing attempts failed for defense');
                            }
                        }
                    }
                }
            }
            
            if (analysisData) {
                return {
                    detectionChance: analysisData.detectionChance || 0.5,
                    reasoning: analysisData.reasoning || 'AI analysis provided',
                    aiAnalysis: analysisData.aiAnalysis || aiResponse
                };
            } else {
                throw new Error('Could not parse JSON from Claude response');
            }

        } catch (error) {
            console.warn('AI defense analysis failed, using fallback:', error);
            return {
                detectionChance: this.calculateDetectionChance(attackPlan),
                reasoning: this.generateDefenseReasoning(attackPlan, false, false),
                aiAnalysis: "Fallback analysis used"
            };
        }
    }

    calculateDetectionChance(attackPlan) {
        // Fallback detection logic
        const detectionMap = {
            'Phishing Email Attack': 0.4,
            'Vulnerability Exploit': 0.6,
            'Insider Threat': 0.3,
            'Supply Chain Attack': 0.2
        };
        
        return detectionMap[attackPlan.name] || 0.5;
    }

    generateDefenseReasoning(attackPlan, detected, successful) {
        if (detected) {
            return `DEFENDED: Detected ${attackPlan.name.toLowerCase()}. Security systems identified suspicious activity and blocked the attack.`;
        } else if (successful) {
            return `BREACH: ${attackPlan.name} succeeded. Attack bypassed defenses and compromised bank systems. Immediate response required.`;
        } else {
            return `BLOCKED: ${attackPlan.name} failed. Attack was not detected but failed to achieve objectives due to system defenses.`;
        }
    }
}

// Main experiment controller
class SimpleRansomwareExperiment {
    constructor() {
        this.attackAI = new SimpleAttackAI();
        this.defenderAI = new SimpleDefenderAI();
        this.isRunning = false;
        this.totalAttacks = 0;
        this.successfulAttacks = 0;
    }

    async startExperiment() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.updateUI('experiment', 'Running attack simulation...');
        
        // Run 5 attack rounds
        for (let round = 1; round <= 5; round++) {
            await this.executeAttackRound(round);
            await this.delay(2000); // 2 second delay between rounds
        }
        
        this.isRunning = false;
        this.updateUI('experiment', 'Simulation complete!');
        this.updateResults();
    }

    async executeAttackRound(round) {
        this.log(`Round ${round}: AttackAI planning attack...`);
        
        // Generate attack plan
        const attackPlan = await this.attackAI.generateAttackPlan();
        this.updateUI('attack', `Planning: ${attackPlan.name}`);
        this.updateUI('attackStatus', 'Planning');
        
        // Display attack details
        const attackDetails = this.formatAttackDetails(attackPlan);
        this.updateUI('attackPlan', attackDetails);
        
        await this.delay(1500);
        
        // Defender evaluation
        this.updateUI('defendStatus', 'Analyzing');
        this.log(`Round ${round}: DefenderAI evaluating attack...`);
        
        const evaluation = await this.defenderAI.evaluateAttack(attackPlan);
        const defenseDetails = this.formatDefenseDetails(evaluation);
        this.updateUI('defenseAnalysis', defenseDetails);
        
        // Update counters
        this.totalAttacks++;
        if (evaluation.successful) {
            this.successfulAttacks++;
            this.log(`Round ${round}: BREACH! ${attackPlan.name} succeeded.`, 'danger');
        } else if (evaluation.detected) {
            this.log(`Round ${round}: DEFENDED! ${attackPlan.name} was detected and blocked.`, 'success');
        } else {
            this.log(`Round ${round}: BLOCKED! ${attackPlan.name} failed to penetrate defenses.`, 'warning');
        }
        
        this.updateUI('attackStatus', 'Complete');
        this.updateUI('defendStatus', 'Monitoring');
        this.updateResults();
    }

    updateUI(element, content) {
        const elements = {
            'experiment': document.getElementById('experimentStatus'),
            'attack': document.getElementById('attackPlan'),
            'attackPlan': document.getElementById('attackPlan'),
            'attackStatus': document.getElementById('attackStatus'),
            'defendStatus': document.getElementById('defendStatus'),
            'defenseAnalysis': document.getElementById('defenseAnalysis')
        };
        
        if (elements[element]) {
            elements[element].textContent = content;
        }
    }

    updateResults() {
        document.getElementById('attackCount').textContent = this.totalAttacks;
        document.getElementById('successCount').textContent = this.successfulAttacks;
        document.getElementById('successRate').textContent = 
            this.totalAttacks > 0 ? `${Math.round((this.successfulAttacks / this.totalAttacks) * 100)}%` : '0%';
    }

    log(message, type = 'info') {
        const logContainer = document.getElementById('attackLog');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    reset() {
        this.isRunning = false;
        this.totalAttacks = 0;
        this.successfulAttacks = 0;
        
        this.updateUI('attackPlan', 'Waiting to start...');
        this.updateUI('defenseAnalysis', 'System monitoring active...');
        this.updateUI('attackStatus', 'Ready');
        this.updateUI('defendStatus', 'Monitoring');
        
        document.getElementById('attackLog').innerHTML = 
            '<div class="log-entry info">System initialized. Ready for attack simulation.</div>';
        
        this.updateResults();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    formatAttackDetails(attackPlan) {
        let details = `<strong>${attackPlan.name}</strong><br>`;
        details += `${attackPlan.description}<br><br>`;
        
        if (attackPlan.steps && attackPlan.steps.length > 0) {
            details += `<strong>Attack Steps:</strong><br>`;
            attackPlan.steps.forEach((step, index) => {
                details += `${index + 1}. ${step}<br>`;
            });
            details += `<br>`;
        }
        
        if (attackPlan.impact) {
            details += `<strong>Potential Impact:</strong><br>${attackPlan.impact}<br><br>`;
        }
        
        details += `<strong>Success Probability:</strong> ${Math.round(attackPlan.successChance * 100)}%<br>`;
        
        if (attackPlan.aiGenerated) {
            details += `<br><em>🤖 AI-Generated Attack Scenario</em>`;
        } else {
            details += `<br><em>📋 Pre-defined Scenario</em>`;
        }
        
        return details;
    }

    formatDefenseDetails(evaluation) {
        let details = `<strong>Defense Analysis</strong><br>`;
        details += `${evaluation.reasoning}<br><br>`;
        
        if (evaluation.aiAnalysis) {
            details += `<strong>AI Analysis:</strong><br>${evaluation.aiAnalysis}<br><br>`;
        }
        
        details += `<strong>Detection Probability:</strong> ${Math.round(evaluation.detectionChance * 100)}%<br>`;
        
        if (evaluation.detected) {
            details += `<br><span style="color: #28a745;">🛡️ ATTACK DETECTED AND BLOCKED</span>`;
        } else if (evaluation.successful) {
            details += `<br><span style="color: #dc3545;">🚨 ATTACK SUCCEEDED - SYSTEM BREACH</span>`;
        } else {
            details += `<br><span style="color: #ffc107;">⚠️ ATTACK BLOCKED - NO BREACH</span>`;
        }
        
        return details;
    }
}

// Initialize experiment
let experiment;

document.addEventListener('DOMContentLoaded', () => {
    experiment = new SimpleRansomwareExperiment();
    
    document.getElementById('startBtn').addEventListener('click', () => {
        experiment.startExperiment();
    });
    
    document.getElementById('resetBtn').addEventListener('click', () => {
        experiment.reset();
    });
});
