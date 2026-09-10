/**
 * Private Admin Portal ("Studio Workbench")
 * Discreetly accessible via lock icon or Ctrl+Shift+A.
 * Allows adding, editing, and managing projects with workflow stages,
 * image uploads (Base64/URL), video links, PDFs, and JSON export/import.
 */

const DEFAULT_PIN = "2026"; // Default passcode for Thilac Ramesh
let isAdminAuthenticated = false;
let editingProjectId = null;
let workflowDraftStages = [];
let metricsDraft = [];

document.addEventListener("DOMContentLoaded", () => {
  initAdminTriggers();
  initPinModal();
  initAdminWorkbench();
});

/* ==========================================================================
   AUTHENTICATION & SECRET TRIGGERS
   ========================================================================== */
function initAdminTriggers() {
  // Check session storage
  if (sessionStorage.getItem("thilac_admin_session") === "granted") {
    isAdminAuthenticated = true;
    document.body.classList.add("admin-unlocked");
  }

  // Floating lock button & nav lock button
  const navLockBtn = document.getElementById("nav-admin-lock");
  const floatLockBtn = document.getElementById("floating-admin-trigger");

  if (navLockBtn) navLockBtn.addEventListener("click", openAdminGate);
  if (floatLockBtn) floatLockBtn.addEventListener("click", openAdminGate);

  // Keyboard shortcut: Ctrl + Shift + A (displays the key/passcode modal)
  window.addEventListener("keydown", (e) => {
    const isA = e.key === "A" || e.key === "a" || e.code === "KeyA";
    if (e.ctrlKey && e.shiftKey && isA) {
      e.preventDefault();
      openPinModal();
    }
  });
}

function openAdminGate() {
  if (isAdminAuthenticated) {
    openAdminWorkbench();
  } else {
    openPinModal();
  }
}

function openPinModal() {
  const modal = document.getElementById("admin-pin-modal");
  if (!modal) return;

  // Reveal secret trigger elements in UI
  document.body.classList.add("admin-unlocked");
  const floatLockBtn = document.getElementById("floating-admin-trigger");
  if (floatLockBtn) floatLockBtn.style.display = "flex";
  const navLockBtn = document.getElementById("nav-admin-lock");
  if (navLockBtn) navLockBtn.style.display = "inline-flex";

  const errorEl = document.getElementById("pin-error-msg");
  if (errorEl) errorEl.textContent = "";

  const inputs = modal.querySelectorAll(".pin-digit-input");
  inputs.forEach(input => {
    input.value = "";
    input.style.borderColor = "";
  });

  modal.classList.add("open");
  document.body.style.overflow = "hidden";

  // Focus first digit
  setTimeout(() => {
    if (inputs[0]) inputs[0].focus();
  }, 150);
}

function initPinModal() {
  const modal = document.getElementById("admin-pin-modal");
  if (!modal) return;

  const inputs = modal.querySelectorAll(".pin-digit-input");
  const errorEl = document.getElementById("pin-error-msg");

  inputs.forEach((input, idx) => {
    input.addEventListener("input", (e) => {
      const val = e.target.value;
      if (val.length === 1 && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
      checkEnteredPin();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && idx > 0) {
        inputs[idx - 1].focus();
      }
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData("text").trim();
      if (pasted) {
        const chars = pasted.split("").slice(0, inputs.length);
        chars.forEach((c, i) => {
          if (inputs[i]) inputs[i].value = c;
        });
        checkEnteredPin();
      }
    });
  });

  function checkEnteredPin() {
    let pin = "";
    inputs.forEach(i => pin += i.value);

    if (pin.length === inputs.length) {
      if (pin === DEFAULT_PIN || pin === "2026") {
        isAdminAuthenticated = true;
        sessionStorage.setItem("thilac_admin_session", "granted");
        modal.classList.remove("open");
        document.body.style.overflow = "";
        openAdminWorkbench();
      } else {
        if (errorEl) errorEl.textContent = "Passcode incorrect. Please try again.";
        inputs.forEach(i => {
          i.value = "";
          i.style.borderColor = "#ef4444";
          setTimeout(() => { i.style.borderColor = ""; }, 1200);
        });
        if (inputs[0]) inputs[0].focus();
      }
    }
  }
}

