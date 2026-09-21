import bcrypt from 'bcrypt';
import prisma from '../../config/db.js';
import { generateOtp, getOtpExpiry, isOtpExpired } from './otp.service.js';
import { sendOtpEmail } from './mailer.js';
import jwt from 'jsonwebtoken';

export const signupUser = async ({ name, email, password }) => {
    // Check karo user already exist to nahi karta
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new Error('User already exists with this email');
    }

    // Password hash karo — kabhi plain text store nahi karte
    const hashedPassword = await bcrypt.hash(password, 10);

    // OTP generate karo
    const otp = generateOtp();
    const otpExpiresAt = getOtpExpiry();

    // User create karo, isVerified false rahega jab tak OTP verify na ho
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiresAt,
            isVerified: false,
        },
    });

    // OTP email bhejo
    sendOtpEmail(email, otp).catch(err =>
        console.error('Background email failed:', err.message)
    );

    return { id: user.id, email: user.email };
};

export const verifyOtp = async ({ email, otp }) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new Error('User not found');
    }

    if (user.isVerified) {
        throw new Error('User already verified');
    }

    if (user.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    if (isOtpExpired(user.otpExpiresAt)) {
        throw new Error('OTP has expired');
    }

    // Verify ho gaya, OTP clear karo aur isVerified true karo
    await prisma.user.update({
        where: { email },
        data: {
            isVerified: true,
            otp: null,
            otpExpiresAt: null,
        },
    });

    return { message: 'Email verified successfully' };
};

export const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    if (!user.isVerified) {
        throw new Error('Please verify your email first');
    }

    // Naya login OTP generate karo (har login pe fresh OTP)
    const otp = generateOtp();
    const otpExpiresAt = getOtpExpiry();

    await prisma.user.update({
        where: { email },
        data: { otp, otpExpiresAt },
    });

    sendOtpEmail(email, otp).catch(err =>
        console.error('Background email failed:', err.message)
    );

    return { message: 'OTP sent to your email. Please verify to complete login.' };
};

export const verifyLoginOtp = async ({ email, otp }) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new Error('User not found');
    }

    if (user.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    if (isOtpExpired(user.otpExpiresAt)) {
        throw new Error('OTP has expired');
    }

    // OTP sahi hai — clear karo aur token do
    await prisma.user.update({
        where: { email },
        data: { otp: null, otpExpiresAt: null },
    });

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        token,
        user: { id: user.id, name: user.name, email: user.email },
    };
};