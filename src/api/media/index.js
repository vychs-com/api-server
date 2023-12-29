import { IndexController } from './controllers/index.js'

/**
 * @param core
 * @param opts
 * @returns {[IndexController,V1_TestController,V1_AnimalsController]}
 * @constructor
 */
export const MediaApiControllers = (core, opts = {}) => {
    return [new IndexController(core, opts)]
}
