
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'

$('#temporal').css("padding-top","0px");
$('#tituloMapa').css('font-size','9pt')
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
    div.innerHTML = '<img src="../../../imagens/norte.png" alt="Orientação" height="40px" width="23px">';
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
var contornoFreg =L.geoJSON(dadosRelativosFreguesias,{
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
var ifSlide2isActive = 7;
let slidersGeral = document.getElementById('slidersGeral');
let inputNumberMin = document.getElementById('input-number-min');
let inputNumberMax = document.getElementById('input-number-max');
let esconderano2001 = document.getElementById('2001');
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

//////////////////////////////////////////----------- Alojamentos AQUECIMENTO CENTRAL EM 2011 ------------------------------\\\\\\\\\\\\\

var minAquecCentralConc_11 = 0;
var maxAquecCentralConc_11 = 0;
function estiloAquecCentralConc_11(feature, latlng) {
    if(feature.properties.C_AL_AC11< minAquecCentralConc_11 || minAquecCentralConc_11 ===0){
        minAquecCentralConc_11 = feature.properties.C_AL_AC11
    }
    if(feature.properties.C_AL_AC11> maxAquecCentralConc_11){
        maxAquecCentralConc_11 = feature.properties.C_AL_AC11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.C_AL_AC11,0.2)
    });
}
function apagarAquecCentralConc_11(e){
    var layer = e.target;
    AquecCentralConc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAquecCentralConc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aquecimento central:  ' + '<b>' +feature.properties.C_AL_AC11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAquecCentralConc_11,
    })
};

var AquecCentralConc_11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloAquecCentralConc_11,
    onEachFeature: onEachFeatureAquecCentralConc_11,
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




var slideAquecCentralConc_11 = function(){
    var sliderAquecCentralConc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderAquecCentralConc_11, {
        start: [minAquecCentralConc_11, maxAquecCentralConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAquecCentralConc_11,
            'max': maxAquecCentralConc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAquecCentralConc_11);
    inputNumberMax.setAttribute("value",maxAquecCentralConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderAquecCentralConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAquecCentralConc_11.noUiSlider.set([null, this.value]);
    });

    sliderAquecCentralConc_11.noUiSlider.on('update',function(e){
        AquecCentralConc_11.eachLayer(function(layer){
            if(layer.feature.properties.C_AL_AC11>=parseFloat(e[0])&& layer.feature.properties.C_AL_AC11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAquecCentralConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderAquecCentralConc_11.noUiSlider;
    $(slidersGeral).append(sliderAquecCentralConc_11);
}

///////////////////////////-------------------- FIM ALOJAMENTO AQUECIMENTO CENTRAL ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- Alojamentos  LAREIRA  EM 2011 ------------------------------\\\\\\\\\\\\\

var minLareiraConc_11 = 0;
var maxLareiraConc_11 = 0;
function estiloLareiraConc_11(feature, latlng) {
    if(feature.properties.C_AL_LAR11< minLareiraConc_11 || minLareiraConc_11 ===0){
        minLareiraConc_11 = feature.properties.C_AL_LAR11
    }
    if(feature.properties.C_AL_LAR11> maxLareiraConc_11){
        maxLareiraConc_11 = feature.properties.C_AL_LAR11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.C_AL_LAR11,0.2)
    });
}
function apagarLareiraConc_11(e){
    var layer = e.target;
    LareiraConc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureLareiraConc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com lareira aberta:  ' + '<b>' +feature.properties.C_AL_LAR11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarLareiraConc_11,
    })
};

var LareiraConc_11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloLareiraConc_11,
    onEachFeature: onEachFeatureLareiraConc_11,
});


var slideLareiraConc_11 = function(){
    var sliderLareiraConc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderLareiraConc_11, {
        start: [minLareiraConc_11, maxLareiraConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minLareiraConc_11,
            'max': maxLareiraConc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minLareiraConc_11);
    inputNumberMax.setAttribute("value",maxLareiraConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderLareiraConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderLareiraConc_11.noUiSlider.set([null, this.value]);
    });

    sliderLareiraConc_11.noUiSlider.on('update',function(e){
        LareiraConc_11.eachLayer(function(layer){
            if(layer.feature.properties.C_AL_LAR11>=parseFloat(e[0])&& layer.feature.properties.C_AL_LAR11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderLareiraConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderLareiraConc_11.noUiSlider;
    $(slidersGeral).append(sliderLareiraConc_11);
}


///////////////////////////-------------------- FIM ALOJAMENTO LAREIRA ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- Alojamentos  RECUPERADOR CALOR  EM 2011 ------------------------------\\\\\\\\\\\\\

var minRecuperadorConc_11 = 0;
var maxRecuperadorConc_11 = 0;
function estiloRecuperadorConc_11(feature, latlng) {
    if(feature.properties.C_AL_REC11< minRecuperadorConc_11 || minRecuperadorConc_11 ===0){
        minRecuperadorConc_11 = feature.properties.C_AL_REC11
    }
    if(feature.properties.C_AL_REC11> maxRecuperadorConc_11){
        maxRecuperadorConc_11 = feature.properties.C_AL_REC11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.C_AL_REC11,0.2)
    });
}
function apagarRecuperadorConc_11(e){
    var layer = e.target;
    RecuperadorConc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureRecuperadorConc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com Recuperador de calor:  ' + '<b>' +feature.properties.C_AL_REC11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarRecuperadorConc_11,
    })
};

var RecuperadorConc_11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloRecuperadorConc_11,
    onEachFeature: onEachFeatureRecuperadorConc_11,
});


var slideRecuperadorConc_11 = function(){
    var sliderRecuperadorConc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderRecuperadorConc_11, {
        start: [minRecuperadorConc_11, maxRecuperadorConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minRecuperadorConc_11,
            'max': maxRecuperadorConc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minRecuperadorConc_11);
    inputNumberMax.setAttribute("value",maxRecuperadorConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderRecuperadorConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRecuperadorConc_11.noUiSlider.set([null, this.value]);
    });

    sliderRecuperadorConc_11.noUiSlider.on('update',function(e){
        RecuperadorConc_11.eachLayer(function(layer){
            if(layer.feature.properties.C_AL_REC11>=parseFloat(e[0])&& layer.feature.properties.C_AL_REC11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderRecuperadorConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderRecuperadorConc_11.noUiSlider;
    $(slidersGeral).append(sliderRecuperadorConc_11);
}


///////////////////////////-------------------- FIM RECUPERADOR CALOR ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////----------- Alojamentos  APARELHOS MÓVEIS  EM 2011 ------------------------------\\\\\\\\\\\\\

var minAparelhosMoveisConc_11 = 0;
var maxAparelhosMoveisConc_11 = 0;
function estiloAparelhosMoveisConc_11(feature, latlng) {
    if(feature.properties.C_AL_APM11< minAparelhosMoveisConc_11 || minAparelhosMoveisConc_11 ===0){
        minAparelhosMoveisConc_11 = feature.properties.C_AL_APM11
    }
    if(feature.properties.C_AL_APM11> maxAparelhosMoveisConc_11){
        maxAparelhosMoveisConc_11 = feature.properties.C_AL_APM11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.C_AL_APM11,0.2)
    });
}
function apagarAparelhosMoveisConc_11(e){
    var layer = e.target;
    AparelhosMoveisConc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAparelhosMoveisConc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aparelhos móveis:  ' + '<b>' +feature.properties.C_AL_APM11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAparelhosMoveisConc_11,
    })
};

var AparelhosMoveisConc_11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloAparelhosMoveisConc_11,
    onEachFeature: onEachFeatureAparelhosMoveisConc_11,
});


var slideAparelhosMoveisConc_11 = function(){
    var sliderAparelhosMoveisConc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderAparelhosMoveisConc_11, {
        start: [minAparelhosMoveisConc_11, maxAparelhosMoveisConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhosMoveisConc_11,
            'max': maxAparelhosMoveisConc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAparelhosMoveisConc_11);
    inputNumberMax.setAttribute("value",maxAparelhosMoveisConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhosMoveisConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhosMoveisConc_11.noUiSlider.set([null, this.value]);
    });

    sliderAparelhosMoveisConc_11.noUiSlider.on('update',function(e){
        AparelhosMoveisConc_11.eachLayer(function(layer){
            if(layer.feature.properties.C_AL_APM11>=parseFloat(e[0])&& layer.feature.properties.C_AL_APM11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAparelhosMoveisConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderAparelhosMoveisConc_11.noUiSlider;
    $(slidersGeral).append(sliderAparelhosMoveisConc_11);
}


///////////////////////////-------------------- FIM APARELHOS MÓVEIS ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////----------- Alojamentos  APARELHOS Fixos  EM 2011 ------------------------------\\\\\\\\\\\\\

var minAparelhosFixosConc_11 = 0;
var maxAparelhosFixosConc_11 = 0;
function estiloAparelhosFixosConc_11(feature, latlng) {
    if(feature.properties.C_AL_APF11< minAparelhosFixosConc_11 || minAparelhosFixosConc_11 ===0){
        minAparelhosFixosConc_11 = feature.properties.C_AL_APF11
    }
    if(feature.properties.C_AL_APF11> maxAparelhosFixosConc_11){
        maxAparelhosFixosConc_11 = feature.properties.C_AL_APF11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.C_AL_APF11,0.2)
    });
}
function apagarAparelhosFixosConc_11(e){
    var layer = e.target;
    AparelhosFixosConc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAparelhosFixosConc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com Aparelhos Fixos:  ' + '<b>' +feature.properties.C_AL_APF11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAparelhosFixosConc_11,
    })
};

var AparelhosFixosConc_11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloAparelhosFixosConc_11,
    onEachFeature: onEachFeatureAparelhosFixosConc_11,
});


var slideAparelhosFixosConc_11 = function(){
    var sliderAparelhosFixosConc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderAparelhosFixosConc_11, {
        start: [minAparelhosFixosConc_11, maxAparelhosFixosConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhosFixosConc_11,
            'max': maxAparelhosFixosConc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAparelhosFixosConc_11);
    inputNumberMax.setAttribute("value",maxAparelhosFixosConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhosFixosConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhosFixosConc_11.noUiSlider.set([null, this.value]);
    });

    sliderAparelhosFixosConc_11.noUiSlider.on('update',function(e){
        AparelhosFixosConc_11.eachLayer(function(layer){
            if(layer.feature.properties.C_AL_APF11>=parseFloat(e[0])&& layer.feature.properties.C_AL_APF11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAparelhosFixosConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderAparelhosFixosConc_11.noUiSlider;
    $(slidersGeral).append(sliderAparelhosFixosConc_11);
}


///////////////////////////-------------------- FIM APARELHOS Fixos ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////----------- Alojamentos  NENHUM  EM 2011 ------------------------------\\\\\\\\\\\\\

var minNenhumConc_11 = 0;
var maxNenhumConc_11 = 0;
function estiloNenhumConc_11(feature, latlng) {
    if(feature.properties.C_AL_Nen11< minNenhumConc_11 || minNenhumConc_11 ===0){
        minNenhumConc_11 = feature.properties.C_AL_Nen11
    }
    if(feature.properties.C_AL_Nen11> maxNenhumConc_11){
        maxNenhumConc_11 = feature.properties.C_AL_Nen11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.C_AL_Nen11,0.2)
    });
}
function apagarNenhumConc_11(e){
    var layer = e.target;
    NenhumConc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureNenhumConc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem aquecimento:  ' + '<b>' +feature.properties.C_AL_Nen11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarNenhumConc_11,
    })
};

var NenhumConc_11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloNenhumConc_11,
    onEachFeature: onEachFeatureNenhumConc_11,
});


var slideNenhumConc_11 = function(){
    var sliderNenhumConc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderNenhumConc_11, {
        start: [minNenhumConc_11, maxNenhumConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minNenhumConc_11,
            'max': maxNenhumConc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minNenhumConc_11);
    inputNumberMax.setAttribute("value",maxNenhumConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderNenhumConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderNenhumConc_11.noUiSlider.set([null, this.value]);
    });

    sliderNenhumConc_11.noUiSlider.on('update',function(e){
        NenhumConc_11.eachLayer(function(layer){
            if(layer.feature.properties.C_AL_Nen11>=parseFloat(e[0])&& layer.feature.properties.C_AL_Nen11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderNenhumConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderNenhumConc_11.noUiSlider;
    $(slidersGeral).append(sliderNenhumConc_11);
}


///////////////////////////-------------------- FIM APARELHOS Fixos ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- Alojamentos AQUECIMENTO CENTRAL EM 2001 ------------------------------\\\\\\\\\\\\\

var minAquecCentralConc_01 = 0;
var maxAquecCentralConc_01 = 0;
function estiloAquecCentralConc_01(feature, latlng) {
    if(feature.properties.C_AL_AC01< minAquecCentralConc_01 || minAquecCentralConc_01 ===0){
        minAquecCentralConc_01 = feature.properties.C_AL_AC01
    }
    if(feature.properties.C_AL_AC01> maxAquecCentralConc_01){
        maxAquecCentralConc_01 = feature.properties.C_AL_AC01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.C_AL_AC01,0.2)
    });
}
function apagarAquecCentralConc_01(e){
    var layer = e.target;
    AquecCentralConc_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAquecCentralConc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aquecimento central:  ' + '<b>' +feature.properties.C_AL_AC01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAquecCentralConc_01,
    })
};

var AquecCentralConc_01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloAquecCentralConc_01,
    onEachFeature: onEachFeatureAquecCentralConc_01,
});

var slideAquecCentralConc_01 = function(){
    var sliderAquecCentralConc_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderAquecCentralConc_01, {
        start: [minAquecCentralConc_01, maxAquecCentralConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAquecCentralConc_01,
            'max': maxAquecCentralConc_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAquecCentralConc_01);
    inputNumberMax.setAttribute("value",maxAquecCentralConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderAquecCentralConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAquecCentralConc_01.noUiSlider.set([null, this.value]);
    });

    sliderAquecCentralConc_01.noUiSlider.on('update',function(e){
        AquecCentralConc_01.eachLayer(function(layer){
            if(layer.feature.properties.C_AL_AC01>=parseFloat(e[0])&& layer.feature.properties.C_AL_AC01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAquecCentralConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderAquecCentralConc_01.noUiSlider;
    $(slidersGeral).append(sliderAquecCentralConc_01);
}
contorno.addTo(map)
AquecCentralConc_01.addTo(map);
$('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com aquecimento central, em 2001, por concelho.' + '</strong>');
legenda(maxAquecCentralConc_01, ((maxAquecCentralConc_01-minAquecCentralConc_01)/2).toFixed(0),minAquecCentralConc_01,0.2);
slideAquecCentralConc_01();

///////////////////////////-------------------- FIM ALOJAMENTO AQUECIMENTO CENTRAL ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- Alojamentos  LAREIRA  EM 2001 ------------------------------\\\\\\\\\\\\\

var minLareiraConc_01 = 0;
var maxLareiraConc_01 = 0;
function estiloLareiraConc_01(feature, latlng) {
    if(feature.properties.C_AL_LAR01< minLareiraConc_01 || minLareiraConc_01 ===0){
        minLareiraConc_01 = feature.properties.C_AL_LAR01
    }
    if(feature.properties.C_AL_LAR01> maxLareiraConc_01){
        maxLareiraConc_01 = feature.properties.C_AL_LAR01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.C_AL_LAR01,0.2)
    });
}
function apagarLareiraConc_01(e){
    var layer = e.target;
    LareiraConc_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureLareiraConc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com lareira aberta:  ' + '<b>' +feature.properties.C_AL_LAR01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarLareiraConc_01,
    })
};

var LareiraConc_01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloLareiraConc_01,
    onEachFeature: onEachFeatureLareiraConc_01,
});


var slideLareiraConc_01 = function(){
    var sliderLareiraConc_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderLareiraConc_01, {
        start: [minLareiraConc_01, maxLareiraConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minLareiraConc_01,
            'max': maxLareiraConc_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minLareiraConc_01);
    inputNumberMax.setAttribute("value",maxLareiraConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderLareiraConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderLareiraConc_01.noUiSlider.set([null, this.value]);
    });

    sliderLareiraConc_01.noUiSlider.on('update',function(e){
        LareiraConc_01.eachLayer(function(layer){
            if(layer.feature.properties.C_AL_LAR01>=parseFloat(e[0])&& layer.feature.properties.C_AL_LAR01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderLareiraConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderLareiraConc_01.noUiSlider;
    $(slidersGeral).append(sliderLareiraConc_01);
}


///////////////////////////-------------------- FIM ALOJAMENTO LAREIRA ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////----------- Alojamentos  APARELHOS MÓVEIS  EM 2001 ------------------------------\\\\\\\\\\\\\

var minAparelhosMoveisConc_01 = 0;
var maxAparelhosMoveisConc_01 = 0;
function estiloAparelhosMoveisConc_01(feature, latlng) {
    if(feature.properties.C_AL_APM01< minAparelhosMoveisConc_01 || minAparelhosMoveisConc_01 ===0){
        minAparelhosMoveisConc_01 = feature.properties.C_AL_APM01
    }
    if(feature.properties.C_AL_APM01> maxAparelhosMoveisConc_01){
        maxAparelhosMoveisConc_01 = feature.properties.C_AL_APM01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.C_AL_APM01,0.2)
    });
}
function apagarAparelhosMoveisConc_01(e){
    var layer = e.target;
    AparelhosMoveisConc_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAparelhosMoveisConc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aparelhos móveis:  ' + '<b>' +feature.properties.C_AL_APM01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAparelhosMoveisConc_01,
    })
};

var AparelhosMoveisConc_01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloAparelhosMoveisConc_01,
    onEachFeature: onEachFeatureAparelhosMoveisConc_01,
});


