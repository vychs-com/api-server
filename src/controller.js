import { BadRequestError } from 'http-errors-enhanced'

export class Controller {
    /**
     * @param core
     * @param opts
     */
    constructor(core, opts = {}) {
        Object.assign(this, opts)
        this.core = core
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