/* ==========================================================================
   ADMIN WORKBENCH INITIALIZATION
   ========================================================================== */
function openAdminWorkbench() {
  const workbench = document.getElementById("admin-workbench-modal");
  if (!workbench) return;

  workbench.classList.add("open");
  document.body.style.overflow = "hidden";

  const panelProjects = document.getElementById("panel-projects");
  const panelGallery = document.getElementById("panel-gallery");
  const tabGallery = document.getElementById("tab-btn-gallery");

  if (tabGallery && tabGallery.classList.contains("active")) {
    if (panelProjects) {
      panelProjects.classList.remove("active");
      panelProjects.style.display = "none";
    }
    if (panelGallery) {
      panelGallery.classList.add("active");
      panelGallery.style.display = "flex";
    }
  } else {
    if (panelGallery) {
      panelGallery.classList.remove("active");
      panelGallery.style.display = "none";
    }
    if (panelProjects) {
      panelProjects.classList.add("active");
      panelProjects.style.display = "flex";
    }
  }

  refreshAdminProjectsList();
  resetEditorForm();
  refreshAdminGalleryFoldersList();
}

function initAdminWorkbench() {
  initStudioTabs();
  initGalleryFolderStudio();

  const btnNew = document.getElementById("admin-btn-new-proj");
  if (btnNew) {
    btnNew.addEventListener("click", () => {
      resetEditorForm();
    });
  }

  // Add Workflow Stage button
  const btnAddStage = document.getElementById("btn-add-workflow-stage");
  if (btnAddStage) {
    btnAddStage.addEventListener("click", () => {
      addWorkflowStageRow({
        id: `step-${Date.now()}`,
        title: "New Stage",
        desc: "Operational details & parameters.",
        type: "hardware",
        status: "active"
      });
    });
  }

  // Add Metric button
  const btnAddMetric = document.getElementById("btn-add-metric-row");
  if (btnAddMetric) {
    btnAddMetric.addEventListener("click", () => {
      addMetricRow("Parameter", "Target Value");
    });
  }

  // Image Upload Dropzone (Base64 file reader)
  const dropzone = document.getElementById("admin-image-dropzone");
  const fileInput = document.getElementById("admin-image-file-input");
  const heroUrlInput = document.getElementById("admin-proj-hero-url");
  const previewThumb = document.getElementById("admin-image-preview");

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const base64Data = loadEvt.target.result;
          if (previewThumb) {
            previewThumb.src = base64Data;
            previewThumb.style.display = "block";
          }
          if (heroUrlInput) heroUrlInput.value = base64Data;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Save Project Form
  const saveBtn = document.getElementById("admin-btn-save-project");
  if (saveBtn) {
    saveBtn.addEventListener("click", saveCurrentProject);
  }

  // Export JSON
  const exportBtn = document.getElementById("admin-btn-export-json");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportProjectsToJson);
  }

  // Import JSON
  const importInput = document.getElementById("admin-import-file-input");
  if (importInput) {
    importInput.addEventListener("change", importProjectsFromJson);
  }
}

/* ==========================================================================
   PROJECTS LIST IN WORKBENCH
   ========================================================================== */
