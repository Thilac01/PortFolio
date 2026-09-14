/**
 * Interactive Robotic Workflow Canvas ("Pallet with Robot-Connected Nodes")
 * Implements the verified engineering lifecycle progression:
 * Problem → What I Built → My Contribution → Measurable Result → Video → GitHub → Technical Report
 * Author: Thilac Ramesh Portfolio System
 */

class RoboticWorkflowCanvas {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.options = Object.assign({
      interactive: true,
      accentColor: "#38bdf8",
      project: null,
      onNodeSelect: null
    }, options);
    this.activeNodeIndex = 0;
  }

  render(workflowSteps = []) {
    if (!this.container) return;
    this.container.innerHTML = "";

    if (!workflowSteps || workflowSteps.length === 0) {
      this.container.innerHTML = `
        <div class="workflow-empty-state">
          <i class="fas fa-microchip"></i>
          <p>No workflow stages defined for this engineering pipeline.</p>
        </div>
      `;
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "robotic-pallet-wrapper";

    // Palette Header & HUD
    const hudBar = document.createElement("div");
    hudBar.className = "pallet-hud-bar";
    hudBar.innerHTML = `
      <div class="hud-left">
        <span class="hud-indicator live-pulse"></span>
        <span class="hud-title"><i class="fas fa-project-diagram"></i> ENGINEERING WORKFLOW PIPELINE</span>
        <span class="hud-badge">${workflowSteps.length} VERIFIED STAGES</span>
      </div>
      <div class="hud-right">
        <span class="hud-metric"><i class="fas fa-shield-alt" style="color: #10b981;"></i> RIGOROUS VALIDATION</span>
        <span class="hud-metric"><i class="fas fa-file-pdf" style="color: #ef4444;"></i> REPORT BACKED</span>
      </div>
    `;
    wrapper.appendChild(hudBar);

    // Executive Pipeline Stepper Bar: Problem → What I Built → My Contribution → Measurable Result → Video → GitHub → Technical Report
    const stepperBar = document.createElement("div");
    stepperBar.className = "pallet-stepper-bar";
    stepperBar.innerHTML = `
      <div class="stepper-scroll-container">
        ${workflowSteps.map((step, idx) => {
          const icon = this.getStepIcon(step.type || step.stageKey);
          const label = step.stageLabel || step.title || `Stage ${idx + 1}`;
          const isSelected = idx === this.activeNodeIndex;
          return `
            <div class="stepper-step-item ${isSelected ? 'active' : ''}" data-step-index="${idx}">
              <div class="stepper-step-circle">
                <i class="${icon}"></i>
              </div>
              <span class="stepper-step-label">${this.escapeHTML(label)}</span>
            </div>
            ${idx < workflowSteps.length - 1 ? `<div class="stepper-step-arrow"><i class="fas fa-chevron-right"></i></div>` : ''}
          `;
        }).join("")}
      </div>
    `;

    // Add click event to stepper items
    stepperBar.querySelectorAll(".stepper-step-item").forEach(item => {
      item.addEventListener("click", () => {
        const idx = parseInt(item.dataset.stepIndex, 10);
        this.selectNode(idx, workflowSteps);
      });
    });
    wrapper.appendChild(stepperBar);

    // Main Stage Area (Nodes + Canvas Connections)
    const stageArea = document.createElement("div");
    stageArea.className = "pallet-stage-area";
    stageArea.id = "pallet-stage-area";

    // SVG Connector overlay
    const svgOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgOverlay.setAttribute("class", "robotic-conduit-svg");
    svgOverlay.setAttribute("id", "robotic-conduit-svg");
    stageArea.appendChild(svgOverlay);

    // Nodes track container
    const nodesTrack = document.createElement("div");
    nodesTrack.className = "pallet-nodes-track";

    workflowSteps.forEach((step, idx) => {
      const nodeCard = document.createElement("div");
      nodeCard.className = `pallet-node-card status-${step.status || "completed"} ${idx === this.activeNodeIndex ? "selected" : ""} type-${step.type || step.stageKey || 'generic'}`;
      nodeCard.dataset.nodeIndex = idx;
      nodeCard.setAttribute("tabindex", "0");

      const iconType = this.getStepIcon(step.type || step.stageKey);
      const stageLabel = (step.stageLabel || `STAGE 0${idx + 1}`).toUpperCase();

      nodeCard.innerHTML = `
        <div class="node-robot-joint">
          <div class="joint-outer-ring">
            <div class="joint-core-disc">
              <i class="${iconType}"></i>
            </div>
          </div>
          <div class="joint-lead-terminal"></div>
        </div>
        <div class="node-content">
          <div class="node-stage-meta">
            <span class="stage-number">0${idx + 1}</span>
            <span class="stage-status-pill pill-${step.type || step.stageKey || 'active'}">${stageLabel}</span>
          </div>
          <h4 class="node-title">${this.escapeHTML(step.title || `Stage ${idx + 1}`)}</h4>
          <p class="node-desc">${this.escapeHTML(step.desc || "Execution details and engineering parameters.")}</p>
        </div>
      `;

      if (this.options.interactive) {
        nodeCard.addEventListener("click", () => {
          this.selectNode(idx, workflowSteps);
        });
      }

      nodesTrack.appendChild(nodeCard);
    });

    stageArea.appendChild(nodesTrack);
    wrapper.appendChild(stageArea);

    // Node Inspector Drawer (Live details)
    const inspector = document.createElement("div");
    inspector.className = "pallet-inspector-panel";
    inspector.id = "pallet-inspector";
    wrapper.appendChild(inspector);

    this.container.appendChild(wrapper);

    // Draw conduits after layout has computed
    requestAnimationFrame(() => {
      this.drawRoboticConduits();
      this.updateInspector(this.activeNodeIndex, workflowSteps);
    });

    // Handle resize
    window.addEventListener("resize", () => {
      this.drawRoboticConduits();
    }, { passive: true });
  }

  selectNode(index, steps) {
    this.activeNodeIndex = index;

    // Update node cards
    const cards = this.container.querySelectorAll(".pallet-node-card");
    cards.forEach((c, idx) => {
      if (idx === index) {
        c.classList.add("selected");
        // Scroll node into view smoothly
        c.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      } else {
        c.classList.remove("selected");
      }
    });

    // Update stepper items
    const stepperItems = this.container.querySelectorAll(".stepper-step-item");
    stepperItems.forEach((s, idx) => {
      s.classList.toggle("active", idx === index);
    });

    this.updateInspector(index, steps);
    this.drawRoboticConduits();

    if (typeof this.options.onNodeSelect === "function") {
      this.options.onNodeSelect(steps[index], index);
    }
  }

  updateInspector(index, steps) {
    const inspector = this.container.querySelector("#pallet-inspector");
    if (!inspector || !steps[index]) return;

    const step = steps[index];
    const total = steps.length;
    const iconType = this.getStepIcon(step.type || step.stageKey);
    const stageName = step.stageLabel || `Stage 0${index + 1}`;
    const project = this.options.project || {};

    let actionButtonHtml = "";

    // Contextual Action Buttons based on stage type
    if (step.stageKey === "video" || step.type === "video") {
      const hasVideo = !!project.videoUrl;
      actionButtonHtml = `
        <div class="inspector-action-row">
          ${hasVideo ? `
            <button type="button" class="btn-workflow-action btn-primary" onclick="if(window.switchModalTab) window.switchModalTab('video');">
              <i class="fas fa-play-circle"></i> Watch Video Demonstration
            </button>
          ` : `
            <button type="button" class="btn-workflow-action btn-secondary" onclick="if(window.switchModalTab) window.switchModalTab('gallery');">
              <i class="fas fa-cubes"></i> View 3D CAD Walkthrough
            </button>
          `}
          ${project.videoUrl ? `
            <a href="${project.videoUrl}" target="_blank" rel="noreferrer" class="btn-workflow-action btn-outline">
              <i class="fas fa-external-link-alt"></i> Open on YouTube
            </a>
          ` : ''}
        </div>
      `;
    } else if (step.stageKey === "github" || step.type === "github") {
      const githubUrl = step.actionUrl || project.liveUrl || "https://github.com/Thilac01";
      actionButtonHtml = `
        <div class="inspector-action-row">
          <a href="${githubUrl}" target="_blank" rel="noreferrer" class="btn-workflow-action btn-primary">
            <i class="fab fa-github"></i> Open GitHub Repository
          </a>
          <span style="font-size: 0.8rem; color: var(--text-muted); display: inline-flex; align-items: center; gap: 6px;">
            <i class="fas fa-code-branch" style="color: var(--accent-cyan);"></i> Verified Open Source / CAD Assets
          </span>
        </div>
      `;
    } else if (step.stageKey === "report" || step.type === "report") {
      const pdfUrl = step.actionUrl || project.pdfUrl || "assets/CV.pdf";
      actionButtonHtml = `
        <div class="inspector-action-row">
          <button type="button" class="btn-workflow-action btn-primary" onclick="if(window.switchModalTab) window.switchModalTab('pdf');">
            <i class="fas fa-file-pdf"></i> Inspect Technical Report in PDF Viewer
          </button>
          <a href="${pdfUrl}" target="_blank" rel="noreferrer" class="btn-workflow-action btn-outline" download>
            <i class="fas fa-download"></i> Download PDF
          </a>
        </div>
      `;
    } else if (step.stageKey === "result" || step.type === "result") {
      if (project.metrics && project.metrics.length > 0) {
        actionButtonHtml = `
          <div class="inspector-metrics-preview">
            ${project.metrics.map(m => `
              <div class="inspector-metric-chip">
                <span class="metric-chip-label">${this.escapeHTML(m.label)}</span>
                <span class="metric-chip-value">${this.escapeHTML(m.value)}</span>
              </div>
            `).join("")}
          </div>
        `;
      }
    }

    inspector.innerHTML = `
      <div class="inspector-card">
        <div class="inspector-header">
          <div class="inspector-badge">
            <i class="${iconType}"></i>
            <span>STAGE 0${index + 1} OF 0${total} &bull; ${stageName.toUpperCase()}</span>
          </div>
          <div class="inspector-status status-${step.status || "completed"}">
            <span class="dot"></span>
            VERIFIED STAGE
          </div>
        </div>
        <h3 class="inspector-title">${this.escapeHTML(step.title)}</h3>
        <p class="inspector-desc">${this.escapeHTML(step.desc)}</p>
        ${actionButtonHtml}
        <div class="inspector-telemetry">
          <div class="telemetry-pill">
            <span class="label">STAGE CATEGORY</span>
            <span class="val">${(step.stageLabel || step.type || "ENGINEERING").toUpperCase()}</span>
          </div>
          <div class="telemetry-pill">
            <span class="label">METHODOLOGY</span>
            <span class="val">${step.stageKey === "report" ? "PEER-REVIEWED / ACADEMIC" : step.stageKey === "github" ? "GIT REPOSITORY" : "VERIFIED CALCULATION"}</span>
          </div>
          <div class="telemetry-pill">
            <span class="label">STATUS</span>
            <span class="val" style="color: #10b981;"><i class="fas fa-check-circle"></i> COMPLETE</span>
          </div>
        </div>
      </div>
    `;
  }

  drawRoboticConduits() {
    const stageArea = this.container.querySelector("#pallet-stage-area");
    const svg = this.container.querySelector("#robotic-conduit-svg");
    if (!stageArea || !svg) return;

    const cards = Array.from(this.container.querySelectorAll(".pallet-node-card"));
    if (cards.length < 2) {
      svg.innerHTML = "";
      return;
    }

    const rect = stageArea.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
    svg.setAttribute("width", rect.width);
    svg.setAttribute("height", rect.height);

    let pathsHtml = `
      <defs>
        <linearGradient id="conduitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0284c7" stop-opacity="0.8"/>
          <stop offset="50%" stop-color="#38bdf8" stop-opacity="1"/>
          <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.8"/>
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
    `;

    for (let i = 0; i < cards.length - 1; i++) {
      const c1 = cards[i].getBoundingClientRect();
      const c2 = cards[i + 1].getBoundingClientRect();

      const x1 = (c1.left + c1.width / 2) - rect.left;
      const y1 = (c1.bottom) - rect.top - 8;
      const x2 = (c2.left + c2.width / 2) - rect.left;
      const y2 = (c2.top) - rect.top + 8;

      let d = "";
      if (Math.abs(y2 - y1) < 60) {
        const hx1 = (c1.right) - rect.left;
        const hy1 = (c1.top + c1.height / 2) - rect.top;
        const hx2 = (c2.left) - rect.left;
        const hy2 = (c2.top + c2.height / 2) - rect.top;
        const midX = (hx1 + hx2) / 2;
        d = `M ${hx1} ${hy1} C ${midX} ${hy1}, ${midX} ${hy2}, ${hx2} ${hy2}`;
      } else {
        const midY = (y1 + y2) / 2;
        d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
      }

      const strokeColor = "#38bdf8";

      pathsHtml += `
        <path d="${d}" fill="none" stroke="rgba(15, 23, 42, 0.4)" stroke-width="6" stroke-linecap="round"/>
        <path d="${d}" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
        <path d="${d}" fill="none" stroke="#e0f2fe" stroke-width="3" stroke-dasharray="6 28" class="conduit-signal-pulse" filter="url(#glow)"/>
      `;
    }

    svg.innerHTML = pathsHtml;
  }

  getStepIcon(type = "") {
    switch (type.toLowerCase()) {
      case "problem": return "fas fa-triangle-exclamation";
      case "built": return "fas fa-cubes";
      case "contribution": return "fas fa-user-gear";
      case "result": return "fas fa-chart-line";
      case "video": return "fas fa-play";
      case "github": return "fab fa-github";
      case "report": return "fas fa-file-pdf";
      case "cad": return "fas fa-cube";
      case "hardware": return "fas fa-microchip";
      case "algorithmic":
      case "code": return "fas fa-code";
      case "integration": return "fas fa-network-wired";
      case "manufacturing": return "fas fa-tools";
      case "research": return "fas fa-atom";
      default: return "fas fa-cog";
    }
  }

  escapeHTML(str = "") {
    return String(str).replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}
