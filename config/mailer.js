const { text } = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // your Gmail email address
    pass: process.env.EMAIL_PASSWORD, // your Gmail password or app password
  },
});


const mailSend = (options)=>{
    
    let { 
        file_html = "./mails/temp-mail.html",
         to = [],
        from = process.env.EMAIL_FROM || "ecomerce",
        subject = "email from ecommerce",
        text="",
        withobj={}
         } = options;
   
        to=to.length > 0?to.join(","):"";
        let info=  true;
        fs.readFile(file_html, 'utf8', async (err, data) => {

            
            const emailHTML = data.replace(/{([^{}]*)}/g, (match, key) => {
                
                return withobj[key];
            });
             info = await transporter.sendMail({
                from, // sender address
                to, // list of receivers
                subject, // Subject line
                text,
                html: emailHTML, // html body
              });
    
            });
            return  info
   
 
}

module.exports = mailSend