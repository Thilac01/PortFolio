/**
 * Main Application Logic - Thilac Ramesh Portfolio
 * Handles project rendering, category filters, timeline visualization,
 * modal dialogs, robotic workflow canvas lifecycle, and PDF/video previews.
 */

let currentProjectsList = [];
let activeWorkflowCanvas = null;
let currentActiveProject = null;

document.addEventListener("DOMContentLoaded", () => {
  // Load projects from data store
  currentProjectsList = getStoredProjects();

  // Initialize Sections
  initHeroStats();
  initTimeline();
  initProjectFilters();
  renderProjects("all");
  initCompetitions();
  initModals();
  initThemeToggle();
  initMobileNav();
  initContactForm();

  // Handle URL hash direct linking
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 200);
    }
  }
});

/* ==========================================================================
   HERO STATS COUNTER
   ========================================================================== */
function initHeroStats() {
  const statNumbers = document.querySelectorAll(".metric-number");
  statNumbers.forEach(stat => {
    const text = stat.textContent.trim();
    // Subtle entrance animation
    stat.style.opacity = "0";
    stat.style.transform = "translateY(8px)";
    setTimeout(() => {
      stat.style.transition = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      stat.style.opacity = "1";
      stat.style.transform = "translateY(0)";
    }, 150);
  });
}

/* ==========================================================================
   INTERACTIVE CAREER JOURNEY TIMELINE (Thanh Tran Inspiration)
   ========================================================================== */
function initTimeline() {
  const track = document.getElementById("career-track");
  if (!track) return;

  track.innerHTML = "";

  TIMELINE_MILESTONES.forEach((item, index) => {
    const nodeEl = document.createElement("div");
    nodeEl.className = `track-node-item ${item.isCurrent ? "is-current-stage" : ""}`;
    nodeEl.dataset.index = index;

    // Theme class based on role/phase
    const themeMap = {
      "Foundation & Hardware Phase": "theme-hardware",
      "Mechanical Engineering Rigor": "theme-mechanical",
      "Autonomous Robotics & SLAM": "theme-robotics",
      "Future Horizons": "theme-future"
    };
    const themes = ["theme-hardware", "theme-mechanical", "theme-robotics", "theme-future"];
    const themeClass = themeMap[item.phase] || themes[index % themes.length];

    let currentIndicatorHtml = "";
    if (item.isCurrent) {
      currentIndicatorHtml = `
        <div class="current-marker-callout">
          <div class="current-marker-badge">${item.currentLabel || "I am here!"}</div>
          <div class="current-marker-arrow"></div>
        </div>
      `;
    } else if (item.currentLabel) {
      currentIndicatorHtml = `
        <div class="current-marker-callout">
          <div class="current-marker-badge" style="background: #8b5cf6; box-shadow: 0 0 10px rgba(139, 92, 246, 0.5)">${item.currentLabel}</div>
          <div class="current-marker-arrow" style="border-top-color: #8b5cf6"></div>
        </div>
      `;
    }

    nodeEl.innerHTML = `
      ${currentIndicatorHtml}
      <div class="node-capsule-box ${themeClass} ${item.isCurrent ? "current-node" : ""}" tabindex="0">
        <span class="node-title-main">${item.role}</span>
        <span class="node-time-badge">${item.period}</span>
      </div>
      <div class="node-phase-tag">
        <strong>${item.phase}</strong><br>
        <span style="opacity: 0.75; font-size: 0.68rem;">${item.location}</span>
      </div>
    `;

    nodeEl.addEventListener("click", () => {
      selectTimelineMilestone(item);
    });

    track.appendChild(nodeEl);
  });

  // Default select current milestone
  const currentMilestone = TIMELINE_MILESTONES.find(m => m.isCurrent) || TIMELINE_MILESTONES[0];
  selectTimelineMilestone(currentMilestone);
}

