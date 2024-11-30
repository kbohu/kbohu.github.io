#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const ARTICLES_DIR = path.join(__dirname, '..'); // Root directory
const OUTPUT_FILE = path.join(__dirname, '../data/article-index.json');

async function extractArticleMetadata(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const dom = new JSDOM(content);
        const doc = dom.window.document;

        // Extract basic metadata
        const title = doc.querySelector('title')?.textContent || '';
        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const dateStr = doc.querySelector('meta[property="article:published_time"]')?.getAttribute('content') || '';
        const category = doc.querySelector('meta[property="article:section"]')?.getAttribute('content') || '';
        
        // Extract tags
        const tags = Array.from(doc.querySelectorAll('meta[property="article:tag"]'))
            .map(tag => tag.getAttribute('content'))
            .filter(Boolean);

        // Extract main content
        const articleContent = doc.querySelector('article')?.textContent || '';
        const excerpt = description || articleContent.slice(0, 200).trim() + '...';

        // Generate URL from file path
        const relativePath = path.relative(ARTICLES_DIR, filePath);
        const url = '/' + relativePath.replace(/\\/g, '/').replace(/\.html$/, '');

        return {
            title,
            excerpt,
            content: articleContent,
            url,
            category,
            tags,
            date: dateStr || new Date().toISOString()
        };
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
        return null;
    }
}

async function findArticles(dir) {
    const articles = [];
    
    async function scan(currentDir) {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            
            if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
                await scan(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.html')) {
                // Check if it's an article by looking for article metadata
                const content = await fs.readFile(fullPath, 'utf-8');
                if (content.includes('article:published_time') || content.includes('<article')) {
                    const metadata = await extractArticleMetadata(fullPath);
                    if (metadata) {
                        articles.push(metadata);
                    }
                }
            }
        }
    }

    await scan(dir);
    return articles;
}

async function generateIndex() {
    try {
        // Ensure output directory exists
        const outputDir = path.dirname(OUTPUT_FILE);
        await fs.mkdir(outputDir, { recursive: true });

        // Find and process articles
        console.log('Scanning for articles...');
        const articles = await findArticles(ARTICLES_DIR);
        
        // Sort articles by date (newest first)
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Write index file
        await fs.writeFile(OUTPUT_FILE, JSON.stringify(articles, null, 2));
        console.log(`Generated index with ${articles.length} articles`);
        
        // Generate categories summary
        const categories = {};
        articles.forEach(article => {
            if (article.category) {
                categories[article.category] = (categories[article.category] || 0) + 1;
            }
        });
        
        console.log('\nCategories summary:');
        Object.entries(categories)
            .sort((a, b) => b[1] - a[1])
            .forEach(([category, count]) => {
                console.log(`${category}: ${count} articles`);
            });

    } catch (error) {
        console.error('Error generating index:', error);
        process.exit(1);
    }
}

// Run the generator
generateIndex();
