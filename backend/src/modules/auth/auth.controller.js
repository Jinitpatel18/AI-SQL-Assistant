import { signupUser, verifyOtp, loginUser, verifyLoginOtp } from './auth.service.js';

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }

        const result = await signupUser({ name, email, password });

        res.status(201).json({
            message: 'Signup successful. OTP sent to your email.',
            user: result,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const verifyOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const result = await verifyOtp({ email, otp });

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await loginUser({ email, password });

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const verifyLoginOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const result = await verifyLoginOtp({ email, otp });

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};