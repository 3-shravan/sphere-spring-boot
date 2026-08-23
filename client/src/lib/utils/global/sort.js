/**
 * Generic Sort (Old → New)
 */
export const sortByCreatedAtAsc = (arr) =>
  [...arr].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

/**
 * Reverse sort (New → Old)
 */

export const sortByCreatedAtDesc = (arr) =>
  [...arr].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

/**
 * Fully generic sort if needed later
 */
export const sortByKey = (arr, key, order = "asc") => {
  return [...arr].sort((a, b) => {
    const x = new Date(a[key])
    const y = new Date(b[key])
    return order === "asc" ? x - y : y - x
  })
}
