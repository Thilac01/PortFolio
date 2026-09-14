/**
 * Engineering Learning Lab & Proof of Work Script - Thilac Ramesh
 * Includes Google Colab Integration and Passcode Protection (Ctrl+Shift+A) for adding/removing notes.
 */

const STUDY_PIN = "2026"; // Passcode for Thilac Ramesh
let isStudyAdminAuthenticated = false;
let currentLearningLogs = [];
let activeCategory = "all";
let searchQuery = "";
let editingLogId = null;

document.addEventListener("DOMContentLoaded", () => {
  initLearningLab();
  initAdminSecurity();
});

function initLearningLab() {
  currentLearningLogs = typeof getStoredLearningLogs === "function" 
    ? getStoredLearningLogs() 
    : (typeof DEFAULT_LEARNING_LOGS !== "undefined" ? DEFAULT_LEARNING_LOGS : []);

  setupFilterButtons();
  setupSearchInput();
  setupModals();
  renderLearningLogs();
  updateCategoryCounts();
}

/* ==========================================================================
   ADMIN SECURITY & PASSCODE PROTECTION (Ctrl + Shift + A)
   ========================================================================== */
function initAdminSecurity() {
  // Check existing session
  if (sessionStorage.getItem("thilac_admin_session") === "granted") {
    setAdminAuthenticated(true);
  } else {
    setAdminAuthenticated(false);
  }

  // Keyboard shortcut: Ctrl + Shift + A
  window.addEventListener("keydown", (e) => {
    const isA = e.key === "A" || e.key === "a" || e.code === "KeyA";
    if (e.ctrlKey && e.shiftKey && isA) {
      e.preventDefault();
      if (isStudyAdminAuthenticated) {
        openAddStudyModal();
      } else {
        openStudyPinModal();
      }
    }
  });

  // Top lock button
  const lockBtn = document.getElementById("study-admin-lock-btn");
  if (lockBtn) {
    lockBtn.addEventListener("click", () => {
      if (isStudyAdminAuthenticated) {
        // Toggle lock
        if (confirm("Lock Study Lab admin controls?")) {
          sessionStorage.removeItem("thilac_admin_session");
          setAdminAuthenticated(false);
        }
      } else {
        openStudyPinModal();
      }
    });
  }

  // PIN Input auto-focus and verification
  const pinModal = document.getElementById("study-pin-modal");
  if (pinModal) {
    const digits = pinModal.querySelectorAll(".study-pin-digit");
    digits.forEach((digit, idx) => {
      digit.addEventListener("input", (e) => {
        if (e.target.value.length === 1 && idx < digits.length - 1) {
          digits[idx + 1].focus();
        }
        checkStudyPin();
      });

      digit.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !e.target.value && idx > 0) {
          digits[idx - 1].focus();
        }
      });

      digit.addEventListener("paste", (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData("text").trim();
        if (text) {
          const chars = text.split("").slice(0, digits.length);
          chars.forEach((c, i) => {
            if (digits[i]) digits[i].value = c;
          });
          checkStudyPin();
        }
      });
    });
  }
}

function setAdminAuthenticated(auth) {
  isStudyAdminAuthenticated = auth;
  const lockBtn = document.getElementById("study-admin-lock-btn");
  const lockIcon = document.getElementById("study-lock-icon");
  const lockLabel = document.getElementById("study-lock-label");

  if (auth) {
    document.body.classList.add("study-admin-unlocked");
    if (lockBtn) lockBtn.classList.add("unlocked");
    if (lockIcon) lockIcon.className = "fas fa-unlock";
    if (lockLabel) lockLabel.textContent = "Admin Mode";
  } else {
    document.body.classList.remove("study-admin-unlocked");
    if (lockBtn) lockBtn.classList.remove("unlocked");
    if (lockIcon) lockIcon.className = "fas fa-lock";
    if (lockLabel) lockLabel.textContent = "Locked";
  }
}

function openStudyPinModal() {
  const modal = document.getElementById("study-pin-modal");
  if (!modal) return;

  const errorEl = document.getElementById("study-pin-error");
  if (errorEl) errorEl.textContent = "";

  const digits = modal.querySelectorAll(".study-pin-digit");
  digits.forEach(d => {
    d.value = "";
    d.style.borderColor = "";
  });

  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    if (digits[0]) digits[0].focus();
  }, 150);
}

