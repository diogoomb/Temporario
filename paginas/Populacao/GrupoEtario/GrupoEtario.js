// $('#mapDIV').css("height", "85%");
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'

$('#temporal').css("padding-top","0px")
var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Recenseamento da população e habitação.';
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
//////////////// ORIENTAÇÃO
var Orientacao = L.control({position: "topleft"});
Orientacao.onAdd = function(map) {
    var div = L.DomUtil.create("div", "north");
    div.innerHTML = '<img src="../../../imagens/norte.png" alt="Orientação" height="40px" width="23px">';
    return div;
}
Orientacao.addTo(map)
//////////////////
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
        fillOpacity: 0.13,
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
var contornoFreg2001 =L.geoJSON(dadosRelativosFreguesias01,{
    style:layerContorno,
});
var contornoConcelhos1991 =L.geoJSON(concelhosRelativos1991,{
    style:layerContorno,
});
contornoConcelhos1991.addTo(map);

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
    var titulo = 'Nº de residentes'
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
    var titulo = 'Nº de residentes'
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




///////////////////////////----------------------- DADOS ABSOLUTOS, CONCELHO --------------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\






////////////////////////////////////----------- POPULAÇÃO 0 - 14, 1991, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPop0_14Conc91 = 99999;
var maxPop0_14Conc91 = 0;
function estiloPop0_14Conc91(feature, latlng) {
    if(feature.properties.F0_14_91< minPop0_14Conc91 || feature.properties.F0_14_91 ===0){
        minPop0_14Conc91 = feature.properties.F0_14_91
    }
    if(feature.properties.F0_14_91> maxPop0_14Conc91){
        maxPop0_14Conc91 = feature.properties.F0_14_91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F0_14_91,0.13)
    });
}
function apagarPop0_14Conc91(e){
    var layer = e.target;
    Pop0_14Conc91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop0_14Conc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade entre 0 e 14 anos: ' + '<b>' +feature.properties.F0_14_91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop0_14Conc91,
    })
};

var Pop0_14Conc91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloPop0_14Conc91,
    onEachFeature: onEachFeaturePop0_14Conc91,
});

var slidePop0_14Conc91 = function(){
    var sliderPop0_14Conc91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop0_14Conc91, {
        start: [minPop0_14Conc91, maxPop0_14Conc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop0_14Conc91,
            'max': maxPop0_14Conc91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPop0_14Conc91);
    inputNumberMax.setAttribute("value",maxPop0_14Conc91);

    inputNumberMin.addEventListener('change', function(){
        sliderPop0_14Conc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop0_14Conc91.noUiSlider.set([null, this.value]);
    });

    sliderPop0_14Conc91.noUiSlider.on('update',function(e){
        Pop0_14Conc91.eachLayer(function(layer){
            if(layer.feature.properties.F0_14_91>=parseFloat(e[0])&& layer.feature.properties.F0_14_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop0_14Conc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderPop0_14Conc91.noUiSlider;
    $(slidersGeral).append(sliderPop0_14Conc91);
}

///////////////////////////-------------  FIM POPULAÇÃO 0 - 14, 1991, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\
Pop0_14Conc91.addTo(map);
slidePop0_14Conc91();
legenda(maxPop0_14Conc91, ((maxPop0_14Conc91-minPop0_14Conc91)/2).toFixed(0),minPop0_14Conc91,0.13);
////////////////////////////////////----------- POPULAÇÃO 15 - 24, 1991, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPop15_24Conc91 = 99999;
var maxPop15_24Conc91 = 0;
function estiloPop15_24Conc91(feature, latlng) {
    if(feature.properties.F15_24_91< minPop15_24Conc91 || feature.properties.F15_24_91 ===0){
        minPop15_24Conc91 = feature.properties.F15_24_91
    }
    if(feature.properties.F15_24_91> maxPop15_24Conc91){
        maxPop15_24Conc91 = feature.properties.F15_24_91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F15_24_91,0.13)
    });
}
function apagarPop15_24Conc91(e){
    var layer = e.target;
    Pop15_24Conc91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop15_24Conc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade entre 15 e 24 anos: ' + '<b>' +feature.properties.F15_24_91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop15_24Conc91,
    })
};

var Pop15_24Conc91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloPop15_24Conc91,
    onEachFeature: onEachFeaturePop15_24Conc91,
});

var slidePop15_24Conc91 = function(){
    var sliderPop15_24Conc91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop15_24Conc91, {
        start: [minPop15_24Conc91, maxPop15_24Conc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop15_24Conc91,
            'max': maxPop15_24Conc91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPop15_24Conc91);
    inputNumberMax.setAttribute("value",maxPop15_24Conc91);

    inputNumberMin.addEventListener('change', function(){
        sliderPop15_24Conc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop15_24Conc91.noUiSlider.set([null, this.value]);
    });

    sliderPop15_24Conc91.noUiSlider.on('update',function(e){
        Pop15_24Conc91.eachLayer(function(layer){
            if(layer.feature.properties.F15_24_91>=parseFloat(e[0])&& layer.feature.properties.F15_24_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop15_24Conc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderPop15_24Conc91.noUiSlider;
    $(slidersGeral).append(sliderPop15_24Conc91);
}

///////////////////////////-------------  FIM POPULAÇÃO 15 - 24, 1991, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- POPULAÇÃO 25 - 64, 1991, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPop25_64Conc91 = 99999;
var maxPop25_64Conc91 = 0;
function estiloPop25_64Conc91(feature, latlng) {
    if(feature.properties.F25_64_91< minPop25_64Conc91 || feature.properties.F25_64_91 ===0){
        minPop25_64Conc91 = feature.properties.F25_64_91
    }
    if(feature.properties.F25_64_91> maxPop25_64Conc91){
        maxPop25_64Conc91 = feature.properties.F25_64_91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F25_64_91,0.13)
    });
}
function apagarPop25_64Conc91(e){
    var layer = e.target;
    Pop25_64Conc91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop25_64Conc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade entre 25 e 64 anos: ' + '<b>' +feature.properties.F25_64_91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop25_64Conc91,
    })
};

var Pop25_64Conc91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloPop25_64Conc91,
    onEachFeature: onEachFeaturePop25_64Conc91,
});

var slidePop25_64Conc91 = function(){
    var sliderPop25_64Conc91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop25_64Conc91, {
        start: [minPop25_64Conc91, maxPop25_64Conc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop25_64Conc91,
            'max': maxPop25_64Conc91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPop25_64Conc91);
    inputNumberMax.setAttribute("value",maxPop25_64Conc91);

    inputNumberMin.addEventListener('change', function(){
        sliderPop25_64Conc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop25_64Conc91.noUiSlider.set([null, this.value]);
    });

    sliderPop25_64Conc91.noUiSlider.on('update',function(e){
        Pop25_64Conc91.eachLayer(function(layer){
            if(layer.feature.properties.F25_64_91>=parseFloat(e[0])&& layer.feature.properties.F25_64_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop25_64Conc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderPop25_64Conc91.noUiSlider;
    $(slidersGeral).append(sliderPop25_64Conc91);
}

///////////////////////////-------------  FIM POPULAÇÃO 25 - 64, 1991, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- POPULAÇÃO 65 + , 1991, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPopMais65Conc91 = 99999;
var maxPopMais65Conc91 = 0;
function estiloPopMais65Conc91(feature, latlng) {
    if(feature.properties.F65_91< minPopMais65Conc91 || feature.properties.F65_91 ===0){
        minPopMais65Conc91 = feature.properties.F65_91
    }
    if(feature.properties.F65_91> maxPopMais65Conc91){
        maxPopMais65Conc91 = feature.properties.F65_91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F65_91,0.13)
    });
}
function apagarPopMais65Conc91(e){
    var layer = e.target;
    PopMais65Conc91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePopMais65Conc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade superior a 65 anos: ' + '<b>' +feature.properties.F65_91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPopMais65Conc91,
    })
};

var PopMais65Conc91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloPopMais65Conc91,
    onEachFeature: onEachFeaturePopMais65Conc91,
});

var slidePopMais65Conc91 = function(){
    var sliderPopMais65Conc91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPopMais65Conc91, {
        start: [minPopMais65Conc91, maxPopMais65Conc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopMais65Conc91,
            'max': maxPopMais65Conc91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopMais65Conc91);
    inputNumberMax.setAttribute("value",maxPopMais65Conc91);

    inputNumberMin.addEventListener('change', function(){
        sliderPopMais65Conc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopMais65Conc91.noUiSlider.set([null, this.value]);
    });

    sliderPopMais65Conc91.noUiSlider.on('update',function(e){
        PopMais65Conc91.eachLayer(function(layer){
            if(layer.feature.properties.F65_91>=parseFloat(e[0])&& layer.feature.properties.F65_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopMais65Conc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderPopMais65Conc91.noUiSlider;
    $(slidersGeral).append(sliderPopMais65Conc91);
}

///////////////////////////-------------  FIM POPULAÇÃO 65 +, 1991, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- POPULAÇÃO 0 - 14, 2001, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPop0_14Conc01 = 99999;
var maxPop0_14Conc01 = 0;
function estiloPop0_14Conc01(feature, latlng) {
    if(feature.properties.F0_14_01< minPop0_14Conc01 || feature.properties.F0_14_01 ===0){
        minPop0_14Conc01 = feature.properties.F0_14_01
    }
    if(feature.properties.F0_14_01> maxPop0_14Conc01){
        maxPop0_14Conc01 = feature.properties.F0_14_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F0_14_01,0.13)
    });
}
function apagarPop0_14Conc01(e){
    var layer = e.target;
    Pop0_14Conc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop0_14Conc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade entre 0 e 14 anos: ' + '<b>' +feature.properties.F0_14_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop0_14Conc01,
    })
};

var Pop0_14Conc01= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloPop0_14Conc01,
    onEachFeature: onEachFeaturePop0_14Conc01,
});

