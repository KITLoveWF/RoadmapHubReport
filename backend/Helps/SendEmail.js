import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import promises from 'bluebird';
import { Resend } from 'resend';
dotenv.config();
const resend = new Resend(process.env.RESEND_API);
export async function SendEmail(mailData) {
    const { to, text, html } = mailData;
    try {
        const data = await resend.emails.send({
            from: 'RoadmapHub Support <no-reply@nengoilahoang.io.vn>',
            to: to, // Email người nhận
            subject: 'Email Verification',
            html: html,
            text: text
        });
        if (data.error) {
            console.error("❌ Resend Error:", data.error);
            return false;
        }
        console.log("✅ Email sent successfully via Resend ID:", data.data.id);
        return true;
    } catch (error) {
        console.error("❌ Email sending failed:", error);
        return false;
    }
}

// export function SendEmail(mailData){
//     const { to, text, html } = mailData;
//     const transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',  // Dùng host cụ thể thay vì service: 'gmail'
//         port: 465,
//         //port: 587,               // Cổng chuẩn cho TLS
//         secure: true,           // false cho cổng 587 (true cho cổng 465)
//         // service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD
//         },
//         family: 4, // Use IPv4, tránh IPv6 nếu có vấn đề
//         // Thêm log để debug xem nó chết ở đâu
//         debug: true,
//         logger: true
//     });

//     const mailConfigurations = {
//         // It should be a string of sender/server email
//         from: process.env.EMAIL_USERNAME,

//         to: to, // receiver email

//         // Subject of Email
//         subject: 'Email Verification',
        
//         // This would be the text of email body
//         text: text,

//         html: html,
//     };
//     return new promises((resolve, reject) => {
//         transporter.sendMail(mailConfigurations, function(error, info){
//             if (error) {
//                 console.error(error);
//                 return resolve(false); // hoặc reject(error) nếu muốn bắt lỗi riêng
//             }
//             //console.log('Email Sent Successfully');
//             //console.log(info);
//             return resolve(true);
//         });
//     });
// }