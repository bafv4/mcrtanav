export const getFirstSegment = (path: string): string => {
    if (path === "/") return "/";
    const match = path.match(/^\/[^\/]*/);
    return match ? match[0] : "/";
}