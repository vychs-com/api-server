import { V1_TestController } from './controllers/v1/test.js'
import { IndexController } from './controllers/index.js'
import { V1_AnimalsController } from './controllers/v1/animals.js'

/**
 * @param core
 * @param opts
 * @returns {[IndexController,V1_TestController,V1_AnimalsController]}
 * @constructor
 */
export const ApiControllers = (core, opts = {}) => {
    return [
        new IndexController(core, opts),
        new V1_TestController(core, opts),
        new V1_AnimalsController(core, opts),
    ]
}
