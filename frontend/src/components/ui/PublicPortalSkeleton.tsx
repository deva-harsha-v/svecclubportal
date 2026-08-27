import React from 'react';

export const PublicPortalSkeleton: React.FC = () => {
  return (
    <div className="portal-bg min-h-screen animate-fadeIn bg-[#090D16]">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-40 bg-[#090D16]/90 border-b border-slate-800/80 py-3">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800/80 animate-pulse border border-slate-700/60" />
            <div className="space-y-1.5">
              <div className="w-36 h-4 rounded bg-slate-800 animate-pulse" />
              <div className="w-28 h-2.5 rounded bg-slate-800/60 animate-pulse" />
            </div>
          </div>
          <div className="w-28 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 animate-pulse" />
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <section className="relative py-8 sm:py-12 px-4 sm:px-8 lg:px-12 border-b border-slate-800/80">
        <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Skeleton */}
          <div className="lg:col-span-7 space-y-4">
            <div className="w-32 h-4 rounded bg-slate-800 animate-pulse" />
            <div className="space-y-2 max-w-[600px]">
              <div className="w-full h-10 sm:h-12 rounded-xl bg-slate-800 animate-pulse" />
              <div className="w-4/5 h-10 sm:h-12 rounded-xl bg-slate-800 animate-pulse" />
            </div>
            <div className="w-full sm:w-3/4 h-10 rounded-lg bg-slate-800/60 animate-pulse" />
          </div>

          {/* Right Spotlight Showcase Skeleton */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="w-full h-44 aspect-[3072/1560] rounded-xl bg-slate-800/80 animate-pulse" />
              <div className="space-y-2">
                <div className="w-3/4 h-5 rounded bg-slate-800 animate-pulse" />
                <div className="w-1/2 h-3.5 rounded bg-slate-800/60 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Club Grid Skeleton (Exact Image-First Card Structure) */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="space-y-1.5">
            <div className="w-44 h-6 rounded bg-slate-800 animate-pulse" />
            <div className="w-64 h-3.5 rounded bg-slate-800/60 animate-pulse" />
          </div>
          <div className="w-16 h-6 rounded bg-slate-800 border border-slate-700/60 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between"
            >
              {/* Top Image Skeleton Block (Top 55-60% height) */}
              <div className="w-full h-48 sm:h-52 bg-slate-800/70 animate-pulse relative">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/60 border border-slate-700/50" />
              </div>

              {/* Bottom Content Skeleton */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="w-3/4 h-5 rounded bg-slate-800 animate-pulse" />
                <div className="w-24 h-4 rounded bg-slate-800/80 animate-pulse" />
                <div className="w-full h-3.5 rounded bg-slate-800/50 animate-pulse" />
                <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center">
                  <div className="w-24 h-3.5 rounded bg-slate-800/60 animate-pulse" />
                  <div className="w-20 h-3.5 rounded bg-slate-800/60 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
