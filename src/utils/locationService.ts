export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
  
export function getFormattedDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const distanceKm = getDistanceKm(lat1, lng1, lat2, lng2);
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} metros`;
  } else {
    return `${distanceKm.toFixed(2)} km`;
  }
}