import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});


const sendOtpEmail = async (toEmail, otpCode) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: toEmail, 
        subject: 'Password Reset OTP', 
        text: `Your Password Reset OTP code is: ${otpCode}. It will expire in 2 minutes.`,
        html: `
            <p>Your OTP code for Password Reset is given below:</p>
            <h2><b>${otpCode}</b></h2>
            <p>This code will expire in <b>2 minutes</b>. If you did not request this, please ignore this email.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP Email successfully sent to ' + toEmail);
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Error while sending email');
    }
};

export default { sendOtpEmail };
