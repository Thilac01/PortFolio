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
He is a Certified SOLIDWORKS Associate (CSWA) in Mechanical Design.
His engineering philosophy combines theoretical mechanics, rigorous CAE/FEA simulation, and high-performance embedded systems to build resilient autonomous machines.
Contact & Links:
- LinkedIn: Available on portfolio header
- GitHub: https://github.com/thilacramesh
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
    id: "credentials-cswa",
    title: "Certification: Certified SOLIDWORKS Associate (CSWA)",
    category: "credentials",
    tags: ["cswa", "solidworks", "certification", "credential", "dassault", "cad", "mechanical design"],
    content: `Credential: Certified SOLIDWORKS Associate (CSWA) in Mechanical Design
Issuing Authority: Dassault Systèmes
Status: Verified Official Credential
Skills Certified:
- Parametric 3D solid modeling and part assembly
- Applied engineering drawing creation and GD&T standards
- Mass properties calculations, material density assignment, and center of gravity validation
- Engineering design problem solving under strict examination standards.`
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
   - CAD Modeling: SOLIDWORKS (CSWA Certified), Parametric Assembly, GD&T, Drafting
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
- GitHub: https://github.com/thilacramesh
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
}

// Global instance for the application
if (typeof window !== "undefined") {
  window.portfolioRAG = new PortfolioRAG();
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PortfolioRAG, PORTFOLIO_KNOWLEDGE_BASE };
}
