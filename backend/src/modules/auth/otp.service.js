export const generateOtp = () => {
    // 6-digit random OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getOtpExpiry = () => {
    // Abhi se 5 minute baad expire hoga
    return new Date(Date.now() + 5 * 60 * 1000);
};

export const isOtpExpired = (expiryDate) => {
    return new Date() > new Date(expiryDate);
};