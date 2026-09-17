/**
 * Projects Data Store
 * Exact GitHub Repositories for Abdul Samad Chishti (github.com/abdulsamadchishti07)
 */

export const projectsData = [
  {
    id: "event-booking-ticketing-api",
    title: "Event Booking & Ticketing API",
    category: "fastapi",
    categoryLabel: "In Development 🚀",
    tagline: "Users can browse events, reserve seats/tickets, and pay. Admins can create events with limited seat capacity.",
    impactBanner: "In Active Development • Concurrency & Race Condition Prevention",
    impactBannerColor: "terracotta",
    githubUrl: "https://github.com/abdulsamadchishti07/Event-Booking-Ticketing-API",
    description: "My primary flagship project currently in active development. Built with FastAPI and PostgreSQL, engineered to handle event ticket reservations safely. Implements role enums (Admin, Seller, Buyer), account lockout protection, refresh token rotation with secure logout, and transactional seat capacity deduction to prevent double-booking anomalies.",
    techStack: ["FastAPI", "Python", "PostgreSQL", "Alembic", "Redis"],
    techIcons: ["fastapi.svg", "python.svg", "postgresql.svg", "database.svg", "redis.svg"],
    metrics: [
      { label: "Status", value: "In Development" },
      { label: "Framework", value: "FastAPI" },
      { label: "Package Tool", value: "UV / Pyproject" },
      { label: "Migrations", value: "Alembic" }
    ],
    architecture: `Client Booking Request
      │
      ▼
[ FastAPI Async Engine ]
      │
      ├──▶ [ Auth Layer: Role Enum, Lockout Check & JWT ]
      │
      ├──▶ [ Redis Distributed Lock: Temporary Seat Hold ]
      │          │
      │          ▼
      └──▶ [ PostgreSQL Transaction: SELECT FOR UPDATE ]
             - Validate seat quota
             - Deduct ticket inventory
             - Generate reservation record
      │
      ▼
[ Order Confirmed & Ticket Issued ]`,
    challenges: [
      {
        title: "Account Lockout & Auth Security",
        desc: "Implemented role enums, failed-attempt account lockout thresholds, and secure refresh token expiration with explicit logout invalidation."
      },
      {
        title: "Preventing Ticket Overselling",
        desc: "Designing seat reservation state machines with Redis holds so concurrent checkout requests cannot exceed event capacity."
      }
    ]
  },
  {
    id: "ecommerce-backend",
    title: "Ecommerce (Practice Project)",
    category: "django",
    categoryLabel: "Django Backend",
    tagline: "Django E-Commerce (Practice Project): Clean backend architecture with authentication, product catalog, cart, and order processing.",
    impactBanner: "Django E-Commerce Practice • OTP Auth & Docker Compose",
    impactBannerColor: "sage",
    githubUrl: "https://github.com/abdulsamadchishti07/Ecommerce",
    description: "A Django E-Commerce practice project built to learn and implement core backend concepts: user authentication with OTP and Google sign-in, PostgreSQL database integration, modular app structure (apps, config, static, templates), Docker Compose setup, and shopping cart order processing workflows.",
    techStack: ["Django", "Python", "PostgreSQL", "Docker", "Git"],
    techIcons: ["django.svg", "python.svg", "postgresql.svg", "docker.svg", "git.svg"],
    metrics: [
      { label: "Framework", value: "Django" },
      { label: "Container", value: "Docker Compose" },
      { label: "Auth Flow", value: "OTP / Sign-in" },
      { label: "Database", value: "PostgreSQL" }
    ],
    architecture: `Client Request
      │
      ▼
[ Django Application Gateway ]
      │
      ├──▶ [ OTP & User Authentication Service ]
      │
      ├──▶ [ Product Catalog & Search Filtering ]
      │
      ▼
[ PostgreSQL Database (Dockerized) ]
   - Products, Categories & Avatars
   - Cart, Checkout & Orders`,
    challenges: [
      {
        title: "Modular App Separation",
        desc: "Organized functionality into decoupled Django apps (apps, config, static, templates) with clean settings configurations."
      },
      {
        title: "Docker & Environment Orchestration",
        desc: "Configured Dockerfile and docker-compose.yml for consistent local development and database provisioning."
      }
    ]
  },
  {
    id: "project-management-api",
    title: "Project-Management-API",
    category: "fastapi",
    categoryLabel: "FastAPI Multi-Tenant",
    tagline: "Multi-tenant task management REST API built with FastAPI, Redis caching, and Alembic.",
    impactBanner: "Multi-Tenant Isolation, Redis Caching & Rate Limiting",
    impactBannerColor: "amber",
    githubUrl: "https://github.com/abdulsamadchishti07/Project-Management-API",
    description: "A multi-tenant task and project management REST API built with FastAPI. Features Redis caching, request rate-limiting, Alembic database schema migrations, and comprehensive automated test suites using Pytest and Postman.",
    techStack: ["FastAPI", "Python", "PostgreSQL", "Redis", "Docker"],
    techIcons: ["fastapi.svg", "python.svg", "postgresql.svg", "redis.svg", "docker.svg"],
    metrics: [
      { label: "Framework", value: "FastAPI" },
      { label: "Architecture", value: "Multi-Tenant" },
      { label: "Caching", value: "Redis Cache" },
      { label: "Testing", value: "Pytest + Postman" }
    ],
    architecture: `Tenant / Member Request
      │
      ▼
[ FastAPI API Router ]
      │
      ├──▶ [ Rate Limiting & Redis Caching Layer ]
      │
      ├──▶ [ Multi-Tenant Scoped Security Guard ]
      │
      ▼
[ PostgreSQL Relational Schema ]
   - Organizations & Teams
   - Projects, Boards & Tasks (Tracked via Alembic)`,
    challenges: [
      {
        title: "Redis Caching & Rate-Limiting",
        desc: "Integrated Redis to cache frequent read operations and enforce per-tenant request rate limits to prevent API abuse."
      },
      {
        title: "Automated Testing & Alembic Migrations",
        desc: "Constructed end-to-end Pytest suites and Postman collections with Docker Compose integration for CI/CD test automation."
      }
    ]
  }
];

/*
 * ==========================================================================
 * Future Projects (Uncomment when ready / completed)
 * ==========================================================================
 *
 * 1. Loan-Approval-ML (https://github.com/abdulsamadchishti07/Loan-Approval-ML)
 * 2. Python-Banking-System-CLI (https://github.com/abdulsamadchishti07/Python-Banking-System-CLI)
 * 3. FastAPI-social-app (https://github.com/abdulsamadchishti07/FastAPI-social-app)
 *
 * ==========================================================================
 */
