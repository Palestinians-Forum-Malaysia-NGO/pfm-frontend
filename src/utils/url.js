const SAFE_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"];

/**
 * Guards against javascript:/data: URI injection in user- or admin-supplied
 * link fields (e.g. partnership website_url) before rendering them as <a href>.
 */
export const isSafeUrl = (url) => {
  if (!url) return false;
  try {
    const parsed = new URL(url, window.location.origin);
    return SAFE_PROTOCOLS.includes(parsed.protocol);
  } catch {
    return false;
  }
};