var slideAparelhosMoveisConc_01 = function(){
    var sliderAparelhosMoveisConc_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderAparelhosMoveisConc_01, {
        start: [minAparelhosMoveisConc_01, maxAparelhosMoveisConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhosMoveisConc_01,
            'max': maxAparelhosMoveisConc_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAparelhosMoveisConc_01);
    inputNumberMax.setAttribute("value",maxAparelhosMoveisConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhosMoveisConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhosMoveisConc_01.noUiSlider.set([null, this.value]);
    });

    sliderAparelhosMoveisConc_01.noUiSlider.on('update',function(e){
        AparelhosMoveisConc_01.eachLayer(function(layer){
            if(layer.feature.properties.C_AL_APM01>=parseFloat(e[0])&& layer.feature.properties.C_AL_APM01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAparelhosMoveisConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderAparelhosMoveisConc_01.noUiSlider;
    $(slidersGeral).append(sliderAparelhosMoveisConc_01);
}


///////////////////////////-------------------- FIM APARELHOS MÓVEIS ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////----------- Alojamentos  APARELHOS Fixos  EM 2001 ------------------------------\\\\\\\\\\\\\

var minAparelhosFixosConc_01 = 0;
var maxAparelhosFixosConc_01 = 0;
function estiloAparelhosFixosConc_01(feature, latlng) {
    if(feature.properties.C_AL_APF01< minAparelhosFixosConc_01 || minAparelhosFixosConc_01 ===0){
        minAparelhosFixosConc_01 = feature.properties.C_AL_APF01
    }
    if(feature.properties.C_AL_APF01> maxAparelhosFixosConc_01){
        maxAparelhosFixosConc_01 = feature.properties.C_AL_APF01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.C_AL_APF01,0.2)
    });
}
function apagarAparelhosFixosConc_01(e){
    var layer = e.target;
    AparelhosFixosConc_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAparelhosFixosConc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com Aparelhos Fixos:  ' + '<b>' +feature.properties.C_AL_APF01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAparelhosFixosConc_01,
    })
};

var AparelhosFixosConc_01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloAparelhosFixosConc_01,
    onEachFeature: onEachFeatureAparelhosFixosConc_01,
});


var slideAparelhosFixosConc_01 = function(){
    var sliderAparelhosFixosConc_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderAparelhosFixosConc_01, {
        start: [minAparelhosFixosConc_01, maxAparelhosFixosConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhosFixosConc_01,
            'max': maxAparelhosFixosConc_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAparelhosFixosConc_01);
    inputNumberMax.setAttribute("value",maxAparelhosFixosConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhosFixosConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhosFixosConc_01.noUiSlider.set([null, this.value]);
    });

    sliderAparelhosFixosConc_01.noUiSlider.on('update',function(e){
        AparelhosFixosConc_01.eachLayer(function(layer){
            if(layer.feature.properties.C_AL_APF01>=parseFloat(e[0])&& layer.feature.properties.C_AL_APF01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAparelhosFixosConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderAparelhosFixosConc_01.noUiSlider;
    $(slidersGeral).append(sliderAparelhosFixosConc_01);
}


///////////////////////////-------------------- FIM APARELHOS Fixos ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////----------- Alojamentos  NENHUM  EM 2001 ------------------------------\\\\\\\\\\\\\

var minNenhumConc_01 = 0;
var maxNenhumConc_01 = 0;
function estiloNenhumConc_01(feature, latlng) {
    if(feature.properties.C_AL_Nen01< minNenhumConc_01 || minNenhumConc_01 ===0){
        minNenhumConc_01 = feature.properties.C_AL_Nen01
    }
    if(feature.properties.C_AL_Nen01> maxNenhumConc_01){
        maxNenhumConc_01 = feature.properties.C_AL_Nen01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.C_AL_Nen01,0.2)
    });
}
function apagarNenhumConc_01(e){
    var layer = e.target;
    NenhumConc_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureNenhumConc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem aquecimento:  ' + '<b>' +feature.properties.C_AL_Nen01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarNenhumConc_01,
    })
};

var NenhumConc_01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloNenhumConc_01,
    onEachFeature: onEachFeatureNenhumConc_01,
});


var slideNenhumConc_01 = function(){
    var sliderNenhumConc_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderNenhumConc_01, {
        start: [minNenhumConc_01, maxNenhumConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minNenhumConc_01,
            'max': maxNenhumConc_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minNenhumConc_01);
    inputNumberMax.setAttribute("value",maxNenhumConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderNenhumConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderNenhumConc_01.noUiSlider.set([null, this.value]);
    });

    sliderNenhumConc_01.noUiSlider.on('update',function(e){
        NenhumConc_01.eachLayer(function(layer){
            if(layer.feature.properties.C_AL_Nen01>=parseFloat(e[0])&& layer.feature.properties.C_AL_Nen01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderNenhumConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderNenhumConc_01.noUiSlider;
    $(slidersGeral).append(sliderNenhumConc_01);
}


///////////////////////////-------------------- FIM APARELHOS Fixos ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////////////////////// FIM DADOS ABSOLUTOS CONCELHO--------------\\\\\\\\\\\\\\\
//////////////////////////////////////--------------- DADOS RELATIVOS CONCELHOS  -------------\\\\\\\\\\\\\\\\\\\\\

/////////////////////------------------- PERCENTAGEM Alojamentos AQUECIMENTO CENTRAL EM 2011 POR CONCELHO-----//\\\\\\\\//////////////////////

var minAquecimentoCentralConc11 = 0;
var maxAquecimentoCentralConc11 = 0;

function CorPerAquecimentoCentralConc(d) {
    return d >= 22.28 ? '#8c0303' :
        d >= 19.25  ? '#de1f35' :
        d >= 14.19 ? '#ff5e6e' :
        d >= 9.14   ? '#f5b3be' :
        d >= 4.08   ? '#F2C572' :
                ''  ;
}
var legendaPerAquecimentoCentralConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 22.28' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 19.25 a 22.28' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 14.19 a 19.25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 9.14 a 14.19' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 4.08 a 9.14' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloAquecimentoCentralConc11(feature) {
    if( feature.properties.PercAC11 <= minAquecimentoCentralConc11 || minAquecimentoCentralConc11 === 0){
        minAquecimentoCentralConc11 = feature.properties.PercAC11
    }
    if(feature.properties.PercAC11 >= maxAquecimentoCentralConc11 ){
        maxAquecimentoCentralConc11 = feature.properties.PercAC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAquecimentoCentralConc(feature.properties.PercAC11)
    };
}
function apagarAquecimentoCentralConc11(e) {
    AquecimentoCentralConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAquecimentoCentralConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aquecimento central: ' + '<b>' + feature.properties.PercAC11.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAquecimentoCentralConc11,
    });
}
var AquecimentoCentralConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloAquecimentoCentralConc11,
    onEachFeature: onEachFeatureAquecimentoCentralConc11
});
let slideAquecimentoCentralConc11 = function(){
    var sliderAquecimentoCentralConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAquecimentoCentralConc11, {
        start: [minAquecimentoCentralConc11, maxAquecimentoCentralConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAquecimentoCentralConc11,
            'max': maxAquecimentoCentralConc11
        },
        });
    inputNumberMin.setAttribute("value",minAquecimentoCentralConc11);
    inputNumberMax.setAttribute("value",maxAquecimentoCentralConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderAquecimentoCentralConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAquecimentoCentralConc11.noUiSlider.set([null, this.value]);
    });

    sliderAquecimentoCentralConc11.noUiSlider.on('update',function(e){
        AquecimentoCentralConc11.eachLayer(function(layer){
            if(layer.feature.properties.PercAC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercAC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAquecimentoCentralConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderAquecimentoCentralConc11.noUiSlider;
    $(slidersGeral).append(sliderAquecimentoCentralConc11);
} 

/////////////////////////////////// Fim PERCENTAGEM Alojamentos AQUECIMENTO CENTRAL 2011 Concelho -------------- \\\\\\

/////////////////////------------------- PERCENTAGEM Alojamentos LAREIRA EM 2011 POR CONCELHO-----///////////////////////

var minLareiraAbertaConc11 = 0;
var maxLareiraAbertaConc11 = 0;

function CorPerLareiraAbertaConc(d) {
    return d >= 70.94 ? '#8c0303' :
        d >= 59.37  ? '#de1f35' :
        d >= 40.08 ? '#ff5e6e' :
        d >= 20.79   ? '#f5b3be' :
        d >= 1.5   ? '#F2C572' :
                ''  ;
}
var legendaPerLareiraAbertaConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 70.94' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 59.37 a 70.94' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 40.08 a 59.37' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 20.79 a 40.08' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 1.5 a 20.79' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloLareiraAbertaConc11(feature) {
    if( feature.properties.PercLAR11 <= minLareiraAbertaConc11 || minLareiraAbertaConc11 === 0){
        minLareiraAbertaConc11 = feature.properties.PercLAR11
    }
    if(feature.properties.PercLAR11 >= maxLareiraAbertaConc11 ){
        maxLareiraAbertaConc11 = feature.properties.PercLAR11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerLareiraAbertaConc(feature.properties.PercLAR11)
    };
}
function apagarLareiraAbertaConc11(e) {
    LareiraAbertaConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureLareiraAbertaConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com lareira aberta: ' + '<b>' + feature.properties.PercLAR11.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarLareiraAbertaConc11,
    });
}
var LareiraAbertaConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloLareiraAbertaConc11,
    onEachFeature: onEachFeatureLareiraAbertaConc11
});
let slideLareiraAbertaConc11 = function(){
    var sliderLareiraAbertaConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderLareiraAbertaConc11, {
        start: [minLareiraAbertaConc11, maxLareiraAbertaConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minLareiraAbertaConc11,
            'max': maxLareiraAbertaConc11
        },
        });
    inputNumberMin.setAttribute("value",minLareiraAbertaConc11);
    inputNumberMax.setAttribute("value",maxLareiraAbertaConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderLareiraAbertaConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderLareiraAbertaConc11.noUiSlider.set([null, this.value]);
    });

    sliderLareiraAbertaConc11.noUiSlider.on('update',function(e){
        LareiraAbertaConc11.eachLayer(function(layer){
            if(layer.feature.properties.PercLAR11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercLAR11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderLareiraAbertaConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderLareiraAbertaConc11.noUiSlider;
    $(slidersGeral).append(sliderLareiraAbertaConc11);
} 

/////////////////////////////////// Fim PERCENTAGEM Alojamentos LAREIRA 2011 Concelho -------------- \\\\\\

/////////////////////------------------- PERCENTAGEM Alojamentos RECUPERADOR CALOR EM 2011 POR CONCELHO-----///////////////////////

var minRecuperadorCalorConc11 = 0;
var maxRecuperadorCalorConc11 = 0;

function CorPerRecuperadorCalorConc(d) {
    return d >= 14.18 ? '#8c0303' :
        d >= 12.19  ? '#de1f35' :
        d >= 8.87 ? '#ff5e6e' :
        d >= 5.54   ? '#f5b3be' :
        d >= 2.22   ? '#F2C572' :
                ''  ;
}
var legendaPerRecuperadorCalorConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 14.18' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 12.19 a 14.18' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 8.87 a 12.19' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 5.54 a 8.87' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 2.22 a 5.54' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloRecuperadorCalorConc11(feature) {
    if( feature.properties.PercREC11 <= minRecuperadorCalorConc11 || minRecuperadorCalorConc11 === 0){
        minRecuperadorCalorConc11 = feature.properties.PercREC11
    }
    if(feature.properties.PercREC11 >= maxRecuperadorCalorConc11 ){
        maxRecuperadorCalorConc11 = feature.properties.PercREC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRecuperadorCalorConc(feature.properties.PercREC11)
    };
}
function apagarRecuperadorCalorConc11(e) {
    RecuperadorCalorConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRecuperadorCalorConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com recuperador de calor: ' + '<b>' + feature.properties.PercREC11.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRecuperadorCalorConc11,
    });
}
var RecuperadorCalorConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloRecuperadorCalorConc11,
    onEachFeature: onEachFeatureRecuperadorCalorConc11
});
let slideRecuperadorCalorConc11 = function(){
    var sliderRecuperadorCalorConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRecuperadorCalorConc11, {
        start: [minRecuperadorCalorConc11, maxRecuperadorCalorConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minRecuperadorCalorConc11,
            'max': maxRecuperadorCalorConc11
        },
        });
    inputNumberMin.setAttribute("value",minRecuperadorCalorConc11);
    inputNumberMax.setAttribute("value",maxRecuperadorCalorConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderRecuperadorCalorConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRecuperadorCalorConc11.noUiSlider.set([null, this.value]);
    });

    sliderRecuperadorCalorConc11.noUiSlider.on('update',function(e){
        RecuperadorCalorConc11.eachLayer(function(layer){
            if(layer.feature.properties.PercREC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercREC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRecuperadorCalorConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderRecuperadorCalorConc11.noUiSlider;
    $(slidersGeral).append(sliderRecuperadorCalorConc11);
} 

/////////////////////////////////// Fim PERCENTAGEM Alojamentos Recuperador CALOR 2011 Concelho -------------- \\\\\\

/////////////////////------------------- PERCENTAGEM Alojamentos APARELHOS MÓVEIS EM 2011 POR CONCELHO-----///////////////////////

var minAparelhosMoveisConc11 = 0;
var maxAparelhosMoveisConc11 = 0;

function CorPerAparelhosMoveisConc(d) {
    return d >= 56.91 ? '#8c0303' :
        d >= 48.32  ? '#de1f35' :
        d >= 34.02 ? '#ff5e6e' :
        d >= 19.71   ? '#f5b3be' :
        d >= 5   ? '#F2C572' :
                ''  ;
}
var legendaPerAparelhosMoveisConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 56.91' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 48.32 a 56.91' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 34.02 a 48.32' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 19.71 a 34.02' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 5 a 19.71' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloAparelhosMoveisConc11(feature) {
    if( feature.properties.PercAPM11 <= minAparelhosMoveisConc11 || minAparelhosMoveisConc11 === 0){
        minAparelhosMoveisConc11 = feature.properties.PercAPM11
    }
    if(feature.properties.PercAPM11 >= maxAparelhosMoveisConc11 ){
        maxAparelhosMoveisConc11 = feature.properties.PercAPM11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAparelhosMoveisConc(feature.properties.PercAPM11)
    };
}
function apagarAparelhosMoveisConc11(e) {
    AparelhosMoveisConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAparelhosMoveisConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aparelhos móveis: ' + '<b>' + feature.properties.PercAPM11.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAparelhosMoveisConc11,
    });
}
var AparelhosMoveisConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloAparelhosMoveisConc11,
    onEachFeature: onEachFeatureAparelhosMoveisConc11
});
let slideAparelhosMoveisConc11 = function(){
    var sliderAparelhosMoveisConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAparelhosMoveisConc11, {
        start: [minAparelhosMoveisConc11, maxAparelhosMoveisConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhosMoveisConc11,
            'max': maxAparelhosMoveisConc11
        },
        });
    inputNumberMin.setAttribute("value",minAparelhosMoveisConc11);
    inputNumberMax.setAttribute("value",maxAparelhosMoveisConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhosMoveisConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhosMoveisConc11.noUiSlider.set([null, this.value]);
    });

    sliderAparelhosMoveisConc11.noUiSlider.on('update',function(e){
        AparelhosMoveisConc11.eachLayer(function(layer){
            if(layer.feature.properties.PercAPM11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercAPM11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAparelhosMoveisConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderAparelhosMoveisConc11.noUiSlider;
    $(slidersGeral).append(sliderAparelhosMoveisConc11);
} 

/////////////////////////////////// Fim PERCENTAGEM Alojamentos APARELHOS MÓVEIS 2011 Concelho -------------- \\\\\\

/////////////////////------------------- PERCENTAGEM Alojamentos APARELHOS Fixos EM 2011 POR CONCELHO-----///////////////////////

var minAparelhosFixosConc11 = 0;
var maxAparelhosFixosConc11 = 0;

function CorPerAparelhosFixosConc(d) {
    return d >= 19.03 ? '#8c0303' :
        d >= 16.3  ? '#de1f35' :
        d >= 11.74 ? '#ff5e6e' :
        d >= 7.19   ? '#f5b3be' :
        d >= 2.63   ? '#F2C572' :
                ''  ;
}
var legendaPerAparelhosFixosConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 19.03' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 16.3 a 19.03' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 11.74 a 16.3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 7.19 a 11.74' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 2.63 a 7.19' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloAparelhosFixosConc11(feature) {
    if( feature.properties.PercAPF11 <= minAparelhosFixosConc11 || minAparelhosFixosConc11 === 0){
        minAparelhosFixosConc11 = feature.properties.PercAPF11
    }
    if(feature.properties.PercAPF11 >= maxAparelhosFixosConc11 ){
        maxAparelhosFixosConc11 = feature.properties.PercAPF11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAparelhosFixosConc(feature.properties.PercAPF11)
    };
}
function apagarAparelhosFixosConc11(e) {
    AparelhosFixosConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAparelhosFixosConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aparelhos fixos: ' + '<b>' + feature.properties.PercAPF11.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAparelhosFixosConc11,
    });
}
var AparelhosFixosConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloAparelhosFixosConc11,
    onEachFeature: onEachFeatureAparelhosFixosConc11
});
let slideAparelhosFixosConc11 = function(){
    var sliderAparelhosFixosConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAparelhosFixosConc11, {
        start: [minAparelhosFixosConc11, maxAparelhosFixosConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhosFixosConc11,
            'max': maxAparelhosFixosConc11
        },
        });
    inputNumberMin.setAttribute("value",minAparelhosFixosConc11);
    inputNumberMax.setAttribute("value",maxAparelhosFixosConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhosFixosConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhosFixosConc11.noUiSlider.set([null, this.value]);
    });

    sliderAparelhosFixosConc11.noUiSlider.on('update',function(e){
        AparelhosFixosConc11.eachLayer(function(layer){
            if(layer.feature.properties.PercAPF11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercAPF11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAparelhosFixosConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderAparelhosFixosConc11.noUiSlider;
    $(slidersGeral).append(sliderAparelhosFixosConc11);
} 

/////////////////////////////////// Fim PERCENTAGEM Alojamentos APARELHOS FIXOS 2011 Concelho -------------- \\\\\\


/////////////////////------------------- PERCENTAGEM Alojamentos Nenhum EM 2011 POR CONCELHO-----///////////////////////

var minNenhumConc11 = 0;
var maxNenhumConc11 = 0;

function CorPerNenhumConc(d) {
    return d >= 36.09 ? '#8c0303' :
        d >= 30.48  ? '#de1f35' :
        d >= 21.11 ? '#ff5e6e' :
        d >= 11.75   ? '#f5b3be' :
        d >= 2.38   ? '#F2C572' :
                ''  ;
}
var legendaPerNenhumConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 36.09' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 30.48 a 36.09' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 21.11 a 30.48' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 11.75 a 21.11' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 2.38 a 11.75' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloNenhumConc11(feature) {
    if( feature.properties.PercNen11 <= minNenhumConc11 || minNenhumConc11 === 0){
        minNenhumConc11 = feature.properties.PercNen11
    }
    if(feature.properties.PercNen11 >= maxNenhumConc11 ){
        maxNenhumConc11 = feature.properties.PercNen11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerNenhumConc(feature.properties.PercNen11)
    };
}
function apagarNenhumConc11(e) {
    NenhumConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureNenhumConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem aquecimento: ' + '<b>' + feature.properties.PercNen11.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarNenhumConc11,
    });
}
var NenhumConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloNenhumConc11,
    onEachFeature: onEachFeatureNenhumConc11
});
let slideNenhumConc11 = function(){
    var sliderNenhumConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderNenhumConc11, {
        start: [minNenhumConc11, maxNenhumConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minNenhumConc11,
            'max': maxNenhumConc11
        },
        });
    inputNumberMin.setAttribute("value",minNenhumConc11);
    inputNumberMax.setAttribute("value",maxNenhumConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderNenhumConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderNenhumConc11.noUiSlider.set([null, this.value]);
    });

    sliderNenhumConc11.noUiSlider.on('update',function(e){
        NenhumConc11.eachLayer(function(layer){
            if(layer.feature.properties.PercNen11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercNen11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderNenhumConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderNenhumConc11.noUiSlider;
    $(slidersGeral).append(sliderNenhumConc11);
} 

/////////////////////////////////// Fim PERCENTAGEM Alojamentos NENHUM 2011 Concelho -------------- \\\\\\

/////////////////////------------------- PERCENTAGEM Alojamentos AQUECIMENTO CENTRAL EM 2001 POR CONCELHO-----//\\\\\\\\//////////////////////

var minAquecimentoCentralConc01 = 0;
var maxAquecimentoCentralConc01 = 0;

function EstiloAquecimentoCentralConc01(feature) {
    if( feature.properties.PercAC01 <= minAquecimentoCentralConc01 || minAquecimentoCentralConc01 === 0){
        minAquecimentoCentralConc01 = feature.properties.PercAC01
    }
    if(feature.properties.PercAC01 >= maxAquecimentoCentralConc01 ){
        maxAquecimentoCentralConc01 = feature.properties.PercAC01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAquecimentoCentralConc(feature.properties.PercAC01)
    };
}
function apagarAquecimentoCentralConc01(e) {
    AquecimentoCentralConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAquecimentoCentralConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aquecimento central: ' + '<b>' + feature.properties.PercAC01.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAquecimentoCentralConc01,
    });
}
var AquecimentoCentralConc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloAquecimentoCentralConc01,
    onEachFeature: onEachFeatureAquecimentoCentralConc01
});
let slideAquecimentoCentralConc01 = function(){
    var sliderAquecimentoCentralConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAquecimentoCentralConc01, {
        start: [minAquecimentoCentralConc01, maxAquecimentoCentralConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAquecimentoCentralConc01,
            'max': maxAquecimentoCentralConc01
        },
        });
    inputNumberMin.setAttribute("value",minAquecimentoCentralConc01);
    inputNumberMax.setAttribute("value",maxAquecimentoCentralConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderAquecimentoCentralConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAquecimentoCentralConc01.noUiSlider.set([null, this.value]);
    });

    sliderAquecimentoCentralConc01.noUiSlider.on('update',function(e){
        AquecimentoCentralConc01.eachLayer(function(layer){
            if(layer.feature.properties.PercAC01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercAC01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAquecimentoCentralConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderAquecimentoCentralConc01.noUiSlider;
    $(slidersGeral).append(sliderAquecimentoCentralConc01);
} 

/////////////////////////////////// Fim PERCENTAGEM Alojamentos AQUECIMENTO CENTRAL 2001 Concelho -------------- \\\\\\

/////////////////////------------------- PERCENTAGEM Alojamentos LAREIRA EM 2001 POR CONCELHO-----///////////////////////

var minLareiraAbertaConc01 = 0;
var maxLareiraAbertaConc01 = 0;

function EstiloLareiraAbertaConc01(feature) {
    if( feature.properties.PercLAR01 <= minLareiraAbertaConc01 || minLareiraAbertaConc01 === 0){
        minLareiraAbertaConc01 = feature.properties.PercLAR01
    }
    if(feature.properties.PercLAR01 >= maxLareiraAbertaConc01 ){
        maxLareiraAbertaConc01 = feature.properties.PercLAR01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerLareiraAbertaConc(feature.properties.PercLAR01)
    };
}
function apagarLareiraAbertaConc01(e) {
    LareiraAbertaConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureLareiraAbertaConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com lareira aberta: ' + '<b>' + feature.properties.PercLAR01.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarLareiraAbertaConc01,
    });
}
var LareiraAbertaConc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloLareiraAbertaConc01,
    onEachFeature: onEachFeatureLareiraAbertaConc01
});
let slideLareiraAbertaConc01 = function(){
    var sliderLareiraAbertaConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderLareiraAbertaConc01, {
        start: [minLareiraAbertaConc01, maxLareiraAbertaConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minLareiraAbertaConc01,
            'max': maxLareiraAbertaConc01
        },
        });
    inputNumberMin.setAttribute("value",minLareiraAbertaConc01);
    inputNumberMax.setAttribute("value",maxLareiraAbertaConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderLareiraAbertaConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderLareiraAbertaConc01.noUiSlider.set([null, this.value]);
    });

    sliderLareiraAbertaConc01.noUiSlider.on('update',function(e){
        LareiraAbertaConc01.eachLayer(function(layer){
            if(layer.feature.properties.PercLAR01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercLAR01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderLareiraAbertaConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderLareiraAbertaConc01.noUiSlider;
    $(slidersGeral).append(sliderLareiraAbertaConc01);
} 

/////////////////////////////////// Fim PERCENTAGEM Alojamentos LAREIRA 2001 Concelho -------------- \\\\\\

/////////////////////------------------- PERCENTAGEM Alojamentos APARELHOS MÓVEIS EM 2001 POR CONCELHO-----///////////////////////

var minAparelhosMoveisConc01 = 0;
var maxAparelhosMoveisConc01 = 0;

function EstiloAparelhosMoveisConc01(feature) {
    if( feature.properties.PercAPM01 <= minAparelhosMoveisConc01 || minAparelhosMoveisConc01 === 0){
        minAparelhosMoveisConc01 = feature.properties.PercAPM01
    }
    if(feature.properties.PercAPM01 >= maxAparelhosMoveisConc01 ){
        maxAparelhosMoveisConc01 = feature.properties.PercAPM01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAparelhosMoveisConc(feature.properties.PercAPM01)
    };
}
function apagarAparelhosMoveisConc01(e) {
    AparelhosMoveisConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAparelhosMoveisConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aparelhos móveis: ' + '<b>' + feature.properties.PercAPM01.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAparelhosMoveisConc01,
    });
}
var AparelhosMoveisConc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloAparelhosMoveisConc01,
    onEachFeature: onEachFeatureAparelhosMoveisConc01
});
let slideAparelhosMoveisConc01 = function(){
    var sliderAparelhosMoveisConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAparelhosMoveisConc01, {
        start: [minAparelhosMoveisConc01, maxAparelhosMoveisConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhosMoveisConc01,
            'max': maxAparelhosMoveisConc01
        },
        });
    inputNumberMin.setAttribute("value",minAparelhosMoveisConc01);
    inputNumberMax.setAttribute("value",maxAparelhosMoveisConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhosMoveisConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhosMoveisConc01.noUiSlider.set([null, this.value]);
    });

    sliderAparelhosMoveisConc01.noUiSlider.on('update',function(e){
        AparelhosMoveisConc01.eachLayer(function(layer){
            if(layer.feature.properties.PercAPM01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercAPM01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAparelhosMoveisConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderAparelhosMoveisConc01.noUiSlider;
    $(slidersGeral).append(sliderAparelhosMoveisConc01);
} 

/////////////////////////////////// Fim PERCENTAGEM Alojamentos APARELHOS MÓVEIS 2001 Concelho -------------- \\\\\\

/////////////////////------------------- PERCENTAGEM Alojamentos APARELHOS Fixos EM 2001 POR CONCELHO-----///////////////////////

var minAparelhosFixosConc01 = 0;
var maxAparelhosFixosConc01 = 0;

function EstiloAparelhosFixosConc01(feature) {
    if( feature.properties.PercAPF01 <= minAparelhosFixosConc01 || minAparelhosFixosConc01 === 0){
        minAparelhosFixosConc01 = feature.properties.PercAPF01
    }
    if(feature.properties.PercAPF01 >= maxAparelhosFixosConc01 ){
        maxAparelhosFixosConc01 = feature.properties.PercAPF01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAparelhosFixosConc(feature.properties.PercAPF01)
    };
}
function apagarAparelhosFixosConc01(e) {
    AparelhosFixosConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAparelhosFixosConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aparelhos fixos: ' + '<b>' + feature.properties.PercAPF01.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAparelhosFixosConc01,
    });
}
var AparelhosFixosConc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloAparelhosFixosConc01,
    onEachFeature: onEachFeatureAparelhosFixosConc01
});
let slideAparelhosFixosConc01 = function(){
    var sliderAparelhosFixosConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAparelhosFixosConc01, {
        start: [minAparelhosFixosConc01, maxAparelhosFixosConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhosFixosConc01,
            'max': maxAparelhosFixosConc01
        },
        });
    inputNumberMin.setAttribute("value",minAparelhosFixosConc01);
    inputNumberMax.setAttribute("value",maxAparelhosFixosConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhosFixosConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhosFixosConc01.noUiSlider.set([null, this.value]);
    });

    sliderAparelhosFixosConc01.noUiSlider.on('update',function(e){
        AparelhosFixosConc01.eachLayer(function(layer){
            if(layer.feature.properties.PercAPF01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercAPF01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAparelhosFixosConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderAparelhosFixosConc01.noUiSlider;
    $(slidersGeral).append(sliderAparelhosFixosConc01);
} 

/////////////////////////////////// Fim PERCENTAGEM Alojamentos APARELHOS FIXOS 2001 Concelho -------------- \\\\\\


/////////////////////------------------- PERCENTAGEM Alojamentos Nenhum EM 2001 POR CONCELHO-----///////////////////////

var minNenhumConc01 = 0;
var maxNenhumConc01 = 0;

function EstiloNenhumConc01(feature) {
    if( feature.properties.PercNen01 <= minNenhumConc01 || minNenhumConc01 === 0){
        minNenhumConc01 = feature.properties.PercNen01
    }
    if(feature.properties.PercNen01 >= maxNenhumConc01 ){
        maxNenhumConc01 = feature.properties.PercNen01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerNenhumConc(feature.properties.PercNen01)
    };
}
function apagarNenhumConc01(e) {
    NenhumConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureNenhumConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem aquecimento: ' + '<b>' + feature.properties.PercNen01.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarNenhumConc01,
    });
}
var NenhumConc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloNenhumConc01,
    onEachFeature: onEachFeatureNenhumConc01
});
let slideNenhumConc01 = function(){
    var sliderNenhumConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderNenhumConc01, {
        start: [minNenhumConc01, maxNenhumConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minNenhumConc01,
            'max': maxNenhumConc01
        },
        });
    inputNumberMin.setAttribute("value",minNenhumConc01);
    inputNumberMax.setAttribute("value",maxNenhumConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderNenhumConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderNenhumConc01.noUiSlider.set([null, this.value]);
    });

    sliderNenhumConc01.noUiSlider.on('update',function(e){
        NenhumConc01.eachLayer(function(layer){
            if(layer.feature.properties.PercNen01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercNen01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderNenhumConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderNenhumConc01.noUiSlider;
    $(slidersGeral).append(sliderNenhumConc01);
} 

/////////////////////////////////// Fim PERCENTAGEM Alojamentos NENHUM 2001 Concelho -------------- \\\\\\

////////////////////////------------------------ FIM DADOS RELATIVOS CONCELHOS ---------------\\\\\\\\\\\\\\\\
///////////////////////------------------------ DADOS VARIAÇÃO -----------------\\\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação AQUECIMENTO CENTRAL, CONCELHO 2011 2001 -------------------////

var minVarAquecimentoCentralConc = 0;
var maxVarAquecimentoCentralConc = 0;

function CorVarAquecimentoCentralConc11_01(d) {
    return d >= 100  ? '#8c0303' :
        d >= 75  ? '#de1f35' :
        d >= 50   ? '#ff5e6e' :
                ''  ;
}

var legendaVarAquecimentoCentralConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares de residência habitual com aquecimento central, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 75 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 52 a 75' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAquecimentoCentralConc(feature) {
    if(feature.properties.V_AC11_01 <= minVarAquecimentoCentralConc && feature.properties.V_AC11_01 > null|| minVarAquecimentoCentralConc ===0){
        minVarAquecimentoCentralConc = feature.properties.V_AC11_01
    }
    if(feature.properties.V_AC11_01 > maxVarAquecimentoCentralConc){
        maxVarAquecimentoCentralConc = feature.properties.V_AC11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarAquecimentoCentralConc11_01(feature.properties.V_AC11_01)};
    }


function apagarVarAquecimentoCentralConc(e) {
    VarAquecimentoCentralConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAquecimentoCentralConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_AC11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAquecimentoCentralConc,
    });
}
var VarAquecimentoCentralConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarAquecimentoCentralConc,
    onEachFeature: onEachFeatureVarAquecimentoCentralConc
});