function refreshAdminProjectsList() {
  const list = document.getElementById("admin-projects-list");
  if (!list) return;

  const projects = getStoredProjects();
  list.innerHTML = "";

  projects.forEach(p => {
    const item = document.createElement("div");
    item.className = `admin-proj-item ${p.id === editingProjectId ? "active" : ""}`;
    item.innerHTML = `
      <div class="admin-proj-info">
        <h4>${escapeHtml(p.title)}</h4>
        <span>${p.category.toUpperCase()} &bull; ${p.workflow ? p.workflow.length : 0} STAGES</span>
      </div>
      <div style="display: flex; gap: 0.4rem;">
        <button class="icon-btn" title="Edit Project" onclick="loadProjectIntoEditor('${p.id}')">
          <i class="fas fa-edit"></i>
        </button>
        <button class="icon-btn" title="Delete Project" style="color: #ef4444;" onclick="deleteProject('${p.id}')">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
    list.appendChild(item);
  });
}

function loadProjectIntoEditor(id) {
  const projects = getStoredProjects();
  const proj = projects.find(p => p.id === id);
  if (!proj) return;

  editingProjectId = proj.id;

  // Fill standard fields
  document.getElementById("admin-proj-title").value = proj.title || "";
  document.getElementById("admin-proj-category").value = proj.category || "robotics";
  document.getElementById("admin-proj-role").value = proj.role || "";
  document.getElementById("admin-proj-date").value = proj.date || "";
  document.getElementById("admin-proj-tagline").value = proj.tagline || "";
  document.getElementById("admin-proj-desc").value = proj.description || "";
  document.getElementById("admin-proj-tags").value = (proj.tags || []).join(", ");
  document.getElementById("admin-proj-hero-url").value = proj.heroImage || "";
  document.getElementById("admin-proj-video-url").value = proj.videoUrl || "";
  document.getElementById("admin-proj-pdf-url").value = proj.pdfUrl || "";
  document.getElementById("admin-proj-live-url").value = proj.liveUrl || "";

  const logoInput = document.getElementById("admin-proj-company-logo");
  if (logoInput) logoInput.value = proj.companyLogo || "";
  const nameInput = document.getElementById("admin-proj-company-name");
  if (nameInput) nameInput.value = proj.companyName || "";

  // Image preview
  const previewThumb = document.getElementById("admin-image-preview");
  if (previewThumb) {
    if (proj.heroImage) {
      previewThumb.src = proj.heroImage;
      previewThumb.style.display = "block";
    } else {
      previewThumb.style.display = "none";
    }
  }

  // Load Metrics
  const metricsContainer = document.getElementById("admin-metrics-list");
  if (metricsContainer) {
    metricsContainer.innerHTML = "";
    (proj.metrics || []).forEach(m => addMetricRow(m.label, m.value));
  }

  // Load Workflow Stages
  const stagesContainer = document.getElementById("admin-workflow-list");
  if (stagesContainer) {
    stagesContainer.innerHTML = "";
    (proj.workflow || []).forEach(s => addWorkflowStageRow(s));
  }

  refreshAdminProjectsList();
}

function resetEditorForm() {
  editingProjectId = null;
  const form = document.getElementById("admin-project-form");
  if (form) form.reset();

  const logoInput = document.getElementById("admin-proj-company-logo");
  if (logoInput) logoInput.value = "";
  const nameInput = document.getElementById("admin-proj-company-name");
  if (nameInput) nameInput.value = "";

  const previewThumb = document.getElementById("admin-image-preview");
  if (previewThumb) previewThumb.style.display = "none";

  const metricsContainer = document.getElementById("admin-metrics-list");
  if (metricsContainer) {
    metricsContainer.innerHTML = "";
    addMetricRow("Platform / Scope", "e.g. Unitree Go2 / CAD");
    addMetricRow("Performance", "e.g. 100% Verified");
  }

  const stagesContainer = document.getElementById("admin-workflow-list");
  if (stagesContainer) {
    stagesContainer.innerHTML = "";
    addWorkflowStageRow({ id: "step-1", title: "Conceptual Design & Schematics", desc: "Formulate physical constraints and baseline equations.", type: "cad", status: "completed" });
    addWorkflowStageRow({ id: "step-2", title: "Simulation & Stress Verification", desc: "FEA von Mises analysis & kinematics solver.", type: "analysis", status: "active" });
    addWorkflowStageRow({ id: "step-3", title: "Physical Prototyping & Deploy", desc: "Manufacturing, test bench run, and real-time execution.", type: "hardware", status: "upcoming" });
  }

  refreshAdminProjectsList();
}

/* ==========================================================================
   METRICS & WORKFLOW DYNAMIC ROWS
   ========================================================================== */
function addMetricRow(label = "", val = "") {
  const container = document.getElementById("admin-metrics-list");
  if (!container) return;

  const row = document.createElement("div");
  row.className = "form-grid";
  row.style.marginBottom = "0.75rem";
  row.innerHTML = `
    <input type="text" class="form-control metric-label-input" placeholder="Metric Name (e.g. Gear Ratio)" value="${escapeHtml(label)}" />
    <div style="display: flex; gap: 0.5rem;">
      <input type="text" class="form-control metric-value-input" placeholder="Metric Value (e.g. 4.2 : 1)" value="${escapeHtml(val)}" />
      <button type="button" class="icon-btn" style="color: #ef4444;" onclick="this.parentElement.parentElement.remove()"><i class="fas fa-trash-alt"></i></button>
    </div>
  `;
  container.appendChild(row);
}

function addWorkflowStageRow(stage = {}) {
  const container = document.getElementById("admin-workflow-list");
  if (!container) return;

  const row = document.createElement("div");
  row.className = "workflow-stage-row";
  row.innerHTML = `
    <div class="stage-drag-handle"><i class="fas fa-grip-lines"></i></div>
    <input type="text" class="form-control stage-title-input" placeholder="Stage Title" value="${escapeHtml(stage.title || '')}" />
    <input type="text" class="form-control stage-desc-input" placeholder="Stage Description" value="${escapeHtml(stage.desc || '')}" />
    <select class="form-control stage-type-select">
      <option value="hardware" ${stage.type === 'hardware' ? 'selected' : ''}>Hardware</option>
      <option value="cad" ${stage.type === 'cad' ? 'selected' : ''}>CAD Design</option>
      <option value="analysis" ${stage.type === 'analysis' ? 'selected' : ''}>Analysis &amp; FEA</option>
      <option value="algorithmic" ${stage.type === 'algorithmic' ? 'selected' : ''}>Algorithmic / Code</option>
      <option value="control" ${stage.type === 'control' ? 'selected' : ''}>Control / ROS 2</option>
      <option value="manufacturing" ${stage.type === 'manufacturing' ? 'selected' : ''}>Manufacturing</option>
      <option value="validation" ${stage.type === 'validation' ? 'selected' : ''}>Validation</option>
    </select>
    <select class="form-control stage-status-select">
      <option value="completed" ${stage.status === 'completed' ? 'selected' : ''}>Completed</option>
      <option value="active" ${stage.status === 'active' ? 'selected' : ''}>Active</option>
      <option value="upcoming" ${stage.status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
    </select>
    <button type="button" class="btn-remove-stage" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
  `;
  container.appendChild(row);
}

/* ==========================================================================
   SAVE PROJECT LOGIC
   ========================================================================== */
function saveCurrentProject() {
  const title = document.getElementById("admin-proj-title").value.trim();
  if (!title) {
    alert("Please provide a project title.");
    return;
  }

  const category = document.getElementById("admin-proj-category").value;
  const categoryLabels = {
    robotics: "Robotics & Autonomous Systems",
    mechanical: "Mechanical Design & CAE",
    software: "Software Engineering & AI",
    research: "Theoretical Physics & Research"
  };

  // Collect Metrics
  const metrics = [];
  document.querySelectorAll("#admin-metrics-list .form-grid").forEach(row => {
    const l = row.querySelector(".metric-label-input").value.trim();
    const v = row.querySelector(".metric-value-input").value.trim();
    if (l && v) metrics.push({ label: l, value: v });
  });

  // Collect Workflow Stages
  const workflow = [];
  document.querySelectorAll("#admin-workflow-list .workflow-stage-row").forEach((row, i) => {
    const t = row.querySelector(".stage-title-input").value.trim();
    const d = row.querySelector(".stage-desc-input").value.trim();
    const type = row.querySelector(".stage-type-select").value;
    const status = row.querySelector(".stage-status-select").value;
    if (t) {
      workflow.push({
        id: `step-${i + 1}`,
        title: t,
        desc: d,
        type: type,
        status: status
      });
    }
  });

  // Collect Tags
  const tagsRaw = document.getElementById("admin-proj-tags").value;
  const tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);

  const heroImage = document.getElementById("admin-proj-hero-url").value.trim() || "assets/schematic-quadruped.svg";

  const projects = getStoredProjects();
  const existingProject = editingProjectId ? projects.find(p => p.id === editingProjectId) : null;
  const logoInput = document.getElementById("admin-proj-company-logo");
  const nameInput = document.getElementById("admin-proj-company-name");
  const companyLogo = logoInput ? logoInput.value.trim() : (existingProject?.companyLogo || "");
  const companyName = nameInput ? nameInput.value.trim() : (existingProject?.companyName || "");

  const projectRecord = {
    id: editingProjectId || `proj-${Date.now()}`,
    title: title,
    category: category,
    categoryLabel: categoryLabels[category] || category.toUpperCase(),
    role: document.getElementById("admin-proj-role").value.trim() || "Lead Engineer",
    companyLogo: companyLogo || undefined,
    companyName: companyName || undefined,
    date: document.getElementById("admin-proj-date").value.trim() || "2026",
    tagline: document.getElementById("admin-proj-tagline").value.trim(),
    description: document.getElementById("admin-proj-desc").value.trim(),
    metrics: metrics,
    tags: tags,
    heroImage: heroImage,
    gallery: (existingProject?.gallery && existingProject.gallery.length > 0)
      ? [heroImage, ...existingProject.gallery.filter(img => img !== heroImage && img !== existingProject.heroImage)]
      : [heroImage],
    videoUrl: document.getElementById("admin-proj-video-url").value.trim(),
    pdfUrl: document.getElementById("admin-proj-pdf-url").value.trim() || "assets/CV.pdf",
    liveUrl: document.getElementById("admin-proj-live-url").value.trim(),
    workflow: workflow
  };

  if (editingProjectId) {
    const idx = projects.findIndex(p => p.id === editingProjectId);
    if (idx !== -1) {
      projects[idx] = projectRecord;
    } else {
      projects.unshift(projectRecord);
    }
  } else {
    projects.unshift(projectRecord);
  }

  // Update current editing ID to the saved project
  editingProjectId = projectRecord.id;

  // Save to localStorage
  saveStoredProjects(projects);

  // Trigger live refresh in main page
  if (typeof window.refreshPortfolioProjects === "function") {
    window.refreshPortfolioProjects();
  }

  // Refresh studio projects list immediately so new/updated title shows in sidebar
  refreshAdminProjectsList();

  // Visual success feedback
  const saveBtn = document.getElementById("admin-btn-save-project");
  saveBtn.innerHTML = '<i class="fas fa-check"></i> Project Published &amp; Saved!';
  saveBtn.style.background = "#10b981";

  setTimeout(() => {
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save &amp; Publish Project';
    saveBtn.style.background = "";
  }, 2000);
}

function deleteProject(id) {
  if (!confirm("Are you sure you want to remove this project?")) return;
  let projects = getStoredProjects();
  projects = projects.filter(p => p.id !== id);
  saveStoredProjects(projects);

  if (typeof window.refreshPortfolioProjects === "function") {
    window.refreshPortfolioProjects();
  }

  if (editingProjectId === id) {
    resetEditorForm();
  } else {
    refreshAdminProjectsList();
  }
}

/* ==========================================================================
   EXPORT & IMPORT JSON
   ========================================================================== */
function exportProjectsToJson() {
  const projects = getStoredProjects();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `thilac_ramesh_portfolio_data_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importProjectsFromJson(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (loadEvt) => {
    try {
      const parsed = JSON.parse(loadEvt.target.result);
      if (Array.isArray(parsed) && parsed.length > 0) {
        saveStoredProjects(parsed);
        if (typeof window.refreshPortfolioProjects === "function") {
          window.refreshPortfolioProjects();
        }
        refreshAdminProjectsList();
        resetEditorForm();
        alert("Projects successfully imported!");
      } else {
        alert("Invalid project JSON array format.");
      }
    } catch (err) {
      alert("Error parsing JSON file: " + err.message);
    }
  };
  reader.readAsText(file);
}

/* ==========================================================================
   STUDIO SUBTABS SYSTEM
   ========================================================================== */
function initStudioTabs() {
  const tabBtns = document.querySelectorAll(".admin-tab-btn");
  const panelProjects = document.getElementById("panel-projects");
  const panelGallery = document.getElementById("panel-gallery");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabTarget = btn.getAttribute("data-tab");

      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (tabTarget === "gallery") {
        if (panelProjects) {
          panelProjects.classList.remove("active");
          panelProjects.style.display = "none";
        }
        if (panelGallery) {
          panelGallery.classList.add("active");
          panelGallery.style.display = "flex";
          refreshAdminGalleryFoldersList();
        }
      } else {
        if (panelGallery) {
          panelGallery.classList.remove("active");
          panelGallery.style.display = "none";
        }
        if (panelProjects) {
          panelProjects.classList.add("active");
          panelProjects.style.display = "flex";
          refreshAdminProjectsList();
        }
      }
    });
  });
}