function selectTimelineMilestone(item) {
  const panel = document.getElementById("milestone-detail-panel");
  if (!panel) return;

  const iconHtml = item.logo
    ? `<img src="${item.logo}" alt="${item.org}" style="width: 32px; height: 32px; object-fit: contain; border-radius: 50%; display: block;" />`
    : `<i class="fas fa-${item.isCurrent ? "robot" : "compass"}"></i>`;

  panel.innerHTML = `
    <div class="detail-left">
      <div class="detail-icon-box" style="${item.logo ? 'background: #ffffff; padding: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);' : ''}">
        ${iconHtml}
      </div>
      <div>
        <div class="detail-role">${item.role}</div>
        <div class="detail-org">${item.org} &bull; ${item.period} (${item.location})</div>
      </div>
    </div>
    <div class="detail-desc">
      ${item.summary}
    </div>
  `;
}

/* ==========================================================================
   PROJECTS RENDERING & CATEGORY FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.dataset.filter || "all";
      renderProjects(category);
    });
  });
}

function renderProjects(category = "all") {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  const filtered = category === "all" 
    ? currentProjectsList 
    : currentProjectsList.filter(p => p.category === category);

  // Update counts
  updateFilterCounts();

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="projects-empty" style="grid-column: 1/-1; text-align: center; padding: 4rem; background: rgba(15,23,42,0.5); border-radius: 16px; border: 1px dashed var(--border-subtle)">
        <i class="fas fa-folder-open" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem; display: block;"></i>
        <p>No projects found matching the selected category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = "";

  filtered.forEach(proj => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.dataset.id = proj.id;

    // Metrics mini-grid
    let metricsHtml = "";
    if (proj.metrics && proj.metrics.length >= 2) {
      metricsHtml = `
        <div class="card-metrics-grid">
          <div class="card-metric-cell">
            <span class="metric-name">${proj.metrics[0].label}</span>
            <span class="metric-val">${proj.metrics[0].value}</span>
          </div>
          <div class="card-metric-cell">
            <span class="metric-name">${proj.metrics[1].label}</span>
            <span class="metric-val">${proj.metrics[1].value}</span>
          </div>
        </div>
      `;
    }

    // Media badges
    const hasVideo = !!proj.videoUrl;
    const hasPdf = !!proj.pdfUrl;
    const hasWorkflow = proj.workflow && proj.workflow.length > 0;

    const tagsHtml = (proj.tags || []).slice(0, 4).map(t => `<span class="tag-pill">${t}</span>`).join("");

    card.innerHTML = `
      <div class="project-card-media">
        <img src="${proj.heroImage || 'assets/schematic-quadruped.svg'}" alt="${escapeHtml(proj.title)}" class="project-card-img" loading="lazy" />
        <span class="project-category-badge">${proj.categoryLabel || proj.category}</span>
        <div class="project-media-badges">
          ${hasWorkflow ? `<span class="media-tag-icon" title="Robotic Workflow Palette"><i class="fas fa-project-diagram"></i></span>` : ''}
          ${hasPdf ? `<span class="media-tag-icon" title="Technical PDF Documentation"><i class="fas fa-file-pdf"></i></span>` : ''}
          ${hasVideo ? `<span class="media-tag-icon" title="Video Demo Demonstration"><i class="fas fa-play"></i></span>` : ''}
        </div>
      </div>
      <div class="project-card-body">
        <div class="project-card-header">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span class="project-date">${proj.date} &bull; ${proj.role}</span>
            ${proj.companyLogo ? `<div style="width: 26px; height: 26px; border-radius: 50%; background: #ffffff; border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; padding: 2px; flex-shrink: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.08);"><img src="${proj.companyLogo}" alt="${proj.companyName || ''}" title="${proj.companyName || ''}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;" /></div>` : ''}
          </div>
          <h3 class="project-title">${escapeHtml(proj.title)}</h3>
        </div>
        <p class="project-tagline">${escapeHtml(proj.tagline || proj.description)}</p>
        ${metricsHtml}
        <div class="project-tags">
          ${tagsHtml}
        </div>
        <div class="project-card-footer">
          <button class="btn-inspect" onclick="openProjectModal('${proj.id}')">
            <i class="fas fa-layer-group"></i> Inspect Workflow &amp; Media
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function updateFilterCounts() {
  const counts = {
    all: currentProjectsList.length,
    robotics: currentProjectsList.filter(p => p.category === "robotics").length,
    mechanical: currentProjectsList.filter(p => p.category === "mechanical").length,
    software: currentProjectsList.filter(p => p.category === "software").length,
    research: currentProjectsList.filter(p => p.category === "research").length
  };

  document.querySelectorAll(".filter-btn").forEach(btn => {
    const filter = btn.dataset.filter || "all";
    const countSpan = btn.querySelector(".filter-count");
    if (countSpan && counts[filter] !== undefined) {
      countSpan.textContent = counts[filter];
    }
  });
}

/* ==========================================================================
   PROJECT DETAIL & ROBOTIC WORKFLOW MODAL
   ========================================================================== */
