const nodemailer = require("nodemailer")
let transporter = nodemailer.createTransport({
  service: '126',
  auth: {
    user: 'he1275765531@sohu.com',
    pass: "heyongqiang"
  }
})

exports.send = function (to, subject, html, res) {
  const mailOptions = {
    from: '"博客小管家"<he1275765531@sohu.com>',
    to: to,
    subject: subject,
    html: html
  }
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      res.status(504).end("通知邮件发送失败")
    } else {
      console.log("Message sent: " + info.response)
    }
  })
}
