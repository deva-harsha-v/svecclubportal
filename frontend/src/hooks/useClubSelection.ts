import { useState, useEffect } from 'react';
import { ClubSummary } from '../types';

const STORAGE_KEY = 'selected_clubs';

export function useClubSelection() {
  const [selectedClubs, setSelectedClubs] = useState<ClubSummary[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedClubs));
    } catch (e) {
      console.error('Failed to save selected clubs to storage:', e);
    }
  }, [selectedClubs]);

  const toggleClub = (club: ClubSummary) => {
    setSelectedClubs((prev) => {
      const exists = prev.some((c) => c.slug === club.slug);
      if (exists) {
        return prev.filter((c) => c.slug !== club.slug);
      } else {
        return [...prev, club];
      }
    });
  };

  const isSelected = (slug: string) => {
    return selectedClubs.some((c) => c.slug === slug);
  };

  const removeClub = (slug: string) => {
    setSelectedClubs((prev) => prev.filter((c) => c.slug !== slug));
  };

  const clearSelection = () => {
    setSelectedClubs([]);
  };

  return {
    selectedClubs,
    toggleClub,
    isSelected,
    removeClub,
    clearSelection,
    count: selectedClubs.length,
  };
}