var slidePop0_14Conc01 = function(){
    var sliderPop0_14Conc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop0_14Conc01, {
        start: [minPop0_14Conc01, maxPop0_14Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop0_14Conc01,
            'max': maxPop0_14Conc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPop0_14Conc01);
    inputNumberMax.setAttribute("value",maxPop0_14Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPop0_14Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop0_14Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPop0_14Conc01.noUiSlider.on('update',function(e){
        Pop0_14Conc01.eachLayer(function(layer){
            if(layer.feature.properties.F0_14_01>=parseFloat(e[0])&& layer.feature.properties.F0_14_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop0_14Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderPop0_14Conc01.noUiSlider;
    $(slidersGeral).append(sliderPop0_14Conc01);
}

///////////////////////////-------------  FIM POPULAÇÃO 0 - 14, 2001, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- POPULAÇÃO 15 - 24, 2001, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPop15_24Conc01 = 99999;
var maxPop15_24Conc01 = 0;
function estiloPop15_24Conc01(feature, latlng) {
    if(feature.properties.F15_24_01< minPop15_24Conc01 || feature.properties.F15_24_01 ===0){
        minPop15_24Conc01 = feature.properties.F15_24_01
    }
    if(feature.properties.F15_24_01> maxPop15_24Conc01){
        maxPop15_24Conc01 = feature.properties.F15_24_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F15_24_01,0.13)
    });
}
function apagarPop15_24Conc01(e){
    var layer = e.target;
    Pop15_24Conc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop15_24Conc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade entre 15 e 24 anos: ' + '<b>' +feature.properties.F15_24_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop15_24Conc01,
    })
};

var Pop15_24Conc01= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloPop15_24Conc01,
    onEachFeature: onEachFeaturePop15_24Conc01,
});

var slidePop15_24Conc01 = function(){
    var sliderPop15_24Conc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop15_24Conc01, {
        start: [minPop15_24Conc01, maxPop15_24Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop15_24Conc01,
            'max': maxPop15_24Conc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPop15_24Conc01);
    inputNumberMax.setAttribute("value",maxPop15_24Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPop15_24Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop15_24Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPop15_24Conc01.noUiSlider.on('update',function(e){
        Pop15_24Conc01.eachLayer(function(layer){
            if(layer.feature.properties.F15_24_01>=parseFloat(e[0])&& layer.feature.properties.F15_24_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop15_24Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderPop15_24Conc01.noUiSlider;
    $(slidersGeral).append(sliderPop15_24Conc01);
}

///////////////////////////-------------  FIM POPULAÇÃO 15 - 24, 2001, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- POPULAÇÃO 25 - 64, 2001, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPop25_64Conc01 = 99999;
var maxPop25_64Conc01 = 0;
function estiloPop25_64Conc01(feature, latlng) {
    if(feature.properties.F25_64_01< minPop25_64Conc01 || feature.properties.F25_64_01 ===0){
        minPop25_64Conc01 = feature.properties.F25_64_01
    }
    if(feature.properties.F25_64_01> maxPop25_64Conc01){
        maxPop25_64Conc01 = feature.properties.F25_64_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F25_64_01,0.13)
    });
}
function apagarPop25_64Conc01(e){
    var layer = e.target;
    Pop25_64Conc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop25_64Conc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade entre 25 e 64 anos: ' + '<b>' +feature.properties.F25_64_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop25_64Conc01,
    })
};

var Pop25_64Conc01= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloPop25_64Conc01,
    onEachFeature: onEachFeaturePop25_64Conc01,
});

var slidePop25_64Conc01 = function(){
    var sliderPop25_64Conc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop25_64Conc01, {
        start: [minPop25_64Conc01, maxPop25_64Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop25_64Conc01,
            'max': maxPop25_64Conc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPop25_64Conc01);
    inputNumberMax.setAttribute("value",maxPop25_64Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPop25_64Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop25_64Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPop25_64Conc01.noUiSlider.on('update',function(e){
        Pop25_64Conc01.eachLayer(function(layer){
            if(layer.feature.properties.F25_64_01>=parseFloat(e[0])&& layer.feature.properties.F25_64_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop25_64Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderPop25_64Conc01.noUiSlider;
    $(slidersGeral).append(sliderPop25_64Conc01);
}

///////////////////////////-------------  FIM POPULAÇÃO 25 - 64, 2001, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- POPULAÇÃO 65 + , 2001, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPopMais65Conc01 = 99999;
var maxPopMais65Conc01 = 0;
function estiloPopMais65Conc01(feature, latlng) {
    if(feature.properties.F65_01< minPopMais65Conc01 || feature.properties.F65_01 ===0){
        minPopMais65Conc01 = feature.properties.F65_01
    }
    if(feature.properties.F65_01> maxPopMais65Conc01){
        maxPopMais65Conc01 = feature.properties.F65_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F65_01,0.13)
    });
}
function apagarPopMais65Conc01(e){
    var layer = e.target;
    PopMais65Conc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePopMais65Conc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade superior a 65 anos: ' + '<b>' +feature.properties.F65_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPopMais65Conc01,
    })
};

var PopMais65Conc01= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloPopMais65Conc01,
    onEachFeature: onEachFeaturePopMais65Conc01,
});

var slidePopMais65Conc01 = function(){
    var sliderPopMais65Conc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPopMais65Conc01, {
        start: [minPopMais65Conc01, maxPopMais65Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopMais65Conc01,
            'max': maxPopMais65Conc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopMais65Conc01);
    inputNumberMax.setAttribute("value",maxPopMais65Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPopMais65Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopMais65Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPopMais65Conc01.noUiSlider.on('update',function(e){
        PopMais65Conc01.eachLayer(function(layer){
            if(layer.feature.properties.F65_01>=parseFloat(e[0])&& layer.feature.properties.F65_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopMais65Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderPopMais65Conc01.noUiSlider;
    $(slidersGeral).append(sliderPopMais65Conc01);
}

///////////////////////////-------------  FIM POPULAÇÃO 65 +, 2001, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- POPULAÇÃO 0 - 14, 2111, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPop0_14Conc11 = 99999;
var maxPop0_14Conc11 = 0;
function estiloPop0_14Conc11(feature, latlng) {
    if(feature.properties.F0_14_11< minPop0_14Conc11 || feature.properties.F0_14_11 ===0){
        minPop0_14Conc11 = feature.properties.F0_14_11
    }
    if(feature.properties.F0_14_11> maxPop0_14Conc11){
        maxPop0_14Conc11 = feature.properties.F0_14_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F0_14_11,0.13)
    });
}
function apagarPop0_14Conc11(e){
    var layer = e.target;
    Pop0_14Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop0_14Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade entre 0 e 14 anos: ' + '<b>' +feature.properties.F0_14_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop0_14Conc11,
    })
};

var Pop0_14Conc11= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloPop0_14Conc11,
    onEachFeature: onEachFeaturePop0_14Conc11,
});

var slidePop0_14Conc11 = function(){
    var sliderPop0_14Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop0_14Conc11, {
        start: [minPop0_14Conc11, maxPop0_14Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop0_14Conc11,
            'max': maxPop0_14Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPop0_14Conc11);
    inputNumberMax.setAttribute("value",maxPop0_14Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPop0_14Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop0_14Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPop0_14Conc11.noUiSlider.on('update',function(e){
        Pop0_14Conc11.eachLayer(function(layer){
            if(layer.feature.properties.F0_14_11>=parseFloat(e[0])&& layer.feature.properties.F0_14_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop0_14Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderPop0_14Conc11.noUiSlider;
    $(slidersGeral).append(sliderPop0_14Conc11);
}

///////////////////////////-------------  FIM POPULAÇÃO 0 - 14, 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- POPULAÇÃO 15 - 24, 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPop15_24Conc11 = 99999;
var maxPop15_24Conc11 = 0;
function estiloPop15_24Conc11(feature, latlng) {
    if(feature.properties.F15_24_11< minPop15_24Conc11 || feature.properties.F15_24_11 ===0){
        minPop15_24Conc11 = feature.properties.F15_24_11
    }
    if(feature.properties.F15_24_11> maxPop15_24Conc11){
        maxPop15_24Conc11 = feature.properties.F15_24_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F15_24_11,0.13)
    });
}
function apagarPop15_24Conc11(e){
    var layer = e.target;
    Pop15_24Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop15_24Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade entre 15 e 24 anos: ' + '<b>' +feature.properties.F15_24_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop15_24Conc11,
    })
};

var Pop15_24Conc11= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloPop15_24Conc11,
    onEachFeature: onEachFeaturePop15_24Conc11,
});

var slidePop15_24Conc11 = function(){
    var sliderPop15_24Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop15_24Conc11, {
        start: [minPop15_24Conc11, maxPop15_24Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop15_24Conc11,
            'max': maxPop15_24Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPop15_24Conc11);
    inputNumberMax.setAttribute("value",maxPop15_24Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPop15_24Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop15_24Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPop15_24Conc11.noUiSlider.on('update',function(e){
        Pop15_24Conc11.eachLayer(function(layer){
            if(layer.feature.properties.F15_24_11>=parseFloat(e[0])&& layer.feature.properties.F15_24_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop15_24Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderPop15_24Conc11.noUiSlider;
    $(slidersGeral).append(sliderPop15_24Conc11);
}

///////////////////////////-------------  FIM POPULAÇÃO 15 - 24, 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- POPULAÇÃO 25 - 64, 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPop25_64Conc11 = 99999;
var maxPop25_64Conc11 = 0;
function estiloPop25_64Conc11(feature, latlng) {
    if(feature.properties.F25_64_11< minPop25_64Conc11 || feature.properties.F25_64_11 ===0){
        minPop25_64Conc11 = feature.properties.F25_64_11
    }
    if(feature.properties.F25_64_11> maxPop25_64Conc11){
        maxPop25_64Conc11 = feature.properties.F25_64_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F25_64_11,0.13)
    });
}
function apagarPop25_64Conc11(e){
    var layer = e.target;
    Pop25_64Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop25_64Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade entre 25 e 64 anos: ' + '<b>' +feature.properties.F25_64_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop25_64Conc11,
    })
};

var Pop25_64Conc11= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloPop25_64Conc11,
    onEachFeature: onEachFeaturePop25_64Conc11,
});

var slidePop25_64Conc11 = function(){
    var sliderPop25_64Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop25_64Conc11, {
        start: [minPop25_64Conc11, maxPop25_64Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop25_64Conc11,
            'max': maxPop25_64Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPop25_64Conc11);
    inputNumberMax.setAttribute("value",maxPop25_64Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPop25_64Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop25_64Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPop25_64Conc11.noUiSlider.on('update',function(e){
        Pop25_64Conc11.eachLayer(function(layer){
            if(layer.feature.properties.F25_64_11>=parseFloat(e[0])&& layer.feature.properties.F25_64_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop25_64Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderPop25_64Conc11.noUiSlider;
    $(slidersGeral).append(sliderPop25_64Conc11);
}

///////////////////////////-------------  FIM POPULAÇÃO 25 - 64, 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- POPULAÇÃO 65 + , 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPopMais65Conc11 = 99999;
var maxPopMais65Conc11 = 0;
function estiloPopMais65Conc11(feature, latlng) {
    if(feature.properties.F65_11< minPopMais65Conc11 || feature.properties.F65_11 ===0){
        minPopMais65Conc11 = feature.properties.F65_11
    }
    if(feature.properties.F65_11> maxPopMais65Conc11){
        maxPopMais65Conc11 = feature.properties.F65_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F65_11,0.13)
    });
}
function apagarPopMais65Conc11(e){
    var layer = e.target;
    PopMais65Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePopMais65Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade superior a 65 anos: ' + '<b>' +feature.properties.F65_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPopMais65Conc11,
    })
};

var PopMais65Conc11= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloPopMais65Conc11,
    onEachFeature: onEachFeaturePopMais65Conc11,
});

var slidePopMais65Conc11 = function(){
    var sliderPopMais65Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPopMais65Conc11, {
        start: [minPopMais65Conc11, maxPopMais65Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopMais65Conc11,
            'max': maxPopMais65Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopMais65Conc11);
    inputNumberMax.setAttribute("value",maxPopMais65Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPopMais65Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopMais65Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPopMais65Conc11.noUiSlider.on('update',function(e){
        PopMais65Conc11.eachLayer(function(layer){
            if(layer.feature.properties.F65_11>=parseFloat(e[0])&& layer.feature.properties.F65_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopMais65Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderPopMais65Conc11.noUiSlider;
    $(slidersGeral).append(sliderPopMais65Conc11);
}


///////////////////////////-------------  FIM POPULAÇÃO 65 +, 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- POPULAÇÃO 0 - 14, 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPop0_14Conc21 = 99999;
var maxPop0_14Conc21 = 0;
function estiloPop0_14Conc21(feature, latlng) {
    if(feature.properties.F0_14_21< minPop0_14Conc21 || feature.properties.F0_14_21 ===0){
        minPop0_14Conc21 = feature.properties.F0_14_21
    }
    if(feature.properties.F0_14_21> maxPop0_14Conc21){
        maxPop0_14Conc21 = feature.properties.F0_14_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F0_14_21,0.13)
    });
}
function apagarPop0_14Conc21(e){
    var layer = e.target;
    Pop0_14Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop0_14Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade entre 0 e 14 anos: ' + '<b>' +feature.properties.F0_14_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop0_14Conc21,
    })
};

var Pop0_14Conc21= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloPop0_14Conc21,
    onEachFeature: onEachFeaturePop0_14Conc21,
});

var slidePop0_14Conc21 = function(){
    var sliderPop0_14Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 73){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop0_14Conc21, {
        start: [minPop0_14Conc21, maxPop0_14Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop0_14Conc21,
            'max': maxPop0_14Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPop0_14Conc21);
    inputNumberMax.setAttribute("value",maxPop0_14Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPop0_14Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop0_14Conc21.noUiSlider.set([null, this.value]);
    });

    sliderPop0_14Conc21.noUiSlider.on('update',function(e){
        Pop0_14Conc21.eachLayer(function(layer){
            if(layer.feature.properties.F0_14_21>=parseFloat(e[0])&& layer.feature.properties.F0_14_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop0_14Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 73;
    sliderAtivo = sliderPop0_14Conc21.noUiSlider;
    $(slidersGeral).append(sliderPop0_14Conc21);
}

///////////////////////////-------------  FIM POPULAÇÃO 0 - 14, 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- POPULAÇÃO 15 - 24, 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPop15_24Conc21 = 99999;
var maxPop15_24Conc21 = 0;
function estiloPop15_24Conc21(feature, latlng) {
    if(feature.properties.F15_24_21< minPop15_24Conc21 || feature.properties.F15_24_21 ===0){
        minPop15_24Conc21 = feature.properties.F15_24_21
    }
    if(feature.properties.F15_24_21> maxPop15_24Conc21){
        maxPop15_24Conc21 = feature.properties.F15_24_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F15_24_21,0.13)
    });
}
function apagarPop15_24Conc21(e){
    var layer = e.target;
    Pop15_24Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop15_24Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade entre 15 e 24 anos: ' + '<b>' +feature.properties.F15_24_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop15_24Conc21,
    })
};

var Pop15_24Conc21= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloPop15_24Conc21,
    onEachFeature: onEachFeaturePop15_24Conc21,
});

var slidePop15_24Conc21 = function(){
    var sliderPop15_24Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 74){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop15_24Conc21, {
        start: [minPop15_24Conc21, maxPop15_24Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop15_24Conc21,
            'max': maxPop15_24Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPop15_24Conc21);
    inputNumberMax.setAttribute("value",maxPop15_24Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPop15_24Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop15_24Conc21.noUiSlider.set([null, this.value]);
    });

    sliderPop15_24Conc21.noUiSlider.on('update',function(e){
        Pop15_24Conc21.eachLayer(function(layer){
            if(layer.feature.properties.F15_24_21>=parseFloat(e[0])&& layer.feature.properties.F15_24_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop15_24Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 74;
    sliderAtivo = sliderPop15_24Conc21.noUiSlider;
    $(slidersGeral).append(sliderPop15_24Conc21);
}

///////////////////////////-------------  FIM POPULAÇÃO 15 - 24, 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- POPULAÇÃO 25 - 64, 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPop25_64Conc21 = 99999;
var maxPop25_64Conc21 = 0;
function estiloPop25_64Conc21(feature, latlng) {
    if(feature.properties.F25_64_21< minPop25_64Conc21 || feature.properties.F25_64_21 ===0){
        minPop25_64Conc21 = feature.properties.F25_64_21
    }
    if(feature.properties.F25_64_21> maxPop25_64Conc21){
        maxPop25_64Conc21 = feature.properties.F25_64_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F25_64_21,0.13)
    });
}
function apagarPop25_64Conc21(e){
    var layer = e.target;
    Pop25_64Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop25_64Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade entre 25 e 64 anos: ' + '<b>' +feature.properties.F25_64_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop25_64Conc21,
    })
};

var Pop25_64Conc21= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloPop25_64Conc21,
    onEachFeature: onEachFeaturePop25_64Conc21,
});

var slidePop25_64Conc21 = function(){
    var sliderPop25_64Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 75){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop25_64Conc21, {
        start: [minPop25_64Conc21, maxPop25_64Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop25_64Conc21,
            'max': maxPop25_64Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPop25_64Conc21);
    inputNumberMax.setAttribute("value",maxPop25_64Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPop25_64Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop25_64Conc21.noUiSlider.set([null, this.value]);
    });

    sliderPop25_64Conc21.noUiSlider.on('update',function(e){
        Pop25_64Conc21.eachLayer(function(layer){
            if(layer.feature.properties.F25_64_21>=parseFloat(e[0])&& layer.feature.properties.F25_64_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop25_64Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 75;
    sliderAtivo = sliderPop25_64Conc21.noUiSlider;
    $(slidersGeral).append(sliderPop25_64Conc21);
}

///////////////////////////-------------  FIM POPULAÇÃO 25 - 64, 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- POPULAÇÃO 65 + , 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minPopMais65Conc21 = 99999;
var maxPopMais65Conc21 = 0;
function estiloPopMais65Conc21(feature, latlng) {
    if(feature.properties.F65_21< minPopMais65Conc21 || feature.properties.F65_21 ===0){
        minPopMais65Conc21 = feature.properties.F65_21
    }
    if(feature.properties.F65_21> maxPopMais65Conc21){
        maxPopMais65Conc21 = feature.properties.F65_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F65_21,0.13)
    });
}
function apagarPopMais65Conc21(e){
    var layer = e.target;
    PopMais65Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePopMais65Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes com idade superior a 65 anos: ' + '<b>' +feature.properties.F65_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPopMais65Conc21,
    })
};

var PopMais65Conc21= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloPopMais65Conc21,
    onEachFeature: onEachFeaturePopMais65Conc21,
});

var slidePopMais65Conc21 = function(){
    var sliderPopMais65Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 76){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPopMais65Conc21, {
        start: [minPopMais65Conc21, maxPopMais65Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopMais65Conc21,
            'max': maxPopMais65Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopMais65Conc21);
    inputNumberMax.setAttribute("value",maxPopMais65Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPopMais65Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopMais65Conc21.noUiSlider.set([null, this.value]);
    });

    sliderPopMais65Conc21.noUiSlider.on('update',function(e){
        PopMais65Conc21.eachLayer(function(layer){
            if(layer.feature.properties.F65_21>=parseFloat(e[0])&& layer.feature.properties.F65_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopMais65Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 76;
    sliderAtivo = sliderPopMais65Conc21.noUiSlider;
    $(slidersGeral).append(sliderPopMais65Conc21);
}
/////////////////////----------------------- FIM MAIS 65 EM 2021

/////////////////////////////////////////--------------------- FIM DADOS ABSOLUTOS CONCELHOS

/////////////////////////////////-------------------------- DADOS RELATIVOS CONCELHOS 

/////////////////////////------- Percentagem 0 - 15  CONCELHO em 1991-----////

var minPer0_14Conc91 = 100;
var maxPer0_14Conc91 = 0;

function CorPer0_14Conc(d) {
    return d >= 24.46 ? '#8c0303' :
        d >= 22.16  ? '#de1f35' :
        d >= 18.32 ? '#ff5e6e' :
        d >= 14.47   ? '#f5b3be' :
        d >= 10.63   ? '#F2C572' :
                ''  ;
}
var legendaPer0_14Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 24.46' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 22.16 - 24.46' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 18.32 - 22.16' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 14.47 - 18.32' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 10.63 - 14.47' + '<br>'

    $(legendaA).append(symbolsContainer); 
}
function EstiloPer0_14Conc91(feature) {
    if(feature.properties.Per14_91 <= minPer0_14Conc91 || minPer0_14Conc91 === 0){
        minPer0_14Conc91 = feature.properties.Per14_91
    }
    if(feature.properties.Per14_91 >= maxPer0_14Conc91 ){
        maxPer0_14Conc91 = feature.properties.Per14_91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer0_14Conc(feature.properties.Per14_91)
    };
}
function apagarPer0_14Conc91(e) {
    Per0_14Conc91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer0_14Conc91(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelhos + '</b>' + '<br>' + 'Proporção de residentes com idade entre 0 e 14 anos: ' + '<b>' + feature.properties.Per14_91  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer0_14Conc91,
    });
}
var Per0_14Conc91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloPer0_14Conc91,
    onEachFeature: onEachFeaturePer0_14Conc91
});
let slidePer0_14Conc91 = function(){
    var sliderPer0_14Conc91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer0_14Conc91, {
        start: [minPer0_14Conc91, maxPer0_14Conc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer0_14Conc91,
            'max': maxPer0_14Conc91
        },
        });
    inputNumberMin.setAttribute("value",minPer0_14Conc91);
    inputNumberMax.setAttribute("value",maxPer0_14Conc91);

    inputNumberMin.addEventListener('change', function(){
        sliderPer0_14Conc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer0_14Conc91.noUiSlider.set([null, this.value]);
    });

    sliderPer0_14Conc91.noUiSlider.on('update',function(e){
        Per0_14Conc91.eachLayer(function(layer){
            if(layer.feature.properties.Per14_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per14_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer0_14Conc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderPer0_14Conc91.noUiSlider;
    $(slidersGeral).append(sliderPer0_14Conc91);
} 

/////////////////////////////// Fim Percentagem 0 15 anos CONCELHO em 1991 -------------- \\\\\\

/////////////////////////------- Percentagem 15 - 25  CONCELHO em 1991-----////

var minPer15_24Conc91 = 100;
var maxPer15_24Conc91 = 0;

function CorPer15_24Conc(d) {
    return d >= 20.12 ? '#8c0303' :
        d >= 18.32  ? '#de1f35' :
        d >= 15.31 ? '#ff5e6e' :
        d >= 12.31   ? '#f5b3be' :
        d >= 9.3   ? '#F2C572' :
                ''  ;
}
var legendaPer15_24Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 20.12' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 18.32 - 20.12' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 15.31 - 18.32' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 12.31 - 15.31' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 9.3 - 12.31' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPer15_24Conc91(feature) {
    if(feature.properties.Per24_91 <= minPer15_24Conc91 || minPer15_24Conc91 === 0){
        minPer15_24Conc91 = feature.properties.Per24_91
    }
    if(feature.properties.Per24_91 >= maxPer15_24Conc91 ){
        maxPer15_24Conc91 = feature.properties.Per24_91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer15_24Conc(feature.properties.Per24_91)
    };
}
function apagarPer15_24Conc91(e) {
    Per15_24Conc91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer15_24Conc91(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelhos + '</b>' + '<br>' + 'Proporção de residentes com idade entre 15 e 24 anos: ' + '<b>' + feature.properties.Per24_91  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer15_24Conc91,
    });
}
var Per15_24Conc91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloPer15_24Conc91,
    onEachFeature: onEachFeaturePer15_24Conc91
});
let slidePer15_24Conc91 = function(){
    var sliderPer15_24Conc91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer15_24Conc91, {
        start: [minPer15_24Conc91, maxPer15_24Conc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer15_24Conc91,
            'max': maxPer15_24Conc91
        },
        });
    inputNumberMin.setAttribute("value",minPer15_24Conc91);
    inputNumberMax.setAttribute("value",maxPer15_24Conc91);

    inputNumberMin.addEventListener('change', function(){
        sliderPer15_24Conc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer15_24Conc91.noUiSlider.set([null, this.value]);
    });

    sliderPer15_24Conc91.noUiSlider.on('update',function(e){
        Per15_24Conc91.eachLayer(function(layer){
            if(layer.feature.properties.Per24_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per24_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer15_24Conc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderPer15_24Conc91.noUiSlider;
    $(slidersGeral).append(sliderPer15_24Conc91);
} 

/////////////////////////////// Fim Percentagem 15 24 anos CONCELHO em 1991 -------------- \\\\\\


/////////////////////////------- Percentagem 25 - 64  CONCELHO em 1991-----////

var minPer25_64Conc91 = 100;
var maxPer25_64Conc91 = 0;

function CorPer25_64Conc(d) {
    return d >= 57.90 ? '#8c0303' :
        d >= 55.42  ? '#de1f35' :
        d >= 51.28 ? '#ff5e6e' :
        d >= 47.14   ? '#f5b3be' :
        d >= 43   ? '#F2C572' :
                ''  ;
}
var legendaPer25_64Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 57.90' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 55.42 - 57.90' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 51.28 - 55.42' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 47.14 - 51.28' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 43 - 47.14' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPer25_64Conc91(feature) {
    if(feature.properties.Per64_91 <= minPer25_64Conc91 || minPer25_64Conc91 === 0){
        minPer25_64Conc91 = feature.properties.Per64_91
    }
    if(feature.properties.Per64_91 >= maxPer25_64Conc91 ){
        maxPer25_64Conc91 = feature.properties.Per64_91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer25_64Conc(feature.properties.Per64_91)
    };
}
function apagarPer25_64Conc91(e) {
    Per25_64Conc91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer25_64Conc91(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelhos + '</b>' + '<br>' + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' + feature.properties.Per64_91  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer25_64Conc91,
    });
}
var Per25_64Conc91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloPer25_64Conc91,
    onEachFeature: onEachFeaturePer25_64Conc91
});
let slidePer25_64Conc91 = function(){
    var sliderPer25_64Conc91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer25_64Conc91, {
        start: [minPer25_64Conc91, maxPer25_64Conc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer25_64Conc91,
            'max': maxPer25_64Conc91
        },
        });
    inputNumberMin.setAttribute("value",minPer25_64Conc91);
    inputNumberMax.setAttribute("value",maxPer25_64Conc91);

    inputNumberMin.addEventListener('change', function(){
        sliderPer25_64Conc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer25_64Conc91.noUiSlider.set([null, this.value]);
    });

    sliderPer25_64Conc91.noUiSlider.on('update',function(e){
        Per25_64Conc91.eachLayer(function(layer){
            if(layer.feature.properties.Per64_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per64_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer25_64Conc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderPer25_64Conc91.noUiSlider;
    $(slidersGeral).append(sliderPer25_64Conc91);
} 

/////////////////////////////// Fim Percentagem 25 64 anos CONCELHO em 1991 -------------- \\\\\\

/////////////////////////------- Percentagem MAIS 65 ANOS  CONCELHO em 1991-----////

var minPerMais65Conc91 = 100;
var maxPerMais65Conc91 = 0;

function CorPerMais65_Conc(d) {
    return d >= 26.13 ? '#8c0303' :
        d >= 22.94  ? '#de1f35' :
        d >= 17.62 ? '#ff5e6e' :
        d >= 12.3   ? '#f5b3be' :
        d >= 6.98   ? '#F2C572' :
                ''  ;
}
var legendaPerMais65_Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 26.13' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 22.94 - 26.13' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 17.62 - 22.94' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 12.3 - 17.62' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 6.98 - 12.3' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerMais65Conc91(feature) {
    if(feature.properties.Per65_91 <= minPerMais65Conc91 || minPerMais65Conc91 === 0){
        minPerMais65Conc91 = feature.properties.Per65_91
    }
    if(feature.properties.Per65_91 >= maxPerMais65Conc91 ){
        maxPerMais65Conc91 = feature.properties.Per65_91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerMais65_Conc(feature.properties.Per65_91)
    };
}
function apagarPerMais65Conc91(e) {
    PerMais65Conc91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerMais65Conc91(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelhos + '</b>' + '<br>' + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' + feature.properties.Per65_91  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerMais65Conc91,
    });
}
var PerMais65Conc91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloPerMais65Conc91,
    onEachFeature: onEachFeaturePerMais65Conc91
});
let slidePerMais65Conc91 = function(){
    var sliderPerMais65Conc91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerMais65Conc91, {
        start: [minPerMais65Conc91, maxPerMais65Conc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerMais65Conc91,
            'max': maxPerMais65Conc91
        },
        });
    inputNumberMin.setAttribute("value",minPerMais65Conc91);
    inputNumberMax.setAttribute("value",maxPerMais65Conc91);

    inputNumberMin.addEventListener('change', function(){
        sliderPerMais65Conc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerMais65Conc91.noUiSlider.set([null, this.value]);
    });

    sliderPerMais65Conc91.noUiSlider.on('update',function(e){
        PerMais65Conc91.eachLayer(function(layer){
            if(layer.feature.properties.Per65_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per65_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerMais65Conc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderPerMais65Conc91.noUiSlider;
    $(slidersGeral).append(sliderPerMais65Conc91);
} 

/////////////////////////////// Fim Percentagem SUPERIOR 65 anos CONCELHO em 1991 -------------- \\\\\\


/////////////////////////------- Percentagem 0 - 15  CONCELHO em 2001-----////

var minPer0_14Conc01 = 100;
var maxPer0_14Conc01 = 0;

function EstiloPer0_14Conc01(feature) {
    if(feature.properties.Per14_01 <= minPer0_14Conc01 || minPer0_14Conc01 === 0){
        minPer0_14Conc01 = feature.properties.Per14_01
    }
    if(feature.properties.Per14_01 >= maxPer0_14Conc01 ){
        maxPer0_14Conc01 = feature.properties.Per14_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer0_14Conc(feature.properties.Per14_01)
    };
}
function apagarPer0_14Conc01(e) {
    Per0_14Conc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer0_14Conc01(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de residentes com idade entre 0 e 14 anos: ' + '<b>' + feature.properties.Per14_01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer0_14Conc01,
    });
}
var Per0_14Conc01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPer0_14Conc01,
    onEachFeature: onEachFeaturePer0_14Conc01
});
let slidePer0_14Conc01 = function(){
    var sliderPer0_14Conc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer0_14Conc01, {
        start: [minPer0_14Conc01, maxPer0_14Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer0_14Conc01,
            'max': maxPer0_14Conc01
        },
        });
    inputNumberMin.setAttribute("value",minPer0_14Conc01);
    inputNumberMax.setAttribute("value",maxPer0_14Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPer0_14Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer0_14Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPer0_14Conc01.noUiSlider.on('update',function(e){
        Per0_14Conc01.eachLayer(function(layer){
            if(layer.feature.properties.Per14_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per14_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer0_14Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderPer0_14Conc01.noUiSlider;
    $(slidersGeral).append(sliderPer0_14Conc01);
} 

/////////////////////////////// Fim Percentagem 0 15 anos CONCELHO em 2001 -------------- \\\\\\

/////////////////////////------- Percentagem 15 - 25  CONCELHO em 2001-----////

var minPer15_24Conc01 = 100;
var maxPer15_24Conc01 = 0;

function EstiloPer15_24Conc01(feature) {
    if(feature.properties.Per24_01 <= minPer15_24Conc01 || minPer15_24Conc01 === 0){
        minPer15_24Conc01 = feature.properties.Per24_01
    }
    if(feature.properties.Per24_01 >= maxPer15_24Conc01 ){
        maxPer15_24Conc01 = feature.properties.Per24_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer15_24Conc(feature.properties.Per24_01)
    };
}
function apagarPer15_24Conc01(e) {
    Per15_24Conc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer15_24Conc01(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de residentes com idade entre 15 e 24 anos: ' + '<b>' + feature.properties.Per24_01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer15_24Conc01,
    });
}
var Per15_24Conc01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPer15_24Conc01,
    onEachFeature: onEachFeaturePer15_24Conc01
});
let slidePer15_24Conc01 = function(){
    var sliderPer15_24Conc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer15_24Conc01, {
        start: [minPer15_24Conc01, maxPer15_24Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer15_24Conc01,
            'max': maxPer15_24Conc01
        },
        });
    inputNumberMin.setAttribute("value",minPer15_24Conc01);
    inputNumberMax.setAttribute("value",maxPer15_24Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPer15_24Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer15_24Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPer15_24Conc01.noUiSlider.on('update',function(e){
        Per15_24Conc01.eachLayer(function(layer){
            if(layer.feature.properties.Per24_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per24_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer15_24Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderPer15_24Conc01.noUiSlider;
    $(slidersGeral).append(sliderPer15_24Conc01);
} 

/////////////////////////////// Fim Percentagem 15 24 anos CONCELHO em 2001 -------------- \\\\\\


/////////////////////////------- Percentagem 25 - 64  CONCELHO em 2001-----////

var minPer25_64Conc01 = 100;
var maxPer25_64Conc01 = 0;

function EstiloPer25_64Conc01(feature) {
    if(feature.properties.Per64_01 <= minPer25_64Conc01 || minPer25_64Conc01 === 0){
        minPer25_64Conc01 = feature.properties.Per64_01
    }
    if(feature.properties.Per64_01 >= maxPer25_64Conc01 ){
        maxPer25_64Conc01 = feature.properties.Per64_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer25_64Conc(feature.properties.Per64_01)
    };
}
function apagarPer25_64Conc01(e) {
    Per25_64Conc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer25_64Conc01(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' + feature.properties.Per64_01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer25_64Conc01,
    });
}
var Per25_64Conc01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPer25_64Conc01,
    onEachFeature: onEachFeaturePer25_64Conc01
});
let slidePer25_64Conc01 = function(){
    var sliderPer25_64Conc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer25_64Conc01, {
        start: [minPer25_64Conc01, maxPer25_64Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer25_64Conc01,
            'max': maxPer25_64Conc01
        },
        });
    inputNumberMin.setAttribute("value",minPer25_64Conc01);
    inputNumberMax.setAttribute("value",maxPer25_64Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPer25_64Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer25_64Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPer25_64Conc01.noUiSlider.on('update',function(e){
        Per25_64Conc01.eachLayer(function(layer){
            if(layer.feature.properties.Per64_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per64_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer25_64Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderPer25_64Conc01.noUiSlider;
    $(slidersGeral).append(sliderPer25_64Conc01);
} 

/////////////////////////////// Fim Percentagem 25 64 anos CONCELHO em 2001 -------------- \\\\\\

/////////////////////////------- Percentagem MAIS 65 ANOS  CONCELHO em 2001-----////

var minPerMais65Conc01 = 100;
var maxPerMais65Conc01 = 0;

function EstiloPerMais65Conc01(feature) {
    if(feature.properties.Per65_01 <= minPerMais65Conc01 || minPerMais65Conc01 === 0){
        minPerMais65Conc01 = feature.properties.Per65_01
    }
    if(feature.properties.Per65_01 >= maxPerMais65Conc01 ){
        maxPerMais65Conc01 = feature.properties.Per65_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerMais65_Conc(feature.properties.Per65_01)
    };
}
function apagarPerMais65Conc01(e) {
    PerMais65Conc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerMais65Conc01(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' + feature.properties.Per65_01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerMais65Conc01,
    });
}
var PerMais65Conc01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerMais65Conc01,
    onEachFeature: onEachFeaturePerMais65Conc01
});
let slidePerMais65Conc01 = function(){
    var sliderPerMais65Conc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerMais65Conc01, {
        start: [minPerMais65Conc01, maxPerMais65Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerMais65Conc01,
            'max': maxPerMais65Conc01
        },
        });
    inputNumberMin.setAttribute("value",minPerMais65Conc01);
    inputNumberMax.setAttribute("value",maxPerMais65Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerMais65Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerMais65Conc01.noUiSlider.set([null, this.value]);
    });

    sliderPerMais65Conc01.noUiSlider.on('update',function(e){
        PerMais65Conc01.eachLayer(function(layer){
            if(layer.feature.properties.Per65_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per65_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerMais65Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderPerMais65Conc01.noUiSlider;
    $(slidersGeral).append(sliderPerMais65Conc01);
} 

/////////////////////////////// Fim Percentagem SUPERIOR 65 anos CONCELHO em 2001 -------------- \\\\\\

/////////////////////////------- Percentagem 0 - 15  CONCELHO em 2011-----////

var minPer0_14Conc11 = 100;
var maxPer0_14Conc11 = 0;


function EstiloPer0_14Conc11(feature) {
    if(feature.properties.Per14_11 <= minPer0_14Conc11 || minPer0_14Conc11 === 0){
        minPer0_14Conc11 = feature.properties.Per14_11
    }
    if(feature.properties.Per14_11 >= maxPer0_14Conc11 ){
        maxPer0_14Conc11 = feature.properties.Per14_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer0_14Conc(feature.properties.Per14_11)
    };
}
function apagarPer0_14Conc11(e) {
    Per0_14Conc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer0_14Conc11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de residentes com idade entre 0 e 14 anos: ' + '<b>' + feature.properties.Per14_11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer0_14Conc11,
    });
}
var Per0_14Conc11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPer0_14Conc11,
    onEachFeature: onEachFeaturePer0_14Conc11
});
let slidePer0_14Conc11 = function(){
    var sliderPer0_14Conc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer0_14Conc11, {
        start: [minPer0_14Conc11, maxPer0_14Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer0_14Conc11,
            'max': maxPer0_14Conc11
        },
        });
    inputNumberMin.setAttribute("value",minPer0_14Conc11);
    inputNumberMax.setAttribute("value",maxPer0_14Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPer0_14Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer0_14Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPer0_14Conc11.noUiSlider.on('update',function(e){
        Per0_14Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Per14_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per14_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer0_14Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderPer0_14Conc11.noUiSlider;
    $(slidersGeral).append(sliderPer0_14Conc11);
} 

/////////////////////////////// Fim Percentagem 0 15 anos CONCELHO em 2011 -------------- \\\\\\

/////////////////////////------- Percentagem 15 - 25  CONCELHO em 2011-----////

var minPer15_24Conc11 = 100;
var maxPer15_24Conc11 = 0;

function EstiloPer15_24Conc11(feature) {
    if(feature.properties.Per24_11 <= minPer15_24Conc11 || minPer15_24Conc11 === 0){
        minPer15_24Conc11 = feature.properties.Per24_11
    }
    if(feature.properties.Per24_11 >= maxPer15_24Conc11 ){
        maxPer15_24Conc11 = feature.properties.Per24_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer15_24Conc(feature.properties.Per24_11)
    };
}
function apagarPer15_24Conc11(e) {
    Per15_24Conc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer15_24Conc11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de residentes com idade entre 15 e 24 anos: ' + '<b>' + feature.properties.Per24_11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer15_24Conc11,
    });
}
var Per15_24Conc11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPer15_24Conc11,
    onEachFeature: onEachFeaturePer15_24Conc11
});
let slidePer15_24Conc11 = function(){
    var sliderPer15_24Conc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer15_24Conc11, {
        start: [minPer15_24Conc11, maxPer15_24Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer15_24Conc11,
            'max': maxPer15_24Conc11
        },
        });
    inputNumberMin.setAttribute("value",minPer15_24Conc11);
    inputNumberMax.setAttribute("value",maxPer15_24Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPer15_24Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer15_24Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPer15_24Conc11.noUiSlider.on('update',function(e){
        Per15_24Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Per24_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per24_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer15_24Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderPer15_24Conc11.noUiSlider;
    $(slidersGeral).append(sliderPer15_24Conc11);
} 

/////////////////////////////// Fim Percentagem 15 24 anos CONCELHO em 2011 -------------- \\\\\\


/////////////////////////------- Percentagem 25 - 64  CONCELHO em 2011-----////

var minPer25_64Conc11 = 100;
var maxPer25_64Conc11 = 0;


function EstiloPer25_64Conc11(feature) {
    if(feature.properties.Per64_11 <= minPer25_64Conc11 || minPer25_64Conc11 === 0){
        minPer25_64Conc11 = feature.properties.Per64_11
    }
    if(feature.properties.Per64_11 >= maxPer25_64Conc11 ){
        maxPer25_64Conc11 = feature.properties.Per64_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer25_64Conc(feature.properties.Per64_11)
    };
}
function apagarPer25_64Conc11(e) {
    Per25_64Conc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer25_64Conc11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' + feature.properties.Per64_11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer25_64Conc11,
    });
}
var Per25_64Conc11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPer25_64Conc11,
    onEachFeature: onEachFeaturePer25_64Conc11
});
let slidePer25_64Conc11 = function(){
    var sliderPer25_64Conc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer25_64Conc11, {
        start: [minPer25_64Conc11, maxPer25_64Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer25_64Conc11,
            'max': maxPer25_64Conc11
        },
        });
    inputNumberMin.setAttribute("value",minPer25_64Conc11);
    inputNumberMax.setAttribute("value",maxPer25_64Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPer25_64Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer25_64Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPer25_64Conc11.noUiSlider.on('update',function(e){
        Per25_64Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Per64_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per64_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer25_64Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderPer25_64Conc11.noUiSlider;
    $(slidersGeral).append(sliderPer25_64Conc11);
} 

/////////////////////////////// Fim Percentagem 25 64 anos CONCELHO em 2011 -------------- \\\\\\

/////////////////////////------- Percentagem MAIS 65 ANOS  CONCELHO em 2011-----////

var minPerMais65Conc11 = 100;
var maxPerMais65Conc11 = 0;

function EstiloPerMais65Conc11(feature) {
    if(feature.properties.Per65_11 <= minPerMais65Conc11 || minPerMais65Conc11 === 0){
        minPerMais65Conc11 = feature.properties.Per65_11
    }
    if(feature.properties.Per65_11 >= maxPerMais65Conc11 ){
        maxPerMais65Conc11 = feature.properties.Per65_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerMais65_Conc(feature.properties.Per65_11)
    };
}
function apagarPerMais65Conc11(e) {
    PerMais65Conc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerMais65Conc11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' + feature.properties.Per65_11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerMais65Conc11,
    });
}
var PerMais65Conc11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerMais65Conc11,
    onEachFeature: onEachFeaturePerMais65Conc11
});
let slidePerMais65Conc11 = function(){
    var sliderPerMais65Conc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerMais65Conc11, {
        start: [minPerMais65Conc11, maxPerMais65Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerMais65Conc11,
            'max': maxPerMais65Conc11
        },
        });
    inputNumberMin.setAttribute("value",minPerMais65Conc11);
    inputNumberMax.setAttribute("value",maxPerMais65Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerMais65Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerMais65Conc11.noUiSlider.set([null, this.value]);
    });

    sliderPerMais65Conc11.noUiSlider.on('update',function(e){
        PerMais65Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Per65_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per65_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerMais65Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderPerMais65Conc11.noUiSlider;
    $(slidersGeral).append(sliderPerMais65Conc11);
} 

/////////////////////////////// Fim Percentagem SUPERIOR 65 anos CONCELHO em 2011 -------------- \\\\\\
/////////////////////////------- Percentagem 0 - 15  CONCELHO em 2021-----////

var minPer0_14Conc21 = 100;
var maxPer0_14Conc21 = 0;


function EstiloPer0_14Conc21(feature) {
    if(feature.properties.Per14_21 <= minPer0_14Conc21 || minPer0_14Conc21 === 0){
        minPer0_14Conc21 = feature.properties.Per14_21
    }
    if(feature.properties.Per14_21 >= maxPer0_14Conc21 ){
        maxPer0_14Conc21 = feature.properties.Per14_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer0_14Conc(feature.properties.Per14_21)
    };
}
function apagarPer0_14Conc21(e) {
    Per0_14Conc21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer0_14Conc21(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de residentes com idade entre 0 e 14 anos: ' + '<b>' + feature.properties.Per14_21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer0_14Conc21,
    });
}
var Per0_14Conc21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPer0_14Conc21,
    onEachFeature: onEachFeaturePer0_14Conc21
});
let slidePer0_14Conc21 = function(){
    var sliderPer0_14Conc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer0_14Conc21, {
        start: [minPer0_14Conc21, maxPer0_14Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer0_14Conc21,
            'max': maxPer0_14Conc21
        },
        });
    inputNumberMin.setAttribute("value",minPer0_14Conc21);
    inputNumberMax.setAttribute("value",maxPer0_14Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPer0_14Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer0_14Conc21.noUiSlider.set([null, this.value]);
    });

    sliderPer0_14Conc21.noUiSlider.on('update',function(e){
        Per0_14Conc21.eachLayer(function(layer){
            if(layer.feature.properties.Per14_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per14_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer0_14Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderPer0_14Conc21.noUiSlider;
    $(slidersGeral).append(sliderPer0_14Conc21);
} 

/////////////////////////////// Fim Percentagem 0 15 anos CONCELHO em 2021 -------------- \\\\\\

/////////////////////////------- Percentagem 15 - 25  CONCELHO em 2021-----////

var minPer15_24Conc21 = 100;
var maxPer15_24Conc21 = 0;

function EstiloPer15_24Conc21(feature) {
    if(feature.properties.Per24_21 <= minPer15_24Conc21 || minPer15_24Conc21 === 0){
        minPer15_24Conc21 = feature.properties.Per24_21
    }
    if(feature.properties.Per24_21 >= maxPer15_24Conc21 ){
        maxPer15_24Conc21 = feature.properties.Per24_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer15_24Conc(feature.properties.Per24_21)
    };
}
function apagarPer15_24Conc21(e) {
    Per15_24Conc21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer15_24Conc21(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de residentes com idade entre 15 e 24 anos: ' + '<b>' + feature.properties.Per24_21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer15_24Conc21,
    });
}
var Per15_24Conc21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPer15_24Conc21,
    onEachFeature: onEachFeaturePer15_24Conc21
});
let slidePer15_24Conc21 = function(){
    var sliderPer15_24Conc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer15_24Conc21, {
        start: [minPer15_24Conc21, maxPer15_24Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer15_24Conc21,
            'max': maxPer15_24Conc21
        },
        });
    inputNumberMin.setAttribute("value",minPer15_24Conc21);
    inputNumberMax.setAttribute("value",maxPer15_24Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPer15_24Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer15_24Conc21.noUiSlider.set([null, this.value]);
    });

    sliderPer15_24Conc21.noUiSlider.on('update',function(e){
        Per15_24Conc21.eachLayer(function(layer){
            if(layer.feature.properties.Per24_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per24_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer15_24Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderPer15_24Conc21.noUiSlider;
    $(slidersGeral).append(sliderPer15_24Conc21);
} 

/////////////////////////////// Fim Percentagem 15 24 anos CONCELHO em 2021 -------------- \\\\\\


/////////////////////////------- Percentagem 25 - 64  CONCELHO em 2021-----////

var minPer25_64Conc21 = 100;
var maxPer25_64Conc21 = 0;

function EstiloPer25_64Conc21(feature) {
    if(feature.properties.Per64_21 <= minPer25_64Conc21 || minPer25_64Conc21 === 0){
        minPer25_64Conc21 = feature.properties.Per64_21
    }
    if(feature.properties.Per64_21 >= maxPer25_64Conc21 ){
        maxPer25_64Conc21 = feature.properties.Per64_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer25_64Conc(feature.properties.Per64_21)
    };
}
function apagarPer25_64Conc21(e) {
    Per25_64Conc21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer25_64Conc21(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' + feature.properties.Per64_21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer25_64Conc21,
    });
}
var Per25_64Conc21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPer25_64Conc21,
    onEachFeature: onEachFeaturePer25_64Conc21
});
let slidePer25_64Conc21 = function(){
    var sliderPer25_64Conc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer25_64Conc21, {
        start: [minPer25_64Conc21, maxPer25_64Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer25_64Conc21,
            'max': maxPer25_64Conc21
        },
        });
    inputNumberMin.setAttribute("value",minPer25_64Conc21);
    inputNumberMax.setAttribute("value",maxPer25_64Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPer25_64Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer25_64Conc21.noUiSlider.set([null, this.value]);
    });

    sliderPer25_64Conc21.noUiSlider.on('update',function(e){
        Per25_64Conc21.eachLayer(function(layer){
            if(layer.feature.properties.Per64_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per64_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer25_64Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderPer25_64Conc21.noUiSlider;
    $(slidersGeral).append(sliderPer25_64Conc21);
} 

/////////////////////////////// Fim Percentagem 25 64 anos CONCELHO em 2021 -------------- \\\\\\

/////////////////////////------- Percentagem MAIS 65 ANOS  CONCELHO em 2021-----////

var minPerMais65Conc21 = 100;
var maxPerMais65Conc21 = 0;

function EstiloPerMais65Conc21(feature) {
    if(feature.properties.Per65_21 <= minPerMais65Conc21 || minPerMais65Conc21 === 0){
        minPerMais65Conc21 = feature.properties.Per65_21
    }
    if(feature.properties.Per65_21 >= maxPerMais65Conc21 ){
        maxPerMais65Conc21 = feature.properties.Per65_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerMais65_Conc(feature.properties.Per65_21)
    };
}
function apagarPerMais65Conc21(e) {
    PerMais65Conc21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerMais65Conc21(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' + feature.properties.Per65_21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerMais65Conc21,
    });
}
var PerMais65Conc21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerMais65Conc21,
    onEachFeature: onEachFeaturePerMais65Conc21
});
let slidePerMais65Conc21 = function(){
    var sliderPerMais65Conc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerMais65Conc21, {
        start: [minPerMais65Conc21, maxPerMais65Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerMais65Conc21,
            'max': maxPerMais65Conc21
        },
        });
    inputNumberMin.setAttribute("value",minPerMais65Conc21);
    inputNumberMax.setAttribute("value",maxPerMais65Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerMais65Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerMais65Conc21.noUiSlider.set([null, this.value]);
    });

    sliderPerMais65Conc21.noUiSlider.on('update',function(e){
        PerMais65Conc21.eachLayer(function(layer){
            if(layer.feature.properties.Per65_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per65_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerMais65Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderPerMais65Conc21.noUiSlider;
    $(slidersGeral).append(sliderPerMais65Conc21);
} 

/////////////////////////////// Fim Percentagem SUPERIOR 65 anos CONCELHO em 2021 -------------- \\\\\\

/////////////////////------------------------------- FIM DADOS RELATIVOS CONCELHOS

///////////////////////////////////////// VARIAÇÕES CONCELHOS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação 0 - 15, entre 2001 e 1991, POR CONCELHOS -------------------////

var minVar0_15_01 = 0;
var maxVar0_15_01 = 0;

function CorVar0_14Conc91(d) {
    return  d == null ? '#a6a6a6' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -20  ? '#2288bf' :
        d >= -50   ? '#155273' :
                ''  ;
}

var legendaVar0_14Conc91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade entre 0 e 14 anos, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -20 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -46.65 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a6a6a6"></i>' + ' sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar0_15_01(feature) {
    if(feature.properties.Var14_01 <= minVar0_15_01 || minVar0_15_01 === 0){
        minVar0_15_01 = feature.properties.Var14_01
    }
    if(feature.properties.Var14_01 > maxVar0_15_01){
        maxVar0_15_01 = feature.properties.Var14_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar0_14Conc91(feature.properties.Var14_01)};
    }


function apagarVar0_15_01(e) {
    Var0_15_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar0_15_01(feature, layer) {
    if (feature.properties.Var14_01 == null){
        layer.bindPopup('<b>' + 'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var14_01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar0_15_01,
    });
}
var Var0_15_01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVar0_15_01,
    onEachFeature: onEachFeatureVar0_15_01
});

let slideVar0_15_01 = function(){
    var sliderVar0_15_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar0_15_01, {
        start: [minVar0_15_01, maxVar0_15_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar0_15_01,
            'max': maxVar0_15_01
        },
        });
    inputNumberMin.setAttribute("value",minVar0_15_01);
    inputNumberMax.setAttribute("value",maxVar0_15_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVar0_15_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar0_15_01.noUiSlider.set([null, this.value]);
    });

    sliderVar0_15_01.noUiSlider.on('update',function(e){
        Var0_15_01.eachLayer(function(layer){
            if (layer.feature.properties.Var14_01 == null){
                return false
            }
            if(layer.feature.properties.Var14_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var14_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar0_15_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderVar0_15_01.noUiSlider;
    $(slidersGeral).append(sliderVar0_15_01);
} 

///////////////////////////// Fim VARIAÇÃO 0 - 15, entre 2001 e 1991 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 15 - 24, entre 2001 e 1991, POR CONCELHOS -------------------////

var minVar15_24_01 = 0;
var maxVar15_24_01 = 0;

function CorVar15_24Conc91(d) {
    return  d == null ? '#a6a6a6' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -20  ? '#2288bf' :
        d >= -50   ? '#155273' :
                ''  ;
}

var legendaVar15_24Conc91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade entre 15 e 24 anos, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -20 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -42.77 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a6a6a6"></i>' + ' sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}
function EstiloVar15_24_01(feature) {
    if(feature.properties.Var24_01 <= minVar15_24_01 || minVar15_24_01 === 0){
        minVar15_24_01 = feature.properties.Var24_01
    }
    if(feature.properties.Var24_01 > maxVar15_24_01){
        maxVar15_24_01 = feature.properties.Var24_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar15_24Conc91(feature.properties.Var24_01)};
    }


function apagarVar15_24_01(e) {
    Var15_24_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar15_24_01(feature, layer) {
    if (feature.properties.Var24_01 == null){
        layer.bindPopup('<b>' + 'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var24_01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar15_24_01,
    });
}
var Var15_24_01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVar15_24_01,
    onEachFeature: onEachFeatureVar15_24_01
});

let slideVar15_24_01 = function(){
    var sliderVar15_24_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar15_24_01, {
        start: [minVar15_24_01, maxVar15_24_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar15_24_01,
            'max': maxVar15_24_01
        },
        });
    inputNumberMin.setAttribute("value",minVar15_24_01);
    inputNumberMax.setAttribute("value",maxVar15_24_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVar15_24_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar15_24_01.noUiSlider.set([null, this.value]);
    });

    sliderVar15_24_01.noUiSlider.on('update',function(e){
        Var15_24_01.eachLayer(function(layer){
            if (layer.feature.properties.Var24_01 == null){
                return false
            }
            if(layer.feature.properties.Var24_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var24_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar15_24_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderVar15_24_01.noUiSlider;
    $(slidersGeral).append(sliderVar15_24_01);
} 

///////////////////////////// Fim VARIAÇÃO 15 - 24, entre 2001 e 1991 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 25 - 64, entre 2001 e 1991, POR CONCELHOS -------------------////

var minVar25_64_01 = 0;
var maxVar25_64_01 = 0;

function CorVar25_64Conc91(d) {
    return  d == null ? '#a6a6a6' :
        d >= 30 ? '#8c0303' :
        d >= 25 ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25   ? '#9eaad7' :
                ''  ;
}

var legendaVar25_64Conc91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade entre 25 e 64 anos, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + ' > 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 25 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 15 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -22.23 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a6a6a6"></i>' + ' sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar25_64_01(feature) {
    if(feature.properties.Var64_01 <= minVar25_64_01 || minVar25_64_01 === 0){
        minVar25_64_01 = feature.properties.Var64_01
    }
    if(feature.properties.Var64_01 > maxVar25_64_01){
        maxVar25_64_01 = feature.properties.Var64_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar25_64Conc91(feature.properties.Var64_01)};
    }


function apagarVar25_64_01(e) {
    Var25_64_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar25_64_01(feature, layer) {
    if (feature.properties.Var64_01 == null){
        layer.bindPopup('<b>' + 'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var64_01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar25_64_01,
    });
}
var Var25_64_01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVar25_64_01,
    onEachFeature: onEachFeatureVar25_64_01
});

let slideVar25_64_01 = function(){
    var sliderVar25_64_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar25_64_01, {
        start: [minVar25_64_01, maxVar25_64_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar25_64_01,
            'max': maxVar25_64_01
        },
        });
    inputNumberMin.setAttribute("value",minVar25_64_01);
    inputNumberMax.setAttribute("value",maxVar25_64_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVar25_64_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar25_64_01.noUiSlider.set([null, this.value]);
    });

    sliderVar25_64_01.noUiSlider.on('update',function(e){
        Var25_64_01.eachLayer(function(layer){
            if (layer.feature.properties.Var64_01 == null){
                return false
            }
            if(layer.feature.properties.Var64_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var64_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar25_64_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderVar25_64_01.noUiSlider;
    $(slidersGeral).append(sliderVar25_64_01);
} 

///////////////////////////// Fim VARIAÇÃO 25 -64, entre 2001 e 1991 , POR CONCELHOS -------------- \\\\\


/////////////////////////////------- Variação SUPER A 65, entre 2001 e 1991, POR CONCELHOS -------------------////

var minVarMais65_01 = 0;
var maxVarMais65_01 = 0;

function CorVarMais65_Conc91(d) {
    return  d == null ? '#a6a6a6' :
        d >= 45 ? '#8c0303' :
        d >= 35 ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -1   ? '#9eaad7' :
                ''  ;
}

var legendaVarMais65_Conc91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade superior a 65 anos, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + ' > 45' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 35 a 45' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 15 a 35' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -0.86 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a6a6a6"></i>' + ' sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}
function EstiloVarMais65_01(feature) {
    if(feature.properties.Var65_01 <= minVarMais65_01 || minVarMais65_01 === 0){
        minVarMais65_01 = feature.properties.Var65_01
    }
    if(feature.properties.Var65_01 > maxVarMais65_01){
        maxVarMais65_01 = feature.properties.Var65_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarMais65_Conc91(feature.properties.Var65_01)};
    }


function apagarVarMais65_01(e) {
    VarMais65_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarMais65_01(feature, layer) {
    if (feature.properties.Var65_01 == null){
        layer.bindPopup('<b>' + 'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var65_01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarMais65_01,
    });
}
var VarMais65_01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarMais65_01,
    onEachFeature: onEachFeatureVarMais65_01
});

let slideVarMais65_01 = function(){
    var sliderVarMais65_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarMais65_01, {
        start: [minVarMais65_01, maxVarMais65_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarMais65_01,
            'max': maxVarMais65_01
        },
        });
    inputNumberMin.setAttribute("value",minVarMais65_01);
    inputNumberMax.setAttribute("value",maxVarMais65_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarMais65_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarMais65_01.noUiSlider.set([null, this.value]);
    });

    sliderVarMais65_01.noUiSlider.on('update',function(e){
        VarMais65_01.eachLayer(function(layer){
            if (layer.feature.properties.Var65_01 == null){
                return false
            }
            if(layer.feature.properties.Var65_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var65_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarMais65_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderVarMais65_01.noUiSlider;
    $(slidersGeral).append(sliderVarMais65_01);
} 

///////////////////////////// Fim VARIAÇÃO superior a 65, entre 2001 e 1991 , POR CONCELHOS -------------- \\\\\


/////////////////////////////------- Variação 0 - 15, entre 2011 e 2001, POR CONCELHOS -------------------////

var minVar0_15_11 = 0;
var maxVar0_15_11 = 0;

function CorVar0_14Conc01(d) {
    return  d >= 5 ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -20  ? '#2288bf' :
        d >= -27   ? '#155273' :
                ''  ;
}

var legendaVar0_14Conc01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade entre 0 e 14 anos, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -20 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -26.25 a -20' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar0_15_11(feature) {
    if(feature.properties.Var14_11 <= minVar0_15_11 || minVar0_15_11 === 0){
        minVar0_15_11 = feature.properties.Var14_11
    }
    if(feature.properties.Var14_11 > maxVar0_15_11){
        maxVar0_15_11 = feature.properties.Var14_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar0_14Conc01(feature.properties.Var14_11)};
    }


function apagarVar0_15_11(e) {
    Var0_15_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar0_15_11(feature, layer) {
    if (feature.properties.Var14_11 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var14_11.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar0_15_11,
    });
}
var Var0_15_11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVar0_15_11,
    onEachFeature: onEachFeatureVar0_15_11
});

let slideVar0_15_11 = function(){
    var sliderVar0_15_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar0_15_11, {
        start: [minVar0_15_11, maxVar0_15_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar0_15_11,
            'max': maxVar0_15_11
        },
        });
    inputNumberMin.setAttribute("value",minVar0_15_11);
    inputNumberMax.setAttribute("value",maxVar0_15_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVar0_15_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar0_15_11.noUiSlider.set([null, this.value]);
    });

    sliderVar0_15_11.noUiSlider.on('update',function(e){
        Var0_15_11.eachLayer(function(layer){
            if (layer.feature.properties.Var14_11 == null){
                return false
            }
            if(layer.feature.properties.Var14_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var14_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar0_15_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderVar0_15_11.noUiSlider;
    $(slidersGeral).append(sliderVar0_15_11);
} 

///////////////////////////// Fim VARIAÇÃO 0 - 15, entre 2011 e 2001 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 15 - 24, entre 2011 e 2001, POR CONCELHOS -------------------////

var minVar15_24_11 = 0;
var maxVar15_24_11 = -99;

function CorVar15_24Conc01(d) {
    return  d >= -15 ? '#9ebbd7' :
        d >= -20  ? '#2288bf' :
        d >= -25  ? '#155273' :
        d >= -35   ? '#0b2c40' :
                ''  ;
}

var legendaVar15_24Conc01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade entre 15 e 24 anos, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' -15 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -20 a -15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -25 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -33.25 a -25' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar15_24_11(feature) {
    if(feature.properties.Var24_11 <= minVar15_24_11 || feature.properties.Var24_11 == 0){
        minVar15_24_11 = feature.properties.Var24_11
    }
    if(feature.properties.Var24_11 > maxVar15_24_11){
        maxVar15_24_11 = feature.properties.Var24_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar15_24Conc01(feature.properties.Var24_11)};
    }


function apagarVar15_24_11(e) {
    Var15_24_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar15_24_11(feature, layer) {
    if (feature.properties.Var24_11 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var24_11.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar15_24_11,
    });
}
var Var15_24_11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVar15_24_11,
    onEachFeature: onEachFeatureVar15_24_11
});

let slideVar15_24_11 = function(){
    var sliderVar15_24_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar15_24_11, {
        start: [minVar15_24_11, maxVar15_24_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar15_24_11,
            'max': maxVar15_24_11
        },
        });
    inputNumberMin.setAttribute("value",minVar15_24_11);
    inputNumberMax.setAttribute("value",maxVar15_24_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVar15_24_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar15_24_11.noUiSlider.set([null, this.value]);
    });

    sliderVar15_24_11.noUiSlider.on('update',function(e){
        Var15_24_11.eachLayer(function(layer){
            if (layer.feature.properties.Var24_11 == null){
                return false
            }
            if(layer.feature.properties.Var24_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var24_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar15_24_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderVar15_24_11.noUiSlider;
    $(slidersGeral).append(sliderVar15_24_11);
} 

///////////////////////////// Fim VARIAÇÃO 15 - 24, entre 2011 e 2001 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 25 - 64, entre 2011 e 2001, POR CONCELHOS -------------------////

var minVar25_64_11 = 0;
var maxVar25_64_11 = -90;

function CorVar25_64Conc01(d) {
    return  d >= 11 ? '#8c0303' :
        d >= 8  ? '#de1f35' :
        d >= 4  ? '#ff5e6e' :
        d >= 0   ? '#f5b3be' :
        d >= -9   ? '#9eaad7' :
                ''  ;
}

var legendaVar25_64Conc01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade entre 25 e 64 anos, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 11' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  8 a 11' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  4 a 8' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -8 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar25_64_11(feature) {
    if(feature.properties.Var64_11 <= minVar25_64_11 || minVar25_64_11 === 0){
        minVar25_64_11 = feature.properties.Var64_11
    }
    if(feature.properties.Var64_11 > maxVar25_64_11){
        maxVar25_64_11 = feature.properties.Var64_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar25_64Conc01(feature.properties.Var64_11)};
    }


function apagarVar25_64_11(e) {
    Var25_64_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar25_64_11(feature, layer) {
    if (feature.properties.Var64_11 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var64_11.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar25_64_11,
    });
}
var Var25_64_11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVar25_64_11,
    onEachFeature: onEachFeatureVar25_64_11
});

let slideVar25_64_11 = function(){
    var sliderVar25_64_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar25_64_11, {
        start: [minVar25_64_11, maxVar25_64_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar25_64_11,
            'max': maxVar25_64_11
        },
        });
    inputNumberMin.setAttribute("value",minVar25_64_11);
    inputNumberMax.setAttribute("value",maxVar25_64_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVar25_64_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar25_64_11.noUiSlider.set([null, this.value]);
    });

    sliderVar25_64_11.noUiSlider.on('update',function(e){
        Var25_64_11.eachLayer(function(layer){
            if (layer.feature.properties.Var64_11 == null){
                return false
            }
            if(layer.feature.properties.Var64_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var64_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar25_64_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderVar25_64_11.noUiSlider;
    $(slidersGeral).append(sliderVar25_64_11);
} 

///////////////////////////// Fim VARIAÇÃO 25 -64, entre 2011 e 2001 , POR CONCELHOS -------------- \\\\\


/////////////////////////////------- Variação SUPER A 65, entre 2011 e 2001, POR CONCELHOS -------------------////

var minVarMais65_11 = 0;
var maxVarMais65_11 = 0;

function CorVarMais65_Conc01(d) {
    return  d >= 40 ? '#8c0303' :
        d >= 35  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 10   ? '#F5B3BE' :
        d >= 2   ? '#FABEAA' :
                ''  ;
}

var legendaVarMais65_Conc01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade superior a 65 anos, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + ' > 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 35 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 25 a 35' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F5B3BE"></i>' + ' 10 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#FABEAA"></i>' + ' 2.78 a 10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarMais65_11(feature) {
    if(feature.properties.Var65_11 <= minVarMais65_11 || minVarMais65_11 === 0){
        minVarMais65_11 = feature.properties.Var65_11
    }
    if(feature.properties.Var65_11 > maxVarMais65_11){
        maxVarMais65_11 = feature.properties.Var65_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarMais65_Conc01(feature.properties.Var65_11)};
    }


function apagarVarMais65_11(e) {
    VarMais65_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarMais65_11(feature, layer) {
    if (feature.properties.Var65_11 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var65_11.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarMais65_11,
    });
}
var VarMais65_11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarMais65_11,
    onEachFeature: onEachFeatureVarMais65_11
});

let slideVarMais65_11 = function(){
    var sliderVarMais65_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarMais65_11, {
        start: [minVarMais65_11, maxVarMais65_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarMais65_11,
            'max': maxVarMais65_11
        },
        });
    inputNumberMin.setAttribute("value",minVarMais65_11);
    inputNumberMax.setAttribute("value",maxVarMais65_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarMais65_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarMais65_11.noUiSlider.set([null, this.value]);
    });

    sliderVarMais65_11.noUiSlider.on('update',function(e){
        VarMais65_11.eachLayer(function(layer){
            if (layer.feature.properties.Var65_11 == null){
                return false
            }
            if(layer.feature.properties.Var65_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var65_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarMais65_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderVarMais65_11.noUiSlider;
    $(slidersGeral).append(sliderVarMais65_11);
} 

///////////////////////////// Fim VARIAÇÃO superior a 65, entre 2011 e 2001 , POR CONCELHOS -------------- \\\\\



/////////////////////////////------- Variação 0 - 15, entre 2021 e 2011, POR CONCELHOS -------------------////

var minVar0_15_21 = 0;
var maxVar0_15_21 = -99;

function CorVar0_14Conc11(d) {
    return  d >= -15  ? '#9ebbd7' :
        d >= -20  ? '#2288bf' :
        d >= -23   ? '#155273' :
        d >= -28   ? '#0b2c40' :
                ''  ;
}

var legendaVar0_14Conc11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade entre 0 e 14 anos, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + '  > -15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -20 a -15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -23 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -27.53 a -23' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar0_15_21(feature) {
    if(feature.properties.Var14_21 <= minVar0_15_21 || minVar0_15_21 === 0){
        minVar0_15_21 = feature.properties.Var14_21
    }
    if(feature.properties.Var14_21 > maxVar0_15_21){
        maxVar0_15_21 = feature.properties.Var14_21 
    }
    return {
        weight: 1,
        opacity: 0.8,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar0_14Conc11(feature.properties.Var14_21)};
    }


function apagarVar0_15_21(e) {
    Var0_15_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar0_15_21(feature, layer) {
    if (feature.properties.Var14_21 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var14_21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar0_15_21,
    });
}
var Var0_15_21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVar0_15_21,
    onEachFeature: onEachFeatureVar0_15_21
});

let slideVar0_15_21 = function(){
    var sliderVar0_15_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar0_15_21, {
        start: [minVar0_15_21, maxVar0_15_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar0_15_21,
            'max': maxVar0_15_21
        },
        });
    inputNumberMin.setAttribute("value",minVar0_15_21);
    inputNumberMax.setAttribute("value",maxVar0_15_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVar0_15_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar0_15_21.noUiSlider.set([null, this.value]);
    });

    sliderVar0_15_21.noUiSlider.on('update',function(e){
        Var0_15_21.eachLayer(function(layer){
            if (layer.feature.properties.Var14_21 == null){
                return false
            }
            if(layer.feature.properties.Var14_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var14_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar0_15_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderVar0_15_21.noUiSlider;
    $(slidersGeral).append(sliderVar0_15_21);
} 

///////////////////////////// Fim VARIAÇÃO 0 - 15, entre 2021 e 2011 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 15 - 24, entre 2021 e 2011, POR CONCELHOS -------------------////

var minVar15_24_21 = 0;
var maxVar15_24_21 = 0;

function CorVar15_24Conc11(d) {
    return  d >= 0  ? '#9ebbd7' :
        d >= -5  ? '#2288bf' :
        d >= -10  ? '#2288bf' :
        d >= -15   ? '#155273' :
        d >= -22   ? '#0b2c40' :
                ''  ;
}

var legendaVar15_24Conc11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade entre 15 e 24 anos, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -15 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -21.31 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar15_24_21(feature) {
    if(feature.properties.Var24_21 <= minVar15_24_21 || minVar15_24_21 === 0){
        minVar15_24_21 = feature.properties.Var24_21
    }
    if(feature.properties.Var24_21 > maxVar15_24_21){
        maxVar15_24_21 = feature.properties.Var24_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar15_24Conc11(feature.properties.Var24_21)};
    }


function apagarVar15_24_21(e) {
    Var15_24_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar15_24_21(feature, layer) {
    if (feature.properties.Var24_21 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var24_21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar15_24_21,
    });
}
var Var15_24_21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVar15_24_21,
    onEachFeature: onEachFeatureVar15_24_21
});

let slideVar15_24_21 = function(){
    var sliderVar15_24_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar15_24_21, {
        start: [minVar15_24_21, maxVar15_24_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar15_24_21,
            'max': maxVar15_24_21
        },
        });
    inputNumberMin.setAttribute("value",minVar15_24_21);
    inputNumberMax.setAttribute("value",maxVar15_24_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVar15_24_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar15_24_21.noUiSlider.set([null, this.value]);
    });

    sliderVar15_24_21.noUiSlider.on('update',function(e){
        Var15_24_21.eachLayer(function(layer){
            if (layer.feature.properties.Var24_21 == null){
                return false
            }
            if(layer.feature.properties.Var24_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var24_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar15_24_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderVar15_24_21.noUiSlider;
    $(slidersGeral).append(sliderVar15_24_21);
} 

///////////////////////////// Fim VARIAÇÃO 15 - 24, entre 2021 e 2011 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 25 - 64, entre 2021 e 2011, POR CONCELHOS -------------------////

var minVar25_64_21 = 0;
var maxVar25_64_21 = -99;

function CorVar25_64Conc11(d) {
    return  d >= -4  ? '#9ebbd7' :
        d >= -6  ? '#2288bf' :
        d >= -9   ? '#155273' :
        d >= -13   ? '#0b2c40' :
                ''  ;
}

var legendaVar25_64Conc11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade entre 25 e 64 anos, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -4 a -2.01' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -6 a -4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -9 a -6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -12.58 a -9' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar25_64_21(feature) {
    if(feature.properties.Var64_21 <= minVar25_64_21 || minVar25_64_21 === 0){
        minVar25_64_21 = feature.properties.Var64_21
    }
    if(feature.properties.Var64_21 > maxVar25_64_21){
        maxVar25_64_21 = feature.properties.Var64_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar25_64Conc11(feature.properties.Var64_21)};
    }


function apagarVar25_64_21(e) {
    Var25_64_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar25_64_21(feature, layer) {
    if (feature.properties.Var64_21 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var64_21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar25_64_21,
    });
}
var Var25_64_21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVar25_64_21,
    onEachFeature: onEachFeatureVar25_64_21
});

let slideVar25_64_21 = function(){
    var sliderVar25_64_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 39){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar25_64_21, {
        start: [minVar25_64_21, maxVar25_64_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar25_64_21,
            'max': maxVar25_64_21
        },
        });
    inputNumberMin.setAttribute("value",minVar25_64_21);
    inputNumberMax.setAttribute("value",maxVar25_64_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVar25_64_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar25_64_21.noUiSlider.set([null, this.value]);
    });

    sliderVar25_64_21.noUiSlider.on('update',function(e){
        Var25_64_21.eachLayer(function(layer){
            if (layer.feature.properties.Var64_21 == null){
                return false
            }
            if(layer.feature.properties.Var64_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var64_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar25_64_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 39;
    sliderAtivo = sliderVar25_64_21.noUiSlider;
    $(slidersGeral).append(sliderVar25_64_21);
} 

///////////////////////////// Fim VARIAÇÃO 25 -64, entre 2021 e 2011 , POR CONCELHOS -------------- \\\\\


/////////////////////////////------- Variação SUPER A 65, entre 2021 e 2011, POR CONCELHOS -------------------////

var minVarMais65_21 = 0;
var maxVarMais65_21 = 0;

function CorVarMais65_Conc11(d) {
    return  d >= 45  ? '#8c0303' :
        d >= 40  ? '#de1f35' :
        d >= 30  ? '#ff5e6e' :
        d >= 20   ? '#F5B3BE' :
        d >= 9   ? '#FABEAA' :
                ''  ;
}

var legendaVarMais65_Conc11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade superior a 65 anos, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 45' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 40 a 45' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 30 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F5B3BE"></i>' + ' 20 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#FABEAA"></i>' + ' 9.33 a 20' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarMais65_21(feature) {
    if(feature.properties.Var65_21 <= minVarMais65_21 || minVarMais65_21 === 0){
        minVarMais65_21 = feature.properties.Var65_21
    }
    if(feature.properties.Var65_21 > maxVarMais65_21){
        maxVarMais65_21 = feature.properties.Var65_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarMais65_Conc11(feature.properties.Var65_21)};
    }


function apagarVarMais65_21(e) {
    VarMais65_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarMais65_21(feature, layer) {
    if (feature.properties.Var65_21 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var65_21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarMais65_21,
    });
}
var VarMais65_21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarMais65_21,
    onEachFeature: onEachFeatureVarMais65_21
});

let slideVarMais65_21 = function(){
    var sliderVarMais65_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarMais65_21, {
        start: [minVarMais65_21, maxVarMais65_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarMais65_21,
            'max': maxVarMais65_21
        },
        });
    inputNumberMin.setAttribute("value",minVarMais65_21);
    inputNumberMax.setAttribute("value",maxVarMais65_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVarMais65_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarMais65_21.noUiSlider.set([null, this.value]);
    });

    sliderVarMais65_21.noUiSlider.on('update',function(e){
        VarMais65_21.eachLayer(function(layer){
            if (layer.feature.properties.Var65_21 == null){
                return false
            }
            if(layer.feature.properties.Var65_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var65_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarMais65_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderVarMais65_21.noUiSlider;
    $(slidersGeral).append(sliderVarMais65_21);
} 

///////////////////////////// Fim VARIAÇÃO superior a 65, entre 2021 e 2011 , POR CONCELHOS -------------- \\\\\

//////////////////++++++++++++++++++++++++++++ FIM CONCELHOS ++++++++++++++++++++\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

///////////////////////////--------------------------- FREGUESIASS --------------\\\\\\\\\\\\\\\\\\\

////////////////////////////----------- TOTAL 0 - 15  2001 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPop0_14Freg01 = 99999;
var maxPop0_14Freg01 = 0;
function estiloPop0_14Freg01(feature, latlng) {

    if(feature.properties.F0_14_01< minPop0_14Freg01 || feature.properties.F0_14_01 ===0){
        minPop0_14Freg01 = feature.properties.F0_14_01
    }
    if(feature.properties.F0_14_01> maxPop0_14Freg01){
        maxPop0_14Freg01 = feature.properties.F0_14_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F0_14_01,0.22)
    });
}
function apagarPop0_14Freg01(e){
    var layer = e.target;
    Pop0_14Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop0_14Freg01(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Número de residentes com idade entre 0 e 14 anos: '  + '<b>'+ feature.properties.F0_14_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop0_14Freg01,
    })
};

var Pop0_14Freg01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloPop0_14Freg01,
    onEachFeature: onEachFeaturePop0_14Freg01,
});

var slidePop0_14Freg01 = function(){
    var sliderPop0_14Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop0_14Freg01, {
        start: [minPop0_14Freg01, maxPop0_14Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop0_14Freg01,
            'max': maxPop0_14Freg01
        },
        format:{
            to: (v) => v | 2,
            from: (v) => v | 2
    }});
    
    inputNumberMin.setAttribute("value",minPop0_14Freg01);
    inputNumberMax.setAttribute("value",maxPop0_14Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPop0_14Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop0_14Freg01.noUiSlider.set([null, this.value]);
    });

    sliderPop0_14Freg01.noUiSlider.on('update',function(e){
        Pop0_14Freg01.eachLayer(function(layer){
            if(layer.feature.properties.F0_14_01>=parseFloat(e[0])&& layer.feature.properties.F0_14_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop0_14Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderPop0_14Freg01.noUiSlider;
    $(slidersGeral).append(sliderPop0_14Freg01);
}
///////////////////////////---------- FIM 0 - 15 em 2001 ,Por Freguesia -----------\\\\\\\\\

////////////////////////////-----------  15 - 24  2001 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPop15_24Freg01 = 99999;
var maxPop15_24Freg01 = 0;
function estiloPop15_24Freg01(feature, latlng) {

    if(feature.properties.F15_24_01< minPop15_24Freg01 || feature.properties.F15_24_01 ===0){
        minPop15_24Freg01 = feature.properties.F15_24_01
    }
    if(feature.properties.F15_24_01> maxPop15_24Freg01){
        maxPop15_24Freg01 = feature.properties.F15_24_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F15_24_01,0.22)
    });
}
function apagarPop15_24Freg01(e){
    var layer = e.target;
    Pop15_24Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop15_24Freg01(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Número de residentes com idade entre 15 e 24 anos: '  + '<b>'+ feature.properties.F15_24_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop15_24Freg01,
    })
};

var Pop15_24Freg01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloPop15_24Freg01,
    onEachFeature: onEachFeaturePop15_24Freg01,
});

var slidePop15_24Freg01 = function(){
    var sliderPop15_24Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 42){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop15_24Freg01, {
        start: [minPop15_24Freg01, maxPop15_24Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop15_24Freg01,
            'max': maxPop15_24Freg01
        },
        format:{
            to: (v) => v | 2,
            from: (v) => v | 2
    }});
    
    inputNumberMin.setAttribute("value",minPop15_24Freg01);
    inputNumberMax.setAttribute("value",maxPop15_24Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPop15_24Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop15_24Freg01.noUiSlider.set([null, this.value]);
    });

    sliderPop15_24Freg01.noUiSlider.on('update',function(e){
        Pop15_24Freg01.eachLayer(function(layer){
            if(layer.feature.properties.F15_24_01>=parseFloat(e[0])&& layer.feature.properties.F15_24_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop15_24Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 42;
    sliderAtivo = sliderPop15_24Freg01.noUiSlider;
    $(slidersGeral).append(sliderPop15_24Freg01);
}
///////////////////////////---------- FIM 15 - 24 em 2001 ,Por Freguesia -----------\\\\\\\\\


////////////////////////////-----------  25 - 64  2001 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPop25_64Freg01 = 99999;
var maxPop25_64Freg01 = 0;
function estiloPop25_64Freg01(feature, latlng) {

    if(feature.properties.F25_64_01< minPop25_64Freg01 || feature.properties.F25_64_01 ===0){
        minPop25_64Freg01 = feature.properties.F25_64_01
    }
    if(feature.properties.F25_64_01> maxPop25_64Freg01){
        maxPop25_64Freg01 = feature.properties.F25_64_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F25_64_01,0.22)
    });
}
function apagarPop25_64Freg01(e){
    var layer = e.target;
    Pop25_64Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop25_64Freg01(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Número de residentes com idade entre 25 e 64 anos: '  + '<b>'+ feature.properties.F25_64_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop25_64Freg01,
    })
};

var Pop25_64Freg01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloPop25_64Freg01,
    onEachFeature: onEachFeaturePop25_64Freg01,
});

var slidePop25_64Freg01 = function(){
    var sliderPop25_64Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 43){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop25_64Freg01, {
        start: [minPop25_64Freg01, maxPop25_64Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop25_64Freg01,
            'max': maxPop25_64Freg01
        },
        format:{
            to: (v) => v | 2,
            from: (v) => v | 2
    }});
    
    inputNumberMin.setAttribute("value",minPop25_64Freg01);
    inputNumberMax.setAttribute("value",maxPop25_64Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPop25_64Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop25_64Freg01.noUiSlider.set([null, this.value]);
    });

    sliderPop25_64Freg01.noUiSlider.on('update',function(e){
        Pop25_64Freg01.eachLayer(function(layer){
            if(layer.feature.properties.F25_64_01>=parseFloat(e[0])&& layer.feature.properties.F25_64_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop25_64Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 43;
    sliderAtivo = sliderPop25_64Freg01.noUiSlider;
    $(slidersGeral).append(sliderPop25_64Freg01);
}
///////////////////////////---------- FIM 25 - 64 em 2001 ,Por Freguesia -----------\\\\\\\\\

////////////////////////////-----------  MAIS 65  2001 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPopMais65Freg01 = 99999;
var maxPopMais65Freg01 = 0;
function estiloPopMais65Freg01(feature, latlng) {

    if(feature.properties.F65_01< minPopMais65Freg01 || feature.properties.F65_01 ===0){
        minPopMais65Freg01 = feature.properties.F65_01
    }
    if(feature.properties.F65_01> maxPopMais65Freg01){
        maxPopMais65Freg01 = feature.properties.F65_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F65_01,0.22)
    });
}
function apagarPopMais65Freg01(e){
    var layer = e.target;
    PopMais65Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePopMais65Freg01(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Número de residentes com idade superior a 65 anos: '  + '<b>'+ feature.properties.F65_01+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPopMais65Freg01,
    })
};

var PopMais65Freg01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloPopMais65Freg01,
    onEachFeature: onEachFeaturePopMais65Freg01,
});

var slidePopMais65Freg01 = function(){
    var sliderPopMais65Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 44){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPopMais65Freg01, {
        start: [minPopMais65Freg01, maxPopMais65Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopMais65Freg01,
            'max': maxPopMais65Freg01
        },
        format:{
            to: (v) => v | 2,
            from: (v) => v | 2
    }});
    
    inputNumberMin.setAttribute("value",minPopMais65Freg01);
    inputNumberMax.setAttribute("value",maxPopMais65Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPopMais65Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopMais65Freg01.noUiSlider.set([null, this.value]);
    });

    sliderPopMais65Freg01.noUiSlider.on('update',function(e){
        PopMais65Freg01.eachLayer(function(layer){
            if(layer.feature.properties.F65_01>=parseFloat(e[0])&& layer.feature.properties.F65_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopMais65Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 44;
    sliderAtivo = sliderPopMais65Freg01.noUiSlider;
    $(slidersGeral).append(sliderPopMais65Freg01);
}
///////////////////////////---------- FIM MAIS 65 em 2001 ,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- TOTAL 0 - 15  2011 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPop0_14Freg11 = 99999;
var maxPop0_14Freg11 = 0;
function estiloPop0_14Freg11(feature, latlng) {

    if(feature.properties.F0_14_11< minPop0_14Freg11 || feature.properties.F0_14_11 ===0){
        minPop0_14Freg11 = feature.properties.F0_14_11
    }
    if(feature.properties.F0_14_11> maxPop0_14Freg11){
        maxPop0_14Freg11 = feature.properties.F0_14_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F0_14_11,0.22)
    });
}
function apagarPop0_14Freg11(e){
    var layer = e.target;
    Pop0_14Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop0_14Freg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Número de residentes com idade entre 0 e 14 anos: '  + '<b>'+ feature.properties.F0_14_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop0_14Freg11,
    })
};

var Pop0_14Freg11= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloPop0_14Freg11,
    onEachFeature: onEachFeaturePop0_14Freg11,
});

var slidePop0_14Freg11 = function(){
    var sliderPop0_14Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop0_14Freg11, {
        start: [minPop0_14Freg11, maxPop0_14Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop0_14Freg11,
            'max': maxPop0_14Freg11
        },
        format:{
            to: (v) => v | 2,
            from: (v) => v | 2
    }});
    
    inputNumberMin.setAttribute("value",minPop0_14Freg11);
    inputNumberMax.setAttribute("value",maxPop0_14Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPop0_14Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop0_14Freg11.noUiSlider.set([null, this.value]);
    });

    sliderPop0_14Freg11.noUiSlider.on('update',function(e){
        Pop0_14Freg11.eachLayer(function(layer){
            if(layer.feature.properties.F0_14_11>=parseFloat(e[0])&& layer.feature.properties.F0_14_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop0_14Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderPop0_14Freg11.noUiSlider;
    $(slidersGeral).append(sliderPop0_14Freg11);
}
///////////////////////////---------- FIM 0 - 15 em 2011 ,Por Freguesia -----------\\\\\\\\\

////////////////////////////-----------  15 - 24  2011 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPop15_24Freg11 = 99999;
var maxPop15_24Freg11 = 0;
function estiloPop15_24Freg11(feature, latlng) {

    if(feature.properties.F15_24_11< minPop15_24Freg11 || feature.properties.F15_24_11 ===0){
        minPop15_24Freg11 = feature.properties.F15_24_11
    }
    if(feature.properties.F15_24_11> maxPop15_24Freg11){
        maxPop15_24Freg11 = feature.properties.F15_24_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F15_24_11,0.22)
    });
}
function apagarPop15_24Freg11(e){
    var layer = e.target;
    Pop15_24Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop15_24Freg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Número de residentes com idade entre 15 e 24 anos: '  + '<b>'+ feature.properties.F15_24_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop15_24Freg11,
    })
};

var Pop15_24Freg11= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloPop15_24Freg11,
    onEachFeature: onEachFeaturePop15_24Freg11,
});

