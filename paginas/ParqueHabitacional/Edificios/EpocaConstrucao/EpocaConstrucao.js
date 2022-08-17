
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'

$('#temporal').css("padding-top","0px");
//adicionar mapa
let latitude = 41.12073;
let longitude = -8.5147;
let zoom = 9;
var map= L.map(document.getElementById('mapDIV'),{ 
    center:[latitude,longitude],
    zoom: zoom,
    zoomControl:false,
    attributionControl:true,/// LEAFLET EM BAIXO A APARECER
    // maxZoom:4,
     minZoom:8,
    scrollWheelZoom:true,
});
baseoriginal.addTo(map);


var Orientacao = L.control({position: "topleft"});
Orientacao.onAdd = function(map) {
    var div = L.DomUtil.create("div", "north");
    div.innerHTML = '<img src="../../../../imagens/norte.png" alt="Orientação" height="40px" width="23px">';
    return div;
}
Orientacao.addTo(map)
///// --- Adicionar Layer dos Concelhos -----\\\\
function layerContorno() {
    return {
        weight: 1,
        opacity: 1,
        color: 'gray',
        dashArray: '1',
        fillOpacity: 0.3,
        linejoin: 'round',
        fillColor:'rgb(204,204,204)'};
    }
var contorno = L.geoJSON(contornoAmp,{
    style:layerContorno,
});
//// ---- Botão de aproximar e diminuir a escala e voltar ao zoom inicial---- \\\\\
var zoomHome = L.Control.zoomHome({
    position:'topleft',
    zoomHomeTitle: 'Zoom Inicial',
    zoomInTitle: 'Aumentar',
    zoomOutTitle: 'Diminuir'
}).addTo(map);

//////---- Adicionar escala
L.control.scale({
    imperial:false,
///    maxWidth:100, TAMANHO DA ESCALA
}).addTo(map);

///// ---- Fim layer Concelhos --- \\\\

///// --- Adicionar Layer das Freguesias -----\\\\
var contornoFreg = L.geoJSON(contornoFreguesias,{
    style:layerContorno,
});
var contornoFreg2001 = L.geoJSON(dadosRelativosFreguesias01,{
    style:layerContorno,
});
let space = document.getElementById("space");
let opcoesTabela = document.getElementById('opcoesTabela');
let escalasConcelho = document.getElementById('escalasConcelho');
let escalasFreguesia = document.getElementById('escalasFreguesias');
let absolutoFreguesia = document.getElementById('absolutoFreguesia');
let percentagemFreguesia = document.getElementById('percentagemFreguesia');
let myDIV = document.getElementById('myDIV');
let legendaA= document.getElementById('legendaA');
var ifSlide2isActive = 1;
let slidersGeral = document.getElementById('slidersGeral');
let inputNumberMin = document.getElementById('input-number-min');
let inputNumberMax = document.getElementById('input-number-max');
let esconderano2001 = document.getElementById('2001');
var sliderAtivo = null

///// --- Botões secundários (Concelho, Freguesia) ficarem ativos sempre que se clica \\\\\
var btns = myDIV.getElementsByClassName("butaoEscala");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
  var current = document.getElementsByClassName("active2");
  current[0].className = current[0].className.replace(" active2", "");
  this.className += " active2";
  });
}

///// --- Botões das tabelas (Absoluto, Variação, Percentagem) ficarem ativos sempre que se clica \\\\\
var btns1 = opcoesTabela.getElementsByClassName("btn");
for (var i = 0; i < btns1.length; i++) {
  btns1[i].addEventListener("click", function() {
  var current = document.getElementsByClassName("active1");
  current[0].className = current[0].className.replace(" active1", "");
  this.className += " active1";
  });
}

///// --- Botões iniciais (Mapa, Gráfico, Escala) ficarem ativos sempre que se clica \\\\\
var btns2 = space.getElementsByClassName("btn");
for (var i = 0; i < btns2.length; i++) {
  btns2[i].addEventListener("click", function() {
    if ($(btns2).hasClass('active3')){
        var current = document.getElementsByClassName("active3");
        current[0].className = current[0].className.replace(" active3", "");
        this.className += " active3";
    }
    else{
        return false
    }
  });
}
///// --- Botões das variáveis  dos Concelhos(Número Absoluto, Taxa de Variação, Percentagem) ficarem ativos sempre que se clica \\\\\
var btns3 = escalasConcelho.getElementsByClassName("butao");
for (var i = 0; i < btns3.length; i++) {
    btns3[i].addEventListener("click", function() {
        if ($("#concelho").hasClass('active2')){
            var current = document.getElementsByClassName("active4");
            current[0].className = current[0].className.replace(" active4", "");
            this.className += " active4";
        }
        if ($("#freguesias").hasClass('active2')){
            var current = document.getElementsByClassName("active5");
            current[0].className = current[0].className.replace(" active5", "");
            this.className += " active5";
        }

  });
}

function getRadius(area, multiplicao) {
    var radius = Math.sqrt(area / Math.PI);
    return radius * multiplicao;
};

/// Função do zoom\\\\
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function hover(e) {
    var layer = e.target;
    layer.openPopup();
    layer.setStyle({
        weight: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 1
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}

var legendaExcecao = function(maximo,medio,minimo, multiplicador) {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'center'
    var symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Número de alojamentos'
    var	classes = [maximo, medio,minimo];
    var	legendCircle;
    var	lastRadius = 0;
    var currentRadius;
    var margin;
 


    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")
    for (var i = 0; i <= classes.length-1; i++) {
        
        legendCircle = document.createElement("div");
        legendCircle.className = 'legendCircle'

            currentRadius = getRadius(classes[i],multiplicador);

            margin = -currentRadius - lastRadius - 2;

            $(legendCircle).attr("style", "width: " + currentRadius*2 +
                "px; height: " + currentRadius*2 +
                "px; margin-left: " + margin + "px" );

                if (i == 0){
                    $(legendCircle).append("<span class='legendValue legendaCirculosExcecao'>"+classes[i]+"<span>");
                    
                }
                if (i == 1){
                    $(legendCircle).append("<span class='legendValue legendaCirculosExcecao margin0'>"+classes[i]+"<span>");
                }
                if (i == 2){
                    $(legendCircle).append("<span class='legendValue legendaExcecaoBaixar'>"+classes[i]+"<span>");
                }

            $(symbolsContainer).append(legendCircle);

            lastRadius = currentRadius;

        }
        $(legendaA).append(symbolsContainer);
        legendaA.style.visibility = "visible"
    }

//////////////////////////////////////////-------------------------- DADOS ABSOLUTOS CONCELHOS -----------\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS ANTES 1919 EM 2001 ------------------------------\\\\\\\\\\\\\

var minEdifi1919Conc_01 = 0;
var maxEdifi1919Conc_01 = 0;
function estiloEdifi1919Conc_01(feature, latlng) {
    if(feature.properties.ED_1919_01< minEdifi1919Conc_01 || minEdifi1919Conc_01 ===0){
        minEdifi1919Conc_01 = feature.properties.ED_1919_01
    }
    if(feature.properties.ED_1919_01> maxEdifi1919Conc_01){
        maxEdifi1919Conc_01 = feature.properties.ED_1919_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1919_01,0.3)
    });
}
function apagarEdifi1919Conc_01(e){
    var layer = e.target;
    Edifi1919Conc_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1919Conc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios antes de 1919:  ' + '<b>' +feature.properties.ED_1919_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1919Conc_01,
    })
};

var Edifi1919Conc_01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi1919Conc_01,
    onEachFeature: onEachFeatureEdifi1919Conc_01,
});


var legenda = function(maximo,medio,minimo, multiplicador) {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'center'
    var symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Número de alojamentos'
    var	classes = [maximo, medio,minimo];
    var	legendCircle;
    var	lastRadius = 0;
    var currentRadius;
    var margin;
    


    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")
    for (var i = 0; i <= classes.length-1; i++) {
        
        legendCircle = document.createElement("div");
        legendCircle.className = 'legendCircle'

            currentRadius = getRadius(classes[i],multiplicador);

            margin = -currentRadius - lastRadius - 2;

            $(legendCircle).attr("style", "width: " + currentRadius*2 +
                "px; height: " + currentRadius*2 +
                "px; margin-left: " + margin + "px" );

                if (i == 0){
                    $(legendCircle).append("<span class='legendValue2'>"+classes[i]+"<span>");
                }
                else{
                    $(legendCircle).append("<span class='legendValue'>"+classes[i]+"<span>");
                }

            $(symbolsContainer).append(legendCircle);

            lastRadius = currentRadius;

        }
        $(legendaA).append(symbolsContainer);
        legendaA.style.visibility = "visible"
        }




var slideEdifi1919Conc_01 = function(){
    var sliderEdifi1919Conc_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1919Conc_01, {
        start: [minEdifi1919Conc_01, maxEdifi1919Conc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1919Conc_01,
            'max': maxEdifi1919Conc_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1919Conc_01);
    inputNumberMax.setAttribute("value",maxEdifi1919Conc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1919Conc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1919Conc_01.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1919Conc_01.noUiSlider.on('update',function(e){
        Edifi1919Conc_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_1919_01>=parseFloat(e[0])&& layer.feature.properties.ED_1919_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1919Conc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderEdifi1919Conc_01.noUiSlider;
    $(slidersGeral).append(sliderEdifi1919Conc_01);
}
contorno.addTo(map)
Edifi1919Conc_01.addTo(map);
$('#tituloMapa').html('<strong>' + 'Número de edifícios construídos antes de 1919, em 2001, por concelho.' + '</strong>');
legenda(maxEdifi1919Conc_01, ((maxEdifi1919Conc_01-minEdifi1919Conc_01)/2).toFixed(0),minEdifi1919Conc_01,0.3);
slideEdifi1919Conc_01();

///////////////////////////-------------------- FIM TOTAL EDIFICIOS CONSTRUIDOS ANTES DE 1919 ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS ENTRE 1919 E 1945 EM 2001, POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdifi1945Conc_01 = 0;
var maxEdifi1945Conc_01 = 0;
function estiloEdifi1945Conc_01(feature, latlng) {
    if(feature.properties.ED_1945_01< minEdifi1945Conc_01 || minEdifi1945Conc_01 ===0){
        minEdifi1945Conc_01 = feature.properties.ED_1945_01
    }
    if(feature.properties.ED_1945_01> maxEdifi1945Conc_01){
        maxEdifi1945Conc_01 = feature.properties.ED_1945_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1945_01,0.3)
    });
}
function apagarEdifi1945Conc_01(e){
    var layer = e.target;
    Edifi1945Conc_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1945Conc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios entre 1919 e 1945:  ' + '<b>' +feature.properties.ED_1945_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1945Conc_01,
    })
};

var Edifi1945Conc_01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi1945Conc_01,
    onEachFeature: onEachFeatureEdifi1945Conc_01,
});

var slideEdifi1945Conc_01 = function(){
    var sliderEdifi1945Conc_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1945Conc_01, {
        start: [minEdifi1945Conc_01, maxEdifi1945Conc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1945Conc_01,
            'max': maxEdifi1945Conc_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1945Conc_01);
    inputNumberMax.setAttribute("value",maxEdifi1945Conc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1945Conc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1945Conc_01.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1945Conc_01.noUiSlider.on('update',function(e){
        Edifi1945Conc_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_1945_01>=parseFloat(e[0])&& layer.feature.properties.ED_1945_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1945Conc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderEdifi1945Conc_01.noUiSlider;
    $(slidersGeral).append(sliderEdifi1945Conc_01);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1919 E 1945 ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS ENTRE 1946 E 1960 EM 2001, POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdifi1960Conc_01 = 0;
var maxEdifi1960Conc_01 = 0;
function estiloEdifi1960Conc_01(feature, latlng) {
    if(feature.properties.ED_1960_01< minEdifi1960Conc_01 || minEdifi1960Conc_01 ===0){
        minEdifi1960Conc_01 = feature.properties.ED_1960_01
    }
    if(feature.properties.ED_1960_01> maxEdifi1960Conc_01){
        maxEdifi1960Conc_01 = feature.properties.ED_1960_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1960_01,0.3)
    });
}
function apagarEdifi1960Conc_01(e){
    var layer = e.target;
    Edifi1960Conc_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1960Conc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios entre 1945 e 1960:  ' + '<b>' +feature.properties.ED_1960_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1960Conc_01,
    })
};

var Edifi1960Conc_01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi1960Conc_01,
    onEachFeature: onEachFeatureEdifi1960Conc_01,
});

var slideEdifi1960Conc_01 = function(){
    var sliderEdifi1960Conc_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1960Conc_01, {
        start: [minEdifi1960Conc_01, maxEdifi1960Conc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1960Conc_01,
            'max': maxEdifi1960Conc_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1960Conc_01);
    inputNumberMax.setAttribute("value",maxEdifi1960Conc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1960Conc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1960Conc_01.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1960Conc_01.noUiSlider.on('update',function(e){
        Edifi1960Conc_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_1960_01>=parseFloat(e[0])&& layer.feature.properties.ED_1960_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1960Conc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderEdifi1960Conc_01.noUiSlider;
    $(slidersGeral).append(sliderEdifi1960Conc_01);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1946 E 1960 ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS ENTRE 1961 E 1980 EM 2001, POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdifi1980Conc_01 = 0;
var maxEdifi1980Conc_01 = 0;
function estiloEdifi1980Conc_01(feature, latlng) {
    if(feature.properties.ED_1980_01< minEdifi1980Conc_01 || minEdifi1980Conc_01 ===0){
        minEdifi1980Conc_01 = feature.properties.ED_1980_01
    }
    if(feature.properties.ED_1980_01> maxEdifi1980Conc_01){
        maxEdifi1980Conc_01 = feature.properties.ED_1980_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1980_01,0.3)
    });
}
function apagarEdifi1980Conc_01(e){
    var layer = e.target;
    Edifi1980Conc_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1980Conc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios entre 1961 e 1980:  ' + '<b>' +feature.properties.ED_1980_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1980Conc_01,
    })
};

var Edifi1980Conc_01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi1980Conc_01,
    onEachFeature: onEachFeatureEdifi1980Conc_01,
});

var slideEdifi1980Conc_01 = function(){
    var sliderEdifi1980Conc_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1980Conc_01, {
        start: [minEdifi1980Conc_01, maxEdifi1980Conc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1980Conc_01,
            'max': maxEdifi1980Conc_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1980Conc_01);
    inputNumberMax.setAttribute("value",maxEdifi1980Conc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1980Conc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1980Conc_01.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1980Conc_01.noUiSlider.on('update',function(e){
        Edifi1980Conc_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_1980_01>=parseFloat(e[0])&& layer.feature.properties.ED_1980_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1980Conc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderEdifi1980Conc_01.noUiSlider;
    $(slidersGeral).append(sliderEdifi1980Conc_01);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1961 E 1980 ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS ENTRE 1981 E 2000 EM 2001, POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdifi2000Conc_01 = 0;
var maxEdifi2000Conc_01 = 0;
function estiloEdifi2000Conc_01(feature, latlng) {
    if(feature.properties.ED_2000_01< minEdifi2000Conc_01 || minEdifi2000Conc_01 ===0){
        minEdifi2000Conc_01 = feature.properties.ED_2000_01
    }
    if(feature.properties.ED_2000_01> maxEdifi2000Conc_01){
        maxEdifi2000Conc_01 = feature.properties.ED_2000_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_2000_01,0.3)
    });
}
function apagarEdifi2000Conc_01(e){
    var layer = e.target;
    Edifi2000Conc_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi2000Conc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios entre 1981 e 2000:  ' + '<b>' +feature.properties.ED_2000_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi2000Conc_01,
    })
};

var Edifi2000Conc_01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi2000Conc_01,
    onEachFeature: onEachFeatureEdifi2000Conc_01,
});

var slideEdifi2000Conc_01 = function(){
    var sliderEdifi2000Conc_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi2000Conc_01, {
        start: [minEdifi2000Conc_01, maxEdifi2000Conc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi2000Conc_01,
            'max': maxEdifi2000Conc_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi2000Conc_01);
    inputNumberMax.setAttribute("value",maxEdifi2000Conc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi2000Conc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi2000Conc_01.noUiSlider.set([null, this.value]);
    });

    sliderEdifi2000Conc_01.noUiSlider.on('update',function(e){
        Edifi2000Conc_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_2000_01>=parseFloat(e[0])&& layer.feature.properties.ED_2000_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi2000Conc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderEdifi2000Conc_01.noUiSlider;
    $(slidersGeral).append(sliderEdifi2000Conc_01);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1981 E 2000 ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS CONSTRUÍDOS ANTES DE 1919, POR CONCELHO 2011-----------------------\\\\\\\\\\\\\

var minEdifi1919Conc_11 = 0;
var maxEdifi1919Conc_11 = 0;
function estiloEdifi1919Conc_11(feature, latlng) {
    if(feature.properties.ED_1919_11< minEdifi1919Conc_11 || minEdifi1919Conc_11 ===0){
        minEdifi1919Conc_11 = feature.properties.ED_1919_11
    }
    if(feature.properties.ED_1919_11> maxEdifi1919Conc_11){
        maxEdifi1919Conc_11 = feature.properties.ED_1919_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1919_11,0.3)
    });
}
function apagarEdifi1919Conc_11(e){
    var layer = e.target;
    Edifi1919Conc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1919Conc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios antes de 1919:  ' + '<b>' +feature.properties.ED_1919_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1919Conc_11,
    })
};

var Edifi1919Conc_11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi1919Conc_11,
    onEachFeature: onEachFeatureEdifi1919Conc_11,
});

var slideEdifi1919Conc_11 = function(){
    var sliderEdifi1919Conc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1919Conc_11, {
        start: [minEdifi1919Conc_11, maxEdifi1919Conc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1919Conc_11,
            'max': maxEdifi1919Conc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1919Conc_11);
    inputNumberMax.setAttribute("value",maxEdifi1919Conc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1919Conc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1919Conc_11.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1919Conc_11.noUiSlider.on('update',function(e){
        Edifi1919Conc_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_1919_11>=parseFloat(e[0])&& layer.feature.properties.ED_1919_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1919Conc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderEdifi1919Conc_11.noUiSlider;
    $(slidersGeral).append(sliderEdifi1919Conc_11);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS CONSTRUIDOS ANTES 1919 ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

///////////////////////////----------- EDIFICIOS CONSTRUÍDOS ENTRE 1919 E 1945, POR CONCELHO 2011-----------------------\\\\\\\\\\\\\

var minEdifi1945Conc_11 = 0;
var maxEdifi1945Conc_11 = 0;
function estiloEdifi1945Conc_11(feature, latlng) {
    if(feature.properties.ED_1945_11< minEdifi1945Conc_11 || minEdifi1945Conc_11 ===0){
        minEdifi1945Conc_11 = feature.properties.ED_1945_11
    }
    if(feature.properties.ED_1945_11> maxEdifi1945Conc_11){
        maxEdifi1945Conc_11 = feature.properties.ED_1945_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1945_11,0.3)
    });
}
function apagarEdifi1945Conc_11(e){
    var layer = e.target;
    Edifi1945Conc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1945Conc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios entre 1919 e 1945:  ' + '<b>' +feature.properties.ED_1945_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1945Conc_11,
    })
};

var Edifi1945Conc_11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi1945Conc_11,
    onEachFeature: onEachFeatureEdifi1945Conc_11,
});

var slideEdifi1945Conc_11 = function(){
    var sliderEdifi1945Conc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1945Conc_11, {
        start: [minEdifi1945Conc_11, maxEdifi1945Conc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1945Conc_11,
            'max': maxEdifi1945Conc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1945Conc_11);
    inputNumberMax.setAttribute("value",maxEdifi1945Conc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1945Conc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1945Conc_11.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1945Conc_11.noUiSlider.on('update',function(e){
        Edifi1945Conc_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_1945_11>=parseFloat(e[0])&& layer.feature.properties.ED_1945_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1945Conc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderEdifi1945Conc_11.noUiSlider;
    $(slidersGeral).append(sliderEdifi1945Conc_11);
}
 
///////////////////////////--------------FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1919 E 1945 ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////----------- EDIFICIOS CONSTRUÍDOS ENTRE 1945 E 1960, POR CONCELHO 2011-----------------------\\\\\\\\\\\\\

var minEdifi1960Conc_11 = 0;
var maxEdifi1960Conc_11 = 0;
function estiloEdifi1960Conc_11(feature, latlng) {
    if(feature.properties.ED_1960_11< minEdifi1960Conc_11 || minEdifi1960Conc_11 ===0){
        minEdifi1960Conc_11 = feature.properties.ED_1960_11
    }
    if(feature.properties.ED_1960_11> maxEdifi1960Conc_11){
        maxEdifi1960Conc_11 = feature.properties.ED_1960_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1960_11,0.3)
    });
}
function apagarEdifi1960Conc_11(e){
    var layer = e.target;
    Edifi1960Conc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1960Conc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios entre 1946 e 1960:  ' + '<b>' +feature.properties.ED_1960_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1960Conc_11,
    })
};

var Edifi1960Conc_11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi1960Conc_11,
    onEachFeature: onEachFeatureEdifi1960Conc_11,
});

var slideEdifi1960Conc_11 = function(){
    var sliderEdifi1960Conc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1960Conc_11, {
        start: [minEdifi1960Conc_11, maxEdifi1960Conc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1960Conc_11,
            'max': maxEdifi1960Conc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1960Conc_11);
    inputNumberMax.setAttribute("value",maxEdifi1960Conc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1960Conc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1960Conc_11.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1960Conc_11.noUiSlider.on('update',function(e){
        Edifi1960Conc_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_1960_11>=parseFloat(e[0])&& layer.feature.properties.ED_1960_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1960Conc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderEdifi1960Conc_11.noUiSlider;
    $(slidersGeral).append(sliderEdifi1960Conc_11);
}
 
///////////////////////////--------------FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1946 E 1960 ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////----------- EDIFICIOS CONSTRUÍDOS ENTRE 1961 E 1980, POR CONCELHO 2011-----------------------\\\\\\\\\\\\\

var minEdifi1980Conc_11 = 0;
var maxEdifi1980Conc_11 = 0;
function estiloEdifi1980Conc_11(feature, latlng) {
    if(feature.properties.ED_1980_11< minEdifi1980Conc_11 || minEdifi1980Conc_11 ===0){
        minEdifi1980Conc_11 = feature.properties.ED_1980_11
    }
    if(feature.properties.ED_1980_11> maxEdifi1980Conc_11){
        maxEdifi1980Conc_11 = feature.properties.ED_1980_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1980_11,0.3)
    });
}
function apagarEdifi1980Conc_11(e){
    var layer = e.target;
    Edifi1980Conc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1980Conc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios entre 1961 e 1980:  ' + '<b>' +feature.properties.ED_1980_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1980Conc_11,
    })
};

var Edifi1980Conc_11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi1980Conc_11,
    onEachFeature: onEachFeatureEdifi1980Conc_11,
});

var slideEdifi1980Conc_11 = function(){
    var sliderEdifi1980Conc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1980Conc_11, {
        start: [minEdifi1980Conc_11, maxEdifi1980Conc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1980Conc_11,
            'max': maxEdifi1980Conc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1980Conc_11);
    inputNumberMax.setAttribute("value",maxEdifi1980Conc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1980Conc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1980Conc_11.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1980Conc_11.noUiSlider.on('update',function(e){
        Edifi1980Conc_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_1980_11>=parseFloat(e[0])&& layer.feature.properties.ED_1980_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1980Conc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderEdifi1980Conc_11.noUiSlider;
    $(slidersGeral).append(sliderEdifi1980Conc_11);
}
 
///////////////////////////--------------FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1961 E 1980 ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////----------- EDIFICIOS CONSTRUÍDOS ENTRE 1980 E 2001, POR CONCELHO 2011-----------------------\\\\\\\\\\\\\

var minEdifi2000Conc_11 = 0;
var maxEdifi2000Conc_11 = 0;
function estiloEdifi2000Conc_11(feature, latlng) {
    if(feature.properties.ED_2000_11< minEdifi2000Conc_11 || minEdifi2000Conc_11 ===0){
        minEdifi2000Conc_11 = feature.properties.ED_2000_11
    }
    if(feature.properties.ED_2000_11> maxEdifi2000Conc_11){
        maxEdifi2000Conc_11 = feature.properties.ED_2000_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_2000_11,0.3)
    });
}
function apagarEdifi2000Conc_11(e){
    var layer = e.target;
    Edifi2000Conc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi2000Conc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios entre 1981 e 2000:  ' + '<b>' +feature.properties.ED_2000_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi2000Conc_11,
    })
};

var Edifi2000Conc_11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi2000Conc_11,
    onEachFeature: onEachFeatureEdifi2000Conc_11,
});

var slideEdifi2000Conc_11 = function(){
    var sliderEdifi2000Conc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi2000Conc_11, {
        start: [minEdifi2000Conc_11, maxEdifi2000Conc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi2000Conc_11,
            'max': maxEdifi2000Conc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi2000Conc_11);
    inputNumberMax.setAttribute("value",maxEdifi2000Conc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi2000Conc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi2000Conc_11.noUiSlider.set([null, this.value]);
    });

    sliderEdifi2000Conc_11.noUiSlider.on('update',function(e){
        Edifi2000Conc_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_2000_11>=parseFloat(e[0])&& layer.feature.properties.ED_2000_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi2000Conc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderEdifi2000Conc_11.noUiSlider;
    $(slidersGeral).append(sliderEdifi2000Conc_11);
}
 
///////////////////////////--------------FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1981 E 2000 ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\


///////////////////////////----------- EDIFICIOS CONSTRUÍDOS ENTRE 2001 E 2010, POR CONCELHO 2011-----------------------\\\\\\\\\\\\\

var minEdifi2010Conc_11 = 0;
var maxEdifi2010Conc_11 = 0;
function estiloEdifi2010Conc_11(feature, latlng) {
    if(feature.properties.ED_2010_11< minEdifi2010Conc_11 || minEdifi2010Conc_11 ===0){
        minEdifi2010Conc_11 = feature.properties.ED_2010_11
    }
    if(feature.properties.ED_2010_11> maxEdifi2010Conc_11){
        maxEdifi2010Conc_11 = feature.properties.ED_2010_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_2010_11,0.3)
    });
}
function apagarEdifi2010Conc_11(e){
    var layer = e.target;
    Edifi2010Conc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi2010Conc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios entre 2001 e 2010:  ' + '<b>' +feature.properties.ED_2010_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi2010Conc_11,
    })
};

var Edifi2010Conc_11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi2010Conc_11,
    onEachFeature: onEachFeatureEdifi2010Conc_11,
});

var slideEdifi2010Conc_11 = function(){
    var sliderEdifi2010Conc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi2010Conc_11, {
        start: [minEdifi2010Conc_11, maxEdifi2010Conc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi2010Conc_11,
            'max': maxEdifi2010Conc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi2010Conc_11);
    inputNumberMax.setAttribute("value",maxEdifi2010Conc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi2010Conc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi2010Conc_11.noUiSlider.set([null, this.value]);
    });

    sliderEdifi2010Conc_11.noUiSlider.on('update',function(e){
        Edifi2010Conc_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_2010_11>=parseFloat(e[0])&& layer.feature.properties.ED_2010_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi2010Conc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderEdifi2010Conc_11.noUiSlider;
    $(slidersGeral).append(sliderEdifi2010Conc_11);
}
 
///////////////////////////--------------FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 2001 E 2010 ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\


///////////////////////////----------- EDIFICIOS CONSTRUÍDOS ANTES 1919, POR CONCELHO 2021-----------------------\\\\\\\\\\\\\

var minEdifi1919Conc_21 = 0;
var maxEdifi1919Conc_21 = 0;
function estiloEdifi1919Conc_21(feature, latlng) {
    if(feature.properties.ED_1919_21< minEdifi1919Conc_21 || minEdifi1919Conc_21 ===0){
        minEdifi1919Conc_21 = feature.properties.ED_1919_21
    }
    if(feature.properties.ED_1919_21> maxEdifi1919Conc_21){
        maxEdifi1919Conc_21 = feature.properties.ED_1919_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1919_21,0.3)
    });
}
function apagarEdifi1919Conc_21(e){
    var layer = e.target;
    Edifi1919Conc_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1919Conc_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios antes de 1919:  ' + '<b>' +feature.properties.ED_1919_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1919Conc_21,
    })
};

var Edifi1919Conc_21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi1919Conc_21,
    onEachFeature: onEachFeatureEdifi1919Conc_21,
});

