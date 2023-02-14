const nodemailer = require('nodemailer');

module.exports = class EmailController {
    static async sendEmailWithNodemailer(email, otp) {
        const msg = {
            from: process.env.SMPT_MAIL,
            to: email,
            subject: `TRUE LIST EMAIL VERIFICATION`,
            text: `\n 
            \n YOUR EMAIL VERIFICATION OTP IS : \n
                    ${otp}
            \n`
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
}
