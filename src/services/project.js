import { AbstractService } from './abstract.js'

export class ProjectService extends AbstractService {
    get modelName() {
        return 'project'
    }

    get includeRelations() {
        return {}
    }

    get exportableFields() {
        return ['title', 'description', 'web_url', 'tg_url', 'source_url']
    }

    get updatableFields() {
        return ['title', 'description', 'web_url', 'tg_url', 'source_url']
    }
}
