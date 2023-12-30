import 'dotenv/config'

import { createClient as createRedisClient } from 'redis'

export class Core {
    constructor() {
        this.services = {}
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        await this.#initRedisClient()

        /**
         * @param err
         * @param event
         */
        const shutdownHandler = (err, event) => {
            this.exit({
                reason: `Shutdown process emitted by ${event}.${
                    err.message ? ` Error message: ${err.message}` : ''
                }`,
            }).catch(e => {
                console.error('Failed during shutdown:', e)
                process.exit(1)
            })
        }

        process.on('SIGINT', shutdownHandler)
        process.on('SIGTERM', shutdownHandler)
        process.on('uncaughtException', shutdownHandler)
        process.on('unhandledRejection', shutdownHandler)
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

    /**
     * @returns {Promise<void>}
     */
    async exit({ reason } = {}) {
        console.log('Gracefully shutting down...')
        if (reason) {
            console.log('Reason:', reason)
        }

        if (this.redis && this.redis.isOpen) {
            console.log('Terminating Redis...')
            await this.redis.disconnect()
        }

        console.log('Shutdown complete. Bye-bye...')
        process.exit(0)
    }
}