/* ==========================================================================
   COMPETITION GALLERY FOLDERS STUDIO WORKBENCH
   ========================================================================== */
let editingGalleryFolderKey = null;

function getStoredGalleryFolders() {
  let baseFolders = [];

  // 1. Ingest base folders from GALLERY_CONFIG if available
  if (typeof GALLERY_CONFIG !== "undefined" && Array.isArray(GALLERY_CONFIG.folders)) {
    baseFolders = JSON.parse(JSON.stringify(GALLERY_CONFIG.folders));
  } else {
    baseFolders = [
      {
        id: "datastrom",
        folder: "DATASTROM",
        name: "DataStorm 7.0",
        award: "National Finalist & Podium Deliberation",
        organization: "Rotaract Clubs of UoM & UoC • Powered by Octave",
        venue: "Colombo, Sri Lanka",
        date: "2025 / 2026",
        icon: "fas fa-chart-line",
        badge: "DataStorm 7.0"
      },
      {
        id: "nexushacks",
        folder: "NexusHacks",
        name: "NexusHacks 2026",
        award: "1st Runner-Up (Agentic AI Track)",
        organization: "Organized by Phaser, India • Team Kestrel (Dept. of Computer Engineering, Univ. of Peradeniya)",
        venue: "National AI Arena (Remote / Hybrid)",
        date: "2026",
        icon: "fas fa-brain",
        badge: "1st Runner-Up"
      }
    ];
  }

  // 2. Merge any user-registered custom folders from localStorage
  try {
    const custom = JSON.parse(localStorage.getItem("thilac_custom_folders") || "[]");
    if (Array.isArray(custom)) {
      custom.forEach(cf => {
        const idx = baseFolders.findIndex(b => (b.folder || "").toLowerCase() === (cf.folder || "").toLowerCase());
        if (idx !== -1) {
          baseFolders[idx] = Object.assign({}, baseFolders[idx], cf);
        } else {
          baseFolders.push(cf);
        }
      });
    }
  } catch (e) {}

  return baseFolders;
}

