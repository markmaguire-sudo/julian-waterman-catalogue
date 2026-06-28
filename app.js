/**
 * Julian Waterman — Contemporary Fine Art Catalogue Logic
 * Powered by vanilla ES6+ JavaScript, with offline PWA sync
 * Persisted using client-side LocalStorage
 * Written in UK English inline comments
 */

// Initial Seed Data for catalogue curation
const DEFAULT_COLLECTIONS = [
  {
    id: "col-abstract",
    name: "Ethereal Echoes",
    description: "An exploration of fluid colours, textured canvases, and non-representational forms that touch the subconscious.",
    coverImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "col-nature",
    name: "Silent Horizons",
    description: "Modernist landscape interpretations focusing on serenity, the interplay of light, and geographic simplicity.",
    coverImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "col-sculpture",
    name: "Tactile Realities",
    description: "Three-dimensional structures using organic woods, metals, and plaster to redefine physical space.",
    coverImage: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=800&q=80"
  }
];

const DEFAULT_ARTWORKS = [
  {
    id: "art-1",
    title: "Vortices of Serenity",
    description: "An intense, layered oil painting expressing the balance between chaos and stillness. Heavy brushstrokes and metallic accents.",
    year: "2025",
    medium: "Oil on Canvas",
    dimensions: "120cm x 120cm",
    collectionId: "col-abstract",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    createdAt: "2026-06-28T10:15:37.468Z"
  },
  {
    id: "art-2",
    title: "Pastel Drift",
    description: "Soft, geometric planes layered with fine acrylic washes. Evokes a feeling of passing clouds over an urban landscape.",
    year: "2025",
    medium: "Mixed Media & Acrylic",
    dimensions: "90cm x 110cm",
    collectionId: "col-abstract",
    image: "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    createdAt: "2026-06-28T10:15:37.468Z"
  },
  {
    id: "art-3",
    title: "Morning Mist",
    description: "Minimalist interpretation of a river valley at dawn. Painted with soft horizontal gradients of sage, cream, and deep pine.",
    year: "2026",
    medium: "Acrylic on Linen",
    dimensions: "150cm x 100cm",
    collectionId: "col-nature",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    createdAt: "2026-06-28T10:15:37.468Z"
  },
  {
    id: "art-4",
    title: "Monolithic Grace",
    description: "Hand-carved cedarwood structure highlighted with fine brass wire. Explores tension and structural balance.",
    year: "2024",
    medium: "Cedarwood & Brass",
    dimensions: "45cm x 20cm x 80cm",
    collectionId: "col-sculpture",
    image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    createdAt: "2026-06-28T10:15:37.468Z"
  },
  {
    id: "art-5",
    title: "Golden Hour Reflection",
    description: "Warm, textured study capturing the final direct rays of the sun touching a rugged mountain ridge.",
    year: "2026",
    medium: "Oil with Palette Knife",
    dimensions: "80cm x 80cm",
    collectionId: "col-nature",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    createdAt: "2026-06-28T10:15:37.468Z"
  }
];

// App State Management
let collections = [];
let artworks = [];
let messages = [];

// Filter States
let activeMediumFilter = "all";
let activeCollectionFilter = "all";
let searchQuery = "";

// Initialize App Databases on local browser cache
function initDatabase() {
  if (!localStorage.getItem("waterman_collections")) {
    localStorage.setItem("waterman_collections", JSON.stringify(DEFAULT_COLLECTIONS));
  }
  if (!localStorage.getItem("waterman_artworks")) {
    localStorage.setItem("waterman_artworks", JSON.stringify(DEFAULT_ARTWORKS));
  }
  if (!localStorage.getItem("waterman_messages")) {
    localStorage.setItem("waterman_messages", JSON.stringify([]));
  }

  // Load state from LocalStorage
  collections = JSON.parse(localStorage.getItem("waterman_collections"));
  artworks = JSON.parse(localStorage.getItem("waterman_artworks"));
  messages = JSON.parse(localStorage.getItem("waterman_messages"));
}

// UI Elements mapping
const loader = document.getElementById("loader");
const catalogueGrid = document.getElementById("catalogue-grid");
const collectionsBar = document.getElementById("collections-bar");
const searchInput = document.getElementById("catalogue-search");
const mediumFiltersContainer = document.getElementById("medium-filters");
const resultsCountText = document.getElementById("results-count");
const clearFiltersBtn = document.getElementById("clear-filters-btn");

