import 'dotenv/config'

import { createClient as createRedisClient } from 'redis'
import { AnimalsService } from './services/animals.js'

export class Container {
    constructor() {
        this.services = {
            animals: new AnimalsService(this),
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        await this.#initRedisClient()
        await Promise.all(
            Object.values(this.services).map(service => service.init())
        )
    }

    /**
     * @returns {Promise<void>}
     */
    async #initRedisClient() {
        this.redis = createRedisClient({
            url: process.env.REDIS_CONNECT,
        })
        await this.redis.connect()
    }
}
