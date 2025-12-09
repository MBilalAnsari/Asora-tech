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
        text: `Aapka Password Reset OTP code hai: ${otpCode}. Ye 2 minute mein expire ho jayega.`,
        html: `
            <p>Aapke Password Reset ke liye OTP code neeche diya gaya hai:</p>
            <h2><b>${otpCode}</b></h2>
            <p>Ye code <b>2 minutes</b> mein expire ho jayega. Agar aapne yeh request nahi ki, toh is email ko ignore kar dein.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP Email successfully sent to ' + toEmail);
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Email bhejte waqt galti hui');
    }
};

export default { sendOtpEmail };