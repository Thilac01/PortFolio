/**
 * Portfolio Data Store - Thilac Ramesh
 * Includes initial projects from CV, with local storage fallback and persistence.
 */

const DEFAULT_PROJECTS = [
  {
    id: "unitree-go2-slam",
    title: "Unitree Go2 Quadruped SLAM & BIM-Integrated Navigation",
    category: "robotics",
    categoryLabel: "Robotics & Autonomous Systems",
    role: "Robotics Research Team Member @ WSO2",
    companyLogo: "assets/wso2-logo.png",
    companyName: "WSO2",
    date: "Jun 2026 – Present",
    tagline: "Autonomous indoor navigation, LiDAR SLAM, and BIM digital-twin patrol on Unitree Go2 EDU quadruped.",
    description: "Developing SLAM optimization and Building Information Modeling (BIM)-integrated navigation pipelines for autonomous operation of the Unitree Go2 EDU quadruped robotic platform. Prototyping policy-based autonomous patrol capabilities within the ACSAR-E framework, synthesizing real-time multi-sensor point clouds, dynamic obstacle avoidance, and precise localization.",
    metrics: [
      { label: "Platform", value: "Unitree Go2 EDU" },
      { label: "Localization Accuracy", value: "< 1.5 cm drift" },
      { label: "Sensors", value: "4D LiDAR + RealSense Depth" },
      { label: "Framerate", value: "30 Hz Real-time" }
    ],
    tags: ["ROS 2", "Unitree Go2 EDU SDK", "SLAM", "Nav2", "MuJoCo", "Python", "C++", "ACSAR-E"],
    heroImage: "assets/schematic-quadruped.svg",
    gallery: [
      "assets/schematic-quadruped.svg",
      "assets/schematic-robotic-arm.svg"
    ],
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ", // Embeddable video link or demo
    pdfUrl: "assets/CV.pdf",
    liveUrl: "https://github.com/thilacramesh",
    workflow: [
      {
        id: "step-1",
        title: "Sensor Calibration",
        desc: "LiDAR, RealSense depth camera, and IMU spatial extrinsics alignment & time synchronization.",
        status: "completed",
        type: "hardware"
      },
      {
        id: "step-2",
        title: "Point Cloud Filtering & Odometry",
        desc: "FAST-LIO2 / Cartographer algorithm tuning for quadruped dynamic gait vibration dampening.",
        status: "completed",
        type: "algorithmic"
      },
      {
        id: "step-3",
        title: "BIM Semantic Layer Mapping",
        desc: "Conversion of architectural IFC/Revit digital twin models into 2.5D costmaps & elevation grids.",
        status: "active",
        type: "integration"
      },
      {
        id: "step-4",
        title: "Nav2 & TEB Local Planner",
        desc: "Custom trajectory evaluation, dynamic obstacle re-routing, and quadruped kinematic constraint solver.",
        status: "active",
        type: "control"
      },
      {
        id: "step-5",
        title: "ACSAR-E Autonomous Patrol",
        desc: "Policy-based mission dispatch, automated waypoint patrolling, and anomaly reporting pipeline.",
        status: "upcoming",
        type: "deployment"
      }
    ]
  },
  {
    id: "meat-mincer-planetary",
    title: "Two-Way Manual Meat Mincer – Planetary Gearbox",
    category: "mechanical",
    categoryLabel: "Mechanical Design & CAE",
    role: "Mechanical Design Project @ Univ. of Peradeniya",
    companyLogo: "assets/pera-logo.png",
    companyName: "University of Peradeniya",
    date: "June 2026 – July 2026",
    tagline: "High-torque compact meat mincer with integrated planetary gearbox and Lewis tooth bending optimization.",
    description: "Conceived, calculated, and modeled a manually operated two-way meat mincer incorporating an epicyclic planetary gearbox for high mechanical advantage in a compact footprint. Performed rigorous engineering calculations using Lewis gear-tooth bending equations, von Mises failure theory, and shaft torsion analysis, fully modeled and toleranced in SOLIDWORKS.",
    metrics: [
      { label: "Gear Ratio", value: "4.2 : 1 Transmission" },
      { label: "Safety Factor", value: "Ns = 2.85" },
      { label: "CAD System", value: "SOLIDWORKS CSWA" },
      { label: "Mounting", value: "Suction Vacuum Base" }
    ],
    tags: ["SOLIDWORKS", "CSWA", "Gear Design", "Planetary Gearbox", "FEA", "von Mises", "DFM"],
    heroImage: "assets/schematic-planetary.svg",
    gallery: [
      "Meat/1.png",
      "assets/schematic-planetary.svg"
    ],
    videoUrl: "",
    pdfUrl: "assets/CV.pdf",
    liveUrl: "",
    workflow: [
      {
        id: "step-1",
        title: "Torque & Kinematic Sizing",
        desc: "Determined human crank torque input (25 Nm) and calculated required cutter torque (105 Nm).",
        status: "completed",
        type: "calculation"
      },
      {
        id: "step-2",
        title: "Lewis Bending & Contact Stress",
        desc: "Computed bending stresses on sun (Zs=20) and planet gears (Zp=20) to satisfy fatigue criteria.",
        status: "completed",
        type: "analysis"
      },
      {
        id: "step-3",
        title: "Parametric SOLIDWORKS CAD",
        desc: "Detailed part geometry, auger feed flute, cutter knife, ring gear, and ergonomic handle assembly.",
        status: "completed",
        type: "cad"
      },
      {
        id: "step-4",
        title: "DFM & Material Selection",
        desc: "Food-grade stainless steel 304 for wet parts, POM acetal gears for low friction and noise.",
        status: "completed",
        type: "manufacturing"
      },
      {
        id: "step-5",
        title: "Suction Mount Stability Test",
        desc: "Base vacuum suction pad analysis to resist 150 N overturning overturning moment on bench surfaces.",
        status: "completed",
        type: "validation"
      }
    ]
  },
  {
    id: "orthosis-brace",
    title: "Universal Mechanical Brace – Adaptive Wedge Orthosis",
    category: "mechanical",
    categoryLabel: "Mechanical Design & Biomechatronics",
    role: "Lead Mechanical Designer @ Univ. of Peradeniya",
    companyLogo: "assets/pera-logo.png",
    companyName: "University of Peradeniya",
    date: "Feb 2026 – March 2026",
    tagline: "Topology-optimized joint brace with adaptive tribological wedge hinge for -34% mass reduction.",
    description: "Engineered an adaptive knee/joint orthotic mechanism utilizing tribological contact principles to provide adjustable angular resistance and wear reduction. Applied SOLIDWORKS Finite Element Analysis (FEA) and topology optimization to minimize structural weight while maintaining factor of safety under peak ambulatory shock loads.",
    metrics: [
      { label: "Mass Reduction", value: "-34% via Topology Opt." },
      { label: "Flexion Range", value: "0° – 135° Continuous" },
      { label: "Max Load", value: "1,200 N Axial" },
      { label: "Material", value: "PA12 CF + Ti-Alloy" }
    ],
    tags: ["FEA", "Topology Optimization", "Tribology", "SOLIDWORKS", "Biomechanics", "3D Printing"],
    heroImage: "assets/schematic-orthosis.svg",
    gallery: [
      "assets/schematic-orthosis.svg"
    ],
    videoUrl: "",
    pdfUrl: "assets/CV.pdf",
    liveUrl: "",
    workflow: [
      {
        id: "step-1",
        title: "Anatomical Kinematics Profiling",
        desc: "Mapped polycentric knee instantaneous center of rotation (ICR) during natural gait phases.",
        status: "completed",
        type: "research"
      },
      {
        id: "step-2",
        title: "Tribological Wedge Mechanism",
        desc: "Designed self-dampening sliding wedges with engineered friction coefficients for variable flexion stops.",
        status: "completed",
        type: "cad"
      },
      {
        id: "step-3",
        title: "Topology Optimization Loop",
        desc: "Removed non-load-bearing volume from structural uprights using density-based FEA iterations.",
        status: "completed",
        type: "analysis"
      },
      {
        id: "step-4",
        title: "von Mises Yield Verification",
        desc: "Validated maximum stresses remain well below 60% yield stress under multi-axial impact loads.",
        status: "completed",
        type: "analysis"
      },
      {
        id: "step-5",
        title: "FDM Carbon-Fiber Prototyping",
        desc: "3D printed prototype with PA12-CF filament to verify ergonomics, strap points, and joint play.",
        status: "completed",
        type: "manufacturing"
      }
    ]
  },
  {
    id: "hdrm-research",
    title: "Higher-Dimensional Radial Model (HDRM) Research",
    category: "research",
    categoryLabel: "Theoretical Physics & Computation",
    role: "Independent Researcher (Manuscript Under Review)",
    date: "Apr 2026",
    tagline: "Geometric framework formulating higher-dimensional radial representations for quantum distributions.",
    description: "Developed a classical geometric framework investigating structural relationships underlying quantum-mechanical probability distributions. Formulated higher-dimensional radial representations to model probabilistic particle behavior. Prepared and submitted formal research manuscript to the International Journal of Theoretical Physics (Springer Nature).",
    metrics: [
      { label: "Status", value: "Under Review" },
      { label: "Target Journal", value: "Int. Journal of Theoretical Physics" },
      { label: "Publisher", value: "Springer Nature" },
      { label: "Framework", value: "Geometric Radial Projection" }
    ],
    tags: ["Theoretical Physics", "Quantum Mechanics", "Higher-Dimensional Geometry", "LaTeX", "Python", "NumPy"],
    heroImage: "assets/schematic-robotic-arm.svg",
    gallery: [
      "assets/schematic-robotic-arm.svg"
    ],
    videoUrl: "",
    pdfUrl: "assets/CV.pdf",
    liveUrl: "https://orcid.org/0009-0008-2125-4890",
    workflow: [
      {
        id: "step-1",
        title: "Radial Symmetry Formulation",
        desc: "Derived radial projection equations extending classical Euclidean space into multi-dimensional probability fields.",
        status: "completed",
        type: "mathematics"
      },
      {
        id: "step-2",
        title: "Computational Verification",
        desc: "Wrote high-precision Python numerical solvers to test density convergence and topological invariants.",
        status: "completed",
        type: "computation"
      },
      {
        id: "step-3",
        title: "Manuscript Typesetting",
        desc: "Drafted academic paper following Springer Nature LaTeX standards, theorems, and vector illustrations.",
        status: "completed",
        type: "documentation"
      },
      {
        id: "step-4",
        title: "Peer-Review Submission",
        desc: "Submitted to International Journal of Theoretical Physics (Springer Nature) for peer appraisal.",
        status: "active",
        type: "peer-review"
      }
    ]
  },
  {
    id: "jpl-iot-middleware",
    title: "JPL IoT Middleware & Real-Time CDC Architecture",
    category: "software",
    categoryLabel: "IoT Systems & Backend Engineering",
    role: "Technical Consultant @ MyDynamica",
    companyLogo: "assets/mydynamica-logo.png",
    companyName: "MyDynamica",
    date: "Feb 2026 – Apr 2026",
    tagline: "Resilient high-throughput IoT middleware using FastAPI, Change Data Capture (CDC), and hardware sync.",
    description: "Architected the JPL IoT Middleware using FastAPI to connect physical sensor arrays with digital facility management interfaces. Built a resilient backend incorporating Change Data Capture (CDC) and read replicas for sub-second synchronization, security automation, and low-latency hardware-software communication with comprehensive DFM guidance.",
    metrics: [
      { label: "Throughput", value: "10,000+ msgs/sec" },
      { label: "Latency", value: "< 25 ms E2E" },
      { label: "Architecture", value: "FastAPI + CDC MariaDB" },
      { label: "Sync Mode", value: "Real-time Binary Log Stream" }
    ],
    tags: ["FastAPI", "Python", "MariaDB", "CDC", "Docker", "IoT Middleware", "DFM", "Linux"],
    heroImage: "assets/schematic-quadruped.svg",
    gallery: [
      "assets/schematic-quadruped.svg"
    ],
    videoUrl: "",
    pdfUrl: "assets/CV.pdf",
    liveUrl: "https://github.com/thilacramesh",
    workflow: [
      {
        id: "step-1",
        title: "Hardware Telemetry Protocol",
        desc: "Defined compact binary & JSON payload schema for microcontrollers and edge gateways.",
        status: "completed",
        type: "protocol"
      },
      {
        id: "step-2",
        title: "FastAPI Ingress Engine",
        desc: "Built non-blocking asynchronous event routers capable of high concurrency telemetry intake.",
        status: "completed",
        type: "backend"
      },
      {
        id: "step-3",
        title: "Change Data Capture (CDC)",
        desc: "Implemented database replication pipelines utilizing binary log triggers for zero-loss synchronization.",
        status: "completed",
        type: "database"
      },
      {
        id: "step-4",
        title: "DFM & Hardware Hardening",
        desc: "Provided guidance on microcontroller PCB layout, noise isolation, and fail-safe firmware states.",
        status: "completed",
        type: "hardware"
      }
    ]
  },
  {
    id: "ezclean-python",
    title: "ezclean – Open Source Python Package",
    category: "software",
    categoryLabel: "Software Engineering & Open Source",
    role: "Publisher & Maintainer",
    date: "2026",
    tagline: "Lightweight and versatile Python software library published on PyPI for automated data cleaning.",
    description: "Developed, published, and maintained ezclean, an open-source Python library designed to simplify dataset hygiene, missing value handling, column normalization, and validation pipelines for machine learning workflows. Distributed publicly with automated test coverage and documentation.",
    metrics: [
      { label: "Distribution", value: "PyPI Package" },
      { label: "Language", value: "Pure Python 3.9+" },
      { label: "Test Coverage", value: "> 95%" },
      { label: "License", value: "MIT Open Source" }
    ],
    tags: ["Python", "PyPI", "Package Development", "Pandas", "CI/CD", "Open Source"],
    heroImage: "assets/schematic-robotic-arm.svg",
    gallery: [
      "assets/schematic-robotic-arm.svg"
    ],
    videoUrl: "",
    pdfUrl: "assets/CV.pdf",
    liveUrl: "https://github.com/thilacramesh",
    workflow: [
      {
        id: "step-1",
        title: "Library Architecture & API",
        desc: "Designed fluent chaining interface for data cleaning tasks with zero unnecessary bloat.",
        status: "completed",
        type: "architecture"
      },
      {
        id: "step-2",
        title: "Core Vectorized Transformers",
        desc: "Implemented string cleaning, outlier rejection, datetime standardization, and dtype casting.",
        status: "completed",
        type: "code"
      },
      {
        id: "step-3",
        title: "Pytest Suite & GitHub Actions",
        desc: "Automated regression testing across Python 3.9 through 3.12 versions.",
        status: "completed",
        type: "qa"
      },
      {
        id: "step-4",
        title: "PyPI Publishing & Release",
        desc: "Generated wheel distributions and published live package to the Python Package Index.",
        status: "completed",
        type: "release"
      }
    ]
  },
  {
    id: "model-x-ai",
    title: "Model X – AI OSINT & Socio-Economic Intelligence",
    category: "software",
    categoryLabel: "Artificial Intelligence & NLP",
    role: "Special Award for Technical Design @ Model X Hackathon (IIT)",
    date: "2025",
    tagline: "AI-driven OSINT intelligence platform utilizing spaCy NER, Sentence-BERT, and VADER sentiment clustering.",
    description: "Awarded Special Award for Technical Design at the Model X AI Hackathon. Engineered an automated intelligence pipeline combining Named Entity Recognition (NER), semantic Sentence-BERT embeddings, K-Means topic clustering, and VADER sentiment scoring to surface emerging socioeconomic trends and risk indicators in real time.",
    metrics: [
      { label: "Award", value: "Special Award for Tech Design" },
      { label: "NLP Models", value: "spaCy + Sentence-BERT" },
      { label: "Clustering", value: "Dynamic K-Means + TF-IDF" },
      { label: "Backend", value: "Flask + Multi-Threaded Workers" }
    ],
    tags: ["spaCy", "Sentence-BERT", "Machine Learning", "Flask", "VADER", "NLP", "Scikit-Learn"],
    heroImage: "assets/schematic-quadruped.svg",
    gallery: [
      "assets/schematic-quadruped.svg"
    ],
    videoUrl: "",
    pdfUrl: "assets/CV.pdf",
    liveUrl: "https://github.com/thilacramesh",
    workflow: [
      {
        id: "step-1",
        title: "Data Aggregation Engine",
        desc: "Multi-channel news and open source social stream ingestion workers.",
        status: "completed",
        type: "pipeline"
      },
      {
        id: "step-2",
        title: "spaCy NER & Entity Linking",
        desc: "Extraction of geopolitical actors, corporate entities, locations, and monetary indicators.",
        status: "completed",
        type: "nlp"
      },
      {
        id: "step-3",
        title: "Sentence-BERT & K-Means",
        desc: "Clustering dense vector embeddings to discover latent, correlated crisis narratives.",
        status: "completed",
        type: "ml"
      },
      {
        id: "step-4",
        title: "Risk Dashboard & Flask Backend",
        desc: "Interactive visual threat matrix with dynamic alerts and statistical event signals.",
        status: "completed",
        type: "frontend"
      }
    ]
  }
];

