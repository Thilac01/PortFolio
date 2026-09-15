/**
 * Vercel Serverless Function: Portfolio Chatbot AI Assistant
 * 
 * Powered by Google Gemini with automatic fallback to structured Portfolio RAG Knowledge Engine.
 * 
 * Environment Variables (set in Vercel Dashboard -> Settings -> Environment Variables):
 * - GEMINI_API_KEY (or GOOGLE_API_KEY)
 */

module.exports = async (req, res) => {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message, history = [], sources = [] } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Missing required 'message' in request body" });
  }

  const userQuery = message.trim();
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_KEY || process.env.API_KEY || "").trim();

  // 1. If a valid Gemini API key is configured in Vercel environment variables, use live Gemini models
  if (apiKey && apiKey.startsWith("AIzaSy")) {
    const modelsToTry = [
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-flash-latest"
    ];

    const contextText = Array.isArray(sources) && sources.length > 0
      ? sources.map((s, idx) => `[Source ${idx + 1}: ${s.title || "Portfolio Record"}]\n${s.content || ""}`).join("\n\n---\n\n")
      : "Thilac Ramesh is an undergraduate in Mechanical Engineering at University of Peradeniya specializing in Autonomous Robotics, Unitree Go2 EDU quadruped, SLAM, ROS 2, and SOLIDWORKS Machine Design.";

    const systemInstruction = `You are the official Chatbot for Thilac Ramesh's engineering portfolio.
Mission: Answer questions factually, concisely, and crisply based on Thilac Ramesh's portfolio.
Strict rules:
1. Only answer questions regarding Thilac Ramesh, his robotics research (Unitree Go2 quadruped, SLAM, ROS 2, Nav2, MuJoCo), mechanical projects (Planetary Gearbox, Adaptive Orthosis, CSWA CAD), software/IoT (JPL Middleware, ezclean, Model X), competitions (DataStorm 7.0 finalist, NexusHacks 2026 1st Runner-Up, Model X Technical Design Award), academic papers (HDRM under review at Springer Nature), skills, experience, and contact info.
2. If asked general questions unrelated to Thilac Ramesh, politely decline.
3. Give direct, precise, fact-grounded answers without fluff or unasked commentary.
4. Ground your answers strictly in the Verified Context below.

VERIFIED CONTEXT:
${contextText}`;

    const formattedContents = [];
    if (Array.isArray(history)) {
      history.slice(-6).forEach(h => {
        if (h && h.role && h.parts && h.parts[0]?.text) {
          formattedContents.push({
            role: h.role === "assistant" ? "model" : h.role,
            parts: [{ text: h.parts[0].text }]
          });
        }
      });
    }
    formattedContents.push({
      role: "user",
      parts: [{ text: userQuery }]
    });

    const payload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.15,
        maxOutputTokens: 600
      }
    };

    for (const modelName of modelsToTry) {
      try {
        const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const geminiRes = await fetch(endpointUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return res.status(200).json({
              reply: replyText,
              sources,
              provider: "gemini",
              model: modelName
            });
          }
        } else {
          const errText = await geminiRes.text();
          console.warn(`Gemini model ${modelName} returned status ${geminiRes.status}: ${errText}`);
        }
      } catch (err) {
        console.warn(`Error querying Gemini model ${modelName}:`, err.message);
      }
    }
  }

  // 2. Intelligent Fallback: Generate structured, accurate response from verified knowledge
  const fallbackReply = generateFallbackAnswer(userQuery, sources);
  return res.status(200).json({
    reply: fallbackReply,
    sources,
    provider: "portfolio-rag",
    info: apiKey ? "Gemini upstream fallback" : "Add GEMINI_API_KEY in Vercel project environment variables to activate live Gemini model."
  });
};

/**
 * Intelligent Fallback Synthesizer for Vercel Serverless
 */
