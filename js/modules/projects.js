/**
 * Projects Module
 * Filtering and native <dialog> architecture deep-dive case study modal
 */

import { projectsData } from '../data/projectsData.js';

export function initProjects() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modal = document.getElementById('case-study-modal');
  const modalWrapper = document.getElementById('modal-wrapper');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // Render Project Cards
  renderProjects('all');

  // Filter Buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      renderProjects(category);
    });
  });

  // Modal Setup
  if (modal) {
    // Native light-dismiss: close when clicking backdrop
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        modal.close();
      }
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        modal.close();
      });
    }
  }

  function renderProjects(category) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    const filtered = category === 'all'
      ? projectsData
      : projectsData.filter((p) => p.category === category);

    grid.innerHTML = filtered.map((project) => `
      <article class="project-card" data-category="${project.category}">
        <div class="project-card-top">
          <div class="project-card-header">
            <span class="project-category-badge">${project.categoryLabel}</span>
          </div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-desc">${project.tagline}</p>
        </div>

        <div class="project-impact-box ${project.impactBannerColor}">
          <span class="project-impact-text">⚡ ${project.impactBanner}</span>
        </div>

        <div class="project-tech-tags">
          ${project.techStack.map((tech) => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>

        <div class="project-card-footer">
          <button class="btn-project-cta" data-project-id="${project.id}" aria-label="Explore architecture of ${project.title}">
            <span>Architecture & Details</span>
            <div class="icon-slot icon-sm">
              <img src="assets/icons/arrow-up-right.svg" alt="Open case study" onerror="this.parentElement.textContent='↗';">
            </div>
          </button>

          <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-project-github" aria-label="View ${project.title} on GitHub" title="View Source on GitHub">
            <div class="icon-slot icon-sm" style="width: 20px; height: 20px; border: none; background: transparent;">
              <img src="assets/icons/github.svg" alt="GitHub icon" onerror="this.parentElement.textContent='GH';">
            </div>
            <span>GitHub</span>
          </a>
        </div>
      </article>
    `).join('');

    // Attach listeners to newly rendered buttons
    grid.querySelectorAll('.btn-project-cta').forEach((btn) => {
      btn.addEventListener('click', () => {
        const projectId = btn.getAttribute('data-project-id');
        openCaseStudy(projectId);
      });
    });
  }

  function openCaseStudy(projectId) {
    const project = projectsData.find((p) => p.id === projectId);
    if (!project || !modal) return;

    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');
    const modalBadge = document.getElementById('modal-badge');

    if (modalTitle) modalTitle.textContent = project.title;
    if (modalBadge) modalBadge.textContent = project.categoryLabel;

    if (modalBody) {
      modalBody.innerHTML = `
        <!-- Overview & Impact -->
        <div>
          <h4 class="modal-section-title">
            <span class="modal-section-indicator"></span>
            <span>System Overview</span>
          </h4>
          <p class="project-desc" style="font-size: var(--text-base); line-height: 1.7; margin-bottom: 0;">
            ${project.description}
          </p>
          <div class="modal-impact-banner">
            <span class="status-dot"></span>
            <span><strong>Impact:</strong> ${project.impactBanner}</span>
          </div>
        </div>

        <!-- Key Metrics Grid -->
        <div>
          <h4 class="modal-section-title">
            <span class="modal-section-indicator sage"></span>
            <span>Technical Highlights & Metrics</span>
          </h4>
          <div class="modal-metrics-grid">
            ${project.metrics.map((m) => `
              <div class="modal-metric-card">
                <span class="modal-metric-value">${m.value}</span>
                <span class="modal-metric-label">${m.label}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Architecture Flow Terminal Window -->
        <div>
          <h4 class="modal-section-title">
            <span class="modal-section-indicator amber"></span>
            <span>Architecture & Data Flow</span>
          </h4>
          <div class="terminal-window">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="terminal-dot red"></span>
                <span class="terminal-dot yellow"></span>
                <span class="terminal-dot green"></span>
              </div>
              <span class="terminal-title">architecture-flow.diagram</span>
              <span style="font-family: var(--font-mono); font-size: 0.7rem; color: #626875;">ASCII View</span>
            </div>
            <pre class="terminal-content">${project.architecture}</pre>
          </div>
        </div>

        <!-- Engineering Challenges & Trade-offs -->
        <div>
          <h4 class="modal-section-title">
            <span class="modal-section-indicator"></span>
            <span>Engineering Challenges & Solutions</span>
          </h4>
          <div class="modal-tradeoffs-grid">
            ${project.challenges.map((c) => `
              <div class="tradeoff-card">
                <h5 class="tradeoff-title">⚡ ${c.title}</h5>
                <p class="tradeoff-desc">${c.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Technologies Used with Icon Slots -->
        <div>
          <h4 class="modal-section-title">
            <span class="modal-section-indicator sage"></span>
            <span>Stack & Tools</span>
          </h4>
          <div class="project-tech-tags" style="gap: 10px;">
            ${project.techStack.map((tech, idx) => `
              <div class="skill-item-row" style="padding: 6px 14px; background: var(--bg-subtle);">
                <div class="icon-slot icon-sm">
                  <img src="assets/icons/${project.techIcons[idx] || 'server.svg'}" alt="${tech} icon" onerror="this.parentElement.textContent='${tech[0]}';">
                </div>
                <span class="skill-name" style="margin-left: 8px;">${tech}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Actions Footer -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle); margin-top: 0.5rem;">
          <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="gap: 10px;">
            <div class="icon-slot icon-sm" style="background: rgba(255, 255, 255, 0.2); border: none;">
              <img src="assets/icons/github.svg" alt="GitHub icon" onerror="this.parentElement.textContent='GH';">
            </div>
            <span>View Repository on GitHub ↗</span>
          </a>

          <button id="modal-footer-close-btn" class="btn btn-secondary" style="padding: 10px 20px;">
            <span>Close Case Study</span>
          </button>
        </div>
      `;

      // Attach listener to footer close button
      const footerCloseBtn = modalBody.querySelector('#modal-footer-close-btn');
      if (footerCloseBtn) {
        footerCloseBtn.addEventListener('click', () => {
          modal.close();
        });
      }
    }

    modal.showModal();
  }
}
