/**
 * Instagram-Style Competitions Gallery & Social Feed
 * Author: Thilac Ramesh Portfolio System
 * Features:
 * - Real-time instant search across titles, competitions, tags, awards, and narratives
 * - Live category filters with badge counters
 * - View mode switcher: Instagram Feed View vs Explore 3-Column Grid
 * - Heartbeat animated Like button with Instagram-formatted counters (e.g. 1,421 likes)
 * - Double-click / double-tap photo with big floating heart burst animation
 * - Interactive Instagram Comments Drawer & Modal with seeded community feedback
 * - Add new comments with live persistence in localStorage
 * - Quick emoji reactions (🔥, 👏, 🏆, 🚀, 🇱🇰, 💯)
 * - Share to clipboard with modern toast notifications
 * - Fullscreen high-resolution lightbox with keyboard navigation
 */

// Global State
let allCompetitions = [];
let filteredCompetitions = [];
let currentFilter = "all";
let currentSearchQuery = "";
let currentViewMode = "feed"; // 'feed' or 'grid'
let currentLightboxIndex = 0;
let currentCommentPostId = null;

// Initial Seed Data for Likes & Community Comments (No dummy data: starts clean at 0)
const SEED_SOCIAL_DATA = {};

// LocalStorage Keys for Real Likes & Comments (v3 ensures clean start from real interactions)
const STORAGE_LIKES_KEY = "thilac_gallery_liked_posts_v3";
const STORAGE_COUNTS_KEY = "thilac_gallery_post_likes_v3";
const STORAGE_COMMENTS_KEY = "thilac_gallery_comments_v3";
const STORAGE_SAVED_KEY = "thilac_gallery_saved_v3";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initGallery();
  initCompetitionsCollaborators();
});

/* ==========================================================================
   THEME SYNCHRONIZATION
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    themeToggleBtn.style.display = "none";
  }

  // Enforce LIGHT theme as default
  document.body.classList.remove("dark-theme");
  document.body.classList.add("light-theme");
  localStorage.setItem("site-theme", "light");
  updateThemeIcon(false);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-theme");
      if (isDark) {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        localStorage.setItem("site-theme", "light");
        updateThemeIcon(false);
      } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        localStorage.setItem("site-theme", "dark");
        updateThemeIcon(true);
      }
    });
  }
}

function updateThemeIcon(isDark) {
  const icon = document.querySelector("#theme-toggle-btn i");
  if (icon) {
    icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  }
}

/* ==========================================================================
   GALLERY INITIALIZATION & EVENT SETUP
   ========================================================================== */
function initGallery() {
  const rawData = typeof COMPETITIONS_DATA !== "undefined" ? COMPETITIONS_DATA : [];
  allCompetitions = [...rawData];
  filteredCompetitions = [...allCompetitions];

  // Setup Event Listeners
  setupSearchListener();
  setupFilterListeners();
  setupViewModeSwitcher();
  setupCommentsDrawerEvents();
  setupLightboxEvents();
  setupScrollTopButton();
  setupAuditSecurity();

  // Dynamic filter tabs & initial counts
  renderDynamicFilterTabs();
  updateCategoryCounts();
  updateGlobalStats();

  // Initial Render
  renderGallery();

  // Trigger automatic sequential numbered image detection (1, 2, 3...)
  discoverAndSyncGallery();
}

/* ==========================================================================
   DYNAMIC SUBFOLDER & SEQUENTIAL NUMBERED IMAGE AUTO-DISCOVERY
   ========================================================================== */
function probeImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ exists: true, url, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ exists: false, url });
    img.src = url;
  });
}

async function discoverAndSyncGallery() {
  // Try fetching gallery/manifest.json if served over HTTP/HTTPS
  try {
    const res = await fetch("gallery/manifest.json?t=" + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.folders)) {
        if (!window.GALLERY_CONFIG) window.GALLERY_CONFIG = {};
        window.GALLERY_CONFIG.folders = data.folders;
      }
    }
  } catch (e) {
    // Offline or file:/// fallback: GALLERY_CONFIG from js/gallery-config.js is already active
  }

  // Merge any custom folders registered in this browser
  try {
    const savedCustom = JSON.parse(localStorage.getItem("thilac_custom_folders") || "[]");
    if (Array.isArray(savedCustom) && savedCustom.length) {
      if (!window.GALLERY_CONFIG) window.GALLERY_CONFIG = {};
      if (!window.GALLERY_CONFIG.folders) window.GALLERY_CONFIG.folders = [];
      savedCustom.forEach(cf => {
        if (!window.GALLERY_CONFIG.folders.some(f => f.folder.toLowerCase() === cf.folder.toLowerCase())) {
          window.GALLERY_CONFIG.folders.push(cf);
        }
      });
    }
  } catch (e) {}

  const config = window.GALLERY_CONFIG || {
    baseDir: "gallery",
    supportedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".PNG"],
    maxSequentialMisses: 2,
    maxProbePerFolder: 50,
    folders: [
      { id: "datastorm", folder: "DATASTROM", name: "DataStorm 7.0", icon: "fas fa-chart-line" },
      { id: "nexushacks", folder: "NexusHacks", name: "NexusHacks 2026", icon: "fas fa-brain" }
    ]
  };

  const baseDir = config.baseDir || "gallery";
  const extensions = config.supportedExtensions || [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".PNG"];
  const maxMisses = config.maxSequentialMisses || 2;
  const maxProbe = config.maxProbePerFolder || 50;

  let discoveredAny = false;

  for (const folderObj of (config.folders || [])) {
    const folderName = folderObj.folder || folderObj.name;
    const folderId = (folderObj.id || folderName.toLowerCase()).replace(/[^a-z0-9]/g, "");
    let consecutiveMisses = 0;

    for (let num = 1; num <= maxProbe; num++) {
      let foundUrl = null;

      // Probe candidate paths for this number (both inside gallery/ and root folder fallback)
      for (const ext of extensions) {
        const candidates = [
          `${baseDir}/${folderName}/${num}${ext}`,
          `${folderName}/${num}${ext}`
        ];

        for (const candidate of candidates) {
          const probe = await probeImage(candidate);
          if (probe.exists) {
            foundUrl = candidate;
            break;
          }
        }
        if (foundUrl) break;
      }

      if (foundUrl) {
        consecutiveMisses = 0;

        // Check if an item for this image already exists in allCompetitions
        const existingIndex = allCompetitions.findIndex(item => {
          if (!item.image) return false;
          const cleanItemImg = item.image.replace(/\\/g, '/');
          const cleanFound = foundUrl.replace(/\\/g, '/');
          return cleanItemImg === cleanFound || 
                 cleanItemImg.endsWith(`${folderName}/${num}.jpg`) || 
                 cleanItemImg.endsWith(`${folderName}/${num}.png`) || 
                 cleanItemImg.endsWith(`${folderName}/${num}.webp`);
        });

        if (existingIndex !== -1) {
          // Existing registered moment: ensure resolved image path and filter tag are assigned
          const existingItem = allCompetitions[existingIndex];
          existingItem.image = foundUrl;
          if (!existingItem.filterTags) existingItem.filterTags = [];
          if (!existingItem.filterTags.includes(folderId)) existingItem.filterTags.push(folderId);
        } else {
          // Discovered a new image in this subfolder! Automatically create gallery card
          discoveredAny = true;
          const cleanName = folderObj.name || folderName.replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, '$1 $2');
          const newMomentId = `${folderId}-${num}`;
          
          const newMoment = {
            id: newMomentId,
            title: `${cleanName} – Visual Dispatch #${num}`,
            competition: cleanName,
            category: "moment",
            filterTags: [folderId, "all"],
            featured: false,
            award: folderObj.award || `${cleanName} Highlight`,
            badge: `#${num} Dispatch`,
            badgeType: num % 2 === 0 ? "accent-cyan" : "accent-purple",
            organization: folderObj.organization || "National Hackathon / Engineering Event",
            venue: folderObj.venue || "Sri Lanka",
            date: folderObj.date || "2025 / 2026",
            image: foundUrl,
            tags: [cleanName, "Moment", `#${num}`, "Visual Dispatch"],
            tagline: `High-resolution visual dispatch #${num} from ${cleanName}.`,
            story: `Moment captured during ${cleanName}. Automatically synchronized into the interactive visual feed from the competition gallery folder.`
          };

          allCompetitions.push(newMoment);
        }
      } else {
        consecutiveMisses++;
        if (consecutiveMisses >= maxMisses) {
          // Reached end of sequential numbered images in this folder
          break;
        }
      }
    }
  }

  // Refresh dynamic filter tabs, counters, and stage
  renderDynamicFilterTabs();
  updateCategoryCounts();
  updateGlobalStats();
  applyFiltersAndSearch();
}

/* ==========================================================================
   DYNAMIC FILTER TABS GENERATION
   ========================================================================== */
