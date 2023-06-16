import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class nodemailerService {
   private transporter: nodemailer.Transporter;
      constructor() {
     this.transporter = nodemailer.createTransport({
      
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
            user:  "b149831344194c",
            pass: "b87060d9bd0837"

           },
      });
   }
   async sendMail(email,verifyOTP) {

    console.log(email,verifyOTP);
    
       await this.transporter.sendMail({
       
        from: 'priya@gmail.com',
        to:`priya@gmail.com`,
        subject: 'Verify your email address',
        html:`<p>This is your OTP ${verifyOTP} </p>`
    });
 }
   
 generateVerificationCode() {
     const code = Math.floor(100000 + Math.random() * 900000);
         return code.toString();
}
}