// Career & Education Milestones (Inspired by Thanh Tran's whimsical yet technical connected timeline)
const TIMELINE_MILESTONES = [
  {
    phase: "Foundation & Hardware Phase",
    location: "Point Pedro, Sri Lanka",
    period: "2023 – 2024",
    role: "ICT Technician Trainee",
    org: "ITDLH (Computer Resource Center)",
    summary: "Troubleshooting hardware rigs, enterprise network switches, and developing early obsession with mechanical-electronic integration.",
    color: "#10b981", // Emerald
    isCurrent: false,
    logo: "assets/itdlh-logo.png"

  },
  {
    phase: "Mechanical Engineering Rigor",
    location: "University of Peradeniya",
    period: "2024 – Present",
    role: "B.Sc. Mechanical Engineering (Hons)",
    org: "Peradeniya Faculty of Engineering",
    summary: "Certified SOLIDWORKS Associate (CSWA), machine design, planetary gear transmissions, FEA stress theory, and biomechatronics.",
    color: "#f59e0b", // Amber
    isCurrent: false,
    logo: "assets/pera-logo.png"
  },
  {
    phase: "Autonomous Robotics & SLAM",
    location: "WSO2 / Remote & Hybrid",
    period: "Jun 2026 – Present",
    role: "Robotics Research Team Member",
    org: "WSO2 Research & Unitree Go2 EDU Quadruped",
    summary: "Pioneering SLAM optimization, BIM integration, policy-based ACSAR-E autonomous patrol, and high-performance mechatronics.",
    color: "#38bdf8", // Sky Blue
    isCurrent: true,
    currentLabel: "I am here!",
    logo: "assets/wso2-logo.png"
  },
  {
    phase: "Future Horizons",
    location: "Global / Space & Deep Tech (?)",
    period: "2027 and Beyond",
    role: "Autonomous Space & Robotic Systems Pioneer",
    org: "Robotics, Extreme Environments & Deep Tech",
    summary: "Developing multi-legged planetary exploration robots, space mechatronics, and bio-inspired autonomous agents.",
    color: "#8b5cf6", // Purple
    isCurrent: false,
    currentLabel: "Still taking suggestions!"
  }
];