function openProjectModal(projectId) {
  const project = currentProjectsList.find(p => p.id === projectId);
  if (!project) return;

  currentActiveProject = project;

  const modal = document.getElementById("project-detail-modal");
  if (!modal) return;

  // Set titles & meta
  const titleEl = document.getElementById("modal-project-title");
  if (titleEl) {
    titleEl.innerHTML = `
      ${escapeHtml(project.title)}
      ${project.companyLogo ? `<span style="display: inline-flex; vertical-align: middle; margin-left: 8px; width: 30px; height: 30px; border-radius: 50%; background: #ffffff; border: 1px solid var(--border-subtle); padding: 2px; align-items: center; justify-content: center; box-shadow: 0 1px 4px rgba(0,0,0,0.1);"><img src="${project.companyLogo}" alt="${project.companyName || ''}" title="${project.companyName || ''}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;" /></span>` : ''}
    `;
  }
  document.getElementById("modal-project-meta").textContent = `${project.categoryLabel || project.category.toUpperCase()} | ${project.date} | ${project.role}`;
  document.getElementById("modal-project-desc").textContent = project.description;

  // External Action Links
  const liveBtn = document.getElementById("modal-link-live");
  if (liveBtn) {
    if (project.liveUrl) {
      liveBtn.href = project.liveUrl;
      liveBtn.style.display = "inline-flex";
    } else {
      liveBtn.style.display = "none";
    }
  }

  const pdfBtn = document.getElementById("modal-link-pdf");
  if (pdfBtn) {
    if (project.pdfUrl) {
      pdfBtn.href = project.pdfUrl;
      pdfBtn.style.display = "inline-flex";
    } else {
      pdfBtn.style.display = "none";
    }
  }

  // Render Workflow Canvas
  const canvasContainer = document.getElementById("modal-workflow-canvas-container");
  if (canvasContainer) {
    activeWorkflowCanvas = new RoboticWorkflowCanvas(canvasContainer, {
      interactive: true,
      accentColor: "#38bdf8"
    });
    activeWorkflowCanvas.render(project.workflow || []);
  }

  // Setup Media Tabs (Workflow, Gallery, Video, PDF)
  setupModalMediaTabs(project);

  // Render Full Metrics Table
  renderProjectMetricsTable(project);

  // Open modal
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function setupModalMediaTabs(project) {
  const tabs = document.querySelectorAll(".modal-media-tabs .media-tab-btn");
  const tabWorkflow = document.getElementById("view-tab-workflow");
  const tabGallery = document.getElementById("view-tab-gallery");
  const tabVideo = document.getElementById("view-tab-video");
  const tabPdf = document.getElementById("view-tab-pdf");

  function switchTab(targetName) {
    tabs.forEach(t => t.classList.toggle("active", t.dataset.view === targetName));
    if (tabWorkflow) tabWorkflow.style.display = targetName === "workflow" ? "block" : "none";
    if (tabGallery) tabGallery.style.display = targetName === "gallery" ? "block" : "none";
    if (tabVideo) tabVideo.style.display = targetName === "video" ? "block" : "none";
    if (tabPdf) tabPdf.style.display = targetName === "pdf" ? "block" : "none";

    if (targetName === "workflow" && activeWorkflowCanvas) {
      requestAnimationFrame(() => activeWorkflowCanvas.drawRoboticConduits());
    }
  }

  tabs.forEach(tab => {
    tab.onclick = () => switchTab(tab.dataset.view);
  });

  // Populate Gallery
  if (tabGallery) {
    const galleryContainer = document.getElementById("modal-gallery-container");
    const images = project.gallery && project.gallery.length > 0 ? project.gallery : [project.heroImage];
    galleryContainer.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; padding: 1rem;">
        ${images.map(img => `
          <div style="background: #090e18; border-radius: 12px; border: 1px solid var(--border-subtle); overflow: hidden; padding: 1rem; text-align: center;">
            <img src="${img}" alt="CAD Schematic" style="max-width: 100%; max-height: 320px; object-fit: contain; cursor: pointer;" onclick="window.open('${img}', '_blank')" />
            <div style="margin-top: 0.5rem; font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono);">Click to expand high-res</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // Populate Video Player
  if (tabVideo) {
    const videoContainer = document.getElementById("modal-video-container");
    if (project.videoUrl) {
      videoContainer.innerHTML = `
        <div style="padding: 1rem; width: 100%;">
          <iframe class="modal-video-frame" src="${project.videoUrl}" title="Project Video Demonstration" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      `;
    } else {
      videoContainer.innerHTML = `
        <div style="padding: 3rem; text-align: center; color: var(--text-muted);">
          <i class="fas fa-video-slash" style="font-size: 2rem; margin-bottom: 0.75rem; display: block;"></i>
          <p>No video demo attached for this specific mechanical assembly.</p>
          <p style="font-size: 0.8rem; margin-top: 0.5rem;">Use the Admin Portal to attach a YouTube demonstration or MP4 video URL anytime!</p>
        </div>
      `;
    }
  }

  // Populate PDF Viewer
  if (tabPdf) {
    const pdfContainer = document.getElementById("modal-pdf-container");
    const pdfSource = project.pdfUrl || "assets/CV.pdf";
    pdfContainer.innerHTML = `
      <div style="width: 100%; height: 100%;">
        <div style="padding: 0.5rem 1rem; background: #0f172a; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--accent-cyan);"><i class="fas fa-file-alt"></i> EMBEDDED TECHNICAL SPECIFICATION</span>
          <a href="${pdfSource}" target="_blank" class="btn btn-outline" style="padding: 0.3rem 0.8rem; font-size: 0.75rem;"><i class="fas fa-external-link-alt"></i> Open in New Tab</a>
        </div>
        <iframe class="modal-pdf-frame" src="${pdfSource}#toolbar=0" title="PDF Document Viewer"></iframe>
      </div>
    `;
  }

  // Default to workflow tab
  switchTab("workflow");
}

function renderProjectMetricsTable(project) {
  const container = document.getElementById("modal-metrics-table-container");
  if (!container) return;

  if (!project.metrics || project.metrics.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <h4 style="font-size: 1.05rem; margin-bottom: 0.75rem; color: var(--text-primary);"><i class="fas fa-sliders-h" style="color: var(--accent-cyan)"></i> Engineering Specifications &amp; Parameters</h4>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
      ${project.metrics.map(m => `
        <div style="padding: 0.75rem 1rem; background: rgba(30, 41, 59, 0.4); border: 1px solid var(--border-subtle); border-radius: 8px;">
          <div style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">${escapeHtml(m.label)}</div>
          <div style="font-size: 0.95rem; font-weight: 700; color: var(--accent-cyan); margin-top: 0.2rem;">${escapeHtml(m.value)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

/* ==========================================================================
   DEDICATED PDF RESUME VIEWER MODAL
   ========================================================================== */
function openResumeModal() {
  const modal = document.getElementById("resume-viewer-modal");
  if (!modal) return;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function openCswaModal() {
  const modal = document.getElementById("cswa-credential-modal");
  if (!modal) return;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
window.openCswaModal = openCswaModal;
window.openResumeModal = openResumeModal;

function closeModals() {
  document.querySelectorAll(".modal-backdrop").forEach(m => {
    m.classList.remove("open");
  });
  document.body.style.overflow = "";
}

function initModals() {
  // Close on backdrop click or close button
  document.querySelectorAll(".modal-backdrop").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModals();
    });
  });

  document.querySelectorAll(".modal-close-btn").forEach(btn => {
    btn.addEventListener("click", closeModals);
  });

  // ESC key to close
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModals();
  });
}

/* ==========================================================================
   THEME SETUP (Light Theme as Default)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  if (toggleBtn) {
    toggleBtn.style.display = "none";
  }

  // Enforce LIGHT mode as default
  document.body.classList.remove("dark-theme");
  document.body.classList.add("light-theme");
  localStorage.setItem("thilac_portfolio_theme", "light");

  toggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
    if (isDark) {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
      localStorage.setItem("thilac_portfolio_theme", "light");
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
      toggleBtn.setAttribute("title", "Switch to Dark Mode");
    } else {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
      localStorage.setItem("thilac_portfolio_theme", "dark");
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
      toggleBtn.setAttribute("title", "Switch to Light Mode");
    }
  });
}

/* ==========================================================================
   MOBILE NAV TOGGLE
   ========================================================================== */
function initMobileNav() {
  const toggle = document.querySelector(".mobile-nav-toggle");
  const menu = document.querySelector(".nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
  });

  const links = menu.querySelectorAll(".nav-link");
  links.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // IntersectionObserver scroll-spy for active nav link
  const sections = document.querySelectorAll("section[id]");
  if ("IntersectionObserver" in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          links.forEach(l => {
            if (l.getAttribute("href") === `#${id}`) {
              l.classList.add("active");
            } else {
              l.classList.remove("active");
            }
          });
        }
      });
    }, { rootMargin: "-25% 0px -65% 0px" });

    sections.forEach(s => observer.observe(s));
  }
}

