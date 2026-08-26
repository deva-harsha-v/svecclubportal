export const getLogoUrl = (logo?: string | null): string => {
  if (!logo) return '';
  if (logo.startsWith('http://') || logo.startsWith('https://')) {
    return logo;
  }
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || (import.meta as any).env?.VITE_API_BASE || '';
  if (logo.startsWith('/')) {
    return `${apiBase}${logo}`;
  }
  return `${apiBase}/api/uploads/${logo}`;
};
