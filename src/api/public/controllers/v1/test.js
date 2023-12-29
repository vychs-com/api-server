import { Controller } from '../../../../controller.js'

export class V1_TestController extends Controller {
    async test(request, reply) /**
     * @http-method get
     * @url /v1/test
     * @rateLimit {
     *      max: 1200,
     *      timeWindow: 60000
     * }
     * @param request
     * @param reply
     * @private
     * @returns {Promise<void>}
     */ {
        await this.validatePublicRequest(request, reply)

        return {
            ok: true,
            uptime: process.uptime(),
        }
    }
}
