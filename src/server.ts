import 'dotenv/config'
import Fastify from 'fastify'
import staticPlugin from '@fastify/static'
import { routes } from './routes'
import path from 'path'

const app = Fastify({ logger: true })

app.register(staticPlugin, {
  root: path.join(__dirname, '../public'),
  prefix: '/',
})

app.register(routes)

app.get('/', async (request, reply) => {
  return reply.redirect('/index.html')
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
app.listen({ port: PORT }, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
})
