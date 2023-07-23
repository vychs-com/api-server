import 'dotenv/config'

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
        await Promise.all(
            Object.values(this.services).map(service => service.init())
        )
    }
}
