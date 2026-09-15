/**
 * Portfolio RAG (Retrieval-Augmented Generation) System for Thilac Ramesh
 * 
 * Provides structured semantic knowledge chunks and a client-side retrieval engine
 * to ground Gemini responses strictly in Thilac Ramesh's engineering portfolio.
 */

const PORTFOLIO_KNOWLEDGE_BASE = [
  {
    id: "bio-overview",
    title: "Executive Summary & Professional Profile",
    category: "profile",
    tags: ["bio", "about", "profile", "thilac", "ramesh", "peradeniya", "wso2", "robotics", "engineer"],
    content: `Thilac Ramesh is an undergraduate in Mechanical Engineering at the University of Peradeniya (Sri Lanka), specializing in Autonomous Robotics, LiDAR SLAM, ROS 2, and Finite Element Machine Design.
Currently, he is a Robotics Research Team Member at WSO2 Research (June 2026 – Present), pioneering Building Information Modeling (BIM)-integrated autonomous patrol and SLAM navigation on the Unitree Go2 EDU quadruped robotic platform.
He holds three official Dassault Systèmes credentials: Certified SOLIDWORKS Associate (CSWA) in Mechanical Design, CSWA – Additive Manufacturing (CSWA-AM), and CSWA – Sustainable Design (CSWA-SD).
His engineering philosophy combines theoretical mechanics, rigorous CAE/FEA simulation, and high-performance embedded systems to build resilient autonomous machines.
Contact & Links:
- LinkedIn: https://www.linkedin.com/in/thilac-r-077a85285/
- GitHub: https://github.com/Thilac01
- ORCID: 0009-0008-2125-4890
- CV / Resume: Available for download (CV.pdf) on the portfolio.`
  },
  {
    id: "project-unitree-slam",
    title: "Project: Unitree Go2 Quadruped SLAM & BIM-Integrated Navigation",
    category: "projects",
    tags: ["unitree", "go2", "slam", "quadruped", "robot", "robotics", "wso2", "ros2", "nav2", "lidar", "realsense", "acsar-e", "bim", "mujoco"],
    content: `Project Title: Unitree Go2 Quadruped SLAM & BIM-Integrated Navigation
Role: Robotics Research Team Member @ WSO2 (Jun 2026 – Present)
Platform: Unitree Go2 EDU Quadruped Robot
Key Metrics:
- Drift Accuracy: < 1.5 cm drift in localization
- Sensors: 4D LiDAR + RealSense Depth Camera + IMU
- Control & Framerate: 30 Hz real-time processing loop
- Technologies: ROS 2, Unitree Go2 EDU SDK, SLAM (FAST-LIO2 / Cartographer), Nav2, MuJoCo simulation, C++, Python, ACSAR-E autonomous mission dispatch.
Description:
Developing real-time SLAM optimization and BIM (Building Information Modeling)-integrated navigation pipelines for autonomous operation of the Unitree Go2 EDU quadruped robot.
Synthesizes multi-sensor point clouds, dynamic obstacle avoidance, and precise localization within the ACSAR-E framework for automated facility patrol.
Engineering Workflow:
1. Sensor Calibration: Aligning LiDAR, RealSense depth camera, and IMU spatial extrinsics with time synchronization.
2. Point Cloud Filtering & Odometry: FAST-LIO2 algorithm tuning for quadruped dynamic gait vibration dampening.
3. BIM Semantic Mapping: Converting architectural IFC/Revit digital twin models into 2.5D costmaps and elevation grids.
4. Nav2 & TEB Local Planner: Custom trajectory evaluation, dynamic obstacle re-routing, and quadruped kinematic constraint solving.
5. ACSAR-E Autonomous Patrol: Policy-based mission dispatch, automated waypoint patrolling, and anomaly reporting.`
  },
  {
    id: "project-meat-mincer",
    title: "Project: Two-Way Manual Meat Mincer with Planetary Gearbox",
    category: "projects",
    tags: ["meat", "mincer", "planetary", "gearbox", "solidworks", "cswa", "mechanical", "design", "lewis", "von mises", "fea", "dfm", "peradeniya"],
    content: `Project Title: Two-Way Manual Meat Mincer – Planetary Gearbox
Role: Mechanical Design Project @ University of Peradeniya (June 2026 – July 2026)
Key Metrics:
- Gear Ratio: 4.2 : 1 Epicyclic Planetary Transmission
- Safety Factor: Ns = 2.85 under peak cutting loads
- CAD & Certification: SOLIDWORKS CSWA
- Base: Dual-lever Suction Vacuum Base resisting 150 N overturning moment
- Material Selection: Food-grade Stainless Steel 304 for contact components, low-friction POM Acetal gears.
Description:
Conceived, calculated, and modeled a manually operated two-way meat mincer incorporating a compact epicyclic planetary gearbox for high mechanical advantage.
Applied Lewis gear-tooth bending equations, von Mises failure criteria, and shaft torsion analysis. Fully toleranced and modeled in SOLIDWORKS following Design for Manufacturability (DFM) principles.`
  },
  {
    id: "project-orthosis-brace",
    title: "Project: Universal Mechanical Brace – Adaptive Wedge Orthosis",
    category: "projects",
    tags: ["orthosis", "brace", "knee", "biomechatronics", "fea", "topology", "optimization", "tribology", "solidworks", "3d printing", "pa12-cf"],
    content: `Project Title: Universal Mechanical Brace – Adaptive Wedge Orthosis
Role: Lead Mechanical Designer @ University of Peradeniya (Feb 2026 – March 2026)
Key Metrics:
- Mass Reduction: -34% mass reduction achieved via density-based Topology Optimization
- Flexion Range: Continuous adjustable stops from 0° to 135°
- Peak Load: 1,200 N axial impact capacity
- Materials: PA12 Carbon-Fiber composite (PA12-CF) + Titanium alloy pins
Description:
Engineered an adaptive knee/joint orthotic mechanism utilizing tribological contact wedges to provide adjustable angular resistance and wear reduction.
Validated structural safety via SOLIDWORKS Finite Element Analysis (FEA), ensuring maximum von Mises stresses stay well below 60% yield strength under ambulatory shock loads.`
  },
  {
    id: "project-hdrm-research",
    title: "Research: Higher-Dimensional Radial Model (HDRM)",
    category: "research",
    tags: ["hdrm", "research", "physics", "springer", "quantum", "mathematics", "latex", "python", "numpy", "orcid"],
    content: `Research Title: Higher-Dimensional Radial Model (HDRM) Research
Role: Independent Researcher
Publication Status: Formal manuscript prepared and submitted for peer review to the International Journal of Theoretical Physics (Springer Nature).
ORCID: 0009-0008-2125-4890
Description:
Developed a classical geometric framework investigating structural relationships underlying quantum-mechanical probability distributions.
Formulated higher-dimensional radial representations to model probabilistic particle behavior.
Wrote high-precision Python/NumPy numerical solvers to verify density convergence and topological invariants.`
  },
  {
    id: "project-jpl-middleware",
    title: "Project: JPL IoT Middleware & Real-Time CDC Architecture",
    category: "projects",
    tags: ["jpl", "iot", "middleware", "fastapi", "cdc", "mariadb", "docker", "mydynamica", "python", "backend"],
    content: `Project Title: JPL IoT Middleware & Real-Time CDC Architecture
Role: Technical Consultant @ MyDynamica (Feb 2026 – Apr 2026)
Key Metrics:
- Throughput: 10,000+ sensor messages/second
- Latency: < 25 ms end-to-end ingestion latency
- Architecture: FastAPI asynchronous microservice + Change Data Capture (CDC) with MariaDB binary log streaming
- Deployment: Docker containers on hardened Linux edge gateways
Description:
Architected high-throughput IoT middleware connecting physical sensor arrays with digital facility management systems.
Implemented Change Data Capture (CDC) triggers for zero-loss real-time data replication and provided hardware DFM guidance for PCB noise isolation.`
  },
  {
    id: "project-ezclean",
    title: "Project: ezclean – Open-Source Python Data Hygiene Library",
    category: "projects",
    tags: ["ezclean", "pypi", "python", "package", "open source", "pandas", "data cleaning", "ci/cd"],
    content: `Project Title: ezclean – Open Source Python Package
Role: Creator, Publisher & Maintainer (2026)
Distribution: Published on PyPI (Python Package Index)
Key Metrics:
- Platform: Pure Python 3.9+ with Pandas vectorization
- Test Coverage: > 95% automated test coverage via pytest & GitHub Actions CI/CD
- License: MIT Open Source
Description:
Developed and published ezclean, a lightweight, versatile Python library designed to simplify dataset hygiene, missing value handling, column normalization, and validation pipelines for machine learning workflows.`
  },
  {
    id: "project-model-x",
    title: "Project & Award: Model X – AI OSINT & Socio-Economic Intelligence",
    category: "competitions",
    tags: ["model x", "osint", "ai", "nlp", "spacy", "sentence-bert", "hackathon", "iit", "award", "kmeans"],
    content: `Project Title: Model X – AI OSINT & Socio-Economic Intelligence
Award: Special Award for Technical Design @ Model X AI Hackathon (IIT, 2025)
Technologies: spaCy NER, Sentence-BERT semantic embeddings, K-Means clustering, VADER sentiment analysis, Flask backend.
Description:
Engineered an automated open-source intelligence pipeline combining Named Entity Recognition (NER), dense Sentence-BERT embeddings, and topic clustering to surface emerging socioeconomic trends and risk indicators in real time.`
  },
  {
    id: "competition-datastorm",
    title: "Competition: DataStorm 7.0 – National Finalist & Podium",
    category: "competitions",
    tags: ["datastorm", "datastorm 7.0", "competition", "finalist", "podium", "octave", "analytics", "rotaract", "colombo", "peradeniya"],
    content: `Competition: DataStorm 7.0
Award: National Finalist & Podium Deliberation
Organizers: Rotaract Clubs of University of Moratuwa & University of Colombo, powered by Octave (John Keells Holdings' Advanced Analytics Center of Excellence).
Description:
Sri Lanka's premier advanced analytics and machine learning competition.
Selected as national finalist among hundreds of university and industry analytics teams across the island.
Delivered keynote on-stage pitch defending feature engineering pipelines, gradient-boosted predictive models, and commercial insights before a jury of leading industry data scientists.`
  },
  {
    id: "competition-nexushacks",
    title: "Competition: NexusHacks 2026 – 1st Runner-Up (Agentic AI)",
    category: "competitions",
    tags: ["nexushacks", "nexushacks 2026", "runner up", "agentic ai", "phaser", "kestrel", "hackathon", "peradeniya"],
    content: `Competition: NexusHacks 2026 National Hackathon
Award: 1st Runner-Up / 2nd Place (Agentic AI Track)
Team: Team Kestrel (Dept. of Computer Engineering, University of Peradeniya)
Organizer: Phaser, India (2026)
Description:
Achieved 1st Runner-Up at the national level in the Agentic AI track with an autonomous multi-agent reasoning, task decomposition, and robotic dispatch pipeline.`
  },
  {
    id: "collaborators-credits",
    title: "Team Members, Collaborators & Teammate Credits",
    category: "collaborators",
    tags: ["collaborators", "teammates", "team", "members", "credits", "dakshayini ramanesh", "rashad", "daniel", "shathurshima", "datastorm", "modelx", "wso2", "nexus", "portfolio", "partners"],
    content: `Team Members & Collaborative Credits:
Thilac Ramesh actively values and credits his teammates who co-developed algorithms, collaborated on research, and competed alongside him:
- Dakshayini Ramanesh: Multi-disciplinary research and hackathon collaborator across DataStorm 7.0 (Podium Finalist), Model X Hackathon (Technical Design Award), NexusHacks 2026 (1st Runner-Up Agentic AI), and WSO2 Robotics research.
- Rashad: Autonomous systems and robotics collaborator on NexusHacks 2026 (1st Runner-Up Agentic AI) and WSO2 Robotics research initiatives.
- Daniel: Autonomous mobile robotics research peer working with Thilac on WSO2 Robotics research (Unitree Go2 Quadruped LiDAR SLAM, spatial autonomy & navigation).
- Shathurshima: Machine learning and data science collaborator working with Thilac on DataStorm 7.0 (Podium Finalist) and Model X Hackathon (Special Award for Technical Design).
Each collaborator's card with their direct personal portfolio link, GitHub, and LinkedIn is available in the 'Team & Credits' section of the portfolio.`
  },
  {
    id: "credentials-cswa",
    title: "Certifications: SOLIDWORKS CSWA, CSWA-AM & CSWA-SD",
    category: "credentials",
    tags: ["cswa", "cswa-am", "cswa-sd", "solidworks", "additive manufacturing", "sustainable design", "certification", "credential", "dassault", "cad", "mechanical design", "3d printing"],
    content: `Dassault Systèmes Official Credentials:
1. Certified SOLIDWORKS Associate (CSWA) in Mechanical Design:
   - Parametric 3D solid part modeling, complex assembly mates, and kinematic constraints
   - Applied engineering drawing creation, GD&T standards, and BOM drafting
   - Mass properties, center of gravity, and material density verification
2. Certified SOLIDWORKS Associate in Additive Manufacturing (CSWA-AM):
   - Design for Additive Manufacturing (DFAM) methodologies
   - FDM, SLA, and SLS 3D printing technologies and material properties
   - Slicing parameters, infill topologies, support structure optimization, and post-processing
3. Certified SOLIDWORKS Associate in Sustainable Design (CSWA-SD):
   - Environmental Life Cycle Assessment (LCA) and eco-auditing
   - Carbon footprint, air acidification, water eutrophication, and energy consumption metrics
   - Sustainable material selection, light-weighting, and end-of-life circular lifecycle strategies.
Issuing Authority: Dassault Systèmes
Status: All 3 credentials verified & authenticated.`
  },
  {
    id: "education-experience",
    title: "Education & Career Milestones",
    category: "milestones",
    tags: ["education", "experience", "journey", "timeline", "peradeniya", "wso2", "mydynamica", "itdlh"],
    content: `Education:
- University of Peradeniya: B.Sc. Mechanical Engineering (Hons), 2024 – Present.
  Focus: Robotics, kinematics, FEA stress theory, biomechatronics, control systems.
Work Experience:
- WSO2 Research (Jun 2026 – Present): Robotics Research Team Member.
  Leading Unitree Go2 EDU quadruped LiDAR SLAM, BIM integration, and ACSAR-E autonomous patrol.
- MyDynamica (Feb 2026 – Apr 2026): Technical Consultant.
  Architected JPL IoT Middleware using FastAPI, CDC MariaDB streaming, and DFM hardware hardening.
- ITDLH Computer Resource Center (2023 – 2024): ICT Technician Trainee in Point Pedro, Sri Lanka.
  Troubleshooting hardware rigs, enterprise network switches, and developing early obsession with mechanical-electronic integration.`
  },
  {
    id: "skills-matrix",
    title: "Comprehensive Technical Skills Matrix",
    category: "skills",
    tags: ["skills", "technologies", "tools", "stack", "ros2", "solidworks", "python", "cpp", "slam", "fea"],
    content: `Technical Skills Matrix of Thilac Ramesh:
1. Robotics & Autonomous Systems:
   - Frameworks: ROS 2 (Robot Operating System), Nav2, Unitree Go2 EDU SDK, MuJoCo, Gazebo
   - Navigation & Perception: LiDAR SLAM (FAST-LIO2, Cartographer), RealSense Depth Cameras, OpenCV, Point Cloud Processing, Kinematics, ACSAR-E Framework
2. Mechanical CAD & CAE:
   - CAD Modeling: SOLIDWORKS (CSWA, CSWA-AM, CSWA-SD Certified), Parametric Assembly, GD&T, Drafting, DFAM
   - Simulation & CAE: Finite Element Analysis (FEA), Topology Optimization, von Mises Yield Analysis, Lewis Gear Tooth Stress Analysis, DFM (Design for Manufacturing)
   - Prototyping: FDM 3D Printing (PA12-CF, PLA, PETG), Rapid Mechanism Prototyping
3. Software, AI & IoT:
   - Programming: Python, C++, Modern JavaScript, SQL, LaTeX
   - Backend & IoT: FastAPI, MariaDB, Change Data Capture (CDC), Docker, Linux, Microcontrollers
   - Data & ML: ezclean (PyPI), spaCy NER, Sentence-BERT, Scikit-Learn, Pandas, NumPy, VADER`
  },
  {
    id: "contact-details",
    title: "Contact Information & Availability",
    category: "contact",
    tags: ["contact", "email", "hire", "collaborate", "social", "github", "linkedin", "orcid", "resume"],
    content: `How to reach or collaborate with Thilac Ramesh:
- Research & Project Inquiries: Open to collaboration on Autonomous Robotics, Quadruped SLAM, Mechatronics, and Mechanical CAE projects.
- LinkedIn: https://www.linkedin.com/in/thilac-r-077a85285/
- GitHub: https://github.com/Thilac01
- ORCID: 0009-0008-2125-4890
- Resume: Available for direct download via the 'Download CV (PDF)' button on the portfolio.
- Main Portfolio Location: University of Peradeniya / Colombo / Hybrid.`
  }
];

