/**
 * Interactive Robotic Workflow Canvas ("Pallet with Robot-Connected Nodes")
 * Renders an animated cyber-mechanical pipeline with SVG articulated conduits,
 * glowing pulse nodes, and interactive parameter inspection.
 */

class RoboticWorkflowCanvas {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.options = Object.assign({
      interactive: true,
      accentColor: "#38bdf8",
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
        <span class="hud-title"><i class="fas fa-project-diagram"></i> KINEMATIC WORKFLOW PALETTE</span>
        <span class="hud-badge">${workflowSteps.length} STAGES</span>
      </div>
      <div class="hud-right">
        <span class="hud-metric"><i class="fas fa-bolt"></i> CONDUIT: ACTIVE</span>
        <span class="hud-metric"><i class="fas fa-microchip"></i> ACSAR-E READY</span>
      </div>
    `;
    wrapper.appendChild(hudBar);

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
      nodeCard.className = `pallet-node-card status-${step.status || "active"} ${idx === this.activeNodeIndex ? "selected" : ""}`;
      nodeCard.dataset.nodeIndex = idx;
      nodeCard.setAttribute("tabindex", "0");

      const iconType = this.getStepIcon(step.type || "hardware");
      const statusLabel = step.status ? step.status.toUpperCase() : "ACTIVE";

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
            <span class="stage-number">STAGE 0${idx + 1}</span>
            <span class="stage-status-pill pill-${step.status || "active"}">${statusLabel}</span>
          </div>
          <h4 class="node-title">${this.escapeHTML(step.title || `Stage ${idx + 1}`)}</h4>
          <p class="node-desc">${this.escapeHTML(step.desc || "Operational phase execution parameters.")}</p>
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
    const cards = this.container.querySelectorAll(".pallet-node-card");
    cards.forEach((c, idx) => {
      if (idx === index) {
        c.classList.add("selected");
      } else {
        c.classList.remove("selected");
      }
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
    const iconType = this.getStepIcon(step.type);

    inspector.innerHTML = `
      <div class="inspector-card">
        <div class="inspector-header">
          <div class="inspector-badge">
            <i class="${iconType}"></i>
            <span>STAGE 0${index + 1} OF 0${total}</span>
          </div>
          <div class="inspector-status status-${step.status || "active"}">
            <span class="dot"></span>
            ${(step.status || "ACTIVE").toUpperCase()}
          </div>
        </div>
        <h3 class="inspector-title">${this.escapeHTML(step.title)}</h3>
        <p class="inspector-desc">${this.escapeHTML(step.desc)}</p>
        <div class="inspector-telemetry">
          <div class="telemetry-pill">
            <span class="label">MODULE TYPE</span>
            <span class="val">${(step.type || "HARDWARE").toUpperCase()}</span>
          </div>
          <div class="telemetry-pill">
            <span class="label">BUS PROTOCOL</span>
            <span class="val">CAN / ROS 2</span>
          </div>
          <div class="telemetry-pill">
            <span class="label">VERIFICATION</span>
            <span class="val">${step.status === "completed" ? "PASS (100%)" : "IN-PROGRESS"}</span>
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

      // Calculate anchor joints relative to stageArea
      const x1 = (c1.left + c1.width / 2) - rect.left;
      const y1 = (c1.bottom) - rect.top - 8;
      const x2 = (c2.left + c2.width / 2) - rect.left;
      const y2 = (c2.top) - rect.top + 8;

      // Handle horizontal or vertical layouts depending on viewport
      let d = "";
      if (Math.abs(y2 - y1) < 60) {
        // Horizontal arrangement
        const hx1 = (c1.right) - rect.left;
        const hy1 = (c1.top + c1.height / 2) - rect.top;
        const hx2 = (c2.left) - rect.left;
        const hy2 = (c2.top + c2.height / 2) - rect.top;
        const midX = (hx1 + hx2) / 2;
        d = `M ${hx1} ${hy1} C ${midX} ${hy1}, ${midX} ${hy2}, ${hx2} ${hy2}`;
      } else {
        // Vertical or staggered arrangement
        const midY = (y1 + y2) / 2;
        d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
      }

      const isCompleted = cards[i].classList.contains("status-completed");
      const strokeColor = isCompleted ? "#10b981" : "#38bdf8";

      pathsHtml += `
        <!-- Robotic Arm / Conduit Cable -->
        <path d="${d}" fill="none" stroke="rgba(15, 23, 42, 0.6)" stroke-width="6" stroke-linecap="round"/>
        <path d="${d}" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
        <!-- Animated Pulse Beam -->
        <path d="${d}" fill="none" stroke="#e0f2fe" stroke-width="3" stroke-dasharray="6 28" class="conduit-signal-pulse" filter="url(#glow)"/>
      `;
    }

    svg.innerHTML = pathsHtml;
  }

  getStepIcon(type = "") {
    switch (type.toLowerCase()) {
      case "cad": return "fas fa-cube";
      case "analysis":
      case "calculation": return "fas fa-chart-line";
      case "hardware": return "fas fa-microchip";
      case "algorithmic":
      case "code": return "fas fa-code";
      case "integration": return "fas fa-network-wired";
      case "control": return "fas fa-gamepad";
      case "manufacturing": return "fas fa-tools";
      case "validation":
      case "qa": return "fas fa-check-double";
      case "research":
      case "mathematics": return "fas fa-atom";
      case "peer-review": return "fas fa-scroll";
      default: return "fas fa-cog";
    }
  }

  escapeHTML(str = "") {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}
