import React from 'react';

export const PublicPortalSkeleton: React.FC = () => {
  return (
    <div className="portal-bg min-h-screen animate-fadeIn">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-40 bg-[#010030]/90 backdrop-blur-xl border-b border-[#7226FF]/25 py-3">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7226FF]/20 animate-pulse" />
            <div className="space-y-1.5">
              <div className="w-36 h-4 rounded bg-[#7226FF]/20 animate-pulse" />
              <div className="w-28 h-2.5 rounded bg-[#7226FF]/15 animate-pulse" />
            </div>
          </div>
          <div className="w-28 h-8 rounded-full bg-[#F042FF]/15 border border-[#F042FF]/30 animate-pulse" />
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <section className="relative py-6 sm:py-10 px-4 sm:px-8 lg:px-12 border-b border-[#7226FF]/20">
        <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Skeleton */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-3 max-w-[650px]">
              <div className="w-3/4 h-10 sm:h-14 rounded-2xl bg-[#7226FF]/20 animate-pulse" />
              <div className="w-full h-10 sm:h-14 rounded-2xl bg-[#7226FF]/20 animate-pulse" />
            </div>
            <div className="w-full sm:w-4/5 h-12 rounded-xl bg-[#7226FF]/15 animate-pulse" />
          </div>

          {/* Right Featured Showcase Skeleton (Preserves exact layered geometry) */}
          <div className="lg:col-span-5 relative h-[320px] sm:h-[360px] flex items-center justify-center">
            {/* Background glowing blur */}
            <div className="absolute w-64 h-64 rounded-full bg-[#7226FF]/10 blur-3xl" />
            {/* Layered Card Skeletons */}
            <div className="absolute w-44 sm:w-56 h-60 rounded-3xl bg-[#160078]/40 border border-[#7226FF]/20 transform -rotate-6 -translate-x-12 opacity-60 animate-pulse" />
            <div className="absolute w-44 sm:w-56 h-60 rounded-3xl bg-[#160078]/40 border border-[#7226FF]/20 transform rotate-6 translate-x-12 opacity-60 animate-pulse" />
            <div className="absolute w-48 sm:w-60 h-64 rounded-3xl bg-[#160078]/80 border border-[#F042FF]/40 shadow-2xl z-10 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Filter Sticky Bar Skeleton */}
      <div className="sticky top-[60px] z-30 bg-[#010030]/90 backdrop-blur-xl border-b border-[#7226FF]/20 py-3 px-4 sm:px-8">
        <div className="flex gap-3 overflow-x-auto no-scrollbar max-w-[1600px] mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-24 sm:w-28 h-8 rounded-full bg-[#7226FF]/20 border border-[#7226FF]/30 shrink-0 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Main Club Grid Skeleton */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-6">
        <div className="space-y-2 border-b border-[#7226FF]/20 pb-4">
          <div className="w-48 h-6 rounded-lg bg-[#7226FF]/25 animate-pulse" />
          <div className="w-72 h-3.5 rounded bg-[#7226FF]/15 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-52 rounded-2xl bg-[#160078]/35 border border-[#7226FF]/20 p-5 space-y-4 animate-pulse flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#7226FF]/20 shrink-0" />
                <div className="w-24 h-3.5 rounded bg-[#7226FF]/20" />
              </div>
              <div className="space-y-2">
                <div className="w-3/4 h-4 rounded bg-[#7226FF]/25" />
                <div className="w-full h-3 rounded bg-[#7226FF]/15" />
              </div>
              <div className="pt-3 border-t border-[#7226FF]/15 flex justify-between items-center">
                <div className="w-20 h-3.5 rounded-full bg-[#7226FF]/20" />
                <div className="w-16 h-3 rounded bg-[#7226FF]/15" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
