import { Controller } from '../../../controller.js'
import { InternalServerError, NotFoundError } from 'http-errors-enhanced'

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

        reply.send('Media.')
    }

    async viewMedia(request, reply) /**
     * @http-method get
     * @url /view
     * @schema {
     *     querystring: {
     *         id: { type: 'string' },
     *         download: { type: 'boolean' }
     *     }
     * }
     * @param request
     * @param reply
     * @private
     * @returns {Promise<void>}
     */ {
        await this.validatePublicRequest(request, reply)

        const key = request.query?.id
        const rawImage = await this.core.redis.get(key)
        if (!rawImage) {
            throw new NotFoundError('Requested image not found or expired')
        }

        const image = JSON.parse(rawImage)
        if (!image) {
            throw new InternalServerError(
                'Failed to retrieve image data from existing source'
            )
        }

        const buffer = Buffer.from(image.base64, 'base64')

        if (request.query?.download) {
            reply.header(
                'Content-Disposition',
                `attachment; filename="${image.filename}"`
            )
        }

        reply.header('Content-Type', 'image/png')
        reply.send(buffer)
    }
}