let slideVarAquecimentoCentralConc = function(){
    var sliderVarAquecimentoCentralConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAquecimentoCentralConc, {
        start: [minVarAquecimentoCentralConc, maxVarAquecimentoCentralConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAquecimentoCentralConc,
            'max': maxVarAquecimentoCentralConc
        },
        });
    inputNumberMin.setAttribute("value",minVarAquecimentoCentralConc);
    inputNumberMax.setAttribute("value",maxVarAquecimentoCentralConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAquecimentoCentralConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAquecimentoCentralConc.noUiSlider.set([null, this.value]);
    });

    sliderVarAquecimentoCentralConc.noUiSlider.on('update',function(e){
        VarAquecimentoCentralConc.eachLayer(function(layer){
            if(layer.feature.properties.V_AC11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_AC11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAquecimentoCentralConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderVarAquecimentoCentralConc.noUiSlider;
    $(slidersGeral).append(sliderVarAquecimentoCentralConc);
} 

//////////////////////--------- Fim da Variação AQUECIMENTO CENTRAL, CONCELHO 2011 2001-------------- \\\\\\

/////////////////////////////------- Variação AQUECIMENTO LAREIRA, CONCELHO 2011 2001 -------------------////

var minVarLareiraConc = -99;
var maxVarLareiraConc = 0;

function CorVarLareiraConc11_01(d) {
    return d >= -25  ? '#9ebbd7' :
        d >= -50  ? '#2288bf' :
        d >= -60  ? '#155273' :
        d >= -71.21   ? '#0b2c40' :
                ''  ;
}

var legendaVarLareiraConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares de residência habitual com lareira aberta, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + '  > -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -60 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -71.2 a -60' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarLareiraConc(feature) {
    if(feature.properties.V_LAR11_01 <= maxVarLareiraConc   &&  feature.properties.V_LAR11_01 != null){
        maxVarLareiraConc = feature.properties.V_LAR11_01
    }
    if(feature.properties.V_LAR11_01 > minVarLareiraConc && feature.properties.V_LAR11_01 != null){
        minVarLareiraConc = feature.properties.V_LAR11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarLareiraConc11_01(feature.properties.V_LAR11_01)};
    }


function apagarVarLareiraConc(e) {
    VarLareiraConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarLareiraConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_LAR11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarLareiraConc,
    });
}
var VarLareiraConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarLareiraConc,
    onEachFeature: onEachFeatureVarLareiraConc
});

let slideVarLareiraConc = function(){
    var sliderVarLareiraConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarLareiraConc, {
        start: [maxVarLareiraConc, minVarLareiraConc],
        tooltips:true,
        connect: true,
        range: {
            'min': maxVarLareiraConc,
            'max': minVarLareiraConc
        },
        });
    inputNumberMin.setAttribute("value",minVarLareiraConc);
    inputNumberMax.setAttribute("value",maxVarLareiraConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVarLareiraConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarLareiraConc.noUiSlider.set([null, this.value]);
    });

    sliderVarLareiraConc.noUiSlider.on('update',function(e){
        VarLareiraConc.eachLayer(function(layer){
            if(layer.feature.properties.V_LAR11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_LAR11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarLareiraConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderVarLareiraConc.noUiSlider;
    $(slidersGeral).append(sliderVarLareiraConc);
} 

//////////////////////--------- Fim da Variação LAREIRA, CONCELHO 2011 2001-------------- \\\\\\

/////////////////////////////------- Variação APARELHOS MÓVEIS, CONCELHO 2011 2001 -------------------////

var minVarAparelhosMoveisConc = 0;
var maxVarAparelhosMoveisConc = 0;

function CorVarAparelhosMoveisConc11_01(d) {
    return d >= 60  ? '#8c0303' :
        d >= 40  ? '#de1f35' :
        d >= 20  ? '#ff5e6e' :
        d >= 10.81   ? '#f5b3be' :
                ''  ;
}

var legendaVarAparelhosMoveisConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares de residência habitual com aparelhos móveis, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 40 a 60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 20 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 10.81 a 20' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAparelhosMoveisConc(feature) {
    if(feature.properties.V_APM11_01 <= minVarAparelhosMoveisConc   &&  feature.properties.V_APM11_01 > null|| minVarAparelhosMoveisConc ===0){
        minVarAparelhosMoveisConc = feature.properties.V_APM11_01
    }
    if(feature.properties.V_APM11_01 > maxVarAparelhosMoveisConc){
        maxVarAparelhosMoveisConc = feature.properties.V_APM11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarAparelhosMoveisConc11_01(feature.properties.V_APM11_01)};
    }


function apagarVarAparelhosMoveisConc(e) {
    VarAparelhosMoveisConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAparelhosMoveisConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_APM11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAparelhosMoveisConc,
    });
}
var VarAparelhosMoveisConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarAparelhosMoveisConc,
    onEachFeature: onEachFeatureVarAparelhosMoveisConc
});

