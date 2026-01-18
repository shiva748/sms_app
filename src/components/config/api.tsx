export const isCapacitor = !!(window as any).Capacitor;

export const API_BASE_URL = isCapacitor
  ? import.meta.env.VITE_API_URL_MOBILE
  : import.meta.env.VITE_API_URL_BROWSER;
