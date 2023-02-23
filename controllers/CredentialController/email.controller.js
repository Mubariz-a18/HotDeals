const nodemailer = require('nodemailer');

module.exports = class EmailController {
    static async sendEmailWithNodemailer(email, otp, userName) {
        const msg = {
            from: "syedmubariz542@gmail.com",
            to: email,
            subject: "Please Verify Your Email Address",
            html: `<b>Dear ${userName},\n</b>
                    <p>    
                    We appreciate that you have signed up for our service. Please verify your email address by using the 6-digit code provided below:  <b>${otp}</b><br><br>
                    If you have any questions or need further assistance, please do not hesitate to contact us via our Help Center. Our support team will be happy to assist you.
                    </p>
                    <span>Thank you for choosing our service.</span><br>
                    <span> Best regards,</span><br>
                    <span> TrueList</span>`,

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
