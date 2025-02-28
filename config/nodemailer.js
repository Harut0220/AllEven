import nodemailer from "nodemailer";
import dotenv from "dotenv";
import hbs from "nodemailer-express-handlebars"
dotenv.config()




let transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
  
});

// const transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: process.env.MAIL_PORT,
//   secure: true, // true for 465, false for other ports
//   auth: {
//     user: process.env.MAIL_USERNAME, // generated ethereal user
//     pass: process.env.MAIL_PASSWORD // generated ethereal password
//   }
// });


const handlebarOptions = {
    viewEngine: {
      extName: '.hbs',
      partialsDir: './views/mail',
      layoutsDir: './views/mail/layouts',
      defaultLayout: 'main.hbs',
    },
    viewPath: './views/mail/templates',
    extName: '.hbs',
  };

transporter.use('compile',hbs(handlebarOptions));


export {transporter};