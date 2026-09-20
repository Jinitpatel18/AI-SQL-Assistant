import axiosInstance from './axiosInstance';
import type { AuthResponse } from '../types';

export const signupApi = (name: string, email: string, password: string) => {
    return axiosInstance.post('/auth/signup', { name, email, password });
};

export const verifyOtpApi = (email: string, otp: string) => {
    return axiosInstance.post('/auth/verify-otp', { email, otp });
};

export const loginApi = (email: string, password: string) => {
    return axiosInstance.post('/auth/login', { email, password });
};

export const verifyLoginOtpApi = (email: string, otp: string): Promise<{ data: AuthResponse }> => {
    return axiosInstance.post('/auth/verify-login-otp', { email, otp });
};