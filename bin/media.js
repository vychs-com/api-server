import { Container } from '../src/core.js'
import { MediaApiHttpServer } from '../src/api/media/server.js'

const container = new Container()
await container.init()

const publicApiHTTPServer = new MediaApiHttpServer(container, 3002)
await publicApiHTTPServer.init()

console.log('[Media] Application successfully started!')