function checkStudyPin() {
  const modal = document.getElementById("study-pin-modal");
  if (!modal) return;
  const digits = modal.querySelectorAll(".study-pin-digit");
  const entered = Array.from(digits).map(d => d.value).join("");

  if (entered.length === 4) {
    if (entered === STUDY_PIN) {
      sessionStorage.setItem("thilac_admin_session", "granted");
      setAdminAuthenticated(true);
      modal.classList.remove("active");
      document.body.style.overflow = "";
      renderLearningLogs();
      openAddStudyModal();
    } else {
      const errorEl = document.getElementById("study-pin-error");
      if (errorEl) errorEl.textContent = "Incorrect passcode. Access denied.";
      digits.forEach(d => {
        d.style.borderColor = "#e11d48";
        d.value = "";
      });
      if (digits[0]) digits[0].focus();
    }
  }
}

/* ==========================================================================
   CATEGORY & FILTERING
   ========================================================================== */
function updateCategoryCounts() {
  const counts = {
    all: currentLearningLogs.length,
    slam: currentLearningLogs.filter(l => l.category === "slam").length,
    ros2: currentLearningLogs.filter(l => l.category === "ros2").length,
    nav2: currentLearningLogs.filter(l => l.category === "nav2").length,
    quadruped: currentLearningLogs.filter(l => l.category === "quadruped").length,
    cad: currentLearningLogs.filter(l => l.category === "cad").length,
    ai: currentLearningLogs.filter(l => l.category === "ai").length
  };

  for (const [cat, count] of Object.entries(counts)) {
    const el = document.getElementById(`count-lab-${cat}`);
    if (el) el.textContent = count;
  }
}

function setupFilterButtons() {
  const container = document.getElementById("learning-filter-group");
  if (!container) return;

  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".learning-filter-btn");
    if (!btn) return;

    container.querySelectorAll(".learning-filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    activeCategory = btn.getAttribute("data-category") || "all";
    renderLearningLogs();
  });
}

function setupSearchInput() {
  const searchInput = document.getElementById("learning-search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderLearningLogs();
  });
}

/* ==========================================================================
   RENDER CARDS & COLAB / ADMIN ACTION BADGES
   ========================================================================== */