function renderDynamicFilterTabs() {
  const wrapper = document.getElementById("comp-filter-tabs-wrapper");
  if (!wrapper) return;

  const config = window.GALLERY_CONFIG || { folders: [] };
  const folders = config.folders || [];

  let html = `
    <button class="comp-filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">
      <i class="fas fa-layer-group"></i> All Moments <span class="comp-filter-count" id="count-all">${allCompetitions.length}</span>
    </button>
  `;

  folders.forEach(f => {
    const fId = (f.id || f.folder.toLowerCase()).replace(/[^a-z0-9]/g, "");
    const count = allCompetitions.filter(c => c.filterTags && (c.filterTags.includes(fId) || c.filterTags.includes(f.folder.toLowerCase()))).length;
    const iconClass = f.icon || "fas fa-trophy";
    html += `
      <button class="comp-filter-btn ${currentFilter === fId ? 'active' : ''}" data-filter="${fId}">
        <i class="${iconClass}"></i> ${escapeHtml(f.name || f.folder)} <span class="comp-filter-count" id="count-${fId}">${count}</span>
      </button>
    `;
  });

  const stageCount = allCompetitions.filter(c => c.filterTags && c.filterTags.includes("stage")).length;
  if (stageCount > 0) {
    html += `
      <button class="comp-filter-btn ${currentFilter === 'stage' ? 'active' : ''}" data-filter="stage">
        <i class="fas fa-microphone-alt"></i> Stage &amp; Pitch <span class="comp-filter-count" id="count-stage">${stageCount}</span>
      </button>
    `;
  }

  const podiumCount = allCompetitions.filter(c => c.filterTags && c.filterTags.includes("podium")).length;
  if (podiumCount > 0) {
    html += `
      <button class="comp-filter-btn ${currentFilter === 'podium' ? 'active' : ''}" data-filter="podium">
        <i class="fas fa-medal"></i> Podium &amp; Awards <span class="comp-filter-count" id="count-podium">${podiumCount}</span>
      </button>
    `;
  }

  wrapper.innerHTML = html;
}

function setupScrollTopButton() {
  const scrollTopBtn = document.getElementById("gallery-scroll-top-btn");
  if (!scrollTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 280) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  }, { passive: true });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ==========================================================================
   LOCAL STORAGE HELPERS FOR LIKES & COMMENTS
   ========================================================================== */
