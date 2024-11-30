// Search implementation for Na ceste k Bohu
class ArticleSearch {
    constructor() {
        this.searchIndex = null;
        this.articles = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // Load the article index
            const response = await fetch('/data/article-index.json');
            this.articles = await response.json();
            
            // Create search index
            this.searchIndex = this.createSearchIndex(this.articles);
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize search:', error);
            throw new Error('Nepodarilo sa inicializovať vyhľadávanie.');
        }
    }

    createSearchIndex(articles) {
        // Simple search index implementation
        // In production, consider using libraries like lunr.js or elasticlunr.js
        return articles.map(article => ({
            ...article,
            searchContent: this.normalizeText(`${article.title} ${article.excerpt} ${article.content} ${article.tags.join(' ')}`)
        }));
    }

    normalizeText(text) {
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^a-z0-9\s]/g, ' ')    // Keep only alphanumeric and spaces
            .replace(/\s+/g, ' ')            // Normalize spaces
            .trim();
    }

    async search(query) {
        if (!this.initialized) {
            await this.initialize();
        }

        const normalizedQuery = this.normalizeText(query);
        const queryTerms = normalizedQuery.split(' ').filter(term => term.length > 2);

        if (queryTerms.length === 0) {
            return [];
        }

        // Score and rank results
        const results = this.searchIndex
            .map(article => {
                const score = this.calculateRelevanceScore(article, queryTerms);
                return { ...article, score };
            })
            .filter(article => article.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Limit to top 10 results

        return results.map(({ title, excerpt, url, category, date }) => ({
            title,
            excerpt,
            url,
            category,
            date
        }));
    }

    calculateRelevanceScore(article, queryTerms) {
        let score = 0;
        const content = article.searchContent;

        for (const term of queryTerms) {
            // Title matches get higher score
            if (article.title.toLowerCase().includes(term)) {
                score += 10;
            }
            
            // Tag matches get medium score
            if (article.tags.some(tag => tag.toLowerCase().includes(term))) {
                score += 5;
            }

            // Content matches get base score
            if (content.includes(term)) {
                score += 1;
                
                // Bonus for exact phrase matches
                const phraseRegex = new RegExp(`\\b${term}\\b`, 'g');
                const phraseMatches = (content.match(phraseRegex) || []).length;
                score += phraseMatches * 0.5;
            }
        }

        // Boost score for category matches
        if (queryTerms.some(term => article.category.toLowerCase().includes(term))) {
            score *= 1.5;
        }

        // Boost recent articles
        const articleDate = new Date(article.date);
        const now = new Date();
        const monthsOld = (now - articleDate) / (1000 * 60 * 60 * 24 * 30);
        const recencyBoost = Math.max(0.5, 1 - (monthsOld / 12)); // Decay over 12 months
        score *= recencyBoost;

        return score;
    }
}

// Initialize search functionality
const searchInstance = new ArticleSearch();

// Export for use in other modules
export { searchInstance as default };