var slideEdifi1919Conc_21 = function(){
    var sliderEdifi1919Conc_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1919Conc_21, {
        start: [minEdifi1919Conc_21, maxEdifi1919Conc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1919Conc_21,
            'max': maxEdifi1919Conc_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1919Conc_21);
    inputNumberMax.setAttribute("value",maxEdifi1919Conc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1919Conc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1919Conc_21.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1919Conc_21.noUiSlider.on('update',function(e){
        Edifi1919Conc_21.eachLayer(function(layer){
            if(layer.feature.properties.ED_1919_21>=parseFloat(e[0])&& layer.feature.properties.ED_1919_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1919Conc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderEdifi1919Conc_21.noUiSlider;
    $(slidersGeral).append(sliderEdifi1919Conc_21);
}
 
///////////////////////////--------------FIM TOTAL EDIFICIOS CONSTRUIDOS ANTES 1919 ,CONCELHO 2021 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////----------- EDIFICIOS CONSTRUÍDOS ENTRE 1919 E 1945, POR CONCELHO 2021-----------------------\\\\\\\\\\\\\

var minEdifi1945Conc_21 = 0;
var maxEdifi1945Conc_21 = 0;
function estiloEdifi1945Conc_21(feature, latlng) {
    if(feature.properties.ED_1945_21< minEdifi1945Conc_21 || minEdifi1945Conc_21 ===0){
        minEdifi1945Conc_21 = feature.properties.ED_1945_21
    }
    if(feature.properties.ED_1945_21> maxEdifi1945Conc_21){
        maxEdifi1945Conc_21 = feature.properties.ED_1945_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1945_21,0.3)
    });
}
function apagarEdifi1945Conc_21(e){
    var layer = e.target;
    Edifi1945Conc_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1945Conc_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios entre 1919 e 1945:  ' + '<b>' +feature.properties.ED_1945_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1945Conc_21,
    })
};

var Edifi1945Conc_21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi1945Conc_21,
    onEachFeature: onEachFeatureEdifi1945Conc_21,
});

var slideEdifi1945Conc_21 = function(){
    var sliderEdifi1945Conc_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1945Conc_21, {
        start: [minEdifi1945Conc_21, maxEdifi1945Conc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1945Conc_21,
            'max': maxEdifi1945Conc_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1945Conc_21);
    inputNumberMax.setAttribute("value",maxEdifi1945Conc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1945Conc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1945Conc_21.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1945Conc_21.noUiSlider.on('update',function(e){
        Edifi1945Conc_21.eachLayer(function(layer){
            if(layer.feature.properties.ED_1945_21>=parseFloat(e[0])&& layer.feature.properties.ED_1945_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1945Conc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderEdifi1945Conc_21.noUiSlider;
    $(slidersGeral).append(sliderEdifi1945Conc_21);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1919 E 1945 ,CONCELHO 2021 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////----------- EDIFICIOS CONSTRUÍDOS ENTRE 1946 E 1960, POR CONCELHO 2021-----------------------\\\\\\\\\\\\\

var minEdifi1960Conc_21 = 0;
var maxEdifi1960Conc_21 = 0;
function estiloEdifi1960Conc_21(feature, latlng) {
    if(feature.properties.ED_1960_21< minEdifi1960Conc_21 || minEdifi1960Conc_21 ===0){
        minEdifi1960Conc_21 = feature.properties.ED_1960_21
    }
    if(feature.properties.ED_1960_21> maxEdifi1960Conc_21){
        maxEdifi1960Conc_21 = feature.properties.ED_1960_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1960_21,0.3)
    });
}
function apagarEdifi1960Conc_21(e){
    var layer = e.target;
    Edifi1960Conc_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1960Conc_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios entre 1946 e 1960:  ' + '<b>' +feature.properties.ED_1960_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1960Conc_21,
    })
};

var Edifi1960Conc_21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi1960Conc_21,
    onEachFeature: onEachFeatureEdifi1960Conc_21,
});

var slideEdifi1960Conc_21 = function(){
    var sliderEdifi1960Conc_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1960Conc_21, {
        start: [minEdifi1960Conc_21, maxEdifi1960Conc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1960Conc_21,
            'max': maxEdifi1960Conc_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1960Conc_21);
    inputNumberMax.setAttribute("value",maxEdifi1960Conc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1960Conc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1960Conc_21.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1960Conc_21.noUiSlider.on('update',function(e){
        Edifi1960Conc_21.eachLayer(function(layer){
            if(layer.feature.properties.ED_1960_21>=parseFloat(e[0])&& layer.feature.properties.ED_1960_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1960Conc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderEdifi1960Conc_21.noUiSlider;
    $(slidersGeral).append(sliderEdifi1960Conc_21);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1946 E 1960 ,CONCELHO 2021 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////----------- EDIFICIOS CONSTRUÍDOS ENTRE 1961 E 1980, POR CONCELHO 2021-----------------------\\\\\\\\\\\\\

var minEdifi1980Conc_21 = 0;
var maxEdifi1980Conc_21 = 0;
function estiloEdifi1980Conc_21(feature, latlng) {
    if(feature.properties.ED_1980_21< minEdifi1980Conc_21 || minEdifi1980Conc_21 ===0){
        minEdifi1980Conc_21 = feature.properties.ED_1980_21
    }
    if(feature.properties.ED_1980_21> maxEdifi1980Conc_21){
        maxEdifi1980Conc_21 = feature.properties.ED_1980_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1980_21,0.3)
    });
}
function apagarEdifi1980Conc_21(e){
    var layer = e.target;
    Edifi1980Conc_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1980Conc_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios entre 1961 e 1980:  ' + '<b>' +feature.properties.ED_1980_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1980Conc_21,
    })
};

var Edifi1980Conc_21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi1980Conc_21,
    onEachFeature: onEachFeatureEdifi1980Conc_21,
});

var slideEdifi1980Conc_21 = function(){
    var sliderEdifi1980Conc_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1980Conc_21, {
        start: [minEdifi1980Conc_21, maxEdifi1980Conc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1980Conc_21,
            'max': maxEdifi1980Conc_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1980Conc_21);
    inputNumberMax.setAttribute("value",maxEdifi1980Conc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1980Conc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1980Conc_21.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1980Conc_21.noUiSlider.on('update',function(e){
        Edifi1980Conc_21.eachLayer(function(layer){
            if(layer.feature.properties.ED_1980_21>=parseFloat(e[0])&& layer.feature.properties.ED_1980_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1980Conc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderEdifi1980Conc_21.noUiSlider;
    $(slidersGeral).append(sliderEdifi1980Conc_21);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1961 E 1980 ,CONCELHO 2021 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////----------- EDIFICIOS CONSTRUÍDOS ENTRE 1980 E 2000, POR CONCELHO 2021-----------------------\\\\\\\\\\\\\

var minEdifi2000Conc_21 = 0;
var maxEdifi2000Conc_21 = 0;
function estiloEdifi2000Conc_21(feature, latlng) {
    if(feature.properties.ED_2000_21< minEdifi2000Conc_21 || minEdifi2000Conc_21 ===0){
        minEdifi2000Conc_21 = feature.properties.ED_2000_21
    }
    if(feature.properties.ED_2000_21> maxEdifi2000Conc_21){
        maxEdifi2000Conc_21 = feature.properties.ED_2000_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_2000_21,0.3)
    });
}
function apagarEdifi2000Conc_21(e){
    var layer = e.target;
    Edifi2000Conc_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi2000Conc_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios entre 1981 e 2000:  ' + '<b>' +feature.properties.ED_2000_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi2000Conc_21,
    })
};

var Edifi2000Conc_21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi2000Conc_21,
    onEachFeature: onEachFeatureEdifi2000Conc_21,
});

var slideEdifi2000Conc_21 = function(){
    var sliderEdifi2000Conc_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi2000Conc_21, {
        start: [minEdifi2000Conc_21, maxEdifi2000Conc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi2000Conc_21,
            'max': maxEdifi2000Conc_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi2000Conc_21);
    inputNumberMax.setAttribute("value",maxEdifi2000Conc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi2000Conc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi2000Conc_21.noUiSlider.set([null, this.value]);
    });

    sliderEdifi2000Conc_21.noUiSlider.on('update',function(e){
        Edifi2000Conc_21.eachLayer(function(layer){
            if(layer.feature.properties.ED_2000_21>=parseFloat(e[0])&& layer.feature.properties.ED_2000_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi2000Conc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderEdifi2000Conc_21.noUiSlider;
    $(slidersGeral).append(sliderEdifi2000Conc_21);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1981 E 2000 ,CONCELHO 2021 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////----------- EDIFICIOS CONSTRUÍDOS ENTRE 2001 E 2010, POR CONCELHO 2021-----------------------\\\\\\\\\\\\\

var minEdifi2010Conc_21 = 0;
var maxEdifi2010Conc_21 = 0;
function estiloEdifi2010Conc_21(feature, latlng) {
    if(feature.properties.ED_2010_21< minEdifi2010Conc_21 || minEdifi2010Conc_21 ===0){
        minEdifi2010Conc_21 = feature.properties.ED_2010_21
    }
    if(feature.properties.ED_2010_21> maxEdifi2010Conc_21){
        maxEdifi2010Conc_21 = feature.properties.ED_2010_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_2010_21,0.3)
    });
}
function apagarEdifi2010Conc_21(e){
    var layer = e.target;
    Edifi2010Conc_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi2010Conc_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios entre 2001 e 2010:  ' + '<b>' +feature.properties.ED_2010_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi2010Conc_21,
    })
};

var Edifi2010Conc_21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi2010Conc_21,
    onEachFeature: onEachFeatureEdifi2010Conc_21,
});

var slideEdifi2010Conc_21 = function(){
    var sliderEdifi2010Conc_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi2010Conc_21, {
        start: [minEdifi2010Conc_21, maxEdifi2010Conc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi2010Conc_21,
            'max': maxEdifi2010Conc_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi2010Conc_21);
    inputNumberMax.setAttribute("value",maxEdifi2010Conc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi2010Conc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi2010Conc_21.noUiSlider.set([null, this.value]);
    });

    sliderEdifi2010Conc_21.noUiSlider.on('update',function(e){
        Edifi2010Conc_21.eachLayer(function(layer){
            if(layer.feature.properties.ED_2010_21>=parseFloat(e[0])&& layer.feature.properties.ED_2010_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi2010Conc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderEdifi2010Conc_21.noUiSlider;
    $(slidersGeral).append(sliderEdifi2010Conc_21);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 2001 E 2010 ,CONCELHO 2021 -----------\\\\\\\\\\\\\\\\\\\\


///////////////////////////----------- EDIFICIOS CONSTRUÍDOS ENTRE 2011 E 2021, POR CONCELHO 2021-----------------------\\\\\\\\\\\\\

var minEdifi2020Conc_21 = 0;
var maxEdifi2020Conc_21 = 0;
function estiloEdifi2020Conc_21(feature, latlng) {
    if(feature.properties.ED_2020< minEdifi2020Conc_21 || minEdifi2020Conc_21 ===0){
        minEdifi2020Conc_21 = feature.properties.ED_2020
    }
    if(feature.properties.ED_2020> maxEdifi2020Conc_21){
        maxEdifi2020Conc_21 = feature.properties.ED_2020
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_2020,0.3)
    });
}
function apagarEdifi2020Conc_21(e){
    var layer = e.target;
    Edifi2020Conc_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi2020Conc_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios entre 2011 e 2021:  ' + '<b>' +feature.properties.ED_2020 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi2020Conc_21,
    })
};

var Edifi2020Conc_21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdifi2020Conc_21,
    onEachFeature: onEachFeatureEdifi2020Conc_21,
});

var slideEdifi2020Conc_21 = function(){
    var sliderEdifi2020Conc_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi2020Conc_21, {
        start: [minEdifi2020Conc_21, maxEdifi2020Conc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi2020Conc_21,
            'max': maxEdifi2020Conc_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi2020Conc_21);
    inputNumberMax.setAttribute("value",maxEdifi2020Conc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi2020Conc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi2020Conc_21.noUiSlider.set([null, this.value]);
    });

    sliderEdifi2020Conc_21.noUiSlider.on('update',function(e){
        Edifi2020Conc_21.eachLayer(function(layer){
            if(layer.feature.properties.ED_2020>=parseFloat(e[0])&& layer.feature.properties.ED_2020 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi2020Conc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderEdifi2020Conc_21.noUiSlider;
    $(slidersGeral).append(sliderEdifi2020Conc_21);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 2011 E 2021 ,CONCELHO 2021 -----------\\\\\\\\\\\\\\\\\\\\

//////////////////////----------------------- FIM DADOS ABSOLUTOS CONCELHOS ---------------\\\\\\\\\\\\\
/////////////////////////--------------- DADOS RELATIVOS CONCELHOS----------------\\\\\\\\\\\\\\\\\


//////////////////------- Percentagem EDIFICIOS ANTES 1919 por Concelho em 2001-----////

var minPerEDI_1919_Conc01 = 0;
var maxPerEDI_1919_Conc01 = 0;

function CorPerEDI1919Conc(d) {
    return d >= 17.03 ? '#8c0303' :
        d >= 14.6  ? '#de1f35' :
        d >= 10.55 ? '#ff5e6e' :
        d >= 6.5   ? '#f5b3be' :
        d >= 2.45   ? '#F2C572' :
                ''  ;
}
var legendaPerEDI1919Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 17.03' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 14.6 - 17.03' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 10.55 - 14.6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 6.5 - 10.55' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 2.45 - 6.5' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEDI_1919_Conc01(feature) {
    if( feature.properties.P1919_01 <= minPerEDI_1919_Conc01 || minPerEDI_1919_Conc01 === 0){
        minPerEDI_1919_Conc01 = feature.properties.P1919_01
    }
    if(feature.properties.P1919_01 >= maxPerEDI_1919_Conc01 ){
        maxPerEDI_1919_Conc01 = feature.properties.P1919_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1919Conc(feature.properties.P1919_01)
    };
}
function apagarPerEDI_1919_Conc01(e) {
    PerEDI_1919_Conc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1919_Conc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P1919_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1919_Conc01,
    });
}
var PerEDI_1919_Conc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_1919_Conc01,
    onEachFeature: onEachFeaturePerEDI_1919_Conc01
});
let slidePerEDI_1919_Conc01 = function(){
    var sliderPerEDI_1919_Conc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1919_Conc01, {
        start: [minPerEDI_1919_Conc01, maxPerEDI_1919_Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1919_Conc01,
            'max': maxPerEDI_1919_Conc01
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1919_Conc01);
    inputNumberMax.setAttribute("value",maxPerEDI_1919_Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1919_Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1919_Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1919_Conc01.noUiSlider.on('update',function(e){
        PerEDI_1919_Conc01.eachLayer(function(layer){
            if(layer.feature.properties.P1919_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1919_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1919_Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderPerEDI_1919_Conc01.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1919_Conc01);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ANTES 1919 2001 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1919 E 1945 por Concelho em 2001-----////

var minPerEDI_1945_Conc01 = 0;
var maxPerEDI_1945_Conc01 = 0;

function CorPerEDI1945Conc(d) {
    return d >= 25.81 ? '#8c0303' :
        d >= 22.22  ? '#de1f35' :
        d >= 16.22 ? '#ff5e6e' :
        d >= 10.23   ? '#f5b3be' :
        d >= 4.23   ? '#F2C572' :
                ''  ;
}
var legendaPerEDI1945Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 25.81' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 22.22 - 25.81' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 16.22 - 22.22' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 10.23 - 16.22' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 4.23 - 10.23' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEDI_1945_Conc01(feature) {
    if( feature.properties.P1945_01 <= minPerEDI_1945_Conc01 || minPerEDI_1945_Conc01 === 0){
        minPerEDI_1945_Conc01 = feature.properties.P1945_01
    }
    if(feature.properties.P1945_01 >= maxPerEDI_1945_Conc01 ){
        maxPerEDI_1945_Conc01 = feature.properties.P1945_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1945Conc(feature.properties.P1945_01)
    };
}
function apagarPerEDI_1945_Conc01(e) {
    PerEDI_1945_Conc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1945_Conc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P1945_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1945_Conc01,
    });
}
var PerEDI_1945_Conc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_1945_Conc01,
    onEachFeature: onEachFeaturePerEDI_1945_Conc01
});
let slidePerEDI_1945_Conc01 = function(){
    var sliderPerEDI_1945_Conc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1945_Conc01, {
        start: [minPerEDI_1945_Conc01, maxPerEDI_1945_Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1945_Conc01,
            'max': maxPerEDI_1945_Conc01
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1945_Conc01);
    inputNumberMax.setAttribute("value",maxPerEDI_1945_Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1945_Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1945_Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1945_Conc01.noUiSlider.on('update',function(e){
        PerEDI_1945_Conc01.eachLayer(function(layer){
            if(layer.feature.properties.P1945_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1945_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1945_Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderPerEDI_1945_Conc01.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1945_Conc01);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1919 E 1945, 2001 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1946 E 1960 por Concelho em 2001-----////

var minPerEDI_1960_Conc01 = 0;
var maxPerEDI_1960_Conc01 = 0;

function CorPerEDI1960Conc(d) {
    return d >= 19.69 ? '#8c0303' :
        d >= 17.52  ? '#de1f35' :
        d >= 13.93 ? '#ff5e6e' :
        d >= 10.31   ? '#f5b3be' :
        d >= 6.7   ? '#F2C572' :
                ''  ;
}
var legendaPerEDI1960Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 19.69' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 17.52 - 19.69' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 13.93 - 17.52' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 10.31 - 13.93' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 6.7 - 10.31' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEDI_1960_Conc01(feature) {
    if( feature.properties.P1960_01 <= minPerEDI_1960_Conc01 || minPerEDI_1960_Conc01 === 0){
        minPerEDI_1960_Conc01 = feature.properties.P1960_01
    }
    if(feature.properties.P1960_01 >= maxPerEDI_1960_Conc01 ){
        maxPerEDI_1960_Conc01 = feature.properties.P1960_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1960Conc(feature.properties.P1960_01)
    };
}
function apagarPerEDI_1960_Conc01(e) {
    PerEDI_1960_Conc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1960_Conc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P1960_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1960_Conc01,
    });
}
var PerEDI_1960_Conc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_1960_Conc01,
    onEachFeature: onEachFeaturePerEDI_1960_Conc01
});
let slidePerEDI_1960_Conc01 = function(){
    var sliderPerEDI_1960_Conc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1960_Conc01, {
        start: [minPerEDI_1960_Conc01, maxPerEDI_1960_Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1960_Conc01,
            'max': maxPerEDI_1960_Conc01
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1960_Conc01);
    inputNumberMax.setAttribute("value",maxPerEDI_1960_Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1960_Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1960_Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1960_Conc01.noUiSlider.on('update',function(e){
        PerEDI_1960_Conc01.eachLayer(function(layer){
            if(layer.feature.properties.P1960_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1960_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1960_Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderPerEDI_1960_Conc01.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1960_Conc01);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1946 E 1960, 2001 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1961 E 1980 por Concelho em 2001-----////

var minPerEDI_1980_Conc01 = 0;
var maxPerEDI_1980_Conc01 = 0;

function CorPerEDI1980Conc(d) {
    return d >= 34.21 ? '#8c0303' :
        d >= 31.86  ? '#de1f35' :
        d >= 27.94 ? '#ff5e6e' :
        d >= 24.01   ? '#f5b3be' :
        d >= 20.09   ? '#F2C572' :
                ''  ;
}
var legendaPerEDI1980Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 34.21' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 31.86 - 34.21' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 27.94 - 31.86' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 24.01 - 27.94' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 20.09 - 24.01' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEDI_1980_Conc01(feature) {
    if( feature.properties.P1980_01 <= minPerEDI_1980_Conc01 || minPerEDI_1980_Conc01 === 0){
        minPerEDI_1980_Conc01 = feature.properties.P1980_01
    }
    if(feature.properties.P1980_01 >= maxPerEDI_1980_Conc01 ){
        maxPerEDI_1980_Conc01 = feature.properties.P1980_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1980Conc(feature.properties.P1980_01)
    };
}
function apagarPerEDI_1980_Conc01(e) {
    PerEDI_1980_Conc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1980_Conc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P1980_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1980_Conc01,
    });
}
var PerEDI_1980_Conc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_1980_Conc01,
    onEachFeature: onEachFeaturePerEDI_1980_Conc01
});
let slidePerEDI_1980_Conc01 = function(){
    var sliderPerEDI_1980_Conc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1980_Conc01, {
        start: [minPerEDI_1980_Conc01, maxPerEDI_1980_Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1980_Conc01,
            'max': maxPerEDI_1980_Conc01
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1980_Conc01);
    inputNumberMax.setAttribute("value",maxPerEDI_1980_Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1980_Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1980_Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1980_Conc01.noUiSlider.on('update',function(e){
        PerEDI_1980_Conc01.eachLayer(function(layer){
            if(layer.feature.properties.P1980_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1980_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1980_Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderPerEDI_1980_Conc01.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1980_Conc01);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1961 E 1980, 2001 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1981 E 2000 por Concelho em 2001-----////

var minPerEDI_2000_Conc01 = 0;
var maxPerEDI_2000_Conc01 = 0;

function CorPerEDI2000Conc(d) {
    return d >= 44.54 ? '#8c0303' :
        d >= 38.99  ? '#de1f35' :
        d >= 29.75 ? '#ff5e6e' :
        d >= 20.5   ? '#f5b3be' :
        d >= 11.25   ? '#F2C572' :
                ''  ;
}
var legendaPerEDI2000Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 44.54' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 38.99 - 44.54' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 29.75 - 38.99' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 20.5 - 29.75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 11.25 - 20.5' + '<br>'

    $(legendaA).append(symbolsContainer); 
}


function EstiloPerEDI_2000_Conc01(feature) {
    if( feature.properties.P2000_01 <= minPerEDI_2000_Conc01 || minPerEDI_2000_Conc01 === 0){
        minPerEDI_2000_Conc01 = feature.properties.P2000_01
    }
    if(feature.properties.P2000_01 >= maxPerEDI_2000_Conc01 ){
        maxPerEDI_2000_Conc01 = feature.properties.P2000_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI2000Conc(feature.properties.P2000_01)
    };
}
function apagarPerEDI_2000_Conc01(e) {
    PerEDI_2000_Conc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_2000_Conc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P2000_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_2000_Conc01,
    });
}
var PerEDI_2000_Conc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_2000_Conc01,
    onEachFeature: onEachFeaturePerEDI_2000_Conc01
});
let slidePerEDI_2000_Conc01 = function(){
    var sliderPerEDI_2000_Conc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_2000_Conc01, {
        start: [minPerEDI_2000_Conc01, maxPerEDI_2000_Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_2000_Conc01,
            'max': maxPerEDI_2000_Conc01
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_2000_Conc01);
    inputNumberMax.setAttribute("value",maxPerEDI_2000_Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_2000_Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_2000_Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_2000_Conc01.noUiSlider.on('update',function(e){
        PerEDI_2000_Conc01.eachLayer(function(layer){
            if(layer.feature.properties.P2000_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P2000_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_2000_Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderPerEDI_2000_Conc01.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_2000_Conc01);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1981 E 2000, 2001 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ANTES 1919 por Concelho em 2011-----////

var minPerEDI_1919_Conc11 = 0;
var maxPerEDI_1919_Conc11 = 0;

function EstiloPerEDI_1919_Conc11(feature) {
    if( feature.properties.P1919_11 <= minPerEDI_1919_Conc11 || minPerEDI_1919_Conc11 === 0){
        minPerEDI_1919_Conc11 = feature.properties.P1919_11
    }
    if(feature.properties.P1919_11 >= maxPerEDI_1919_Conc11 ){
        maxPerEDI_1919_Conc11 = feature.properties.P1919_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1919Conc(feature.properties.P1919_11)
    };
}
function apagarPerEDI_1919_Conc11(e) {
    PerEDI_1919_Conc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1919_Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P1919_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1919_Conc11,
    });
}
var PerEDI_1919_Conc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_1919_Conc11,
    onEachFeature: onEachFeaturePerEDI_1919_Conc11
});
let slidePerEDI_1919_Conc11 = function(){
    var sliderPerEDI_1919_Conc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1919_Conc11, {
        start: [minPerEDI_1919_Conc11, maxPerEDI_1919_Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1919_Conc11,
            'max': maxPerEDI_1919_Conc11
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1919_Conc11);
    inputNumberMax.setAttribute("value",maxPerEDI_1919_Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1919_Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1919_Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1919_Conc11.noUiSlider.on('update',function(e){
        PerEDI_1919_Conc11.eachLayer(function(layer){
            if(layer.feature.properties.P1919_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1919_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1919_Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderPerEDI_1919_Conc11.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1919_Conc11);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ANTES 1919 2011 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1919 E 1945 por Concelho em 2011-----////

var minPerEDI_1945_Conc11 = 0;
var maxPerEDI_1945_Conc11 = 0;

function EstiloPerEDI_1945_Conc11(feature) {
    if( feature.properties.P1945_11 <= minPerEDI_1945_Conc11 || minPerEDI_1945_Conc11 === 0){
        minPerEDI_1945_Conc11 = feature.properties.P1945_11
    }
    if(feature.properties.P1945_11 >= maxPerEDI_1945_Conc11 ){
        maxPerEDI_1945_Conc11 = feature.properties.P1945_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1945Conc(feature.properties.P1945_11)
    };
}
function apagarPerEDI_1945_Conc11(e) {
    PerEDI_1945_Conc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1945_Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P1945_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1945_Conc11,
    });
}
var PerEDI_1945_Conc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_1945_Conc11,
    onEachFeature: onEachFeaturePerEDI_1945_Conc11
});
let slidePerEDI_1945_Conc11 = function(){
    var sliderPerEDI_1945_Conc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1945_Conc11, {
        start: [minPerEDI_1945_Conc11, maxPerEDI_1945_Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1945_Conc11,
            'max': maxPerEDI_1945_Conc11
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1945_Conc11);
    inputNumberMax.setAttribute("value",maxPerEDI_1945_Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1945_Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1945_Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1945_Conc11.noUiSlider.on('update',function(e){
        PerEDI_1945_Conc11.eachLayer(function(layer){
            if(layer.feature.properties.P1945_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1945_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1945_Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderPerEDI_1945_Conc11.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1945_Conc11);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1919 E 1945, 2011 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1946 E 1960 por Concelho em 2011-----////

var minPerEDI_1960_Conc11 = 0;
var maxPerEDI_1960_Conc11 = 0;

function EstiloPerEDI_1960_Conc11(feature) {
    if( feature.properties.P1960_11 <= minPerEDI_1960_Conc11 || minPerEDI_1960_Conc11 === 0){
        minPerEDI_1960_Conc11 = feature.properties.P1960_11
    }
    if(feature.properties.P1960_11 >= maxPerEDI_1960_Conc11 ){
        maxPerEDI_1960_Conc11 = feature.properties.P1960_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1960Conc(feature.properties.P1960_11)
    };
}
function apagarPerEDI_1960_Conc11(e) {
    PerEDI_1960_Conc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1960_Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P1960_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1960_Conc11,
    });
}
var PerEDI_1960_Conc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_1960_Conc11,
    onEachFeature: onEachFeaturePerEDI_1960_Conc11
});
let slidePerEDI_1960_Conc11 = function(){
    var sliderPerEDI_1960_Conc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1960_Conc11, {
        start: [minPerEDI_1960_Conc11, maxPerEDI_1960_Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1960_Conc11,
            'max': maxPerEDI_1960_Conc11
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1960_Conc11);
    inputNumberMax.setAttribute("value",maxPerEDI_1960_Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1960_Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1960_Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1960_Conc11.noUiSlider.on('update',function(e){
        PerEDI_1960_Conc11.eachLayer(function(layer){
            if(layer.feature.properties.P1960_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1960_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1960_Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderPerEDI_1960_Conc11.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1960_Conc11);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1946 E 1960, 2011 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1961 E 1980 por Concelho em 2011-----////

var minPerEDI_1980_Conc11 = 0;
var maxPerEDI_1980_Conc11 = 0;

function EstiloPerEDI_1980_Conc11(feature) {
    if( feature.properties.P1980_11 <= minPerEDI_1980_Conc11 || minPerEDI_1980_Conc11 === 0){
        minPerEDI_1980_Conc11 = feature.properties.P1980_11
    }
    if(feature.properties.P1980_11 >= maxPerEDI_1980_Conc11 ){
        maxPerEDI_1980_Conc11 = feature.properties.P1980_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1980Conc(feature.properties.P1980_11)
    };
}
function apagarPerEDI_1980_Conc11(e) {
    PerEDI_1980_Conc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1980_Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P1980_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1980_Conc11,
    });
}
var PerEDI_1980_Conc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_1980_Conc11,
    onEachFeature: onEachFeaturePerEDI_1980_Conc11
});
let slidePerEDI_1980_Conc11 = function(){
    var sliderPerEDI_1980_Conc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1980_Conc11, {
        start: [minPerEDI_1980_Conc11, maxPerEDI_1980_Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1980_Conc11,
            'max': maxPerEDI_1980_Conc11
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1980_Conc11);
    inputNumberMax.setAttribute("value",maxPerEDI_1980_Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1980_Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1980_Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1980_Conc11.noUiSlider.on('update',function(e){
        PerEDI_1980_Conc11.eachLayer(function(layer){
            if(layer.feature.properties.P1980_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1980_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1980_Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderPerEDI_1980_Conc11.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1980_Conc11);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1961 E 1980, 2011 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1981 E 2000 por Concelho em 2011-----////

var minPerEDI_2000_Conc11 = 0;
var maxPerEDI_2000_Conc11 = 0;

function EstiloPerEDI_2000_Conc11(feature) {
    if( feature.properties.P2000_11 <= minPerEDI_2000_Conc11 || minPerEDI_2000_Conc11 === 0){
        minPerEDI_2000_Conc11 = feature.properties.P2000_11
    }
    if(feature.properties.P2000_11 >= maxPerEDI_2000_Conc11 ){
        maxPerEDI_2000_Conc11 = feature.properties.P2000_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI2000Conc(feature.properties.P2000_11)
    };
}
function apagarPerEDI_2000_Conc11(e) {
    PerEDI_2000_Conc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_2000_Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P2000_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_2000_Conc11,
    });
}
var PerEDI_2000_Conc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_2000_Conc11,
    onEachFeature: onEachFeaturePerEDI_2000_Conc11
});
let slidePerEDI_2000_Conc11 = function(){
    var sliderPerEDI_2000_Conc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_2000_Conc11, {
        start: [minPerEDI_2000_Conc11, maxPerEDI_2000_Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_2000_Conc11,
            'max': maxPerEDI_2000_Conc11
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_2000_Conc11);
    inputNumberMax.setAttribute("value",maxPerEDI_2000_Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_2000_Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_2000_Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_2000_Conc11.noUiSlider.on('update',function(e){
        PerEDI_2000_Conc11.eachLayer(function(layer){
            if(layer.feature.properties.P2000_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P2000_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_2000_Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderPerEDI_2000_Conc11.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_2000_Conc11);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1981 E 2000, 2011 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 2001 E 2010 por Concelho em 2011-----////

var minPerEDI_2010_Conc11 = 0;
var maxPerEDI_2010_Conc11 = 0;

function CorPerEDI2010Conc(d) {
    return d >= 17.34 ? '#8c0303' :
        d >= 15.38  ? '#de1f35' :
        d >= 12.11 ? '#ff5e6e' :
        d >= 8.83   ? '#f5b3be' :
        d >= 5.56   ? '#F2C572' :
                ''  ;
}
var legendaPerEDI2010Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 17.34' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 15.38 - 17.34' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 12.11 - 15.38' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 8.83 - 12.11' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 5.56 - 8.83' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEDI_2010_Conc11(feature) {
    if( feature.properties.P2010_11 <= minPerEDI_2010_Conc11 || minPerEDI_2010_Conc11 === 0){
        minPerEDI_2010_Conc11 = feature.properties.P2010_11
    }
    if(feature.properties.P2010_11 >= maxPerEDI_2010_Conc11 ){
        maxPerEDI_2010_Conc11 = feature.properties.P2010_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI2010Conc(feature.properties.P2010_11)
    };
}
function apagarPerEDI_2010_Conc11(e) {
    PerEDI_2010_Conc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_2010_Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P2010_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_2010_Conc11,
    });
}
var PerEDI_2010_Conc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_2010_Conc11,
    onEachFeature: onEachFeaturePerEDI_2010_Conc11
});
let slidePerEDI_2010_Conc11 = function(){
    var sliderPerEDI_2010_Conc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_2010_Conc11, {
        start: [minPerEDI_2010_Conc11, maxPerEDI_2010_Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_2010_Conc11,
            'max': maxPerEDI_2010_Conc11
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_2010_Conc11);
    inputNumberMax.setAttribute("value",maxPerEDI_2010_Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_2010_Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_2010_Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_2010_Conc11.noUiSlider.on('update',function(e){
        PerEDI_2010_Conc11.eachLayer(function(layer){
            if(layer.feature.properties.P2010_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P2010_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_2010_Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderPerEDI_2010_Conc11.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_2010_Conc11);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 2001 E 2010, 2011 Concelho -------------- \\\\\\

/////////////////------------------------------------------------------------------------------------------------

//////////////////------- Percentagem EDIFICIOS ANTES 1919 por Concelho em 2021-----////

var minPerEDI_1919_Conc21 = 0;
var maxPerEDI_1919_Conc21 = 0;

function EstiloPerEDI_1919_Conc21(feature) {
    if( feature.properties.P1919_21 <= minPerEDI_1919_Conc21 || minPerEDI_1919_Conc21 === 0){
        minPerEDI_1919_Conc21 = feature.properties.P1919_21
    }
    if(feature.properties.P1919_21 >= maxPerEDI_1919_Conc21 ){
        maxPerEDI_1919_Conc21 = feature.properties.P1919_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1919Conc(feature.properties.P1919_21)
    };
}
function apagarPerEDI_1919_Conc21(e) {
    PerEDI_1919_Conc21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1919_Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P1919_21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1919_Conc21,
    });
}
var PerEDI_1919_Conc21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_1919_Conc21,
    onEachFeature: onEachFeaturePerEDI_1919_Conc21
});
let slidePerEDI_1919_Conc21 = function(){
    var sliderPerEDI_1919_Conc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1919_Conc21, {
        start: [minPerEDI_1919_Conc21, maxPerEDI_1919_Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1919_Conc21,
            'max': maxPerEDI_1919_Conc21
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1919_Conc21);
    inputNumberMax.setAttribute("value",maxPerEDI_1919_Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1919_Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1919_Conc21.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1919_Conc21.noUiSlider.on('update',function(e){
        PerEDI_1919_Conc21.eachLayer(function(layer){
            if(layer.feature.properties.P1919_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1919_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1919_Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderPerEDI_1919_Conc21.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1919_Conc21);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ANTES 1919 2021 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1919 E 1945 por Concelho em 2021-----////

var minPerEDI_1945_Conc21 = 0;
var maxPerEDI_1945_Conc21 = 0;

function EstiloPerEDI_1945_Conc21(feature) {
    if( feature.properties.P1945_21 <= minPerEDI_1945_Conc21 || minPerEDI_1945_Conc21 === 0){
        minPerEDI_1945_Conc21 = feature.properties.P1945_21
    }
    if(feature.properties.P1945_21 >= maxPerEDI_1945_Conc21 ){
        maxPerEDI_1945_Conc21 = feature.properties.P1945_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1945Conc(feature.properties.P1945_21)
    };
}
function apagarPerEDI_1945_Conc21(e) {
    PerEDI_1945_Conc21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1945_Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P1945_21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1945_Conc21,
    });
}
var PerEDI_1945_Conc21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_1945_Conc21,
    onEachFeature: onEachFeaturePerEDI_1945_Conc21
});
let slidePerEDI_1945_Conc21 = function(){
    var sliderPerEDI_1945_Conc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1945_Conc21, {
        start: [minPerEDI_1945_Conc21, maxPerEDI_1945_Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1945_Conc21,
            'max': maxPerEDI_1945_Conc21
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1945_Conc21);
    inputNumberMax.setAttribute("value",maxPerEDI_1945_Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1945_Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1945_Conc21.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1945_Conc21.noUiSlider.on('update',function(e){
        PerEDI_1945_Conc21.eachLayer(function(layer){
            if(layer.feature.properties.P1945_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1945_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1945_Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderPerEDI_1945_Conc21.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1945_Conc21);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1919 E 1945, 2021 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1946 E 1960 por Concelho em 2021-----////

var minPerEDI_1960_Conc21 = 0;
var maxPerEDI_1960_Conc21 = 0;

function EstiloPerEDI_1960_Conc21(feature) {
    if( feature.properties.P1960_21 <= minPerEDI_1960_Conc21 || minPerEDI_1960_Conc21 === 0){
        minPerEDI_1960_Conc21 = feature.properties.P1960_21
    }
    if(feature.properties.P1960_21 >= maxPerEDI_1960_Conc21 ){
        maxPerEDI_1960_Conc21 = feature.properties.P1960_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1960Conc(feature.properties.P1960_21)
    };
}
function apagarPerEDI_1960_Conc21(e) {
    PerEDI_1960_Conc21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1960_Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P1960_21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1960_Conc21,
    });
}
var PerEDI_1960_Conc21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_1960_Conc21,
    onEachFeature: onEachFeaturePerEDI_1960_Conc21
});
let slidePerEDI_1960_Conc21 = function(){
    var sliderPerEDI_1960_Conc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1960_Conc21, {
        start: [minPerEDI_1960_Conc21, maxPerEDI_1960_Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1960_Conc21,
            'max': maxPerEDI_1960_Conc21
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1960_Conc21);
    inputNumberMax.setAttribute("value",maxPerEDI_1960_Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1960_Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1960_Conc21.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1960_Conc21.noUiSlider.on('update',function(e){
        PerEDI_1960_Conc21.eachLayer(function(layer){
            if(layer.feature.properties.P1960_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1960_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1960_Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderPerEDI_1960_Conc21.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1960_Conc21);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1946 E 1960, 2021 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1961 E 1980 por Concelho em 2021-----////

var minPerEDI_1980_Conc21 = 0;
var maxPerEDI_1980_Conc21 = 0;

function EstiloPerEDI_1980_Conc21(feature) {
    if( feature.properties.P1980_21 <= minPerEDI_1980_Conc21 || minPerEDI_1980_Conc21 === 0){
        minPerEDI_1980_Conc21 = feature.properties.P1980_21
    }
    if(feature.properties.P1980_21 >= maxPerEDI_1980_Conc21 ){
        maxPerEDI_1980_Conc21 = feature.properties.P1980_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1980Conc(feature.properties.P1980_21)
    };
}
function apagarPerEDI_1980_Conc21(e) {
    PerEDI_1980_Conc21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1980_Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P1980_21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1980_Conc21,
    });
}
var PerEDI_1980_Conc21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_1980_Conc21,
    onEachFeature: onEachFeaturePerEDI_1980_Conc21
});
let slidePerEDI_1980_Conc21 = function(){
    var sliderPerEDI_1980_Conc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1980_Conc21, {
        start: [minPerEDI_1980_Conc21, maxPerEDI_1980_Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1980_Conc21,
            'max': maxPerEDI_1980_Conc21
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1980_Conc21);
    inputNumberMax.setAttribute("value",maxPerEDI_1980_Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1980_Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1980_Conc21.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1980_Conc21.noUiSlider.on('update',function(e){
        PerEDI_1980_Conc21.eachLayer(function(layer){
            if(layer.feature.properties.P1980_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1980_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1980_Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderPerEDI_1980_Conc21.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1980_Conc21);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1961 E 1980, 2021 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1981 E 2000 por Concelho em 2021-----////

var minPerEDI_2000_Conc21 = 0;
var maxPerEDI_2000_Conc21 = 0;

function EstiloPerEDI_2000_Conc21(feature) {
    if( feature.properties.P2000_21 <= minPerEDI_2000_Conc21 || minPerEDI_2000_Conc21 === 0){
        minPerEDI_2000_Conc21 = feature.properties.P2000_21
    }
    if(feature.properties.P2000_21 >= maxPerEDI_2000_Conc21 ){
        maxPerEDI_2000_Conc21 = feature.properties.P2000_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI2000Conc(feature.properties.P2000_21)
    };
}
function apagarPerEDI_2000_Conc21(e) {
    PerEDI_2000_Conc21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_2000_Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P2000_21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_2000_Conc21,
    });
}
var PerEDI_2000_Conc21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_2000_Conc21,
    onEachFeature: onEachFeaturePerEDI_2000_Conc21
});
let slidePerEDI_2000_Conc21 = function(){
    var sliderPerEDI_2000_Conc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_2000_Conc21, {
        start: [minPerEDI_2000_Conc21, maxPerEDI_2000_Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_2000_Conc21,
            'max': maxPerEDI_2000_Conc21
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_2000_Conc21);
    inputNumberMax.setAttribute("value",maxPerEDI_2000_Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_2000_Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_2000_Conc21.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_2000_Conc21.noUiSlider.on('update',function(e){
        PerEDI_2000_Conc21.eachLayer(function(layer){
            if(layer.feature.properties.P2000_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P2000_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_2000_Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderPerEDI_2000_Conc21.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_2000_Conc21);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1981 E 2000, 2021 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 2001 E 2010 por Concelho em 2021-----////

var minPerEDI_2010_Conc21 = 0;
var maxPerEDI_2010_Conc21 = 0;

function EstiloPerEDI_2010_Conc21(feature) {
    if( feature.properties.P2010_21 <= minPerEDI_2010_Conc21 || minPerEDI_2010_Conc21 === 0){
        minPerEDI_2010_Conc21 = feature.properties.P2010_21
    }
    if(feature.properties.P2010_21 >= maxPerEDI_2010_Conc21 ){
        maxPerEDI_2010_Conc21 = feature.properties.P2010_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI2010Conc(feature.properties.P2010_21)
    };
}
function apagarPerEDI_2010_Conc21(e) {
    PerEDI_2010_Conc21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_2010_Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P2010_21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_2010_Conc21,
    });
}
var PerEDI_2010_Conc21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_2010_Conc21,
    onEachFeature: onEachFeaturePerEDI_2010_Conc21
});
let slidePerEDI_2010_Conc21 = function(){
    var sliderPerEDI_2010_Conc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_2010_Conc21, {
        start: [minPerEDI_2010_Conc21, maxPerEDI_2010_Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_2010_Conc21,
            'max': maxPerEDI_2010_Conc21
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_2010_Conc21);
    inputNumberMax.setAttribute("value",maxPerEDI_2010_Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_2010_Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_2010_Conc21.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_2010_Conc21.noUiSlider.on('update',function(e){
        PerEDI_2010_Conc21.eachLayer(function(layer){
            if(layer.feature.properties.P2010_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P2010_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_2010_Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderPerEDI_2010_Conc21.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_2010_Conc21);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 2001 E 2010, 2021 Concelho -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 2011 E 2020 por Concelho em 2021-----////

var minPerEDI_2020_Conc21 = 0;
var maxPerEDI_2020_Conc21 = 0;

function CorPerEDI2020Conc(d) {
    return d >= 4.83 ? '#8c0303' :
        d >= 4.35  ? '#de1f35' :
        d >= 3.5 ? '#ff5e6e' :
        d >= 2.74   ? '#f5b3be' :
        d >= 1.93   ? '#F2C572' :
                ''  ;
}
var legendaPerEDI2020Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 4.83' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 4.35 - 4.83' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 3.5 - 4.35' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 2.74 - 3.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 1.93 - 2.74' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEDI_2020_Conc21(feature) {
    if( feature.properties.P2020_21 <= minPerEDI_2020_Conc21 || minPerEDI_2020_Conc21 === 0){
        minPerEDI_2020_Conc21 = feature.properties.P2020_21
    }
    if(feature.properties.P2020_21 >= maxPerEDI_2020_Conc21 ){
        maxPerEDI_2020_Conc21 = feature.properties.P2020_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI2020Conc(feature.properties.P2020_21)
    };
}
function apagarPerEDI_2020_Conc21(e) {
    PerEDI_2020_Conc21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_2020_Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P2020_21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_2020_Conc21,
    });
}
var PerEDI_2020_Conc21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerEDI_2020_Conc21,
    onEachFeature: onEachFeaturePerEDI_2020_Conc21
});
let slidePerEDI_2020_Conc21 = function(){
    var sliderPerEDI_2020_Conc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_2020_Conc21, {
        start: [minPerEDI_2020_Conc21, maxPerEDI_2020_Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_2020_Conc21,
            'max': maxPerEDI_2020_Conc21
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_2020_Conc21);
    inputNumberMax.setAttribute("value",maxPerEDI_2020_Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_2020_Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_2020_Conc21.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_2020_Conc21.noUiSlider.on('update',function(e){
        PerEDI_2020_Conc21.eachLayer(function(layer){
            if(layer.feature.properties.P2020_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P2020_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_2020_Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderPerEDI_2020_Conc21.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_2020_Conc21);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 2011 E 2021, 2021 Concelho -------------- \\\\\\
///////////---------------------------- FIM DADOS RELATIVOS CONCELHOS -------------- \\\\\\\\
//////////////////---------------------------- VARIAÇÕES CONCELHOS ----------------\\\\\\\\\\\\\\
/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ANTES DE 1919 ENTRE 2011 E 2001 CONCELHOS -------------------////

var minVarEDI1919_11 = 0;
var maxVarEDI1919_11 = -99;

function CorVarEDI1919_11_01Conc(d) {
    return d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -15  ? '#9eaad7' :
        d >= -23.57   ? '#2288bf' :
                ''  ;
}

var legendaVarEDI1919_11_01Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos antes de 1919, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -15 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -23.56 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEDI1919_11(feature) {
    if(feature.properties.Var1919_11 <= minVarEDI1919_11){
        minVarEDI1919_11 = feature.properties.Var1919_11
    }
    if(feature.properties.Var1919_11 > maxVarEDI1919_11){
        maxVarEDI1919_11 = feature.properties.Var1919_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI1919_11_01Conc(feature.properties.Var1919_11)};
    }


function apagarVarEDI1919_11(e) {
    VarEDI1919_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI1919_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1919_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI1919_11,
    });
}
var VarEDI1919_11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarEDI1919_11,
    onEachFeature: onEachFeatureVarEDI1919_11
});

let slideVarEDI1919_11 = function(){
    var sliderVarEDI1919_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI1919_11, {
        start: [minVarEDI1919_11, maxVarEDI1919_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI1919_11,
            'max': maxVarEDI1919_11
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI1919_11);
    inputNumberMax.setAttribute("value",maxVarEDI1919_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI1919_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI1919_11.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI1919_11.noUiSlider.on('update',function(e){
        VarEDI1919_11.eachLayer(function(layer){
            if(layer.feature.properties.Var1919_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1919_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI1919_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderVarEDI1919_11.noUiSlider;
    $(slidersGeral).append(sliderVarEDI1919_11);
} 

///////////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ANTES DE 1919 ENTRE 2011 E 2001 CONCELHOS ----- \\\\\\

/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ENTRE 1919 E 1945 , ENTRE 2011 E 2001 CONCELHOS -------------------////

var minVarEDI1945_11 = 0;
var maxVarEDI1945_11 = -99;

function CorVarEDI1945_11_01Conc(d) {
    return d >= 0  ? '#f5b3be' :
        d >= -15  ? '#9ebbd7' :
        d >= -25  ? '#2288bf' :
        d >= -34.37   ? '#155273' :
                ''  ;
}

var legendaVarEDI1945_11_01Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos entre 1919 e 1945, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -15 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -25 a -15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -34.36 a -25' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarEDI1945_11(feature) {
    if(feature.properties.Var1945_11 <= minVarEDI1945_11){
        minVarEDI1945_11 = feature.properties.Var1945_11
    }
    if(feature.properties.Var1945_11 > maxVarEDI1945_11){
        maxVarEDI1945_11 = feature.properties.Var1945_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI1945_11_01Conc(feature.properties.Var1945_11)};
    }


function apagarVarEDI1945_11(e) {
    VarEDI1945_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI1945_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1945_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI1945_11,
    });
}
var VarEDI1945_11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarEDI1945_11,
    onEachFeature: onEachFeatureVarEDI1945_11
});

let slideVarEDI1945_11 = function(){
    var sliderVarEDI1945_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI1945_11, {
        start: [minVarEDI1945_11, maxVarEDI1945_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI1945_11,
            'max': maxVarEDI1945_11
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI1945_11);
    inputNumberMax.setAttribute("value",maxVarEDI1945_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI1945_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI1945_11.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI1945_11.noUiSlider.on('update',function(e){
        VarEDI1945_11.eachLayer(function(layer){
            if(layer.feature.properties.Var1945_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1945_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI1945_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderVarEDI1945_11.noUiSlider;
    $(slidersGeral).append(sliderVarEDI1945_11);
} 

///////////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ENTRE 1919 E 1945 , ENTRE 2011 E 2001 CONCELHOS ----- \\\\\\

/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ENTRE 1946 E 1960 , ENTRE 2011 E 2001 CONCELHOS -------------------////

var minVarEDI1960_11 = 0;
var maxVarEDI1960_11 = -99;

function CorVarEDI1960_11_01Conc(d) {
    return d >= 15  ? '#de1f35' :
        d >= 0  ? '#ff5e6e' :
        d >= -5  ? '#f5b3be' :
        d >= -15  ? '#9eaad7' :
        d >= -24.08   ? '#2288bf' :
                ''  ;
}

var legendaVarEDI1960_11_01Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos entre 1946 e 1960, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -15 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -24.07 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEDI1960_11(feature) {
    if(feature.properties.Var_1960_11 <= minVarEDI1960_11){
        minVarEDI1960_11 = feature.properties.Var_1960_11
    }
    if(feature.properties.Var_1960_11 > maxVarEDI1960_11){
        maxVarEDI1960_11 = feature.properties.Var_1960_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI1960_11_01Conc(feature.properties.Var_1960_11)};
    }


function apagarVarEDI1960_11(e) {
    VarEDI1960_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI1960_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_1960_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI1960_11,
    });
}
var VarEDI1960_11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarEDI1960_11,
    onEachFeature: onEachFeatureVarEDI1960_11
});

let slideVarEDI1960_11 = function(){
    var sliderVarEDI1960_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 39){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI1960_11, {
        start: [minVarEDI1960_11, maxVarEDI1960_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI1960_11,
            'max': maxVarEDI1960_11
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI1960_11);
    inputNumberMax.setAttribute("value",maxVarEDI1960_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI1960_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI1960_11.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI1960_11.noUiSlider.on('update',function(e){
        VarEDI1960_11.eachLayer(function(layer){
            if(layer.feature.properties.Var_1960_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var_1960_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI1960_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 39;
    sliderAtivo = sliderVarEDI1960_11.noUiSlider;
    $(slidersGeral).append(sliderVarEDI1960_11);
} 

///////////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ENTRE 1946 E 1960 , ENTRE 2011 E 2001 CONCELHOS ----- \\\\\\

/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ENTRE 1961 E 1980 , ENTRE 2011 E 2001 CONCELHOS -------------------////

var minVarEDI1980_11 = 0;
var maxVarEDI1980_11 = -99;

function CorVarEDI1980_11_01Conc(d) {
    return d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -9.23   ? '#2288bf' :
                ''  ;
}

var legendaVarEDI1980_11_01Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos entre 1961 e 1980, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -9.22 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEDI1980_11(feature) {
    if(feature.properties.Var_1980_11 <= minVarEDI1980_11){
        minVarEDI1980_11 = feature.properties.Var_1980_11
    }
    if(feature.properties.Var_1980_11 > maxVarEDI1980_11){
        maxVarEDI1980_11 = feature.properties.Var_1980_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI1980_11_01Conc(feature.properties.Var_1980_11)};
    }


function apagarVarEDI1980_11(e) {
    VarEDI1980_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI1980_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_1980_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI1980_11,
    });
}
var VarEDI1980_11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarEDI1980_11,
    onEachFeature: onEachFeatureVarEDI1980_11
});

let slideVarEDI1980_11 = function(){
    var sliderVarEDI1980_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI1980_11, {
        start: [minVarEDI1980_11, maxVarEDI1980_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI1980_11,
            'max': maxVarEDI1980_11
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI1980_11);
    inputNumberMax.setAttribute("value",maxVarEDI1980_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI1980_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI1980_11.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI1980_11.noUiSlider.on('update',function(e){
        VarEDI1980_11.eachLayer(function(layer){
            if(layer.feature.properties.Var_1980_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var_1980_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI1980_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderVarEDI1980_11.noUiSlider;
    $(slidersGeral).append(sliderVarEDI1980_11);
} 

///////////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ENTRE 1961 E 1980 , ENTRE 2011 E 2001 CONCELHOS ----- \\\\\\

/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ENTRE 1981 E 2000 , ENTRE 2011 E 2001 CONCELHOS -------------------////

var minVarEDI2000_11 = 0;
var maxVarEDI2000_11 = -99;

function CorVarEDI2000_11_01Conc(d) {
    return d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -10  ? '#2288bf' :
        d >= -16.14   ? '#155273' :
                ''  ;
}

var legendaVarEDI2000_11_01Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos entre 1981 e 2000, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -16.13 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEDI2000_11(feature) {
    if(feature.properties.Var_2000_11 <= minVarEDI2000_11){
        minVarEDI2000_11 = feature.properties.Var_2000_11
    }
    if(feature.properties.Var_2000_11 > maxVarEDI2000_11){
        maxVarEDI2000_11 = feature.properties.Var_2000_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI2000_11_01Conc(feature.properties.Var_2000_11)};
    }


function apagarVarEDI2000_11(e) {
    VarEDI2000_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI2000_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_2000_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI2000_11,
    });
}
var VarEDI2000_11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarEDI2000_11,
    onEachFeature: onEachFeatureVarEDI2000_11
});

let slideVarEDI2000_11 = function(){
    var sliderVarEDI2000_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI2000_11, {
        start: [minVarEDI2000_11, maxVarEDI2000_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI2000_11,
            'max': maxVarEDI2000_11
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI2000_11);
    inputNumberMax.setAttribute("value",maxVarEDI2000_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI2000_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI2000_11.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI2000_11.noUiSlider.on('update',function(e){
        VarEDI2000_11.eachLayer(function(layer){
            if(layer.feature.properties.Var_2000_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var_2000_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI2000_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderVarEDI2000_11.noUiSlider;
    $(slidersGeral).append(sliderVarEDI2000_11);
} 

///////////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ENTRE 1981 E 2000 , ENTRE 2011 E 2001 CONCELHOS ----- \\\\\\

/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ANTES DE 1919 ENTRE 2021 E 2011 CONCELHOS -------------------////

var minVarEDI1919_21 = 0;
var maxVarEDI1919_21 = -99;

function CorVarEDI1919_21_11Conc(d) {
    return d >= -10  ? '#8FC1B5' :
        d >= -15  ? '#9ebbd7' :
        d >= -20  ? '#2288bf' :
        d >= -25  ? '#155273' :
        d >= -33.22   ? '#0b2c40' :
                ''  ;
}

var legendaVarEDI1919_21_11Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos antes de 1919, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8FC1B5"></i>' + '  > -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -15 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -20 a -15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -25 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -33.22 a -25' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEDI1919_21(feature) {
    if(feature.properties.Var1919_21 <= minVarEDI1919_21){
        minVarEDI1919_21 = feature.properties.Var1919_21
    }
    if(feature.properties.Var1919_21 > maxVarEDI1919_21){
        maxVarEDI1919_21 = feature.properties.Var1919_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI1919_21_11Conc(feature.properties.Var1919_21)};
    }


function apagarVarEDI1919_21(e) {
    VarEDI1919_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI1919_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1919_21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI1919_21,
    });
}
var VarEDI1919_21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarEDI1919_21,
    onEachFeature: onEachFeatureVarEDI1919_21
});

let slideVarEDI1919_21 = function(){
    var sliderVarEDI1919_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 42){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI1919_21, {
        start: [minVarEDI1919_21, maxVarEDI1919_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI1919_21,
            'max': maxVarEDI1919_21
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI1919_21);
    inputNumberMax.setAttribute("value",maxVarEDI1919_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI1919_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI1919_21.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI1919_21.noUiSlider.on('update',function(e){
        VarEDI1919_21.eachLayer(function(layer){
            if(layer.feature.properties.Var1919_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1919_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI1919_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 42;
    sliderAtivo = sliderVarEDI1919_21.noUiSlider;
    $(slidersGeral).append(sliderVarEDI1919_21);
} 

///////////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ANTES DE 1919 ENTRE 2021 E 2011 CONCELHOS ----- \\\\\\

/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ENTRE 1919 E 1945 , ENTRE 2021 E 2011 CONCELHOS -------------------////

var minVarEDI1945_21 = 0;
var maxVarEDI1945_21 = -99;


function CorVarEDI1945_21_11Conc(d) {
    return d >= -5  ? '#9ebbd7' :
        d >= -10  ? '#2288bf' :
        d >= -15  ? '#155273' :
        d >= -22.01   ? '#0b2c40' :
                ''  ;
}

var legendaVarEDI1945_21_11Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos entre 1919 e 1945, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -15 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -22 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEDI1945_21(feature) {
    if(feature.properties.Var1945_21 <= minVarEDI1945_21){
        minVarEDI1945_21 = feature.properties.Var1945_21
    }
    if(feature.properties.Var1945_21 > maxVarEDI1945_21){
        maxVarEDI1945_21 = feature.properties.Var1945_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI1945_21_11Conc(feature.properties.Var1945_21)};
    }


function apagarVarEDI1945_21(e) {
    VarEDI1945_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI1945_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1945_21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI1945_21,
    });
}
var VarEDI1945_21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarEDI1945_21,
    onEachFeature: onEachFeatureVarEDI1945_21
});

let slideVarEDI1945_21 = function(){
    var sliderVarEDI1945_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 43){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI1945_21, {
        start: [minVarEDI1945_21, maxVarEDI1945_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI1945_21,
            'max': maxVarEDI1945_21
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI1945_21);
    inputNumberMax.setAttribute("value",maxVarEDI1945_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI1945_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI1945_21.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI1945_21.noUiSlider.on('update',function(e){
        VarEDI1945_21.eachLayer(function(layer){
            if(layer.feature.properties.Var1945_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1945_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI1945_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 43;
    sliderAtivo = sliderVarEDI1945_21.noUiSlider;
    $(slidersGeral).append(sliderVarEDI1945_21);
} 

///////////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ENTRE 1919 E 1945 , ENTRE 2021 E 2011 CONCELHOS ----- \\\\\\

/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ENTRE 1946 E 1960 , ENTRE 2021 E 2011 CONCELHOS -------------------////

var minVarEDI1960_21 = 0;
var maxVarEDI1960_21 = -99;

function CorVarEDI1960_21_11Conc(d) {
    return d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -10  ? '#2288bf' :
        d >= -12.43   ? '#155273' :
                ''  ;
}

var legendaVarEDI1960_21_11Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos entre 1946 e 1960, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -15 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -12.42 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEDI1960_21(feature) {
    if(feature.properties.Var_1960_21 <= minVarEDI1960_21){
        minVarEDI1960_21 = feature.properties.Var_1960_21
    }
    if(feature.properties.Var_1960_21 > maxVarEDI1960_21){
        maxVarEDI1960_21 = feature.properties.Var_1960_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI1960_21_11Conc(feature.properties.Var_1960_21)};
    }


function apagarVarEDI1960_21(e) {
    VarEDI1960_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI1960_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_1960_21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI1960_21,
    });
}
var VarEDI1960_21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarEDI1960_21,
    onEachFeature: onEachFeatureVarEDI1960_21
});

let slideVarEDI1960_21 = function(){
    var sliderVarEDI1960_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 44){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI1960_21, {
        start: [minVarEDI1960_21, maxVarEDI1960_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI1960_21,
            'max': maxVarEDI1960_21
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI1960_21);
    inputNumberMax.setAttribute("value",maxVarEDI1960_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI1960_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI1960_21.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI1960_21.noUiSlider.on('update',function(e){
        VarEDI1960_21.eachLayer(function(layer){
            if(layer.feature.properties.Var_1960_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var_1960_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI1960_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 44;
    sliderAtivo = sliderVarEDI1960_21.noUiSlider;
    $(slidersGeral).append(sliderVarEDI1960_21);
} 

///////////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ENTRE 1946 E 1960 , ENTRE 2021 E 2011 CONCELHOS ----- \\\\\\

/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ENTRE 1961 E 1980 , ENTRE 2021 E 2011 CONCELHOS -------------------////

var minVarEDI1980_21 = 0;
var maxVarEDI1980_21 = -99;

function CorVarEDI1980_21_11Conc(d) {
    return d >= -2.5  ? '#9eaad7' :
        d >= -5  ? '#2288bf' :
        d >= -7.21   ? '#155273' :
                ''  ;
}

var legendaVarEDI1980_21_11Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos entre 1961 e 1980, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' > -2.5 ' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -5 a -2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -7.21 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEDI1980_21(feature) {
    if(feature.properties.Var_1980_21 <= minVarEDI1980_21){
        minVarEDI1980_21 = feature.properties.Var_1980_21
    }
    if(feature.properties.Var_1980_21 > maxVarEDI1980_21){
        maxVarEDI1980_21 = feature.properties.Var_1980_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI1980_21_11Conc(feature.properties.Var_1980_21)};
    }


function apagarVarEDI1980_21(e) {
    VarEDI1980_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI1980_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_1980_21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI1980_21,
    });
}
var VarEDI1980_21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarEDI1980_21,
    onEachFeature: onEachFeatureVarEDI1980_21
});

let slideVarEDI1980_21 = function(){
    var sliderVarEDI1980_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI1980_21, {
        start: [minVarEDI1980_21, maxVarEDI1980_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI1980_21,
            'max': maxVarEDI1980_21
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI1980_21);
    inputNumberMax.setAttribute("value",maxVarEDI1980_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI1980_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI1980_21.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI1980_21.noUiSlider.on('update',function(e){
        VarEDI1980_21.eachLayer(function(layer){
            if(layer.feature.properties.Var_1980_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var_1980_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI1980_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderVarEDI1980_21.noUiSlider;
    $(slidersGeral).append(sliderVarEDI1980_21);
} 

///////////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ENTRE 1961 E 1980 , ENTRE 2021 E 2011 CONCELHOS ----- \\\\\\

/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ENTRE 1981 E 2000 , ENTRE 2021 E 2011 CONCELHOS -------------------////

var minVarEDI2000_21 = 0;
var maxVarEDI2000_21 = -99;

function CorVarEDI2000_21_11Conc(d) {
    return d >= 2.5  ? '#de1f35' :
        d >= 1  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -1.9   ? '#9eaad7' :
                ''  ;
}

var legendaVarEDI2000_21_11Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos entre 1981 e 2000, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 2.5 ' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  1 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 1' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -1.89 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEDI2000_21(feature) {
    if(feature.properties.Var_2000_21 <= minVarEDI2000_21){
        minVarEDI2000_21 = feature.properties.Var_2000_21
    }
    if(feature.properties.Var_2000_21 > maxVarEDI2000_21){
        maxVarEDI2000_21 = feature.properties.Var_2000_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI2000_21_11Conc(feature.properties.Var_2000_21)
    };
}


function apagarVarEDI2000_21(e) {
    VarEDI2000_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI2000_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_2000_21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI2000_21,
    });
}
var VarEDI2000_21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarEDI2000_21,
    onEachFeature: onEachFeatureVarEDI2000_21
});

let slideVarEDI2000_21 = function(){
    var sliderVarEDI2000_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 46){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI2000_21, {
        start: [minVarEDI2000_21, maxVarEDI2000_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI2000_21,
            'max': maxVarEDI2000_21
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI2000_21);
    inputNumberMax.setAttribute("value",maxVarEDI2000_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI2000_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI2000_21.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI2000_21.noUiSlider.on('update',function(e){
        VarEDI2000_21.eachLayer(function(layer){
            if(layer.feature.properties.Var_2000_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var_2000_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI2000_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 46;
    sliderAtivo = sliderVarEDI2000_21.noUiSlider;
    $(slidersGeral).append(sliderVarEDI2000_21);
} 

///////////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ENTRE 1981 E 2000 , ENTRE 2021 E 2011 CONCELHOS ----- \\\\\\

/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ENTRE 2001 E 2010 , ENTRE 2021 E 2011 CONCELHOS -------------------////

var minVarEDI2010_21 = 0;
var maxVarEDI2010_21 = -99;

function CorVarEDI2010_21_11Conc(d) {
    return d >= 7.5  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 2.5  ? '#f5b3be' :
        d >= 0  ? '#f5b3be' :
        d >= -0.82   ? '#9eaad7' :
                ''  ;
}

var legendaVarEDI2010_21_11Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos entre 2001 e 2010, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 7.5 ' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 7.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  2.5 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -0.81 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarEDI2010_21(feature) {
    if(feature.properties.Var_2010_21 <= minVarEDI2010_21){
        minVarEDI2010_21 = feature.properties.Var_2010_21
    }
    if(feature.properties.Var_2010_21 > maxVarEDI2010_21){
        maxVarEDI2010_21 = feature.properties.Var_2010_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI2010_21_11Conc(feature.properties.Var_2010_21)};
    }


function apagarVarEDI2010_21(e) {
    VarEDI2010_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI2010_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_2010_21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI2010_21,
    });
}
var VarEDI2010_21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarEDI2010_21,
    onEachFeature: onEachFeatureVarEDI2010_21
});

let slideVarEDI2010_21 = function(){
    var sliderVarEDI2010_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 47){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI2010_21, {
        start: [minVarEDI2010_21, maxVarEDI2010_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI2010_21,
            'max': maxVarEDI2010_21
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI2010_21);
    inputNumberMax.setAttribute("value",maxVarEDI2010_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI2010_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI2010_21.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI2010_21.noUiSlider.on('update',function(e){
        VarEDI2010_21.eachLayer(function(layer){
            if(layer.feature.properties.Var_2010_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var_2010_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI2010_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 47;
    sliderAtivo = sliderVarEDI2010_21.noUiSlider;
    $(slidersGeral).append(sliderVarEDI2010_21);
} 

///////////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ENTRE 2001 E 2010 , ENTRE 2021 E 2011 CONCELHOS ----- \\\\\\
//////////////////////------------------------------ FIM CONCELHOS-------------------------------------------\\\\\\\\\\\\\\\\
//////////////////////------------- -------------FREGUESIAS DADOS ABSOLUTOS ----------------------------\\\\\\\\\\\\\\\

///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ANTES 1919 , FREGUESIA 2001-----------------------\\\\\\\\\\\\\

var minEdifi1919Freg_01 = 0;
var maxEdifi1919Freg_01 = 0;
function estiloEdifi1919Freg_01(feature, latlng) {
    if(feature.properties.ED_1919_01< minEdifi1919Freg_01){
        minEdifi1919Freg_01 = feature.properties.ED_1919_01
    }
    if(feature.properties.ED_1919_01> maxEdifi1919Freg_01){
        maxEdifi1919Freg_01 = feature.properties.ED_1919_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1919_01,0.35)
    });
}
function apagarEdifi1919Freg_01(e){
    var layer = e.target;
    Edifi1919Freg_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1919Freg_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios antes de 1919: ' + '<b>' + feature.properties.ED_1919_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1919Freg_01,
    })
};

var Edifi1919Freg_01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloEdifi1919Freg_01,
    onEachFeature: onEachFeatureEdifi1919Freg_01,
});

var slideEdifi1919Freg_01 = function(){
    var sliderEdifi1919Freg_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 48){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1919Freg_01, {
        start: [minEdifi1919Freg_01, maxEdifi1919Freg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1919Freg_01,
            'max': maxEdifi1919Freg_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1919Freg_01);
    inputNumberMax.setAttribute("value",maxEdifi1919Freg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1919Freg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1919Freg_01.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1919Freg_01.noUiSlider.on('update',function(e){
        Edifi1919Freg_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_1919_01>=parseFloat(e[0])&& layer.feature.properties.ED_1919_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1919Freg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 48;
    sliderAtivo = sliderEdifi1919Freg_01.noUiSlider;
    $(slidersGeral).append(sliderEdifi1919Freg_01);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ANTES 1919 , FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\


///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ENTRE 1919 E 1945 , FREGUESIA 2001-----------------------\\\\\\\\\\\\\

var minEdifi1945Freg_01 = 0;
var maxEdifi1945Freg_01 = 0;
function estiloEdifi1945Freg_01(feature, latlng) {
    if(feature.properties.ED_1945_01< minEdifi1945Freg_01){
        minEdifi1945Freg_01 = feature.properties.ED_1945_01
    }
    if(feature.properties.ED_1945_01> maxEdifi1945Freg_01){
        maxEdifi1945Freg_01 = feature.properties.ED_1945_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1945_01,0.35)
    });
}
function apagarEdifi1945Freg_01(e){
    var layer = e.target;
    Edifi1945Freg_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1945Freg_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios entre 1919 e 1945: ' + '<b>' + feature.properties.ED_1945_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1945Freg_01,
    })
};

var Edifi1945Freg_01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloEdifi1945Freg_01,
    onEachFeature: onEachFeatureEdifi1945Freg_01,
});

var slideEdifi1945Freg_01 = function(){
    var sliderEdifi1945Freg_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 49){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1945Freg_01, {
        start: [minEdifi1945Freg_01, maxEdifi1945Freg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1945Freg_01,
            'max': maxEdifi1945Freg_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1945Freg_01);
    inputNumberMax.setAttribute("value",maxEdifi1945Freg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1945Freg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1945Freg_01.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1945Freg_01.noUiSlider.on('update',function(e){
        Edifi1945Freg_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_1945_01>=parseFloat(e[0])&& layer.feature.properties.ED_1945_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1945Freg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 49;
    sliderAtivo = sliderEdifi1945Freg_01.noUiSlider;
    $(slidersGeral).append(sliderEdifi1945Freg_01);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1919 E 1945 , FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ENTRE 1946 E 1960 , FREGUESIA 2001-----------------------\\\\\\\\\\\\\

var minEdifi1960Freg_01 = 0;
var maxEdifi1960Freg_01 = 0;
function estiloEdifi1960Freg_01(feature, latlng) {
    if(feature.properties.ED_1960_01< minEdifi1960Freg_01){
        minEdifi1960Freg_01 = feature.properties.ED_1960_01
    }
    if(feature.properties.ED_1960_01> maxEdifi1960Freg_01){
        maxEdifi1960Freg_01 = feature.properties.ED_1960_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1960_01,0.35)
    });
}
function apagarEdifi1960Freg_01(e){
    var layer = e.target;
    Edifi1960Freg_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1960Freg_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios entre 1946 e 1960: ' + '<b>' + feature.properties.ED_1960_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1960Freg_01,
    })
};

var Edifi1960Freg_01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloEdifi1960Freg_01,
    onEachFeature: onEachFeatureEdifi1960Freg_01,
});

var slideEdifi1960Freg_01 = function(){
    var sliderEdifi1960Freg_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 50){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1960Freg_01, {
        start: [minEdifi1960Freg_01, maxEdifi1960Freg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1960Freg_01,
            'max': maxEdifi1960Freg_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1960Freg_01);
    inputNumberMax.setAttribute("value",maxEdifi1960Freg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1960Freg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1960Freg_01.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1960Freg_01.noUiSlider.on('update',function(e){
        Edifi1960Freg_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_1960_01>=parseFloat(e[0])&& layer.feature.properties.ED_1960_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1960Freg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 50;
    sliderAtivo = sliderEdifi1960Freg_01.noUiSlider;
    $(slidersGeral).append(sliderEdifi1960Freg_01);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1946 E 1960 , FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ENTRE 1961 E 1980 , FREGUESIA 2001-----------------------\\\\\\\\\\\\\

var minEdifi1980Freg_01 = 0;
var maxEdifi1980Freg_01 = 0;
function estiloEdifi1980Freg_01(feature, latlng) {
    if(feature.properties.ED_1980_01< minEdifi1980Freg_01){
        minEdifi1980Freg_01 = feature.properties.ED_1980_01
    }
    if(feature.properties.ED_1980_01> maxEdifi1980Freg_01){
        maxEdifi1980Freg_01 = feature.properties.ED_1980_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1980_01,0.35)
    });
}
function apagarEdifi1980Freg_01(e){
    var layer = e.target;
    Edifi1980Freg_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1980Freg_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios entre 1961 e 1980: ' + '<b>' + feature.properties.ED_1980_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1980Freg_01,
    })
};

var Edifi1980Freg_01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloEdifi1980Freg_01,
    onEachFeature: onEachFeatureEdifi1980Freg_01,
});

var slideEdifi1980Freg_01 = function(){
    var sliderEdifi1980Freg_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 51){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1980Freg_01, {
        start: [minEdifi1980Freg_01, maxEdifi1980Freg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1980Freg_01,
            'max': maxEdifi1980Freg_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1980Freg_01);
    inputNumberMax.setAttribute("value",maxEdifi1980Freg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1980Freg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1980Freg_01.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1980Freg_01.noUiSlider.on('update',function(e){
        Edifi1980Freg_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_1980_01>=parseFloat(e[0])&& layer.feature.properties.ED_1980_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1980Freg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 51;
    sliderAtivo = sliderEdifi1980Freg_01.noUiSlider;
    $(slidersGeral).append(sliderEdifi1980Freg_01);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1961 E 1980 , FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ENTRE 1981 E 2000 , FREGUESIA 2001-----------------------\\\\\\\\\\\\\

var minEdifi2000Freg_01 = 0;
var maxEdifi2000Freg_01 = 0;
function estiloEdifi2000Freg_01(feature, latlng) {
    if(feature.properties.ED_2000_01< minEdifi2000Freg_01){
        minEdifi2000Freg_01 = feature.properties.ED_2000_01
    }
    if(feature.properties.ED_2000_01> maxEdifi2000Freg_01){
        maxEdifi2000Freg_01 = feature.properties.ED_2000_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_2000_01,0.35)
    });
}
function apagarEdifi2000Freg_01(e){
    var layer = e.target;
    Edifi2000Freg_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi2000Freg_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios entre 1981 e 2000: ' + '<b>' + feature.properties.ED_2000_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi2000Freg_01,
    })
};

var Edifi2000Freg_01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloEdifi2000Freg_01,
    onEachFeature: onEachFeatureEdifi2000Freg_01,
});

var slideEdifi2000Freg_01 = function(){
    var sliderEdifi2000Freg_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 52){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi2000Freg_01, {
        start: [minEdifi2000Freg_01, maxEdifi2000Freg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi2000Freg_01,
            'max': maxEdifi2000Freg_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi2000Freg_01);
    inputNumberMax.setAttribute("value",maxEdifi2000Freg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi2000Freg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi2000Freg_01.noUiSlider.set([null, this.value]);
    });

    sliderEdifi2000Freg_01.noUiSlider.on('update',function(e){
        Edifi2000Freg_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_2000_01>=parseFloat(e[0])&& layer.feature.properties.ED_2000_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi2000Freg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 52;
    sliderAtivo = sliderEdifi2000Freg_01.noUiSlider;
    $(slidersGeral).append(sliderEdifi2000Freg_01);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1981 E 2000 , FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ANTES 1919 , FREGUESIA 2011-----------------------\\\\\\\\\\\\\

var minEdifi1919Freg_11 = 0;
var maxEdifi1919Freg_11 = 0;
function estiloEdifi1919Freg_11(feature, latlng) {
    if(feature.properties.ED_1919_11< minEdifi1919Freg_11){
        minEdifi1919Freg_11 = feature.properties.ED_1919_11
    }
    if(feature.properties.ED_1919_11> maxEdifi1919Freg_11){
        maxEdifi1919Freg_11 = feature.properties.ED_1919_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1919_11,0.35)
    });
}
function apagarEdifi1919Freg_11(e){
    var layer = e.target;
    Edifi1919Freg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1919Freg_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios antes de 1919: ' + '<b>' + feature.properties.ED_1919_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1919Freg_11,
    })
};

var Edifi1919Freg_11= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloEdifi1919Freg_11,
    onEachFeature: onEachFeatureEdifi1919Freg_11,
});

var slideEdifi1919Freg_11 = function(){
    var sliderEdifi1919Freg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 53){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1919Freg_11, {
        start: [minEdifi1919Freg_11, maxEdifi1919Freg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1919Freg_11,
            'max': maxEdifi1919Freg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1919Freg_11);
    inputNumberMax.setAttribute("value",maxEdifi1919Freg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1919Freg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1919Freg_11.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1919Freg_11.noUiSlider.on('update',function(e){
        Edifi1919Freg_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_1919_11>=parseFloat(e[0])&& layer.feature.properties.ED_1919_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1919Freg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 53;
    sliderAtivo = sliderEdifi1919Freg_11.noUiSlider;
    $(slidersGeral).append(sliderEdifi1919Freg_11);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ANTES 1919 , FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\


///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ENTRE 1919 E 1945 , FREGUESIA 2011-----------------------\\\\\\\\\\\\\

var minEdifi1945Freg_11 = 0;
var maxEdifi1945Freg_11 = 0;
function estiloEdifi1945Freg_11(feature, latlng) {
    if(feature.properties.ED_1945_11< minEdifi1945Freg_11){
        minEdifi1945Freg_11 = feature.properties.ED_1945_11
    }
    if(feature.properties.ED_1945_11> maxEdifi1945Freg_11){
        maxEdifi1945Freg_11 = feature.properties.ED_1945_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1945_11,0.35)
    });
}
function apagarEdifi1945Freg_11(e){
    var layer = e.target;
    Edifi1945Freg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1945Freg_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios entre 1919 e 1945: ' + '<b>' + feature.properties.ED_1945_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1945Freg_11,
    })
};

var Edifi1945Freg_11= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloEdifi1945Freg_11,
    onEachFeature: onEachFeatureEdifi1945Freg_11,
});

var slideEdifi1945Freg_11 = function(){
    var sliderEdifi1945Freg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 54){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1945Freg_11, {
        start: [minEdifi1945Freg_11, maxEdifi1945Freg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1945Freg_11,
            'max': maxEdifi1945Freg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1945Freg_11);
    inputNumberMax.setAttribute("value",maxEdifi1945Freg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1945Freg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1945Freg_11.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1945Freg_11.noUiSlider.on('update',function(e){
        Edifi1945Freg_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_1945_11>=parseFloat(e[0])&& layer.feature.properties.ED_1945_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1945Freg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 54;
    sliderAtivo = sliderEdifi1945Freg_11.noUiSlider;
    $(slidersGeral).append(sliderEdifi1945Freg_11);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1919 E 1945 , FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ENTRE 1946 E 1960 , FREGUESIA 2011-----------------------\\\\\\\\\\\\\

var minEdifi1960Freg_11 = 0;
var maxEdifi1960Freg_11 = 0;
function estiloEdifi1960Freg_11(feature, latlng) {
    if(feature.properties.ED_1960_11< minEdifi1960Freg_11){
        minEdifi1960Freg_11 = feature.properties.ED_1960_11
    }
    if(feature.properties.ED_1960_11> maxEdifi1960Freg_11){
        maxEdifi1960Freg_11 = feature.properties.ED_1960_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1960_11,0.35)
    });
}
function apagarEdifi1960Freg_11(e){
    var layer = e.target;
    Edifi1960Freg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1960Freg_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios entre 1946 e 1960: ' + '<b>' + feature.properties.ED_1960_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1960Freg_11,
    })
};

var Edifi1960Freg_11= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloEdifi1960Freg_11,
    onEachFeature: onEachFeatureEdifi1960Freg_11,
});

var slideEdifi1960Freg_11 = function(){
    var sliderEdifi1960Freg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 55){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1960Freg_11, {
        start: [minEdifi1960Freg_11, maxEdifi1960Freg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1960Freg_11,
            'max': maxEdifi1960Freg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1960Freg_11);
    inputNumberMax.setAttribute("value",maxEdifi1960Freg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1960Freg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1960Freg_11.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1960Freg_11.noUiSlider.on('update',function(e){
        Edifi1960Freg_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_1960_11>=parseFloat(e[0])&& layer.feature.properties.ED_1960_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1960Freg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 55;
    sliderAtivo = sliderEdifi1960Freg_11.noUiSlider;
    $(slidersGeral).append(sliderEdifi1960Freg_11);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1946 E 1960 , FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ENTRE 1961 E 1980 , FREGUESIA 2011-----------------------\\\\\\\\\\\\\

var minEdifi1980Freg_11 = 0;
var maxEdifi1980Freg_11 = 0;
function estiloEdifi1980Freg_11(feature, latlng) {
    if(feature.properties.ED_1980_11< minEdifi1980Freg_11){
        minEdifi1980Freg_11 = feature.properties.ED_1980_11
    }
    if(feature.properties.ED_1980_11> maxEdifi1980Freg_11){
        maxEdifi1980Freg_11 = feature.properties.ED_1980_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1980_11,0.35)
    });
}
function apagarEdifi1980Freg_11(e){
    var layer = e.target;
    Edifi1980Freg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1980Freg_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios entre 1961 e 1980: ' + '<b>' + feature.properties.ED_1980_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1980Freg_11,
    })
};

var Edifi1980Freg_11= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloEdifi1980Freg_11,
    onEachFeature: onEachFeatureEdifi1980Freg_11,
});

var slideEdifi1980Freg_11 = function(){
    var sliderEdifi1980Freg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 56){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1980Freg_11, {
        start: [minEdifi1980Freg_11, maxEdifi1980Freg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1980Freg_11,
            'max': maxEdifi1980Freg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1980Freg_11);
    inputNumberMax.setAttribute("value",maxEdifi1980Freg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1980Freg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1980Freg_11.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1980Freg_11.noUiSlider.on('update',function(e){
        Edifi1980Freg_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_1980_11>=parseFloat(e[0])&& layer.feature.properties.ED_1980_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1980Freg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 56;
    sliderAtivo = sliderEdifi1980Freg_11.noUiSlider;
    $(slidersGeral).append(sliderEdifi1980Freg_11);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1961 E 1980 , FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ENTRE 1981 E 2000 , FREGUESIA 2011-----------------------\\\\\\\\\\\\\

var minEdifi2000Freg_11 = 0;
var maxEdifi2000Freg_11 = 0;
function estiloEdifi2000Freg_11(feature, latlng) {
    if(feature.properties.ED_2000_11< minEdifi2000Freg_11){
        minEdifi2000Freg_11 = feature.properties.ED_2000_11
    }
    if(feature.properties.ED_2000_11> maxEdifi2000Freg_11){
        maxEdifi2000Freg_11 = feature.properties.ED_2000_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_2000_11,0.35)
    });
}
function apagarEdifi2000Freg_11(e){
    var layer = e.target;
    Edifi2000Freg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi2000Freg_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios entre 1981 e 2000: ' + '<b>' + feature.properties.ED_2000_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi2000Freg_11,
    })
};

var Edifi2000Freg_11= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloEdifi2000Freg_11,
    onEachFeature: onEachFeatureEdifi2000Freg_11,
});

var slideEdifi2000Freg_11 = function(){
    var sliderEdifi2000Freg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 57){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi2000Freg_11, {
        start: [minEdifi2000Freg_11, maxEdifi2000Freg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi2000Freg_11,
            'max': maxEdifi2000Freg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi2000Freg_11);
    inputNumberMax.setAttribute("value",maxEdifi2000Freg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi2000Freg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi2000Freg_11.noUiSlider.set([null, this.value]);
    });

    sliderEdifi2000Freg_11.noUiSlider.on('update',function(e){
        Edifi2000Freg_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_2000_11>=parseFloat(e[0])&& layer.feature.properties.ED_2000_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi2000Freg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 57;
    sliderAtivo = sliderEdifi2000Freg_11.noUiSlider;
    $(slidersGeral).append(sliderEdifi2000Freg_11);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1981 E 2000 , FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ENTRE 2001 E 2010 , FREGUESIA 2011-----------------------\\\\\\\\\\\\\

var minEdifi2010Freg_11 = 0;
var maxEdifi2010Freg_11 = 0;
function estiloEdifi2010Freg_11(feature, latlng) {
    if(feature.properties.ED_2010_11< minEdifi2010Freg_11){
        minEdifi2010Freg_11 = feature.properties.ED_2010_11
    }
    if(feature.properties.ED_2010_11> maxEdifi2010Freg_11){
        maxEdifi2010Freg_11 = feature.properties.ED_2010_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_2010_11,0.35)
    });
}
function apagarEdifi2010Freg_11(e){
    var layer = e.target;
    Edifi2010Freg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi2010Freg_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios entre 1981 e 2010: ' + '<b>' + feature.properties.ED_2010_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi2010Freg_11,
    })
};

var Edifi2010Freg_11= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloEdifi2010Freg_11,
    onEachFeature: onEachFeatureEdifi2010Freg_11,
});

var slideEdifi2010Freg_11 = function(){
    var sliderEdifi2010Freg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 58){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi2010Freg_11, {
        start: [minEdifi2010Freg_11, maxEdifi2010Freg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi2010Freg_11,
            'max': maxEdifi2010Freg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi2010Freg_11);
    inputNumberMax.setAttribute("value",maxEdifi2010Freg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi2010Freg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi2010Freg_11.noUiSlider.set([null, this.value]);
    });

    sliderEdifi2010Freg_11.noUiSlider.on('update',function(e){
        Edifi2010Freg_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_2010_11>=parseFloat(e[0])&& layer.feature.properties.ED_2010_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi2010Freg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 58;
    sliderAtivo = sliderEdifi2010Freg_11.noUiSlider;
    $(slidersGeral).append(sliderEdifi2010Freg_11);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 2001 E 2010 , FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ANTES 1919 , FREGUESIA 2021-----------------------\\\\\\\\\\\\\

var minEdifi1919Freg_21 = 0;
var maxEdifi1919Freg_21 = 0;
function estiloEdifi1919Freg_21(feature, latlng) {
    if(feature.properties.F_EDI_1919< minEdifi1919Freg_21){
        minEdifi1919Freg_21 = feature.properties.F_EDI_1919
    }
    if(feature.properties.F_EDI_1919> maxEdifi1919Freg_21){
        maxEdifi1919Freg_21 = feature.properties.F_EDI_1919
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_EDI_1919,0.35)
    });
}
function apagarEdifi1919Freg_21(e){
    var layer = e.target;
    Edifi1919Freg_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1919Freg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios antes de 1919: ' + '<b>' + feature.properties.F_EDI_1919 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1919Freg_21,
    })
};

var Edifi1919Freg_21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdifi1919Freg_21,
    onEachFeature: onEachFeatureEdifi1919Freg_21,
});

var slideEdifi1919Freg_21 = function(){
    var sliderEdifi1919Freg_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 59){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1919Freg_21, {
        start: [minEdifi1919Freg_21, maxEdifi1919Freg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1919Freg_21,
            'max': maxEdifi1919Freg_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1919Freg_21);
    inputNumberMax.setAttribute("value",maxEdifi1919Freg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1919Freg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1919Freg_21.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1919Freg_21.noUiSlider.on('update',function(e){
        Edifi1919Freg_21.eachLayer(function(layer){
            if(layer.feature.properties.F_EDI_1919>=parseFloat(e[0])&& layer.feature.properties.F_EDI_1919 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1919Freg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 59;
    sliderAtivo = sliderEdifi1919Freg_21.noUiSlider;
    $(slidersGeral).append(sliderEdifi1919Freg_21);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ANTES 1919 , FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\


///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ENTRE 1919 E 1945 , FREGUESIA 2021-----------------------\\\\\\\\\\\\\

var minEdifi1945Freg_21 = 0;
var maxEdifi1945Freg_21 = 0;
function estiloEdifi1945Freg_21(feature, latlng) {
    if(feature.properties.F_EDI_1945< minEdifi1945Freg_21){
        minEdifi1945Freg_21 = feature.properties.F_EDI_1945
    }
    if(feature.properties.F_EDI_1945> maxEdifi1945Freg_21){
        maxEdifi1945Freg_21 = feature.properties.F_EDI_1945
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_EDI_1945,0.35)
    });
}
function apagarEdifi1945Freg_21(e){
    var layer = e.target;
    Edifi1945Freg_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1945Freg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios entre 1919 e 1945: ' + '<b>' + feature.properties.F_EDI_1945 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1945Freg_21,
    })
};

var Edifi1945Freg_21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdifi1945Freg_21,
    onEachFeature: onEachFeatureEdifi1945Freg_21,
});

var slideEdifi1945Freg_21 = function(){
    var sliderEdifi1945Freg_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 60){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1945Freg_21, {
        start: [minEdifi1945Freg_21, maxEdifi1945Freg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1945Freg_21,
            'max': maxEdifi1945Freg_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1945Freg_21);
    inputNumberMax.setAttribute("value",maxEdifi1945Freg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1945Freg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1945Freg_21.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1945Freg_21.noUiSlider.on('update',function(e){
        Edifi1945Freg_21.eachLayer(function(layer){
            if(layer.feature.properties.F_EDI_1945>=parseFloat(e[0])&& layer.feature.properties.F_EDI_1945 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1945Freg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 60;
    sliderAtivo = sliderEdifi1945Freg_21.noUiSlider;
    $(slidersGeral).append(sliderEdifi1945Freg_21);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1919 E 1945 , FREGUESIA 2021 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ENTRE 1946 E 1960 , FREGUESIA 2021-----------------------\\\\\\\\\\\\\

var minEdifi1960Freg_21 = 0;
var maxEdifi1960Freg_21 = 0;
function estiloEdifi1960Freg_21(feature, latlng) {
    if(feature.properties.F_EDI_1960< minEdifi1960Freg_21){
        minEdifi1960Freg_21 = feature.properties.F_EDI_1960
    }
    if(feature.properties.F_EDI_1960> maxEdifi1960Freg_21){
        maxEdifi1960Freg_21 = feature.properties.F_EDI_1960
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_EDI_1960,0.35)
    });
}
function apagarEdifi1960Freg_21(e){
    var layer = e.target;
    Edifi1960Freg_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1960Freg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios entre 1946 e 1960: ' + '<b>' + feature.properties.F_EDI_1960 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1960Freg_21,
    })
};

var Edifi1960Freg_21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdifi1960Freg_21,
    onEachFeature: onEachFeatureEdifi1960Freg_21,
});

var slideEdifi1960Freg_21 = function(){
    var sliderEdifi1960Freg_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 61){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1960Freg_21, {
        start: [minEdifi1960Freg_21, maxEdifi1960Freg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1960Freg_21,
            'max': maxEdifi1960Freg_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1960Freg_21);
    inputNumberMax.setAttribute("value",maxEdifi1960Freg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1960Freg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1960Freg_21.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1960Freg_21.noUiSlider.on('update',function(e){
        Edifi1960Freg_21.eachLayer(function(layer){
            if(layer.feature.properties.F_EDI_1960>=parseFloat(e[0])&& layer.feature.properties.F_EDI_1960 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1960Freg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 61;
    sliderAtivo = sliderEdifi1960Freg_21.noUiSlider;
    $(slidersGeral).append(sliderEdifi1960Freg_21);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1946 E 1960 , FREGUESIA 2021 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ENTRE 1961 E 1980 , FREGUESIA 2021-----------------------\\\\\\\\\\\\\

var minEdifi1980Freg_21 = 0;
var maxEdifi1980Freg_21 = 0;
function estiloEdifi1980Freg_21(feature, latlng) {
    if(feature.properties.F_EDI_1980< minEdifi1980Freg_21){
        minEdifi1980Freg_21 = feature.properties.F_EDI_1980
    }
    if(feature.properties.F_EDI_1980> maxEdifi1980Freg_21){
        maxEdifi1980Freg_21 = feature.properties.F_EDI_1980
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_EDI_1980,0.35)
    });
}
function apagarEdifi1980Freg_21(e){
    var layer = e.target;
    Edifi1980Freg_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi1980Freg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios entre 1961 e 1980: ' + '<b>' + feature.properties.F_EDI_1980 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi1980Freg_21,
    })
};

var Edifi1980Freg_21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdifi1980Freg_21,
    onEachFeature: onEachFeatureEdifi1980Freg_21,
});

var slideEdifi1980Freg_21 = function(){
    var sliderEdifi1980Freg_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 62){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi1980Freg_21, {
        start: [minEdifi1980Freg_21, maxEdifi1980Freg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi1980Freg_21,
            'max': maxEdifi1980Freg_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi1980Freg_21);
    inputNumberMax.setAttribute("value",maxEdifi1980Freg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi1980Freg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi1980Freg_21.noUiSlider.set([null, this.value]);
    });

    sliderEdifi1980Freg_21.noUiSlider.on('update',function(e){
        Edifi1980Freg_21.eachLayer(function(layer){
            if(layer.feature.properties.F_EDI_1980>=parseFloat(e[0])&& layer.feature.properties.F_EDI_1980 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi1980Freg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 62;
    sliderAtivo = sliderEdifi1980Freg_21.noUiSlider;
    $(slidersGeral).append(sliderEdifi1980Freg_21);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1961 E 1980 , FREGUESIA 2021 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ENTRE 1981 E 2000 , FREGUESIA 2021-----------------------\\\\\\\\\\\\\

var minEdifi2000Freg_21 = 0;
var maxEdifi2000Freg_21 = 0;
function estiloEdifi2000Freg_21(feature, latlng) {
    if(feature.properties.F_EDI_2000< minEdifi2000Freg_21){
        minEdifi2000Freg_21 = feature.properties.F_EDI_2000
    }
    if(feature.properties.F_EDI_2000> maxEdifi2000Freg_21){
        maxEdifi2000Freg_21 = feature.properties.F_EDI_2000
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_EDI_2000,0.35)
    });
}
function apagarEdifi2000Freg_21(e){
    var layer = e.target;
    Edifi2000Freg_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi2000Freg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios entre 1981 e 2000: ' + '<b>' + feature.properties.F_EDI_2000 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi2000Freg_21,
    })
};

var Edifi2000Freg_21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdifi2000Freg_21,
    onEachFeature: onEachFeatureEdifi2000Freg_21,
});

var slideEdifi2000Freg_21 = function(){
    var sliderEdifi2000Freg_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 63){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi2000Freg_21, {
        start: [minEdifi2000Freg_21, maxEdifi2000Freg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi2000Freg_21,
            'max': maxEdifi2000Freg_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi2000Freg_21);
    inputNumberMax.setAttribute("value",maxEdifi2000Freg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi2000Freg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi2000Freg_21.noUiSlider.set([null, this.value]);
    });

    sliderEdifi2000Freg_21.noUiSlider.on('update',function(e){
        Edifi2000Freg_21.eachLayer(function(layer){
            if(layer.feature.properties.F_EDI_2000>=parseFloat(e[0])&& layer.feature.properties.F_EDI_2000 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi2000Freg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 63;
    sliderAtivo = sliderEdifi2000Freg_21.noUiSlider;
    $(slidersGeral).append(sliderEdifi2000Freg_21);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 1981 E 2000 , FREGUESIA 2021 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ENTRE 2001 E 2010 , FREGUESIA 2021-----------------------\\\\\\\\\\\\\

var minEdifi2010Freg_21 = 0;
var maxEdifi2010Freg_21 = 0;
function estiloEdifi2010Freg_21(feature, latlng) {
    if(feature.properties.F_EDI_2010< minEdifi2010Freg_21){
        minEdifi2010Freg_21 = feature.properties.F_EDI_2010
    }
    if(feature.properties.F_EDI_2010> maxEdifi2010Freg_21){
        maxEdifi2010Freg_21 = feature.properties.F_EDI_2010
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_EDI_2010,0.35)
    });
}
function apagarEdifi2010Freg_21(e){
    var layer = e.target;
    Edifi2010Freg_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi2010Freg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios entre 1981 e 2010: ' + '<b>' + feature.properties.F_EDI_2010 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi2010Freg_21,
    })
};

var Edifi2010Freg_21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdifi2010Freg_21,
    onEachFeature: onEachFeatureEdifi2010Freg_21,
});

var slideEdifi2010Freg_21 = function(){
    var sliderEdifi2010Freg_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 64){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi2010Freg_21, {
        start: [minEdifi2010Freg_21, maxEdifi2010Freg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi2010Freg_21,
            'max': maxEdifi2010Freg_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi2010Freg_21);
    inputNumberMax.setAttribute("value",maxEdifi2010Freg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi2010Freg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi2010Freg_21.noUiSlider.set([null, this.value]);
    });

    sliderEdifi2010Freg_21.noUiSlider.on('update',function(e){
        Edifi2010Freg_21.eachLayer(function(layer){
            if(layer.feature.properties.F_EDI_2010>=parseFloat(e[0])&& layer.feature.properties.F_EDI_2010 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi2010Freg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 64;
    sliderAtivo = sliderEdifi2010Freg_21.noUiSlider;
    $(slidersGeral).append(sliderEdifi2010Freg_21);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 2001 E 2010 , FREGUESIA 2021 -----------\\\\\\\\\\\\\\\\\\\\

///////////////////////////-----------  EDIFICIOS CONSTRUIDOS ENTRE 2011 E 2021 , FREGUESIA 2021-----------------------\\\\\\\\\\\\\

var minEdifi2020Freg_21 = 0;
var maxEdifi2020Freg_21 = 0;
function estiloEdifi2020Freg_21(feature, latlng) {
    if(feature.properties.F_EDI_2020< minEdifi2020Freg_21){
        minEdifi2020Freg_21 = feature.properties.F_EDI_2020
    }
    if(feature.properties.F_EDI_2020> maxEdifi2020Freg_21){
        maxEdifi2020Freg_21 = feature.properties.F_EDI_2020
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_EDI_2020,0.35)
    });
}
function apagarEdifi2020Freg_21(e){
    var layer = e.target;
    Edifi2020Freg_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifi2020Freg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios entre 1981 e 2020: ' + '<b>' + feature.properties.F_EDI_2020 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifi2020Freg_21,
    })
};

var Edifi2020Freg_21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdifi2020Freg_21,
    onEachFeature: onEachFeatureEdifi2020Freg_21,
});

var slideEdifi2020Freg_21 = function(){
    var sliderEdifi2020Freg_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 65){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifi2020Freg_21, {
        start: [minEdifi2020Freg_21, maxEdifi2020Freg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifi2020Freg_21,
            'max': maxEdifi2020Freg_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifi2020Freg_21);
    inputNumberMax.setAttribute("value",maxEdifi2020Freg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifi2020Freg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifi2020Freg_21.noUiSlider.set([null, this.value]);
    });

    sliderEdifi2020Freg_21.noUiSlider.on('update',function(e){
        Edifi2020Freg_21.eachLayer(function(layer){
            if(layer.feature.properties.F_EDI_2020>=parseFloat(e[0])&& layer.feature.properties.F_EDI_2020 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifi2020Freg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 65;
    sliderAtivo = sliderEdifi2020Freg_21.noUiSlider;
    $(slidersGeral).append(sliderEdifi2020Freg_21);
}
 
///////////////////////////-----FIM TOTAL EDIFICIOS CONSTRUIDOS ENTRE 2011 E 2021 , FREGUESIA 2021 -----------\\\\\\\\\\\\\\\\\\\\
////////////////////////-----------------------FIM DADOS ABSOLUTOS FREGUESIA --------------\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//////////////////////-------------------- DADOS RELATIVOS FREGUESIA ---------------------------\\\\\\\

//////////////////------- Percentagem EDIFICIOS ANTES 1919 por FREGUESIAS em 2001-----////

var minPerEDI_1919_Freg01 = 99;
var maxPerEDI_1919_Freg01 = 0;

function CorPerEDI1919Freg(d) {
    return d == 0.00 ? '#000000' :
        d >= 63.81 ? '#8c0303' :
        d >= 53.2  ? '#de1f35' :
        d >= 35.52 ? '#ff5e6e' :
        d >= 17.84   ? '#f5b3be' :
        d >= 0.16   ? '#F2C572' :
                ''  ;
}
var legendaPerEDI1919Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + ' > 63.81' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 53.2 - 63.81' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 35.52 - 53.2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 17.84 - 35.52' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.16 - 17.84' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' 0' + '<br>'


    $(legendaA).append(symbolsContainer); 
}


function EstiloPerEDI_1919_Freg01(feature) {
    if(feature.properties.P_1919_01 <= minPerEDI_1919_Freg01 || feature.properties.P_1919_01 === 0){
        minPerEDI_1919_Freg01 = feature.properties.P_1919_01
    }
    if(feature.properties.P_1919_01 >= maxPerEDI_1919_Freg01 ){
        maxPerEDI_1919_Freg01 = feature.properties.P_1919_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1919Freg(feature.properties.P_1919_01)
    };
}
function apagarPerEDI_1919_Freg01(e) {
    PerEDI_1919_Freg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1919_Freg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_1919_01 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1919_Freg01,
    });
}
var PerEDI_1919_Freg01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPerEDI_1919_Freg01,
    onEachFeature: onEachFeaturePerEDI_1919_Freg01
});
let slidePerEDI_1919_Freg01 = function(){
    var sliderPerEDI_1919_Freg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 66){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1919_Freg01, {
        start: [minPerEDI_1919_Freg01, maxPerEDI_1919_Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1919_Freg01,
            'max': maxPerEDI_1919_Freg01
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1919_Freg01);
    inputNumberMax.setAttribute("value",maxPerEDI_1919_Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1919_Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1919_Freg01.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1919_Freg01.noUiSlider.on('update',function(e){
        PerEDI_1919_Freg01.eachLayer(function(layer){
            if(layer.feature.properties.P_1919_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_1919_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1919_Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 66;
    sliderAtivo = sliderPerEDI_1919_Freg01.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1919_Freg01);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ANTES 1919 2001 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1919 E 1945 por FREGUESIAS em 2001-----////

var minPerEDI_1945_Freg01 = 0;
var maxPerEDI_1945_Freg01 = 0;

function CorPerEDI1945Freg(d) {
    return d >= 44.47 ? '#8c0303' :
        d >= 37.1  ? '#de1f35' :
        d >= 24.81 ? '#ff5e6e' :
        d >= 12.51   ? '#f5b3be' :
        d >= 0.22   ? '#F2C572' :
                ''  ;
}
var legendaPerEDI1945Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + ' > 44.47' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 37.1 - 44.47' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 24.81 - 37.1' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 12.51 - 24.81' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.22 - 12.51' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEDI_1945_Freg01(feature) {
    if( feature.properties.P_1945_01 <= minPerEDI_1945_Freg01 || minPerEDI_1945_Freg01 === 0){
        minPerEDI_1945_Freg01 = feature.properties.P_1945_01
    }
    if(feature.properties.P_1945_01 >= maxPerEDI_1945_Freg01 ){
        maxPerEDI_1945_Freg01 = feature.properties.P_1945_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1945Freg(feature.properties.P_1945_01)
    };
}
function apagarPerEDI_1945_Freg01(e) {
    PerEDI_1945_Freg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1945_Freg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_1945_01 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1945_Freg01,
    });
}
var PerEDI_1945_Freg01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPerEDI_1945_Freg01,
    onEachFeature: onEachFeaturePerEDI_1945_Freg01
});
let slidePerEDI_1945_Freg01 = function(){
    var sliderPerEDI_1945_Freg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 67){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1945_Freg01, {
        start: [minPerEDI_1945_Freg01, maxPerEDI_1945_Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1945_Freg01,
            'max': maxPerEDI_1945_Freg01
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1945_Freg01);
    inputNumberMax.setAttribute("value",maxPerEDI_1945_Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1945_Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1945_Freg01.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1945_Freg01.noUiSlider.on('update',function(e){
        PerEDI_1945_Freg01.eachLayer(function(layer){
            if(layer.feature.properties.P_1945_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_1945_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1945_Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 67;
    sliderAtivo = sliderPerEDI_1945_Freg01.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1945_Freg01);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1919 E 1945 2001 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1946 E 1960 por FREGUESIAS em 2001-----////

var minPerEDI_1960_Freg01 = 0;
var maxPerEDI_1960_Freg01 = 0;

function CorPerEDI1960Freg(d) {
    return d >= 27.07 ? '#8c0303' :
        d >= 22.6  ? '#de1f35' :
        d >= 15.15 ? '#ff5e6e' :
        d >= 7.7   ? '#f5b3be' :
        d >= 0.25   ? '#F2C572' :
                ''  ;
}
var legendaPerEDI1960Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + ' > 27.07' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 22.6 - 27.07' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 15.15 - 22.6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 7.7 - 15.15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.25 - 7.7' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEDI_1960_Freg01(feature) {
    if( feature.properties.P_1960_01 <= minPerEDI_1960_Freg01 || minPerEDI_1960_Freg01 === 0){
        minPerEDI_1960_Freg01 = feature.properties.P_1960_01
    }
    if(feature.properties.P_1960_01 >= maxPerEDI_1960_Freg01 ){
        maxPerEDI_1960_Freg01 = feature.properties.P_1960_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1960Freg(feature.properties.P_1960_01)
    };
}
function apagarPerEDI_1960_Freg01(e) {
    PerEDI_1960_Freg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1960_Freg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_1960_01 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1960_Freg01,
    });
}
var PerEDI_1960_Freg01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPerEDI_1960_Freg01,
    onEachFeature: onEachFeaturePerEDI_1960_Freg01
});
let slidePerEDI_1960_Freg01 = function(){
    var sliderPerEDI_1960_Freg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 68){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1960_Freg01, {
        start: [minPerEDI_1960_Freg01, maxPerEDI_1960_Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1960_Freg01,
            'max': maxPerEDI_1960_Freg01
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1960_Freg01);
    inputNumberMax.setAttribute("value",maxPerEDI_1960_Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1960_Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1960_Freg01.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1960_Freg01.noUiSlider.on('update',function(e){
        PerEDI_1960_Freg01.eachLayer(function(layer){
            if(layer.feature.properties.P_1960_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_1960_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1960_Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 68;
    sliderAtivo = sliderPerEDI_1960_Freg01.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1960_Freg01);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1946 E 1960 2001 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1961 E 1980 por FREGUESIAS em 2001-----////

var minPerEDI_1980_Freg01 = 0;
var maxPerEDI_1980_Freg01 = 0;

function CorPerEDI1980Freg(d) {
    return d >= 44.84 ? '#8c0303' :
        d >= 37.51  ? '#de1f35' :
        d >= 25.29 ? '#ff5e6e' :
        d >= 13.07   ? '#f5b3be' :
        d >= 0.85   ? '#F2C572' :
                ''  ;
}
var legendaPerEDI1980Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + ' > 44.84' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 37.51 - 44.84' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 25.29 - 37.51' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 13.07 - 25.29' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.85 - 13.07' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEDI_1980_Freg01(feature) {
    if( feature.properties.P_1980_01 <= minPerEDI_1980_Freg01 || minPerEDI_1980_Freg01 === 0){
        minPerEDI_1980_Freg01 = feature.properties.P_1980_01
    }
    if(feature.properties.P_1980_01 >= maxPerEDI_1980_Freg01 ){
        maxPerEDI_1980_Freg01 = feature.properties.P_1980_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1980Freg(feature.properties.P_1980_01)
    };
}
function apagarPerEDI_1980_Freg01(e) {
    PerEDI_1980_Freg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1980_Freg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_1980_01 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1980_Freg01,
    });
}
var PerEDI_1980_Freg01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPerEDI_1980_Freg01,
    onEachFeature: onEachFeaturePerEDI_1980_Freg01
});
let slidePerEDI_1980_Freg01 = function(){
    var sliderPerEDI_1980_Freg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 69){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1980_Freg01, {
        start: [minPerEDI_1980_Freg01, maxPerEDI_1980_Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1980_Freg01,
            'max': maxPerEDI_1980_Freg01
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1980_Freg01);
    inputNumberMax.setAttribute("value",maxPerEDI_1980_Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1980_Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1980_Freg01.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1980_Freg01.noUiSlider.on('update',function(e){
        PerEDI_1980_Freg01.eachLayer(function(layer){
            if(layer.feature.properties.P_1980_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_1980_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1980_Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 69;
    sliderAtivo = sliderPerEDI_1980_Freg01.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1980_Freg01);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1961 E 1980 2001 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1981 E 2000 por FREGUESIAS em 2001-----////

var minPerEDI_2000_Freg01 = 0;
var maxPerEDI_2000_Freg01 = 0;

function CorPerEDI2000Freg(d) {
    return d >= 69.77 ? '#8c0303' :
        d >= 58.29  ? '#de1f35' :
        d >= 39.16 ? '#ff5e6e' :
        d >= 20.03   ? '#f5b3be' :
        d >= 0.9   ? '#F2C572' :
                ''  ;
}
var legendaPerEDI2000Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + ' > 69.77' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 58.29 - 69.77' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 39.16 - 58.29' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 20.03 - 39.16' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.9 - 20.03' + '<br>'

    $(legendaA).append(symbolsContainer); 
}


function EstiloPerEDI_2000_Freg01(feature) {
    if( feature.properties.P_2000_01 <= minPerEDI_2000_Freg01 || minPerEDI_2000_Freg01 === 0){
        minPerEDI_2000_Freg01 = feature.properties.P_2000_01
    }
    if(feature.properties.P_2000_01 >= maxPerEDI_2000_Freg01 ){
        maxPerEDI_2000_Freg01 = feature.properties.P_2000_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI2000Freg(feature.properties.P_2000_01)
    };
}
function apagarPerEDI_2000_Freg01(e) {
    PerEDI_2000_Freg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_2000_Freg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_2000_01 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_2000_Freg01,
    });
}
var PerEDI_2000_Freg01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPerEDI_2000_Freg01,
    onEachFeature: onEachFeaturePerEDI_2000_Freg01
});
let slidePerEDI_2000_Freg01 = function(){
    var sliderPerEDI_2000_Freg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 70){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_2000_Freg01, {
        start: [minPerEDI_2000_Freg01, maxPerEDI_2000_Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_2000_Freg01,
            'max': maxPerEDI_2000_Freg01
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_2000_Freg01);
    inputNumberMax.setAttribute("value",maxPerEDI_2000_Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_2000_Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_2000_Freg01.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_2000_Freg01.noUiSlider.on('update',function(e){
        PerEDI_2000_Freg01.eachLayer(function(layer){
            if(layer.feature.properties.P_2000_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_2000_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_2000_Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 70;
    sliderAtivo = sliderPerEDI_2000_Freg01.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_2000_Freg01);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1981 E 2000 2001 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ANTES 1919 por FREGUESIAS em 2011-----////

var minPerEDI_1919_Freg11 = 99;
var maxPerEDI_1919_Freg11 = 0;

function EstiloPerEDI_1919_Freg11(feature) {
    if( feature.properties.P_1919_11 <= minPerEDI_1919_Freg11 || feature.properties.P_1919_11 === 0){
        minPerEDI_1919_Freg11 = feature.properties.P_1919_11
    }
    if(feature.properties.P_1919_11 >= maxPerEDI_1919_Freg11 ){
        maxPerEDI_1919_Freg11 = feature.properties.P_1919_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1919Freg(feature.properties.P_1919_11)
    };
}
function apagarPerEDI_1919_Freg11(e) {
    PerEDI_1919_Freg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1919_Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_1919_11 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1919_Freg11,
    });
}
var PerEDI_1919_Freg11= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPerEDI_1919_Freg11,
    onEachFeature: onEachFeaturePerEDI_1919_Freg11
});
let slidePerEDI_1919_Freg11 = function(){
    var sliderPerEDI_1919_Freg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 71){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1919_Freg11, {
        start: [minPerEDI_1919_Freg11, maxPerEDI_1919_Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1919_Freg11,
            'max': maxPerEDI_1919_Freg11
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1919_Freg11);
    inputNumberMax.setAttribute("value",maxPerEDI_1919_Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1919_Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1919_Freg11.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1919_Freg11.noUiSlider.on('update',function(e){
        PerEDI_1919_Freg11.eachLayer(function(layer){
            if(layer.feature.properties.P_1919_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_1919_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1919_Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 71;
    sliderAtivo = sliderPerEDI_1919_Freg11.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1919_Freg11);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ANTES 1919 2011 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1919 E 1945 por FREGUESIAS em 2011-----////

var minPerEDI_1945_Freg11 = 0;
var maxPerEDI_1945_Freg11 = 0;

function EstiloPerEDI_1945_Freg11(feature) {
    if( feature.properties.P_1945_11 <= minPerEDI_1945_Freg11 || minPerEDI_1945_Freg11 === 0){
        minPerEDI_1945_Freg11 = feature.properties.P_1945_11
    }
    if(feature.properties.P_1945_11 >= maxPerEDI_1945_Freg11 ){
        maxPerEDI_1945_Freg11 = feature.properties.P_1945_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1945Freg(feature.properties.P_1945_11)
    };
}
function apagarPerEDI_1945_Freg11(e) {
    PerEDI_1945_Freg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1945_Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_1945_11 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1945_Freg11,
    });
}
var PerEDI_1945_Freg11= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPerEDI_1945_Freg11,
    onEachFeature: onEachFeaturePerEDI_1945_Freg11
});
let slidePerEDI_1945_Freg11 = function(){
    var sliderPerEDI_1945_Freg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 72){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1945_Freg11, {
        start: [minPerEDI_1945_Freg11, maxPerEDI_1945_Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1945_Freg11,
            'max': maxPerEDI_1945_Freg11
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1945_Freg11);
    inputNumberMax.setAttribute("value",maxPerEDI_1945_Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1945_Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1945_Freg11.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1945_Freg11.noUiSlider.on('update',function(e){
        PerEDI_1945_Freg11.eachLayer(function(layer){
            if(layer.feature.properties.P_1945_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_1945_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1945_Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 72;
    sliderAtivo = sliderPerEDI_1945_Freg11.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1945_Freg11);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1919 E 1945 2011 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1946 E 1960 por FREGUESIAS em 2011-----////

var minPerEDI_1960_Freg11 = 0;
var maxPerEDI_1960_Freg11 = 0;

function EstiloPerEDI_1960_Freg11(feature) {
    if( feature.properties.P_1960_11 <= minPerEDI_1960_Freg11 || minPerEDI_1960_Freg11 === 0){
        minPerEDI_1960_Freg11 = feature.properties.P_1960_11
    }
    if(feature.properties.P_1960_11 >= maxPerEDI_1960_Freg11 ){
        maxPerEDI_1960_Freg11 = feature.properties.P_1960_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1960Freg(feature.properties.P_1960_11)
    };
}
function apagarPerEDI_1960_Freg11(e) {
    PerEDI_1960_Freg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1960_Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_1960_11 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1960_Freg11,
    });
}
var PerEDI_1960_Freg11= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPerEDI_1960_Freg11,
    onEachFeature: onEachFeaturePerEDI_1960_Freg11
});
let slidePerEDI_1960_Freg11 = function(){
    var sliderPerEDI_1960_Freg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 73){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1960_Freg11, {
        start: [minPerEDI_1960_Freg11, maxPerEDI_1960_Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1960_Freg11,
            'max': maxPerEDI_1960_Freg11
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1960_Freg11);
    inputNumberMax.setAttribute("value",maxPerEDI_1960_Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1960_Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1960_Freg11.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1960_Freg11.noUiSlider.on('update',function(e){
        PerEDI_1960_Freg11.eachLayer(function(layer){
            if(layer.feature.properties.P_1960_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_1960_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1960_Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 73;
    sliderAtivo = sliderPerEDI_1960_Freg11.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1960_Freg11);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1946 E 1960 2011 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1961 E 1980 por FREGUESIAS em 2011-----////

var minPerEDI_1980_Freg11 = 0;
var maxPerEDI_1980_Freg11 = 0;

function EstiloPerEDI_1980_Freg11(feature) {
    if( feature.properties.P_1980_11 <= minPerEDI_1980_Freg11 || minPerEDI_1980_Freg11 === 0){
        minPerEDI_1980_Freg11 = feature.properties.P_1980_11
    }
    if(feature.properties.P_1980_11 >= maxPerEDI_1980_Freg11 ){
        maxPerEDI_1980_Freg11 = feature.properties.P_1980_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1980Freg(feature.properties.P_1980_11)
    };
}
function apagarPerEDI_1980_Freg11(e) {
    PerEDI_1980_Freg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1980_Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_1980_11 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1980_Freg11,
    });
}
var PerEDI_1980_Freg11= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPerEDI_1980_Freg11,
    onEachFeature: onEachFeaturePerEDI_1980_Freg11
});
let slidePerEDI_1980_Freg11 = function(){
    var sliderPerEDI_1980_Freg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 74){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1980_Freg11, {
        start: [minPerEDI_1980_Freg11, maxPerEDI_1980_Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1980_Freg11,
            'max': maxPerEDI_1980_Freg11
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1980_Freg11);
    inputNumberMax.setAttribute("value",maxPerEDI_1980_Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1980_Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1980_Freg11.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1980_Freg11.noUiSlider.on('update',function(e){
        PerEDI_1980_Freg11.eachLayer(function(layer){
            if(layer.feature.properties.P_1980_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_1980_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1980_Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 74;
    sliderAtivo = sliderPerEDI_1980_Freg11.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1980_Freg11);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1961 E 1980 2011 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1981 E 2000 por FREGUESIAS em 2011-----////

var minPerEDI_2000_Freg11 = 0;
var maxPerEDI_2000_Freg11 = 0;

function EstiloPerEDI_2000_Freg11(feature) {
    if( feature.properties.P_2000_11 <= minPerEDI_2000_Freg11 || minPerEDI_2000_Freg11 === 0){
        minPerEDI_2000_Freg11 = feature.properties.P_2000_11
    }
    if(feature.properties.P_2000_11 >= maxPerEDI_2000_Freg11 ){
        maxPerEDI_2000_Freg11 = feature.properties.P_2000_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI2000Freg(feature.properties.P_2000_11)
    };
}
function apagarPerEDI_2000_Freg11(e) {
    PerEDI_2000_Freg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_2000_Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_2000_11 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_2000_Freg11,
    });
}
var PerEDI_2000_Freg11= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPerEDI_2000_Freg11,
    onEachFeature: onEachFeaturePerEDI_2000_Freg11
});
let slidePerEDI_2000_Freg11 = function(){
    var sliderPerEDI_2000_Freg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 75){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_2000_Freg11, {
        start: [minPerEDI_2000_Freg11, maxPerEDI_2000_Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_2000_Freg11,
            'max': maxPerEDI_2000_Freg11
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_2000_Freg11);
    inputNumberMax.setAttribute("value",maxPerEDI_2000_Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_2000_Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_2000_Freg11.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_2000_Freg11.noUiSlider.on('update',function(e){
        PerEDI_2000_Freg11.eachLayer(function(layer){
            if(layer.feature.properties.P_2000_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_2000_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_2000_Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 75;
    sliderAtivo = sliderPerEDI_2000_Freg11.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_2000_Freg11);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1981 E 2000 2011 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 2001 E 2010 por FREGUESIAS em 2011-----////

var minPerEDI_2010_Freg11 = 0;
var maxPerEDI_2010_Freg11 = 0;

function CorPerEDI2010Freg(d) {
    return d >= 28.79 ? '#8c0303' :
        d >= 24.37  ? '#de1f35' :
        d >= 17     ? '#ff5e6e' :
        d >= 9.63   ? '#f5b3be' :
        d >= 2.26   ? '#F2C572' :
                ''  ;
}
var legendaPerEDI2010Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + ' > 28.79' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 24.37 - 28.79' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 17 - 24.37' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 9.63 - 17' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 2.26 - 9.63' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEDI_2010_Freg11(feature) {
    if( feature.properties.P_2010_11 <= minPerEDI_2010_Freg11 || minPerEDI_2010_Freg11 === 0){
        minPerEDI_2010_Freg11 = feature.properties.P_2010_11
    }
    if(feature.properties.P_2010_11 >= maxPerEDI_2010_Freg11 ){
        maxPerEDI_2010_Freg11 = feature.properties.P_2010_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI2010Freg(feature.properties.P_2010_11)
    };
}
function apagarPerEDI_2010_Freg11(e) {
    PerEDI_2010_Freg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_2010_Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_2010_11 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_2010_Freg11,
    });
}
var PerEDI_2010_Freg11= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPerEDI_2010_Freg11,
    onEachFeature: onEachFeaturePerEDI_2010_Freg11
});
let slidePerEDI_2010_Freg11 = function(){
    var sliderPerEDI_2010_Freg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 76){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_2010_Freg11, {
        start: [minPerEDI_2010_Freg11, maxPerEDI_2010_Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_2010_Freg11,
            'max': maxPerEDI_2010_Freg11
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_2010_Freg11);
    inputNumberMax.setAttribute("value",maxPerEDI_2010_Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_2010_Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_2010_Freg11.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_2010_Freg11.noUiSlider.on('update',function(e){
        PerEDI_2010_Freg11.eachLayer(function(layer){
            if(layer.feature.properties.P_2010_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_2010_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_2010_Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 76;
    sliderAtivo = sliderPerEDI_2010_Freg11.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_2010_Freg11);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 2001 E 2010 2011 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ANTES 1919 por FREGUESIAS em 2021-----////

var minPerEDI_1919_Freg21 = 0;
var maxPerEDI_1919_Freg21 = 0;

function EstiloPerEDI_1919_Freg21(feature) {
    if( feature.properties.P1919_21 <= minPerEDI_1919_Freg21 || minPerEDI_1919_Freg21 === 0){
        minPerEDI_1919_Freg21 = feature.properties.P1919_21
    }
    if(feature.properties.P1919_21 >= maxPerEDI_1919_Freg21 ){
        maxPerEDI_1919_Freg21 = feature.properties.P1919_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1919Freg(feature.properties.P1919_21)
    };
}
function apagarPerEDI_1919_Freg21(e) {
    PerEDI_1919_Freg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1919_Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P1919_21 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1919_Freg21,
    });
}
var PerEDI_1919_Freg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPerEDI_1919_Freg21,
    onEachFeature: onEachFeaturePerEDI_1919_Freg21
});
let slidePerEDI_1919_Freg21 = function(){
    var sliderPerEDI_1919_Freg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 77){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1919_Freg21, {
        start: [minPerEDI_1919_Freg21, maxPerEDI_1919_Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1919_Freg21,
            'max': maxPerEDI_1919_Freg21
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1919_Freg21);
    inputNumberMax.setAttribute("value",maxPerEDI_1919_Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1919_Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1919_Freg21.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1919_Freg21.noUiSlider.on('update',function(e){
        PerEDI_1919_Freg21.eachLayer(function(layer){
            if(layer.feature.properties.P1919_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1919_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1919_Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 77;
    sliderAtivo = sliderPerEDI_1919_Freg21.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1919_Freg21);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ANTES 1919 2021 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1919 E 1945 por FREGUESIAS em 2021-----////

var minPerEDI_1945_Freg21 = 0;
var maxPerEDI_1945_Freg21 = 0;

function EstiloPerEDI_1945_Freg21(feature) {
    if( feature.properties.P1945_21 <= minPerEDI_1945_Freg21 || minPerEDI_1945_Freg21 === 0){
        minPerEDI_1945_Freg21 = feature.properties.P1945_21
    }
    if(feature.properties.P1945_21 >= maxPerEDI_1945_Freg21 ){
        maxPerEDI_1945_Freg21 = feature.properties.P1945_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1945Freg(feature.properties.P1945_21)
    };
}
function apagarPerEDI_1945_Freg21(e) {
    PerEDI_1945_Freg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1945_Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P1945_21 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1945_Freg21,
    });
}
var PerEDI_1945_Freg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPerEDI_1945_Freg21,
    onEachFeature: onEachFeaturePerEDI_1945_Freg21
});
let slidePerEDI_1945_Freg21 = function(){
    var sliderPerEDI_1945_Freg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 78){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1945_Freg21, {
        start: [minPerEDI_1945_Freg21, maxPerEDI_1945_Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1945_Freg21,
            'max': maxPerEDI_1945_Freg21
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1945_Freg21);
    inputNumberMax.setAttribute("value",maxPerEDI_1945_Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1945_Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1945_Freg21.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1945_Freg21.noUiSlider.on('update',function(e){
        PerEDI_1945_Freg21.eachLayer(function(layer){
            if(layer.feature.properties.P1945_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1945_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1945_Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 78;
    sliderAtivo = sliderPerEDI_1945_Freg21.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1945_Freg21);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1919 E 1945 2021 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1946 E 1960 por FREGUESIAS em 2021-----////

var minPerEDI_1960_Freg21 = 0;
var maxPerEDI_1960_Freg21 = 0;

function EstiloPerEDI_1960_Freg21(feature) {
    if( feature.properties.P1960_21 <= minPerEDI_1960_Freg21 || minPerEDI_1960_Freg21 === 0){
        minPerEDI_1960_Freg21 = feature.properties.P1960_21
    }
    if(feature.properties.P1960_21 >= maxPerEDI_1960_Freg21 ){
        maxPerEDI_1960_Freg21 = feature.properties.P1960_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1960Freg(feature.properties.P1960_21)
    };
}
function apagarPerEDI_1960_Freg21(e) {
    PerEDI_1960_Freg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1960_Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P1960_21 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1960_Freg21,
    });
}
var PerEDI_1960_Freg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPerEDI_1960_Freg21,
    onEachFeature: onEachFeaturePerEDI_1960_Freg21
});
let slidePerEDI_1960_Freg21 = function(){
    var sliderPerEDI_1960_Freg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 79){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1960_Freg21, {
        start: [minPerEDI_1960_Freg21, maxPerEDI_1960_Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1960_Freg21,
            'max': maxPerEDI_1960_Freg21
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1960_Freg21);
    inputNumberMax.setAttribute("value",maxPerEDI_1960_Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1960_Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1960_Freg21.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1960_Freg21.noUiSlider.on('update',function(e){
        PerEDI_1960_Freg21.eachLayer(function(layer){
            if(layer.feature.properties.P1960_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1960_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1960_Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 79;
    sliderAtivo = sliderPerEDI_1960_Freg21.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1960_Freg21);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1946 E 1960 2021 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1961 E 1980 por FREGUESIAS em 2021-----////

var minPerEDI_1980_Freg21 = 0;
var maxPerEDI_1980_Freg21 = 0;

function EstiloPerEDI_1980_Freg21(feature) {
    if( feature.properties.P1960_21 <= minPerEDI_1980_Freg21 || minPerEDI_1980_Freg21 === 0){
        minPerEDI_1980_Freg21 = feature.properties.P1960_21
    }
    if(feature.properties.P1960_21 >= maxPerEDI_1980_Freg21 ){
        maxPerEDI_1980_Freg21 = feature.properties.P1960_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI1980Freg(feature.properties.P1960_21)
    };
}
function apagarPerEDI_1980_Freg21(e) {
    PerEDI_1980_Freg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_1980_Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P1960_21 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_1980_Freg21,
    });
}
var PerEDI_1980_Freg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPerEDI_1980_Freg21,
    onEachFeature: onEachFeaturePerEDI_1980_Freg21
});
let slidePerEDI_1980_Freg21 = function(){
    var sliderPerEDI_1980_Freg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 80){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_1980_Freg21, {
        start: [minPerEDI_1980_Freg21, maxPerEDI_1980_Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_1980_Freg21,
            'max': maxPerEDI_1980_Freg21
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_1980_Freg21);
    inputNumberMax.setAttribute("value",maxPerEDI_1980_Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_1980_Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_1980_Freg21.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_1980_Freg21.noUiSlider.on('update',function(e){
        PerEDI_1980_Freg21.eachLayer(function(layer){
            if(layer.feature.properties.P1960_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1960_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_1980_Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 80;
    sliderAtivo = sliderPerEDI_1980_Freg21.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_1980_Freg21);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1961 E 1980 2021 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 1981 E 2000 por FREGUESIAS em 2021-----////

var minPerEDI_2000_Freg21 = 0;
var maxPerEDI_2000_Freg21 = 0;

function EstiloPerEDI_2000_Freg21(feature) {
    if( feature.properties.P2000_21 <= minPerEDI_2000_Freg21 || minPerEDI_2000_Freg21 === 0){
        minPerEDI_2000_Freg21 = feature.properties.P2000_21
    }
    if(feature.properties.P2000_21 >= maxPerEDI_2000_Freg21 ){
        maxPerEDI_2000_Freg21 = feature.properties.P2000_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI2000Freg(feature.properties.P2000_21)
    };
}
function apagarPerEDI_2000_Freg21(e) {
    PerEDI_2000_Freg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_2000_Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P2000_21 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_2000_Freg21,
    });
}
var PerEDI_2000_Freg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPerEDI_2000_Freg21,
    onEachFeature: onEachFeaturePerEDI_2000_Freg21
});
let slidePerEDI_2000_Freg21 = function(){
    var sliderPerEDI_2000_Freg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 81){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_2000_Freg21, {
        start: [minPerEDI_2000_Freg21, maxPerEDI_2000_Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_2000_Freg21,
            'max': maxPerEDI_2000_Freg21
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_2000_Freg21);
    inputNumberMax.setAttribute("value",maxPerEDI_2000_Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_2000_Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_2000_Freg21.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_2000_Freg21.noUiSlider.on('update',function(e){
        PerEDI_2000_Freg21.eachLayer(function(layer){
            if(layer.feature.properties.P2000_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P2000_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_2000_Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 81;
    sliderAtivo = sliderPerEDI_2000_Freg21.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_2000_Freg21);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 1981 E 2000 2021 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 2001 E 2010 por FREGUESIAS em 2021-----////

var minPerEDI_2010_Freg21 = 0;
var maxPerEDI_2010_Freg21 = 0;

function EstiloPerEDI_2010_Freg21(feature) {
    if( feature.properties.P2010_21 <= minPerEDI_2010_Freg21 || minPerEDI_2010_Freg21 === 0){
        minPerEDI_2010_Freg21 = feature.properties.P2010_21
    }
    if(feature.properties.P2010_21 >= maxPerEDI_2010_Freg21 ){
        maxPerEDI_2010_Freg21 = feature.properties.P2010_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI2010Freg(feature.properties.P2010_21)
    };
}
function apagarPerEDI_2010_Freg21(e) {
    PerEDI_2010_Freg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_2010_Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P2010_21 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_2010_Freg21,
    });
}
var PerEDI_2010_Freg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPerEDI_2010_Freg21,
    onEachFeature: onEachFeaturePerEDI_2010_Freg21
});
let slidePerEDI_2010_Freg21 = function(){
    var sliderPerEDI_2010_Freg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 82){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_2010_Freg21, {
        start: [minPerEDI_2010_Freg21, maxPerEDI_2010_Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_2010_Freg21,
            'max': maxPerEDI_2010_Freg21
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_2010_Freg21);
    inputNumberMax.setAttribute("value",maxPerEDI_2010_Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_2010_Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_2010_Freg21.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_2010_Freg21.noUiSlider.on('update',function(e){
        PerEDI_2010_Freg21.eachLayer(function(layer){
            if(layer.feature.properties.P2010_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P2010_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_2010_Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 82;
    sliderAtivo = sliderPerEDI_2010_Freg21.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_2010_Freg21);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 2001 E 2010 2021 FREGUESIA -------------- \\\\\\

//////////////////------- Percentagem EDIFICIOS ENTRE 2010 E 2020 por FREGUESIAS em 2021-----////

var minPerEDI_2020_Freg21 = 0;
var maxPerEDI_2020_Freg21 = 0;

function CorPerEDI2020Freg(d) {
    return d >= 8.06 ? '#8c0303' :
        d >= 6.87  ? '#de1f35' :
        d >= 4.88    ? '#ff5e6e' :
        d >= 2.89   ? '#f5b3be' :
        d >= 0.9   ? '#F2C572' :
                ''  ;
}
var legendaPerEDI2020Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + ' > 8.06' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 6.87 - 8.06' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 4.88 - 6.87' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 2.89 - 4.88' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.9 - 2.89' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEDI_2020_Freg21(feature) {
    if( feature.properties.P2020_21 <= minPerEDI_2020_Freg21 || minPerEDI_2020_Freg21 === 0){
        minPerEDI_2020_Freg21 = feature.properties.P2020_21
    }
    if(feature.properties.P2020_21 >= maxPerEDI_2020_Freg21 ){
        maxPerEDI_2020_Freg21 = feature.properties.P2020_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEDI2020Freg(feature.properties.P2020_21)
    };
}
function apagarPerEDI_2020_Freg21(e) {
    PerEDI_2020_Freg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEDI_2020_Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P2020_21 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEDI_2020_Freg21,
    });
}
var PerEDI_2020_Freg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPerEDI_2020_Freg21,
    onEachFeature: onEachFeaturePerEDI_2020_Freg21
});
let slidePerEDI_2020_Freg21 = function(){
    var sliderPerEDI_2020_Freg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 83){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEDI_2020_Freg21, {
        start: [minPerEDI_2020_Freg21, maxPerEDI_2020_Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEDI_2020_Freg21,
            'max': maxPerEDI_2020_Freg21
        },
        });
    inputNumberMin.setAttribute("value",minPerEDI_2020_Freg21);
    inputNumberMax.setAttribute("value",maxPerEDI_2020_Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEDI_2020_Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEDI_2020_Freg21.noUiSlider.set([null, this.value]);
    });

    sliderPerEDI_2020_Freg21.noUiSlider.on('update',function(e){
        PerEDI_2020_Freg21.eachLayer(function(layer){
            if(layer.feature.properties.P2020_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P2020_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEDI_2020_Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 83;
    sliderAtivo = sliderPerEDI_2020_Freg21.noUiSlider;
    $(slidersGeral).append(sliderPerEDI_2020_Freg21);
} 

/////////////////////////////// Fim da Percentagem de EDIFICIOS ENTRE 2011 E 2021 2021 FREGUESIA -------------- \\\\\\
///////////////////////////////////---------------- FIM DADOS RELATIVOS FREGUESIAS ---------\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ANTES DE 1919 ENTRE 2011 E 2001 FREGUESIAS -------------------////

var minVarEDI1919Freg_11 = 0;
var maxVarEDI1919Freg_11 = -99;

function CorVarEDI1919_11_01Freg(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -100   ? '#2288bf' :
                ''  ;
}

var legendaVarEDI1919_11_01Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos antes de 1919, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEDI1919Freg_11(feature) {
    if(feature.properties.Var1919_11 <= minVarEDI1919Freg_11){
        minVarEDI1919Freg_11 = feature.properties.Var1919_11
    }
    if(feature.properties.Var1919_11 > maxVarEDI1919Freg_11){
        maxVarEDI1919Freg_11 = feature.properties.Var1919_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI1919_11_01Freg(feature.properties.Var1919_11)};
    }


function apagarVarEDI1919Freg_11(e) {
    VarEDI1919Freg_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI1919Freg_11(feature, layer) {
    if(feature.properties.Var1919_11 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1919_11.toFixed(2) + '</b>' + '%').openPopup()
    }     layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI1919Freg_11,
    });
}
var VarEDI1919Freg_11= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarEDI1919Freg_11,
    onEachFeature: onEachFeatureVarEDI1919Freg_11
});

let slideVarEDI1919Freg_11 = function(){
    var sliderVarEDI1919Freg_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 84){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI1919Freg_11, {
        start: [minVarEDI1919Freg_11, maxVarEDI1919Freg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI1919Freg_11,
            'max': maxVarEDI1919Freg_11
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI1919Freg_11);
    inputNumberMax.setAttribute("value",maxVarEDI1919Freg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI1919Freg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI1919Freg_11.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI1919Freg_11.noUiSlider.on('update',function(e){
        VarEDI1919Freg_11.eachLayer(function(layer){
            if(layer.feature.properties.Var1919_11 == null){
                return false
            }
            if(layer.feature.properties.Var1919_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1919_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI1919Freg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 84;
    sliderAtivo = sliderVarEDI1919Freg_11.noUiSlider;
    $(slidersGeral).append(sliderVarEDI1919Freg_11);
} 

///////////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ANTES DE 1919 ENTRE 2011 E 2001 FREGUESIAS ----- \\\\\\

/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ENTRE 1919 E 1945, ENTRE 2011 E 2001 FREGUESIAS -------------------////

var minVarEDI1945Freg_11 = 0;
var maxVarEDI1945Freg_11 = -99;

function CorVarEDI1945_11_01Freg(d) {
    return d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -100   ? '#2288bf' :
                ''  ;
}

var legendaVarEDI1945_11_01Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos entre 1919 e 1945, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEDI1945Freg_11(feature) {
    if(feature.properties.Var1945_11 <= minVarEDI1945Freg_11){
        minVarEDI1945Freg_11 = feature.properties.Var1945_11
    }
    if(feature.properties.Var1945_11 > maxVarEDI1945Freg_11){
        maxVarEDI1945Freg_11 = feature.properties.Var1945_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI1945_11_01Freg(feature.properties.Var1945_11)};
    }


function apagarVarEDI1945Freg_11(e) {
    VarEDI1945Freg_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI1945Freg_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1945_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI1945Freg_11,
    });
}
var VarEDI1945Freg_11= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarEDI1945Freg_11,
    onEachFeature: onEachFeatureVarEDI1945Freg_11
});

let slideVarEDI1945Freg_11 = function(){
    var sliderVarEDI1945Freg_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 85){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI1945Freg_11, {
        start: [minVarEDI1945Freg_11, maxVarEDI1945Freg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI1945Freg_11,
            'max': maxVarEDI1945Freg_11
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI1945Freg_11);
    inputNumberMax.setAttribute("value",maxVarEDI1945Freg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI1945Freg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI1945Freg_11.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI1945Freg_11.noUiSlider.on('update',function(e){
        VarEDI1945Freg_11.eachLayer(function(layer){
            if(layer.feature.properties.Var1945_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1945_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI1945Freg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 85;
    sliderAtivo = sliderVarEDI1945Freg_11.noUiSlider;
    $(slidersGeral).append(sliderVarEDI1945Freg_11);
} 

/////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ENTRE 1919 E 1945, ENTRE 2011 E 2001 FREGUESIAS ----- \\\\\\

/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ENTRE 1946 E 1960, ENTRE 2011 E 2001 FREGUESIAS -------------------////

var minVarEDI1960Freg_11 = 0;
var maxVarEDI1960Freg_11 = -99;

function CorVarEDI1960_11_01Freg(d) {
    return d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -90.17   ? '#2288bf' :
                ''  ;
}

var legendaVarEDI1960_11_01Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos entre 1946 e 1960, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -90.16 a -50' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEDI1960Freg_11(feature) {
    if(feature.properties.Var_1960_11 <= minVarEDI1960Freg_11){
        minVarEDI1960Freg_11 = feature.properties.Var_1960_11
    }
    if(feature.properties.Var_1960_11 > maxVarEDI1960Freg_11){
        maxVarEDI1960Freg_11 = feature.properties.Var_1960_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI1960_11_01Freg(feature.properties.Var_1960_11)};
    }


function apagarVarEDI1960Freg_11(e) {
    VarEDI1960Freg_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI1960Freg_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_1960_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI1960Freg_11,
    });
}
var VarEDI1960Freg_11= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarEDI1960Freg_11,
    onEachFeature: onEachFeatureVarEDI1960Freg_11
});

let slideVarEDI1960Freg_11 = function(){
    var sliderVarEDI1960Freg_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 86){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI1960Freg_11, {
        start: [minVarEDI1960Freg_11, maxVarEDI1960Freg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI1960Freg_11,
            'max': maxVarEDI1960Freg_11
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI1960Freg_11);
    inputNumberMax.setAttribute("value",maxVarEDI1960Freg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI1960Freg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI1960Freg_11.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI1960Freg_11.noUiSlider.on('update',function(e){
        VarEDI1960Freg_11.eachLayer(function(layer){
            if(layer.feature.properties.Var_1960_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var_1960_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI1960Freg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 86;
    sliderAtivo = sliderVarEDI1960Freg_11.noUiSlider;
    $(slidersGeral).append(sliderVarEDI1960Freg_11);
} 

/////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ENTRE 1946 E 1960, ENTRE 2011 E 2001 FREGUESIAS ----- \\\\\\


/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ENTRE 1961 E 1980, ENTRE 2011 E 2001 FREGUESIAS -------------------////

var minVarEDI1980Freg_11 = 0;
var maxVarEDI1980Freg_11 = -99;

function CorVarEDI1980_11_01Freg(d) {
    return d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -90.54   ? '#2288bf' :
                ''  ;
}

var legendaVarEDI1980_11_01Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos entre 1961 e 1980, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -90.53 a -50' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEDI1980Freg_11(feature) {
    if(feature.properties.Var_1980_11 <= minVarEDI1980Freg_11){
        minVarEDI1980Freg_11 = feature.properties.Var_1980_11
    }
    if(feature.properties.Var_1980_11 > maxVarEDI1980Freg_11){
        maxVarEDI1980Freg_11 = feature.properties.Var_1980_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI1980_11_01Freg(feature.properties.Var_1980_11)};
    }


function apagarVarEDI1980Freg_11(e) {
    VarEDI1980Freg_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI1980Freg_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_1980_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI1980Freg_11,
    });
}
var VarEDI1980Freg_11= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarEDI1980Freg_11,
    onEachFeature: onEachFeatureVarEDI1980Freg_11
});

let slideVarEDI1980Freg_11 = function(){
    var sliderVarEDI1980Freg_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 87){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI1980Freg_11, {
        start: [minVarEDI1980Freg_11, maxVarEDI1980Freg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI1980Freg_11,
            'max': maxVarEDI1980Freg_11
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI1980Freg_11);
    inputNumberMax.setAttribute("value",maxVarEDI1980Freg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI1980Freg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI1980Freg_11.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI1980Freg_11.noUiSlider.on('update',function(e){
        VarEDI1980Freg_11.eachLayer(function(layer){
            if(layer.feature.properties.Var_1980_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var_1980_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI1980Freg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 87;
    sliderAtivo = sliderVarEDI1980Freg_11.noUiSlider;
    $(slidersGeral).append(sliderVarEDI1980Freg_11);
} 

/////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ENTRE 1961 E 1980, ENTRE 2011 E 2001 FREGUESIAS ----- \\\\\\

/////////////////////////////------- Variação de EDIFICIOS CONSTRUIDOS ENTRE 1981 E 2000, ENTRE 2011 E 2001 FREGUESIAS -------------------////

var minVarEDI2000Freg_11 = 0;
var maxVarEDI2000Freg_11 = -99;


function CorVarEDI2000_11_01Freg(d) {
    return d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -20  ? '#9eaad7' :
        d >= -40  ? '#2288bf' :
        d >= -84.01   ? '#155273' :
                ''  ;
}

var legendaVarEDI2000_11_01Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios construídos entre 1981 e 2000, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -20 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -40 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -84 a -40' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEDI2000Freg_11(feature) {
    if(feature.properties.Var_2000_11 <= minVarEDI2000Freg_11){
        minVarEDI2000Freg_11 = feature.properties.Var_2000_11
    }
    if(feature.properties.Var_2000_11 > maxVarEDI2000Freg_11){
        maxVarEDI2000Freg_11 = feature.properties.Var_2000_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEDI2000_11_01Freg(feature.properties.Var_2000_11)};
    }


function apagarVarEDI2000Freg_11(e) {
    VarEDI2000Freg_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEDI2000Freg_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_2000_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEDI2000Freg_11,
    });
}
var VarEDI2000Freg_11= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarEDI2000Freg_11,
    onEachFeature: onEachFeatureVarEDI2000Freg_11
});

let slideVarEDI2000Freg_11 = function(){
    var sliderVarEDI2000Freg_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 88){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEDI2000Freg_11, {
        start: [minVarEDI2000Freg_11, maxVarEDI2000Freg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEDI2000Freg_11,
            'max': maxVarEDI2000Freg_11
        },
        });
    inputNumberMin.setAttribute("value",minVarEDI2000Freg_11);
    inputNumberMax.setAttribute("value",maxVarEDI2000Freg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEDI2000Freg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEDI2000Freg_11.noUiSlider.set([null, this.value]);
    });

    sliderVarEDI2000Freg_11.noUiSlider.on('update',function(e){
        VarEDI2000Freg_11.eachLayer(function(layer){
            if(layer.feature.properties.Var_2000_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var_2000_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEDI2000Freg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 88;
    sliderAtivo = sliderVarEDI2000Freg_11.noUiSlider;
    $(slidersGeral).append(sliderVarEDI2000Freg_11);
} 

/////////////////////// Fim da Variação de EDIFICIOS CONSTRUIDOS ENTRE 1981 E 2000, ENTRE 2011 E 2001 FREGUESIAS ----- \\\\\\



var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Recenseamento da população e habitação';

/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = Edifi1919Conc_01;
//// dizer qual a base (Contornos Concelhos/Freguesias) ativa
let baseAtiva = contorno;
let novaLayer = function(layer){

    if(layerAtiva != null){
		map.eachLayer(function(){
			map.removeLayer(layerAtiva);
		});
	}

    if(baseAtiva != null){
		map.eachLayer(function(){
			map.removeLayer(baseAtiva);
		});
	} 
    if (layer == Edifi1919Conc_01 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos antes de 1919, em 2001, por concelho.' + '</strong>');
        legenda(maxEdifi1919Conc_01, ((maxEdifi1919Conc_01-minEdifi1919Conc_01)/2).toFixed(0),minEdifi1919Conc_01,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi1919Conc_01();
        naoDuplicar = 1;
    }
    if (layer == Edifi1919Conc_01 && naoDuplicar == 1){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos antes de 1919, em 2001, por concelho.' + '</strong>');
        contorno.addTo(map);
    } 
    if (layer == Edifi1945Conc_01 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1919 e 1945, em 2001, por concelho.' + '</strong>');
        legenda(maxEdifi1945Conc_01, ((maxEdifi1945Conc_01-minEdifi1945Conc_01)/2).toFixed(0),minEdifi1945Conc_01,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi1945Conc_01();
        naoDuplicar = 2;
    }
    if (layer == Edifi1960Conc_01 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1946 e 1960, em 2001, por concelho.' + '</strong>');
        legenda(maxEdifi1960Conc_01, ((maxEdifi1960Conc_01-minEdifi1960Conc_01)/2).toFixed(0),minEdifi1960Conc_01,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi1960Conc_01();
        naoDuplicar = 3;
    }
    if (layer == Edifi1980Conc_01 && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1961 e 1980, em 2001, por concelho.' + '</strong>');
        legenda(maxEdifi1980Conc_01, ((maxEdifi1980Conc_01-minEdifi1980Conc_01)/2).toFixed(0),minEdifi1980Conc_01,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi1980Conc_01();
        naoDuplicar = 4;
    }
    if (layer == Edifi2000Conc_01 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1981 e 2000, em 2001, por concelho.' + '</strong>');
        legenda(maxEdifi2000Conc_01, ((maxEdifi2000Conc_01-minEdifi2000Conc_01)/2).toFixed(0),minEdifi2000Conc_01,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi2000Conc_01();
        naoDuplicar = 5;
    }
    if (layer == Edifi1919Conc_11 && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos antes de 1919, em 2011, por concelho.' + '</strong>');
        legenda(maxEdifi1919Conc_11, ((maxEdifi1919Conc_11-minEdifi1919Conc_11)/2).toFixed(0),minEdifi1919Conc_11,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi1919Conc_11();
        naoDuplicar = 6;
    }
    if (layer == Edifi1945Conc_11 && naoDuplicar != 7){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1919 e 1945, em 2011, por concelho.' + '</strong>');
        legenda(maxEdifi1945Conc_11, ((maxEdifi1945Conc_11-minEdifi1945Conc_11)/2).toFixed(0),minEdifi1945Conc_11,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi1945Conc_11();
        naoDuplicar = 7;
    }
    if (layer == Edifi1960Conc_11 && naoDuplicar != 8){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1946 e 1960, em 2011, por concelho.' + '</strong>');
        legenda(maxEdifi1960Conc_11, ((maxEdifi1960Conc_11-minEdifi1960Conc_11)/2).toFixed(0),minEdifi1960Conc_11,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi1960Conc_11();
        naoDuplicar = 8;
    }
    if (layer == Edifi1980Conc_11 && naoDuplicar != 9){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1961 e 1980, em 2011, por concelho.' + '</strong>');
        legenda(maxEdifi1980Conc_11, ((maxEdifi1980Conc_11-minEdifi1980Conc_11)/2).toFixed(0),minEdifi1980Conc_11,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi1980Conc_11();
        naoDuplicar = 9;
    }
    if (layer == Edifi2000Conc_11 && naoDuplicar != 10){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1981 e 2000, em 2011, por concelho.' + '</strong>');
        legenda(maxEdifi2000Conc_11, ((maxEdifi2000Conc_11-minEdifi2000Conc_11)/2).toFixed(0),minEdifi2000Conc_11,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi2000Conc_11();
        naoDuplicar = 10;
    }
    if (layer == Edifi2010Conc_11 && naoDuplicar != 11){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 2001 e 2010, em 2011, por concelho.' + '</strong>');
        legenda(maxEdifi2010Conc_11, ((maxEdifi2010Conc_11-minEdifi2010Conc_11)/2).toFixed(0),minEdifi2010Conc_11,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi2010Conc_11();
        naoDuplicar = 11;
    }
    if (layer == Edifi1919Conc_21 && naoDuplicar != 12){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos antes de 1919, em 2021, por concelho.' + '</strong>');
        legenda(maxEdifi1919Conc_21, ((maxEdifi1919Conc_21-minEdifi1919Conc_21)/2).toFixed(0),minEdifi1919Conc_21,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi1919Conc_21();
        naoDuplicar = 12;
    }
    if (layer == Edifi1945Conc_21 && naoDuplicar != 13){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1919 e 1945, em 2021, por concelho.' + '</strong>');
        legenda(maxEdifi1945Conc_21, ((maxEdifi1945Conc_21-minEdifi1945Conc_21)/2).toFixed(0),minEdifi1945Conc_21,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi1945Conc_21();
        naoDuplicar = 13;
    }
    if (layer == Edifi1960Conc_21 && naoDuplicar != 14){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1946 e 1960, em 2021, por concelho.' + '</strong>');
        legenda(maxEdifi1960Conc_21, ((maxEdifi1960Conc_21-minEdifi1960Conc_21)/2).toFixed(0),minEdifi1960Conc_21,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi1960Conc_21();
        naoDuplicar = 14;
    }
    if (layer == Edifi1980Conc_21 && naoDuplicar != 15){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1961 e 1980, em 2021, por concelho.' + '</strong>');
        legenda(maxEdifi1980Conc_21, ((maxEdifi1980Conc_21-minEdifi1980Conc_21)/2).toFixed(0),minEdifi1980Conc_21,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi1980Conc_21();
        naoDuplicar = 15;
    }
    if (layer == Edifi2000Conc_21 && naoDuplicar != 16){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1981 e 2000, em 2021, por concelho.' + '</strong>');
        legenda(maxEdifi2000Conc_21, ((maxEdifi2000Conc_21-minEdifi2000Conc_21)/2).toFixed(0),minEdifi2000Conc_21,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi2000Conc_21();
        naoDuplicar = 16;
    }
    if (layer == Edifi2010Conc_21 && naoDuplicar != 17){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 2001 e 2010, em 2021, por concelho.' + '</strong>');
        legenda(maxEdifi2010Conc_21, ((maxEdifi2010Conc_21-minEdifi2010Conc_21)/2).toFixed(0),minEdifi2010Conc_21,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi2010Conc_21();
        naoDuplicar = 17;
    }
    if (layer == Edifi2020Conc_21 && naoDuplicar != 18){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 2011 e 2021, em 2021, por concelho.' + '</strong>');
        legenda(maxEdifi2020Conc_21, ((maxEdifi2020Conc_21-minEdifi2020Conc_21)/2).toFixed(0),minEdifi2020Conc_21,0.3);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifi2020Conc_21();
        naoDuplicar = 18;
    }
    if (layer == PerEDI_1919_Conc01 && naoDuplicar != 19){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos antes de 1919, em 2001, por concelho.' + '</strong>');
        legendaPerEDI1919Conc();
        slidePerEDI_1919_Conc01();
        naoDuplicar = 19;
    }
    if (layer == PerEDI_1945_Conc01 && naoDuplicar != 20){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1919 e 1945, em 2001, por concelho.' + '</strong>');
        legendaPerEDI1945Conc();
        slidePerEDI_1945_Conc01();
        naoDuplicar = 20;
    }
    if (layer == PerEDI_1960_Conc01 && naoDuplicar != 21){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1946 e 1960, em 2001, por concelho.' + '</strong>');
        legendaPerEDI1960Conc();
        slidePerEDI_1960_Conc01();
        naoDuplicar = 21;
    }
    if (layer == PerEDI_1980_Conc01 && naoDuplicar != 22){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1961 e 1980, em 2001, por concelho.' + '</strong>');
        legendaPerEDI1980Conc();
        slidePerEDI_1980_Conc01();
        naoDuplicar = 22;
    }
    if (layer == PerEDI_2000_Conc01 && naoDuplicar != 23){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1981 e 2000, em 2001, por concelho.' + '</strong>');
        legendaPerEDI2000Conc();
        slidePerEDI_2000_Conc01();
        naoDuplicar = 23;
    }
    if (layer == PerEDI_1919_Conc11 && naoDuplicar != 24){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos antes de 1919, em 2011, por concelho.' + '</strong>');
        legendaPerEDI1919Conc();
        slidePerEDI_1919_Conc11();
        naoDuplicar = 24;
    }
    if (layer == PerEDI_1945_Conc11 && naoDuplicar != 25){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1919 e 1945, em 2011, por concelho.' + '</strong>');
        legendaPerEDI1945Conc();
        slidePerEDI_1945_Conc11();
        naoDuplicar = 25;
    }
    if (layer == PerEDI_1960_Conc11 && naoDuplicar != 26){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1946 e 1960, em 2011, por concelho.' + '</strong>');
        legendaPerEDI1960Conc();
        slidePerEDI_1960_Conc11();
        naoDuplicar = 26;
    }
    if (layer == PerEDI_1980_Conc11 && naoDuplicar != 27){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1961 e 1980, em 2011, por concelho.' + '</strong>');
        legendaPerEDI1980Conc();
        slidePerEDI_1980_Conc11();
        naoDuplicar = 27;
    }
    if (layer == PerEDI_2000_Conc11 && naoDuplicar != 28){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1981 e 2000, em 2011, por concelho.' + '</strong>');
        legendaPerEDI2000Conc();
        slidePerEDI_2000_Conc11();
        naoDuplicar = 28;
    }
    if (layer == PerEDI_2010_Conc11 && naoDuplicar != 29){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 2001 e 2010, em 2011, por concelho.' + '</strong>');
        legendaPerEDI2010Conc();
        slidePerEDI_2010_Conc11();
        naoDuplicar = 29;
    }
    if (layer == PerEDI_1919_Conc21 && naoDuplicar != 30){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos antes de 1919, em 2021, por concelho.' + '</strong>');
        legendaPerEDI1919Conc();
        slidePerEDI_1919_Conc21();
        naoDuplicar = 30;
    }
    if (layer == PerEDI_1945_Conc21 && naoDuplicar != 31){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1919 e 1945, em 2021, por concelho.' + '</strong>');
        legendaPerEDI1945Conc();
        slidePerEDI_1945_Conc21();
        naoDuplicar = 31;
    }
    if (layer == PerEDI_1960_Conc21 && naoDuplicar != 32){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1946 e 1960, em 2021, por concelho.' + '</strong>');
        legendaPerEDI1960Conc();
        slidePerEDI_1960_Conc21();
        naoDuplicar = 32;
    }
    if (layer == PerEDI_1980_Conc21 && naoDuplicar != 33){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1961 e 1980, em 2021, por concelho.' + '</strong>');
        legendaPerEDI1980Conc();
        slidePerEDI_1980_Conc21();
        naoDuplicar = 33;
    }
    if (layer == PerEDI_2000_Conc21 && naoDuplicar != 34){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1981 e 2000, em 2021, por concelho.' + '</strong>');
        legendaPerEDI2000Conc();
        slidePerEDI_2000_Conc21();
        naoDuplicar = 34;
    }
    if (layer == PerEDI_2010_Conc21 && naoDuplicar != 35){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 2001 e 2010, em 2021, por concelho.' + '</strong>');
        legendaPerEDI2010Conc();
        slidePerEDI_2010_Conc21();
        naoDuplicar = 35;
    }
    if (layer == PerEDI_2020_Conc21 && naoDuplicar != 36){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 2011 e 2021, em 2021, por concelho.' + '</strong>');
        legendaPerEDI2020Conc();
        slidePerEDI_2020_Conc21();
        naoDuplicar = 36;
    }
    if (layer == VarEDI1919_11 && naoDuplicar != 37){
        legendaVarEDI1919_11_01Conc();
        slideVarEDI1919_11();
        naoDuplicar = 37;
    }
    if (layer == VarEDI1945_11 && naoDuplicar != 38){
        legendaVarEDI1945_11_01Conc();
        slideVarEDI1945_11();
        naoDuplicar = 38;
    }
    if (layer == VarEDI1960_11 && naoDuplicar != 39){
        legendaVarEDI1960_11_01Conc();
        slideVarEDI1960_11();
        naoDuplicar = 39;
    }
    if (layer == VarEDI1980_11 && naoDuplicar != 40){
        legendaVarEDI1980_11_01Conc();
        slideVarEDI1980_11();
        naoDuplicar = 40;
    }
    if (layer == VarEDI2000_11 && naoDuplicar != 41){
        legendaVarEDI2000_11_01Conc();
        slideVarEDI2000_11();
        naoDuplicar = 41;
    }
    if (layer == VarEDI1919_21 && naoDuplicar != 42){
        legendaVarEDI1919_21_11Conc();
        slideVarEDI1919_21();
        naoDuplicar = 42;
    }
    if (layer == VarEDI1945_21 && naoDuplicar != 43){
        legendaVarEDI1945_21_11Conc();
        slideVarEDI1945_21();
        naoDuplicar = 43;
    }
    if (layer == VarEDI1960_21 && naoDuplicar != 44){
        legendaVarEDI1960_21_11Conc();
        slideVarEDI1960_21();
        naoDuplicar = 44;
    }
    if (layer == VarEDI1980_21 && naoDuplicar != 45){
        legendaVarEDI1980_21_11Conc();
        slideVarEDI1980_21();
        naoDuplicar = 45;
    }
    if (layer == VarEDI2000_21 && naoDuplicar != 46){
        legendaVarEDI2000_21_11Conc();
        slideVarEDI2000_21();
        naoDuplicar = 46;
    }
    if (layer == VarEDI2010_21 && naoDuplicar != 47){
        legendaVarEDI2010_21_11Conc();
        slideVarEDI2010_21();
        naoDuplicar = 47;
    }    
    if (layer == Edifi1919Freg_01 && naoDuplicar != 48){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos antes de 1919, em 2001, por freguesia.' + '</strong>');
        legenda(maxEdifi1919Freg_01, ((maxEdifi1919Freg_01-minEdifi1919Freg_01)/2).toFixed(0),minEdifi1919Freg_01,0.35);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideEdifi1919Freg_01();
        naoDuplicar = 48;
    }
    if (layer == Edifi1919Freg_01 && naoDuplicar == 48){
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
    }
    if (layer == Edifi1945Freg_01 && naoDuplicar != 49){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1919 e 1945, em 2001, por concelho.' + '</strong>');
        legenda(maxEdifi1945Freg_01, ((maxEdifi1945Freg_01-minEdifi1945Freg_01)/2).toFixed(0),minEdifi1945Freg_01,0.35);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideEdifi1945Freg_01();
        naoDuplicar = 49;
    }
    if (layer == Edifi1960Freg_01 && naoDuplicar != 50){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1946 e 1960, em 2001, por concelho.' + '</strong>');
        legenda(maxEdifi1960Freg_01, ((maxEdifi1960Freg_01-minEdifi1960Freg_01)/2).toFixed(0),minEdifi1960Freg_01,0.35);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideEdifi1960Freg_01();
        naoDuplicar = 50;
    }
    if (layer == Edifi1980Freg_01 && naoDuplicar != 51){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1961 e 1980, em 2001, por freguesia.' + '</strong>');
        legenda(maxEdifi1980Freg_01, ((maxEdifi1980Freg_01-minEdifi1980Freg_01)/2).toFixed(0),minEdifi1980Freg_01,0.35);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideEdifi1980Freg_01();
        naoDuplicar = 51;
    }
    if (layer == Edifi2000Freg_01 && naoDuplicar != 52){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1981 e 2000, em 2001, por freguesia.' + '</strong>');
        legenda(maxEdifi2000Freg_01, ((maxEdifi2000Freg_01-minEdifi2000Freg_01)/2).toFixed(0),minEdifi2000Freg_01,0.35);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideEdifi2000Freg_01();
        naoDuplicar = 52;
    }
    if (layer == Edifi1919Freg_11 && naoDuplicar != 53){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos antes de 1919, em 2011, por concelho.' + '</strong>');
        legenda(maxEdifi1919Freg_11, ((maxEdifi1919Freg_11-minEdifi1919Freg_11)/2).toFixed(0),minEdifi1919Freg_11,0.35);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideEdifi1919Freg_11();
        naoDuplicar = 53;
    }
    if (layer == Edifi1945Freg_11 && naoDuplicar != 54){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1919 e 1945, em 2011, por concelho.' + '</strong>');
        legenda(maxEdifi1945Freg_11, ((maxEdifi1945Freg_11-minEdifi1945Freg_11)/2).toFixed(0),minEdifi1945Freg_11,0.35);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideEdifi1945Freg_11();
        naoDuplicar = 54;
    }
    if (layer == Edifi1960Freg_11 && naoDuplicar != 55){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1946 e 1960, em 2011, por concelho.' + '</strong>');
        legenda(maxEdifi1960Freg_11, ((maxEdifi1960Freg_11-minEdifi1960Freg_11)/2).toFixed(0),minEdifi1960Freg_11,0.35);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideEdifi1960Freg_11();
        naoDuplicar = 55;
    }
    if (layer == Edifi1980Freg_11 && naoDuplicar != 56){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1961 e 1980, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdifi1980Freg_11, ((maxEdifi1980Freg_11-minEdifi1980Freg_11)/2).toFixed(0),minEdifi1980Freg_11,0.35);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideEdifi1980Freg_11();
        naoDuplicar = 56;
    }
    if (layer == Edifi2000Freg_11 && naoDuplicar != 57){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1981 e 2000, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdifi2000Freg_11, ((maxEdifi2000Freg_11-minEdifi2000Freg_11)/2).toFixed(0),minEdifi2000Freg_11,0.35);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideEdifi2000Freg_11();
        naoDuplicar = 57;
    }
    if (layer == Edifi2010Freg_11 && naoDuplicar != 58){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 2001 e 2010, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdifi2010Freg_11, ((maxEdifi2010Freg_11-minEdifi2010Freg_11)/2).toFixed(0),minEdifi2010Freg_11,0.35);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideEdifi2010Freg_11();
        naoDuplicar = 58;
    }
    if (layer == Edifi1919Freg_21 && naoDuplicar != 59){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos antes de 1919, em 2021, por concelho.' + '</strong>');
        legenda(maxEdifi1919Freg_21, ((maxEdifi1919Freg_21-minEdifi1919Freg_21)/2).toFixed(0),minEdifi1919Freg_21,0.35);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideEdifi1919Freg_21();
        naoDuplicar = 59;
    }
    if (layer == Edifi1945Freg_21 && naoDuplicar != 60){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1919 e 1945, em 2021, por concelho.' + '</strong>');
        legenda(maxEdifi1945Freg_21, ((maxEdifi1945Freg_21-minEdifi1945Freg_21)/2).toFixed(0),minEdifi1945Freg_21,0.35);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideEdifi1945Freg_21();
        naoDuplicar = 60;
    }
    if (layer == Edifi1960Freg_21 && naoDuplicar != 61){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1946 e 1960, em 2021, por freguesia.' + '</strong>');
        legenda(maxEdifi1960Freg_21, ((maxEdifi1960Freg_21-minEdifi1960Freg_21)/2).toFixed(0),minEdifi1960Freg_21,0.35);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideEdifi1960Freg_21();
        naoDuplicar = 61;
    }
    if (layer == Edifi1980Freg_21 && naoDuplicar != 62){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1961 e 1980, em 2021, por freguesia.' + '</strong>');
        legenda(maxEdifi1980Freg_21, ((maxEdifi1980Freg_21-minEdifi1980Freg_21)/2).toFixed(0),minEdifi1980Freg_21,0.35);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideEdifi1980Freg_21();
        naoDuplicar = 62;
    }
    if (layer == Edifi2000Freg_21 && naoDuplicar != 63){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 1981 e 2000, em 2021, por freguesia.' + '</strong>');
        legenda(maxEdifi2000Freg_21, ((maxEdifi2000Freg_21-minEdifi2000Freg_21)/2).toFixed(0),minEdifi2000Freg_21,0.35);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideEdifi2000Freg_21();
        naoDuplicar = 63;
    }
    if (layer == Edifi2010Freg_21 && naoDuplicar != 64){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 2001 e 2010, em 2021, por freguesia.' + '</strong>');
        legenda(maxEdifi2010Freg_21, ((maxEdifi2010Freg_21-minEdifi2010Freg_21)/2).toFixed(0),minEdifi2010Freg_21,0.35);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideEdifi2010Freg_21();
        naoDuplicar = 64;
    }
    if (layer == Edifi2020Freg_21 && naoDuplicar != 65){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios construídos entre 2011 e 2021, em 2021, por freguesia.' + '</strong>');
        legenda(maxEdifi2010Freg_21, ((maxEdifi2010Freg_21-minEdifi2010Freg_21)/2).toFixed(0),minEdifi2010Freg_21,0.35);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideEdifi2020Freg_21();
        naoDuplicar = 65;
    }
    if (layer == PerEDI_1919_Freg01 && naoDuplicar != 66){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos antes de 1919, em 2001, por freguesia.' + '</strong>');
        legendaPerEDI1919Freg();
        slidePerEDI_1919_Freg01();
        naoDuplicar = 66;
    }
    if (layer == PerEDI_1945_Freg01 && naoDuplicar != 67){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1919 e 1945, em 2001, por freguesia.' + '</strong>');
        legendaPerEDI1945Freg();
        slidePerEDI_1945_Freg01();
        naoDuplicar = 67;
    }
    if (layer == PerEDI_1960_Freg01 && naoDuplicar != 68){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1946 e 1960, em 2001, por freguesia.' + '</strong>');
        legendaPerEDI1960Freg();
        slidePerEDI_1960_Freg01();
        naoDuplicar = 68;
    }
    if (layer == PerEDI_1980_Freg01 && naoDuplicar != 69){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1961 e 1980, em 2001, por freguesia.' + '</strong>');
        legendaPerEDI1980Freg();
        slidePerEDI_1980_Freg01();
        naoDuplicar = 69;
    }
    if (layer == PerEDI_2000_Freg01 && naoDuplicar != 70){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1981 e 2000, em 2001, por freguesia.' + '</strong>');
        legendaPerEDI2000Freg();
        slidePerEDI_2000_Freg01();
        naoDuplicar = 70;
    }
    if (layer == PerEDI_1919_Freg11 && naoDuplicar != 71){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos antes de 1919, em 2011, por freguesia.' + '</strong>');
        legendaPerEDI1919Freg();
        slidePerEDI_1919_Freg11();
        naoDuplicar = 71;
    }
    if (layer == PerEDI_1945_Freg11 && naoDuplicar != 72){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1919 e 1945, em 2011, por freguesia.' + '</strong>');
        legendaPerEDI1945Freg();
        slidePerEDI_1945_Freg11();
        naoDuplicar = 72;
    }
    if (layer == PerEDI_1960_Freg11 && naoDuplicar != 73){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1946 e 1960, em 2011, por freguesia.' + '</strong>');
        legendaPerEDI1960Freg();
        slidePerEDI_1960_Freg11();
        naoDuplicar = 73;
    }
    if (layer == PerEDI_1980_Freg11 && naoDuplicar != 74){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1961 e 1980, em 2011, por freguesia.' + '</strong>');
        legendaPerEDI1980Freg();
        slidePerEDI_1980_Freg11();
        naoDuplicar = 74;
    }
    if (layer == PerEDI_2000_Freg11 && naoDuplicar != 75){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1981 e 2000, em 2011, por freguesia.' + '</strong>');
        legendaPerEDI2000Freg();
        slidePerEDI_2000_Freg11();
        naoDuplicar = 75;
    }
    if (layer == PerEDI_2010_Freg11 && naoDuplicar != 76){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 2001 e 2010, em 2011, por freguesia.' + '</strong>');
        legendaPerEDI2010Freg();
        slidePerEDI_2010_Freg11();
        naoDuplicar = 76;
    }
    if (layer == PerEDI_1919_Freg21 && naoDuplicar != 77){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos antes de 1919, em 2021, por freguesia.' + '</strong>');
        legendaPerEDI1919Freg();
        slidePerEDI_1919_Freg21();
        naoDuplicar = 77;
    }
    if (layer == PerEDI_1945_Freg21 && naoDuplicar != 78){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1919 e 1945, em 2021, por freguesia.' + '</strong>');
        legendaPerEDI1945Freg();
        slidePerEDI_1945_Freg21();
        naoDuplicar = 78;
    }
    if (layer == PerEDI_1960_Freg21 && naoDuplicar != 79){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1946 e 1960, em 2021, por freguesia.' + '</strong>');
        legendaPerEDI1960Freg();
        slidePerEDI_1960_Freg21();
        naoDuplicar = 79;
    }
    if (layer == PerEDI_1980_Freg21 && naoDuplicar != 80){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1961 e 1980, em 2021, por freguesia.' + '</strong>');
        legendaPerEDI1980Freg();
        slidePerEDI_1980_Freg21();
        naoDuplicar = 80;
    }
    if (layer == PerEDI_2000_Freg21 && naoDuplicar != 81){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 1981 e 2000, em 2021, por freguesia.' + '</strong>');
        legendaPerEDI2000Freg();
        slidePerEDI_2000_Freg21();
        naoDuplicar = 81;
    }
    if (layer == PerEDI_2010_Freg21 && naoDuplicar != 82){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 2001 e 2010, em 2021, por freguesia.' + '</strong>');
        legendaPerEDI2010Freg();
        slidePerEDI_2010_Freg21();
        naoDuplicar = 82;
    }
    if (layer == PerEDI_2020_Freg21 && naoDuplicar != 83){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios construídos entre 2011 e 2021, em 2021, por freguesia.' + '</strong>');
        legendaPerEDI2020Freg();
        slidePerEDI_2020_Freg21();
        naoDuplicar = 83;
    }
    if (layer == VarEDI1919Freg_11 && naoDuplicar != 84){
        legendaVarEDI1919_11_01Freg();
        slideVarEDI1919Freg_11();
        naoDuplicar = 84;
    }
    if (layer == VarEDI1945Freg_11 && naoDuplicar != 85){
        legendaVarEDI1945_11_01Freg();
        slideVarEDI1945Freg_11();
        naoDuplicar = 85;
    }
    if (layer == VarEDI1960Freg_11 && naoDuplicar != 86){
        legendaVarEDI1960_11_01Freg();
        slideVarEDI1960Freg_11();
        naoDuplicar = 86;
    }
    if (layer == VarEDI1980Freg_11 && naoDuplicar != 87){
        legendaVarEDI1980_11_01Freg();
        slideVarEDI1980Freg_11();
        naoDuplicar = 87;
    }
    if (layer == VarEDI2000Freg_11 && naoDuplicar != 88){
        legendaVarEDI2000_11_01Freg();
        slideVarEDI2000Freg_11();
        naoDuplicar = 88;
    }
    layer.addTo(map);
    layerAtiva = layer;  
}
let notaRodape = function(){
    if ($('#notaRodape').length){
        $('#notaRodape').html("Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os <strong>dados à escala concelhia.</strong>")
    }
    else{
        $('#painel').append("<div id='notaRodape'></div>")
        $('#notaRodape').html("Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os <strong>dados à escala concelhia.</strong>")
    }
}
function mudarEscala(){
    reporAnos();
    primeirovalor('2001');
    tamanhoOutros();
    fonteTitulo('N');
}
let reporAnos = function(){
    if($('#absoluto').hasClass('active4') || $('#percentagem').hasClass('active4')){
        $('#mySelect')[0].options[0].innerHTML = "2001";
        if ($("#mySelect option[value='2011']").length == 0){
            $("#mySelect option").eq(0).after($("<option></option>").val("2011").text("2011"));
        }
        if ($("#mySelect option[value='2021']").length == 0){
            $('#mySelect')[0].options[1].innerHTML = "2011";
            $('#mySelect').append("<option value='2021'>2021</option>");
        }
    }
    if($('#absoluto').hasClass('active5') || $('#percentagem').hasClass('active5')){
        $('#mySelect')[0].options[0].innerHTML = "2001";
        if ($("#mySelect option[value='2011']").length == 0){
            $('#mySelect').append("<option value='2011'>2011</option>");
        }
        else{
            $('#mySelect')[0].options[1].innerHTML = "2011";
        }
    }
    if($('#taxaVariacao').hasClass('active4') || $('#taxaVariacao').hasClass('active5')){
        if ($("#mySelect option[value='2021']").length > 0){
            $("#mySelect option[value='2021']").remove();
            $('#mySelect')[0].options[0].innerHTML = "2011 - 2001";
            $('#mySelect')[0].options[1].innerHTML = "2021 - 2011";
        }
        if($('#taxaVariacao').hasClass('active5')){
            if ($("#mySelect option[value='2011']").length > 0){
                $("#mySelect option[value='2011']").remove();
                $('#mySelect')[0].options[0].innerHTML = "2011 - 2001";
            }   
        }
    }
}
function opcoesEpocaConstrucao(){
    var epocaConstrucao = document.getElementById("opcaoSelect").value;
    var anoSelecionado = document.getElementById("mySelect").value;
    if (anoSelecionado == "2001"){
        if ($("#opcaoSelect option[value='2010']").length > 0 || $("#opcaoSelect option[value='2021']").length > 0){
            $("#opcaoSelect option[value='2021']").remove()
            $("#opcaoSelect option[value='2010']").remove()
        }
    }
    if (anoSelecionado == "2011"){
        if ($("#opcaoSelect option[value='2010']").length > 0 && $("#opcaoSelect option[value='2021']").length > 0){
            $("#opcaoSelect option[value='2021']").remove();
        }
        if ($("#opcaoSelect option[value='2010']").length == 0){
            $('#opcaoSelect').append("<option value='2010'>Entre 2001 e 2010</option>");
        }   
    }
    if (anoSelecionado == "2021"){
        if ($("#opcaoSelect option[value='2010']").length == 0 && $("#opcaoSelect option[value='2021']").length == 0){
            $('#opcaoSelect').append("<option value='2010'>Entre 2001 e 2010</option>");
            $('#opcaoSelect').append("<option value='2021'>Entre 2011 e 2021</option>");
        }
        if ($("#opcaoSelect option[value='2010']").length > 0 && $("#opcaoSelect option[value='2021']").length == 0){
            $('#opcaoSelect').append("<option value='2021'>Entre 2011 e 2021</option>");
        }   
    }
    if (epocaConstrucao == "2010"){
        $("#mySelect option[value='2001']").remove()
    }
    if (epocaConstrucao == "2021"){
        $("#mySelect option[value='2001']").remove()
        $("#mySelect option[value='2011']").remove()
    }
    if($('#absoluto').hasClass('active4') || $('#absoluto').hasClass('active5') || $('#percentagem').hasClass('active4') || $('#percentagem').hasClass('active5')){
        if (((anoSelecionado == "2011"|| anoSelecionado == "2021") ) && ((epocaConstrucao == "1919" || epocaConstrucao == "1945" || epocaConstrucao == "1960" || epocaConstrucao == "1980" || epocaConstrucao == "2000"))){
            if ($("#mySelect option[value='2001']").length == 0){
                $("#mySelect option").eq(0).before($("<option></option>").val("2001").text("2001"));
            }
            if ($("#mySelect option[value='2011']").length == 0){
                $("#mySelect option").eq(1).before($("<option></option>").val("2011").text("2011"));
            }
        }
        if (anoSelecionado == "2021" && epocaConstrucao == "2010" ){
            if ($("#mySelect option[value='2011']").length == 0){
                $("#mySelect option").eq(0).before($("<option></option>").val("2011").text("2011"));
            }
        }
    }
    if($('#taxaVariacao').hasClass('active4') || $('#taxaVariacao').hasClass('active5')){
        if (((anoSelecionado == "2011"|| anoSelecionado == "2021") ) && ((epocaConstrucao == "1919" || epocaConstrucao == "1945" || epocaConstrucao == "1960" || epocaConstrucao == "1980" || epocaConstrucao == "2000"))){
            if ($("#mySelect option[value='2001']").length == 0){
                $("#mySelect option").eq(0).before($("<option></option>").val("2001").text("2011 - 2001"));
            }
        }
    }
}
function myFunction() {
    var epocaConstrucao = document.getElementById("opcaoSelect").value;
    var anoSelecionado = document.getElementById("mySelect").value;
    opcoesEpocaConstrucao();
    if ($('#concelho').hasClass('active2')){
        if($('#absoluto').hasClass('active4')){
            $('#notaRodape').remove();
            if (anoSelecionado == "2001" ){
                if (epocaConstrucao == "1919"){
                    novaLayer(Edifi1919Conc_01);
                    };
                if (epocaConstrucao == "1945"){
                    novaLayer(Edifi1945Conc_01);
                    };
                if (epocaConstrucao == "1960"){
                    novaLayer(Edifi1960Conc_01);
                    };
                if (epocaConstrucao == "1980"){
                    novaLayer(Edifi1980Conc_01);
                    };
                if (epocaConstrucao == "2000"){
                    novaLayer(Edifi2000Conc_01);
                };
            }
            if (anoSelecionado == "2011"){
                if (epocaConstrucao == "1919"){
                    novaLayer(Edifi1919Conc_11)
                }
                if (epocaConstrucao == "1945"){
                    novaLayer(Edifi1945Conc_11)
                }
                if (epocaConstrucao == "1960"){
                    novaLayer(Edifi1960Conc_11)
                }
                if (epocaConstrucao == "1980"){
                    novaLayer(Edifi1980Conc_11)
                }
                if (epocaConstrucao == "2000"){
                    novaLayer(Edifi2000Conc_11)
                }
                if (epocaConstrucao == "2010"){
                    novaLayer(Edifi2010Conc_11)
                }
            }
            if (anoSelecionado == "2021"){
                if (epocaConstrucao == "1919"){
                    novaLayer(Edifi1919Conc_21)
                }
                if (epocaConstrucao == "1945"){
                    novaLayer(Edifi1945Conc_21)
                }
                if (epocaConstrucao == "1960"){
                    novaLayer(Edifi1960Conc_21)
                }
                if (epocaConstrucao == "1980"){
                    novaLayer(Edifi1980Conc_21)
                }
                if (epocaConstrucao == "2000"){
                    novaLayer(Edifi2000Conc_21)
                }
                if (epocaConstrucao == "2010"){
                    novaLayer(Edifi2010Conc_21)
                }
                if (epocaConstrucao == "2021"){
                    novaLayer(Edifi2020Conc_21)
                }
            }
        }
        if($('#taxaVariacao').hasClass('active4')){
            if (anoSelecionado == "2001" ){
                if (epocaConstrucao == "1919"){
                    novaLayer(VarEDI1919_11);
                };
                if (epocaConstrucao == "1945"){
                    novaLayer(VarEDI1945_11);
                };
                if (epocaConstrucao == "1960"){
                    novaLayer(VarEDI1960_11);
                };
                if (epocaConstrucao == "1980"){
                    novaLayer(VarEDI1980_11);
                };
                if (epocaConstrucao == "2000"){
                    novaLayer(VarEDI2000_11);
                };
            }
            if (anoSelecionado == "2011"){
                if (epocaConstrucao == "1919"){
                    novaLayer(VarEDI1919_21)
                }
                if (epocaConstrucao == "1945"){
                    novaLayer(VarEDI1945_21)
                }
                if (epocaConstrucao == "1960"){
                    novaLayer(VarEDI1960_21)
                }
                if (epocaConstrucao == "1980"){
                    novaLayer(VarEDI1980_21)
                }
                if (epocaConstrucao == "2000"){
                    novaLayer(VarEDI2000_21)
                }
                if (epocaConstrucao == "2010"){
                    novaLayer(VarEDI2010_21)
                }
            }
        }
        if ($('#percentagem').hasClass('active4')){
            if (anoSelecionado == "2001" ){
                if (epocaConstrucao == "1919"){
                    novaLayer(PerEDI_1919_Conc01);
                };
                if (epocaConstrucao == "1945"){
                    novaLayer(PerEDI_1945_Conc01);
                }; 
                if (epocaConstrucao == "1960"){
                    novaLayer(PerEDI_1960_Conc01);
                };  
                if (epocaConstrucao == "1980"){
                    novaLayer(PerEDI_1980_Conc01);
                }; 
                if (epocaConstrucao == "2000"){
                    novaLayer(PerEDI_2000_Conc01);
                };   
            }
            if (anoSelecionado == "2011"){
                if (epocaConstrucao == "1919"){
                    novaLayer(PerEDI_1919_Conc11)
                }
                if (epocaConstrucao == "1945"){
                    novaLayer(PerEDI_1945_Conc11);
                }; 
                if (epocaConstrucao == "1960"){
                    novaLayer(PerEDI_1960_Conc11);
                };  
                if (epocaConstrucao == "1980"){
                    novaLayer(PerEDI_1980_Conc11);
                }; 
                if (epocaConstrucao == "2000"){
                    novaLayer(PerEDI_2000_Conc11);
                };
                if (epocaConstrucao == "2010"){
                    novaLayer(PerEDI_2010_Conc11);
                };    
            }
            if (anoSelecionado == "2021"){
                if (epocaConstrucao == "1919"){
                    novaLayer(PerEDI_1919_Conc21)
                }
                if (epocaConstrucao == "1945"){
                    novaLayer(PerEDI_1945_Conc21);
                }; 
                if (epocaConstrucao == "1960"){
                    novaLayer(PerEDI_1960_Conc21);
                };  
                if (epocaConstrucao == "1980"){
                    novaLayer(PerEDI_1980_Conc21);
                }; 
                if (epocaConstrucao == "2000"){
                    novaLayer(PerEDI_2000_Conc21);
                };
                if (epocaConstrucao == "2010"){
                    novaLayer(PerEDI_2010_Conc21);
                };
                if (epocaConstrucao == "2021"){
                    novaLayer(PerEDI_2020_Conc21);
                }; 
            }
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if($('#absoluto').hasClass('active5')){
            notaRodape();
            if (anoSelecionado == "2001" ){
                if (epocaConstrucao == "1919"){
                    novaLayer(Edifi1919Freg_01);
                    };
                if (epocaConstrucao == "1945"){
                    novaLayer(Edifi1945Freg_01);
                    };
                if (epocaConstrucao == "1960"){
                    novaLayer(Edifi1960Freg_01);
                    };
                if (epocaConstrucao == "1980"){
                    novaLayer(Edifi1980Freg_01);
                    };
                if (epocaConstrucao == "2000"){
                    novaLayer(Edifi2000Freg_01);
                };
            }
            if (anoSelecionado == "2011"){
                if (epocaConstrucao == "1919"){
                    novaLayer(Edifi1919Freg_11)
                }
                if (epocaConstrucao == "1945"){
                    novaLayer(Edifi1945Freg_11)
                }
                if (epocaConstrucao == "1960"){
                    novaLayer(Edifi1960Freg_11)
                }
                if (epocaConstrucao == "1980"){
                    novaLayer(Edifi1980Freg_11)
                }
                if (epocaConstrucao == "2000"){
                    novaLayer(Edifi2000Freg_11)
                }
                if (epocaConstrucao == "2010"){
                    novaLayer(Edifi2010Freg_11)
                }
            }
            if (anoSelecionado == "2021"){
                if (epocaConstrucao == "1919"){
                    novaLayer(Edifi1919Freg_21)
                }
                if (epocaConstrucao == "1945"){
                    novaLayer(Edifi1945Freg_21)
                }
                if (epocaConstrucao == "1960"){
                    novaLayer(Edifi1960Freg_21)
                }
                if (epocaConstrucao == "1980"){
                    novaLayer(Edifi1980Freg_21)
                }
                if (epocaConstrucao == "2000"){
                    novaLayer(Edifi2000Freg_21)
                }
                if (epocaConstrucao == "2010"){
                    novaLayer(Edifi2010Freg_21)
                }
                if (epocaConstrucao == "2021"){
                    novaLayer(Edifi2020Freg_21)
                }
            }

        }
        if($('#taxaVariacao').hasClass('active5')){
            $('#notaRodape').remove();
            if (anoSelecionado == "2001" ){
                if (epocaConstrucao == "1919"){
                    novaLayer(VarEDI1919Freg_11);
                };
                if (epocaConstrucao == "1945"){
                    novaLayer(VarEDI1945Freg_11);
                };
                if (epocaConstrucao == "1960"){
                    novaLayer(VarEDI1960Freg_11);
                };
                if (epocaConstrucao == "1980"){
                    novaLayer(VarEDI1980Freg_11);
                };
                if (epocaConstrucao == "2000"){
                    novaLayer(VarEDI2000Freg_11);
                };
            }
        }
        if($('#percentagem').hasClass('active5')){
            $('#notaRodape').remove();
            if (anoSelecionado == "2001" ){
                if (epocaConstrucao == "1919"){
                    novaLayer(PerEDI_1919_Freg01);
                };
                if (epocaConstrucao == "1945"){
                    novaLayer(PerEDI_1945_Freg01);
                }; 
                if (epocaConstrucao == "1960"){
                    novaLayer(PerEDI_1960_Freg01);
                };  
                if (epocaConstrucao == "1980"){
                    novaLayer(PerEDI_1980_Freg01);
                }; 
                if (epocaConstrucao == "2000"){
                    novaLayer(PerEDI_2000_Freg01);
                };   
            }
            if (anoSelecionado == "2011"){
                if (epocaConstrucao == "1919"){
                    novaLayer(PerEDI_1919_Freg11)
                }
                if (epocaConstrucao == "1945"){
                    novaLayer(PerEDI_1945_Freg11);
                }; 
                if (epocaConstrucao == "1960"){
                    novaLayer(PerEDI_1960_Freg11);
                };  
                if (epocaConstrucao == "1980"){
                    novaLayer(PerEDI_1980_Freg11);
                }; 
                if (epocaConstrucao == "2000"){
                    novaLayer(PerEDI_2000_Freg11);
                };
                if (epocaConstrucao == "2010"){
                    novaLayer(PerEDI_2010_Freg11);
                };    
            }
            if (anoSelecionado == "2021"){
                if (epocaConstrucao == "1919"){
                    novaLayer(PerEDI_1919_Freg21)
                }
                if (epocaConstrucao == "1945"){
                    novaLayer(PerEDI_1945_Freg21);
                }; 
                if (epocaConstrucao == "1960"){
                    novaLayer(PerEDI_1960_Freg21);
                };  
                if (epocaConstrucao == "1980"){
                    novaLayer(PerEDI_1980_Freg21);
                }; 
                if (epocaConstrucao == "2000"){
                    novaLayer(PerEDI_2000_Freg21);
                };
                if (epocaConstrucao == "2010"){
                    novaLayer(PerEDI_2010_Freg21);
                };
                if (epocaConstrucao == "2021"){
                    novaLayer(PerEDI_2020_Freg21);
                }; 
            }
        }
    }
}


let primeirovalor = function(ano){
    $("#mySelect").val(ano);
    $("#opcaoSelect").val('1919');
    
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}

$('#absoluto').click(function(){
    reporAnos();
    primeirovalor('2001');
    tamanhoOutros();
    fonteTitulo('N');
});
$('#percentagem').click(function(){
    reporAnos();
    primeirovalor('2001');
    tamanhoOutros();
    fonteTitulo('F');
});
$('#taxaVariacao').click(function(){
    reporAnos();
    primeirovalor('2001');
    tamanhoOutros();
    fonteTitulo('F');
});

let fonteTitulo = function(valor){
    if(valor == 'N'){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + 'INE, Recenseamento da população e habitação');
    }
    else{
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + 'Cálculos próprios; INE, Recenseamento da população e habitação');
    }
}


$('#freguesias').click(function(){
    variaveisMapaFreguesias();
});
$('#concelho').click(function(){
    variaveisMapaConcelho();
});
$('#mySelect').change(function(){
    myFunction();
})
$('#opcaoSelect').change(function(){
    myFunction();
})
let variaveisMapaConcelho = function(){
    if ($('#absoluto').hasClass('active4')){
        return false
    }
    else{
        $('#absoluto').attr('class',"butao active4");
        $('#taxaVariacao').attr('class',"butao");
        $('#percentagem').attr('class',"butao");
        mudarEscala();
    }

}

let variaveisMapaFreguesias = function(){
    if($('#absoluto').hasClass('active5')){
        return false;
    }
    else{
        $('#absoluto').attr('class',"butao active5");
        $('#taxaVariacao').attr('class',"butao");
        $('#percentagem').attr('class',"butao");
        mudarEscala();
    }
}
$('#opcaoFonte').click(function(){
    $('#mapa').css("width","60%");
    $('#mapDIV').css("visibility","hidden");
    $('#myDIV').css("visibility","hidden");
    $('#legendaA').css("visibility","hidden");
    $('#painelLegenda').css("visibility","hidden");
    $('#painel').css("visibility","hidden");
    $('#filtrar').css("visibility","hidden");
    $('#geralEscalas').css("visibility","hidden");
    $('#variavel').css("visibility","hidden");
    $('#temporal').css("visibility","hidden");
    $('#slidersGeral').css("visibility","hidden");
    $('#escalasConcelho').css("visibility","hidden");
    $('#tituloMapa').css("visibility","hidden");
    $('#escalasFreguesias').css("visibility","hidden");
    $('#tabela').css("visibility","hidden");
    $('#opcoesTabela').css("visibility","hidden");
    $('.ine').css("visibility","hidden");
    $('#opcaoFonte').css("visibility","hidden");
    $('#notaRodape').remove();
    $('#opcaoMapa').attr("class","btn");
    $('#opcaoTabela').attr("class","btn");

    $('#tabelaVariacao').attr("class","btn");
    $('#tabelaPercentagem').attr("class","btn");
    $('#tabelaDadosAbsolutos').attr("class","btn")
    $('#metaInformacao').css("visibility","visible");
    $('.btn').css("top","50%")
})

$('#opcaoMapa').click(function(){
    $('#mapa').css("width","60%");
    $('#painel').css("position","relative");
    $('#opcaoMapa').attr("class","btn active3");
    $('#opcaoFonte').css("visibility","visible");
    $('#mapDIV').css("visibility","visible");
    $('#myDIV').css("visibility","visible");
    $('#painelLegenda').css("visibility","visible");
    $('#tabela').css("visibility","hidden");
    $('#opcoesTabela').css("visibility","hidden");
    $('#metaInformacao').css("visibility","hidden");

    $('#filtrar').css("visibility","visible");
    $('#escalasConcelho').css("visibility","visible"); 
    $('#geralEscalas').css("visibility","visible");
    $('#legendaA').css("visibility","visible"); 
    $('#variavel').css("visibility","visible");
    $('#tituloMapa').css("visibility","visible");
    $('.ine').css("visibility","visible");

    $('#concelho').attr("class", "butaoEscala EscalasTerritoriais active2")
    $('#freguesias').attr("class", "butaoEscala EscalasTerritoriais")
    $('#absoluto').attr("class","butao active4");
    $('#percentagem').attr("class","butao");
    $('#taxaVariacao').attr("class","butao");

    $('#tabelaVariacao').attr("class","btn");
    $('#tabelaPercentagem').attr("class","btn");
    $('#tabelaDadosAbsolutos').attr("class","btn")
    $('#opcaoTabela').attr("class","btn");

    $('#temporal').css("visibility","visible");
    $('#slidersGeral').css("visibility","visible");
    $('.btn').css("top","50%");
    mudarEscala();
})

$('#opcaoTabela').click(function(){
    $('#mapa').css("width","100%");
    $('#painel').css("position","absolute");
    $('#opcaoTabela').attr("class","btn active3");
    $('#tabelaDadosAbsolutos').attr("class","btn active1");
    DadosAbsolutos();
    $('#opcaoMapa').attr("class","btn");
    $('#tabela').css("visibility","visible");
    $('#opcoesTabela').css("visibility","visible")
    $('#opcoesTabela').css("padding-top","10px")
    $('#tituloMapa').css("visibility","visible");
    $('.ine').css("visibility","visible");
    $('#opcaoFonte').css("visibility","visible");

    $('#absoluto').attr("class","butao");
    $('#percentagem').attr("class","butao");
    $('#taxaVariacao').attr("class","butao");

    $('#mapDIV').css("visibility","hidden");
    $('#myDIV').css("visibility","hidden");
    $('#legendaA').css("visibility","hidden");
    $('#painelLegenda').css("visibility","hidden");
    $('#painel').css("visibility","hidden");
    $('#filtrar').css("visibility","hidden");
    $('#geralEscalas').css("visibility","hidden");
    $('#variavel').css("visibility","hidden");
    $('#temporal').css("visibility","hidden");
    $('#slidersGeral').css("visibility","hidden");
    $('#escalasConcelho').css("visibility","hidden");
    $('#metaInformacao').css("visibility","hidden");
    $('#notaRodape').remove();

    $('#concelho').attr("class", "butaoEscala EscalasTerritoriais");
    $('#freguesias').attr('class',"butaoEscala EscalasTerritoriais");
    $('.btn').css("top","10%");

});
$('#tabelaDadosAbsolutos').click(function(){
    DadosAbsolutos();;   
});

function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }
var DadosAbsolutos = function(){
    $('#tituloMapa').html('Número de edifícios, por época de construção, entre 2001 e 2021, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EpocaConstrucaoProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html("2001")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.EpocaConstrucao == "2011 - 2021"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.EpocaConstrucao+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2011.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2021.toLocaleString("fr")+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.EpocaConstrucao+'</td>';
                    dados += '<td>'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td>'+value.DADOS2011.toLocaleString("fr")+'</td>';
                    dados += '<td>'+value.DADOS2021.toLocaleString("fr")+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})};

$('#tabelaPercentagem').click(function(){
    $('#tituloMapa').html('Proporção do número de edifícios, por época de construção, entre 2001 e 2021, %.');
        $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EpocaConstrucaoProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html("2001")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.EpocaConstrucao == "2011 - 2021"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.EpocaConstrucao+'</td>';
                    dados += '<td class="borderbottom">'+value.Per01+'</td>';
                    dados += '<td class="borderbottom">'+value.Per11+'</td>';
                    dados += '<td class="borderbottom">'+value.Per21+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.EpocaConstrucao+'</td>';
                    dados += '<td>'+value.Per01+'</td>';
                    dados += '<td>'+value.Per11+'</td>';
                    dados += '<td>'+value.Per21+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});

$('#tabelaVariacao').click(function(){  
    $('#tituloMapa').html('Variação do número de edifícios, por época de construção, entre 2001 e 2021, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EpocaConstrucaoProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.EpocaConstrucao == "2011 - 2021"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.EpocaConstrucao+'</td>';
                    dados += '<td class="borderbottom">'+ ''+'</td>';
                    dados += '<td class="borderbottom">'+value.VAR1101+'</td>';
                    dados += '<td class="borderbottom">'+value.VAR2111+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.EpocaConstrucao+'</td>';
                    dados += '<td>'+ ''+'</td>';
                    dados += '<td>'+value.VAR1101+'</td>';
                    dados += '<td>'+value.VAR2111+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});

let anosSelecionados = function() {
    var epocaConstrucao = document.getElementById("opcaoSelect").value;
    let anoSelecionado = document.getElementById("mySelect").value;
    if ($('#freguesias').hasClass("active2") || $('#concelho').hasClass("active2")){
        if (anoSelecionado != "2021"){
            i = 1
        }
        if (anoSelecionado == "2001"){
            i = 0;
        }
    }
    if ($('#taxaVariacao').hasClass("active4")){
        if (anoSelecionado != "2011"){
            i = 1
        }
        if (anoSelecionado == "2001"){
            i = 0;
        }
    }
    if (epocaConstrucao == "2010"){
        if (anoSelecionado == "2011"){
            i = 0;
        }
        if (anoSelecionado == "2021"){
            i = 1;
        }
    }
    
    
}
  
const opcoesAnos = $('#mySelect');      
$('#next').click(function(){
    anosSelecionados();
    if ($('#freguesias').hasClass("active2")){
        if (i !== $('#mySelect').children('option').length - 1) {
            opcoesAnos.find('option:selected').next().prop('selected', true);
            myFunction();
            i += 1
        }
        if(i === 0){
            return false
        }
    }
    if ($('#concelho').hasClass("active2")){
        if (i !== $('#mySelect').children('option').length - 1) {
            opcoesAnos.find('option:selected').next().prop('selected', true);
            myFunction();
            i += 1
        }
        if(i === 0){
            return false
        }
    }

});
$('#prev').click(function(){
    anosSelecionados();
    if (i !== 0) {
        opcoesAnos.find('option:selected').prev().prop('selected', true);
        myFunction();
        i -= 1
    }
    if ($('#freguesias').hasClass("active2")){
        if(i === $('#mySelect').children('option').length - 1){
            return false
        }
    }
    if($('#concelho').hasClass("active2")){
        if(i === $('#mySelect').children('option').length - 1){
            return false
        }
    }
})

$("#btnNext").click(function(e){ 
    e.preventDefault(); 
     }); 
$("#btnPrev").click(function(e){ 
    e.preventDefault(); 
     }); 

///// Alterar tamanho dos selects automaticamente 
const alterarTamanho = document.querySelector('select')

alterarTamanho.addEventListener('change', (event) => {
    let tempSelect = document.createElement('select'),
    tempOption = document.createElement('option');
     
    tempOption.textContent = event.target.options[event.target.selectedIndex].text;
    tempSelect.style.cssText += `
            visibility: hidden;
           position: fixed;
           `;
    tempSelect.appendChild(tempOption);
    event.target.after(tempSelect);
       
    const tempSelectWidth = tempSelect.getBoundingClientRect().width;
    event.target.style.width = `${tempSelectWidth +5}px`;
    tempSelect.remove();
});
     
alterarTamanho.dispatchEvent(new Event('change'));
