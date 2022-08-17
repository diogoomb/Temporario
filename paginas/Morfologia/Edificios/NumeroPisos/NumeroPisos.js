// $('#mapDIV').css("height", "85%");
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'

$('#temporal').css("padding-top","0px");
$('.ine').html('<strong>Fonte: </strong>INE, Recenseamento da população e habitação.');

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


//////////////////////-------------------------Orientação\\\\\\\\\\\\\\\\\\
var Orientacao = L.control({position: "topleft"});
Orientacao.onAdd = function(map) {
    var div = L.DomUtil.create("div", "north");
    div.innerHTML = '<img src="../../../../imagens/norte.png" alt="Orientação" height="40px" width="23px">';
    return div;
}
Orientacao.addTo(map)

//////----- CIRCULOS
function getRadius(area, multiplicao) {
    var radius = Math.sqrt(area / Math.PI);
    return radius * multiplicao;
};

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

let space = document.getElementById("space");
let opcoesTabela = document.getElementById('opcoesTabela');
let escalasConcelho = document.getElementById('escalasConcelho');
let myDIV = document.getElementById('myDIV');
let legendaA= document.getElementById('legendaA');
var ifSlide2isActive = 1;
let slidersGeral = document.getElementById('slidersGeral');
let inputNumberMin = document.getElementById('input-number-min');
let inputNumberMax = document.getElementById('input-number-max');
var sliderAtivo = null

///// --- Botões secundários (Concelho, Freguesia) ficarem ativos sempre que se clica \\\\\
var btns = myDIV.getElementsByClassName("butaoEscala EscalasTerritoriais ");
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
    var titulo = 'Número de edifícios'
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
var legenda = function(maximo,medio,minimo, multiplicador) {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'center'
    var symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Número de edifícios'
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


///////////////////////////----------------------- DADOS RELATIVOS, CONCELHO--------------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- 1 PISO  2001,Por Concelho ------------------------------\\\\\\\\\\\\\

var minPisos1Conc01 = 99999;
var maxPisos1Conc01 = 0;
function estiloPisos1Conc01(feature, latlng) {
    if(feature.properties.Edi_1P_01< minPisos1Conc01 || feature.properties.Edi_1P_01 ===0){
        minPisos1Conc01 = feature.properties.Edi_1P_01
    }
    if(feature.properties.Edi_1P_01> maxPisos1Conc01){
        maxPisos1Conc01 = feature.properties.Edi_1P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_1P_01,0.2)
    });
}
function apagarPisos1Conc01(e){
    var layer = e.target;
    Pisos1Conc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePisos1Conc01(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 1 piso: '  + '<b>'+ feature.properties.Edi_1P_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPisos1Conc01,
    })
};

var Pisos1Conc01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloPisos1Conc01,
    onEachFeature: onEachFeaturePisos1Conc01,
});

