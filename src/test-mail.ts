import 'dotenv/config'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

transporter.verify((error) => {
  if (error) {
    console.error('❌ Erro na conexão:', error)
  } else {
    console.log('✅ Conexão com Brevo OK! Enviando e-mail...')

    transporter.sendMail({
      from: `<${process.env.FROM_EMAIL}>`,
      to: "anselmo3.santos@gmail.com",
      bcc: "waguiatrader@gmail.com",
      subject: 'Teste de envio',
      html: '<h2>Projeto de Integração com o Brevo.</h2>' +
            '<p>Este é um teste de envio de e-mail usando o Brevo SMTP.</p>' +
            '<a href="https://www.brevo.com/">Link para conhecer essa plataforma Brevo</a>' +
            '<p>No frela são 300 disparos de emails diários.</p>' +
            '<p>Esse negócio foi chato de fazer kkkkkk</p>'
    }, (err, info) => {
      if (err) {
        console.error('❌ Erro ao enviar:', err)
      } else {
        console.log('✅ E-mail enviado! ID:', info.messageId)
      }
    })
  }
})