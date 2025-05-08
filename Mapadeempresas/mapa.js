// script.js

const map = L.map('map').setView([-19.9208, -43.9378], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const markerCluster = L.markerClusterGroup();

const empresas = [
  { nome: 'Eco Minas Energia', lat: -19.905, lng: -43.938, categoria: 'Solar', tipo: 'Instaladora' },
  { nome: 'Vívuz Solar', lat: -19.920, lng: -43.940, categoria: 'Solar', tipo: 'Distribuidora' },
  { nome: 'SunTech Solar', lat: -19.910, lng: -43.935, categoria: 'Híbrida', tipo: 'Consultoria' },
  { nome: 'Seg Energy BH', lat: -19.915, lng: -43.930, categoria: 'Eólica', tipo: 'Instaladora' }
];

let filteredMarkers = [];

function adicionarMarcadores(empresasFiltradas) {
  markerCluster.clearLayers();
  empresasFiltradas.forEach(empresa => {
    const marker = L.marker([empresa.lat, empresa.lng])
      .bindPopup(`<b>${empresa.nome}</b><br>Categoria: ${empresa.categoria}<br>Tipo: ${empresa.tipo}`);
    markerCluster.addLayer(marker);
    filteredMarkers.push(marker);
  });
  map.addLayer(markerCluster);
}

function atualizarListaParceiros(empresasFiltradas) {
  const lista = document.getElementById('partner-list');
  lista.innerHTML = '';
  empresasFiltradas.forEach(empresa => {
    const item = document.createElement('li');
    item.className = 'list-group-item';
    item.textContent = `${empresa.nome} (${empresa.tipo})`;
    lista.appendChild(item);
  });
}

function aplicarFiltros() {
  const busca = document.getElementById('searchBox').value.toLowerCase();
  const categoria = document.getElementById('filtroCategoria').value;
  const tipo = document.getElementById('filtroTipo').value;

  const resultado = empresas.filter(empresa => {
    return (
      (empresa.nome.toLowerCase().includes(busca)) &&
      (categoria === '' || empresa.categoria === categoria) &&
      (tipo === '' || empresa.tipo === tipo)
    );
  });

  adicionarMarcadores(resultado);
  atualizarListaParceiros(resultado);
}

// Eventos
['searchBox', 'filtroCategoria', 'filtroTipo'].forEach(id => {
  document.getElementById(id).addEventListener('input', aplicarFiltros);
});

// Roteamento padrão
L.Routing.control({
  waypoints: [
    L.latLng(-19.9227, -43.9451),
    L.latLng(-19.9156, -43.9389)
  ],
  routeWhileDragging: true,
  createMarker: function (i, wp) {
    return L.marker(wp.latLng, { draggable: true });
  },
  show: false
}).on('routesfound', function (e) {
  const summary = e.routes[0].summary;
  document.getElementById('route-panel').innerHTML = `<h5>Rota:</h5>
    <p>${(summary.totalDistance / 1000).toFixed(2)} km,
       ${(summary.totalTime / 60).toFixed(0)} min</p>`;
}).addTo(map);

// Ajustar tamanho do mapa ao redimensionar
function ajustarAlturaDoMapa() {
  const alturaJanela = window.innerHeight;
  const cabecalho = document.querySelector('header')?.offsetHeight || 0;
  const alturaDisponivel = alturaJanela - cabecalho - 100;
  document.getElementById('map').style.height = `${alturaDisponivel}px`;
}

window.addEventListener('resize', ajustarAlturaDoMapa);
window.addEventListener('load', () => {
  ajustarAlturaDoMapa();
  adicionarMarcadores(empresas);
  atualizarListaParceiros(empresas);
});