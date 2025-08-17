interface aPage {
    title: string,
    to: string,
    version?: string
}

interface routeInfo {
    category?: string,
    pages: aPage[]
}