import cors from '@fastify/cors'
import fastifyRateLimit from '@fastify/rate-limit'
import fastify from 'fastify'
import fastifyHttpErrorsEnhanced from 'fastify-http-errors-enhanced'
import { ApiControllers } from '../src/api/api-controllers.js'
import { Container } from '../src/core.js'
import {
    fastifyInstallControllers,
    schemaValidator,
} from '../src/helpers/fastify.js'

const container = new Container()
await container.init()

const server = fastify({ logger: false })

await server.register(fastifyRateLimit, {
    global: false,
})
await server.register(
    cors,
    {
        origin: /^http[s]?:\/\/(?:animals\.)?(vychs\.com|localhost:3000)(?:\/.*)?$/,
        credentials: true,
        methods: ['POST', 'GET'],
    }
)
server.register(fastifyHttpErrorsEnhanced, {
    hideUnhandledErrors: process.env.NODE_ENV !== 'development',
})

schemaValidator(server)
fastifyInstallControllers(server, ApiControllers(container), route => {
    console.log('Installing ' + route.url, route)
    return route
})

await server.ready()

const port = 3001

server
    .listen({
        port,
        host: '0.0.0.0',
    })
    .then(() => console.log('Running API HTTP server on port  ' + port))
    .catch(err => {
        console.log({ err })
        server.log.error(err)
    })
