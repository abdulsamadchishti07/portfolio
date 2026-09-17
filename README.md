# Abdul Samad Chishti — Personal Portfolio

[![Domain](https://img.shields.io/badge/Live-abdulsamadchishti.dev-D9653B?style=flat-square)](https://abdulsamadchishti.dev/)
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0d1117?style=flat-square&logo=linkedin&logoColor=6ee7b7&labelColor=0d1117)](https://linkedin.com/in/abdulsamadchishti07)
[![GitHub](https://img.shields.io/badge/-GitHub-0d1117?style=flat-square&logo=github&logoColor=ffffff&labelColor=0d1117)](https://github.com/abdulsamadchishti07)
[![X](https://img.shields.io/badge/-X%2FTwitter-0d1117?style=flat-square&logo=x&logoColor=34d399&labelColor=0d1117)](https://x.com/Samad187588)

A personal portfolio website showcasing my backend engineering projects, tech stack, and practical experience.

🌐 **Live Website**: [https://abdulsamadchishti.dev](https://abdulsamadchishti.dev)

---

## 🚀 Key Features

- **Soft & Modern Aesthetic**: Cohesive warm porcelain and soft obsidian dark theme, generous rounded geometry (18–32px), subtle ambient lighting, and gentle typography.
- **Pure Web Platform Craft**: Zero heavy frameworks or runtime bloat—built entirely with semantic **HTML5**, **Vanilla CSS**, and **modular ES6+ JavaScript**.
- **Interactive Case Study Modals**: Native `<dialog>` elements with light-dismiss, background blur, technical metrics, and macOS-style terminal windows for architecture diagrams.
- **Direct GitHub Repository Integration**: 1-click links to GitHub source repositories across all showcase projects.
- **Light / Dark Mode**: Theme toggle with automatic system preference detection and `localStorage` state persistence.
- **High-Contrast Dark Mode Icons**: Crisp vector SVGs with custom brightness/inversion filters for readability in dark mode.
- **Responsive Design**: Flawless layout and typography across mobile (375px+), tablet, and desktop viewports.
- **Accessibility & SEO**: Semantic landmarks, WCAG-compliant color contrast, JSON-LD Schema.org markup, and Open Graph share metadata.

---

## 🛠️ Tech Stack & Showcase Projects

### Technologies
- **Languages & Frameworks**: Python 3.11+, Django & Django REST Framework, FastAPI, RESTful APIs
- **Databases & Caching**: PostgreSQL, Redis, Database Indexing, Schema Migrations
- **DevOps & Tools**: Docker, Docker Compose, Linux, Git, Alembic, UV

### Pinned Projects
1. **[Event-Booking-Ticketing-API](https://github.com/abdulsamadchishti07/Event-Booking-Ticketing-API)**: High-concurrency event reservation engine designed to prevent double-booking using Redis locks and PostgreSQL row-level locks.
2. **[Ecommerce (Practice Project)](https://github.com/abdulsamadchishti07/Ecommerce)**: Clean-architecture Django eCommerce backend with OTP authentication, cart workflows, and Docker Compose.
3. **[Project-Management-API](https://github.com/abdulsamadchishti07/Project-Management-API)**: Multi-tenant task management REST API built with FastAPI, Redis caching, rate-limiting, and Alembic migrations.

---

## 📁 Project Structure

```
.
├── index.html               # Semantic HTML document with SEO meta & schema
├── CNAME                    # Custom domain record (abdulsamadchishti.dev)
├── robots.txt               # Search crawler permissions & sitemap reference
├── sitemap.xml              # XML Sitemap for search indexing
├── css/
│   ├── tokens.css           # Design tokens (colors, fluid type, radii, shadows)
│   ├── base.css             # CSS reset, accessible focus rings, scrollbars
│   ├── layout.css           # Responsive containers & floating dock navigation
│   └── components.css       # Cards, modals, buttons, terminal windows, forms
├── js/
│   ├── app.js               # Application coordinator & initialization
│   ├── data/
│   │   └── projectsData.js  # Project repositories, metrics & architecture data
│   └── modules/
│       ├── theme.js         # Light/Dark mode switcher with persistence
│       ├── navigation.js    # IntersectionObserver active dock spy & mobile drawer
│       ├── projects.js      # Dynamic project cards & native <dialog> controller
│       └── contact.js       # 1-click email copy & form validation
└── assets/
    └── icons/               # Standardized downloaded vector SVG icons
```

---

## 💻 Local Development

Run a local HTTP server from the project directory:

```bash
# Using Python
python3 -m http.server 8085

# Or using Node
npx serve .
```

Open `http://localhost:8085` in your browser.

---

## 📄 License & Credits

Designed and built by **Abdul Samad Chishti**.
Licensed under the [MIT License](LICENSE).