// Local Storage Helper Functions
const STORAGE_KEY = "thilac_portfolio_projects_v3";

function getStoredProjects() {
  try {
    let data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      data = localStorage.getItem("thilac_portfolio_projects_v2");
    }
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(p => {
          const def = DEFAULT_PROJECTS.find(d => d.id === p.id);
          if (def) {
            return {
              ...p,
              companyLogo: p.companyLogo || def.companyLogo,
              companyName: p.companyName || def.companyName
            };
          }
          return p;
        });
      }
    }
  } catch (e) {
    console.warn("Could not read localStorage projects, falling back to defaults.", e);
  }
  return DEFAULT_PROJECTS;
}

function saveStoredProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch (e) {
    console.error("Failed to save projects to localStorage", e);
    return false;
  }
}

function resetProjectsToDefault() {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_PROJECTS;
}

// ============================================================================
// COMPETITIONS & HACKATHONS DATA
// ============================================================================
const COMPETITIONS_DATA = [
  {
    id: "datastorm-grand-finale",
    title: "DataStorm 7.0 – Grand Finale & Podium Ceremony",
    competition: "DataStorm 7.0",
    category: "podium",
    filterTags: ["datastorm", "podium"],
    featured: true,
    award: "National Finalist & Podium Deliberation",
    badge: "Podium Ceremony",
    badgeType: "accent-emerald",
    organization: "Rotaract Clubs of UoM & UoC • Powered by Octave",
    venue: "Colombo, Sri Lanka",
    date: "2025 / 2026",
    image: "gallery/DATASTROM/1.jpg",
    tags: ["DataStorm 7.0", "National Finalist", "Octave Analytics", "Podium", "Sri Lanka", "Data Science"],
    tagline: "Grand finale celebration with Champions, 1st & 2nd Runners-Up, finalist delegates, and Octave corporate partners.",
    story: "DataStorm 7.0 is Sri Lanka's premier advanced analytics and machine learning competition organized jointly by the Rotaract Clubs of University of Moratuwa and Faculty of Science, University of Colombo, powered by Octave (John Keells Holdings' Advanced Analytics Center of Excellence). Selected as a national finalist among hundreds of top university and industry analytics teams across the island."
  },
  {
    id: "datastorm-stage-pitch",
    title: "On-Stage Pitch: Predictive Modeling & AI Architecture",
    competition: "DataStorm 7.0",
    category: "stage",
    filterTags: ["datastorm", "stage"],
    featured: false,
    award: "Keynote Finalist Presentation",
    badge: "Stage Pitch",
    badgeType: "accent-cyan",
    organization: "Octave Analytics & Faculty of Science UoC",
    venue: "Main Auditorium, University of Colombo",
    date: "2025 / 2026",
    image: "gallery/DATASTROM/3.jpg",
    tags: ["Stage Presentation", "Pitching", "Octave", "Predictive AI", "DataStorm 7.0", "Public Speaking"],
    tagline: "Defending feature engineering, predictive models, and commercial insights live before leading industry data scientists.",
    story: "Took the main stage with the clicker and official delegate credentials to present the algorithmic strategy, data cleaning pipelines, cross-validation stability curves, and actionable business intelligence derived for Octave's complex real-world enterprise datasets."
  },
  {
    id: "datastorm-team-huddle",
    title: "High-Stakes Technical Strategy & Team Huddle",
    competition: "DataStorm 7.0",
    category: "team",
    filterTags: ["datastorm", "team"],
    featured: false,
    award: "Collaborative Analytics Round",
    badge: "Team Huddle",
    badgeType: "accent-amber",
    organization: "DataStorm 7.0 Technical Jury Round",
    venue: "University of Colombo Session Hall",
    date: "2025 / 2026",
    image: "gallery/DATASTROM/2.jpg",
    tags: ["Team Strategy", "Problem Solving", "DataStorm 7.0", "Feature Engineering", "Collaboration"],
    tagline: "Rapid tactical deliberation, data hypothesis formulation, and model benchmarking under intense hackathon timeframes.",
    story: "Collaborating with teammates to break down complex multi-dimensional data tables, isolate high-value latent features, and optimize model convergence rates during live competitive problem-solving rounds."
  },
  {
    id: "datastorm-results-defense",
    title: "Methodology Defense & Statistical Deep Dive",
    competition: "DataStorm 7.0",
    category: "stage",
    filterTags: ["datastorm", "stage"],
    featured: false,
    award: "Methodology Defense",
    badge: "Analytics Defense",
    badgeType: "accent-cyan",
    organization: "Octave Advanced Analytics Jury",
    venue: "Colombo, Sri Lanka",
    date: "2025 / 2026",
    image: "gallery/DATASTROM/6.jpg",
    tags: ["Methodology", "Statistical Defense", "Q&A Round", "Octave", "DataStorm 7.0"],
    tagline: "Explaining gradient-boosted error curves, precision-recall trade-offs, and deployment viability to the jury.",
    story: "Answering rigorous panel questions regarding hyperparameter tuning, leakage prevention, and model interpretability under enterprise deployment constraints during the final evaluation stage."
  },
  {
    id: "datastorm-delegate-session",
    title: "Finalist Deliberation & Delegate Stand",
    competition: "DataStorm 7.0",
    category: "team",
    filterTags: ["datastorm", "team"],
    featured: false,
    award: "Delegate Deliberation",
    badge: "Delegate Stand",
    badgeType: "accent-purple",
    organization: "Rotaract UoM & UoC",
    venue: "Auditorium Session",
    date: "2025 / 2026",
    image: "gallery/DATASTROM/4.jpg",
    tags: ["Delegate", "Auditorium", "Finalist", "DataStorm 7.0", "Peradeniya"],
    tagline: "Observing competitive pitches, cross-verifying benchmark scores, and taking in industry keynote insights.",
    story: "Attending the high-intensity keynote sessions and competitor pitches as an accredited delegate representing the University of Peradeniya at the national championship."
  },
  {
    id: "datastorm-badges",
    title: "Official Delegate Credentials & Event Lanyards",
    competition: "DataStorm 7.0",
    category: "badge",
    filterTags: ["datastorm", "badge"],
    featured: false,
    award: "Accredited Delegate Pass",
    badge: "Official Credentials",
    badgeType: "accent-cyan",
    organization: "Cloud Solutions International & Octave",
    venue: "Official Credentials Desk",
    date: "2025 / 2026",
    image: "gallery/DATASTROM/5.jpg",
    tags: ["Credentials", "Delegate Badges", "Octave", "DataStorm 7.0", "Event Pass"],
    tagline: "Official competition delegate badges engineered for Sri Lanka's leading advanced analytics summit.",
    story: "Official delegate accreditation pass issued by Rotaract Clubs of University of Moratuwa & Faculty of Science University of Colombo, with exclusive corporate partner Cloud Solutions International and powered by Octave."
  },
  {
    id: "nexushacks-2026",
    title: "NexusHacks 2026 – 1st Runner-Up (Agentic AI)",
    competition: "NexusHacks 2026",
    category: "podium",
    filterTags: ["nexushacks", "podium"],
    featured: true,
    award: "1st Runner-Up / 2nd Place",
    badge: "1st Runner-Up",
    badgeType: "accent-purple",
    organization: "Phaser, India • Team Kestrel (Dept. of Computer Engineering, Univ. of Peradeniya)",
    venue: "National AI Arena (Remote / Hybrid)",
    date: "2026",
    image: "gallery/NexusHacks/1.jpg",
    tags: ["NexusHacks 2026", "1st Runner-Up", "Team Kestrel", "Peradeniya", "Agentic AI", "Phaser India"],
    tagline: "Awarded 1st Runner-Up at the national level in the Agentic AI track with multi-agent reasoning architecture.",
    story: "Team Kestrel from Department of Computer Engineering, University of Peradeniya achieved 1st Runner-Up in the prestigious NexusHacks 2026 National Hackathon (Agentic AI track organized by Phaser, India) with an autonomous multi-agent reasoning and robotic dispatch pipeline."
  },
  {
    id: "model-x-hackathon",
    title: "Model X AI Hackathon – Special Award for Technical Design",
    competition: "Model X Hackathon",
    category: "podium",
    filterTags: ["modelx", "podium"],
    featured: false,
    award: "Special Award for Technical Design",
    badge: "Special Tech Award",
    badgeType: "accent-amber",
    organization: "Informatics Institute of Technology (IIT)",
    venue: "Colombo, Sri Lanka",
    date: "2025",
    image: "assets/schematic-robotic-arm.svg",
    tags: ["Model X", "Special Award", "IIT", "Technical Design", "NLP OSINT", "spaCy"],
    tagline: "Honored with the prestigious Special Award for Technical Design for our real-time OSINT NLP intelligence engine.",
    story: "Built and demonstrated a high-throughput open-source intelligence pipeline combining named entity recognition (NER), Sentence-BERT contextual clustering, and automated threat matrix scoring, recognized for exceptional architectural design."
  }
];