function getLikedPostIds() {
  try {
    const raw = localStorage.getItem(STORAGE_LIKES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLikedPostIds(ids) {
  try {
    localStorage.setItem(STORAGE_LIKES_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error(e);
  }
}

function getSavedPostIds() {
  try {
    const raw = localStorage.getItem(STORAGE_SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveSavedPostIds(ids) {
  try {
    localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error(e);
  }
}

function getStoredComments() {
  try {
    const raw = localStorage.getItem(STORAGE_COMMENTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveStoredComments(commentsObj) {
  try {
    localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(commentsObj));
  } catch (e) {
    console.error(e);
  }
}

function getStoredLikeCounts() {
  try {
    const raw = localStorage.getItem(STORAGE_COUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveStoredLikeCounts(countsObj) {
  try {
    localStorage.setItem(STORAGE_COUNTS_KEY, JSON.stringify(countsObj));
  } catch (e) {
    console.error(e);
  }
}

// Compute live like count for any post (Real count only)
function getPostLikeCount(postId) {
  const counts = getStoredLikeCounts();
  return counts[postId] || 0;
}

// Compute full list of comments for any post (Real comments only)
function getPostComments(postId) {
  const stored = getStoredComments();
  return stored[postId] || [];
}

// Format like counts with comma separators e.g. "1,421 likes"
function formatLikeCount(num) {
  return num.toLocaleString();
}

/* ==========================================================================
   SEARCH BAR & CATEGORY FILTERS
   ========================================================================== */
function setupSearchListener() {
  const searchInput = document.getElementById("gallery-search-input");
  const clearBtn = document.getElementById("search-clear-btn");

  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value.trim().toLowerCase();
    
    if (clearBtn) {
      clearBtn.classList.toggle("visible", currentSearchQuery.length > 0);
    }

    applyFiltersAndSearch();
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      currentSearchQuery = "";
      clearBtn.classList.remove("visible");
      searchInput.focus();
      applyFiltersAndSearch();
    });
  }
}

function setupFilterListeners() {
  const wrapper = document.getElementById("comp-filter-tabs-wrapper");
  if (!wrapper) return;

  wrapper.addEventListener("click", (e) => {
    const btn = e.target.closest(".comp-filter-btn");
    if (!btn || btn.id === "btn-quick-add-folder") return;

    wrapper.querySelectorAll(".comp-filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter || "all";
    applyFiltersAndSearch();
  });
}

function applyFiltersAndSearch() {
  filteredCompetitions = allCompetitions.filter(item => {
    // Category check
    let matchesCategory = true;
    if (currentFilter !== "all") {
      matchesCategory = item.filterTags && (item.filterTags.includes(currentFilter) || item.category === currentFilter);
    }

    // Search query check
    let matchesSearch = true;
    if (currentSearchQuery) {
      const searchTarget = [
        item.title || "",
        item.competition || "",
        item.organization || "",
        item.award || "",
        item.badge || "",
        item.venue || "",
        item.story || "",
        item.tagline || "",
        (item.tags || []).join(" ")
      ].join(" ").toLowerCase();

      matchesSearch = searchTarget.includes(currentSearchQuery);
    }

    return matchesCategory && matchesSearch;
  });

  // Update status text
  const statusEl = document.getElementById("search-status-text");
  if (statusEl) {
    if (currentSearchQuery) {
      statusEl.textContent = `Found ${filteredCompetitions.length} of ${allCompetitions.length} moments matching "${currentSearchQuery}"`;
    } else if (currentFilter !== "all") {
      statusEl.textContent = `Showing ${filteredCompetitions.length} moments in ${currentFilter.toUpperCase()}`;
    } else {
      statusEl.textContent = `Showing ${filteredCompetitions.length} moments`;
    }
  }

  renderGallery();
}

function updateCategoryCounts() {
  const allCountEl = document.getElementById("count-all");
  if (allCountEl) allCountEl.textContent = allCompetitions.length;

  const config = window.GALLERY_CONFIG || { folders: [] };
  (config.folders || []).forEach(f => {
    const fId = (f.id || f.folder.toLowerCase()).replace(/[^a-z0-9]/g, "");
    const el = document.getElementById(`count-${fId}`);
    if (el) {
      const c = allCompetitions.filter(item => item.filterTags && (item.filterTags.includes(fId) || item.filterTags.includes(f.folder.toLowerCase()))).length;
      el.textContent = c;
    }
  });

  ['stage', 'podium', 'modelx'].forEach(cat => {
    const el = document.getElementById(`count-${cat}`);
    if (el) {
      el.textContent = allCompetitions.filter(item => item.filterTags && item.filterTags.includes(cat)).length;
    }
  });
}

function updateGlobalStats() {
  const momentsEl = document.getElementById("total-moments-count");
  const likesEl = document.getElementById("total-likes-count");
  const commentsEl = document.getElementById("total-comments-count");

  if (momentsEl) momentsEl.textContent = allCompetitions.length;

  let totalLikes = 0;
  let totalComments = 0;

  allCompetitions.forEach(item => {
    totalLikes += getPostLikeCount(item.id);
    totalComments += getPostComments(item.id).length;
  });

  if (likesEl) {
    likesEl.textContent = totalLikes >= 1000 ? `${(totalLikes / 1000).toFixed(1)}K` : totalLikes.toString();
  }
  if (commentsEl) {
    commentsEl.textContent = totalComments.toString();
  }
}

/* ==========================================================================
   VIEW MODE SWITCHER (Feed View vs Explore Grid)
   ========================================================================== */
function setupViewModeSwitcher() {
  const btnFeed = document.getElementById("view-mode-feed");
  const btnGrid = document.getElementById("view-mode-grid");
  const container = document.getElementById("gallery-stage-container");

  if (!btnFeed || !btnGrid || !container) return;

  btnFeed.addEventListener("click", () => {
    if (currentViewMode === "feed") return;
    currentViewMode = "feed";
    btnFeed.classList.add("active");
    btnGrid.classList.remove("active");
    container.classList.remove("view-grid");
    container.classList.add("view-feed");
    renderGallery();
  });

  btnGrid.addEventListener("click", () => {
    if (currentViewMode === "grid") return;
    currentViewMode = "grid";
    btnGrid.classList.add("active");
    btnFeed.classList.remove("active");
    container.classList.remove("view-feed");
    container.classList.add("view-grid");
    renderGallery();
  });
}

/* ==========================================================================
   RENDER GALLERY (FEED OR GRID)
   ========================================================================== */
function renderGallery() {
  const container = document.getElementById("gallery-stage-container");
  if (!container) return;

  container.innerHTML = "";

  if (filteredCompetitions.length === 0) {
    container.innerHTML = `
      <div style="padding: 4rem 1rem; text-align: center; color: var(--text-muted); width: 100%;">
        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.4;"></i>
        <h3 style="color: var(--text-primary); margin-bottom: 0.5rem; font-size: 1.3rem;">No Moments Found</h3>
        <p style="max-width: 440px; margin: 0 auto 1.5rem auto; font-size: 0.92rem;">
          No national competitions or hackathon memories match "${escapeHtml(currentSearchQuery)}". Try clearing your search or selecting another category.
        </p>
        <button class="comp-filter-btn active" onclick="clearSearchAndReset()" style="margin: 0 auto;">
          <i class="fas fa-undo"></i> Reset Filters &amp; Search
        </button>
      </div>
    `;
    return;
  }

  if (currentViewMode === "feed") {
    renderFeedView(container);
  } else {
    renderGridView(container);
  }
}

// Reset search helper
window.clearSearchAndReset = function() {
  const searchInput = document.getElementById("gallery-search-input");
  const clearBtn = document.getElementById("search-clear-btn");
  if (searchInput) searchInput.value = "";
  if (clearBtn) clearBtn.classList.remove("visible");
  currentSearchQuery = "";
  currentFilter = "all";
  document.querySelectorAll(".comp-filter-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.filter === "all");
  });
  applyFiltersAndSearch();
};

window.handleGalleryImgError = function(imgEl, originalSrc) {
  if (!imgEl || imgEl._hasHandledError) return;
  imgEl._hasHandledError = true;
  if (originalSrc && originalSrc.startsWith("gallery/")) {
    const fallback = originalSrc.replace(/^gallery\//, "");
    imgEl.onerror = () => {
      imgEl.src = "assets/schematic-quadruped.svg";
    };
    imgEl.src = fallback;
  }
};

/* ==========================================================================
   FEED VIEW RENDERING (Instagram Timeline Posts)
   ========================================================================== */
function renderFeedView(container) {
  const likedPostIds = getLikedPostIds();
  const savedPostIds = getSavedPostIds();

  filteredCompetitions.forEach((item, index) => {
    const isLiked = likedPostIds.includes(item.id);
    const isSaved = savedPostIds.includes(item.id);
    const likeCount = getPostLikeCount(item.id);
    const comments = getPostComments(item.id);
    const recentComment = comments.length > 0 ? comments[comments.length - 1] : null;

    const tagsHtml = (item.tags || []).slice(0, 4).map(t => 
      `<span class="insta-tag-chip" onclick="handleTagClick('${escapeHtml(t)}')">#${escapeHtml(t.replace(/\s+/g, ''))}</span>`
    ).join(" ");

    const card = document.createElement("article");
    card.className = "insta-post-card";
    card.id = `post-${item.id}`;
    card.dataset.id = item.id;
    card.dataset.index = index;

    card.innerHTML = `
      <!-- Post Header -->
      <div class="insta-post-header">
        <div class="insta-author-left">
          <div class="insta-avatar-ring">
            <img src="PROFILE_PIC.jpg" alt="Thilac Ramesh" class="insta-avatar-img" />
          </div>
          <div class="insta-author-info">
            <div class="insta-author-name">
              thilac.ramesh <i class="fas fa-check-circle insta-verified-badge" title="Verified Engineering Profile"></i>
            </div>
            <div class="insta-post-location">
              <i class="fas fa-map-marker-alt" style="font-size: 0.7rem; color: var(--accent-cyan);"></i> ${escapeHtml(item.venue || item.organization || 'Sri Lanka')}
            </div>
          </div>
        </div>

        <button class="insta-post-menu-btn" title="Share or Inspect Post" onclick="triggerShare('${item.id}', '${escapeHtml(item.title)}')">
          <i class="fas fa-ellipsis-h"></i>
        </button>
      </div>

      <!-- Post Media Container with Double-tap Heart -->
      <div class="insta-media-frame" id="media-frame-${item.id}" title="Double-tap photo to like, or click to open high-resolution inspect view">
        <img src="${item.image}" alt="${escapeHtml(item.title)}" class="insta-post-img" loading="lazy" onerror="handleGalleryImgError(this, '${escapeHtml(item.image)}')" />
        
        <div class="insta-event-overlay-badge">
          <i class="fas fa-trophy"></i> ${escapeHtml(item.competition)}
        </div>

        <div class="insta-inspect-hint" title="Inspect Fullscreen (Esc)">
          <i class="fas fa-expand"></i>
        </div>

        <!-- Big Center Heart Burst for Double-Click -->
        <div class="insta-heart-burst" id="heart-burst-${item.id}">
          <i class="fas fa-heart"></i>
        </div>
      </div>

      <!-- Post Action Buttons -->
      <div class="insta-actions-bar">
        <div class="insta-actions-left">
          <!-- Heart Button with Heartbeat Animation -->
          <button 
            class="insta-action-btn heart-btn ${isLiked ? 'is-liked' : ''}" 
            id="heart-btn-${item.id}" 
            title="${isLiked ? 'Unlike' : 'Like'}"
            aria-label="${isLiked ? 'Unlike' : 'Like'} this moment"
            onclick="toggleLike('${item.id}')"
          >
            <i class="${isLiked ? 'fas fa-heart' : 'far fa-heart'}"></i>
          </button>

          <!-- Comment Button (Opens Drawer) -->
          <button 
            class="insta-action-btn comment-btn" 
            title="View & Add Comments"
            aria-label="View and add comments"
            onclick="openCommentsDrawer('${item.id}')"
          >
            <i class="far fa-comment"></i>
          </button>

          <!-- Share Button -->
          <button 
            class="insta-action-btn share-btn" 
            title="Share Moment"
            aria-label="Share moment"
            onclick="triggerShare('${item.id}', '${escapeHtml(item.title)}')"
          >
            <i class="far fa-paper-plane"></i>
          </button>
        </div>

        <!-- Bookmark / Save Button -->
        <button 
          class="insta-action-btn bookmark-btn ${isSaved ? 'is-saved' : ''}" 
          id="bookmark-btn-${item.id}" 
          title="${isSaved ? 'Remove from Saved' : 'Save to Collection'}"
          aria-label="${isSaved ? 'Remove from Saved' : 'Save to Collection'}"
          onclick="toggleBookmark('${item.id}')"
        >
          <i class="${isSaved ? 'fas fa-bookmark' : 'far fa-bookmark'}"></i>
        </button>
      </div>

      <!-- Instagram Likes Counter -->
      <div class="insta-likes-wrap">
        <div class="insta-likes-text" onclick="toggleLike('${item.id}')">
          <span class="insta-likes-count-num" id="likes-count-${item.id}">${formatLikeCount(likeCount)}</span> likes
        </div>
      </div>

      <!-- Caption & Story Narrative -->
      <div class="insta-caption-wrap">
        <div>
          <strong class="insta-caption-user">thilac.ramesh</strong>
          <span class="insta-caption-award-pill">
            <i class="fas fa-medal"></i> ${escapeHtml(item.award || item.badge || 'Honour')}
          </span>
        </div>

        <span class="insta-caption-title">${escapeHtml(item.title)}</span>

        <div class="insta-caption-text">
          <span id="caption-short-${item.id}">${escapeHtml(item.tagline || item.story.substring(0, 110))}</span>
          <span id="caption-full-${item.id}" style="display: none;">${escapeHtml(item.story)}</span>
          ${item.story.length > 110 ? `
            <button class="insta-caption-more-btn" id="caption-btn-${item.id}" onclick="toggleCaptionExpand('${item.id}')">
              ...more
            </button>
          ` : ''}
        </div>

        <div class="insta-tags-row">
          ${tagsHtml}
        </div>
      </div>

      <!-- Comments Counter & Quick Preview -->
      <div class="insta-comments-trigger-wrap">
        <button class="insta-view-comments-btn" onclick="openCommentsDrawer('${item.id}')">
          ${comments.length === 0 ? 'Be the first to comment...' : `View all <span id="comments-count-${item.id}">${comments.length}</span> comment${comments.length === 1 ? '' : 's'}`}
        </button>

        ${recentComment ? `
          <div class="insta-recent-comment-preview">
            <span class="insta-recent-comment-user">${escapeHtml(recentComment.author)}:</span>
            <span>${escapeHtml(recentComment.text)}</span>
          </div>
        ` : ''}
      </div>

      <!-- Post Timestamp -->
      <div class="insta-post-time">
        ${escapeHtml(item.date || 'OCTAVE DATASTORM')} &bull; NATIONAL CHAMPIONSHIP
      </div>

      <!-- Inline Mini Comment Form -->
      <form class="insta-card-comment-form" onsubmit="handleInlineCommentSubmit(event, '${item.id}')">
        <i class="far fa-smile" style="color: var(--text-muted); font-size: 1.1rem;"></i>
        <input 
          type="text" 
          class="insta-card-comment-input" 
          id="inline-comment-input-${item.id}" 
          placeholder="Add a comment for Thilac..."
          autocomplete="off"
          oninput="handleInlineInputChange('${item.id}')"
        />
        <button 
          type="submit" 
          class="insta-card-comment-submit" 
          id="inline-comment-btn-${item.id}" 
          disabled
        >
          Post
        </button>
      </form>
    `;

    // Attach Double-Tap / Double-Click Heart Burst Physics
    setupMediaInteractions(card, item, index);

    container.appendChild(card);
  });
}

/* ==========================================================================
   EXPLORE GRID VIEW RENDERING (3-Column Masonry Grid)
   ========================================================================== */
function renderGridView(container) {
  filteredCompetitions.forEach((item, index) => {
    const likeCount = getPostLikeCount(item.id);
    const comments = getPostComments(item.id);

    const tile = document.createElement("div");
    tile.className = "explore-grid-card";
    tile.dataset.id = item.id;
    tile.dataset.index = index;

    tile.innerHTML = `
      <img src="${item.image}" alt="${escapeHtml(item.title)}" class="explore-grid-img" loading="lazy" onerror="handleGalleryImgError(this, '${escapeHtml(item.image)}')" />
      
      <div class="explore-grid-badge">
        <i class="fas fa-trophy"></i> ${escapeHtml(item.competition)}
      </div>

      <div class="explore-grid-overlay">
        <div class="explore-grid-stats">
          <span class="explore-grid-stat likes">
            <i class="fas fa-heart"></i> ${formatLikeCount(likeCount)}
          </span>
          <span class="explore-grid-stat comments">
            <i class="fas fa-comment"></i> ${comments.length}
          </span>
        </div>
        <div class="explore-grid-title">${escapeHtml(item.title)}</div>
      </div>
    `;

    tile.addEventListener("click", () => {
      openLightbox(index);
    });

    container.appendChild(tile);
  });
}

/* ==========================================================================
   MEDIA INTERACTIONS (Double Click Heart Burst + Lightbox Click)
   ========================================================================== */
function setupMediaInteractions(card, item, index) {
  const mediaFrame = card.querySelector(`#media-frame-${item.id}`);
  if (!mediaFrame) return;

  let clickTimer = null;
  let clickCount = 0;

  mediaFrame.addEventListener("click", (e) => {
    clickCount++;
    if (clickCount === 1) {
      clickTimer = setTimeout(() => {
        clickCount = 0;
        // Single click: Open fullscreen lightbox
        openLightbox(index);
      }, 260);
    } else if (clickCount === 2) {
      clearTimeout(clickTimer);
      clickCount = 0;
      // Double click: Instagram Heart Burst!
      triggerHeartBurst(item.id);
    }
  });
}

// Big Heart Burst Animation and Auto-Like
function triggerHeartBurst(postId) {
  const burst = document.getElementById(`heart-burst-${postId}`);
  if (burst) {
    burst.classList.remove("animate");
    // Trigger reflow to restart animation
    void burst.offsetWidth;
    burst.classList.add("animate");
  }

  // Ensure post is liked
  const likedList = getLikedPostIds();
  if (!likedList.includes(postId)) {
    toggleLike(postId, false);
  }
}

/* ==========================================================================
   LIKE MECHANICS (Heartbeat animation + Instagram counter update)
   ========================================================================== */
window.toggleLike = function(postId, allowUnlike = true) {
  let likedList = getLikedPostIds();
  const isCurrentlyLiked = likedList.includes(postId);
  let counts = getStoredLikeCounts();
  let currentCount = counts[postId] || 0;

  if (isCurrentlyLiked && !allowUnlike) {
    // Keep liked if triggered by double-click
    return;
  }

  if (isCurrentlyLiked) {
    // Unlike
    likedList = likedList.filter(id => id !== postId);
    currentCount = Math.max(0, currentCount - 1);
  } else {
    // Like
    likedList.push(postId);
    currentCount += 1;
  }

  counts[postId] = currentCount;
  saveLikedPostIds(likedList);
  saveStoredLikeCounts(counts);

  // Quietly record audit trail in background for legitimacy verification
  recordAuditEntry(isCurrentlyLiked ? "unlike" : "like", postId);

  const updatedIsLiked = likedList.includes(postId);
  const updatedCount = currentCount;

  // Update Heart Button UI on Card
  const heartBtn = document.getElementById(`heart-btn-${postId}`);
  if (heartBtn) {
    heartBtn.classList.toggle("is-liked", updatedIsLiked);
    const icon = heartBtn.querySelector("i");
    if (icon) {
      icon.className = updatedIsLiked ? "fas fa-heart" : "far fa-heart";
    }
  }

  // Update Likes Count Text on Card
  const countEl = document.getElementById(`likes-count-${postId}`);
  if (countEl) {
    countEl.textContent = formatLikeCount(updatedCount);
    // Add quick pulse animation
    countEl.style.transform = "scale(1.2)";
    setTimeout(() => {
      countEl.style.transform = "scale(1)";
    }, 200);
  }

  // Update Lightbox if currently viewing this post
  const lightboxLikeBtn = document.getElementById("lightbox-like-btn");
  const lightboxLikesNum = document.getElementById("lightbox-likes-num");
  const currentPost = filteredCompetitions[currentLightboxIndex];
  if (currentPost && currentPost.id === postId) {
    if (lightboxLikeBtn) {
      lightboxLikeBtn.classList.toggle("is-liked", updatedIsLiked);
      const icon = lightboxLikeBtn.querySelector("i");
      if (icon) icon.className = updatedIsLiked ? "fas fa-heart" : "far fa-heart";
    }
    if (lightboxLikesNum) {
      lightboxLikesNum.textContent = formatLikeCount(updatedCount);
    }
  }

  // Update global summary stat
  updateGlobalStats();
};

/* ==========================================================================
   BOOKMARK / SAVE MECHANICS
   ========================================================================== */
window.toggleBookmark = function(postId) {
  let savedList = getSavedPostIds();
  const isSaved = savedList.includes(postId);

  if (isSaved) {
    savedList = savedList.filter(id => id !== postId);
    showToast("Moment removed from personal collection");
  } else {
    savedList.push(postId);
    showToast("Moment saved to personal collection! 🔖");
  }

  saveSavedPostIds(savedList);

  const bookmarkBtn = document.getElementById(`bookmark-btn-${postId}`);
  if (bookmarkBtn) {
    const updatedState = savedList.includes(postId);
    bookmarkBtn.classList.toggle("is-saved", updatedState);
    const icon = bookmarkBtn.querySelector("i");
    if (icon) {
      icon.className = updatedState ? "fas fa-bookmark" : "far fa-bookmark";
    }
  }
};

/* ==========================================================================
   SHARE MECHANICS
   ========================================================================== */
window.triggerShare = function(postId, title) {
  const shareUrl = window.location.href.split("#")[0] + `#post-${postId}`;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast(`Link to "${title}" copied to clipboard! 📋`);
    }).catch(() => {
      showToast("Link ready to share!");
    });
  } else {
    showToast("Moment link ready to share!");
  }
};

/* ==========================================================================
   CAPTION EXPAND TOGGLE
   ========================================================================== */
window.toggleCaptionExpand = function(postId) {
  const shortEl = document.getElementById(`caption-short-${postId}`);
  const fullEl = document.getElementById(`caption-full-${postId}`);
  const btn = document.getElementById(`caption-btn-${postId}`);

  if (!shortEl || !fullEl || !btn) return;

  const isExpanded = fullEl.style.display !== "none";
  if (isExpanded) {
    fullEl.style.display = "none";
    shortEl.style.display = "inline";
    btn.textContent = "...more";
  } else {
    fullEl.style.display = "inline";
    shortEl.style.display = "none";
    btn.textContent = " less";
  }
};

/* ==========================================================================
   TAG CLICK FILTER
   ========================================================================== */
window.handleTagClick = function(tag) {
  const searchInput = document.getElementById("gallery-search-input");
  const clearBtn = document.getElementById("search-clear-btn");
  if (searchInput) {
    searchInput.value = tag;
    currentSearchQuery = tag.toLowerCase();
    if (clearBtn) clearBtn.classList.add("visible");
    applyFiltersAndSearch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

/* ==========================================================================
   INLINE MINI COMMENT SUBMIT (Directly on post card)
   ========================================================================== */
window.handleInlineInputChange = function(postId) {
  const input = document.getElementById(`inline-comment-input-${postId}`);
  const btn = document.getElementById(`inline-comment-btn-${postId}`);
  if (input && btn) {
    btn.disabled = input.value.trim().length === 0;
  }
};

window.handleInlineCommentSubmit = function(e, postId) {
  e.preventDefault();
  const input = document.getElementById(`inline-comment-input-${postId}`);
  if (!input || !input.value.trim()) return;

  const commentText = input.value.trim();
  addNewComment(postId, "You (Guest Engineer)", commentText);

  input.value = "";
  handleInlineInputChange(postId);
  showToast("Comment published! 🎉");
};

/* ==========================================================================
   INTERACTIVE INSTAGRAM COMMENTS MODAL / DRAWER
   ========================================================================== */
function setupCommentsDrawerEvents() {
  const modal = document.getElementById("insta-comments-modal");
  const backdrop = document.getElementById("comments-modal-backdrop");
  const closeBtn = document.getElementById("comments-close-btn");
  const submitForm = document.getElementById("comments-submit-form");

  if (closeBtn) closeBtn.addEventListener("click", closeCommentsDrawer);
  if (backdrop) backdrop.addEventListener("click", closeCommentsDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) {
      closeCommentsDrawer();
    }
  });

  // Quick reaction emojis
  const emojiChips = document.querySelectorAll(".emoji-chip");
  const commentTextarea = document.getElementById("comment-text-input");
  emojiChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const emoji = chip.dataset.emoji;
      if (commentTextarea) {
        commentTextarea.value = (commentTextarea.value ? commentTextarea.value + " " : "") + emoji;
        commentTextarea.focus();
      }
    });
  });

  // Full Drawer Form Submit
  if (submitForm) {
    submitForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!currentCommentPostId) return;

      const authorInput = document.getElementById("comment-author-name");
      const textInput = document.getElementById("comment-text-input");

      const author = authorInput && authorInput.value.trim() ? authorInput.value.trim() : "Visitor & Tech Enthusiast";
      const text = textInput ? textInput.value.trim() : "";

      if (!text) return;

      addNewComment(currentCommentPostId, author, text);

      if (textInput) textInput.value = "";
      showToast("Comment posted! 💬");
    });
  }
}

