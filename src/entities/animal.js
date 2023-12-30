import { capitalize } from '../helpers/capitalize.js'
import adjectives from '../enums/animal/adjectives.js'
import animalSpecies from '../enums/animal/species.js'

export class Animal {
    constructor(species, adjective) {
        this.species =
            species ||
            animalSpecies[Math.floor(Math.random() * animalSpecies.length)]
        this.adjective =
            adjective ||
            adjectives[Math.floor(Math.random() * adjectives.length)]
        this.name = [this.adjective, this.species].map(capitalize).join(' ')
    }
}