var slidePisos1Conc01 = function(){
    var sliderPisos1Conc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPisos1Conc01, {
        start: [minPisos1Conc01, maxPisos1Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPisos1Conc01,
            'max': maxPisos1Conc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPisos1Conc01);
    inputNumberMax.setAttribute("value",maxPisos1Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPisos1Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPisos1Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPisos1Conc01.noUiSlider.on('update',function(e){
        Pisos1Conc01.eachLayer(function(layer){
            if(layer.feature.properties.Edi_1P_01>=parseFloat(e[0])&& layer.feature.properties.Edi_1P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPisos1Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderPisos1Conc01.noUiSlider;
    $(slidersGeral).append(sliderPisos1Conc01);
}
contorno.addTo(map);
Pisos1Conc01.addTo(map);
$('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 piso, em 2001, por concelho.' + '</strong>');
legenda(maxPisos1Conc01, ((maxPisos1Conc01-minPisos1Conc01)/2).toFixed(0),minPisos1Conc01,0.2);
slidePisos1Conc01();
/////////////////////////////////// ---------Fim de EDIFICIOS COM 1 PISO Concelho -------------- \\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- 2 PISO  2001,Por Concelho ------------------------------\\\\\\\\\\\\\

var minPisos2Conc01 = 99999;
var maxPisos2Conc01 = 0;
function estiloPisos2Conc01(feature, latlng) {
    if(feature.properties.Edi_2P_01< minPisos2Conc01 || feature.properties.Edi_2P_01 ===0){
        minPisos2Conc01 = feature.properties.Edi_2P_01
    }
    if(feature.properties.Edi_2P_01> maxPisos2Conc01){
        maxPisos2Conc01 = feature.properties.Edi_2P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_2P_01,0.2)
    });
}
function apagarPisos2Conc01(e){
    var layer = e.target;
    Pisos2Conc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePisos2Conc01(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 2 pisos: '  + '<b>'+ feature.properties.Edi_2P_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPisos2Conc01,
    })
};

var Pisos2Conc01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloPisos2Conc01,
    onEachFeature: onEachFeaturePisos2Conc01,
});

var slidePisos2Conc01 = function(){
    var sliderPisos2Conc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPisos2Conc01, {
        start: [minPisos2Conc01, maxPisos2Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPisos2Conc01,
            'max': maxPisos2Conc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPisos2Conc01);
    inputNumberMax.setAttribute("value",maxPisos2Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPisos2Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPisos2Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPisos2Conc01.noUiSlider.on('update',function(e){
        Pisos2Conc01.eachLayer(function(layer){
            if(layer.feature.properties.Edi_2P_01>=parseFloat(e[0])&& layer.feature.properties.Edi_2P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPisos2Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderPisos2Conc01.noUiSlider;
    $(slidersGeral).append(sliderPisos2Conc01);
}


/////////////////////////////////// ---------Fim de EDIFICIOS COM 2 PISO Concelho -------------- \\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- 3 PISO  2001,Por Concelho ------------------------------\\\\\\\\\\\\\

var minPisos3Conc01 = 99999;
var maxPisos3Conc01 = 0;
function estiloPisos3Conc01(feature, latlng) {
    if(feature.properties.Edi_3P_01< minPisos3Conc01 || feature.properties.Edi_3P_01 ===0){
        minPisos3Conc01 = feature.properties.Edi_3P_01
    }
    if(feature.properties.Edi_3P_01> maxPisos3Conc01){
        maxPisos3Conc01 = feature.properties.Edi_3P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_3P_01,0.2)
    });
}
function apagarPisos3Conc01(e){
    var layer = e.target;
    Pisos3Conc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePisos3Conc01(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 3 pisos: '  + '<b>'+ feature.properties.Edi_3P_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPisos3Conc01,
    })
};

var Pisos3Conc01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloPisos3Conc01,
    onEachFeature: onEachFeaturePisos3Conc01,
});

var slidePisos3Conc01 = function(){
    var sliderPisos3Conc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPisos3Conc01, {
        start: [minPisos3Conc01, maxPisos3Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPisos3Conc01,
            'max': maxPisos3Conc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPisos3Conc01);
    inputNumberMax.setAttribute("value",maxPisos3Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPisos3Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPisos3Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPisos3Conc01.noUiSlider.on('update',function(e){
        Pisos3Conc01.eachLayer(function(layer){
            if(layer.feature.properties.Edi_3P_01>=parseFloat(e[0])&& layer.feature.properties.Edi_3P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPisos3Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderPisos3Conc01.noUiSlider;
    $(slidersGeral).append(sliderPisos3Conc01);
}


/////////////////////////////////// ---------Fim de EDIFICIOS COM 3 PISO Concelho -------------- \\\\\\\\\\\\\\\\\\\\

///////////////////////////////////----------- 4 PISO  2001,Por Concelho ------------------------------\\\\\\\\\\\\\

var minPisos4Conc01 = 99999;
var maxPisos4Conc01 = 0;
function estiloPisos4Conc01(feature, latlng) {
    if(feature.properties.Edi_4P_01< minPisos4Conc01 || feature.properties.Edi_4P_01 ===0){
        minPisos4Conc01 = feature.properties.Edi_4P_01
    }
    if(feature.properties.Edi_4P_01> maxPisos4Conc01){
        maxPisos4Conc01 = feature.properties.Edi_4P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_4P_01,0.2)
    });
}
function apagarPisos4Conc01(e){
    var layer = e.target;
    Pisos4Conc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePisos4Conc01(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 4 pisos: '  + '<b>'+ feature.properties.Edi_4P_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPisos4Conc01,
    })
};

var Pisos4Conc01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloPisos4Conc01,
    onEachFeature: onEachFeaturePisos4Conc01,
});

var slidePisos4Conc01 = function(){
    var sliderPisos4Conc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPisos4Conc01, {
        start: [minPisos4Conc01, maxPisos4Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPisos4Conc01,
            'max': maxPisos4Conc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPisos4Conc01);
    inputNumberMax.setAttribute("value",maxPisos4Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPisos4Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPisos4Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPisos4Conc01.noUiSlider.on('update',function(e){
        Pisos4Conc01.eachLayer(function(layer){
            if(layer.feature.properties.Edi_4P_01>=parseFloat(e[0])&& layer.feature.properties.Edi_4P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPisos4Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderPisos4Conc01.noUiSlider;
    $(slidersGeral).append(sliderPisos4Conc01);
}


/////////////////////////////////// ---------Fim de EDIFICIOS COM 4 PISO Concelho -------------- \\\\\\\\\\\\\\\\\\\\

///////////////////////////////////----------- 5 PISO  2001,Por Concelho ------------------------------\\\\\\\\\\\\\

var minPisos5Conc01 = 99999;
var maxPisos5Conc01 = 0;
function estiloPisos5Conc01(feature, latlng) {
    if(feature.properties.Edi_5P_01< minPisos5Conc01 || feature.properties.Edi_5P_01 ===0){
        minPisos5Conc01 = feature.properties.Edi_5P_01
    }
    if(feature.properties.Edi_5P_01> maxPisos5Conc01){
        maxPisos5Conc01 = feature.properties.Edi_5P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_5P_01,0.5)
    });
}
function apagarPisos5Conc01(e){
    var layer = e.target;
    Pisos5Conc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePisos5Conc01(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 5 pisos: '  + '<b>'+ feature.properties.Edi_5P_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPisos5Conc01,
    })
};

var Pisos5Conc01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloPisos5Conc01,
    onEachFeature: onEachFeaturePisos5Conc01,
});

var slidePisos5Conc01 = function(){
    var sliderPisos5Conc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPisos5Conc01, {
        start: [minPisos5Conc01, maxPisos5Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPisos5Conc01,
            'max': maxPisos5Conc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPisos5Conc01);
    inputNumberMax.setAttribute("value",maxPisos5Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPisos5Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPisos5Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPisos5Conc01.noUiSlider.on('update',function(e){
        Pisos5Conc01.eachLayer(function(layer){
            if(layer.feature.properties.Edi_5P_01>=parseFloat(e[0])&& layer.feature.properties.Edi_5P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPisos5Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderPisos5Conc01.noUiSlider;
    $(slidersGeral).append(sliderPisos5Conc01);
}


/////////////////////////////////// ---------Fim de EDIFICIOS COM 5 PISO Concelho -------------- \\\\\\\\\\\\\\\\\\\\

///////////////////////////////////----------- 6 PISO  2001,Por Concelho ------------------------------\\\\\\\\\\\\\

var minPisos6Conc01 = 99999;
var maxPisos6Conc01 = 0;
function estiloPisos6Conc01(feature, latlng) {
    if(feature.properties.Edi_6P_01< minPisos6Conc01 || feature.properties.Edi_6P_01 ===0){
        minPisos6Conc01 = feature.properties.Edi_6P_01
    }
    if(feature.properties.Edi_6P_01> maxPisos6Conc01){
        maxPisos6Conc01 = feature.properties.Edi_6P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_6P_01,0.5)
    });
}
function apagarPisos6Conc01(e){
    var layer = e.target;
    Pisos6Conc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePisos6Conc01(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 6 pisos: '  + '<b>'+ feature.properties.Edi_6P_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPisos6Conc01,
    })
};

var Pisos6Conc01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloPisos6Conc01,
    onEachFeature: onEachFeaturePisos6Conc01,
});

var slidePisos6Conc01 = function(){
    var sliderPisos6Conc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPisos6Conc01, {
        start: [minPisos6Conc01, maxPisos6Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPisos6Conc01,
            'max': maxPisos6Conc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPisos6Conc01);
    inputNumberMax.setAttribute("value",maxPisos6Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPisos6Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPisos6Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPisos6Conc01.noUiSlider.on('update',function(e){
        Pisos6Conc01.eachLayer(function(layer){
            if(layer.feature.properties.Edi_6P_01>=parseFloat(e[0])&& layer.feature.properties.Edi_6P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPisos6Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderPisos6Conc01.noUiSlider;
    $(slidersGeral).append(sliderPisos6Conc01);
}


/////////////////////////////////// ---------Fim de EDIFICIOS COM 6 PISO Concelho -------------- \\\\\\\\\\\\\\\\\\\\

///////////////////////////////////----------- 7 PISO  2001,Por Concelho ------------------------------\\\\\\\\\\\\\

var minPisos7Conc01 = 99999;
var maxPisos7Conc01 = 0;
function estiloPisos7Conc01(feature, latlng) {
    if(feature.properties.Edi_7P_01< minPisos7Conc01 || feature.properties.Edi_7P_01 ===0){
        minPisos7Conc01 = feature.properties.Edi_7P_01
    }
    if(feature.properties.Edi_7P_01> maxPisos7Conc01){
        maxPisos7Conc01 = feature.properties.Edi_7P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_7P_01,0.5)
    });
}
function apagarPisos7Conc01(e){
    var layer = e.target;
    Pisos7Conc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePisos7Conc01(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 7 pisos: '  + '<b>'+ feature.properties.Edi_7P_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPisos7Conc01,
    })
};

var Pisos7Conc01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloPisos7Conc01,
    onEachFeature: onEachFeaturePisos7Conc01,
});

var slidePisos7Conc01 = function(){
    var sliderPisos7Conc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPisos7Conc01, {
        start: [minPisos7Conc01, maxPisos7Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPisos7Conc01,
            'max': maxPisos7Conc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPisos7Conc01);
    inputNumberMax.setAttribute("value",maxPisos7Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPisos7Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPisos7Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPisos7Conc01.noUiSlider.on('update',function(e){
        Pisos7Conc01.eachLayer(function(layer){
            if(layer.feature.properties.Edi_7P_01>=parseFloat(e[0])&& layer.feature.properties.Edi_7P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPisos7Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderPisos7Conc01.noUiSlider;
    $(slidersGeral).append(sliderPisos7Conc01);
}


/////////////////////////////////// ---------Fim de EDIFICIOS COM 7 PISO Concelho -------------- \\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- 2 PISO  2011,Por Concelho ------------------------------\\\\\\\\\\\\\

var minPisos1Conc11 = 99999;
var maxPisos1Conc11 = 0;
function estiloPisos1Conc11(feature, latlng) {
    if(feature.properties.Edi_1P_11< minPisos1Conc11 || feature.properties.Edi_1P_11 ===0){
        minPisos1Conc11 = feature.properties.Edi_1P_11
    }
    if(feature.properties.Edi_1P_11> maxPisos1Conc11){
        maxPisos1Conc11 = feature.properties.Edi_1P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_1P_11,0.2)
    });
}
function apagarPisos1Conc11(e){
    var layer = e.target;
    Pisos1Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePisos1Conc11(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 1 piso: '  + '<b>'+ feature.properties.Edi_1P_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPisos1Conc11,
    })
};

var Pisos1Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloPisos1Conc11,
    onEachFeature: onEachFeaturePisos1Conc11,
});

var slidePisos1Conc11 = function(){
    var sliderPisos1Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPisos1Conc11, {
        start: [minPisos1Conc11, maxPisos1Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPisos1Conc11,
            'max': maxPisos1Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPisos1Conc11);
    inputNumberMax.setAttribute("value",maxPisos1Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPisos1Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPisos1Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPisos1Conc11.noUiSlider.on('update',function(e){
        Pisos1Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Edi_1P_11>=parseFloat(e[0])&& layer.feature.properties.Edi_1P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPisos1Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderPisos1Conc11.noUiSlider;
    $(slidersGeral).append(sliderPisos1Conc11);
}

/////////////////////////////////// ---------Fim de EDIFICIOS COM 1 PISO Concelho -------------- \\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- 2 PISO  2011,Por Concelho ------------------------------\\\\\\\\\\\\\

var minPisos2Conc11 = 99999;
var maxPisos2Conc11 = 0;
function estiloPisos2Conc11(feature, latlng) {
    if(feature.properties.Edi_2P_11< minPisos2Conc11 || feature.properties.Edi_2P_11 ===0){
        minPisos2Conc11 = feature.properties.Edi_2P_11
    }
    if(feature.properties.Edi_2P_11> maxPisos2Conc11){
        maxPisos2Conc11 = feature.properties.Edi_2P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_2P_11,0.2)
    });
}
function apagarPisos2Conc11(e){
    var layer = e.target;
    Pisos2Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePisos2Conc11(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 2 pisos: '  + '<b>'+ feature.properties.Edi_2P_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPisos2Conc11,
    })
};

var Pisos2Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloPisos2Conc11,
    onEachFeature: onEachFeaturePisos2Conc11,
});

var slidePisos2Conc11 = function(){
    var sliderPisos2Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPisos2Conc11, {
        start: [minPisos2Conc11, maxPisos2Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPisos2Conc11,
            'max': maxPisos2Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPisos2Conc11);
    inputNumberMax.setAttribute("value",maxPisos2Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPisos2Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPisos2Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPisos2Conc11.noUiSlider.on('update',function(e){
        Pisos2Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Edi_2P_11>=parseFloat(e[0])&& layer.feature.properties.Edi_2P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPisos2Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderPisos2Conc11.noUiSlider;
    $(slidersGeral).append(sliderPisos2Conc11);
}


/////////////////////////////////// ---------Fim de EDIFICIOS COM 2 PISO Concelho -------------- \\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- 3 PISO  2011,Por Concelho ------------------------------\\\\\\\\\\\\\

var minPisos3Conc11 = 99999;
var maxPisos3Conc11 = 0;
function estiloPisos3Conc11(feature, latlng) {
    if(feature.properties.Edi_3P_11< minPisos3Conc11 || feature.properties.Edi_3P_11 ===0){
        minPisos3Conc11 = feature.properties.Edi_3P_11
    }
    if(feature.properties.Edi_3P_11> maxPisos3Conc11){
        maxPisos3Conc11 = feature.properties.Edi_3P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_3P_11,0.2)
    });
}
function apagarPisos3Conc11(e){
    var layer = e.target;
    Pisos3Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePisos3Conc11(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 3 pisos: '  + '<b>'+ feature.properties.Edi_3P_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPisos3Conc11,
    })
};

var Pisos3Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloPisos3Conc11,
    onEachFeature: onEachFeaturePisos3Conc11,
});

var slidePisos3Conc11 = function(){
    var sliderPisos3Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPisos3Conc11, {
        start: [minPisos3Conc11, maxPisos3Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPisos3Conc11,
            'max': maxPisos3Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPisos3Conc11);
    inputNumberMax.setAttribute("value",maxPisos3Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPisos3Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPisos3Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPisos3Conc11.noUiSlider.on('update',function(e){
        Pisos3Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Edi_3P_11>=parseFloat(e[0])&& layer.feature.properties.Edi_3P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPisos3Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderPisos3Conc11.noUiSlider;
    $(slidersGeral).append(sliderPisos3Conc11);
}


/////////////////////////////////// ---------Fim de EDIFICIOS COM 3 PISO Concelho -------------- \\\\\\\\\\\\\\\\\\\\

///////////////////////////////////----------- 4 PISO  2011,Por Concelho ------------------------------\\\\\\\\\\\\\

var minPisos4Conc11 = 99999;
var maxPisos4Conc11 = 0;
function estiloPisos4Conc11(feature, latlng) {
    if(feature.properties.Edi_4P_11< minPisos4Conc11 || feature.properties.Edi_4P_11 ===0){
        minPisos4Conc11 = feature.properties.Edi_4P_11
    }
    if(feature.properties.Edi_4P_11> maxPisos4Conc11){
        maxPisos4Conc11 = feature.properties.Edi_4P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_4P_11,0.2)
    });
}
function apagarPisos4Conc11(e){
    var layer = e.target;
    Pisos4Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePisos4Conc11(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 4 pisos: '  + '<b>'+ feature.properties.Edi_4P_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPisos4Conc11,
    })
};

var Pisos4Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloPisos4Conc11,
    onEachFeature: onEachFeaturePisos4Conc11,
});

var slidePisos4Conc11 = function(){
    var sliderPisos4Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPisos4Conc11, {
        start: [minPisos4Conc11, maxPisos4Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPisos4Conc11,
            'max': maxPisos4Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPisos4Conc11);
    inputNumberMax.setAttribute("value",maxPisos4Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPisos4Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPisos4Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPisos4Conc11.noUiSlider.on('update',function(e){
        Pisos4Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Edi_4P_11>=parseFloat(e[0])&& layer.feature.properties.Edi_4P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPisos4Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderPisos4Conc11.noUiSlider;
    $(slidersGeral).append(sliderPisos4Conc11);
}


/////////////////////////////////// ---------Fim de EDIFICIOS COM 4 PISO Concelho -------------- \\\\\\\\\\\\\\\\\\\\

///////////////////////////////////----------- 5 PISO  2011,Por Concelho ------------------------------\\\\\\\\\\\\\

var minPisos5Conc11 = 99999;
var maxPisos5Conc11 = 0;
function estiloPisos5Conc11(feature, latlng) {
    if(feature.properties.Edi_5P_11< minPisos5Conc11 || feature.properties.Edi_5P_11 ===0){
        minPisos5Conc11 = feature.properties.Edi_5P_11
    }
    if(feature.properties.Edi_5P_11> maxPisos5Conc11){
        maxPisos5Conc11 = feature.properties.Edi_5P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_5P_11,0.5)
    });
}
function apagarPisos5Conc11(e){
    var layer = e.target;
    Pisos5Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePisos5Conc11(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 5 pisos: '  + '<b>'+ feature.properties.Edi_5P_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPisos5Conc11,
    })
};

var Pisos5Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloPisos5Conc11,
    onEachFeature: onEachFeaturePisos5Conc11,
});

var slidePisos5Conc11 = function(){
    var sliderPisos5Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPisos5Conc11, {
        start: [minPisos5Conc11, maxPisos5Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPisos5Conc11,
            'max': maxPisos5Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPisos5Conc11);
    inputNumberMax.setAttribute("value",maxPisos5Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPisos5Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPisos5Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPisos5Conc11.noUiSlider.on('update',function(e){
        Pisos5Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Edi_5P_11>=parseFloat(e[0])&& layer.feature.properties.Edi_5P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPisos5Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderPisos5Conc11.noUiSlider;
    $(slidersGeral).append(sliderPisos5Conc11);
}


/////////////////////////////////// ---------Fim de EDIFICIOS COM 5 PISO Concelho -------------- \\\\\\\\\\\\\\\\\\\\

///////////////////////////////////----------- 6 PISO  2011,Por Concelho ------------------------------\\\\\\\\\\\\\

var minPisos6Conc11 = 99999;
var maxPisos6Conc11 = 0;
function estiloPisos6Conc11(feature, latlng) {
    if(feature.properties.Edi_6P_11< minPisos6Conc11 || feature.properties.Edi_6P_11 ===0){
        minPisos6Conc11 = feature.properties.Edi_6P_11
    }
    if(feature.properties.Edi_6P_11> maxPisos6Conc11){
        maxPisos6Conc11 = feature.properties.Edi_6P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_6P_11,0.5)
    });
}
function apagarPisos6Conc11(e){
    var layer = e.target;
    Pisos6Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePisos6Conc11(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 6 pisos: '  + '<b>'+ feature.properties.Edi_6P_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPisos6Conc11,
    })
};

var Pisos6Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloPisos6Conc11,
    onEachFeature: onEachFeaturePisos6Conc11,
});

var slidePisos6Conc11 = function(){
    var sliderPisos6Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPisos6Conc11, {
        start: [minPisos6Conc11, maxPisos6Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPisos6Conc11,
            'max': maxPisos6Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPisos6Conc11);
    inputNumberMax.setAttribute("value",maxPisos6Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPisos6Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPisos6Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPisos6Conc11.noUiSlider.on('update',function(e){
        Pisos6Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Edi_6P_11>=parseFloat(e[0])&& layer.feature.properties.Edi_6P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPisos6Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderPisos6Conc11.noUiSlider;
    $(slidersGeral).append(sliderPisos6Conc11);
}


/////////////////////////////////// ---------Fim de EDIFICIOS COM 6 PISO Concelho -------------- \\\\\\\\\\\\\\\\\\\\

///////////////////////////////////----------- 7 PISO  2011,Por Concelho ------------------------------\\\\\\\\\\\\\

var minPisos7Conc11 = 99999;
var maxPisos7Conc11 = 0;
function estiloPisos7Conc11(feature, latlng) {
    if(feature.properties.Edi_7P_11< minPisos7Conc11 || feature.properties.Edi_7P_11 ===0){
        minPisos7Conc11 = feature.properties.Edi_7P_11
    }
    if(feature.properties.Edi_7P_11> maxPisos7Conc11){
        maxPisos7Conc11 = feature.properties.Edi_7P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_7P_11,0.5)
    });
}
function apagarPisos7Conc11(e){
    var layer = e.target;
    Pisos7Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePisos7Conc11(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 7 pisos: '  + '<b>'+ feature.properties.Edi_7P_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPisos7Conc11,
    })
};

var Pisos7Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloPisos7Conc11,
    onEachFeature: onEachFeaturePisos7Conc11,
});

var slidePisos7Conc11 = function(){
    var sliderPisos7Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPisos7Conc11, {
        start: [minPisos7Conc11, maxPisos7Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPisos7Conc11,
            'max': maxPisos7Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPisos7Conc11);
    inputNumberMax.setAttribute("value",maxPisos7Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPisos7Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPisos7Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPisos7Conc11.noUiSlider.on('update',function(e){
        Pisos7Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Edi_7P_11>=parseFloat(e[0])&& layer.feature.properties.Edi_7P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPisos7Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderPisos7Conc11.noUiSlider;
    $(slidersGeral).append(sliderPisos7Conc11);
}


/////////////////////////////////// ---------Fim de EDIFICIOS COM 7 PISO Concelho -------------- \\\\\\\\\\\\\\\\\\\\


/////////////////////////////------------------------ VARIAÇÕES -------------------------------\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação 1 PISO POR CONCELHOS -------------------////

var minVar1PisoConc = 99999;
var maxVar1PisoConc = 0;

function CorVar1PisoConc(d) {
    return d === null ? '#808080':
        d >= 25  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -22  ? '#2288bf' :
                ''  ;
}

var legendaVar1PisoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 1 piso, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -21.45 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1PisoConc(feature) {
    if(feature.properties.Var1P_1101 <= minVar1PisoConc){
        minVar1PisoConc = feature.properties.Var1P_1101
    }
    if(feature.properties.Var1P_1101 > maxVar1PisoConc){
        maxVar1PisoConc = feature.properties.Var1P_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1PisoConc(feature.properties.Var1P_1101)};
    }


function apagarVar1PisoConc(e) {
    Var1PisoConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1PisoConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1P_1101.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1PisoConc,
    });
}
var Var1PisoConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar1PisoConc,
    onEachFeature: onEachFeatureVar1PisoConc
});

let slideVar1PisoConc = function(){
    var sliderVar1PisoConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1PisoConc, {
        start: [minVar1PisoConc, maxVar1PisoConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1PisoConc,
            'max': maxVar1PisoConc
        },
        });
    inputNumberMin.setAttribute("value",minVar1PisoConc);
    inputNumberMax.setAttribute("value",maxVar1PisoConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1PisoConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1PisoConc.noUiSlider.set([null, this.value]);
    });

    sliderVar1PisoConc.noUiSlider.on('update',function(e){
        Var1PisoConc.eachLayer(function(layer){
            if(layer.feature.properties.Var1P_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1P_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1PisoConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderVar1PisoConc.noUiSlider;
    $(slidersGeral).append(sliderVar1PisoConc);
} 

///////////////////////////// Fim VARIAÇÃO 1 PISO POR CONCELHOS -------------- \\\\\


/////////////////////////////------- Variação 2 PISO POR CONCELHOS -------------------////

var minVar2PisoConc = 99999;
var maxVar2PisoConc = 0;

function CorVar2PisoConc(d) {
    return d === null ? '#808080':
        d >= 25  ? '#8c0303' :
        d >= 20  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -3  ? '#9eaad7' :
                ''  ;
}

var legendaVar2PisoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 2 pisos, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  20 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -2.66 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2PisoConc(feature) {
    if(feature.properties.Var2P_1101 <= minVar2PisoConc){
        minVar2PisoConc = feature.properties.Var2P_1101
    }
    if(feature.properties.Var2P_1101 > maxVar2PisoConc){
        maxVar2PisoConc = feature.properties.Var2P_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2PisoConc(feature.properties.Var2P_1101)};
    }


function apagarVar2PisoConc(e) {
    Var2PisoConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2PisoConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2P_1101.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2PisoConc,
    });
}
var Var2PisoConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2PisoConc,
    onEachFeature: onEachFeatureVar2PisoConc
});

let slideVar2PisoConc = function(){
    var sliderVar2PisoConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2PisoConc, {
        start: [minVar2PisoConc, maxVar2PisoConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2PisoConc,
            'max': maxVar2PisoConc
        },
        });
    inputNumberMin.setAttribute("value",minVar2PisoConc);
    inputNumberMax.setAttribute("value",maxVar2PisoConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2PisoConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2PisoConc.noUiSlider.set([null, this.value]);
    });

    sliderVar2PisoConc.noUiSlider.on('update',function(e){
        Var2PisoConc.eachLayer(function(layer){
            if(layer.feature.properties.Var2P_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2P_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2PisoConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderVar2PisoConc.noUiSlider;
    $(slidersGeral).append(sliderVar2PisoConc);
} 

///////////////////////////// Fim VARIAÇÃO 2 PISO POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 3 PISO POR CONCELHOS -------------------////

var minVar3PisoConc = 99999;
var maxVar3PisoConc = 0;

function CorVar3PisoConc(d) {
    return d === null ? '#808080':
        d >= 40  ? '#8c0303' :
        d >= 20  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -3  ? '#9eaad7' :
                ''  ;
}

var legendaVar3PisoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 3 pisos, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  20 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -2.23 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar3PisoConc(feature) {
    if(feature.properties.Var3P_1101 <= minVar3PisoConc){
        minVar3PisoConc = feature.properties.Var3P_1101
    }
    if(feature.properties.Var3P_1101 > maxVar3PisoConc){
        maxVar3PisoConc = feature.properties.Var3P_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3PisoConc(feature.properties.Var3P_1101)};
    }


function apagarVar3PisoConc(e) {
    Var3PisoConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3PisoConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3P_1101.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3PisoConc,
    });
}
var Var3PisoConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar3PisoConc,
    onEachFeature: onEachFeatureVar3PisoConc
});

let slideVar3PisoConc = function(){
    var sliderVar3PisoConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3PisoConc, {
        start: [minVar3PisoConc, maxVar3PisoConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3PisoConc,
            'max': maxVar3PisoConc
        },
        });
    inputNumberMin.setAttribute("value",minVar3PisoConc);
    inputNumberMax.setAttribute("value",maxVar3PisoConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3PisoConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3PisoConc.noUiSlider.set([null, this.value]);
    });

    sliderVar3PisoConc.noUiSlider.on('update',function(e){
        Var3PisoConc.eachLayer(function(layer){
            if(layer.feature.properties.Var3P_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3P_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3PisoConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderVar3PisoConc.noUiSlider;
    $(slidersGeral).append(sliderVar3PisoConc);
} 

///////////////////////////// Fim VARIAÇÃO 3 PISO POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 4 PISO POR CONCELHOS -------------------////

var minVar4PisoConc = 99999;
var maxVar4PisoConc = 0;

function CorVar4PisoConc(d) {
    return d === null ? '#808080':
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -37  ? '#2288bf' :
                ''  ;
}

var legendaVar4PisoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 4 pisos, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -36.51 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar4PisoConc(feature) {
    if(feature.properties.Var4P_1101 <= minVar4PisoConc || minVar4PisoConc === 0){
        minVar4PisoConc = feature.properties.Var4P_1101
    }
    if(feature.properties.Var4P_1101 > maxVar4PisoConc){
        maxVar4PisoConc = feature.properties.Var4P_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4PisoConc(feature.properties.Var4P_1101)};
    }


function apagarVar4PisoConc(e) {
    Var4PisoConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4PisoConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4P_1101.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4PisoConc,
    });
}
var Var4PisoConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar4PisoConc,
    onEachFeature: onEachFeatureVar4PisoConc
});

let slideVar4PisoConc = function(){
    var sliderVar4PisoConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4PisoConc, {
        start: [minVar4PisoConc, maxVar4PisoConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4PisoConc,
            'max': maxVar4PisoConc
        },
        });
    inputNumberMin.setAttribute("value",minVar4PisoConc);
    inputNumberMax.setAttribute("value",maxVar4PisoConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4PisoConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4PisoConc.noUiSlider.set([null, this.value]);
    });

    sliderVar4PisoConc.noUiSlider.on('update',function(e){
        Var4PisoConc.eachLayer(function(layer){
            if(layer.feature.properties.Var4P_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4P_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4PisoConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderVar4PisoConc.noUiSlider;
    $(slidersGeral).append(sliderVar4PisoConc);
} 

///////////////////////////// Fim VARIAÇÃO 4 PISO POR CONCELHOS -------------- \\\\\


/////////////////////////////------- Variação 5 PISO POR CONCELHOS -------------------////

var minVar5PisoConc = 99999;
var maxVar5PisoConc = 0;

function CorVar5PisoConc(d) {
    return d === null ? '#808080':
        d >= 60  ? '#de1f35' :
        d >= 30  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -37  ? '#2288bf' :
                ''  ;
}

var legendaVar5PisoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 5 pisos, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  30 a 60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -31.72 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar5PisoConc(feature) {
    if(feature.properties.Var5P_1101 <= minVar5PisoConc){
        minVar5PisoConc = feature.properties.Var5P_1101
    }
    if(feature.properties.Var5P_1101 > maxVar5PisoConc){
        maxVar5PisoConc = feature.properties.Var5P_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar5PisoConc(feature.properties.Var5P_1101)};
    }


function apagarVar5PisoConc(e) {
    Var5PisoConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar5PisoConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var5P_1101.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar5PisoConc,
    });
}
var Var5PisoConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar5PisoConc,
    onEachFeature: onEachFeatureVar5PisoConc
});

let slideVar5PisoConc = function(){
    var sliderVar5PisoConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar5PisoConc, {
        start: [minVar5PisoConc, maxVar5PisoConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar5PisoConc,
            'max': maxVar5PisoConc
        },
        });
    inputNumberMin.setAttribute("value",minVar5PisoConc);
    inputNumberMax.setAttribute("value",maxVar5PisoConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar5PisoConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar5PisoConc.noUiSlider.set([null, this.value]);
    });

    sliderVar5PisoConc.noUiSlider.on('update',function(e){
        Var5PisoConc.eachLayer(function(layer){
            if(layer.feature.properties.Var5P_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var5P_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar5PisoConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderVar5PisoConc.noUiSlider;
    $(slidersGeral).append(sliderVar5PisoConc);
} 

///////////////////////////// Fim VARIAÇÃO 5 PISO POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 6 PISO POR CONCELHOS -------------------////

var minVar6PisoConc = 99999;
var maxVar6PisoConc = 0;

function CorVar6PisoConc(d) {
    return d === null ? '#808080':
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -60  ? '#2288bf' :
                ''  ;
}

var legendaVar6PisoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 6 pisos, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -54.26 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar6PisoConc(feature) {
    if(feature.properties.Var6P_1101 <= minVar6PisoConc){
        minVar6PisoConc = feature.properties.Var6P_1101
    }
    if(feature.properties.Var6P_1101 > maxVar6PisoConc){
        maxVar6PisoConc = feature.properties.Var6P_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar6PisoConc(feature.properties.Var6P_1101)};
    }


function apagarVar6PisoConc(e) {
    Var6PisoConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar6PisoConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var6P_1101.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar6PisoConc,
    });
}
var Var6PisoConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar6PisoConc,
    onEachFeature: onEachFeatureVar6PisoConc
});

let slideVar6PisoConc = function(){
    var sliderVar6PisoConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar6PisoConc, {
        start: [minVar6PisoConc, maxVar6PisoConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar6PisoConc,
            'max': maxVar6PisoConc
        },
        });
    inputNumberMin.setAttribute("value",minVar6PisoConc);
    inputNumberMax.setAttribute("value",maxVar6PisoConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar6PisoConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar6PisoConc.noUiSlider.set([null, this.value]);
    });

    sliderVar6PisoConc.noUiSlider.on('update',function(e){
        Var6PisoConc.eachLayer(function(layer){
            if(layer.feature.properties.Var6P_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var6P_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar6PisoConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderVar6PisoConc.noUiSlider;
    $(slidersGeral).append(sliderVar6PisoConc);
} 

///////////////////////////// Fim VARIAÇÃO 6 PISO POR CONCELHOS -------------- \\\\\


/////////////////////////////------- Variação 7 PISO POR CONCELHOS -------------------////

var minVar7PisoConc = 99999;
var maxVar7PisoConc = 0;

function CorVar7PisoConc(d) {
    return d === null ? '#808080':
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -15  ? '#9eaad7' :
        d >= -41  ? '#2288bf' :
                ''  ;
}

var legendaVar7PisoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 7 pisos, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -15 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -40 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar7PisoConc(feature) {
    if(feature.properties.Var7P_1101 <= minVar7PisoConc){
        minVar7PisoConc = feature.properties.Var7P_1101
    }
    if(feature.properties.Var7P_1101 > maxVar7PisoConc){
        maxVar7PisoConc = feature.properties.Var7P_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar7PisoConc(feature.properties.Var7P_1101)};
    }


function apagarVar7PisoConc(e) {
    Var7PisoConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar7PisoConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var7P_1101.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar7PisoConc,
    });
}
var Var7PisoConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar7PisoConc,
    onEachFeature: onEachFeatureVar7PisoConc
});

let slideVar7PisoConc = function(){
    var sliderVar7PisoConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar7PisoConc, {
        start: [minVar7PisoConc, maxVar7PisoConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar7PisoConc,
            'max': maxVar7PisoConc
        },
        });
    inputNumberMin.setAttribute("value",minVar7PisoConc);
    inputNumberMax.setAttribute("value",maxVar7PisoConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar7PisoConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar7PisoConc.noUiSlider.set([null, this.value]);
    });

    sliderVar7PisoConc.noUiSlider.on('update',function(e){
        Var7PisoConc.eachLayer(function(layer){
            if(layer.feature.properties.Var7P_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var7P_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar7PisoConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderVar7PisoConc.noUiSlider;
    $(slidersGeral).append(sliderVar7PisoConc);
} 

///////////////////////////// Fim VARIAÇÃO 7 PISO POR CONCELHOS -------------- \\\\\

//////////////////////////----------------------------- FIM VARIAÇÕES


////////////////////////////------- Percentagem 1 PISO CONCELHO em 2001-----////

var minPerc1PisoConc01 = 99999;
var maxPerc1PisoConc01 = 0;


function CorPerc1PisoConc(d) {
    return d == null ? '#808080' :
        d >= 46.48 ? '#8c0303' :
        d >= 41.12  ? '#de1f35' :
        d >= 32.19  ? '#ff5e6e' :
        d >= 23.26   ? '#f5b3be' :
        d >= 14.33   ? '#F2C572' :
                ''  ;
}
var legendaPerc1PisoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 46.48' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 41.12 a 46.48' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 32.19 a 41.12' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 23.26 a 32.19' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 14.33 a 23.26' + '<br>'

    $(legendaA).append(symbolsContainer); 
}


function EstiloPerc1PisoConc01(feature) {
    if( feature.properties.Prop_1P_01 <= minPerc1PisoConc01 || minPerc1PisoConc01 === 0){
        minPerc1PisoConc01 = feature.properties.Prop_1P_01
    }
    if(feature.properties.Prop_1P_01 >= maxPerc1PisoConc01 ){
        maxPerc1PisoConc01 = feature.properties.Prop_1P_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerc1PisoConc(feature.properties.Prop_1P_01)
    };
}
function apagarPerc1PisoConc01(e) {
    Perc1PisoConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerc1PisoConc01(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios com 1 piso: ' + '<b>' + feature.properties.Prop_1P_01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerc1PisoConc01,
    });
}
var Perc1PisoConc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerc1PisoConc01,
    onEachFeature: onEachFeaturePerc1PisoConc01
});
let slidePerc1PisoConc01 = function(){
    var sliderPerc1PisoConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerc1PisoConc01, {
        start: [minPerc1PisoConc01, maxPerc1PisoConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc1PisoConc01,
            'max': maxPerc1PisoConc01
        },
        });
    inputNumberMin.setAttribute("value",minPerc1PisoConc01);
    inputNumberMax.setAttribute("value",maxPerc1PisoConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc1PisoConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc1PisoConc01.noUiSlider.set([null, this.value]);
    });

    sliderPerc1PisoConc01.noUiSlider.on('update',function(e){
        Perc1PisoConc01.eachLayer(function(layer){
            if(layer.feature.properties.Prop_1P_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_1P_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerc1PisoConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderPerc1PisoConc01.noUiSlider;
    $(slidersGeral).append(sliderPerc1PisoConc01);
} 

/////////////////////////////// Fim PERCENTAGEM 1 PISO CONCELHO em 2001 -------------- \\\\\\


////////////////////////////------- Percentagem 2 PISO CONCELHO em 2001-----////

var minPerc2PisoConc01 = 99999;
var maxPerc2PisoConc01 = 0;

function CorPerc2PisoConc(d) {
    return d == null ? '#808080' :
        d >= 69.68 ? '#8c0303' :
        d >= 62.66  ? '#de1f35' :
        d >= 50.96  ? '#ff5e6e' :
        d >= 39.25   ? '#f5b3be' :
        d >= 27.55   ? '#F2C572' :
                ''  ;
}
var legendaPerc2PisoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 69.68' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 62.66 a 69.68' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 50.96 a 62.66' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 39.25 a 50.96' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 27.55 a 39.25' + '<br>'

    $(legendaA).append(symbolsContainer); 
}


function EstiloPerc2PisoConc01(feature) {
    if( feature.properties.Prop_2P_01 <= minPerc2PisoConc01){
        minPerc2PisoConc01 = feature.properties.Prop_2P_01
    }
    if(feature.properties.Prop_2P_01 >= maxPerc2PisoConc01 ){
        maxPerc2PisoConc01 = feature.properties.Prop_2P_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerc2PisoConc(feature.properties.Prop_2P_01)
    };
}
function apagarPerc2PisoConc01(e) {
    Perc2PisoConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerc2PisoConc01(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios com 2 pisos: ' + '<b>' + feature.properties.Prop_2P_01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerc2PisoConc01,
    });
}
var Perc2PisoConc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerc2PisoConc01,
    onEachFeature: onEachFeaturePerc2PisoConc01
});
let slidePerc2PisoConc01 = function(){
    var sliderPerc2PisoConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerc2PisoConc01, {
        start: [minPerc2PisoConc01, maxPerc2PisoConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc2PisoConc01,
            'max': maxPerc2PisoConc01
        },
        });
    inputNumberMin.setAttribute("value",minPerc2PisoConc01);
    inputNumberMax.setAttribute("value",maxPerc2PisoConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc2PisoConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc2PisoConc01.noUiSlider.set([null, this.value]);
    });

    sliderPerc2PisoConc01.noUiSlider.on('update',function(e){
        Perc2PisoConc01.eachLayer(function(layer){
            if(layer.feature.properties.Prop_2P_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_2P_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerc2PisoConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderPerc2PisoConc01.noUiSlider;
    $(slidersGeral).append(sliderPerc2PisoConc01);
} 

/////////////////////////////// Fim PERCENTAGEM 2 PISO CONCELHO em 2001 -------------- \\\\\\


////////////////////////////------- Percentagem 3 PISO CONCELHO em 2001-----////

var minPerc3PisoConc01 = 99999;
var maxPerc3PisoConc01 = 0;

function CorPerc3PisoConc(d) {
    return d == null ? '#808080' :
        d >= 38.41 ? '#8c0303' :
        d >= 33.11  ? '#de1f35' :
        d >= 24.27  ? '#ff5e6e' :
        d >= 15.43   ? '#f5b3be' :
        d >= 6.59   ? '#F2C572' :
                ''  ;
}
var legendaPerc3PisoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 38.41' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 33.11 a 38.41' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 24.27 a 33.11' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 15.43 a 24.27' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 6.59 a 15.43' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerc3PisoConc01(feature) {
    if( feature.properties.Prop_3P_01 <= minPerc3PisoConc01 || minPerc3PisoConc01 === 0){
        minPerc3PisoConc01 = feature.properties.Prop_3P_01
    }
    if(feature.properties.Prop_3P_01 >= maxPerc3PisoConc01 ){
        maxPerc3PisoConc01 = feature.properties.Prop_3P_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerc3PisoConc(feature.properties.Prop_3P_01)
    };
}
function apagarPerc3PisoConc01(e) {
    Perc3PisoConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerc3PisoConc01(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios com 3 pisos: ' + '<b>' + feature.properties.Prop_3P_01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerc3PisoConc01,
    });
}
var Perc3PisoConc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerc3PisoConc01,
    onEachFeature: onEachFeaturePerc3PisoConc01
});
let slidePerc3PisoConc01 = function(){
    var sliderPerc3PisoConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerc3PisoConc01, {
        start: [minPerc3PisoConc01, maxPerc3PisoConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc3PisoConc01,
            'max': maxPerc3PisoConc01
        },
        });
    inputNumberMin.setAttribute("value",minPerc3PisoConc01);
    inputNumberMax.setAttribute("value",maxPerc3PisoConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc3PisoConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc3PisoConc01.noUiSlider.set([null, this.value]);
    });

    sliderPerc3PisoConc01.noUiSlider.on('update',function(e){
        Perc3PisoConc01.eachLayer(function(layer){
            if(layer.feature.properties.Prop_3P_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_3P_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerc3PisoConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderPerc3PisoConc01.noUiSlider;
    $(slidersGeral).append(sliderPerc3PisoConc01);
} 

/////////////////////////////// Fim PERCENTAGEM 3 PISO CONCELHO em 2001 -------------- \\\\\\

////////////////////////////------- Percentagem 1 PISO CONCELHO em 2011-----////

var minPerc1PisoConc11 = 99999;
var maxPerc1PisoConc11 = 0;

function EstiloPerc1PisoConc11(feature) {
    if( feature.properties.Prop_1P_11 <= minPerc1PisoConc11){
        minPerc1PisoConc11 = feature.properties.Prop_1P_11
    }
    if(feature.properties.Prop_1P_11 >= maxPerc1PisoConc11 ){
        maxPerc1PisoConc11 = feature.properties.Prop_1P_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerc1PisoConc(feature.properties.Prop_1P_11)
    };
}
function apagarPerc1PisoConc11(e) {
    Perc1PisoConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerc1PisoConc11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios com 1 piso: ' + '<b>' + feature.properties.Prop_1P_11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerc1PisoConc11,
    });
}
var Perc1PisoConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerc1PisoConc11,
    onEachFeature: onEachFeaturePerc1PisoConc11
});
let slidePerc1PisoConc11 = function(){
    var sliderPerc1PisoConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerc1PisoConc11, {
        start: [minPerc1PisoConc11, maxPerc1PisoConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc1PisoConc11,
            'max': maxPerc1PisoConc11
        },
        });
    inputNumberMin.setAttribute("value",minPerc1PisoConc11);
    inputNumberMax.setAttribute("value",maxPerc1PisoConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc1PisoConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc1PisoConc11.noUiSlider.set([null, this.value]);
    });

    sliderPerc1PisoConc11.noUiSlider.on('update',function(e){
        Perc1PisoConc11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_1P_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_1P_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerc1PisoConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderPerc1PisoConc11.noUiSlider;
    $(slidersGeral).append(sliderPerc1PisoConc11);
} 

/////////////////////////////// Fim PERCENTAGEM 1 PISO CONCELHO em 2011 -------------- \\\\\\


////////////////////////////------- Percentagem 2 PISO CONCELHO em 2011-----////

var minPerc2PisoConc11 = 99999;
var maxPerc2PisoConc11 = 0;

function EstiloPerc2PisoConc11(feature) {
    if( feature.properties.Prop_2P_11 <= minPerc2PisoConc11){
        minPerc2PisoConc11 = feature.properties.Prop_2P_11
    }
    if(feature.properties.Prop_2P_11 >= maxPerc2PisoConc11 ){
        maxPerc2PisoConc11 = feature.properties.Prop_2P_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerc2PisoConc(feature.properties.Prop_2P_11)
    };
}
function apagarPerc2PisoConc11(e) {
    Perc2PisoConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerc2PisoConc11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios com 2 pisos: ' + '<b>' + feature.properties.Prop_2P_11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerc2PisoConc11,
    });
}
var Perc2PisoConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerc2PisoConc11,
    onEachFeature: onEachFeaturePerc2PisoConc11
});
let slidePerc2PisoConc11 = function(){
    var sliderPerc2PisoConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerc2PisoConc11, {
        start: [minPerc2PisoConc11, maxPerc2PisoConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc2PisoConc11,
            'max': maxPerc2PisoConc11
        },
        });
    inputNumberMin.setAttribute("value",minPerc2PisoConc11);
    inputNumberMax.setAttribute("value",maxPerc2PisoConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc2PisoConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc2PisoConc11.noUiSlider.set([null, this.value]);
    });

    sliderPerc2PisoConc11.noUiSlider.on('update',function(e){
        Perc2PisoConc11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_2P_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_2P_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerc2PisoConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderPerc2PisoConc11.noUiSlider;
    $(slidersGeral).append(sliderPerc2PisoConc11);
} 

/////////////////////////////// Fim PERCENTAGEM 2 PISO CONCELHO em 2011 -------------- \\\\\\


////////////////////////////------- Percentagem 3 PISO CONCELHO em 2011-----////

var minPerc3PisoConc11 = 99999;
var maxPerc3PisoConc11 = 0;

function EstiloPerc3PisoConc11(feature) {
    if( feature.properties.Prop_3P_11 <= minPerc3PisoConc11 || minPerc3PisoConc11 === 0){
        minPerc3PisoConc11 = feature.properties.Prop_3P_11
    }
    if(feature.properties.Prop_3P_11 >= maxPerc3PisoConc11 ){
        maxPerc3PisoConc11 = feature.properties.Prop_3P_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerc3PisoConc(feature.properties.Prop_3P_11)
    };
}
function apagarPerc3PisoConc11(e) {
    Perc3PisoConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerc3PisoConc11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios com 3 pisos: ' + '<b>' + feature.properties.Prop_3P_11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerc3PisoConc11,
    });
}
var Perc3PisoConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerc3PisoConc11,
    onEachFeature: onEachFeaturePerc3PisoConc11
});
let slidePerc3PisoConc11 = function(){
    var sliderPerc3PisoConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerc3PisoConc11, {
        start: [minPerc3PisoConc11, maxPerc3PisoConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc3PisoConc11,
            'max': maxPerc3PisoConc11
        },
        });
    inputNumberMin.setAttribute("value",minPerc3PisoConc11);
    inputNumberMax.setAttribute("value",maxPerc3PisoConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc3PisoConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc3PisoConc11.noUiSlider.set([null, this.value]);
    });

    sliderPerc3PisoConc11.noUiSlider.on('update',function(e){
        Perc3PisoConc11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_3P_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_3P_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerc3PisoConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderPerc3PisoConc11.noUiSlider;
    $(slidersGeral).append(sliderPerc3PisoConc11);
} 

/////////////////////////////// Fim PERCENTAGEM 3 PISO CONCELHO em 2011 -------------- \\\\\\


///////////////////////////////////////----------------------- FIM CONCELHOS------------\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

///////////////////////////----------------------- FREGUESIAS 

////////////////////////////////////----------- EDIFICIOS 1 PISO 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi1PisoFreg01 = 99999;
var maxEdi1PisoFreg01 = 0;
function estiloEdi1PisoFreg01(feature, latlng) {
    if(feature.properties.Edi_1P_01< minEdi1PisoFreg01 || feature.properties.Edi_1P_01 ===0){
        minEdi1PisoFreg01 = feature.properties.Edi_1P_01
    }
    if(feature.properties.Edi_1P_01> maxEdi1PisoFreg01){
        maxEdi1PisoFreg01 = feature.properties.Edi_1P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_1P_01,0.3)
    });
}
function apagarEdi1PisoFreg01(e){
    var layer = e.target;
    Edi1PisoFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi1PisoFreg01(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 1 piso: '  + '<b>'+ feature.properties.Edi_1P_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi1PisoFreg01,
    })
};

