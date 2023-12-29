import { Controller } from '../../../../controller.js'
import { v4 as uuidv4 } from 'uuid'
import { InternalServerError } from 'http-errors-enhanced'

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

        const tempId = uuidv4()
        const ttl = 180 // in seconds, 3 minutes

        const result = await this.core.services.animals.draw()
        if (!result) {
            throw new InternalServerError('Failed to generate an image')
        }

        const key = tempId
        const value = JSON.stringify({
            base64: result.image,
            filename:
                result.information.name.toLowerCase().split(' ').join('_') +
                '.png',
        })

        await this.core.redis.set(key, value, {
            EX: ttl,
            NX: true,
        })

        reply.send({
            url: '/view?id=' + tempId,
            information: result.information,
        })
    }
}
