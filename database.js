class SimpleDB {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('cc_users')) || [];
        this.applications = JSON.parse(localStorage.getItem('cc_applications')) || [];
        this.sessions = JSON.parse(localStorage.getItem('cc_sessions')) || [];
        
        if (this.users.length === 0) {
            this.createDemoUser();
        }
        
        //Credit card data had to sadly get it manually
        this.creditCards = [
            {
                id: 1,
                name: "Chase Sapphire Preferred",
                issuer: "Chase",
                type: "travel",
                annualFee: 95,
                welcomeBonus: "60,000 points",
                rewards: "3x dining, 2x travel",
                apr: "21.49%-28.49%",
                creditRequired: 670,
                incomeRequired: 30000
            },
            {
                id: 2,
                name: "Chase Sapphire Reserve",
                issuer: "Chase",
                type: "premium",
                annualFee: 550,
                welcomeBonus: "60,000 points",
                rewards: "3x travel, 3x dining",
                apr: "22.49%-29.49%",
                creditRequired: 740,
                incomeRequired: 60000
            },
            {
                id: 3,
                name: "Chase Freedom Unlimited",
                issuer: "Chase",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "$200 cash back",
                rewards: "1.5% on all purchases",
                apr: "20.49%-29.24%",
                creditRequired: 660,
                incomeRequired: 25000
            },
            {
                id: 4,
                name: "Chase Freedom Flex",
                issuer: "Chase",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "$200 cash back",
                rewards: "5% rotating categories",
                apr: "20.49%-29.24%",
                creditRequired: 660,
                incomeRequired: 25000
            },
        
            {
                id: 5,
                name: "Amex Platinum",
                issuer: "American Express",
                type: "premium",
                annualFee: 695,
                welcomeBonus: "80,000 points",
                rewards: "5x flights, 5x hotels",
                apr: "See agreement",
                creditRequired: 700,
                incomeRequired: 60000
            },
            {
                id: 6,
                name: "Amex Gold",
                issuer: "American Express",
                type: "travel",
                annualFee: 250,
                welcomeBonus: "60,000 points",
                rewards: "4x dining, 4x groceries",
                apr: "See agreement",
                creditRequired: 690,
                incomeRequired: 40000
            },
            {
                id: 7,
                name: "Blue Cash Preferred",
                issuer: "American Express",
                type: "cashback",
                annualFee: 95,
                welcomeBonus: "$250 cash back",
                rewards: "6% groceries, 6% streaming",
                apr: "19.24%-29.99%",
                creditRequired: 670,
                incomeRequired: 30000
            },
            {
                id: 8,
                name: "Blue Cash Everyday",
                issuer: "American Express",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "$200 cash back",
                rewards: "3% groceries, gas, online retail",
                apr: "19.24%-29.99%",
                creditRequired: 660,
                incomeRequired: 25000
            },
        
            {
                id: 9,
                name: "Capital One Venture X",
                issuer: "Capital One",
                type: "premium",
                annualFee: 395,
                welcomeBonus: "75,000 miles",
                rewards: "10x hotels, 5x flights",
                apr: "20.99%-28.99%",
                creditRequired: 740,
                incomeRequired: 50000
            },
            {
                id: 10,
                name: "Capital One Venture",
                issuer: "Capital One",
                type: "travel",
                annualFee: 95,
                welcomeBonus: "75,000 miles",
                rewards: "2x on all purchases",
                apr: "20.99%-28.99%",
                creditRequired: 690,
                incomeRequired: 35000
            },
            {
                id: 11,
                name: "Capital One Quicksilver",
                issuer: "Capital One",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "$200 cash back",
                rewards: "1.5% on all purchases",
                apr: "19.99%-29.99%",
                creditRequired: 650,
                incomeRequired: 20000
            },
            {
                id: 12,
                name: "Capital One SavorOne",
                issuer: "Capital One",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "$200 cash back",
                rewards: "3% dining, entertainment, groceries",
                apr: "19.99%-29.99%",
                creditRequired: 670,
                incomeRequired: 25000
            },
        
            {
                id: 13,
                name: "Citi Double Cash",
                issuer: "Citi",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "$200 cash back",
                rewards: "2% on all purchases",
                apr: "19.24%-29.24%",
                creditRequired: 670,
                incomeRequired: 25000
            },
            {
                id: 14,
                name: "Citi Custom Cash",
                issuer: "Citi",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "$200 cash back",
                rewards: "5% on top spending category",
                apr: "19.24%-29.24%",
                creditRequired: 670,
                incomeRequired: 25000
            },
            {
                id: 15,
                name: "Citi Premier",
                issuer: "Citi",
                type: "travel",
                annualFee: 95,
                welcomeBonus: "60,000 points",
                rewards: "3x travel, gas, dining",
                apr: "21.24%-29.24%",
                creditRequired: 690,
                incomeRequired: 35000
            },
        
            {
                id: 16,
                name: "Discover it Cash Back",
                issuer: "Discover",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "Cashback Match",
                rewards: "5% rotating categories",
                apr: "17.24%-28.24%",
                creditRequired: 660,
                incomeRequired: 20000
            },
            {
                id: 17,
                name: "Discover it Student Cash Back",
                issuer: "Discover",
                type: "student",
                annualFee: 0,
                welcomeBonus: "Cashback Match",
                rewards: "5% rotating categories",
                apr: "17.24%-28.24%",
                creditRequired: 600,
                incomeRequired: 0
            },
        
            {
                id: 18,
                name: "Wells Fargo Active Cash",
                issuer: "Wells Fargo",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "$200 cash rewards",
                rewards: "2% on all purchases",
                apr: "20.24%-29.99%",
                creditRequired: 670,
                incomeRequired: 25000
            },
            {
                id: 19,
                name: "Wells Fargo Autograph",
                issuer: "Wells Fargo",
                type: "travel",
                annualFee: 0,
                welcomeBonus: "30,000 points",
                rewards: "3x travel, dining, gas",
                apr: "20.24%-29.99%",
                creditRequired: 670,
                incomeRequired: 30000
            },
        
            {
                id: 20,
                name: "Bank of America Customized Cash",
                issuer: "Bank of America",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "$200 cash rewards",
                rewards: "3% category of choice",
                apr: "18.74%-28.74%",
                creditRequired: 670,
                incomeRequired: 25000
            },
            {
                id: 21,
                name: "Bank of America Travel Rewards",
                issuer: "Bank of America",
                type: "travel",
                annualFee: 0,
                welcomeBonus: "25,000 points",
                rewards: "1.5x on all purchases",
                apr: "18.74%-28.74%",
                creditRequired: 670,
                incomeRequired: 25000
            },
        
            {
                id: 22,
                name: "Capital One Platinum",
                issuer: "Capital One",
                type: "starter",
                annualFee: 0,
                welcomeBonus: "None",
                rewards: "No rewards",
                apr: "26.99%",
                creditRequired: 580,
                incomeRequired: 0
            },
            {
                id: 23,
                name: "Discover it Secured",
                issuer: "Discover",
                type: "secured",
                annualFee: 0,
                welcomeBonus: "Cashback Match",
                rewards: "2% gas & restaurants",
                apr: "24.99%",
                creditRequired: 550,
                incomeRequired: 0
            },
            {
                id: 24,
                name: "Chase Ink Business Cash",
                issuer: "Chase",
                type: "business",
                annualFee: 0,
                welcomeBonus: "$750 cash back",
                rewards: "5% office supply, internet",
                apr: "21.49%-26.49%",
                creditRequired: 700,
                incomeRequired: 40000
            },
            {
                id: 25,
                name: "Chase Ink Business Preferred",
                issuer: "Chase",
                type: "business",
                annualFee: 95,
                welcomeBonus: "100,000 points",
                rewards: "3x travel, shipping, ads",
                apr: "21.49%-26.49%",
                creditRequired: 720,
                incomeRequired: 50000
            },
            {
                id: 26,
                name: "Amex Business Gold",
                issuer: "American Express",
                type: "business",
                annualFee: 375,
                welcomeBonus: "70,000 points",
                rewards: "4x top business categories",
                apr: "See agreement",
                creditRequired: 720,
                incomeRequired: 60000
            },
            {
                id: 27,
                name: "Amex Blue Business Plus",
                issuer: "American Express",
                type: "business",
                annualFee: 0,
                welcomeBonus: "15,000 points",
                rewards: "2x on all purchases",
                apr: "See agreement",
                creditRequired: 690,
                incomeRequired: 35000
            },
            {
                id: 28,
                name: "Capital One Spark Cash Plus",
                issuer: "Capital One",
                type: "business",
                annualFee: 150,
                welcomeBonus: "$1,000 cash back",
                rewards: "2% on all purchases",
                apr: "N/A (charge card)",
                creditRequired: 720,
                incomeRequired: 60000
            },
            {
                id: 29,
                name: "Capital One Spark Miles",
                issuer: "Capital One",
                type: "business",
                annualFee: 95,
                welcomeBonus: "50,000 miles",
                rewards: "2x on all purchases",
                apr: "20.99%-28.99%",
                creditRequired: 700,
                incomeRequired: 50000
            },
            {
                id: 30,
                name: "Citi Rewards+",
                issuer: "Citi",
                type: "travel",
                annualFee: 0,
                welcomeBonus: "20,000 points",
                rewards: "2x supermarkets & gas",
                apr: "19.24%-29.24%",
                creditRequired: 660,
                incomeRequired: 25000
            },
            {
                id: 31,
                name: "Citi Secured Mastercard",
                issuer: "Citi",
                type: "secured",
                annualFee: 0,
                welcomeBonus: "None",
                rewards: "No rewards",
                apr: "22.49%",
                creditRequired: 550,
                incomeRequired: 0
            },
            {
                id: 32,
                name: "Wells Fargo Reflect",
                issuer: "Wells Fargo",
                type: "low_apr",
                annualFee: 0,
                welcomeBonus: "None",
                rewards: "No rewards",
                apr: "18.24%-29.99%",
                creditRequired: 670,
                incomeRequired: 25000
            },
            {
                id: 33,
                name: "U.S. Bank Cash+",
                issuer: "U.S. Bank",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "$200 cash back",
                rewards: "5% rotating categories",
                apr: "19.24%-29.24%",
                creditRequired: 680,
                incomeRequired: 30000
            },
            {
                id: 34,
                name: "U.S. Bank Altitude Go",
                issuer: "U.S. Bank",
                type: "travel",
                annualFee: 0,
                welcomeBonus: "$200 bonus",
                rewards: "4x dining",
                apr: "19.24%-29.24%",
                creditRequired: 680,
                incomeRequired: 30000
            },
            {
                id: 35,
                name: "U.S. Bank Altitude Reserve",
                issuer: "U.S. Bank",
                type: "premium",
                annualFee: 400,
                welcomeBonus: "50,000 points",
                rewards: "3x mobile wallet",
                apr: "20.49%-28.49%",
                creditRequired: 740,
                incomeRequired: 60000
            },
            {
                id: 36,
                name: "Apple Card",
                issuer: "Goldman Sachs",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "Daily Cash",
                rewards: "2% Apple Pay, 3% Apple",
                apr: "19.24%-29.49%",
                creditRequired: 660,
                incomeRequired: 25000
            },
            {
                id: 37,
                name: "Amazon Prime Rewards Visa",
                issuer: "Chase",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "$150 Amazon gift card",
                rewards: "5% Amazon, Whole Foods",
                apr: "19.49%-28.49%",
                creditRequired: 670,
                incomeRequired: 30000
            },
            {
                id: 38,
                name: "PayPal Cashback Mastercard",
                issuer: "Synchrony",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "$100 bonus",
                rewards: "2% on all purchases",
                apr: "19.24%-29.24%",
                creditRequired: 650,
                incomeRequired: 20000
            },
            {
                id: 39,
                name: "SoFi Credit Card",
                issuer: "SoFi",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "$200 bonus",
                rewards: "2% unlimited cash back",
                apr: "18.24%-29.99%",
                creditRequired: 680,
                incomeRequired: 30000
            },
            {
                id: 40,
                name: "Petal 2 Visa",
                issuer: "Petal",
                type: "starter",
                annualFee: 0,
                welcomeBonus: "None",
                rewards: "1–1.5% cash back",
                apr: "18.24%-29.49%",
                creditRequired: 600,
                incomeRequired: 0
            },
            {
                id: 41,
                name: "Petal 1 Visa",
                issuer: "Petal",
                type: "starter",
                annualFee: 0,
                welcomeBonus: "None",
                rewards: "No rewards",
                apr: "19.24%-29.49%",
                creditRequired: 580,
                incomeRequired: 0
            },
            {
                id: 42,
                name: "Deserve EDU Mastercard",
                issuer: "Deserve",
                type: "student",
                annualFee: 0,
                welcomeBonus: "None",
                rewards: "1% cash back",
                apr: "18.24%-25.24%",
                creditRequired: 580,
                incomeRequired: 0
            },
            {
                id: 43,
                name: "Capital One Journey",
                issuer: "Capital One",
                type: "student",
                annualFee: 0,
                welcomeBonus: "None",
                rewards: "1% cash back",
                apr: "26.99%",
                creditRequired: 580,
                incomeRequired: 0
            },
            {
                id: 44,
                name: "Bank of America Unlimited Cash",
                issuer: "Bank of America",
                type: "cashback",
                annualFee: 0,
                welcomeBonus: "$200 bonus",
                rewards: "1.5% on all purchases",
                apr: "18.74%-28.74%",
                creditRequired: 660,
                incomeRequired: 25000
            },
            {
                id: 45,
                name: "Bank of America Premium Rewards",
                issuer: "Bank of America",
                type: "travel",
                annualFee: 95,
                welcomeBonus: "50,000 points",
                rewards: "2x travel & dining",
                apr: "20.24%-28.24%",
                creditRequired: 700,
                incomeRequired: 40000
            }

        ];
        
    }
    
    createDemoUser() {
        const demoUser = {
            id: 1,
            email: "demo@example.com",
            password: "demo123_hashed", 
            firstName: "Demo",
            lastName: "User",
            annualIncome: 75000,
            creditScore: 720,
            createdAt: new Date().toISOString()
        };
        this.users.push(demoUser);
        this.save();
    }
    
    async hashPassword(password) {
        return password.split('').reverse().join('') + '_hashed';
    }
    
    async verifyPassword(input, stored) {
        const hashedInput = input.split('').reverse().join('') + '_hashed';
        return hashedInput === stored;
    }
    
    findUser(email) {
        return this.users.find(u => u.email === email);
    }
    
    createUser(userData) {
        const newUser = {
            id: this.users.length + 1,
            ...userData,
            createdAt: new Date().toISOString()
        };
        this.users.push(newUser);
        this.save();
        return newUser;
    }
    
    createApplication(userId, cardId, approvalOdds) {
        const application = {
            id: this.applications.length + 1,
            userId,
            cardId,
            approvalOdds,
            status: this.determineApprovalStatus(approvalOdds),
            date: new Date().toISOString()
        };
        this.applications.push(application);
        this.save();
        return application;
    }
    
    determineApprovalStatus(approvalOdds) {
        const random = Math.random() * 100;
        if (random < approvalOdds) {
            return 'approved';
        } else {
            return 'declined';
        }
    }
    
    getUserApplications(userId) {
        return this.applications.filter(app => app.userId === userId);
    }
    
    updateUser(userId, updates) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            Object.assign(user, updates);
            this.save();
            return user;
        }
        return null;
    }
    
    save() {
        localStorage.setItem('cc_users', JSON.stringify(this.users));
        localStorage.setItem('cc_applications', JSON.stringify(this.applications));
        localStorage.setItem('cc_sessions', JSON.stringify(this.sessions));
    }
}

const db = new SimpleDB();