var Edi1PisoFreg01= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi1PisoFreg01,
    onEachFeature: onEachFeatureEdi1PisoFreg01,
});

var slideEdi1PisoFreg01 = function(){
    var sliderEdi1PisoFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi1PisoFreg01, {
        start: [minEdi1PisoFreg01, maxEdi1PisoFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi1PisoFreg01,
            'max': maxEdi1PisoFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi1PisoFreg01);
    inputNumberMax.setAttribute("value",maxEdi1PisoFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi1PisoFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi1PisoFreg01.noUiSlider.set([null, this.value]);
    });

    sliderEdi1PisoFreg01.noUiSlider.on('update',function(e){
        Edi1PisoFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Edi_1P_01>=parseFloat(e[0])&& layer.feature.properties.Edi_1P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi1PisoFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderEdi1PisoFreg01.noUiSlider;
    $(slidersGeral).append(sliderEdi1PisoFreg01);
}


///////////////////////////---------- FIM EDIFICIOS 1 PISO 2001,Por Freguesia -----------\\\\\\\\\

////////////////////////////////////----------- EDIFICIOS 2 PISO 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi2PisoFreg01 = 99999;
var maxEdi2PisoFreg01 = 0;
function estiloEdi2PisoFreg01(feature, latlng) {
    if(feature.properties.Edi_2P_01< minEdi2PisoFreg01 || feature.properties.Edi_2P_01 ===0){
        minEdi2PisoFreg01 = feature.properties.Edi_2P_01
    }
    if(feature.properties.Edi_2P_01> maxEdi2PisoFreg01){
        maxEdi2PisoFreg01 = feature.properties.Edi_2P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_2P_01,0.3)
    });
}
function apagarEdi2PisoFreg01(e){
    var layer = e.target;
    Edi2PisoFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi2PisoFreg01(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 2 pisos: '  + '<b>'+ feature.properties.Edi_2P_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi2PisoFreg01,
    })
};

