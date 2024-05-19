const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "alexeyorlov2004@gmail.com",
    pass: "rkbu wcgt xvtx ottf",
  },
});

async function sendPasswordToEmail(email, password) {
  const info = await transporter.sendMail({
    from: '\'Alexey Orlov 👻\' <alexeyorlov2004@gmail.com>', // todo: change email
    to: email,
    subject: 'Welcome to chat',
    text: `Hey, there is your password ${password}, please join the chat!`,
  });

  console.log('Message sent: %s', info);
}

module.exports = sendPasswordToEmail;
