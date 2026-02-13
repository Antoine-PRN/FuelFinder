const iconsSize = {
  iconSize: [(38 + 7) / 1.618, (95 + 7) / 1.618],
  shadowSize: [40 / 1.618, 54 / 1.618],
  iconAnchor: [22 / 1.618, 94 / 1.618],
  shadowAnchor: [4 / 1.618, 76 / 1.618],
  popupAnchor: [-3 / 1.618, -76 / 1.618],
}

// Définition des icônes
export const markerIcon = L.icon({
  iconUrl: '/icones/marker.svg',
  shadowUrl: '/icones/marker-shadow.svg',
  iconSize: iconsSize.iconSize,
  shadowSize: iconsSize.shadowSize,
  iconAnchor: iconsSize.iconAnchor,
  shadowAnchor: iconsSize.shadowAnchor,
  popupAnchor: iconsSize.popupAnchor,
});

export const selectedMarkerIcon = L.icon({
  iconUrl: '/icones/selected-marker.svg', // Icône différente pour le marqueur sélectionné
  shadowUrl: '/icones/marker-shadow.svg',
  iconSize: iconsSize.iconSize,
  shadowSize: iconsSize.shadowSize,
  iconAnchor: iconsSize.iconAnchor,
  shadowAnchor: iconsSize.shadowAnchor,
  popupAnchor: iconsSize.popupAnchor,
});

export const selectedElectricMarkerIcon = L.icon({
  iconUrl: '/icones/selected-electric-marker.svg', // Icône différente pour le marqueur sélectionné
  shadowUrl: '/icones/marker-shadow.svg',
  iconSize: iconsSize.iconSize,
  shadowSize: iconsSize.shadowSize,
  iconAnchor: iconsSize.iconAnchor,
  shadowAnchor: iconsSize.shadowAnchor,
  popupAnchor: iconsSize.popupAnchor,
});

export const topStationIcon = L.icon({
  iconUrl: '/icones/top-station-marker.svg', // Utilisez une image combinant l'icône de marqueur et l'étoile
  shadowUrl: '/icones/marker-shadow.svg',
  iconSize: iconsSize.iconSize,
  shadowSize: iconsSize.shadowSize,
  iconAnchor: iconsSize.iconAnchor,
  shadowAnchor: iconsSize.shadowAnchor,
  popupAnchor: iconsSize.popupAnchor,
});

export const userMarkerIcon = L.icon({
  iconUrl: '/icones/user-marker.svg',
  shadowUrl: '/icones/marker-shadow.svg',
  iconSize: iconsSize.iconSize,
  shadowSize: iconsSize.shadowSize,
  iconAnchor: iconsSize.iconAnchor,
  shadowAnchor: iconsSize.shadowAnchor,
  popupAnchor: iconsSize.popupAnchor,
});

export const bottomStationIcon = L.icon({
  iconUrl: '/icones/bottom-station-marker.svg', // Icône pour les stations les plus chères
  shadowUrl: '/icones/marker-shadow.svg',
  iconSize: iconsSize.iconSize,
  shadowSize: iconsSize.shadowSize,
  iconAnchor: iconsSize.iconAnchor,
  shadowAnchor: iconsSize.shadowAnchor,
  popupAnchor: iconsSize.popupAnchor,
});

export const electricStationIcon = L.icon({
  iconUrl: '/icones/electric-marker.svg', // Icône pour les stations les plus chères
  shadowUrl: '/icones/marker-shadow.svg',
  iconSize: iconsSize.iconSize,
  shadowSize: iconsSize.shadowSize,
  iconAnchor: iconsSize.iconAnchor,
  shadowAnchor: iconsSize.shadowAnchor,
  popupAnchor: iconsSize.popupAnchor,
});