var slidePop15_24Freg11 = function(){
    var sliderPop15_24Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 46){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop15_24Freg11, {
        start: [minPop15_24Freg11, maxPop15_24Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop15_24Freg11,
            'max': maxPop15_24Freg11
        },
        format:{
            to: (v) => v | 2,
            from: (v) => v | 2
    }});
    
    inputNumberMin.setAttribute("value",minPop15_24Freg11);
    inputNumberMax.setAttribute("value",maxPop15_24Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPop15_24Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop15_24Freg11.noUiSlider.set([null, this.value]);
    });

    sliderPop15_24Freg11.noUiSlider.on('update',function(e){
        Pop15_24Freg11.eachLayer(function(layer){
            if(layer.feature.properties.F15_24_11>=parseFloat(e[0])&& layer.feature.properties.F15_24_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop15_24Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 46;
    sliderAtivo = sliderPop15_24Freg11.noUiSlider;
    $(slidersGeral).append(sliderPop15_24Freg11);
}
///////////////////////////---------- FIM 15 - 24 em 2011 ,Por Freguesia -----------\\\\\\\\\


////////////////////////////-----------  25 - 64  2011 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPop25_64Freg11 = 99999;
var maxPop25_64Freg11 = 0;
function estiloPop25_64Freg11(feature, latlng) {

    if(feature.properties.F25_64_11< minPop25_64Freg11 || feature.properties.F25_64_11 ===0){
        minPop25_64Freg11 = feature.properties.F25_64_11
    }
    if(feature.properties.F25_64_11> maxPop25_64Freg11){
        maxPop25_64Freg11 = feature.properties.F25_64_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F25_64_11,0.22)
    });
}
function apagarPop25_64Freg11(e){
    var layer = e.target;
    Pop25_64Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop25_64Freg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Número de residentes com idade entre 25 e 64 anos: '  + '<b>'+ feature.properties.F25_64_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop25_64Freg11,
    })
};

