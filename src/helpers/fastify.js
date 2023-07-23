import isObject from 'isobject'

const isGetter = (x, name) =>
    (Object.getOwnPropertyDescriptor(x, name) || {}).get
const isFunction = (x, name) => typeof x[name] === 'function'
const deepFunctions = x =>
    x &&
    x !== Object.prototype &&
    Object.getOwnPropertyNames(x)
        .filter(name => isGetter(x, name) || isFunction(x, name))
        .concat(deepFunctions(Object.getPrototypeOf(x)) || [])
const distinctDeepFunctions = x => Array.from(new Set(deepFunctions(x)))
const userFunctions = x =>
    distinctDeepFunctions(x).filter(
        name => name !== 'constructor' && !~name.indexOf('__')
    )

/**
 * @param func
 * @returns {{}}
 */
export function parseJsdoc(func) {
    const match = func.toString().match(/\/\\*\*(.*?)\*\//s)
    const jsdoc = match ? match[1] : null
    const tags = []
    if (!jsdoc) {
        return tags
    }
    let name
    let value = ''
    jsdoc.replaceAll(
        /^\s+\*[\x20\t]+(?:@(\S+)[\x20\t])?([^\n]*)$/gm,
        (match, tag, piece) => {
            if (tag) {
                if (name) {
                    tags.push({ name, value })
                    value = ''
                }
                name = tag
            }
            if (name) {
                value += (value !== '' ? '\n' : '') + piece
            }
        }
    )
    return tags
}

/**
 * @param server
 * @param controllers
 * @param routeCallback
 */
export function fastifyInstallControllers(
    server,
    controllers = [],
    routeCallback = null
) {
    if (!Array.isArray(controllers)) {
        controllers = [controllers]
    }
    controllers.forEach(controller => {
        for (let methodName of userFunctions(controller)) {
            const method = controller[methodName]
            let route = {}

            parseJsdoc(method).forEach(({ name, value }) => {
                if (name === 'http-method') {
                    route.method = value.toUpperCase()
                } else if (['url', 'access'].includes(name)) {
                    route[name] = value
                } else if (name === 'schema') {
                    route.schema = eval('(' + value + ')')
                } else if (name === 'rateLimit') {
                    route.config = { rateLimit: eval('(' + value + ')') }
                }
            })

            if (route.url) {
                if (routeCallback) {
                    route = routeCallback(route)
                    if (!route?.url) {
                        continue
                    }
                }
                route.handler = method.bind(controller)
                server.route(route)
            }
        }
    })
}

/**
 * @param server
 */
export function schemaValidator(server) {
    server.addHook('preHandler', (request, reply, next) => {
        const checkSchema = schema_part => {
            const props = request.context.schema?.[schema_part]?.properties
            if (props && isObject(request[schema_part])) {
                for (let name of Object.keys(request[schema_part])) {
                    if (!props.hasOwnProperty(name)) {
                        reply.code(400)
                        throw new Error('unknown parameter: ' + name)
                    }
                }
            }
        }

        checkSchema('params')
        checkSchema('body')
        checkSchema('query')

        next()
    })
}
