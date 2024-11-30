// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('#main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainMenu.style.transform = isExpanded ? 'translateX(-100%)' : 'translateX(0)';
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !mainMenu.contains(e.target)) {
            menuToggle.setAttribute('aria-expanded', 'false');
            mainMenu.style.transform = 'translateX(-100%)';
        }
    });

    // Handle search functionality
    const searchForm = document.querySelector('.search-box form');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');

    if (searchForm && searchInput && searchResults) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query) {
                try {
                    // Show loading state
                    searchResults.innerHTML = '<div class="search-loading">Vyhľadávam...</div>';
                    searchResults.hidden = false;

                    // Perform search (implement your search logic here)
                    const results = await performSearch(query);
                    
                    // Display results
                    displaySearchResults(results);
                } catch (error) {
                    console.error('Search error:', error);
                    searchResults.innerHTML = '<div class="search-error">Nastala chyba pri vyhľadávaní.</div>';
                }
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchForm.contains(e.target)) {
                searchResults.hidden = true;
            }
        });
    }
});

// Placeholder for search implementation
async function performSearch(query) {
    // Implement your search logic here
    // This is just a placeholder that returns mock results
    return [
        {
            title: 'Príklad článku 1',
            excerpt: 'Toto je ukážkový text pre výsledok vyhľadávania...',
            url: '/clanok-1'
        },
        {
            title: 'Príklad článku 2',
            excerpt: 'Ďalší ukážkový text pre výsledok vyhľadávania...',
            url: '/clanok-2'
        }
    ];
}

function displaySearchResults(results) {
    const searchResults = document.querySelector('.search-results');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">Neboli nájdené žiadne výsledky.</div>';
        return;
    }

    const resultsHtml = results.map(result => `
        <div class="search-result-item">
            <a href="${result.url}">
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-excerpt">${result.excerpt}</div>
            </a>
        </div>
    `).join('');

    searchResults.innerHTML = resultsHtml;
}

// Handle dark mode toggle if present
const darkModeToggle = document.querySelector('.dark-mode-toggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark-mode');
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.error('ServiceWorker registration failed:', error);
            });
    });
}

// Handle PWA installation
let deferredPrompt;
const installButton = document.querySelector('.install-pwa');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show the install button
    if (installButton) {
        installButton.style.display = 'block';
        
        installButton.addEventListener('click', () => {
            // Hide the install button
            installButton.style.display = 'none';
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                deferredPrompt = null;
            });
        });
    }
});

// Handle PWA updates
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <p>Je k dispozícii nová verzia stránky.</p>
            <button onclick="window.location.reload()">Aktualizovať teraz</button>
        </div>
    `;
    document.body.appendChild(notification);
}

// Push notification subscription
async function subscribeToPushNotifications() {
    try {
        const registration = await navigator.serviceWorker.ready;
        
        // Check permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            throw new Error('Notification permission denied');
        }
        
        // Subscribe to push notifications
        const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('YOUR_PUBLIC_VAPID_KEY')
        };
        
        const subscription = await registration.pushManager.subscribe(subscribeOptions);
        
        // Send subscription to server
        await fetch('/api/push-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription)
        });
        
        console.log('Push notification subscription successful');
    } catch (error) {
        console.error('Push notification subscription failed:', error);
    }
}

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Handle offline/online status
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    // Attempt to sync any pending data
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
            registration.sync.register('syncData');
        });
    }
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
});
