const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371; // Radius of the Earth in kilometers

  // Convert latitude and longitude from degrees to radians
  const latRad1 = (lat1 * Math.PI) / 180;
  const lonRad1 = (lon1 * Math.PI) / 180;
  const latRad2 = (lat2 * Math.PI) / 180;
  const lonRad2 = (lon2 * Math.PI) / 180;

  // Haversine formula
  const dLat = latRad2 - latRad1;
  const dLon = lonRad2 - lonRad1;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(latRad1) *
      Math.cos(latRad2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance; // Distance in kilometers
};

export default calculateDistance;
