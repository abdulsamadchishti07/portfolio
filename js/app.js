/**
 * Application Entry Point — Abdul Samad Chishti Portfolio
 * Ponytail-inspired living code field, decode typography, split-pane code inspector,
 * code-strip metric bars, request ladder, and cheeky light-mode refusal cameo.
 */

import { initNavigation } from './modules/navigation.js?v=3.1';
import { initProjects } from './modules/projects.js?v=3.0';
import { initContact } from './modules/contact.js?v=3.0';

// Real Python/FastAPI/Redis/PostgreSQL source texture from Abdul Samad's backend repos
const SRC = `from fastapi import APIRouter, Depends, HTTPException, status from sqlalchemy.ext.asyncio import AsyncSession from sqlalchemy import select, update from app.core.redis import redis_client from app.core.security import verify_jwt, require_role router = APIRouter(prefix="/api/v1/bookings", tags=["Bookings"]) @router.post("/reserve", status_code=status.HTTP_201_CREATED) async def reserve_seat(payload: SeatReservationCreate, user: User = Depends(require_role("buyer", "admin")), db: AsyncSession = Depends(get_db)): lock_key = f"lock:event:{payload.event_id}:seat:{payload.seat_no}" async with redis_client.lock(lock_key, timeout=10, blocking_timeout=2): stmt = select(EventSeat).where(EventSeat.event_id == payload.event_id, EventSeat.seat_no == payload.seat_no).with_for_update() seat = (await db.execute(stmt)).scalar_one_or_none() if not seat or seat.is_reserved: raise HTTPException(status_code=409, detail="Seat already reserved by another transaction") seat.is_reserved = True seat.reserved_by = user.id booking = Booking(user_id=user.id, event_id=payload.event_id, seat_id=seat.id, status=BookingStatus.CONFIRMED) db.add(booking) await db.commit() await db.refresh(booking) return booking `;

const HOLO = [[127, 227, 245], [180, 156, 255], [255, 159, 216]];
const GLYPHS = "01<>{}[]=+*#%$/\\|";

const hash = (a, b, c = 0) => {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const ease = (k) => 1 - Math.pow(1 - clamp(k), 3);
const holoAt = (u) => {
  u = clamp(u);
  return u < 0.5 ? mix(HOLO[0], HOLO[1], u * 2) : mix(HOLO[1], HOLO[2], (u - 0.5) * 2);
};
const glyph = (a, b) => GLYPHS[(hash(a, b, 3) * GLYPHS.length) | 0];
const mono = (w, s) => `${w} ${s}px "JetBrains Mono", ui-monospace, monospace`;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const once = (el, fn, threshold = 0.3) => {
  if (!el) return;
  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) {
      io.disconnect();
      fn();
    }
  }, { threshold });
  io.observe(el);
};

const onResize = (fn) => {
  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(fn, 150);
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fn);
  } else {
    setTimeout(fn, 50);
  }
};

const textNodes = (el) => {
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const out = [];
  while (w.nextNode()) out.push(w.currentNode);
  return out;
};

function hidpi(cv) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = cv.clientWidth || window.innerWidth;
  const H = cv.clientHeight || 640;
  cv.width = W * dpr;
  cv.height = H * dpr;
  const g = cv.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { g, W, H, dpr };
}

