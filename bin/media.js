import { Core } from '../src/core.js'
import { MediaApiHttpServer } from '../src/api/media/server.js'

const core = new Core()
await core.init()

const publicApiHTTPServer = new MediaApiHttpServer(core, 3002)
await publicApiHTTPServer.init()

console.log('[Media] Application successfully started!')
