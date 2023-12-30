import { BadRequestError } from 'http-errors-enhanced'
import { ApiResponse } from './entities/api-response.js'

export class Controller {
    /**
     * @param core
     * @param opts
     */
    constructor(core, opts = {}) {
        Object.assign(this, opts)
        this.core = core
    }

    replyWithSuccess(reply, data = null, message = 'Success') {
        reply.code(200).send(
            new ApiResponse({
                statusCode: 200,
                data,
                message,
            })
        )
    }

    /**
     * @param request
     * @param reply
     * @returns {Promise<void>}
     */
    async validatePublicRequest(request, reply) {}

    /**
     * @param request
     * @param reply
     * @returns {Promise<void>}
     */
    async validatePrivateRequest(request, reply) {
        if (!request.headers['x-api-key']) {
            throw new BadRequestError('x-api-key header must be present')
        }
    }
}
