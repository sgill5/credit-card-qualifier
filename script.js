function showPage(page) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.textContent.includes(page.charAt(0).toUpperCase() + page.slice(1).replace('cards', 'Cards'))) {
            btn.classList.add('active');
        }
    });
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page + 'Page').classList.add('active');
    
    if (page === 'dashboard') {
        loadDashboardCards();
    } else if (page === 'applications') {
        loadApplications();
    }
}

function updateUserInfo() {
    if (!currentUser) return;
    
    document.getElementById('userName').textContent = currentUser.firstName;
    document.getElementById('greetingName').textContent = currentUser.firstName;
    document.getElementById('profileName').textContent = currentUser.firstName + ' ' + currentUser.lastName;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileIncome').value = currentUser.annualIncome;
    document.getElementById('profileCreditScore').value = currentUser.creditScore;
    
    document.getElementById('statScore').textContent = currentUser.creditScore;
    document.getElementById('statIncome').textContent = '$' + currentUser.annualIncome.toLocaleString();
    
    const apps = db.getUserApplications(currentUser.id);
    document.getElementById('statApps').textContent = apps.length;
    document.getElementById('profileApps').textContent = apps.length;
}

function loadApplications() {
    if (!currentUser) return;
    
    const applications = db.getUserApplications(currentUser.id);
    const container = document.getElementById('applicationsList');
    
    if (applications.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px;">📄</div>
                <h3>No Applications Yet</h3>
                <p>You haven't applied for any cards yet.</p>
                <button class="btn" onclick="showPage('cards')">Find Cards to Apply</button>
            </div>
        `;
        return;
    }
    
    const approved = applications.filter(app => app.status === 'approved');
    const declined = applications.filter(app => app.status === 'declined');
    
    let html = '';
    
    if (approved.length > 0) {
        html += '<div style="margin-bottom: 40px;">';
        html += '<h3 style="color: #28a745; margin-bottom: 20px;">✅ Approved Cards (' + approved.length + ')</h3>';
        html += approved.map(app => {
            const card = db.creditCards.find(c => c.id === app.cardId);
            if (!card) return '';
            
            return `
                <div class="card" style="margin-bottom: 15px; border-left: 5px solid #28a745;">
                    <div class="card-body">
                        <h3 style="margin: 0 0 10px; color: #28a745;">🎉 ${card.name}</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                            <div>
                                <strong>Issuer:</strong><br>
                                ${card.issuer}
                            </div>
                            <div>
                                <strong>Applied:</strong><br>
                                ${new Date(app.date).toLocaleDateString()}
                            </div>
                            <div>
                                <strong>Annual Fee:</strong><br>
                                $${card.annualFee}
                            </div>
                            <div>
                                <strong>Approval Odds:</strong><br>
                                <span style="color: #28a745; font-weight: bold;">${app.approvalOdds}%</span>
                            </div>
                        </div>
                        <div>
                            <strong>Status:</strong>
                            <span style="padding: 4px 12px; background: #d4edda; color: #28a745; border-radius: 20px; margin-left: 10px; font-weight: bold;">
                                APPROVED ✓
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        html += '</div>';
    }
    
    if (declined.length > 0) {
        html += '<div style="margin-bottom: 40px;">';
        html += '<h3 style="color: #dc3545; margin-bottom: 20px;">❌ Declined Applications (' + declined.length + ')</h3>';
        html += declined.map(app => {
            const card = db.creditCards.find(c => c.id === app.cardId);
            if (!card) return '';
            
            return `
                <div class="card" style="margin-bottom: 15px; border-left: 5px solid #dc3545; opacity: 0.8;">
                    <div class="card-body">
                        <h3 style="margin: 0 0 10px; color: #666;">📄 ${card.name}</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                            <div>
                                <strong>Issuer:</strong><br>
                                ${card.issuer}
                            </div>
                            <div>
                                <strong>Applied:</strong><br>
                                ${new Date(app.date).toLocaleDateString()}
                            </div>
                            <div>
                                <strong>Annual Fee:</strong><br>
                                $${card.annualFee}
                            </div>
                            <div>
                                <strong>Approval Odds:</strong><br>
                                <span style="color: #dc3545; font-weight: bold;">${app.approvalOdds}%</span>
                            </div>
                        </div>
                        <div>
                            <strong>Status:</strong>
                            <span style="padding: 4px 12px; background: #f8d7da; color: #dc3545; border-radius: 20px; margin-left: 10px; font-weight: bold;">
                                DECLINED ✗
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        html += '</div>';
    }
    
    container.innerHTML = html;
}

function updateProfile(event) {
    event.preventDefault();
    if (!currentUser) return;
    
    const annualIncome = parseInt(document.getElementById('profileIncome').value);
    const creditScore = parseInt(document.getElementById('profileCreditScore').value);
    
    if (creditScore < 300 || creditScore > 850) {
        showMessage('Credit score must be between 300 and 850', 'error');
        return;
    }
    
    db.updateUser(currentUser.id, { annualIncome, creditScore });
    currentUser.annualIncome = annualIncome;
    currentUser.creditScore = creditScore;
    
    updateUserInfo();
    loadDashboardCards(); 
    showMessage('Profile updated successfully!', 'success');
}

window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            showApp();
        } catch (e) {
            console.error('Error loading saved user:', e);
            showAuth();
        }
    }
    
    window.showPage = showPage;
    window.updateProfile = updateProfile;
});