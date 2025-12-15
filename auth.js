let currentUser = null;

function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-tab').forEach(t => {
        if (t.textContent.toLowerCase().includes(tab)) t.classList.add('active');
    });
    
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('verifyForm').classList.remove('active');
    document.getElementById(tab + 'Form').classList.add('active');
}

function showMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        if (!user.emailVerified) {
            showMessage('Please verify your email first. Check your inbox for verification link.', 'error');
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('verifyForm').style.display = 'block';
            document.getElementById('verifyEmail').textContent = email;
            return;
        }
        
        loadUserData(user);
        showApp();
        showMessage('Login successful! Welcome back', 'success');
        
    } catch (error) {
        showMessage(getErrorMessage(error), 'error');
    }
}

async function handleSignup(event) {
    event.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const firstName = document.getElementById('signupFirstName').value;
    const lastName = document.getElementById('signupLastName').value;
    const annualIncome = parseInt(document.getElementById('signupIncome').value);
    const creditScore = parseInt(document.getElementById('signupCreditScore').value);
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (creditScore < 300 || creditScore > 850) {
        showMessage('Credit score must be between 300 and 850', 'error');
        return;
    }
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        await user.updateProfile({
            displayName: firstName + ' ' + lastName
        });
        
        const userData = {
            uid: user.uid,
            email: email,
            firstName: firstName,
            lastName: lastName,
            annualIncome: annualIncome,
            creditScore: creditScore,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('user_' + user.uid, JSON.stringify(userData));
        
        await user.sendEmailVerification({
            url: window.location.origin + window.location.pathname
        });
        
        showMessage('Account created! Check your email to verify your account.', 'success');
        
        document.getElementById('signupForm').style.display = 'none';
        document.getElementById('verifyForm').style.display = 'block';
        document.getElementById('verifyEmail').textContent = email;
        document.getElementById('verifyMessage').textContent = 'We sent a verification link to ' + email + '. Click the link in your email to verify your account.';
        
    } catch (error) {
        showMessage(getErrorMessage(error), 'error');
    }
}

async function resendVerificationEmail() {
    try {
        const user = auth.currentUser;
        if (user) {
            await user.sendEmailVerification({
                url: window.location.origin + window.location.pathname
            });
            showMessage('Verification email sent! Check your inbox.', 'success');
        }
    } catch (error) {
        showMessage('Error sending verification email: ' + error.message, 'error');
    }
}

async function logout() {
    try {
        await auth.signOut();
        currentUser = null;
        showAuth();
        showMessage('Logged out successfully', 'info');
    } catch (error) {
        showMessage('Error logging out: ' + error.message, 'error');
    }
}

function showApp() {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('appScreen').classList.remove('hidden');
    updateUserInfo();
    showPage('dashboard');
    loadDashboardCards();
}

function showAuth() {
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('appScreen').classList.add('hidden');
    switchTab('login');
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('verifyForm').style.display = 'none';
}

function loadUserData(firebaseUser) {
    const userData = localStorage.getItem('user_' + firebaseUser.uid);
    
    if (userData) {
        currentUser = JSON.parse(userData);
        currentUser.uid = firebaseUser.uid;
        currentUser.email = firebaseUser.email;
    } else {
        currentUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
            lastName: firebaseUser.displayName?.split(' ')[1] || '',
            annualIncome: 50000,
            creditScore: 700,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('user_' + firebaseUser.uid, JSON.stringify(currentUser));
    }
}

auth.onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            loadUserData(user);
            showApp();
        } else {
            showAuth();
            showMessage('Please verify your email to access your account', 'error');
        }
    } else {
        currentUser = null;
        showAuth();
    }
});

function getErrorMessage(error) {
    const errorCode = error.code;
    
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'Email already in use. Try logging in instead.';
        case 'auth/invalid-email':
            return 'Invalid email address.';
        case 'auth/weak-password':
            return 'Password is too weak. Use at least 6 characters.';
        case 'auth/user-not-found':
            return 'Email not found. Check your email or sign up.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/too-many-login-attempts':
            return 'Too many login attempts. Try again later.';
        default:
            return error.message;
    }
}

window.switchTab = switchTab;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.resendVerificationEmail = resendVerificationEmail;
window.logout = logout;