/**
 * Client-Side Semantic Retrieval Engine (RAG)
 */
class PortfolioRAG {
  constructor(knowledgeBase = PORTFOLIO_KNOWLEDGE_BASE) {
    this.kb = knowledgeBase;
    this.stopWords = new Set([
      "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "with", "by", "about",
      "of", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
      "do", "does", "did", "can", "could", "will", "would", "should", "me", "my", "you",
      "your", "what", "which", "who", "whom", "this", "that", "these", "those", "how",
      "tell", "show", "give", "please", "know", "information", "details"
    ]);

    // Synonyms and concept expanders for high accuracy retrieval
    this.synonyms = {
      "robot": ["quadruped", "unitree", "slam", "ros2", "nav2", "lidar", "autonomous", "acsar-e"],
      "dog": ["quadruped", "unitree", "go2"],
      "cad": ["solidworks", "cswa", "gearbox", "orthosis", "fea", "mechanical", "design"],
      "experience": ["wso2", "mydynamica", "itdlh", "work", "job", "career", "timeline"],
      "education": ["peradeniya", "degree", "university", "faculty", "b.sc"],
      "paper": ["hdrm", "research", "physics", "springer", "manuscript", "journal"],
      "award": ["datastorm", "nexushacks", "model", "hackathon", "runner", "podium", "trophy", "finalist"],
      "win": ["datastorm", "nexushacks", "model", "award", "finalist", "runner"],
      "package": ["ezclean", "pypi", "python", "library"],
      "cv": ["resume", "download", "contact", "bio", "pdf"],
      "contact": ["email", "github", "linkedin", "hire", "collaborate"]
    };
  }

