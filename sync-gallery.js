/**
 * Sync Gallery Folders & Images
 * Scans the "gallery/" directory for subfolders and updates manifest.json and js/gallery-config.js.
 * Run using: node sync-gallery.js or double-click sync-gallery.bat
 */
const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, 'gallery');
const manifestPath = path.join(galleryDir, 'manifest.json');
const configJsPath = path.join(__dirname, 'js', 'gallery-config.js');

if (!fs.existsSync(galleryDir)) {
  console.log('Creating gallery directory...');
  fs.mkdirSync(galleryDir, { recursive: true });
}

// Read existing manifest if present to preserve custom titles/awards
let existingFolders = {};
if (fs.existsSync(manifestPath)) {
  try {
    const raw = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (raw.folders && Array.isArray(raw.folders)) {
      raw.folders.forEach(f => {
        existingFolders[f.folder] = f;
      });
    }
  } catch (e) {
    console.warn('Could not read existing manifest:', e.message);
  }
}

// Read subdirectories in gallery/
const entries = fs.readdirSync(galleryDir, { withFileTypes: true });
const subdirs = entries.filter(e => e.isDirectory()).map(e => e.name);

console.log(`Discovered ${subdirs.length} competition folders in gallery/:`, subdirs);

const foldersList = subdirs.map(folderName => {
  const existing = existingFolders[folderName] || {};
  const cleanName = folderName
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();

  // Count images inside folder
  const folderPath = path.join(galleryDir, folderName);
  const files = fs.readdirSync(folderPath);
  const imgFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

  return {
    id: folderName.toLowerCase().replace(/[^a-z0-9]/g, ''),
    folder: folderName,
    name: existing.name || cleanName,
    award: existing.award || "Official Competition Moment",
    organization: existing.organization || "Hackathon / Competition Summit",
    venue: existing.venue || "Sri Lanka / International",
    date: existing.date || "2025 / 2026",
    icon: existing.icon || "fas fa-trophy",
    badge: existing.badge || cleanName,
    imageCount: imgFiles.length,
    images: imgFiles
  };
});

// Write updated manifest.json
const manifestData = {
  version: "1.0",
  lastUpdated: new Date().toISOString(),
  folders: foldersList
};

fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2), 'utf8');
console.log('✅ Updated gallery/manifest.json');

// Write updated js/gallery-config.js
const configContent = `/**
 * Auto-Generated Gallery Folders & Configuration
 * Generated on: ${new Date().toLocaleString()}
 */
const GALLERY_CONFIG = {
  baseDir: "gallery",
  supportedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".PNG"],
  maxSequentialMisses: 2,
  maxProbePerFolder: 50,
  folders: ${JSON.stringify(foldersList.map(({ imageCount, images, ...rest }) => rest), null, 4)}
};
`;

fs.writeFileSync(configJsPath, configContent, 'utf8');
console.log('✅ Updated js/gallery-config.js');
console.log('Done! All competition folders are synced with the gallery feed.');