let slideVarAparelhosMoveisConc = function(){
    var sliderVarAparelhosMoveisConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAparelhosMoveisConc, {
        start: [minVarAparelhosMoveisConc, maxVarAparelhosMoveisConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAparelhosMoveisConc,
            'max': maxVarAparelhosMoveisConc
        },
        });
    inputNumberMin.setAttribute("value",minVarAparelhosMoveisConc);
    inputNumberMax.setAttribute("value",maxVarAparelhosMoveisConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAparelhosMoveisConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAparelhosMoveisConc.noUiSlider.set([null, this.value]);
    });

    sliderVarAparelhosMoveisConc.noUiSlider.on('update',function(e){
        VarAparelhosMoveisConc.eachLayer(function(layer){
            if(layer.feature.properties.V_APM11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_APM11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAparelhosMoveisConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderVarAparelhosMoveisConc.noUiSlider;
    $(slidersGeral).append(sliderVarAparelhosMoveisConc);
} 

//////////////////////--------- Fim da Variação Aparelhos Moveis, CONCELHO 2011 2001-------------- \\\\\\

/////////////////////////////------- Variação APARELHOS FIXOS, CONCELHO 2011 2001 -------------------////

var minVarAparelhosFixosConc = 99;
var maxVarAparelhosFixosConc = 0;

function CorVarAparelhosFixosConc11_01(d) {
    return d >= 75  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -6.25   ? '#9eaad7' :
                ''  ;
}

var legendaVarAparelhosFixosConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares de residência habitual com aparelhos fixos, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -6.25 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAparelhosFixosConc(feature) {
    if(feature.properties.V_APF11_01 <= minVarAparelhosFixosConc ){
        minVarAparelhosFixosConc = feature.properties.V_APF11_01
    }
    if(feature.properties.V_APF11_01 > maxVarAparelhosFixosConc){
        maxVarAparelhosFixosConc = feature.properties.V_APF11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarAparelhosFixosConc11_01(feature.properties.V_APF11_01)};
    }


function apagarVarAparelhosFixosConc(e) {
    VarAparelhosFixosConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAparelhosFixosConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_APF11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAparelhosFixosConc,
    });
}
var VarAparelhosFixosConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarAparelhosFixosConc,
    onEachFeature: onEachFeatureVarAparelhosFixosConc
});

let slideVarAparelhosFixosConc = function(){
    var sliderVarAparelhosFixosConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAparelhosFixosConc, {
        start: [minVarAparelhosFixosConc, maxVarAparelhosFixosConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAparelhosFixosConc,
            'max': maxVarAparelhosFixosConc
        },
        });
    inputNumberMin.setAttribute("value",minVarAparelhosFixosConc);
    inputNumberMax.setAttribute("value",maxVarAparelhosFixosConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAparelhosFixosConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAparelhosFixosConc.noUiSlider.set([null, this.value]);
    });

    sliderVarAparelhosFixosConc.noUiSlider.on('update',function(e){
        VarAparelhosFixosConc.eachLayer(function(layer){
            if(layer.feature.properties.V_APF11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_APF11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAparelhosFixosConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderVarAparelhosFixosConc.noUiSlider;
    $(slidersGeral).append(sliderVarAparelhosFixosConc);
} 

//////////////////////--------- Fim da Variação Aparelhos Fixos, CONCELHO 2011 2001-------------- \\\\\\

/////////////////////////////------- Variação NENHUM, CONCELHO 2011 2001 -------------------////

var minVarNenhumConc = -99;
var maxVarNenhumConc = 0;

function CorVarNenhumConc11_01(d) {
    return d >= -20  ? '#9ebbd7' :
        d >= -30  ? '#2288bf' :
        d >= -40  ? '#155273' :
        d >= -46.06   ? '#0b2c40' :
                ''  ;
}

var legendaVarNenhumConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares de residência habitual sem sistema de aquecimento, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + '  > -75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -30 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -40 a -30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -46.05 a -40' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarNenhumConc(feature) {
    if(feature.properties.V_NEN11_01 <= maxVarNenhumConc && feature.properties.V_NEN11_01 != null){
        maxVarNenhumConc = feature.properties.V_NEN11_01
        
    }
    if(feature.properties.V_NEN11_01 >= minVarNenhumConc && feature.properties.V_NEN11_01 != null){
        minVarNenhumConc = feature.properties.V_NEN11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarNenhumConc11_01(feature.properties.V_NEN11_01)};
    }


function apagarVarNenhumConc(e) {
    VarNenhumConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarNenhumConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_NEN11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarNenhumConc,
    });
}
var VarNenhumConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarNenhumConc,
    onEachFeature: onEachFeatureVarNenhumConc
});

let slideVarNenhumConc = function(){
    var sliderVarNenhumConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarNenhumConc, {
        start: [maxVarNenhumConc, minVarNenhumConc],
        tooltips:true,
        connect: true,
        range: {
            'min': maxVarNenhumConc,
            'max': minVarNenhumConc
        },
        });
    inputNumberMin.setAttribute("value",minVarNenhumConc);
    inputNumberMax.setAttribute("value",maxVarNenhumConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVarNenhumConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarNenhumConc.noUiSlider.set([null, this.value]);
    });

    sliderVarNenhumConc.noUiSlider.on('update',function(e){
        VarNenhumConc.eachLayer(function(layer){
            if(layer.feature.properties.V_NEN11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_NEN11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarNenhumConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderVarNenhumConc.noUiSlider;
    $(slidersGeral).append(sliderVarNenhumConc);
} 

//////////////////////--------- Fim da Variação NENHUNS, CONCELHO 2011 2001-------------- \\\\\\
//////////////////////////////////////////-------------- FIM CONCELHOS ------------------\\\\\\\\\\\\\
///////////////////-------------------------------- FREGUESIAS---------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\
///////////////////////// ///////////// DADOS ABSOLUTOS FREGUESIAS ------\\\\\\\\\\\\\\\\\\\

////////////////////////////////----------- Alojamentos  AQUECIMENTO CENTRAL  EM 2011  FREGUESIAS------------------------------\\\\\\\\\\\\\

var minAquecimentoCentralFreg_11 = 0;
var maxAquecimentoCentralFreg_11 = 0;
function estiloAquecimentoCentralFreg_11(feature, latlng) {
    if(feature.properties.F_AL_AC11< minAquecimentoCentralFreg_11 || minAquecimentoCentralFreg_11 ===0){
        minAquecimentoCentralFreg_11 = feature.properties.F_AL_AC11
    }
    if(feature.properties.F_AL_AC11> maxAquecimentoCentralFreg_11){
        maxAquecimentoCentralFreg_11 = feature.properties.F_AL_AC11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AL_AC11,0.3)
    });
}
function apagarAquecimentoCentralFreg_11(e){
    var layer = e.target;
    AquecimentoCentralFreg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAquecimentoCentralFreg_11(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aquecimento central: ' + '<b>' + feature.properties.F_AL_AC11).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAquecimentoCentralFreg_11,
    })
};

var AquecimentoCentralFreg_11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloAquecimentoCentralFreg_11,
    onEachFeature: onEachFeatureAquecimentoCentralFreg_11,
});


var slideAquecimentoCentralFreg_11 = function(){
    var sliderAquecimentoCentralFreg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderAquecimentoCentralFreg_11, {
        start: [minAquecimentoCentralFreg_11, maxAquecimentoCentralFreg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAquecimentoCentralFreg_11,
            'max': maxAquecimentoCentralFreg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAquecimentoCentralFreg_11);
    inputNumberMax.setAttribute("value",maxAquecimentoCentralFreg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderAquecimentoCentralFreg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAquecimentoCentralFreg_11.noUiSlider.set([null, this.value]);
    });

    sliderAquecimentoCentralFreg_11.noUiSlider.on('update',function(e){
        AquecimentoCentralFreg_11.eachLayer(function(layer){
            if(layer.feature.properties.F_AL_AC11>=parseFloat(e[0])&& layer.feature.properties.F_AL_AC11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAquecimentoCentralFreg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderAquecimentoCentralFreg_11.noUiSlider;
    $(slidersGeral).append(sliderAquecimentoCentralFreg_11);
}


///////////////////////////-------------------- FIM AQUECIMENTO CENTRAL ,FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////----------- Alojamentos  LAREIRA  EM 2011  FREGUESIAS------------------------------\\\\\\\\\\\\\

var minLareiraFreg_11 = 0;
var maxLareiraFreg_11 = 0;
function estiloLareiraFreg_11(feature, latlng) {
    if(feature.properties.F_AL_LAR11< minLareiraFreg_11 || minLareiraFreg_11 ===0){
        minLareiraFreg_11 = feature.properties.F_AL_LAR11
    }
    if(feature.properties.F_AL_LAR11> maxLareiraFreg_11){
        maxLareiraFreg_11 = feature.properties.F_AL_LAR11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AL_LAR11,0.3)
    });
}
function apagarLareiraFreg_11(e){
    var layer = e.target;
    LareiraFreg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureLareiraFreg_11(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com lareira: ' + '<b>' + feature.properties.F_AL_LAR11).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarLareiraFreg_11,
    })
};

var LareiraFreg_11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloLareiraFreg_11,
    onEachFeature: onEachFeatureLareiraFreg_11,
});


var slideLareiraFreg_11 = function(){
    var sliderLareiraFreg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderLareiraFreg_11, {
        start: [minLareiraFreg_11, maxLareiraFreg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minLareiraFreg_11,
            'max': maxLareiraFreg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minLareiraFreg_11);
    inputNumberMax.setAttribute("value",maxLareiraFreg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderLareiraFreg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderLareiraFreg_11.noUiSlider.set([null, this.value]);
    });

    sliderLareiraFreg_11.noUiSlider.on('update',function(e){
        LareiraFreg_11.eachLayer(function(layer){
            if(layer.feature.properties.F_AL_LAR11>=parseFloat(e[0])&& layer.feature.properties.F_AL_LAR11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderLareiraFreg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderLareiraFreg_11.noUiSlider;
    $(slidersGeral).append(sliderLareiraFreg_11);
}


///////////////////////////-------------------- FIM LAREIRA ,FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////----------- Alojamentos  RECUPERADOR CALOR  EM 2011  FREGUESIAS--------------------------\\\\\\\\\\\\\

var minRecuperadorCalorFreg_11 = 0;
var maxRecuperadorCalorFreg_11 = 0;
function estiloRecuperadorCalorFreg_11(feature, latlng) {
    if(feature.properties.F_AL_REC11< minRecuperadorCalorFreg_11 || minRecuperadorCalorFreg_11 ===0){
        minRecuperadorCalorFreg_11 = feature.properties.F_AL_REC11
    }
    if(feature.properties.F_AL_REC11> maxRecuperadorCalorFreg_11){
        maxRecuperadorCalorFreg_11 = feature.properties.F_AL_REC11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AL_REC11,0.35)
    });
}
function apagarRecuperadorCalorFreg_11(e){
    var layer = e.target;
    RecuperadorCalorFreg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureRecuperadorCalorFreg_11(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com recuperador de calor: ' + '<b>' + feature.properties.F_AL_REC11).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarRecuperadorCalorFreg_11,
    })
};

var RecuperadorCalorFreg_11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloRecuperadorCalorFreg_11,
    onEachFeature: onEachFeatureRecuperadorCalorFreg_11,
});


var slideRecuperadorCalorFreg_11 = function(){
    var sliderRecuperadorCalorFreg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderRecuperadorCalorFreg_11, {
        start: [minRecuperadorCalorFreg_11, maxRecuperadorCalorFreg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minRecuperadorCalorFreg_11,
            'max': maxRecuperadorCalorFreg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minRecuperadorCalorFreg_11);
    inputNumberMax.setAttribute("value",maxRecuperadorCalorFreg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderRecuperadorCalorFreg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRecuperadorCalorFreg_11.noUiSlider.set([null, this.value]);
    });

    sliderRecuperadorCalorFreg_11.noUiSlider.on('update',function(e){
        RecuperadorCalorFreg_11.eachLayer(function(layer){
            if(layer.feature.properties.F_AL_REC11>=parseFloat(e[0])&& layer.feature.properties.F_AL_REC11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderRecuperadorCalorFreg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderRecuperadorCalorFreg_11.noUiSlider;
    $(slidersGeral).append(sliderRecuperadorCalorFreg_11);
}


///////////////////////////-------------------- FIM RECUPERADOR CALOR ,FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////----------- Alojamentos  APARELHOS MÓVEIS  EM 2011  FREGUESIAS--------------------------\\\\\\\\\\\\\

var minAparelhoMovelFreg_11 = 0;
var maxAparelhoMovelFreg_11 = 0;
function estiloAparelhoMovelFreg_11(feature, latlng) {
    if(feature.properties.F_AL_APM11< minAparelhoMovelFreg_11 || minAparelhoMovelFreg_11 ===0){
        minAparelhoMovelFreg_11 = feature.properties.F_AL_APM11
    }
    if(feature.properties.F_AL_APM11> maxAparelhoMovelFreg_11){
        maxAparelhoMovelFreg_11 = feature.properties.F_AL_APM11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AL_APM11,0.25)
    });
}
function apagarAparelhoMovelFreg_11(e){
    var layer = e.target;
    AparelhoMovelFreg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAparelhoMovelFreg_11(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aparelhos móveis: ' + '<b>' + feature.properties.F_AL_APM11).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAparelhoMovelFreg_11,
    })
};

var AparelhoMovelFreg_11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloAparelhoMovelFreg_11,
    onEachFeature: onEachFeatureAparelhoMovelFreg_11,
});


var slideAparelhoMovelFreg_11 = function(){
    var sliderAparelhoMovelFreg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderAparelhoMovelFreg_11, {
        start: [minAparelhoMovelFreg_11, maxAparelhoMovelFreg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhoMovelFreg_11,
            'max': maxAparelhoMovelFreg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAparelhoMovelFreg_11);
    inputNumberMax.setAttribute("value",maxAparelhoMovelFreg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhoMovelFreg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhoMovelFreg_11.noUiSlider.set([null, this.value]);
    });

    sliderAparelhoMovelFreg_11.noUiSlider.on('update',function(e){
        AparelhoMovelFreg_11.eachLayer(function(layer){
            if(layer.feature.properties.F_AL_APM11>=parseFloat(e[0])&& layer.feature.properties.F_AL_APM11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAparelhoMovelFreg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderAparelhoMovelFreg_11.noUiSlider;
    $(slidersGeral).append(sliderAparelhoMovelFreg_11);
}


///////////////////////////-------------------- FIM APARELHOS MÓVEIS ,FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////----------- Alojamentos  APARELHOS FIXOS  EM 2011  FREGUESIAS--------------------------\\\\\\\\\\\\\

var minAparelhoFixoFreg_11 = 0;
var maxAparelhoFixoFreg_11 = 0;
function estiloAparelhoFixoFreg_11(feature, latlng) {
    if(feature.properties.F_AL_APF11< minAparelhoFixoFreg_11 || minAparelhoFixoFreg_11 ===0){
        minAparelhoFixoFreg_11 = feature.properties.F_AL_APF11
    }
    if(feature.properties.F_AL_APF11> maxAparelhoFixoFreg_11){
        maxAparelhoFixoFreg_11 = feature.properties.F_AL_APF11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AL_APF11,0.3)
    });
}
function apagarAparelhoFixoFreg_11(e){
    var layer = e.target;
    AparelhoFixoFreg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAparelhoFixoFreg_11(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aparelhos fixos: ' + '<b>' + feature.properties.F_AL_APF11).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAparelhoFixoFreg_11,
    })
};

var AparelhoFixoFreg_11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloAparelhoFixoFreg_11,
    onEachFeature: onEachFeatureAparelhoFixoFreg_11,
});


var slideAparelhoFixoFreg_11 = function(){
    var sliderAparelhoFixoFreg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderAparelhoFixoFreg_11, {
        start: [minAparelhoFixoFreg_11, maxAparelhoFixoFreg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhoFixoFreg_11,
            'max': maxAparelhoFixoFreg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAparelhoFixoFreg_11);
    inputNumberMax.setAttribute("value",maxAparelhoFixoFreg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhoFixoFreg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhoFixoFreg_11.noUiSlider.set([null, this.value]);
    });

    sliderAparelhoFixoFreg_11.noUiSlider.on('update',function(e){
        AparelhoFixoFreg_11.eachLayer(function(layer){
            if(layer.feature.properties.F_AL_APF11>=parseFloat(e[0])&& layer.feature.properties.F_AL_APF11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAparelhoFixoFreg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderAparelhoFixoFreg_11.noUiSlider;
    $(slidersGeral).append(sliderAparelhoFixoFreg_11);
}


///////////////////////////-------------------- FIM APARELHOS FIXOS ,FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////----------- Alojamentos NENHUM  EM 2011  FREGUESIAS--------------------------\\\\\\\\\\\\\

var minNenhumFreg_11 = 0;
var maxNenhumFreg_11 = 0;
function estiloNenhumFreg_11(feature, latlng) {
    if(feature.properties.F_AL_Nen11< minNenhumFreg_11 || minNenhumFreg_11 ===0){
        minNenhumFreg_11 = feature.properties.F_AL_Nen11
    }
    if(feature.properties.F_AL_Nen11> maxNenhumFreg_11){
        maxNenhumFreg_11 = feature.properties.F_AL_Nen11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AL_Nen11,0.3)
    });
}
function apagarNenhumFreg_11(e){
    var layer = e.target;
    NenhumFreg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureNenhumFreg_11(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem aquecimento: ' + '<b>' + feature.properties.F_AL_Nen11).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarNenhumFreg_11,
    })
};

var NenhumFreg_11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloNenhumFreg_11,
    onEachFeature: onEachFeatureNenhumFreg_11,
});


var slideNenhumFreg_11 = function(){
    var sliderNenhumFreg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 60){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderNenhumFreg_11, {
        start: [minNenhumFreg_11, maxNenhumFreg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minNenhumFreg_11,
            'max': maxNenhumFreg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minNenhumFreg_11);
    inputNumberMax.setAttribute("value",maxNenhumFreg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderNenhumFreg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderNenhumFreg_11.noUiSlider.set([null, this.value]);
    });

    sliderNenhumFreg_11.noUiSlider.on('update',function(e){
        NenhumFreg_11.eachLayer(function(layer){
            if(layer.feature.properties.F_AL_Nen11>=parseFloat(e[0])&& layer.feature.properties.F_AL_Nen11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderNenhumFreg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 60;
    sliderAtivo = sliderNenhumFreg_11.noUiSlider;
    $(slidersGeral).append(sliderNenhumFreg_11);
}


///////////////////////////-------------------- FIM Alojamentos NENHUM ,FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////----------- Alojamentos  AQUECIMENTO CENTRAL  EM 2001  FREGUESIAS------------------------------\\\\\\\\\\\\\

var minAquecimentoCentralFreg_01 = 0;
var maxAquecimentoCentralFreg_01 = 0;
function estiloAquecimentoCentralFreg_01(feature, latlng) {
    if(feature.properties.F_AL_AC01< minAquecimentoCentralFreg_01 || minAquecimentoCentralFreg_01 ===0){
        minAquecimentoCentralFreg_01 = feature.properties.F_AL_AC01
    }
    if(feature.properties.F_AL_AC01> maxAquecimentoCentralFreg_01){
        maxAquecimentoCentralFreg_01 = feature.properties.F_AL_AC01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AL_AC01,0.3)
    });
}
function apagarAquecimentoCentralFreg_01(e){
    var layer = e.target;
    AquecimentoCentralFreg_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAquecimentoCentralFreg_01(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aquecimento central: ' + '<b>' + feature.properties.F_AL_AC01).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAquecimentoCentralFreg_01,
    })
};

var AquecimentoCentralFreg_01= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloAquecimentoCentralFreg_01,
    onEachFeature: onEachFeatureAquecimentoCentralFreg_01,
});