/* ==========================================================================
   CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting Dispatch...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Transmitted!';
      btn.style.background = "#10b981";
      btn.style.borderColor = "#10b981";
      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = "";
        btn.style.borderColor = "";
      }, 4000);
    }, 1200);
  });
}

/* ==========================================================================
   HELPERS
   ========================================================================== */
function escapeHtml(text = "") {
  return String(text).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Global hook so admin.js can refresh projects list without reloading
window.refreshPortfolioProjects = function() {
  currentProjectsList = getStoredProjects();
  renderProjects("all");
};

/* ==========================================================================
   COMPETITIONS & HACKATHONS IMAGE BOARD & FLOATING LIGHTBOX LOGIC
   ========================================================================== */
let currentCompFilter = "all";
let currentFilteredCompetitions = [];
let currentCompLightboxIndex = 0;

function initCompetitions() {
  const board = document.getElementById("competitions-board");
  if (!board) {
    // If on main page with glimpse showcase, attach interactive hover tilt
    const glimpseStack = document.querySelector(".comp-glimpse-stack");
    if (glimpseStack) {
      const cards = glimpseStack.querySelectorAll(".comp-glimpse-photo-card");
      glimpseStack.addEventListener("mousemove", (e) => {
        const rect = glimpseStack.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        cards.forEach((card, idx) => {
          const factor = (idx + 1) * 4;
          card.style.transform = `translate(${x * factor}px, ${y * factor}px) rotate(${card.classList.contains("card-1") ? -6 : card.classList.contains("card-2") ? 2 : 7}deg)`;
        });
      });
      glimpseStack.addEventListener("mouseleave", () => {
        cards.forEach(card => {
          card.style.transform = "";
        });
      });
    }
    return;
  }

  const filterBtns = document.querySelectorAll(".comp-filter-btn");

  // Filter button listeners
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCompFilter = btn.dataset.filter || "all";
      renderCompetitions(currentCompFilter);
    });
  });

  // Update counts
  updateCompFilterCounts();

  // Initial render
  renderCompetitions("all");

  // Setup Lightbox Event Listeners
  initCompetitionLightbox();
}

