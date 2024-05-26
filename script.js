// 地図の初期設定
const map = L.map('map').setView([35.6895, 139.6917], 5);

// 地図のタイルレイヤーを追加
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// GeoJSONデータを読み込んで地図に追加
fetch('japan.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJson(data, {
            style: feature => ({
                fillColor: '#ff7800',
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            }),
            onEachFeature: (feature, layer) => {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature
                });
            }
        }).addTo(map);
    });

function highlightFeature(e) {
    const layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

// ビジュアライズするデータを追加
const data = {
    "Hokkaido": 500,
    "Aomori": 200,
    // 他の都道府県のデータ
};

function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

fetch('japan.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJson(data, {
            style: feature => ({
                fillColor: getColor(data[feature.properties.name]),
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            })
        }).addTo(map);
    });