var Pop25_64Freg11= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloPop25_64Freg11,
    onEachFeature: onEachFeaturePop25_64Freg11,
});

var slidePop25_64Freg11 = function(){
    var sliderPop25_64Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 47){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop25_64Freg11, {
        start: [minPop25_64Freg11, maxPop25_64Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop25_64Freg11,
            'max': maxPop25_64Freg11
        },
        format:{
            to: (v) => v | 2,
            from: (v) => v | 2
    }});
    
    inputNumberMin.setAttribute("value",minPop25_64Freg11);
    inputNumberMax.setAttribute("value",maxPop25_64Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPop25_64Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop25_64Freg11.noUiSlider.set([null, this.value]);
    });

    sliderPop25_64Freg11.noUiSlider.on('update',function(e){
        Pop25_64Freg11.eachLayer(function(layer){
            if(layer.feature.properties.F25_64_11>=parseFloat(e[0])&& layer.feature.properties.F25_64_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop25_64Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 47;
    sliderAtivo = sliderPop25_64Freg11.noUiSlider;
    $(slidersGeral).append(sliderPop25_64Freg11);
}
///////////////////////////---------- FIM 25 - 64 em 2011 ,Por Freguesia -----------\\\\\\\\\

////////////////////////////-----------  MAIS 65  2011 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPopMais65Freg11 = 99999;
var maxPopMais65Freg11 = 0;
function estiloPopMais65Freg11(feature, latlng) {

    if(feature.properties.F65_11< minPopMais65Freg11 || feature.properties.F65_11 ===0){
        minPopMais65Freg11 = feature.properties.F65_11
    }
    if(feature.properties.F65_11> maxPopMais65Freg11){
        maxPopMais65Freg11 = feature.properties.F65_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F65_11,0.22)
    });
}
function apagarPopMais65Freg11(e){
    var layer = e.target;
    PopMais65Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePopMais65Freg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Número de residentes com idade superior a 65 anos: '  + '<b>'+ feature.properties.F65_11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPopMais65Freg11,
    })
};

