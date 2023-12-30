/**
 * @param color
 * @returns {boolean}
 */
export const isValidHexColor = color => {
    const regex = /^#(?:[0-9a-fA-F]{6}){1,2}$/
    return regex.test(color)
}
