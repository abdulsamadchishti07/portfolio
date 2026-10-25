/**
 * Projects Data Store
 * Exact GitHub Repositories for Abdul Samad Chishti (github.com/abdulsamadchishti07)
 */

export const projectsData = [
  {
    id: "event-booking-ticketing-api",
    title: "Event Booking & Ticketing API",
    category: "fastapi",
    categoryLabel: "Production Ready ⚡",
    tagline: "A high-concurrency ticketing engine where 100 simultaneous buyers racing for 20 seats yields exactly 20 sales and 0 oversold tickets (~1,500 req/s across 3 nodes).",
    impactBanner: "0 Oversold Tickets (100 VUs / 20 Seats) • 3.0× Linear Scaling (~1,500 req/s) • 212 Tests Passing",
    impactBannerColor: "terracotta",
    githubUrl: "https://github.com/abdulsamadchishti07/Event-Booking-Ticketing-API",
    description: "High-concurrency event booking and ticketing backend engineered to eliminate race conditions and double-selling under flash-drop spikes. Built with FastAPI, PostgreSQL 16, Redis 7, Docker, and Nginx. Benchmarked locally with k6: 100 simultaneous buyers racing for 20 seats produced exactly 20 wins, 80 sold out, and 0 overbooking errors (SUM(quantity) == 20 verified). Features 3.0× linear cluster scaling, Little's Law capacity modeling (10,000–15,000 concurrent browsing users), and Stripe webhook resiliency with HMAC verification and deterministic refund idempotency.",
    techStack: ["FastAPI", "PostgreSQL 16", "Redis 7", "Docker", "Nginx", "Stripe", "k6", "SQLAlchemy 2.0", "Alembic"],
    techIcons: ["fastapi.svg", "postgresql.svg", "redis.svg", "docker.svg", "database.svg", "server.svg"],
    metrics: [
      { label: "0 Oversold", value: "100 VUs / 20 Seats" },
      { label: "3.0× Scaling", value: "~1,500 req/s" },
      { label: "212 Passing", value: "Pytest Suite" },
      { label: "Idempotent", value: "Stripe Webhooks" }
    ],
    architecture: `[ k6 Load Runner / 100 VUs ] ──▶ [ Nginx Reverse Proxy (Round-Robin) ]
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    ▼                       ▼                       ▼
            [ web1 (FastAPI) ]      [ web2 (FastAPI) ]      [ web3 (FastAPI) ]
                    │                       │                       │
                    └───────────────────────┬───────────────────────┘
                                            │
                  ┌─────────────────────────┴─────────────────────────┐
                  ▼                                                   ▼
     [ Redis 7 Distributed Store ]                          [ PostgreSQL 16 (ACID) ]
      - Distributed holds (10m TTL)                          - SELECT ... FOR UPDATE
      - Read-through cached events                           - Deterministic lock order (id ASC)
      - Brute-force lockout counters                         - Verified: SUM(quantity) == 20
                  │                                                   │
                  └─────────────────────────┬─────────────────────────┘
                                            ▼
                           [ Stripe Payment & Webhooks ]
                            - HMAC-SHA256 signature verification
                            - Idempotent settlement (450-600/s)
                            - Auto-refund on failure with unique keys`,
    challenges: [
      {
        title: "Eliminating Double-Booking Under Concurrency",
        desc: "Combined Redis 7 distributed temporary seat holds (10-minute TTL) with PostgreSQL 16 row-level pessimistic locking (SELECT FOR UPDATE ordered deterministically by ID to avoid deadlocks). Stress-tested with k6 at 100 concurrent virtual buyers racing for 20 seats: exactly 20 reservations won, 80 returned HTTP 409, and database audit verified zero oversold seats."
      },
      {
        title: "3.0× Linear Scale & Little's Law Capacity",
        desc: "Scaled from a single node (~500 req/s ceiling) to a 3-container cluster behind Nginx (~1,500–1,650 req/s ceiling, 4.6 ms median latency). Modeled via Little's Law (N = λ × W) to sustain 10,000–15,000 concurrent browsing users at realistic human think time (W = 10s)."
      },
      {
        title: "Stripe Webhook Resiliency & Zero Double-Billing",
        desc: "Engineered automated webhook settlement capable of 450–600 events/sec with cryptographic HMAC-SHA256 signature verification. Enforced deterministic idempotency keys (booking_{id}_{attempt}, auto_refund_{pi_id}) so failed charges or duplicate webhook deliveries never cause double-charges or seat leakage."
      },
      {
        title: "Anti-Lockout & Brute-Force Shielding",
        desc: "Tracked login failures per {email}:{client_ip} pair using Redis 7 expire(..., nx=True) to prevent denial-of-service on legitimate users, backed by an Argon2id verification limiter (capped at 10 concurrent) to protect CPU resources."
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