// Contact Elements
const contactForm = document.getElementById("contact-form");
const contactSuccessAlert = document.getElementById("form-success-alert");

// Admin Elements
const adminToggleBtn = document.getElementById("admin-toggle-btn");
const adminPortal = document.getElementById("admin-portal");
const closeAdminBtn = document.getElementById("close-admin-btn");
const adminTabBtns = document.querySelectorAll(".admin-tab-btn");
const adminTabContents = document.querySelectorAll(".admin-tab-content");
const addArtworkForm = document.getElementById("add-artwork-form");
const addCollectionForm = document.getElementById("add-collection-form");
const artworkCollectionSelect = document.getElementById("art-collection");
const adminMessagesList = document.getElementById("admin-messages-list");
const unreadCountBadge = document.getElementById("unread-count");

// Modal Elements
const detailModal = document.getElementById("detail-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const modalImage = document.getElementById("modal-art-image");
const modalCollection = document.getElementById("modal-art-collection");
const modalTitle = document.getElementById("modal-art-title");
const modalYear = document.getElementById("modal-art-year");
const modalMedium = document.getElementById("modal-art-medium");
const modalDimensions = document.getElementById("modal-art-dimensions");
const modalDescription = document.getElementById("modal-art-description");
const modalInquireBtn = document.getElementById("modal-inquire-btn");

// Show/Hide top loading indicator for micro-actions
function triggerLoader() {
  loader.style.width = "40%";
  setTimeout(() => {
    loader.style.width = "100%";
    setTimeout(() => {
      loader.style.width = "0%";
    }, 300);
  }, 150);
}

// Populate the admin form's collection select menu
function updateCollectionDropdowns() {
  artworkCollectionSelect.innerHTML = `<option value="">Uncategorised / Single Work</option>`;
  collections.forEach(col => {
    const opt = document.createElement("option");
    opt.value = col.id;
    opt.textContent = col.name;
    artworkCollectionSelect.appendChild(opt);
  });
}

// Dynamically generate medium filter categories based on active artworks
function renderMediumFilters() {
  const mediumsSet = new Set();
  artworks.forEach(art => {
    // Normalise or group mediums to keep categories elegant and minimal
    const med = art.medium.split(" on ")[0].split(" with ")[0].trim();
    mediumsSet.add(med);
  });

  const uniqueMediums = Array.from(mediumsSet);
  
  mediumFiltersContainer.innerHTML = `
    <button class="filter-btn ${activeMediumFilter === "all" ? "active" : ""}" data-filter="all">All Mediums</button>
  `;

  uniqueMediums.forEach(med => {
    const isActive = activeMediumFilter.toLowerCase() === med.toLowerCase();
    const btn = document.createElement("button");
    btn.className = `filter-btn ${isActive ? "active" : ""}`;
    btn.dataset.filter = med;
    btn.textContent = med;
    mediumFiltersContainer.appendChild(btn);
  });

  // Attach event listeners to newly rendered filters
  document.querySelectorAll("#medium-filters .filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll("#medium-filters .filter-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      activeMediumFilter = e.target.dataset.filter;
      renderCatalogue();
    });
  });
}