window.openCommentsDrawer = function(postId) {
  const modal = document.getElementById("insta-comments-modal");
  if (!modal) return;

  currentCommentPostId = postId;
  const post = allCompetitions.find(c => c.id === postId);
  if (!post) return;

  // Set Summary Banner
  const summaryImg = document.getElementById("comments-summary-img");
  const summaryEvent = document.getElementById("comments-summary-event");
  const summaryTitle = document.getElementById("comments-summary-title");

  if (summaryImg) summaryImg.src = post.image;
  if (summaryEvent) summaryEvent.textContent = post.competition;
  if (summaryTitle) summaryTitle.textContent = post.title;

  renderCommentsList(postId);

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
};

window.closeCommentsDrawer = function() {
  const modal = document.getElementById("insta-comments-modal");
  if (modal) modal.classList.remove("open");
  document.body.style.overflow = "";
};

function renderCommentsList(postId) {
  const listContainer = document.getElementById("comments-list-scroll");
  const badge = document.getElementById("modal-comments-badge");
  if (!listContainer) return;

  const comments = getPostComments(postId);
  if (badge) badge.textContent = comments.length;

  listContainer.innerHTML = "";

  if (comments.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
        <i class="far fa-comments" style="font-size: 2.5rem; opacity: 0.3; margin-bottom: 0.75rem;"></i>
        <p style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.3rem;">No comments yet</p>
        <p style="font-size: 0.85rem; margin: 0;">Be the first to share your thoughts or congratulations!</p>
      </div>
    `;
    return;
  }

  comments.forEach((c, idx) => {
    const item = document.createElement("div");
    item.className = "comment-item";

    const initials = c.author ? c.author.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "U";
    const avatarBg = c.avatarColor || "#0a66c2";

    item.innerHTML = `
      <div class="comment-user-avatar" style="background: ${avatarBg};">
        ${initials}
      </div>
      <div class="comment-content">
        <div class="comment-username-wrap">
          <span class="comment-username">${escapeHtml(c.author)}</span>
          ${c.role ? `<span class="comment-badge-pill">${escapeHtml(c.role)}</span>` : ''}
        </div>
        <div class="comment-text">${escapeHtml(c.text)}</div>
        <div class="comment-meta-row">
          <span>${escapeHtml(c.time || 'Just now')}</span>
          <button class="comment-like-btn" onclick="toggleCommentLike(this)">
            <i class="far fa-heart"></i> <span>${c.likes || 0}</span>
          </button>
        </div>
      </div>
    `;

    listContainer.appendChild(item);
  });

  // Scroll to bottom
  listContainer.scrollTop = listContainer.scrollHeight;
}

window.toggleCommentLike = function(btn) {
  const icon = btn.querySelector("i");
  const span = btn.querySelector("span");
  let count = parseInt(span.textContent, 10) || 0;
  const isLiked = btn.classList.contains("is-liked");

  if (isLiked) {
    btn.classList.remove("is-liked");
    if (icon) icon.className = "far fa-heart";
    span.textContent = Math.max(0, count - 1);
  } else {
    btn.classList.add("is-liked");
    if (icon) icon.className = "fas fa-heart";
    span.textContent = count + 1;
    // Heart pop animation
    btn.style.transform = "scale(1.25)";
    setTimeout(() => {
      btn.style.transform = "";
    }, 180);
  }
};

function addNewComment(postId, author, text) {
  const stored = getStoredComments();
  if (!stored[postId]) {
    stored[postId] = [];
  }

  const newComment = {
    id: "user-" + Date.now(),
    author: author,
    role: "Community Contributor",
    avatarColor: getRandomAvatarColor(),
    text: text,
    time: "Just now",
    likes: 0
  };

  stored[postId].push(newComment);
  saveStoredComments(stored);

  // Quietly record audit trail in background for legitimacy verification
  recordAuditEntry("comment", postId, {
    author: author,
    text: text,
    commentId: newComment.id
  }).then(auditData => {
    if (auditData) {
      newComment._audit = {
        fingerprintHash: auditData.fingerprintHash,
        ip: auditData.ip,
        location: auditData.location,
        device: auditData.device,
        browser: auditData.browser,
        timestamp: auditData.timestamp
      };
      saveStoredComments(stored);
    }
  }).catch(() => {});

  // Update Drawer UI
  if (currentCommentPostId === postId) {
    renderCommentsList(postId);
  }

  // Update Count on Card
  const allComments = getPostComments(postId);
  const cardCountEl = document.getElementById(`comments-count-${postId}`);
  if (cardCountEl) cardCountEl.textContent = allComments.length;

  // Update Lightbox if open
  const lightboxCommentsNum = document.getElementById("lightbox-comments-num");
  if (lightboxCommentsNum) lightboxCommentsNum.textContent = allComments.length;

  // Update global summary stat
  updateGlobalStats();
}

function getRandomAvatarColor() {
  const colors = ["#0a66c2", "#057642", "#7048e8", "#d97706", "#e1306c", "#0284c7", "#ea580c"];
  return colors[Math.floor(Math.random() * colors.length)];
}

/* ==========================================================================
   FULLSCREEN HIGH-RES LIGHTBOX MODAL
   ========================================================================== */
function setupLightboxEvents() {
  const lightbox = document.getElementById("comp-floating-lightbox");
  if (!lightbox) return;

  const closeBtn = document.getElementById("lightbox-btn-close");
  const prevBtn = document.getElementById("lightbox-nav-prev");
  const nextBtn = document.getElementById("lightbox-nav-next");
  const likeBtn = document.getElementById("lightbox-like-btn");
  const commentBtn = document.getElementById("lightbox-comment-btn");

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });
  }

  if (likeBtn) {
    likeBtn.addEventListener("click", () => {
      const currentItem = filteredCompetitions[currentLightboxIndex];
      if (currentItem) toggleLike(currentItem.id);
    });
  }

  if (commentBtn) {
    commentBtn.addEventListener("click", () => {
      const currentItem = filteredCompetitions[currentLightboxIndex];
      if (currentItem) {
        closeLightbox();
        openCommentsDrawer(currentItem.id);
      }
    });
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("comp-lightbox-stage")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
  });
}

function openLightbox(index) {
  const lightbox = document.getElementById("comp-floating-lightbox");
  if (!lightbox || !filteredCompetitions.length) return;

  currentLightboxIndex = index;
  updateLightboxContent();

  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("comp-floating-lightbox");
  if (!lightbox) return;

  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function navigateLightbox(dir) {
  const count = filteredCompetitions.length;
  if (!count) return;
  currentLightboxIndex = (currentLightboxIndex + dir + count) % count;
  updateLightboxContent();
}

function updateLightboxContent() {
  const item = filteredCompetitions[currentLightboxIndex];
  if (!item) return;

  const total = filteredCompetitions.length;

  const img = document.getElementById("lightbox-full-img");
  const newTabBtn = document.getElementById("lightbox-btn-newtab");
  if (img) {
    img.onerror = () => handleGalleryImgError(img, item.image);
    img.src = item.image;
    img.alt = item.title;
  }
  if (newTabBtn) newTabBtn.href = item.image;

  const badge = document.getElementById("lightbox-badge");
  const counter = document.getElementById("lightbox-counter");
  if (badge) badge.textContent = item.competition;
  if (counter) counter.textContent = `${currentLightboxIndex + 1} / ${total}`;

  const title = document.getElementById("lightbox-caption-title");
  const award = document.getElementById("lightbox-caption-award");
  const story = document.getElementById("lightbox-caption-story");
  const tagsContainer = document.getElementById("lightbox-caption-tags");

  if (title) title.textContent = item.title;
  if (award) {
    award.innerHTML = `<i class="fas fa-trophy"></i> ${escapeHtml(item.award || item.badge || '')} &bull; ${escapeHtml(item.organization || '')}`;
  }
  if (story) story.textContent = item.story || item.tagline;

  if (tagsContainer) {
    tagsContainer.innerHTML = (item.tags || [])
      .map(t => `<span class="comp-lightbox-tag">#${escapeHtml(t)}</span>`)
      .join("");
  }

  // Synchronize Like button state in Lightbox
  const likedList = getLikedPostIds();
  const isLiked = likedList.includes(item.id);
  const likeCount = getPostLikeCount(item.id);
  const comments = getPostComments(item.id);

  const likeBtn = document.getElementById("lightbox-like-btn");
  const likesNum = document.getElementById("lightbox-likes-num");
  const commentsNum = document.getElementById("lightbox-comments-num");

  if (likeBtn) {
    likeBtn.classList.toggle("is-liked", isLiked);
    const icon = likeBtn.querySelector("i");
    if (icon) icon.className = isLiked ? "fas fa-heart" : "far fa-heart";
  }
  if (likesNum) likesNum.textContent = formatLikeCount(likeCount);
  if (commentsNum) commentsNum.textContent = comments.length.toString();

  renderLightboxThumbnails();
}

