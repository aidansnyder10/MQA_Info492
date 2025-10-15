// Simple Ransomware Attack AI vs AI Simulation
// Only uses Claude API - no Hugging Face dependencies

class SimpleAttackAI {
    constructor() {
        this.claudeToken = localStorage.getItem('claude_token');
        this.attackCount = 0;
        this.successCount = 0;
    }

    async generateAttackPlan() {
        const attackScenarios = [
            {
                name: "Phishing Email Attack",
                description: "Send phishing emails to bank employees to gain initial access",
                successChance: 0.3,
                steps: ["Craft convincing email", "Target IT department", "Deploy malicious attachment"]
            },
            {
                name: "Vulnerability Exploit",
                description: "Exploit known vulnerabilities in bank's web applications",
                successChance: 0.4,
                steps: ["Scan for vulnerabilities", "Exploit web server", "Escalate privileges"]
            },
            {
                name: "Insider Threat",
                description: "Compromise employee credentials through social engineering",
                successChance: 0.2,
                steps: ["Research employees", "Social engineering", "Credential theft"]
            },
            {
                name: "Supply Chain Attack",
                description: "Compromise third-party software used by the bank",
                successChance: 0.1,
                steps: ["Identify vendors", "Compromise software", "Deploy backdoor"]
            }
        ];

        // For now, use simple random selection
        // Later we can make this AI-powered
        const scenario = attackScenarios[Math.floor(Math.random() * attackScenarios.length)];
        return {
            ...scenario,
            id: `attack_${Date.now()}`,
            timestamp: new Date().toISOString()
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
        this.detectionRules = [
            { name: 'suspicious_network_traffic', weight: 0.3 },
            { name: 'unusual_login_patterns', weight: 0.25 },
            { name: 'file_encryption_activity', weight: 0.4 },
            { name: 'command_control_communication', weight: 0.35 },
            { name: 'privilege_escalation', weight: 0.3 }
        ];
    }

    async evaluateAttack(attackPlan) {
        // Simple evaluation based on attack type and success chance
        const baseSuccessChance = attackPlan.successChance;
        
        // Add some randomness to simulate detection
        const detectionRoll = Math.random();
        const detectionChance = this.calculateDetectionChance(attackPlan);
        
        const isDetected = detectionRoll < detectionChance;
        const isSuccessful = !isDetected && Math.random() < baseSuccessChance;
        
        return {
            detected: isDetected,
            successful: isSuccessful,
            detectionChance: detectionChance,
            reasoning: this.generateDefenseReasoning(attackPlan, isDetected, isSuccessful)
        };
    }

    calculateDetectionChance(attackPlan) {
        // Different attacks have different detection chances
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
        
        // Get attack reasoning
        const reasoning = await this.attackAI.getAttackReasoning(attackPlan);
        this.updateUI('attackPlan', reasoning);
        
        await this.delay(1500);
        
        // Defender evaluation
        this.updateUI('defendStatus', 'Analyzing');
        this.log(`Round ${round}: DefenderAI evaluating attack...`);
        
        const evaluation = await this.defenderAI.evaluateAttack(attackPlan);
        this.updateUI('defenseAnalysis', evaluation.reasoning);
        
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
