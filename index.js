const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
}
let db;

const client = new MongoClient(MONGODB_URI);

async function connectDB() {
    try {
        await client.connect();
        db = client.db('credit_card_db');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

connectDB();

async function hashPassword(password) {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
}

async function verifyPassword(inputPassword, hashedPassword) {
    return await bcryptjs.compare(inputPassword, hashedPassword);
}

app.post('/api/signup', async (req, res) => {
    try {
        const { email, password, firstName, lastName, dateOfBirth, annualIncome, creditScore } = req.body;

        const usersCollection = db.collection('users');
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            dateOfBirth,
            annualIncome: parseInt(annualIncome),
            creditScore: parseInt(creditScore),
            createdAt: new Date().toISOString()
        };

        const result = await usersCollection.insertOne(newUser);

        res.status(201).json({
            id: result.insertedId,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            creditScore: newUser.creditScore,
            annualIncome: newUser.annualIncome
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Signup failed' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            creditScore: user.creditScore,
            annualIncome: user.annualIncome
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/apply', async (req, res) => {
    try {
        const { userId, cardId, approvalOdds, status } = req.body;

        const applicationsCollection = db.collection('applications');

        const newApplication = {
            userId,
            cardId,
            approvalOdds,
            status,
            date: new Date().toISOString()
        };

        const result = await applicationsCollection.insertOne(newApplication);

        res.status(201).json({
            id: result.insertedId,
            ...newApplication
        });
    } catch (error) {
        console.error('Application error:', error);
        res.status(500).json({ error: 'Application failed' });
    }
});

app.get('/api/applications/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const applicationsCollection = db.collection('applications');
        const applications = await applicationsCollection.find({ userId }).toArray();

        res.json(applications);
    } catch (error) {
        console.error('Fetch applications error:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

app.post('/api/profile/update', async (req, res) => {
    try {
        const { userId, annualIncome, creditScore } = req.body;

        const usersCollection = db.collection('users');
        const result = await usersCollection.updateOne(
            { _id: new (require('mongodb')).ObjectId(userId) },
            { $set: { annualIncome: parseInt(annualIncome), creditScore: parseInt(creditScore) } }
        );

        res.json({ success: result.modifiedCount > 0 });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Profile update failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
