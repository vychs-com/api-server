import { Controller } from '../../../../controller.js'
import { v4 as uuidv4 } from 'uuid'
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
} from 'http-errors-enhanced'
import { Animal } from '../../../../entities/animal.js'
import { AnimalPicture } from '../../../../entities/animal-picture.js'
import { getUsernameInformation } from '../../../../helpers/telegram/username.js'
import colors from '../../../../enums/animal/colors.js'
import { isValidHexColor } from '../../../../helpers/is-valid-hex-color.js'
import species from '../../../../enums/animal/species.js'

export class V1_AnimalsController extends Controller {
    async list(request, reply) /**
     * @http-method get
     * @url /v1/animals
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

        this.replyWithSuccess(reply, species)
    }

    async updateUsage(request, reply) /**
     * @http-method get
     * @url /v1/animals/usage
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

        const project = await this.core.services.projects.findOne({
            slug: 'animals',
        })
        if (!project)
            throw new NotFoundError('Failed to update usage: project not found')

        await this.core.services.usageStatistics.updateUsage(project.id)

        this.replyWithSuccess(reply, true)
    }

    async usageStats(request, reply) /**
     * @http-method get
     * @url /v1/animals/stats
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

        const project = await this.core.services.projects.findOne({
            slug: 'animals',
        })
        if (!project)
            throw new NotFoundError(
                'Failed to get usage stats: project not found'
            )

        const stats = await this.core.services.usageStatistics.getUsageStats(
            project.id
        )
        if (!stats)
            throw new InternalServerError(
                'Failed to retrieve any data from the database'
            )

        this.replyWithSuccess(reply, stats)
    }

    async draw(request, reply) /**
     * @http-method get
     * @url /v1/animals/draw
     * @rateLimit {
     *      max: 500,
     *      timeWindow: 60000
     * }
     * @schema {
     *     querystring: {
     *         animal: { type: 'string' },
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

        if (request.query?.color && !isValidHexColor(request.query.color)) {
            throw new BadRequestError('Invalid animal HEX color passed')
        }
        if (
            request.query?.background &&
            !isValidHexColor(request.query.background)
        ) {
            throw new BadRequestError('Invalid background HEX color passed')
        }
        if (request.query?.animal && !species.includes(request.query.animal)) {
            throw new BadRequestError('Unknown animal passed')
        }

        const animal = new Animal(request.query?.animal)
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

        const username = await getUsernameInformation(animal.name)

        this.replyWithSuccess(reply, {
            url: '/view?id=' + key,
            name: animal.name,
            username,
        })
    }
}