var slideAquecimentoCentralFreg_01 = function(){
    var sliderAquecimentoCentralFreg_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderAquecimentoCentralFreg_01, {
        start: [minAquecimentoCentralFreg_01, maxAquecimentoCentralFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAquecimentoCentralFreg_01,
            'max': maxAquecimentoCentralFreg_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAquecimentoCentralFreg_01);
    inputNumberMax.setAttribute("value",maxAquecimentoCentralFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderAquecimentoCentralFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAquecimentoCentralFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderAquecimentoCentralFreg_01.noUiSlider.on('update',function(e){
        AquecimentoCentralFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.F_AL_AC01>=parseFloat(e[0])&& layer.feature.properties.F_AL_AC01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAquecimentoCentralFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderAquecimentoCentralFreg_01.noUiSlider;
    $(slidersGeral).append(sliderAquecimentoCentralFreg_01);
}


///////////////////////////-------------------- FIM AQUECIMENTO CENTRAL ,FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////----------- Alojamentos  LAREIRA  EM 2001  FREGUESIAS------------------------------\\\\\\\\\\\\\

var minLareiraFreg_01 = 0;
var maxLareiraFreg_01 = 0;
function estiloLareiraFreg_01(feature, latlng) {
    if(feature.properties.F_AL_LAR01< minLareiraFreg_01 || minLareiraFreg_01 ===0){
        minLareiraFreg_01 = feature.properties.F_AL_LAR01
    }
    if(feature.properties.F_AL_LAR01> maxLareiraFreg_01){
        maxLareiraFreg_01 = feature.properties.F_AL_LAR01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AL_LAR01,0.3)
    });
}
function apagarLareiraFreg_01(e){
    var layer = e.target;
    LareiraFreg_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureLareiraFreg_01(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com lareira aberta: ' + '<b>' + feature.properties.F_AL_LAR01).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarLareiraFreg_01,
    })
};

var LareiraFreg_01= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloLareiraFreg_01,
    onEachFeature: onEachFeatureLareiraFreg_01,
});


var slideLareiraFreg_01 = function(){
    var sliderLareiraFreg_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderLareiraFreg_01, {
        start: [minLareiraFreg_01, maxLareiraFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minLareiraFreg_01,
            'max': maxLareiraFreg_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minLareiraFreg_01);
    inputNumberMax.setAttribute("value",maxLareiraFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderLareiraFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderLareiraFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderLareiraFreg_01.noUiSlider.on('update',function(e){
        LareiraFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.F_AL_LAR01>=parseFloat(e[0])&& layer.feature.properties.F_AL_LAR01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderLareiraFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderLareiraFreg_01.noUiSlider;
    $(slidersGeral).append(sliderLareiraFreg_01);
}


///////////////////////////-------------------- FIM LAREIRA ,FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////----------- Alojamentos  APARELHOS MÓVEIS  EM 2001  FREGUESIAS--------------------------\\\\\\\\\\\\\

var minAparelhoMovelFreg_01 = 0;
var maxAparelhoMovelFreg_01 = 0;
function estiloAparelhoMovelFreg_01(feature, latlng) {
    if(feature.properties.F_AL_APM01< minAparelhoMovelFreg_01 || minAparelhoMovelFreg_01 ===0){
        minAparelhoMovelFreg_01 = feature.properties.F_AL_APM01
    }
    if(feature.properties.F_AL_APM01> maxAparelhoMovelFreg_01){
        maxAparelhoMovelFreg_01 = feature.properties.F_AL_APM01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AL_APM01,0.25)
    });
}
function apagarAparelhoMovelFreg_01(e){
    var layer = e.target;
    AparelhoMovelFreg_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAparelhoMovelFreg_01(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aparelhos móveis: ' + '<b>' + feature.properties.F_AL_APM01).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAparelhoMovelFreg_01,
    })
};

var AparelhoMovelFreg_01= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloAparelhoMovelFreg_01,
    onEachFeature: onEachFeatureAparelhoMovelFreg_01,
});


var slideAparelhoMovelFreg_01 = function(){
    var sliderAparelhoMovelFreg_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderAparelhoMovelFreg_01, {
        start: [minAparelhoMovelFreg_01, maxAparelhoMovelFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhoMovelFreg_01,
            'max': maxAparelhoMovelFreg_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAparelhoMovelFreg_01);
    inputNumberMax.setAttribute("value",maxAparelhoMovelFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhoMovelFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhoMovelFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderAparelhoMovelFreg_01.noUiSlider.on('update',function(e){
        AparelhoMovelFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.F_AL_APM01>=parseFloat(e[0])&& layer.feature.properties.F_AL_APM01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAparelhoMovelFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderAparelhoMovelFreg_01.noUiSlider;
    $(slidersGeral).append(sliderAparelhoMovelFreg_01);
}


///////////////////////////-------------------- FIM APARELHOS MÓVEIS ,FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////----------- Alojamentos  APARELHOS FIXOS  EM 2001  FREGUESIAS--------------------------\\\\\\\\\\\\\

var minAparelhoFixoFreg_01 = 0;
var maxAparelhoFixoFreg_01 = 0;
function estiloAparelhoFixoFreg_01(feature, latlng) {
    if(feature.properties.F_AL_APF01< minAparelhoFixoFreg_01 || minAparelhoFixoFreg_01 ===0){
        minAparelhoFixoFreg_01 = feature.properties.F_AL_APF01
    }
    if(feature.properties.F_AL_APF01> maxAparelhoFixoFreg_01){
        maxAparelhoFixoFreg_01 = feature.properties.F_AL_APF01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AL_APF01,0.3)
    });
}
function apagarAparelhoFixoFreg_01(e){
    var layer = e.target;
    AparelhoFixoFreg_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAparelhoFixoFreg_01(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aparelhos fixos: ' + '<b>' + feature.properties.F_AL_APF01).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAparelhoFixoFreg_01,
    })
};

var AparelhoFixoFreg_01= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloAparelhoFixoFreg_01,
    onEachFeature: onEachFeatureAparelhoFixoFreg_01,
});


var slideAparelhoFixoFreg_01 = function(){
    var sliderAparelhoFixoFreg_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderAparelhoFixoFreg_01, {
        start: [minAparelhoFixoFreg_01, maxAparelhoFixoFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhoFixoFreg_01,
            'max': maxAparelhoFixoFreg_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAparelhoFixoFreg_01);
    inputNumberMax.setAttribute("value",maxAparelhoFixoFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhoFixoFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhoFixoFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderAparelhoFixoFreg_01.noUiSlider.on('update',function(e){
        AparelhoFixoFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.F_AL_APF01>=parseFloat(e[0])&& layer.feature.properties.F_AL_APF01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAparelhoFixoFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderAparelhoFixoFreg_01.noUiSlider;
    $(slidersGeral).append(sliderAparelhoFixoFreg_01);
}


///////////////////////////-------------------- FIM APARELHOS FIXOS ,FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////----------- Alojamentos NENHUM  EM 2001  FREGUESIAS--------------------------\\\\\\\\\\\\\

var minNenhumFreg_01 = 0;
var maxNenhumFreg_01 = 0;
function estiloNenhumFreg_01(feature, latlng) {
    if(feature.properties.F_AL_Nen01< minNenhumFreg_01 || minNenhumFreg_01 ===0){
        minNenhumFreg_01 = feature.properties.F_AL_Nen01
    }
    if(feature.properties.F_AL_Nen01> maxNenhumFreg_01){
        maxNenhumFreg_01 = feature.properties.F_AL_Nen01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AL_Nen01,0.3)
    });
}
function apagarNenhumFreg_01(e){
    var layer = e.target;
    NenhumFreg_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureNenhumFreg_01(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem aquecimento: ' + '<b>' + feature.properties.F_AL_Nen01).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarNenhumFreg_01,
    })
};

var NenhumFreg_01= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloNenhumFreg_01,
    onEachFeature: onEachFeatureNenhumFreg_01,
});