function refreshAdminGalleryFoldersList() {
  const list = document.getElementById("admin-folders-list");
  const countBadge = document.getElementById("admin-folders-count");
  if (!list) return;

  const folders = getStoredGalleryFolders();
  if (countBadge) countBadge.textContent = folders.length;

  list.innerHTML = "";
  folders.forEach(f => {
    const isSelected = editingGalleryFolderKey && (editingGalleryFolderKey.toLowerCase() === (f.folder || "").toLowerCase());
    const item = document.createElement("div");
    item.className = `admin-folder-item ${isSelected ? "active" : ""}`;
    item.innerHTML = `
      <div class="admin-folder-info">
        <h4><i class="${f.icon || 'fas fa-trophy'}"></i> ${escapeHtml(f.name || f.folder)}</h4>
        <span>gallery/${escapeHtml(f.folder)}/</span>
        <span style="font-size: 0.7rem; color: var(--text-muted);">${escapeHtml(f.award || f.organization || "Active Competition Feed")}</span>
      </div>
      <div style="display: flex; gap: 0.35rem; align-items: center;">
        <button type="button" class="icon-btn" title="Edit Folder" onclick="loadGalleryFolderIntoEditor('${escapeHtml(f.folder)}')">
          <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="icon-btn" title="Remove Folder" style="color: #ef4444;" onclick="deleteGalleryFolder('${escapeHtml(f.folder)}')">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
    list.appendChild(item);
  });
}

window.loadGalleryFolderIntoEditor = function(folderName) {
  const folders = getStoredGalleryFolders();
  const f = folders.find(item => (item.folder || "").toLowerCase() === folderName.toLowerCase());
  if (!f) return;

  editingGalleryFolderKey = f.folder;
  const nameInput = document.getElementById("admin-folder-name");
  const titleInput = document.getElementById("admin-folder-title");
  const awardInput = document.getElementById("admin-folder-award");
  const orgInput = document.getElementById("admin-folder-org");
  const venueInput = document.getElementById("admin-folder-venue");
  const dateInput = document.getElementById("admin-folder-date");
  const iconInput = document.getElementById("admin-folder-icon");

  if (nameInput) nameInput.value = f.folder || "";
  if (titleInput) titleInput.value = f.name || "";
  if (awardInput) awardInput.value = f.award || "";
  if (orgInput) orgInput.value = f.organization || "";
  if (venueInput) venueInput.value = f.venue || "";
  if (dateInput) dateInput.value = f.date || "";
  if (iconInput && f.icon) iconInput.value = f.icon;

  const cardTitle = document.getElementById("admin-folder-card-title");
  if (cardTitle) cardTitle.textContent = `Edit Folder: ${f.name || f.folder}`;

  const badgeStatus = document.getElementById("admin-folder-badge-status");
  if (badgeStatus) {
    badgeStatus.textContent = "EDITING";
    badgeStatus.style.background = "rgba(245, 158, 11, 0.15)";
    badgeStatus.style.color = "#f59e0b";
  }

  refreshAdminGalleryFoldersList();
};

function resetGalleryFolderForm() {
  editingGalleryFolderKey = null;
  const form = document.getElementById("admin-gallery-folder-form");
  if (form) form.reset();

  const cardTitle = document.getElementById("admin-folder-card-title");
  if (cardTitle) cardTitle.textContent = "Register Competition Folder";

  const badgeStatus = document.getElementById("admin-folder-badge-status");
  if (badgeStatus) {
    badgeStatus.textContent = "NEW FOLDER";
    badgeStatus.style.background = "var(--accent-blue-tint)";
    badgeStatus.style.color = "var(--accent-cyan)";
  }

  refreshAdminGalleryFoldersList();
}

function saveCurrentGalleryFolder() {
  const folderNameInput = document.getElementById("admin-folder-name");
  const titleInput = document.getElementById("admin-folder-title");
  const awardInput = document.getElementById("admin-folder-award");
  const orgInput = document.getElementById("admin-folder-org");
  const venueInput = document.getElementById("admin-folder-venue");
  const dateInput = document.getElementById("admin-folder-date");
  const iconInput = document.getElementById("admin-folder-icon");

  if (!folderNameInput || !folderNameInput.value.trim()) {
    alert("Please enter the folder name inside PORTFOLIO/gallery/ (e.g. DATASTROM, NexusHacks).");
    if (folderNameInput) folderNameInput.focus();
    return;
  }

  const rawName = folderNameInput.value.trim().replace(/[\\/]/g, "");
  const folderId = rawName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanTitle = titleInput && titleInput.value.trim() ? titleInput.value.trim() : rawName;
  const cleanAward = awardInput ? awardInput.value.trim() : "";
  const cleanOrg = orgInput ? orgInput.value.trim() : "";
  const cleanVenue = venueInput ? venueInput.value.trim() : "";
  const cleanDate = dateInput ? dateInput.value.trim() : "";
  const cleanIcon = iconInput ? iconInput.value : "fas fa-trophy";

  const newFolderObj = {
    id: folderId,
    folder: rawName,
    name: cleanTitle,
    award: cleanAward,
    organization: cleanOrg,
    venue: cleanVenue,
    date: cleanDate,
    icon: cleanIcon,
    badge: cleanTitle
  };

  // Persist to localStorage
  try {
    let saved = JSON.parse(localStorage.getItem("thilac_custom_folders") || "[]");
    saved = saved.filter(f => (f.folder || "").toLowerCase() !== rawName.toLowerCase() && (!editingGalleryFolderKey || (f.folder || "").toLowerCase() !== editingGalleryFolderKey.toLowerCase()));
    saved.push(newFolderObj);
    localStorage.setItem("thilac_custom_folders", JSON.stringify(saved));
  } catch (e) {}

  // Update in-memory GALLERY_CONFIG if available
  if (typeof GALLERY_CONFIG !== "undefined" && Array.isArray(GALLERY_CONFIG.folders)) {
    const existingIdx = GALLERY_CONFIG.folders.findIndex(f => (f.folder || "").toLowerCase() === rawName.toLowerCase());
    if (existingIdx !== -1) {
      GALLERY_CONFIG.folders[existingIdx] = Object.assign(GALLERY_CONFIG.folders[existingIdx], newFolderObj);
    } else {
      GALLERY_CONFIG.folders.push(newFolderObj);
    }
  }

  alert(`✅ Competition folder "${rawName}" saved successfully! It is linked to your gallery feed.`);
  resetGalleryFolderForm();
}

window.deleteGalleryFolder = function(folderName) {
  if (!confirm(`Are you sure you want to remove folder "${folderName}" from registered competitions?`)) return;

  try {
    let saved = JSON.parse(localStorage.getItem("thilac_custom_folders") || "[]");
    saved = saved.filter(f => (f.folder || "").toLowerCase() !== folderName.toLowerCase());
    localStorage.setItem("thilac_custom_folders", JSON.stringify(saved));
  } catch (e) {}

  if (typeof GALLERY_CONFIG !== "undefined" && Array.isArray(GALLERY_CONFIG.folders)) {
    GALLERY_CONFIG.folders = GALLERY_CONFIG.folders.filter(f => (f.folder || "").toLowerCase() !== folderName.toLowerCase());
  }

  if (editingGalleryFolderKey && editingGalleryFolderKey.toLowerCase() === folderName.toLowerCase()) {
    resetGalleryFolderForm();
  } else {
    refreshAdminGalleryFoldersList();
  }
};

function exportGalleryConfigJs() {
  const folders = getStoredGalleryFolders();
  const content = `/**
 * Auto-Generated Gallery Folders & Configuration
 * Exported from Project Management Studio on: ${new Date().toLocaleString()}
 */
const GALLERY_CONFIG = {
  baseDir: "gallery",
  supportedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".PNG"],
  maxSequentialMisses: 2,
  maxProbePerFolder: 50,
  folders: ${JSON.stringify(folders, null, 4)}
};
`;

  const blob = new Blob([content], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "gallery-config.js";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportGalleryManifestJson() {
  const folders = getStoredGalleryFolders();
  const manifestData = {
    version: "1.0",
    lastUpdated: new Date().toISOString(),
    folders: folders
  };

  const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "manifest.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function initGalleryFolderStudio() {
  const btnNew = document.getElementById("admin-btn-new-folder");
  if (btnNew) btnNew.addEventListener("click", resetGalleryFolderForm);

  const btnCancel = document.getElementById("admin-btn-cancel-folder");
  if (btnCancel) btnCancel.addEventListener("click", resetGalleryFolderForm);

  const btnSave = document.getElementById("admin-btn-save-folder");
  if (btnSave) btnSave.addEventListener("click", saveCurrentGalleryFolder);

  const btnExportConfig = document.getElementById("admin-btn-export-gallery-config");
  if (btnExportConfig) btnExportConfig.addEventListener("click", exportGalleryConfigJs);

  const btnExportManifest = document.getElementById("admin-btn-export-gallery-manifest");
  if (btnExportManifest) btnExportManifest.addEventListener("click", exportGalleryManifestJson);

  refreshAdminGalleryFoldersList();
}

