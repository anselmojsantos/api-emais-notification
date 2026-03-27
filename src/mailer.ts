import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendConfirmationEmail(to: string, token: string) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  const confirmUrl = `${baseUrl}/confirm/${token}`

   transporter.verify((error) => {
  if (error) {
    console.error('❌ Erro na conexão:', error)
  } else {
    console.log('✅ Conexão com Brevo OK! Enviando e-mail...')

    transporter.sendMail({
      from: `<${process.env.FROM_EMAIL}>`,
      to: to,
      // bcc: "waguiatrader@gmail.com",
      subject: 'Email de confirmação - Projeto Tagarelinha',
      html:
        '<h2>Bem vindo ao Aplicativo Tagarelinha</h2>' +
        '<p>Por favor, clique no botão abaixo para confirmar seu e-mail:</p>' +
        `<a href="${confirmUrl}" style="text-decoration: none; background-color: #4f46e5; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 21px; cursor: pointer;">` +
        `Confirmar E-mail` +
        `</a>` +
        '<p style="margin-top: 16px; font-size: 13px; color: #888;">Se você não solicitou esta confirmação, ignore este e-mail.</p>'
    }, (err, info) => {
      if (err) {
        console.error('❌ Erro ao enviar:', err)
      } else {
        console.log('✅ E-mail enviado! ID:', info.messageId)
      }
    })
  }
})
}