function updateCompFilterCounts() {
  const data = typeof COMPETITIONS_DATA !== "undefined" ? COMPETITIONS_DATA : [];
  
  const counts = {
    all: data.length,
    datastorm: data.filter(c => c.filterTags && c.filterTags.includes("datastorm")).length,
    nexushacks: data.filter(c => c.filterTags && c.filterTags.includes("nexushacks")).length,
    modelx: data.filter(c => c.filterTags && c.filterTags.includes("modelx")).length,
    stage: data.filter(c => c.filterTags && c.filterTags.includes("stage")).length,
    podium: data.filter(c => c.filterTags && c.filterTags.includes("podium")).length
  };

  for (const [key, val] of Object.entries(counts)) {
    const el = document.getElementById(`count-comp-${key}`);
    if (el) el.textContent = val;
  }
}

function renderCompetitions(filter = "all") {
  const board = document.getElementById("competitions-board");
  if (!board) return;

  const data = typeof COMPETITIONS_DATA !== "undefined" ? COMPETITIONS_DATA : [];

  if (filter === "all") {
    currentFilteredCompetitions = [...data];
  } else {
    currentFilteredCompetitions = data.filter(item => 
      item.filterTags && item.filterTags.includes(filter)
    );
  }

  board.innerHTML = "";

  if (currentFilteredCompetitions.length === 0) {
    board.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
        <i class="fas fa-trophy" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem; display: block;"></i>
        <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">No Moments in this Category</h4>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">Check out the "All Highlights" tab to see our national competition records.</p>
      </div>
    `;
    return;
  }

  currentFilteredCompetitions.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = `comp-card ${item.featured ? "is-featured" : ""}`;
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${item.title} - Click to inspect moment`);

    const tagsHtml = (item.tags || []).map(t => `<span class="comp-tag-chip">#${escapeHtml(t)}</span>`).join("");

    card.innerHTML = `
      <div class="comp-media-wrap">
        <img src="${item.image}" alt="${escapeHtml(item.title)}" class="comp-img" loading="lazy" />
        
        <!-- Floating Interactive Badges -->
        <div class="comp-floating-badges">
          <span class="comp-floating-pill ${item.badgeType || 'accent-cyan'}">
            <i class="fas fa-certificate"></i> ${escapeHtml(item.badge || 'Honour')}
          </span>
          <span class="comp-floating-event">
            ${escapeHtml(item.competition)}
          </span>
        </div>

        <!-- Floating Hover Action Overlay -->
        <div class="comp-media-overlay">
          <button class="comp-hover-action-btn" tabindex="-1">
            <i class="fas fa-expand-alt"></i> Inspect Moment &amp; Story
          </button>
        </div>
      </div>

      <div class="comp-card-body">
        <div class="comp-card-meta">
          <span class="comp-card-org"><i class="fas fa-university"></i> ${escapeHtml(item.organization || '')}</span>
          <span class="comp-card-date">${escapeHtml(item.date || '')}</span>
        </div>
        <h3 class="comp-card-title">${escapeHtml(item.title)}</h3>
        <p class="comp-card-tagline">${escapeHtml(item.tagline || item.story)}</p>
        <div class="comp-tags-wrap">
          ${tagsHtml}
        </div>
      </div>
    `;

    // Click to open floating lightbox
    card.addEventListener("click", () => {
      openCompetitionLightbox(index);
    });

    // Accessibility enter/space key
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCompetitionLightbox(index);
      }
    });

    board.appendChild(card);
  });
}