function renderLearningLogs() {
  const grid = document.getElementById("learning-logs-grid");
  if (!grid) return;

  let filtered = currentLearningLogs.filter(log => {
    const matchesCat = (activeCategory === "all" || log.category === activeCategory);
    if (!matchesCat) return false;

    if (!searchQuery) return true;

    const hay = [
      log.topic,
      log.summary,
      log.categoryLabel,
      log.detailedNotes,
      log.terminalCommands,
      log.colabUrl || "",
      (log.keyTakeaways || []).join(" ")
    ].join(" ").toLowerCase();

    return hay.includes(searchQuery);
  });

  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--lab-bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
        <i class="fas fa-search" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-primary);">No study logs found</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 400px; margin: 0 auto 1.5rem;">No proof logs match your search. Try another query or clear filters.</p>
        <button class="btn btn-primary" onclick="resetSearchFilter()">Show All Records</button>
      </div>
    `;
    return;
  }

  filtered.forEach(log => {
    const card = document.createElement("div");
    card.className = "learning-card";
    card.setAttribute("data-id", log.id);

    const hasVideo = !!log.videoUrl;
    const hasColab = !!log.colabUrl;
    const hasTerminal = !!log.terminalCommands;
    const hasImages = Array.isArray(log.images) && log.images.length > 0;

    card.innerHTML = `
      <div class="learning-card-topbar">
        <span class="learning-card-badge ${log.badgeType || 'accent-cyan'}">
          <i class="fas fa-shield-alt"></i> ${escapeHtml(log.badge || 'Verified Proof')}
        </span>
        
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <div class="learning-card-meta">
            <span><i class="far fa-clock"></i> ${escapeHtml(log.hoursLogged || '40+ hrs')}</span>
          </div>

          <!-- Secret Admin Edit & Delete buttons -->
          <div class="card-admin-actions">
            <button class="btn-card-admin btn-edit" onclick="openEditStudyModal('${log.id}', event)" title="Edit this study log">
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button class="btn-card-admin btn-delete" onclick="deleteStudyLog('${log.id}', event)" title="Remove / delete this study log">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>

      <h3 class="learning-card-title">${escapeHtml(log.topic)}</h3>
      <p class="learning-card-desc">${escapeHtml(log.summary)}</p>

      <div class="learning-proof-pills">
        ${hasColab ? `<span class="proof-indicator-pill has-colab"><i class="fas fa-book-open"></i> Google Colab</span>` : ''}
        ${hasVideo ? `<span class="proof-indicator-pill has-video"><i class="fas fa-video"></i> Video Breakdown</span>` : ''}
        ${hasTerminal ? `<span class="proof-indicator-pill has-terminal"><i class="fas fa-terminal"></i> Terminal Commands</span>` : ''}
        ${hasImages ? `<span class="proof-indicator-pill has-images"><i class="fas fa-image"></i> ${log.images.length} Lab Proofs</span>` : ''}
        <span class="proof-indicator-pill"><i class="fas fa-check-circle" style="color: #10b981;"></i> ${escapeHtml(log.status || 'Verified')}</span>
      </div>

      <div class="learning-card-footer">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">
            <i class="fas fa-tag"></i> ${escapeHtml(log.categoryLabel || log.category)}
          </span>
          ${hasColab ? `
            <a href="${escapeHtml(log.colabUrl)}" target="_blank" rel="noopener noreferrer" class="btn-colab-launch" style="padding: 0.25rem 0.65rem; font-size: 0.74rem;" title="Run in Google Colab">
              <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Colab" style="height: 16px; vertical-align: middle;">
            </a>
          ` : ''}
        </div>
        <button class="btn-view-notes" onclick="openStudyModal('${log.id}')">
          <i class="fas fa-microscope"></i> Examine Notes
        </button>
      </div>
    `;

    grid.appendChild(card);
  });
}

function resetSearchFilter() {
  searchQuery = "";
  activeCategory = "all";
  const searchInput = document.getElementById("learning-search-input");
  if (searchInput) searchInput.value = "";
  const filterBtns = document.querySelectorAll(".learning-filter-btn");
  filterBtns.forEach(b => {
    if (b.getAttribute("data-category") === "all") b.classList.add("active");
    else b.classList.remove("active");
  });
  renderLearningLogs();
}

/* ==========================================================================
   DETAIL MODAL WITH GOOGLE COLAB & EMBEDDED DEMOS
   ========================================================================== */
function openStudyModal(logId) {
  const log = currentLearningLogs.find(l => l.id === logId);
  if (!log) return;

  const modal = document.getElementById("study-detail-modal");
  const modalContent = document.getElementById("study-modal-body");
  const modalTitle = document.getElementById("study-modal-title");
  const modalBadge = document.getElementById("study-modal-badge");

  if (!modal || !modalContent) return;

  if (modalTitle) modalTitle.textContent = log.topic;
  if (modalBadge) {
    modalBadge.className = `learning-card-badge ${log.badgeType || 'accent-cyan'}`;
    modalBadge.innerHTML = `<i class="fas fa-shield-alt"></i> ${escapeHtml(log.badge || 'Verified Study Log')}`;
  }

  const formattedNotes = formatNotesHtml(log.detailedNotes || "");

  const takeawaysHtml = (log.keyTakeaways || []).map(t => `
    <li><i class="fas fa-check-circle"></i> <span>${escapeHtml(t)}</span></li>
  `).join("");

  const galleryHtml = (log.images || []).map(img => `
    <div class="study-gallery-thumb" onclick="window.open('${escapeHtml(img)}', '_blank')">
      <img src="${escapeHtml(img)}" alt="Study verification proof" loading="lazy" />
    </div>
  `).join("");

  const referencesHtml = (log.referenceSources || []).map(ref => `
    <li style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.35rem; line-height: 1.45;">
      <i class="fas fa-book" style="color: var(--accent-cyan); margin-right: 6px;"></i> ${escapeHtml(ref)}
    </li>
  `).join("");

  modalContent.innerHTML = `
    <!-- Top Google Colab Interactive Notebook Card -->
    ${log.colabUrl ? `
      <div class="study-colab-card">
        <div class="study-colab-info">
          <div class="study-colab-icon">
            <i class="fas fa-file-code"></i>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: #b45309; margin: 0 0 0.2rem; display: flex; align-items: center; gap: 6px;">
              <span>Interactive Google Colab Notebook</span>
              <span style="font-size: 0.72rem; padding: 2px 7px; border-radius: 999px; background: rgba(245, 158, 11, 0.2); color: #d97706;">Live Runtime</span>
            </h4>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0; line-height: 1.45;">
              Execute Python equations, verify parameter convergence, and inspect plots directly in a free cloud GPU/CPU environment.
            </p>
          </div>
        </div>
        <a href="${escapeHtml(log.colabUrl)}" target="_blank" rel="noopener noreferrer" class="btn-colab-launch">
          <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab">
          <span>Open Live Notebook</span>
        </a>
      </div>
    ` : ''}

    <!-- Top Video Embed if exists -->
    ${log.videoUrl ? `
      <div class="study-video-frame-wrap">
        <iframe src="${escapeHtml(log.videoUrl)}" title="${escapeHtml(log.videoTitle || log.topic)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: -1rem; margin-bottom: 1.5rem; text-align: center;">
        <i class="fas fa-play-circle" style="color: #e11d48;"></i> ${escapeHtml(log.videoTitle || 'Technical Demonstration Screencast')}
      </div>
    ` : ''}

    <!-- Key Takeaways Box -->
    ${takeawaysHtml ? `
      <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
        <h4 style="font-size: 0.95rem; color: #10b981; margin: 0 0 0.75rem; display: flex; align-items: center; gap: 0.45rem;">
          <i class="fas fa-lightbulb"></i> Core Technical Insights & Takeaways
        </h4>
        <ul class="study-takeaways-list" style="margin-bottom: 0;">
          ${takeawaysHtml}
        </ul>
      </div>
    ` : ''}

    <!-- Detailed Notes Body -->
    <div style="line-height: 1.6; color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 1.75rem;">
      ${formattedNotes}
    </div>

    <!-- Terminal Commands Box if exists -->
    ${log.terminalCommands ? `
      <div style="margin-bottom: 1.75rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem;">
          <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 0.45rem;">
            <i class="fas fa-terminal" style="color: var(--accent-cyan);"></i> Validated Terminal Execution Commands
          </h4>
        </div>
        <div class="study-code-box">
          <button class="copy-code-btn" onclick="copyCodeText(this)"><i class="fas fa-copy"></i> Copy</button>
          <pre style="margin: 0;"><code>${escapeHtml(log.terminalCommands)}</code></pre>
        </div>
      </div>
    ` : ''}

    <!-- Code Snippet Box if exists -->
    ${log.codeSnippet ? `
      <div style="margin-bottom: 1.75rem;">
        <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.4rem; display: flex; align-items: center; gap: 0.45rem;">
          <i class="fas fa-code" style="color: #818cf8;"></i> Implementation Architecture Snippet
        </h4>
        <div class="study-code-box">
          <button class="copy-code-btn" onclick="copyCodeText(this)"><i class="fas fa-copy"></i> Copy</button>
          <pre style="margin: 0;"><code>${escapeHtml(log.codeSnippet)}</code></pre>
        </div>
      </div>
    ` : ''}

    <!-- Image Proofs & Lab Schematics -->
    ${galleryHtml ? `
      <div style="margin-bottom: 1.75rem;">
        <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.6rem; display: flex; align-items: center; gap: 0.45rem;">
          <i class="fas fa-camera" style="color: #10b981;"></i> Lab Verification Proofs & Schematics
        </h4>
        <div class="study-gallery-row">
          ${galleryHtml}
        </div>
      </div>
    ` : ''}

    <!-- Reference Sources & Literature -->
    ${referencesHtml ? `
      <div style="background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.15rem; margin-bottom: 1.5rem;">
        <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.65rem; display: flex; align-items: center; gap: 0.45rem;">
          <i class="fas fa-graduation-cap"></i> Academic Literature & Textbook References
        </h4>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${referencesHtml}
        </ul>
      </div>
    ` : ''}

    <!-- Actions Bar -->
    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
      ${log.colabUrl ? `
        <a href="${escapeHtml(log.colabUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size: 0.82rem;">
          <i class="fas fa-external-link-alt"></i> Colab
        </a>
      ` : ''}
      <button class="btn btn-secondary modal-close-btn" style="padding: 0.5rem 1.25rem;">Close</button>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function formatNotesHtml(markdown) {
  if (!markdown) return "";
  let html = markdown
    .replace(/^### (.*$)/gim, '<h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 1.25rem 0 0.45rem;">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin: 1.5rem 0 0.6rem;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code style="background: var(--bg-tertiary); color: var(--accent-cyan); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em;">$1</code>')
    .replace(/^\- (.*$)/gim, '<li style="margin-bottom: 0.35rem;">$1</li>');

  html = html.replace(/(<li.*<\/li>)/s, '<ul style="padding-left: 1.25rem; margin-bottom: 1rem;">$1</ul>');
  return html.replace(/\n\n/g, '<p style="margin-bottom: 0.85rem;"></p>');
}

function copyCodeText(btn) {
  const box = btn.closest(".study-code-box");
  if (!box) return;
  const code = box.querySelector("code");
  if (!code) return;

  navigator.clipboard.writeText(code.innerText).then(() => {
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check" style="color: #10b981;"></i> Copied!';
    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 2000);
  });
}

