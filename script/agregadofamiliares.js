////Adicionar basemap
let baseoriginal =L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',);

//adicionar mapa
let latitude = 41.15073;
let longitude = -8.8147;
let zoom = 9;
var map= L.map(document.getElementById('mapDIV'),{ 
    center:[latitude,longitude],
    zoom: zoom,
//    maxZoom:10,
//    minZoom:8
});
baseoriginal.addTo(map);

var ELHInadequacao;
function CorInadequacao(d) {
    return d > 300  ? '#f0150a' :
    d > 200 ? 'rgb(255,170,0)' :
    d > 100  ? 'rgb(255,255,0)' :
    d > 1 ? 'rgb(176,224,0)':
    d >= 0   ? 'rgb(56,168,0)' :
              '';
}
function EstiloELHInadequacao(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.7,
        fillColor: CorInadequacao(feature.properties.Inadequaca),};
    }
function apagarInadequacao(e){
    ELHInadequacao.resetStyle(e.target)
}
function onEachFeature3(feature, layer) {
    layer.on({
        click: zoomToFeature,
        mouseover: highlightFeature2,
        mouseout: apagarInadequacao
    });
}
ELHInadequacao= L.geoJSON(inadequacao,{
    style:EstiloELHInadequacao,
    onEachFeature: onEachFeature3
}).addTo(map);

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function highlightFeature2(e) {
    var layer = e.target;
    info1.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}

var legend3 = L.control({position: 'bottomright'});
    legend3.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        labels = [];
        grades = [1, 100, 200, 300];
        
        div.innerHTML = '<i style="background:rgb(56,168,0)"></i> 0<br>'
    for (var i = 0; i < grades.length; i++) {
        var lowValue = (grades[i] > 1) ? (grades[i] + 1) : grades[i];
        var highValue = grades[(i) + 1];
        div.innerHTML +=
            '<i style="background:' + CorInadequacao(grades[i] + 1) + '"></i> ' +
            lowValue + (highValue ? "&ndash;" + highValue + "<br>" : "+");
    }
    return div;
}
legend3.addTo(map)

let info1 = L.control();

info1.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
info1.update = function (feature) {
    this._div.innerHTML = '<h4>População Identificada Total</h4>' +  (feature ?
    '<b>' 
    + feature.Concelho + 
    '</b><br />'
    + feature.Inadequaca +
    ' pessoas ': '');
};
info1.addTo(map)