/* --------------------------------------------------------------------------
   Floating Fullscreen Lightbox & Gallery Viewer Logic
   -------------------------------------------------------------------------- */
function initCompetitionLightbox() {
  const lightbox = document.getElementById("comp-floating-lightbox");
  if (!lightbox) return;

  const closeBtn = document.getElementById("lightbox-btn-close");
  const prevBtn = document.getElementById("lightbox-nav-prev");
  const nextBtn = document.getElementById("lightbox-nav-next");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeCompetitionLightbox);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateCompetitionLightbox(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateCompetitionLightbox(1);
    });
  }

  // Close when clicking directly on the backdrop (outside stage/caption)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("comp-lightbox-stage")) {
      closeCompetitionLightbox();
    }
  });

  // Global Keyboard Navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;

    if (e.key === "Escape") {
      closeCompetitionLightbox();
    } else if (e.key === "ArrowLeft") {
      navigateCompetitionLightbox(-1);
    } else if (e.key === "ArrowRight") {
      navigateCompetitionLightbox(1);
    }
  });
}

function openCompetitionLightbox(index) {
  const lightbox = document.getElementById("comp-floating-lightbox");
  if (!lightbox || !currentFilteredCompetitions.length) return;

  currentCompLightboxIndex = index;
  updateLightboxContent();

  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCompetitionLightbox() {
  const lightbox = document.getElementById("comp-floating-lightbox");
  if (!lightbox) return;

  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function navigateCompetitionLightbox(direction) {
  if (!currentFilteredCompetitions.length) return;
  const count = currentFilteredCompetitions.length;
  currentCompLightboxIndex = (currentCompLightboxIndex + direction + count) % count;
  updateLightboxContent();
}

function updateLightboxContent() {
  const item = currentFilteredCompetitions[currentCompLightboxIndex];
  if (!item) return;

  const total = currentFilteredCompetitions.length;

  // Image & links
  const img = document.getElementById("lightbox-full-img");
  const newTabBtn = document.getElementById("lightbox-btn-newtab");
  if (img) {
    img.src = item.image;
    img.alt = item.title;
  }
  if (newTabBtn) {
    newTabBtn.href = item.image;
  }

  // Top header badges
  const badge = document.getElementById("lightbox-badge");
  const counter = document.getElementById("lightbox-counter");
  if (badge) badge.textContent = item.competition;
  if (counter) counter.textContent = `${currentCompLightboxIndex + 1} / ${total}`;

  // Caption details
  const title = document.getElementById("lightbox-caption-title");
  const award = document.getElementById("lightbox-caption-award");
  const story = document.getElementById("lightbox-caption-story");
  const tagsContainer = document.getElementById("lightbox-caption-tags");

  if (title) title.textContent = item.title;
  if (award) award.innerHTML = `<i class="fas fa-trophy"></i> ${escapeHtml(item.award || item.badge || '')} &bull; ${escapeHtml(item.venue || '')}`;
  if (story) story.textContent = item.story || item.tagline;

  if (tagsContainer) {
    tagsContainer.innerHTML = (item.tags || [])
      .map(t => `<span class="comp-lightbox-tag">#${escapeHtml(t)}</span>`)
      .join("");
  }

  // Thumbnails Strip
  renderLightboxThumbnails();
}

function renderLightboxThumbnails() {
  const thumbsContainer = document.getElementById("lightbox-thumbs-strip");
  if (!thumbsContainer) return;

  thumbsContainer.innerHTML = "";
  currentFilteredCompetitions.forEach((item, idx) => {
    const thumb = document.createElement("div");
    thumb.className = `comp-thumb-item ${idx === currentCompLightboxIndex ? "active" : ""}`;
    thumb.title = item.title;
    thumb.innerHTML = `<img src="${item.image}" alt="${escapeHtml(item.title)}" class="comp-thumb-img" />`;

    thumb.addEventListener("click", (e) => {
      e.stopPropagation();
      currentCompLightboxIndex = idx;
      updateLightboxContent();
    });

    thumbsContainer.appendChild(thumb);
  });
}

