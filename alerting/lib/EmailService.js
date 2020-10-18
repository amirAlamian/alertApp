const nodemailer = require('nodemailer');
const fs = require('fs');
const yaml = require('js-yaml');
const { email } = yaml.safeLoad(fs.readFileSync('./config/setting.yml'), 'utf8').services;

class EmailService{


  init = () => {
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


  sendAlertViaEmailToClient = async (transporter, text) => {

      const mailOptions = {
          from: email.sender,
          to: email.receivers,
          subject: email.subject,
          text
      };
      transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
              console.log('error', error);
          } else {
              console.log('Email sent: ' + info.response);
          }
      });
  }
}

module.exports = new EmailService;
