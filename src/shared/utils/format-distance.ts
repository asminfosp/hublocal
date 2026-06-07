export function formatDistance(distanceMeters?: number) {
  if (typeof distanceMeters !== "number") return "A consultar"
  if (distanceMeters < 1000) return `${distanceMeters}m`
  return `${(distanceMeters / 1000).toFixed(1).replace(".", ",")} km`
}
