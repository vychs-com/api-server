import { AbstractService } from './abstract.js'
import dayjs from 'dayjs'

export class UsageStatisticService extends AbstractService {
    get modelName() {
        return 'usage_statistic'
    }

    get includeRelations() {
        return {
            project: true,
        }
    }

    get exportableFields() {
        return ['id', 'project_id', 'timestamp', 'count', 'project']
    }

    get updatableFields() {
        return ['count']
    }

    /**
     * @param projectId
     * @returns {Promise<void>}
     */
    async updateUsage(projectId) {
        const timestamp = dayjs().startOf('day').valueOf()

        await this.upsert(
            {
                project_id_timestamp: {
                    project_id: projectId,
                    timestamp,
                },
            },
            {
                count: {
                    increment: 1,
                },
            },
            {
                project_id: projectId,
                timestamp,
                count: 1,
            }
        )
    }

    /**
     * @param projectId
     * @returns {Promise<{triggerCount: number, timestamp: Date}[]>}
     */
    async getUsageStats(projectId) {
        const sevenDaysAgo = dayjs().subtract(5, 'days')
        const today = dayjs().startOf('day')

        const stats = await this.findMany(
            {
                project_id: projectId,
                timestamp: {
                    gte: sevenDaysAgo.valueOf(),
                },
            },
            {
                select: {
                    timestamp: true,
                    count: true,
                },
                orderBy: {
                    timestamp: 'asc',
                },
            }
        )

        const statsMap = new Map(
            stats.map(stat => [dayjs(+stat.timestamp).format('MMM DD'), stat])
        )

        return Array.from({ length: 5 }, (_, index) => {
            const currentDate = today.subtract(index, 'days')
            const formattedDate = currentDate.format('MMM DD')
            const statForDate = statsMap.get(formattedDate)

            return {
                timestamp: formattedDate,
                count: statForDate ? statForDate.count : 0,
            }
        }).reverse()
    }
}