function setupModals() {
  document.querySelectorAll(".modal-backdrop").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest(".modal-close-btn")) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
        const iframe = modal.querySelector("iframe");
        if (iframe) {
          const src = iframe.src;
          iframe.src = src;
        }
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop.active").forEach(modal => {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      });
    }
  });

  const addForm = document.getElementById("add-study-form");
  if (addForm) {
    addForm.addEventListener("submit", handleAddStudyLogSubmit);
  }
}

/* ==========================================================================
   ADD & EDIT STUDY NOTES
   ========================================================================== */
function handleAddClick() {
  if (!isStudyAdminAuthenticated) {
    openStudyPinModal();
  } else {
    openAddStudyModal();
  }
}

function openAddStudyModal() {
  editingLogId = null;
  const modal = document.getElementById("add-study-modal");
  const title = document.getElementById("add-study-modal-heading");
  const form = document.getElementById("add-study-form");
  if (!modal || !form) return;

  if (title) title.textContent = "Log New Study Topic or Proof";
  form.reset();

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function openEditStudyModal(logId, event) {
  if (event) event.stopPropagation();
  if (!isStudyAdminAuthenticated) {
    openStudyPinModal();
    return;
  }

  const log = currentLearningLogs.find(l => l.id === logId);
  if (!log) return;

  editingLogId = logId;
  const modal = document.getElementById("add-study-modal");
  const title = document.getElementById("add-study-modal-heading");
  if (!modal) return;

  if (title) title.textContent = "Edit Study Record: " + log.topic;

  document.getElementById("input-topic").value = log.topic || "";
  document.getElementById("input-category").value = log.category || "slam";
  document.getElementById("input-hours").value = log.hoursLogged || "";
  document.getElementById("input-status").value = log.status || "";
  document.getElementById("input-colab").value = log.colabUrl || "";
  document.getElementById("input-video").value = log.videoUrl || "";
  document.getElementById("input-summary").value = log.summary || "";
  document.getElementById("input-notes").value = log.detailedNotes || "";
  document.getElementById("input-commands").value = log.terminalCommands || "";
  document.getElementById("input-takeaways").value = (log.keyTakeaways || []).join("\n");

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function deleteStudyLog(logId, event) {
  if (event) event.stopPropagation();
  if (!isStudyAdminAuthenticated) {
    openStudyPinModal();
    return;
  }

  const log = currentLearningLogs.find(l => l.id === logId);
  if (!log) return;

  if (confirm(`Are you sure you want to delete "${log.topic}" from the study lab?`)) {
    currentLearningLogs = currentLearningLogs.filter(l => l.id !== logId);
    if (typeof saveStoredLearningLogs === "function") {
      saveStoredLearningLogs(currentLearningLogs);
    }
    renderLearningLogs();
    updateCategoryCounts();
  }
}

function handleAddStudyLogSubmit(e) {
  e.preventDefault();

  if (!isStudyAdminAuthenticated) {
    alert("Passcode authentication required. Press Ctrl+Shift+A.");
    openStudyPinModal();
    return;
  }

  const topic = document.getElementById("input-topic").value.trim();
  const category = document.getElementById("input-category").value;
  const hours = document.getElementById("input-hours").value.trim() || "40+ hrs";
  const status = document.getElementById("input-status").value.trim() || "Verified Study";
  const colabUrl = document.getElementById("input-colab").value.trim();
  const videoUrl = document.getElementById("input-video").value.trim();
  const summary = document.getElementById("input-summary").value.trim();
  const notes = document.getElementById("input-notes").value.trim();
  const commands = document.getElementById("input-commands").value.trim();
  const takeawaysRaw = document.getElementById("input-takeaways").value.trim();

  if (!topic || !summary) {
    alert("Please provide at least a Topic Title and Short Summary.");
    return;
  }

  const categoryLabels = {
    slam: "SLAM & Perception",
    ros2: "ROS 2 & Middleware",
    nav2: "Autonomous Navigation",
    quadruped: "Legged Robotics",
    cad: "Mechanical CAE & CAD",
    ai: "Software & Machine Learning"
  };

  const badgeColors = {
    slam: "accent-cyan",
    ros2: "accent-purple",
    nav2: "accent-emerald",
    quadruped: "accent-amber",
    cad: "accent-rose",
    ai: "accent-blue"
  };

  const takeaways = takeawaysRaw ? takeawaysRaw.split("\n").map(s => s.trim()).filter(Boolean) : [];

  if (editingLogId) {
    // Update existing
    const idx = currentLearningLogs.findIndex(l => l.id === editingLogId);
    if (idx !== -1) {
      currentLearningLogs[idx] = {
        ...currentLearningLogs[idx],
        topic,
        category,
        categoryLabel: categoryLabels[category] || "Engineering Lab",
        hoursLogged: hours,
        status,
        colabUrl,
        videoUrl,
        summary,
        detailedNotes: notes || summary,
        keyTakeaways: takeaways,
        terminalCommands: commands
      };
    }
  } else {
    // Create new
    const newLog = {
      id: "log-" + Date.now(),
      topic,
      category,
      categoryLabel: categoryLabels[category] || "Engineering Lab",
      badge: "Lab & Hardware Verified",
      badgeType: badgeColors[category] || "accent-cyan",
      status,
      date: "Current Study",
      hoursLogged: hours,
      colabUrl,
      videoUrl,
      videoTitle: topic + " Demonstration",
      images: [],
      summary,
      detailedNotes: notes || summary,
      keyTakeaways: takeaways,
      terminalCommands: commands,
      codeSnippet: "",
      referenceSources: ["Self-directed lab experiment & research documentation."]
    };
    currentLearningLogs.unshift(newLog);
  }

  if (typeof saveStoredLearningLogs === "function") {
    saveStoredLearningLogs(currentLearningLogs);
  }

  renderLearningLogs();
  updateCategoryCounts();

  const modal = document.getElementById("add-study-modal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
  e.target.reset();
  editingLogId = null;
}

function exportLearningJson() {
  const jsonStr = JSON.stringify(currentLearningLogs, null, 2);
  navigator.clipboard.writeText(jsonStr).then(() => {
    alert("All study logs exported as JSON and copied to your clipboard!\nYou can paste this into js/learning-data.js to make it permanent.");
  }).catch(() => {
    prompt("Copy your JSON data:", jsonStr);
  });
}

function restoreDefaultLogs() {
  if (!isStudyAdminAuthenticated) {
    openStudyPinModal();
    return;
  }
  if (confirm("Reset all study logs back to default pre-loaded records? Any custom browser entries will be cleared.")) {
    if (typeof resetLearningLogsToDefault === "function") {
      currentLearningLogs = resetLearningLogsToDefault();
    }
    renderLearningLogs();
    updateCategoryCounts();
    alert("Reset back to default technical proof records.");
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.openStudyModal = openStudyModal;
window.handleAddClick = handleAddClick;
window.openAddStudyModal = openAddStudyModal;
window.openEditStudyModal = openEditStudyModal;
window.deleteStudyLog = deleteStudyLog;
window.openStudyPinModal = openStudyPinModal;
window.resetSearchFilter = resetSearchFilter;
window.copyCodeText = copyCodeText;
window.exportLearningJson = exportLearningJson;
window.restoreDefaultLogs = restoreDefaultLogs;