var slideNenhumFreg_01 = function(){
    var sliderNenhumFreg_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 61){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderNenhumFreg_01, {
        start: [minNenhumFreg_01, maxNenhumFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minNenhumFreg_01,
            'max': maxNenhumFreg_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minNenhumFreg_01);
    inputNumberMax.setAttribute("value",maxNenhumFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderNenhumFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderNenhumFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderNenhumFreg_01.noUiSlider.on('update',function(e){
        NenhumFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.F_AL_Nen01>=parseFloat(e[0])&& layer.feature.properties.F_AL_Nen01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderNenhumFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 61;
    sliderAtivo = sliderNenhumFreg_01.noUiSlider;
    $(slidersGeral).append(sliderNenhumFreg_01);
}


///////////////////////////-------------------- FIM Alojamentos NENHUM ,FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////----------------------- FIM DADOS ABSOLUTOS FREGUESIA --------------------\\\\\\\\\\\\\\\\

//////////////////-------------------- DADOS RELATIVOS FREGUESIA 2011 -------------\\\\\\\\\\\\\\\\\
var minAquecimentoCentralFreg11 = 99;
var maxAquecimentoCentralFreg11 = 0;

function CorPerAquecimentoCentralFreg(d) {
    return d == 0.00 ? '#000000' :
        d >= 34.74 ? '#8c0303' :
        d >= 28.98  ? '#de1f35' :
        d >= 19.4 ? '#ff5e6e' :
        d >= 9.81   ? '#f5b3be' :
        d >= 0.22   ? '#F2C572' :
                ''  ;
}
var legendaPerAquecimentoCentralFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 56.91' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 48.32 a 56.91' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 34.02 a 48.32' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 19.71 a 34.02' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 5 a 19.71' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' 0' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloAquecimentoCentralFreg11(feature) {
    if( feature.properties.PercAC11 <= minAquecimentoCentralFreg11 || feature.properties.PercAC11 === 0){
        minAquecimentoCentralFreg11 = feature.properties.PercAC11
    }
    if(feature.properties.PercAC11 >= maxAquecimentoCentralFreg11 ){
        maxAquecimentoCentralFreg11 = feature.properties.PercAC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAquecimentoCentralFreg(feature.properties.PercAC11)
    };
}
function apagarAquecimentoCentralFreg11(e) {
    AquecimentoCentralFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAquecimentoCentralFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aquecimento central: ' + '<b>' + feature.properties.PercAC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAquecimentoCentralFreg11,
    });
}
var AquecimentoCentralFreg11= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloAquecimentoCentralFreg11,
    onEachFeature: onEachFeatureAquecimentoCentralFreg11
});
let slideAquecimentoCentralFreg11 = function(){
    var sliderAquecimentoCentralFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAquecimentoCentralFreg11, {
        start: [minAquecimentoCentralFreg11, maxAquecimentoCentralFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAquecimentoCentralFreg11,
            'max': maxAquecimentoCentralFreg11
        },
        });
    inputNumberMin.setAttribute("value",minAquecimentoCentralFreg11);
    inputNumberMax.setAttribute("value",maxAquecimentoCentralFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderAquecimentoCentralFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAquecimentoCentralFreg11.noUiSlider.set([null, this.value]);
    });

    sliderAquecimentoCentralFreg11.noUiSlider.on('update',function(e){
        AquecimentoCentralFreg11.eachLayer(function(layer){
            if(layer.feature.properties.PercAC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercAC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAquecimentoCentralFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderAquecimentoCentralFreg11.noUiSlider;
    $(slidersGeral).append(sliderAquecimentoCentralFreg11);
} 

/////////////////////////////////// Fim PERCENTAGEM AQUECIMENTO CENTRAL  2011 Concelho -------------- \\\\\\


//////////////////-------------------- PERCENTAGEM LAREIRA 2011 FREGUESIAS -------------\\\\\\\\\\\\\\\\\

var minLareiraFreg11 = 0;
var maxLareiraFreg11 = 0;

function CorPerLareiraAbertaFreg(d) {
    return d >= 88.01 ? '#8c0303' :
        d >= 73.35  ? '#de1f35' :
        d >= 48.93 ? '#ff5e6e' :
        d >= 24.5   ? '#f5b3be' :
        d >= 0.07   ? '#F2C572' :
                ''  ;
}
var legendaPerLareiraAbertaFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 88.01' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 73.35 a 88.01' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 48.93 a 73.35' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 24.5 a 48.93' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.07 a 24.5' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloLareiraFreg11(feature) {
    if( feature.properties.PercLAR11 <= minLareiraFreg11 || minLareiraFreg11 === 0){
        minLareiraFreg11 = feature.properties.PercLAR11
    }
    if(feature.properties.PercLAR11 >= maxLareiraFreg11 ){
        maxLareiraFreg11 = feature.properties.PercLAR11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerLareiraAbertaFreg(feature.properties.PercLAR11)
    };
}
function apagarLareiraFreg11(e) {
    LareiraFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureLareiraFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com lareira aberta: ' + '<b>' + feature.properties.PercLAR11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarLareiraFreg11,
    });
}
var LareiraFreg11= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloLareiraFreg11,
    onEachFeature: onEachFeatureLareiraFreg11
});
let slideLareiraFreg11 = function(){
    var sliderLareiraFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderLareiraFreg11, {
        start: [minLareiraFreg11, maxLareiraFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minLareiraFreg11,
            'max': maxLareiraFreg11
        },
        });
    inputNumberMin.setAttribute("value",minLareiraFreg11);
    inputNumberMax.setAttribute("value",maxLareiraFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderLareiraFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderLareiraFreg11.noUiSlider.set([null, this.value]);
    });

    sliderLareiraFreg11.noUiSlider.on('update',function(e){
        LareiraFreg11.eachLayer(function(layer){
            if(layer.feature.properties.PercLAR11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercLAR11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderLareiraFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderLareiraFreg11.noUiSlider;
    $(slidersGeral).append(sliderLareiraFreg11);
} 

/////////////////////////////////// Fim PERCENTAGEM LAREIRA  2011 Concelho -------------- \\\\\\


//////////////////-------------------- PERCENTAGEM RECUPERADOR CALOR 2011 FREGUESIAS -------------\\\\\\\\\\\\\\\\\
var minRecuperadorCalorFreg11 = 0;
var maxRecuperadorCalorFreg11 = 0;

function CorPerRecuperadorCalorFreg(d) {
    return d >= 21.4 ? '#8c0303' :
        d >= 17.85  ? '#de1f35' :
        d >= 11.95 ? '#ff5e6e' :
        d >= 6.04   ? '#f5b3be' :
        d >= 0.13   ? '#F2C572' :
                ''  ;
}
var legendaPerRecuperadorCalorFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 21.4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 17.85 a 21.4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 11.95 a 17.85' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 6.04 a 11.95' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.13 a 6.04' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloRecuperadorCalorFreg11(feature) {
    if( feature.properties.PercREC11 <= minRecuperadorCalorFreg11 || minRecuperadorCalorFreg11 === 0){
        minRecuperadorCalorFreg11 = feature.properties.PercREC11
    }
    if(feature.properties.PercREC11 >= maxRecuperadorCalorFreg11 ){
        maxRecuperadorCalorFreg11 = feature.properties.PercREC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRecuperadorCalorFreg(feature.properties.PercREC11)
    };
}
function apagarRecuperadorCalorFreg11(e) {
    RecuperadorCalorFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRecuperadorCalorFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com recuperador de calor: ' + '<b>' + feature.properties.PercREC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRecuperadorCalorFreg11,
    });
}
var RecuperadorCalorFreg11= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloRecuperadorCalorFreg11,
    onEachFeature: onEachFeatureRecuperadorCalorFreg11
});
let slideRecuperadorCalorFreg11 = function(){
    var sliderRecuperadorCalorFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 39){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRecuperadorCalorFreg11, {
        start: [minRecuperadorCalorFreg11, maxRecuperadorCalorFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minRecuperadorCalorFreg11,
            'max': maxRecuperadorCalorFreg11
        },
        });
    inputNumberMin.setAttribute("value",minRecuperadorCalorFreg11);
    inputNumberMax.setAttribute("value",maxRecuperadorCalorFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderRecuperadorCalorFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRecuperadorCalorFreg11.noUiSlider.set([null, this.value]);
    });

    sliderRecuperadorCalorFreg11.noUiSlider.on('update',function(e){
        RecuperadorCalorFreg11.eachLayer(function(layer){
            if(layer.feature.properties.PercREC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercREC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRecuperadorCalorFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 39;
    sliderAtivo = sliderRecuperadorCalorFreg11.noUiSlider;
    $(slidersGeral).append(sliderRecuperadorCalorFreg11);
} 

/////////////////////////////////// Fim PERCENTAGEM RECUPERADOR CALOR  2011 Concelho -------------- \\\\\\

//////////////////-------------------- PERCENTAGEM APARELHOS MOVEIS 2011 FREGUESIAS -------------\\\\\\\\\\\\\\\\\
var minAparelhoMovelFreg11 = 99;
var maxAparelhoMovelFreg11 = 0;

function CorPerAparelhosMoveisFreg(d) {
    return d == 0.00 ? '#000000' :
        d >= 64.79 ? '#8c0303' :
        d >= 54.04  ? '#de1f35' :
        d >= 36.11 ? '#ff5e6e' :
        d >= 18.19   ? '#f5b3be' :
        d >= 0.26   ? '#F2C572' :
                ''  ;
}
var legendaPerAparelhosMoveisFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 64.79' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 54.04 a 64.79' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 36.11 a 54.04' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 18.19 a 36.11' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.26 a 18.19' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' 0' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloAparelhoMovelFreg11(feature) {
    if( feature.properties.PercAPM11 <= minAparelhoMovelFreg11 || feature.properties.PercAPM11 === 0){
        minAparelhoMovelFreg11 = feature.properties.PercAPM11
    }
    if(feature.properties.PercAPM11 >= maxAparelhoMovelFreg11 ){
        maxAparelhoMovelFreg11 = feature.properties.PercAPM11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAparelhosMoveisFreg(feature.properties.PercAPM11)
    };
}
function apagarAparelhoMovelFreg11(e) {
    AparelhoMovelFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAparelhoMovelFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aparelhos fixos: ' + '<b>' + feature.properties.PercAPM11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAparelhoMovelFreg11,
    });
}
var AparelhoMovelFreg11= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloAparelhoMovelFreg11,
    onEachFeature: onEachFeatureAparelhoMovelFreg11
});
let slideAparelhoMovelFreg11 = function(){
    var sliderAparelhoMovelFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAparelhoMovelFreg11, {
        start: [minAparelhoMovelFreg11, maxAparelhoMovelFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhoMovelFreg11,
            'max': maxAparelhoMovelFreg11
        },
        });
    inputNumberMin.setAttribute("value",minAparelhoMovelFreg11);
    inputNumberMax.setAttribute("value",maxAparelhoMovelFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhoMovelFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhoMovelFreg11.noUiSlider.set([null, this.value]);
    });

    sliderAparelhoMovelFreg11.noUiSlider.on('update',function(e){
        AparelhoMovelFreg11.eachLayer(function(layer){
            if(layer.feature.properties.PercAPM11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercAPM11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAparelhoMovelFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderAparelhoMovelFreg11.noUiSlider;
    $(slidersGeral).append(sliderAparelhoMovelFreg11);
} 

/////////////////////////////////// Fim PERCENTAGEM APARELHOS MOVEIS  2011 Concelho -------------- \\\\\\

//////////////////-------------------- PERCENTAGEM APARELHOS FIXOS 2011 FREGUESIAS -------------\\\\\\\\\\\\\\\\\
var minAparelhoFixoFreg11 = 99;
var maxAparelhoFixoFreg11 = 0;

function CorPerAparelhosFixosFreg(d) {
    return d == 0.00 ? '#000000' :
        d >= 54.69 ? '#8c0303' :
        d >= 45.68  ? '#de1f35' :
        d >= 30.67 ? '#ff5e6e' :
        d >= 15.66   ? '#f5b3be' :
        d >= 0.65   ? '#F2C572' :
                ''  ;
}
var legendaPerAparelhosFixosFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 54.69' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 45.68 a 54.69' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 30.67 a 45.68' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 15.66 a 30.67' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.65 a 15.66' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' 0' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloAparelhoFixoFreg11(feature) {
    if( feature.properties.PercAPF11 <= minAparelhoFixoFreg11 || feature.properties.PercAPF11 === 0){
        minAparelhoFixoFreg11 = feature.properties.PercAPF11
    }
    if(feature.properties.PercAPF11 >= maxAparelhoFixoFreg11 ){
        maxAparelhoFixoFreg11 = feature.properties.PercAPF11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAparelhosFixosFreg(feature.properties.PercAPF11)
    };
}
function apagarAparelhoFixoFreg11(e) {
    AparelhoFixoFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAparelhoFixoFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aparelhos fixos: ' + '<b>' + feature.properties.PercAPF11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAparelhoFixoFreg11,
    });
}
var AparelhoFixoFreg11= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloAparelhoFixoFreg11,
    onEachFeature: onEachFeatureAparelhoFixoFreg11
});
let slideAparelhoFixoFreg11 = function(){
    var sliderAparelhoFixoFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAparelhoFixoFreg11, {
        start: [minAparelhoFixoFreg11, maxAparelhoFixoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhoFixoFreg11,
            'max': maxAparelhoFixoFreg11
        },
        });
    inputNumberMin.setAttribute("value",minAparelhoFixoFreg11);
    inputNumberMax.setAttribute("value",maxAparelhoFixoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhoFixoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhoFixoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderAparelhoFixoFreg11.noUiSlider.on('update',function(e){
        AparelhoFixoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.PercAPF11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercAPF11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAparelhoFixoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderAparelhoFixoFreg11.noUiSlider;
    $(slidersGeral).append(sliderAparelhoFixoFreg11);
} 

/////////////////////////////////// Fim PERCENTAGEM APARELHOS FIXOS  2011 Concelho -------------- \\\\\\

//////////////////-------------------- PERCENTAGEM NENHUM 2011 FREGUESIAS -------------\\\\\\\\\\\\\\\\\
var minNenhumFreg11 = 99;
var maxNenhumFreg11 = 0;

function CorPerNenhumFreg(d) {
    return d == 0.00 ? '#000000':
        d >= 60.58 ? '#8c0303' :
        d >= 50.53  ? '#de1f35' :
        d >= 33.78 ? '#ff5e6e' :
        d >= 17.03   ? '#f5b3be' :
        d >= 0.28   ? '#F2C572' :
                ''  ;
}
var legendaPerNenhumFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 60.58' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 50.53 a 60.58' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 33.78 a 50.53' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 17.03 a 33.78' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.28 a 17.03' + '<br>'

    $(legendaA).append(symbolsContainer); 
}


function EstiloNenhumFreg11(feature) {
    if( feature.properties.PercNen11 <= minNenhumFreg11 || feature.properties.PercNen11 === 0){
        minNenhumFreg11 = feature.properties.PercNen11
    }
    if(feature.properties.PercNen11 >= maxNenhumFreg11 ){
        maxNenhumFreg11 = feature.properties.PercNen11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerNenhumFreg(feature.properties.PercNen11)
    };
}
function apagarNenhumFreg11(e) {
    NenhumFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureNenhumFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem aquecimento: ' + '<b>' + feature.properties.PercNen11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarNenhumFreg11,
    });
}
var NenhumFreg11= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloNenhumFreg11,
    onEachFeature: onEachFeatureNenhumFreg11
});
let slideNenhumFreg11 = function(){
    var sliderNenhumFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 42){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderNenhumFreg11, {
        start: [minNenhumFreg11, maxNenhumFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minNenhumFreg11,
            'max': maxNenhumFreg11
        },
        });
    inputNumberMin.setAttribute("value",minNenhumFreg11);
    inputNumberMax.setAttribute("value",maxNenhumFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderNenhumFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderNenhumFreg11.noUiSlider.set([null, this.value]);
    });

    sliderNenhumFreg11.noUiSlider.on('update',function(e){
        NenhumFreg11.eachLayer(function(layer){
            if(layer.feature.properties.PercNen11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercNen11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderNenhumFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 42;
    sliderAtivo = sliderNenhumFreg11.noUiSlider;
    $(slidersGeral).append(sliderNenhumFreg11);
} 

/////////////////////////////////// Fim PERCENTAGEM NENHUM 2011 Concelho -------------- \\\\\\

//////////////////-------------------- AQUECIMENTO CENTRAL FREGUESIA 2001 -------------\\\\\\\\\\\\\\\\\
var minAquecimentoCentralFreg01 = 99;
var maxAquecimentoCentralFreg01 = 0;
function EstiloAquecimentoCentralFreg01(feature) {
    if(feature.properties.PercAC01 <= minAquecimentoCentralFreg01 || feature.properties.PercAC01 === 0){
        minAquecimentoCentralFreg01 = feature.properties.PercAC01
    }
    if(feature.properties.PercAC01 >= maxAquecimentoCentralFreg01 ){
        maxAquecimentoCentralFreg01 = feature.properties.PercAC01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAquecimentoCentralFreg(feature.properties.PercAC01)
    };
}
function apagarAquecimentoCentralFreg01(e) {
    AquecimentoCentralFreg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAquecimentoCentralFreg01(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aquecimento central: ' + '<b>' + feature.properties.PercAC01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAquecimentoCentralFreg01,
    });
}
var AquecimentoCentralFreg01= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloAquecimentoCentralFreg01,
    onEachFeature: onEachFeatureAquecimentoCentralFreg01
});
let slideAquecimentoCentralFreg01 = function(){
    var sliderAquecimentoCentralFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 43){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAquecimentoCentralFreg01, {
        start: [minAquecimentoCentralFreg01, maxAquecimentoCentralFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAquecimentoCentralFreg01,
            'max': maxAquecimentoCentralFreg01
        },
        });
    inputNumberMin.setAttribute("value",minAquecimentoCentralFreg01);
    inputNumberMax.setAttribute("value",maxAquecimentoCentralFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderAquecimentoCentralFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAquecimentoCentralFreg01.noUiSlider.set([null, this.value]);
    });

    sliderAquecimentoCentralFreg01.noUiSlider.on('update',function(e){
        AquecimentoCentralFreg01.eachLayer(function(layer){
            if(layer.feature.properties.PercAC01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercAC01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAquecimentoCentralFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 43;
    sliderAtivo = sliderAquecimentoCentralFreg01.noUiSlider;
    $(slidersGeral).append(sliderAquecimentoCentralFreg01);
} 

/////////////////////////////////// Fim PERCENTAGEM AQUECIMENTO CENTRAL  2001 Concelho -------------- \\\\\\


//////////////////-------------------- PERCENTAGEM LAREIRA 2001 FREGUESIAS -------------\\\\\\\\\\\\\\\\\
var minLareiraFreg01 = 0;
var maxLareiraFreg01 = 0;
function EstiloLareiraFreg01(feature) {
    if( feature.properties.PercLAR01 <= minLareiraFreg01 || minLareiraFreg01 === 0){
        minLareiraFreg01 = feature.properties.PercLAR01
    }
    if(feature.properties.PercLAR01 >= maxLareiraFreg01 ){
        maxLareiraFreg01 = feature.properties.PercLAR01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerLareiraAbertaFreg(feature.properties.PercLAR01)
    };
}
function apagarLareiraFreg01(e) {
    LareiraFreg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureLareiraFreg01(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com lareira aberta: ' + '<b>' + feature.properties.PercLAR01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarLareiraFreg01,
    });
}
var LareiraFreg01= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloLareiraFreg01,
    onEachFeature: onEachFeatureLareiraFreg01
});
let slideLareiraFreg01 = function(){
    var sliderLareiraFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 44){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderLareiraFreg01, {
        start: [minLareiraFreg01, maxLareiraFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minLareiraFreg01,
            'max': maxLareiraFreg01
        },
        });
    inputNumberMin.setAttribute("value",minLareiraFreg01);
    inputNumberMax.setAttribute("value",maxLareiraFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderLareiraFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderLareiraFreg01.noUiSlider.set([null, this.value]);
    });

    sliderLareiraFreg01.noUiSlider.on('update',function(e){
        LareiraFreg01.eachLayer(function(layer){
            if(layer.feature.properties.PercLAR01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercLAR01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderLareiraFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 44;
    sliderAtivo = sliderLareiraFreg01.noUiSlider;
    $(slidersGeral).append(sliderLareiraFreg01);
} 

/////////////////////////////////// Fim PERCENTAGEM LAREIRA  2001 Concelho -------------- \\\\\\

//////////////////-------------------- PERCENTAGEM APARELHOS MOVEIS 2001 FREGUESIAS -------------\\\\\\\\\\\\\\\\\
var minAparelhoMovelFreg01 = 99;
var maxAparelhoMovelFreg01 = 0;
function EstiloAparelhoMovelFreg01(feature) {
    if(feature.properties.PercAPM01 <= minAparelhoMovelFreg01 || feature.properties.PercAPM01 === 0){
        minAparelhoMovelFreg01 = feature.properties.PercAPM01
    }
    if(feature.properties.PercAPM01 >= maxAparelhoMovelFreg01 ){
        maxAparelhoMovelFreg01 = feature.properties.PercAPM01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAparelhosMoveisFreg(feature.properties.PercAPM01)
    };
}
function apagarAparelhoMovelFreg01(e) {
    AparelhoMovelFreg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAparelhoMovelFreg01(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aparelhos móveis: ' + '<b>' + feature.properties.PercAPM01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAparelhoMovelFreg01,
    });
}
var AparelhoMovelFreg01= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloAparelhoMovelFreg01,
    onEachFeature: onEachFeatureAparelhoMovelFreg01
});
let slideAparelhoMovelFreg01 = function(){
    var sliderAparelhoMovelFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAparelhoMovelFreg01, {
        start: [minAparelhoMovelFreg01, maxAparelhoMovelFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhoMovelFreg01,
            'max': maxAparelhoMovelFreg01
        },
        });
    inputNumberMin.setAttribute("value",minAparelhoMovelFreg01);
    inputNumberMax.setAttribute("value",maxAparelhoMovelFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhoMovelFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhoMovelFreg01.noUiSlider.set([null, this.value]);
    });

    sliderAparelhoMovelFreg01.noUiSlider.on('update',function(e){
        AparelhoMovelFreg01.eachLayer(function(layer){
            if(layer.feature.properties.PercAPM01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercAPM01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAparelhoMovelFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderAparelhoMovelFreg01.noUiSlider;
    $(slidersGeral).append(sliderAparelhoMovelFreg01);
} 

/////////////////////////////////// Fim PERCENTAGEM APARELHOS MOVEIS  2001 Concelho -------------- \\\\\\

//////////////////-------------------- PERCENTAGEM APARELHOS FIXOS 2001 FREGUESIAS -------------\\\\\\\\\\\\\\\\\
var minAparelhoFixoFreg01 = 99;
var maxAparelhoFixoFreg01 = 0;
function EstiloAparelhoFixoFreg01(feature) {
    if( feature.properties.PercAPF01 <= minAparelhoFixoFreg01 || feature.properties.PercAPF01 === 0){
        minAparelhoFixoFreg01 = feature.properties.PercAPF01
    }
    if(feature.properties.PercAPF01 >= maxAparelhoFixoFreg01 ){
        maxAparelhoFixoFreg01 = feature.properties.PercAPF01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAparelhosFixosFreg(feature.properties.PercAPF01)
    };
}
function apagarAparelhoFixoFreg01(e) {
    AparelhoFixoFreg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAparelhoFixoFreg01(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com aparelhos fixos: ' + '<b>' + feature.properties.PercAPF01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAparelhoFixoFreg01,
    });
}
var AparelhoFixoFreg01= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloAparelhoFixoFreg01,
    onEachFeature: onEachFeatureAparelhoFixoFreg01
});
let slideAparelhoFixoFreg01 = function(){
    var sliderAparelhoFixoFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 46){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAparelhoFixoFreg01, {
        start: [minAparelhoFixoFreg01, maxAparelhoFixoFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAparelhoFixoFreg01,
            'max': maxAparelhoFixoFreg01
        },
        });
    inputNumberMin.setAttribute("value",minAparelhoFixoFreg01);
    inputNumberMax.setAttribute("value",maxAparelhoFixoFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderAparelhoFixoFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAparelhoFixoFreg01.noUiSlider.set([null, this.value]);
    });

    sliderAparelhoFixoFreg01.noUiSlider.on('update',function(e){
        AparelhoFixoFreg01.eachLayer(function(layer){
            if(layer.feature.properties.PercAPF01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercAPF01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAparelhoFixoFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 46;
    sliderAtivo = sliderAparelhoFixoFreg01.noUiSlider;
    $(slidersGeral).append(sliderAparelhoFixoFreg01);
} 

/////////////////////////////////// Fim PERCENTAGEM APARELHOS FIXOS  2001 Concelho -------------- \\\\\\

//////////////////-------------------- PERCENTAGEM NENHUM 2001 FREGUESIAS -------------\\\\\\\\\\\\\\\\\
var minNenhumFreg01 = 99;
var maxNenhumFreg01 = 0;
function EstiloNenhumFreg01(feature) {
    if( feature.properties.PercNen01 <= minNenhumFreg01 || feature.properties.PercNen01 === 0){
        minNenhumFreg01 = feature.properties.PercNen01
    }
    if(feature.properties.PercNen01 >= maxNenhumFreg01 ){
        maxNenhumFreg01 = feature.properties.PercNen01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerNenhumFreg(feature.properties.PercNen01)
    };
}
function apagarNenhumFreg01(e) {
    NenhumFreg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureNenhumFreg01(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem aquecimento: ' + '<b>' + feature.properties.PercNen01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarNenhumFreg01,
    });
}
var NenhumFreg01= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloNenhumFreg01,
    onEachFeature: onEachFeatureNenhumFreg01
});
let slideNenhumFreg01 = function(){
    var sliderNenhumFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 47){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderNenhumFreg01, {
        start: [minNenhumFreg01, maxNenhumFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minNenhumFreg01,
            'max': maxNenhumFreg01
        },
        });
    inputNumberMin.setAttribute("value",minNenhumFreg01);
    inputNumberMax.setAttribute("value",maxNenhumFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderNenhumFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderNenhumFreg01.noUiSlider.set([null, this.value]);
    });

    sliderNenhumFreg01.noUiSlider.on('update',function(e){
        NenhumFreg01.eachLayer(function(layer){
            if(layer.feature.properties.PercNen01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercNen01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderNenhumFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 47;
    sliderAtivo = sliderNenhumFreg01.noUiSlider;
    $(slidersGeral).append(sliderNenhumFreg01);
} 

/////////////////////////////////// Fim PERCENTAGEM NENHUM 2001 Concelho -------------- \\\\\\

/////////////////////////////------------------------ FIM DADOS RELATIVOS FREGUESIA ------------- \\\\\\\\\\\\\\\\
/////////////////////////////------- Variação AQUECIMENTO CENTRAL, FREGUESIA 2011 2001 -------------------////

var minVarAquecimentoCentralFreg = 99;
var maxVarAquecimentoCentralFreg = 0;

function CorVarAquecimentoCentralFreg11_01(d) {
    return d === null ? '#808080':
        d >= 75  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -30.52   ? '#9eaad7' :
                ''  ;
}

var legendaVarAquecimentoCentralFreg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares de residência habitual com aquecimento central, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -30.51 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAquecimentoCentralFreg(feature) {
    if(feature.properties.V_AC11_01 <= minVarAquecimentoCentralFreg){
        minVarAquecimentoCentralFreg = feature.properties.V_AC11_01
    }
    if(feature.properties.V_AC11_01 > maxVarAquecimentoCentralFreg){
        maxVarAquecimentoCentralFreg = feature.properties.V_AC11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarAquecimentoCentralFreg11_01(feature.properties.V_AC11_01)};
    }


function apagarVarAquecimentoCentralFreg(e) {
    VarAquecimentoCentralFreg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAquecimentoCentralFreg(feature, layer) {
    if(feature.properties.V_AC11_01 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_AC11_01.toFixed(2) + '</b>' + '%').openPopup()
    }    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAquecimentoCentralFreg,
    });
}
var VarAquecimentoCentralFreg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarAquecimentoCentralFreg,
    onEachFeature: onEachFeatureVarAquecimentoCentralFreg
});

