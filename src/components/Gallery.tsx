import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, ImageOff, FolderOpen, Heart } from "lucide-react";
import { Artwork, Collection } from "../types";

interface GalleryProps {
  collections: Collection[];
  artworks: Artwork[];
  onSelectArtwork: (artwork: Artwork) => void;
}

export default function Gallery({ collections, artworks, onSelectArtwork }: GalleryProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedium, setSelectedMedium] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Derive unique mediums for filter dropdown
  const uniqueMediums = useMemo(() => {
    const mediums = new Set<string>();
    artworks.forEach((art) => {
      if (art.medium) mediums.add(art.medium);
    });
    return ["all", ...Array.from(mediums)];
  }, [artworks]);

  // Filter artworks based on collection, search query, and medium
  const filteredArtworks = useMemo(() => {
    return artworks.filter((art) => {
      const matchesCollection =
        selectedCollectionId === "all" || art.collectionId === selectedCollectionId;
      const matchesMedium = selectedMedium === "all" || art.medium === selectedMedium;
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.medium.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.year.includes(searchQuery);

      return matchesCollection && matchesMedium && matchesSearch;
    });
  }, [artworks, selectedCollectionId, selectedMedium, searchQuery]);

  // Get active collection details
  const activeCollection = useMemo(() => {
    return collections.find((c) => c.id === selectedCollectionId);
  }, [collections, selectedCollectionId]);

  return (
    <section id="catalogue-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-stone-900 uppercase">
          Art Catalogue
        </h2>
        <div className="w-16 h-px bg-stone-400 mx-auto mt-4 mb-6"></div>
        <p className="font-sans text-sm text-stone-500 leading-relaxed">
          Navigate through my architectural designs, brush studies, and monolithic sculptures. 
          Filter by thematic collection or search for specific mediums.
        </p>
      </div>

      {/* COLLECTIONS NAVIGATION */}
      <div className="mb-12">
        <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-stone-400 mb-4 font-semibold text-center">
          Thematic Collections
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedCollectionId("all")}
            className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              selectedCollectionId === "all"
                ? "bg-stone-900 text-[#faf9f6] shadow-sm"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
            id="col-filter-all"
          >
            All Works ({artworks.length})
          </button>
          {collections.map((col) => {
            const count = artworks.filter((art) => art.collectionId === col.id).length;
            return (
              <button
                key={col.id}
                onClick={() => setSelectedCollectionId(col.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  selectedCollectionId === col.id
                    ? "bg-stone-900 text-[#faf9f6] shadow-sm"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
                id={`col-filter-${col.id}`}
              >
                {col.name} ({count})
              </button>
            );
          })}
        </div>

        {/* ACTIVE COLLECTION BLURB */}
        <AnimatePresence mode="wait">
          {activeCollection && (
            <motion.div
              key={activeCollection.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 p-6 bg-stone-100 rounded-sm border border-stone-200 max-w-3xl mx-auto text-center"
            >
              <div className="flex items-center justify-center space-x-2 text-stone-500 mb-2">
                <FolderOpen className="w-4 h-4" />
                <span className="font-sans text-xs uppercase tracking-widest font-semibold">
                  Collection Summary
                </span>
              </div>
              <h4 className="font-serif text-xl font-normal text-stone-900 mb-2">
                {activeCollection.name}
              </h4>
              <p className="font-sans text-stone-600 text-sm leading-relaxed max-w-xl mx-auto">
                {activeCollection.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-white p-4 rounded-sm border border-stone-200 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search artworks (title, medium, keyword)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 text-sm rounded-sm border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-500 font-sans"
            id="artwork-search-input"
          />
        </div>

        {/* Filters actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border text-xs font-medium tracking-wide uppercase rounded-sm transition-colors cursor-pointer ${
              showFilters || selectedMedium !== "all"
                ? "border-stone-900 text-stone-900 bg-stone-50"
                : "border-stone-300 text-stone-600 hover:border-stone-400"
            }`}
            id="toggle-filters-btn"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Advanced Filters</span>
          </button>

          <span className="font-sans text-xs text-stone-500">
            Showing {filteredArtworks.length} of {artworks.length} works
          </span>
        </div>
      </div>

      {/* ADVANCED FILTERS PANEL */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-stone-50 border border-stone-200 border-t-0 p-6 rounded-b-sm mb-8 -mt-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Filter by Medium
                </label>
                <select
                  value={selectedMedium}
                  onChange={(e) => setSelectedMedium(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-stone-300 rounded-sm text-xs font-sans focus:outline-none focus:ring-1 focus:ring-stone-500"
                  id="medium-filter-select"
                >
                  {uniqueMediums.map((med) => (
                    <option key={med} value={med}>
                      {med === "all" ? "All Mediums" : med}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Featured Status
                </label>
                <div className="flex space-x-3 mt-1">
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-3 py-1.5 border border-stone-300 text-[11px] font-sans hover:bg-white rounded-sm cursor-pointer"
                  >
                    Clear Search
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCollectionId("all");
                      setSelectedMedium("all");
                      setSearchQuery("");
                    }}
                    className="px-3 py-1.5 border border-stone-900 text-[11px] font-sans text-stone-950 hover:bg-stone-100 rounded-sm cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ARTWORK GRID */}
      {filteredArtworks.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredArtworks.map((art) => (
              <motion.div
                layout
                key={art.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="group flex flex-col bg-white border border-stone-200/60 rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => onSelectArtwork(art)}
              >
                {/* Artwork Image Frame */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 border-b border-stone-100 flex items-center justify-center">
                  <img
                    src={art.image}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {art.isFeatured && (
                    <div className="absolute top-3 left-3 bg-[#faf9f6]/95 border border-stone-300 text-stone-900 text-[9px] font-semibold uppercase px-2.5 py-1 rounded-full tracking-widest shadow-sm flex items-center space-x-1.5">
                      <Heart className="w-2.5 h-2.5 text-amber-600 fill-amber-600" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                {/* Metadata Frame */}
                <div className="p-6 flex flex-col justify-between flex-1 text-left">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-serif text-lg text-stone-900 font-medium group-hover:text-stone-700 transition-colors line-clamp-1">
                        {art.title}
                      </h4>
                      <span className="font-sans text-xs text-stone-400 font-medium shrink-0">
                        {art.year}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-stone-500 uppercase tracking-widest">
                      {art.medium}
                    </p>
                    <p className="font-sans text-stone-600 text-xs leading-relaxed line-clamp-2 mt-2">
                      {art.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-stone-500">
                    <span className="font-mono text-[11px] text-stone-400">
                      {art.dimensions}
                    </span>
                    <span className="text-stone-900 uppercase font-sans tracking-wider group-hover:underline transition-all">
                      View Work &rarr;
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-24 bg-white rounded-sm border border-stone-200 max-w-xl mx-auto">
          <ImageOff className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h4 className="font-serif text-xl font-normal text-stone-900 mb-1">
            No artworks found
          </h4>
          <p className="font-sans text-sm text-stone-500 max-w-sm mx-auto px-4">
            Try adjusting your search terms or active collection categories.
          </p>
        </div>
      )}
    </section>
  );
}
