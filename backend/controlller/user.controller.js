import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Secret key for JWT
const SECRET_KEY = process.env.SECRET_KEY || 'yourSecretKey';

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { userId, password, name, role } = req.body;

       
        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

       
        const newUser = await User.create({
            userId,
            password: hashedPassword,
            name,
            role,
        });

        return res.status(201).json({
            message: 'User registered successfully',
            user: { userId: newUser.userId, name: newUser.name, role: newUser.role },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { userId, password } = req.body;

        
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

       
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        
        const token = jwt.sign(
            { userId: user.userId, role: user.role },
            SECRET_KEY,
            { expiresIn: '1h' } 
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: { userId: user.userId, name: user.name, role: user.role },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