var PopMais65Freg11= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloPopMais65Freg11,
    onEachFeature: onEachFeaturePopMais65Freg11,
});

var slidePopMais65Freg11 = function(){
    var sliderPopMais65Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 48){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPopMais65Freg11, {
        start: [minPopMais65Freg11, maxPopMais65Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopMais65Freg11,
            'max': maxPopMais65Freg11
        },
        format:{
            to: (v) => v | 2,
            from: (v) => v | 2
    }});
    
    inputNumberMin.setAttribute("value",minPopMais65Freg11);
    inputNumberMax.setAttribute("value",maxPopMais65Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPopMais65Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopMais65Freg11.noUiSlider.set([null, this.value]);
    });

    sliderPopMais65Freg11.noUiSlider.on('update',function(e){
        PopMais65Freg11.eachLayer(function(layer){
            if(layer.feature.properties.F65_11>=parseFloat(e[0])&& layer.feature.properties.F65_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopMais65Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 48;
    sliderAtivo = sliderPopMais65Freg11.noUiSlider;
    $(slidersGeral).append(sliderPopMais65Freg11);
}
///////////////////////////---------- FIM MAIS 65 em 2011 ,Por Freguesia -----------\\\\\\\\\


////////////////////////////----------- TOTAL 0 - 15  2021 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPop0_14Freg21 = 99999;
var maxPop0_14Freg21 = 0;
function estiloPop0_14Freg21(feature, latlng) {

    if(feature.properties.F0_14_21< minPop0_14Freg21 || feature.properties.F0_14_21 ===0){
        minPop0_14Freg21 = feature.properties.F0_14_21
    }
    if(feature.properties.F0_14_21> maxPop0_14Freg21){
        maxPop0_14Freg21 = feature.properties.F0_14_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F0_14_21,0.22)
    });
}
function apagarPop0_14Freg21(e){
    var layer = e.target;
    Pop0_14Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop0_14Freg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Número de residentes com idade entre 0 e 14 anos: '  + '<b>'+ feature.properties.F0_14_21+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop0_14Freg21,
    })
};

var Pop0_14Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloPop0_14Freg21,
    onEachFeature: onEachFeaturePop0_14Freg21,
});

var slidePop0_14Freg21 = function(){
    var sliderPop0_14Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 49){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop0_14Freg21, {
        start: [minPop0_14Freg21, maxPop0_14Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop0_14Freg21,
            'max': maxPop0_14Freg21
        },
        format:{
            to: (v) => v | 2,
            from: (v) => v | 2
    }});
    
    inputNumberMin.setAttribute("value",minPop0_14Freg21);
    inputNumberMax.setAttribute("value",maxPop0_14Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPop0_14Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop0_14Freg21.noUiSlider.set([null, this.value]);
    });

    sliderPop0_14Freg21.noUiSlider.on('update',function(e){
        Pop0_14Freg21.eachLayer(function(layer){
            if(layer.feature.properties.F0_14_21>=parseFloat(e[0])&& layer.feature.properties.F0_14_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop0_14Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 49;
    sliderAtivo = sliderPop0_14Freg21.noUiSlider;
    $(slidersGeral).append(sliderPop0_14Freg21);
}
///////////////////////////---------- FIM 0 - 15 em 2021 ,Por Freguesia -----------\\\\\\\\\

////////////////////////////-----------  15 - 24  2021 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPop15_24Freg21 = 99999;
var maxPop15_24Freg21 = 0;
function estiloPop15_24Freg21(feature, latlng) {

    if(feature.properties.F15_24_21< minPop15_24Freg21 || feature.properties.F15_24_21 ===0){
        minPop15_24Freg21 = feature.properties.F15_24_21
    }
    if(feature.properties.F15_24_21> maxPop15_24Freg21){
        maxPop15_24Freg21 = feature.properties.F15_24_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F15_24_21,0.22)
    });
}
function apagarPop15_24Freg21(e){
    var layer = e.target;
    Pop15_24Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop15_24Freg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Número de residentes com idade entre 15 e 24 anos: '  + '<b>'+ feature.properties.F15_24_21+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop15_24Freg21,
    })
};

var Pop15_24Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloPop15_24Freg21,
    onEachFeature: onEachFeaturePop15_24Freg21,
});

var slidePop15_24Freg21 = function(){
    var sliderPop15_24Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 50){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop15_24Freg21, {
        start: [minPop15_24Freg21, maxPop15_24Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop15_24Freg21,
            'max': maxPop15_24Freg21
        },
        format:{
            to: (v) => v | 2,
            from: (v) => v | 2
    }});
    
    inputNumberMin.setAttribute("value",minPop15_24Freg21);
    inputNumberMax.setAttribute("value",maxPop15_24Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPop15_24Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop15_24Freg21.noUiSlider.set([null, this.value]);
    });

    sliderPop15_24Freg21.noUiSlider.on('update',function(e){
        Pop15_24Freg21.eachLayer(function(layer){
            if(layer.feature.properties.F15_24_21>=parseFloat(e[0])&& layer.feature.properties.F15_24_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop15_24Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 50;
    sliderAtivo = sliderPop15_24Freg21.noUiSlider;
    $(slidersGeral).append(sliderPop15_24Freg21);
}
///////////////////////////---------- FIM 15 - 24 em 2021 ,Por Freguesia -----------\\\\\\\\\


////////////////////////////-----------  25 - 64  2021 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPop25_64Freg21 = 99999;
var maxPop25_64Freg21 = 0;
function estiloPop25_64Freg21(feature, latlng) {

    if(feature.properties.F25_64_21< minPop25_64Freg21 || feature.properties.F25_64_21 ===0){
        minPop25_64Freg21 = feature.properties.F25_64_21
    }
    if(feature.properties.F25_64_21> maxPop25_64Freg21){
        maxPop25_64Freg21 = feature.properties.F25_64_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F25_64_21,0.22)
    });
}
function apagarPop25_64Freg21(e){
    var layer = e.target;
    Pop25_64Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePop25_64Freg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Número de residentes com idade entre 25 e 64 anos: '  + '<b>'+ feature.properties.F25_64_21+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPop25_64Freg21,
    })
};

var Pop25_64Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloPop25_64Freg21,
    onEachFeature: onEachFeaturePop25_64Freg21,
});

var slidePop25_64Freg21 = function(){
    var sliderPop25_64Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 51){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPop25_64Freg21, {
        start: [minPop25_64Freg21, maxPop25_64Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop25_64Freg21,
            'max': maxPop25_64Freg21
        },
        format:{
            to: (v) => v | 2,
            from: (v) => v | 2
    }});
    
    inputNumberMin.setAttribute("value",minPop25_64Freg21);
    inputNumberMax.setAttribute("value",maxPop25_64Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPop25_64Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPop25_64Freg21.noUiSlider.set([null, this.value]);
    });

    sliderPop25_64Freg21.noUiSlider.on('update',function(e){
        Pop25_64Freg21.eachLayer(function(layer){
            if(layer.feature.properties.F25_64_21>=parseFloat(e[0])&& layer.feature.properties.F25_64_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPop25_64Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 51;
    sliderAtivo = sliderPop25_64Freg21.noUiSlider;
    $(slidersGeral).append(sliderPop25_64Freg21);
}
///////////////////////////---------- FIM 25 - 64 em 2021 ,Por Freguesia -----------\\\\\\\\\

////////////////////////////-----------  MAIS 65  2021 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPopMais65Freg21 = 99999;
var maxPopMais65Freg21 = 0;
function estiloPopMais65Freg21(feature, latlng) {

    if(feature.properties.F65_21< minPopMais65Freg21 || feature.properties.F65_21 ===0){
        minPopMais65Freg21 = feature.properties.F65_21
    }
    if(feature.properties.F65_21> maxPopMais65Freg21){
        maxPopMais65Freg21 = feature.properties.F65_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F65_21,0.22)
    });
}
function apagarPopMais65Freg21(e){
    var layer = e.target;
    PopMais65Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePopMais65Freg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Número de residentes com idade superior a 65 anos: '  + '<b>'+ feature.properties.F65_21+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPopMais65Freg21,
    })
};

var PopMais65Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloPopMais65Freg21,
    onEachFeature: onEachFeaturePopMais65Freg21,
});

