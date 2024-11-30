// Add custom Jest matchers
expect.extend({
    toBeValidHtml(received) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(received, 'text/html');
        const hasErrors = doc.querySelector('parsererror');
        
        if (hasErrors) {
            return {
                message: () => `Expected valid HTML but found parser errors: ${hasErrors.textContent}`,
                pass: false
            };
        }
        
        return {
            message: () => 'Expected invalid HTML',
            pass: true
        };
    }
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock IntersectionObserver
class IntersectionObserver {
    constructor(callback) {
        this.callback = callback;
    }
    
    observe() {
        return null;
    }
    
    unobserve() {
        return null;
    }
    
    disconnect() {
        return null;
    }
}

window.IntersectionObserver = IntersectionObserver;