function renderLightboxThumbnails() {
  const thumbsContainer = document.getElementById("lightbox-thumbs-strip");
  if (!thumbsContainer) return;

  thumbsContainer.innerHTML = "";
  filteredCompetitions.forEach((item, idx) => {
    const thumb = document.createElement("div");
    thumb.className = `comp-thumb-item ${idx === currentLightboxIndex ? "active" : ""}`;
    thumb.title = item.title;
    thumb.innerHTML = `<img src="${item.image}" alt="${escapeHtml(item.title)}" class="comp-thumb-img" onerror="handleGalleryImgError(this, '${escapeHtml(item.image)}')" />`;

    thumb.addEventListener("click", (e) => {
      e.stopPropagation();
      currentLightboxIndex = idx;
      updateLightboxContent();
    });

    thumbsContainer.appendChild(thumb);
  });
}

/* ==========================================================================
   TOAST NOTIFICATION HELPER
   ========================================================================== */
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById("gallery-toast");
  const text = document.getElementById("toast-message");
  if (!toast || !text) return;

  text.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

/* Helper HTML escape function */
function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ==========================================================================
   TEAM MEMBERS & COLLABORATORS CREDITS IN COMPETITIONS GALLERY
   ========================================================================== */
function initCompetitionsCollaborators() {
  const grid = document.getElementById("competitions-collab-grid");
  if (!grid) return;

  const compData = typeof getCompetitionCollabs === "function" 
    ? getCompetitionCollabs() 
    : (typeof COMPETITION_COLLAB_DATA !== "undefined" ? COMPETITION_COLLAB_DATA : []);

  const allCollabs = typeof getStoredCollaborators === "function" 
    ? getStoredCollaborators() 
    : (typeof COLLABORATORS_DATA !== "undefined" ? COLLABORATORS_DATA : []);

  grid.innerHTML = "";

  compData.forEach((comp, idx) => {
    const members = (comp.memberIds || [])
      .map(id => allCollabs.find(c => c.id === id))
      .filter(Boolean);

    const card = document.createElement("div");
    card.className = "comp-collab-card";
    card.id = `comp-gallery-card-${comp.filterId || idx}`;

    const avatarStackHtml = members.map(m => {
      const initials = (m.name || "TR")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(p => p[0].toUpperCase())
        .join("");
      return `<div class="comp-stack-avatar" title="${escapeHtml(m.name)}">${initials}</div>`;
    }).join("");

    const memberNamesHint = members.map(m => escapeHtml(m.name)).join(" &bull; ");
    const hasLivePortfolio = members.some(m => m.portfolioUrl && !m.portfolioUrl.includes("github.com/your-username") && m.portfolioUrl !== "https://github.com");

    card.innerHTML = `
      <div class="comp-collab-banner">
        <img src="${escapeHtml(comp.image)}" alt="${escapeHtml(comp.title)}" class="comp-collab-banner-img" loading="lazy" onerror="this.src='assets/model-x.png'" />
        <div class="comp-collab-banner-overlay"></div>
        <span class="comp-collab-date-pill"><i class="far fa-calendar-alt"></i> ${escapeHtml(comp.date)}</span>
        <span class="comp-collab-award-badge ${comp.style || 'gold'}">
          <i class="fas ${comp.icon || 'fa-trophy'}"></i> ${escapeHtml(comp.award)}
        </span>
      </div>

      <div class="comp-collab-content">
        <div class="comp-collab-header-group">
          <div class="comp-collab-org">
            <i class="fas fa-landmark"></i> ${escapeHtml(comp.organization)}
          </div>
          <h3 class="comp-collab-title">${escapeHtml(comp.title)}</h3>
          <p class="comp-collab-desc">${escapeHtml(comp.desc)}</p>
        </div>

        <div class="comp-collab-team-bar" role="button" tabindex="0" aria-label="Open team credits modal for ${escapeHtml(comp.title)}">
          <div class="comp-team-preview-left">
            <div class="comp-avatar-stack">
              ${avatarStackHtml}
            </div>
            <div class="comp-team-info">
              <div class="comp-team-count-row">
                <span class="comp-team-count">${members.length} Teammate${members.length > 1 ? 's' : ''}</span>
                ${hasLivePortfolio ? `<span class="comp-live-dot" title="Live portfolios connected"></span>` : ''}
              </div>
              <span class="comp-team-hint">${memberNamesHint}</span>
            </div>
          </div>
          <button class="comp-view-team-btn" type="button" aria-label="View team credits for ${escapeHtml(comp.title)}">
            <i class="fas fa-users"></i>
            <span>View Team</span>
          </button>
        </div>
      </div>
    `;

    const openModalTrigger = () => {
      if (typeof window.openTeamCreditsModal === "function") {
        window.openTeamCreditsModal(comp.id);
      }
    };

    const viewTeamBtn = card.querySelector(".comp-view-team-btn");
    const teamBar = card.querySelector(".comp-collab-team-bar");

    if (viewTeamBtn) {
      viewTeamBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModalTrigger();
      });
    }

    if (teamBar) {
      teamBar.addEventListener("click", openModalTrigger);
      teamBar.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModalTrigger();
        }
      });
    }

    grid.appendChild(card);
  });
}