// Render Curator-grade Collections Bar
function renderCollectionsBar() {
  collectionsBar.innerHTML = "";
  
  // Create an "All Collections" card first
  const allCard = document.createElement("div");
  allCard.className = `collection-card ${activeCollectionFilter === "all" ? "active-collection" : ""}`;
  allCard.style.border = activeCollectionFilter === "all" ? "2px solid var(--accent-gold)" : "1px solid var(--border-color)";
  allCard.innerHTML = `
    <img src="https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=800&q=80" alt="All Collections" />
    <div class="collection-card-overlay">
      <h4 class="collection-card-title">Complete Oeuvre</h4>
      <p class="collection-card-desc">View all curated series, prints, and studio experiments.</p>
    </div>
  `;
  allCard.addEventListener("click", () => {
    activeCollectionFilter = "all";
    triggerLoader();
    renderCollectionsBar();
    renderCatalogue();
  });
  collectionsBar.appendChild(allCard);

  // Render individual series
  collections.forEach(col => {
    const isSelected = activeCollectionFilter === col.id;
    const count = artworks.filter(a => a.collectionId === col.id).length;
    const card = document.createElement("div");
    card.className = "collection-card";
    if (isSelected) {
      card.style.border = "2px solid var(--accent-gold)";
    }
    card.innerHTML = `
      <img src="${col.coverImage}" alt="${col.name}" />
      <div class="collection-card-overlay">
        <h4 class="collection-card-title">${col.name}</h4>
        <p class="collection-card-desc">${count} work${count === 1 ? "" : "s"} — ${col.description}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      activeCollectionFilter = col.id;
      triggerLoader();
      renderCollectionsBar();
      renderCatalogue();
    });
    collectionsBar.appendChild(card);
  });
}

// Main Render Logic for the Art Catalogue Grid
function renderCatalogue() {
  catalogueGrid.innerHTML = "";

  // Perform multi-layered filtering
  const filteredArtworks = artworks.filter(art => {
    // 1. Medium Filter
    const matchesMedium = activeMediumFilter === "all" || 
      art.medium.toLowerCase().includes(activeMediumFilter.toLowerCase());

    // 2. Collection Filter
    const matchesCollection = activeCollectionFilter === "all" || 
      art.collectionId === activeCollectionFilter;

    // 3. Search Filter (title, medium, specs, or narrative text)
    const matchesSearch = !searchQuery || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.medium.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesMedium && matchesCollection && matchesSearch;
  });

  // Update showing indicators
  if (activeMediumFilter !== "all" || activeCollectionFilter !== "all" || searchQuery) {
    clearFiltersBtn.style.display = "inline-block";
    const activeColName = activeCollectionFilter === "all" ? "" : collections.find(c => c.id === activeCollectionFilter)?.name;
    resultsCountText.textContent = `Found ${filteredArtworks.length} artwork${filteredArtworks.length === 1 ? "" : "s"} matches ${activeColName ? `in "${activeColName}"` : ""}`;
  } else {
    clearFiltersBtn.style.display = "none";
    resultsCountText.textContent = `Showing all ${artworks.length} curated artworks`;
  }

  // Handle empty state
  if (filteredArtworks.length === 0) {
    catalogueGrid.innerHTML = `
      <div class="grid-empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <h4 style="font-family: var(--font-serif); font-size: 1.8rem; font-weight: 300; margin-bottom: 10px;">No Artworks Match Your Curation</h4>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Try resetting the filters or modifying your search keywords.</p>
      </div>
    `;
    return;
  }

  // Build fluid grid items
  filteredArtworks.forEach(art => {
    const colName = collections.find(c => c.id === art.collectionId)?.name || "Uncategorised Series";
    const card = document.createElement("div");
    card.className = "art-card";
    card.id = `artwork-${art.id}`;
    
    // Structure with lazy loading referrer policy
    card.innerHTML = `
      <div class="art-card-image-box">
        ${art.isFeatured ? `<span class="featured-badge">Featured</span>` : ""}
        <button class="art-card-delete-btn" data-id="${art.id}" title="Remove artwork from catalogue">&times;</button>
        <img src="${art.image}" alt="${art.title}" loading="lazy" referrerPolicy="no-referrer" />
        <div class="art-card-inspect-overlay">
          <span class="inspect-text">Inspect</span>
        </div>
      </div>
      <div class="art-card-details">
        <span class="art-card-collection">${colName}</span>
        <h3 class="art-card-title">${art.title}</h3>
        <div class="art-card-spec-row">
          <span class="art-card-spec">${art.medium}</span>
          <span>${art.year}</span>
        </div>
      </div>
    `;

    // Click artwork card to open detail view
    card.addEventListener("click", (e) => {
      // Avoid opening modal if the administrator clicked the delete button
      if (e.target.classList.contains("art-card-delete-btn")) return;
      openArtworkDetailModal(art);
    });

    // Delete button logic
    const deleteBtn = card.querySelector(".art-card-delete-btn");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`Are you sure you want to permanently remove "${art.title}" from the catalogue?`)) {
        deleteArtwork(art.id);
      }
    });

    catalogueGrid.appendChild(card);
  });
}

// Open Detail View Modal Overlay
function openArtworkDetailModal(art) {
  const colName = collections.find(c => c.id === art.collectionId)?.name || "Single Work";
  modalImage.src = art.image;
  modalImage.alt = art.title;
  modalCollection.textContent = colName;
  modalTitle.textContent = art.title;
  modalYear.textContent = art.year;
  modalMedium.textContent = art.medium;
  modalDimensions.textContent = art.dimensions;
  modalDescription.textContent = art.description || "No curatorial description provided for this artwork.";
  
  // Set inquiry template details
  modalInquireBtn.onclick = () => {
    document.getElementById("contact-section").scrollIntoView({ behavior: "smooth" });
    document.getElementById("contact-subject").value = `Inquiry regarding: ${art.title} (${art.year})`;
    document.getElementById("contact-message").value = `Dear Julian,\n\nI am interested in acquiring or learning more about your artwork titled "${art.title}" (${art.year}). Please let me know if it is available for acquisition.\n\nKind regards,`;
    closeModal();
  };

  detailModal.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Prevent body scroll
}

function closeModal() {
  detailModal.classList.add("hidden");
  document.body.style.overflow = "";
}

// Data Mutation Operations (Persisting directly to LocalStorage databases)
function saveArtwork(newArt) {
  artworks.push(newArt);
  localStorage.setItem("waterman_artworks", JSON.stringify(artworks));
  triggerLoader();
  renderCatalogue();
  renderMediumFilters();
  renderCollectionsBar();
}

function deleteArtwork(id) {
  artworks = artworks.filter(art => art.id !== id);
  localStorage.setItem("waterman_artworks", JSON.stringify(artworks));
  triggerLoader();
  renderCatalogue();
  renderMediumFilters();
  renderCollectionsBar();
}

function saveCollection(newCol) {
  collections.push(newCol);
  localStorage.setItem("waterman_collections", JSON.stringify(collections));
  triggerLoader();
  renderCollectionsBar();
  updateCollectionDropdowns();
}

// Studio Portal Panel Handlers
function toggleAdminPortal() {
  adminPortal.classList.toggle("hidden");
}

function switchAdminTab(targetTabId) {
  adminTabBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === targetTabId);
  });

  adminTabContents.forEach(content => {
    content.classList.toggle("hidden", content.id !== `tab-${targetTabId}`);
  });
}

// Render Direct Inquiries Inbox
function renderMessages() {
  adminMessagesList.innerHTML = "";
  
  if (messages.length === 0) {
    adminMessagesList.innerHTML = `<p class="empty-state-msg">No inquiries received yet.</p>`;
    unreadCountBadge.textContent = "0";
    unreadCountBadge.classList.add("hidden");
    return;
  }

  const unreadCount = messages.filter(m => !m.isRead).length;
  if (unreadCount > 0) {
    unreadCountBadge.textContent = unreadCount;
    unreadCountBadge.classList.remove("hidden");
  } else {
    unreadCountBadge.classList.add("hidden");
  }

  // Sort messages descending (most recent first)
  const sortedMessages = [...messages].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  sortedMessages.forEach(msg => {
    const card = document.createElement("div");
    card.className = `message-card ${msg.isRead ? "" : "unread"}`;
    
    const dateFormatted = new Date(msg.createdAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    card.innerHTML = `
      <div class="message-card-header">
        <div>
          <h5 class="message-sender">${msg.name}</h5>
          <span class="message-email">${msg.email}</span>
        </div>
        <span class="message-date">${dateFormatted}</span>
      </div>
      <h6 class="message-subject">${msg.subject || "No Subject"}</h6>
      <p class="message-body">${msg.message}</p>
      <div class="message-actions">
        ${!msg.isRead ? `<button class="message-action-btn read-btn" data-id="${msg.id}">Mark as Read</button>` : ""}
        <button class="message-action-btn message-delete-btn" data-id="${msg.id}">Delete</button>
      </div>
    `;

    // Mark Read Handler
    const readBtn = card.querySelector(".read-btn");
    if (readBtn) {
      readBtn.addEventListener("click", () => {
        markMessageAsRead(msg.id);
      });
    }

    // Delete message handler
    card.querySelector(".message-delete-btn").addEventListener("click", () => {
      if (confirm("Delete this inquiry permanently?")) {
        deleteMessage(msg.id);
      }
    });

    adminMessagesList.appendChild(card);
  });
}

function markMessageAsRead(id) {
  messages = messages.map(m => m.id === id ? { ...m, isRead: true } : m);
  localStorage.setItem("waterman_messages", JSON.stringify(messages));
  renderMessages();
}

function deleteMessage(id) {
  messages = messages.filter(m => m.id !== id);
  localStorage.setItem("waterman_messages", JSON.stringify(messages));
  renderMessages();
}

// Event Listeners Registration
function registerEventListeners() {
  
  // Search bar logic
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderCatalogue();
  });

  // Reset filters
  clearFiltersBtn.addEventListener("click", () => {
    activeMediumFilter = "all";
    activeCollectionFilter = "all";
    searchQuery = "";
    searchInput.value = "";
    document.querySelectorAll("#medium-filters .filter-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.filter === "all");
    });
    triggerLoader();
    renderCollectionsBar();
    renderCatalogue();
  });

  // Modal Closures
  closeModalBtn.addEventListener("click", closeModal);
  detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      adminPortal.classList.add("hidden");
    }
  });

  // Contact Form Submission
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const newMsg = {
      id: `msg-${Date.now()}`,
      name: document.getElementById("contact-name").value,
      email: document.getElementById("contact-email").value,
      subject: document.getElementById("contact-subject").value,
      message: document.getElementById("contact-message").value,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    messages.push(newMsg);
    localStorage.setItem("waterman_messages", JSON.stringify(messages));
    
    // Clear and alert success
    contactForm.reset();
    contactSuccessAlert.style.display = "block";
    renderMessages();
    
    setTimeout(() => {
      contactSuccessAlert.style.display = "none";
    }, 5000);
  });

  // Admin Studio Panel toggles
  adminToggleBtn.addEventListener("click", toggleAdminPortal);
  closeAdminBtn.addEventListener("click", () => adminPortal.classList.add("hidden"));

  adminTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      switchAdminTab(btn.dataset.tab);
    });
  });

  // Add Artwork Form submit
  addArtworkForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const newArt = {
      id: `art-${Date.now()}`,
      title: document.getElementById("art-title").value,
      year: document.getElementById("art-year").value,
      medium: document.getElementById("art-medium").value,
      dimensions: document.getElementById("art-dimensions").value,
      collectionId: document.getElementById("art-collection").value,
      image: document.getElementById("art-image-url").value,
      isFeatured: document.getElementById("art-featured").checked,
      createdAt: new Date().toISOString()
    };

    saveArtwork(newArt);
    addArtworkForm.reset();
    document.getElementById("art-year").value = new Date().getFullYear();
    alert("Artwork added successfully to the digital catalogue!");
  });

  // Add Collection Form submit
  addCollectionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const newCol = {
      id: `col-${Date.now()}`,
      name: document.getElementById("col-name").value,
      coverImage: document.getElementById("col-image").value,
      description: document.getElementById("col-desc").value
    };

    saveCollection(newCol);
    addCollectionForm.reset();
    alert("New curated collection created!");
  });

  // Window Online/Offline States detection for PWA status
  const statusBadge = document.getElementById("online-status-badge");
  
  function updateOnlineStatus() {
    if (navigator.onLine) {
      statusBadge.textContent = "Online";
      statusBadge.style.borderColor = "var(--border-color)";
      statusBadge.style.color = "var(--text-muted)";
    } else {
      statusBadge.textContent = "Offline (Local Cache)";
      statusBadge.style.borderColor = "var(--accent-gold)";
      statusBadge.style.color = "var(--accent-gold)";
    }
  }

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  updateOnlineStatus();
}

// Main Launch sequence
function launch() {
  initDatabase();
  updateCollectionDropdowns();
  renderMediumFilters();
  renderCollectionsBar();
  renderCatalogue();
  renderMessages();
  registerEventListeners();
  
  // Custom console validation to confirm JS is functional
  console.log("Julian Waterman Fine Art Catalogue: Boot sequence complete. DOM fully functional.");
}

// Trigger launch on document load
document.addEventListener("DOMContentLoaded", launch);
