const nodemailer = require('nodemailer');
const config = require('config');

const  email  = config.get('email');

class EmailService{


  init = () => {
      if(email.status) {
          const transporter = nodemailer.createTransport({
              host: email.host,
              port: email.port,
              secure: false,
              tls: { rejectUnauthorized: false },
              auth: {
                  user: email.auth[0].username,
                  pass: email.auth[0].password
              }
          });
          return transporter;
      }
  }


  sendAlertViaEmailToClient = async (transporter, html) => {

      const mailOptions = {
          from: email.sender,
          to: email.receivers,
          subject: email.subject,
          html
      };

      if(email.status) {
          transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                  console.log('error', error);
              } else {
                  console.log('Email sent: ' + info.response);
              }
          });
      }
  }
}

module.exports = new EmailService;
