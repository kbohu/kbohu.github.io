// Smooth scrolling pre navigáciu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animovaný scroll-to-top button
const scrollButton = document.createElement('button');
scrollButton.innerHTML = '↑';
scrollButton.className = 'scroll-to-top';
document.body.appendChild(scrollButton);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

scrollButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Interaktívne rozbaľovacie FAQ
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        // Zatvor všetky ostatné odpovede
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
            if (openItem !== item) {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-answer').style.maxHeight = null;
            }
        });
        
        // Prepni aktuálnu odpoveď
        item.classList.toggle('open');
        if (!isOpen) {
            answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
            answer.style.maxHeight = null;
        }
    });
});

// Dynamické načítavanie článkov
let currentPage = 1;
const articlesPerPage = 6;
const loadMoreButton = document.querySelector('.load-more');

if (loadMoreButton) {
    loadMoreButton.addEventListener('click', async () => {
        try {
            currentPage++;
            const response = await fetch(`/api/articles?page=${currentPage}&limit=${articlesPerPage}`);
            const articles = await response.json();
            
            if (articles.length === 0) {
                loadMoreButton.style.display = 'none';
                return;
            }
            
            const articlesGrid = document.querySelector('.articles-grid');
            articles.forEach(article => {
                const articleElement = createArticleElement(article);
                articlesGrid.appendChild(articleElement);
            });
            
            // Animuj nové články
            const newArticles = articlesGrid.querySelectorAll('.article-card:not(.visible)');
            newArticles.forEach((article, index) => {
                setTimeout(() => {
                    article.classList.add('visible');
                }, index * 100);
            });
            
        } catch (error) {
            console.error('Chyba pri načítavaní článkov:', error);
        }
    });
}

// Pomocná funkcia pre vytvorenie článku
function createArticleElement(article) {
    const div = document.createElement('div');
    div.className = 'article-card';
    div.innerHTML = `
        <img src="${article.image}" alt="${article.title}" loading="lazy">
        <div class="article-content">
            <h2>${article.title}</h2>
            <p>${article.excerpt}</p>
            <a href="${article.url}" class="read-more">Čítať viac</a>
        </div>
    `;
    return div;
}

// Interaktívne zdieľanie na sociálne siete
document.querySelectorAll('.share-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const url = window.location.href;
        const title = document.title;
        const platform = button.dataset.platform;
        
        let shareUrl;
        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    });
});

// Automatické prispôsobenie výšky textarea
document.querySelectorAll('textarea.auto-resize').forEach(textarea => {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});

// Notifikácie pre nové články
if ('Notification' in window) {
    const notifyButton = document.querySelector('.notify-button');
    if (notifyButton) {
        notifyButton.addEventListener('click', async () => {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                subscribeToNewsletter();
            }
        });
    }
}

// Newsletter subscription
async function subscribeToNewsletter() {
    const email = document.querySelector('.newsletter-email').value;
    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        if (response.ok) {
            showNotification('Úspešne ste sa prihlásili na odber noviniek!');
        } else {
            throw new Error('Nepodarilo sa prihlásiť na odber');
        }
    } catch (error) {
        showNotification('Nastala chyba pri prihlasovaní na odber', 'error');
    }
}

// Pomocná funkcia pre zobrazenie notifikácie
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Pridanie CSS štýlov pre notifikácie
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        background: var(--primary-color);
        color: white;
        border-radius: 5px;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification.error {
        background: #ff4444;
    }
    
    .scroll-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 999;
    }
    
    .scroll-to-top.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .article-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }
    
    .article-card.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;

document.head.appendChild(style);
