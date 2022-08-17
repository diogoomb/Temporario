// $('#mapDIV').css("height", "85%");
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'


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
var contornoFreg11 = L.geoJSON(dadosRelativosFreguesias,{
    style:layerContorno,
});


let space = document.getElementById("space");
let opcoesTabela = document.getElementById('opcoesTabela');
let escalasConcelho = document.getElementById('escalasConcelho');
let myDIV = document.getElementById('myDIV');
let legendaA= document.getElementById('legendaA');
var ifSlide2isActive = 21;
let slidersGeral = document.getElementById('slidersGeral');
let inputNumberMin = document.getElementById('input-number-min');
let inputNumberMax = document.getElementById('input-number-max');
var sliderAtivo = null

///// --- Botões secundários (Concelho, Freguesia) ficarem ativos sempre que se clica \\\\\
var btns = myDIV.getElementsByClassName("EscalasTerritoriais");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
  var current = document.getElementsByClassName("active2");
  current[0].className = current[0].className.replace("active2", " ");
  this.className += "active2";
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

///////////////////////////----------------------- DADOS ABSOLUTOS, CONCELHO--------------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- EDIFÍCIO ISOLADO  2011,Por Concelho ------------------------------\\\\\\\\\\\\\

var minEdIsoladoConc11 = 99999;
var maxEdIsoladoConc11 = 0;
function estiloEdIsoladoConc11(feature, latlng) {
    if(feature.properties.Ed_Isolado< minEdIsoladoConc11 || feature.properties.Ed_Isolado ===0){
        minEdIsoladoConc11 = feature.properties.Ed_Isolado
    }
    if(feature.properties.Ed_Isolado> maxEdIsoladoConc11){
        maxEdIsoladoConc11 = feature.properties.Ed_Isolado
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed_Isolado,0.2)
    });
}
function apagarEdIsoladoConc11(e){
    var layer = e.target;
    EdIsoladoConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdIsoladoConc11(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios isolados: '  + '<b>'+ feature.properties.Ed_Isolado+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdIsoladoConc11,
    })
};

var EdIsoladoConc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdIsoladoConc11,
    onEachFeature: onEachFeatureEdIsoladoConc11,
});

var slideEdIsoladoConc11 = function(){
    var sliderEdIsoladoConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdIsoladoConc11, {
        start: [minEdIsoladoConc11, maxEdIsoladoConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdIsoladoConc11,
            'max': maxEdIsoladoConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdIsoladoConc11);
    inputNumberMax.setAttribute("value",maxEdIsoladoConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdIsoladoConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdIsoladoConc11.noUiSlider.set([null, this.value]);
    });

    sliderEdIsoladoConc11.noUiSlider.on('update',function(e){
        EdIsoladoConc11.eachLayer(function(layer){
            if(layer.feature.properties.Ed_Isolado>=parseFloat(e[0])&& layer.feature.properties.Ed_Isolado <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdIsoladoConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderEdIsoladoConc11.noUiSlider;
    $(slidersGeral).append(sliderEdIsoladoConc11);
}

/////////////////////////////////// ---------Fim de EDIFICIOS ISOLADOS EM 2011 Concelho -------------- \\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- EDIFIICOS GEMINADOS EM 2011,Por Concelho ------------------------------\\\\\\\\\\\\\

var minEdiGeminadoConc11 = 99999;
var maxEdiGeminadoConc11 = 0;
function estiloEdiGeminadoConc11(feature, latlng) {
    if(feature.properties.Ed_Geminado< minEdiGeminadoConc11 || feature.properties.Ed_Geminado ===0){
        minEdiGeminadoConc11 = feature.properties.Ed_Geminado
    }
    if(feature.properties.Ed_Geminado> maxEdiGeminadoConc11){
        maxEdiGeminadoConc11 = feature.properties.Ed_Geminado
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed_Geminado,0.2)
    });
}
function apagarEdiGeminadoConc11(e){
    var layer = e.target;
    EdiGeminadoConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdiGeminadoConc11(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios geminados: '  + '<b>'+ feature.properties.Ed_Geminado+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdiGeminadoConc11,
    })
};

var EdiGeminadoConc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdiGeminadoConc11,
    onEachFeature: onEachFeatureEdiGeminadoConc11,
});

var slideEdiGeminadoConc11 = function(){
    var sliderEdiGeminadoConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdiGeminadoConc11, {
        start: [minEdiGeminadoConc11, maxEdiGeminadoConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdiGeminadoConc11,
            'max': maxEdiGeminadoConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdiGeminadoConc11);
    inputNumberMax.setAttribute("value",maxEdiGeminadoConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdiGeminadoConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdiGeminadoConc11.noUiSlider.set([null, this.value]);
    });

    sliderEdiGeminadoConc11.noUiSlider.on('update',function(e){
        EdiGeminadoConc11.eachLayer(function(layer){
            if(layer.feature.properties.Ed_Geminado>=parseFloat(e[0])&& layer.feature.properties.Ed_Geminado <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdiGeminadoConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderEdiGeminadoConc11.noUiSlider;
    $(slidersGeral).append(sliderEdiGeminadoConc11);
}


/////////////////////////////////// ---------Fim de EDIFICIOS GEMINADOS 2011 Concelho -------------- \\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- EDIFIICOS EM BANDA EM 2011,Por Concelho ------------------------------\\\\\\\\\\\\\

var minEdiBandaConc11 = 99999;
var maxEdiBandaConc11 = 0;
function estiloEdiBandaConc11(feature, latlng) {
    if(feature.properties.Ed_Banda< minEdiBandaConc11 || feature.properties.Ed_Banda ===0){
        minEdiBandaConc11 = feature.properties.Ed_Banda
    }
    if(feature.properties.Ed_Banda> maxEdiBandaConc11){
        maxEdiBandaConc11 = feature.properties.Ed_Banda
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed_Banda,0.2)
    });
}
function apagarEdiBandaConc11(e){
    var layer = e.target;
    EdiBandaConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdiBandaConc11(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios em banda: '  + '<b>'+ feature.properties.Ed_Banda + '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdiBandaConc11,
    })
};

var EdiBandaConc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdiBandaConc11,
    onEachFeature: onEachFeatureEdiBandaConc11,
});

var slideEdiBandaConc11 = function(){
    var sliderEdiBandaConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdiBandaConc11, {
        start: [minEdiBandaConc11, maxEdiBandaConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdiBandaConc11,
            'max': maxEdiBandaConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdiBandaConc11);
    inputNumberMax.setAttribute("value",maxEdiBandaConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdiBandaConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdiBandaConc11.noUiSlider.set([null, this.value]);
    });

    sliderEdiBandaConc11.noUiSlider.on('update',function(e){
        EdiBandaConc11.eachLayer(function(layer){
            if(layer.feature.properties.Ed_Banda>=parseFloat(e[0])&& layer.feature.properties.Ed_Banda <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdiBandaConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderEdiBandaConc11.noUiSlider;
    $(slidersGeral).append(sliderEdiBandaConc11);
}


/////////////////////////////////// ---------Fim de EDIFICIOS EM BANDA 2011 Concelho -------------- \\\\\\\\\\\\\\\\\\\\

//////////////////////////----------- EDIFIICOS COM 3 OU MAIS ALOJAMENTOS 2011,Por Concelho ------------------------------\\\\\\\\\\\\\

var minEdi3MaisConc11 = 99999;
var maxEdi3MaisConc11 = 0;
function estiloEdi3MaisConc11(feature, latlng) {
    if(feature.properties.Ed_3OuMais< minEdi3MaisConc11 || feature.properties.Ed_3OuMais ===0){
        minEdi3MaisConc11 = feature.properties.Ed_3OuMais
    }
    if(feature.properties.Ed_3OuMais> maxEdi3MaisConc11){
        maxEdi3MaisConc11 = feature.properties.Ed_3OuMais
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed_3OuMais,0.2)
    });
}
function apagarEdi3MaisConc11(e){
    var layer = e.target;
    Edi3MaisConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi3MaisConc11(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 3 ou mais alojamentos familiares: '  + '<b>'+ feature.properties.Ed_3OuMais + '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi3MaisConc11,
    })
};

var Edi3MaisConc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdi3MaisConc11,
    onEachFeature: onEachFeatureEdi3MaisConc11,
});

var slideEdi3MaisConc11 = function(){
    var sliderEdi3MaisConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi3MaisConc11, {
        start: [minEdi3MaisConc11, maxEdi3MaisConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi3MaisConc11,
            'max': maxEdi3MaisConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi3MaisConc11);
    inputNumberMax.setAttribute("value",maxEdi3MaisConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi3MaisConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi3MaisConc11.noUiSlider.set([null, this.value]);
    });

    sliderEdi3MaisConc11.noUiSlider.on('update',function(e){
        Edi3MaisConc11.eachLayer(function(layer){
            if(layer.feature.properties.Ed_3OuMais>=parseFloat(e[0])&& layer.feature.properties.Ed_3OuMais <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi3MaisConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderEdi3MaisConc11.noUiSlider;
    $(slidersGeral).append(sliderEdi3MaisConc11);
}


/////////////////////////////////// ---------Fim de EDIFICIOS COM 3 OU MAIS ALOJAMENTOS 2011 Concelho -------------- \\\\\\\\\\\\\\\\\\\\

//////////////////////////----------- EDIFIICOS COM 3 OU MAIS ALOJAMENTOS 2021,Por Concelho ------------------------------\\\\\\\\\\\\\

var minEdi3MaisConc21 = 99999;
var maxEdi3MaisConc21 = 0;
function estiloEdi3MaisConc21(feature, latlng) {
    if(feature.properties.Ed3ouM_21< minEdi3MaisConc21){
        minEdi3MaisConc21 = feature.properties.Ed3ouM_21
    }
    if(feature.properties.Ed3ouM_21> maxEdi3MaisConc21){
        maxEdi3MaisConc21 = feature.properties.Ed3ouM_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed3ouM_21,0.2)
    });
}
function apagarEdi3MaisConc21(e){
    var layer = e.target;
    Edi3MaisConc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi3MaisConc21(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 3 ou mais alojamentos familiares: '  + '<b>'+ feature.properties.Ed3ouM_21 + '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi3MaisConc21,
    })
};

var Edi3MaisConc21= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloEdi3MaisConc21,
    onEachFeature: onEachFeatureEdi3MaisConc21,
});

var slideEdi3MaisConc21 = function(){
    var sliderEdi3MaisConc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi3MaisConc21, {
        start: [minEdi3MaisConc21, maxEdi3MaisConc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi3MaisConc21,
            'max': maxEdi3MaisConc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi3MaisConc21);
    inputNumberMax.setAttribute("value",maxEdi3MaisConc21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi3MaisConc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi3MaisConc21.noUiSlider.set([null, this.value]);
    });

    sliderEdi3MaisConc21.noUiSlider.on('update',function(e){
        Edi3MaisConc21.eachLayer(function(layer){
            if(layer.feature.properties.Ed3ouM_21>=parseFloat(e[0])&& layer.feature.properties.Ed3ouM_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi3MaisConc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderEdi3MaisConc21.noUiSlider;
    $(slidersGeral).append(sliderEdi3MaisConc21);
}


/////////////////////////////////// ---------Fim de EDIFICIOS COM 3 OU MAIS ALOJAMENTOS 2011 Concelho -------------- \\\\\\\\\\\\\\\\\\\\


//////////////////////////----------- EDIFIICOS OUTROS TIPOS 2011,Por Concelho ------------------------------\\\\\\\\\\\\\

var minEdiOutrosConc11 = 99999;
var maxEdiOutrosConc11 = 0;
function estiloEdiOutrosConc11(feature, latlng) {
    if(feature.properties.Ed_Outros< minEdiOutrosConc11 || feature.properties.Ed_Outros ===0){
        minEdiOutrosConc11 = feature.properties.Ed_Outros
    }
    if(feature.properties.Ed_Outros> maxEdiOutrosConc11){
        maxEdiOutrosConc11 = feature.properties.Ed_Outros
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed_Outros,0.2)
    });
}
function apagarEdiOutrosConc11(e){
    var layer = e.target;
    EdiOutrosConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdiOutrosConc11(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios de outro tipo: '  + '<b>'+ feature.properties.Ed_Outros + '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdiOutrosConc11,
    })
};

var EdiOutrosConc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdiOutrosConc11,
    onEachFeature: onEachFeatureEdiOutrosConc11,
});

var slideEdiOutrosConc11 = function(){
    var sliderEdiOutrosConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdiOutrosConc11, {
        start: [minEdiOutrosConc11, maxEdiOutrosConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdiOutrosConc11,
            'max': maxEdiOutrosConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdiOutrosConc11);
    inputNumberMax.setAttribute("value",maxEdiOutrosConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdiOutrosConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdiOutrosConc11.noUiSlider.set([null, this.value]);
    });

    sliderEdiOutrosConc11.noUiSlider.on('update',function(e){
        EdiOutrosConc11.eachLayer(function(layer){
            if(layer.feature.properties.Ed_Outros>=parseFloat(e[0])&& layer.feature.properties.Ed_Outros <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdiOutrosConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderEdiOutrosConc11.noUiSlider;
    $(slidersGeral).append(sliderEdiOutrosConc11);
}


/////////////////////////////////// ---------Fim de EDIFICIOS OUTROS TIPOS 2011 Concelho -------------- \\\\\\\\\\\\\\\\\\\\


//////////////////////////----------- EDIFIICOS OUTROS TIPOS 2021,Por Concelho ------------------------------\\\\\\\\\\\\\

var minEdiOutrosConc21 = 99999;
var maxEdiOutrosConc21 = 0;
function estiloEdiOutrosConc21(feature, latlng) {
    if(feature.properties.Ed_Outros21< minEdiOutrosConc21){
        minEdiOutrosConc21 = feature.properties.Ed_Outros21
    }
    if(feature.properties.Ed_Outros21> maxEdiOutrosConc21){
        maxEdiOutrosConc21 = feature.properties.Ed_Outros21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed_Outros21,0.2)
    });
}
function apagarEdiOutrosConc21(e){
    var layer = e.target;
    EdiOutrosConc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdiOutrosConc21(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios de outro tipo: '  + '<b>'+ feature.properties.Ed_Outros21 + '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdiOutrosConc21,
    })
};

var EdiOutrosConc21= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloEdiOutrosConc21,
    onEachFeature: onEachFeatureEdiOutrosConc21,
});

