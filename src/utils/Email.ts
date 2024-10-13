import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path';
class Email{
     to:string;
     firstname:string
     url:string
     from:string
    constructor(user:any,url:string){
        this.to = user.email,
        this.firstname=user.firstname,
        this.url=url,
        this.from = "Estate pro <team@Estate.com>"
    }
    newTransport(){
        return nodemailer.createTransport({
            host:process.env.email_host as string,
            port:process.env.email_port,
            auth:{
                user:process.env.email_user,
                pass:process.env.email_pass
            }
        })
    }
    async sendEmail(templete:string,subject:string){
        const emaildata = {
            name:this.firstname,
            url:this.url
        } 
        const html = await ejs.renderFile(`templetes/${templete}.ejs`,emaildata)
    
        const mailoption ={
            from:this.from,
            to:this.to,
            subject,
            html
        }
        await this.newTransport().sendMail(mailoption);
    }
    async forgotpassword(){
        await this.sendEmail("Forgotpassword","password reset link")
    }
}
export default Email