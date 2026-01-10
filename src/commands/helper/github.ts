

const encodeQuery = (params: Record<string, string>): string => {
    return Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
}

interface GithubUrlParams {
    owner: string
    repo: string
    path?: string
    query?: Record<string, string>
}


export class GithubUrl {
    constructor(private params: GithubUrlParams) {}

    public withPath(path: string): GithubUrl {
        return new GithubUrl({
            ...this.params,
            path
        })
    }

    public withQuery(query: Record<string, string>): GithubUrl {
        return new GithubUrl({
            ...this.params,
            query
        })
    }

    public toString(): string {
        const { owner, repo, path, query } = this.params
        let url = `https://github.com/${owner}/${repo}`
        if (path)  url += `/${path}`
        if (query) url += `?${encodeQuery(query)}`
        return url
    }

}