import { Controller } from '../../controller.js'

export class IndexController extends Controller {
    async place(request, reply) /**
     * @http-method get
     * @url /
     * @param request
     * @param reply
     * @private
     * @returns {Promise<void>}
     */ {
        await this.validatePublicRequest(request, reply)

        reply.send('API.')
    }
}
