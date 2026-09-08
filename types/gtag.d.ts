export {};

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (
      command: string,
      target: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}