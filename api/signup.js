import { MongoClient } from 'mongodb';
import bcryptjs from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    return client;
}

async function hashPassword(password) {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password, firstName, lastName, dateOfBirth, annualIncome, creditScore } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const client = await connectDB();
        const db = client.db('credit_card_db');
        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            await client.close();
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            dateOfBirth,
            annualIncome: parseInt(annualIncome) || 0,
            creditScore: parseInt(creditScore) || 0,
            createdAt: new Date().toISOString()
        };

        const result = await usersCollection.insertOne(newUser);
        await client.close();

        return res.status(201).json({
            id: result.insertedId.toString(),
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            creditScore: newUser.creditScore,
            annualIncome: newUser.annualIncome
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ error: 'Signup failed: ' + error.message });
    }
}
