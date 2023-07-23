import { AbstractService } from './abstract.js'
import sharp from 'sharp'
import { capitalize } from '../helpers/capitalize.js'
import adjectives from '../entities/animals/adjectives.js'
import animals from '../entities/animals/names.js'
import colors from '../entities/animals/colors.js'
import icons from '../entities/animals/icons.js'
import { OutputImageFormats } from '../entities/animals/format.js'
import { isUsernameAvailable } from '../helpers/telegram/username.js'

export class AnimalsService extends AbstractService {
    /**
     * @param format
     * @returns {Promise<{image: (Buffer|string), meta: {[p: string]: *}}>}
     */
    async draw({ format } = {}) {
        const data = await this.#getAnimalData()
        const image = await this.#getAnimalImage(data.animal, arguments[0])

        return {
            image,
            meta: {
                ...data,
                is_username_available: await isUsernameAvailable(data.name),
            },
        }
    }

    /**
     * @returns {Promise<{adjective: *, name: string, animal: *}>}
     */
    async #getAnimalData() {
        const i = Math.floor(Math.random() * adjectives.length)
        const k = Math.floor(Math.random() * animals.length)

        const adjective = adjectives[i]
        const animal = animals[k]
        const name = [adjective, animal].map(capitalize).join(' ')

        return {
            adjective,
            animal,
            name,
        }
    }

    /**
     * @param animal
     * @param format
     * @returns {Promise<Buffer|string>}
     */
    async #getAnimalImage(animal, { format = OutputImageFormats.BASE64 } = {}) {
        try {
            sharp.concurrency(0)

            const background = await sharp({
                create: {
                    width: 1500,
                    height: 1500,
                    channels: 3,
                    background:
                        colors[Math.floor(Math.random() * colors.length)],
                },
            })
                .png()
                .toBuffer()

            const { data: animalIcon } = icons.find(
                ({ name }) => name === animal
            )
            const animalIconResized = await sharp(Buffer.from(animalIcon), {
                density: 450,
            })
                .resize({ width: 800 })
                .toBuffer()

            const animalImageBuffer = await sharp(background)
                .composite([{ input: animalIconResized, gravity: 'centre' }])
                .toBuffer()

            switch (format) {
                case OutputImageFormats.BASE64:
                    return animalImageBuffer.toString('base64')
                case OutputImageFormats.BUFFER:
                    return animalImageBuffer
                default:
                    throw new Error('Unknown format')
            }
        } catch (err) {
            console.error(err)
        }
    }
}