var slideEdiOutrosConc21 = function(){
    var sliderEdiOutrosConc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdiOutrosConc21, {
        start: [minEdiOutrosConc21, maxEdiOutrosConc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdiOutrosConc21,
            'max': maxEdiOutrosConc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdiOutrosConc21);
    inputNumberMax.setAttribute("value",maxEdiOutrosConc21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdiOutrosConc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdiOutrosConc21.noUiSlider.set([null, this.value]);
    });

    sliderEdiOutrosConc21.noUiSlider.on('update',function(e){
        EdiOutrosConc21.eachLayer(function(layer){
            if(layer.feature.properties.Ed_Outros21>=parseFloat(e[0])&& layer.feature.properties.Ed_Outros21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdiOutrosConc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderEdiOutrosConc21.noUiSlider;
    $(slidersGeral).append(sliderEdiOutrosConc21);
}


/////////////////////////////////// ---------Fim de EDIFICIOS OUTROS TIPOS 2021 Concelho -------------- \\\\\\\\\\\\\\\\\\\\


///////////////////////----------- EDIFIICOS 1 OU 2ALOJAMENTOS  EM 2011,Por Concelho ------------------------------\\\\\\\\\\\\\

var minEdi1ou2AlojamentosConc11 = 99999;
var maxEdi1ou2AlojamentosConc11 = 0;
function estiloEdi1ou2AlojamentosConc11(feature, latlng) {
    if(feature.properties.Ed_1ou2Alo< minEdi1ou2AlojamentosConc11 || feature.properties.Ed_1ou2Alo ===0){
        minEdi1ou2AlojamentosConc11 = feature.properties.Ed_1ou2Alo
    }
    if(feature.properties.Ed_1ou2Alo> maxEdi1ou2AlojamentosConc11){
        maxEdi1ou2AlojamentosConc11 = feature.properties.Ed_1ou2Alo
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed_1ou2Alo,0.2)
    });
}
function apagarEdi1ou2AlojamentosConc11(e){
    var layer = e.target;
    Edi1ou2AlojamentosConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi1ou2AlojamentosConc11(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 1 ou 2 alojamentos familiares: '  + '<b>'+ feature.properties.Ed_1ou2Alo+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi1ou2AlojamentosConc11,
    })
};

var Edi1ou2AlojamentosConc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdi1ou2AlojamentosConc11,
    onEachFeature: onEachFeatureEdi1ou2AlojamentosConc11,
});

var slideEdi1ou2AlojamentosConc11 = function(){
    var sliderEdi1ou2AlojamentosConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi1ou2AlojamentosConc11, {
        start: [minEdi1ou2AlojamentosConc11, maxEdi1ou2AlojamentosConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi1ou2AlojamentosConc11,
            'max': maxEdi1ou2AlojamentosConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi1ou2AlojamentosConc11);
    inputNumberMax.setAttribute("value",maxEdi1ou2AlojamentosConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi1ou2AlojamentosConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi1ou2AlojamentosConc11.noUiSlider.set([null, this.value]);
    });

    sliderEdi1ou2AlojamentosConc11.noUiSlider.on('update',function(e){
        Edi1ou2AlojamentosConc11.eachLayer(function(layer){
            if(layer.feature.properties.Ed_1ou2Alo>=parseFloat(e[0])&& layer.feature.properties.Ed_1ou2Alo <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi1ou2AlojamentosConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderEdi1ou2AlojamentosConc11.noUiSlider;
    $(slidersGeral).append(sliderEdi1ou2AlojamentosConc11);
}
contorno.addTo(map);
Edi1ou2AlojamentosConc11.addTo(map);
$('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 ou 2 alojamentos familiares, em 2011, por concelho.' + '</strong>');
legenda(maxEdi1ou2AlojamentosConc11, ((maxEdi1ou2AlojamentosConc11-minEdi1ou2AlojamentosConc11)/2).toFixed(0),minEdi1ou2AlojamentosConc11,0.2);
slideEdi1ou2AlojamentosConc11();

/////////////////////////////////// ---------Fim de EDIFICIOS 1 OU 2 ALOJAMENTOS 2011 Concelho -------------- \\\\\\\\\\\\\\\\\\\\

//////////////////////////////////// EDIFICIOS 1 OU 2 ALOJAMENTOS 2021 CONCELHO //////////////////////
var minEdi1ou2AlojamentosConc21 = 99999;
var maxEdi1ou2AlojamentosConc21 = 0;
function estiloEdi1ou2AlojamentosConc21(feature, latlng) {
    if(feature.properties.Ed1ou2_21< minEdi1ou2AlojamentosConc21 || feature.properties.Ed1ou2_21 ===0){
        minEdi1ou2AlojamentosConc21 = feature.properties.Ed1ou2_21
    }
    if(feature.properties.Ed1ou2_21> maxEdi1ou2AlojamentosConc21){
        maxEdi1ou2AlojamentosConc21 = feature.properties.Ed1ou2_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed1ou2_21,0.2)
    });
}
function apagarEdi1ou2AlojamentosConc21(e){
    var layer = e.target;
    Edi1ou2AlojamentosConc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi1ou2AlojamentosConc21(feature, layer) {
    layer.bindPopup('Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 1 ou 2 alojamentos familiares: '  + '<b>'+ feature.properties.Ed1ou2_21+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi1ou2AlojamentosConc21,
    })
};

var Edi1ou2AlojamentosConc21= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloEdi1ou2AlojamentosConc21,
    onEachFeature: onEachFeatureEdi1ou2AlojamentosConc21,
});

var slideEdi1ou2AlojamentosConc21 = function(){
    var sliderEdi1ou2AlojamentosConc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi1ou2AlojamentosConc21, {
        start: [minEdi1ou2AlojamentosConc21, maxEdi1ou2AlojamentosConc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi1ou2AlojamentosConc21,
            'max': maxEdi1ou2AlojamentosConc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi1ou2AlojamentosConc21);
    inputNumberMax.setAttribute("value",maxEdi1ou2AlojamentosConc21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi1ou2AlojamentosConc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi1ou2AlojamentosConc21.noUiSlider.set([null, this.value]);
    });

    sliderEdi1ou2AlojamentosConc21.noUiSlider.on('update',function(e){
        Edi1ou2AlojamentosConc21.eachLayer(function(layer){
            if(layer.feature.properties.Ed1ou2_21>=parseFloat(e[0])&& layer.feature.properties.Ed1ou2_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi1ou2AlojamentosConc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderEdi1ou2AlojamentosConc21.noUiSlider;
    $(slidersGeral).append(sliderEdi1ou2AlojamentosConc21);
}
/////////////////////////////////////////////////////////////////// FIM EDIFICIOS 1 OU 2 ALOJAMENTOS 2021 ///////////////////////////

////////////////////////////------- Percentagem EDIFICIO COM 1 OU 2 ALOJAMENTOS CONCELHO em 2011-----////

var minPerc1ou2AlojamentosConc11 = 99999;
var maxPerc1ou2AlojamentosConc11 = 0;

function CorPer1ou2AlojamentosConc(d) {
    return d == null ? '#808080' :
        d >= 95.31 ? '#8c0303' :
        d >= 90.80  ? '#de1f35' :
        d >= 83.29  ? '#ff5e6e' :
        d >= 75.78   ? '#f5b3be' :
        d >= 68.27   ? '#F2C572' :
                ''  ;
}
var legendaPer1ou2AlojamentosConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 95.31' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 90.80 a 95.31' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 83.29 a 90.80' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 75.78 a 83.29' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 68.27 a 75.78' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerc1ou2AlojamentosConc11(feature) {
    if( feature.properties.Prop_1ou2 <= minPerc1ou2AlojamentosConc11 || minPerc1ou2AlojamentosConc11 === 0){
        minPerc1ou2AlojamentosConc11 = feature.properties.Prop_1ou2
    }
    if(feature.properties.Prop_1ou2 >= maxPerc1ou2AlojamentosConc11 ){
        maxPerc1ou2AlojamentosConc11 = feature.properties.Prop_1ou2
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer1ou2AlojamentosConc(feature.properties.Prop_1ou2)
    };
}
function apagarPerc1ou2AlojamentosConc11(e) {
    Perc1ou2AlojamentosConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerc1ou2AlojamentosConc11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios com 1 ou 2 alojamentos familiares: ' + '<b>' + feature.properties.Prop_1ou2  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerc1ou2AlojamentosConc11,
    });
}
var Perc1ou2AlojamentosConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerc1ou2AlojamentosConc11,
    onEachFeature: onEachFeaturePerc1ou2AlojamentosConc11
});
let slidePerc1ou2AlojamentosConc11 = function(){
    var sliderPerc1ou2AlojamentosConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerc1ou2AlojamentosConc11, {
        start: [minPerc1ou2AlojamentosConc11, maxPerc1ou2AlojamentosConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc1ou2AlojamentosConc11,
            'max': maxPerc1ou2AlojamentosConc11
        },
        });
    inputNumberMin.setAttribute("value",minPerc1ou2AlojamentosConc11);
    inputNumberMax.setAttribute("value",maxPerc1ou2AlojamentosConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc1ou2AlojamentosConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc1ou2AlojamentosConc11.noUiSlider.set([null, this.value]);
    });

    sliderPerc1ou2AlojamentosConc11.noUiSlider.on('update',function(e){
        Perc1ou2AlojamentosConc11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_1ou2.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_1ou2.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerc1ou2AlojamentosConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderPerc1ou2AlojamentosConc11.noUiSlider;
    $(slidersGeral).append(sliderPerc1ou2AlojamentosConc11);
} 

/////////////////////////////// Fim PERCENTAGEM EDIFICIO COM 1 OU 2 ALOJAMENTOS CONCELHO em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem EDIFICIO COM 1 OU 2 ALOJAMENTOS CONCELHO em 2011-----////

var minPerc1ou2AlojamentosConc21 = 99999;
var maxPerc1ou2AlojamentosConc21 = 0;

function EstiloPerc1ou2AlojamentosConc21(feature) {
    if( feature.properties.P1ou2_21 <= minPerc1ou2AlojamentosConc21){
        minPerc1ou2AlojamentosConc21 = feature.properties.P1ou2_21
    }
    if(feature.properties.P1ou2_21 >= maxPerc1ou2AlojamentosConc21 ){
        maxPerc1ou2AlojamentosConc21 = feature.properties.P1ou2_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer1ou2AlojamentosConc(feature.properties.P1ou2_21)
    };
}
function apagarPerc1ou2AlojamentosConc21(e) {
    Perc1ou2AlojamentosConc21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerc1ou2AlojamentosConc21(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios com 1 ou 2 alojamentos familiares: ' + '<b>' + feature.properties.P1ou2_21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerc1ou2AlojamentosConc21,
    });
}
var Perc1ou2AlojamentosConc21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerc1ou2AlojamentosConc21,
    onEachFeature: onEachFeaturePerc1ou2AlojamentosConc21
});
let slidePerc1ou2AlojamentosConc21 = function(){
    var sliderPerc1ou2AlojamentosConc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerc1ou2AlojamentosConc21, {
        start: [minPerc1ou2AlojamentosConc21, maxPerc1ou2AlojamentosConc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc1ou2AlojamentosConc21,
            'max': maxPerc1ou2AlojamentosConc21
        },
        });
    inputNumberMin.setAttribute("value",minPerc1ou2AlojamentosConc21);
    inputNumberMax.setAttribute("value",maxPerc1ou2AlojamentosConc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc1ou2AlojamentosConc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc1ou2AlojamentosConc21.noUiSlider.set([null, this.value]);
    });

    sliderPerc1ou2AlojamentosConc21.noUiSlider.on('update',function(e){
        Perc1ou2AlojamentosConc21.eachLayer(function(layer){
            if(layer.feature.properties.P1ou2_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P1ou2_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerc1ou2AlojamentosConc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderPerc1ou2AlojamentosConc21.noUiSlider;
    $(slidersGeral).append(sliderPerc1ou2AlojamentosConc21);
} 

/////////////////////////////// Fim PERCENTAGEM EDIFICIO COM 1 OU 2 ALOJAMENTOS CONCELHO em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem EDIFICIO ISOLADO CONCELHO em 2011-----////

var minPercEdIsoladoConc11 = 99999;
var maxPercEdIsoladoConc11 = 0;

function CorPerIsoladoConc(d) {
    return d == null ? '#808080' :
        d >= 84.17 ? '#8c0303' :
        d >= 72.36  ? '#de1f35' :
        d >= 52.67  ? '#ff5e6e' :
        d >= 32.98   ? '#f5b3be' :
        d >= 13.29   ? '#F2C572' :
                ''  ;
}
var legendaPerIsoladoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 84.17' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 72.36 a 84.17' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 52.67 a 72.36' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 32.98 a 52.67' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 13.29 a 32.98' + '<br>'




    $(legendaA).append(symbolsContainer); 
}

function EstiloPercEdIsoladoConc11(feature) {
    if( feature.properties.Prop_Isola <= minPercEdIsoladoConc11 || minPercEdIsoladoConc11 === 0){
        minPercEdIsoladoConc11 = feature.properties.Prop_Isola
    }
    if(feature.properties.Prop_Isola >= maxPercEdIsoladoConc11 ){
        maxPercEdIsoladoConc11 = feature.properties.Prop_Isola
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerIsoladoConc(feature.properties.Prop_Isola)
    };
}
function apagarPercEdIsoladoConc11(e) {
    PercEdIsoladoConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercEdIsoladoConc11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios isolados: ' + '<b>' + feature.properties.Prop_Isola  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercEdIsoladoConc11,
    });
}
var PercEdIsoladoConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercEdIsoladoConc11,
    onEachFeature: onEachFeaturePercEdIsoladoConc11
});
let slidePercEdIsoladoConc11 = function(){
    var sliderPercEdIsoladoConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercEdIsoladoConc11, {
        start: [minPercEdIsoladoConc11, maxPercEdIsoladoConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercEdIsoladoConc11,
            'max': maxPercEdIsoladoConc11
        },
        });
    inputNumberMin.setAttribute("value",minPercEdIsoladoConc11);
    inputNumberMax.setAttribute("value",maxPercEdIsoladoConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercEdIsoladoConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercEdIsoladoConc11.noUiSlider.set([null, this.value]);
    });

    sliderPercEdIsoladoConc11.noUiSlider.on('update',function(e){
        PercEdIsoladoConc11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_Isola.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_Isola.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercEdIsoladoConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderPercEdIsoladoConc11.noUiSlider;
    $(slidersGeral).append(sliderPercEdIsoladoConc11);
} 

/////////////////////////////// Fim PERCENTAGEM EDIFICIO ISOLADO CONCELHO em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem EDIFICIO GEMINADO CONCELHO em 2011-----////

var minPercEdiGeminadoConc11 = 99999;
var maxPercEdiGeminadoConc11 = 0;

function CorPerGeminadoConc(d) {
    return d == null ? '#808080' :
        d >= 37.95 ? '#8c0303' :
        d >= 32.5  ? '#de1f35' :
        d >= 23.4  ? '#ff5e6e' :
        d >= 14.31   ? '#f5b3be' :
        d >= 5.21   ? '#F2C572' :
                ''  ;
}
var legendaPerGeminadoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 37.95' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 32.5 a 37.95' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 23.4 a 32.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 14.31 a 23.4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 5.21 a 14.31' + '<br>'




    $(legendaA).append(symbolsContainer); 
}


