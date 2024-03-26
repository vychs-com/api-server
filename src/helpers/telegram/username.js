import axios from 'axios'
import { load } from 'cheerio'

const fragmentUrl = 'https://fragment.com/username/'
const tgUrl = 'https://t.me/'

/**
 * @param name
 * @returns {Promise<{available: boolean, url: null, on_auction: boolean}>}
 */
export const getUsernameInformation = async name => {
    try {
        const result = {
            available: false,
            on_auction: false,
            url: null,
            price: 0,
        }

        const username = name.toLowerCase().replace(/\s/g, '')
        const response = await axios(fragmentUrl + username)
        const redirectCount = response.request._redirectable._redirectCount

        if (response.status !== 200) return result

        // fragment redirects if username isn't in an auction
        if (redirectCount > 0) {
            result.available = true
            result.url = tgUrl + username
            return result
        }

        const $ = load(response.data)

        result.available = result.on_auction =
            $(
                'span[class="tm-section-header-status tm-status-avail"]'
            ).text() === 'Available'
        result.url = (result.available ? fragmentUrl : tgUrl) + username

        const priceText = $('div[class="table-cell-desc"]').text().trim()
        const priceMatch = priceText.match(/[\d,]+\.\d{2}/)
        if (result.on_auction && priceMatch) {
            result.price = parseFloat(priceMatch[0].replace(/,/g, ''))
        }

        return result
    } catch (err) {
        console.error(err)
    }
}