  tokenize(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter(token => token.length > 1 && !this.stopWords.has(token));
  }

  expandTokens(tokens) {
    const expanded = new Set(tokens);
    tokens.forEach(token => {
      if (this.synonyms[token]) {
        this.synonyms[token].forEach(s => expanded.add(s));
      }
      for (const [key, synList] of Object.entries(this.synonyms)) {
        if (synList.includes(token)) {
          expanded.add(key);
        }
      }
    });
    return Array.from(expanded);
  }

  /**
   * Search knowledge base and score chunks using weighted token overlap
   */
  retrieveContext(query, topK = 4) {
    const rawTokens = this.tokenize(query);
    const searchTokens = this.expandTokens(rawTokens);

    if (searchTokens.length === 0) {
      // Fallback: Return overview and skills
      return this.kb.filter(item => item.id === "bio-overview" || item.id === "skills-matrix");
    }

    const scoredItems = this.kb.map(item => {
      let score = 0;
      const lowerTitle = item.title.toLowerCase();
      const lowerContent = item.content.toLowerCase();
      const tags = item.tags || [];

      searchTokens.forEach(token => {
        // High score for matching title
        if (lowerTitle.includes(token)) {
          score += 6;
        }
        // Very high score for matching curated tags
        if (tags.some(t => t.includes(token) || token.includes(t))) {
          score += 5;
        }
        // Score for keyword match in body
        if (lowerContent.includes(token)) {
          score += 2;
        }
      });

      return { ...item, score };
    });

    // Sort by descending score
    scoredItems.sort((a, b) => b.score - a.score);

    // Filter items with meaningful relevance
    const relevant = scoredItems.filter(item => item.score > 0).slice(0, topK);

    // Always ensure at least the bio overview is provided if nothing matched
    if (relevant.length === 0) {
      return this.kb.filter(item => item.id === "bio-overview");
    }

    return relevant;
  }

