import axios from 'axios'
import { load } from 'cheerio'

export const isUsernameAvailable = async name => {
    try {
        const { data } = await axios(
            `https://t.me/${name.toLowerCase().replace(/\s/g, '')}`
        )
        const $ = load(data)

        return $('div[class="tgme_page_extra"]').text().length <= 0
    } catch (err) {
        console.error(err)
    }
}