function EstiloPercEdiGeminadoConc11(feature) {
    if( feature.properties.Prop_Gemin <= minPercEdiGeminadoConc11 || minPercEdiGeminadoConc11 === 0){
        minPercEdiGeminadoConc11 = feature.properties.Prop_Gemin
    }
    if(feature.properties.Prop_Gemin >= maxPercEdiGeminadoConc11 ){
        maxPercEdiGeminadoConc11 = feature.properties.Prop_Gemin
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerGeminadoConc(feature.properties.Prop_Gemin)
    };
}
function apagarPercEdiGeminadoConc11(e) {
    PercEdiGeminadoConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercEdiGeminadoConc11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios geminados: ' + '<b>' + feature.properties.Prop_Gemin  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercEdiGeminadoConc11,
    });
}
var PercEdiGeminadoConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercEdiGeminadoConc11,
    onEachFeature: onEachFeaturePercEdiGeminadoConc11
});
let slidePercEdiGeminadoConc11 = function(){
    var sliderPercEdiGeminadoConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercEdiGeminadoConc11, {
        start: [minPercEdiGeminadoConc11, maxPercEdiGeminadoConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercEdiGeminadoConc11,
            'max': maxPercEdiGeminadoConc11
        },
        });
    inputNumberMin.setAttribute("value",minPercEdiGeminadoConc11);
    inputNumberMax.setAttribute("value",maxPercEdiGeminadoConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercEdiGeminadoConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercEdiGeminadoConc11.noUiSlider.set([null, this.value]);
    });

    sliderPercEdiGeminadoConc11.noUiSlider.on('update',function(e){
        PercEdiGeminadoConc11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_Gemin.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_Gemin.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercEdiGeminadoConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderPercEdiGeminadoConc11.noUiSlider;
    $(slidersGeral).append(sliderPercEdiGeminadoConc11);
} 

/////////////////////////////// Fim PERCENTAGEM EDIFICIO GEMINADO CONCELHO em 2011 -------------- \\\\\\


////////////////////////////------- Percentagem EDIFICIO EM BANDA CONCELHO em 2011-----////

var minPercEdiBandaConc11 = 99999;
var maxPercEdiBandaConc11 = 0;

function CorPerBandaConc(d) {
    return d == null ? '#808080' :
        d >= 51.76 ? '#8c0303' :
        d >= 43.6  ? '#de1f35' :
        d >= 29.28  ? '#ff5e6e' :
        d >= 16.37   ? '#f5b3be' :
        d >= 2.75   ? '#F2C572' :
                ''  ;
}
var legendaPerBandaConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 51.76' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 43.6 a 51.76' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 29.28 a 43.6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 16.37 a 29.28' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 2.75 a 16.37' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloPercEdiBandaConc11(feature) {
    if( feature.properties.Prop_Banda <= minPercEdiBandaConc11 || minPercEdiBandaConc11 === 0){
        minPercEdiBandaConc11 = feature.properties.Prop_Banda
    }
    if(feature.properties.Prop_Banda >= maxPercEdiBandaConc11 ){
        maxPercEdiBandaConc11 = feature.properties.Prop_Banda
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerBandaConc(feature.properties.Prop_Banda)
    };
}
function apagarPercEdiBandaConc11(e) {
    PercEdiBandaConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercEdiBandaConc11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios em banda: ' + '<b>' + feature.properties.Prop_Banda  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercEdiBandaConc11,
    });
}
var PercEdiBandaConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercEdiBandaConc11,
    onEachFeature: onEachFeaturePercEdiBandaConc11
});
let slidePercEdiBandaConc11 = function(){
    var sliderPercEdiBandaConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercEdiBandaConc11, {
        start: [minPercEdiBandaConc11, maxPercEdiBandaConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercEdiBandaConc11,
            'max': maxPercEdiBandaConc11
        },
        });
    inputNumberMin.setAttribute("value",minPercEdiBandaConc11);
    inputNumberMax.setAttribute("value",maxPercEdiBandaConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercEdiBandaConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercEdiBandaConc11.noUiSlider.set([null, this.value]);
    });

    sliderPercEdiBandaConc11.noUiSlider.on('update',function(e){
        PercEdiBandaConc11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_Banda.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_Banda.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercEdiBandaConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderPercEdiBandaConc11.noUiSlider;
    $(slidersGeral).append(sliderPercEdiBandaConc11);
} 

/////////////////////////////// Fim PERCENTAGEM EDIFICIO EM BANDA CONCELHO em 2011 -------------- \\\\\\


////////////////////////////------- Percentagem EDIFICIO COM 3 OU MAIS ALOJAMENTOS CONCELHO em 2011-----////

var minPercEdi3MaisConc11 = 99999;
var maxPercEdi3MaisConc11 = 0;

function CorPer3MaisConc(d) {
    return d == null ? '#808080' :
        d >= 27.1 ? '#8c0303' :
        d >= 22.83  ? '#de1f35' :
        d >= 15.72  ? '#ff5e6e' :
        d >= 8.60   ? '#f5b3be' :
        d >= 1.48   ? '#F2C572' :
                ''  ;
}
var legendaPer3MaisConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 27.1' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 22.83 a 27.1' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 15.72 a 22.83' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 8.60 a 15.72' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 1.48 a 8.60' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPercEdi3MaisConc11(feature) {
    if( feature.properties.Prop_3Mais <= minPercEdi3MaisConc11 || minPercEdi3MaisConc11 === 0){
        minPercEdi3MaisConc11 = feature.properties.Prop_3Mais
    }
    if(feature.properties.Prop_3Mais >= maxPercEdi3MaisConc11 ){
        maxPercEdi3MaisConc11 = feature.properties.Prop_3Mais
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer3MaisConc(feature.properties.Prop_3Mais)
    };
}
function apagarPercEdi3MaisConc11(e) {
    PercEdi3MaisConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercEdi3MaisConc11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios com 3 ou mais alojamentos: ' + '<b>' + feature.properties.Prop_3Mais  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercEdi3MaisConc11,
    });
}
var PercEdi3MaisConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercEdi3MaisConc11,
    onEachFeature: onEachFeaturePercEdi3MaisConc11
});
let slidePercEdi3MaisConc11 = function(){
    var sliderPercEdi3MaisConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercEdi3MaisConc11, {
        start: [minPercEdi3MaisConc11, maxPercEdi3MaisConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercEdi3MaisConc11,
            'max': maxPercEdi3MaisConc11
        },
        });
    inputNumberMin.setAttribute("value",minPercEdi3MaisConc11);
    inputNumberMax.setAttribute("value",maxPercEdi3MaisConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercEdi3MaisConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercEdi3MaisConc11.noUiSlider.set([null, this.value]);
    });

    sliderPercEdi3MaisConc11.noUiSlider.on('update',function(e){
        PercEdi3MaisConc11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_3Mais.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_3Mais.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercEdi3MaisConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderPercEdi3MaisConc11.noUiSlider;
    $(slidersGeral).append(sliderPercEdi3MaisConc11);
} 

/////////////////////////////// Fim PERCENTAGEM EDIFICIO COM 3 OU MAIS ALOJAMENTOS CONCELHO em 2011 -------------- \\\\\\


////////////////////////////------- Percentagem EDIFICIO COM 3 OU MAIS ALOJAMENTOS CONCELHO em 2021-----////

var minPercEdi3MaisConc21 = 99999;
var maxPercEdi3MaisConc21 = 0;

function EstiloPercEdi3MaisConc21(feature) {
    if( feature.properties.P3Mais_21 <= minPercEdi3MaisConc21){
        minPercEdi3MaisConc21 = feature.properties.P3Mais_21
    }
    if(feature.properties.P3Mais_21 >= maxPercEdi3MaisConc21 ){
        maxPercEdi3MaisConc21 = feature.properties.P3Mais_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer3MaisConc(feature.properties.P3Mais_21)
    };
}
function apagarPercEdi3MaisConc21(e) {
    PercEdi3MaisConc21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercEdi3MaisConc21(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios com 3 ou mais alojamentos: ' + '<b>' + feature.properties.P3Mais_21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercEdi3MaisConc21,
    });
}
var PercEdi3MaisConc21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPercEdi3MaisConc21,
    onEachFeature: onEachFeaturePercEdi3MaisConc21
});
let slidePercEdi3MaisConc21 = function(){
    var sliderPercEdi3MaisConc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercEdi3MaisConc21, {
        start: [minPercEdi3MaisConc21, maxPercEdi3MaisConc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercEdi3MaisConc21,
            'max': maxPercEdi3MaisConc21
        },
        });
    inputNumberMin.setAttribute("value",minPercEdi3MaisConc21);
    inputNumberMax.setAttribute("value",maxPercEdi3MaisConc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPercEdi3MaisConc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercEdi3MaisConc21.noUiSlider.set([null, this.value]);
    });

    sliderPercEdi3MaisConc21.noUiSlider.on('update',function(e){
        PercEdi3MaisConc21.eachLayer(function(layer){
            if(layer.feature.properties.P3Mais_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P3Mais_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercEdi3MaisConc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderPercEdi3MaisConc21.noUiSlider;
    $(slidersGeral).append(sliderPercEdi3MaisConc21);
} 

/////////////////////////////// Fim PERCENTAGEM EDIFICIO COM 3 OU MAIS ALOJAMENTOS CONCELHO em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem EDIFICIO OUTRO TIPO CONCELHO em 2011-----////

var minPercOutroTipoConc11 = 99999;
var maxPercOutroTipoConc11 = 0;

function CorPerOutroTipoConc(d) {
    return d == null ? '#808080' :
        d >= 2.18 ? '#8c0303' :
        d >= 1.85  ? '#de1f35' :
        d >= 1.31  ? '#ff5e6e' :
        d >= 0.76   ? '#f5b3be' :
        d >= 0.20   ? '#F2C572' :
                ''  ;
}
var legendaPerOutroTipoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 2.18' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 1.85 a 2.18' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 1.31 a 1.85' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0.76 a 1.31' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.20 a 0.76' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloPercOutroTipoConc11(feature) {
    if( feature.properties.Prop_Outros <= minPercOutroTipoConc11 || minPercOutroTipoConc11 === 0){
        minPercOutroTipoConc11 = feature.properties.Prop_Outros
    }
    if(feature.properties.Prop_Outros >= maxPercOutroTipoConc11 ){
        maxPercOutroTipoConc11 = feature.properties.Prop_Outros
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerOutroTipoConc(feature.properties.Prop_Outros)
    };
}
function apagarPercOutroTipoConc11(e) {
    PercOutroTipoConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercOutroTipoConc11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios de outro tipo: ' + '<b>' + feature.properties.Prop_Outros  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercOutroTipoConc11,
    });
}
var PercOutroTipoConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercOutroTipoConc11,
    onEachFeature: onEachFeaturePercOutroTipoConc11
});
let slidePercOutroTipoConc11 = function(){
    var sliderPercOutroTipoConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercOutroTipoConc11, {
        start: [minPercOutroTipoConc11, maxPercOutroTipoConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercOutroTipoConc11,
            'max': maxPercOutroTipoConc11
        },
        });
    inputNumberMin.setAttribute("value",minPercOutroTipoConc11);
    inputNumberMax.setAttribute("value",maxPercOutroTipoConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercOutroTipoConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercOutroTipoConc11.noUiSlider.set([null, this.value]);
    });

    sliderPercOutroTipoConc11.noUiSlider.on('update',function(e){
        PercOutroTipoConc11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_Outros.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_Outros.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercOutroTipoConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderPercOutroTipoConc11.noUiSlider;
    $(slidersGeral).append(sliderPercOutroTipoConc11);
} 

/////////////////////////////// Fim PERCENTAGEM EDIFICIO OUTRO TIPO CONCELHO em 2011 -------------- \\\\\\


////////////////////////////------- Percentagem EDIFICIO OUTRO TIPO CONCELHO em 2021-----////

var minPercOutroTipoConc21 = 99999;
var maxPercOutroTipoConc21 = 0;

function EstiloPercOutroTipoConc21(feature) {
    if( feature.properties.POutro21 <= minPercOutroTipoConc21 || minPercOutroTipoConc21 === 0){
        minPercOutroTipoConc21 = feature.properties.POutro21
    }
    if(feature.properties.POutro21 >= maxPercOutroTipoConc21 ){
        maxPercOutroTipoConc21 = feature.properties.POutro21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerOutroTipoConc(feature.properties.POutro21)
    };
}
function apagarPercOutroTipoConc21(e) {
    PercOutroTipoConc21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercOutroTipoConc21(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios de outro tipo: ' + '<b>' + feature.properties.POutro21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercOutroTipoConc21,
    });
}
var PercOutroTipoConc21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPercOutroTipoConc21,
    onEachFeature: onEachFeaturePercOutroTipoConc21
});
let slidePercOutroTipoConc21 = function(){
    var sliderPercOutroTipoConc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercOutroTipoConc21, {
        start: [minPercOutroTipoConc21, maxPercOutroTipoConc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercOutroTipoConc21,
            'max': maxPercOutroTipoConc21
        },
        });
    inputNumberMin.setAttribute("value",minPercOutroTipoConc21);
    inputNumberMax.setAttribute("value",maxPercOutroTipoConc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPercOutroTipoConc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercOutroTipoConc21.noUiSlider.set([null, this.value]);
    });

    sliderPercOutroTipoConc21.noUiSlider.on('update',function(e){
        PercOutroTipoConc21.eachLayer(function(layer){
            if(layer.feature.properties.POutro21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.POutro21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercOutroTipoConc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderPercOutroTipoConc21.noUiSlider;
    $(slidersGeral).append(sliderPercOutroTipoConc21);
} 

/////////////////////////////// Fim PERCENTAGEM EDIFICIO OUTRO TIPO CONCELHO em 2021 -------------- \\\\\\

///////////////////////////////////////----------------------- FIM CONCELHOS------------\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

///////////////////////////----------------------- FREGUESIAS 

////////////////////////////////////----------- EDIFICIOS ISOLADOS 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdIsoladoFreg11 = 99999;
var maxEdIsoladoFreg11 = 0;
function estiloEdIsoladoFreg11(feature, latlng) {
    if(feature.properties.Ed_Isolado< minEdIsoladoFreg11 || feature.properties.Ed_Isolado ===0){
        minEdIsoladoFreg11 = feature.properties.Ed_Isolado
    }
    if(feature.properties.Ed_Isolado> maxEdIsoladoFreg11){
        maxEdIsoladoFreg11 = feature.properties.Ed_Isolado
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed_Isolado,0.3)
    });
}
function apagarEdIsoladoFreg11(e){
    var layer = e.target;
    EdIsoladoFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdIsoladoFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios isolados: '  + '<b>'+ feature.properties.Ed_Isolado+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdIsoladoFreg11,
    })
};

var EdIsoladoFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdIsoladoFreg11,
    onEachFeature: onEachFeatureEdIsoladoFreg11,
});

var slideEdIsoladoFreg11 = function(){
    var sliderEdIsoladoFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdIsoladoFreg11, {
        start: [minEdIsoladoFreg11, maxEdIsoladoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdIsoladoFreg11,
            'max': maxEdIsoladoFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdIsoladoFreg11);
    inputNumberMax.setAttribute("value",maxEdIsoladoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdIsoladoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdIsoladoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdIsoladoFreg11.noUiSlider.on('update',function(e){
        EdIsoladoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Ed_Isolado>=parseFloat(e[0])&& layer.feature.properties.Ed_Isolado <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdIsoladoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderEdIsoladoFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdIsoladoFreg11);
}


///////////////////////////---------- FIM EDIFICIOS ISOLADOS EM 2011,Por Freguesia -----------\\\\\\\\\

////////////////////////////////////----------- EDIFICIOS GEMINADOS 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdiGeminadoFreg11 = 99999;
var maxEdiGeminadoFreg11 = 0;
function estiloEdiGeminadoFreg11(feature, latlng) {
    if(feature.properties.Ed_Geminado< minEdiGeminadoFreg11 || feature.properties.Ed_Geminado ===0){
        minEdiGeminadoFreg11 = feature.properties.Ed_Geminado
    }
    if(feature.properties.Ed_Geminado> maxEdiGeminadoFreg11){
        maxEdiGeminadoFreg11 = feature.properties.Ed_Geminado
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed_Geminado,0.3)
    });
}
function apagarEdiGeminadoFreg11(e){
    var layer = e.target;
    EdiGeminadoFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdiGeminadoFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios geminados: '  + '<b>'+ feature.properties.Ed_Geminado+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdiGeminadoFreg11,
    })
};

var EdiGeminadoFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdiGeminadoFreg11,
    onEachFeature: onEachFeatureEdiGeminadoFreg11,
});

var slideEdiGeminadoFreg11 = function(){
    var sliderEdiGeminadoFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdiGeminadoFreg11, {
        start: [minEdiGeminadoFreg11, maxEdiGeminadoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdiGeminadoFreg11,
            'max': maxEdiGeminadoFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdiGeminadoFreg11);
    inputNumberMax.setAttribute("value",maxEdiGeminadoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdiGeminadoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdiGeminadoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdiGeminadoFreg11.noUiSlider.on('update',function(e){
        EdiGeminadoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Ed_Geminado>=parseFloat(e[0])&& layer.feature.properties.Ed_Geminado <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdiGeminadoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderEdiGeminadoFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdiGeminadoFreg11);
}


///////////////////////////---------- FIM EDIFICIOS GEMINADOS EM 2011,Por Freguesia -----------\\\\\\\\\

////////////////////////////////////----------- EDIFICIOS 1 OU 2 ALOJAMENTOS 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi1ou2AlojamentosFreg11 = 99999;
var maxEdi1ou2AlojamentosFreg11 = 0;
function estiloEdi1ou2AlojamentosFreg11(feature, latlng) {
    if(feature.properties.Ed_1ou2Alo< minEdi1ou2AlojamentosFreg11 || feature.properties.Ed_1ou2Alo ===0){
        minEdi1ou2AlojamentosFreg11 = feature.properties.Ed_1ou2Alo
    }
    if(feature.properties.Ed_1ou2Alo> maxEdi1ou2AlojamentosFreg11){
        maxEdi1ou2AlojamentosFreg11 = feature.properties.Ed_1ou2Alo
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed_1ou2Alo,0.25)
    });
}
function apagarEdi1ou2AlojamentosFreg11(e){
    var layer = e.target;
    Edi1ou2AlojamentosFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi1ou2AlojamentosFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 1 ou 2 alojamentos familiares: '  + '<b>'+ feature.properties.Ed_1ou2Alo+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi1ou2AlojamentosFreg11,
    })
};

var Edi1ou2AlojamentosFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi1ou2AlojamentosFreg11,
    onEachFeature: onEachFeatureEdi1ou2AlojamentosFreg11,
});

var slideEdi1ou2AlojamentosFreg11 = function(){
    var sliderEdi1ou2AlojamentosFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi1ou2AlojamentosFreg11, {
        start: [minEdi1ou2AlojamentosFreg11, maxEdi1ou2AlojamentosFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi1ou2AlojamentosFreg11,
            'max': maxEdi1ou2AlojamentosFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi1ou2AlojamentosFreg11);
    inputNumberMax.setAttribute("value",maxEdi1ou2AlojamentosFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi1ou2AlojamentosFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi1ou2AlojamentosFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdi1ou2AlojamentosFreg11.noUiSlider.on('update',function(e){
        Edi1ou2AlojamentosFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Ed_1ou2Alo>=parseFloat(e[0])&& layer.feature.properties.Ed_1ou2Alo <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi1ou2AlojamentosFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderEdi1ou2AlojamentosFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdi1ou2AlojamentosFreg11);
}


///////////////////////////---------- FIM EDIFICIOS 1 OU 2 ALOJAMENTOS EM 2011,Por Freguesia -----------\\\\\\\\\

////////////////////////////////////----------- EDIFICIOS 1 OU 2 ALOJAMENTOS 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi1ou2AlojamentosFreg21 = 99999;
var maxEdi1ou2AlojamentosFreg21 = 0;
function estiloEdi1ou2AlojamentosFreg21(feature, latlng) {
    if(feature.properties.Ed1ou2_21< minEdi1ou2AlojamentosFreg21){
        minEdi1ou2AlojamentosFreg21 = feature.properties.Ed1ou2_21
    }
    if(feature.properties.Ed1ou2_21> maxEdi1ou2AlojamentosFreg21){
        maxEdi1ou2AlojamentosFreg21 = feature.properties.Ed1ou2_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed1ou2_21,0.25)
    });
}
function apagarEdi1ou2AlojamentosFreg21(e){
    var layer = e.target;
    Edi1ou2AlojamentosFreg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi1ou2AlojamentosFreg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 1 ou 2 alojamentos familiares: '  + '<b>'+ feature.properties.Ed1ou2_21+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi1ou2AlojamentosFreg21,
    })
};

var Edi1ou2AlojamentosFreg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdi1ou2AlojamentosFreg21,
    onEachFeature: onEachFeatureEdi1ou2AlojamentosFreg21,
});

var slideEdi1ou2AlojamentosFreg21 = function(){
    var sliderEdi1ou2AlojamentosFreg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi1ou2AlojamentosFreg21, {
        start: [minEdi1ou2AlojamentosFreg21, maxEdi1ou2AlojamentosFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi1ou2AlojamentosFreg21,
            'max': maxEdi1ou2AlojamentosFreg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi1ou2AlojamentosFreg21);
    inputNumberMax.setAttribute("value",maxEdi1ou2AlojamentosFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi1ou2AlojamentosFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi1ou2AlojamentosFreg21.noUiSlider.set([null, this.value]);
    });

    sliderEdi1ou2AlojamentosFreg21.noUiSlider.on('update',function(e){
        Edi1ou2AlojamentosFreg21.eachLayer(function(layer){
            if(layer.feature.properties.Ed1ou2_21>=parseFloat(e[0])&& layer.feature.properties.Ed1ou2_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi1ou2AlojamentosFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderEdi1ou2AlojamentosFreg21.noUiSlider;
    $(slidersGeral).append(sliderEdi1ou2AlojamentosFreg21);
}


///////////////////////////---------- FIM EDIFICIOS 1 OU 2 ALOJAMENTOS EM 2021,Por Freguesia -----------\\\\\\\\\



////////////////////////////////////----------- EDIFICIOS EM BANDA 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdiBandaFreg11 = 99999;
var maxEdiBandaFreg11 = 0;
function estiloEdiBandaFreg11(feature, latlng) {
    if(feature.properties.Ed_Banda< minEdiBandaFreg11 || feature.properties.Ed_Banda ===0){
        minEdiBandaFreg11 = feature.properties.Ed_Banda
    }
    if(feature.properties.Ed_Banda> maxEdiBandaFreg11){
        maxEdiBandaFreg11 = feature.properties.Ed_Banda
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed_Banda,0.3)
    });
}
function apagarEdiBandaFreg11(e){
    var layer = e.target;
    EdiBandaFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdiBandaFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios em banda: '  + '<b>'+ feature.properties.Ed_Banda+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdiBandaFreg11,
    })
};

var EdiBandaFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdiBandaFreg11,
    onEachFeature: onEachFeatureEdiBandaFreg11,
});

var slideEdiBandaFreg11 = function(){
    var sliderEdiBandaFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdiBandaFreg11, {
        start: [minEdiBandaFreg11, maxEdiBandaFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdiBandaFreg11,
            'max': maxEdiBandaFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdiBandaFreg11);
    inputNumberMax.setAttribute("value",maxEdiBandaFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdiBandaFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdiBandaFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdiBandaFreg11.noUiSlider.on('update',function(e){
        EdiBandaFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Ed_Banda>=parseFloat(e[0])&& layer.feature.properties.Ed_Banda <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdiBandaFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderEdiBandaFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdiBandaFreg11);
}


///////////////////////////---------- FIM EDIFICIOS EM BANDA EM 2011,Por Freguesia -----------\\\\\\\\\

/////////////////////----------- EDIFICIOS COM 3 OU MAIS ALOJAMENTOS 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi3MaisFreg11 = 99999;
var maxEdi3MaisFreg11 = 0;
function estiloEdi3MaisFreg11(feature, latlng) {
    if(feature.properties.Ed_3OuMais< minEdi3MaisFreg11 || feature.properties.Ed_3OuMais ===0){
        minEdi3MaisFreg11 = feature.properties.Ed_3OuMais
    }
    if(feature.properties.Ed_3OuMais> maxEdi3MaisFreg11){
        maxEdi3MaisFreg11 = feature.properties.Ed_3OuMais
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed_3OuMais,0.25)
    });
}
function apagarEdi3MaisFreg11(e){
    var layer = e.target;
    Edi3MaisFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi3MaisFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 3 ou mais alojamentos: '  + '<b>'+ feature.properties.Ed_3OuMais+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi3MaisFreg11,
    })
};

var Edi3MaisFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdi3MaisFreg11,
    onEachFeature: onEachFeatureEdi3MaisFreg11,
});

var slideEdi3MaisFreg11 = function(){
    var sliderEdi3MaisFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi3MaisFreg11, {
        start: [minEdi3MaisFreg11, maxEdi3MaisFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi3MaisFreg11,
            'max': maxEdi3MaisFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi3MaisFreg11);
    inputNumberMax.setAttribute("value",maxEdi3MaisFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi3MaisFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi3MaisFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdi3MaisFreg11.noUiSlider.on('update',function(e){
        Edi3MaisFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Ed_3OuMais>=parseFloat(e[0])&& layer.feature.properties.Ed_3OuMais <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi3MaisFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderEdi3MaisFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdi3MaisFreg11);
}


///////////////////////////---------- FIM EDIFICIOS COM 3 OU MAIS ALOJAMENTOS EM 2011,Por Freguesia -----------\\\\\\\\\


/////////////////////----------- EDIFICIOS COM 3 OU MAIS ALOJAMENTOS 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdi3MaisFreg21 = 99999;
var maxEdi3MaisFreg21 = 0;
function estiloEdi3MaisFreg21(feature, latlng) {
    if(feature.properties.Ed3ouM_21< minEdi3MaisFreg21){
        minEdi3MaisFreg21 = feature.properties.Ed3ouM_21
    }
    if(feature.properties.Ed3ouM_21> maxEdi3MaisFreg21){
        maxEdi3MaisFreg21 = feature.properties.Ed3ouM_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed3ouM_21,0.25)
    });
}
function apagarEdi3MaisFreg21(e){
    var layer = e.target;
    Edi3MaisFreg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi3MaisFreg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios com 3 ou mais alojamentos: '  + '<b>'+ feature.properties.Ed3ouM_21+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi3MaisFreg21,
    })
};

var Edi3MaisFreg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdi3MaisFreg21,
    onEachFeature: onEachFeatureEdi3MaisFreg21,
});

var slideEdi3MaisFreg21 = function(){
    var sliderEdi3MaisFreg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi3MaisFreg21, {
        start: [minEdi3MaisFreg21, maxEdi3MaisFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi3MaisFreg21,
            'max': maxEdi3MaisFreg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi3MaisFreg21);
    inputNumberMax.setAttribute("value",maxEdi3MaisFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi3MaisFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi3MaisFreg21.noUiSlider.set([null, this.value]);
    });

    sliderEdi3MaisFreg21.noUiSlider.on('update',function(e){
        Edi3MaisFreg21.eachLayer(function(layer){
            if(layer.feature.properties.Ed3ouM_21>=parseFloat(e[0])&& layer.feature.properties.Ed3ouM_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi3MaisFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderEdi3MaisFreg21.noUiSlider;
    $(slidersGeral).append(sliderEdi3MaisFreg21);
}


///////////////////////////---------- FIM EDIFICIOS COM 3 OU MAIS ALOJAMENTOS EM 2021,Por Freguesia -----------\\\\\\\\\

/////////////////////----------- EDIFICIOS DE OUTRO TIPO 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdiOutrosFreg11 = 99999;
var maxEdiOutrosFreg11 = 0;
function estiloEdiOutrosFreg11(feature, latlng) {
    if(feature.properties.Ed_Outros< minEdiOutrosFreg11 || feature.properties.Ed_Outros ===0){
        minEdiOutrosFreg11 = feature.properties.Ed_Outros
    }
    if(feature.properties.Ed_Outros> maxEdiOutrosFreg11){
        maxEdiOutrosFreg11 = feature.properties.Ed_Outros
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed_Outros,1)
    });
}
function apagarEdiOutrosFreg11(e){
    var layer = e.target;
    EdiOutrosFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdiOutrosFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios de outro tipo: '  + '<b>'+ feature.properties.Ed_Outros+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdiOutrosFreg11,
    })
};

var EdiOutrosFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdiOutrosFreg11,
    onEachFeature: onEachFeatureEdiOutrosFreg11,
});

var slideEdiOutrosFreg11 = function(){
    var sliderEdiOutrosFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdiOutrosFreg11, {
        start: [minEdiOutrosFreg11, maxEdiOutrosFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdiOutrosFreg11,
            'max': maxEdiOutrosFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdiOutrosFreg11);
    inputNumberMax.setAttribute("value",maxEdiOutrosFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdiOutrosFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdiOutrosFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdiOutrosFreg11.noUiSlider.on('update',function(e){
        EdiOutrosFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Ed_Outros>=parseFloat(e[0])&& layer.feature.properties.Ed_Outros <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdiOutrosFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderEdiOutrosFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdiOutrosFreg11);
}


///////////////////////////---------- FIM EDIFICIOS DE OUTRO TIPO EM 2011,Por Freguesia -----------\\\\\\\\\

/////////////////////----------- EDIFICIOS DE OUTRO TIPO 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdiOutrosFreg21 = 99999;
var maxEdiOutrosFreg21 = 0;
function estiloEdiOutrosFreg21(feature, latlng) {
    if(feature.properties.Ed_Outros21< minEdiOutrosFreg21 || feature.properties.Ed_Outros21 ===0){
        minEdiOutrosFreg21 = feature.properties.Ed_Outros21
    }
    if(feature.properties.Ed_Outros21> maxEdiOutrosFreg21){
        maxEdiOutrosFreg21 = feature.properties.Ed_Outros21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Ed_Outros21,1)
    });
}
function apagarEdiOutrosFreg21(e){
    var layer = e.target;
    EdiOutrosFreg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdiOutrosFreg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Edifícios de outro tipo: '  + '<b>'+ feature.properties.Ed_Outros21+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdiOutrosFreg21,
    })
};

var EdiOutrosFreg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdiOutrosFreg21,
    onEachFeature: onEachFeatureEdiOutrosFreg21,
});

