export const SHORT_LINK_BASE_URL =
  "https://linkshortner-two.vercel.app/l";

export function getShortLink(shortCode: string): string {
  return `${SHORT_LINK_BASE_URL}/${encodeURIComponent(shortCode)}`;
}
