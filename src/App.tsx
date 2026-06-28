import React, { useState, useEffect } from "react";
import { 
  Plus, 
  FolderPlus, 
  Mail, 
  Trash2, 
  Edit3, 
  Check, 
  Heart, 
  Info, 
  X, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Lock, 
  Unlock, 
  Eye, 
  ChevronRight, 
  Clock, 
  SlidersHorizontal,
  ChevronLeft,
  Calendar,
  Layers
} from "lucide-react";
import { Collection, Artwork, ContactMessage } from "./types";
import { 
  isStaticMode, 
  getLocalData, 
  saveLocalArtwork, 
  deleteLocalArtwork, 
  saveLocalCollection, 
  deleteLocalCollection, 
  saveLocalMessage, 
  markLocalMessageRead, 
  deleteLocalMessage 
} from "./lib/storage";

export default function App() {
  // DB States
  const [collections, setCollections] = useState<Collection[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter/UI States
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedium, setSelectedMedium] = useState<string>("all");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  
  // Navigation
  const [activeView, setActiveView] = useState<"gallery" | "upload" | "collections" | "contact" | "messages">("gallery");
  
  // Portal / Admin State
  const [isAdmin, setIsAdmin] = useState(false);

  // Forms
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  const [newArtwork, setNewArtwork] = useState({
    title: "",
    description: "",
    year: new Date().getFullYear().toString(),
    medium: "",
    dimensions: "",
    collectionId: "",
    image: "",
    isFeatured: false
  });
  const [artworkSuccess, setArtworkSuccess] = useState(false);

  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    coverImage: ""
  });
  const [collectionSuccess, setCollectionSuccess] = useState(false);

  // Drag and Drop State
  const [isDragging, setIsDragging] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    if (isStaticMode()) {
      const data = getLocalData();
      setCollections(data.collections);
      setArtworks(data.artworks);
      setMessages(data.messages);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/data");
      if (!res.ok) throw new Error("Server response not OK");
      const data = await res.json();
      setCollections(data.collections || []);
      setArtworks(data.artworks || []);
      setMessages(data.messages || []);
    } catch (err) {
      console.warn("Backend API unavailable, falling back to local storage:", err);
      const data = getLocalData();
      setCollections(data.collections);
      setArtworks(data.artworks);
      setMessages(data.messages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle inquiry fill
  const handleInquire = (artwork: Artwork) => {
    setContactForm({
      name: "",
      email: "",
      subject: `Inquiry: "${artwork.title}"`,
      message: `Hello! I would love to receive more information (price, availability, shipping details) regarding the beautiful piece titled "${artwork.title}" (${artwork.year}, ${artwork.medium}, ${artwork.dimensions}). Thank you.`
    });
    setSelectedArtwork(null);
    setActiveView("contact");
    
    // Smooth scroll if viewing on mobile
    const element = document.getElementById("main-viewport");
    if (element) {
      element.scrollTop = 0;
    }
  };

  // Submit Contact Message
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    if (isStaticMode()) {
      saveLocalMessage(contactForm);
      setContactSuccess(true);
      setContactForm({ name: "", email: "", subject: "", message: "" });
      fetchData();
      setTimeout(() => setContactSuccess(false), 5000);
      return;
    }

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setContactSuccess(true);
        setContactForm({ name: "", email: "", subject: "", message: "" });
        fetchData();
        setTimeout(() => setContactSuccess(false), 5000);
      } else {
        throw new Error("Server response not OK");
      }
    } catch (err) {
      console.warn("Failed to send message to server, saving to browser storage:", err);
      saveLocalMessage(contactForm);
      setContactSuccess(true);
      setContactForm({ name: "", email: "", subject: "", message: "" });
      fetchData();
      setTimeout(() => setContactSuccess(false), 5000);
    }
  };

  // Submit New Artwork
  const handleArtworkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtwork.title || !newArtwork.image) {
      alert("Please provide both a Title and an Image/Sketch.");
      return;
    }

    if (isStaticMode()) {
      saveLocalArtwork(newArtwork);
      setArtworkSuccess(true);
      setNewArtwork({
        title: "",
        description: "",
        year: new Date().getFullYear().toString(),
        medium: "",
        dimensions: "",
        collectionId: "",
        image: "",
        isFeatured: false
      });
      fetchData();
      setTimeout(() => setArtworkSuccess(false), 3000);
      return;
    }

    try {
      const res = await fetch("/api/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArtwork)
      });
      if (res.ok) {
        setArtworkSuccess(true);
        setNewArtwork({
          title: "",
          description: "",
          year: new Date().getFullYear().toString(),
          medium: "",
          dimensions: "",
          collectionId: "",
          image: "",
          isFeatured: false
        });
        fetchData();
        setTimeout(() => setArtworkSuccess(false), 3000);
      } else {
        throw new Error("Server response not OK");
      }
    } catch (err) {
      console.warn("Failed to save artwork to server, saving to browser storage:", err);
      saveLocalArtwork(newArtwork);
      setArtworkSuccess(true);
      setNewArtwork({
        title: "",
        description: "",
        year: new Date().getFullYear().toString(),
        medium: "",
        dimensions: "",
        collectionId: "",
        image: "",
        isFeatured: false
      });
      fetchData();
      setTimeout(() => setArtworkSuccess(false), 3000);
    }
  };

  // Submit New Collection
  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollection.name) return;

    if (isStaticMode()) {
      saveLocalCollection(newCollection);
      setCollectionSuccess(true);
      setNewCollection({ name: "", description: "", coverImage: "" });
      fetchData();
      setTimeout(() => setCollectionSuccess(false), 3000);
      return;
    }

    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCollection)
      });
      if (res.ok) {
        setCollectionSuccess(true);
        setNewCollection({ name: "", description: "", coverImage: "" });
        fetchData();
        setTimeout(() => setCollectionSuccess(false), 3000);
      } else {
        throw new Error("Server response not OK");
      }
    } catch (err) {
      console.warn("Failed to save collection to server, saving to browser storage:", err);
      saveLocalCollection(newCollection);
      setCollectionSuccess(true);
      setNewCollection({ name: "", description: "", coverImage: "" });
      fetchData();
      setTimeout(() => setCollectionSuccess(false), 3000);
    }
  };

  // Delete Artwork
  const handleDeleteArtwork = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this artwork?")) return;

    if (isStaticMode()) {
      deleteLocalArtwork(id);
      fetchData();
      if (selectedArtwork?.id === id) {
        setSelectedArtwork(null);
      }
      return;
    }

    try {
      const res = await fetch(`/api/artworks/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
        if (selectedArtwork?.id === id) {
          setSelectedArtwork(null);
        }
      } else {
        throw new Error("Server response not OK");
      }
    } catch (err) {
      console.warn("Failed to delete artwork from server, processing in browser storage:", err);
      deleteLocalArtwork(id);
      fetchData();
      if (selectedArtwork?.id === id) {
        setSelectedArtwork(null);
      }
    }
  };

  // Delete Collection
  const handleDeleteCollection = async (id: string) => {
    if (!confirm("Delete this collection? Artworks in this collection will be moved to 'Uncategorized'.")) return;

    if (isStaticMode()) {
      deleteLocalCollection(id);
      fetchData();
      if (selectedCollectionId === id) {
        setSelectedCollectionId("all");
      }
      return;
    }

    try {
      const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
        if (selectedCollectionId === id) {
          setSelectedCollectionId("all");
        }
      } else {
        throw new Error("Server response not OK");
      }
    } catch (err) {
      console.warn("Failed to delete collection from server, processing in browser storage:", err);
      deleteLocalCollection(id);
      fetchData();
      if (selectedCollectionId === id) {
        setSelectedCollectionId("all");
      }
    }
  };

  // Mark Message as Read
  const handleMarkAsRead = async (id: string) => {
    if (isStaticMode()) {
      markLocalMessageRead(id);
      fetchData();
      return;
    }

    try {
      const res = await fetch(`/api/messages/${id}/read`, { method: "PUT" });
      if (res.ok) {
        fetchData();
      } else {
        throw new Error("Server response not OK");
      }
    } catch (err) {
      console.warn("Failed to mark message read on server, processing in browser storage:", err);
      markLocalMessageRead(id);
      fetchData();
    }
  };

  // Delete Message
  const handleDeleteMessage = async (id: string) => {
    if (isStaticMode()) {
      deleteLocalMessage(id);
      fetchData();
      return;
    }

    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      } else {
        throw new Error("Server response not OK");
      }
    } catch (err) {
      console.warn("Failed to delete message from server, processing in browser storage:", err);
      deleteLocalMessage(id);
      fetchData();
    }
  };

  // Handle Base64 file conversion
  const handleImageFile = (file: File, type: "artwork" | "collection") => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "artwork") {
        setNewArtwork(prev => ({ ...prev, image: reader.result as string }));
      } else {
        setNewCollection(prev => ({ ...prev, coverImage: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, type: "artwork" | "collection") => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0], type);
    }
  };

  // Compute unique mediums
  const uniqueMediums = React.useMemo(() => {
    const mediums = new Set<string>();
    artworks.forEach((art) => {
      if (art.medium) mediums.add(art.medium);
    });
    return Array.from(mediums);
  }, [artworks]);

  // Filter artworks
  const filteredArtworks = React.useMemo(() => {
    return artworks.filter((art) => {
      const matchesCollection = selectedCollectionId === "all" || art.collectionId === selectedCollectionId;
      const matchesMedium = selectedMedium === "all" || art.medium === selectedMedium;
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.medium.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.year.includes(searchQuery);

      return matchesCollection && matchesMedium && matchesSearch;
    });
  }, [artworks, selectedCollectionId, selectedMedium, searchQuery]);

  // Active Collection details
  const activeCollection = collections.find(c => c.id === selectedCollectionId);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f5f2ed] text-[#1a1a1a] font-sans antialiased">
      
      {/* 1. LEFT NAVIGATION SIDEBAR */}
      <aside className="w-full md:w-[340px] shrink-0 flex flex-col justify-between p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#d9d4cc] bg-[#f5f2ed]">
        <div className="space-y-10">
          {/* Studio Brand */}
          <div className="cursor-pointer group" onClick={() => { setActiveView("gallery"); setSelectedCollectionId("all"); }}>
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight leading-none text-[#1a1a1a] font-light">
              JULIAN<br />
              <span className="font-serif italic font-normal">WATERMAN</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#7a7772] font-semibold mt-2">
              Contemporary Fine Art Portfolio
            </p>
          </div>

          {/* Navigational Tabs */}
          <nav className="space-y-8">
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-[0.15em] block text-[#b0a080] font-bold">
                01 / Portfolio Catalogue
              </span>
              <button 
                onClick={() => { setActiveView("gallery"); setSelectedCollectionId("all"); }}
                className={`w-full text-left font-serif text-lg italic transition-all flex justify-between items-center ${
                  activeView === "gallery" && selectedCollectionId === "all"
                    ? "text-[#1a1a1a] font-semibold underline decoration-[#b0a080] underline-offset-4" 
                    : "text-[#7a7772] hover:text-[#1a1a1a]"
                }`}
                id="btn-nav-all-works"
              >
                <span>View Full Catalogue</span>
                <span className="text-xs font-sans not-italic bg-[#e2dfd9] px-2 py-0.5 rounded-sm">
                  {artworks.length}
                </span>
              </button>
            </div>

            {/* Collections sub-list */}
            <div className="space-y-2 pl-2 border-l border-[#d9d4cc]">
              <span className="text-[9px] uppercase tracking-[0.15em] block text-[#7a7772]/80 font-semibold">
                Collections
              </span>
              <ul className="space-y-2">
                {collections.map((col) => {
                  const count = artworks.filter(a => a.collectionId === col.id).length;
                  const isSelected = selectedCollectionId === col.id && activeView === "gallery";
                  return (
                    <li key={col.id}>
                      <button
                        onClick={() => {
                          setSelectedCollectionId(col.id);
                          setActiveView("gallery");
                        }}
                        className={`w-full text-left text-xs tracking-wide flex justify-between items-center transition-all ${
                          isSelected 
                            ? "text-[#1a1a1a] font-bold pl-1 border-l-2 border-[#b0a080]" 
                            : "text-[#5a5854] hover:text-[#1a1a1a] hover:translate-x-0.5 duration-150"
                        }`}
                        id={`btn-sidebar-col-${col.id}`}
                      >
                        <span className="truncate pr-2">{col.name}</span>
                        <span className="text-[10px] text-[#7a7772] italic shrink-0">({count})</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Management / Action buttons for Artist/Admin */}
            <div className="pt-6 border-t border-[#d9d4cc]/60 space-y-3">
              <span className="text-[9px] uppercase tracking-[0.15em] block text-[#b0a080] font-bold">
                02 / Studio Management
              </span>
              
              <button
                onClick={() => {
                  setIsAdmin(true);
                  setActiveView("upload");
                }}
                className={`w-full flex items-center justify-between border-b border-[#d9d4cc] pb-2 text-[11px] uppercase tracking-wider transition-colors ${
                  activeView === "upload" ? "text-[#1a1a1a] font-semibold border-[#1a1a1a]" : "text-[#5a5854] hover:text-[#1a1a1a]"
                }`}
                id="btn-sidebar-upload"
              >
                <span>Upload New Artwork</span>
                <Plus className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setIsAdmin(true);
                  setActiveView("collections");
                }}
                className={`w-full flex items-center justify-between border-b border-[#d9d4cc] pb-2 text-[11px] uppercase tracking-wider transition-colors ${
                  activeView === "collections" ? "text-[#1a1a1a] font-semibold border-[#1a1a1a]" : "text-[#5a5854] hover:text-[#1a1a1a]"
                }`}
                id="btn-sidebar-manage-collections"
              >
                <span>Manage Collections</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {isAdmin && (
                <button
                  onClick={() => setActiveView("messages")}
                  className={`w-full flex items-center justify-between border-b border-[#d9d4cc] pb-2 text-[11px] uppercase tracking-wider transition-colors ${
                    activeView === "messages" ? "text-[#1a1a1a] font-semibold border-[#1a1a1a]" : "text-[#5a5854] hover:text-[#1a1a1a]"
                  }`}
                  id="btn-sidebar-messages"
                >
                  <span className="flex items-center space-x-1.5">
                    <span>Inquiries</span>
                    {messages.filter(m => !m.isRead).length > 0 && (
                      <span className="bg-amber-600 text-white font-sans font-bold text-[9px] rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                        {messages.filter(m => !m.isRead).length}
                      </span>
                    )}
                  </span>
                  <Mail className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </nav>
        </div>

        {/* Footer / Contact Trigger */}
        <div className="mt-12 md:mt-0 space-y-6">
          <div className="p-4 bg-white/50 border border-white rounded-sm">
            <p className="text-[11px] leading-relaxed italic text-[#5a5854]">
              Currently accepting global commissions and exhibition inquiries. Studio physical visits by appointment only.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setActiveView("contact")}
              className={`w-full py-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 shadow-sm cursor-pointer ${
                activeView === "contact"
                  ? "bg-[#b0a080] text-white"
                  : "bg-[#1a1a1a] hover:bg-[#b0a080] text-white"
              }`}
              id="btn-sidebar-contact"
            >
              Contact Artist
            </button>

            {/* Portals Toggle */}
            <button
              onClick={() => {
                setIsAdmin(!isAdmin);
                if (isAdmin && (activeView === "upload" || activeView === "collections" || activeView === "messages")) {
                  setActiveView("gallery");
                }
              }}
              className="w-full flex items-center justify-center space-x-1.5 py-1.5 text-[9px] text-[#7a7772] hover:text-[#1a1a1a] uppercase tracking-widest transition-colors font-medium"
              id="btn-sidebar-portal-toggle"
            >
              {isAdmin ? (
                <>
                  <Unlock className="w-3 h-3 text-[#b0a080]" />
                  <span>Artist Mode: Active (Sign Out)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 opacity-60" />
                  <span>Enter Artist Portal</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT VIEWPORT */}
      <main id="main-viewport" className="flex-1 flex flex-col min-w-0 bg-[#f5f2ed] overflow-y-auto">
        
        {/* TOP STATUS/BREADCRUMB HEADER */}
        <header className="h-20 shrink-0 flex items-center justify-between px-6 md:px-12 border-b border-[#d9d4cc] bg-[#f5f2ed]/80 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex gap-4 md:gap-8 text-[10px] uppercase tracking-widest font-semibold text-[#7a7772]">
            <button 
              onClick={() => { setActiveView("gallery"); setSelectedCollectionId("all"); }}
              className={`hover:text-[#1a1a1a] ${activeView === "gallery" ? "text-[#1a1a1a] font-bold" : ""}`}
            >
              Exhibitions
            </button>
            <span className="opacity-30">/</span>
            <span className="text-[#1a1a1a] capitalize font-serif italic text-sm">
              {activeView === "gallery" ? (selectedCollectionId === "all" ? "All Works" : activeCollection?.name) : activeView}
            </span>
          </div>

          <div className="text-[10px] uppercase tracking-widest text-[#7a7772] hidden sm:block">
            San Francisco, CA — 2026
          </div>
        </header>

        {/* LOADING INDICATOR */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 rounded-full border-2 border-[#b0a080] border-t-transparent animate-spin mb-4"></div>
            <p className="font-serif italic text-lg text-[#7a7772]">Opening the vaults...</p>
          </div>
        ) : (
          <div className="flex-1 p-6 md:p-12 max-w-7xl w-full mx-auto">
            
            {/* VIEW A: GALLERY & PORTFOLIO */}
            {activeView === "gallery" && (
              <div className="space-y-12">
                {/* Collection Highlight Banner / Description */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#d9d4cc]">
                  <div className="max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-serif italic font-light text-[#1a1a1a] tracking-tight">
                      {selectedCollectionId === "all" ? "Full Master Catalogue" : activeCollection?.name}
                    </h2>
                    <p className="text-sm text-[#7a7772] mt-4 leading-relaxed font-sans">
                      {selectedCollectionId === "all" 
                        ? "A curation of sculptural installations, mixed media textiles, and heavy structural studies created in the Julian Waterman Studio." 
                        : activeCollection?.description}
                    </p>
                  </div>

                  {/* Filter Toolbar inside gallery */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Search Field */}
                    <div className="relative w-full sm:w-64">
                      <input
                        type="text"
                        placeholder="Search title, medium..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/60 border border-[#d9d4cc] px-4 py-2 pl-8 text-xs font-sans placeholder-[#7a7772]/70 focus:outline-none focus:border-[#b0a080] focus:bg-white rounded-sm"
                        id="artwork-search-input"
                      />
                      <svg className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#7a7772]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>

                    {/* Medium Selector */}
                    {uniqueMediums.length > 0 && (
                      <select
                        value={selectedMedium}
                        onChange={(e) => setSelectedMedium(e.target.value)}
                        className="bg-white/60 border border-[#d9d4cc] px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#b0a080] rounded-sm"
                        id="medium-filter-select"
                      >
                        <option value="all">All Mediums</option>
                        {uniqueMediums.map(med => (
                          <option key={med} value={med}>{med}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* ARTWORKS GRID */}
                {filteredArtworks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredArtworks.map((art) => (
                      <div 
                        key={art.id}
                        onClick={() => setSelectedArtwork(art)}
                        className="group bg-[#e2dfd9]/40 border border-[#d9d4cc]/60 hover:bg-[#e2dfd9]/60 hover:border-[#b0a080] rounded-sm p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                        id={`art-card-${art.id}`}
                      >
                        <div className="space-y-4">
                          {/* Image Container with Editorial frame */}
                          <div className="aspect-[4/3] bg-[#e2dfd9] relative overflow-hidden rounded-sm border border-[#d9d4cc]/40 flex items-center justify-center">
                            <img
                              src={art.image}
                              alt={art.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {art.isFeatured && (
                              <div className="absolute top-3 left-3 bg-[#faf9f6] border border-[#d9d4cc] text-[9px] uppercase tracking-widest px-2.5 py-1 font-semibold text-[#1a1a1a]">
                                FEATURED
                              </div>
                            )}
                            {isAdmin && (
                              <button
                                onClick={(e) => handleDeleteArtwork(art.id, e)}
                                className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-700 text-white p-2 rounded-sm shadow transition-transform hover:scale-110"
                                title="Delete Artwork"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Captions */}
                          <div className="space-y-1 text-left">
                            <div className="flex justify-between items-baseline">
                              <h3 className="font-serif text-lg font-medium text-[#1a1a1a] tracking-tight group-hover:text-[#b0a080] transition-colors">
                                {art.title}
                              </h3>
                              <span className="font-sans text-xs text-[#7a7772] font-semibold">{art.year}</span>
                            </div>
                            <p className="font-mono text-[10px] text-[#7a7772] uppercase tracking-widest">
                              {art.medium}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[#d9d4cc]/40 flex items-center justify-between">
                          <span className="text-[11px] font-sans text-[#7a7772] italic">
                            {art.dimensions}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a1a1a] group-hover:text-[#b0a080] transition-colors flex items-center gap-1">
                            <span>Inspect</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 border-2 border-dashed border-[#d9d4cc] rounded-sm max-w-lg mx-auto">
                    <ImageIcon className="w-12 h-12 text-[#7a7772]/50 mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-normal text-[#1a1a1a] mb-1">No Artworks Found</h3>
                    <p className="font-sans text-xs text-[#7a7772] max-w-sm mx-auto px-4">
                      No paintings or studies currently match your search filters. Try adjusting them or clear your search query.
                    </p>
                    <button 
                      onClick={() => { setSearchQuery(""); setSelectedMedium("all"); setSelectedCollectionId("all"); }}
                      className="mt-4 text-xs font-bold uppercase tracking-widest text-[#b0a080] hover:underline"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* VIEW B: UPLOAD / ADD ARTWORK */}
            {activeView === "upload" && (
              <div className="max-w-2xl mx-auto space-y-8 bg-white border border-[#d9d4cc] p-8 md:p-12 rounded-sm shadow-sm text-left">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#b0a080] font-bold block mb-1">
                    Studio Ingestion
                  </span>
                  <h2 className="text-3xl font-serif italic text-[#1a1a1a]">
                    Upload New Masterpiece
                  </h2>
                  <p className="text-xs text-[#7a7772] mt-2 leading-relaxed">
                    Add high-resolution photography of completed artworks, canvases, or tactile prototypes. 
                    Organize them immediately into structural collections.
                  </p>
                </div>

                {artworkSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs rounded-sm flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Artwork was successfully compiled and listed in the active database catalog!</span>
                  </div>
                )}

                <form onSubmit={handleArtworkSubmit} className="space-y-6">
                  {/* File Upload Section with Drag and Drop */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#7a7772] font-semibold mb-2">
                      Artwork Imagery *
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, "artwork")}
                      className={`border-2 border-dashed rounded-sm p-8 text-center transition-all cursor-pointer relative ${
                        isDragging ? "border-[#b0a080] bg-[#f0ede6]" : "border-[#d9d4cc] hover:border-[#b0a080] bg-[#f5f2ed]/50"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageFile(e.target.files[0], "artwork");
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="artwork-image-file-input"
                      />
                      
                      {newArtwork.image ? (
                        <div className="space-y-4">
                          <img 
                            src={newArtwork.image} 
                            alt="Preview" 
                            className="max-h-[220px] mx-auto object-contain rounded-sm border border-[#d9d4cc]"
                          />
                          <p className="text-xs text-stone-500">Image loaded. Click or drag another to replace.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="w-8 h-8 text-[#7a7772]/70 mx-auto" />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]">
                              Drag & Drop Image File
                            </p>
                            <p className="text-[11px] text-[#7a7772] mt-1">
                              Supports JPG, PNG, WEBP, or SVG formats (automatically serialized)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#7a7772] font-semibold mb-1">
                        Artwork Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Obscured Daylight Study"
                        value={newArtwork.title}
                        onChange={(e) => setNewArtwork(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-[#f5f2ed]/40 border border-[#d9d4cc] px-3 py-2 text-xs focus:outline-none focus:border-[#b0a080]"
                        id="new-artwork-title"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#7a7772] font-semibold mb-1">
                        Thematic Collection
                      </label>
                      <select
                        value={newArtwork.collectionId}
                        onChange={(e) => setNewArtwork(prev => ({ ...prev, collectionId: e.target.value }))}
                        className="w-full bg-[#f5f2ed]/40 border border-[#d9d4cc] px-3 py-2 text-xs focus:outline-none focus:border-[#b0a080]"
                        id="new-artwork-collection"
                      >
                        <option value="">Uncategorized / Independent Work</option>
                        {collections.map(col => (
                          <option key={col.id} value={col.id}>{col.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#7a7772] font-semibold mb-1">
                        Medium / Materials
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mixed Media & Gold Leaf on Linen"
                        value={newArtwork.medium}
                        onChange={(e) => setNewArtwork(prev => ({ ...prev, medium: e.target.value }))}
                        className="w-full bg-[#f5f2ed]/40 border border-[#d9d4cc] px-3 py-2 text-xs focus:outline-none focus:border-[#b0a080]"
                        id="new-artwork-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#7a7772] font-semibold mb-1">
                        Dimensions
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 150cm x 120cm"
                        value={newArtwork.dimensions}
                        onChange={(e) => setNewArtwork(prev => ({ ...prev, dimensions: e.target.value }))}
                        className="w-full bg-[#f5f2ed]/40 border border-[#d9d4cc] px-3 py-2 text-xs focus:outline-none focus:border-[#b0a080]"
                        id="new-artwork-dimensions"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#7a7772] font-semibold mb-1">
                        Year of Creation
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2026"
                        value={newArtwork.year}
                        onChange={(e) => setNewArtwork(prev => ({ ...prev, year: e.target.value }))}
                        className="w-full bg-[#f5f2ed]/40 border border-[#d9d4cc] px-3 py-2 text-xs focus:outline-none focus:border-[#b0a080]"
                        id="new-artwork-year"
                      />
                    </div>

                    <div className="flex items-center space-x-3 pt-6">
                      <input
                        type="checkbox"
                        id="new-artwork-featured"
                        checked={newArtwork.isFeatured}
                        onChange={(e) => setNewArtwork(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        className="h-4 w-4 rounded text-[#b0a080] border-[#d9d4cc] focus:ring-[#b0a080]"
                      />
                      <label htmlFor="new-artwork-featured" className="text-xs uppercase tracking-widest text-[#1a1a1a] font-semibold cursor-pointer">
                        Feature on Homepage / Slideshow
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#7a7772] font-semibold mb-1">
                      Artwork Description & Story
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Discuss the background concept, light integration, or physical weights of the creation..."
                      value={newArtwork.description}
                      onChange={(e) => setNewArtwork(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-[#f5f2ed]/40 border border-[#d9d4cc] px-3 py-2 text-xs focus:outline-none focus:border-[#b0a080]"
                      id="new-artwork-description"
                    />
                  </div>

                  <div className="pt-4 flex justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveView("gallery")}
                      className="px-6 py-3 border border-[#d9d4cc] hover:bg-stone-50 text-[10px] uppercase tracking-widest font-bold text-[#7a7772]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#1a1a1a] hover:bg-[#b0a080] text-white py-3 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300"
                      id="btn-submit-artwork"
                    >
                      Compile & Save Artwork
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* VIEW C: MANAGE COLLECTIONS */}
            {activeView === "collections" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
                {/* Create/Edit collection form */}
                <div className="lg:col-span-5 bg-white border border-[#d9d4cc] p-8 md:p-12 rounded-sm shadow-sm space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#b0a080] font-bold block mb-1">
                      Curation Panel
                    </span>
                    <h2 className="text-2xl font-serif italic text-[#1a1a1a]">
                      Create Thematic Collection
                    </h2>
                    <p className="text-xs text-[#7a7772] mt-2 leading-relaxed">
                      Create distinct collections to organize your works. This organizes your gallery and provides visitors structured curation.
                    </p>
                  </div>

                  {collectionSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-sm">
                      Collection has been successfully generated!
                    </div>
                  )}

                  <form onSubmit={handleCollectionSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#7a7772] font-semibold mb-1">
                        Collection Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sculptural Shadows"
                        value={newCollection.name}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#f5f2ed]/40 border border-[#d9d4cc] px-3 py-2 text-xs focus:outline-none focus:border-[#b0a080]"
                        id="new-collection-name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#7a7772] font-semibold mb-1">
                        Curator Summary / Description
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="What is the mood, philosophy, or aesthetic behind this specific subset of work?"
                        value={newCollection.description}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-[#f5f2ed]/40 border border-[#d9d4cc] px-3 py-2 text-xs focus:outline-none focus:border-[#b0a080]"
                        id="new-collection-description"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#7a7772] font-semibold mb-1">
                        Cover Image / Sketch URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={newCollection.coverImage}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, coverImage: e.target.value }))}
                        className="w-full bg-[#f5f2ed]/40 border border-[#d9d4cc] px-3 py-2 text-xs focus:outline-none focus:border-[#b0a080]"
                        id="new-collection-cover-url"
                      />
                      <p className="text-[10px] text-stone-500 mt-1">If blank, a sophisticated abstract default image will be applied.</p>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#1a1a1a] hover:bg-[#b0a080] text-white py-3 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300"
                      id="btn-submit-collection"
                    >
                      Establish Collection
                    </button>
                  </form>
                </div>

                {/* Current Collections Listing */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-[#1a1a1a] italic">
                      Active Collections ({collections.length})
                    </h3>
                    <p className="text-xs text-[#7a7772] mt-1">
                      Hover and edit or delete empty collections here. Artworks under deleted collections are automatically preserved as Uncategorized.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {collections.map((col) => {
                      const count = artworks.filter(a => a.collectionId === col.id).length;
                      return (
                        <div 
                          key={col.id} 
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white border border-[#d9d4cc] rounded-sm gap-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-sm bg-[#e2dfd9] overflow-hidden shrink-0">
                              <img 
                                src={col.coverImage || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=120&q=80"} 
                                alt={col.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-serif text-lg font-medium text-[#1a1a1a]">{col.name}</h4>
                              <p className="text-xs text-[#7a7772] line-clamp-1 max-w-[320px]">{col.description}</p>
                              <span className="inline-block mt-1 font-mono text-[10px] text-[#b0a080] font-bold">
                                Contains {count} work{count !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() => {
                                setSelectedCollectionId(col.id);
                                setActiveView("gallery");
                              }}
                              className="px-3 py-1.5 border border-[#d9d4cc] hover:bg-stone-50 text-[10px] uppercase tracking-widest font-bold"
                            >
                              Explore
                            </button>
                            <button
                              onClick={() => handleDeleteCollection(col.id)}
                              className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-sm transition-colors border border-red-200"
                              title="Delete Collection"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW D: CONTACT FORM */}
            {activeView === "contact" && (
              <div className="max-w-2xl mx-auto space-y-8 bg-white border border-[#d9d4cc] p-8 md:p-12 rounded-sm shadow-sm text-left">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#b0a080] font-bold block mb-1">
                    Direct Inquiry & Acquisition
                  </span>
                  <h2 className="text-3xl font-serif italic text-[#1a1a1a]">
                    Contact Julian Waterman Studio
                  </h2>
                  <p className="text-xs text-[#7a7772] mt-2 leading-relaxed">
                    Have an interest in a specific sculptural study, canvas acquisition, or bespoke commission? 
                    Submit your details and we will coordinate response details promptly.
                  </p>
                </div>

                {contactSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs rounded-sm flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Your studio inquiry has been successfully dispatched! Julian or an assistant will contact you.</span>
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#7a7772] font-semibold mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Eleanor Vance"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#f5f2ed]/40 border border-[#d9d4cc] px-3 py-2 text-xs focus:outline-none focus:border-[#b0a080]"
                        id="contact-name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#7a7772] font-semibold mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="eleanor@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-[#f5f2ed]/40 border border-[#d9d4cc] px-3 py-2 text-xs focus:outline-none focus:border-[#b0a080]"
                        id="contact-email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#7a7772] font-semibold mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Inquiry on Sculptural Shadows Installation"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full bg-[#f5f2ed]/40 border border-[#d9d4cc] px-3 py-2 text-xs focus:outline-none focus:border-[#b0a080]"
                      id="contact-subject"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#7a7772] font-semibold mb-1">
                      Detailed Message / Intent *
                    </label>
                    <textarea
                      rows={6}
                      required
                      placeholder="Share details about your architectural site, specific pieces of interest, or budget parameters..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full bg-[#f5f2ed]/40 border border-[#d9d4cc] px-3 py-2 text-xs focus:outline-none focus:border-[#b0a080]"
                      id="contact-message"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1a1a1a] hover:bg-[#b0a080] text-white py-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300"
                    id="btn-submit-contact-form"
                  >
                    Submit Studio Inquiry
                  </button>
                </form>
              </div>
            )}

            {/* VIEW E: VIEW INQUIRIES (ADMIN PORTAL ONLY) */}
            {activeView === "messages" && isAdmin && (
              <div className="space-y-6 text-left">
                <div>
                  <h2 className="text-3xl font-serif italic text-[#1a1a1a]">
                    Studio Incoming Inquiries ({messages.length})
                  </h2>
                  <p className="text-xs text-[#7a7772] mt-1">
                    Inbox of active clients, gallery curators, and patrons seeking contact.
                  </p>
                </div>

                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`border rounded-sm p-6 transition-all bg-white hover:shadow-sm ${
                          msg.isRead ? "border-[#d9d4cc] opacity-75" : "border-[#b0a080] shadow-sm ring-1 ring-[#b0a080]/30"
                        }`}
                        id={`msg-card-${msg.id}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#d9d4cc]/40">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-serif text-lg font-medium text-[#1a1a1a]">
                                {msg.name}
                              </h3>
                              {!msg.isRead && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] uppercase px-2 py-0.5 font-bold tracking-widest rounded-full">
                                  New Inquiry
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#b0a080] font-mono mt-0.5">
                              {msg.email}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2 text-xs text-[#7a7772]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{new Date(msg.createdAt).toLocaleString()}</span>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-widest font-semibold text-[#7a7772]">
                            Subject: {msg.subject}
                          </p>
                          <p className="text-xs font-sans text-stone-700 leading-relaxed bg-[#f5f2ed]/50 p-4 border border-[#d9d4cc]/40 italic">
                            "{msg.message}"
                          </p>
                        </div>

                        <div className="mt-4 pt-4 flex justify-end space-x-2">
                          {!msg.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(msg.id)}
                              className="px-3 py-1.5 bg-stone-900 hover:bg-[#b0a080] text-white text-[10px] uppercase tracking-wider font-bold rounded-sm transition-colors flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Mark Read</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 text-[10px] uppercase tracking-wider font-bold rounded-sm transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white border border-[#d9d4cc] rounded-sm max-w-lg mx-auto">
                      <Mail className="w-12 h-12 text-[#7a7772]/40 mx-auto mb-4" />
                      <h3 className="font-serif text-xl font-normal text-[#1a1a1a] mb-1">Inbox Empty</h3>
                      <p className="font-sans text-xs text-[#7a7772] max-w-xs mx-auto px-4">
                        Patron inquiries are clean. Once visitors use your Direct Contact portal, their inquiries will reflect here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* 3. ARTWORK LIGHTBOX / INSPECTOR MODAL */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#f5f2ed] border border-[#d9d4cc] w-full max-w-5xl rounded-sm shadow-2xl relative overflow-hidden flex flex-col md:flex-row">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-[#1a1a1a] p-2 rounded-full border border-[#d9d4cc] transition-transform hover:scale-105"
              id="btn-close-lightbox"
            >
              <X className="w-4 h-4" />
            </button>

            {/* High-res Frame */}
            <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[480px]">
              <img
                src={selectedArtwork.image}
                alt={selectedArtwork.title}
                referrerPolicy="no-referrer"
                className="max-h-[80vh] w-full object-contain"
              />
            </div>

            {/* Metadata and story description */}
            <div className="w-full md:w-2/5 p-8 md:p-12 text-left flex flex-col justify-between space-y-8 bg-[#f5f2ed]">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="font-serif text-2xl md:text-3xl font-light text-[#1a1a1a] tracking-tight">
                      {selectedArtwork.title}
                    </h2>
                    <span className="font-mono text-sm text-[#b0a080] font-semibold">{selectedArtwork.year}</span>
                  </div>
                  <p className="font-sans text-xs uppercase tracking-[0.15em] text-[#7a7772] font-semibold mt-1">
                    {selectedArtwork.medium}
                  </p>
                </div>

                {/* Physical metrics */}
                <div className="grid grid-cols-2 gap-4 border-y border-[#d9d4cc]/60 py-4 font-sans text-xs">
                  <div>
                    <span className="block text-[9px] uppercase tracking-widest text-[#7a7772] font-semibold">Dimensions</span>
                    <span className="font-medium text-[#1a1a1a] mt-0.5 block">{selectedArtwork.dimensions}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-widest text-[#7a7772] font-semibold">Provenance</span>
                    <span className="font-medium text-[#1a1a1a] mt-0.5 block">Original Julian Waterman Studio</span>
                  </div>
                </div>

                {/* Full story */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-[#b0a080] font-bold block">
                    Curatorial Insight / Description
                  </span>
                  <p className="text-xs text-[#5a5854] leading-relaxed italic">
                    "{selectedArtwork.description || "An immersive modern study. Captures physical balances and shadows elegantly within contemporary interiors."}"
                  </p>
                </div>
              </div>

              {/* Inquire Action Button */}
              <div className="space-y-3">
                <button
                  onClick={() => handleInquire(selectedArtwork)}
                  className="w-full bg-[#1a1a1a] hover:bg-[#b0a080] text-white py-3.5 text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-300 shadow-sm"
                  id="btn-modal-inquire"
                >
                  Acquire / Inquire About Work
                </button>
                <p className="text-[10px] text-center text-[#7a7772] font-medium uppercase tracking-widest">
                  Secure shipping options and dynamic installation coordinates
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
