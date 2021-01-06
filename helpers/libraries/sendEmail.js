const nodemailer = require("nodemailer");

const sendEmail = async (mailOptions) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });

  //     {
  // from: '"Fred Foo 👻" <foo@example.com>', // sender address
  // to: "bar@example.com, baz@example.com", // list of receivers
  // subject: "Hello ✔", // Subject line
  // text: "Hello world?", // plain text body
  // html: "<b>Hello world?</b>", // html body
  //     }
  let info = await transporter.sendMail(mailOptions);
  console.log(`Message Sent :${info.messageId} `);
};
module.exports = sendEmail;