function generateFallbackAnswer(query, sources) {
  const q = query.toLowerCase();

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
    return "You can reach out to Thilac Ramesh through the following channels:\n\n- **Email**: [thilacramesh@gmail.com](mailto:thilacramesh@gmail.com)\n- **LinkedIn**: [thilac-r-077a85285](https://www.linkedin.com/in/thilac-r-077a85285/)\n- **GitHub**: [@Thilac01](https://github.com/Thilac01)\n- **ORCID**: [0009-0008-2125-4890](https://orcid.org/0009-0008-2125-4890)\n- **Contact Form**: You can also use the live Send a Message form located directly at the bottom of this portfolio.";
  }

  if (q.includes("resume") || q.includes("cv") || q.includes("curriculum vitae") || q.includes("download cv")) {
    return "Thilac Ramesh's latest Curriculum Vitae is available for direct download on this portfolio via the **Download CV (PDF)** button, or directly via [CV.pdf](CV.pdf).";
  }

  // Certifications / CSWA
  if (q.includes("certification") || q.includes("certificate") || q.includes("cswa") || q.includes("dassault") || q.includes("credential")) {
    return "Thilac holds three authenticated credentials from **Dassault Systèmes**:\n\n1. **Certified SOLIDWORKS Associate (CSWA)** – Mechanical Design\n2. **CSWA – Additive Manufacturing (CSWA-AM)** – 3D printing topologies, slicing, and DFAM methodologies\n3. **CSWA – Sustainable Design (CSWA-SD)** – Life Cycle Assessment (LCA) and eco-auditing\n\nAll three certifications validate his expertise in parametric modeling, GD&T, FEA, and sustainable design.";
  }

  // Unitree / Quadruped / SLAM / WSO2
  if (q.includes("unitree") || q.includes("quadruped") || q.includes("dog") || q.includes("slam") || q.includes("wso2") || (q.includes("robot") && !q.includes("mincer"))) {
    return "Thilac is currently a **Robotics Research Team Member at WSO2 Research** (June 2026 – Present), developing autonomous navigation for the **Unitree Go2 EDU Quadruped Robot**:\n\n- **Drift Accuracy**: < 1.5 cm drift in localization.\n- **Sensors**: 4D LiDAR + RealSense Depth Camera + IMU with multi-sensor spatial extrinsics calibration.\n- **Control Frequency**: 30 Hz real-time processing loop.\n- **Architecture**: ROS 2, Nav2, FAST-LIO2 LiDAR SLAM, MuJoCo simulation, and ACSAR-E autonomous patrol dispatch.\n- **BIM Integration**: Converts architectural IFC/Revit digital twins into 2.5D elevation costmaps for facility patrol.";
  }

  // Planetary Gearbox / Meat Mincer
  if (q.includes("mincer") || q.includes("planetary") || q.includes("gearbox") || q.includes("meat")) {
    return "The **Two-Way Manual Meat Mincer with Planetary Gearbox** is a mechanical design project engineered at University of Peradeniya:\n\n- **Transmission**: 4.2 : 1 Epicyclic Planetary Gearbox for high mechanical advantage.\n- **Safety Factor**: Ns = 2.85 under peak cutting resistance.\n- **Structural Base**: Dual-lever Suction Vacuum Base resisting up to 150 N overturning moment.\n- **Materials**: Food-grade Stainless Steel 304 for food contact and low-friction POM Acetal gears.\n- **Design Rigor**: Analyzed using Lewis gear-tooth bending equations and von Mises failure criteria in SOLIDWORKS.";
  }

  // Orthosis / Knee Brace
  if (q.includes("brace") || q.includes("orthosis") || q.includes("knee") || q.includes("wedge")) {
    return "The **Universal Mechanical Brace (Adaptive Wedge Orthosis)** is an ergonomic biomechatronic joint mechanism:\n\n- **Topology Optimization**: Density-based optimization achieved a **34% mass reduction**.\n- **Range of Motion**: Continuous adjustable flexion stops from 0° to 135°.\n- **Impact Rating**: 1,200 N axial shock load resistance.\n- **Materials**: PA12 Carbon-Fiber composite (PA12-CF) with Titanium alloy pins.\n- **FEA**: Validated in SOLIDWORKS FEA, maintaining peak von Mises stress under 60% of material yield strength.";
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

  // General Bio / Default Overview
  if (sources && sources.length > 0) {
    const topSource = sources[0];
    return `**${topSource.title.replace("Project: ", "").replace("Competition: ", "")}**\n\n${topSource.content.split("\n").slice(0, 8).join("\n")}\n\n*Feel free to ask for more specific technical details, sensor configurations, or metrics!*`;
  }

  return "Thilac Ramesh is a Mechanical Engineering undergraduate at the **University of Peradeniya**, Sri Lanka, specializing in **Autonomous Robotics, LiDAR SLAM, ROS 2, and SOLIDWORKS Machine Design**.\n\nHe is currently a Robotics Research Team Member at **WSO2 Research**, developing autonomous patrol and BIM-integrated navigation with the **Unitree Go2 EDU quadruped platform**. Feel free to ask about his projects, certifications, research papers, or competitions!";
}