// Hero Living Code Field + Canvas-integrated ASCII Architecture Data-flow Diagram
function initHeroField() {
  const cv = $("#hero-canvas");
  const btn = $("#motion");
  const pipelineBtn = $("#pipeline-toggle-btn");
  const pipelineLabel = $("#pipeline-label");
  if (!cv) return;

  const PIPELINES = [
    {
      id: "booking",
      name: "Pipeline: Concurrency Lock",
      lines: [
        "[CLIENT: POST /reserve]",
        "           │",
        "           ▼",
        "[FASTAPI ASYNC ROUTER]",
        "           │",
        "           ▼",
        "[REDIS LOCK: ACQUIRED]",
        "           │",
        "           ▼",
        "[PG: SELECT FOR UPDATE]",
        "           │",
        "           ▼",
        "[201 CREATED: 0 RACES]"
      ]
    },
    {
      id: "taskflow",
      name: "Pipeline: Multi-Tenant RBAC",
      lines: [
        "[TENANT: GET /projects]",
        "           │",
        "           ▼",
        "[REDIS: RATE LIMIT <1ms]",
        "           │",
        "           ▼",
        "[JWT WORKSPACE RBAC]",
        "           │",
        "           ▼",
        "[PG: TENANT ISOLATION]",
        "           │",
        "           ▼",
        "[200 OK: CACHED TO REDIS]"
      ]
    }
  ];

  let currentPipelineIdx = 0;
  const bg = document.createElement("canvas");
  let ctx, W, H, CW, LH, FS, COLS, ROWS, bgRow = -1;
  let frozen = reduce, onScreen = true, started = true, t0 = performance.now(), tPause = 0, last = 0;
  let pipelineCells = [];

  function mapPipelineCells() {
    pipelineCells = [];
    const pipe = PIPELINES[currentPipelineIdx];
    const isMobile = W <= 900;
    const rawLines = isMobile
      ? pipe.lines.filter((_, idx) => idx % 3 !== 1)
      : pipe.lines;
    const maxLineLen = Math.max(...rawLines.map((l) => l.length));

    let c0, r0;
    if (!isMobile) {
      c0 = Math.max(0, Math.floor(COLS * 0.72 - maxLineLen / 2));
      r0 = Math.max(1, Math.floor((ROWS - rawLines.length) * 0.46));
    } else {
      c0 = Math.max(0, Math.floor((COLS - maxLineLen) / 2));
      const introEl = cv.parentElement?.querySelector(".intro");
      const introTop = introEl ? introEl.offsetTop : 270;
      const topRow = Math.ceil(74 / LH);
      const availRows = Math.floor((introTop - 14) / LH) - topRow;
      r0 = topRow + Math.max(0, Math.floor((availRows - rawLines.length) / 2));
    }

    const step = isMobile ? 2 : 3;
    rawLines.forEach((lineText, rIdx) => {
      const y = r0 + rIdx;
      if (y >= ROWS) return;

      const isArrow = rIdx % step !== 0;
      const tier = Math.floor(rIdx / step);

      for (let cIdx = 0; cIdx < lineText.length; cIdx++) {
        const ch = lineText[cIdx];
        if (ch !== " ") {
          const x = c0 + cIdx;
          if (x < COLS) {
            pipelineCells.push({ x, y, ch, tier, isArrow, rIdx, cIdx });
          }
        }
      }
    });

    if (pipelineLabel) {
      pipelineLabel.textContent = pipe.name;
    }
  }

  function layout() {
    const c = hidpi(cv);
    ctx = c.g; W = c.W; H = c.H;
    bg.width = cv.width; bg.height = cv.height;
    bg.getContext("2d").setTransform(c.dpr, 0, 0, c.dpr, 0, 0);
    bgRow = -1;
    FS = W < 600 ? 10 : W < 900 ? 11 : 12.5;
    LH = Math.round(FS * 1.34);
    ctx.font = mono(400, FS);
    CW = Math.max(6, ctx.measureText("M").width);
    COLS = Math.ceil(W / CW);
    ROWS = Math.ceil(H / LH);
    mapPipelineCells();
  }

  const charAt = (x, y, row) => {
    const ch = SRC[((y + row) * COLS + x) % SRC.length];
    return ch === " " ? "·" : ch;
  };

  function drawBg(row) {
    const b = bg.getContext("2d");
    b.clearRect(0, 0, W, H);
    b.font = mono(400, FS);
    b.fillStyle = "#1e1b19";
    for (let y = 0; y < ROWS; y++) {
      let line = "";
      for (let x = 0; x < COLS; x++) line += SRC[((y + row) * COLS + x) % SRC.length];
      b.fillText(line, 0, (y + 1) * LH);
    }
    bgRow = row;
  }

  function frame(t) {
    const row = Math.floor(t * 1.05);
    if (row !== bgRow) drawBg(row);
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(bg, 0, 0, W, H);

    // Ambient stars in matrix
    ctx.font = mono(400, FS);
    for (let k = 0; k < 36; k++) {
      const tk = t * 0.7 + hash(k, 9);
      const i = (hash(k, Math.floor(tk)) * COLS * ROWS) | 0;
      const x = i % COLS, y = (i / COLS) | 0;
      const a = Math.sin((tk % 1) * Math.PI);
      ctx.globalAlpha = 0.45 * a;
      ctx.fillStyle = "#efe9dd";
      ctx.fillText(charAt(x, y, row), x * CW, (y + 1) * LH);
    }

    // Auto-rotate pipelines every 9 seconds if not frozen
    if (!frozen) {
      const pIdx = Math.floor(t / 9) % PIPELINES.length;
      if (pIdx !== currentPipelineIdx) {
        currentPipelineIdx = pIdx;
        mapPipelineCells();
      }
    }

    // Real-time data pulse traveling down the pipeline nodes (0 -> 1 -> 2 -> 3 -> 4)
    const pulseCycle = (t % 2.4) / 2.4;
    const activeTier = Math.floor(pulseCycle * 5);
    const pulseSub = (pulseCycle * 5) % 1;

    // Draw the ASCII architecture pipeline on top of the matrix
    ctx.font = mono(700, FS);

    for (const cell of pipelineCells) {
      const { x, y, ch, tier, isArrow } = cell;

      // Dark backing block so code text doesn't clash
      ctx.globalAlpha = 0.88;
      ctx.fillStyle = "#0a0908";
      ctx.fillRect(x * CW - 0.5, y * LH + 2, CW + 1, LH + 1);

      const isCurrentActiveTier = tier === activeTier;
      const isNextArrow = isArrow && tier === activeTier;

      if (isCurrentActiveTier) {
        // Active tier glowing intensely with pulse
        const c = holoAt(tier / 4);
        ctx.globalAlpha = 1;
        ctx.fillStyle = pulseSub > 0.5 ? "#ffffff" : rgb(c);
        ctx.shadowColor = rgb(c, 0.9);
        ctx.shadowBlur = 14;
        ctx.fillText(ch, x * CW, (y + 1) * LH);
        ctx.shadowBlur = 0;
      } else if (isNextArrow) {
        // Arrow currently carrying the packet
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = "#7fe3f5";
        ctx.shadowColor = "rgba(127, 227, 245, 0.8)";
        ctx.shadowBlur = 10;
        ctx.fillText(ch, x * CW, (y + 1) * LH);
        ctx.shadowBlur = 0;
      } else {
        // Ambient node state
        const c = holoAt(tier / 4.5);
        ctx.globalAlpha = isArrow ? 0.6 : 0.85;
        ctx.fillStyle = isArrow ? "#8a8174" : rgb(c);
        ctx.fillText(ch, x * CW, (y + 1) * LH);
      }
    }

    ctx.globalAlpha = 1;
  }

  const now = () => (frozen ? tPause : (performance.now() - t0) / 1000);

  function tick(ms) {
    if (started && !frozen && onScreen && !document.hidden && ms - last > 33) {
      last = ms;
      frame((ms - t0) / 1000);
    }
    requestAnimationFrame(tick);
  }

  function setFrozen(f) {
    if (f) tPause = now();
    else t0 = performance.now() - tPause * 1000;
    frozen = f;
    if (f) frame(tPause);
    if (btn) {
      btn.setAttribute("aria-pressed", String(f));
      btn.querySelector("span").textContent = f ? "Play motion" : "Pause motion";
      btn.querySelector("i").textContent = f ? "▶" : "❚❚";
    }
  }

  // Interactive pipeline switcher pill
  if (pipelineBtn) {
    pipelineBtn.addEventListener("click", () => {
      currentPipelineIdx = (currentPipelineIdx + 1) % PIPELINES.length;
      mapPipelineCells();
      if (frozen) frame(now());
    });
  }

  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { threshold: 0.1 }).observe(cv);
  onResize(() => { layout(); frame(now()); });
  layout();
  setFrozen(frozen);
  requestAnimationFrame(tick);
  if (btn) btn.addEventListener("click", () => setFrozen(!frozen));
}