var Edi2PisoFreg01= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi2PisoFreg01,
    onEachFeature: onEachFeatureEdi2PisoFreg01,
});

var slideEdi2PisoFreg01 = function(){
    var sliderEdi2PisoFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi2PisoFreg01, {
        start: [minEdi2PisoFreg01, maxEdi2PisoFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi2PisoFreg01,
            'max': maxEdi2PisoFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi2PisoFreg01);
    inputNumberMax.setAttribute("value",maxEdi2PisoFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi2PisoFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi2PisoFreg01.noUiSlider.set([null, this.value]);
    });

    sliderEdi2PisoFreg01.noUiSlider.on('update',function(e){
        Edi2PisoFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Edi_2P_01>=parseFloat(e[0])&& layer.feature.properties.Edi_2P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi2PisoFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderEdi2PisoFreg01.noUiSlider;
    $(slidersGeral).append(sliderEdi2PisoFreg01);
}


///////////////////////////---------- FIM EDIFICIOS 2 PISO 2001,Por Freguesia -----------\\\\\\\\\

////////////////////////////////////----------- EDIFICIOS 3 PISO 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi3PisoFreg01 = 99999;
var maxEdi3PisoFreg01 = 0;
function estiloEdi3PisoFreg01(feature, latlng) {
    if(feature.properties.Edi_3P_01< minEdi3PisoFreg01 || feature.properties.Edi_3P_01 ===0){
        minEdi3PisoFreg01 = feature.properties.Edi_3P_01
    }
    if(feature.properties.Edi_3P_01> maxEdi3PisoFreg01){
        maxEdi3PisoFreg01 = feature.properties.Edi_3P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_3P_01,0.3)
    });
}
function apagarEdi3PisoFreg01(e){
    var layer = e.target;
    Edi3PisoFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi3PisoFreg01(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 3 pisos: '  + '<b>'+ feature.properties.Edi_3P_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi3PisoFreg01,
    })
};

var Edi3PisoFreg01= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi3PisoFreg01,
    onEachFeature: onEachFeatureEdi3PisoFreg01,
});

var slideEdi3PisoFreg01 = function(){
    var sliderEdi3PisoFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi3PisoFreg01, {
        start: [minEdi3PisoFreg01, maxEdi3PisoFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi3PisoFreg01,
            'max': maxEdi3PisoFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi3PisoFreg01);
    inputNumberMax.setAttribute("value",maxEdi3PisoFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi3PisoFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi3PisoFreg01.noUiSlider.set([null, this.value]);
    });

    sliderEdi3PisoFreg01.noUiSlider.on('update',function(e){
        Edi3PisoFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Edi_3P_01>=parseFloat(e[0])&& layer.feature.properties.Edi_3P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi3PisoFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderEdi3PisoFreg01.noUiSlider;
    $(slidersGeral).append(sliderEdi3PisoFreg01);
}


///////////////////////////---------- FIM EDIFICIOS 3 PISO 2001,Por Freguesia -----------\\\\\\\\\

////////////////////////////////////----------- EDIFICIOS 4 PISO 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi4PisoFreg01 = 99999;
var maxEdi4PisoFreg01 = 0;
function estiloEdi4PisoFreg01(feature, latlng) {
    if(feature.properties.Edi_4P_01< minEdi4PisoFreg01 || feature.properties.Edi_4P_01 ===0){
        minEdi4PisoFreg01 = feature.properties.Edi_4P_01
    }
    if(feature.properties.Edi_4P_01> maxEdi4PisoFreg01){
        maxEdi4PisoFreg01 = feature.properties.Edi_4P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_4P_01,0.8)
    });
}
function apagarEdi4PisoFreg01(e){
    var layer = e.target;
    Edi4PisoFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi4PisoFreg01(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 4 pisos: '  + '<b>'+ feature.properties.Edi_4P_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi4PisoFreg01,
    })
};

var Edi4PisoFreg01= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi4PisoFreg01,
    onEachFeature: onEachFeatureEdi4PisoFreg01,
});

var slideEdi4PisoFreg01 = function(){
    var sliderEdi4PisoFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi4PisoFreg01, {
        start: [minEdi4PisoFreg01, maxEdi4PisoFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi4PisoFreg01,
            'max': maxEdi4PisoFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi4PisoFreg01);
    inputNumberMax.setAttribute("value",maxEdi4PisoFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi4PisoFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi4PisoFreg01.noUiSlider.set([null, this.value]);
    });

    sliderEdi4PisoFreg01.noUiSlider.on('update',function(e){
        Edi4PisoFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Edi_4P_01>=parseFloat(e[0])&& layer.feature.properties.Edi_4P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi4PisoFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderEdi4PisoFreg01.noUiSlider;
    $(slidersGeral).append(sliderEdi4PisoFreg01);
}


///////////////////////////---------- FIM EDIFICIOS 4 PISO 2001,Por Freguesia -----------\\\\\\\\\



////////////////////////////////////----------- EDIFICIOS 5 PISO 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi5PisoFreg01 = 99999;
var maxEdi5PisoFreg01 = 0;
function estiloEdi5PisoFreg01(feature, latlng) {
    if(feature.properties.Edi_5P_01< minEdi5PisoFreg01 || feature.properties.Edi_5P_01 ===0){
        minEdi5PisoFreg01 = feature.properties.Edi_5P_01
    }
    if(feature.properties.Edi_5P_01> maxEdi5PisoFreg01){
        maxEdi5PisoFreg01 = feature.properties.Edi_5P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_5P_01,0.8)
    });
}
function apagarEdi5PisoFreg01(e){
    var layer = e.target;
    Edi5PisoFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi5PisoFreg01(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 5 pisos: '  + '<b>'+ feature.properties.Edi_5P_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi5PisoFreg01,
    })
};

var Edi5PisoFreg01= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi5PisoFreg01,
    onEachFeature: onEachFeatureEdi5PisoFreg01,
});

var slideEdi5PisoFreg01 = function(){
    var sliderEdi5PisoFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi5PisoFreg01, {
        start: [minEdi5PisoFreg01, maxEdi5PisoFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi5PisoFreg01,
            'max': maxEdi5PisoFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi5PisoFreg01);
    inputNumberMax.setAttribute("value",maxEdi5PisoFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi5PisoFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi5PisoFreg01.noUiSlider.set([null, this.value]);
    });

    sliderEdi5PisoFreg01.noUiSlider.on('update',function(e){
        Edi5PisoFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Edi_5P_01>=parseFloat(e[0])&& layer.feature.properties.Edi_5P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi5PisoFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderEdi5PisoFreg01.noUiSlider;
    $(slidersGeral).append(sliderEdi5PisoFreg01);
}


///////////////////////////---------- FIM EDIFICIOS 5 PISO 2001,Por Freguesia -----------\\\\\\\\\

////////////////////////////////////----------- EDIFICIOS 6 PISO 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi6PisoFreg01 = 99999;
var maxEdi6PisoFreg01 = 0;
function estiloEdi6PisoFreg01(feature, latlng) {
    if(feature.properties.Edi_6P_01< minEdi6PisoFreg01 || feature.properties.Edi_6P_01 ===0){
        minEdi6PisoFreg01 = feature.properties.Edi_6P_01
    }
    if(feature.properties.Edi_6P_01> maxEdi6PisoFreg01){
        maxEdi6PisoFreg01 = feature.properties.Edi_6P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_6P_01,0.8)
    });
}
function apagarEdi6PisoFreg01(e){
    var layer = e.target;
    Edi6PisoFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi6PisoFreg01(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 6 pisos: '  + '<b>'+ feature.properties.Edi_6P_01 + '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi6PisoFreg01,
    })
};

var Edi6PisoFreg01= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi6PisoFreg01,
    onEachFeature: onEachFeatureEdi6PisoFreg01,
});

var slideEdi6PisoFreg01 = function(){
    var sliderEdi6PisoFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi6PisoFreg01, {
        start: [minEdi6PisoFreg01, maxEdi6PisoFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi6PisoFreg01,
            'max': maxEdi6PisoFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi6PisoFreg01);
    inputNumberMax.setAttribute("value",maxEdi6PisoFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi6PisoFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi6PisoFreg01.noUiSlider.set([null, this.value]);
    });

    sliderEdi6PisoFreg01.noUiSlider.on('update',function(e){
        Edi6PisoFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Edi_6P_01>=parseFloat(e[0])&& layer.feature.properties.Edi_6P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi6PisoFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderEdi6PisoFreg01.noUiSlider;
    $(slidersGeral).append(sliderEdi6PisoFreg01);
}


///////////////////////////---------- FIM EDIFICIOS 6 PISO 2001,Por Freguesia -----------\\\\\\\\\

////////////////////////////////////----------- EDIFICIOS 7 PISO 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi7PisoFreg01 = 99999;
var maxEdi7PisoFreg01 = 0;
function estiloEdi7PisoFreg01(feature, latlng) {
    if(feature.properties.Edi_7P_01< minEdi7PisoFreg01 || feature.properties.Edi_7P_01 ===0){
        minEdi7PisoFreg01 = feature.properties.Edi_7P_01
    }
    if(feature.properties.Edi_7P_01> maxEdi7PisoFreg01){
        maxEdi7PisoFreg01 = feature.properties.Edi_7P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_7P_01,0.8)
    });
}
function apagarEdi7PisoFreg01(e){
    var layer = e.target;
    Edi7PisoFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi7PisoFreg01(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 7 pisos: '  + '<b>'+ feature.properties.Edi_7P_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi7PisoFreg01,
    })
};

var Edi7PisoFreg01= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi7PisoFreg01,
    onEachFeature: onEachFeatureEdi7PisoFreg01,
});

var slideEdi7PisoFreg01 = function(){
    var sliderEdi7PisoFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi7PisoFreg01, {
        start: [minEdi7PisoFreg01, maxEdi7PisoFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi7PisoFreg01,
            'max': maxEdi7PisoFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi7PisoFreg01);
    inputNumberMax.setAttribute("value",maxEdi7PisoFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi7PisoFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi7PisoFreg01.noUiSlider.set([null, this.value]);
    });

    sliderEdi7PisoFreg01.noUiSlider.on('update',function(e){
        Edi7PisoFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Edi_7P_01>=parseFloat(e[0])&& layer.feature.properties.Edi_7P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi7PisoFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderEdi7PisoFreg01.noUiSlider;
    $(slidersGeral).append(sliderEdi7PisoFreg01);
}


///////////////////////////---------- FIM EDIFICIOS 7 PISO 2001,Por Freguesia -----------\\\\\\\\\

////////////////////////////////////----------- EDIFICIOS 1 PISO 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi1PisoFreg11 = 99999;
var maxEdi1PisoFreg11 = 0;
function estiloEdi1PisoFreg11(feature, latlng) {
    if(feature.properties.Edi_1P_11< minEdi1PisoFreg11 || feature.properties.Edi_1P_11 ===0){
        minEdi1PisoFreg11 = feature.properties.Edi_1P_11
    }
    if(feature.properties.Edi_1P_11> maxEdi1PisoFreg11){
        maxEdi1PisoFreg11 = feature.properties.Edi_1P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_1P_11,0.3)
    });
}
function apagarEdi1PisoFreg11(e){
    var layer = e.target;
    Edi1PisoFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi1PisoFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 1 piso: '  + '<b>'+ feature.properties.Edi_1P_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi1PisoFreg11,
    })
};

var Edi1PisoFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi1PisoFreg11,
    onEachFeature: onEachFeatureEdi1PisoFreg11,
});

