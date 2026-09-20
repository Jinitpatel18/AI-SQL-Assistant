import express from 'express';
import { signup, verifyOtpController, login, verifyLoginOtpController } from './auth.controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';


const router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOtpController);
router.post('/login', login);
router.post('/verify-login-otp', verifyLoginOtpController);

router.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: 'Protected route accessed', user: req.user });
});

export default router;