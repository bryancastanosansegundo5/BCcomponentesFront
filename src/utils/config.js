function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

export const API_BASE_URL = ensureTrailingSlash(import.meta.env.VITE_API_URL);
export const SERVIDOR_BASE_URL = ensureTrailingSlash(import.meta.env.VITE_API_URL_SERVIDOR);
export const WS_BASE_URL = ensureTrailingSlash(import.meta.env.VITE_WS_URL);