var slideEdi1PisoFreg11 = function(){
    var sliderEdi1PisoFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi1PisoFreg11, {
        start: [minEdi1PisoFreg11, maxEdi1PisoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi1PisoFreg11,
            'max': maxEdi1PisoFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi1PisoFreg11);
    inputNumberMax.setAttribute("value",maxEdi1PisoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi1PisoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi1PisoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdi1PisoFreg11.noUiSlider.on('update',function(e){
        Edi1PisoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Edi_1P_11>=parseFloat(e[0])&& layer.feature.properties.Edi_1P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi1PisoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderEdi1PisoFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdi1PisoFreg11);
}


///////////////////////////---------- FIM EDIFICIOS 1 PISO 2011,Por Freguesia -----------\\\\\\\\\

////////////////////////////////////----------- EDIFICIOS 2 PISO 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi2PisoFreg11 = 99999;
var maxEdi2PisoFreg11 = 0;
function estiloEdi2PisoFreg11(feature, latlng) {
    if(feature.properties.Edi_2P_11< minEdi2PisoFreg11 || feature.properties.Edi_2P_11 ===0){
        minEdi2PisoFreg11 = feature.properties.Edi_2P_11
    }
    if(feature.properties.Edi_2P_11> maxEdi2PisoFreg11){
        maxEdi2PisoFreg11 = feature.properties.Edi_2P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_2P_11,0.3)
    });
}
function apagarEdi2PisoFreg11(e){
    var layer = e.target;
    Edi2PisoFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi2PisoFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 2 pisos: '  + '<b>'+ feature.properties.Edi_2P_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi2PisoFreg11,
    })
};

var Edi2PisoFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi2PisoFreg11,
    onEachFeature: onEachFeatureEdi2PisoFreg11,
});

var slideEdi2PisoFreg11 = function(){
    var sliderEdi2PisoFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi2PisoFreg11, {
        start: [minEdi2PisoFreg11, maxEdi2PisoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi2PisoFreg11,
            'max': maxEdi2PisoFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi2PisoFreg11);
    inputNumberMax.setAttribute("value",maxEdi2PisoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi2PisoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi2PisoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdi2PisoFreg11.noUiSlider.on('update',function(e){
        Edi2PisoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Edi_2P_11>=parseFloat(e[0])&& layer.feature.properties.Edi_2P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi2PisoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderEdi2PisoFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdi2PisoFreg11);
}


///////////////////////////---------- FIM EDIFICIOS 2 PISO 2011,Por Freguesia -----------\\\\\\\\\

////////////////////////////////////----------- EDIFICIOS 3 PISO 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi3PisoFreg11 = 99999;
var maxEdi3PisoFreg11 = 0;
function estiloEdi3PisoFreg11(feature, latlng) {
    if(feature.properties.Edi_3P_11< minEdi3PisoFreg11 || feature.properties.Edi_3P_11 ===0){
        minEdi3PisoFreg11 = feature.properties.Edi_3P_11
    }
    if(feature.properties.Edi_3P_11> maxEdi3PisoFreg11){
        maxEdi3PisoFreg11 = feature.properties.Edi_3P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_3P_11,0.3)
    });
}
function apagarEdi3PisoFreg11(e){
    var layer = e.target;
    Edi3PisoFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi3PisoFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 3 pisos: '  + '<b>'+ feature.properties.Edi_3P_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi3PisoFreg11,
    })
};

var Edi3PisoFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi3PisoFreg11,
    onEachFeature: onEachFeatureEdi3PisoFreg11,
});

var slideEdi3PisoFreg11 = function(){
    var sliderEdi3PisoFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi3PisoFreg11, {
        start: [minEdi3PisoFreg11, maxEdi3PisoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi3PisoFreg11,
            'max': maxEdi3PisoFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi3PisoFreg11);
    inputNumberMax.setAttribute("value",maxEdi3PisoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi3PisoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi3PisoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdi3PisoFreg11.noUiSlider.on('update',function(e){
        Edi3PisoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Edi_3P_11>=parseFloat(e[0])&& layer.feature.properties.Edi_3P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi3PisoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderEdi3PisoFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdi3PisoFreg11);
}


///////////////////////////---------- FIM EDIFICIOS 3 PISO 2011,Por Freguesia -----------\\\\\\\\\

////////////////////////////////////----------- EDIFICIOS 4 PISO 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi4PisoFreg11 = 99999;
var maxEdi4PisoFreg11 = 0;
function estiloEdi4PisoFreg11(feature, latlng) {
    if(feature.properties.Edi_4P_11< minEdi4PisoFreg11 || feature.properties.Edi_4P_11 ===0){
        minEdi4PisoFreg11 = feature.properties.Edi_4P_11
    }
    if(feature.properties.Edi_4P_11> maxEdi4PisoFreg11){
        maxEdi4PisoFreg11 = feature.properties.Edi_4P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_4P_11,0.8)
    });
}
function apagarEdi4PisoFreg11(e){
    var layer = e.target;
    Edi4PisoFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi4PisoFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 4 pisos: '  + '<b>'+ feature.properties.Edi_4P_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi4PisoFreg11,
    })
};

var Edi4PisoFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi4PisoFreg11,
    onEachFeature: onEachFeatureEdi4PisoFreg11,
});

var slideEdi4PisoFreg11 = function(){
    var sliderEdi4PisoFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 39){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi4PisoFreg11, {
        start: [minEdi4PisoFreg11, maxEdi4PisoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi4PisoFreg11,
            'max': maxEdi4PisoFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi4PisoFreg11);
    inputNumberMax.setAttribute("value",maxEdi4PisoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi4PisoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi4PisoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdi4PisoFreg11.noUiSlider.on('update',function(e){
        Edi4PisoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Edi_4P_11>=parseFloat(e[0])&& layer.feature.properties.Edi_4P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi4PisoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 39;
    sliderAtivo = sliderEdi4PisoFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdi4PisoFreg11);
}


///////////////////////////---------- FIM EDIFICIOS 4 PISO 2011,Por Freguesia -----------\\\\\\\\\



////////////////////////////////////----------- EDIFICIOS 5 PISO 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi5PisoFreg11 = 99999;
var maxEdi5PisoFreg11 = 0;
function estiloEdi5PisoFreg11(feature, latlng) {
    if(feature.properties.Edi_5P_11< minEdi5PisoFreg11 || feature.properties.Edi_5P_11 ===0){
        minEdi5PisoFreg11 = feature.properties.Edi_5P_11
    }
    if(feature.properties.Edi_5P_11> maxEdi5PisoFreg11){
        maxEdi5PisoFreg11 = feature.properties.Edi_5P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_5P_11,0.8)
    });
}
function apagarEdi5PisoFreg11(e){
    var layer = e.target;
    Edi5PisoFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi5PisoFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 5 pisos: '  + '<b>'+ feature.properties.Edi_5P_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi5PisoFreg11,
    })
};

var Edi5PisoFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi5PisoFreg11,
    onEachFeature: onEachFeatureEdi5PisoFreg11,
});

var slideEdi5PisoFreg11 = function(){
    var sliderEdi5PisoFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi5PisoFreg11, {
        start: [minEdi5PisoFreg11, maxEdi5PisoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi5PisoFreg11,
            'max': maxEdi5PisoFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi5PisoFreg11);
    inputNumberMax.setAttribute("value",maxEdi5PisoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi5PisoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi5PisoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdi5PisoFreg11.noUiSlider.on('update',function(e){
        Edi5PisoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Edi_5P_11>=parseFloat(e[0])&& layer.feature.properties.Edi_5P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi5PisoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderEdi5PisoFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdi5PisoFreg11);
}


///////////////////////////---------- FIM EDIFICIOS 5 PISO 2011,Por Freguesia -----------\\\\\\\\\

////////////////////////////////////----------- EDIFICIOS 6 PISO 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi6PisoFreg11 = 99999;
var maxEdi6PisoFreg11 = 0;
function estiloEdi6PisoFreg11(feature, latlng) {
    if(feature.properties.Edi_6P_11< minEdi6PisoFreg11 || feature.properties.Edi_6P_11 ===0){
        minEdi6PisoFreg11 = feature.properties.Edi_6P_11
    }
    if(feature.properties.Edi_6P_11> maxEdi6PisoFreg11){
        maxEdi6PisoFreg11 = feature.properties.Edi_6P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_6P_11,0.8)
    });
}
function apagarEdi6PisoFreg11(e){
    var layer = e.target;
    Edi6PisoFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi6PisoFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 6 pisos: '  + '<b>'+ feature.properties.Edi_6P_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi6PisoFreg11,
    })
};

var Edi6PisoFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi6PisoFreg11,
    onEachFeature: onEachFeatureEdi6PisoFreg11,
});

var slideEdi6PisoFreg11 = function(){
    var sliderEdi6PisoFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi6PisoFreg11, {
        start: [minEdi6PisoFreg11, maxEdi6PisoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi6PisoFreg11,
            'max': maxEdi6PisoFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi6PisoFreg11);
    inputNumberMax.setAttribute("value",maxEdi6PisoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi6PisoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi6PisoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdi6PisoFreg11.noUiSlider.on('update',function(e){
        Edi6PisoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Edi_6P_11>=parseFloat(e[0])&& layer.feature.properties.Edi_6P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi6PisoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderEdi6PisoFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdi6PisoFreg11);
}


///////////////////////////---------- FIM EDIFICIOS 6 PISO 2011,Por Freguesia -----------\\\\\\\\\

////////////////////////////////////----------- EDIFICIOS 7 PISO 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi7PisoFreg11 = 99999;
var maxEdi7PisoFreg11 = 0;
function estiloEdi7PisoFreg11(feature, latlng) {
    if(feature.properties.Edi_7P_11< minEdi7PisoFreg11 || feature.properties.Edi_7P_11 ===0){
        minEdi7PisoFreg11 = feature.properties.Edi_7P_11
    }
    if(feature.properties.Edi_7P_11> maxEdi7PisoFreg11){
        maxEdi7PisoFreg11 = feature.properties.Edi_7P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_7P_11,0.8)
    });
}
function apagarEdi7PisoFreg11(e){
    var layer = e.target;
    Edi7PisoFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi7PisoFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 7 pisos: '  + '<b>'+ feature.properties.Edi_7P_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi7PisoFreg11,
    })
};

var Edi7PisoFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi7PisoFreg11,
    onEachFeature: onEachFeatureEdi7PisoFreg11,
});

var slideEdi7PisoFreg11 = function(){
    var sliderEdi7PisoFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 42){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi7PisoFreg11, {
        start: [minEdi7PisoFreg11, maxEdi7PisoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi7PisoFreg11,
            'max': maxEdi7PisoFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi7PisoFreg11);
    inputNumberMax.setAttribute("value",maxEdi7PisoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi7PisoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi7PisoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdi7PisoFreg11.noUiSlider.on('update',function(e){
        Edi7PisoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Edi_7P_11>=parseFloat(e[0])&& layer.feature.properties.Edi_7P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi7PisoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 42;
    sliderAtivo = sliderEdi7PisoFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdi7PisoFreg11);
}


///////////////////////////---------- FIM EDIFICIOS 7 PISO 2011,Por Freguesia -----------\\\\\\\\\
/////////////////////////////----------------------- FIM DADOS ABSOLUTOS
/////////////////////////////--------------------- DADOS RELATIVOS

////////////////////////////////////----------- PERCENTAGEM 1 PISO, EM 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerc1PisoFreg01 = 99999;
var maxPerc1PisoFreg01 = 0;

function CorPerc1PisoFreg(d) {
    return d == null ? '#808080' :
        d >= 83.25 ? '#8c0303' :
        d >= 69.5  ? '#de1f35' :
        d >= 46.59  ? '#ff5e6e' :
        d >= 23.67   ? '#f5b3be' :
        d >= 0.76   ? '#F2C572' :
                ''  ;
}
var legendaPerc1PisoFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 83.25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 69.5 a 83.25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 46.59 a 69.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 23.67 a 46.59' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.76 a 23.67' + '<br>'

    $(legendaA).append(symbolsContainer); 
}


function estiloPerc1PisoFreg01(feature) {
    if(feature.properties.Prop_1P_01< minPerc1PisoFreg01){
        minPerc1PisoFreg01 = feature.properties.Prop_1P_01
    }
    if(feature.properties.Prop_1P_01> maxPerc1PisoFreg01){
        maxPerc1PisoFreg01 = feature.properties.Prop_1P_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerc1PisoFreg(feature.properties.Prop_1P_01)
    };
}
function apagarPerc1PisoFreg01(e){
    var layer = e.target;
    Perc1PisoFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerc1PisoFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' +  'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios com 1 piso: ' + '<b>' +feature.properties.Prop_1P_01 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerc1PisoFreg01,
    })
};

var Perc1PisoFreg01= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerc1PisoFreg01,
    onEachFeature: onEachFeaturePerc1PisoFreg01,
});

var slidePerc1PisoFreg01 = function(){
    var sliderPerc1PisoFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 43){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerc1PisoFreg01, {
        start: [minPerc1PisoFreg01, maxPerc1PisoFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc1PisoFreg01,
            'max': maxPerc1PisoFreg01
        },
    });
    
    inputNumberMin.setAttribute("value",minPerc1PisoFreg01);
    inputNumberMax.setAttribute("value",maxPerc1PisoFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc1PisoFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc1PisoFreg01.noUiSlider.set([null, this.value]);
    });

    sliderPerc1PisoFreg01.noUiSlider.on('update',function(e){
        Perc1PisoFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Prop_1P_01>=parseFloat(e[0])&& layer.feature.properties.Prop_1P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerc1PisoFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 43;
    sliderAtivo = sliderPerc1PisoFreg01.noUiSlider;
    $(slidersGeral).append(sliderPerc1PisoFreg01);
}
///////////////////////////-------------------- FIM PERCENTAGEM 1 PISO, EM 2001,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 2 PISO, EM 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerc2PisoFreg01 = 99999;
var maxPerc2PisoFreg01 = 0;

function CorPerc2PisoFreg(d) {
    return d == null ? '#808080' :
        d >= 82.26 ? '#8c0303' :
        d >= 69.35  ? '#de1f35' :
        d >= 47.84  ? '#ff5e6e' :
        d >= 26.32   ? '#f5b3be' :
        d >= 4.81   ? '#F2C572' :
                ''  ;
}
var legendaPerc2PisoFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 82.26' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 69.35 a 82.26' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 47.84 a 69.35' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 26.32 a 47.84' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 4.81 a 26.32' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function estiloPerc2PisoFreg01(feature) {
    if(feature.properties.Prop_2P_01< minPerc2PisoFreg01){
        minPerc2PisoFreg01 = feature.properties.Prop_2P_01
    }
    if(feature.properties.Prop_2P_01> maxPerc2PisoFreg01){
        maxPerc2PisoFreg01 = feature.properties.Prop_2P_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerc2PisoFreg(feature.properties.Prop_2P_01)
    };
}
function apagarPerc2PisoFreg01(e){
    var layer = e.target;
    Perc2PisoFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerc2PisoFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios com 2 pisos: ' + '<b>' +feature.properties.Prop_2P_01 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerc2PisoFreg01,
    })
};

var Perc2PisoFreg01= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerc2PisoFreg01,
    onEachFeature: onEachFeaturePerc2PisoFreg01,
});

var slidePerc2PisoFreg01 = function(){
    var sliderPerc2PisoFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 44){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerc2PisoFreg01, {
        start: [minPerc2PisoFreg01, maxPerc2PisoFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc2PisoFreg01,
            'max': maxPerc2PisoFreg01
        },
    });
    
    inputNumberMin.setAttribute("value",minPerc2PisoFreg01);
    inputNumberMax.setAttribute("value",maxPerc2PisoFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc2PisoFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc2PisoFreg01.noUiSlider.set([null, this.value]);
    });

    sliderPerc2PisoFreg01.noUiSlider.on('update',function(e){
        Perc2PisoFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Prop_2P_01>=parseFloat(e[0])&& layer.feature.properties.Prop_2P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerc2PisoFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 44;
    sliderAtivo = sliderPerc2PisoFreg01.noUiSlider;
    $(slidersGeral).append(sliderPerc2PisoFreg01);
}
///////////////////////////-------------------- FIM PERCENTAGEM 2 PISO, EM 2001,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 3 PISO, EM 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerc3PisoFreg01 = 99999;
var maxPerc3PisoFreg01 = 0;

function CorPerc3PisoFreg(d) {
    return d == 0.00 ? '#808080' :
        d >= 84.99 ? '#8c0303' :
        d >= 70.82  ? '#de1f35' :
        d >= 47.22  ? '#ff5e6e' :
        d >= 23.61   ? '#f5b3be' :
        d >= 0.01   ? '#F2C572' :
                ''  ;
}
var legendaPerc3PisoFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 84.99' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 70.82 a 84.99' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 47.22 a 70.82' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 23.61 a 47.22' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.01 a 23.61' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' 0' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function estiloPerc3PisoFreg01(feature) {
    if(feature.properties.Prop_3P_01< minPerc3PisoFreg01){
        minPerc3PisoFreg01 = feature.properties.Prop_3P_01
    }
    if(feature.properties.Prop_3P_01> maxPerc3PisoFreg01){
        maxPerc3PisoFreg01 = feature.properties.Prop_3P_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerc3PisoFreg(feature.properties.Prop_3P_01)
    };
}
function apagarPerc3PisoFreg01(e){
    var layer = e.target;
    Perc3PisoFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerc3PisoFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios com 3 pisos: ' + '<b>' +feature.properties.Prop_3P_01 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerc3PisoFreg01,
    })
};

