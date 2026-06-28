import React from "react";
import { motion } from "motion/react";
import { ArrowDown, Sparkles } from "lucide-react";
import { Artwork } from "../types";

interface HeroProps {
  featuredArtworks: Artwork[];
  onExplore: () => void;
  onSelectArtwork: (artwork: Artwork) => void;
}

export default function Hero({ featuredArtworks, onExplore, onSelectArtwork }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-50 border-b border-stone-200">
      {/* Absolute Background Accent Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 left-1/4 h-full w-px bg-stone-200"></div>
        <div className="absolute top-0 left-2/4 h-full w-px bg-stone-200"></div>
        <div className="absolute top-0 left-3/4 h-full w-px bg-stone-200"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left column: Artist Bio/Statement */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-stone-100 border border-stone-200 px-3 py-1 rounded-full text-xs text-stone-600 font-medium tracking-wider uppercase self-start"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-500" />
            <span>Exhibition Now Online</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 leading-tight"
            >
              Capturing the <br />
              <span className="italic font-medium">Silent Spaces</span> <br />
              Between Moments
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-stone-600 leading-relaxed text-base max-w-md"
            >
              "My work resides at the intersection of architectural minimalism and emotional fluidity. 
              By stripping away the noise of literal representationalism, each collection invites 
              you to explore quiet depths, physical weight, and transient light."
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <button
              onClick={onExplore}
              className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-[#faf9f6] text-sm font-medium tracking-wider uppercase rounded-sm shadow-md transition-all duration-300 flex items-center space-x-2 cursor-pointer"
              id="hero-explore-btn"
            >
              <span>Explore Collections</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
            <div className="font-sans text-xs text-stone-500 max-w-[160px] pl-2 border-l border-stone-300">
              Browse over 5 collections of master studies & structures.
            </div>
          </motion.div>
        </div>

        {/* Right column: Featured Artwork Showcase */}
        <div className="lg:col-span-7 relative h-[450px] sm:h-[550px] w-full flex items-center justify-center">
          {featuredArtworks.length > 0 ? (
            <div className="w-full h-full grid grid-cols-12 gap-4 relative">
              {/* Highlight Featured Work #1 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="col-span-8 h-full rounded-sm overflow-hidden shadow-2xl relative group border border-stone-200/50"
              >
                <img
                  src={featuredArtworks[0].image}
                  alt={featuredArtworks[0].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="text-xs uppercase tracking-widest text-stone-300 mb-1">
                    Featured Masterpiece
                  </div>
                  <h3 className="font-serif text-2xl text-[#faf9f6] font-light">
                    {featuredArtworks[0].title}
                  </h3>
                  <p className="font-sans text-xs text-stone-300 mt-2">
                    {featuredArtworks[0].medium} • {featuredArtworks[0].year}
                  </p>
                  <button
                    onClick={() => onSelectArtwork(featuredArtworks[0])}
                    className="mt-4 self-start bg-[#faf9f6] text-stone-900 text-xs px-4 py-2 rounded-sm font-medium tracking-wide uppercase hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>

              {/* Offset Featured Work #2 */}
              {featuredArtworks[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="col-span-4 h-3/4 self-end rounded-sm overflow-hidden shadow-xl relative group border border-stone-200/50"
                >
                  <img
                    src={featuredArtworks[1].image}
                    alt={featuredArtworks[1].title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h4 className="font-serif text-lg text-[#faf9f6] font-light truncate">
                      {featuredArtworks[1].title}
                    </h4>
                    <button
                      onClick={() => onSelectArtwork(featuredArtworks[1])}
                      className="mt-2 self-start bg-[#faf9f6] text-stone-900 text-[10px] px-3 py-1.5 rounded-sm font-medium tracking-wide uppercase hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-stone-100 rounded-sm flex items-center justify-center border border-stone-200 border-dashed">
              <span className="text-stone-400 font-sans text-sm">Loading visual collection...</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
