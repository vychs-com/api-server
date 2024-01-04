import cors from '@fastify/cors'
import fastifyRateLimit from '@fastify/rate-limit'
import fastify from 'fastify'
import fastifyHttpErrorsEnhanced from 'fastify-http-errors-enhanced'
import {
    fastifyInstallControllers,
    schemaValidator,
} from '../../helpers/fastify.js'
import { PublicApiControllers } from './index.js'

export class PublicApiHttpServer {
    constructor(core, port) {
        this.core = core
        this.port = port
        this.server = fastify({
            logger: false,
            trustProxy: true,
        })
    }

    async init() {
        await this.registerMiddlewares()
        this.validateAndInstallControllers()
        await this.startListening()
    }

    async registerMiddlewares() {
        await this.server.register(fastifyRateLimit, {
            global: false,
        })
        await this.server.register(cors, {
            origin: /^http[s]?:\/\/(?:animals\.)?(vychs\.com|localhost:3000|localhost:3001|localhost:3002)(?:\/.*)?$/,
            credentials: true,
            methods: ['POST', 'GET'],
        })
        this.server.register(fastifyHttpErrorsEnhanced, {
            hideUnhandledErrors: process.env.NODE_ENV !== 'development',
        })
    }

    validateAndInstallControllers() {
        schemaValidator(this.server)
        fastifyInstallControllers(
            this.server,
            PublicApiControllers(this.core),
            route => {
                console.log('Installing ' + route.url, route)
                return route
            }
        )
    }

    async startListening() {
        await this.server.ready()
        this.server
            .listen({
                port: this.port,
                host: '0.0.0.0',
            })
            .then(() => {
                console.log(
                    'Running Public API HTTP server on port  ' + this.port
                )
            })
            .catch(err => {
                console.error(err)
                this.server.log.error(err)
            })
    }
}