var Perc3PisoFreg01= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerc3PisoFreg01,
    onEachFeature: onEachFeaturePerc3PisoFreg01,
});

var slidePerc3PisoFreg01 = function(){
    var sliderPerc3PisoFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerc3PisoFreg01, {
        start: [minPerc3PisoFreg01, maxPerc3PisoFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc3PisoFreg01,
            'max': maxPerc3PisoFreg01
        },
    });
    
    inputNumberMin.setAttribute("value",minPerc3PisoFreg01);
    inputNumberMax.setAttribute("value",maxPerc3PisoFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc3PisoFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc3PisoFreg01.noUiSlider.set([null, this.value]);
    });

    sliderPerc3PisoFreg01.noUiSlider.on('update',function(e){
        Perc3PisoFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Prop_3P_01>=parseFloat(e[0])&& layer.feature.properties.Prop_3P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerc3PisoFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderPerc3PisoFreg01.noUiSlider;
    $(slidersGeral).append(sliderPerc3PisoFreg01);
}
///////////////////////////-------------------- FIM PERCENTAGEM 3 PISO, EM 2001,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM 1 PISO, EM 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerc1PisoFreg11 = 99999;
var maxPerc1PisoFreg11 = 0;
function estiloPerc1PisoFreg11(feature) {
    if(feature.properties.Prop_1P_11< minPerc1PisoFreg11){
        minPerc1PisoFreg11 = feature.properties.Prop_1P_11
    }
    if(feature.properties.Prop_1P_11> maxPerc1PisoFreg11){
        maxPerc1PisoFreg11 = feature.properties.Prop_1P_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerc1PisoFreg(feature.properties.Prop_1P_11)
    };
}
function apagarPerc1PisoFreg11(e){
    var layer = e.target;
    Perc1PisoFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerc1PisoFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios com 1 piso: ' + '<b>' +feature.properties.Prop_1P_11 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerc1PisoFreg11,
    })
};

var Perc1PisoFreg11= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerc1PisoFreg11,
    onEachFeature: onEachFeaturePerc1PisoFreg11,
});

var slidePerc1PisoFreg11 = function(){
    var sliderPerc1PisoFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 46){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerc1PisoFreg11, {
        start: [minPerc1PisoFreg11, maxPerc1PisoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc1PisoFreg11,
            'max': maxPerc1PisoFreg11
        },
    });
    
    inputNumberMin.setAttribute("value",minPerc1PisoFreg11);
    inputNumberMax.setAttribute("value",maxPerc1PisoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc1PisoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc1PisoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPerc1PisoFreg11.noUiSlider.on('update',function(e){
        Perc1PisoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_1P_11>=parseFloat(e[0])&& layer.feature.properties.Prop_1P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerc1PisoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 46;
    sliderAtivo = sliderPerc1PisoFreg11.noUiSlider;
    $(slidersGeral).append(sliderPerc1PisoFreg11);
}
///////////////////////////-------------------- FIM PERCENTAGEM 1 PISO, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 2 PISO, EM 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerc2PisoFreg11 = 99999;
var maxPerc2PisoFreg11 = 0;
function estiloPerc2PisoFreg11(feature, latlng) {
    if(feature.properties.Prop_2P_11< minPerc2PisoFreg11){
        minPerc2PisoFreg11 = feature.properties.Prop_2P_11
    }
    if(feature.properties.Prop_2P_11> maxPerc2PisoFreg11){
        maxPerc2PisoFreg11 = feature.properties.Prop_2P_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerc2PisoFreg(feature.properties.Prop_2P_11)
    };
}
function apagarPerc2PisoFreg11(e){
    var layer = e.target;
    Perc2PisoFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerc2PisoFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios com 2 pisos: ' + '<b>' +feature.properties.Prop_2P_11 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerc2PisoFreg11,
    })
};

var Perc2PisoFreg11= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerc2PisoFreg11,
    onEachFeature: onEachFeaturePerc2PisoFreg11,
});

var slidePerc2PisoFreg11 = function(){
    var sliderPerc2PisoFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 47){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerc2PisoFreg11, {
        start: [minPerc2PisoFreg11, maxPerc2PisoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc2PisoFreg11,
            'max': maxPerc2PisoFreg11
        },
    });
    
    inputNumberMin.setAttribute("value",minPerc2PisoFreg11);
    inputNumberMax.setAttribute("value",maxPerc2PisoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc2PisoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc2PisoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPerc2PisoFreg11.noUiSlider.on('update',function(e){
        Perc2PisoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_2P_11>=parseFloat(e[0])&& layer.feature.properties.Prop_2P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerc2PisoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 47;
    sliderAtivo = sliderPerc2PisoFreg11.noUiSlider;
    $(slidersGeral).append(sliderPerc2PisoFreg11);
}
///////////////////////////-------------------- FIM PERCENTAGEM 2 PISO, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 3 PISO, EM 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerc3PisoFreg11 = 99999;
var maxPerc3PisoFreg11 = 0;
function estiloPerc3PisoFreg11(feature) {
    if(feature.properties.Prop_3P_11< minPerc3PisoFreg11){
        minPerc3PisoFreg11 = feature.properties.Prop_3P_11
    }
    if(feature.properties.Prop_3P_11> maxPerc3PisoFreg11){
        maxPerc3PisoFreg11 = feature.properties.Prop_3P_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerc3PisoFreg(feature.properties.Prop_3P_11)
    };
}
function apagarPerc3PisoFreg11(e){
    var layer = e.target;
    Perc3PisoFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerc3PisoFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios com 3 pisos: ' + '<b>' +feature.properties.Prop_3P_11 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerc3PisoFreg11,
    })
};

var Perc3PisoFreg11= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerc3PisoFreg11,
    onEachFeature: onEachFeaturePerc3PisoFreg11,
});

var slidePerc3PisoFreg11 = function(){
    var sliderPerc3PisoFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 48){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerc3PisoFreg11, {
        start: [minPerc3PisoFreg11, maxPerc3PisoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc3PisoFreg11,
            'max': maxPerc3PisoFreg11
        },
    });
    
    inputNumberMin.setAttribute("value",minPerc3PisoFreg11);
    inputNumberMax.setAttribute("value",maxPerc3PisoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc3PisoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc3PisoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPerc3PisoFreg11.noUiSlider.on('update',function(e){
        Perc3PisoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_3P_11>=parseFloat(e[0])&& layer.feature.properties.Prop_3P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerc3PisoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 48;
    sliderAtivo = sliderPerc3PisoFreg11.noUiSlider;
    $(slidersGeral).append(sliderPerc3PisoFreg11);
}
///////////////////////////-------------------- FIM PERCENTAGEM 3 PISO, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

///////////////////////--------------------------- VARIAÇÕES FREGUESIAS

/////////////////////////////------- Variação 1 PISO POR FREGUESIA -------------------////

var minVar1PisoFreg = 999;
var maxVar1PisoFreg = 0;

function CorVar1PisoFreg(d) {
    return d === null ? '#808080':
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -99  ? '#2288bf' :
                ''  ;
}

var legendaVar1PisoFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 1 piso, entre 2021 e 2011, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -88.41 a -25' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar1PisoFreg(feature) {
    if(feature.properties.Var1P_1101 <= minVar1PisoFreg){
        minVar1PisoFreg = feature.properties.Var1P_1101
    }
    if(feature.properties.Var1P_1101 > maxVar1PisoFreg){
        maxVar1PisoFreg = feature.properties.Var1P_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1PisoFreg(feature.properties.Var1P_1101)};
    }


function apagarVar1PisoFreg(e) {
    Var1PisoFreg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1PisoFreg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var1P_1101.toFixed(2) + '%' + '</b>').openPopup()  
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1PisoFreg,
    });
}
var Var1PisoFreg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar1PisoFreg,
    onEachFeature: onEachFeatureVar1PisoFreg
});

let slideVar1PisoFreg = function(){
    var sliderVar1PisoFreg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 49){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1PisoFreg, {
        start: [minVar1PisoFreg, maxVar1PisoFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1PisoFreg,
            'max': maxVar1PisoFreg
        },
        });
    inputNumberMin.setAttribute("value",minVar1PisoFreg);
    inputNumberMax.setAttribute("value",maxVar1PisoFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1PisoFreg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1PisoFreg.noUiSlider.set([null, this.value]);
    });

    sliderVar1PisoFreg.noUiSlider.on('update',function(e){
        Var1PisoFreg.eachLayer(function(layer){
            if(layer.feature.properties.Var1P_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1P_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1PisoFreg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 49;
    sliderAtivo = sliderVar1PisoFreg.noUiSlider;
    $(slidersGeral).append(sliderVar1PisoFreg);
} 

///////////////////////////// Fim da Variação 1 PISO  POR FREGUESIA -------------- \\\\\

/////////////////////////////------- Variação 2 PISO POR FREGUESIA -------------------////

var minVar2PisoFreg = 999;
var maxVar2PisoFreg = 0;

function CorVar2PisoFreg(d) {
    return d === null ? '#808080':
        d >= 40  ? '#de1f35' :
        d >= 20  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -100  ? '#2288bf' :
                ''  ;
}

var legendaVar2PisoFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 2 pisos, entre 2021 e 2011, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  20 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -84.49 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2PisoFreg(feature) {
    if(feature.properties.Var2P_1101 <= minVar2PisoFreg){
        minVar2PisoFreg = feature.properties.Var2P_1101
    }
    if(feature.properties.Var2P_1101 > maxVar2PisoFreg){
        maxVar2PisoFreg = feature.properties.Var2P_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2PisoFreg(feature.properties.Var2P_1101)};
    }


function apagarVar2PisoFreg(e) {
    Var2PisoFreg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2PisoFreg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var2P_1101.toFixed(2) + '%' + '</b>').openPopup()  
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2PisoFreg,
    });
}
var Var2PisoFreg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar2PisoFreg,
    onEachFeature: onEachFeatureVar2PisoFreg
});

let slideVar2PisoFreg = function(){
    var sliderVar2PisoFreg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 50){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2PisoFreg, {
        start: [minVar2PisoFreg, maxVar2PisoFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2PisoFreg,
            'max': maxVar2PisoFreg
        },
        });
    inputNumberMin.setAttribute("value",minVar2PisoFreg);
    inputNumberMax.setAttribute("value",maxVar2PisoFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2PisoFreg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2PisoFreg.noUiSlider.set([null, this.value]);
    });

    sliderVar2PisoFreg.noUiSlider.on('update',function(e){
        Var2PisoFreg.eachLayer(function(layer){
            if(layer.feature.properties.Var2P_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2P_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2PisoFreg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 50;
    sliderAtivo = sliderVar2PisoFreg.noUiSlider;
    $(slidersGeral).append(sliderVar2PisoFreg);
} 

///////////////////////////// Fim da Variação 2 PISOS  POR FREGUESIA -------------- \\\\\

/////////////////////////////------- Variação 3 PISO POR FREGUESIA -------------------////

var minVar3PisoFreg = 999;
var maxVar3PisoFreg = 0;

function CorVar3PisoFreg(d) {
    return d === null ? '#808080':
        d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101  ? '#2288bf' :
                ''  ;
}

var legendaVar3PisoFreg = function(titulo) {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com '+ titulo +' pisos, entre 2021 e 2011, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar3PisoFreg(feature) {
    if(feature.properties.Var3P_1101 <= minVar3PisoFreg){
        minVar3PisoFreg = feature.properties.Var3P_1101
    }
    if(feature.properties.Var3P_1101 > maxVar3PisoFreg){
        maxVar3PisoFreg = feature.properties.Var3P_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3PisoFreg(feature.properties.Var3P_1101)};
    }


function apagarVar3PisoFreg(e) {
    Var3PisoFreg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3PisoFreg(feature, layer) {
    if(feature.properties.Var3P_1101 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3P_1101.toFixed(2) + '</b>' + '%').openPopup()
    }    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3PisoFreg,
    });
}
var Var3PisoFreg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar3PisoFreg,
    onEachFeature: onEachFeatureVar3PisoFreg
});

let slideVar3PisoFreg = function(){
    var sliderVar3PisoFreg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 51){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3PisoFreg, {
        start: [minVar3PisoFreg, maxVar3PisoFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3PisoFreg,
            'max': maxVar3PisoFreg
        },
        });
    inputNumberMin.setAttribute("value",minVar3PisoFreg);
    inputNumberMax.setAttribute("value",maxVar3PisoFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3PisoFreg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3PisoFreg.noUiSlider.set([null, this.value]);
    });

    sliderVar3PisoFreg.noUiSlider.on('update',function(e){
        Var3PisoFreg.eachLayer(function(layer){
            if (layer.feature.properties.Var3P_1101 == null){
                return false
            }
            if(layer.feature.properties.Var3P_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3P_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3PisoFreg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 51;
    sliderAtivo = sliderVar3PisoFreg.noUiSlider;
    $(slidersGeral).append(sliderVar3PisoFreg);
} 

///////////////////////////// Fim da Variação 3 PISOS  POR FREGUESIA -------------- \\\\\

/////////////////////////////------- Variação 4 PISO POR FREGUESIA -------------------////

var minVar4PisoFreg = 999;
var maxVar4PisoFreg = 0;


function EstiloVar4PisoFreg(feature) {
    if(feature.properties.Var4P_1101 <= minVar4PisoFreg){
        minVar4PisoFreg = feature.properties.Var4P_1101
    }
    if(feature.properties.Var4P_1101 > maxVar4PisoFreg){
        maxVar4PisoFreg = feature.properties.Var4P_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3PisoFreg(feature.properties.Var4P_1101)};
    }


function apagarVar4PisoFreg(e) {
    Var4PisoFreg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4PisoFreg(feature, layer) {
    if(feature.properties.Var4P_1101 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4P_1101.toFixed(2) + '</b>' + '%').openPopup()
    }    
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4PisoFreg,
    });
}
var Var4PisoFreg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar4PisoFreg,
    onEachFeature: onEachFeatureVar4PisoFreg
});

let slideVar4PisoFreg = function(){
    var sliderVar4PisoFreg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 52){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4PisoFreg, {
        start: [minVar4PisoFreg, maxVar4PisoFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4PisoFreg,
            'max': maxVar4PisoFreg
        },
        });
    inputNumberMin.setAttribute("value",minVar4PisoFreg);
    inputNumberMax.setAttribute("value",maxVar4PisoFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4PisoFreg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4PisoFreg.noUiSlider.set([null, this.value]);
    });

    sliderVar4PisoFreg.noUiSlider.on('update',function(e){
        Var4PisoFreg.eachLayer(function(layer){
            if (layer.feature.properties.Var4P_1101 == null){
                return false
            }
            if(layer.feature.properties.Var4P_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4P_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4PisoFreg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 52;
    sliderAtivo = sliderVar4PisoFreg.noUiSlider;
    $(slidersGeral).append(sliderVar4PisoFreg);
} 

///////////////////////////// Fim da Variação 4 PISOS  POR FREGUESIA -------------- \\\\\

/////////////////////////////------- Variação 5 PISO POR FREGUESIA -------------------////

var minVar5PisoFreg = 999;
var maxVar5PisoFreg = 0;

function EstiloVar5PisoFreg(feature) {
    if(feature.properties.Var5P_1101 <= minVar5PisoFreg){
        minVar5PisoFreg = feature.properties.Var5P_1101
    }
    if(feature.properties.Var5P_1101 > maxVar5PisoFreg){
        maxVar5PisoFreg = feature.properties.Var5P_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3PisoFreg(feature.properties.Var5P_1101)};
    }


function apagarVar5PisoFreg(e) {
    Var5PisoFreg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar5PisoFreg(feature, layer) {
    if(feature.properties.Var5P_1101 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var5P_1101.toFixed(2) + '</b>' + '%').openPopup()
    }  
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar5PisoFreg,
    });
}
var Var5PisoFreg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar5PisoFreg,
    onEachFeature: onEachFeatureVar5PisoFreg
});

