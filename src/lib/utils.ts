// Canonical origin. Set as metadataBase in the root layout, so metadata URLs
// can be relative; use this directly only where an absolute URL is required.
export const SITE_URL = "https://siayush.vercel.app"

export function formatDate(dateString: string) {
  return new Date(dateString)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toLowerCase()
}

export function formatDateLong(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