/**
 * Ensure window.openTeamCreditsModal is available on competitions.html as well
 */
if (typeof window.openTeamCreditsModal !== "function") {
  window.openTeamCreditsModal = function(compId) {
    const compData = typeof getCompetitionCollabs === "function" 
      ? getCompetitionCollabs() 
      : (typeof COMPETITION_COLLAB_DATA !== "undefined" ? COMPETITION_COLLAB_DATA : []);
    
    const allCollabs = typeof getStoredCollaborators === "function" 
      ? getStoredCollaborators() 
      : (typeof COLLABORATORS_DATA !== "undefined" ? COLLABORATORS_DATA : []);

    const comp = compData.find(c => c.id === compId) || compData[0];
    if (!comp) return;

    const members = (comp.memberIds || [])
      .map(id => allCollabs.find(c => c.id === id))
      .filter(Boolean);

    let modalEl = document.getElementById("team-credits-modal-overlay");
    if (!modalEl) {
      modalEl = document.createElement("div");
      modalEl.id = "team-credits-modal-overlay";
      modalEl.className = "team-credits-modal-overlay";
      document.body.appendChild(modalEl);
    }

    const membersHtml = members.map(m => {
      const initials = (m.name || "TR")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(p => p[0].toUpperCase())
        .join("");

      const contribution = (comp.memberContributions && comp.memberContributions[m.id]) 
        || m.credit 
        || "Collaborated on architectural design, engineering modeling, and execution.";

      const hasRealPortfolio = m.portfolioUrl && !m.portfolioUrl.includes("github.com/your-username") && m.portfolioUrl !== "https://github.com";

      let portfolioBtnHtml = "";
      if (hasRealPortfolio) {
        portfolioBtnHtml = `
          <a href="${escapeHtml(m.portfolioUrl)}" target="_blank" rel="noopener noreferrer" class="team-modal-portfolio-btn" title="Explore ${escapeHtml(m.name)}'s Live Portfolio">
            <i class="fas fa-globe"></i>
            <span>Visit Personal Portfolio</span>
            <i class="fas fa-external-link-alt external-glyph"></i>
          </a>
        `;
      } else {
        portfolioBtnHtml = `
          <span class="team-modal-portfolio-btn placeholder" title="Personal portfolio link in preparation">
            <i class="fas fa-user-circle"></i>
            <span>Verified Teammate</span>
          </span>
        `;
      }

      let socialsHtml = "";
      if (m.linkedinUrl) {
        socialsHtml += `
          <a href="${escapeHtml(m.linkedinUrl)}" target="_blank" rel="noopener noreferrer" class="team-modal-social-btn" title="View LinkedIn Profile">
            <i class="fab fa-linkedin-in"></i>
          </a>
        `;
      }
      if (m.githubUrl) {
        socialsHtml += `
          <a href="${escapeHtml(m.githubUrl)}" target="_blank" rel="noopener noreferrer" class="team-modal-social-btn" title="View GitHub Profile">
            <i class="fab fa-github"></i>
          </a>
        `;
      }

      return `
        <div class="team-modal-member-card">
          <div class="team-modal-member-top">
            <div class="team-modal-avatar-col">
              <div class="team-modal-monogram">${initials}</div>
              <span class="collab-status-pip" title="Verified Collaborator"></span>
            </div>
            <div class="team-modal-info-col">
              <div class="team-modal-name-row">
                <h4 class="team-modal-member-name">${escapeHtml(m.name)}</h4>
                ${hasRealPortfolio ? `<span class="team-modal-live-tag"><i class="fas fa-circle-check"></i> Live Portfolio</span>` : ''}
              </div>
              <div class="team-modal-member-role">${escapeHtml(m.role)}</div>
              ${m.affiliation ? `<div class="team-modal-member-affil"><i class="fas fa-university"></i> ${escapeHtml(m.affiliation)}</div>` : ''}
            </div>
          </div>

          <div class="team-modal-contribution">
            <div class="team-modal-contrib-label"><i class="fas fa-medal"></i> Role in ${escapeHtml(comp.title)}</div>
            <p class="team-modal-contrib-text"><i class="fas fa-quote-left" style="margin-right: 0.35rem; opacity: 0.7;"></i>${escapeHtml(contribution)}</p>
          </div>

          <div class="team-modal-actions-row">
            ${portfolioBtnHtml}
            <div class="team-modal-socials-group">
              ${socialsHtml}
            </div>
          </div>
        </div>
      `;
    }).join("");

    modalEl.innerHTML = `
      <div class="team-credits-backdrop"></div>
      <div class="team-credits-dialog" role="dialog" aria-modal="true" aria-labelledby="credits-modal-title">
        <button class="team-credits-close-btn" type="button" aria-label="Close modal">
          <i class="fas fa-times"></i>
        </button>

        <div class="team-credits-modal-header" style="background-image: linear-gradient(180deg, rgba(11, 17, 32, 0.45) 0%, rgba(11, 17, 32, 0.92) 100%), url('${escapeHtml(comp.image)}');">
          <div class="team-credits-header-meta">
            <div class="team-credits-badge-row">
              <span class="comp-collab-award-badge ${comp.style || 'gold'}">
                <i class="fas ${comp.icon || 'fa-trophy'}"></i> ${escapeHtml(comp.award)}
              </span>
              <span class="team-credits-date-pill"><i class="far fa-calendar-alt"></i> ${escapeHtml(comp.date)}</span>
            </div>
            <h2 class="team-credits-modal-title" id="credits-modal-title">${escapeHtml(comp.title)}</h2>
            <div class="team-credits-modal-org"><i class="fas fa-landmark"></i> ${escapeHtml(comp.organization)}</div>
          </div>
        </div>

        <div class="team-credits-modal-body">
          <div class="team-credits-body-heading">
            <div class="team-credits-body-heading-left">
              <i class="fas fa-users-cog"></i>
              <span>Team Credits &amp; Co-Competitors</span>
            </div>
            <span class="team-credits-count-pill">${members.length} Collaborator${members.length > 1 ? 's' : ''}</span>
          </div>
          <p class="team-credits-body-sub">
            Honouring the engineers and researchers who built solutions, defended keynotes, and competed alongside me. Explore and connect with their personal portfolios.
          </p>

          <div class="team-credits-members-list">
            ${membersHtml}
          </div>
        </div>

        <div class="team-credits-modal-footer">
          <span class="team-credits-footer-text"><i class="fas fa-shield-halved"></i> Verified Competition Honours &amp; Team Credits</span>
          <button class="team-credits-done-btn" type="button">Close</button>
        </div>
      </div>
    `;

    requestAnimationFrame(() => {
      modalEl.classList.add("is-visible");
    });
    document.body.style.overflow = "hidden";

    const closeModal = () => {
      modalEl.classList.remove("is-visible");
      setTimeout(() => {
        document.body.style.overflow = "";
        if (modalEl.parentNode) {
          modalEl.innerHTML = "";
        }
      }, 280);
      document.removeEventListener("keydown", handleKeyDown);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const backdrop = modalEl.querySelector(".team-credits-backdrop");
    if (backdrop) backdrop.addEventListener("click", closeModal);

    const closeBtn = modalEl.querySelector(".team-credits-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    const doneBtn = modalEl.querySelector(".team-credits-done-btn");
    if (doneBtn) doneBtn.addEventListener("click", closeModal);
  };
}

/* ==========================================================================
   LEGITIMACY AUDIT, BROWSER FINGERPRINTING & ORIGIN TRACKING SUBSYSTEM
   (Confidential & Hidden from Public Visitors - Access via Ctrl+Shift+A)
   ========================================================================== */
const STORAGE_AUDIT_LOG_KEY = "thilac_gallery_audit_log_v1";

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex1 = Math.abs(hash).toString(16).padStart(8, "0");
  const hex2 = ((str.length * 2654435761) >>> 0).toString(16).padStart(8, "0");
  return `fp_${hex1.slice(0, 6)}${hex2.slice(0, 6)}`;
}

function detectDeviceType() {
  const ua = navigator.userAgent || "";
  if (/iPad|Tablet/i.test(ua)) return "Tablet";
  if (/Mobile|Android|iP(hone|od)/i.test(ua)) return "Mobile Device";
  if (/Macintosh/i.test(ua)) return "Desktop (macOS)";
  if (/Windows/i.test(ua)) return "Desktop (Windows)";
  if (/Linux/i.test(ua)) return "Desktop (Linux)";
  return "Desktop Device";
}

function detectBrowser() {
  const ua = navigator.userAgent || "";
  if (/Edg/i.test(ua)) return "Microsoft Edge";
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) return "Google Chrome";
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "Apple Safari";
  if (/Firefox/i.test(ua)) return "Mozilla Firefox";
  if (/Opera|OPR/i.test(ua)) return "Opera";
  return "Web Browser";
}