let slideVar5PisoFreg = function(){
    var sliderVar5PisoFreg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 53){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar5PisoFreg, {
        start: [minVar5PisoFreg, maxVar5PisoFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar5PisoFreg,
            'max': maxVar5PisoFreg
        },
        });
    inputNumberMin.setAttribute("value",minVar5PisoFreg);
    inputNumberMax.setAttribute("value",maxVar5PisoFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar5PisoFreg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar5PisoFreg.noUiSlider.set([null, this.value]);
    });

    sliderVar5PisoFreg.noUiSlider.on('update',function(e){
        Var5PisoFreg.eachLayer(function(layer){
            if (layer.feature.properties.Var5P_1101 == null){
                return false
            }
            if(layer.feature.properties.Var5P_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var5P_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar5PisoFreg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 53;
    sliderAtivo = sliderVar5PisoFreg.noUiSlider;
    $(slidersGeral).append(sliderVar5PisoFreg);
} 

///////////////////////////// Fim da Variação 5 PISOS  POR FREGUESIA -------------- \\\\\

/////////////////////////////------- Variação 6 PISO POR FREGUESIA -------------------////

var minVar6PisoFreg = 999;
var maxVar6PisoFreg = 0;

function EstiloVar6PisoFreg(feature) {
    if(feature.properties.Var6P_1101 <= minVar6PisoFreg){
        minVar6PisoFreg = feature.properties.Var6P_1101
    }
    if(feature.properties.Var6P_1101 > maxVar6PisoFreg){
        maxVar6PisoFreg = feature.properties.Var6P_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3PisoFreg(feature.properties.Var6P_1101)};
    }


function apagarVar6PisoFreg(e) {
    Var6PisoFreg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar6PisoFreg(feature, layer) {
    if(feature.properties.Var6P_1101 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var6P_1101.toFixed(2) + '</b>' + '%').openPopup()
    }     layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar6PisoFreg,
    });
}
var Var6PisoFreg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar6PisoFreg,
    onEachFeature: onEachFeatureVar6PisoFreg
});

let slideVar6PisoFreg = function(){
    var sliderVar6PisoFreg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 54){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar6PisoFreg, {
        start: [minVar6PisoFreg, maxVar6PisoFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar6PisoFreg,
            'max': maxVar6PisoFreg
        },
        });
    inputNumberMin.setAttribute("value",minVar6PisoFreg);
    inputNumberMax.setAttribute("value",maxVar6PisoFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar6PisoFreg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar6PisoFreg.noUiSlider.set([null, this.value]);
    });

    sliderVar6PisoFreg.noUiSlider.on('update',function(e){
        Var6PisoFreg.eachLayer(function(layer){
            if (layer.feature.properties.Var6P_1101 == null){
                return false
            }
            if(layer.feature.properties.Var6P_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var6P_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar6PisoFreg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 54;
    sliderAtivo = sliderVar6PisoFreg.noUiSlider;
    $(slidersGeral).append(sliderVar6PisoFreg);
} 

///////////////////////////// Fim da Variação 6 PISOS  POR FREGUESIA -------------- \\\\\


/////////////////////////////------- Variação 7 PISO POR FREGUESIA -------------------////

var minVar7PisoFreg = 999;
var maxVar7PisoFreg = 0;

function EstiloVar7PisoFreg(feature) {
    if(feature.properties.Var7P_1101 <= minVar7PisoFreg ){
        minVar7PisoFreg = feature.properties.Var7P_1101
    }
    if(feature.properties.Var7P_1101 > maxVar7PisoFreg){
        maxVar7PisoFreg = feature.properties.Var7P_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3PisoFreg(feature.properties.Var7P_1101)};
    }


function apagarVar7PisoFreg(e) {
    Var7PisoFreg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar7PisoFreg(feature, layer) {
    if(feature.properties.Var7P_1101 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var7P_1101.toFixed(2) + '</b>' + '%').openPopup()
    }    
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar7PisoFreg,
    });
}
var Var7PisoFreg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar7PisoFreg,
    onEachFeature: onEachFeatureVar7PisoFreg
});

