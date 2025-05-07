// script.js

// script.js

const map = L.map('map').setView([-19.9208, -43.9378], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const markerCluster = L.markerClusterGroup();

const empresas = [
  { nome: 'Eco Minas Energia', lat: -19.905, lng: -43.938, categoria: 'Solar' },
  { nome: 'Vívuz Solar', lat: -19.920, lng: -43.940, categoria: 'Solar' },
  { nome: 'SunTech Solar', lat: -19.910, lng: -43.935, categoria: 'Solar' },
  { nome: 'Seg Energy BH', lat: -19.915, lng: -43.930, categoria: 'Eólica' }
];

const markers = [];

empresas.forEach(empresa => {
  const marker = L.marker([empresa.lat, empresa.lng])
    .bindPopup(`<b>${empresa.nome}</b><br>Categoria: ${empresa.categoria}`);
  marker.empresa = empresa.nome.toLowerCase();
  marker.categoria = empresa.categoria.toLowerCase();
  markerCluster.addLayer(marker);
  markers.push(marker);
});

map.addLayer(markerCluster);

// Roteamento com pontos dinâmicos
const routingControl = L.Routing.control({
  waypoints: [
    L.latLng(-19.9227, -43.9451),
    L.latLng(-19.9156, -43.9389)
  ],
  routeWhileDragging: true,
  createMarker: function(i, wp, nWps) {
    return L.marker(wp.latLng, {
      draggable: true
    });
  },
  show: false
}).on('routesfound', function(e) {
  const routes = e.routes;
  const summary = routes[0].summary;
  const panel = document.getElementById('route-panel');
  panel.innerHTML = `<h5>Rota:</h5>
    <p>${(summary.totalDistance / 1000).toFixed(2)} km, 
       ${(summary.totalTime / 60).toFixed(0)} min</p>`;
}).addTo(map);

// Busca
const searchBox = document.getElementById('searchBox');
const categoryFilter = document.getElementById('categoryFilter');

function updateMarkers() {
  const term = searchBox.value.toLowerCase();
  const category = categoryFilter.value.toLowerCase();

  markerCluster.clearLayers();
  markers.forEach(marker => {
    const matchesName = marker.empresa.includes(term);
    const matchesCategory = category === 'todas' || marker.categoria === category;

    if (matchesName && matchesCategory) {
      markerCluster.addLayer(marker);
    }
  });
}

searchBox.addEventListener('input', updateMarkers);
categoryFilter.addEventListener('change', updateMarkers);

// Lista de parceiros
const partnerList = document.getElementById('partner-list');
empresas.forEach(empresa => {
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.textContent = `${empresa.nome} - ${empresa.categoria}`;
  partnerList.appendChild(li);
});
