import nodemailer from 'nodemailer';
import ejs from 'ejs';
class Email {
    constructor(user, url) {
        this.to = user.email,
            this.firstname = user.firstname,
            this.url = url,
            this.from = "Estate pro <team@Estate.com>";
    }
    newTransport() {
        return nodemailer.createTransport({
            host: process.env.email_host,
            port: process.env.email_port,
            auth: {
                user: process.env.email_user,
                pass: process.env.email_pass
            }
        });
    }
    async sendEmail(templete, subject) {
        const emaildata = {
            name: this.firstname,
            url: this.url
        };
        const html = await ejs.renderFile(`templetes/${templete}.ejs`, emaildata);
        const mailoption = {
            from: this.from,
            to: this.to,
            subject,
            html
        };
        await this.newTransport().sendMail(mailoption);
    }
    async forgotpassword() {
        await this.sendEmail("Forgotpassword", "password reset link");
    }
}
export default Email;
