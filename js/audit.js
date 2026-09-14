/**
 * Telemetry & Legitimacy Audit Dashboard Controller
 * Author: Thilac Ramesh Portfolio System
 * Provides hardware fingerprint verification, IP network telemetry,
 * geographic interaction spread, and comment moderation.
 */

const STORAGE_AUDIT_LOG_KEY = "thilac_gallery_audit_log_v1";
const STORAGE_COMMENTS_KEY = "thilac_gallery_comments_v3";
const STORAGE_COUNTS_KEY = "thilac_gallery_post_likes_v3";
const STORAGE_LIKES_KEY = "thilac_gallery_liked_posts_v3";
const MASTER_PIN = "2026";

let auditLogs = [];
let activeFilter = "all";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
  initPasscodeGate();
});

/* ==========================================================================
   PASSCODE GATEWAY SECURITY
   ========================================================================== */
function initPasscodeGate() {
  const isAuth = sessionStorage.getItem("thilac_admin_session") === "granted";
  const gate = document.getElementById("passcode-gate-overlay");
  const dashboard = document.getElementById("audit-dashboard");

  if (isAuth) {
    if (gate) gate.style.display = "none";
    if (dashboard) dashboard.style.display = "block";
    loadAndRenderDashboard();
    initDashboardControls();
    return;
  }

  const inputs = [
    document.getElementById("pin-1"),
    document.getElementById("pin-2"),
    document.getElementById("pin-3"),
    document.getElementById("pin-4")
  ];

  if (!inputs[0]) return;

  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      const val = e.target.value;
      if (val.length === 1 && index < 3) {
        inputs[index + 1].focus();
      }
      if (index === 3 && val.length === 1) {
        verifyPasscode();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        inputs[index - 1].focus();
      } else if (e.key === "Enter") {
        verifyPasscode();
      }
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData("text").trim();
      if (/^\d{4}$/.test(text)) {
        text.split("").forEach((digit, i) => {
          if (inputs[i]) inputs[i].value = digit;
        });
        verifyPasscode();
      }
    });
  });

  const submitBtn = document.getElementById("btn-submit-gate");
  if (submitBtn) {
    submitBtn.addEventListener("click", verifyPasscode);
  }
}

function verifyPasscode() {
  const inputs = [
    document.getElementById("pin-1"),
    document.getElementById("pin-2"),
    document.getElementById("pin-3"),
    document.getElementById("pin-4")
  ];
  const enteredPin = inputs.map(i => i.value).join("");
  const errorEl = document.getElementById("gate-error-msg");
  const gateCard = document.querySelector(".gate-card");

  if (enteredPin === MASTER_PIN) {
    sessionStorage.setItem("thilac_admin_session", "granted");
    errorEl.textContent = "";

    const gate = document.getElementById("passcode-gate-overlay");
    const dashboard = document.getElementById("audit-dashboard");

    gate.style.transition = "opacity 0.3s ease";
    gate.style.opacity = "0";
    setTimeout(() => {
      gate.style.display = "none";
      if (dashboard) {
        dashboard.style.display = "block";
        loadAndRenderDashboard();
        initDashboardControls();
      }
    }, 300);
  } else {
    errorEl.textContent = "Invalid Passcode. Authorization denied.";
    inputs.forEach(i => i.value = "");
    if (inputs[0]) inputs[0].focus();

    if (gateCard) {
      gateCard.style.animation = "shake 0.4s cubic-bezier(.36,.07,.19,.97) both";
      setTimeout(() => {
        gateCard.style.animation = "";
      }, 400);
    }
  }
}

/* ==========================================================================
   DASHBOARD INITIALIZATION & CONTROLS
   ========================================================================== */
