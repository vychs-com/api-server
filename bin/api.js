import { Container } from '../src/core.js'
import { PublicApiHttpServer } from '../src/api/public/server.js'

const container = new Container()
await container.init()

const publicApiHTTPServer = new PublicApiHttpServer(container, 3001)
await publicApiHTTPServer.init()

console.log('[Api] Application successfully started!')
