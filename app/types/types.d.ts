interface pageInfo {
    id: string,
    name: string
    route: string,
    search: boolean,
    chip?: string
    options?: Record<string, string>
}