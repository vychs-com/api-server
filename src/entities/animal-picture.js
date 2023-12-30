import sharp from 'sharp'
import { getIcon } from '../enums/animal/icons.js'

export class AnimalPicture {
    constructor(
        animal,
        backgroundColor,
        animalColor,
        width = 1500,
        height = 1500
    ) {
        this.animal = animal
        this.backgroundColor = backgroundColor
        this.animalColor = animalColor
        this.width = width
        this.height = height
        this.filename = animal.name.toLowerCase().split(' ').join('_') + '.png'
    }

    /**
     * @returns {Promise<Buffer>}
     */
    async draw() {
        try {
            sharp.concurrency(0)

            const background = await this.#drawBackground()
            const animal = await this.#drawAnimal()
            const picture = await this.#combineBackgroundAndAnimal(
                background,
                animal
            )

            return picture.toBuffer()
        } catch (err) {
            console.error(err)
        }
    }

    /**
     * @returns {Promise<Buffer>}
     */
    async #drawBackground() {
        return sharp({
            create: {
                width: this.width,
                height: this.height,
                background: this.backgroundColor,
                channels: 3,
            },
        })
            .png()
            .toBuffer()
    }

    /**
     * @returns {Promise<Buffer>}
     */
    async #drawAnimal() {
        const icon = getIcon(this.animal.species, this.animalColor)
        return sharp(Buffer.from(icon), {
            density: 450,
        })
            .resize({ width: 800 })
            .toBuffer()
    }

    /**
     * @param background
     * @param animal
     * @returns {Promise<*>}
     */
    async #combineBackgroundAndAnimal(background, animal) {
        return sharp(background).composite([
            { input: animal, gravity: 'centre' },
        ])
    }
}