function initDashboardControls() {
  // Lock session button
  const lockBtn = document.getElementById("btn-lock-session");
  if (lockBtn) {
    lockBtn.addEventListener("click", () => {
      sessionStorage.removeItem("thilac_admin_session");
      window.location.reload();
    });
  }

  // Search input
  const searchInput = document.getElementById("audit-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderAuditEntries();
    });
  }

  // Purge logs button
  const purgeBtn = document.getElementById("btn-purge-logs");
  if (purgeBtn) {
    purgeBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to purge all telemetry audit records?\n(This action cannot be undone, active gallery likes will remain untouched.)")) {
        localStorage.removeItem(STORAGE_AUDIT_LOG_KEY);
        loadAndRenderDashboard();
        showToast("Telemetry logs purged.");
      }
    });
  }

  // Export buttons
  const csvBtn = document.getElementById("btn-export-csv");
  if (csvBtn) csvBtn.addEventListener("click", exportAuditCSV);

  const jsonBtn = document.getElementById("btn-export-json");
  if (jsonBtn) jsonBtn.addEventListener("click", exportAuditJSON);
}

/* ==========================================================================
   DATA LOADING & AUDIT RENDERING
   ========================================================================== */
function loadAndRenderDashboard() {
  try {
    const raw = localStorage.getItem(STORAGE_AUDIT_LOG_KEY);
    auditLogs = raw ? JSON.parse(raw) : [];
  } catch (e) {
    auditLogs = [];
  }

  // Calculate KPIs
  updateKPIs();
  // Render breakdown distributions
  renderDistributions();
  // Render Ledger Entries
  renderAuditEntries();
}

function updateKPIs() {
  const totalInteractions = auditLogs.length;
  const uniqueDevices = new Set(auditLogs.map(l => l.fingerprintHash || "unknown")).size;
  const uniqueGeo = new Set(auditLogs.map(l => l.city || l.country || l.location).filter(Boolean)).size;

  // Active verified comments count from comments storage
  let commentCount = 0;
  try {
    const commentsData = JSON.parse(localStorage.getItem(STORAGE_COMMENTS_KEY) || "{}");
    Object.values(commentsData).forEach(arr => {
      if (Array.isArray(arr)) commentCount += arr.length;
    });
  } catch (e) {}

  // Fallback to audit log comments if storage empty
  if (commentCount === 0) {
    commentCount = auditLogs.filter(l => l.type === "comment").length;
  }

  setElementText("kpi-total-interactions", totalInteractions);
  setElementText("kpi-unique-devices", uniqueDevices);
  setElementText("kpi-geo-count", uniqueGeo);
  setElementText("kpi-comments-count", commentCount);
}

function setElementText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/* ==========================================================================
   DISTRIBUTION CHARTS (GEO & PLATFORM)
   ========================================================================== */
function renderDistributions() {
  renderGeoBreakdown();
  renderDeviceBreakdown();
}