  /**
   * Builds the strict system prompt incorporating retrieved context
   */
  buildSystemInstruction(retrievedChunks) {
    const contextText = retrievedChunks
      .map((c, idx) => `[Source ${idx + 1}: ${c.title}]\n${c.content}`)
      .join("\n\n---\n\n");

    return `You are the official Chatbot for Thilac Ramesh's engineering portfolio.

YOUR SOLE MISSION & STRICT BOUNDARIES:
1. You ONLY answer questions about Thilac Ramesh: his robotics research (Unitree Go2 EDU quadruped, SLAM, ROS 2, Nav2, MuJoCo), mechanical engineering projects (Planetary Gearbox, Adaptive Orthosis, CSWA CAD), software/IoT systems (JPL Middleware, ezclean, Model X), competitions (DataStorm 7.0 finalist, NexusHacks 2026 1st Runner-Up, Model X Technical Design Award), academic papers (HDRM under review at Springer Nature), skills, experience, and contact info.
2. STRICT NEGATIVE CONSTRAINT: You MUST NEVER answer general questions unrelated to Thilac Ramesh. If a user asks about general trivia, recipes, movies, unrelated coding tasks, homework, sports, politics, weather, or anything not about Thilac Ramesh, you MUST politely and firmly decline.
   Decline template: "I am the Chatbot for Thilac Ramesh's portfolio. I can only answer questions regarding Thilac's robotics research, engineering projects, competitions, and technical background. Please feel free to ask about his work or skills."
3. ANSWER ONLY THE ASKED QUESTION:
   - Give ONLY the direct, precise answer to what the user explicitly asked.
   - Do NOT add unasked extra details, unsolicited project summaries, background histories, or promotional filler.
   - Do NOT add unsolicited suggestions, follow-up links, or unprompted contact recommendations.
   - Keep answers crisp, straightforward, and concise.
4. Ground your answers strictly in the Verified Grounding Context provided below. Do not fabricate facts.

===========================================
VERIFIED GROUNDING CONTEXT FROM PORTFOLIO:
===========================================
${contextText}
===========================================`;
  }

