import crypto from 'crypto';
import nodemailer from 'nodemailer';
import UE from '../models/UserEnterprise.js';

const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;

export const generateApiKey = async (email_comercial: string) => {
    const apiKey = crypto.randomBytes(32).toString('hex');
    await UE.update({ api_key: apiKey }, { where: { email_comercial } });
    return apiKey;
};

export const sendApiKeyEmail = async (email: string, apiKey: string) => {
    const transporter = nodemailer.createTransport({
        host: MAIL_HOST,
        port: Number(MAIL_PORT),// true for 465, false for other ports
        secure: false, 
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS
        }
    });

    const mailOptions = {
        from: MAIL_USER,
        to: email,
        subject: 'Sua API Key',
        text: `Sua API Key é: ${apiKey}`
    };

    await transporter.sendMail(mailOptions);
};

export const verifyApiKey = async (apiKey: string) => {
    const user = await UE.findOne({ where: { api_key: apiKey } });
    return user;
};
