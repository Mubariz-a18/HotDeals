const nodemailer = require('nodemailer');

module.exports = class EmailController {
    static async sendEmailWithNodemailer(email, otp, userName) {
        const msg = {
            from: process.env.SMPT_MAIL,
            to: email,
            subject: "Please Verify Your Email Address",
            html: `<b>Dear ${userName},\n</b>
                    <p>    
                    We appreciate that you have signed up for our service. Please verify your email address by using the 6-digit code provided Here:  <b>${otp}</b><br><br>
                    If you have any questions or need further assistance, please do not hesitate to contact us via our Help Center. Our support team will be happy to assist you.
                    </p>
                    <span>Thank you for choosing our service.</span><br>
                    <span> Best regards,</span><br>
                    <span> HotDeals</span>`,

        }

        const emailSetup = nodemailer.createTransport({
            service: process.env.SMPT_SERVICE,
            auth: {
                user: process.env.SMPT_MAIL,
                pass: process.env.SMPT_PASSWORD,
            },
            port: process.env.SMPT_PORT,
            host: process.env.SMPT_HOST
        })
        const sentEmail = await emailSetup.sendMail(msg)

        return sentEmail
    }
    static async sendAttackReport(ip) {
        const msg = {
            from: process.env.SMPT_MAIL,
            to: process.env.COMPANY_MAIL,
            subject: "Attack Report",
            html: `<b>Dear Admin,\n</b>
                    <p>    
                    This <b> IP Address : ${ip}</b> is trying to call the razorpay payout webhoo with unknown payload<br><br>
                    `,
        }
        try {
            const emailSetup = nodemailer.createTransport({
                service: process.env.SMPT_SERVICE,
                auth: {
                    user: process.env.SMPT_MAIL,
                    pass: process.env.SMPT_PASSWORD,
                },
                port: process.env.SMPT_PORT,
                host: process.env.SMPT_HOST
            })
            await emailSetup.sendMail(msg)
        } catch (e) {
            console.log(e)
        }

    }
}
