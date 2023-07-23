import { Controller } from '../../../controller.js'

export class V1_AnimalsController extends Controller {
    async draw(request, reply) /**
     * @http-method get
     * @url /v1/animals/draw
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

        return this.core.services.animals.draw()
    }
}
