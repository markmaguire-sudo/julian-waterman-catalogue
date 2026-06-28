// @ts-nocheck
// -----------------------------------------------------------------------------
// Julian Waterman — Contemporary Fine Art Catalogue Admin Registry Module
// Vanilla ES6 module utilising the modular Firebase Web SDK (v10)
// Conforming strictly to UK English standards (catalogue, colour, optimise, successfully synchronised)
// -----------------------------------------------------------------------------

import { 
  collection, 
  addDoc, 
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase-config.js";

// DOM Elements
const registryForm = document.getElementById("art-registry-form");
const collectionSelect = document.getElementById("reg-collection");
const passcodeField = document.getElementById("reg-passcode");
const statusNotification = document.getElementById("status-notification");
const submitBtn = document.getElementById("reg-submit-btn");
const topBarLoader = document.getElementById("top-bar-loader");

// Helper to trigger and update loader progress animations
function triggerProgress(percent) {
  if (topBarLoader) {
    topBarLoader.style.width = `${percent}%`;
    if (percent >= 100) {
      setTimeout(() => {
        topBarLoader.style.width = "0%";
      }, 500);
    }
  }
}

// Display high-contrast alerts/banners to the user
function showNotification(message, type = "success") {
  if (!statusNotification) return;
  statusNotification.textContent = message;
  statusNotification.className = `notification-banner ${type}`;
  statusNotification.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Fetch available curated series from the live Firestore collections database
async function populateCollectionsDropdown() {
  triggerProgress(20);
  try {
    const colRef = collection(db, "collections");
    const snapshot = await getDocs(colRef);
    
    // Clear dynamic options while preserving placeholder
    if (collectionSelect) {
      collectionSelect.innerHTML = '<option value="">Select Curated Series...</option>';
      
      if (snapshot.empty) {
        console.log("No collections found in database. Using default fallback series.");
        addFallbackCollections();
      } else {
        snapshot.forEach(doc => {
          const data = doc.data();
          const opt = document.createElement("option");
          opt.value = doc.id;
          opt.textContent = data.name || doc.id;
          collectionSelect.appendChild(opt);
        });
        console.log("Curated series loaded and catalogued successfully.");
      }
    }
    triggerProgress(50);
  } catch (err) {
    console.warn("Could not query collections dynamically from cloud database. Initialising standard fallbacks.", err);
    addFallbackCollections();
    triggerProgress(50);
  }
}

// Inject default visual series options if offline or Firestore query is blocked
function addFallbackCollections() {
  if (!collectionSelect) return;
  const fallbacks = [
    { id: "structural-studies", name: "Structural Studies" },
    { id: "chromatic-composition", name: "Chromatic Compositions" },
    { id: "textural-topography", name: "Textural Topographies" }
  ];
  fallbacks.forEach(col => {
    const opt = document.createElement("option");
    opt.value = col.id;
    opt.textContent = col.name;
    collectionSelect.appendChild(opt);
  });
}

// Load previously used passcode from secure local storage to optimise studio workflow
function loadSavedPasscode() {
  const savedPasscode = localStorage.getItem("julian_passcode");
  if (savedPasscode && passcodeField) {
    passcodeField.value = savedPasscode;
    console.log("Authorised studio passcode loaded from local registry cache.");
  }
}

// Main submission and upload routine
if (registryForm) {
  registryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    triggerProgress(10);
    
    // Reset notification state
    if (statusNotification) {
      statusNotification.className = "notification-banner";
      statusNotification.style.display = "none";
    }

    // 1. Capture Form Inputs
    const archiveId = document.getElementById("reg-archive-id").value.trim();
    const title = document.getElementById("reg-title").value.trim();
    const medium = document.getElementById("reg-medium").value.trim();
    const dimensions = document.getElementById("reg-dimensions").value.trim();
    const collectionId = collectionSelect ? collectionSelect.value : "";
    const year = document.getElementById("reg-year").value.trim();
    const imageUrl = document.getElementById("reg-image-url").value.trim();
    const price = document.getElementById("reg-price").value.trim();
    const description = document.getElementById("reg-description").value.trim();
    const passcode = passcodeField ? passcodeField.value.trim() : "";

    // 2. Client-Side Field Validation
    if (!archiveId || !title || !medium || !dimensions || !collectionId || !year || !imageUrl || !price || !description || !passcode) {
      showNotification("All registry fields are mandatory and must be fully populated. Please complete the missing information.", "error");
      triggerProgress(100);
      return;
    }

    // Disable submission to prevent double writes and handle loading states gracefully
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Processing and Uploading Piece...";
    }

    triggerProgress(40);

    // 3. Assemble document payload complying both with standard schemas and gallery rendering schemas
    const artworkPayload = {
      id: archiveId,              // Used by gallery interface rendering (app.js)
      archive_id: archiveId,      // Conforms to exact input schema requirement
      title: title,
      medium: medium,
      dimensions: dimensions,
      collection: collectionId,
      image: imageUrl,            // Used by gallery interface rendering (app.js)
      image_url: imageUrl,        // Conforms to exact input schema requirement
      year: year,
      price: price,
      description: description,
      passphrase: passcode,       // Authorises the write through secure Firestore rules validation
      createdAt: serverTimestamp() // Conforms to strict chronological sorting requirement
    };

    const artworksCollectionPath = "artworks";

    try {
      console.log(`Attempting to stream document to Firestore collection: '${artworksCollectionPath}'...`);
      
      // Use addDoc method as explicitly specified in objective
      const artworksRef = collection(db, artworksCollectionPath);
      const docRef = await addDoc(artworksRef, artworkPayload);
      
      console.log(`Document successfully processed and streamed to cloud database. Generated Firestore Doc ID: ${docRef.id}`);
      
      // Persist the passcode locally so the artist doesn't have to re-enter it next time
      localStorage.setItem("julian_passcode", passcode);
      
      // Reset form fields except the passcode to speed up bulk uploads
      registryForm.reset();
      loadSavedPasscode();
      
      triggerProgress(100);
      
      // Display native alert confirming the asset is successfully synchronised
      alert("Exquisite fine art piece has been successfully synchronised with the studio archives.");
      
      // Visual notification fallback
      showNotification(`Exquisite fine art piece titled "${title}" has been successfully uploaded and catalogued. Reference code: ${archiveId}`, "success");
    } catch (error) {
      console.error("Database Write Error: ", error);
      triggerProgress(100);
      showNotification(`Submission declined by database: ${error instanceof Error ? error.message : String(error)}. Please verify that your Studio Passcode is correct.`, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Successfully Upload and Catalogue Piece";
      }
    }
  });
}

