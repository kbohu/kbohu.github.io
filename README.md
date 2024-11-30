# Na ceste k Bohu - Duchovný Blog

Vitajte v repozitári webovej stránky "Na ceste k Bohu". Tento projekt je duchovný blog zameraný na prehlbovanie viery a duchovný rast.

## 📚 Obsah

- [Prehľad](#prehľad)
- [Technológie](#technológie)
- [Inštalácia](#inštalácia)
- [Štruktúra Projektu](#štruktúra-projektu)
- [SEO Optimalizácia](#seo-optimalizácia)
- [Vyhľadávanie](#vyhľadávanie)
- [Prispievanie](#prispievanie)
- [Licencia](#licencia)

## 🌟 Prehľad

"Na ceste k Bohu" je moderný duchovný blog vytvorený s dôrazom na:
- Rýchlosť a výkon
- SEO optimalizáciu
- Prístupnosť
- Responzívny dizajn
- Podporu viacerých jazykov (primárne slovenčina)

## 💻 Technológie

Projekt využíva nasledujúce technológie:
- HTML5 s modernými sémantickými elementmi
- Vanilla JavaScript (ES6+)
- CSS3 s CSS premennými
- Schema.org štruktúrované dáta
- PWA funkcionalita
- PostCSS pre optimalizáciu CSS
- Rollup pre balíčkovanie JavaScript súborov
- Babel pre kompatibilitu JavaScriptu
- ESLint pre kontrolu kvality kódu
- Jest pre testovanie

## 🚀 Inštalácia

1. Klonujte repozitár:
```bash
git clone https://github.com/your-username/nacestekbohu.git
cd nacestekbohu
```

2. Nainštalujte závislosti:
```bash
npm install --legacy-peer-deps
```

3. Spustite vývojový server:
```bash
npm run dev
```

4. Pre vývoj spustite sledovanie zmien:
```bash
npm run watch
```

## 🛠️ Vývojové príkazy

- `npm run dev` - Spustí vývojový server
- `npm run build` - Vytvorí produkčnú verziu (CSS a JS)
- `npm run build:css` - Skompiluje a optimalizuje CSS
- `npm run build:js` - Skompiluje a optimalizuje JavaScript
- `npm run lint` - Skontroluje JavaScript kód
- `npm run lint:fix` - Opraví problémy s JavaScript kódom
- `npm run test` - Spustí testy
- `npm run watch` - Sleduje zmeny a automaticky aktualizuje súbory
- `npm run generate-index` - Vygeneruje index článkov pre vyhľadávanie

## 📁 Štruktúra Projektu

```bash
nacestekbohu/
├── css/
│   └── index.min.css      # Hlavný CSS súbor
├── js/
│   ├── main.js           # Hlavný JavaScript
│   ├── search.js         # Implementácia vyhľadávania
│   └── interactive.js    # Interaktívne funkcie
├── data/
│   └── article-index.json # Index článkov pre vyhľadávanie
├── tools/
│   └── generate-article-index.js # Nástroj na generovanie indexu
├── images/               # Obrázky a médiá
├── articles/            # Články v HTML formáte
└── templates/           # Šablóny pre nové články
```

## 🔍 SEO Optimalizácia

Projekt implementuje nasledujúce SEO praktiky:
- Sémantické HTML5 elementy
- Štruktúrované dáta (Schema.org)
- Open Graph a Twitter Card meta tagy
- Optimalizované nadpisy a meta popis
- XML sitemap a robots.txt
- Kanonické URL adresy

## 🔎 Vyhľadávanie

Implementácia vyhľadávania zahŕňa:
- Fulltextové vyhľadávanie v článkoch
- Automatické dopĺňanie
- Relevantné výsledky podľa:
  - Zhody v nadpise
  - Zhody v obsahu
  - Kategórií a tagov
  - Dátumu publikácie

### Generovanie indexu článkov

Pre aktualizáciu vyhľadávacieho indexu spustite:
```bash
node tools/generate-article-index.js
```

## 🤝 Prispievanie

1. Vytvorte fork repozitára
2. Vytvorte feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit zmeny (`git commit -m 'Add AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otvorte Pull Request

## 📄 Licencia

Tento projekt je licencovaný pod MIT licenciou - pozrite [LICENSE.md](LICENSE.md) pre detaily.

## 📱 PWA Funkcionalita

Stránka podporuje PWA (Progressive Web App) funkcie:
- Offline prístup k článkom
- Možnosť inštalácie na zariadenie
- Push notifikácie (voliteľné)

## 🔧 Údržba

### Pravidelná údržba
1. Aktualizácia vyhľadávacieho indexu
2. Kontrola broken linkov
3. Optimalizácia obrázkov
4. Aktualizácia závislostí

### Monitoring
- Sledovanie výkonu pomocou Lighthouse
- Analýza SEO metrík
- Kontrola prístupnosti

## 🌐 Nasadenie

Pre nasadenie na produkciu:
1. Skontrolujte SEO meta tagy
2. Vygenerujte nový index článkov
3. Optimalizujte assets
4. Aktualizujte sitemap.xml

## 📊 Analytika

Projekt využíva:
- Google Analytics 4
- Custom event tracking
- Meranie výkonu
- Sledovanie user engagement

## 🔒 Bezpečnosť

Implementované bezpečnostné opatrenia:
- HTTPS
- CSP (Content Security Policy)
- XSS ochrana
- CORS nastavenia

## 💡 Tipy pre vývojárov

### Pridanie nového článku
1. Použite šablónu z `templates/article-template.html`
2. Vyplňte všetky meta tagy
3. Pridajte štruktúrované dáta
4. Vygenerujte nový index

### Optimalizácia obrázkov
1. Používajte webp formát
2. Implementujte lazy loading
3. Definujte rozmery obrázkov
4. Používajte srcset pre responzívne obrázky