var slidePopMais65Freg21 = function(){
    var sliderPopMais65Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 52){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPopMais65Freg21, {
        start: [minPopMais65Freg21, maxPopMais65Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopMais65Freg21,
            'max': maxPopMais65Freg21
        },
        format:{
            to: (v) => v | 2,
            from: (v) => v | 2
    }});
    
    inputNumberMin.setAttribute("value",minPopMais65Freg21);
    inputNumberMax.setAttribute("value",maxPopMais65Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPopMais65Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopMais65Freg21.noUiSlider.set([null, this.value]);
    });

    sliderPopMais65Freg21.noUiSlider.on('update',function(e){
        PopMais65Freg21.eachLayer(function(layer){
            if(layer.feature.properties.F65_21>=parseFloat(e[0])&& layer.feature.properties.F65_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopMais65Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 52;
    sliderAtivo = sliderPopMais65Freg21.noUiSlider;
    $(slidersGeral).append(sliderPopMais65Freg21);
}
///////////////////////////---------- FIM MAIS 65 em 2021 ,Por Freguesia -----------\\\\\\\\\

///////////////////////////////////////------------------- FIM DADOS ABSOLUTOS \\\\

////////////////////////////////////----------- Percentagem 0 - 15 , EM 2001 ,Por Freguesia ------------------------------\\\\\\\\\\\\\


var minPer0_14Freg01 = 99;
var maxPer0_14Freg01 = 0;

function CorPer0_14Freg(d) {
    return d >= 24.74 ? '#8c0303' :
        d >= 21.6  ? '#de1f35' :
        d >= 16.37 ? '#ff5e6e' :
        d >= 11.13   ? '#f5b3be' :
        d >= 5.9   ? '#F2C572' :
                ''  ;
}
var legendaPer0_14Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 24.74' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 21.6 - 24.74' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 16.37 - 21.6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 11.13 - 16.37' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 5.9 - 11.13' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function estiloPer0_14Freg01(feature) {
    if(feature.properties.Per14_01 < minPer0_14Freg01 &&  feature.properties.Per14_01 > null || feature.properties.Per14_01 ===0){
        minPer0_14Freg01 = feature.properties.Per14_01
    }
    if(feature.properties.Per14_01> maxPer0_14Freg01 && feature.properties.Per14_01 > null){
        maxPer0_14Freg01 = feature.properties.Per14_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer0_14Freg(feature.properties.Per14_01)
    };
}
function apagarPer0_14Freg01(e){
    var layer = e.target;
    Per0_14Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer0_14Freg01(feature, layer) {
    if (feature.properties.Per14_01 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 0 e 14 anos: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 0 e 14 anos: ' + '<b>' +feature.properties.Per14_01 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer0_14Freg01,
    })
};

var Per0_14Freg01= L.geoJSON(dadosRelativosFreguesias01,{
    style:estiloPer0_14Freg01,
    onEachFeature: onEachFeaturePer0_14Freg01,
});

var slidePer0_14Freg01 = function(){
    var sliderPer0_14Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 53){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer0_14Freg01, {
        start: [minPer0_14Freg01, maxPer0_14Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer0_14Freg01,
            'max': maxPer0_14Freg01
        },
    });
    
    inputNumberMin.setAttribute("value",minPer0_14Freg01);
    inputNumberMax.setAttribute("value",maxPer0_14Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPer0_14Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer0_14Freg01.noUiSlider.set([null, this.value]);
    });

    sliderPer0_14Freg01.noUiSlider.on('update',function(e){
        Per0_14Freg01.eachLayer(function(layer){
            if (layer.feature.properties.Per14_01 == null){
                return false
            }
            if(layer.feature.properties.Per14_01>=parseFloat(e[0])&& layer.feature.properties.Per14_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer0_14Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 53;
    sliderAtivo = sliderPer0_14Freg01.noUiSlider;
    $(slidersGeral).append(sliderPer0_14Freg01);
}
///////////////////////////-------------------- FIM 0 - 14, EM 2001,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- Percentagem 15 - 24 , EM 2001 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer15_24Freg01 = 99;
var maxPer15_24Freg01 = 0;


function CorPer15_24Freg(d) {
    return d >= 18.71 ? '#8c0303' :
        d >= 16.61 ? '#de1f35' :
        d >= 13.09 ? '#ff5e6e' :
        d >= 9.58   ? '#f5b3be' :
        d >= 6.06   ? '#F2C572' :
                ''  ;
}
var legendaPer15_24Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 18.71' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 16.61 - 18.71' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 13.09 - 16.61' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 9.58 - 13.09' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 6.06 - 9.58' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function estiloPer15_24Freg01(feature) {
    if(feature.properties.Per24_01 < minPer15_24Freg01 &&  feature.properties.Per24_01 > null || feature.properties.Per24_01 ===0){
        minPer15_24Freg01 = feature.properties.Per24_01
    }
    if(feature.properties.Per24_01> maxPer15_24Freg01 && feature.properties.Per24_01 > null){
        maxPer15_24Freg01 = feature.properties.Per24_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer15_24Freg(feature.properties.Per24_01)
    };
}
function apagarPer15_24Freg01(e){
    var layer = e.target;
    Per15_24Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer15_24Freg01(feature, layer) {
    if (feature.properties.Per24_01 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 15 e 24 anos: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 15 e 24 anos: ' + '<b>' +feature.properties.Per24_01 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer15_24Freg01,
    })
};

var Per15_24Freg01= L.geoJSON(dadosRelativosFreguesias01,{
    style:estiloPer15_24Freg01,
    onEachFeature: onEachFeaturePer15_24Freg01,
});

var slidePer15_24Freg01 = function(){
    var sliderPer15_24Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 54){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer15_24Freg01, {
        start: [minPer15_24Freg01, maxPer15_24Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer15_24Freg01,
            'max': maxPer15_24Freg01
        },
    });
    
    inputNumberMin.setAttribute("value",minPer15_24Freg01);
    inputNumberMax.setAttribute("value",maxPer15_24Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPer15_24Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer15_24Freg01.noUiSlider.set([null, this.value]);
    });

    sliderPer15_24Freg01.noUiSlider.on('update',function(e){
        Per15_24Freg01.eachLayer(function(layer){
            if (layer.feature.properties.Per24_01 == null){
                return false
            }
            if(layer.feature.properties.Per24_01>=parseFloat(e[0])&& layer.feature.properties.Per24_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer15_24Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 54;
    sliderAtivo = sliderPer15_24Freg01.noUiSlider;
    $(slidersGeral).append(sliderPer15_24Freg01);
}
///////////////////////////-------------------- FIM 15 - 24, EM 2001,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- Percentagem 25 - 64 , EM 2001 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer25_64Freg01 = 99;
var maxPer25_64Freg01 = 0;

function CorPer25_64Freg(d) {
    return d >= 58.78 ? '#8c0303' :
        d >= 55.97 ? '#de1f35' :
        d >= 51.3 ? '#ff5e6e' :
        d >= 46.62   ? '#f5b3be' :
        d >= 41.94   ? '#F2C572' :
                ''  ;
}
var legendaPer25_64Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 58.78' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 55.97 - 58.78' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 51.3 - 55.97' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 46.62 - 51.3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 41.94 - 46.62' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function estiloPer25_64Freg01(feature) {
    if(feature.properties.Per64_01 < minPer25_64Freg01 &&  feature.properties.Per64_01 > null || feature.properties.Per64_01 ===0){
        minPer25_64Freg01 = feature.properties.Per64_01
    }
    if(feature.properties.Per64_01> maxPer25_64Freg01 && feature.properties.Per64_01 > null){
        maxPer25_64Freg01 = feature.properties.Per64_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer25_64Freg(feature.properties.Per64_01)
    };
}
function apagarPer25_64Freg01(e){
    var layer = e.target;
    Per25_64Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer25_64Freg01(feature, layer) {
    if (feature.properties.Per64_01 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' +feature.properties.Per64_01 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer25_64Freg01,
    })
};

var Per25_64Freg01= L.geoJSON(dadosRelativosFreguesias01,{
    style:estiloPer25_64Freg01,
    onEachFeature: onEachFeaturePer25_64Freg01,
});

var slidePer25_64Freg01 = function(){
    var sliderPer25_64Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 55){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer25_64Freg01, {
        start: [minPer25_64Freg01, maxPer25_64Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer25_64Freg01,
            'max': maxPer25_64Freg01
        },
    });
    
    inputNumberMin.setAttribute("value",minPer25_64Freg01);
    inputNumberMax.setAttribute("value",maxPer25_64Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPer25_64Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer25_64Freg01.noUiSlider.set([null, this.value]);
    });

    sliderPer25_64Freg01.noUiSlider.on('update',function(e){
        Per25_64Freg01.eachLayer(function(layer){
            if (layer.feature.properties.Per64_01 == null){
                return false
            }
            if(layer.feature.properties.Per64_01>=parseFloat(e[0])&& layer.feature.properties.Per64_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer25_64Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 55;
    sliderAtivo = sliderPer25_64Freg01.noUiSlider;
    $(slidersGeral).append(sliderPer25_64Freg01);
}
///////////////////////////-------------------- FIM 25 - 64, EM 2001,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- Percentagem MAIS 65 , EM 2001 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerMais65Freg01 = 99;
var maxPerMais65Freg01 = 0;

function CorPerMais65Freg(d) {
    return d >= 39.65 ? '#8c0303' :
        d >= 34.07 ? '#de1f35' :
        d >= 24.77 ? '#ff5e6e' :
        d >= 15.47   ? '#f5b3be' :
        d >= 6.17   ? '#F2C572' :
                ''  ;
}
var legendaPerMais65Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 39.65' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 34.07 - 39.65' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 24.77 - 34.07' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 15.47 - 24.77' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 6.17 - 15.47' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function estiloPerMais65Freg01(feature) {
    if(feature.properties.Per65_01 < minPerMais65Freg01 &&  feature.properties.Per65_01 > null || feature.properties.Per65_01 ===0){
        minPerMais65Freg01 = feature.properties.Per65_01
    }
    if(feature.properties.Per65_01> maxPerMais65Freg01 && feature.properties.Per65_01 > null){
        maxPerMais65Freg01 = feature.properties.Per65_01
    }
    return {
        weight: 1,
        opacity: 0.8,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerMais65Freg(feature.properties.Per65_01)
    };
}
function apagarPerMais65Freg01(e){
    var layer = e.target;
    PerMais65Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerMais65Freg01(feature, layer) {
    if (feature.properties.Per65_01 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' +feature.properties.Per65_01 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerMais65Freg01,
    })
};

var PerMais65Freg01= L.geoJSON(dadosRelativosFreguesias01,{
    style:estiloPerMais65Freg01,
    onEachFeature: onEachFeaturePerMais65Freg01,
});

var slidePerMais65Freg01 = function(){
    var sliderPerMais65Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 56){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerMais65Freg01, {
        start: [minPerMais65Freg01, maxPerMais65Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerMais65Freg01,
            'max': maxPerMais65Freg01
        },
        });
    
    inputNumberMin.setAttribute("value",minPerMais65Freg01);
    inputNumberMax.setAttribute("value",maxPerMais65Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerMais65Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerMais65Freg01.noUiSlider.set([null, this.value]);
    });

    sliderPerMais65Freg01.noUiSlider.on('update',function(e){
        PerMais65Freg01.eachLayer(function(layer){
            if (layer.feature.properties.Per65_01 == null){
                return false
            }
            if(layer.feature.properties.Per65_01>=parseFloat(e[0])&& layer.feature.properties.Per65_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerMais65Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 56;
    sliderAtivo = sliderPerMais65Freg01.noUiSlider;
    $(slidersGeral).append(sliderPerMais65Freg01);
}
///////////////////////////-------------------- FIM MAIS 65, EM 2001,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- Percentagem 0 - 15 , EM 2011 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer0_14Freg11 = 99;
var maxPer0_14Freg11 = 0;


function estiloPer0_14Freg11(feature) {
    if(feature.properties.Per14_11 < minPer0_14Freg11 &&  feature.properties.Per14_11 > null || feature.properties.Per14_11 ===0){
        minPer0_14Freg11 = feature.properties.Per14_11
    }
    if(feature.properties.Per14_11> maxPer0_14Freg11 && feature.properties.Per14_11 > null){
        maxPer0_14Freg11 = feature.properties.Per14_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer0_14Freg(feature.properties.Per14_11)
    };
}
function apagarPer0_14Freg11(e){
    var layer = e.target;
    Per0_14Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer0_14Freg11(feature, layer) {
    if (feature.properties.Per14_11 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 0 e 14 anos: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 0 e 14 anos: ' + '<b>' +feature.properties.Per14_11 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer0_14Freg11,
    })
};

var Per0_14Freg11= L.geoJSON(dadosRelativosFreguesias21,{
    style:estiloPer0_14Freg11,
    onEachFeature: onEachFeaturePer0_14Freg11,
});

var slidePer0_14Freg11 = function(){
    var sliderPer0_14Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 57){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer0_14Freg11, {
        start: [minPer0_14Freg11, maxPer0_14Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer0_14Freg11,
            'max': maxPer0_14Freg11
        },
        });
    
    inputNumberMin.setAttribute("value",minPer0_14Freg11);
    inputNumberMax.setAttribute("value",maxPer0_14Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPer0_14Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer0_14Freg11.noUiSlider.set([null, this.value]);
    });

    sliderPer0_14Freg11.noUiSlider.on('update',function(e){
        Per0_14Freg11.eachLayer(function(layer){
            if (layer.feature.properties.Per14_11 == null){
                return false
            }
            if(layer.feature.properties.Per14_11>=parseFloat(e[0])&& layer.feature.properties.Per14_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer0_14Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 57;
    sliderAtivo = sliderPer0_14Freg11.noUiSlider;
    $(slidersGeral).append(sliderPer0_14Freg11);
}
///////////////////////////-------------------- FIM 0 - 14, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- Percentagem 15 - 24 , EM 2011 ,Por Freguesia ------------------------------\\\\\\\\\\\\\


var minPer15_24Freg11 = 99;
var maxPer15_24Freg11 = 0;


function estiloPer15_24Freg11(feature) {
    if(feature.properties.Per24_11 < minPer15_24Freg11 &&  feature.properties.Per24_11 > null || feature.properties.Per24_11 ===0){
        minPer15_24Freg11 = feature.properties.Per24_11
    }
    if(feature.properties.Per24_11> maxPer15_24Freg11 && feature.properties.Per24_11 > null){
        maxPer15_24Freg11 = feature.properties.Per24_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer15_24Freg(feature.properties.Per24_11)
    };
}
function apagarPer15_24Freg11(e){
    var layer = e.target;
    Per15_24Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer15_24Freg11(feature, layer) {
    if (feature.properties.Per24_11 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 15 e 24 anos: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 15 e 24 anos: ' + '<b>' +feature.properties.Per24_11 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer15_24Freg11,
    })
};

var Per15_24Freg11= L.geoJSON(dadosRelativosFreguesias21,{
    style:estiloPer15_24Freg11,
    onEachFeature: onEachFeaturePer15_24Freg11,
});

var slidePer15_24Freg11 = function(){
    var sliderPer15_24Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 58){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer15_24Freg11, {
        start: [minPer15_24Freg11, maxPer15_24Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer15_24Freg11,
            'max': maxPer15_24Freg11
        },
        });
    
    inputNumberMin.setAttribute("value",minPer15_24Freg11);
    inputNumberMax.setAttribute("value",maxPer15_24Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPer15_24Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer15_24Freg11.noUiSlider.set([null, this.value]);
    });

    sliderPer15_24Freg11.noUiSlider.on('update',function(e){
        Per15_24Freg11.eachLayer(function(layer){
            if (layer.feature.properties.Per24_11 == null){
                return false
            }
            if(layer.feature.properties.Per24_11>=parseFloat(e[0])&& layer.feature.properties.Per24_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer15_24Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 58;
    sliderAtivo = sliderPer15_24Freg11.noUiSlider;
    $(slidersGeral).append(sliderPer15_24Freg11);
}
///////////////////////////-------------------- FIM 15 - 24, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- Percentagem 25 - 64 , EM 2011 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer25_64Freg11 = 99;
var maxPer25_64Freg11 = 0;


function estiloPer25_64Freg11(feature) {
    if(feature.properties.Per64_11 < minPer25_64Freg11 &&  feature.properties.Per64_11 > null || feature.properties.Per64_11 ===0){
        minPer25_64Freg11 = feature.properties.Per64_11
    }
    if(feature.properties.Per64_11> maxPer25_64Freg11 && feature.properties.Per64_11 > null){
        maxPer25_64Freg11 = feature.properties.Per64_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer25_64Freg(feature.properties.Per64_11)
    };
}
function apagarPer25_64Freg11(e){
    var layer = e.target;
    Per25_64Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer25_64Freg11(feature, layer) {
    if (feature.properties.Per64_11 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' +feature.properties.Per64_11 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer25_64Freg11,
    })
};

var Per25_64Freg11= L.geoJSON(dadosRelativosFreguesias21,{
    style:estiloPer25_64Freg11,
    onEachFeature: onEachFeaturePer25_64Freg11,
});

var slidePer25_64Freg11 = function(){
    var sliderPer25_64Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 59){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer25_64Freg11, {
        start: [minPer25_64Freg11, maxPer25_64Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer25_64Freg11,
            'max': maxPer25_64Freg11
        },
        });
    
    inputNumberMin.setAttribute("value",minPer25_64Freg11);
    inputNumberMax.setAttribute("value",maxPer25_64Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPer25_64Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer25_64Freg11.noUiSlider.set([null, this.value]);
    });

    sliderPer25_64Freg11.noUiSlider.on('update',function(e){
        Per25_64Freg11.eachLayer(function(layer){
            if (layer.feature.properties.Per64_11 == null){
                return false
            }
            if(layer.feature.properties.Per64_11>=parseFloat(e[0])&& layer.feature.properties.Per64_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer25_64Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 59;
    sliderAtivo = sliderPer25_64Freg11.noUiSlider;
    $(slidersGeral).append(sliderPer25_64Freg11);
}
///////////////////////////-------------------- FIM 25 - 64, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- Percentagem MAIS 65 , EM 2011 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerMais65Freg11 = 99;
var maxPerMais65Freg11 = 0;

function estiloPerMais65Freg11(feature) {
    if(feature.properties.Per65_11 < minPerMais65Freg11 &&  feature.properties.Per65_11 > null || feature.properties.Per65_11 ===0){
        minPerMais65Freg11 = feature.properties.Per65_11
    }
    if(feature.properties.Per65_11> maxPerMais65Freg11 && feature.properties.Per65_11 > null){
        maxPerMais65Freg11 = feature.properties.Per65_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerMais65Freg(feature.properties.Per65_11)
    };
}
function apagarPerMais65Freg11(e){
    var layer = e.target;
    PerMais65Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerMais65Freg11(feature, layer) {
    if (feature.properties.Per65_11 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' +feature.properties.Per65_11 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerMais65Freg11,
    })
};

var PerMais65Freg11= L.geoJSON(dadosRelativosFreguesias21,{
    style:estiloPerMais65Freg11,
    onEachFeature: onEachFeaturePerMais65Freg11,
});

var slidePerMais65Freg11 = function(){
    var sliderPerMais65Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 60){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerMais65Freg11, {
        start: [minPerMais65Freg11, maxPerMais65Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerMais65Freg11,
            'max': maxPerMais65Freg11
        },
        });
    
    inputNumberMin.setAttribute("value",minPerMais65Freg11);
    inputNumberMax.setAttribute("value",maxPerMais65Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerMais65Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerMais65Freg11.noUiSlider.set([null, this.value]);
    });

    sliderPerMais65Freg11.noUiSlider.on('update',function(e){
        PerMais65Freg11.eachLayer(function(layer){
            if (layer.feature.properties.Per65_11 == null){
                return false
            }
            if(layer.feature.properties.Per65_11>=parseFloat(e[0])&& layer.feature.properties.Per65_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerMais65Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 60;
    sliderAtivo = sliderPerMais65Freg11.noUiSlider;
    $(slidersGeral).append(sliderPerMais65Freg11);
}
///////////////////////////-------------------- FIM MAIS 65, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- Percentagem 0 - 15 , EM 2021 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer0_14Freg21 = 99;
var maxPer0_14Freg21 = 0;

function estiloPer0_14Freg21(feature) {
    if(feature.properties.Per14_21 < minPer0_14Freg21 &&  feature.properties.Per14_21 > null || feature.properties.Per14_21 ===0){
        minPer0_14Freg21 = feature.properties.Per14_21
    }
    if(feature.properties.Per14_21> maxPer0_14Freg21 && feature.properties.Per14_21 > null){
        maxPer0_14Freg21 = feature.properties.Per14_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer0_14Freg(feature.properties.Per14_21)
    };
}
function apagarPer0_14Freg21(e){
    var layer = e.target;
    Per0_14Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer0_14Freg21(feature, layer) {
    if (feature.properties.Per14_21 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 0 e 14 anos: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 0 e 14 anos: ' + '<b>' +feature.properties.Per14_21 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer0_14Freg21,
    })
};

var Per0_14Freg21= L.geoJSON(dadosRelativosFreguesias21,{
    style:estiloPer0_14Freg21,
    onEachFeature: onEachFeaturePer0_14Freg21,
});

var slidePer0_14Freg21 = function(){
    var sliderPer0_14Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 61){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer0_14Freg21, {
        start: [minPer0_14Freg21, maxPer0_14Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer0_14Freg21,
            'max': maxPer0_14Freg21
        },
        });
    
    inputNumberMin.setAttribute("value",minPer0_14Freg21);
    inputNumberMax.setAttribute("value",maxPer0_14Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPer0_14Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer0_14Freg21.noUiSlider.set([null, this.value]);
    });

    sliderPer0_14Freg21.noUiSlider.on('update',function(e){
        Per0_14Freg21.eachLayer(function(layer){
            if (layer.feature.properties.Per14_21 == null){
                return false
            }
            if(layer.feature.properties.Per14_21>=parseFloat(e[0])&& layer.feature.properties.Per14_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer0_14Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 61;
    sliderAtivo = sliderPer0_14Freg21.noUiSlider;
    $(slidersGeral).append(sliderPer0_14Freg21);
}
///////////////////////////-------------------- FIM 0 - 14, EM 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- Percentagem 15 - 24 , EM 2021 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer15_24Freg21 = 99;
var maxPer15_24Freg21 = 0;


function estiloPer15_24Freg21(feature) {
    if(feature.properties.Per24_21 < minPer15_24Freg21 &&  feature.properties.Per24_21 > null || feature.properties.Per24_21 ===0){
        minPer15_24Freg21 = feature.properties.Per24_21
    }
    if(feature.properties.Per24_21> maxPer15_24Freg21 && feature.properties.Per24_21 > null){
        maxPer15_24Freg21 = feature.properties.Per24_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer15_24Freg(feature.properties.Per24_21)
    };
}
function apagarPer15_24Freg21(e){
    var layer = e.target;
    Per15_24Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer15_24Freg21(feature, layer) {
    if (feature.properties.Per24_21 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 15 e 24 anos: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 15 e 24 anos: ' + '<b>' +feature.properties.Per24_21 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer15_24Freg21,
    })
};

var Per15_24Freg21= L.geoJSON(dadosRelativosFreguesias21,{
    style:estiloPer15_24Freg21,
    onEachFeature: onEachFeaturePer15_24Freg21,
});

var slidePer15_24Freg21 = function(){
    var sliderPer15_24Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 62){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer15_24Freg21, {
        start: [minPer15_24Freg21, maxPer15_24Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer15_24Freg21,
            'max': maxPer15_24Freg21
        },
        });
    
    inputNumberMin.setAttribute("value",minPer15_24Freg21);
    inputNumberMax.setAttribute("value",maxPer15_24Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPer15_24Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer15_24Freg21.noUiSlider.set([null, this.value]);
    });

    sliderPer15_24Freg21.noUiSlider.on('update',function(e){
        Per15_24Freg21.eachLayer(function(layer){
            if (layer.feature.properties.Per24_21 == null){
                return false
            }
            if(layer.feature.properties.Per24_21>=parseFloat(e[0])&& layer.feature.properties.Per24_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer15_24Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 62;
    sliderAtivo = sliderPer15_24Freg21.noUiSlider;
    $(slidersGeral).append(sliderPer15_24Freg21);
}
///////////////////////////-------------------- FIM 15 - 24, EM 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- Percentagem 25 - 64 , EM 2021 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer25_64Freg21 = 99;
var maxPer25_64Freg21 = 0;

function estiloPer25_64Freg21(feature) {
    if(feature.properties.Per64_21 < minPer25_64Freg21 &&  feature.properties.Per64_21 > null || feature.properties.Per64_21 ===0){
        minPer25_64Freg21 = feature.properties.Per64_21
    }
    if(feature.properties.Per64_21> maxPer25_64Freg21 && feature.properties.Per64_21 > null){
        maxPer25_64Freg21 = feature.properties.Per64_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer25_64Freg(feature.properties.Per64_21)
    };
}
function apagarPer25_64Freg21(e){
    var layer = e.target;
    Per25_64Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer25_64Freg21(feature, layer) {
    if (feature.properties.Per64_21 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' +feature.properties.Per64_21 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer25_64Freg21,
    })
};

var Per25_64Freg21= L.geoJSON(dadosRelativosFreguesias21,{
    style:estiloPer25_64Freg21,
    onEachFeature: onEachFeaturePer25_64Freg21,
});

var slidePer25_64Freg21 = function(){
    var sliderPer25_64Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 63){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer25_64Freg21, {
        start: [minPer25_64Freg21, maxPer25_64Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer25_64Freg21,
            'max': maxPer25_64Freg21
        },
        });
    
    inputNumberMin.setAttribute("value",minPer25_64Freg21);
    inputNumberMax.setAttribute("value",maxPer25_64Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPer25_64Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer25_64Freg21.noUiSlider.set([null, this.value]);
    });

    sliderPer25_64Freg21.noUiSlider.on('update',function(e){
        Per25_64Freg21.eachLayer(function(layer){
            if (layer.feature.properties.Per64_21 == null){
                return false
            }
            if(layer.feature.properties.Per64_21>=parseFloat(e[0])&& layer.feature.properties.Per64_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer25_64Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 63;
    sliderAtivo = sliderPer25_64Freg21.noUiSlider;
    $(slidersGeral).append(sliderPer25_64Freg21);
}
///////////////////////////-------------------- FIM 25 - 64, EM 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- Percentagem MAIS 65 , EM 2021 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerMais65Freg21 = 99;
var maxPerMais65Freg21 = 0;

function estiloPerMais65Freg21(feature) {
    if(feature.properties.Per65_21 < minPerMais65Freg21 &&  feature.properties.Per65_21 > null || feature.properties.Per65_21 ===0){
        minPerMais65Freg21 = feature.properties.Per65_21
    }
    if(feature.properties.Per65_21> maxPerMais65Freg21 && feature.properties.Per65_21 > null){
        maxPerMais65Freg21 = feature.properties.Per65_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerMais65Freg(feature.properties.Per65_21)
    };
}
function apagarPerMais65Freg21(e){
    var layer = e.target;
    PerMais65Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerMais65Freg21(feature, layer) {
    if (feature.properties.Per65_21 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de residentes com idade entre 25 e 64 anos: ' + '<b>' +feature.properties.Per65_21 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerMais65Freg21,
    })
};

var PerMais65Freg21= L.geoJSON(dadosRelativosFreguesias21,{
    style:estiloPerMais65Freg21,
    onEachFeature: onEachFeaturePerMais65Freg21,
});

var slidePerMais65Freg21 = function(){
    var sliderPerMais65Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 64){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerMais65Freg21, {
        start: [minPerMais65Freg21, maxPerMais65Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerMais65Freg21,
            'max': maxPerMais65Freg21
        },
        });
    
    inputNumberMin.setAttribute("value",minPerMais65Freg21);
    inputNumberMax.setAttribute("value",maxPerMais65Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerMais65Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerMais65Freg21.noUiSlider.set([null, this.value]);
    });

    sliderPerMais65Freg21.noUiSlider.on('update',function(e){
        PerMais65Freg21.eachLayer(function(layer){
            if (layer.feature.properties.Per65_21 == null){
                return false
            }
            if(layer.feature.properties.Per65_21>=parseFloat(e[0])&& layer.feature.properties.Per65_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerMais65Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 64;
    sliderAtivo = sliderPerMais65Freg21.noUiSlider;
    $(slidersGeral).append(sliderPerMais65Freg21);
}
///////////////////////////-------------------- FIM MAIS 65, EM 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////------------------------ FIM DADOS RELATIVOS ---------------\\\\\\\\\\\\\\\\\\\

//////////////////////////---------------------- VARIAÇÕES POR FREGUESIA -------------------\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação 0 - 14 , entre 2011 e 2001, POR FREGUESIAS -------------------////

var minVar0_15_11Freg = -5;
var maxVar0_15_11Freg = 0;

function CorVar0_14Freg01(d) {
    return  d == null ? '#a6a6a6' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -53   ? '#2288bf' :
                ''  ;
}

var legendaVar0_14Freg01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade entre 0 e 14 anos, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '   > 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -52.65 a -25' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar0_15_11Freg(feature) {
    if(feature.properties.Var14_11 < minVar0_15_11Freg){
        minVar0_15_11Freg = feature.properties.Var14_11
    }
    if(feature.properties.Var14_11 > maxVar0_15_11Freg && feature.properties.Var14_11 > null){
        maxVar0_15_11Freg = feature.properties.Var14_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar0_14Freg01(feature.properties.Var14_11)};
    }


function apagarVar0_15_11Freg(e) {
    Var0_15_11Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar0_15_11Freg(feature, layer) {
    if (feature.properties.Var14_11 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var14_11.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar0_15_11Freg,
    });
}
var Var0_15_11Freg= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVar0_15_11Freg,
    onEachFeature: onEachFeatureVar0_15_11Freg
});

let slideVar0_15_11Freg = function(){
    var sliderVar0_15_11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 65){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar0_15_11Freg, {
        start: [minVar0_15_11Freg, maxVar0_15_11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar0_15_11Freg,
            'max': maxVar0_15_11Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar0_15_11Freg);
    inputNumberMax.setAttribute("value",maxVar0_15_11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar0_15_11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar0_15_11Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar0_15_11Freg.noUiSlider.on('update',function(e){
        Var0_15_11Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var14_11 == null){
                return false
            }
            if(layer.feature.properties.Var14_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var14_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar0_15_11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 65;
    sliderAtivo = sliderVar0_15_11Freg.noUiSlider;
    $(slidersGeral).append(sliderVar0_15_11Freg);
} 

///////////////////////////// Fim VARIAÇÃO 0 - 15, entre 2011 e 2001 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 15 - 24 , entre 2011 e 2001, POR FREGUESIAS -------------------////


var minVar15_24_11Freg = 9999;
var maxVar15_24_11Freg = 0;


function CorVar15_24Freg01(d) {
    return  d == null ? '#a6a6a6' :
        d >= 0  ? '#f5b3be' :
        d >= -15  ? '#9ebbd7' :
        d >= -25  ? '#2288bf' :
        d >= -35  ? '#155273' :
        d >= -72   ? '#0b2c40' :
                ''  ;
}

var legendaVar15_24Freg01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade entre 15 e 24 anos, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -15 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -25 a -15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -35 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -71.43 a -35' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}
function EstiloVar15_24_11Freg(feature) {
    if(feature.properties.Var24_11 <= minVar15_24_11Freg){
        minVar15_24_11Freg = feature.properties.Var24_11
    }
    if(feature.properties.Var24_11 > maxVar15_24_11Freg && feature.properties.Var24_11 > null){
        maxVar15_24_11Freg = feature.properties.Var24_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar15_24Freg01(feature.properties.Var24_11)};
    }


function apagarVar15_24_11Freg(e) {
    Var15_24_11Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar15_24_11Freg(feature, layer) {
    if (feature.properties.Var24_11 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var24_11.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar15_24_11Freg,
    });
}
var Var15_24_11Freg= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVar15_24_11Freg,
    onEachFeature: onEachFeatureVar15_24_11Freg
});

let slideVar15_24_11Freg = function(){
    var sliderVar15_24_11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 66){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar15_24_11Freg, {
        start: [minVar15_24_11Freg, maxVar15_24_11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar15_24_11Freg,
            'max': maxVar15_24_11Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar15_24_11Freg);
    inputNumberMax.setAttribute("value",maxVar15_24_11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar15_24_11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar15_24_11Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar15_24_11Freg.noUiSlider.on('update',function(e){
        Var15_24_11Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var24_11 == null){
                return false
            }
            if(layer.feature.properties.Var24_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var24_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar15_24_11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 66;
    sliderAtivo = sliderVar15_24_11Freg.noUiSlider;
    $(slidersGeral).append(sliderVar15_24_11Freg);
} 

///////////////////////////// Fim VARIAÇÃO 15 - 24, entre 2011 e 2001 , POR FREGUESIAS -------------- \\\\\


/////////////////////////////------- Variação 25 - 64 , entre 2011 e 2001, POR FREGUESIAS -------------------////

var minVar25_64_11Freg = 9999;
var maxVar25_64_11Freg = 0;

function CorVar25_64Freg01(d) {
    return  d == null ? '#a6a6a6' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -15  ? '#9eaad7' :
        d >= -41   ? '#2288bf' :
                ''  ;
}

var legendaVar25_64Freg01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade entre 25 e 64 anos, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -15 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -40.79 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar25_64_11Freg(feature) {
    if(feature.properties.Var64_11 <= minVar25_64_11Freg){
        minVar25_64_11Freg = feature.properties.Var64_11
    }
    if(feature.properties.Var64_11 > maxVar25_64_11Freg && feature.properties.Var64_11 > null){
        maxVar25_64_11Freg = feature.properties.Var64_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar25_64Freg01(feature.properties.Var64_11)};
    }


function apagarVar25_64_11Freg(e) {
    Var25_64_11Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar25_64_11Freg(feature, layer) {
    if (feature.properties.Var64_11 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var64_11.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar25_64_11Freg,
    });
}
var Var25_64_11Freg= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVar25_64_11Freg,
    onEachFeature: onEachFeatureVar25_64_11Freg
});

let slideVar25_64_11Freg = function(){
    var sliderVar25_64_11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 67){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar25_64_11Freg, {
        start: [minVar25_64_11Freg, maxVar25_64_11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar25_64_11Freg,
            'max': maxVar25_64_11Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar25_64_11Freg);
    inputNumberMax.setAttribute("value",maxVar25_64_11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar25_64_11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar25_64_11Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar25_64_11Freg.noUiSlider.on('update',function(e){
        Var25_64_11Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var64_11 == null){
                return false
            }
            if(layer.feature.properties.Var64_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var64_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar25_64_11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 67;
    sliderAtivo = sliderVar25_64_11Freg.noUiSlider;
    $(slidersGeral).append(sliderVar25_64_11Freg);
} 

///////////////////////////// Fim VARIAÇÃO 25 - 64, entre 2011 e 2001 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação MAIS 65 , entre 2011 e 2001, POR FREGUESIAS -------------------////

var minVarMais65_11Freg = 9999;
var maxVarMais65_11Freg = 0;

function CorVarMais65_Freg01(d) {
    return  d == null ? '#a6a6a6' :
        d >= 45  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -27   ? '#9eaad7' :
                ''  ;
}

var legendaVarMais65_Freg01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade superior a 65 anos, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 45' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  30 a 45' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -26.36 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarMais65_11Freg(feature) {
    if(feature.properties.Var65_11 <= minVarMais65_11Freg){
        minVarMais65_11Freg = feature.properties.Var65_11
    }
    if(feature.properties.Var65_11 > maxVarMais65_11Freg && feature.properties.Var65_11 > null){
        maxVarMais65_11Freg = feature.properties.Var65_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarMais65_Freg01(feature.properties.Var65_11)};
    }


function apagarVarMais65_11Freg(e) {
    VarMais65_11Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarMais65_11Freg(feature, layer) {
    if (feature.properties.Var65_11 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var65_11.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarMais65_11Freg,
    });
}
var VarMais65_11Freg= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarMais65_11Freg,
    onEachFeature: onEachFeatureVarMais65_11Freg
});

let slideVarMais65_11Freg = function(){
    var sliderVarMais65_11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 68){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarMais65_11Freg, {
        start: [minVarMais65_11Freg, maxVarMais65_11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarMais65_11Freg,
            'max': maxVarMais65_11Freg
        },
        });
    inputNumberMin.setAttribute("value",minVarMais65_11Freg);
    inputNumberMax.setAttribute("value",maxVarMais65_11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVarMais65_11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarMais65_11Freg.noUiSlider.set([null, this.value]);
    });

    sliderVarMais65_11Freg.noUiSlider.on('update',function(e){
        VarMais65_11Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var65_11 == null){
                return false
            }
            if(layer.feature.properties.Var65_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var65_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarMais65_11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 68;
    sliderAtivo = sliderVarMais65_11Freg.noUiSlider;
    $(slidersGeral).append(sliderVarMais65_11Freg);
} 

///////////////////////////// Fim VARIAÇÃO MAIS 65, entre 2011 e 2001 , POR FREGUESIAS -------------- \\\\\


/////////////////////////////------- Variação 0 - 14 , entre 2021 e 2011, POR FREGUESIAS -------------------////

var minVar0_15_21Freg = 9999;
var maxVar0_15_21Freg = 0;

function CorVar0_14Freg11(d) {
    return  d == null ? '#a6a6a6' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9ebbd7' :
        d >= -20  ? '#2288bf' :
        d >= -35  ? '#155273' :
        d >= -60  ? '#0b2c40' :
                ''  ;
}

var legendaVar0_14Freg11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade entre 0 e 14 anos, entre 2021 e 2011, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -20 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -35 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -59.26 a -35' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar0_15_21Freg(feature) {
    if(feature.properties.Var14_21 <= minVar0_15_21Freg){
        minVar0_15_21Freg = feature.properties.Var14_21
    }
    if(feature.properties.Var14_21 > maxVar0_15_21Freg && feature.properties.Var14_21 > null){
        maxVar0_15_21Freg = feature.properties.Var14_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar0_14Freg11(feature.properties.Var14_21)};
    }


function apagarVar0_15_21Freg(e) {
    Var0_15_21Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar0_15_21Freg(feature, layer) {
    if (feature.properties.Var14_21 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var14_21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar0_15_21Freg,
    });
}
var Var0_15_21Freg= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVar0_15_21Freg,
    onEachFeature: onEachFeatureVar0_15_21Freg
});

let slideVar0_15_21Freg = function(){
    var sliderVar0_15_21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 69){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar0_15_21Freg, {
        start: [minVar0_15_21Freg, maxVar0_15_21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar0_15_21Freg,
            'max': maxVar0_15_21Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar0_15_21Freg);
    inputNumberMax.setAttribute("value",maxVar0_15_21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar0_15_21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar0_15_21Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar0_15_21Freg.noUiSlider.on('update',function(e){
        Var0_15_21Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var14_21 == null){
                return false
            }
            if(layer.feature.properties.Var14_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var14_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar0_15_21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 69;
    sliderAtivo = sliderVar0_15_21Freg.noUiSlider;
    $(slidersGeral).append(sliderVar0_15_21Freg);
} 

///////////////////////////// Fim VARIAÇÃO 0 - 15, entre 2021 e 2011 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 15 - 24 , entre 2021 e 2011, POR FREGUESIAS -------------------////

var minVar15_24_21Freg = 9999;
var maxVar15_24_21Freg = 0;

function CorVar15_24Freg11(d) {
    return  d == null ? '#a6a6a6' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -25  ? '#2288bf' :
        d >= -46  ? '#155273' :
                ''  ;
}

var legendaVar15_24Freg11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade entre 15 e 24 anos, entre 2021 e 2011, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -25 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -45 a -25' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar15_24_21Freg(feature) {
    if(feature.properties.Var24_21 <= minVar15_24_21Freg){
        minVar15_24_21Freg = feature.properties.Var24_21
    }
    if(feature.properties.Var24_21 > maxVar15_24_21Freg && feature.properties.Var24_21 > null){
        maxVar15_24_21Freg = feature.properties.Var24_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar15_24Freg11(feature.properties.Var24_21)};
    }


function apagarVar15_24_21Freg(e) {
    Var15_24_21Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar15_24_21Freg(feature, layer) {
    if (feature.properties.Var24_21 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var24_21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar15_24_21Freg,
    });
}
var Var15_24_21Freg= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVar15_24_21Freg,
    onEachFeature: onEachFeatureVar15_24_21Freg
});

let slideVar15_24_21Freg = function(){
    var sliderVar15_24_21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 70){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar15_24_21Freg, {
        start: [minVar15_24_21Freg, maxVar15_24_21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar15_24_21Freg,
            'max': maxVar15_24_21Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar15_24_21Freg);
    inputNumberMax.setAttribute("value",maxVar15_24_21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar15_24_21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar15_24_21Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar15_24_21Freg.noUiSlider.on('update',function(e){
        Var15_24_21Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var24_21 == null){
                return false
            }
            if(layer.feature.properties.Var24_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var24_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar15_24_21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 70;
    sliderAtivo = sliderVar15_24_21Freg.noUiSlider;
    $(slidersGeral).append(sliderVar15_24_21Freg);
} 

///////////////////////////// Fim VARIAÇÃO 15 - 24, entre 2021 e 2011 , POR FREGUESIAS -------------- \\\\\


/////////////////////////////------- Variação 25 - 64 , entre 2021 e 2011, POR FREGUESIAS -------------------////

var minVar25_64_21Freg = 9999;
var maxVar25_64_21Freg = 0;


function CorVar25_64Freg11(d) {
    return  d == null ? '#a6a6a6' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9ebbd7' :
        d >= -10  ? '#2288bf' :
        d >= -20  ? '#155273' :
        d >= -32  ? '#0b2c40' :
                ''  ;
}

var legendaVar25_64Freg11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade entre 25 e 64 anos, entre 2021 e 2011, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '   > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + '  -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -20 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -31.61 a -20' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar25_64_21Freg(feature) {
    if(feature.properties.Var64_21 <= minVar25_64_21Freg){
        minVar25_64_21Freg = feature.properties.Var64_21
    }
    if(feature.properties.Var64_21 > maxVar25_64_21Freg && feature.properties.Var64_21 > null){
        maxVar25_64_21Freg = feature.properties.Var64_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar25_64Freg11(feature.properties.Var64_21)};
    }


function apagarVar25_64_21Freg(e) {
    Var25_64_21Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar25_64_21Freg(feature, layer) {
    if (feature.properties.Var64_21 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var64_21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar25_64_21Freg,
    });
}
var Var25_64_21Freg= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVar25_64_21Freg,
    onEachFeature: onEachFeatureVar25_64_21Freg
});

let slideVar25_64_21Freg = function(){
    var sliderVar25_64_21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 71){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar25_64_21Freg, {
        start: [minVar25_64_21Freg, maxVar25_64_21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar25_64_21Freg,
            'max': maxVar25_64_21Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar25_64_21Freg);
    inputNumberMax.setAttribute("value",maxVar25_64_21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar25_64_21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar25_64_21Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar25_64_21Freg.noUiSlider.on('update',function(e){
        Var25_64_21Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var64_21 == null){
                return false
            }
            if(layer.feature.properties.Var64_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var64_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar25_64_21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 71;
    sliderAtivo = sliderVar25_64_21Freg.noUiSlider;
    $(slidersGeral).append(sliderVar25_64_21Freg);
} 

///////////////////////////// Fim VARIAÇÃO 25 - 64, entre 2021 e 2011 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação MAIS 65 , entre 2021 e 2011, POR FREGUESIAS -------------------////

var minVarMais65_21Freg = 9999;
var maxVarMais65_21Freg = 0;

function CorVarMais65_Freg11(d) {
    return  d == null ? '#a6a6a6' :
        d >= 50  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -8  ? '#9eaad7' :
                ''  ;
}

var legendaVarMais_65Freg11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com idade superior a 65 anos, entre 2021 e 2011, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  30 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -7.79 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarMais65_21Freg(feature) {
    if(feature.properties.Var65_21 <= minVarMais65_21Freg){
        minVarMais65_21Freg = feature.properties.Var65_21
    }
    if(feature.properties.Var65_21 > maxVarMais65_21Freg && feature.properties.Var65_21 > null){
        maxVarMais65_21Freg = feature.properties.Var65_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarMais65_Freg11(feature.properties.Var65_21)};
    }


function apagarVarMais65_21Freg(e) {
    VarMais65_21Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarMais65_21Freg(feature, layer) {
    if (feature.properties.Var65_21 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var65_21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarMais65_21Freg,
    });
}
var VarMais65_21Freg= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVarMais65_21Freg,
    onEachFeature: onEachFeatureVarMais65_21Freg
});

let slideVarMais65_21Freg = function(){
    var sliderVarMais65_21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 72){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarMais65_21Freg, {
        start: [minVarMais65_21Freg, maxVarMais65_21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarMais65_21Freg,
            'max': maxVarMais65_21Freg
        },
        });
    inputNumberMin.setAttribute("value",minVarMais65_21Freg);
    inputNumberMax.setAttribute("value",maxVarMais65_21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVarMais65_21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarMais65_21Freg.noUiSlider.set([null, this.value]);
    });

    sliderVarMais65_21Freg.noUiSlider.on('update',function(e){
        VarMais65_21Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var65_21 == null){
                return false
            }
            if(layer.feature.properties.Var65_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var65_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarMais65_21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 72;
    sliderAtivo = sliderVarMais65_21Freg.noUiSlider;
    $(slidersGeral).append(sliderVarMais65_21Freg);
} 

///////////////////////////// Fim VARIAÇÃO MAIS 65, entre 2021 e 2011 , POR FREGUESIAS -------------- \\\\\

$('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 0 e 14 anos, em 1991, por concelho, Nº.' + '</strong>')


/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = Pop0_14Conc91;
//// dizer qual a base (Contornos Concelhos/Freguesias) ativa
let baseAtiva = contornoConcelhos1991;
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
    if (layer == Pop0_14Conc91 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 0 e 14 anos, em 1991, por concelho, Nº.' + '</strong>')
        legenda(maxPop0_14Conc91, ((maxPop0_14Conc91-minPop0_14Conc91)/2).toFixed(0),minPop0_14Conc91,0.13);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slidePop0_14Conc91();
        naoDuplicar = 1;
    }
    if (layer == Pop0_14Conc91 && naoDuplicar == 1){
        contornoConcelhos1991.addTo(map);
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 0 e 14 anos, em 1991, por concelho, Nº.' + '</strong>')
    }
    if (layer == Pop15_24Conc91 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 15-24 anos, em 1991, por concelho, Nº.' + '</strong>')
        legenda(maxPop15_24Conc91, ((maxPop15_24Conc91-minPop15_24Conc91)/2).toFixed(0),minPop15_24Conc91,0.13);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slidePop15_24Conc91();
        naoDuplicar = 2;
    }
    if (layer == Pop25_64Conc91 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 25-64 anos, em 1991, por concelho, Nº.' + '</strong>');
        legenda(maxPop25_64Conc91, ((maxPop25_64Conc91-minPop25_64Conc91)/2).toFixed(0),minPop25_64Conc91,0.13);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slidePop25_64Conc91();
        naoDuplicar = 3;
    }
    if (layer == PopMais65Conc91 && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade superior a 65 anos, em 1991, por concelho, Nº.' + '</strong>');
        legenda(maxPopMais65Conc91, ((maxPopMais65Conc91-minPopMais65Conc91)/2).toFixed(0),minPopMais65Conc91,0.13);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slidePopMais65Conc91();
        naoDuplicar = 4;
    }
    if (layer == Pop0_14Conc01 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 0 e 14 anos, em 2001, por concelho, Nº.' + '</strong>');
        legenda(maxPop0_14Conc01, ((maxPop0_14Conc01-minPop0_14Conc01)/2).toFixed(0),minPop0_14Conc01,0.13);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePop0_14Conc01();
        naoDuplicar = 5;
    }
    if (layer == Pop15_24Conc01 && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Número de residentes em 2001 com idade entre 15 e 24 anos, por concelho, Nº.' + '</strong>');
        legenda(maxPop15_24Conc01, ((maxPop15_24Conc01-minPop15_24Conc01)/2).toFixed(0),minPop15_24Conc01,0.13);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePop15_24Conc01();
        naoDuplicar = 6;
    }
    if (layer == Pop25_64Conc01 && naoDuplicar != 7){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 25 e 64 anos, em 2001, por concelho, Nº.' + '</strong>');
        legenda(maxPop25_64Conc01, ((maxPop25_64Conc01-minPop25_64Conc01)/2).toFixed(0),minPop25_64Conc01,0.13);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePop25_64Conc01();
        naoDuplicar = 7;
    }
    if (layer == PopMais65Conc01 && naoDuplicar != 8){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade superior a 65 anos, em 2001, por concelho, Nº.' + '</strong>');
        legenda(maxPopMais65Conc01, ((maxPopMais65Conc01-minPopMais65Conc01)/2).toFixed(0),minPopMais65Conc01,0.13);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePopMais65Conc01();
        naoDuplicar = 8;
    }
    if (layer == Pop0_14Conc11 && naoDuplicar != 9){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 0 e 14 anos, em 2011, por concelho, Nº.' + '</strong>');
        legenda(maxPop0_14Conc11, ((maxPop0_14Conc11-minPop0_14Conc11)/2).toFixed(0),minPop0_14Conc11,0.13);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePop0_14Conc11();
        naoDuplicar = 9;
    }
    if (layer == Pop15_24Conc11 && naoDuplicar != 10){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 15 e 24 anos, em 2011, por concelho, Nº.' + '</strong>');
        legenda(maxPop15_24Conc11, ((maxPop15_24Conc11-minPop15_24Conc11)/2).toFixed(0),minPop15_24Conc11,0.13);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePop15_24Conc11();
        naoDuplicar = 10;
    }
    if (layer == Pop25_64Conc11 && naoDuplicar != 11){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 25 e 64 anos, em 2011, por concelho, Nº.' + '</strong>');
        legenda(maxPop25_64Conc11, ((maxPop25_64Conc11-minPop25_64Conc11)/2).toFixed(0),minPop25_64Conc11,0.13);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePop25_64Conc11();
        naoDuplicar = 11;
    }
    if (layer == PopMais65Conc11 && naoDuplicar != 12){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade superior a 65 anos, em 2011, por concelho, Nº.' + '</strong>');
        legenda(maxPopMais65Conc11, ((maxPopMais65Conc11-minPopMais65Conc11)/2).toFixed(0),minPopMais65Conc11,0.13);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePopMais65Conc11();
        naoDuplicar = 12;
    }
    if (layer == Pop0_14Conc21 && naoDuplicar != 73){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 0 e 14 anos, em 2021, por concelho, Nº.' + '</strong>');
        legenda(maxPop0_14Conc21, ((maxPop0_14Conc21-minPop0_14Conc21)/2).toFixed(0),minPop0_14Conc21,0.13);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePop0_14Conc21();
        naoDuplicar = 73;
    }
    if (layer == Pop15_24Conc21 && naoDuplicar != 74){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 15 e 24 anos, em 2021, por concelho, Nº.' + '</strong>');
        legenda(maxPop15_24Conc21, ((maxPop15_24Conc21-minPop15_24Conc21)/2).toFixed(0),minPop15_24Conc21,0.13);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePop15_24Conc21();
        naoDuplicar = 74;
    }
    if (layer == Pop25_64Conc21 && naoDuplicar != 75){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 25 e 64 anos, em 2021, por concelho, Nº.' + '</strong>');
        legenda(maxPop25_64Conc21, ((maxPop25_64Conc21-minPop25_64Conc21)/2).toFixed(0),minPop25_64Conc21,0.13);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePop25_64Conc21();
        naoDuplicar = 75;
    }
    if (layer == PopMais65Conc21 && naoDuplicar != 76){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade superior a 65 anos, em 2021, por concelho, Nº.' + '</strong>');
        legenda(maxPopMais65Conc21, ((maxPopMais65Conc21-minPopMais65Conc21)/2).toFixed(0),minPopMais65Conc21,0.13);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidePopMais65Conc21();
        naoDuplicar = 76;
    }
    if (layer == Per0_14Conc91 && naoDuplicar != 13){
        legendaPer0_14Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 0 e 14 anos, em 1991, por concelho.' + '</strong>');
        slidePer0_14Conc91();
        naoDuplicar = 13;
    }
    if (layer == Per15_24Conc91 && naoDuplicar != 14){
        legendaPer15_24Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 15 e 24 anos, em 1991, por concelho.' + '</strong>');
        slidePer15_24Conc91();
        naoDuplicar = 14;
    }
    if (layer == Per25_64Conc91 && naoDuplicar != 15){
        legendaPer25_64Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 25 e 64 anos, em 1991, por concelho.' + '</strong>');
        slidePer25_64Conc91();
        naoDuplicar = 15;
    }
    if (layer == PerMais65Conc91 && naoDuplicar != 16){
        legendaPerMais65_Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade superior a 65 anos, em 1991, por concelho.' + '</strong>');
        slidePerMais65Conc91();
        naoDuplicar = 16;
    }
    if (layer == Per0_14Conc01 && naoDuplicar != 17){
        legendaPer0_14Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 0 e 14 anos, em 2001, por concelho.' + '</strong>');
        slidePer0_14Conc01();
        naoDuplicar = 17;
    }
    if (layer == Per15_24Conc01 && naoDuplicar != 18){
        legendaPer15_24Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 15 e 24 anos, em 2001, por concelho.' + '</strong>');
        slidePer15_24Conc01();
        naoDuplicar = 18;
    }
    if (layer == Per25_64Conc01 && naoDuplicar != 19){
        legendaPer25_64Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 25 e 64 anos, em 2001, por concelho.' + '</strong>');
        slidePer25_64Conc01();
        naoDuplicar = 19;
    }
    if (layer == PerMais65Conc01 && naoDuplicar != 20){
        legendaPerMais65_Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade superior a 65 anos, em 2001, por concelho.' + '</strong>');
        slidePerMais65Conc01();
        naoDuplicar = 20;
    }
    if (layer == Per0_14Conc11 && naoDuplicar != 21){
        legendaPer0_14Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 0 e 14 anos, em 2011, por concelho.' + '</strong>');
        slidePer0_14Conc11();
        naoDuplicar = 21;
    }
    if (layer == Per15_24Conc11 && naoDuplicar != 22){
        legendaPer15_24Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 15 e 24 anos, em 2011, por concelho.' + '</strong>');
        slidePer15_24Conc11();
        naoDuplicar = 22;
    }
    if (layer == Per25_64Conc11 && naoDuplicar != 23){
        legendaPer25_64Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 25 e 64 anos, em 2011, por concelho.' + '</strong>');
        slidePer25_64Conc11();
        naoDuplicar = 23;
    }
    if (layer == PerMais65Conc11 && naoDuplicar != 24){
        legendaPerMais65_Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade superior a 65 anos, em 2011, por concelho.' + '</strong>');
        slidePerMais65Conc11();
        naoDuplicar = 24;
    }
    if (layer == Per0_14Conc21 && naoDuplicar != 25){
        legendaPer0_14Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 0 e 14 anos, em 2021, por concelho.' + '</strong>');
        slidePer0_14Conc21();
        naoDuplicar = 25;
    }
    if (layer == Per15_24Conc21 && naoDuplicar != 26){
        legendaPer15_24Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 15 e 24 anos, em 2021, por concelho.' + '</strong>');
        slidePer15_24Conc21();
        naoDuplicar = 26;
    }
    if (layer == Per25_64Conc21 && naoDuplicar != 27){
        legendaPer25_64Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 25 e 64 anos, em 2021, por concelho.' + '</strong>');
        slidePer25_64Conc21();
        naoDuplicar = 27;
    }
    if (layer == PerMais65Conc21 && naoDuplicar != 28){
        legendaPerMais65_Conc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade superior a 65 anos, em 2021, por concelho.' + '</strong>');
        slidePerMais65Conc21();
        naoDuplicar = 28;
    }
    if (layer == Var0_15_01 && naoDuplicar != 29){
        legendaVar0_14Conc91();    
        slideVar0_15_01();
        naoDuplicar = 29;
    }
    if (layer == Var15_24_01 && naoDuplicar != 30){
        legendaVar15_24Conc91(); 
        slideVar15_24_01();
        naoDuplicar = 30;
    }
    if (layer == Var25_64_01 && naoDuplicar != 31){
        legendaVar25_64Conc91(); 
        slideVar25_64_01();
        naoDuplicar = 31;
    }
    if (layer == VarMais65_01 && naoDuplicar != 32){
        legendaVarMais65_Conc91(); 
        slideVarMais65_01();
        naoDuplicar = 32;
    }
    if (layer == Var0_15_11 && naoDuplicar != 33){
        legendaVar0_14Conc01();            
        slideVar0_15_11();
        naoDuplicar = 33;
    }
    if (layer == Var15_24_11 && naoDuplicar != 34){
        legendaVar15_24Conc01();         
        slideVar15_24_11();
        naoDuplicar = 34;
    }
    if (layer == Var25_64_11 && naoDuplicar != 35){
        legendaVar25_64Conc01(); 
        slideVar25_64_11();
        naoDuplicar = 35;
    }
    if (layer == VarMais65_11 && naoDuplicar != 36){
        legendaVarMais65_Conc01(); 
        slideVarMais65_11();
        naoDuplicar = 36;
    }
    if (layer == Var0_15_21 && naoDuplicar != 37){
        legendaVar0_14Conc11();            
        slideVar0_15_21();
        naoDuplicar = 37;
    }
    if (layer == Var15_24_21 && naoDuplicar != 38){
        legendaVar15_24Conc11();         
        slideVar15_24_21();
        naoDuplicar = 38;
    }
    if (layer == Var25_64_21 && naoDuplicar != 39){
        legendaVar25_64Conc11(); 
        slideVar25_64_21();
        naoDuplicar = 39;
    }
    if (layer == VarMais65_21 && naoDuplicar != 40){
        legendaVarMais65_Conc11(); 
        slideVarMais65_21();
        naoDuplicar = 40;
    }
    if (layer == Pop0_14Freg01 && naoDuplicar != 41){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 0 e 14 anos, em 2001, por freguesia, Nº.' + '</strong>');
        legendaExcecao(maxPop0_14Freg01, ((maxPop0_14Freg01-minPop0_14Freg01)/2).toFixed(0),minPop0_14Freg01,0.13);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slidePop0_14Freg01();
        naoDuplicar = 41;
    }
    if (layer == Pop15_24Freg01 && naoDuplicar != 42){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 15 e 24 anos, em 2001, por freguesia, Nº.' + '</strong>');
        legendaExcecao(maxPop15_24Freg01, ((maxPop15_24Freg01-minPop15_24Freg01)/2).toFixed(0),minPop15_24Freg01,0.13);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slidePop15_24Freg01();
        naoDuplicar = 42;
    }
    if (layer == Pop25_64Freg01 && naoDuplicar != 43){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 25 e 64 anos, em 2001, por freguesia, Nº.' + '</strong>');
        legendaExcecao(maxPop25_64Freg01, ((maxPop25_64Freg01-minPop25_64Freg01)/2).toFixed(0),minPop25_64Freg01,0.13);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slidePop25_64Freg01();
        naoDuplicar = 43;
    }
    if (layer == PopMais65Freg01 && naoDuplicar != 44){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade superior a 65 anos, em 2001, por freguesia, Nº.' + '</strong>');
        legendaExcecao(maxPopMais65Freg01, ((maxPopMais65Freg01-minPopMais65Freg01)/2).toFixed(0),minPopMais65Freg01,0.13);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slidePopMais65Freg01();
        naoDuplicar = 44;
    }
    if (layer == Pop0_14Freg11 && naoDuplicar != 45){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 0 e 14 anos, em 2011, por freguesia, Nº.' + '</strong>');
        legendaExcecao(maxPop0_14Freg11, ((maxPop0_14Freg11-minPop0_14Freg11)/2).toFixed(0),minPop0_14Freg11,0.13);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slidePop0_14Freg11();
        naoDuplicar = 45;
    }
    if (layer == Pop15_24Freg11 && naoDuplicar != 46){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 15 e 24 anos, em 2011, por freguesia, Nº.' + '</strong>');
        legendaExcecao(maxPop15_24Freg11, ((maxPop15_24Freg11-minPop15_24Freg11)/2).toFixed(0),minPop15_24Freg11,0.13);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slidePop15_24Freg11();
        naoDuplicar = 46;
    }
    if (layer == Pop25_64Freg11 && naoDuplicar != 47){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 25 e 64 anos, em 2011, por freguesia, Nº.' + '</strong>');
        legendaExcecao(maxPop25_64Freg11, ((maxPop25_64Freg11-minPop25_64Freg11)/2).toFixed(0),minPop25_64Freg11,0.13);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slidePop25_64Freg11();
        naoDuplicar = 47;
    }
    if (layer == PopMais65Freg11 && naoDuplicar != 48){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade superior a 65 anos, em 2011, por freguesia, Nº.' + '</strong>');
        legendaExcecao(maxPopMais65Freg11, ((maxPopMais65Freg11-minPopMais65Freg11)/2).toFixed(0),minPopMais65Freg11,0.13);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slidePopMais65Freg11();
        naoDuplicar = 48;
    }
    if (layer == Pop0_14Freg21 && naoDuplicar != 49){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 0 e 14 anos, em 2021, por freguesia, Nº.' + '</strong>');
        legendaExcecao(maxPop0_14Freg21, ((maxPop0_14Freg21-minPop0_14Freg21)/2).toFixed(0),minPop0_14Freg21,0.13);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slidePop0_14Freg21();
        naoDuplicar = 49;
    }
    if (layer == Pop15_24Freg21 && naoDuplicar != 50){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 15 e 24 anos, em 2021, por freguesia, Nº.' + '</strong>');
        legendaExcecao(maxPop15_24Freg21, ((maxPop15_24Freg21-minPop15_24Freg21)/2).toFixed(0),minPop15_24Freg21,0.13);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slidePop15_24Freg21();
        naoDuplicar = 50;
    }
    if (layer == Pop25_64Freg21 && naoDuplicar != 51){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade entre 25 e 64 anos, em 2021, por freguesia, Nº.' + '</strong>');
        legendaExcecao(maxPop25_64Freg21, ((maxPop25_64Freg21-minPop25_64Freg21)/2).toFixed(0),minPop25_64Freg21,0.13);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slidePop25_64Freg21();
        naoDuplicar = 51;
    }
    if (layer == PopMais65Freg21 && naoDuplicar != 52){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com idade superior a 65 anos, em 2021, por freguesia, Nº.' + '</strong>');
        legendaExcecao(maxPopMais65Freg21, ((maxPopMais65Freg21-minPopMais65Freg21)/2).toFixed(0),minPopMais65Freg21,0.13);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slidePopMais65Freg21();
        naoDuplicar = 52;
    }
    if (layer == Per0_14Freg01 && naoDuplicar != 53){
        legendaPer0_14Freg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 0 e 14 anos, em 2001, por freguesia.' + '</strong>');
        slidePer0_14Freg01();
        naoDuplicar = 53;
    }
    if (layer == Per15_24Freg01 && naoDuplicar != 54){
        legendaPer15_24Freg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 15 e 24 anos, em 2001, por freguesia.' + '</strong>');
        slidePer15_24Freg01();
        naoDuplicar = 54;
    }
    if (layer == Per25_64Freg01 && naoDuplicar != 55){
        legendaPer25_64Freg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 25 e 64 anos, em 2001, por freguesia.' + '</strong>');
        slidePer25_64Freg01();
        naoDuplicar = 55;
    }
    if (layer == PerMais65Freg01 && naoDuplicar != 56){
        legendaPerMais65Freg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade superior a 65 anos, em 2001, por freguesia.' + '</strong>');
        slidePerMais65Freg01();
        naoDuplicar = 56;
    }
    if (layer == Per0_14Freg11 && naoDuplicar != 57){
        legendaPer0_14Freg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 0 e 14 anos, em 2011, por freguesia.' + '</strong>');
        slidePer0_14Freg11();
        naoDuplicar = 57;
    }
    if (layer == Per15_24Freg11 && naoDuplicar != 58){
        legendaPer15_24Freg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 15 e 24 anos, em 2011, por freguesia.' + '</strong>');
        slidePer15_24Freg11();
        naoDuplicar = 58;
    }
    if (layer == Per25_64Freg11 && naoDuplicar != 59){
        legendaPer25_64Freg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 25 e 64 anos, em 2011, por freguesia.' + '</strong>');
        slidePer25_64Freg11();
        naoDuplicar = 59;
    }
    if (layer == PerMais65Freg11 && naoDuplicar != 60){
        legendaPerMais65Freg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade superior a 65 anos, em 2011, por freguesia.' + '</strong>');
        slidePerMais65Freg11();
        naoDuplicar = 60;
    }
    if (layer == Per0_14Freg21 && naoDuplicar != 61){
        legendaPer0_14Freg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 0 e 14 anos, em 2021, por freguesia.' + '</strong>');
        slidePer0_14Freg21();
        naoDuplicar = 61;
    }
    if (layer == Per15_24Freg21 && naoDuplicar != 62){
        legendaPer15_24Freg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 15 e 24 anos, em 2021, por freguesia.' + '</strong>');
        slidePer15_24Freg21();
        naoDuplicar = 62;
    }
    if (layer == Per25_64Freg21 && naoDuplicar != 63){
        legendaPer25_64Freg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade entre 25 e 64 anos, em 2021, por freguesia.' + '</strong>');
        slidePer25_64Freg21();
        naoDuplicar = 63;
    }
    if (layer == PerMais65Freg21 && naoDuplicar != 64){
        legendaPerMais65Freg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com idade superior a 65 anos, em 2021, por freguesia.' + '</strong>');
        slidePerMais65Freg21();
        naoDuplicar = 64;
    }
    if (layer == Var0_15_11Freg && naoDuplicar != 65){
        legendaVar0_14Freg01();        
        slideVar0_15_11Freg();
        naoDuplicar = 65;
    }
    if (layer == Var15_24_11Freg && naoDuplicar != 66){
        legendaVar15_24Freg01();        
        slideVar15_24_11Freg();
        naoDuplicar = 66;
    }
    if (layer == Var25_64_11Freg && naoDuplicar != 67){
        legendaVar25_64Freg01();        
        slideVar25_64_11Freg();
        naoDuplicar = 67;
    }
    if (layer == VarMais65_11Freg && naoDuplicar != 68){
        legendaVarMais65_Freg01();        
        slideVarMais65_11Freg();
        naoDuplicar = 68;
    }
    if (layer == Var0_15_21Freg && naoDuplicar != 69){
        legendaVar0_14Freg11();        
        slideVar0_15_21Freg();
        naoDuplicar = 69;
    }
    if (layer == Var15_24_21Freg && naoDuplicar != 70){
        legendaVar15_24Freg11();        
        slideVar15_24_21Freg();
        naoDuplicar = 70;
    }
    if (layer == Var25_64_21Freg && naoDuplicar != 71){
        legendaVar25_64Freg11();        
        slideVar25_64_21Freg();
        naoDuplicar = 71;
    }
    if (layer == VarMais65_21Freg && naoDuplicar != 72){
        legendaVarMais_65Freg11();        
        slideVarMais65_21Freg();
        naoDuplicar = 72;
    }
    layer.addTo(map);
    layerAtiva = layer;  
}

let notaRodape = function(){
    if ($('#notaRodape').length){
        $('#notaRodape').html('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os dados absolutos à escala concelhia.');
    }
    else{
        $('#painel').append("<div id='notaRodape'></div>")
        $('#notaRodape').html('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os dados absolutos à escala concelhia.');
    }
}

function myFunction() {
    var ano = document.getElementById("mySelect").value;
    var grupo = document.getElementById("opcaoSelect").value;
    if ($('#concelho').hasClass('active2')){
        if ($('#absoluto').hasClass('active4')){
            $('#notaRodape').remove();
            if (ano == "1991" && grupo == "14"){
                novaLayer(Pop0_14Conc91)
            }
            if (ano == "1991" && grupo == "24"){
                novaLayer(Pop15_24Conc91)
            }
            if (ano == "1991" && grupo == "64"){
                novaLayer(Pop25_64Conc91)
            } 
            if (ano == "1991" && grupo == "65"){
                novaLayer(PopMais65Conc91)
            }
            if (ano == "2001" && grupo == "14"){
                novaLayer(Pop0_14Conc01)
            }
            if (ano == "2001" && grupo == "24"){
                novaLayer(Pop15_24Conc01)
            }
            if (ano == "2001" && grupo == "64"){
                novaLayer(Pop25_64Conc01)
            } 
            if (ano == "2001" && grupo == "65"){
                novaLayer(PopMais65Conc01)
            }
            if (ano == "2011" && grupo == "14"){
                novaLayer(Pop0_14Conc11)
            }
            if (ano == "2011" && grupo == "24"){
                novaLayer(Pop15_24Conc11)
            }
            if (ano == "2011" && grupo == "64"){
                novaLayer(Pop25_64Conc11)
            } 
            if (ano == "2011" && grupo == "65"){
                novaLayer(PopMais65Conc11)
            }
            if (ano == "2021" && grupo == "14"){
                novaLayer(Pop0_14Conc21)
            }
            if (ano == "2021" && grupo == "24"){
                novaLayer(Pop15_24Conc21)
            }
            if (ano == "2021" && grupo == "64"){
                novaLayer(Pop25_64Conc21)
            } 
            if (ano == "2021" && grupo == "65"){
                novaLayer(PopMais65Conc21)
            }
        }
        if ($('#percentagem').hasClass('active4')){
            if (ano == "1991" && grupo == "14"){
                novaLayer(Per0_14Conc91)
            }
            if (ano == "1991" && grupo == "24"){
                novaLayer(Per15_24Conc91)
            }
            if (ano == "1991" && grupo == "64"){
                novaLayer(Per25_64Conc91)
            } 
            if (ano == "1991" && grupo == "65"){
                novaLayer(PerMais65Conc91)
            }
            if (ano == "2001" && grupo == "14"){
                novaLayer(Per0_14Conc01)
            }
            if (ano == "2001" && grupo == "24"){
                novaLayer(Per15_24Conc01)
            }
            if (ano == "2001" && grupo == "64"){
                novaLayer(Per25_64Conc01)
            } 
            if (ano == "2001" && grupo == "65"){
                novaLayer(PerMais65Conc01)
            }
            if (ano == "2011" && grupo == "14"){
                novaLayer(Per0_14Conc11)
            }
            if (ano == "2011" && grupo == "24"){
                novaLayer(Per15_24Conc11)
            }
            if (ano == "2011" && grupo == "64"){
                novaLayer(Per25_64Conc11)
            } 
            if (ano == "2011" && grupo == "65"){
                novaLayer(PerMais65Conc11)
            }
            if (ano == "2021" && grupo == "14"){
                novaLayer(Per0_14Conc21)
            }
            if (ano == "2021" && grupo == "24"){
                novaLayer(Per15_24Conc21)
            }
            if (ano == "2021" && grupo == "64"){
                novaLayer(Per25_64Conc21)
            } 
            if (ano == "2021" && grupo == "65"){
                novaLayer(PerMais65Conc21)
            }
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if (ano == "2001" && grupo == "14"){
                novaLayer(Var0_15_01)
            }
            if (ano == "2001" && grupo == "24"){
                novaLayer(Var15_24_01)
            }
            if (ano == "2001" && grupo == "64"){
                novaLayer(Var25_64_01)
            } 
            if (ano == "2001" && grupo == "65"){
                novaLayer(VarMais65_01)
            }
            if (ano == "2011" && grupo == "14"){
                novaLayer(Var0_15_11)
            }
            if (ano == "2011" && grupo == "24"){
                novaLayer(Var15_24_11)
            }
            if (ano == "2011" && grupo == "64"){
                novaLayer(Var25_64_11)
            } 
            if (ano == "2011" && grupo == "65"){
                novaLayer(VarMais65_11)
            }
            if (ano == "2021" && grupo == "14"){
                novaLayer(Var0_15_21)
            }
            if (ano == "2021" && grupo == "24"){
                novaLayer(Var15_24_21)
            }
            if (ano == "2021" && grupo == "64"){
                novaLayer(Var25_64_21)
            } 
            if (ano == "2021" && grupo == "65"){
                novaLayer(VarMais65_21)
            }       
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if ($('#absoluto').hasClass('active5')){
            notaRodape();
            if (ano == "2001" && grupo == "14"){
                novaLayer(Pop0_14Freg01)
            }
            if (ano == "2001" && grupo == "24"){
                novaLayer(Pop15_24Freg01)
            }
            if (ano == "2001" && grupo == "64"){
                novaLayer(Pop25_64Freg01)
            } 
            if (ano == "2001" && grupo == "65"){
                novaLayer(PopMais65Freg01)
            }
            if (ano == "2011" && grupo == "14"){
                novaLayer(Pop0_14Freg11)
            }
            if (ano == "2011" && grupo == "24"){
                novaLayer(Pop15_24Freg11)
            }
            if (ano == "2011" && grupo == "64"){
                novaLayer(Pop25_64Freg11)
            } 
            if (ano == "2011" && grupo == "65"){
                novaLayer(PopMais65Freg11)
            }
            if (ano == "2021" && grupo == "14"){
                novaLayer(Pop0_14Freg21)
            }
            if (ano == "2021" && grupo == "24"){
                novaLayer(Pop15_24Freg21)
            }
            if (ano == "2021" && grupo == "64"){
                novaLayer(Pop25_64Freg21)
            } 
            if (ano == "2021" && grupo == "65"){
                novaLayer(PopMais65Freg21)
            } 
        }
        if ($('#percentagem').hasClass('active5')){
            $('#notaRodape').remove();
            if (ano == "2001" && grupo == "14"){
                novaLayer(Per0_14Freg01)
            }
            if (ano == "2001" && grupo == "24"){
                novaLayer(Per15_24Freg01)
            }
            if (ano == "2001" && grupo == "64"){
                novaLayer(Per25_64Freg01)
            } 
            if (ano == "2001" && grupo == "65"){
                novaLayer(PerMais65Freg01)
            }
            if (ano == "2011" && grupo == "14"){
                novaLayer(Per0_14Freg11)
            }
            if (ano == "2011" && grupo == "24"){
                novaLayer(Per15_24Freg11)
            }
            if (ano == "2011" && grupo == "64"){
                novaLayer(Per25_64Freg11)
            } 
            if (ano == "2011" && grupo == "65"){
                novaLayer(PerMais65Freg11)
            }
            if (ano == "2021" && grupo == "14"){
                novaLayer(Per0_14Freg21)
            }
            if (ano == "2021" && grupo == "24"){
                novaLayer(Per15_24Freg21)
            }
            if (ano == "2021" && grupo == "64"){
                novaLayer(Per25_64Freg21)
            } 
            if (ano == "2021" && grupo == "65"){
                novaLayer(PerMais65Freg21)
            }
        }
        if ($('#taxaVariacao').hasClass('active5')){
            $('#notaRodape').remove();
            if (ano == "2011" && grupo == "14"){
                novaLayer(Var0_15_11Freg)
            }
            if (ano == "2011" && grupo == "24"){
                novaLayer(Var15_24_11Freg)
            }
            if (ano == "2011" && grupo == "64"){
                novaLayer(Var25_64_11Freg)
            } 
            if (ano == "2011" && grupo == "65"){
                novaLayer(VarMais65_11Freg)
            }
            if (ano == "2021" && grupo == "14"){
                novaLayer(Var0_15_21Freg)
            }
            if (ano == "2021" && grupo == "24"){
                novaLayer(Var15_24_21Freg)
            }
            if (ano == "2021" && grupo == "64"){
                novaLayer(Var25_64_21Freg)
            } 
            if (ano == "2021" && grupo == "65"){
                novaLayer(VarMais65_21Freg)
            }            
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

let reporAnos = function(){
    $('select option:contains("2021")').text('2021');
    $('select option:contains("2011")').text('2011');
    if ($('#concelho').hasClass('active2')){
        $('select option:contains("2001")').text('2001');
        if ($("#mySelect option[value='1991']").length == 0){
            $("#mySelect option").eq(0).before($("<option></option>").val("1991").text("1991"));
        }
        else{
            $('select option:contains("1991")').text('1991');
        }
        primeirovalor('1991','14');
    }
    if ($('#freguesias').hasClass('active2')){
        if ($("#mySelect option[value='1991']").length > 0){
            $("#mySelect option[value='1991']").remove();
        }
        if ($("#mySelect option[value='2001']").length ==  0){
            $("#mySelect option").eq(0).before($("<option></option>").val("2001").text("2001"));
        }
        $('select option:contains("2001")').text('2001');
        primeirovalor('2001','14');
    }
}

let reporAnosVariacao = function(){
    if ($('#taxaVariacao').hasClass('active4')){
        $("#mySelect option[value='1991']").remove();
        if ($("#mySelect option[value='2001']").length == 0){
            $("#mySelect option").eq(0).before($("<option></option>").val("2001").text("2001 - 1991"));
        }
        else{
            $('select option:contains("2001")').text('2001 - 1991');
        }
        $('select option:contains("2011")').text('2011 - 2001');
        $('select option:contains("2021")').text('2021 - 2011');
        primeirovalor('2001','14');

    }
    if ($('#taxaVariacao').hasClass('active5')){
        $("#mySelect option[value='1991']").remove();
        $("#mySelect option[value='2001']").remove();
        $('select option:contains("2011")').text('2011 - 2001');
        $('select option:contains("2021")').text('2021 - 2011');
        primeirovalor('2011','14');
    }
}


let primeirovalor = function(ano,tipo){
    $("#mySelect").val(ano);
    $("#opcaoSelect").val(tipo);
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
$('#absoluto').click(function(){
    reporAnos();
    tamanhoOutros();  
    fonteTitulo('N');
});
$('#percentagem').click(function(){
    reporAnos();
    tamanhoOutros();  
    fonteTitulo('F');
});
$('#taxaVariacao').click(function(){
    reporAnosVariacao();
    tamanhoOutros();  
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
function mudarEscala(){
    reporAnos();
    if ($('#concelho').hasClass('active2')){
        primeirovalor('1991','14');
    }
    if ($('#freguesias').hasClass('active2')){
        primeirovalor('2001','14');
    }
    tamanhoOutros();
    fonteTitulo('N');
}
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
let anosSelecionados = function() {
    let ano = document.getElementById("mySelect").value;
    if ($('#concelho').hasClass("active2")){
        if ($('#percentagem').hasClass('active4') || $('#absoluto').hasClass('active4')){
            if (ano != "2021" || ano != "1991"){
            i = 1
            }
            if (ano == "2021"){
                i = $('#mySelect').children('option').length - 1 ;
            }
            if (ano == "1991"){
                i = 0;
            }
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if (ano != "2021" || ano != "2001"){
                i = 1;
            }
            if (ano == "2021"){
                i = $('#mySelect').children('option').length - 1 ;
            }
            if (ano == "2001"){
                i = 0;
            }
        }
    } 
    if ($('#freguesias').hasClass("active2")){
        if ($('#percentagem').hasClass('active5') || $('#absoluto').hasClass('active5')){
            if (ano != "2021" || ano != "2001"){
            i = 1
            }
            if (ano == "2021"){
                i = $('#mySelect').children('option').length - 1 ;
            }
            if (ano == "2001"){
                i = 0;
            }
        }
        if ($('#taxaVariacao').hasClass('active5')){
            if (ano == "2021"){
                i = 1 ;
            }
            if (ano == "2011"){
                i = 0;
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

    $('#tabelaVariacao').attr("class","btn");
    $('#tabelaPercentagem').attr("class","btn");
    $('#tabelaDadosAbsolutos').attr("class","btn");
    
    $('#filtrar').css("visibility","visible");
    $('#escalasConcelho').css("visibility","visible"); 
    $('#geralEscalas').css("visibility","visible");
    $('#legendaA').css("visibility","visible"); 
    $('#variavel').css("visibility","visible");
    $('#tituloMapa').css("visibility","visible");
    $('.ine').css("visibility","visible");

    $('#concelho').attr("class", "butaoEscala  EscalasTerritoriais active2")
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
    $('#tabelaDadosAbsolutos').attr("class","btn active1");
    DadosAbsolutosTipoAlojamento();
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
    $('#notaRodape').remove();
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


    $('#concelho').attr("class", "butaoEscala EscalasTerritoriais");
    $('#freguesias').attr('class',"butaoEscala EscalasTerritoriais");
    $('.btn').css("top","10%");

});
function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }
var DadosAbsolutosTipoAlojamento = function(){
    $('#tituloMapa').html('Número de residentes, por grupo etário, entre 1991 e 2021, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/GrupoEtarioProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#1991').html("1991");
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.GrupoEtario == "Mais de 65 anos" || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom ">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom  negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom ">'+value.GrupoEtario+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS1991.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2011.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2021.toLocaleString("fr")+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.GrupoEtario+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS1991.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2011.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2021.toLocaleString("fr")+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})};
$('#tabelaDadosAbsolutos').click(function(){
    DadosAbsolutosTipoAlojamento();;   
});

$('#tabelaVariacao').click(function(){
    $('#tituloMapa').html('Variação do número de residentes, por grupo etário, entre 1991 e 2021, %');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/GrupoEtarioProv.json", function(data){
            $('#juntarValores').empty();
            $('#1991').html(" ")
            var dados = '';
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.GrupoEtario == "Mais de 65 anos" || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom ">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom  negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom ">'+value.GrupoEtario+'</td>';;
                    dados += '<td class="borderbottom ">'+ ' '+'</td>';
                    dados += '<td class="borderbottom ">'+value.VAR0191+'</td>';
                    dados += '<td class="borderbottom ">'+value.VAR1101+'</td>';
                    dados += '<td class="borderbottom ">'+value.VAR2111+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Freguesia+'</td>';
                    dados += '<td>'+value.GrupoEtario+'</td>';
                    dados += '<td>'+ ' '+'</td>';
                    dados += '<td>'+value.VAR0191+'</td>';
                    dados += '<td>'+value.VAR1101+'</td>';
                    dados += '<td>'+value.VAR2111+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados); 
    });
    });
});

$('#tabelaPercentagem').click(function(){
    $('#1991').html("1991")
    $('#tituloMapa').html('Proporção do número de residentes, por grupo etário, entre 1991 e 2021, %');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/GrupoEtarioProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.GrupoEtario == "Mais de 65 anos" || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom borderbottom negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom borderbottom">'+value.GrupoEtario+'</td>';;
                    dados += '<td class="borderbottom">'+value.Per91+'</td>';
                    dados += '<td class="borderbottom">'+value.Per01+'</td>';
                    dados += '<td class="borderbottom">'+value.Per11+'</td>';
                    dados += '<td class="borderbottom">'+value.Per21+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.GrupoEtario+'</td>';;
                    dados += '<td class="borderbottom">'+value.Per91+'</td>';
                    dados += '<td class="borderbottom">'+value.Per01+'</td>';
                    dados += '<td class="borderbottom">'+value.Per11+'</td>';
                    dados += '<td class="borderbottom">'+value.Per21+'</td>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});

const opcoesAnos = $('#mySelect');      
$('#next').click(function(){
    anosSelecionados();
    if ($('#freguesias').hasClass("active2")){
        if (i !== $('#mySelect').children('option').length - 1) {
            opcoesAnos.find('option:selected').next().prop('selected', true);
            myFunction();
            i += 1
        }
        if(i === 0 ){
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
    if ($('#freguesias').hasClass("active2") ||$('#concelho').hasClass("active2")){
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
