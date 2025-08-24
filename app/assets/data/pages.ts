export const pages: pageInfo[] = [
    {
        id: 'home',
        name: 'ホーム',
        route: '/',
        search: false
    },
    {
        id: 'guide',
        name: 'ガイド',
        route: '/guide',
        search: true
    },
    {
        id: 'rules',
        name: 'ルール',
        route: '/rules',
        search: true,
        chip: '日本語版'
    },
    {
        id: 'tools',
        name: 'ツール',
        route: '/tools',
        search: false
    },
    {
        id: 'social',
        name: 'リンク集',
        route: '/social',
        search: false
    }
]

export const enableSearches = []