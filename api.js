class GitHubAPI {
    constructor() {
        this.baseUrl = 'https://api.github.com';
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    }

    async fetchWithCache(endpoint) {
        const cacheKey = endpoint;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`);
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.statusText}`);
        }

        const data = await response.json();
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });

        return data;
    }

    async getUserStats(username) {
        return this.fetchWithCache(`/users/${username}`);
    }

    async getRepoStats(username) {
        return this.fetchWithCache(`/users/${username}/repos`);
    }

    async getLanguageStats(username, repoName) {
        return this.fetchWithCache(`/repos/${username}/${repoName}/languages`);
    }

    async getContributions(username) {
        return this.fetchWithCache(`/users/${username}/events`);
    }

    async getFollowers(username) {
        return this.fetchWithCache(`/users/${username}/followers`);
    }
}

// Create global API instance
const githubAPI = new GitHubAPI();