function getDeviceFingerprint() {
  const nav = window.navigator || {};
  const scr = window.screen || {};
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
  const rawParts = [
    nav.userAgent || "",
    nav.language || "",
    nav.platform || "",
    `${scr.width}x${scr.height}x${scr.colorDepth}`,
    tz,
    nav.hardwareConcurrency || "",
    nav.deviceMemory || ""
  ].join("###");

  return {
    hash: hashString(rawParts),
    timezone: tz,
    screen: `${scr.width}x${scr.height} (DPR ${window.devicePixelRatio || 1})`,
    language: nav.language || "Unknown",
    platform: nav.platform || "Unknown",
    device: detectDeviceType(),
    browser: detectBrowser()
  };
}

let cachedGeoData = null;
async function fetchClientGeoData() {
  if (cachedGeoData) return cachedGeoData;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      cachedGeoData = {
        ip: data.ip || "Direct IP",
        city: data.city || "Unknown City",
        region: data.region || "",
        country: data.country_name || "Unknown Country",
        countryCode: data.country_code || "",
        location: `${data.city || ''}, ${data.country_name || ''}`.replace(/^,\s*|,\s*$/g, "") || "Detected Location",
        org: data.org || ""
      };
      return cachedGeoData;
    }
  } catch (_) {
    // Timeout or adblocker - fallback
  }

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown Region";
  const regionName = tz.includes("/") ? tz.split("/")[1].replace(/_/g, " ") : tz;
  cachedGeoData = {
    ip: "Client IP (Protected)",
    city: regionName,
    region: tz,
    country: tz.includes("/") ? tz.split("/")[0] : "Global",
    countryCode: "",
    location: `Region: ${tz}`,
    org: "Local Network"
  };
  return cachedGeoData;
}

