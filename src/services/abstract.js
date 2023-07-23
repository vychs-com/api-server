export class AbstractService {
    constructor(core) {
        if (this.constructor === AbstractService) {
            throw new Error('Abstract classes cannot be instantiated.')
        }

        this.core = core
    }

    init() {}
}
