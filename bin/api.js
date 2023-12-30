import { Core } from '../src/core.js'
import { PublicApiHttpServer } from '../src/api/public/server.js'

const core = new Core()
await core.init()

const publicApiHTTPServer = new PublicApiHttpServer(core, 3001)
await publicApiHTTPServer.init()

console.log('[Api] Application successfully started!')
