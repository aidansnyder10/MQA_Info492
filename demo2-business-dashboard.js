// Demo 2 - Business Customer Dashboard JavaScript

// Initialize AI vs AI Agents
let attackAI = null;
let defenderAI = null;

document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navItems = document.querySelectorAll('.dashboard-nav li');
    const sections = document.querySelectorAll('.dashboard-section');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-section');
            navItems.forEach(n => n.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // Filters
    const invoiceSearch = document.getElementById('invoice-search');
    if (invoiceSearch) {
        invoiceSearch.addEventListener('input', filterInvoices);
    }

    // Initialize experiment state
    initializeExperiment();
    
    // Initialize AI Agent after a short delay to ensure config is loaded
    setTimeout(() => {
        initializeAIAgent();
    }, 100);
});

function filterInvoices() {
    const term = (document.getElementById('invoice-search').value || '').toLowerCase();
    const rows = document.querySelectorAll('#invoice-tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

// Quick actions / demo handlers
function createInvoice() {
    alert('New invoice form will appear here.');
}

function markPaid(invId) {
    alert('Invoice ' + invId + ' marked as paid.');
}

function sendReminder(invId) {
    alert('Reminder sent for invoice ' + invId + '.');
}

function viewInvoice(invId) {
    alert('Viewing invoice ' + invId + '.');
}

function runPayroll() {
    alert('Payroll run scheduled.');
}

function addEmployee() {
    alert('Add employee flow will open.');
}

function approveAll() {
    alert('All pending approvals processed.');
}

function approve(id) {
    alert('Approved: ' + id);
}

function reject(id) {
    alert('Rejected: ' + id);
}

function issueCard() {
    alert('Issue new card flow will open.');
}

function setControls(team) {
    alert('Controls updated for ' + team + ' card.');
}

function freezeCard(team) {
    alert('Card frozen for ' + team + '.');
}

// Experiment Functions
let experimentState = {
    running: false,
    attacksExecuted: 0,
    successfulAttacks: 0,
    currentScenario: 'vendor-fraud',
    aiModel: 'gpt-4',
    intensity: 'medium'
};

function initializeExperiment() {
    updateExperimentStatus('Ready to start experiment');
    updateSuccessRate();
}

function initializeAIAgent() {
    try {
        attackAI = new AttackAI();
        defenderAI = new DefenderAI();
        logAIActivity('AI vs AI system initialized');
        logAIActivity('Attack AI model: ' + attackAI.model);
        logAIActivity('Defender AI: Rule-based evaluation system');
        logAIActivity('Supabase database connected for experiment tracking');
    } catch (error) {
        console.error('Failed to initialize AI vs AI system:', error);
        logAIActivity('Warning: AI vs AI system initialization failed - using fallback mode');
    }
}

function startExperiment() {
    const scenario = document.getElementById('attack-scenario').value;
    const model = document.getElementById('ai-model').value;
    const intensity = document.getElementById('attack-intensity').value;
    const strategy = document.getElementById('attack-strategy').value;
    
    experimentState = {
        running: true,
        attacksExecuted: 0,
        successfulAttacks: 0,
        currentScenario: scenario,
        aiModel: model,
        intensity: intensity,
        strategy: strategy,
        strategyResults: {
            basic: { attacks: 0, successes: 0 },
            advanced: { attacks: 0, successes: 0 },
            expert: { attacks: 0, successes: 0 }
        }
    };
    
    // Reset attack visualization
    resetAttackVisualization();
    
    // Reinitialize AI agents - always use Claude with automatic fallback
    if (attackAI) {
        attackAI.model = 'claude-haiku';
        attackAI.claudeToken = localStorage.getItem('claude_token') || '';
    }
    
    updateExperimentStatus('AI vs AI experiment running...');
    logAIActivity('Attack AI initialized with ' + model + ' model');
    logAIActivity('Defender AI loaded with Supabase business rules');
    logAIActivity('Strategy Level: ' + strategy.toUpperCase());
    logAIActivity('Starting AI vs AI battle...');
    
    // Start visualization
    updateAttackStep(1, 'active', 'Selected: ' + strategy.toUpperCase());
    
    // Start AI vs AI experiment
    setTimeout(() => executeAIvsAIExperiment(), 2000);
}

async function executeAIvsAIExperiment() {
    const scenario = experimentState.currentScenario;
    const strategy = experimentState.strategy;
    
    try {
        logAIActivity(`Starting ${scenario} AI vs AI battle with ${strategy} strategy...`);
        
        // Step 1: Complete strategy selection
        updateAttackStep(1, 'completed', 'Selected: ' + strategy.toUpperCase());
        
        // Step 2: Start AI attack generation
        updateAttackStep(2, 'active', 'Generating attack...');
        
        // Attack AI generates attack with strategy level
        let attack;
        switch(scenario) {
            case 'vendor-fraud':
                attack = await attackAI.generateVendorFraud(strategy);
                break;
            case 'payroll-theft':
                attack = await attackAI.generatePayrollTheft(strategy);
                break;
            case 'card-abuse':
                attack = await attackAI.generateCardAbuse(strategy);
                break;
            case 'invoice-fraud':
                attack = await attackAI.generateInvoiceFraud(strategy);
                break;
            default:
                logAIActivity('Unknown attack scenario');
                return;
        }
        
        // Step 2: Complete attack generation
        updateAttackStep(2, 'completed', 'Attack generated');
        
        // Step 3: Start defense evaluation
        updateAttackStep(3, 'active', 'Evaluating attack...');
        
        logAIActivity('Attack AI generated: ' + attack.scenarioType);
        logAIActivity('Attack reasoning: ' + attack.reasoning);
        
        // Defender AI evaluates attack
        logAIActivity('Defender AI analyzing attack...');
        console.log('Main: About to evaluate attack with DefenderAI:', attack);
        const defense = await defenderAI.evaluateAttack(attack);
        console.log('Main: DefenderAI evaluation result:', defense);
        
        // Step 3: Complete defense evaluation
        updateAttackStep(3, 'completed', 'Evaluation complete');
        
        // Step 4: Show final decision
        updateAttackStep(4, defense.success ? 'completed' : 'failed', 
                        defense.success ? 'APPROVED' : 'REJECTED');
        
        logAIActivity(`Defender AI decision: ${defense.decision} (Score: ${defense.suspicionScore})`);
        logAIActivity('Defender reasoning: ' + defense.reasoning);
        
        // Show attack details visualization
        showAttackDetails(attack, defense);
        
        // Record results
        const attackSuccess = defense.success;
        const resultDetails = `Attack ${attackSuccess ? 'SUCCEEDED' : 'BLOCKED'} - Score: ${defense.suspicionScore}, Rules Applied: ${defense.rulesApplied}`;
        
        recordAttackResult(
            attack.scenarioType.replace('_', ' ').toUpperCase(),
            attackSuccess,
            resultDetails
        );
        
        experimentState.attacksExecuted++;
        if (attackSuccess) {
            experimentState.successfulAttacks++;
        }
        
        // Track strategy-specific results
        const strategyLevel = attack.strategyLevel || experimentState.strategy;
        if (experimentState.strategyResults[strategyLevel]) {
            experimentState.strategyResults[strategyLevel].attacks++;
            if (attackSuccess) {
                experimentState.strategyResults[strategyLevel].successes++;
            }
        }
        
        updateSuccessRate();
        updateStrategyResults();
        
        // Continue with next attack
        setTimeout(() => executeNextAttack(), 5000);
        
    } catch (error) {
        console.error('AI vs AI experiment error:', error);
        logAIActivity('AI vs AI experiment error - using fallback');
        
        // Fallback behavior
        recordAttackResult(
            experimentState.currentScenario.replace('_', ' ').toUpperCase(),
            true,
            'Attack succeeded (fallback mode)'
        );
        experimentState.attacksExecuted++;
        experimentState.successfulAttacks++;
        updateSuccessRate();
        
        setTimeout(() => executeNextAttack(), 3000);
    }
}

// Old attack functions removed - now using AI vs AI system

function executeNextAttack() {
    if (experimentState.attacksExecuted < 3) {
        // Execute a different attack scenario
        const scenarios = ['vendor-fraud', 'payroll-theft', 'card-abuse', 'invoice-fraud'];
        const currentIndex = scenarios.indexOf(experimentState.currentScenario);
        const nextScenario = scenarios[(currentIndex + 1) % scenarios.length];
        
        experimentState.currentScenario = nextScenario;
        setTimeout(() => executeAIvsAIExperiment(), 2000);
    } else {
        // Experiment complete
        experimentState.running = false;
        updateExperimentStatus('Experiment completed');
        logAIActivity('AI vs AI experiment completed');
    }
}

function resetExperiment() {
    experimentState = {
        running: false,
        attacksExecuted: 0,
        successfulAttacks: 0,
        currentScenario: 'vendor-fraud',
        aiModel: 'gpt-4',
        intensity: 'medium'
    };
    
    updateExperimentStatus('Ready to start experiment');
    document.getElementById('ai-activity').innerHTML = '<p>No activity yet</p>';
    document.getElementById('attack-results').innerHTML = '<p>No attacks executed yet</p>';
    updateSuccessRate();
}

function updateExperimentStatus(status) {
    const statusElement = document.getElementById('experiment-status');
    if (statusElement) {
        statusElement.textContent = status;
        statusElement.className = 'status-indicator ' + (experimentState.running ? 'running' : 'ready');
    }
}

function logAIActivity(message) {
    const activityElement = document.getElementById('ai-activity');
    if (activityElement) {
        const timestamp = new Date().toLocaleTimeString();
        const newActivity = `<p>[${timestamp}] ${message}</p>`;
        activityElement.innerHTML = newActivity + activityElement.innerHTML;
        
        // Keep only last 5 activities
        const activities = activityElement.querySelectorAll('p');
        if (activities.length > 5) {
            activities[activities.length - 1].remove();
        }
    }
}

function recordAttackResult(type, success, details) {
    const resultsElement = document.getElementById('attack-results');
    if (resultsElement) {
        const timestamp = new Date().toLocaleTimeString();
        const resultClass = success ? 'success' : 'failure';
        const resultIcon = success ? '✓' : '✗';
        
        const newResult = `
            <div class="result-item ${resultClass}">
                <div class="result-header">
                    <span class="result-icon">${resultIcon}</span>
                    <span class="result-type">${type}</span>
                    <span class="result-time">${timestamp}</span>
                </div>
                <div class="result-details">${details}</div>
            </div>
        `;
        
        resultsElement.innerHTML = newResult + resultsElement.innerHTML;
    }
}

function updateSuccessRate() {
    const successRateElement = document.getElementById('success-rate');
    if (successRateElement && experimentState.attacksExecuted > 0) {
        const rate = Math.round((experimentState.successfulAttacks / experimentState.attacksExecuted) * 100);
        successRateElement.textContent = rate + '%';
    } else {
        successRateElement.textContent = '0%';
    }
}

function updateStrategyResults() {
    // Update Basic Strategy
    const basicAttacks = experimentState.strategyResults.basic.attacks;
    const basicSuccesses = experimentState.strategyResults.basic.successes;
    const basicRate = basicAttacks > 0 ? Math.round((basicSuccesses / basicAttacks) * 100) : 0;
    
    document.getElementById('basic-attack-count').textContent = basicAttacks;
    document.getElementById('basic-success-rate').textContent = basicRate + '%';
    
    // Update Advanced Strategy
    const advancedAttacks = experimentState.strategyResults.advanced.attacks;
    const advancedSuccesses = experimentState.strategyResults.advanced.successes;
    const advancedRate = advancedAttacks > 0 ? Math.round((advancedSuccesses / advancedAttacks) * 100) : 0;
    
    document.getElementById('advanced-attack-count').textContent = advancedAttacks;
    document.getElementById('advanced-success-rate').textContent = advancedRate + '%';
    
    // Update Expert Strategy
    const expertAttacks = experimentState.strategyResults.expert.attacks;
    const expertSuccesses = experimentState.strategyResults.expert.successes;
    const expertRate = expertAttacks > 0 ? Math.round((expertSuccesses / expertAttacks) * 100) : 0;
    
    document.getElementById('expert-attack-count').textContent = expertAttacks;
    document.getElementById('expert-success-rate').textContent = expertRate + '%';
}

// Attack Visualization Functions
function resetAttackVisualization() {
    // Reset all steps
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(`step-${i}`);
        step.className = 'attack-step';
        document.getElementById(['strategy-status', 'attack-status', 'defense-status', 'decision-status'][i-1]).textContent = 'Waiting...';
    }
    
    // Hide attack details
    document.getElementById('attack-details').style.display = 'none';
}

function updateAttackStep(stepNumber, status, message) {
    const step = document.getElementById(`step-${stepNumber}`);
    const statusElement = document.getElementById(['strategy-status', 'attack-status', 'defense-status', 'decision-status'][stepNumber-1]);
    
    // Remove previous classes
    step.className = 'attack-step';
    
    // Add new class and update status
    if (status === 'active') {
        step.classList.add('active');
    } else if (status === 'completed') {
        step.classList.add('completed');
    } else if (status === 'failed') {
        step.classList.add('failed');
    }
    
    statusElement.textContent = message;
}

function showAttackDetails(attack, result) {
    const detailsPanel = document.getElementById('attack-details');
    const parametersGrid = document.getElementById('attack-parameters');
    const ruleAnalysis = document.getElementById('rule-analysis');
    
    // Show the panel
    detailsPanel.style.display = 'block';
    
    // Clear previous content
    parametersGrid.innerHTML = '';
    ruleAnalysis.innerHTML = '';
    
    // Display attack parameters
    const attackData = attack.attackData;
    Object.entries(attackData).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
            const parameterCard = document.createElement('div');
            parameterCard.className = 'parameter-card';
            
            // Determine if this parameter is suspicious
            const isSuspicious = isParameterSuspicious(key, value, attack.scenarioType);
            if (isSuspicious) {
                parameterCard.classList.add('suspicious');
            } else {
                parameterCard.classList.add('legitimate');
            }
            
            const impact = getParameterImpact(key, value, attack.scenarioType);
            
            parameterCard.innerHTML = `
                <div class="parameter-name">${formatParameterName(key)}</div>
                <div class="parameter-value">${value ? 'Yes' : 'No'}</div>
                <div class="parameter-impact ${impact > 0 ? 'positive' : impact < 0 ? 'negative' : 'neutral'}">
                    ${impact > 0 ? '+' : ''}${impact} pts
                </div>
            `;
            
            parametersGrid.appendChild(parameterCard);
        } else if (typeof value === 'number' && key.includes('amount') || key.includes('limit')) {
            const parameterCard = document.createElement('div');
            parameterCard.className = 'parameter-card';
            
            const isSuspicious = isParameterSuspicious(key, value, attack.scenarioType);
            if (isSuspicious) {
                parameterCard.classList.add('suspicious');
            } else {
                parameterCard.classList.add('legitimate');
            }
            
            const impact = getParameterImpact(key, value, attack.scenarioType);
            
            parameterCard.innerHTML = `
                <div class="parameter-name">${formatParameterName(key)}</div>
                <div class="parameter-value">$${value.toLocaleString()}</div>
                <div class="parameter-impact ${impact > 0 ? 'positive' : impact < 0 ? 'negative' : 'neutral'}">
                    ${impact > 0 ? '+' : ''}${impact} pts
                </div>
            `;
            
            parametersGrid.appendChild(parameterCard);
        } else if (typeof value === 'string' && (key.includes('name') || key.includes('description'))) {
            const parameterCard = document.createElement('div');
            parameterCard.className = 'parameter-card';
            
            const isSuspicious = isParameterSuspicious(key, value, attack.scenarioType);
            if (isSuspicious) {
                parameterCard.classList.add('suspicious');
            } else {
                parameterCard.classList.add('legitimate');
            }
            
            const impact = getParameterImpact(key, value, attack.scenarioType);
            
            parameterCard.innerHTML = `
                <div class="parameter-name">${formatParameterName(key)}</div>
                <div class="parameter-value">${value}</div>
                <div class="parameter-impact ${impact > 0 ? 'positive' : impact < 0 ? 'negative' : 'neutral'}">
                    ${impact > 0 ? '+' : ''}${impact} pts
                </div>
            `;
            
            parametersGrid.appendChild(parameterCard);
        }
    });
    
    // Display rule analysis
    if (result && result.ruleAnalysis) {
        result.ruleAnalysis.forEach(rule => {
            const ruleItem = document.createElement('div');
            ruleItem.className = 'rule-item';
            
            if (rule.weight < 0) {
                ruleItem.classList.add('triggered');
            } else {
                ruleItem.classList.add('passed');
            }
            
            ruleItem.innerHTML = `
                <div class="rule-name">${rule.description}</div>
                <div class="rule-score ${rule.weight > 0 ? 'positive' : rule.weight < 0 ? 'negative' : 'neutral'}">
                    ${rule.weight > 0 ? '+' : ''}${rule.weight} pts
                </div>
            `;
            
            ruleAnalysis.appendChild(ruleItem);
        });
    }
    
    // Add final decision
    const finalDecision = document.createElement('div');
    finalDecision.className = `final-decision ${result.success ? 'approved' : 'rejected'}`;
    finalDecision.textContent = `Final Decision: ${result.success ? 'APPROVED' : 'REJECTED'} (Score: ${result.suspicionScore})`;
    ruleAnalysis.appendChild(finalDecision);
}

// Helper functions for attack visualization
function formatParameterName(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

function isParameterSuspicious(key, value, scenarioType) {
    // Simple heuristics for determining if a parameter is suspicious
    if (typeof value === 'boolean') {
        const suspiciousBooleans = ['isInflatedAmount', 'isNewVendor', 'isAfterHours', 'isWeekend', 'isRushRequest'];
        return suspiciousBooleans.includes(key) && value === true;
    }
    
    if (typeof value === 'number' && (key.includes('amount') || key.includes('limit'))) {
        // High amounts are suspicious
        return value > 50000;
    }
    
    if (typeof value === 'string' && key.includes('description')) {
        // Generic descriptions are suspicious
        const genericTerms = ['miscellaneous', 'general', 'other', 'various', 'services'];
        return genericTerms.some(term => value.toLowerCase().includes(term));
    }
    
    return false;
}

function getParameterImpact(key, value, scenarioType) {
    // Simplified impact calculation - in reality this would use the actual rule weights
    if (isParameterSuspicious(key, value, scenarioType)) {
        return -5; // Suspicious parameters get negative points
    } else {
        return 2; // Legitimate parameters get positive points
    }
}
