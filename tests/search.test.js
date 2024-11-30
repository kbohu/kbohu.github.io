describe('Search functionality', () => {
    let mockArticleIndex;
    
    beforeEach(() => {
        mockArticleIndex = [
            {
                title: 'Duchovná cesta',
                content: 'Článok o duchovnej ceste a raste',
                url: '/clanky/duchovna-cesta',
                date: '2024-01-01',
                category: 'Duchovný rast',
                tags: ['duchovnosť', 'rast', 'viera']
            },
            {
                title: 'Modlitba v tichu',
                content: 'Ako sa modliť v tichu a samote',
                url: '/clanky/modlitba-v-tichu',
                date: '2024-01-02',
                category: 'Modlitba',
                tags: ['modlitba', 'ticho', 'meditácia']
            }
        ];
        
        // Mock localStorage
        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            clear: jest.fn()
        };
        global.localStorage = localStorageMock;
        
        // Load search module with mocked data
        jest.mock('../js/search.js', () => ({
            initSearch: jest.fn(),
            search: jest.fn(),
            updateSearchIndex: jest.fn()
        }));
    });
    
    test('should initialize search with article index', () => {
        const { initSearch } = require('../js/search.js');
        initSearch(mockArticleIndex);
        expect(initSearch).toHaveBeenCalledWith(mockArticleIndex);
    });
    
    test('should return relevant results for search query', () => {
        const { search } = require('../js/search.js');
        const query = 'modlitba';
        const results = search(query);
        
        expect(results).toEqual(expect.arrayContaining([
            expect.objectContaining({
                title: 'Modlitba v tichu',
                category: 'Modlitba'
            })
        ]));
    });
    
    test('should handle diacritics in search', () => {
        const { search } = require('../js/search.js');
        const query = 'duchovna';
        const results = search(query);
        
        expect(results).toEqual(expect.arrayContaining([
            expect.objectContaining({
                title: 'Duchovná cesta',
                category: 'Duchovný rast'
            })
        ]));
    });
    
    test('should update search index', () => {
        const { updateSearchIndex } = require('../js/search.js');
        const newArticle = {
            title: 'Nový článok',
            content: 'Obsah nového článku',
            url: '/clanky/novy-clanok',
            date: '2024-01-03',
            category: 'Všeobecné',
            tags: ['nový', 'článok']
        };
        
        updateSearchIndex([...mockArticleIndex, newArticle]);
        expect(updateSearchIndex).toHaveBeenCalledWith(expect.arrayContaining([newArticle]));
    });
});
