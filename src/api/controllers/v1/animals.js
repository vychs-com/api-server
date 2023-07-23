import { Controller } from '../../../controller.js'
import { OutputImageFormats } from '../../../entities/animals/format.js'
import { BadRequestError } from 'http-errors-enhanced'

export class V1_AnimalsController extends Controller {
    async draw(request, reply) /**
     * @http-method post
     * @url /v1/animals/draw
     * @rateLimit {
     *      max: 1200,
     *      timeWindow: 60000
     * }
     * @schema {
     *      body: {
     *          type: 'object',
     *          properties: {
     *              format: { type: 'string' }
     *          }
     *      }
     * }
     * @param request
     * @param reply
     * @private
     * @returns {Promise<void>}
     */ {
        await this.validatePublicRequest(request, reply)

        if (
            request.body?.format &&
            !Object.values(OutputImageFormats).includes(request.body.format)
        ) {
            throw new BadRequestError(
                'Unknown output format. Available formats: ' +
                    Object.values(OutputImageFormats).join(', ')
            )
        }

        return this.core.services.animals.draw({
            ...(request.body?.format ? { format: request.body.format } : {}),
        })
    }
}
