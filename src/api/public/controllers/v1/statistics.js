import { Controller } from '../../../../controller.js'
import { InternalServerError, NotFoundError } from 'http-errors-enhanced'

export class V1_StatisticsController extends Controller {
    async list(request, reply) /**
     * @http-method get
     * @url /v1/statistics/usage/:slug
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
            slug: request.params?.slug,
        })
        if (!project) {
            throw new NotFoundError('Project not found')
        }

        const stats = await this.core.services.usageStatistics.getUsageStats(
            project.id
        )
        if (!stats)
            throw new InternalServerError(
                `Failed to get stats of the project with slug ${project.slug}. Please try again later`
            )

        this.replyWithSuccess(reply, stats)
    }
}
