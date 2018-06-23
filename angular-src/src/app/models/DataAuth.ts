export interface DataAuth {
    success: string,
    msg?: string,
    token: string,
    user?: {
        name?: string,
        username?: string,
        email?: string,
        password?: string
    }
}