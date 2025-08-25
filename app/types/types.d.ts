interface pageInfo {
    id: string,
    name: string
    route: string,
    search: boolean,
    chip?: string
    options?: Record<string, string>
}

interface social {
    name: string,
    icon?: {
        type: 'mdi' | 'fab',
        iconName: string
        colorCode?: string
    },
    links: {
        pageName: string,
        href: string,
        description: string,
        avatar?: string,
        accent?: string
        tags?: string[]
    }[]
}