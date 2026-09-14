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
      "assets/unitree-go2-hero.png",
      "assets/unitree-go2-team.png",
      "assets/unitree-go2-robot.png",

    ],
    videoUrl: "https://www.youtube.com/watch?v=yo7nN9cI1Gg",
    pdfUrl: "WSO2/1.pdf",
    liveUrl: "https://github.com/Thilac01",
    workflow: [
      {
        id: "step-1",
        stageKey: "problem",
        stageLabel: "Problem",
        title: "Quadruped Trotting Gait Vibration & Point-Cloud Drift",
        desc: "Periodic Z-axis impact shocks and high-frequency vibrations from quadruped trotting gaits introduce severe odometry drift, duplicated phantom wall planes, and point-cloud distortion in indoor LiDAR scans, compromising multi-floor autonomous patrol reliability.",
        status: "completed",
        type: "problem"
      },
      {
        id: "step-2",
        stageKey: "built",
        stageLabel: "What I Built",
        title: "End-to-End LiDAR SLAM & DASH Ground Control Station (GCS)",
        desc: "Engineered a full-stack robotics architecture: an onboard ROS 2 data-acquisition daemon (lidar_bridge.py) with dynamic voxel filtering, coupled with the DASH desktop Ground Control Station featuring a real-time 3D OpenGL point-cloud viewport, Windows XInput gamepad teleoperation, and embedded FastAPI SDK.",
        status: "completed",
        type: "built"
      },
      {
        id: "step-3",
        stageKey: "contribution",
        stageLabel: "My Contribution",
        title: "Two-Test Wall Classification & Batched BMesh 3D Extrusion",
        desc: "Formulated the 'Two-Test' 2D wall classification algorithm (Confidence Filter count ≥ 10 & Height-Span Filter Δz ≥ 0.60 m) to filter dynamic floor noise; developed the batched BMesh Python pipeline in Blender to resolve CPU geometry bottlenecks; built low-latency MQTT JSON telemetry bridges.",
        status: "completed",
        type: "contribution"
      },
      {
        id: "step-4",
        stageKey: "result",
        stageLabel: "Measurable Result",
        title: "Sub-25ms Telemetry, 30 FPS Rendering & Drift-Free Planar Mapping",
        desc: "Achieved sub-25ms end-to-end telemetry sync over WiFi, sustained interactive 30 FPS 3D point-cloud rendering in OpenGL, eliminated Z-axis drift via planar gait decimation, and successfully generated complete 3D structural floorplans across multiple field trials at WSO2 Colombo headquarters.",
        status: "completed",
        type: "result"
      },
      {
        id: "step-5",
        stageKey: "video",
        stageLabel: "Video",
        title: "Field Deployment & Autonomous Navigation Video",
        desc: "Live video demonstration showcasing the Unitree Go2 EDU quadruped executing real-time SLAM mapping, gait stabilization, and DASH GCS teleoperation inside the WSO2 corporate office.",
        status: "completed",
        type: "video",
        actionType: "tab-video",
        actionUrl: "https://www.youtube.com/watch?v=yo7nN9cI1Gg"
      },
      {
        id: "step-6",
        stageKey: "github",
        stageLabel: "GitHub",
        title: "Open Source ROS 2 Drivers & Telemetry Bridge",
        desc: "Full source code repository containing custom ROS 2 packages, MQTT bridge daemons, DASH ground station interface, and Blender 3D geometry extrusion scripts.",
        status: "completed",
        type: "github",
        actionType: "external-link",
        actionUrl: "https://github.com/Thilac01"
      },
      {
        id: "step-7",
        stageKey: "report",
        stageLabel: "Technical Report",
        title: "Project ACSAR-E Monthly Engineering Progress Report (23 Pages)",
        desc: "Official 23-page engineering report detailing SLAM mathematical formulation, network topology, wall classification proofs, field deployment trials at WSO2 Colombo, and DASH GCS architectural design.",
        status: "completed",
        type: "report",
        actionType: "tab-pdf",
        actionUrl: "WSO2/1.pdf"
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
      "assets/meat-mincer-assembly.png",
      "assets/schematic-planetary.svg"
    ],
    videoUrl: "",
    pdfUrl: "Meat/1.pdf",
    liveUrl: "https://github.com/Thilac01",
    workflow: [
      {
        id: "step-1",
        stageKey: "problem",
        stageLabel: "Problem",
        title: "Excessive Crank Exertion, Auger Jamming & Bench Instability",
        desc: "Traditional direct-drive manual mincers force users to exert over 100 Nm torque during fibrous meat processing, leading to rapid muscle fatigue, cutting knife stall, and dangerous bench overturning moments exceeding normal clamp ratings.",
        status: "completed",
        type: "problem"
      },
      {
        id: "step-2",
        stageKey: "built",
        stageLabel: "What I Built",
        title: "Counter-Shearing Mincer with 4.2:1 Epicyclic Planetary Gearbox",
        desc: "Designed and engineered an enclosed 24/24/72-tooth module-1 epicyclic planetary gear transmission, counter-rotating barrel cutting assembly, 4-arm knife with M72×2 threaded locking ring, and a heavy-duty suction vacuum base.",
        status: "completed",
        type: "built"
      },
      {
        id: "step-3",
        stageKey: "contribution",
        stageLabel: "My Contribution",
        title: "Lewis Tooth Bending, Shaft Sizing & Parametric SOLIDWORKS CAD",
        desc: "Derived gear geometry and contact stresses for sun (Zs=20) and planet gears (Zp=20); executed static sizing on 16 mm input and 18 mm auger shafts under combined bending-torsion; calculated crank-arm deflection under 150 N load; and created the complete parametric CAD assembly in SOLIDWORKS.",
        status: "completed",
        type: "contribution"
      },
      {
        id: "step-4",
        stageKey: "result",
        stageLabel: "Measurable Result",
        title: "4.2:1 Torque Multiplication, Ns ≥ 2.85 & 150 N Overturn Resistance",
        desc: "Amplified standard human crank torque (25 Nm) to 105 Nm cutting torque at the cutter knife, validated factor of safety Ns ≥ 2.85 across all high-stress gear teeth under shock loading, and verified vacuum base stability against a 150 N overturning moment.",
        status: "completed",
        type: "result"
      },
      {
        id: "step-5",
        stageKey: "video",
        stageLabel: "Video",
        title: "3D CAD Kinematics & Exploded View Walkthrough",
        desc: "Interactive 3D CAD motion walkthrough demonstrating the epicyclic planetary gear train, auger counter-shearing motion, and ergonomic crank operation.",
        status: "completed",
        type: "video",
        actionType: "tab-gallery",
        actionUrl: ""
      },
      {
        id: "step-6",
        stageKey: "github",
        stageLabel: "GitHub",
        title: "Mechanical CAD Models & Design Calculation Dossier",
        desc: "Repository containing full SOLIDWORKS CSWA 3D models, STEP interchange files, Bill of Materials (BOM), and mechanical dimensioning spreadsheets.",
        status: "completed",
        type: "github",
        actionType: "external-link",
        actionUrl: "https://github.com/Thilac01"
      },
      {
        id: "step-7",
        stageKey: "report",
        stageLabel: "Technical Report",
        title: "Stress-Based Dimensioning & Design Project Report (39 Pages)",
        desc: "Complete 39-page engineering design dossier detailing failure mode mitigations, Lewis bending equations, shaft deflection analysis, and fully dimensioned 2D orthographic manufacturing drawings.",
        status: "completed",
        type: "report",
        actionType: "tab-pdf",
        actionUrl: "Meat/1.pdf"
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
    pdfUrl: "Addabtive/1.pdf",
    liveUrl: "https://github.com/Thilac01",
    workflow: [
      {
        id: "step-1",
        stageKey: "problem",
        stageLabel: "Problem",
        title: "Prohibitive Costs & Rigid Sizing in Knee Orthotic Solutions",
        desc: "Over 72% of Sri Lankan agricultural and manual laborers experience severe musculoskeletal joint strain. Commercial imported orthotic braces cost upwards of Rs. 25,000, while cheaper alternatives fail to offer dynamic angular stopping, lack breathability, and cause localized skin pressure trauma.",
        status: "completed",
        type: "problem"
      },
      {
        id: "step-2",
        stageKey: "built",
        stageLabel: "What I Built",
        title: "Universal Mechanical Brace with Adaptive Wedge Hinge Mechanism",
        desc: "Engineered an anthropometrically universal orthotic brace fitting 5th to 95th percentile adults, incorporating an adaptive tribological sliding-wedge hinge, multi-point strap anchors, breathable frame architecture, and localized low-cost manufacturing.",
        status: "completed",
        type: "built"
      },
      {
        id: "step-3",
        stageKey: "contribution",
        stageLabel: "My Contribution",
        title: "Lead Design, AHP Needs Weighting & FEA Topology Optimization",
        desc: "Conducted Customer Needs Analysis using the Analytic Hierarchy Process (AHP: 33.73% support priority); mapped polycentric knee instantaneous centers of rotation (ICR); engineered variable-angle sliding stops; and performed density-based FEA topology optimization in SOLIDWORKS.",
        status: "completed",
        type: "contribution"
      },
      {
        id: "step-4",
        stageKey: "result",
        stageLabel: "Measurable Result",
        title: "-34% Mass Reduction, >750 N Capacity & Under Rs. 5,000 Production",
        desc: "Reduced overall brace mass to < 1.85 kg (-34% structural reduction), sustained axial support load capacity > 750 N, held skin surface pressure below 4.5 kN/m² across a continuous 0°–140° flexion range, and slashed production cost to under Rs. 5,000.",
        status: "completed",
        type: "result"
      },
      {
        id: "step-5",
        stageKey: "video",
        stageLabel: "Video",
        title: "Biomechanical Joint Hinge & Gait Simulation",
        desc: "Biomechanical kinematic simulation verifying smooth angular compliance and shock-absorbing wedge behavior throughout the stance and swing gait phases.",
        status: "completed",
        type: "video",
        actionType: "tab-gallery",
        actionUrl: ""
      },
      {
        id: "step-6",
        stageKey: "github",
        stageLabel: "GitHub",
        title: "Orthosis CAD & 3D Printing Files Repository",
        desc: "Open access to 3D printable PA12-CF component models, 2D manufacturing drawings, strap routing diagrams, and AHP prioritization spreadsheets.",
        status: "completed",
        type: "github",
        actionType: "external-link",
        actionUrl: "https://github.com/Thilac01"
      },
      {
        id: "step-7",
        stageKey: "report",
        stageLabel: "Technical Report",
        title: "ME2010 Engineering Innovation and Design Project Report (9 Pages)",
        desc: "Official 9-page university engineering report covering opportunity identification, customer needs analysis, AHP priority vectors, target specifications, and 2D orthographic part drawings.",
        status: "completed",
        type: "report",
        actionType: "tab-pdf",
        actionUrl: "Addabtive/1.pdf"
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
    heroImage: "assets/HDRM.svg",
    gallery: [
      "assets/HDRM.svg"
    ],
    videoUrl: "",
    pdfUrl: "assets/CV.pdf",
    liveUrl: "https://orcid.org/0009-0008-2125-4890",
    workflow: [
      {
        id: "step-1",
        stageKey: "problem",
        stageLabel: "Problem",
        title: "Geometric Representation Gaps in Quantum Probability Fields",
        desc: "Standard Cartesian representations of quantum probability densities often obscure higher-order geometric invariants, spatial radial symmetries, and topological convergence behavior during multi-dimensional particle distribution modeling.",
        status: "completed",
        type: "problem"
      },
      {
        id: "step-2",
        stageKey: "built",
        stageLabel: "What I Built",
        title: "Higher-Dimensional Radial Model (HDRM) Theoretical Framework",
        desc: "Formulated a comprehensive mathematical framework establishing continuous radial mapping equations from multi-dimensional Euclidean spaces directly to quantum probabilistic fields with rigorous boundary condition invariance.",
        status: "completed",
        type: "built"
      },
      {
        id: "step-3",
        stageKey: "contribution",
        stageLabel: "My Contribution",
        title: "Mathematical Derivations, NumPy Solvers & LaTeX Typesetting",
        desc: "Derived the fundamental radial projection equations; engineered custom high-precision Python numerical solvers to test density convergence and topological invariants; and drafted the full academic manuscript conforming to Springer Nature standards.",
        status: "completed",
        type: "contribution"
      },
      {
        id: "step-4",
        stageKey: "result",
        stageLabel: "Measurable Result",
        title: "Manuscript Under Review at Springer Nature (IJTP)",
        desc: "Formally submitted research manuscript to the International Journal of Theoretical Physics (Springer Nature); confirmed numerical solver convergence across high-dimensional manifolds with zero spatial discontinuity.",
        status: "completed",
        type: "result"
      },
      {
        id: "step-5",
        stageKey: "video",
        stageLabel: "Video",
        title: "Multi-Dimensional Radial Field Numerical Visualization",
        desc: "Visual representation of radial projection manifolds, probability density surfaces, and dimensional boundary convergence animations.",
        status: "completed",
        type: "video",
        actionType: "tab-gallery",
        actionUrl: ""
      },
      {
        id: "step-6",
        stageKey: "github",
        stageLabel: "GitHub",
        title: "ORCID Academic Registry & Verified Research Record",
        desc: "Access verified researcher record (ORCID: 0009-0008-2125-4890), academic paper preprints, and numerical simulation repositories.",
        status: "completed",
        type: "github",
        actionType: "external-link",
        actionUrl: "https://orcid.org/0009-0008-2125-4890"
      },
      {
        id: "step-7",
        stageKey: "report",
        stageLabel: "Technical Report",
        title: "Research Paper Manuscript Overview & Academic CV",
        desc: "Official publication preprint summary, theoretical theorem proofs, and engineering research profile.",
        status: "completed",
        type: "report",
        actionType: "tab-pdf",
        actionUrl: "assets/CV.pdf"
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
    heroImage: "assets/JPL.svg",
    gallery: [
      "assets/JPL.svg"
    ],
    videoUrl: "",
    pdfUrl: "assets/CV.pdf",
    liveUrl: "https://github.com/Thilac01",
    workflow: [
      {
        id: "step-1",
        stageKey: "problem",
        stageLabel: "Problem",
        title: "Telemetry Ingestion Bottlenecks & Lock Contention on Edge Hardware",
        desc: "Facilities monitoring systems suffered high telemetry drop rates and database write locks when attempting to sync real-time state telemetry from hundreds of edge hardware microcontrollers into centralized dashboards.",
        status: "completed",
        type: "problem"
      },
      {
        id: "step-2",
        stageKey: "built",
        stageLabel: "What I Built",
        title: "Asynchronous FastAPI Middleware & Change Data Capture (CDC) Pipeline",
        desc: "Architected a resilient distributed middleware system using FastAPI, MariaDB binary log replication streaming, isolated read replicas, and hardened edge communications protocols.",
        status: "completed",
        type: "built"
      },
      {
        id: "step-3",
        stageKey: "contribution",
        stageLabel: "My Contribution",
        title: "Non-Blocking Telemetry Router, CDC Engine & Edge PCB DFM",
        desc: "Developed asynchronous event routing intake workers; authored the binary log CDC synchronization pipeline; designed compact binary serialization payloads; and provided hardware DFM recommendations for edge PCB noise immunity.",
        status: "completed",
        type: "contribution"
      },
      {
        id: "step-4",
        stageKey: "result",
        stageLabel: "Measurable Result",
        title: "10,000+ msgs/sec, <25 ms E2E Latency & Zero Dropped Packets",
        desc: "Sustained peak telemetry intake throughput exceeding 10,000 messages/second, reduced end-to-end telemetry latency to under 25 milliseconds, and guaranteed zero data loss across flaky industrial networks.",
        status: "completed",
        type: "result"
      },
      {
        id: "step-5",
        stageKey: "video",
        stageLabel: "Video",
        title: "Real-Time Telemetry & CDC Pipeline Architecture Demo",
        desc: "Live demonstration showing real-time sensor event ingestion, sub-second CDC database synchronization, and automated failover recovery.",
        status: "completed",
        type: "video",
        actionType: "tab-gallery",
        actionUrl: ""
      },
      {
        id: "step-6",
        stageKey: "github",
        stageLabel: "GitHub",
        title: "IoT Middleware & Backend Architecture Repository",
        desc: "Full source code including FastAPI microservices, Docker Compose cluster orchestration, database schemas, and edge communication firmware.",
        status: "completed",
        type: "github",
        actionType: "external-link",
        actionUrl: "https://github.com/Thilac01"
      },
      {
        id: "step-7",
        stageKey: "report",
        stageLabel: "Technical Report",
        title: "JPL Middleware Architecture Specification & CV",
        desc: "Comprehensive architecture whitepaper covering Change Data Capture mechanics, microservice benchmarks, and hardware-software integration protocols.",
        status: "completed",
        type: "report",
        actionType: "tab-pdf",
        actionUrl: "assets/CV.pdf"
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
    description: "Developed, published, and maintained ezclean-data, an open-source Python library designed to simplify dataset hygiene, missing value handling, column normalization, and validation pipelines for machine learning workflows. Distributed publicly with automated test coverage and documentation.",
    metrics: [
      { label: "Distribution", value: "PyPI Package" },
      { label: "Language", value: "Pure Python 3.9+" },
      { label: "Test Coverage", value: "> 95%" },
      { label: "License", value: "MIT Open Source" }
    ],
    tags: ["Python", "PyPI", "Package Development", "Pandas", "CI/CD", "Open Source"],
    heroImage: "assets/ezclean.svg",
    gallery: [
      "assets/ezclean.svg"
    ],
    videoUrl: "",
    pdfUrl: "ezclean/1.pdf",
    liveUrl: "https://github.com/Thilac01/ezclean",
    workflow: [
      {
        id: "step-1",
        stageKey: "problem",
        stageLabel: "Problem",
        title: "Repetitive Data Sanitization Boilerplate in ML Workflows",
        desc: "Data scientists and engineers waste up to 80% of project time writing redundant, error-prone boilerplate scripts for format ingestion, missing value imputation, type casting, and exploratory pairplot visualizations across varying file formats.",
        status: "completed",
        type: "problem"
      },
      {
        id: "step-2",
        stageKey: "built",
        stageLabel: "What I Built",
        title: "ezclean-data: Dataset-Agnostic Automated Ingestion & Cleaning Library",
        desc: "Engineered and published `ezclean-data` to PyPI: an automated library featuring a format-agnostic Smart Loader (supporting CSV, Parquet, Feather, SPSS, SAS, Excel, JSONL), complete pipeline cleaner, and self-contained interactive HTML dashboard generator.",
        status: "completed",
        type: "built"
      },
      {
        id: "step-3",
        stageKey: "contribution",
        stageLabel: "My Contribution",
        title: "Vectorized Transformers, Automated Outlier IQR & PyPI CI/CD",
        desc: "Implemented automated type detection, column snake_casing, IQR outlier filtering, median/categorical imputation, statistical `colname()` summaries, multidimensional relationship grids, and automated Pytest GitHub Actions release workflows.",
        status: "completed",
        type: "contribution"
      },
      {
        id: "step-4",
        stageKey: "result",
        stageLabel: "Measurable Result",
        title: ">95% Test Coverage, Sub-Second Pipeline & PyPI Global Distribution",
        desc: "Maintained >95% automated test coverage across Python 3.9 through 3.12, collapsed dataset preprocessing from hours to a 3-line Python command, and published the package live to the global Python Package Index (`pip install ezclean-data`).",
        status: "completed",
        type: "result"
      },
      {
        id: "step-5",
        stageKey: "video",
        stageLabel: "Video",
        title: "CLI Ingestion & Interactive HTML Dashboard Walkthrough",
        desc: "Walkthrough of ezclean's Smart_loader, automated data sanitization pipeline, and dynamic HTML exploratory dashboard generation.",
        status: "completed",
        type: "video",
        actionType: "tab-gallery",
        actionUrl: ""
      },
      {
        id: "step-6",
        stageKey: "github",
        stageLabel: "GitHub",
        title: "Official GitHub Repository (Thilac01/ezclean)",
        desc: "Open source repository containing library source code, issue tracker, documentation, Pytest test suites, and PyPI packaging configurations.",
        status: "completed",
        type: "github",
        actionType: "external-link",
        actionUrl: "https://github.com/Thilac01/ezclean"
      },
      {
        id: "step-7",
        stageKey: "report",
        stageLabel: "Technical Report",
        title: "ezclean-data Reference Manual & Architecture Guide (5 Pages)",
        desc: "Official 5-page API specification, function signatures, supported format breakdown, and operational example workflows.",
        status: "completed",
        type: "report",
        actionType: "tab-pdf",
        actionUrl: "ezclean/1.pdf"
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
    heroImage: "assets/model-x.png",
    gallery: [
      "assets/model-x.png"
    ],
    videoUrl: "",
    pdfUrl: "assets/CV.pdf",
    liveUrl: "https://github.com/Thilac01",
    workflow: [
      {
        id: "step-1",
        stageKey: "problem",
        stageLabel: "Problem",
        title: "Information Overload & Noise in Multi-Channel OSINT Streams",
        desc: "Human intelligence analysts face an overwhelming volume of unstructured news feeds and social data streams, causing critical delays in identifying emerging socioeconomic crises, civil unrest, and geopolitical risk factors.",
        status: "completed",
        type: "problem"
      },
      {
        id: "step-2",
        stageKey: "built",
        stageLabel: "What I Built",
        title: "End-to-End AI OSINT Intelligence Pipeline & Threat Matrix",
        desc: "Engineered an automated OSINT intelligence engine combining spaCy Named Entity Recognition (NER), Sentence-BERT semantic vector embeddings, dynamic K-Means clustering, and a real-time Flask threat matrix dashboard.",
        status: "completed",
        type: "built"
      },
      {
        id: "step-3",
        stageKey: "contribution",
        stageLabel: "My Contribution",
        title: "NLP Architecture, Semantic Clustering & Threat Scoring Engine",
        desc: "Designed multi-channel data ingestion scrapers; implemented dense vector embedding generation using Sentence-BERT; built unsupervised K-Means topic cluster discovery; and calibrated normalized VADER risk indicators.",
        status: "completed",
        type: "contribution"
      },
      {
        id: "step-4",
        stageKey: "result",
        stageLabel: "Measurable Result",
        title: "Special Award for Technical Design & 91.4% Extraction Precision",
        desc: "Won the Special Award for Technical Design at the Model X AI Hackathon; achieved 91.4% entity extraction precision and sub-second topic clustering across 100,000+ multi-source unstructured news articles.",
        status: "completed",
        type: "result"
      },
      {
        id: "step-5",
        stageKey: "video",
        stageLabel: "Video",
        title: "Live Hackathon Pitch & Interactive Threat Matrix Demo",
        desc: "Recorded live demonstration of real-time OSINT data ingestion, semantic narrative clustering, and interactive geographical threat heatmaps.",
        status: "completed",
        type: "video",
        actionType: "tab-gallery",
        actionUrl: ""
      },
      {
        id: "step-6",
        stageKey: "github",
        stageLabel: "GitHub",
        title: "Model X NLP Intelligence Platform Repository",
        desc: "Open source machine learning pipeline code, Sentence-BERT clustering notebooks, Flask backend implementation, and UI visualization templates.",
        status: "completed",
        type: "github",
        actionType: "external-link",
        actionUrl: "https://github.com/Thilac01"
      },
      {
        id: "step-7",
        stageKey: "report",
        stageLabel: "Technical Report",
        title: "Model X Technical Brief & Competition Submission Dossier",
        desc: "Complete technical architecture overview, NLP benchmark evaluation metrics, and competition presentation slides.",
        status: "completed",
        type: "report",
        actionType: "tab-pdf",
        actionUrl: "assets/CV.pdf"
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
    summary: "Triple Dassault Systèmes Certified: CSWA (Mechanical Design), CSWA-AM (Additive Manufacturing), and CSWA-SD (Sustainable Design). Machine design, planetary gear transmissions, FEA stress theory, and biomechatronics.",
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
    image: "assets/model-x.png",
    tags: ["Model X", "Special Award", "IIT", "Technical Design", "NLP OSINT", "spaCy"],
    tagline: "Honored with the prestigious Special Award for Technical Design for our real-time OSINT NLP intelligence engine.",
    story: "Built and demonstrated a high-throughput open-source intelligence pipeline combining named entity recognition (NER), Sentence-BERT contextual clustering, and automated threat matrix scoring, recognized for exceptional architectural design."
  }
];

// ============================================================================
// COLLABORATORS & TEAM CREDITS DATA
// ----------------------------------------------------------------------------
// INSTRUCTIONS FOR OWNER (Thilac Ramesh):
// To give credit to your team members and link their personal portfolios:
// 1. Edit the names, roles, and portfolio URLs below with their real links.
// 2. You can set "avatar" to an image file (e.g. "assets/avatar1.jpg") or 
//    leave it blank ("") to automatically render a sleek gradient initials monogram!
// 3. Add or update their LinkedIn and GitHub profile links.
// ============================================================================
const COLLABORATORS_DATA = [
  {
    id: "collab-dakshayini",
    name: "Dakshayini Ramanesh",
    role: "AI, Machine Learning & Robotics Collaborator",
    affiliation: "University of Peradeniya • Team Kestrel",
    avatar: "", // Dynamic monogram initials (DR)
    portfolioUrl: "https://myportfolio-three-nu-97.vercel.app/",
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com",
    category: "hackathons",
    filterTags: ["datastorm", "modelx", "robotics", "nexushacks", "hackathons"],
    competitions: [
      { name: "DataStorm 7.0", badge: "Podium Finalist", style: "gold" },
      { name: "NexusHacks 2026", badge: "1st Runner-Up (India)", style: "purple" },
      { name: "Model X Hackathon", badge: "Technical Design Award", style: "emerald" },
      { name: "WSO2 Robotics", badge: "Research Collaboration", style: "blue" }
    ],
    credit: "Cross-functional research & hackathon collaborator across DataStorm 7.0 (predictive data modeling), NexusHacks 2026 (autonomous agent reasoning), Model X Hackathon (NLP architecture), and WSO2 Robotics research initiatives."
  },
  {
    id: "collab-rashad",
    name: "Rashad",
    role: "Autonomous Systems & Robotics Collaborator",
    affiliation: "University of Peradeniya • Team Kestrel",
    avatar: "", // Dynamic monogram initials (R)
    portfolioUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com",
    category: "nexushacks",
    filterTags: ["nexushacks", "robotics", "hackathons"],
    competitions: [
      { name: "NexusHacks 2026", badge: "1st Runner-Up (India)", style: "purple" },
      { name: "WSO2 Robotics", badge: "Research Collaboration", style: "blue" }
    ],
    credit: "Co-engineered autonomous multi-agent reasoning and robotic dispatch pipelines for NexusHacks 2026, and collaborated on quadruped mobile robotics research with WSO2."
  },
  {
    id: "collab-daniel",
    name: "Daniel",
    role: "Robotics & Autonomous Systems Researcher",
    affiliation: "WSO2 Research Lab & ACSAR-E",
    avatar: "", // Dynamic monogram initials (D)
    portfolioUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com",
    category: "robotics",
    filterTags: ["robotics"],
    competitions: [
      { name: "WSO2 Robotics", badge: "Unitree Go2 Research", style: "blue" }
    ],
    credit: "Collaborated on Unitree Go2 Quadruped LiDAR point-cloud spatial filtering, BIM IFC costmap conversion, and autonomous physical patrol navigation at WSO2 Research Lab."
  },
  {
    id: "collab-shathurshima",
    name: "Shathursima Raveendran",
    role: "Data Science & Machine Learning Collaborator",
    affiliation: "University of Peradeniya • Computer Engineering",
    avatar: "", // Dynamic monogram initials (SR)
    portfolioUrl: "https://shathucodes.github.io/portfolio/",
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com/shathucodes",
    category: "datastorm",
    filterTags: ["datastorm", "modelx", "hackathons"],
    competitions: [
      { name: "DataStorm 7.0", badge: "Podium Finalist", style: "gold" },
      { name: "Model X Hackathon", badge: "Technical Design Award", style: "emerald" }
    ],
    credit: "Partnered on statistical exploratory data analysis, predictive modeling pipelines for DataStorm 7.0, and real-time NLP OSINT intelligence engineering at Model X Hackathon."
  }
];

// Helper to get collaborators with local storage fallback
function getStoredCollaborators() {
  try {
    const custom = localStorage.getItem("thilac_custom_collaborators");
    if (custom) {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Automatically synchronize new live portfolio links and names into stored cache
        parsed.forEach(p => {
          const defaultCollab = COLLABORATORS_DATA.find(d => d.id === p.id);
          if (defaultCollab) {
            if (!p.portfolioUrl || p.portfolioUrl === "https://github.com" || p.portfolioUrl.includes("github.com/your-username")) {
              p.portfolioUrl = defaultCollab.portfolioUrl;
            }
            if (defaultCollab.name && (p.name === "Shathurshima" || !p.name)) {
              p.name = defaultCollab.name;
            }
            if (defaultCollab.githubUrl && p.githubUrl === "https://github.com") {
              p.githubUrl = defaultCollab.githubUrl;
            }
            if (defaultCollab.affiliation && p.affiliation === "University of Peradeniya") {
              p.affiliation = defaultCollab.affiliation;
            }
          }
        });
        return parsed;
      } else {
        localStorage.removeItem("thilac_custom_collaborators");
      }
    }
  } catch (e) {
    console.warn("Could not read custom collaborators from storage:", e);
  }
  return COLLABORATORS_DATA;
}

// ============================================================================
// COMPETITIONS & ASSOCIATED COLLABORATORS MAPPING
// ----------------------------------------------------------------------------
// Shows competition cards first. Clicking inside reveals the team members
// who collaborated on that competition.
// ============================================================================
const COMPETITION_COLLAB_DATA = [
  {
    id: "comp-datastorm",
    filterId: "datastorm",
    filterTags: ["datastorm", "hackathons"],
    title: "DataStorm 7.0",
    subtitle: "Sri Lanka's Premier Advanced Analytics Championship",
    award: "Podium Finalist",
    style: "gold",
    icon: "fa-trophy",
    organization: "Rotaract UoM & UoC • Powered by Octave",
    venue: "Colombo, Sri Lanka",
    date: "2025 / 2026",
    image: "gallery/DATASTROM/1.jpg",
    desc: "National finalist selection among top university and industry analytics teams island-wide, presenting enterprise ML pipelines to executive Octave jury panels.",
    memberIds: ["collab-dakshayini", "collab-shathurshima"],
    memberContributions: {
      "collab-dakshayini": "Co-architected predictive feature engineering, cross-validation tuning, and handled statistical hypothesis defense before the Octave panel.",
      "collab-shathurshima": "Led statistical exploratory data analysis, business intelligence metric modeling, and keynote slide visual synthesis for DataStorm 7.0 national finale."
    }
  },
  {
    id: "comp-nexushacks",
    filterId: "nexushacks",
    filterTags: ["nexushacks", "hackathons"],
    title: "NexusHacks 2026",
    subtitle: "National AI Hackathon • Agentic AI Track",
    award: "1st Runner-Up (India)",
    style: "purple",
    icon: "fa-medal",
    organization: "Phaser India • Team Kestrel (Univ. of Peradeniya)",
    venue: "National AI Arena (Remote / Hybrid)",
    date: "2026",
    image: "gallery/NexusHacks/1.jpg",
    desc: "Awarded 1st Runner-Up at the national level in Agentic AI with an autonomous multi-agent reasoning, task decomposition, and robotic dispatch pipeline.",
    memberIds: ["collab-dakshayini", "collab-rashad"],
    memberContributions: {
      "collab-dakshayini": "Co-developed the multi-agent LLM reasoning state machine, prompt chaining protocols, and robotic dispatch telemetry bridging.",
      "collab-rashad": "Engineered real-time robotic dispatch telemetry bridging, asynchronous execution runtime, and agent state coordination under hackathon timeframes."
    }
  },
  {
    id: "comp-modelx",
    filterId: "modelx",
    filterTags: ["modelx", "hackathons"],
    title: "Model X AI Hackathon",
    subtitle: "Real-Time NLP OSINT Threat Matrix Engine",
    award: "Special Award for Technical Design",
    style: "emerald",
    icon: "fa-award",
    organization: "Informatics Institute of Technology (IIT)",
    venue: "Colombo, Sri Lanka",
    date: "2025",
    image: "assets/model-x.png",
    desc: "Honored with the prestigious Special Award for Technical Design for high-throughput NLP intelligence combining spaCy NER entity extraction and Sentence-BERT clustering.",
    memberIds: ["collab-dakshayini", "collab-shathurshima"],
    memberContributions: {
      "collab-dakshayini": "Architected NLP entity graph clustering, threat matrix scoring algorithms, and end-to-end pipeline integration.",
      "collab-shathurshima": "Implemented spaCy NER entity extraction models, contextual embedding clustering, and vector evaluation datasets."
    }
  },
  {
    id: "comp-wso2",
    filterId: "robotics",
    filterTags: ["robotics"],
    title: "WSO2 Robotics Research Lab",
    subtitle: "Autonomous Quadruped Mobile Robotics & ACSAR-E",
    award: "Robotics Research Collaboration",
    style: "blue",
    icon: "fa-robot",
    organization: "WSO2 Research Lab & ACSAR-E",
    venue: "Research Facilities, Sri Lanka",
    date: "2025 – 2026",
    image: "assets/unitree-go2-hero.png",
    desc: "Research collaboration deployed on the Unitree Go2 Quadruped robot for indoor LiDAR SLAM, BIM IFC costmap conversion, and autonomous physical patrol navigation.",
    memberIds: ["collab-dakshayini", "collab-rashad", "collab-daniel"],
    memberContributions: {
      "collab-dakshayini": "Collaborated on multi-sensor telemetry fusion, point-cloud spatial filtering, and high-level autonomous patrol mission planning.",
      "collab-rashad": "Partnered on ROS2 navigation stack integration, obstacle avoidance heuristics, and robot state telemetry monitoring.",
      "collab-daniel": "Collaborated on Unitree Go2 Quadruped LiDAR point-cloud spatial filtering, BIM IFC costmap conversion, and autonomous physical patrol navigation."
    }
  }
];

function getCompetitionCollabs() {
  return COMPETITION_COLLAB_DATA;
}