let slideVarAquecimentoCentralFreg = function(){
    var sliderVarAquecimentoCentralFreg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 48){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAquecimentoCentralFreg, {
        start: [minVarAquecimentoCentralFreg, maxVarAquecimentoCentralFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAquecimentoCentralFreg,
            'max': maxVarAquecimentoCentralFreg
        },
        });
    inputNumberMin.setAttribute("value",minVarAquecimentoCentralFreg);
    inputNumberMax.setAttribute("value",maxVarAquecimentoCentralFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAquecimentoCentralFreg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAquecimentoCentralFreg.noUiSlider.set([null, this.value]);
    });

    sliderVarAquecimentoCentralFreg.noUiSlider.on('update',function(e){
        VarAquecimentoCentralFreg.eachLayer(function(layer){
            if(layer.feature.properties.V_AC11_01 == null){
                return false
            }
            if(layer.feature.properties.V_AC11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_AC11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAquecimentoCentralFreg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 48;
    sliderAtivo = sliderVarAquecimentoCentralFreg.noUiSlider;
    $(slidersGeral).append(sliderVarAquecimentoCentralFreg);
} 

//////////////////////--------- Fim da Variação AQUECIMENTO CENTRAL, FREGUESIA 2011 2001-------------- \\\\\\

/////////////////////////////------- Variação LAREIRA, FREGUESIA 2011 2001 -------------------////

var minVarLareiraFreg = 99;
var maxVarLareiraFreg = 0;

function CorVarLareiraAbertaFreg11_01(d) {
    return d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -50  ? '#2288bf' :
        d >= -88.9   ? '#155273' :
                ''  ;
}

var legendaVarLareiraAbertaFreg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares de residência habitual com lareira aberta, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -88.89 a -50' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarLareiraFreg(feature) {
    if(feature.properties.V_LAR11_01 <= minVarLareiraFreg){
        minVarLareiraFreg = feature.properties.V_LAR11_01
    }
    if(feature.properties.V_LAR11_01 > maxVarLareiraFreg){
        maxVarLareiraFreg = feature.properties.V_LAR11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarLareiraAbertaFreg11_01(feature.properties.V_LAR11_01)};
    }


function apagarVarLareiraFreg(e) {
    VarLareiraFreg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarLareiraFreg(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_LAR11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarLareiraFreg,
    });
}
var VarLareiraFreg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarLareiraFreg,
    onEachFeature: onEachFeatureVarLareiraFreg
});

let slideVarLareiraFreg = function(){
    var sliderVarLareiraFreg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 49){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarLareiraFreg, {
        start: [minVarLareiraFreg, maxVarLareiraFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarLareiraFreg,
            'max': maxVarLareiraFreg
        },
        });
    inputNumberMin.setAttribute("value",minVarLareiraFreg);
    inputNumberMax.setAttribute("value",maxVarLareiraFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVarLareiraFreg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarLareiraFreg.noUiSlider.set([null, this.value]);
    });

    sliderVarLareiraFreg.noUiSlider.on('update',function(e){
        VarLareiraFreg.eachLayer(function(layer){
            if(layer.feature.properties.V_LAR11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_LAR11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarLareiraFreg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 49;
    sliderAtivo = sliderVarLareiraFreg.noUiSlider;
    $(slidersGeral).append(sliderVarLareiraFreg);
} 

//////////////////////--------- Fim da Variação LAREIRA, FREGUESIA 2011 2001-------------- \\\\\\

/////////////////////////////------- Variação APARELHOS MÓVEIS, FREGUESIA 2011 2001 -------------------////

var minVarAparelhosMoveisFreg = 0;
var maxVarAparelhosMoveisFreg = 0;

function CorVarAparelhosMoveisFreg11_01(d) {
    return d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -100.1   ? '#2288bf' :
                ''  ;
}

var legendaVarAparelhosMoveisFreg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares de residência habitual com aparelhos móveis, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAparelhosMoveisFreg(feature) {
    if(feature.properties.V_APM11_01 <= minVarAparelhosMoveisFreg){
        minVarAparelhosMoveisFreg = feature.properties.V_APM11_01
    }
    if(feature.properties.V_APM11_01 > maxVarAparelhosMoveisFreg){
        maxVarAparelhosMoveisFreg = feature.properties.V_APM11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarAparelhosMoveisFreg11_01(feature.properties.V_APM11_01)};
    }


function apagarVarAparelhosMoveisFreg(e) {
    VarAparelhosMoveisFreg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAparelhosMoveisFreg(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_APM11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAparelhosMoveisFreg,
    });
}
var VarAparelhosMoveisFreg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarAparelhosMoveisFreg,
    onEachFeature: onEachFeatureVarAparelhosMoveisFreg
});

let slideVarAparelhosMoveisFreg = function(){
    var sliderVarAparelhosMoveisFreg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 50){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAparelhosMoveisFreg, {
        start: [minVarAparelhosMoveisFreg, maxVarAparelhosMoveisFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAparelhosMoveisFreg,
            'max': maxVarAparelhosMoveisFreg
        },
        });
    inputNumberMin.setAttribute("value",minVarAparelhosMoveisFreg);
    inputNumberMax.setAttribute("value",maxVarAparelhosMoveisFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAparelhosMoveisFreg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAparelhosMoveisFreg.noUiSlider.set([null, this.value]);
    });

    sliderVarAparelhosMoveisFreg.noUiSlider.on('update',function(e){
        VarAparelhosMoveisFreg.eachLayer(function(layer){
            if(layer.feature.properties.V_APM11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_APM11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAparelhosMoveisFreg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 50;
    sliderAtivo = sliderVarAparelhosMoveisFreg.noUiSlider;
    $(slidersGeral).append(sliderVarAparelhosMoveisFreg);
} 

//////////////////////--------- Fim da Variação APARELHOS MÓVEIS, FREGUESIA 2011 2001-------------- \\\\\\

/////////////////////////////------- Variação APARELHOS FIXOS, FREGUESIA 2011 2001 -------------------////

var minVarAparelhosFixosFreg = 0;
var maxVarAparelhosFixosFreg = 0;

function CorVarAparelhosFixosFreg11_01(d) {
    return d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -100.1   ? '#2288bf' :
                ''  ;
}

var legendaVarAparelhosFixosFreg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares de residência habitual com aparelhos fixos, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAparelhosFixosFreg(feature) {
    if(feature.properties.V_APF11_01 <= minVarAparelhosFixosFreg){
        minVarAparelhosFixosFreg = feature.properties.V_APF11_01
    }
    if(feature.properties.V_APF11_01 > maxVarAparelhosFixosFreg){
        maxVarAparelhosFixosFreg = feature.properties.V_APF11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarAparelhosFixosFreg11_01(feature.properties.V_APF11_01)};
    }


function apagarVarAparelhosFixosFreg(e) {
    VarAparelhosFixosFreg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAparelhosFixosFreg(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_APF11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAparelhosFixosFreg,
    });
}
var VarAparelhosFixosFreg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarAparelhosFixosFreg,
    onEachFeature: onEachFeatureVarAparelhosFixosFreg
});

let slideVarAparelhosFixosFreg = function(){
    var sliderVarAparelhosFixosFreg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 51){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAparelhosFixosFreg, {
        start: [minVarAparelhosFixosFreg, maxVarAparelhosFixosFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAparelhosFixosFreg,
            'max': maxVarAparelhosFixosFreg
        },
        });
    inputNumberMin.setAttribute("value",minVarAparelhosFixosFreg);
    inputNumberMax.setAttribute("value",maxVarAparelhosFixosFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAparelhosFixosFreg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAparelhosFixosFreg.noUiSlider.set([null, this.value]);
    });

    sliderVarAparelhosFixosFreg.noUiSlider.on('update',function(e){
        VarAparelhosFixosFreg.eachLayer(function(layer){
            if(layer.feature.properties.V_APF11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_APF11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAparelhosFixosFreg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 51;
    sliderAtivo = sliderVarAparelhosFixosFreg.noUiSlider;
    $(slidersGeral).append(sliderVarAparelhosFixosFreg);
} 

//////////////////////--------- Fim da Variação APARELHOS FIXOS, FREGUESIA 2011 2001-------------- \\\\\\

/////////////////////////////------- Variação NENHUM, FREGUESIA 2011 2001 -------------------////

var minVarNenhumFreg = 0;
var maxVarNenhumFreg = 0;

function CorVarNenhumFreg11_01(d) {
    return d === null ? '#808080':
        d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -100.1   ? '#2288bf' :
                ''  ;
}

var legendaVarNenhumFreg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares de residência habitual sem sistema de aquecimento, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarNenhumFreg(feature) {
    if(feature.properties.V_NEN11_01 <= minVarNenhumFreg){
        minVarNenhumFreg = feature.properties.V_NEN11_01
    }
    if(feature.properties.V_NEN11_01 > maxVarNenhumFreg){
        maxVarNenhumFreg = feature.properties.V_NEN11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarNenhumFreg11_01(feature.properties.V_NEN11_01)};
    }


function apagarVarNenhumFreg(e) {
    VarNenhumFreg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarNenhumFreg(feature, layer) {
    if(feature.properties.V_NEN11_01 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_NEN11_01.toFixed(2) + '</b>' + '%').openPopup()
    }       layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarNenhumFreg,
    });
}
var VarNenhumFreg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarNenhumFreg,
    onEachFeature: onEachFeatureVarNenhumFreg
});

