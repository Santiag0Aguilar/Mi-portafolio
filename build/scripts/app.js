document.addEventListener("DOMContentLoaded", function () {
  initMap();
});

function initMap() {
  const lat = 19.9787,
    lng = -99.1639; // Coordenadas de Apaxco

  // Crear el contenedor del mapa
  const mapContainer = document.getElementById("map");
  if (!mapContainer) {
    console.error("No se encontró el elemento #map");
    return;
  }

  // Inicializar el mapa
  const map = L.map("map").setView([lat, lng], 13);

  // Capa base de OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Agregar marcador
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup("Apaxco, Estado de México")
    .openPopup();
}
