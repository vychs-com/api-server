import { V1_TestController } from './controllers/v1/test.js'
import { IndexController } from './controllers/index.js'
import { V1_AnimalsController } from './controllers/v1/animals.js'
import { V1_ProjectsController } from './controllers/v1/projects.js'

/**
 * @param core
 * @param opts
 * @returns {[IndexController,V1_TestController,V1_AnimalsController]}
 * @constructor
 */
export const PublicApiControllers = (core, opts = {}) => {
    return [
        new IndexController(core, opts),
        new V1_TestController(core, opts),
        new V1_AnimalsController(core, opts),
        new V1_ProjectsController(core, opts),
    ]
}
