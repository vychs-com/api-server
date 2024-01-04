export class AbstractService {
    constructor(core) {
        if (this.constructor === AbstractService) {
            throw new Error('Abstract classes cannot be instantiated.')
        }

        this.core = core
    }

    /**
     * @abstract
     * @return {string}
     */
    get modelName() {}

    /**
     * @abstract
     */
    get includeRelations() {}

    /**
     * @abstract
     * @return {string[]}
     */
    get exportableFields() {
        return []
    }

    /**
     * @abstract
     * @return {string[]}
     */
    get updatableFields() {
        return []
    }

    /**
     * @return {string|undefined}
     */
    get modelNamePlural() {
        if (!this.modelName) return

        return this.modelName + 's'
    }

    /**
     * @param fields
     * @param filter
     * @returns {{}|*}
     */
    mapFields(fields, filter = this.exportableFields) {
        if (!filter.length) return fields

        return filter.reduce((mappedData, field) => {
            if (fields[field] !== undefined) {
                mappedData[field] = fields[field]
            }

            return mappedData
        }, {})
    }

    /**
     * @param where
     * @param prismaInstance
     * @returns {*}
     */
    count(where = {}, prismaInstance = null) {
        const prisma = prismaInstance || this.core.prisma

        return prisma[this.modelName].count(
            this.#mapPrismaArguments({ where }, true)
        )
    }

    /**
     * @param data
     * @param prismaInstance
     * @returns {*}
     */
    createOne(data, prismaInstance = null) {
        const prisma = prismaInstance || this.core.prisma

        if (!Object.values(data).length) {
            throw new Error('No data to create passed')
        }

        return prisma[this.modelName].create(this.#mapPrismaArguments({ data }))
    }

    /**
     * @param where
     * @param update
     * @param create
     * @param prismaInstance
     * @returns {*}
     */
    upsert(where, update, create, prismaInstance = null) {
        const prisma = prismaInstance || this.core.prisma

        if (!Object.values(where).length) {
            throw new Error('No where to upsert passed')
        }
        if (!Object.values(update).length) {
            throw new Error('No update data to update passed')
        }
        if (!Object.values(create).length) {
            throw new Error('No create data to create passed')
        }

        return prisma[this.modelName].upsert(
            this.#mapPrismaArguments({ where, update, create })
        )
    }

    /**
     * @param where
     * @param select
     * @param include
     * @param orderBy
     * @param prismaInstance
     * @returns {Promise<*>}
     */
    findOne(
        where = {},
        { select = null, include = null, orderBy = null } = {},
        prismaInstance = null
    ) {
        const prisma = prismaInstance || this.core.prisma

        return prisma[this.modelName].findFirst(
            this.#mapPrismaArguments({ where, ...arguments[1] })
        )
    }

    /**
     * @param where
     * @param select
     * @param include
     * @param orderBy
     * @param take
     * @param skip
     * @param prismaInstance
     * @returns {*}
     */
    findMany(
        where = {},
        {
            select = null,
            include = null,
            orderBy = null,
            take = null,
            skip = null,
        } = {},
        prismaInstance = null
    ) {
        const prisma = prismaInstance || this.core.prisma

        return prisma[this.modelName].findMany(
            this.#mapPrismaArguments({ where, ...arguments[1] })
        )
    }

    /**
     * @param where
     * @param data
     * @param prismaInstance
     * @returns {*}
     */
    updateOne(where = {}, data, prismaInstance = null) {
        data = this.mapFields(data, this.updatableFields)

        if (!Object.values(data).length) {
            throw new Error('No data to update passed')
        }

        const prisma = prismaInstance || this.core.prisma

        return prisma[this.modelName].update(
            this.#mapPrismaArguments({ where, data })
        )
    }

    /**
     * @param where
     * @param data
     * @param prismaInstance
     * @returns {*}
     */
    updateMany(where = {}, data, prismaInstance = null) {
        data = this.mapFields(data, this.updatableFields)

        if (!Object.values(data).length) {
            throw new Error('No data to update passed')
        }

        const prisma = prismaInstance || this.core.prisma

        return prisma[this.modelName].updateMany(
            this.#mapPrismaArguments({ where, data }, true)
        )
    }

    /**
     * @param where
     * @param prismaInstance
     * @returns {*}
     */
    deleteOne(where = {}, prismaInstance = null) {
        if (!Object.values(where).length) {
            throw new Error('Empty where condition passed')
        }

        const prisma = prismaInstance || this.core.prisma

        return prisma[this.modelName].delete(
            this.#mapPrismaArguments({ where })
        )
    }

    /**
     * @param where
     * @param prismaInstance
     * @returns {*}
     */
    deleteMany(where = {}, prismaInstance = null) {
        if (!Object.values(where).length) {
            throw new Error('Empty where condition passed')
        }

        const prisma = prismaInstance || this.core.prisma

        return prisma[this.modelName].deleteMany(
            this.#mapPrismaArguments({ where })
        )
    }

    /**
     * @param by
     * @param where
     * @param _count
     * @param _sum
     * @param _avg
     * @param _max
     * @param prismaInstance
     * @returns {*}
     */
    groupBy(
        by,
        where = {},
        { _count, _sum, _avg, _max } = {},
        prismaInstance = null
    ) {
        if (!by.length) {
            throw new Error('Empty where condition passed')
        }
        if (!Array.isArray(by)) {
            throw new TypeError('"by" must be an array')
        }

        const prisma = prismaInstance || this.core.prisma

        return prisma[this.modelName].groupBy(
            this.#mapPrismaArguments({ by, where, ...arguments[2] })
        )
    }

    /**
     * @param args
     * @param noRelations
     * @returns {*}
     */
    #mapPrismaArguments(args, noRelations = false) {
        const hasNoSelect = !args.select && !args._count && !args._sum
        const hasNoInclude = !args.include
        const hasAtLeastOneRelation =
            Object.keys(this.includeRelations).length > 0

        if (
            hasNoSelect &&
            hasNoInclude &&
            hasAtLeastOneRelation &&
            !noRelations
        ) {
            args.include = this.includeRelations
        }

        return args
    }
}
