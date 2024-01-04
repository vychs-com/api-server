import { AbstractService } from './abstract.js'

export class ProjectService extends AbstractService {
    get modelName() {
        return 'project'
    }

    get includeRelations() {
        return {
            // usage_statistic: true
        }
    }

    get exportableFields() {
        return [
            'title',
            'slug',
            'description',
            'web_url',
            'tg_url',
            'source_url',
            'has_usage_stats',
        ]
    }

    get updatableFields() {
        return [
            'title',
            'slug',
            'description',
            'web_url',
            'tg_url',
            'source_url',
            'has_usage_stats',
        ]
    }
}
