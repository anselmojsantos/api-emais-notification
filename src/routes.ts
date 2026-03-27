import { FastifyInstance } from 'fastify'
import { prisma } from './db'
import { sendConfirmationEmail } from './mailer'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

export async function routes(app: FastifyInstance) {

  // Rota de cadastro
  app.post('/register', async (request, reply) => {
    const { name, email, password } = request.body as {
      name: string
      email: string
      password: string
    }

    if (!name || !email || !password) {
      return reply.status(400).send({ error: 'Todos os campos são obrigatórios.' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return reply.status(409).send({ error: 'E-mail já cadastrado.' })
    }

    // Encripta a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10)
    const confirmToken = uuidv4()

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, confirmToken },
    })

    await sendConfirmationEmail(email, confirmToken)

    return reply.status(201).send({
      message: 'Usuário criado! Verifique seu e-mail para confirmar o cadastro.',
      userId: user.id,
    })
  })

  // Rota de confirmação de e-mail
  app.get('/confirm/:token', async (request, reply) => {
    const { token } = request.params as { token: string }

    const user = await prisma.user.findUnique({
      where: { confirmToken: token },
    })

    if (!user) {
      return reply.status(404).send({ error: 'Token inválido ou expirado.' })
    }

    if (user.confirmed) {
      return reply.redirect('/login.html')
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { confirmed: true },
    })

    return reply.redirect(`/confirmed.html?name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&id=${user.id}`)
  })

  // Rota de login
  app.post('/login', async (request, reply) => {
    const { email, password } = request.body as {
      email: string
      password: string
    }

    if (!email || !password) {
      return reply.status(400).send({ error: 'E-mail e senha são obrigatórios.' })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return reply.status(401).send({ error: 'E-mail ou senha inválidos.' })
    }

    if (!user.confirmed) {
      return reply.status(403).send({ error: 'Confirme seu e-mail antes de logar.' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return reply.status(401).send({ error: 'E-mail ou senha inválidos.' })
    }

    return reply.send({
      message: 'Login realizado com sucesso!',
      user: { id: user.id, name: user.name, email: user.email }
    })
  })
}