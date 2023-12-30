export class ApiResponse {
    constructor({ statusCode, data, message }) {
        this.statusCode = statusCode || 200
        this.data = data || null
        this.message = message || 'Success'
    }
}
