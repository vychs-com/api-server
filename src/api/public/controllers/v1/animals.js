import { Controller } from '../../../../controller.js'
import { v4 as uuidv4 } from 'uuid'
import { BadRequestError, InternalServerError } from 'http-errors-enhanced'
import { Animal } from '../../../../entities/animal.js'
import { AnimalPicture } from '../../../../entities/animal-picture.js'
import { isUsernameAvailable } from '../../../../helpers/telegram/username.js'
import colors from '../../../../enums/animal/colors.js'
import { isValidHexColor } from '../../../../helpers/is-valid-hex-color.js'

export class V1_AnimalsController extends Controller {
    async draw(request, reply) /**
     * @http-method get
     * @url /v1/animals/draw
     * @rateLimit {
     *      max: 500,
     *      timeWindow: 60000
     * }
     * @schema {
     *     querystring: {
     *         color: { type: 'string' },
     *         background: { type: 'string' },
     *     }
     * }
     * @param request
     * @param reply
     * @private
     * @returns {Promise<void>}
     */ {
        await this.validatePublicRequest(request, reply)

        if (request.query?.color && !isValidHexColor(request.query?.color)) {
            throw new BadRequestError('Invalid animal HEX color passed')
        }
        if (
            request.query?.background &&
            !isValidHexColor(request.query?.background)
        ) {
            throw new BadRequestError('Invalid background HEX color passed')
        }

        const animal = new Animal()
        const animalPicture = new AnimalPicture(
            animal,
            request.query?.background ||
                colors[Math.floor(Math.random() * colors.length)],
            request.query?.color
        )
        const buffer = await animalPicture.draw()

        if (!buffer) {
            throw new InternalServerError('Failed to generate an image')
        }

        const key = uuidv4()
        const value = JSON.stringify({
            buffer,
            filename: animalPicture.filename,
        })
        await this.core.redis.set(key, value, {
            EX: 180, // in seconds, 3 minutes
            NX: true,
        })

        const usernameAvailable = await isUsernameAvailable(animal.name)

        this.replyWithSuccess(reply, {
            url: '/view?id=' + key,
            name: animal.name,
            username_available: usernameAvailable,
        })
    }
}
