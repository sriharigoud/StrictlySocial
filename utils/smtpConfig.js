var smtpTransport = require("nodemailer-smtp-transport");
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "strictlysocial2021@gmail.com",
        pass: "srihari123",
      },
    })
);

module.exports = transporter;