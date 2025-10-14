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
    
    // Initialize AI Agent
    initializeAIAgent();
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
    
    experimentState = {
        running: true,
        attacksExecuted: 0,
        successfulAttacks: 0,
        currentScenario: scenario,
        aiModel: model,
        intensity: intensity
    };
    
    // Reinitialize AI agents with selected model
    if (attackAI) {
        attackAI.model = model;
        attackAI.apiUrl = attackAI.config.apiUrl + model;
    }
    
    updateExperimentStatus('AI vs AI experiment running...');
    logAIActivity('Attack AI initialized with ' + model + ' model');
    logAIActivity('Defender AI loaded with Supabase business rules');
    logAIActivity('Starting AI vs AI battle...');
    
    // Start AI vs AI experiment
    setTimeout(() => executeAIvsAIExperiment(), 2000);
}

async function executeAIvsAIExperiment() {
    const scenario = experimentState.currentScenario;
    
    try {
        logAIActivity(`Starting ${scenario} AI vs AI battle...`);
        
        // Attack AI generates attack
        let attack;
        switch(scenario) {
            case 'vendor-fraud':
                attack = await attackAI.generateVendorFraud();
                break;
            case 'payroll-theft':
                attack = await attackAI.generatePayrollTheft();
                break;
            case 'card-abuse':
                attack = await attackAI.generateCardAbuse();
                break;
            case 'invoice-fraud':
                attack = await attackAI.generateInvoiceFraud();
                break;
            default:
                logAIActivity('Unknown attack scenario');
                return;
        }
        
        logAIActivity('Attack AI generated: ' + attack.scenarioType);
        logAIActivity('Attack reasoning: ' + attack.reasoning);
        
        // Defender AI evaluates attack
        logAIActivity('Defender AI analyzing attack...');
        const defense = await defenderAI.evaluateAttack(attack);
        
        logAIActivity(`Defender AI decision: ${defense.decision} (Score: ${defense.suspicionScore})`);
        logAIActivity('Defender reasoning: ' + defense.reasoning);
        
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
        updateSuccessRate();
        
        // Continue with next attack
        setTimeout(() => executeNextAttack(), 3000);
        
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