// Decode Headings on Scroll
function initDecodeHeadings() {
  if (reduce) return;
  $$(".decode").forEach((el) => {
    const sr = document.createElement("span");
    const vis = document.createElement("span");
    sr.className = "sr";
    sr.textContent = el.innerText.replace(/\s+/g, " ").trim();
    vis.setAttribute("aria-hidden", "true");
    vis.append(...el.childNodes);
    el.append(sr, vis);

    const nodes = textNodes(vis).map((n) => [n, n.data]);
    const total = nodes.reduce((a, [, s]) => a + s.length, 0);
    const paint = (k) => {
      let i = 0;
      const q = Math.floor(performance.now() / 60);
      for (const [n, s] of nodes) {
        n.data = [...s].map((c) => (i++, /\s/.test(c) || k >= 0.25 + (0.75 * i) / total ? c : glyph(i, q))).join("");
      }
    };
    paint(0);
    once(el, () => {
      const t0 = performance.now();
      const dur = 480 + total * 15;
      (function step(ms) {
        const k = (ms - t0) / dur;
        paint(k);
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }, 0.5);
  });
}

// 01 Interactive Split-Pane Code & Architecture Inspector
function initCodeInspector() {
  const rv = $("#rv");
  if (!rv) return;

  const DATA = {
    booking: {
      cmd: "inspect --repo event-booking-ticketing-api",
      github: "https://github.com/abdulsamadchishti07/Event-Booking-Ticketing-API",
      projectId: "event-booking-ticketing-api",
      summary: "Flagship FastAPI + PostgreSQL + Redis backend engineered to eliminate race conditions during high-demand seat reservations.",
      files: [
        {
          name: "app/api/v1/bookings.py",
          tag: "concurrency guard",
          lines: [
            [12, "@router.post('/reserve', status_code=201)"],
            [13, "async def reserve_seat(payload: ReserveSchema, db: AsyncSession = Depends(get_db)):"],
            [14, "    lock_key = f'lock:event:{payload.event_id}:seat:{payload.seat_no}'"],
            [15, "    async with redis_client.lock(lock_key, timeout=10, blocking_timeout=2):"],
            [16, "        stmt = ("],
            [17, "            select(EventSeat)"],
            [18, "            .where(EventSeat.id == payload.seat_id)"],
            [19, "            .with_for_update()"],
            [20, "        )"],
            [21, "        seat = (await db.execute(stmt)).scalar_one_or_none()"],
            [22, "        if not seat or seat.is_reserved:"],
            [23, "            raise HTTPException(409, 'Seat already booked')"],
            [24, "        seat.is_reserved = True"],
            [25, "        await db.commit()"]
          ]
        },
        {
          name: "app/services/auth_service.py",
          tag: "lockout & rotation",
          lines: [
            [31, "async def authenticate_user(email: str, password: str, db: AsyncSession):"],
            [32, "    user = await get_user_by_email(db, email)"],
            [33, "    if user.failed_attempts >= MAX_LOGIN_ATTEMPTS and user.locked_until > now():"],
            [34, "        raise HTTPException(423, 'Account temporarily locked due to brute-force attempts')"],
            [35, "    if not verify_password(password, user.password_hash):"],
            [36, "        user.failed_attempts += 1"],
            [37, "        await db.commit()"],
            [38, "        raise HTTPException(401, 'Invalid credentials')"],
            [39, "    return issue_rotated_token_pair(user_id=user.id, role=user.role)"]
          ]
        }
      ],
      findings: [
        {
          sev: "CONCURRENCY",
          title: "Zero double-booking under concurrent checkout spikes",
          hl: { "app/api/v1/bookings.py": [14, 15, 16, 17, 18, 19, 24, 25] },
          what: "Combines a short-lived Redis distributed lock (`redis_client.lock`) with PostgreSQL `SELECT ... FOR UPDATE` row locking.",
          problem: "Without row-level locking, two users clicking 'Book' at the exact same millisecond read `is_reserved=False` and double-sell the seat.",
          fix: "Acquire Redis lock per seat -> lock row with `with_for_update()` -> deduct quota -> commit atomically."
        },
        {
          sev: "SECURITY",
          title: "Brute-force account lockout & refresh token rotation",
          hl: { "app/services/auth_service.py": [33, 34, 36, 39] },
          what: "Tracks failed login thresholds with automatic cooldown locks and rotates JWT refresh tokens on every use.",
          problem: "Static JWTs without lockout thresholds allow credential stuffing and token replay after logout.",
          fix: "Enforce `MAX_LOGIN_ATTEMPTS` with `423 Locked` response and invalidate old refresh tokens on logout."
        }
      ]
    },
    taskflow: {
      cmd: "inspect --repo project-management-api",
      github: "https://github.com/abdulsamadchishti07/Project-Management-API",
      projectId: "project-management-api",
      summary: "Multi-tenant FastAPI task & workspace management system built during my Software Engineering Internship at Moiz Tech Hub.",
      files: [
        {
          name: "app/dependencies/rbac.py",
          tag: "tenant isolation",
          lines: [
            [8, "class RequireWorkspaceRole:"],
            [9, "    def __init__(self, *allowed_roles: WorkspaceRole):"],
            [10, "        self.allowed_roles = set(allowed_roles)"],
            [11, ""],
            [12, "    async def __call__(self, workspace_id: UUID, user: User = Depends(current_user), db = Depends(get_db)):"],
            [13, "        member = await get_membership(db, workspace_id=workspace_id, user_id=user.id)"],
            [14, "        if not member or member.role not in self.allowed_roles:"],
            [15, "            raise HTTPException(403, 'Insufficient workspace permissions')"],
            [16, "        return member"]
          ]
        },
        {
          name: "app/middleware/rate_limit.py",
          tag: "redis caching",
          lines: [
            [21, "async def check_rate_limit(tenant_id: str, limit: int = 60, window: int = 60):"],
            [22, "    key = f'rl:{tenant_id}:{int(time.time() // window)}'"],
            [23, "    count = await redis.incr(key)"],
            [24, "    if count == 1:"],
            [25, "        await redis.expire(key, window)"],
            [26, "    if count > limit:"],
            [27, "        raise HTTPException(429, 'Tenant rate limit exceeded')"]
          ]
        }
      ],
      findings: [
        {
          sev: "ISOLATION",
          title: "4-Tier Workspace RBAC (Owner · Admin · Member · Viewer)",
          hl: { "app/dependencies/rbac.py": [8, 9, 12, 13, 14, 15] },
          what: "Reusable FastAPI dependency (`RequireWorkspaceRole`) that verifies both tenant membership and granular role privileges.",
          problem: "IDOR vulnerabilities happen when endpoints check `user.is_authenticated` without verifying workspace ownership.",
          fix: "Scope every query and mutation through `workspace_id` + `RequireWorkspaceRole` before touching the ORM."
        },
        {
          sev: "PERFORMANCE",
          title: "Per-tenant Redis rate limiting & read-through caching",
          hl: { "app/middleware/rate_limit.py": [21, 22, 23, 26, 27] },
          what: "Uses atomic `redis.incr` windows to cap noisy tenants at 60 req/min while caching frequent board/task reads.",
          problem: "A single noisy tenant running automated scripts can exhaust database connections for all other workspaces.",
          fix: "Reject excess traffic at the Redis edge with `429 Too Many Requests` in <1ms."
        }
      ]
    },
    ecommerce: {
      cmd: "inspect --repo django-ecommerce",
      github: "https://github.com/abdulsamadchishti07/Ecommerce",
      projectId: "ecommerce-backend",
      summary: "Modular Django + PostgreSQL + Docker backend handling OTP verification, cart state, and atomic order processing.",
      files: [
        {
          name: "apps/orders/services.py",
          tag: "atomic checkout",
          lines: [
            [14, "@transaction.atomic"],
            [15, "def create_order_from_cart(user, cart_id: int) -> Order:"],
            [16, "    cart_items = CartItem.objects.select_related('product').select_for_update().filter(cart_id=cart_id)"],
            [17, "    order = Order.objects.create(user=user, status=Order.Status.PENDING)"],
            [18, "    for item in cart_items:"],
            [19, "        if item.product.stock < item.quantity:"],
            [20, "            raise ValidationError(f'Insufficient stock for {item.product.name}')"],
            [21, "        item.product.stock = F('stock') - item.quantity"],
            [22, "        item.product.save(update_fields=['stock'])"],
            [23, "    cart_items.delete()"],
            [24, "    return order"]
          ]
        }
      ],
      findings: [
        {
          sev: "TRANSACTIONS",
          title: "Atomic checkout with `select_for_update()` & `F()` expressions",
          hl: { "apps/orders/services.py": [14, 16, 21, 22] },
          what: "Wraps order creation and inventory deduction inside `@transaction.atomic` with `select_related` and `F('stock')`.",
          problem: "Partial failures during checkout leave orphan orders or corrupt product stock counts.",
          fix: "Lock cart products, deduct stock atomically in SQL via `F('stock') - item.quantity`, and roll back on any error."
        }
      ]
    }
  };

  const tabs = $$(".rvt button");
  const sc = rv.querySelector(".sc");
  const cmd = rv.querySelector(".rv-cmd .c");
  const sum = rv.querySelector(".rv-sum");
  const list = rv.querySelector(".rv-list");
  const det = rv.querySelector(".rv-det");
  const ghLink = $("#rv-github-link");
  const modalBtn = $("#rv-modal-btn");

  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const md = (t) => esc(t).replace(/`([^`]+)`/g, "<code>$1</code>");

  let cur;

  function showFinding(i) {
    const f = cur.findings[i];
    const keys = new Set(Object.entries(f.hl).flatMap(([file, ns]) => ns.map((n) => `${file}:${n}`)));
    [...list.children].forEach((li, j) => li.classList.toggle("on", j === i));
    det.innerHTML = `
      <dl>
        <dt>Pattern</dt><dd>${md(f.what)}</dd>
        <dt>Risk</dt><dd>${md(f.problem)}</dd>
        <dt>Solution</dt><dd>${md(f.fix)}</dd>
      </dl>
    `;
    sc.querySelectorAll(".l").forEach((l) => l.classList.toggle("on", keys.has(l.dataset.k)));
    const [file0, ns0] = Object.entries(f.hl)[0];
    const first = sc.querySelector(`.l[data-k="${file0}:${ns0[0]}"]`);
    if (first) {
      sc.scrollTo({ top: Math.max(0, first.offsetTop - sc.clientHeight * 0.28), behavior: reduce ? "auto" : "smooth" });
    }
  }

  function renderRepo(key) {
    cur = DATA[key];
    tabs.forEach((b) => b.setAttribute("aria-selected", String(b.dataset.k === key)));
    cmd.textContent = cur.cmd;
    sum.innerHTML = md(cur.summary);
    if (ghLink) ghLink.href = cur.github;
    if (modalBtn) modalBtn.setAttribute("data-project-id", cur.projectId);

    sc.innerHTML = cur.files.map((f) =>
      `<div class="f">${esc(f.name)}<i>${esc(f.tag)}</i></div>` +
      f.lines.map((l) => `<div class="l" data-k="${esc(f.name)}:${l[0]}"><b>${l[0]}</b><span>${esc(l[1]) || " "}</span></div>`).join("")
    ).join("");

    list.innerHTML = cur.findings.map((f, i) =>
      `<li><button type="button"><span class="n">0${i + 1}</span><span class="s">${esc(f.sev)}</span><span class="t">${md(f.title)}</span></button></li>`
    ).join("");

    [...list.children].forEach((li, i) => {
      li.firstChild.addEventListener("click", () => showFinding(i));
    });

    showFinding(0);
  }

  tabs.forEach((b) => b.addEventListener("click", () => renderRepo(b.dataset.k)));
  renderRepo("booking");
}

// 02 Code-Strip Bars (Every bar is filled with real Python backend code)
function initCodeBars() {
  const chart = $("#chart");
  if (!chart) return;
  const ms = [...chart.querySelectorAll(".m")];
  ms.forEach((m, r) => {
    m.querySelectorAll(".bar s").forEach((s, b) => {
      s.textContent = (SRC + SRC).substr(((r * 3 + b) * 97) % SRC.length, 600);
    });
  });
}

// 03 Interactive Request-Flow Ladder
function initLadder() {
  const ladder = $(".ladder");
  if (!ladder) return;

  const EX = {
    burst: [1, "429 Too Many Requests (blocked at Redis edge in 0.4ms)"],
    tenant: [2, "403 Forbidden (RequireWorkspaceRole blocks Viewer)"],
    cache: [3, "200 OK (served from Redis read-through cache)"],
    seat: [4, "SELECT ... FOR UPDATE + Redis Lock (0 oversold seats)"]
  };

  const lis = [...ladder.children];
  const btns = $$(".ex button");
  const say = $("#ladder-say");
  const base = lis.map((li) => li.lastElementChild.textContent);
  let timer;

  const show = (n, stop, ans) => {
    lis.forEach((li, i) => {
      const hit = n === stop - 1;
      li.className = i < n ? "pass" : i === n ? (hit ? "hit" : "scan") : hit ? "skip" : "";
      li.lastElementChild.textContent = i < n ? "passed ✓" : i === n ? (hit ? ans : "checking…") : hit ? "" : base[i];
    });
  };

  function run(key) {
    const [stop, ans] = EX[key];
    clearInterval(timer);
    btns.forEach((b) => b.setAttribute("aria-selected", String(b.dataset.ex === key)));
    if (say) say.textContent = `Stops at layer ${stop}: ${ans}`;
    if (reduce) return show(stop - 1, stop, ans);
    let n = 0;
    show(0, stop, ans);
    timer = setInterval(() => {
      if (++n >= stop) return clearInterval(timer);
      show(n, stop, ans);
    }, 380);
  }

  btns.forEach((b) => b.addEventListener("click", () => run(b.dataset.ex)));
  once(ladder, () => run("seat"), 0.35);
}

// Cheeky Sun Button Cameo (Ponytail-style Light Mode Refusal from Screenshot 2!)
function initSunCameo() {
  const sun = $("#theme-toggle-btn");
  if (!sun) return;

  const NOPE = [
    "Rung one: does light mode need to exist on a backend portfolio? No.",
    "SELECT * FROM themes WHERE mode = 'light'; -- 0 rows returned.",
    "Light mode attracts bugs. We run dark in production.",
    "403 Forbidden: Light mode failed code review. Reviewer: Samad.",
    "My Redis cache only stores dark mode tokens.",
    "Your monitor has a brightness button. The hardware already has it.",
    "Light mode would add 300 lines of CSS. YAGNI."
  ];

  function drawHolographicAvatar(c) {
    const g = c.getContext("2d");
    const W = c.width, H = c.height;
    g.clearRect(0, 0, W, H);

    // Draw a stylized holographic code-terminal developer badge
    const grad = g.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#7fe3f5");
    grad.addColorStop(0.5, "#b49cff");
    grad.addColorStop(1, "#ff9fd8");

    g.fillStyle = "#0e0d0c";
    g.strokeStyle = grad;
    g.lineWidth = 3;
    g.beginPath();
    g.arc(W / 2, H / 2, 40, 0, Math.PI * 2);
    g.fill();
    g.stroke();

    // Glasses + terminal prompt eyes
    g.strokeStyle = grad;
    g.lineWidth = 2.5;
    g.strokeRect(W / 2 - 24, H / 2 - 12, 18, 13);
    g.strokeRect(W / 2 + 6, H / 2 - 12, 18, 13);
    g.beginPath();
    g.moveTo(W / 2 - 6, H / 2 - 6);
    g.lineTo(W / 2 + 6, H / 2 - 6);
    g.stroke();

    g.fillStyle = "#efe9dd";
    g.font = '800 11px "JetBrains Mono", monospace';
    g.textAlign = "center";
    g.fillText(">_", W / 2, H / 2 + 18);
  }

  let cameo, say, n = 0, timer, typeTimer;
  const hide = () => cameo && cameo.classList.remove("show");

  sun.addEventListener("click", () => {
    if (!cameo) {
      cameo = document.createElement("div");
      cameo.className = "cameo";
      cameo.innerHTML = '<p class="say" role="status" aria-live="polite"></p><canvas width="96" height="96" aria-hidden="true"></canvas>';
      document.body.append(cameo);
      say = cameo.firstChild;
      drawHolographicAvatar(cameo.lastChild);
      cameo.addEventListener("click", hide);
      window.addEventListener("keydown", (e) => e.key === "Escape" && hide());
      cameo.getBoundingClientRect();
    }

    const line = NOPE[n++ % NOPE.length];
    clearInterval(typeTimer);
    if (reduce) {
      say.textContent = line;
    } else {
      say.innerHTML = '<span class="t"></span><span class="cur"></span>';
      const tSpan = say.querySelector(".t");
      let i = 0;
      typeTimer = setInterval(() => {
        tSpan.textContent = line.slice(0, ++i);
        if (i >= line.length) clearInterval(typeTimer);
      }, 22);
    }

    cameo.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(hide, 3400 + line.length * 40);
  });
}

function boot() {
  initHeroField();
  initDecodeHeadings();
  initCodeInspector();
  initCodeBars();
  initLadder();
  initSunCameo();

  initNavigation();
  initProjects();
  initContact();

  // Wire the Inspector's "Full Architecture Diagram" button to open the Case Study modal
  const rvModalBtn = $("#rv-modal-btn");
  if (rvModalBtn) {
    rvModalBtn.addEventListener("click", () => {
      const pid = rvModalBtn.getAttribute("data-project-id");
      const matchingCardBtn = document.querySelector(`#projects-grid .btn-project-cta[data-project-id="${pid}"]`);
      if (matchingCardBtn) matchingCardBtn.click();
    });
  }

  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