function getStoredAuditLog() {
  try {
    const raw = localStorage.getItem(STORAGE_AUDIT_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveStoredAuditLog(logArray) {
  try {
    const trimmed = logArray.slice(0, 500);
    localStorage.setItem(STORAGE_AUDIT_LOG_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error(e);
  }
}

async function recordAuditEntry(type, postId, details = {}) {
  const fp = getDeviceFingerprint();
  const geo = await fetchClientGeoData();
  const targetPost = allCompetitions.find(c => c.id === postId);

  const entry = {
    id: `audit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    type: type, // "like", "unlike", or "comment"
    postId: postId,
    postTitle: targetPost ? targetPost.title : postId,
    competition: targetPost ? targetPost.competition : "Gallery",
    author: details.author || (type.includes("like") ? "Visitor (Like)" : "Anonymous"),
    text: details.text || "",
    commentId: details.commentId || null,
    fingerprintHash: fp.hash,
    device: fp.device,
    browser: fp.browser,
    screen: fp.screen,
    timezone: fp.timezone,
    language: fp.language,
    ip: geo.ip,
    city: geo.city,
    country: geo.country,
    location: geo.location,
    org: geo.org,
    timestamp: new Date().toISOString(),
    displayTime: new Date().toLocaleString()
  };

  const logs = getStoredAuditLog();
  logs.unshift(entry);
  saveStoredAuditLog(logs);
  return entry;
}

function setupAuditSecurity() {
  window.addEventListener("keydown", (e) => {
    const isA = e.key === "A" || e.key === "a" || e.code === "KeyA";
    if (e.ctrlKey && e.shiftKey && isA) {
      e.preventDefault();
      verifyAndOpenAuditModal();
    }
  });

  const closeBtn = document.getElementById("audit-modal-close-btn");
  const backdrop = document.getElementById("audit-modal-backdrop");
  if (closeBtn) closeBtn.addEventListener("click", closeGalleryAuditModal);
  if (backdrop) backdrop.addEventListener("click", closeGalleryAuditModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeGalleryAuditModal();
  });

  // Filter buttons in audit modal
  const filterAll = document.getElementById("filter-audit-all");
  const filterComments = document.getElementById("filter-audit-comments");
  const filterLikes = document.getElementById("filter-audit-likes");
  if (filterAll) filterAll.addEventListener("click", () => renderAuditLogList("all"));
  if (filterComments) filterComments.addEventListener("click", () => renderAuditLogList("comment"));
  if (filterLikes) filterLikes.addEventListener("click", () => renderAuditLogList("like"));

  const exportBtn = document.getElementById("btn-export-audit");
  if (exportBtn) exportBtn.addEventListener("click", exportAuditLogJSON);

  const clearBtn = document.getElementById("btn-clear-audit");
  if (clearBtn) clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the confidential audit log?")) {
      localStorage.removeItem(STORAGE_AUDIT_LOG_KEY);
      renderAuditLogList();
      showToast("Audit log cleared.");
    }
  });
}

function verifyAndOpenAuditModal() {
  if (sessionStorage.getItem("thilac_admin_session") === "granted") {
    openGalleryAuditModal();
    return;
  }
  const pin = prompt("🔐 Gallery Audit Security Gate\nEnter 4-digit Passcode to inspect legitimacy log:");
  if (pin === "2026") {
    sessionStorage.setItem("thilac_admin_session", "granted");
    openGalleryAuditModal();
  } else if (pin !== null) {
    alert("Incorrect Passcode. Access denied.");
  }
}

function openGalleryAuditModal() {
  const modal = document.getElementById("gallery-audit-modal");
  if (!modal) return;
  renderAuditLogList("all");
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeGalleryAuditModal() {
  const modal = document.getElementById("gallery-audit-modal");
  if (!modal) return;
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

function renderAuditLogList(filterType = "all") {
  const container = document.getElementById("audit-entries-container");
  if (!container) return;

  const logs = getStoredAuditLog();
  const filtered = filterType === "all" ? logs : logs.filter(l => l.type === filterType || (filterType === "like" && l.type === "unlike"));

  // Update button active states
  ["all", "comments", "likes"].forEach(t => {
    const btn = document.getElementById(`filter-audit-${t}`);
    if (btn) {
      const isActive = (t === "all" && filterType === "all") || 
                       (t === "comments" && filterType === "comment") || 
                       (t === "likes" && filterType === "like");
      btn.className = isActive ? "btn btn-primary" : "btn btn-secondary";
    }
  });

  if (!filtered.length) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
        <i class="fas fa-shield-alt" style="font-size: 2.5rem; opacity: 0.25; margin-bottom: 0.75rem;"></i>
        <h4 style="color: var(--text-primary); margin: 0 0 0.35rem;">No Interactions Logged Yet</h4>
        <p style="font-size: 0.85rem; margin: 0;">Whenever someone likes or comments, their browser hash, origin location, and device details will appear here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="audit-entry-card" id="audit-entry-${item.id}">
      <div class="audit-entry-top">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="audit-type-pill ${item.type === 'comment' ? 'comment' : 'like'}">
            <i class="fas fa-${item.type === 'comment' ? 'comment' : 'heart'}"></i> ${item.type}
          </span>
          <strong style="color: var(--text-primary); font-size: 0.92rem;">${escapeHtml(item.author)}</strong>
          <span style="color: var(--text-muted); font-size: 0.78rem;">on <em>"${escapeHtml(item.postTitle || item.postId)}"</em></span>
        </div>
        <span style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(item.displayTime || item.timestamp)}</span>
      </div>

      ${item.text ? `
        <div class="audit-comment-quote">
          "${escapeHtml(item.text)}"
        </div>
      ` : ''}

      <div class="audit-meta-grid">
        <div class="audit-meta-item">
          <i class="fas fa-map-marker-alt" style="color: #ef4444;"></i>
          <span><strong>Location:</strong> ${escapeHtml(item.location || item.city || 'Unknown')}</span>
        </div>
        <div class="audit-meta-item">
          <i class="fas fa-network-wired" style="color: var(--accent-cyan);"></i>
          <span><strong>IP:</strong> ${escapeHtml(item.ip || 'Protected')}</span>
        </div>
        <div class="audit-meta-item">
          <i class="fas fa-laptop" style="color: #10b981;"></i>
          <span><strong>Device:</strong> ${escapeHtml(item.device || 'Desktop')} &bull; ${escapeHtml(item.browser || '')}</span>
        </div>
        <div class="audit-meta-item">
          <i class="fas fa-fingerprint" style="color: #f59e0b;"></i>
          <span><strong>Hash:</strong> <code class="audit-hash-code">${escapeHtml(item.fingerprintHash || 'fp_unknown')}</code></span>
        </div>
      </div>

      ${item.commentId ? `
        <div style="display: flex; justify-content: flex-end; margin-top: 0.25rem;">
          <button type="button" class="btn btn-outline" onclick="deleteCommentFromAudit('${item.postId}', '${item.commentId}', '${item.id}')" style="padding: 0.2rem 0.65rem; font-size: 0.72rem; color: #ef4444; border-color: rgba(239, 68, 68, 0.4);">
            <i class="fas fa-trash"></i> Delete Comment
          </button>
        </div>
      ` : ''}
    </div>
  `).join("");
}

window.deleteCommentFromAudit = function(postId, commentId, auditEntryId) {
  if (!confirm("Delete this comment permanently from the gallery?")) return;
  const stored = getStoredComments();
  if (stored[postId]) {
    stored[postId] = stored[postId].filter(c => c.id !== commentId);
    saveStoredComments(stored);
  }

  // Update logs
  const logs = getStoredAuditLog().filter(l => l.id !== auditEntryId);
  saveStoredAuditLog(logs);

  renderAuditLogList();
  renderGallery();
  updateGlobalStats();
  showToast("Comment deleted permanently.");
};

function exportAuditLogJSON() {
  const logs = getStoredAuditLog();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `gallery_audit_report_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Developer Console Legitimacy Audit Tool
window.getGalleryAuditReport = function() {
  const logs = getStoredAuditLog();
  console.log("%c🔒 GALLERY LEGITIMACY AUDIT REPORT (" + logs.length + " entries)", "color: #0ea5e9; font-weight: bold; font-size: 14px;");
  console.table(logs.map(l => ({
    Type: l.type,
    Author: l.author,
    Post: l.postTitle,
    Location: l.location,
    IP: l.ip,
    Device: l.device,
    Browser: l.browser,
    FingerprintHash: l.fingerprintHash,
    Time: l.displayTime,
    CommentText: l.text || "(like)"
  })));
  return logs;
};