var slideEdiOutrosFreg21 = function(){
    var sliderEdiOutrosFreg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdiOutrosFreg21, {
        start: [minEdiOutrosFreg21, maxEdiOutrosFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdiOutrosFreg21,
            'max': maxEdiOutrosFreg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdiOutrosFreg21);
    inputNumberMax.setAttribute("value",maxEdiOutrosFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdiOutrosFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdiOutrosFreg21.noUiSlider.set([null, this.value]);
    });

    sliderEdiOutrosFreg21.noUiSlider.on('update',function(e){
        EdiOutrosFreg21.eachLayer(function(layer){
            if(layer.feature.properties.Ed_Outros21>=parseFloat(e[0])&& layer.feature.properties.Ed_Outros21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdiOutrosFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderEdiOutrosFreg21.noUiSlider;
    $(slidersGeral).append(sliderEdiOutrosFreg21);
}
/////////// 

///////////////////////////---------- FIM EDIFICIOS DE OUTRO TIPO EM 2011,Por Freguesia -----------\\\\\\\\\

/////////////////////////////----------------------- FIM DADOS ABSOLUTOS
/////////////////////////////--------------------- DADOS RELATIVOS

////////////////////////////////////----------- PERCENTAGEM ISOLADO, EM 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPercEdIsoladoFreg11 = 99999;
var maxPercEdIsoladoFreg11 = 0;


function CorPerIsoladoFreg(d) {
    return d == 0.00 ? '#808080' :
        d >= 90.3 ? '#8c0303' :
        d >= 75.75   ? '#de1f35' :
        d >= 51.5  ? '#ff5e6e' :
        d >= 27.25   ? '#f5b3be' :
        d >= 3   ? '#F2C572' :
                ''  ;
}
var legendaPerIsoladoFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 90.3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 75.75 a 90.3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 51.5 a 75.75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 27.25 a 51.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 3 a 27.25' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function estiloPercEdIsoladoFreg11(feature) {
    if(feature.properties.Prop_Isola< minPercEdIsoladoFreg11){
        minPercEdIsoladoFreg11 = feature.properties.Prop_Isola
    }
    if(feature.properties.Prop_Isola> maxPercEdIsoladoFreg11){
        maxPercEdIsoladoFreg11 = feature.properties.Prop_Isola
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerIsoladoFreg(feature.properties.Prop_Isola)
    };
}
function apagarPercEdIsoladoFreg11(e){
    var layer = e.target;
    PercEdIsoladoFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePercEdIsoladoFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' +'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios isolados: ' + '<b>' +feature.properties.Prop_Isola + '</b>' + '%' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPercEdIsoladoFreg11,
    })
};

var PercEdIsoladoFreg11= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPercEdIsoladoFreg11,
    onEachFeature: onEachFeaturePercEdIsoladoFreg11,
});

var slidePercEdIsoladoFreg11 = function(){
    var sliderPercEdIsoladoFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPercEdIsoladoFreg11, {
        start: [minPercEdIsoladoFreg11, maxPercEdIsoladoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercEdIsoladoFreg11,
            'max': maxPercEdIsoladoFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPercEdIsoladoFreg11);
    inputNumberMax.setAttribute("value",maxPercEdIsoladoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercEdIsoladoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercEdIsoladoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPercEdIsoladoFreg11.noUiSlider.on('update',function(e){
        PercEdIsoladoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_Isola>=parseFloat(e[0])&& layer.feature.properties.Prop_Isola <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPercEdIsoladoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderPercEdIsoladoFreg11.noUiSlider;
    $(slidersGeral).append(sliderPercEdIsoladoFreg11);
}
///////////////////////////-------------------- FIM PERCENTAGEM ISOLADO, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM GEMINADO, EM 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPercEdiGeminadoFreg11 = 99999;
var maxPercEdiGeminadoFreg11 = 0;

function CorPerGeminadoFreg(d) {
    return d == 0.00 ? '#808080' :
        d >= 60.3 ? '#8c0303' :
        d >= 50.25   ? '#de1f35' :
        d >= 33.5  ? '#ff5e6e' :
        d >= 16.75   ? '#f5b3be' :
        d >= 0.01   ? '#F2C572' :
                ''  ;
}
var legendaPerGeminadoFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 60.3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 50.25 a 60.3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 33.5 a 50.25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 16.75 a 33.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.01 a 16.75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' 0' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function estiloPercEdiGeminadoFreg11(feature) {
    if(feature.properties.Prop_Gemin< minPercEdiGeminadoFreg11 || minPercEdiGeminadoFreg11 ===0){
        minPercEdiGeminadoFreg11 = feature.properties.Prop_Gemin
    }
    if(feature.properties.Prop_Gemin> maxPercEdiGeminadoFreg11){
        maxPercEdiGeminadoFreg11 = feature.properties.Prop_Gemin
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerGeminadoFreg(feature.properties.Prop_Gemin)
    };
}
function apagarPercEdiGeminadoFreg11(e){
    var layer = e.target;
    PercEdiGeminadoFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePercEdiGeminadoFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' +  'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios geminados: ' + '<b>' +feature.properties.Prop_Gemin  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPercEdiGeminadoFreg11,
    })
};

var PercEdiGeminadoFreg11= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPercEdiGeminadoFreg11,
    onEachFeature: onEachFeaturePercEdiGeminadoFreg11,
});

var slidePercEdiGeminadoFreg11 = function(){
    var sliderPercEdiGeminadoFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPercEdiGeminadoFreg11, {
        start: [minPercEdiGeminadoFreg11, maxPercEdiGeminadoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercEdiGeminadoFreg11,
            'max': maxPercEdiGeminadoFreg11
        },
    });
    
    inputNumberMin.setAttribute("value",minPercEdiGeminadoFreg11);
    inputNumberMax.setAttribute("value",maxPercEdiGeminadoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercEdiGeminadoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercEdiGeminadoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPercEdiGeminadoFreg11.noUiSlider.on('update',function(e){
        PercEdiGeminadoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_Gemin>=parseFloat(e[0])&& layer.feature.properties.Prop_Gemin <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPercEdiGeminadoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderPercEdiGeminadoFreg11.noUiSlider;
    $(slidersGeral).append(sliderPercEdiGeminadoFreg11);
}
///////////////////////////-------------------- FIM PERCENTAGEM GEMINADO, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM BANDA, EM 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPercEdiBandaFreg11 = 99999;
var maxPercEdiBandaFreg11 = 0;

function CorPerBandaFreg(d) {
    return d == 0.00 ? '#808080' :
        d >= 78.3 ? '#8c0303' :
        d >= 65.25   ? '#de1f35' :
        d >= 43.5  ? '#ff5e6e' :
        d >= 21.75   ? '#f5b3be' :
        d >= 0.01   ? '#F2C572' :
                ''  ;
}
var legendaPerBandaFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 78.3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 65.25 a 78.3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 43.5 a 65.25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 21.75 a 43.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.01 a 21.75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' 0' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function estiloPercEdiBandaFreg11(feature) {
    if(feature.properties.Prop_Banda< minPercEdiBandaFreg11){
        minPercEdiBandaFreg11 = feature.properties.Prop_Banda
    }
    if(feature.properties.Prop_Banda> maxPercEdiBandaFreg11){
        maxPercEdiBandaFreg11 = feature.properties.Prop_Banda
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerBandaFreg(feature.properties.Prop_Banda)
    };
}
function apagarPercEdiBandaFreg11(e){
    var layer = e.target;
    PercEdiBandaFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePercEdiBandaFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios em banda: ' + '<b>' +feature.properties.Prop_Banda  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPercEdiBandaFreg11,
    })
};

var PercEdiBandaFreg11= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPercEdiBandaFreg11,
    onEachFeature: onEachFeaturePercEdiBandaFreg11,
});

var slidePercEdiBandaFreg11 = function(){
    var sliderPercEdiBandaFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPercEdiBandaFreg11, {
        start: [minPercEdiBandaFreg11, maxPercEdiBandaFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercEdiBandaFreg11,
            'max': maxPercEdiBandaFreg11
        },
    });
    
    inputNumberMin.setAttribute("value",minPercEdiBandaFreg11);
    inputNumberMax.setAttribute("value",maxPercEdiBandaFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercEdiBandaFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercEdiBandaFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPercEdiBandaFreg11.noUiSlider.on('update',function(e){
        PercEdiBandaFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_Banda>=parseFloat(e[0])&& layer.feature.properties.Prop_Banda <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPercEdiBandaFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderPercEdiBandaFreg11.noUiSlider;
    $(slidersGeral).append(sliderPercEdiBandaFreg11);
}
///////////////////////////-------------------- FIM PERCENTAGEM BANDA, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 3 OU MAIS, EM 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPercEdi3MaisFreg11 = 99999;
var maxPercEdi3MaisFreg11 = 0;

function CorPer3MaisFreg(d) {
    return d == 0.00 ? '#808080' :
        d >= 35.94 ? '#8c0303' :
        d >= 29.95   ? '#de1f35' :
        d >= 19.97  ? '#ff5e6e' :
        d >= 9.98   ? '#f5b3be' :
        d >= 0.01   ? '#F2C572' :
                ''  ;
}
var legendaPer3MaisFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 35.94' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 29.95 a 35.94' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 19.97 a 29.95' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 9.98 a 19.97' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.01 a 9.98' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' 0' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function estiloPercEdi3MaisFreg11(feature) {
    if(feature.properties.P3Mais_11< minPercEdi3MaisFreg11){
        minPercEdi3MaisFreg11 = feature.properties.P3Mais_11
    }
    if(feature.properties.P3Mais_11> maxPercEdi3MaisFreg11){
        maxPercEdi3MaisFreg11 = feature.properties.P3Mais_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer3MaisFreg(feature.properties.P3Mais_11)
    };
}
function apagarPercEdi3MaisFreg11(e){
    var layer = e.target;
    PercEdi3MaisFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePercEdi3MaisFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios com 3 ou mais alojamentos: ' + '<b>' +feature.properties.P3Mais_11  + '</b>'+ '%' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPercEdi3MaisFreg11,
    })
};

var PercEdi3MaisFreg11= L.geoJSON(dadosRelativosFreguesias21,{
    style:estiloPercEdi3MaisFreg11,
    onEachFeature: onEachFeaturePercEdi3MaisFreg11,
});

