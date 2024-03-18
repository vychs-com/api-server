import { Controller } from '../../../../controller.js'

export class V1_ProjectsController extends Controller {
    async list(request, reply) /**
     * @http-method get
     * @url /v1/projects
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

        const projects = await this.core.services.projects.findMany(
            {},
            {
                orderBy: {
                    id: 'desc',
                },
            }
        )

        this.replyWithSuccess(reply, projects)
    }
}