function renderGeoBreakdown() {
  const container = document.getElementById("geo-distribution-list");
  if (!container) return;

  if (auditLogs.length === 0) {
    container.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 1.5rem 0;">No geographic telemetry recorded yet.</div>`;
    return;
  }

  const geoMap = {};
  auditLogs.forEach(l => {
    let place = l.location || l.city || "Protected Location";
    if (place.includes("Region: ")) place = place.replace("Region: ", "");
    geoMap[place] = (geoMap[place] || 0) + 1;
  });

  const sorted = Object.entries(geoMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const total = auditLogs.length;

  container.innerHTML = sorted.map(([place, count]) => {
    const pct = Math.round((count / total) * 100);
    return `
      <div class="distribution-item">
        <div class="dist-meta">
          <span style="color: var(--text-primary); font-weight: 500;">
            <i class="fas fa-location-dot" style="color: #ef4444; font-size: 0.75rem; margin-right: 4px;"></i> ${escapeHtml(place)}
          </span>
          <span style="color: var(--text-muted); font-weight: 600;">${count} (${pct}%)</span>
        </div>
        <div class="dist-bar-track">
          <div class="dist-bar-fill" style="width: ${pct}%;"></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderDeviceBreakdown() {
  const container = document.getElementById("device-distribution-list");
  if (!container) return;

  if (auditLogs.length === 0) {
    container.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 1.5rem 0;">No client signatures recorded yet.</div>`;
    return;
  }

  const devMap = {};
  auditLogs.forEach(l => {
    const dev = `${l.device || 'Desktop'} • ${l.browser || 'Browser'}`;
    devMap[dev] = (devMap[dev] || 0) + 1;
  });

  const sorted = Object.entries(devMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const total = auditLogs.length;

  container.innerHTML = sorted.map(([dev, count]) => {
    const pct = Math.round((count / total) * 100);
    return `
      <div class="distribution-item">
        <div class="dist-meta">
          <span style="color: var(--text-primary); font-weight: 500;">
            <i class="fas fa-laptop" style="color: var(--accent-green); font-size: 0.75rem; margin-right: 4px;"></i> ${escapeHtml(dev)}
          </span>
          <span style="color: var(--text-muted); font-weight: 600;">${count} (${pct}%)</span>
        </div>
        <div class="dist-bar-track">
          <div class="dist-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #10b981, #0ea5e9);"></div>
        </div>
      </div>
    `;
  }).join("");
}

/* ==========================================================================
   AUDIT LEDGER & FILTERING
   ========================================================================== */
window.setAuditFilter = function(filter) {
  activeFilter = filter;
  ["all", "comments", "likes"].forEach(t => {
    const btn = document.getElementById(`filter-${t}`);
    if (btn) {
      const match = (t === "all" && filter === "all") ||
                    (t === "comments" && filter === "comment") ||
                    (t === "likes" && filter === "like");
      btn.className = match ? "btn-audit btn-audit-primary" : "btn-audit";
    }
  });
  renderAuditEntries();
};

function renderAuditEntries() {
  const container = document.getElementById("audit-entries-list");
  if (!container) return;

  let filtered = auditLogs;

  // Type filter
  if (activeFilter === "comment") {
    filtered = filtered.filter(l => l.type === "comment");
  } else if (activeFilter === "like") {
    filtered = filtered.filter(l => l.type === "like" || l.type === "unlike");
  }

  // Search filter
  if (searchQuery) {
    filtered = filtered.filter(l => {
      const searchTarget = [
        l.author,
        l.text,
        l.ip,
        l.location,
        l.city,
        l.country,
        l.device,
        l.browser,
        l.postTitle,
        l.postId,
        l.fingerprintHash
      ].join(" ").toLowerCase();
      return searchTarget.includes(searchQuery);
    });
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 3.5rem 1rem;">
        <i class="fas fa-fingerprint" style="font-size: 2.75rem; opacity: 0.2; margin-bottom: 1rem;"></i>
        <h4 style="color: var(--text-primary); font-size: 1.1rem; margin-bottom: 0.35rem;">No Matching Interactions Found</h4>
        <p style="font-size: 0.85rem; max-width: 480px; margin: 0 auto;">
          ${searchQuery ? "No audit logs match your search term. Try clearing filters." : "When visitors like or comment on the portfolio gallery, their hardware hash, IP, and location appear here automatically."}
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="audit-record" id="audit-entry-${item.id}">
      <div class="record-top">
        <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
          <span class="record-type-pill ${item.type === 'comment' ? 'comment' : 'like'}">
            <i class="fas fa-${item.type === 'comment' ? 'comment' : 'heart'}"></i> ${item.type}
          </span>
          <strong style="color: var(--text-primary); font-size: 0.95rem;">${escapeHtml(item.author || 'Anonymous')}</strong>
          <span style="color: var(--text-muted); font-size: 0.82rem;">on <em style="color: var(--text-secondary);">"${escapeHtml(item.postTitle || item.postId)}"</em></span>
        </div>
        <span style="font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono);">${escapeHtml(item.displayTime || item.timestamp)}</span>
      </div>

      ${item.text ? `
        <div class="record-comment-bubble">
          <i class="fas fa-quote-left" style="opacity: 0.3; margin-right: 6px; font-size: 0.8rem;"></i>
          ${escapeHtml(item.text)}
        </div>
      ` : ''}

      <div class="record-meta-strip">
        <div class="meta-col">
          <i class="fas fa-location-dot" style="color: #ef4444;"></i>
          <span><strong>Geo:</strong> ${escapeHtml(item.location || item.city || 'Unknown')}</span>
        </div>
        <div class="meta-col">
          <i class="fas fa-network-wired" style="color: var(--accent-cyan);"></i>
          <span><strong>IP:</strong> ${escapeHtml(item.ip || 'Protected')}</span>
        </div>
        <div class="meta-col">
          <i class="fas fa-desktop" style="color: var(--accent-green);"></i>
          <span><strong>Client:</strong> ${escapeHtml(item.device || 'Desktop')} &bull; ${escapeHtml(item.browser || 'Browser')}</span>
        </div>
        <div class="meta-col">
          <i class="fas fa-fingerprint" style="color: var(--accent-amber);"></i>
          <span><strong>Hash:</strong> <code class="meta-hash">${escapeHtml(item.fingerprintHash || 'fp_anon')}</code></span>
        </div>
        ${item.screen ? `
          <div class="meta-col">
            <i class="fas fa-tv" style="color: #a855f7;"></i>
            <span><strong>Display:</strong> ${escapeHtml(item.screen)}</span>
          </div>
        ` : ''}
      </div>

      ${item.commentId ? `
        <div style="display: flex; justify-content: flex-end; margin-top: 0.25rem;">
          <button type="button" class="btn-audit btn-audit-danger" onclick="deleteCommentFromAudit('${item.postId}', '${item.commentId}', '${item.id}')">
            <i class="fas fa-trash"></i> Delete Comment Permanently
          </button>
        </div>
      ` : ''}
    </div>
  `).join("");
}

/* ==========================================================================
   MODERATION & PURGE ACTIONS
   ========================================================================== */
window.deleteCommentFromAudit = function(postId, commentId, auditId) {
  if (!confirm("Are you sure you want to delete this comment permanently from both the public gallery and the audit log?")) {
    return;
  }

  // Remove from comments storage
  try {
    const raw = localStorage.getItem(STORAGE_COMMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed[postId]) {
        parsed[postId] = parsed[postId].filter(c => c.id !== commentId);
        localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(parsed));
      }
    }
  } catch (e) {
    console.error("Error purging comment:", e);
  }

  // Remove from audit log
  auditLogs = auditLogs.filter(l => l.id !== auditId);
  try {
    localStorage.setItem(STORAGE_AUDIT_LOG_KEY, JSON.stringify(auditLogs));
  } catch (e) {}

  loadAndRenderDashboard();
  showToast("Comment successfully deleted.");
};

/* ==========================================================================
   EXPORT UTILITIES (CSV & JSON)
   ========================================================================== */
function exportAuditCSV() {
  if (auditLogs.length === 0) {
    showToast("No audit logs to export.");
    return;
  }

  const headers = ["ID", "Type", "Author", "Target Post", "Comment Text", "IP", "City", "Location", "Device", "Browser", "Fingerprint Hash", "Timestamp"];
  const rows = auditLogs.map(l => [
    `"${l.id || ''}"`,
    `"${l.type || ''}"`,
    `"${(l.author || '').replace(/"/g, '""')}"`,
    `"${(l.postTitle || l.postId || '').replace(/"/g, '""')}"`,
    `"${(l.text || '').replace(/"/g, '""')}"`,
    `"${l.ip || ''}"`,
    `"${l.city || ''}"`,
    `"${(l.location || '').replace(/"/g, '""')}"`,
    `"${l.device || ''}"`,
    `"${l.browser || ''}"`,
    `"${l.fingerprintHash || ''}"`,
    `"${l.timestamp || ''}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  triggerDownload(csvContent, `thilac_gallery_audit_${Date.now()}.csv`);
  showToast("CSV report exported successfully.");
}

function exportAuditJSON() {
  if (auditLogs.length === 0) {
    showToast("No audit logs to export.");
    return;
  }

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
  triggerDownload(dataStr, `thilac_gallery_audit_${Date.now()}.json`);
  showToast("JSON payload exported successfully.");
}

function triggerDownload(url, filename) {
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/* ==========================================================================
   HELPER UTILITIES
   ========================================================================== */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(msg) {
  const toast = document.getElementById("audit-toast");
  const text = document.getElementById("audit-toast-msg");
  if (!toast || !text) return;
  text.textContent = msg;
  toast.style.display = "flex";
  clearTimeout(window._auditToastTimer);
  window._auditToastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}