let slideVar7PisoFreg = function(){
    var sliderVar7PisoFreg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 55){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar7PisoFreg, {
        start: [minVar7PisoFreg, maxVar7PisoFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar7PisoFreg,
            'max': maxVar7PisoFreg
        },
        });
    inputNumberMin.setAttribute("value",minVar7PisoFreg);
    inputNumberMax.setAttribute("value",maxVar7PisoFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar7PisoFreg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar7PisoFreg.noUiSlider.set([null, this.value]);
    });

    sliderVar7PisoFreg.noUiSlider.on('update',function(e){
        Var7PisoFreg.eachLayer(function(layer){
            if (layer.feature.properties.Var7P_1101 == null){
                return false
            }
            if(layer.feature.properties.Var7P_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var7P_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar7PisoFreg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 55;
    sliderAtivo = sliderVar7PisoFreg.noUiSlider;
    $(slidersGeral).append(sliderVar7PisoFreg);
} 

///////////////////////////// Fim da Variação 7 PISOS  POR FREGUESIA -------------- \\\\\


/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = Pisos1Conc01;
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
    if (layer == Pisos1Conc01 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 piso, em 2001, por concelho.' + '</strong>');
        legenda(maxPisos1Conc01, ((maxPisos1Conc01-minPisos1Conc01)/2).toFixed(0),minPisos1Conc01,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePisos1Conc01();
        naoDuplicar = 1;
    }
    if (layer == Pisos1Conc01 && naoDuplicar == 1){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 piso, em 2001, por concelho.' + '</strong>');
        contorno.addTo(map);
    }
    if (layer == Pisos2Conc01 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 2 pisos, em 2001, por concelho.' + '</strong>');
        legenda(maxPisos2Conc01, ((maxPisos2Conc01-minPisos2Conc01)/2).toFixed(0),minPisos2Conc01,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePisos2Conc01();
        naoDuplicar = 2;
    }
    if (layer == Pisos3Conc01 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 3 pisos, em 2001, por concelho.' + '</strong>');
        legenda(maxPisos3Conc01, ((maxPisos3Conc01-minPisos3Conc01)/2).toFixed(0),minPisos3Conc01,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePisos3Conc01();
        naoDuplicar = 3;
    }
    if (layer == Pisos4Conc01 && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 4 pisos, em 2001, por concelho.' + '</strong>');
        legenda(maxPisos4Conc01, ((maxPisos4Conc01-minPisos4Conc01)/2).toFixed(0),minPisos4Conc01,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePisos4Conc01();
        naoDuplicar = 4;
    }
    if (layer == Pisos5Conc01 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 5 pisos, em 2001, por concelho.' + '</strong>');
        legenda(maxPisos5Conc01, ((maxPisos5Conc01-minPisos5Conc01)/2).toFixed(0),minPisos5Conc01,0.5);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePisos5Conc01();
        naoDuplicar = 5;
    }
    if (layer == Pisos6Conc01 && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 6 pisos, em 2001, por concelho.' + '</strong>');
        legenda(maxPisos6Conc01, ((maxPisos6Conc01-minPisos6Conc01)/2).toFixed(0),minPisos6Conc01,0.5);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePisos6Conc01();
        naoDuplicar = 6;
    }
    if (layer == Pisos7Conc01 && naoDuplicar != 7){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 7 pisos, em 2001, por concelho.' + '</strong>');
        legenda(maxPisos7Conc01, ((maxPisos7Conc01-minPisos7Conc01)/2).toFixed(0),minPisos7Conc01,0.5);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePisos7Conc01();
        naoDuplicar = 7;
    }
    if (layer == Pisos1Conc11 && naoDuplicar != 8){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 piso, em 2011, por concelho.' + '</strong>');
        legenda(maxPisos1Conc11, ((maxPisos1Conc11-minPisos1Conc11)/2).toFixed(0),minPisos1Conc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePisos1Conc11();
        naoDuplicar = 8;
    }
    if (layer == Pisos2Conc11 && naoDuplicar != 9){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 2 pisos, em 2011, por concelho.' + '</strong>');
        legenda(maxPisos2Conc11, ((maxPisos2Conc11-minPisos2Conc11)/2).toFixed(0),minPisos2Conc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePisos2Conc11();
        naoDuplicar = 9;
    }
    if (layer == Pisos3Conc11 && naoDuplicar != 10){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 3 pisos, em 2011, por concelho.' + '</strong>');
        legenda(maxPisos3Conc11, ((maxPisos3Conc11-minPisos3Conc11)/2).toFixed(0),minPisos3Conc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePisos3Conc11();
        naoDuplicar = 10;
    }
    if (layer == Pisos4Conc11 && naoDuplicar != 11){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 4 pisos, em 2011, por concelho.' + '</strong>');
        legenda(maxPisos4Conc11, ((maxPisos4Conc11-minPisos4Conc11)/2).toFixed(0),minPisos4Conc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePisos4Conc11();
        naoDuplicar = 11;
    }
    if (layer == Pisos5Conc11 && naoDuplicar != 12){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 5 pisos, em 2011, por concelho.' + '</strong>');
        legenda(maxPisos5Conc11, ((maxPisos5Conc11-minPisos5Conc11)/2).toFixed(0),minPisos5Conc11,0.5);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePisos5Conc11();
        naoDuplicar = 12;
    }
    if (layer == Pisos6Conc11 && naoDuplicar != 13){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 6 pisos, em 2011, por concelho.' + '</strong>');
        legenda(maxPisos6Conc11, ((maxPisos6Conc11-minPisos6Conc11)/2).toFixed(0),minPisos6Conc11,0.5);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePisos6Conc11();
        naoDuplicar = 13;
    }
    if (layer == Pisos7Conc11 && naoDuplicar != 14){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 7 pisos, em 2011, por concelho.' + '</strong>');
        legenda(maxPisos7Conc11, ((maxPisos7Conc11-minPisos7Conc11)/2).toFixed(0),minPisos7Conc11,0.5);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePisos7Conc11();
        naoDuplicar = 14;
    }
    if (layer == Var1PisoConc && naoDuplicar != 15){
        legendaVar1PisoConc();
        slideVar1PisoConc();
        naoDuplicar = 15;
    }
    if (layer == Var2PisoConc && naoDuplicar != 17){
        legendaVar2PisoConc();
        slideVar2PisoConc();
        naoDuplicar = 17;
    }
    if (layer == Var3PisoConc && naoDuplicar != 18){
        legendaVar3PisoConc();
        slideVar3PisoConc();
        naoDuplicar = 18;
    }
    if (layer == Var4PisoConc && naoDuplicar != 19){
        legendaVar4PisoConc();
        slideVar4PisoConc();
        naoDuplicar = 19;
    }
    if (layer == Var5PisoConc && naoDuplicar != 20){
        legendaVar5PisoConc();
        slideVar5PisoConc();
        naoDuplicar = 20;
    }
    if (layer == Var6PisoConc && naoDuplicar != 21){
        legendaVar6PisoConc();
        slideVar6PisoConc();
        naoDuplicar = 21;
    }
    if (layer == Var7PisoConc && naoDuplicar != 22){
        legendaVar7PisoConc();
        slideVar7PisoConc();
        naoDuplicar = 22;
    }
    if (layer == Perc1PisoConc01 && naoDuplicar != 23){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 1 piso, em 2001, por concelho.' + '</strong>');
        legendaPerc1PisoConc();
        slidePerc1PisoConc01();
        naoDuplicar = 23;
    }
    if (layer == Perc2PisoConc01 && naoDuplicar != 24){
        legendaPerc2PisoConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 2 pisos, em 2001, por concelho.' + '</strong>');
        slidePerc2PisoConc01();
        naoDuplicar = 24;
    }
    if (layer == Perc3PisoConc01 && naoDuplicar != 25){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 3 pisos, em 2001, por concelho.' + '</strong>');
        legendaPerc3PisoConc();
        slidePerc3PisoConc01();
        naoDuplicar = 25;
    }
    if (layer == Perc1PisoConc11 && naoDuplicar != 26){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 1 piso, em 2011, por concelho.' + '</strong>');
        legendaPerc1PisoConc();
        slidePerc1PisoConc11();
        naoDuplicar = 26;
    }
    if (layer == Perc2PisoConc11 && naoDuplicar != 27){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 2 pisos, em 2011, por concelho.' + '</strong>');
        legendaPerc2PisoConc();
        slidePerc2PisoConc11();
        naoDuplicar = 27;
    }
    if (layer == Perc3PisoConc11 && naoDuplicar != 28){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 3 pisos, em 2011, por concelho.' + '</strong>');
        legendaPerc3PisoConc();
        slidePerc3PisoConc11();
        naoDuplicar = 28;
    }
    if (layer == Edi1PisoFreg01 && naoDuplicar != 29){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 piso, em 2001, por freguesia.' + '</strong>');
        legenda(maxEdi1PisoFreg01, ((maxEdi1PisoFreg01-minEdi1PisoFreg01)/2).toFixed(0),minEdi1PisoFreg01,0.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi1PisoFreg01();
        naoDuplicar = 29;
    }
    if (layer == Edi2PisoFreg01 && naoDuplicar != 30){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 2 pisos, em 2001, por freguesia.' + '</strong>');
        legenda(maxEdi2PisoFreg01, ((maxEdi2PisoFreg01-minEdi2PisoFreg01)/2).toFixed(0),minEdi2PisoFreg01,0.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi2PisoFreg01();
        naoDuplicar = 30;
    }
    if (layer == Edi3PisoFreg01 && naoDuplicar != 31){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 3 pisos, em 2001, por freguesia.' + '</strong>');
        legenda(maxEdi3PisoFreg01, ((maxEdi3PisoFreg01-minEdi3PisoFreg01)/2).toFixed(0),minEdi3PisoFreg01,0.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi3PisoFreg01();
        naoDuplicar = 31;
    }
    if (layer == Edi4PisoFreg01 && naoDuplicar != 32){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 4 pisos, em 2001, por freguesia.' + '</strong>');
        legenda(maxEdi4PisoFreg01, ((maxEdi4PisoFreg01-minEdi4PisoFreg01)/2).toFixed(0),minEdi4PisoFreg01,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi4PisoFreg01();
        naoDuplicar = 32;
    }
    if (layer == Edi5PisoFreg01 && naoDuplicar != 33){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 5 pisos, em 2001, por freguesia.' + '</strong>');
        legenda(maxEdi5PisoFreg01, ((maxEdi5PisoFreg01-minEdi5PisoFreg01)/2).toFixed(0),minEdi5PisoFreg01,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi5PisoFreg01();
        naoDuplicar = 33;
    }
    if (layer == Edi6PisoFreg01 && naoDuplicar != 34){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 6 pisos, em 2001, por freguesia.' + '</strong>');
        legenda(maxEdi6PisoFreg01, ((maxEdi6PisoFreg01-minEdi6PisoFreg01)/2).toFixed(0),minEdi6PisoFreg01,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi6PisoFreg01();
        naoDuplicar = 34;
    }
    if (layer == Edi7PisoFreg01 && naoDuplicar != 35){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 7 pisos, em 2001, por freguesia.' + '</strong>');
        legenda(maxEdi7PisoFreg01, ((maxEdi7PisoFreg01-minEdi7PisoFreg01)/2).toFixed(0),minEdi7PisoFreg01,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi7PisoFreg01();
        naoDuplicar = 35;
    }
    if (layer == Edi1PisoFreg11 && naoDuplicar != 36){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 piso, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdi1PisoFreg11, ((maxEdi1PisoFreg11-minEdi1PisoFreg11)/2).toFixed(0),minEdi1PisoFreg11,0.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi1PisoFreg11();
        naoDuplicar = 36;
    }
    if (layer == Edi2PisoFreg11 && naoDuplicar != 37){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 2 pisos, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdi2PisoFreg11, ((maxEdi2PisoFreg11-minEdi2PisoFreg11)/2).toFixed(0),minEdi2PisoFreg11,0.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi2PisoFreg11();
        naoDuplicar = 37;
    }
    if (layer == Edi3PisoFreg11 && naoDuplicar != 38){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 3 pisos, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdi3PisoFreg11, ((maxEdi3PisoFreg11-minEdi3PisoFreg11)/2).toFixed(0),minEdi3PisoFreg11,0.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi3PisoFreg11();
        naoDuplicar = 38;
    }
    if (layer == Edi4PisoFreg11 && naoDuplicar != 39){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 4 pisos, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdi4PisoFreg11, ((maxEdi4PisoFreg11-minEdi4PisoFreg11)/2).toFixed(0),minEdi4PisoFreg11,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi4PisoFreg11();
        naoDuplicar = 39;
    }
    if (layer == Edi5PisoFreg11 && naoDuplicar != 40){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 5 pisos, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdi5PisoFreg11, ((maxEdi5PisoFreg11-minEdi5PisoFreg11)/2).toFixed(0),minEdi5PisoFreg11,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi5PisoFreg11();
        naoDuplicar = 40;
    }
    if (layer == Edi6PisoFreg11 && naoDuplicar != 41){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 6 pisos, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdi6PisoFreg11, ((maxEdi6PisoFreg11-minEdi6PisoFreg11)/2).toFixed(0),minEdi6PisoFreg11,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi6PisoFreg11();
        naoDuplicar = 41;
    }
    if (layer == Edi7PisoFreg11 && naoDuplicar != 42){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 7 pisos, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdi7PisoFreg11, ((maxEdi7PisoFreg11-minEdi7PisoFreg11)/2).toFixed(0),minEdi7PisoFreg11,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi7PisoFreg11();
        naoDuplicar = 42;
    }
    if (layer == Perc1PisoFreg01 && naoDuplicar != 43){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 1 piso, em 2001, por freguesia.' + '</strong>');
        legendaPerc1PisoFreg();
        slidePerc1PisoFreg01();
        naoDuplicar = 43;
    }
    if (layer == Perc2PisoFreg01 && naoDuplicar != 44){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 2 pisos, em 2001, por freguesia.' + '</strong>');
        legendaPerc2PisoFreg();
        slidePerc2PisoFreg01();
        naoDuplicar = 44;
    }
    if (layer == Perc3PisoFreg01 && naoDuplicar != 45){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com mais de 3 pisos, em 2001, por freguesia.' + '</strong>');
        legendaPerc3PisoFreg();
        slidePerc3PisoFreg01();
        naoDuplicar = 45;
    }
    if (layer == Perc1PisoFreg11 && naoDuplicar != 46){
        legendaPerc1PisoFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 1 piso, em 2011, por freguesia.' + '</strong>');
        slidePerc1PisoFreg11();
        naoDuplicar = 46;
    }
    if (layer == Perc2PisoFreg11 && naoDuplicar != 47){
        legendaPerc2PisoFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 2 pisos, em 2011, por freguesia.' + '</strong>');
        slidePerc2PisoFreg11();
        naoDuplicar = 47;
    }
    if (layer == Perc3PisoFreg11 && naoDuplicar != 48){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com mais de 3 pisos, em 2011, por freguesia.' + '</strong>');
        legendaPerc3PisoFreg();
        slidePerc3PisoFreg11();
        naoDuplicar = 48;
    }
    if (layer == Var1PisoFreg && naoDuplicar != 49){
        legendaVar1PisoFreg();
        slideVar1PisoFreg();
        naoDuplicar = 49;
    }
    if (layer == Var2PisoFreg && naoDuplicar != 50){
        legendaVar2PisoFreg();
        slideVar2PisoFreg();
        naoDuplicar = 50;
    }
    if (layer == Var3PisoFreg && naoDuplicar != 51){
        legendaVar3PisoFreg('3');
        slideVar3PisoFreg();
        naoDuplicar = 51;
    }
    if (layer == Var4PisoFreg && naoDuplicar != 52){
        legendaVar3PisoFreg('4');
        slideVar4PisoFreg();
        naoDuplicar = 52;
    }
    if (layer == Var5PisoFreg && naoDuplicar != 53){
        legendaVar3PisoFreg('5');
        slideVar5PisoFreg();
        naoDuplicar = 53;
    }
    if (layer == Var6PisoFreg && naoDuplicar != 54){
        legendaVar3PisoFreg('6');
        slideVar6PisoFreg();
        naoDuplicar = 54;
    }
    if (layer == Var7PisoFreg && naoDuplicar != 55){
        legendaVar3PisoFreg('7');
        slideVar7PisoFreg();
        naoDuplicar = 55;
    }
    layer.addTo(map);
    layerAtiva = layer;  
}

let notaRodape = function(texto){
    if ($('#notaRodape').length){
        $('#notaRodape').html(texto);
    }
    else{
        $('#painel').append("<div id='notaRodape'></div>")
        $('#notaRodape').html(texto);
    }
}

function myFunction() {
    var ano = document.getElementById("mySelect").value;
    var piso = document.getElementById("opcaoSelect").value;
    if ($('#concelho').hasClass('active2')){
        if ($('#absoluto').hasClass('active4')){
            if ((ano == "2001" || ano == "2011") && (piso == "5" || piso == "6"|| piso == "7")){
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, devendo, assim, apenas comparar' + '<b>' +  ' até ao número de edifícios superior a 5 pisos.' + '</b>')
            }
            if ((ano == "2001" || ano == "2011") && (piso != "5" && piso != "6" && piso != "7")){
                $('#notaRodape').remove();
            }
            if (ano == "2001" && piso == "1"){
                novaLayer(Pisos1Conc01);
            }
            if (ano == "2001" && piso == "2"){
                novaLayer(Pisos2Conc01);
            }
            if (ano == "2001" && piso == "3"){
                novaLayer(Pisos3Conc01);
            }
            if (ano == "2001" && piso == "4"){
                novaLayer(Pisos4Conc01);
            }
            if (ano == "2001" && piso == "5"){
                novaLayer(Pisos5Conc01);
            }
            if (ano == "2001" && piso == "6"){
                novaLayer(Pisos6Conc01);
            }
            if (ano == "2001" && piso == "7"){
                novaLayer(Pisos7Conc01);
            }
            if (ano == "2011" && piso == "1"){
                novaLayer(Pisos1Conc11);
            }
            if (ano == "2011" && piso == "2"){
                novaLayer(Pisos2Conc11);
            }
            if (ano == "2011" && piso == "3"){
                novaLayer(Pisos3Conc11);
            }
            if (ano == "2011" && piso == "4"){
                novaLayer(Pisos4Conc11);
            }
            if (ano == "2011" && piso == "5"){
                novaLayer(Pisos5Conc11);
            }
            if (ano == "2011" && piso == "6"){
                novaLayer(Pisos6Conc11);
            }
            if (ano == "2011" && piso == "7"){
                novaLayer(Pisos7Conc11);
            }
        }
        if ($('#percentagem').hasClass('active4')){
            if (ano == "2001" && piso == "1"){
                novaLayer(Perc1PisoConc01);
            }
            if (ano == "2001" && piso == "2"){
                novaLayer(Perc2PisoConc01);
            }
            if (ano == "2001" && piso == "3"){
                novaLayer(Perc3PisoConc01);
            }
            if (ano == "2011" && piso == "1"){
                novaLayer(Perc1PisoConc11);
            }
            if (ano == "2011" && piso == "2"){
                novaLayer(Perc2PisoConc11);
            }
            if (ano == "2011" && piso == "3"){
                novaLayer(Perc3PisoConc11);
            }
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if (ano == "2001" && piso == "1"){
                novaLayer(Var1PisoConc);
            }
            if (ano == "2001" && piso == "2"){
                novaLayer(Var2PisoConc);
            }
            if (ano == "2001" && piso == "3"){
                novaLayer(Var3PisoConc);
            }
            if (ano == "2001" && piso == "4"){
                novaLayer(Var4PisoConc);
            }
            if (ano == "2001" && piso == "5"){
                novaLayer(Var5PisoConc);
            }
            if (ano == "2001" && piso == "6"){
                novaLayer(Var6PisoConc);
            }
            if (ano == "2001" && piso == "7"){
                novaLayer(Var7PisoConc);
            }
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if ($('#absoluto').hasClass('active5')){
            if (ano == "2001" && piso == "1"){
                novaLayer(Edi1PisoFreg01);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, devendo, assim, apenas comparar' + '<b>' +  ' até ao número de edifícios com 3 pisos.' + '</b>')
            }
            if (ano == "2001" && piso == "2"){
                novaLayer(Edi2PisoFreg01);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, devendo, assim, apenas comparar' + '<b>' +  ' até ao número de edifícios com 3 pisos.' + '</b>')
            }
            if (ano == "2001" && piso == "3"){
                novaLayer(Edi3PisoFreg01);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, devendo, assim, apenas comparar' + '<b>' +  ' até ao número de edifícios com 3 pisos.' + '</b>')
            }
            if (ano == "2001" && piso == "4"){
                novaLayer(Edi4PisoFreg01);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, devendo, assim, apenas comparar' + '<b>' +  ' até ao número de edifícios superior a 3 pisos.' + '</b>')
            }
            if (ano == "2001" && piso == "5"){
                novaLayer(Edi5PisoFreg01);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, devendo, assim, apenas comparar' + '<b>' +  ' até ao número de edifícios superior a 3 pisos.' + '</b>')
            }
            if (ano == "2001" && piso == "6"){
                novaLayer(Edi6PisoFreg01);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, devendo, assim, apenas comparar' + '<b>' +  ' até ao número de edifícios superior a 3 pisos.' + '</b>')
            }
            if (ano == "2001" && piso == "7"){
                novaLayer(Edi7PisoFreg01);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, devendo, assim, apenas comparar' + '<b>' +  ' até ao número de edifícios superior a 3 pisos.' + '</b>')
            }
            if (ano == "2011" && piso == "1"){
                novaLayer(Edi1PisoFreg11);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, devendo, assim, apenas comparar' + '<b>' +  ' até ao número de edifícios com 3 pisos.' + '</b>')
            }
            if (ano == "2011" && piso == "2"){
                novaLayer(Edi2PisoFreg11);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, devendo, assim, apenas comparar' + '<b>' +  ' até ao número de edifícios com 3 pisos.' + '</b>')
            }
            if (ano == "2011" && piso == "3"){
                novaLayer(Edi3PisoFreg11);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, devendo, assim, apenas comparar' + '<b>' +  ' até ao número de edifícios com 3 pisos.' + '</b>')
            }
            if (ano == "2011" && piso == "4"){
                novaLayer(Edi4PisoFreg11);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, devendo, assim, apenas comparar' + '<b>' +  ' até ao número de edifícios superior a 3 pisos.' + '</b>')
            }
            if (ano == "2011" && piso == "5"){
                novaLayer(Edi5PisoFreg11);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, devendo, assim, apenas comparar' + '<b>' +  ' até ao número de edifícios superior a 3 pisos.' + '</b>')
            }
            if (ano == "2011" && piso == "6"){
                novaLayer(Edi6PisoFreg11);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, devendo, assim, apenas comparar' + '<b>' +  ' até ao número de edifícios superior a 3 pisos.' + '</b>')
            }
            if (ano == "2011" && piso == "7"){
                novaLayer(Edi7PisoFreg11);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, devendo, assim, apenas comparar' + '<b>' +  ' até ao número de edifícios superior a 3 pisos.' + '</b>')
            }
        }
        if ($('#percentagem').hasClass('active5')){
            if (ano == "2001" && piso == "1"){
                novaLayer(Perc1PisoFreg01);
            }
            if (ano == "2001" && piso == "2"){
                novaLayer(Perc2PisoFreg01);
            }
            if (ano == "2001" && piso == "3"){
                novaLayer(Perc3PisoFreg01);
            }
            if (ano == "2011" && piso == "1"){
                novaLayer(Perc1PisoFreg11);
            }
            if (ano == "2011" && piso == "2"){
                novaLayer(Perc2PisoFreg11);
            }
            if (ano == "2011" && piso == "3"){
                novaLayer(Perc3PisoFreg11);
            }
        }
        if ($('#taxaVariacao').hasClass('active5')){
            if (ano == "2001" && piso == "1"){
                novaLayer(Var1PisoFreg);
            }
            if (ano == "2001" && piso == "2"){
                novaLayer(Var2PisoFreg);
            }
            if (ano == "2001" && piso == "3"){
                novaLayer(Var3PisoFreg);
            }
            if (ano == "2001" && piso == "4"){
                novaLayer(Var4PisoFreg);
            }
            if (ano == "2001" && piso == "5"){
                novaLayer(Var5PisoFreg);
            }
            if (ano == "2001" && piso == "6"){
                novaLayer(Var6PisoFreg);
            }
            if (ano == "2001" && piso == "7"){
                novaLayer(Var7PisoFreg);
            }
        }
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
    $('#encargoMensal').remove();
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

    $('#concelho').attr("class", "butaoEscala EscalasTerritoriais  active2")
    $('#freguesias').attr("class", "butaoEscala EscalasTerritoriais ")
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
    mudarEscala()
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
    $('#encargoMensal').remove();

    $('#concelho').attr("class", "butaoEscala EscalasTerritoriais ");
    $('#freguesias').attr('class',"butaoEscala EscalasTerritoriais ");
    $('.btn').css("top","10%");

});
$('#tabelaDadosAbsolutos').click(function(){
    DadosAbsolutos();;   
});

function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }
var DadosAbsolutos = function(){
    $('#tituloMapa').html('Número de edifícios, segundo o número de pisos, entre 2001 e 2011, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/NumeroPisosProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html("2001")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Pisos == "7 Pisos"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom">'+value.Pisos+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2011.toLocaleString("fr")+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Pisos+'</td>';
                    dados += '<td>'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td>'+value.DADOS2011.toLocaleString("fr")+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})};

$('#tabelaPercentagem').click(function(){
    $('#tituloMapa').html('Proporção do número de edifícios, segundo o número de pisos, entre 2001 e 2011, %.')
        $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/NumeroPisosProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html("2001")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Pisos == "7 Pisos"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Pisos+'</td>';
                    dados += '<td class="borderbottom">'+value.Per01+'</td>';
                    dados += '<td class="borderbottom">'+value.Per11+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Pisos+'</td>';
                    dados += '<td>'+value.Per01+'</td>';
                    dados += '<td>'+value.Per11+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});

$('#tabelaVariacao').click(function(){  
    $('#tituloMapa').html('Variação do número de edifícios, segundo o número de pisos, entre 2001 e 2011, %.')
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/NumeroPisosProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Pisos == "7 Pisos"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Pisos+'</td>';
                    dados += '<td class="borderbottom">'+ ''+'</td>';
                    dados += '<td class="borderbottom">'+value.VAR1101+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Pisos+'</td>';
                    dados += '<td>'+ ''+'</td>';
                    dados += '<td>'+value.VAR1101+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});

let primeirovalor = function(ano,piso){
    $("#mySelect").val(ano);
    $("#opcaoSelect").val(piso);
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
let reporAnos = function(){
    if ($('#absoluto').hasClass('active4') || $('#absoluto').hasClass('active5') || $('#percentagem').hasClass('active4') ||  $('#percentagem').hasClass('active5')){
        $('select option:contains("2001")').text('2001');
        if ($("#mySelect option[value='2011']").length == 0){ 
            $('#mySelect')
            .append('<option value="2011">2011</option>')
        }
    }
    if ($('#taxaVariacao').hasClass('active4') || $('#taxaVariacao').hasClass('active5')){
        $('select option:contains("2001")').text('2011 - 2001');
        $("#mySelect option[value='2011']").remove();
    }
    primeirovalor('2001','1');
}

let reporAnosPercentagem = function(){
    if ($('#percentagem').hasClass('active4') || $('#percentagem').hasClass('active5')){
        $("#opcaoSelect option[value='7']").remove();
        $("#opcaoSelect option[value='6']").remove();
        $("#opcaoSelect option[value='5']").remove(); 
        $("#opcaoSelect option[value='4']").remove();
        $('select option:contains("3")').text('Mais de 3 pisos');
    }
    if ($('#taxaVariacao').hasClass('active4') || $('#taxaVariacao').hasClass('active5') || $('#absoluto').hasClass('active4') || $('#absoluto').hasClass('active5')){
        if ($("#opcaoSelect option[value='4']").length == 0){ 
            $('#opcaoSelect')
            .append('<option value="4">4 pisos</option>')
            .append('<option value="5">5 pisos</option>')
            .append('<option value="6">6 pisos</option>')
            .append('<option value="7">7 pisos</option>')
            $('select option:contains("3")').text('3 pisos');
        }
    }
}
let fonteTitulo = function(valor){
    if(valor == 'N'){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' INE, Recenseamento da população e habitação.' );
    }
    else{
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' Cálculos próprios; INE, Recenseamento da população e habitação.' );
    }
}
function mudarEscala(){
    reporAnosPercentagem();
    reporAnos();
    tamanhoOutros();
    fonteTitulo('N');
}
$('#absoluto').click(function(){
    mudarEscala();
});
$('#percentagem').click(function(){
    $('#notaRodape').remove();
    mudarEscala();  
    fonteTitulo('F');
});
$('#taxaVariacao').click(function(){
    $('#notaRodape').remove();
    mudarEscala();
    fonteTitulo('F');
});

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

        $('#absoluto').attr('class',"butao active4")
        $('#percentagem').attr('class',"butao")
        $('#taxaVariacao').attr('class',"butao")
        mudarEscala();
    }

}

let variaveisMapaFreguesias = function(){
    if($('#absoluto').hasClass('active5')){
        return false;
    }
    else{
        $('#absoluto').attr('class',"butao active5")
        $('#percentagem').attr('class',"butao")
        $('#taxaVariacao').attr('class',"butao")
        mudarEscala();
    }
}


let anosSelecionados = function() {
    let anos = document.getElementById("mySelect").value;

    if ($('#concelho').hasClass("active2")){
            if (anos != "2011"){
                i = 1 ;
            }
            if (anos == "2001"){
                i = 0 ;
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
    event.target.style.width = `${tempSelectWidth +15}px`;
    tempSelect.remove();
});
     
alterarTamanho.dispatchEvent(new Event('change'));
