import { AbstractService } from './abstract.js'
import sharp from 'sharp'
import { capitalize } from '../helpers/capitalize.js'
import adjectives from '../entities/animals/adjectives.js'
import animals from '../entities/animals/names.js'
import colors from '../entities/animals/colors.js'
import icons from '../entities/animals/icons.js'

export class AnimalsService extends AbstractService {
    /**
     * @returns {Promise<{image: Buffer, meta: {adjective: *, name: string, animal: *}}>}
     */
    async draw() {
        const meta = await this.#getAnimalData()
        const image = await this.#getAnimalImage(meta.animal.toLowerCase())

        return { image, meta }
    }

    /**
     * @returns {Promise<{adjective: *, name: string, animal: *}>}
     */
    async #getAnimalData() {
        const i = Math.floor(Math.random() * adjectives.length)
        const k = Math.floor(Math.random() * animals.length)

        const adjective = capitalize(adjectives[i])
        const animal = capitalize(animals[k])

        return {
            adjective,
            animal,
            name: adjective + ' ' + animal,
        }
    }

    /**
     * @param animalName
     * @param base64
     * @returns {Promise<Buffer|string>}
     */
    async #getAnimalImage(animalName, { base64 = true } = {}) {
        try {
            sharp.concurrency(0)

            const i = Math.floor(Math.random() * colors.length)

            const animalPath = Buffer.from(
                icons.find(e => e.name === animalName).data
            )

            const background = await sharp({
                create: {
                    width: 1500,
                    height: 1500,
                    channels: 3,
                    background: colors[i],
                },
            })
                .png()
                .toBuffer()

            const animalResized = await sharp(animalPath, { density: 450 })
                .resize({ width: 800 })
                .toBuffer()

            const result = await sharp(background)
                .composite([{ input: animalResized, gravity: 'centre' }])
                .toBuffer()

            if (base64) {
                return result.toString('base64')
            }

            return result
        } catch (err) {
            console.error(err)
        }
    }
}