  /**
   * High-fidelity smart semantic fallback engine
   * Used when offline, when external LLM endpoints are unreachable or on static deployment
   */
  generateSmartResponse(query, retrievedChunks = []) {
    const q = (query || "").toLowerCase();

    // Check for off-topic queries
    const isOffTopic = (
      q.includes("weather") || q.includes("recipe") || q.includes("cook") ||
      q.includes("movie") || q.includes("song") || q.includes("joke") ||
      q.includes("president") || q.includes("capital of") || q.includes("homework") ||
      (q.startsWith("who is ") && !q.includes("thilac") && !q.includes("ramesh") && !q.includes("dakshayini") && !q.includes("rashad") && !q.includes("daniel") && !q.includes("shathurshima"))
    );

    if (isOffTopic && !q.includes("thilac") && !q.includes("project") && !q.includes("robot")) {
      return "I am the official Chatbot for Thilac Ramesh's engineering portfolio. I can only answer questions regarding Thilac's robotics research, engineering projects, competitions, and technical background. Please feel free to ask about his work or skills.";
    }

    // Contact / Social / CV queries
    if (q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("hire") || q.includes("touch") || q.includes("message")) {
      return "You can reach out to Thilac Ramesh through the following channels:\n\n- **Email**: [thilacramesh@gmail.com](mailto:thilacramesh@gmail.com)\n- **LinkedIn**: [thilac-r-077a85285](https://www.linkedin.com/in/thilac-r-077a85285/)\n- **GitHub**: [@Thilac01](https://github.com/Thilac01)\n- **ORCID**: [0009-0008-2125-4890](https://orcid.org/0009-0008-2125-4890)\n- **Contact Form**: You can also use the live Send a Message form located at the bottom of the home page.";
    }

    if (q.includes("resume") || q.includes("cv") || q.includes("curriculum vitae") || q.includes("download cv")) {
      return "Thilac Ramesh's latest Curriculum Vitae is available for direct download on this portfolio via the **Download CV (PDF)** button, or directly via [CV.pdf](CV.pdf).";
    }

    // Certifications / CSWA
    if (q.includes("certification") || q.includes("certificate") || q.includes("cswa") || q.includes("dassault") || q.includes("credential")) {
      return "Thilac holds three authenticated credentials from **Dassault Systèmes**:\n\n1. **Certified SOLIDWORKS Associate (CSWA)** – Mechanical Design\n2. **CSWA – Additive Manufacturing (CSWA-AM)** – 3D printing topologies, slicing parameters, and DFAM methodologies\n3. **CSWA – Sustainable Design (CSWA-SD)** – Life Cycle Assessment (LCA) and eco-auditing metrics\n\nAll three certifications validate his expertise in parametric solid modeling, GD&T, and sustainable mechanical design.";
    }

    // Unitree / Quadruped / SLAM / WSO2
    if (q.includes("unitree") || q.includes("quadruped") || q.includes("dog") || q.includes("slam") || q.includes("wso2") || (q.includes("robot") && !q.includes("mincer"))) {
      return "Thilac is currently a **Robotics Research Team Member at WSO2 Research** (June 2026 – Present), developing autonomous navigation for the **Unitree Go2 EDU Quadruped Robot**:\n\n- **Drift Accuracy**: < 1.5 cm drift in localization.\n- **Sensors**: 4D LiDAR + RealSense Depth Camera + IMU with multi-sensor spatial extrinsics calibration.\n- **Control Frequency**: 30 Hz real-time processing loop.\n- **Architecture**: ROS 2, Nav2, FAST-LIO2 LiDAR SLAM, MuJoCo simulation, and ACSAR-E autonomous patrol dispatch.\n- **BIM Integration**: Converts architectural IFC/Revit digital twins into 2.5D elevation costmaps for automated facility patrol.";
    }

    // Planetary Gearbox / Meat Mincer
    if (q.includes("mincer") || q.includes("planetary") || q.includes("gearbox") || q.includes("meat")) {
      return "The **Two-Way Manual Meat Mincer with Planetary Gearbox** is a mechanical design project engineered at University of Peradeniya:\n\n- **Transmission**: 4.2 : 1 Epicyclic Planetary Gearbox for high mechanical advantage.\n- **Safety Factor**: Ns = 2.85 under peak cutting resistance.\n- **Structural Base**: Dual-lever Suction Vacuum Base resisting up to 150 N overturning moment.\n- **Materials**: Food-grade Stainless Steel 304 for contact components and low-friction POM Acetal gears.\n- **Design Rigor**: Modeled and analyzed in SOLIDWORKS using Lewis gear-tooth bending equations and von Mises failure criteria.";
    }

    // Orthosis / Knee Brace
    if (q.includes("brace") || q.includes("orthosis") || q.includes("knee") || q.includes("wedge")) {
      return "The **Universal Mechanical Brace (Adaptive Wedge Orthosis)** is an ergonomic biomechatronic joint mechanism:\n\n- **Topology Optimization**: Density-based optimization achieved a **34% mass reduction**.\n- **Range of Motion**: Continuous adjustable flexion stops from 0° to 135°.\n- **Impact Rating**: 1,200 N axial shock load resistance.\n- **Materials**: PA12 Carbon-Fiber composite (PA12-CF) with Titanium alloy pins.\n- **FEA**: Validated in SOLIDWORKS FEA, ensuring peak von Mises stress remains under 60% of material yield strength.";
    }

    // HDRM Research / Paper
    if (q.includes("hdrm") || q.includes("paper") || q.includes("springer") || q.includes("publication") || q.includes("radial")) {
      return "Thilac authored the **Higher-Dimensional Radial Model (HDRM)** theoretical physics research:\n\n- **Status**: Manuscript submitted and currently under peer review at the **International Journal of Theoretical Physics (Springer Nature)**.\n- **Subject**: Formulates a classical geometric framework investigating structural foundations beneath quantum-mechanical probability distributions.\n- **Implementation**: High-precision Python/NumPy numerical solvers for density convergence and topological invariants.\n- **Author ORCID**: [0009-0008-2125-4890](https://orcid.org/0009-0008-2125-4890).";
    }

    // JPL Middleware / IoT
    if (q.includes("jpl") || q.includes("iot") || q.includes("middleware") || q.includes("cdc") || q.includes("mydynamica")) {
      return "The **JPL IoT Middleware & Real-Time CDC Architecture** was developed by Thilac as a Technical Consultant for MyDynamica:\n\n- **Throughput**: 10,000+ sensor messages/second.\n- **Latency**: < 25 ms end-to-end ingestion latency.\n- **Stack**: FastAPI asynchronous microservices + Change Data Capture (CDC) streaming MariaDB binary logs.\n- **Deployment**: Docker containers deployed on hardened industrial Linux edge gateways.";
    }

    // ezclean / Python package
    if (q.includes("ezclean") || q.includes("pypi") || q.includes("package") || q.includes("library")) {
      return "**ezclean** is an open-source Python library published and maintained by Thilac on PyPI (Python Package Index):\n\n- **Purpose**: Streamlines automated dataset hygiene, missing value imputation, column normalization, and validation for machine learning workflows.\n- **Quality**: > 95% automated test coverage with GitHub Actions CI/CD.\n- **License**: MIT Open Source.";
    }

    // Competitions / Awards / Hackathons
    if (q.includes("competition") || q.includes("award") || q.includes("hackathon") || q.includes("datastorm") || q.includes("nexushacks") || q.includes("model x") || q.includes("winner") || q.includes("runner")) {
      return "Thilac's key competitive achievements and hackathon awards include:\n\n1. **DataStorm 7.0** – **National Finalist & Podium Deliberation**: Sri Lanka's premier analytics competition powered by Octave (John Keells Holdings) and Rotaract Clubs of Moratuwa & Colombo.\n2. **NexusHacks 2026** – **1st Runner-Up (Agentic AI Track)**: National Hackathon organized by Phaser, India with Team Kestrel (University of Peradeniya).\n3. **Model X Hackathon (IIT 2025)** – **Special Award for Technical Design**: Built an OSINT socioeconomic intelligence engine utilizing spaCy NER, Sentence-BERT, and K-Means clustering.";
    }

    // Collaborators
    if (q.includes("collaborat") || q.includes("team") || q.includes("dakshayini") || q.includes("rashad") || q.includes("daniel") || q.includes("shathurshima")) {
      return "Thilac Ramesh works collaboratively and credits his teammates across multiple initiatives:\n\n- **Dakshayini Ramanesh**: Research & hackathon partner across DataStorm 7.0 (Podium Finalist), Model X (Technical Award), NexusHacks 2026 (1st Runner-Up), and WSO2 Robotics.\n- **Rashad**: Robotics collaborator on NexusHacks 2026 and WSO2 autonomous systems.\n- **Daniel**: Mobile robotics research peer on Unitree Go2 LiDAR SLAM @ WSO2.\n- **Shathurshima**: Data science collaborator on DataStorm 7.0 and Model X.\n\nIndividual portfolio links and social profiles are available in the **Team & Credits** section.";
    }

    // Skills
    if (q.includes("skill") || q.includes("technolog") || q.includes("stack") || q.includes("software") || q.includes("programming") || q.includes("python") || q.includes("ros")) {
      return "Thilac's interdisciplinary technical skills span:\n\n- **Robotics & Autonomy**: ROS 2, Nav2, LiDAR SLAM (FAST-LIO2, Cartographer), Unitree Go2 EDU SDK, RealSense Depth Cameras, MuJoCo, Gazebo, ACSAR-E.\n- **Mechanical CAD & CAE**: SOLIDWORKS (CSWA, CSWA-AM, CSWA-SD), FEA, Topology Optimization, GD&T, DFM, FDM 3D Printing (PA12-CF).\n- **Software & Systems**: Python, C++, Modern JavaScript, FastAPI, Docker, MariaDB CDC, Linux, Scikit-Learn, Pandas, LaTeX.";
    }

    // Top retrieved chunk fallback
    if (retrievedChunks && retrievedChunks.length > 0) {
      const topChunk = retrievedChunks[0];
      return `**${topChunk.title.replace("Project: ", "").replace("Competition: ", "")}**\n\n${topChunk.content.split("\n").slice(0, 8).join("\n")}\n\n*Feel free to ask for more specific technical details, sensor configurations, or metrics!*`;
    }

    return "Thilac Ramesh is a Mechanical Engineering undergraduate at the **University of Peradeniya**, Sri Lanka, specializing in **Autonomous Robotics, LiDAR SLAM, ROS 2, and SOLIDWORKS Machine Design**.\n\nHe is currently a Robotics Research Team Member at **WSO2 Research**, developing autonomous patrol and BIM-integrated navigation with the **Unitree Go2 EDU quadruped platform**. Feel free to ask about his projects, certifications, research papers, or competitions!";
  }
}

// Global instance for the application
if (typeof window !== "undefined") {
  window.portfolioRAG = new PortfolioRAG();
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PortfolioRAG, PORTFOLIO_KNOWLEDGE_BASE };
}