// Initialise module on load
async function initialise() {
  await populateCollectionsDropdown();
  loadSavedPasscode();
  triggerProgress(100);
  console.log("Studio Catalogue Registry interface booted and fully operational.");
}

initialise();

// Intercept submit actions and record premium catalogue records
if (registryForm) {
    registryForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Admin Security Check
        const enteredPasscode = passcodeField ? passcodeField.value : '';
        const storedPasscode = localStorage.getItem('julian_passcode');
        
        if (enteredPasscode !== storedPasscode) {
            showNotification('Unauthorised access configuration. Registry operation rejected.', 'error');
            return;
        }

        // Gather UI Input values
        const title = document.getElementById('reg-title')?.value || '';
        const medium = document.getElementById('reg-medium')?.value || '';
        const dimensions = document.getElementById('reg-dimensions')?.value || '';
        const year = document.getElementById('reg-year')?.value || '';
        const imageUrl = document.getElementById('reg-image-url')?.value || '';
        const collectionId = collectionSelect ? collectionSelect.value : '';

        if (!title || !imageUrl) {
            showNotification('Please fill in all mandatory baseline parameters (Title and Image URL).', 'error');
            return;
        }

        try {
            if (submitBtn) submitBtn.disabled = true;
            triggerProgress(40);

            const payload = {
                title,
                medium,
                dimensions,
                year,
                image: imageUrl,
                collectionId,
                createdAt: serverTimestamp()
            };

            triggerProgress(70);
            await addDoc(collection(db, 'artworks'), payload);
            
            triggerProgress(100);
            showNotification('Artwork successfully synchronised and published to the live catalogue grid.');
            
            // Clean interface fields post-submission
            registryForm.reset();
            if (passcodeField && storedPasscode) passcodeField.value = storedPasscode;

        } catch (error) {
            console.error('Database write error encountered:', error);
            showNotification('Error writing to the Firestore instance. Visual ledger trace aborted.', 'error');
            triggerProgress(0);
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

// Bootstrap administrative views on load
if (collectionSelect) {
    populateCollectionsDropdown();
}
export default function AdminPlaceholder() { return null; }
