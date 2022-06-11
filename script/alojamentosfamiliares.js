
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


var PopResidente2021;

function CorPopResi2021F(d) {
    return d > 40000  ? '#f0150a' :
    d > 20000 ? 'rgb(255,170,0)' :
    d > 10000  ? 'rgb(255,255,0)' :
    d > 2500   ? 'rgb(176,224,0)' :
    d > 0   ? 'rgb(56,168,0)' :
              '';
}

function EstiloPopResi2021F(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.7,
        fillColor: CorPopResi2021F(feature.properties.PopResi),};
    }

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function highlightFeature(e) {
    var layer = e.target;
    info.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}

function ApagarPopResiF2021(e) {
    PopResidente2021.resetStyle(e.target)
}
function CadaFeaturePopResi2021F(feature, layer) {
    layer.on({
        click: zoomToFeature,
        mouseover: highlightFeature,
        mouseout: ApagarPopResiF2021,
    });
}

PopResidente2021= L.geoJSON(popresi2021, {
    style:EstiloPopResi2021F,
    onEachFeature: CadaFeaturePopResi2021F,
}).addTo(map);


var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        labels = [];
        grades = [0, 2500, 10000, 20000, 40000];
        

    for (var i = 0; i < grades.length; i++) {
        var lowValue = (grades[i] > 1) ? (grades[i] + 1) : grades[i];
        var highValue = grades[(i) + 1];
        div.innerHTML +=
            '<i style="background:' + CorPopResi2021F(grades[i] + 1) + '"></i> ' +
            lowValue + (highValue ? "&ndash;" + highValue + "<br>" : "+");
    }
    return div;
};
legend.addTo(map);



let info = L.control();
info.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
info.update = function (feature) {
    this._div.innerHTML = '<h4>População Residente em 2021</h4>' +  (feature ?
    '<b>' 
    + feature.Freguesia + 
    '</b><br />'
    + feature.PopResi +
    ' pessoas </sup>': '');
};
info.addTo(map);