let slideVarNenhumFreg = function(){
    var sliderVarNenhumFreg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 52){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarNenhumFreg, {
        start: [minVarNenhumFreg, maxVarNenhumFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarNenhumFreg,
            'max': maxVarNenhumFreg
        },
        });
    inputNumberMin.setAttribute("value",minVarNenhumFreg);
    inputNumberMax.setAttribute("value",maxVarNenhumFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVarNenhumFreg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarNenhumFreg.noUiSlider.set([null, this.value]);
    });

    sliderVarNenhumFreg.noUiSlider.on('update',function(e){
        VarNenhumFreg.eachLayer(function(layer){
            if(layer.feature.properties.V_NEN11_01 == null){
                return false
            }
            if(layer.feature.properties.V_NEN11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_NEN11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarNenhumFreg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 52;
    sliderAtivo = sliderVarNenhumFreg.noUiSlider;
    $(slidersGeral).append(sliderVarNenhumFreg);
} 

//////////////////////--------- Fim da Variação NENHUM, FREGUESIA 2011 2001-------------- \\\\\\




var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Recenseamento da população e habitação';

/// Não duplicar as layers
let naoDuplicar = 7
//// dizer qual a layer ativa
let layerAtiva = AquecCentralConc_01;
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
    if (layer == AquecCentralConc_11 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com aquecimento central, em 2011, por concelho.' + '</strong>');
        legenda(maxAquecCentralConc_11, ((maxAquecCentralConc_11-minAquecCentralConc_11)/2).toFixed(0),minAquecCentralConc_11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideAquecCentralConc_11();
        naoDuplicar = 1;
    }
    if (layer == AquecCentralConc_11 && naoDuplicar == 1){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com aquecimento central, em 2011, por concelho.' + '</strong>');
    }
    if (layer == LareiraConc_11 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com lareira aberta, em 2011, por concelho.' + '</strong>');
        legenda(maxLareiraConc_11, ((maxLareiraConc_11-minLareiraConc_11)/2).toFixed(0),minLareiraConc_11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideLareiraConc_11();
        naoDuplicar = 2 ;
    }
    if (layer == RecuperadorConc_11 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com recuperador de calor, em 2011, por concelho.' + '</strong>');
        legenda(maxRecuperadorConc_11, ((maxRecuperadorConc_11-minRecuperadorConc_11)/2).toFixed(0),minRecuperadorConc_11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideRecuperadorConc_11();
        naoDuplicar = 3 ;
    }
    if (layer == AparelhosMoveisConc_11 && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com aparelhos móveis, em 2011, por concelho.' + '</strong>');
        legenda(maxAparelhosMoveisConc_11, ((maxAparelhosMoveisConc_11-minAparelhosMoveisConc_11)/2).toFixed(0),minAparelhosMoveisConc_11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideAparelhosMoveisConc_11();
        naoDuplicar = 4 ;
    }
    if (layer == AparelhosFixosConc_11 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com aparelhos fixos, em 2011, por concelho.' + '</strong>');
        legenda(maxAparelhosFixosConc_11, ((maxAparelhosFixosConc_11-minAparelhosFixosConc_11)/2).toFixed(0),minAparelhosFixosConc_11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideAparelhosFixosConc_11();
        naoDuplicar = 5 ;
    }
    if (layer == NenhumConc_11 && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual sem sistema de aquecimento, em 2011, por concelho.' + '</strong>');
        legenda(maxNenhumConc_11, ((maxNenhumConc_11-minNenhumConc_11)/2).toFixed(0),minNenhumConc_11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideNenhumConc_11();
        naoDuplicar = 6;
    }
    if (layer == AquecCentralConc_01 && naoDuplicar != 7){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com aquecimento central, em 2001, por concelho.' + '</strong>');
        legenda(maxAquecCentralConc_01, ((maxAquecCentralConc_01-minAquecCentralConc_01)/2).toFixed(0),minAquecCentralConc_01,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideAquecCentralConc_01();
        naoDuplicar = 7;
    }
    if (layer == AquecCentralConc_01 && naoDuplicar == 7){
        contorno.addTo(map);
    }
    if (layer == LareiraConc_01 && naoDuplicar != 8){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com lareira aberta, em 2001, por concelho.' + '</strong>');
        legenda(maxLareiraConc_01, ((maxLareiraConc_01-minLareiraConc_01)/2).toFixed(0),minLareiraConc_01,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideLareiraConc_01();
        naoDuplicar = 8;
    }
    if (layer == AparelhosMoveisConc_01 && naoDuplicar != 9){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com aparelhos móveis, em 2001, por concelho.' + '</strong>');
        legenda(maxAparelhosMoveisConc_01, ((maxAparelhosMoveisConc_01-minAparelhosMoveisConc_01)/2).toFixed(0),minAparelhosMoveisConc_01,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideAparelhosMoveisConc_01();
        naoDuplicar = 9;
    }
    if (layer == AparelhosFixosConc_01 && naoDuplicar != 10){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com aparelhos fixos, em 2001, por concelho.' + '</strong>');
        legenda(maxAparelhosFixosConc_01, ((maxAparelhosFixosConc_01-minAparelhosFixosConc_01)/2).toFixed(0),minAparelhosFixosConc_01,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideAparelhosFixosConc_01();
        naoDuplicar = 10;
    }
    if (layer == NenhumConc_01 && naoDuplicar != 11){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual sem sistema de aquecimento, em 2001, por concelho.' + '</strong>');
        legenda(maxNenhumConc_01, ((maxNenhumConc_01-minNenhumConc_01)/2).toFixed(0),minNenhumConc_01,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideNenhumConc_01();
        naoDuplicar = 11;
    }
    if (layer == AquecimentoCentralConc11 && naoDuplicar != 12){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com aquecimento central, em 2011, por concelho.' + '</strong>');
        legendaPerAquecimentoCentralConc();
        slideAquecimentoCentralConc11();
        naoDuplicar = 12;
    }
    if (layer == LareiraAbertaConc11 && naoDuplicar != 13){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com lareira aberta, em 2011, por concelho.' + '</strong>');
        legendaPerLareiraAbertaConc();
        slideLareiraAbertaConc11();
        naoDuplicar = 13;
    }
    if (layer == RecuperadorCalorConc11 && naoDuplicar != 14){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com recuperador de calor, em 2011, por concelho.' + '</strong>');
        legendaPerRecuperadorCalorConc();
        slideRecuperadorCalorConc11();
        naoDuplicar = 14;
    }
    if (layer == AparelhosMoveisConc11 && naoDuplicar != 15){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com aparelhos móveis, em 2011, por concelho.' + '</strong>');
        legendaPerAparelhosMoveisConc();
        slideAparelhosMoveisConc11();
        naoDuplicar = 15;
    }
    if (layer == AparelhosFixosConc11 && naoDuplicar != 16){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com aparelhos fixos, em 2011, por concelho.' + '</strong>');
        legendaPerAparelhosFixosConc();
        slideAparelhosFixosConc11();
        naoDuplicar = 16;
    }
    if (layer == NenhumConc11 && naoDuplicar != 17){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem sistema de aquecimento, em 2011, por concelho.' + '</strong>');
        legendaPerNenhumConc();
        slideNenhumConc11();
        naoDuplicar = 17;
    }
    if (layer == AquecimentoCentralConc01 && naoDuplicar != 18){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com aquecimento central, em 2001, por concelho.' + '</strong>');
        legendaPerAquecimentoCentralConc();
        slideAquecimentoCentralConc01();
        naoDuplicar = 18;
    }
    if (layer == LareiraAbertaConc01 && naoDuplicar != 19){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com lareira aberta, em 2001, por concelho.' + '</strong>');
        legendaPerLareiraAbertaConc();
        slideLareiraAbertaConc01();
        naoDuplicar = 19;
    }
    if (layer == AparelhosMoveisConc01 && naoDuplicar != 20){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com aparelhos móveis, em 2001, por concelho.' + '</strong>');
        legendaPerAparelhosMoveisConc();
        slideAparelhosMoveisConc01();
        naoDuplicar = 20;
    }
    if (layer == AparelhosFixosConc01 && naoDuplicar != 21){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com aparelhos fixos, em 2001, por concelho.' + '</strong>');
        legendaPerAparelhosFixosConc();
        slideAparelhosFixosConc01();
        naoDuplicar = 21;
    }
    if (layer == NenhumConc01 && naoDuplicar != 22){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem sistema de aquecimento, em 2001, por concelho.' + '</strong>');
        legendaPerNenhumConc();
        slideNenhumConc01();
        naoDuplicar = 22;
    }
    if (layer == VarAquecimentoCentralConc && naoDuplicar != 23){
        legendaVarAquecimentoCentralConc11_01();
        slideVarAquecimentoCentralConc();
        naoDuplicar = 23;
    }
    if (layer == VarLareiraConc && naoDuplicar != 24){
        legendaVarLareiraConc11_01();
        slideVarLareiraConc();
        naoDuplicar = 24;
    }
    if (layer == VarAparelhosMoveisConc && naoDuplicar != 25){
        legendaVarAparelhosMoveisConc11_01();
        slideVarAparelhosMoveisConc();
        naoDuplicar = 25;
    }
    if (layer == VarAparelhosFixosConc && naoDuplicar != 26){
        legendaVarAparelhosFixosConc11_01();
        slideVarAparelhosFixosConc();
        naoDuplicar = 26;
    }
    if (layer == VarNenhumConc && naoDuplicar != 27){
        legendaVarNenhumConc11_01();
        slideVarNenhumConc();
        naoDuplicar = 27;
    }
    if (layer == AquecimentoCentralFreg_11 && naoDuplicar != 28){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com aquecimento central, em 2011, por freguesia.' + '</strong>');
        legenda(maxAquecimentoCentralFreg_11, ((maxAquecimentoCentralFreg_11-minAquecimentoCentralFreg_11)/2).toFixed(0),minAquecimentoCentralFreg_11,0.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideAquecimentoCentralFreg_11();
        naoDuplicar = 28;
    }
    if (layer == LareiraFreg_11 && naoDuplicar != 29){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com lareira aberta, em 2011, por freguesia.' + '</strong>');
        legendaExcecao(maxLareiraFreg_11, ((maxLareiraFreg_11-minLareiraFreg_11)/2).toFixed(0),minLareiraFreg_11,0.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideLareiraFreg_11();
        naoDuplicar = 29;
    }
    if (layer == RecuperadorCalorFreg_11 && naoDuplicar != 30){
        legendaExcecao(maxRecuperadorCalorFreg_11, ((maxRecuperadorCalorFreg_11-minRecuperadorCalorFreg_11)/2).toFixed(0),minRecuperadorCalorFreg_11,0.35);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideRecuperadorCalorFreg_11();
        naoDuplicar = 30;
    }
    if (layer == AparelhoMovelFreg_11 && naoDuplicar != 31){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com aparelhos móveis, em 2011, por freguesia.' + '</strong>');
        legenda(maxAparelhoMovelFreg_11, ((maxAparelhoMovelFreg_11-minAparelhoMovelFreg_11)/2).toFixed(0),minAparelhoMovelFreg_11,0.25);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideAparelhoMovelFreg_11();
        naoDuplicar = 31;
    }
    if (layer == AparelhoFixoFreg_11 && naoDuplicar != 32){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com aparelhos fixos, em 2011, por freguesia.' + '</strong>');
        legendaExcecao(maxAparelhoFixoFreg_11, ((maxAparelhoFixoFreg_11-minAparelhoFixoFreg_11)/2).toFixed(0),minAparelhoFixoFreg_11,0.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideAparelhoFixoFreg_11();
        naoDuplicar = 32;
    }
    if (layer == NenhumFreg_11 && naoDuplicar != 60){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual sem sistema de aquecimento, em 2011, por freguesia.' + '</strong>');
        legenda(maxNenhumFreg_11, ((maxNenhumFreg_11-minNenhumFreg_11)/2).toFixed(0),minNenhumFreg_11,0.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideNenhumFreg_11();
        naoDuplicar = 60;
    }
    if (layer == AquecimentoCentralFreg_01 && naoDuplicar != 33){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com aquecimento central, em 2001, por freguesia.' + '</strong>');
        legendaExcecao(maxAquecimentoCentralFreg_01, ((maxAquecimentoCentralFreg_01-minAquecimentoCentralFreg_01)/2).toFixed(0),minAquecimentoCentralFreg_01,0.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideAquecimentoCentralFreg_01();
        naoDuplicar = 33;
    }
    if (layer == AquecimentoCentralFreg_01 && naoDuplicar == 33){
        contornoFreg.addTo(map);
    }
    if (layer == LareiraFreg_01 && naoDuplicar != 34){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com lareira aberta, em 2001, por freguesia.' + '</strong>');
        legenda(maxLareiraFreg_01, ((maxLareiraFreg_01-minLareiraFreg_01)/2).toFixed(0),minLareiraFreg_01,0.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideLareiraFreg_01();
        naoDuplicar = 34;
    }
    if (layer == AparelhoMovelFreg_01 && naoDuplicar != 35){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com aparelhos móveis, em 2001, por freguesia.' + '</strong>');
        legendaExcecao(maxAparelhoMovelFreg_01, ((maxAparelhoMovelFreg_01-minAparelhoMovelFreg_01)/2).toFixed(0),minAparelhoMovelFreg_01,0.25);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideAparelhoMovelFreg_01();
        naoDuplicar = 35;
    }
    if (layer == AparelhoFixoFreg_01 && naoDuplicar != 36){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual com aparelhos fixos, em 2001, por freguesia.' + '</strong>');
        legenda(maxAparelhoFixoFreg_01, ((maxAparelhoFixoFreg_01-minAparelhoFixoFreg_01)/2).toFixed(0),minAparelhoFixoFreg_01,0.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideAparelhoFixoFreg_01();
        naoDuplicar = 36;
    }
    if (layer == NenhumFreg_01 && naoDuplicar != 61){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares de residência habitual sem sistema de aquecimento, em 2001, por freguesia.' + '</strong>');
        legenda(maxNenhumFreg_01, ((maxNenhumFreg_01-minNenhumFreg_01)/2).toFixed(0),minNenhumFreg_01,0.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideNenhumFreg_01();
        naoDuplicar = 61;
    }
    if (layer == AquecimentoCentralFreg11 && naoDuplicar != 37){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com aquecimento central, em 2011, por freguesia.' + '</strong>');
        legendaPerAquecimentoCentralFreg();
        slideAquecimentoCentralFreg11();
        naoDuplicar = 37;
    }
    if (layer == LareiraFreg11 && naoDuplicar != 38){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com lareira aberta, em 2011, por freguesia.' + '</strong>');
        legendaPerLareiraAbertaFreg();
        slideLareiraFreg11();
        naoDuplicar = 38;
    }
    if (layer == RecuperadorCalorFreg11 && naoDuplicar != 39){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com recuperador de calor, em 2011, por freguesia.' + '</strong>');
        legendaPerRecuperadorCalorFreg();
        slideRecuperadorCalorFreg11();
        naoDuplicar = 39;
    }
    if (layer == AparelhoMovelFreg11 && naoDuplicar != 40){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com aparelhos móveis, em 2011, por freguesia.' + '</strong>');
        legendaPerAparelhosMoveisFreg();
        slideAparelhoMovelFreg11();
        naoDuplicar = 40;
    }
    if (layer == AparelhoFixoFreg11 && naoDuplicar != 41){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com aparelhos fixos, em 2011, por freguesia.' + '</strong>');
        legendaPerAparelhosFixosFreg();
        slideAparelhoFixoFreg11();
        naoDuplicar = 41;
    }
    if (layer == NenhumFreg11 && naoDuplicar != 42){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem sistema de aquecimento, em 2011, por freguesia.' + '</strong>');
        legendaPerNenhumFreg();
        slideNenhumFreg11();
        naoDuplicar = 42;
    }
    if (layer == AquecimentoCentralFreg01 && naoDuplicar != 43){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com aquecimento central, em 2001, por freguesia.' + '</strong>');
        legendaPerAquecimentoCentralFreg();
        slideAquecimentoCentralFreg01();
        naoDuplicar = 43;
    }
    if (layer == LareiraFreg01 && naoDuplicar != 44){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com lareira aberta, em 2001, por freguesia.' + '</strong>');
        legendaPerLareiraAbertaFreg();
        slideLareiraFreg01();
        naoDuplicar = 44;
    }
    if (layer == AparelhoMovelFreg01 && naoDuplicar != 45){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com aparelhos móveis, em 2001, por freguesia.' + '</strong>');
        legendaPerAparelhosMoveisFreg();
        slideAparelhoMovelFreg01();
        naoDuplicar = 45;
    }
    if (layer == AparelhoFixoFreg01 && naoDuplicar != 46){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual com aparelhos fixos, em 2001, por freguesia.' + '</strong>');
        legendaPerAparelhosFixosFreg();
        slideAparelhoFixoFreg01();
        naoDuplicar = 46;
    }
    if (layer == NenhumFreg01 && naoDuplicar != 47){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem sistema de aquecimento, em 2001, por freguesia.' + '</strong>');
        legendaPerNenhumFreg();
        slideNenhumFreg01();
        naoDuplicar = 47;
    }
    if (layer == VarAquecimentoCentralFreg && naoDuplicar != 48){
        legendaVarAquecimentoCentralFreg11_01();
        slideVarAquecimentoCentralFreg();
        naoDuplicar = 48;
    }
    if (layer == VarLareiraFreg && naoDuplicar != 49){
        legendaVarLareiraAbertaFreg11_01();
        slideVarLareiraFreg();
        naoDuplicar = 49;
    }
    if (layer == VarAparelhosMoveisFreg && naoDuplicar != 50){
        legendaVarAparelhosMoveisFreg11_01();
        slideVarAparelhosMoveisFreg();
        naoDuplicar = 50;
    }
    if (layer == VarAparelhosFixosFreg && naoDuplicar != 51){
        legendaVarAparelhosFixosFreg11_01();
        slideVarAparelhosFixosFreg();
        naoDuplicar = 51;
    }
    if (layer == VarNenhumFreg && naoDuplicar != 52){
        legendaVarNenhumFreg11_01();
        slideVarNenhumFreg();
        naoDuplicar = 52;
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
let primeirovalor = function(){
    $("#mySelect").val('2001');
    $("#opcaoSelect").val('Central');    
}
function opcoesEpocaConstrucao(){
    var aquecimento = document.getElementById("opcaoSelect").value;
    var anoSelecionado = document.getElementById("mySelect").value;
    if (anoSelecionado == "2011"){
        if ($("#opcaoSelect option[value='Recuperador']").length == 0){
            $("#opcaoSelect option").eq(2).before($("<option></option>").val("Recuperador").text("Recuperador de calor"));
        }
    }
    if (anoSelecionado == "2011" && aquecimento == "Recuperador"){
        $("#mySelect option[value='2001']").remove();
    }
    if (aquecimento != "Recuperador" && $("#mySelect option[value='2001']").length == 0){
        $("#mySelect option").eq(0).before($("<option></option>").val("2001").text("2001"));
    }
    if (anoSelecionado != "2011" && $("#opcaoSelect option[value='Recuperador']").length > 0){
        $("#opcaoSelect option[value='Recuperador']").remove();
    }

}

function myFunction() {
    var aquecimento = document.getElementById("opcaoSelect").value;
    var anoSelecionado = document.getElementById("mySelect").value;
    opcoesEpocaConstrucao();
    if($('#absoluto').hasClass('active4')){
        $('#notaRodape').remove();
        if (anoSelecionado == "2011" && aquecimento == "Central"){
            novaLayer(AquecCentralConc_11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Central"){
            novaLayer(AquecCentralConc_01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Lareira"){
            novaLayer(LareiraConc_11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Lareira"){
            novaLayer(LareiraConc_01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Recuperador"){
            novaLayer(RecuperadorConc_11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Recuperador"){
            novaLayer(AquecCentralConc_01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Moveis"){
            novaLayer(AparelhosMoveisConc_11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Moveis"){
            novaLayer(AparelhosMoveisConc_01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Fixos"){
            novaLayer(AparelhosFixosConc_11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Fixos"){
            novaLayer(AparelhosFixosConc_01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Nenhum"){
            novaLayer(NenhumConc_11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Nenhum"){
            novaLayer(NenhumConc_01);
        }

    }
    if($('#taxaVariacao').hasClass('active4')){
        $('#notaRodape').remove();
        if (anoSelecionado == "2001" && aquecimento == "Central"){
            novaLayer(VarAquecimentoCentralConc);
        }
        if (anoSelecionado == "2001" && aquecimento == "Lareira"){
            novaLayer(VarLareiraConc);
        }
        if (anoSelecionado == "2001" && aquecimento == "Moveis"){
            novaLayer(VarAparelhosMoveisConc);
        }
        if (anoSelecionado == "2001" && aquecimento == "Fixos"){
            novaLayer(VarAparelhosFixosConc);
        }
        if (anoSelecionado == "2001" && aquecimento == "Nenhum"){
            novaLayer(VarNenhumConc);
        }

    }
    if ($('#percentagem').hasClass('active4')){
        $('#notaRodape').remove();
        if (anoSelecionado == "2011" && aquecimento == "Central"){
            novaLayer(AquecimentoCentralConc11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Central"){
            novaLayer(AquecimentoCentralConc01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Lareira"){
            novaLayer(LareiraAbertaConc11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Lareira"){
            novaLayer(LareiraAbertaConc01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Recuperador"){
            novaLayer(RecuperadorCalorConc11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Recuperador"){
            novaLayer(AquecimentoCentralConc01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Moveis"){
            novaLayer(AparelhosMoveisConc11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Moveis"){
            novaLayer(AparelhosMoveisConc01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Fixos"){
            novaLayer(AparelhosFixosConc11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Fixos"){
            novaLayer(AparelhosFixosConc01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Nenhum"){
            novaLayer(NenhumConc11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Nenhum"){
            novaLayer(NenhumConc01);
        }
    }
    if($('#absoluto').hasClass('active5')){
        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong>não devendo, assim, comparar com os dados absolutos ao nivel concelhio e os dados do sistema de aquecimento: Aparelhos móveis.</strong>')        
        if (anoSelecionado == "2011" && aquecimento == "Central"){
            novaLayer(AquecimentoCentralFreg_11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Central"){
            novaLayer(AquecimentoCentralFreg_01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Lareira"){
            novaLayer(LareiraFreg_11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Lareira"){
            novaLayer(LareiraFreg_01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Recuperador"){
            novaLayer(RecuperadorCalorFreg_11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Recuperador"){
            novaLayer(AquecimentoCentralFreg_01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Moveis"){
            novaLayer(AparelhoMovelFreg_11);
            notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong>não devendo, assim, comparar com os dados absolutos ao nivel concelhio e os restados dados à escala da freguesia.</strong>')
        }
        if (anoSelecionado == "2001" && aquecimento == "Moveis"){
            novaLayer(AparelhoMovelFreg_01);
            notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong>não devendo, assim, comparar com os dados absolutos ao nivel concelhio e os restados dados à escala da freguesia.</strong>')
        }
        if (anoSelecionado == "2011" && aquecimento == "Fixos"){
            novaLayer(AparelhoFixoFreg_11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Fixos"){
            novaLayer(AparelhoFixoFreg_01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Nenhum"){
            novaLayer(NenhumFreg_11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Nenhum"){
            novaLayer(NenhumFreg_01);
        }
    }
    if($('#taxaVariacao').hasClass('active5')){
        $('#notaRodape').remove();
        if (anoSelecionado == "2001" && aquecimento == "Central"){
            novaLayer(VarAquecimentoCentralFreg);
        }
        if (anoSelecionado == "2001" && aquecimento == "Lareira"){
            novaLayer(VarLareiraFreg);
        }
        if (anoSelecionado == "2001" && aquecimento == "Moveis"){
            novaLayer(VarAparelhosMoveisFreg);
        }
        if (anoSelecionado == "2001" && aquecimento == "Fixos"){
            novaLayer(VarAparelhosFixosFreg);
        }
        if (anoSelecionado == "2001" && aquecimento == "Nenhum"){
            novaLayer(VarNenhumFreg);
        }
    }
    if($('#percentagem').hasClass('active5')){
        $('#notaRodape').remove();
        if (anoSelecionado == "2011" && aquecimento == "Central"){
            novaLayer(AquecimentoCentralFreg11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Central"){
            novaLayer(AquecimentoCentralFreg01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Lareira"){
            novaLayer(LareiraFreg11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Lareira"){
            novaLayer(LareiraFreg01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Recuperador"){
            novaLayer(RecuperadorCalorFreg11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Recuperador"){
            novaLayer(AquecimentoCentralFreg01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Moveis"){
            novaLayer(AparelhoMovelFreg11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Moveis"){
            novaLayer(AparelhoMovelFreg01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Fixos"){
            novaLayer(AparelhoFixoFreg11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Fixos"){
            novaLayer(AparelhoFixoFreg01);
        }
        if (anoSelecionado == "2011" && aquecimento == "Nenhum"){
            novaLayer(NenhumFreg11);
        }
        if (anoSelecionado == "2001" && aquecimento == "Nenhum"){
            novaLayer(NenhumFreg01);
        }
    }
}

let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
function mudarEscala(){
    reporAnos();
    tamanhoOutros();
    fonteTitulo('N');
}

let reporAnos = function(){
    if($('#absoluto').hasClass('active4') || $('#percentagem').hasClass('active4') || $('#absoluto').hasClass('active5') || $('#percentagem').hasClass('active5')){
        $('#mySelect').empty();
        var ano = 2001;
        while (ano <= 2011){
            $('#mySelect').append("<option value="+ '' + ano + '' + '>' + ano + '</option>');
            ano += 10;
        }
    }
    if($('#taxaVariacao').hasClass('active4') ||$('#taxaVariacao').hasClass('active5') ){
        $('#mySelect').empty();
        $('#mySelect').append("<option value='2001'>2011 - 2001</option>");
    }
    primeirovalor();
}
$('#absoluto').click(function(){
    mudarEscala();

});
$('#percentagem').click(function(){
    mudarEscala();
    fonteTitulo('F');

});
$('#taxaVariacao').click(function(){
    mudarEscala();
    fonteTitulo('F');

});
let fonteTitulo = function(valor){
    if(valor == 'N'){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' INE, Recenseamento da população e habitação.' );
    }
    else{
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' Cálculos próprios; INE, Recenseamento da população e habitação.' );
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
        $('#percentagem').attr('class',"butao");
        $('#taxaVariacao').attr('class',"butao");
        mudarEscala();
    }
}

let variaveisMapaFreguesias = function(){
    if($('#absoluto').hasClass('active5')){
        return false;
    }
    else{
        $('#absoluto').attr('class',"butao active5");
        $('#percentagem').attr('class',"butao");
        $('#taxaVariacao').attr('class',"butao");
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
    $('#tituloMapa').html('Número de alojamentos familiares de residência habitual, segundo o sistema de aquecimento, entre 2001 e 2011, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/SistemaAquecimentoProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html("2001")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Aquecimento == "Recuperador de calor"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Aquecimento+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2011.toLocaleString("fr")+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Aquecimento+'</td>';
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
    $('#tituloMapa').html('Proporção do número de alojamentos familiares de residência habitual, segundo o sistema de aquecimento, entre 2001 e 2011, %.');
        $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/SistemaAquecimentoProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html("2001")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Aquecimento == "Recuperador de calor"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Aquecimento+'</td>';
                    dados += '<td class="borderbottom">'+value.Per01+'</td>';
                    dados += '<td class="borderbottom">'+value.Per11+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Aquecimento+'</td>';
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
    $('#tituloMapa').html('Variação do número de alojamentos familiares de residência habitual, segundo o sistema de aquecimento, entre 2001 e 2011, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/SistemaAquecimentoProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Aquecimento == "Recuperador de calor"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Aquecimento+'</td>';
                    dados += '<td class="borderbottom">'+ ''+'</td>';
                    dados += '<td class="borderbottom">'+value.VAR1101+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Aquecimento+'</td>';
                    dados += '<td>'+ ''+'</td>';
                    dados += '<td>'+value.VAR1101+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});
let anosSelecionados = function() {
    var aquecimento = document.getElementById("opcaoSelect").value;
    let anoSelecionado = document.getElementById("mySelect").value;
    if ($('#concelho').hasClass("active2")){
        if (anoSelecionado == "2011"){
            i = 1
        }

        if (anoSelecionado == "2001"){
            i = 0;
        }
    } 
    if ($('#freguesias').hasClass("active2")){
        if (anoSelecionado == "2011"){
            i =  1 ;
        }
        if (anoSelecionado == "2001"){
            i = 0;
        }
    }  
    if (aquecimento == "Recuperador"){
        i = 0
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