function calculateApprovalOdds(card) {
    if (!currentUser) return 50;
    
    let score = 50;
    
    const creditDifference = currentUser.creditScore - card.creditRequired;
    if (creditDifference >= 100) score += 30;
    else if (creditDifference >= 50) score += 20;
    else if (creditDifference >= 0) score += 15;
    else if (creditDifference >= -50) score += 5;
    else score -= 20;
    
    const incomeRatio = currentUser.annualIncome / card.incomeRequired;
    if (incomeRatio >= 2) score += 30;
    else if (incomeRatio >= 1.5) score += 20;
    else if (incomeRatio >= 1.2) score += 15;
    else if (incomeRatio >= 1) score += 10;
    else if (incomeRatio >= 0.8) score += 5;
    else score -= 10;
    
    if (card.annualFee === 0) score += 10;
    if (currentUser.creditScore >= 800) score += 5;
    if (currentUser.annualIncome >= 100000) score += 5;
    
    return Math.max(0, Math.min(100, Math.round(score)));
}

function displayCards(cards, containerId) {
    const container = document.getElementById(containerId);
    if (!cards || cards.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">No cards found</div>';
        return;
    }
    
    const searchQuery = document.getElementById('cardSearch')?.value.toLowerCase().trim() || '';
    const userApplications = currentUser ? db.getUserApplications(currentUser.id) : [];
    
    container.innerHTML = cards.map(card => {
        const odds = calculateApprovalOdds(card);
        const oddsColor = odds > 70 ? '#28a745' : odds > 50 ? '#ffc107' : '#dc3545';
        const hasApplied = userApplications.some(app => app.cardId === card.id);
        
        let displayName = card.name;
        if (searchQuery && card.name.toLowerCase().includes(searchQuery)) {
            displayName = card.name.replace(
                new RegExp(searchQuery, 'gi'),
                match => `<span style="background-color: #fff3cd; padding: 2px 4px; border-radius: 3px;">${match}</span>`
            );
        }
        
        return `
            <div class="card">
                <div class="card-header">
                    <h3 style="margin: 0;">${displayName}</h3>
                    <p style="margin: 5px 0 0; opacity: 0.9;">${card.issuer} • ${card.type}</p>
                </div>
                <div class="card-body">
                    <div class="card-feature">
                        <span>Annual Fee:</span>
                        <span><strong>$${card.annualFee}</strong></span>
                    </div>
                    <div class="card-feature">
                        <span>Welcome Bonus:</span>
                        <span>${card.welcomeBonus}</span>
                    </div>
                    <div class="card-feature">
                        <span>Rewards:</span>
                        <span>${card.rewards}</span>
                    </div>
                    <div class="card-feature">
                        <span>APR Range:</span>
                        <span>${card.apr}</span>
                    </div>
                    <div class="card-feature">
                        <span>Credit Required:</span>
                        <span>${card.creditRequired}+</span>
                    </div>
                    <div class="card-feature">
                        <span>Approval Odds:</span>
                        <span style="color: ${oddsColor}; font-weight: bold;">${odds}%</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn" style="padding: 8px 15px; ${hasApplied ? 'opacity: 0.6; cursor: not-allowed;' : ''}" onclick="${hasApplied ? '' : `applyForCard(${card.id})`}" ${hasApplied ? 'disabled' : ''}>
                        ${hasApplied ? '✓ Applied' : 'Apply Now'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function loadDashboardCards() {
    if (!currentUser) return;
    
    const sortedCards = [...db.creditCards]
        .map(card => ({...card, odds: calculateApprovalOdds(card)}))
        .sort((a, b) => b.odds - a.odds)
        .slice(0, 3);
    
    displayCards(sortedCards, 'dashboardCards');
    
    if (sortedCards.length > 0) {
        const average = Math.round(sortedCards.reduce((sum, card) => sum + card.odds, 0) / sortedCards.length);
        document.getElementById('statOdds').textContent = average + '%';
    }
}

function findCards() {
    if (!currentUser) {
        showMessage('Please login first', 'error');
        return;
    }
    
    const maxFee = parseInt(document.getElementById('maxFee').value);
    const cardType = document.getElementById('cardType').value;
    const searchQuery = document.getElementById('cardSearch').value.toLowerCase().trim();
    
    let filteredCards = db.creditCards.filter(card => {
        if (card.annualFee > maxFee) return false;
        if (cardType && card.type !== cardType) return false;
        
        if (searchQuery) {
            const searchFields = [
                card.name.toLowerCase(),
                card.issuer.toLowerCase(),
                card.rewards.toLowerCase(),
                card.type.toLowerCase()
            ];
            
            const matchesSearch = searchFields.some(field => field.includes(searchQuery));
            if (!matchesSearch) return false;
        }
        
        return true;
    });
    
    filteredCards = filteredCards
        .map(card => ({...card, odds: calculateApprovalOdds(card)}))
        .sort((a, b) => b.odds - a.odds);
    
    document.getElementById('resultsCount').textContent = filteredCards.length;
    displayCards(filteredCards, 'cardsResults');
}

function resetFilters() {
    document.getElementById('maxFee').value = 500;
    document.getElementById('feeValue').textContent = '500';
    document.getElementById('cardType').value = '';
    document.getElementById('cardSearch').value = '';
    document.getElementById('cardsResults').innerHTML = '';
    document.getElementById('resultsCount').textContent = '0';
}

function applyForCard(cardId) {
    if (!currentUser) {
        showMessage('Please login first', 'error');
        return;
    }
    
    const card = db.creditCards.find(c => c.id === cardId);
    if (!card) return;
    
    const odds = calculateApprovalOdds(card);
    const application = db.createApplication(currentUser.id, cardId, odds);
    
    if (application.status === 'approved') {
        showMessage(`✅ Approved! You got ${card.name}!`, 'success');
    } else {
        showMessage(`❌ Declined for ${card.name}.`, 'error');
    }
    
    const button = event.target;
    button.disabled = true;
    button.textContent = 'Applied';
    button.style.opacity = '0.6';
    button.style.cursor = 'not-allowed';
    
    updateUserInfo();
    loadDashboardCards();
}

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('cardSearch');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                findCards();
            }
        });
    }
});

window.findCards = findCards;
window.resetFilters = resetFilters;
window.applyForCard = applyForCard;
window.loadDashboardCards = loadDashboardCards;

function loadRewardsCardDropdown() {
    const select = document.getElementById('rewardsCardSelect');
    if (!select) return;

    select.innerHTML = '<option value="">Select a card</option>';

    db.creditCards.forEach(card => {
        const option = document.createElement('option');
        option.value = card.id;
        option.textContent = `${card.name} (${card.issuer})`;
        select.appendChild(option);
    });
}

function calculateRewards() {
    const cardId = parseInt(document.getElementById('rewardsCardSelect').value);
    if (!cardId) {
        showMessage('Please select a card', 'error');
        return;
    }

    const card = db.creditCards.find(c => c.id === cardId);
    if (!card) return;

    const diningSpend = +document.getElementById('spendDining').value || 0;
    const grocerySpend = +document.getElementById('spendGroceries').value || 0;
    const travelSpend = +document.getElementById('spendTravel').value || 0;
    const otherSpend = +document.getElementById('spendOther').value || 0;

    let diningRate = card.type === 'travel' ? 0.03 : 0.02;
    let travelRate = card.type === 'travel' ? 0.03 : 0.02;

    const annualRewards =
        diningSpend * 12 * diningRate +
        grocerySpend * 12 * 0.03 +
        travelSpend * 12 * travelRate +
        otherSpend * 12 * 0.01;

    const netValue = annualRewards - card.annualFee;

    document.getElementById('rewardsResult').innerHTML = `
        <strong>${card.name}</strong><br><br>
        Estimated Annual Rewards:
        <div style="font-size:24px; color:#28a745;">
            $${Math.round(annualRewards)}
        </div>
        <div style="margin-top:10px; color:#555;">
            Annual Fee: $${card.annualFee}<br>
            <strong>Net Value:</strong>
            <span style="color:${netValue >= 0 ? '#28a745' : '#dc3545'};">
                $${Math.round(netValue)}
            </span>
        </div>
    `;
}

window.findCards = findCards;
window.resetFilters = resetFilters;
window.applyForCard = applyForCard;
window.loadDashboardCards = loadDashboardCards;