var slidePercEdi3MaisFreg11 = function(){
    var sliderPercEdi3MaisFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPercEdi3MaisFreg11, {
        start: [minPercEdi3MaisFreg11, maxPercEdi3MaisFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercEdi3MaisFreg11,
            'max': maxPercEdi3MaisFreg11
        },
    });
    
    inputNumberMin.setAttribute("value",minPercEdi3MaisFreg11);
    inputNumberMax.setAttribute("value",maxPercEdi3MaisFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercEdi3MaisFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercEdi3MaisFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPercEdi3MaisFreg11.noUiSlider.on('update',function(e){
        PercEdi3MaisFreg11.eachLayer(function(layer){
            if(layer.feature.properties.P3Mais_11>=parseFloat(e[0])&& layer.feature.properties.P3Mais_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPercEdi3MaisFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderPercEdi3MaisFreg11.noUiSlider;
    $(slidersGeral).append(sliderPercEdi3MaisFreg11);
}
///////////////////////////-------------------- FIM PERCENTAGEM 3 OU MAIS, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 3 OU MAIS, EM 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPercEdi3MaisFreg21 = 99999;
var maxPercEdi3MaisFreg21 = 0;

function estiloPercEdi3MaisFreg21(feature) {
    if(feature.properties.P3Mais_21< minPercEdi3MaisFreg21){
        minPercEdi3MaisFreg21 = feature.properties.P3Mais_21
    }
    if(feature.properties.P3Mais_21> maxPercEdi3MaisFreg21){
        maxPercEdi3MaisFreg21 = feature.properties.P3Mais_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer3MaisFreg(feature.properties.P3Mais_21)
    };
}
function apagarPercEdi3MaisFreg21(e){
    var layer = e.target;
    PercEdi3MaisFreg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePercEdi3MaisFreg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios com 3 ou mais alojamentos: ' + '<b>' +feature.properties.P3Mais_21  + '</b>'+ '%' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPercEdi3MaisFreg21,
    })
};

var PercEdi3MaisFreg21= L.geoJSON(dadosRelativosFreguesias21,{
    style:estiloPercEdi3MaisFreg21,
    onEachFeature: onEachFeaturePercEdi3MaisFreg21,
});

var slidePercEdi3MaisFreg21 = function(){
    var sliderPercEdi3MaisFreg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPercEdi3MaisFreg21, {
        start: [minPercEdi3MaisFreg21, maxPercEdi3MaisFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercEdi3MaisFreg21,
            'max': maxPercEdi3MaisFreg21
        },
    });
    
    inputNumberMin.setAttribute("value",minPercEdi3MaisFreg21);
    inputNumberMax.setAttribute("value",maxPercEdi3MaisFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPercEdi3MaisFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercEdi3MaisFreg21.noUiSlider.set([null, this.value]);
    });

    sliderPercEdi3MaisFreg21.noUiSlider.on('update',function(e){
        PercEdi3MaisFreg21.eachLayer(function(layer){
            if(layer.feature.properties.P3Mais_21>=parseFloat(e[0])&& layer.feature.properties.P3Mais_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPercEdi3MaisFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderPercEdi3MaisFreg21.noUiSlider;
    $(slidersGeral).append(sliderPercEdi3MaisFreg21);
}
///////////////////////////-------------------- FIM PERCENTAGEM 3 OU MAIS, EM 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////----------- PERCENTAGEM 1 OU 2 ALOJAMENTOS FAMILIARES, EM 2011,Por Freguesia ----------------------/////

var minPerc1ou2AlojamentosFreg11 = 99999;
var maxPerc1ou2AlojamentosFreg11 = 0;

function CorPer1ou2AlojamentosFreg(d) {
    return d == 0.00 ? '#808080' :
        d >= 95.72 ? '#8c0303' :
        d >= 89.33   ? '#de1f35' :
        d >= 78.67  ? '#ff5e6e' :
        d >= 68   ? '#f5b3be' :
        d >= 57.33   ? '#F2C572' :
                ''  ;
}
var legendaPer1ou2AlojamentosFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 95.72' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 89.33 a 95.72' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 78.67 a 89.33' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 68 a 78.67' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 57.33 a 68' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function estiloPerc1ou2AlojamentosFreg11(feature) {
    if(feature.properties.P1ou2_11< minPerc1ou2AlojamentosFreg11){
        minPerc1ou2AlojamentosFreg11 = feature.properties.P1ou2_11
    }
    if(feature.properties.P1ou2_11> maxPerc1ou2AlojamentosFreg11){
        maxPerc1ou2AlojamentosFreg11 = feature.properties.P1ou2_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer1ou2AlojamentosFreg(feature.properties.P1ou2_11)
    };
}
function apagarPerc1ou2AlojamentosFreg11(e){
    var layer = e.target;
    Perc1ou2AlojamentosFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerc1ou2AlojamentosFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios com 1 ou 2 alojamentos: ' + '<b>' +feature.properties.P1ou2_11  + '</b>'+ '%' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerc1ou2AlojamentosFreg11,
    })
};

var Perc1ou2AlojamentosFreg11= L.geoJSON(dadosRelativosFreguesias21,{
    style:estiloPerc1ou2AlojamentosFreg11,
    onEachFeature: onEachFeaturePerc1ou2AlojamentosFreg11,
});

var slidePerc1ou2AlojamentosFreg11 = function(){
    var sliderPerc1ou2AlojamentosFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerc1ou2AlojamentosFreg11, {
        start: [minPerc1ou2AlojamentosFreg11, maxPerc1ou2AlojamentosFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc1ou2AlojamentosFreg11,
            'max': maxPerc1ou2AlojamentosFreg11
        },
    });
    
    inputNumberMin.setAttribute("value",minPerc1ou2AlojamentosFreg11);
    inputNumberMax.setAttribute("value",maxPerc1ou2AlojamentosFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc1ou2AlojamentosFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc1ou2AlojamentosFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPerc1ou2AlojamentosFreg11.noUiSlider.on('update',function(e){
        Perc1ou2AlojamentosFreg11.eachLayer(function(layer){
            if(layer.feature.properties.P1ou2_11>=parseFloat(e[0])&& layer.feature.properties.P1ou2_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerc1ou2AlojamentosFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderPerc1ou2AlojamentosFreg11.noUiSlider;
    $(slidersGeral).append(sliderPerc1ou2AlojamentosFreg11);
}
////////////////////----------------- FIM PERCENTAGEM 1 OU 2 ALOJAMENTOS, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


//////////////////////////////----------- PERCENTAGEM 1 OU 2 ALOJAMENTOS FAMILIARES, EM 2021,Por Freguesia ----------------------/////

var minPerc1ou2AlojamentosFreg21 = 99999;
var maxPerc1ou2AlojamentosFreg21 = 0;

function estiloPerc1ou2AlojamentosFreg21(feature) {
    if(feature.properties.P1ou2_21< minPerc1ou2AlojamentosFreg21){
        minPerc1ou2AlojamentosFreg21 = feature.properties.P1ou2_21
    }
    if(feature.properties.P1ou2_21> maxPerc1ou2AlojamentosFreg21){
        maxPerc1ou2AlojamentosFreg21 = feature.properties.P1ou2_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer1ou2AlojamentosFreg(feature.properties.P1ou2_21)
    };
}
function apagarPerc1ou2AlojamentosFreg21(e){
    var layer = e.target;
    Perc1ou2AlojamentosFreg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerc1ou2AlojamentosFreg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios com 1 ou 2 alojamentos: ' + '<b>' +feature.properties.P1ou2_21  + '</b>'+ '%' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerc1ou2AlojamentosFreg21,
    })
};

var Perc1ou2AlojamentosFreg21= L.geoJSON(dadosRelativosFreguesias21,{
    style:estiloPerc1ou2AlojamentosFreg21,
    onEachFeature: onEachFeaturePerc1ou2AlojamentosFreg21,
});

var slidePerc1ou2AlojamentosFreg21 = function(){
    var sliderPerc1ou2AlojamentosFreg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerc1ou2AlojamentosFreg21, {
        start: [minPerc1ou2AlojamentosFreg21, maxPerc1ou2AlojamentosFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerc1ou2AlojamentosFreg21,
            'max': maxPerc1ou2AlojamentosFreg21
        },
    });
    
    inputNumberMin.setAttribute("value",minPerc1ou2AlojamentosFreg21);
    inputNumberMax.setAttribute("value",maxPerc1ou2AlojamentosFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerc1ou2AlojamentosFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerc1ou2AlojamentosFreg21.noUiSlider.set([null, this.value]);
    });

    sliderPerc1ou2AlojamentosFreg21.noUiSlider.on('update',function(e){
        Perc1ou2AlojamentosFreg21.eachLayer(function(layer){
            if(layer.feature.properties.P1ou2_21>=parseFloat(e[0])&& layer.feature.properties.P1ou2_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerc1ou2AlojamentosFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderPerc1ou2AlojamentosFreg21.noUiSlider;
    $(slidersGeral).append(sliderPerc1ou2AlojamentosFreg21);
}
////////////////////----------------- FIM PERCENTAGEM 1 OU 2 ALOJAMENTOS, EM 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM OUTRO TIPO, EM 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPercEdiOutrosFreg11 = 99999;
var maxPercEdiOutrosFreg11 = 0;

function CorPerOutroTipoFreg(d) {
    return d == 0.00 ? '#808080' :
        d >= 11.7 ? '#8c0303' :
        d >= 9.75  ? '#de1f35' :
        d >= 6.5  ? '#ff5e6e' :
        d >= 3.25   ? '#f5b3be' :
        d >= 0.01   ? '#F2C572' :
                ''  ;
}
var legendaPerOutroTipoFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 11.7' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 9.75 a 11.7' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 6.5 a 9.75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 3.25 a 6.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0 a 3.25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' 0' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function estiloPercEdiOutrosFreg11(feature) {
    if(feature.properties.POutro11 < minPercEdiOutrosFreg11){
        minPercEdiOutrosFreg11 = feature.properties.POutro11
    }
    if(feature.properties.POutro11> maxPercEdiOutrosFreg11){
        maxPercEdiOutrosFreg11 = feature.properties.POutro11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerOutroTipoFreg(feature.properties.POutro11)
    };
}
function apagarPercEdiOutrosFreg11(e){
    var layer = e.target;
    PercEdiOutrosFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePercEdiOutrosFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios de outro tipo: ' + '<b>' +feature.properties.POutro11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPercEdiOutrosFreg11,
    })
};

var PercEdiOutrosFreg11= L.geoJSON(dadosRelativosFreguesias21,{
    style:estiloPercEdiOutrosFreg11,
    onEachFeature: onEachFeaturePercEdiOutrosFreg11,
});

var slidePercEdiOutrosFreg11 = function(){
    var sliderPercEdiOutrosFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPercEdiOutrosFreg11, {
        start: [minPercEdiOutrosFreg11, maxPercEdiOutrosFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercEdiOutrosFreg11,
            'max': maxPercEdiOutrosFreg11
        },
    });
    
    inputNumberMin.setAttribute("value",minPercEdiOutrosFreg11);
    inputNumberMax.setAttribute("value",maxPercEdiOutrosFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercEdiOutrosFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercEdiOutrosFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPercEdiOutrosFreg11.noUiSlider.on('update',function(e){
        PercEdiOutrosFreg11.eachLayer(function(layer){
            if(layer.feature.properties.POutro11>=parseFloat(e[0])&& layer.feature.properties.POutro11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPercEdiOutrosFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderPercEdiOutrosFreg11.noUiSlider;
    $(slidersGeral).append(sliderPercEdiOutrosFreg11);
}
///////////////////////////-------------------- FIM PERCENTAGEM OUTRO TIPO, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\



////////////////////////////////////----------- PERCENTAGEM OUTRO TIPO, EM 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPercEdiOutrosFreg21 = 99999;
var maxPercEdiOutrosFreg21 = 0;


function estiloPercEdiOutrosFreg21(feature) {
    if(feature.properties.POutro21 < minPercEdiOutrosFreg21){
        minPercEdiOutrosFreg21 = feature.properties.POutro21
    }
    if(feature.properties.POutro21> maxPercEdiOutrosFreg21){
        maxPercEdiOutrosFreg21 = feature.properties.POutro21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerOutroTipoFreg(feature.properties.POutro21)
    };
}
function apagarPercEdiOutrosFreg21(e){
    var layer = e.target;
    PercEdiOutrosFreg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePercEdiOutrosFreg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios de outro tipo: ' + '<b>' +feature.properties.POutro21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPercEdiOutrosFreg21,
    })
};

var PercEdiOutrosFreg21= L.geoJSON(dadosRelativosFreguesias21,{
    style:estiloPercEdiOutrosFreg21,
    onEachFeature: onEachFeaturePercEdiOutrosFreg21,
});

var slidePercEdiOutrosFreg21 = function(){
    var sliderPercEdiOutrosFreg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPercEdiOutrosFreg21, {
        start: [minPercEdiOutrosFreg21, maxPercEdiOutrosFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercEdiOutrosFreg21,
            'max': maxPercEdiOutrosFreg21
        },
    });
    
    inputNumberMin.setAttribute("value",minPercEdiOutrosFreg21);
    inputNumberMax.setAttribute("value",maxPercEdiOutrosFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPercEdiOutrosFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercEdiOutrosFreg21.noUiSlider.set([null, this.value]);
    });

    sliderPercEdiOutrosFreg21.noUiSlider.on('update',function(e){
        PercEdiOutrosFreg21.eachLayer(function(layer){
            if(layer.feature.properties.POutro21>=parseFloat(e[0])&& layer.feature.properties.POutro21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPercEdiOutrosFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderPercEdiOutrosFreg21.noUiSlider;
    $(slidersGeral).append(sliderPercEdiOutrosFreg21);
}
///////////////////////////-------------------- FIM PERCENTAGEM OUTRO TIPO, EM 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\
/////////////////////////////////////////// VARIAÇÕES \\\\\\\\\\\\
///////////////////////////////////// VARIAÇÃO 1 OU 2 ALOJAMENTOS 2021 2011 //////////////////////////////////////////////////
var minVar1ou2Conc = 99999;
var maxVar1ou2Conc = 0;

function CorVar1ou2Conc(d) {
    return d === null ? '#808080':
        d >= 1.5  ? '#de1f35' :
        d >= 0  ? '#ff5e6e' :
        d >= -2  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -13  ? '#2288bf' :
                ''  ;
}

var legendaVar1ou2Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 1 ou 2 alojamentos familiares, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -15 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -12.94 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar1ou2Conc(feature) {
    if(feature.properties.Var1ou2 <= minVar1ou2Conc){
        minVar1ou2Conc = feature.properties.Var1ou2
    }
    if(feature.properties.Var1ou2 > maxVar1ou2Conc){
        maxVar1ou2Conc = feature.properties.Var1ou2 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1ou2Conc(feature.properties.Var1ou2)};
    }


function apagarVar1ou2Conc(e) {
    Var1ou2Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1ou2Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1ou2.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1ou2Conc,
    });
}
var Var1ou2Conc= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVar1ou2Conc,
    onEachFeature: onEachFeatureVar1ou2Conc
});

let slideVar1ou2Conc = function(){
    var sliderVar1ou2Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1ou2Conc, {
        start: [minVar1ou2Conc, maxVar1ou2Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1ou2Conc,
            'max': maxVar1ou2Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar1ou2Conc);
    inputNumberMax.setAttribute("value",maxVar1ou2Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1ou2Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1ou2Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar1ou2Conc.noUiSlider.on('update',function(e){
        Var1ou2Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var1ou2.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1ou2.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1ou2Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderVar1ou2Conc.noUiSlider;
    $(slidersGeral).append(sliderVar1ou2Conc);
} 

///////////////////////////// Fim da VARIAÇÃO 1 OU 2 ALOJAMENTOS CONCELHOS -------------- \\\\\

///////////////////////////////////// VARIAÇÃO 3 OU MAIS ALOJAMENTOS 2021 2011 //////////////////////////////////////////////////

var minVar3ouMaisConc = 99999;
var maxVar3ouMaisConc = 0;

function CorVar3ouMaisConc(d) {
    return d === null ? '#808080':
        d >= 5  ? '#de1f35' :
        d >= 2.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -2  ? '#9eaad7' :
        d >= -5.37  ? '#2288bf' :
                ''  ;
}

var legendaVar3ouMaisConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 3 ou mais alojamentos familiares, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2.5 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -2 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -5.36 a -2' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar3ouMaisConc(feature) {
    if(feature.properties.Var3Mais <= minVar3ouMaisConc){
        minVar3ouMaisConc = feature.properties.Var3Mais
    }
    if(feature.properties.Var3Mais > maxVar3ouMaisConc){
        maxVar3ouMaisConc = feature.properties.Var3Mais 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3ouMaisConc(feature.properties.Var3Mais)};
    }


function apagarVar3ouMaisConc(e) {
    Var3ouMaisConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3ouMaisConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3Mais.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3ouMaisConc,
    });
}
var Var3ouMaisConc= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVar3ouMaisConc,
    onEachFeature: onEachFeatureVar3ouMaisConc
});

let slideVar3ouMaisConc = function(){
    var sliderVar3ouMaisConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3ouMaisConc, {
        start: [minVar3ouMaisConc, maxVar3ouMaisConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3ouMaisConc,
            'max': maxVar3ouMaisConc
        },
        });
    inputNumberMin.setAttribute("value",minVar3ouMaisConc);
    inputNumberMax.setAttribute("value",maxVar3ouMaisConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3ouMaisConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3ouMaisConc.noUiSlider.set([null, this.value]);
    });

    sliderVar3ouMaisConc.noUiSlider.on('update',function(e){
        Var3ouMaisConc.eachLayer(function(layer){
            if(layer.feature.properties.Var3Mais.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3Mais.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3ouMaisConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderVar3ouMaisConc.noUiSlider;
    $(slidersGeral).append(sliderVar3ouMaisConc);
} 

///////////////////////////// Fim da VARIAÇÃO 3 OU MAIS ALOJAMENTOS CONCELHOS -------------- \\\\\

///////////////////////////////////// VARIAÇÃO OUTROS ALOJAMENTOS 2021 2011 //////////////////////////////////////////////////

var minVarOutrosConc = 99999;
var maxVarOutrosConc = 0;

function CorVarOutrosConc(d) {
    return d === null ? '#808080':
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -20  ? '#2288bf' :
        d >= -35  ? '#155273' :
                ''  ;
}

var legendaVarOutrosConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios de outro tipo, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -20 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -34.27 a -20' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarOutrosConc(feature) {
    if(feature.properties.VarOutros <= minVarOutrosConc){
        minVarOutrosConc = feature.properties.VarOutros
    }
    if(feature.properties.VarOutros > maxVarOutrosConc){
        maxVarOutrosConc = feature.properties.VarOutros 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarOutrosConc(feature.properties.VarOutros)};
    }


function apagarVarOutrosConc(e) {
    VarOutrosConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarOutrosConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarOutros.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarOutrosConc,
    });
}
var VarOutrosConc= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarOutrosConc,
    onEachFeature: onEachFeatureVarOutrosConc
});

let slideVarOutrosConc = function(){
    var sliderVarOutrosConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 39){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarOutrosConc, {
        start: [minVarOutrosConc, maxVarOutrosConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarOutrosConc,
            'max': maxVarOutrosConc
        },
        });
    inputNumberMin.setAttribute("value",minVarOutrosConc);
    inputNumberMax.setAttribute("value",maxVarOutrosConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVarOutrosConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarOutrosConc.noUiSlider.set([null, this.value]);
    });

    sliderVarOutrosConc.noUiSlider.on('update',function(e){
        VarOutrosConc.eachLayer(function(layer){
            if(layer.feature.properties.VarOutros.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarOutros.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarOutrosConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 39;
    sliderAtivo = sliderVarOutrosConc.noUiSlider;
    $(slidersGeral).append(sliderVarOutrosConc);
} 

///////////////////////////// Fim da VARIAÇÃO OUTROS ALOJAMENTOS CONCELHOS -------------- \\\\\

///////////////////////////////////// VARIAÇÃO OUTROS ALOJAMENTOS 2021 2011 //////////////////////////////////////////////////

var minVar1ou2Freg = 99999;
var maxVar1ou2Freg = 0;

function CorVar1ou2Freg(d) {
    return d === null ? '#808080':
        d >= 5  ? '#de1f35' :
        d >= 2.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -23  ? '#2288bf' :
                ''  ;
}

var legendaVar1ou2Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 1 ou 2 alojamentos familiares, entre 2021 e 2011, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2.5 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -22.66 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar1ou2Freg(feature) {
    if(feature.properties.Var1ou2 <= minVar1ou2Freg){
        minVar1ou2Freg = feature.properties.Var1ou2
    }
    if(feature.properties.Var1ou2 > maxVar1ou2Freg){
        maxVar1ou2Freg = feature.properties.Var1ou2 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1ou2Freg(feature.properties.Var1ou2)};
    }


function apagarVar1ou2Freg(e) {
    Var1ou2Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1ou2Freg(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1ou2.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1ou2Freg,
    });
}
var Var1ou2Freg= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVar1ou2Freg,
    onEachFeature: onEachFeatureVar1ou2Freg
});

let slideVar1ou2Freg = function(){
    var sliderVar1ou2Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1ou2Freg, {
        start: [minVar1ou2Freg, maxVar1ou2Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1ou2Freg,
            'max': maxVar1ou2Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar1ou2Freg);
    inputNumberMax.setAttribute("value",maxVar1ou2Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1ou2Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1ou2Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar1ou2Freg.noUiSlider.on('update',function(e){
        Var1ou2Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var1ou2.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1ou2.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1ou2Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderVar1ou2Freg.noUiSlider;
    $(slidersGeral).append(sliderVar1ou2Freg);
} 

///////////////////////////// Fim da VARIAÇÃO 1 ou 2 ALOJAMENTOS FREGUESIAS -------------- \\\\\

///////////////////////////////////// VARIAÇÃO 3 OU MAIS ALOJAMENTOS 2021 2011 //////////////////////////////////////////////////

var minVar3ouMaisFreg = 99999;
var maxVar3ouMaisFreg = 0;

function CorVar3ouMaisFreg(d) {
    return d === null ? '#808080':
        d >= 20  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -100.01  ? '#2288bf' :
                ''  ;
}

var legendaVar3ouMaisFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 3 ou mais alojamentos familiares, entre 2021 e 2011, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar3ouMaisFreg(feature) {
    if(feature.properties.Var3Mais <= minVar3ouMaisFreg){
        minVar3ouMaisFreg = feature.properties.Var3Mais
    }
    if(feature.properties.Var3Mais > maxVar3ouMaisFreg){
        maxVar3ouMaisFreg = feature.properties.Var3Mais 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3ouMaisFreg(feature.properties.Var3Mais)};
    }


function apagarVar3ouMaisFreg(e) {
    Var3ouMaisFreg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3ouMaisFreg(feature, layer) {
    if(feature.properties.Var3Mais === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3Mais.toFixed(2) + '</b>' + '%').openPopup()
    }
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3ouMaisFreg,
    });
}
var Var3ouMaisFreg= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVar3ouMaisFreg,
    onEachFeature: onEachFeatureVar3ouMaisFreg
});

let slideVar3ouMaisFreg = function(){
    var sliderVar3ouMaisFreg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3ouMaisFreg, {
        start: [minVar3ouMaisFreg, maxVar3ouMaisFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3ouMaisFreg,
            'max': maxVar3ouMaisFreg
        },
        });
    inputNumberMin.setAttribute("value",minVar3ouMaisFreg);
    inputNumberMax.setAttribute("value",maxVar3ouMaisFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3ouMaisFreg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3ouMaisFreg.noUiSlider.set([null, this.value]);
    });

    sliderVar3ouMaisFreg.noUiSlider.on('update',function(e){
        Var3ouMaisFreg.eachLayer(function(layer){
            if (layer.feature.properties.Var3Mais == null){
                return false
            }
            if(layer.feature.properties.Var3Mais.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3Mais.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3ouMaisFreg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderVar3ouMaisFreg.noUiSlider;
    $(slidersGeral).append(sliderVar3ouMaisFreg);
} 

///////////////////////////// Fim da VARIAÇÃO 3 OU MAIS ALOJAMENTOS FREGUESIAS -------------- \\\\\

///////////////////////////////////// VARIAÇÃOS OUTROS ALOJAMENTOS 2021 2011 //////////////////////////////////////////////////

var minVarOutrosFreg = 99999;
var maxVarOutrosFreg = 0;

function CorVarOutrosFreg(d) {
    return d === null ? '#808080':
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -100.01  ? '#2288bf' :
                ''  ;
}

var legendaVarOutrosFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios de outro tipo, entre 2021 e 2011, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarOutrosFreg(feature) {
    if(feature.properties.VarOutros <= minVarOutrosFreg){
        minVarOutrosFreg = feature.properties.VarOutros
    }
    if(feature.properties.VarOutros > maxVarOutrosFreg){
        maxVarOutrosFreg = feature.properties.VarOutros 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarOutrosFreg(feature.properties.VarOutros)};
    }


function apagarVarOutrosFreg(e) {
    VarOutrosFreg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarOutrosFreg(feature, layer) {
    if(feature.properties.VarOutros === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarOutros.toFixed(2) + '</b>' + '%').openPopup()
    }
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarOutrosFreg,
    });
}
var VarOutrosFreg= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVarOutrosFreg,
    onEachFeature: onEachFeatureVarOutrosFreg
});

let slideVarOutrosFreg = function(){
    var sliderVarOutrosFreg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 42){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarOutrosFreg, {
        start: [minVarOutrosFreg, maxVarOutrosFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarOutrosFreg,
            'max': maxVarOutrosFreg
        },
        });
    inputNumberMin.setAttribute("value",minVarOutrosFreg);
    inputNumberMax.setAttribute("value",maxVarOutrosFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVarOutrosFreg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarOutrosFreg.noUiSlider.set([null, this.value]);
    });

    sliderVarOutrosFreg.noUiSlider.on('update',function(e){
        VarOutrosFreg.eachLayer(function(layer){
            if (layer.feature.properties.VarOutros == null){
                return false
            }
            if(layer.feature.properties.VarOutros.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarOutros.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarOutrosFreg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 42;
    sliderAtivo = sliderVarOutrosFreg.noUiSlider;
    $(slidersGeral).append(sliderVarOutrosFreg);
} 

///////////////////////////// Fim da VARIAÇÃO OUTROS ALOJAMENTOS FREGUESIAS -------------- \\\\\




/// Não duplicar as layers
let naoDuplicar = 21
//// dizer qual a layer ativa
let layerAtiva = Edi1ou2AlojamentosConc11;
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
    if (layer == EdIsoladoConc11 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios isolados, em 2011, por concelho.' + '</strong>');
        legenda(maxEdIsoladoConc11, ((maxEdIsoladoConc11-minEdIsoladoConc11)/2).toFixed(0),minEdIsoladoConc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdIsoladoConc11();
        naoDuplicar = 1;
    }
    if (layer == Edi1ou2AlojamentosConc11 && naoDuplicar == 21){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 ou 2 alojamentos familiares, em 2011, por concelho.' + '</strong>');
        contorno.addTo(map);
    }
    if (layer == EdiGeminadoConc11 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios geminados, em 2011, por concelho.' + '</strong>');
        legenda(maxEdiGeminadoConc11, ((maxEdiGeminadoConc11-minEdiGeminadoConc11)/2).toFixed(0),minEdiGeminadoConc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdiGeminadoConc11();
        naoDuplicar = 2;
    }
    if (layer == EdiBandaConc11 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios em banda, em 2011, por concelho.' + '</strong>');
        legenda(maxEdiBandaConc11, ((maxEdiBandaConc11-minEdiBandaConc11)/2).toFixed(0),minEdiBandaConc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdiBandaConc11();
        naoDuplicar = 3;
    }
    if (layer == Edi1ou2AlojamentosConc11 && naoDuplicar != 21){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 ou 2 alojamentos familiares, em 2011, por concelho.' + '</strong>');
        legenda(maxEdi1ou2AlojamentosConc11, ((maxEdi1ou2AlojamentosConc11-minEdi1ou2AlojamentosConc11)/2).toFixed(0),minEdi1ou2AlojamentosConc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdi1ou2AlojamentosConc11();
        naoDuplicar = 21;
    }
    if (layer == Edi3MaisConc11 && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 3 ou mais alojamentos familiares, em 2011, por concelho.' + '</strong>');
        legenda(maxEdi3MaisConc11, ((maxEdi3MaisConc11-minEdi3MaisConc11)/2).toFixed(0),minEdi3MaisConc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdi3MaisConc11();
        naoDuplicar = 4;
    }
    if (layer == EdiOutrosConc11 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios de outro tipo, em 2011, por concelho.' + '</strong>');
        legendaExcecao(maxEdiOutrosConc11, ((maxEdiOutrosConc11-minEdiOutrosConc11)/2).toFixed(0),minEdiOutrosConc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdiOutrosConc11();
        naoDuplicar = 5;
    }
    if (layer == PercEdIsoladoConc11 && naoDuplicar != 6){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios isolados, em 2011, por concelho.' + '</strong>')
        legendaPerIsoladoConc();
        slidePercEdIsoladoConc11();
        naoDuplicar = 6;
    }
    if (layer == PercEdiGeminadoConc11 && naoDuplicar != 7){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios geminados, em 2011, por concelho.' + '</strong>')
        legendaPerGeminadoConc();
        slidePercEdiGeminadoConc11();
        naoDuplicar = 7;
    }
    if (layer == Perc1ou2AlojamentosConc11 && naoDuplicar != 22){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios com 1 ou 2 alojamentos familiares, em 2011, por concelho.' + '</strong>')
        legendaPer1ou2AlojamentosConc();
        slidePerc1ou2AlojamentosConc11();
        naoDuplicar = 22;
    }
    if (layer == PercEdiBandaConc11 && naoDuplicar != 8){
        legendaPerBandaConc();
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios em banda, em 2011, por concelho.' + '</strong>')
        slidePercEdiBandaConc11();
        naoDuplicar = 8;
    }
    if (layer == PercEdi3MaisConc11 && naoDuplicar != 9){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios com 3 ou mais alojamentos familiares, em 2011, por concelho.' + '</strong>')
        legendaPer3MaisConc();
        slidePercEdi3MaisConc11();
        naoDuplicar = 9;
    }
    if (layer == PercOutroTipoConc11 && naoDuplicar != 10){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios de outro tipo, em 2011, por concelho.' + '</strong>')
        legendaPerOutroTipoConc();
        slidePercOutroTipoConc11();
        naoDuplicar = 10;
    }
    if (layer == EdIsoladoFreg11 && naoDuplicar != 11){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios isolados, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdIsoladoFreg11, ((maxEdIsoladoFreg11-minEdIsoladoFreg11)/2).toFixed(0),minEdIsoladoFreg11,0.3);
        contornoFreg11.addTo(map);
        baseAtiva = contornoFreg11;
        slideEdIsoladoFreg11();
        naoDuplicar = 11;
    }
    if (layer == EdiGeminadoFreg11 && naoDuplicar != 12){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios geminados, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdiGeminadoFreg11, ((maxEdiGeminadoFreg11-minEdiGeminadoFreg11)/2).toFixed(0),minEdiGeminadoFreg11,0.3);
        contornoFreg11.addTo(map);
        baseAtiva = contornoFreg11;
        slideEdiGeminadoFreg11();
        naoDuplicar = 12;
    }
    if (layer == EdiBandaFreg11 && naoDuplicar != 13){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios em banda, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdiBandaFreg11, ((maxEdiBandaFreg11-minEdiBandaFreg11)/2).toFixed(0),minEdiBandaFreg11,0.3);
        contornoFreg11.addTo(map);
        baseAtiva = contornoFreg11;
        slideEdiBandaFreg11();
        naoDuplicar = 13;
    }
    if (layer == Edi3MaisFreg11 && naoDuplicar != 14){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 3 ou mais alojamentos familiares, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdi3MaisFreg11, ((maxEdi3MaisFreg11-minEdi3MaisFreg11)/2).toFixed(0),minEdi3MaisFreg11,0.25);
        contornoFreg11.addTo(map);
        baseAtiva = contornoFreg11;
        slideEdi3MaisFreg11();
        naoDuplicar = 14;
    }
    if (layer == Edi1ou2AlojamentosFreg11 && naoDuplicar != 23){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 ou 2 alojamentos familiares, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdi1ou2AlojamentosFreg11, ((maxEdi1ou2AlojamentosFreg11-minEdi1ou2AlojamentosFreg11)/2).toFixed(0),minEdi1ou2AlojamentosFreg11,0.25);
        contornoFreg11.addTo(map);
        baseAtiva = contornoFreg11;
        slideEdi1ou2AlojamentosFreg11();
        naoDuplicar = 23;
    }
    if (layer == EdiOutrosFreg11 && naoDuplicar != 15){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios de outro tipo, em 2011, por freguesia.' + '</strong>');
        legendaExcecao(maxEdiOutrosFreg11, ((maxEdiOutrosFreg11-minEdiOutrosFreg11)/2).toFixed(0),minEdiOutrosFreg11,1);
        contornoFreg11.addTo(map);
        baseAtiva = contornoFreg11;
        slideEdiOutrosFreg11();
        naoDuplicar = 15;
    }
    if (layer == PercEdIsoladoFreg11 && naoDuplicar != 16){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios isolados, em 2011, por freguesia.' + '</strong>')
        legendaPerIsoladoFreg();
        slidePercEdIsoladoFreg11();
        naoDuplicar = 16;
    }
    if (layer == PercEdiGeminadoFreg11 && naoDuplicar != 17){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios geminados, em 2011, por freguesia.' + '</strong>')
        legendaPerGeminadoFreg();
        slidePercEdiGeminadoFreg11();
        naoDuplicar = 17;
    }
    if (layer == PercEdiBandaFreg11 && naoDuplicar != 18){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios em banda, em 2011, por freguesia.' + '</strong>')
        legendaPerBandaFreg();
        slidePercEdiBandaFreg11();
        naoDuplicar = 18;
    }
    if (layer == PercEdi3MaisFreg11 && naoDuplicar != 19){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios com 3 ou mais alojamentos familiares, em 2011, por freguesia.' + '</strong>')
        legendaPer3MaisFreg();
        slidePercEdi3MaisFreg11();
        naoDuplicar = 19;
    }
    if (layer == PercEdiOutrosFreg11 && naoDuplicar != 20){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios de outro tipo, em 2011, por freguesia.' + '</strong>')
        legendaPerOutroTipoFreg();
        slidePercEdiOutrosFreg11();
        naoDuplicar = 20;
    }
    if (layer == Perc1ou2AlojamentosFreg11 && naoDuplicar != 24){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios com 1 ou 2 alojamentos familiares, em 2011, por freguesia.' + '</strong>')
        legendaPer1ou2AlojamentosFreg();
        slidePerc1ou2AlojamentosFreg11();
        naoDuplicar = 24;
    }
    if (layer == Edi1ou2AlojamentosConc21 && naoDuplicar != 25){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 ou 2 alojamentos familiares, em 2021, por concelho.' + '</strong>');
        legenda(maxEdi1ou2AlojamentosConc21, ((maxEdi1ou2AlojamentosConc21-minEdi1ou2AlojamentosConc21)/2).toFixed(0),minEdi1ou2AlojamentosConc21,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdi1ou2AlojamentosConc21();
        naoDuplicar = 25;
    }
    if (layer == Edi3MaisConc21 && naoDuplicar != 26){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 3 ou mais alojamentos familiares, em 2021, por concelho.' + '</strong>');
        legenda(maxEdi3MaisConc21, ((maxEdi3MaisConc21-minEdi3MaisConc21)/2).toFixed(0),minEdi3MaisConc21,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdi3MaisConc21();
        naoDuplicar = 26;
    }
    if (layer == EdiOutrosConc21 && naoDuplicar != 27){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios de outro tipo, em 2021, por concelho.' + '</strong>');
        legendaExcecao(maxEdiOutrosConc21, ((maxEdiOutrosConc21-minEdiOutrosConc21)/2).toFixed(0),minEdiOutrosConc21,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdiOutrosConc21();
        naoDuplicar = 27;
    }
    if (layer == Perc1ou2AlojamentosConc21 && naoDuplicar != 28){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios com 1 ou 2 alojamentos familiares, em 2021, por concelho.' + '</strong>')
        legendaPer1ou2AlojamentosConc();
        slidePerc1ou2AlojamentosConc21();
        naoDuplicar = 28;
    }
    if (layer == PercEdi3MaisConc21 && naoDuplicar != 29){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios com 3 ou mais alojamentos familiares, em 2021, por concelho.' + '</strong>')
        legendaPer3MaisConc();
        slidePercEdi3MaisConc21();
        naoDuplicar = 29;
    }
    if (layer == PercOutroTipoConc21 && naoDuplicar != 30){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios de outro tipo, em 2021, por concelho.' + '</strong>')
        legendaPerOutroTipoConc();
        slidePercOutroTipoConc21();
        naoDuplicar = 30;
    }
    if (layer == Edi3MaisFreg21 && naoDuplicar != 32){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 3 ou mais alojamentos familiares, em 2021, por freguesia.' + '</strong>');
        legenda(maxEdi3MaisFreg21, ((maxEdi3MaisFreg21-minEdi3MaisFreg21)/2).toFixed(0),minEdi3MaisFreg21,0.25);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi3MaisFreg21();
        naoDuplicar = 32;
    }
    if (layer == Edi1ou2AlojamentosFreg21 && naoDuplicar != 31){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 ou 2 alojamentos familiares, em 2021, por freguesia.' + '</strong>');
        legenda(maxEdi1ou2AlojamentosFreg21, ((maxEdi1ou2AlojamentosFreg21-minEdi1ou2AlojamentosFreg21)/2).toFixed(0),minEdi1ou2AlojamentosFreg21,0.25);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi1ou2AlojamentosFreg21();
        naoDuplicar = 31;
    }
    if (layer == EdiOutrosFreg21 && naoDuplicar != 33){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios de outro tipo, em 2021, por freguesia.' + '</strong>');
        legendaExcecao(maxEdiOutrosFreg21, ((maxEdiOutrosFreg21-minEdiOutrosFreg21)/2).toFixed(0),minEdiOutrosFreg21,1);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdiOutrosFreg21();
        naoDuplicar = 33;
    }
    if (layer == PercEdi3MaisFreg21 && naoDuplicar != 34){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios com 3 ou mais alojamentos familiares, em 2021, por freguesia.' + '</strong>')
        legendaPer3MaisFreg();
        slidePercEdi3MaisFreg21();
        naoDuplicar = 34;
    }
    if (layer == PercEdiOutrosFreg21 && naoDuplicar != 35){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios de outro tipo, em 2021, por freguesia.' + '</strong>')
        legendaPerOutroTipoFreg();
        slidePercEdiOutrosFreg21();
        naoDuplicar = 35;
    }
    if (layer == Perc1ou2AlojamentosFreg21 && naoDuplicar != 36){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios com 1 ou 2 alojamentos familiares, em 2021, por freguesia.' + '</strong>')
        legendaPer1ou2AlojamentosFreg();
        slidePerc1ou2AlojamentosFreg21();
        naoDuplicar = 36;
    }
    if (layer == Var1ou2Conc && naoDuplicar != 37){
        legendaVar1ou2Conc();
        slideVar1ou2Conc();
        naoDuplicar = 37;
    }
    if (layer == Var3ouMaisConc && naoDuplicar != 38){
        legendaVar3ouMaisConc();
        slideVar3ouMaisConc();
        naoDuplicar = 38;
    }
    if (layer == VarOutrosConc && naoDuplicar != 39){
        legendaVarOutrosConc();
        slideVarOutrosConc();
        naoDuplicar = 39;
    }
    if (layer == Var1ou2Freg && naoDuplicar != 40){
        legendaVar1ou2Freg();
        slideVar1ou2Freg();
        naoDuplicar = 40;
    }
    if (layer == Var3ouMaisFreg && naoDuplicar != 41){
        legendaVar3ouMaisFreg();
        slideVar3ouMaisFreg();
        naoDuplicar = 41;
    }
    if (layer == VarOutrosFreg && naoDuplicar != 42){
        legendaVarOutrosFreg();
        slideVarOutrosFreg();
        naoDuplicar = 42;
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
    $('#notaRodape').css('Visibility','Visible');
}

function myFunction() {
    var ano = document.getElementById("mySelect").value;
    var tipo = document.getElementById("opcaoSelect").value;
    aparecerValoresEncargos();
    if($('#encargoMensal').length){
        var encargo = document.getElementById("valoresEncargos").value;
    }
    if ($('#concelho').hasClass('active2')){
        if ($('#absoluto').hasClass('active4')){
            $('#notaRodape').remove();
            if (ano == "2011"){
                if (tipo == "1ou2"){
                    if (encargo == "Total"){
                        novaLayer(Edi1ou2AlojamentosConc11)
                    }
                    if (encargo == "Geminado"){
                        novaLayer(EdiGeminadoConc11);
                    }
                    if (encargo == "Banda"){
                        novaLayer(EdiBandaConc11);
                    }
                    if (encargo == "Isolado"){
                        novaLayer(EdIsoladoConc11);
                    }
                }
                if (tipo == "3OuMais"){
                    novaLayer(Edi3MaisConc11);
                }
                if (tipo == "OutroTipo"){
                    novaLayer(EdiOutrosConc11);
                }
            }
            if (ano == "2021"){
                if (tipo == "1ou2"){
                    novaLayer(Edi1ou2AlojamentosConc21)
                }
                if (tipo == "3OuMais"){
                    novaLayer(Edi3MaisConc21);
                }
                if (tipo == "OutroTipo"){
                    novaLayer(EdiOutrosConc21);
                }
            }
        }
        if ($('#percentagem').hasClass('active4')){
            if (ano == "2011"){
                if (tipo == "1ou2"){
                        if (encargo == "Total"){
                            novaLayer(Perc1ou2AlojamentosConc11)
                        }
                        if (encargo == "Geminado"){
                            novaLayer(PercEdiGeminadoConc11);
                        }
                        if (encargo == "Banda"){
                            novaLayer(PercEdiBandaConc11);
                        }
                        if (encargo == "Isolado"){
                            novaLayer(PercEdIsoladoConc11);
                        }
                    }
                if (tipo == "3OuMais"){
                    novaLayer(PercEdi3MaisConc11);
                }
                if (tipo == "OutroTipo"){
                novaLayer(PercOutroTipoConc11);
                }
            }
            if (ano == "2021"){
                if (tipo == "1ou2"){
                    novaLayer(Perc1ou2AlojamentosConc21)
                }
                if (tipo == "3OuMais"){
                    novaLayer(PercEdi3MaisConc21);
                }
                if (tipo == "OutroTipo"){
                    novaLayer(PercOutroTipoConc21);
                }
            }
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if (tipo == "1ou2"){
                novaLayer(Var1ou2Conc);
            }
            if (tipo == "3OuMais"){
                novaLayer(Var3ouMaisConc);
            }
            if (tipo == "OutroTipo"){
                novaLayer(VarOutrosConc);
            }
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if ($('#absoluto').hasClass('active5')){
            if (ano == "2011"){
                if (tipo == "1ou2"){
                    if (encargo == "Total"){
                        novaLayer(Edi1ou2AlojamentosFreg11)
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados à escala concelhia e à categoria de edifício "Outro tipo" à escala da freguesia.'  + '</b>')
                    }
                    if (encargo == "Geminado"){
                        novaLayer(EdiGeminadoFreg11);
                        notaRodape()
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados à escala concelhia e à categoria de edifício "Outro tipo" à escala da freguesia.'  + '</b>')
                    }
                    if (encargo == "Banda"){
                        novaLayer(EdiBandaFreg11);
                        notaRodape()
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados à escala concelhia e à categoria de edifício "Outro tipo" à escala da freguesia.'  + '</b>')
                    }
                    if (encargo == "Isolado"){
                        novaLayer(EdIsoladoFreg11);
                        notaRodape()
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados à escala concelhia e à categoria de edifício "Outro tipo" à escala da freguesia.'  + '</b>')
                    }
                }
                if (tipo == "3OuMais"){
                    novaLayer(Edi3MaisFreg11);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados à escala concelhia e à categoria de edifício "Outro tipo" à escala da freguesia.'  + '</b>')

                }
                if (tipo == "OutroTipo"){
                    novaLayer(EdiOutrosFreg11);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' restantes dados.'  + '</b>')
                }
            }
            if (ano == "2021"){
                if (tipo == "1ou2"){
                    novaLayer(Edi1ou2AlojamentosFreg21)
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados à escala concelhia e à categoria de edifício "Outro tipo" à escala da freguesia.'  + '</b>')
                }
                if (tipo == "3OuMais"){
                    novaLayer(Edi3MaisFreg21);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados à escala concelhia e à categoria de edifício "Outro tipo" à escala da freguesia.'  + '</b>')

                }
                if (tipo == "OutroTipo"){
                    novaLayer(EdiOutrosFreg21);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' restantes dados.'  + '</b>')

                }
            }
        }
        if ($('#percentagem').hasClass('active5')){
            $('#notaRodape').remove();
            if (ano == "2011"){
                if (tipo == "1ou2"){
                        if (encargo == "Total"){
                            novaLayer(Perc1ou2AlojamentosFreg11)
                        }
                        if (encargo == "Geminado"){
                            novaLayer(PercEdiGeminadoFreg11);
                        }
                        if (encargo == "Banda"){
                            novaLayer(PercEdiBandaFreg11);
                        }
                        if (encargo == "Isolado"){
                            novaLayer(PercEdIsoladoFreg11);
                        }
                    }
                    if (tipo == "3OuMais"){
                        novaLayer(PercEdi3MaisFreg11);
                    }
                    if (tipo == "OutroTipo"){
                        novaLayer(PercEdiOutrosFreg11);
                    }
                }
                 if (ano == "2021"){
                    if (tipo == "1ou2"){
                        novaLayer(Perc1ou2AlojamentosFreg21)
                    }
                     if (tipo == "3OuMais"){
                        novaLayer(PercEdi3MaisFreg21);
                    }
                    if (tipo == "OutroTipo"){
                        novaLayer(PercEdiOutrosFreg21);
                    }
                }
            }
            if ($('#taxaVariacao').hasClass('active5')){
                $('#notaRodape').remove();
                if (tipo == "1ou2"){
                    novaLayer(Var1ou2Freg);
                }
                if (tipo == "3OuMais"){
                    novaLayer(Var3ouMaisFreg);
                }
                if (tipo == "OutroTipo"){
                    novaLayer(VarOutrosFreg);
                }
            }
        }
    }


function primeiroValorEncargos(ano,opcao,encargo){
    $("#mySelect").val(ano);
    $("#opcaoSelect").val(opcao);
    $("#encargoMensal").val(encargo);
}
let aparecerValoresEncargos = function(){
    var escalao = document.getElementById("opcaoSelect").value;
    var ano = document.getElementById("mySelect").value;
    if ($('#absoluto').hasClass('active4') || $('#absoluto').hasClass('active5') ||$('#percentagem').hasClass('active4') ||$('#percentagem').hasClass('active5')){
        if (ano == "2011" ){
            if (escalao == "3OuMais" || escalao == "OutroTipo"){
                if($('#encargoMensal').length){
                    $("#encargoMensal" ).remove();
                }
            }
            if (escalao == "1ou2" && $('#encargoMensal').length == 0){
                $('#variavel').after('<div id="encargoMensal" class ="titulo">Tipo de edifício:</div>');
                $('#encargoMensal').append('<select id= "valoresEncargos"></select>');
                $('#valoresEncargos')
                    .append('<option value="Total">Total</option>')
                    .append('<option value="Isolado">Isolado</option>')
                    .append('<option value="Geminado">Geminado</option>')
                    .append('<option value="Banda">Em banda</option>')   
                    $('#encargoMensal').change(function(){
                        myFunction();
                    })             
                }
            }
            $('#encargoMensal').css("visibility","visible");
            $('#valoresEncargos').css("visibility","visible"); 
        }
        if (ano == "2021" ){
            if($('#encargoMensal').length){
                $("#encargoMensal" ).remove();
            }
        }
    if ($('#taxaVariacao').hasClass('active4') || $('#taxaVariacao').hasClass('active5')){
        if($('#encargoMensal').length){
            $("#encargoMensal" ).remove();
        }
    }
}
let reporAnos = function(){
    if ($('#percentagem').hasClass('active5') || $('#percentagem').hasClass('active4') || $('#absoluto').hasClass('active5') || $('#absoluto').hasClass('active4')){
        if ($("#mySelect option[value='2021']").length == 0){
            $('#mySelect').append('<option value="2021">2021</option>')
        }
        $("#mySelect option[value='2011']").html("2011");
    }
    if ($('#taxaVariacao').hasClass('active5') || $('#taxaVariacao').hasClass('active4')){
        if ($("#mySelect option[value='2021']").length > 0){
            $("#mySelect option[value='2021']").remove();
        }
        $("#mySelect option[value='2011']").html("2021 - 2011");
    }

}
let primeirovalor = function(ano,tipo){
    $("#mySelect").val(ano);
    $("#opcaoSelect").val(tipo);
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
function mudarEscala(){
    reporAnos();
    primeirovalor('2011','1ou2')
    tamanhoOutros();
    fonteTitulo('N');
}
$('#absoluto').click(function(){
    mudarEscala();  
});
$('#percentagem').click(function(){
    mudarEscala() 
    fonteTitulo('F');
});

$('#taxaVariacao').click(function(){
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
    if ($('#percentagem').hasClass('active4')){
        return false
    }
    else{
        $('#absoluto').attr('class',"butao active4");
        $('#percentagem').attr('class',"butao");
        mudarEscala();
    }

}

let variaveisMapaFreguesias = function(){
    if($('#percentagem').hasClass('active5')){
        return false;
    }
    else{
        $('#absoluto').attr('class',"butao active5")
        $('#percentagem').attr('class',"butao")
        $('#taxaVariacao').attr('class',"butao")
        mudarEscala();
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
    $('#tituloMapa').html('Número de edifícios, por tipo, entre 2011 e 2021, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/TipoEdificioProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2011').html("2011")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Tipo == "Outro tipo"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom">'+value.Tipo+'</td>';
                    dados += '<td class="borderbottom">'+value.Especifico+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2011.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2021.toLocaleString("fr")+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Tipo+'</td>';
                    dados += '<td>'+value.Especifico+'</td>';
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
    $('#tituloMapa').html('Proporção do número de edifícios, por tipo, entre 2011 e 2021, %.')
        $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/TipoEdificioProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2011').html("2011")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Tipo == "Outro tipo"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Tipo+'</td>';
                    dados += '<td class="borderbottom">'+value.Especifico+'</td>';
                    dados += '<td class="borderbottom">'+value.Per11+'</td>';
                    dados += '<td class="borderbottom">'+value.Per21+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Tipo+'</td>';
                    dados += '<td>'+value.Especifico+'</td>';
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
    $('#tituloMapa').html('Variação do número de edifícios, por tipo, entre 2011 e 2021, %.')
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/TipoEdificioProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2011').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Tipo == "Outro tipo"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Tipo+'</td>';
                    dados += '<td class="borderbottom">'+value.Especifico+'</td>';
                    dados += '<td class="borderbottom">'+ ''+'</td>';
                    dados += '<td class="borderbottom">'+value.VAR2111+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Tipo+'</td>';
                    dados += '<td>'+value.Especifico+'</td>';
                    dados += '<td>'+ ''+'</td>';
                    dados += '<td>'+value.VAR2111+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});

let anosSelecionados = function() {
    let anos = document.getElementById("mySelect").value;

    if (anos == "2011"){
        i = 0 ;
    }
    if (anos == "2021"){
        i = 1 ;
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
