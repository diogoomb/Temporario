
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'

$('#temporal').css("padding-top","0px")
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
///// --- Adicionar Layer dos Concelhos -----\\\\
function layerContorno() {
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.3,
        linejoin: 'round',
        fillColor:'rgb(204,204,204)'};
    }
var contorno = L.geoJSON(contornoAmp,{
    style:layerContorno,
});

///// ---- Fim layer Concelhos --- \\\\

///// --- Adicionar Layer das Freguesias -----\\\\
var contornoFreg = L.geoJSON(contornoFreguesias,{
    style:layerContorno,
});

var contornoFreg2001 =L.geoJSON(freguesiasRelativos2001,{
    style:layerContorno,
});

var contornoConcelhos1991 =L.geoJSON(concelhosRelativos1991,{
    style:layerContorno,
});
///// ---- Fim layer Freguesias --- \\\\
//// ---- Botão de aproximar e diminuir a escala e voltar ao zoom inicial---- \\\\\
var zoomHome = L.Control.zoomHome({
    position:'topleft',
    zoomHomeTitle: 'Zoom Inicial',
    zoomInTitle: 'Aumentar',
    zoomOutTitle: 'Diminuir'
}).addTo(map);
L.control.scale({
    imperial:false,
///    maxWidth:100, TAMANHO DA ESCALA
}).addTo(map);



contornoConcelhos1991.addTo(map);
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
/////Buscar os ID'S todos \\\\\

let space = document.getElementById("space");
let opcoesTabela = document.getElementById('opcoesTabela');
let escalasConcelho = document.getElementById('escalasConcelho');
let escalasFreguesia = document.getElementById('escalasFreguesias');
let absolutoFreguesia = document.getElementById('absolutoFreguesia');
let percentagemFreguesia = document.getElementById('percentagemFreguesia');
let myDIV = document.getElementById('myDIV');
let legendaA= document.getElementById('legendaA');
var ifSlide2isActive = 53;
let slidersGeral = document.getElementById('slidersGeral');
let inputNumberMin = document.getElementById('input-number-min');
let inputNumberMax = document.getElementById('input-number-max');
let esconderano2001 = document.getElementById('2001');




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

var LegendaVariacoes = function(titulo, minimo, maximo, gradiente) {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'divGradiente'
    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>");
    $(symbolsContainer).append("<div id='vazio'></div>");
    $(symbolsContainer).append("<div id='minimo'>"+ minimo + "</div>");
    $(symbolsContainer).append("<div id='grad1'></div>");
    $(symbolsContainer).append("<div id='maximo'>" + '+' + maximo + "</div>");

    var conta;
    var left;

    $(legendaA).append(symbolsContainer); 
    conta = maximo - minimo
    valorCorreto = 0 - minimo
    left = (valorCorreto * 100) / conta 
    $('#grad1').append("<div id='barra'></div>");
    $('#barra').append("<div class='zero'></div>");
    $('.zero').html("0");
    $('#grad1').css("background",gradiente);
    $('#barra').css("left",left + "%")
    $(legendaA).append(symbolsContainer); 

}
var min = 0;
var max = 0;
function estilototalAlojamentos21(feature, latlng) {
    if(feature.properties.TipoTot21< min || min ===0){
        min = feature.properties.TipoTot21
    }
    if(feature.properties.TipoTot21> max){
        max = feature.properties.TipoTot21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.TipoTot21,0.1)
    });
}
function apagartotalAlojamentos21(e){
    var layer = e.target;
    totalAlojamentos21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalAlojamentos21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.TipoTot21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagartotalAlojamentos21,
    })
};

var totalAlojamentos21= L.geoJSON(tipoAlojamentoConcelho,{
    pointToLayer:estilototalAlojamentos21,
    onEachFeature: onEachFeatureTotalAlojamentos21,
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


var sliderAtivo = null

var slideTotalAlojamentos21 = function(){
    var sliderTotalAlojamentos21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalAlojamentos21, {
        start: [min, max],
        tooltips:true,
        connect: true,
        range: {
            'min': min,
            'max': max
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",min);
    inputNumberMax.setAttribute("value",max);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalAlojamentos21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalAlojamentos21.noUiSlider.set([null, this.value]);
    });

    sliderTotalAlojamentos21.noUiSlider.on('update',function(e){
        totalAlojamentos21.eachLayer(function(layer){
            if(layer.feature.properties.TipoTot21>=parseFloat(e[0])&& layer.feature.properties.TipoTot21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalAlojamentos21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderTotalAlojamentos21.noUiSlider;
    $(slidersGeral).append(sliderTotalAlojamentos21);
}



///// FIM Número Total de Alojamentos em 2021 \\\\\\

///// Número Total de Alojamentos de Concelhos em 2011 \\\\\
var totalAlojamentos11Concelhos;

var minTotalAlojamentos11Concelhos = 0;
var maxTotalAlojamentos11Concelhos = 0;
function estiloTotalAlojamentos11Concelhos(feature, latlng) {
    if(feature.properties.TipoTot11< minTotalAlojamentos11Concelhos || minTotalAlojamentos11Concelhos ===0){
        minTotalAlojamentos11Concelhos = feature.properties.TipoTot11
    }
    if(feature.properties.TipoTot11> maxTotalAlojamentos11Concelhos){
        maxTotalAlojamentos11Concelhos = feature.properties.TipoTot11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.TipoTot11,0.1)
    });
}
function apagarTotalAlojamentos11Concelhos(e){
    var layer = e.target;
    totalAlojamentos11Concelhos.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotalAlojamentos11Concelhos(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.TipoTot11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalAlojamentos11Concelhos,
    })
};


totalAlojamentos11Concelhos= L.geoJSON(tipoAlojamentoConcelho,{
    pointToLayer:estiloTotalAlojamentos11Concelhos,
    onEachFeature: onEachFeatureTotalAlojamentos11Concelhos,
});


var slidetotalAlojamentos11Concelhos = function(){
    var slidertotalAlojamentos11Concelhos = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    }

    noUiSlider.create(slidertotalAlojamentos11Concelhos, {
        start: [minTotalAlojamentos11Concelhos, maxTotalAlojamentos11Concelhos],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalAlojamentos11Concelhos,
            'max': maxTotalAlojamentos11Concelhos
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalAlojamentos11Concelhos);
    inputNumberMax.setAttribute("value",maxTotalAlojamentos11Concelhos);

    inputNumberMin.addEventListener('change', function(){
        slidertotalAlojamentos11Concelhos.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        slidertotalAlojamentos11Concelhos.noUiSlider.set([null, this.value]);
    });

    slidertotalAlojamentos11Concelhos.noUiSlider.on('update',function(e){
        totalAlojamentos11Concelhos.eachLayer(function(layer){
            if(layer.feature.properties.TipoTot11>=parseFloat(e[0])&& layer.feature.properties.TipoTot11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        slidertotalAlojamentos11Concelhos.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 6;
    sliderAtivo = slidertotalAlojamentos11Concelhos.noUiSlider;
    $(slidersGeral).append(slidertotalAlojamentos11Concelhos);
}


////// ---- Fim  Número Total de Alojamentos de Concelhos em 2011 -----\\\\

///// ---- Número Total de Alojamentos em 2001 ----- Concelhos \\\\\\\
var totalAlojamentos01Concelhos;

var minTotalAlojamentos01Concelhos = 0;
var maxTotalAlojamentos01Concelhos = 0;
function estiloTotalAlojamentos01Concelhos(feature, latlng) {
    if(feature.properties.TipoTot01< minTotalAlojamentos01Concelhos || minTotalAlojamentos01Concelhos ===0){
        minTotalAlojamentos01Concelhos = feature.properties.TipoTot01
    }
    if(feature.properties.TipoTot01> maxTotalAlojamentos01Concelhos){
        maxTotalAlojamentos01Concelhos = feature.properties.TipoTot01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.TipoTot01,0.1)
    });
}
function apagarTotalAlojamentos01Concelhos(e){
    var layer = e.target;
    totalAlojamentos01Concelhos.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalAlojamentos01Concelhos(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.TipoTot01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalAlojamentos01Concelhos,
    })
};


totalAlojamentos01Concelhos= L.geoJSON(tipoAlojamentoConcelho,{
    pointToLayer:estiloTotalAlojamentos01Concelhos,
    onEachFeature: onEachFeatureTotalAlojamentos01Concelhos,
});


var slidetotalAlojamentos01Concelhos = function(){
    var slidertotalAlojamentos01Concelhos = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 52){
        sliderAtivo.destroy();
    }

    noUiSlider.create(slidertotalAlojamentos01Concelhos, {
        start: [minTotalAlojamentos01Concelhos, maxTotalAlojamentos01Concelhos],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalAlojamentos01Concelhos,
            'max': maxTotalAlojamentos01Concelhos
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalAlojamentos01Concelhos);
    inputNumberMax.setAttribute("value",maxTotalAlojamentos01Concelhos);

    inputNumberMin.addEventListener('change', function(){
        slidertotalAlojamentos01Concelhos.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        slidertotalAlojamentos01Concelhos.noUiSlider.set([null, this.value]);
    });

    slidertotalAlojamentos01Concelhos.noUiSlider.on('update',function(e){
        totalAlojamentos01Concelhos.eachLayer(function(layer){
            if(layer.feature.properties.TipoTot01>=parseFloat(e[0])&& layer.feature.properties.TipoTot01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        slidertotalAlojamentos01Concelhos.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 52;
    sliderAtivo = slidertotalAlojamentos01Concelhos.noUiSlider;
    $(slidersGeral).append(slidertotalAlojamentos01Concelhos);
}
////// -- Fim do Número Total de Alojamentos em 2001 - Concelhos \\\\\\\\\\\\\\\\

/////// ----- Número Total de Alojamentos em 1991 --- Concelhos \\\\\
var totalAlojamentos91Concelhos;

var minTotalAlojamentos91Concelhos = 0;
var maxTotalAlojamentos91Concelhos = 0;
function estiloTotalAlojamentos91Concelhos(feature, latlng) {
    if(feature.properties.TipoTot91< minTotalAlojamentos91Concelhos || minTotalAlojamentos91Concelhos ===0){
        minTotalAlojamentos91Concelhos = feature.properties.TipoTot91
    }
    if(feature.properties.TipoTot91> maxTotalAlojamentos91Concelhos){
        maxTotalAlojamentos91Concelhos = feature.properties.TipoTot91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.TipoTot91,0.1)
    });
}
function apagarTotalAlojamentos91Concelhos(e){
    var layer = e.target;
    totalAlojamentos91Concelhos.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotalAlojamentos91Concelhos(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.TipoTot91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalAlojamentos91Concelhos,
    })
};


totalAlojamentos91Concelhos= L.geoJSON(concelhosAbsolutos1991,{
    pointToLayer:estiloTotalAlojamentos91Concelhos,
    onEachFeature: onEachFeatureTotalAlojamentos91Concelhos,
});


var slidetotalAlojamentos91Concelhos = function(){
    var slidertotalAlojamentos91Concelhos = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 53){
        sliderAtivo.destroy();
    }

    noUiSlider.create(slidertotalAlojamentos91Concelhos, {
        start: [minTotalAlojamentos91Concelhos, maxTotalAlojamentos91Concelhos],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalAlojamentos91Concelhos,
            'max': maxTotalAlojamentos91Concelhos
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalAlojamentos91Concelhos);
    inputNumberMax.setAttribute("value",maxTotalAlojamentos91Concelhos);

    inputNumberMin.addEventListener('change', function(){
        slidertotalAlojamentos91Concelhos.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        slidertotalAlojamentos91Concelhos.noUiSlider.set([null, this.value]);
    });

    slidertotalAlojamentos91Concelhos.noUiSlider.on('update',function(e){
        totalAlojamentos91Concelhos.eachLayer(function(layer){
            if(layer.feature.properties.TipoTot91>=parseFloat(e[0])&& layer.feature.properties.TipoTot91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        slidertotalAlojamentos91Concelhos.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 53;
    sliderAtivo = slidertotalAlojamentos91Concelhos.noUiSlider;
    $(slidersGeral).append(slidertotalAlojamentos91Concelhos);
}

totalAlojamentos91Concelhos.addTo(map);
legenda(maxTotalAlojamentos91Concelhos,Math.round((maxTotalAlojamentos91Concelhos-minTotalAlojamentos91Concelhos)/2),minTotalAlojamentos91Concelhos,0.1);
slidetotalAlojamentos91Concelhos();

//// Número de Alojamentos Familiares  em 2021 \\\\\\
var AlojamentosFamiliares2021;

var minAlojaFam2021 = 0;
var maxAlojaFam2021 = 0;

function estiloAlojamentosFamiliares2021(feature, latlng) {
    if(feature.properties.AlojFami21< minAlojaFam2021 || minAlojaFam2021 ===0){
        minAlojaFam2021 = feature.properties.AlojFami21
    }
    if(feature.properties.AlojFami21> maxAlojaFam2021){
        maxAlojaFam2021 = feature.properties.AlojFami21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlojFami21,0.1)
    });
}
function apagarAlojamentosFamiliares2021(e){
    var layer = e.target;
    AlojamentosFamiliares2021.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAlojamentosFamiliares2021(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos Familiares: ' + '<b>' +feature.properties.AlojFami21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojamentosFamiliares2021,
    })
};

AlojamentosFamiliares2021= L.geoJSON(tipoAlojamentoConcelho,{
    pointToLayer:estiloAlojamentosFamiliares2021,
    onEachFeature: onEachFeatureAlojamentosFamiliares2021,
});


var slideAlojamentosFamiliares2021 = function(){
    var sliderAlojamentosFamiliares2021 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojamentosFamiliares2021, {
        start: [minAlojaFam2021, maxAlojaFam2021],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojaFam2021,
            'max': maxAlojaFam2021
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojaFam2021);
    inputNumberMax.setAttribute("value",maxAlojaFam2021);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojamentosFamiliares2021.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojamentosFamiliares2021.noUiSlider.set([null, this.value]);
    });

    sliderAlojamentosFamiliares2021.noUiSlider.on('update',function(e){
        AlojamentosFamiliares2021.eachLayer(function(layer){
            if(layer.feature.properties.AlojFami21>=parseFloat(e[0])&& layer.feature.properties.AlojFami21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojamentosFamiliares2021.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderAlojamentosFamiliares2021.noUiSlider;
    $(slidersGeral).append(sliderAlojamentosFamiliares2021);
}

////// ---- Fim Número Alojamentos Familiares por Concelho 2021 -----\\\\

//// Número de Alojamentos Familiares em 2011 \\\\\\
var AlojamentosFamiliares2011;

var minAlojamentosFamiliares11 = 0;
var maxAlojamentosFamiliares11 = 0;
function estiloAlojamentosFamiliares2011(feature, latlng) {
    if(feature.properties.AlojFami11< minAlojamentosFamiliares11 || minAlojamentosFamiliares11 ===0){
        minAlojamentosFamiliares11 = feature.properties.AlojFami11
    }
    if(feature.properties.AlojFami11> maxAlojamentosFamiliares11){
        maxAlojamentosFamiliares11 = feature.properties.AlojFami11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlojFami11,0.1)
    });
}
function apagarAlojamentosFamiliares2011(e){
    var layer = e.target;
    AlojamentosFamiliares2011.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureAlojamentosFamiliares2011(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.AlojFami11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojamentosFamiliares2011,
    })
};

AlojamentosFamiliares2011= L.geoJSON(tipoAlojamentoConcelho,{
    pointToLayer:estiloAlojamentosFamiliares2011,
    onEachFeature: onEachFeatureAlojamentosFamiliares2011,
});


var slideAlojamentosFamiliares2011 = function(){
    var sliderAlojamentosFamiliares2011 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojamentosFamiliares2011, {
        start: [minAlojamentosFamiliares11, maxAlojamentosFamiliares11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojamentosFamiliares11,
            'max': maxAlojamentosFamiliares11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojamentosFamiliares11);
    inputNumberMax.setAttribute("value",maxAlojamentosFamiliares11);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojamentosFamiliares2011.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojamentosFamiliares2011.noUiSlider.set([null, this.value]);
    });

    sliderAlojamentosFamiliares2011.noUiSlider.on('update',function(e){
        AlojamentosFamiliares2011.eachLayer(function(layer){
            if(layer.feature.properties.AlojFami11>=parseFloat(e[0])&& layer.feature.properties.AlojFami11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAlojamentosFamiliares2011.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderAlojamentosFamiliares2011.noUiSlider;
    $(slidersGeral).append(sliderAlojamentosFamiliares2011);
}

///// Fim Número de Alojamentos Familiares em 2011 por Concelho \\\\\\

//// Número de Alojamentos Familiares  em 2001  por Concelho \\\\\\
var AlojamentosFamiliares01;

var minAlojaFam01 = 0;
var maxAlojaFam01 = 0;

function estiloAlojamentosFamiliares01(feature, latlng) {
    if(feature.properties.AlojFami01< minAlojaFam01 || minAlojaFam01 ===0){
        minAlojaFam01 = feature.properties.AlojFami01
    }
    if(feature.properties.AlojFami01> maxAlojaFam01){
        maxAlojaFam01 = feature.properties.AlojFami01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlojFami01,0.1)
    });
}
function apagarAlojamentosFamiliares01(e){
    var layer = e.target;
    AlojamentosFamiliares01.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureAlojamentosFamiliares01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos Familiares: ' + '<b>' +feature.properties.AlojFami01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojamentosFamiliares01,
    })
};


AlojamentosFamiliares01= L.geoJSON(tipoAlojamentoConcelho,{
    pointToLayer:estiloAlojamentosFamiliares01,
    onEachFeature: onEachFeatureAlojamentosFamiliares01,
});


var slideAlojamentosFamiliares01 = function(){
    var sliderAlojamentosFamiliares01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 54){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojamentosFamiliares01, {
        start: [minAlojaFam01, maxAlojaFam01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojaFam01,
            'max': maxAlojaFam01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojaFam01);
    inputNumberMax.setAttribute("value",maxAlojaFam01);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojamentosFamiliares01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojamentosFamiliares01.noUiSlider.set([null, this.value]);
    });

    sliderAlojamentosFamiliares01.noUiSlider.on('update',function(e){
        AlojamentosFamiliares01.eachLayer(function(layer){
            if(layer.feature.properties.AlojFami01>=parseFloat(e[0])&& layer.feature.properties.AlojFami01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojamentosFamiliares01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 54;
    sliderAtivo = sliderAlojamentosFamiliares01.noUiSlider;
    $(slidersGeral).append(sliderAlojamentosFamiliares01);
}
////// --- Fim Número de Alojamentos Familiares em 2001 --- Concelhos \\\\\

//// Número de Alojamentos Familiares  em 1991  por Concelho \\\\\\
var AlojamentosFamiliares91;

var minAlojaFam91 = 0;
var maxAlojaFam91 = 0;

function estiloAlojamentosFamiliares91(feature, latlng) {
    if(!feature.properties.AlojFami91){
        feature.properties.AlojFami91 = "sem dados"}
    if(feature.properties.AlojFami91< minAlojaFam91 || minAlojaFam91 ===0){
        minAlojaFam91 = feature.properties.AlojFami91
    }
    if(feature.properties.AlojFami91> maxAlojaFam91){
        maxAlojaFam91 = feature.properties.AlojFami91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlojFami91,0.1)
    });
}
function apagarAlojamentosFamiliares91(e){
    var layer = e.target;
    AlojamentosFamiliares91.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureAlojamentosFamiliares91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos Familiares: ' + '<b>' +feature.properties.AlojFami91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojamentosFamiliares91,
    })
};

AlojamentosFamiliares91= L.geoJSON(concelhosAbsolutos1991,{
    pointToLayer:estiloAlojamentosFamiliares91,
    onEachFeature: onEachFeatureAlojamentosFamiliares91,
});


var slideAlojamentosFamiliares91 = function(){
    var sliderAlojamentosFamiliares91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 55){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojamentosFamiliares91, {
        start: [minAlojaFam91, maxAlojaFam91],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojaFam91,
            'max': maxAlojaFam91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojaFam91);
    inputNumberMax.setAttribute("value",maxAlojaFam91);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojamentosFamiliares91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojamentosFamiliares91.noUiSlider.set([null, this.value]);
    });

    sliderAlojamentosFamiliares91.noUiSlider.on('update',function(e){
        AlojamentosFamiliares91.eachLayer(function(layer){
            if(layer.feature.properties.AlojFami91>=parseFloat(e[0])&& layer.feature.properties.AlojFami91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojamentosFamiliares91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 55;
    sliderAtivo = sliderAlojamentosFamiliares91.noUiSlider;
    $(slidersGeral).append(sliderAlojamentosFamiliares91);
}
////// --- Fim Número de Alojamentos Familiares em 1991 --- Concelhos \\\\\

//////------- Número de Alojamentos Familiares Clássicos em 2021 por Concelho -----////
var minAlojFamiClass21 = 0;
var maxAlojFamiClass21 = 0;;
function estiloalojaFamClass2021(feature, latlng) {
    if(feature.properties.AlClassi21< minAlojFamiClass21 || minAlojFamiClass21 ===0){
        minAlojFamiClass21 = feature.properties.AlClassi21
    }
    if(feature.properties.AlClassi21> maxAlojFamiClass21){
        maxAlojFamiClass21 = feature.properties.AlClassi21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlClassi21,0.1)
    });
}
function apagaralojaFamClass2021(e){
    var layer = e.target;
    alojaFamClass2021.resetStyle(layer)
    layer.closePopup();
}

function onEachFeaturealojaFamClass2021(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.AlClassi21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagaralojaFamClass2021,
    })
};


alojaFamClass2021= L.geoJSON(tipoAlojamentoConcelho,{
    pointToLayer:estiloalojaFamClass2021,
    onEachFeature: onEachFeaturealojaFamClass2021,
});


var slidealojaFamClass2021 = function(){
    var slideralojaFamClass2021 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    }

    noUiSlider.create(slideralojaFamClass2021, {
        start: [minAlojFamiClass21, maxAlojFamiClass21],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiClass21,
            'max': maxAlojFamiClass21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojFamiClass21);
    inputNumberMax.setAttribute("value",maxAlojFamiClass21);

    inputNumberMin.addEventListener('change', function(){
        slideralojaFamClass2021.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        slideralojaFamClass2021.noUiSlider.set([null, this.value]);
    });

    slideralojaFamClass2021.noUiSlider.on('update',function(e){
        alojaFamClass2021.eachLayer(function(layer){
            if(layer.feature.properties.AlClassi21>=parseFloat(e[0])&& layer.feature.properties.AlClassi21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    slideralojaFamClass2021.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = slideralojaFamClass2021.noUiSlider;
    $(slidersGeral).append(slideralojaFamClass2021);
}


///// Fim dos Alojamentos Familiares Clássicos em 2021-------------- \\\\\\


///// ------------- Alojamentos Familiares Clássicos em 2011-------------- \\\\\\

var minAlojFamiClass11 = 0;
var maxAlojFamiClass11 = 0;;
function estiloalojaFamClass2011(feature, latlng) {
    if(feature.properties.AlClassi11< minAlojFamiClass11 || minAlojFamiClass11 ===0){
        minAlojFamiClass11 = feature.properties.AlClassi11
    }
    if(feature.properties.AlClassi11> maxAlojFamiClass11){
        maxAlojFamiClass11 = feature.properties.AlClassi11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlClassi11,0.1)
    });
}
function apagaralojaFamClass2011(e){
    var layer = e.target;
    alojaFamClass2011.resetStyle(layer)
    layer.closePopup();
}

function onEachFeaturealojaFamClass2011(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.AlClassi11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagaralojaFamClass2011,
    })
};

var alojaFamClass2011= L.geoJSON(tipoAlojamentoConcelho,{
    pointToLayer:estiloalojaFamClass2011,
    onEachFeature: onEachFeaturealojaFamClass2011,
});


var slidealojaFamClass2011 = function(){
    var slideralojaFamClass2011 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    }

    noUiSlider.create(slideralojaFamClass2011, {
        start: [minAlojFamiClass11, maxAlojFamiClass11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiClass11,
            'max': maxAlojFamiClass11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojFamiClass11);
    inputNumberMax.setAttribute("value",maxAlojFamiClass11);

    inputNumberMin.addEventListener('change', function(){
        slideralojaFamClass2011.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        slideralojaFamClass2011.noUiSlider.set([null, this.value]);
    });

    slideralojaFamClass2011.noUiSlider.on('update',function(e){
        alojaFamClass2011.eachLayer(function(layer){
            if(layer.feature.properties.AlClassi11>=parseFloat(e[0])&& layer.feature.properties.AlClassi11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    slideralojaFamClass2011.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = slideralojaFamClass2011.noUiSlider;
    $(slidersGeral).append(slideralojaFamClass2011);
}
///// ------------- Fim Alojamentos Familiares Clássicos em 2011-------------- \\\\\\


///// ------------- Alojamentos Familiares Clássicos em 2001-------------- \\\\\\

var minAlojFamiClass01 = 0;
var maxAlojFamiClass01 = 0;;
function estiloalojaFamClass2001(feature, latlng) {
    if(feature.properties.AlClassi01< minAlojFamiClass01 || minAlojFamiClass01 ===0){
        minAlojFamiClass01 = feature.properties.AlClassi01
    }
    if(feature.properties.AlClassi01> maxAlojFamiClass01){
        maxAlojFamiClass01 = feature.properties.AlClassi01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlClassi01,0.1)
    });
}
function apagaralojaFamClass2001(e){
    var layer = e.target;
    alojaFamClass2001.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturealojaFamClass2001(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.AlClassi01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagaralojaFamClass2001,
    })
};


var alojaFamClass2001= L.geoJSON(tipoAlojamentoConcelho,{
    pointToLayer:estiloalojaFamClass2001,
    onEachFeature: onEachFeaturealojaFamClass2001,
});


var slidealojaFamClass2001 = function(){
    var slideralojaFamClass2001 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 56){
        sliderAtivo.destroy();
    }

    noUiSlider.create(slideralojaFamClass2001, {
        start: [minAlojFamiClass01, maxAlojFamiClass01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiClass01,
            'max': maxAlojFamiClass01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojFamiClass01);
    inputNumberMax.setAttribute("value",maxAlojFamiClass01);

    inputNumberMin.addEventListener('change', function(){
        slideralojaFamClass2001.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        slideralojaFamClass2001.noUiSlider.set([null, this.value]);
    });

    slideralojaFamClass2001.noUiSlider.on('update',function(e){
        alojaFamClass2001.eachLayer(function(layer){
            if(layer.feature.properties.AlClassi01>=parseFloat(e[0])&& layer.feature.properties.AlClassi01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    slideralojaFamClass2001.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 56;
    sliderAtivo = slideralojaFamClass2001.noUiSlider;
    $(slidersGeral).append(slideralojaFamClass2001);
}
///// ------------- Fim Alojamentos Familiares Clássicos em 2001-------------- \\\\\\

///// ------------- Alojamentos Familiares Clássicos em 1991-------------- \\\\\\

var minAlojFamiClass91 = 0;
var maxAlojFamiClass91 = 0;;
function estiloalojaFamClass91(feature, latlng) {
    if(!feature.properties.AlClassi91){
        feature.properties.AlClassi91 = "sem dados"}
    if(feature.properties.AlClassi91< minAlojFamiClass91 || minAlojFamiClass91 ===0){
        minAlojFamiClass91 = feature.properties.AlClassi91
    }
    if(feature.properties.AlClassi91> maxAlojFamiClass91){
        maxAlojFamiClass91 = feature.properties.AlClassi91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlClassi91,0.1)
    });
}
function apagaralojaFamClass91(e){
    var layer = e.target;
    alojaFamClass91.resetStyle(layer)
    layer.closePopup();
}

function onEachFeaturealojaFamClass91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.AlClassi91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagaralojaFamClass91,
    })
};

var alojaFamClass91= L.geoJSON(concelhosAbsolutos1991,{
    pointToLayer:estiloalojaFamClass91,
    onEachFeature: onEachFeaturealojaFamClass91,
});


var slidealojaFamClass91 = function(){
    var slideralojaFamClass91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 57){
        sliderAtivo.destroy();
    }

    noUiSlider.create(slideralojaFamClass91, {
        start: [minAlojFamiClass91, maxAlojFamiClass91],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiClass91,
            'max': maxAlojFamiClass91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojFamiClass91);
    inputNumberMax.setAttribute("value",maxAlojFamiClass91);

    inputNumberMin.addEventListener('change', function(){
        slideralojaFamClass91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        slideralojaFamClass91.noUiSlider.set([null, this.value]);
    });

    slideralojaFamClass91.noUiSlider.on('update',function(e){
        alojaFamClass91.eachLayer(function(layer){
            if(layer.feature.properties.AlClassi91>=parseFloat(e[0])&& layer.feature.properties.AlClassi91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    slideralojaFamClass91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 57;
    sliderAtivo = slideralojaFamClass91.noUiSlider;
    $(slidersGeral).append(slideralojaFamClass91);
}
///// ------------- Fim Alojamentos Familiares Clássicos em 1991-------------- \\\\\\





///// ------- Alojamentos Familiares Não Clássicos em 2021 ---------- \\\\

var minAlojFamiNaoClass21 = 0;
var maxAlojFamiNaoClass21 = 0;;
function estiloalojaFamNaoClass2021(feature, latlng) {
    if(!feature.properties.AlNClass21){
        feature.properties.AlNClass21 = "sem dados"}
    if(feature.properties.AlNClass21< minAlojFamiNaoClass21 || minAlojFamiNaoClass21 ===0){
        minAlojFamiNaoClass21 = feature.properties.AlNClass21
    }
    if(feature.properties.AlNClass21> maxAlojFamiNaoClass21){
        maxAlojFamiNaoClass21 = feature.properties.AlNClass21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlNClass21,1)
    });
}
function apagaralojaFamNaoClass2021(e){
    var layer = e.target;
    alojaFamNaoClass2021.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturealojaFamNaoClass2021(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos Familiares Não Clássicos: ' + '<b>' +feature.properties.AlNClass21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagaralojaFamNaoClass2021,
    })
};


var alojaFamNaoClass2021= L.geoJSON(tipoAlojamentoConcelho,{
    pointToLayer:estiloalojaFamNaoClass2021,
    onEachFeature: onEachFeaturealojaFamNaoClass2021,
});


var slidealojaFamNaoClass2021 = function(){
    var slideralojaFamNaoClass2021 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    }

    noUiSlider.create(slideralojaFamNaoClass2021, {
        start: [minAlojFamiNaoClass21, maxAlojFamiNaoClass21],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiNaoClass21,
            'max': maxAlojFamiNaoClass21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojFamiClass21);
    inputNumberMax.setAttribute("value",maxAlojFamiNaoClass21);

    inputNumberMin.addEventListener('change', function(){
        slideralojaFamNaoClass2021.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        slideralojaFamNaoClass2021.noUiSlider.set([null, this.value]);
    });

    slideralojaFamNaoClass2021.noUiSlider.on('update',function(e){
        alojaFamNaoClass2021.eachLayer(function(layer){
            if(layer.feature.properties.AlNClass21>=parseFloat(e[0])&& layer.feature.properties.AlNClass21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    slideralojaFamNaoClass2021.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = slideralojaFamNaoClass2021.noUiSlider;
    $(slidersGeral).append(slideralojaFamNaoClass2021);
}
///// ------- Alojamentos Familiares Não Clássicos em 2011 ---------- \\\\

var minAlojFamiNaoClass11 = 0;
var maxAlojFamiNaoClass11 = 0;;
function estiloalojaFamNaoClass2011(feature, latlng) {
    if(feature.properties.AlNClass11< minAlojFamiNaoClass11 || minAlojFamiNaoClass11 ===0){
        minAlojFamiNaoClass11 = feature.properties.AlNClass11
    }
    if(feature.properties.AlNClass11> maxAlojFamiNaoClass11){
        maxAlojFamiNaoClass11 = feature.properties.AlNClass11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlNClass11,1)
    });
}
function apagaralojaFamNaoClass2011(e){
    var layer = e.target;
    alojaFamNaoClass2011.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturealojaFamNaoClass2011(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos Familiares Não Clássicos: ' + '<b>' +feature.properties.AlNClass11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagaralojaFamNaoClass2011,
    })
};


var alojaFamNaoClass2011= L.geoJSON(tipoAlojamentoConcelho,{
    pointToLayer:estiloalojaFamNaoClass2011,
    onEachFeature: onEachFeaturealojaFamNaoClass2011,
});


var slidealojaFamNaoClass2011 = function(){
    var slideralojaFamNaoClass2011 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    }

    noUiSlider.create(slideralojaFamNaoClass2011, {
        start: [minAlojFamiNaoClass11, maxAlojFamiNaoClass11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiNaoClass11,
            'max': maxAlojFamiNaoClass11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojFamiClass11);
    inputNumberMax.setAttribute("value",maxAlojFamiNaoClass11);

    inputNumberMin.addEventListener('change', function(){
        slideralojaFamNaoClass2011.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        slideralojaFamNaoClass2011.noUiSlider.set([null, this.value]);
    });

    slideralojaFamNaoClass2011.noUiSlider.on('update',function(e){
        alojaFamNaoClass2011.eachLayer(function(layer){
            if(layer.feature.properties.AlNClass11>=parseFloat(e[0])&& layer.feature.properties.AlNClass11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    slideralojaFamNaoClass2011.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = slideralojaFamNaoClass2011.noUiSlider;
    $(slidersGeral).append(slideralojaFamNaoClass2011);
}
////-------- Fim dos Alojamentos Familiares Não Clássicos em 2011 ----------\\\\\\\\\\

///// ------- Alojamentos Familiares Não Clássicos em 2001 ---------- \\\\

var minAlojFamiNaoClass01 = 9999;
var maxAlojFamiNaoClass01 = 0;

function estiloalojaFamNaoClass01(feature, latlng) {
    if(feature.properties.AlNClass01<= minAlojFamiNaoClass01){
        minAlojFamiNaoClass01 = feature.properties.AlNClass01
    }
    if(feature.properties.AlNClass01 >= maxAlojFamiNaoClass01){
        maxAlojFamiNaoClass01 = feature.properties.AlNClass01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlNClass01,1)
    });
}
function apagaralojaFamNaoClass01(e){
    var layer = e.target;
    alojaFamNaoClass01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturealojaFamNaoClass01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos Familiares Não Clássicos: ' + '<b>' +feature.properties.AlNClass01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagaralojaFamNaoClass01,
    })
};


var alojaFamNaoClass01= L.geoJSON(tipoAlojamentoConcelho,{
    pointToLayer:estiloalojaFamNaoClass01,
    onEachFeature: onEachFeaturealojaFamNaoClass01,
});


var slidealojaFamNaoClass01 = function(){
    var slideralojaFamNaoClass01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 58){
        sliderAtivo.destroy();
    }

    noUiSlider.create(slideralojaFamNaoClass01, {
        start: [minAlojFamiNaoClass01, maxAlojFamiNaoClass01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiNaoClass01,
            'max': maxAlojFamiNaoClass01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojFamiClass01);
    inputNumberMax.setAttribute("value",maxAlojFamiNaoClass01);

    inputNumberMin.addEventListener('change', function(){
        slideralojaFamNaoClass01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        slideralojaFamNaoClass01.noUiSlider.set([null, this.value]);
    });

    slideralojaFamNaoClass01.noUiSlider.on('update',function(e){
        alojaFamNaoClass01.eachLayer(function(layer){
            if(layer.feature.properties.AlNClass01>=parseFloat(e[0])&& layer.feature.properties.AlNClass01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    slideralojaFamNaoClass01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 58;
    sliderAtivo = slideralojaFamNaoClass01.noUiSlider;
    $(slidersGeral).append(slideralojaFamNaoClass01);
}
////-------- Fim dos Alojamentos Familiares Não Clássicos em 2001 ----------\\\\\\\\\\

///// ------- Alojamentos Familiares Não Clássicos em 1991 ---------- \\\\

var minAlojFamiNaoClass91 = 0;
var maxAlojFamiNaoClass91 = 0;;
function estiloalojaFamNaoClass91(feature, latlng) {
    if(feature.properties.AlNClass91< minAlojFamiNaoClass91 || minAlojFamiNaoClass91 ===0){
        minAlojFamiNaoClass91 = feature.properties.AlNClass91
    }
    if(feature.properties.AlNClass91> maxAlojFamiNaoClass91){
        maxAlojFamiNaoClass91 = feature.properties.AlNClass91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlNClass91,1)
    });
}
function apagaralojaFamNaoClass91(e){
    var layer = e.target;
    alojaFamNaoClass91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturealojaFamNaoClass91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos Familiares Não Clássicos: ' + '<b>' +feature.properties.AlNClass91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagaralojaFamNaoClass91,
    })
};


var alojaFamNaoClass91= L.geoJSON(concelhosAbsolutos1991,{
    pointToLayer:estiloalojaFamNaoClass91,
    onEachFeature: onEachFeaturealojaFamNaoClass91,
});


var slidealojaFamNaoClass91 = function(){
    var slideralojaFamNaoClass91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 59){
        sliderAtivo.destroy();
    }

    noUiSlider.create(slideralojaFamNaoClass91, {
        start: [minAlojFamiNaoClass91, maxAlojFamiNaoClass91],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiNaoClass91,
            'max': maxAlojFamiNaoClass91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojFamiClass91);
    inputNumberMax.setAttribute("value",maxAlojFamiNaoClass91);

    inputNumberMin.addEventListener('change', function(){
        slideralojaFamNaoClass91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        slideralojaFamNaoClass91.noUiSlider.set([null, this.value]);
    });

    slideralojaFamNaoClass91.noUiSlider.on('update',function(e){
        alojaFamNaoClass91.eachLayer(function(layer){
            if(layer.feature.properties.AlNClass91>=parseFloat(e[0])&& layer.feature.properties.AlNClass91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    slideralojaFamNaoClass91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 59;
    sliderAtivo = slideralojaFamNaoClass91.noUiSlider;
    $(slidersGeral).append(slideralojaFamNaoClass91);
}
////-------- Fim dos Alojamentos Familiares Não Clássicos em 1991 ----------\\\\\\\\\\

///// ------- Alojamentos Familiares Coletivos em 2021 ---------- \\\\

var minAlojFamiColetivos21 = 0;
var maxAlojFamiColetivos21 = 0;;
function estiloAlojaFamColetivos21(feature, latlng) {
    if(feature.properties.AlojCole21< minAlojFamiColetivos21 || minAlojFamiColetivos21 ===0){
        minAlojFamiColetivos21 = feature.properties.AlojCole21
    }
    if(feature.properties.AlojCole21> maxAlojFamiColetivos21){
        maxAlojFamiColetivos21 = feature.properties.AlojCole21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlojCole21,2)
    });
}
function apagarAlojaFamColetivos21(e){
    var layer = e.target;
    AlojaFamColetivos21.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureAlojaFamColetivos21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos Coletivos: ' + '<b>' +feature.properties.AlojCole21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFamColetivos21,
    })
};


var AlojaFamColetivos21= L.geoJSON(tipoAlojamentoConcelho,{
    pointToLayer:estiloAlojaFamColetivos21,
    onEachFeature: onEachFeatureAlojaFamColetivos21,
});


var slideAlojaFamColetivos21 = function(){
    var sliderAlojaFamColetivos21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFamColetivos21, {
        start: [minAlojFamiColetivos21, maxAlojFamiColetivos21],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiColetivos21,
            'max': maxAlojFamiColetivos21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojFamiColetivos21);
    inputNumberMax.setAttribute("value",maxAlojFamiColetivos21);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFamColetivos21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFamColetivos21.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFamColetivos21.noUiSlider.on('update',function(e){
        AlojaFamColetivos21.eachLayer(function(layer){
            if(layer.feature.properties.AlojCole21>=parseFloat(e[0])&& layer.feature.properties.AlojCole21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAlojaFamColetivos21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderAlojaFamColetivos21.noUiSlider;
    $(slidersGeral).append(sliderAlojaFamColetivos21);
}
////-------- Fim dos Alojamentos Coletivos em 2021 ----------\\\\\\\\\\

///// ------- Alojamentos Familiares Coletivos em 2011 ---------- \\\\

var minAlojFamiColetivos11 = 0;
var maxAlojFamiColetivos11 = 0;;
function estiloAlojaFamColetivos11(feature, latlng) {
    if(feature.properties.AlojCole11< minAlojFamiColetivos11 || minAlojFamiColetivos11 ===0){
        minAlojFamiColetivos11 = feature.properties.AlojCole11
    }
    if(feature.properties.AlojCole11> maxAlojFamiColetivos11){
        maxAlojFamiColetivos11 = feature.properties.AlojCole11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlojCole11,2)
    });
}
function apagarAlojaFamColetivos11(e){
    var layer = e.target;
    AlojaFamColetivos11.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureAlojaFamColetivos11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos Coletivos: ' + '<b>' +feature.properties.AlojCole11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFamColetivos11,
    })
};


var AlojaFamColetivos11= L.geoJSON(tipoAlojamentoConcelho,{
    pointToLayer:estiloAlojaFamColetivos11,
    onEachFeature: onEachFeatureAlojaFamColetivos11,
});


var slideAlojaFamColetivos11 = function(){
    var sliderAlojaFamColetivos11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFamColetivos11, {
        start: [minAlojFamiColetivos11, maxAlojFamiColetivos11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiColetivos11,
            'max': maxAlojFamiColetivos11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojFamiColetivos11);
    inputNumberMax.setAttribute("value",maxAlojFamiColetivos11);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFamColetivos11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFamColetivos11.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFamColetivos11.noUiSlider.on('update',function(e){
        AlojaFamColetivos11.eachLayer(function(layer){
            if(layer.feature.properties.AlojCole11>=parseFloat(e[0])&& layer.feature.properties.AlojCole11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAlojaFamColetivos11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderAlojaFamColetivos11.noUiSlider;
    $(slidersGeral).append(sliderAlojaFamColetivos11);
}
////-------- Fim dos Alojamentos Coletivos em 2011 ----------\\\\\\\\\\

///// ------- Alojamentos Familiares Coletivos em 2001 ---------- \\\\

var minAlojFamiColetivos01 = 0;
var maxAlojFamiColetivos01 = 0;;
function estiloAlojaFamColetivos01(feature, latlng) {
    if(feature.properties.AlojCole01< minAlojFamiColetivos01 || minAlojFamiColetivos01 ===0){
        minAlojFamiColetivos01 = feature.properties.AlojCole01
    }
    if(feature.properties.AlojCole01> maxAlojFamiColetivos01){
        maxAlojFamiColetivos01 = feature.properties.AlojCole01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlojCole01,2)
    });
}
function apagarAlojaFamColetivos01(e){
    var layer = e.target;
    AlojaFamColetivos01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAlojaFamColetivos01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos Coletivos: ' + '<b>' +feature.properties.AlojCole01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFamColetivos01,
    })
};


var AlojaFamColetivos01= L.geoJSON(tipoAlojamentoConcelho,{
    pointToLayer:estiloAlojaFamColetivos01,
    onEachFeature: onEachFeatureAlojaFamColetivos01,
});


var slideAlojaFamColetivos01 = function(){
    var sliderAlojaFamColetivos01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 60){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFamColetivos01, {
        start: [minAlojFamiColetivos01, maxAlojFamiColetivos01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiColetivos01,
            'max': maxAlojFamiColetivos01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojFamiColetivos01);
    inputNumberMax.setAttribute("value",maxAlojFamiColetivos01);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFamColetivos01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFamColetivos01.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFamColetivos01.noUiSlider.on('update',function(e){
        AlojaFamColetivos01.eachLayer(function(layer){
            if(layer.feature.properties.AlojCole01>=parseFloat(e[0])&& layer.feature.properties.AlojCole01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAlojaFamColetivos01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 60;
    sliderAtivo = sliderAlojaFamColetivos01.noUiSlider;
    $(slidersGeral).append(sliderAlojaFamColetivos01);
}
////-------- Fim dos Alojamentos Coletivos em 2001 ----------\\\\\\\\\\

///// ------- Alojamentos Familiares Coletivos em 1991 ---------- \\\\

var minAlojFamiColetivos91 = 0;
var maxAlojFamiColetivos91 = 0;;
function estiloAlojaFamColetivos91(feature, latlng) {
    if(!feature.properties.AlojCole91){
        feature.properties.AlojCole91 = "sem dados"}
    if(feature.properties.AlojCole91< minAlojFamiColetivos91 || minAlojFamiColetivos91 ===0){
        minAlojFamiColetivos91 = feature.properties.AlojCole91
    }
    if(feature.properties.AlojCole91> maxAlojFamiColetivos91){
        maxAlojFamiColetivos91 = feature.properties.AlojCole91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlojCole91,2)
    });
}
function apagarAlojaFamColetivos91(e){
    var layer = e.target;
    AlojaFamColetivos91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAlojaFamColetivos91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos Coletivos: ' + '<b>' +feature.properties.AlojCole91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFamColetivos91,
    })
};


var AlojaFamColetivos91= L.geoJSON(concelhosAbsolutos1991,{
    pointToLayer:estiloAlojaFamColetivos91,
    onEachFeature: onEachFeatureAlojaFamColetivos91,
});


var slideAlojaFamColetivos91 = function(){
    var sliderAlojaFamColetivos91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 61){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFamColetivos91, {
        start: [minAlojFamiColetivos91, maxAlojFamiColetivos91],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiColetivos91,
            'max': maxAlojFamiColetivos91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojFamiColetivos91);
    inputNumberMax.setAttribute("value",maxAlojFamiColetivos91);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFamColetivos91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFamColetivos91.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFamColetivos91.noUiSlider.on('update',function(e){
        AlojaFamColetivos91.eachLayer(function(layer){
            if(layer.feature.properties.AlojCole91>=parseFloat(e[0])&& layer.feature.properties.AlojCole91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAlojaFamColetivos91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 61;
    sliderAtivo = sliderAlojaFamColetivos91.noUiSlider;
    $(slidersGeral).append(sliderAlojaFamColetivos91);
}
////-------- Fim dos Alojamentos Coletivos em 1991 ----------\\\\\\\\\\

//////// --------------------------- Freguesias -------------------------- \\\\\\\\\\\\\\\\\\\

//// -------  FREGUESIAS -  TOTAL DE ALOJAMENTOS 2021 ---------- \\\\\

var minTotalAloja21Freg = 99;
var maxTotalAloja21Freg = 0;
function estilototalAlojaFreguesia21(feature, latlng) {
    if(feature.properties.F_T_Aloj21< minTotalAloja21Freg){
        minTotalAloja21Freg = feature.properties.F_T_Aloj21
    }
    if(feature.properties.F_T_Aloj21> maxTotalAloja21Freg){
        maxTotalAloja21Freg = feature.properties.F_T_Aloj21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_T_Aloj21,0.1)
    });
}
function apagartotalAlojaFreguesia21(e){
    var layer = e.target;
    totalAlojaFreguesia21.resetStyle(layer)
    layer.closePopup();
}
function onEachFeaturetotalAlojaFreguesia21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos: ' + '<b>' + feature.properties.F_T_Aloj21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagartotalAlojaFreguesia21,
    })
};


var totalAlojaFreguesia21 = L.geoJSON(tipoAlojamentoFreguesia,{
    pointToLayer:estilototalAlojaFreguesia21,
    onEachFeature: onEachFeaturetotalAlojaFreguesia21,
});


var slidetotalAlojaFreguesia21 = function(){
    var slidertotalAlojaFreguesia21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    }

    noUiSlider.create(slidertotalAlojaFreguesia21, {
        start: [minTotalAloja21Freg, maxTotalAloja21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalAloja21Freg,
            'max': maxTotalAloja21Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalAloja21Freg);
    inputNumberMax.setAttribute("value",maxTotalAloja21Freg);

    inputNumberMin.addEventListener('change', function(){
        slidertotalAlojaFreguesia21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        slidertotalAlojaFreguesia21.noUiSlider.set([null, this.value]);
    });

    slidertotalAlojaFreguesia21.noUiSlider.on('update',function(e){
        totalAlojaFreguesia21.eachLayer(function(layer){
            if(layer.feature.properties.F_T_Aloj21>=parseFloat(e[0])&& layer.feature.properties.F_T_Aloj21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        slidertotalAlojaFreguesia21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 3;
    sliderAtivo = slidertotalAlojaFreguesia21.noUiSlider;
    $(slidersGeral).append(slidertotalAlojaFreguesia21);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS EM 2021 POR FREGUESIA

//// -------  TOTAL DE ALOJAMENTOS FAMILIARES 2021 ---------- \\\\\

var minTotalAloja11Freg = 99;
var maxTotalAloja11Freg = 0;
function estilototalAlojaFreguesia11(feature, latlng) {
    if(feature.properties.F_T_Aloj11< minTotalAloja11Freg){
        minTotalAloja11Freg = feature.properties.F_T_Aloj11
    }
    if(feature.properties.F_T_Aloj11> maxTotalAloja11Freg){
        maxTotalAloja11Freg = feature.properties.F_T_Aloj11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_T_Aloj11,0.1)
    });
}
function apagartotalAlojaFreguesia11(e){
    var layer = e.target;
    totalAlojaFreguesia11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturetotalAlojaFreguesia11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos: ' + '<b>' + feature.properties.F_T_Aloj11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagartotalAlojaFreguesia11,
    })
};


var totalAlojaFreguesia11 = L.geoJSON(tipoAlojamentoFreguesia,{
    pointToLayer:estilototalAlojaFreguesia11,
    onEachFeature: onEachFeaturetotalAlojaFreguesia11,
});


var slidetotalAlojaFreguesia11 = function(){
    var slidertotalAlojaFreguesia11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    }

    noUiSlider.create(slidertotalAlojaFreguesia11, {
        start: [minTotalAloja11Freg, maxTotalAloja11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalAloja11Freg,
            'max': maxTotalAloja11Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalAloja11Freg);
    inputNumberMax.setAttribute("value",maxTotalAloja11Freg);

    inputNumberMin.addEventListener('change', function(){
        slidertotalAlojaFreguesia11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        slidertotalAlojaFreguesia11.noUiSlider.set([null, this.value]);
    });

    slidertotalAlojaFreguesia11.noUiSlider.on('update',function(e){
        totalAlojaFreguesia11.eachLayer(function(layer){
            if(layer.feature.properties.F_T_Aloj11>=parseFloat(e[0])&& layer.feature.properties.F_T_Aloj11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        slidertotalAlojaFreguesia11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 10;
    sliderAtivo = slidertotalAlojaFreguesia11.noUiSlider;
    $(slidersGeral).append(slidertotalAlojaFreguesia11);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS EM 2011 POR FREGUESIA

//// -------  TOTAL DE ALOJAMENTOS FAMILIARES 2001 ---------- \\\\\

var minTotalAloja01Freg = 99;
var maxTotalAloja01Freg = 0;
function estilototalAlojaFreguesia01(feature, latlng) {
    if(feature.properties.F_T_Aloj01< minTotalAloja01Freg){
        minTotalAloja01Freg = feature.properties.F_T_Aloj01
    }
    if(feature.properties.F_T_Aloj01> maxTotalAloja01Freg){
        maxTotalAloja01Freg = feature.properties.F_T_Aloj01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_T_Aloj01,0.1)
    });
}
function apagartotalAlojaFreguesia01(e){
    var layer = e.target;
    totalAlojaFreguesia01.resetStyle(layer)
    layer.closePopup();
}

function onEachFeaturetotalAlojaFreguesia01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos: ' + '<b>' + feature.properties.F_T_Aloj01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagartotalAlojaFreguesia01,
    })
};


var totalAlojaFreguesia01 = L.geoJSON(freguesiasAbsolutos2001,{
    pointToLayer:estilototalAlojaFreguesia01,
    onEachFeature: onEachFeaturetotalAlojaFreguesia01,
});


var slidetotalAlojaFreguesia01 = function(){
    var slidertotalAlojaFreguesia01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 76){
        sliderAtivo.destroy();
    }

    noUiSlider.create(slidertotalAlojaFreguesia01, {
        start: [minTotalAloja01Freg, maxTotalAloja01Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalAloja01Freg,
            'max': maxTotalAloja01Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalAloja01Freg);
    inputNumberMax.setAttribute("value",maxTotalAloja01Freg);

    inputNumberMin.addEventListener('change', function(){
        slidertotalAlojaFreguesia01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        slidertotalAlojaFreguesia01.noUiSlider.set([null, this.value]);
    });

    slidertotalAlojaFreguesia01.noUiSlider.on('update',function(e){
        totalAlojaFreguesia01.eachLayer(function(layer){
            if(layer.feature.properties.F_T_Aloj01>=parseFloat(e[0])&& layer.feature.properties.F_T_Aloj01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        slidertotalAlojaFreguesia01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 76;
    sliderAtivo = slidertotalAlojaFreguesia01.noUiSlider;
    $(slidersGeral).append(slidertotalAlojaFreguesia01);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS EM 2001 POR FREGUESIA

//// -------  TOTAL DE ALOJAMENTOS FAMILIARES 1991 ---------- \\\\\

var minTotalAloja91Freg = 99;
var maxTotalAloja91Freg = 0;
function estilototalAlojaFreguesia91(feature, latlng) {
    if(feature.properties.F_T_Aloj91< minTotalAloja91Freg){
        minTotalAloja91Freg = feature.properties.F_T_Aloj91
    }
    if(feature.properties.F_T_Aloj91> maxTotalAloja91Freg){
        maxTotalAloja91Freg = feature.properties.F_T_Aloj91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_T_Aloj91,0.1)
    });
}
function apagartotalAlojaFreguesia91(e){
    var layer = e.target;
    totalAlojaFreguesia91.resetStyle(layer)
    layer.closePopup();
}

function onEachFeaturetotalAlojaFreguesia91(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos: ' + '<b>' + feature.properties.F_T_Aloj91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagartotalAlojaFreguesia91,
    })
};


var totalAlojaFreguesia91 = L.geoJSON(freguesiasAbsolutos1991,{
    pointToLayer:estilototalAlojaFreguesia91,
    onEachFeature: onEachFeaturetotalAlojaFreguesia91,
});


var slidetotalAlojaFreguesia91 = function(){
    var slidertotalAlojaFreguesia91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 77){
        sliderAtivo.destroy();
    }

    noUiSlider.create(slidertotalAlojaFreguesia91, {
        start: [minTotalAloja91Freg, maxTotalAloja91Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalAloja91Freg,
            'max': maxTotalAloja91Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalAloja91Freg);
    inputNumberMax.setAttribute("value",maxTotalAloja91Freg);

    inputNumberMin.addEventListener('change', function(){
        slidertotalAlojaFreguesia91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        slidertotalAlojaFreguesia91.noUiSlider.set([null, this.value]);
    });

    slidertotalAlojaFreguesia91.noUiSlider.on('update',function(e){
        totalAlojaFreguesia91.eachLayer(function(layer){
            if(layer.feature.properties.F_T_Aloj91>=parseFloat(e[0])&& layer.feature.properties.F_T_Aloj91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        slidertotalAlojaFreguesia91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 77;
    sliderAtivo = slidertotalAlojaFreguesia91.noUiSlider;
    $(slidersGeral).append(slidertotalAlojaFreguesia91);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS EM 1991 POR FREGUESIA

//// -------  TOTAL DE ALOJAMENTOS FAMILIARES EM 2021 ---------- \\\\\

var minAlojaFami21Freg = 99;
var maxAlojaFami21Freg = 0;
function estiloAlojaFami21Freg(feature, latlng) {
    if(feature.properties.F_AloFam21< minAlojaFami21Freg){
        minAlojaFami21Freg = feature.properties.F_AloFam21
    }
    if(feature.properties.F_AloFam21> maxAlojaFami21Freg){
        maxAlojaFami21Freg = feature.properties.F_AloFam21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloFam21,0.1)
    });
}
function apagarAlojaFami21Freg(e){
    var layer = e.target;
    AlojaFami21Freg.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureAlojaFami21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Familiares: ' + '<b>' + feature.properties.F_AloFam21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFami21Freg,
    })
};


var AlojaFami21Freg = L.geoJSON(tipoAlojamentoFreguesia,{
    pointToLayer:estiloAlojaFami21Freg,
    onEachFeature: onEachFeatureAlojaFami21Freg,
});


var slideAlojaFami21Freg = function(){
    var sliderAlojaFami21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFami21Freg, {
        start: [minAlojaFami21Freg, maxAlojaFami21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojaFami21Freg,
            'max': maxAlojaFami21Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojaFami21Freg);
    inputNumberMax.setAttribute("value",maxAlojaFami21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFami21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFami21Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFami21Freg.noUiSlider.on('update',function(e){
        AlojaFami21Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloFam21>=parseFloat(e[0])&& layer.feature.properties.F_AloFam21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojaFami21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 11;
    sliderAtivo = sliderAlojaFami21Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojaFami21Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS FAMILIARES EM 2021 POR FREGUESIA

//// -------  TOTAL DE ALOJAMENTOS FAMILIARES EM 2011 ---------- \\\\\

var minAlojaFami11Freg = 99;
var maxAlojaFami11Freg = 0;
function estiloAlojaFami11Freg(feature, latlng) {
    if(feature.properties.F_AloFam11< minAlojaFami11Freg){
        minAlojaFami11Freg = feature.properties.F_AloFam11
    }
    if(feature.properties.F_AloFam11> maxAlojaFami11Freg){
        maxAlojaFami11Freg = feature.properties.F_AloFam11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloFam11,0.1)
    });
}
function apagarAlojaFami11Freg(e){
    var layer = e.target;
    AlojaFami11Freg.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureAlojaFami11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Familiares: ' + '<b>' + feature.properties.F_AloFam11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFami11Freg,
    })
};


var AlojaFami11Freg = L.geoJSON(tipoAlojamentoFreguesia,{
    pointToLayer:estiloAlojaFami11Freg,
    onEachFeature: onEachFeatureAlojaFami11Freg,
});


var slideAlojaFami11Freg = function(){
    var sliderAlojaFami11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFami11Freg, {
        start: [minAlojaFami11Freg, maxAlojaFami11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojaFami11Freg,
            'max': maxAlojaFami11Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojaFami11Freg);
    inputNumberMax.setAttribute("value",maxAlojaFami11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFami11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFami11Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFami11Freg.noUiSlider.on('update',function(e){
        AlojaFami11Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloFam11>=parseFloat(e[0])&& layer.feature.properties.F_AloFam11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojaFami11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 12;
    sliderAtivo = sliderAlojaFami11Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojaFami11Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS FAMILIARES EM 2011 POR FREGUESIA


//// -------  TOTAL DE ALOJAMENTOS FAMILIARES EM 2001 ---------- \\\\\

var minAlojaFami01Freg = 99;
var maxAlojaFami01Freg = 0;

function estiloAlojaFami01Freg(feature, latlng) {
    if(feature.properties.F_AloFam01< minAlojaFami01Freg){
        minAlojaFami01Freg = feature.properties.F_AloFam01
    }
    if(feature.properties.F_AloFam01> maxAlojaFami01Freg){
        maxAlojaFami01Freg = feature.properties.F_AloFam01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloFam01,0.1)
    });
}
function apagarAlojaFami01Freg(e){
    var layer = e.target;
    AlojaFami01Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAlojaFami01Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Familiares: ' + '<b>' + feature.properties.F_AloFam01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFami01Freg,
    })
};


var AlojaFami01Freg = L.geoJSON(freguesiasAbsolutos2001,{
    pointToLayer:estiloAlojaFami01Freg,
    onEachFeature: onEachFeatureAlojaFami01Freg,
});


var slideAlojaFami01Freg = function(){
    var sliderAlojaFami01Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 78){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFami01Freg, {
        start: [minAlojaFami01Freg, maxAlojaFami01Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojaFami01Freg,
            'max': maxAlojaFami01Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojaFami01Freg);
    inputNumberMax.setAttribute("value",maxAlojaFami01Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFami01Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFami01Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFami01Freg.noUiSlider.on('update',function(e){
        AlojaFami01Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloFam01>=parseFloat(e[0])&& layer.feature.properties.F_AloFam01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojaFami01Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 78;
    sliderAtivo = sliderAlojaFami01Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojaFami01Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS FAMILIARES EM 2001 POR FREGUESIA

//// -------  TOTAL DE ALOJAMENTOS FAMILIARES EM 1991 ---------- \\\\\

var minAlojaFami91Freg = 0;
var maxAlojaFami91Freg = 0;

function estiloAlojaFami91Freg(feature, latlng) {
    if(feature.properties.F_AloFam91< minAlojaFami91Freg || minAlojaFami91Freg ===0){
        minAlojaFami91Freg = feature.properties.F_AloFam91
    }
    if(feature.properties.F_AloFam91> maxAlojaFami91Freg){
        maxAlojaFami91Freg = feature.properties.F_AloFam91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloFam91,0.1)
    });
}
function apagarAlojaFami91Freg(e){
    var layer = e.target;
    AlojaFami91Freg.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureAlojaFami91Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Familiares: ' + '<b>' + feature.properties.F_AloFam91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFami91Freg,
    })
};


var AlojaFami91Freg = L.geoJSON(freguesiasAbsolutos1991,{
    pointToLayer:estiloAlojaFami91Freg,
    onEachFeature: onEachFeatureAlojaFami91Freg,
});


var slideAlojaFami91Freg = function(){
    var sliderAlojaFami91Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 79){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFami91Freg, {
        start: [minAlojaFami91Freg, maxAlojaFami91Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojaFami91Freg,
            'max': maxAlojaFami91Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojaFami91Freg);
    inputNumberMax.setAttribute("value",maxAlojaFami91Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFami91Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFami91Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFami91Freg.noUiSlider.on('update',function(e){
        AlojaFami91Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloFam91>=parseFloat(e[0])&& layer.feature.properties.F_AloFam91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojaFami91Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 79;
    sliderAtivo = sliderAlojaFami91Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojaFami91Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS FAMILIARES EM 1991 POR FREGUESIA

//// -------  ALOJAMENTOS FAMILIARES CLÁSSICOS EM 2021 Freguesia ---------- \\\\\

var minAlojaFamiClass21Freg = 99;
var maxAlojaFamiClass21Freg = 0;
function estiloAlojaFamiClass21Freg(feature, latlng) {
    if(feature.properties.F_AloCla21< minAlojaFamiClass21Freg || minAlojaFamiClass21Freg ===0){
        minAlojaFamiClass21Freg = feature.properties.F_AloCla21
    }
    if(feature.properties.F_AloCla21> maxAlojaFamiClass21Freg){
        maxAlojaFamiClass21Freg = feature.properties.F_AloCla21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloCla21,0.1)
    });
}
function apagarAlojaFamiClass21Freg(e){
    var layer = e.target;
    AlojaFamiClass21Freg.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureAlojaFamiClass21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Familiares Clássicos: ' + '<b>' + feature.properties.F_AloCla21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFamiClass21Freg,
    })
};


var AlojaFamiClass21Freg = L.geoJSON(tipoAlojamentoFreguesia,{
    pointToLayer:estiloAlojaFamiClass21Freg,
    onEachFeature: onEachFeatureAlojaFamiClass21Freg,
});


var slideAlojaFamiClass21Freg = function(){
    var sliderAlojaFamiClass21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFamiClass21Freg, {
        start: [minAlojaFamiClass21Freg, maxAlojaFamiClass21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojaFamiClass21Freg,
            'max': maxAlojaFamiClass21Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojaFamiClass21Freg);
    inputNumberMax.setAttribute("value",maxAlojaFamiClass21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFamiClass21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFamiClass21Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFamiClass21Freg.noUiSlider.on('update',function(e){
        AlojaFamiClass21Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloCla21>=parseFloat(e[0])&& layer.feature.properties.F_AloCla21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojaFamiClass21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 13;
    sliderAtivo = sliderAlojaFamiClass21Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojaFamiClass21Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS FAMILIARES CLÁSSICOS EM 2021 POR FREGUESIA


//// -------  ALOJAMENTOS FAMILIARES CLÁSSICOS EM 2011 Freguesia ---------- \\\\\

var minAlojaFamiClass11Freg = 99;
var maxAlojaFamiClass11Freg = 0;
function estiloAlojaFamiClass11Freg(feature, latlng) {
    if(feature.properties.F_AloCla11< minAlojaFamiClass11Freg || minAlojaFamiClass11Freg ===0){
        minAlojaFamiClass11Freg = feature.properties.F_AloCla11
    }
    if(feature.properties.F_AloCla11> maxAlojaFamiClass11Freg){
        maxAlojaFamiClass11Freg = feature.properties.F_AloCla11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloCla11,0.1)
    });
}
function apagarAlojaFamiClass11Freg(e){
    var layer = e.target;
    AlojaFamiClass11Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAlojaFamiClass11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Familiares Clássicos: ' + '<b>' + feature.properties.F_AloCla11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFamiClass11Freg,
    })
};


var AlojaFamiClass11Freg = L.geoJSON(tipoAlojamentoFreguesia,{
    pointToLayer:estiloAlojaFamiClass11Freg,
    onEachFeature: onEachFeatureAlojaFamiClass11Freg,
});


var slideAlojaFamiClass11Freg = function(){
    var sliderAlojaFamiClass11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFamiClass11Freg, {
        start: [minAlojaFamiClass11Freg, maxAlojaFamiClass11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojaFamiClass11Freg,
            'max': maxAlojaFamiClass11Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojaFamiClass11Freg);
    inputNumberMax.setAttribute("value",maxAlojaFamiClass11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFamiClass11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFamiClass11Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFamiClass11Freg.noUiSlider.on('update',function(e){
        AlojaFamiClass11Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloCla11>=parseFloat(e[0])&& layer.feature.properties.F_AloCla11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojaFamiClass11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 14;
    sliderAtivo = sliderAlojaFamiClass11Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojaFamiClass11Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS FAMILIARES CLÁSSICOS EM 2011 POR FREGUESIA

//// -------  ALOJAMENTOS FAMILIARES CLÁSSICOS EM 2001 Freguesia ---------- \\\\\

var minAlojaFamiClass01Freg = 99;
var maxAlojaFamiClass01Freg = 0;
function estiloAlojaFamiClass01Freg(feature, latlng) {
    if(feature.properties.F_AloCla01< minAlojaFamiClass01Freg || minAlojaFamiClass01Freg ===0){
        minAlojaFamiClass01Freg = feature.properties.F_AloCla01
    }
    if(feature.properties.F_AloCla01> maxAlojaFamiClass01Freg){
        maxAlojaFamiClass01Freg = feature.properties.F_AloCla01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloCla01,0.1)
    });
}
function apagarAlojaFamiClass01Freg(e){
    var layer = e.target;
    AlojaFamiClass01Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAlojaFamiClass01Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Familiares Clássicos: ' + '<b>' + feature.properties.F_AloCla01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFamiClass01Freg,
    })
};


var AlojaFamiClass01Freg = L.geoJSON(freguesiasAbsolutos2001,{
    pointToLayer:estiloAlojaFamiClass01Freg,
    onEachFeature: onEachFeatureAlojaFamiClass01Freg,
});


var slideAlojaFamiClass01Freg = function(){
    var sliderAlojaFamiClass01Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 80){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFamiClass01Freg, {
        start: [minAlojaFamiClass01Freg, maxAlojaFamiClass01Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojaFamiClass01Freg,
            'max': maxAlojaFamiClass01Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojaFamiClass01Freg);
    inputNumberMax.setAttribute("value",maxAlojaFamiClass01Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFamiClass01Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFamiClass01Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFamiClass01Freg.noUiSlider.on('update',function(e){
        AlojaFamiClass01Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloCla01>=parseFloat(e[0])&& layer.feature.properties.F_AloCla01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojaFamiClass01Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 80;
    sliderAtivo = sliderAlojaFamiClass01Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojaFamiClass01Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS FAMILIARES CLÁSSICOS EM 2001 POR FREGUESIA

//// -------  ALOJAMENTOS FAMILIARES CLÁSSICOS EM 1991 Freguesia ---------- \\\\\

var minAlojaFamiClass91Freg = 99;
var maxAlojaFamiClass91Freg = 0;
function estiloAlojaFamiClass91Freg(feature, latlng) {
    if(feature.properties.F_AloCla91< minAlojaFamiClass91Freg || minAlojaFamiClass91Freg ===0){
        minAlojaFamiClass91Freg = feature.properties.F_AloCla91
    }
    if(feature.properties.F_AloCla91> maxAlojaFamiClass91Freg){
        maxAlojaFamiClass91Freg = feature.properties.F_AloCla91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloCla91,0.1)
    });
}
function apagarAlojaFamiClass91Freg(e){
    var layer = e.target;
    AlojaFamiClass91Freg.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureAlojaFamiClass91Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Familiares Clássicos: ' + '<b>' + feature.properties.F_AloCla91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFamiClass91Freg,
    })
};


var AlojaFamiClass91Freg = L.geoJSON(freguesiasAbsolutos1991,{
    pointToLayer:estiloAlojaFamiClass91Freg,
    onEachFeature: onEachFeatureAlojaFamiClass91Freg,
});


var slideAlojaFamiClass91Freg = function(){
    var sliderAlojaFamiClass91Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 81){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFamiClass91Freg, {
        start: [minAlojaFamiClass91Freg, maxAlojaFamiClass91Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojaFamiClass91Freg,
            'max': maxAlojaFamiClass91Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojaFamiClass91Freg);
    inputNumberMax.setAttribute("value",maxAlojaFamiClass91Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFamiClass91Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFamiClass91Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFamiClass91Freg.noUiSlider.on('update',function(e){
        AlojaFamiClass91Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloCla91>=parseFloat(e[0])&& layer.feature.properties.F_AloCla91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojaFamiClass91Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 81;
    sliderAtivo = sliderAlojaFamiClass91Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojaFamiClass91Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS FAMILIARES CLÁSSICOS EM 1991 POR FREGUESIA


//// -------  ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS EM 2021 Freguesia ---------- \\\\\

var minAlojaFamiNaoClass21Freg = 99;
var maxAlojaFamiNaoClass21Freg = 0;
function estiloAlojaFamiNaoClass21Freg(feature, latlng) {
    if(feature.properties.F_AloNcl21< minAlojaFamiNaoClass21Freg){
        minAlojaFamiNaoClass21Freg = feature.properties.F_AloNcl21
    }
    if(feature.properties.F_AloNcl21> maxAlojaFamiNaoClass21Freg){
        maxAlojaFamiNaoClass21Freg = feature.properties.F_AloNcl21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloNcl21,1)
    });
}
function apagarAlojaFamiNaoClass21Freg(e){
    var layer = e.target;
    AlojaFamiNaoClass21Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAlojaFamiNaoClass21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Familiares Não Clássicos: ' + '<b>' + feature.properties.F_AloNcl21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFamiNaoClass21Freg,
    })
};
var AlojaFamiNaoClass21Freg = L.geoJSON(tipoAlojamentoFreguesia,{
    pointToLayer:estiloAlojaFamiNaoClass21Freg,
    onEachFeature: onEachFeatureAlojaFamiNaoClass21Freg,
});


var slideAlojaFamiNaoClass21Freg = function(){
    var sliderAlojaFamiNaoClass21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFamiNaoClass21Freg, {
        start: [minAlojaFamiNaoClass21Freg, maxAlojaFamiNaoClass21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojaFamiNaoClass21Freg,
            'max': maxAlojaFamiNaoClass21Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojaFamiNaoClass21Freg);
    inputNumberMax.setAttribute("value",maxAlojaFamiNaoClass21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFamiNaoClass21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFamiNaoClass21Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFamiNaoClass21Freg.noUiSlider.on('update',function(e){
        AlojaFamiNaoClass21Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloNcl21>=parseFloat(e[0])&& layer.feature.properties.F_AloNcl21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojaFamiNaoClass21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 15;
    sliderAtivo = sliderAlojaFamiNaoClass21Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojaFamiNaoClass21Freg);
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

///////// ------------ FIM DE ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS EM 2021 POR FREGUESIA

//// -------  ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS EM 2011 Freguesia ---------- \\\\\

var minAlojaFamiNaoClass11Freg = 99;
var maxAlojaFamiNaoClass11Freg = 0;
function estiloAlojaFamiNaoClass11Freg(feature, latlng) {
    if(feature.properties.F_AloNcl11< minAlojaFamiNaoClass11Freg){
        minAlojaFamiNaoClass11Freg = feature.properties.F_AloNcl11
    }
    if(feature.properties.F_AloNcl11> maxAlojaFamiNaoClass11Freg){
        maxAlojaFamiNaoClass11Freg = feature.properties.F_AloNcl11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloNcl11,1)
    });
}
function apagarAlojaFamiNaoClass11Freg(e){
    var layer = e.target;
    AlojaFamiNaoClass11Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAlojaFamiNaoClass11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Familiares Não Clássicos: ' + '<b>' + feature.properties.F_AloNcl11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFamiNaoClass11Freg,
    })
};


var AlojaFamiNaoClass11Freg = L.geoJSON(tipoAlojamentoFreguesia,{
    pointToLayer:estiloAlojaFamiNaoClass11Freg,
    onEachFeature: onEachFeatureAlojaFamiNaoClass11Freg,
});


var slideAlojaFamiNaoClass11Freg = function(){
    var sliderAlojaFamiNaoClass11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFamiNaoClass11Freg, {
        start: [minAlojaFamiNaoClass11Freg, maxAlojaFamiNaoClass11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojaFamiNaoClass11Freg,
            'max': maxAlojaFamiNaoClass11Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojaFamiNaoClass11Freg);
    inputNumberMax.setAttribute("value",maxAlojaFamiNaoClass11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFamiNaoClass11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFamiNaoClass11Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFamiNaoClass11Freg.noUiSlider.on('update',function(e){
        AlojaFamiNaoClass11Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloNcl11>=parseFloat(e[0])&& layer.feature.properties.F_AloNcl11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojaFamiNaoClass11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 16;
    sliderAtivo = sliderAlojaFamiNaoClass11Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojaFamiNaoClass11Freg);
}
///////// ------------ FIM DE ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS EM 2011 POR FREGUESIA

//// -------  ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS EM 2001 Freguesia ---------- \\\\\

var minAlojaFamiNaoClass01Freg = 99;
var maxAlojaFamiNaoClass01Freg = 0;
function estiloAlojaFamiNaoClass01Freg(feature, latlng) {
    if(feature.properties.F_AloNcl01< minAlojaFamiNaoClass01Freg){
        minAlojaFamiNaoClass01Freg = feature.properties.F_AloNcl01
    }
    if(feature.properties.F_AloNcl01> maxAlojaFamiNaoClass01Freg){
        maxAlojaFamiNaoClass01Freg = feature.properties.F_AloNcl01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloNcl01,1)
    });
}
function apagarAlojaFamiNaoClass01Freg(e){
    var layer = e.target;
    AlojaFamiNaoClass01Freg.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureAlojaFamiNaoClass01Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Familiares Não Clássicos: ' + '<b>' + feature.properties.F_AloNcl01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFamiNaoClass01Freg,
    })
};


var AlojaFamiNaoClass01Freg = L.geoJSON(freguesiasAbsolutos2001,{
    pointToLayer:estiloAlojaFamiNaoClass01Freg,
    onEachFeature: onEachFeatureAlojaFamiNaoClass01Freg,
});


var slideAlojaFamiNaoClass01Freg = function(){
    var sliderAlojaFamiNaoClass01Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 82){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFamiNaoClass01Freg, {
        start: [minAlojaFamiNaoClass01Freg, maxAlojaFamiNaoClass01Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojaFamiNaoClass01Freg,
            'max': maxAlojaFamiNaoClass01Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojaFamiNaoClass01Freg);
    inputNumberMax.setAttribute("value",maxAlojaFamiNaoClass01Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFamiNaoClass01Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFamiNaoClass01Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFamiNaoClass01Freg.noUiSlider.on('update',function(e){
        AlojaFamiNaoClass01Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloNcl01>=parseFloat(e[0])&& layer.feature.properties.F_AloNcl01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojaFamiNaoClass01Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 82;
    sliderAtivo = sliderAlojaFamiNaoClass01Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojaFamiNaoClass01Freg);
}
///////// ------------ FIM DE ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS EM 2001 POR FREGUESIA

//// -------  ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS EM 1991 Freguesia ---------- \\\\\

var minAlojaFamiNaoClass91Freg = 99;
var maxAlojaFamiNaoClass91Freg = 0;
function estiloAlojaFamiNaoClass91Freg(feature, latlng) {
    if(feature.properties.F_AloNcl91< minAlojaFamiNaoClass91Freg){
        minAlojaFamiNaoClass91Freg = feature.properties.F_AloNcl91
    }
    if(feature.properties.F_AloNcl91> maxAlojaFamiNaoClass91Freg){
        maxAlojaFamiNaoClass91Freg = feature.properties.F_AloNcl91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloNcl91,1)
    });
}
function apagarAlojaFamiNaoClass91Freg(e){
    var layer = e.target;
    AlojaFamiNaoClass91Freg.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureAlojaFamiNaoClass91Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Familiares Não Clássicos: ' + '<b>' + feature.properties.F_AloNcl91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojaFamiNaoClass91Freg,
    })
};


var AlojaFamiNaoClass91Freg = L.geoJSON(freguesiasAbsolutos1991,{
    pointToLayer:estiloAlojaFamiNaoClass91Freg,
    onEachFeature: onEachFeatureAlojaFamiNaoClass91Freg,
});


var slideAlojaFamiNaoClass91Freg = function(){
    var sliderAlojaFamiNaoClass91Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 83){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojaFamiNaoClass91Freg, {
        start: [minAlojaFamiNaoClass91Freg, maxAlojaFamiNaoClass91Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojaFamiNaoClass91Freg,
            'max': maxAlojaFamiNaoClass91Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojaFamiNaoClass91Freg);
    inputNumberMax.setAttribute("value",maxAlojaFamiNaoClass91Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojaFamiNaoClass91Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojaFamiNaoClass91Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojaFamiNaoClass91Freg.noUiSlider.on('update',function(e){
        AlojaFamiNaoClass91Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloNcl91>=parseFloat(e[0])&& layer.feature.properties.F_AloNcl91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojaFamiNaoClass91Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 83;
    sliderAtivo = sliderAlojaFamiNaoClass91Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojaFamiNaoClass91Freg);
}
///////// ------------ FIM DE ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS EM 1991 POR FREGUESIA

//// -------  ALOJAMENTOS FAMILIARES COLETIVOS EM 2021 Freguesia ---------- \\\\\

var minAlojColetivo21Freg = 99;
var maxAlojColetivo21Freg = 0;
function estiloAlojColetivo21Freg(feature, latlng) {
    if(feature.properties.F_AloCol21< minAlojColetivo21Freg){
        minAlojColetivo21Freg = feature.properties.F_AloCol21
    }
    if(feature.properties.F_AloCol21> maxAlojColetivo21Freg){
        maxAlojColetivo21Freg = feature.properties.F_AloCol21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloCol21,2)
    });
}
function apagarAlojColetivo21Freg(e){
    var layer = e.target;
    AlojColetivo21Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAlojColetivo21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Coletivos: ' + '<b>' + feature.properties.F_AloCol21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojColetivo21Freg,
    })
};


var AlojColetivo21Freg = L.geoJSON(tipoAlojamentoFreguesia,{
    pointToLayer:estiloAlojColetivo21Freg,
    onEachFeature: onEachFeatureAlojColetivo21Freg,
});


var slideAlojColetivo21Freg = function(){
    var sliderAlojColetivo21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojColetivo21Freg, {
        start: [minAlojColetivo21Freg, maxAlojColetivo21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojColetivo21Freg,
            'max': maxAlojColetivo21Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojColetivo21Freg);
    inputNumberMax.setAttribute("value",maxAlojColetivo21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojColetivo21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojColetivo21Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojColetivo21Freg.noUiSlider.on('update',function(e){
        AlojColetivo21Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloCol21>=parseFloat(e[0])&& layer.feature.properties.F_AloCol21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojColetivo21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 19;
    sliderAtivo = sliderAlojColetivo21Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojColetivo21Freg);
}
///////// ------------ FIM DE ALOJAMENTOS COLETIVOS EM 2021 POR FREGUESIA

//// -------  ALOJAMENTOS FAMILIARES COLETIVOS EM 2011 Freguesia ---------- \\\\\

var minAlojColetivo11Freg = 99;
var maxAlojColetivo11Freg = 0;
function estiloAlojColetivo11Freg(feature, latlng) {
    if(feature.properties.F_AloCol11< minAlojColetivo11Freg){
        minAlojColetivo11Freg = feature.properties.F_AloCol11
    }
    if(feature.properties.F_AloCol11> maxAlojColetivo11Freg){
        maxAlojColetivo11Freg = feature.properties.F_AloCol11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloCol11,2)
    });
}
function apagarAlojColetivo11Freg(e){
    var layer = e.target;
    AlojColetivo11Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAlojColetivo11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Coletivos: ' + '<b>' + feature.properties.F_AloCol11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojColetivo11Freg,
    })
};


var AlojColetivo11Freg = L.geoJSON(tipoAlojamentoFreguesia,{
    pointToLayer:estiloAlojColetivo11Freg,
    onEachFeature: onEachFeatureAlojColetivo11Freg,
});


var slideAlojColetivo11Freg = function(){
    var sliderAlojColetivo11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojColetivo11Freg, {
        start: [minAlojColetivo11Freg, maxAlojColetivo11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojColetivo11Freg,
            'max': maxAlojColetivo11Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojColetivo11Freg);
    inputNumberMax.setAttribute("value",maxAlojColetivo11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojColetivo11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojColetivo11Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojColetivo11Freg.noUiSlider.on('update',function(e){
        AlojColetivo11Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloCol11>=parseFloat(e[0])&& layer.feature.properties.F_AloCol11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojColetivo11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 20;
    sliderAtivo = sliderAlojColetivo11Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojColetivo11Freg);
}
///////// ------------ FIM DE ALOJAMENTOS COLETIVOS EM 2011 POR FREGUESIA ------- \\\\\\\\\\\\\

//// -------  ALOJAMENTOS FAMILIARES COLETIVOS EM 2001 Freguesia ---------- \\\\\

var minAlojColetivo01Freg = 99;
var maxAlojColetivo01Freg = 0;
function estiloAlojColetivo01Freg(feature, latlng) {
    if(feature.properties.F_AloCol01< minAlojColetivo01Freg){
        minAlojColetivo01Freg = feature.properties.F_AloCol01
    }
    if(feature.properties.F_AloCol01> maxAlojColetivo01Freg){
        maxAlojColetivo01Freg = feature.properties.F_AloCol01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloCol01,2)
    });
}
function apagarAlojColetivo01Freg(e){
    var layer = e.target;
    AlojColetivo01Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAlojColetivo01Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Coletivos: ' + '<b>' + feature.properties.F_AloCol01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojColetivo01Freg,
    })
};


var AlojColetivo01Freg = L.geoJSON(freguesiasAbsolutos2001,{
    pointToLayer:estiloAlojColetivo01Freg,
    onEachFeature: onEachFeatureAlojColetivo01Freg,
});


var slideAlojColetivo01Freg = function(){
    var sliderAlojColetivo01Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 84){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojColetivo01Freg, {
        start: [minAlojColetivo01Freg, maxAlojColetivo01Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojColetivo01Freg,
            'max': maxAlojColetivo01Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojColetivo01Freg);
    inputNumberMax.setAttribute("value",maxAlojColetivo01Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojColetivo01Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojColetivo01Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojColetivo01Freg.noUiSlider.on('update',function(e){
        AlojColetivo01Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloCol01>=parseFloat(e[0])&& layer.feature.properties.F_AloCol01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojColetivo01Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 84;
    sliderAtivo = sliderAlojColetivo01Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojColetivo01Freg);
}
///////// ------------ FIM DE ALOJAMENTOS COLETIVOS EM 2001 POR FREGUESIA ------- \\\\\\\\\\\\\

//// -------  ALOJAMENTOS FAMILIARES COLETIVOS EM 1991 Freguesia ---------- \\\\\

var minAlojColetivo91Freg = 99;
var maxAlojColetivo91Freg = 0;
function estiloAlojColetivo91Freg(feature, latlng) {
    if(feature.properties.F_AloCol91< minAlojColetivo91Freg){
        minAlojColetivo91Freg = feature.properties.F_AloCol91
    }
    if(feature.properties.F_AloCol91> maxAlojColetivo91Freg){
        maxAlojColetivo91Freg = feature.properties.F_AloCol91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_AloCol91,1.5)
    });
}
function apagarAlojColetivo91Freg(e){
    var layer = e.target;
    AlojColetivo91Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureAlojColetivo91Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Coletivos: ' + '<b>' + feature.properties.F_AloCol91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarAlojColetivo91Freg,
    })
};


var AlojColetivo91Freg = L.geoJSON(freguesiasAbsolutos1991,{
    pointToLayer:estiloAlojColetivo91Freg,
    onEachFeature: onEachFeatureAlojColetivo91Freg,
});


var slideAlojColetivo91Freg = function(){
    var sliderAlojColetivo91Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 85){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojColetivo91Freg, {
        start: [0, maxAlojColetivo91Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': 0,
            'max': maxAlojColetivo91Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minAlojColetivo91Freg);
    inputNumberMax.setAttribute("value",maxAlojColetivo91Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojColetivo91Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojColetivo91Freg.noUiSlider.set([null, this.value]);
    });

    sliderAlojColetivo91Freg.noUiSlider.on('update',function(e){
        AlojColetivo91Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_AloCol91>=parseFloat(e[0])&& layer.feature.properties.F_AloCol91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojColetivo91Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 85;
    sliderAtivo = sliderAlojColetivo91Freg.noUiSlider;
    $(slidersGeral).append(sliderAlojColetivo91Freg);
}
///////// ------------ FIM DE ALOJAMENTOS COLETIVOS EM 1991 POR FREGUESIA ------- \\\\\\\\\\\\\

//// ------------------ VARIACAO CONCELHOS --------------------------\

//////------- Variação TOTAL DE ALOJAMENTOS Concelhos entre 2021 e 2011 -----////


var minAlojVarConcelho21_11 = 0;
var maxAlojVarConcelho21_11 = 1;

function CorVarTotAlojConc21_11(d) {
    return d >= 5  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -3.08   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotAlojConc21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -3.08 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloAlojVarConcelho21_11(feature) {
    if(feature.properties.VarTot21 <= minAlojVarConcelho21_11 || minAlojVarConcelho21_11 ===0){
        minAlojVarConcelho21_11 = feature.properties.VarTot21
    }
    if(feature.properties.VarTot21 > maxAlojVarConcelho21_11){
        maxAlojVarConcelho21_11 = feature.properties.VarTot21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojConc21_11(feature.properties.VarTot21)};
    }


function apagarAlojVarConcelho21_11(e) {
    AlojVarConcelho21_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureAlojVarConcelho21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojVarConcelho21_11,
    });
}
var AlojVarConcelho21_11= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojVarConcelho21_11,
    onEachFeature: onEachFeatureAlojVarConcelho21_11
});

let slideAlojVarConcelho21_11 = function(){
    var sliderAlojVarConcelho21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojVarConcelho21_11, {
        start: [minAlojVarConcelho21_11, maxAlojVarConcelho21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojVarConcelho21_11,
            'max': maxAlojVarConcelho21_11
        },
        });
    inputNumberMin.setAttribute("value",minAlojVarConcelho21_11);
    inputNumberMax.setAttribute("value",maxAlojVarConcelho21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojVarConcelho21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojVarConcelho21_11.noUiSlider.set([null, this.value]);
    });

    sliderAlojVarConcelho21_11.noUiSlider.on('update',function(e){
        AlojVarConcelho21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarTot21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojVarConcelho21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderAlojVarConcelho21_11.noUiSlider;
    $(slidersGeral).append(sliderAlojVarConcelho21_11);
} 

///// Fim da Variação do TOTAL DE ALOJAMENTOS dos Concelhos em 2021 -------------- \\\\\\


//////------- Variação DE ALOJAMENTOS FAmiliares Concelhos entre 2021 e 2011 -----////


var minAlojFamiVarConcelho21_11 = 0;
var maxAlojFamiVarConcelho21_11 = 1;

function CorVarTotAlojFamiConc21_11(d) {
    return d >= 5  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -2.92   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotAlojFamiConc21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -2.92 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloAlojFamiVarConcelho21_11(feature) {
    if(feature.properties.VarAF21 <= minAlojFamiVarConcelho21_11 || minAlojFamiVarConcelho21_11 ===0){
        minAlojFamiVarConcelho21_11 = feature.properties.VarAF21
    }
    if(feature.properties.VarAF21 > maxAlojFamiVarConcelho21_11){
        maxAlojFamiVarConcelho21_11 = feature.properties.VarAF21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamiConc21_11(feature.properties.VarAF21)};
    }


function apagarAlojFamiVarConcelho21_11(e) {
    AlojFamiVarConcelho21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojFamiVarConcelho21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAF21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamiVarConcelho21_11,
    });
}
var AlojFamiVarConcelho21_11= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojFamiVarConcelho21_11,
    onEachFeature: onEachFeatureAlojFamiVarConcelho21_11
});
let slideAlojFamiVarConcelho21_11 = function(){
    var sliderAlojFamiVarConcelho21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamiVarConcelho21_11, {
        start: [minAlojFamiVarConcelho21_11, maxAlojFamiVarConcelho21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiVarConcelho21_11,
            'max': maxAlojFamiVarConcelho21_11
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamiVarConcelho21_11);
    inputNumberMax.setAttribute("value",maxAlojFamiVarConcelho21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamiVarConcelho21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamiVarConcelho21_11.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamiVarConcelho21_11.noUiSlider.on('update',function(e){
        AlojFamiVarConcelho21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarAF21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarAF21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamiVarConcelho21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderAlojFamiVarConcelho21_11.noUiSlider;
    $(slidersGeral).append(sliderAlojFamiVarConcelho21_11);
} 

///// Fim da Variação dos ALOJAMENTOS FAMILIARES dos Concelhos em 2021 -------------- \\\\\\



//////------- Variação DE ALOJAMENTOS FAmiliares CLÁSSICOS Concelhos entre 2021 e 2011 -----////

var minAlojFamiClassVarConcelho21_11 = 0;
var maxAlojFamiClassVarConcelho21_11 = 1;

function CorVarTotAlojFamClassConc21_11(d) {
    return d >= 5  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -3.08   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotAlojFamClassConc21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos familiares clássicos, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -2.83 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloAlojFamiClassVarConcelho21_11(feature) {
    if(feature.properties.VarAFC21 <= minAlojFamiClassVarConcelho21_11 || minAlojFamiClassVarConcelho21_11 ===0){
        minAlojFamiClassVarConcelho21_11 = feature.properties.VarAFC21
    }
    if(feature.properties.VarAFC21 > maxAlojFamiClassVarConcelho21_11){
        maxAlojFamiClassVarConcelho21_11 = feature.properties.VarAFC21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamClassConc21_11(feature.properties.VarAFC21)};
    }


function apagarAlojFamiClassVarConcelho21_11(e) {
    AlojFamiClassVarConcelho21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojFamiClassVarConcelho21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAFC21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamiClassVarConcelho21_11,
    });
}
var AlojFamiClassVarConcelho21_11= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojFamiClassVarConcelho21_11,
    onEachFeature: onEachFeatureAlojFamiClassVarConcelho21_11
});

let slideAlojFamiClassVarConcelho21_11 = function(){
    var sliderAlojFamiClassVarConcelho21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamiClassVarConcelho21_11, {
        start: [minAlojFamiClassVarConcelho21_11, maxAlojFamiClassVarConcelho21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiClassVarConcelho21_11,
            'max': maxAlojFamiClassVarConcelho21_11
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamiClassVarConcelho21_11);
    inputNumberMax.setAttribute("value",maxAlojFamiClassVarConcelho21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamiClassVarConcelho21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamiClassVarConcelho21_11.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamiClassVarConcelho21_11.noUiSlider.on('update',function(e){
        AlojFamiClassVarConcelho21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarAFC21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarAFC21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamiClassVarConcelho21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderAlojFamiClassVarConcelho21_11.noUiSlider;
    $(slidersGeral).append(AlojFamiClassVarConcelho21_11);
} 

///// Fim da Variação dos ALOJAMENTOS FAMILIARES dos Concelhos em 2021 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES  NÃO CLÁSSICOS dos Concelhos entre 2021 e 2011-----////

var minAlojFamiNaoClassVarConcelho21_11 = 0;
var maxAlojFamiNaoClassVarConcelho21_11 = 1;

function CorVarTotAlojFamNaoClassConc21_11(d) {
    return d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50 ? '#9eaad7' :
        d >= -100   ? '#2288bf' :
                ''  ;
}

var legendaVarTotAlojFamNaoClassConc21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos familiares não clássicos, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloAlojFamiNaoClassVarConcelho21_11(feature) {
    if(feature.properties.VarANC21 <= minAlojFamiNaoClassVarConcelho21_11 || minAlojFamiNaoClassVarConcelho21_11 ===0){
        minAlojFamiNaoClassVarConcelho21_11 = feature.properties.VarANC21
    }
    if(feature.properties.VarANC21 > maxAlojFamiNaoClassVarConcelho21_11){
        maxAlojFamiNaoClassVarConcelho21_11 = feature.properties.VarANC21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamNaoClassConc21_11(feature.properties.VarANC21)};
    }


function apagarAlojFamiNaoClassVarConcelho21_11(e) {
    AlojFamiNaoClassVarConcelho21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojFamiNaoClassVarConcelho21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarANC21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamiNaoClassVarConcelho21_11,
    });
}
var AlojFamiNaoClassVarConcelho21_11= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojFamiNaoClassVarConcelho21_11,
    onEachFeature: onEachFeatureAlojFamiNaoClassVarConcelho21_11
});

let slideAlojFamiNaoClassVarConcelho21_11 = function(){
    var sliderAlojFamiNaoClassVarConcelho21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamiNaoClassVarConcelho21_11, {
        start: [minAlojFamiNaoClassVarConcelho21_11, maxAlojFamiNaoClassVarConcelho21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiNaoClassVarConcelho21_11,
            'max': maxAlojFamiNaoClassVarConcelho21_11
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamiNaoClassVarConcelho21_11);
    inputNumberMax.setAttribute("value",maxAlojFamiNaoClassVarConcelho21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamiNaoClassVarConcelho21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamiNaoClassVarConcelho21_11.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamiNaoClassVarConcelho21_11.noUiSlider.on('update',function(e){
        AlojFamiNaoClassVarConcelho21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarANC21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarANC21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamiNaoClassVarConcelho21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderAlojFamiNaoClassVarConcelho21_11.noUiSlider;
    $(slidersGeral).append(sliderAlojFamiNaoClassVarConcelho21_11);
} 

///// Fim da Variação dos ALOJAMENTOS FAMILIARES  NÃO CLÁSSICOS dos Concelhos entre 2021 e 2011 -------------- \\\\\\


//////------- Variação dos ALOJAMENTOS FAMILIARES Coletivos dos Concelhos entre 2021 e 2011-----////

var minAlojColetivosVarConcelho21_11 = 0;
var maxAlojColetivosVarConcelho21_11 = 1;

function CorVarTotAlojColetivosConc21_11(d) {
    return d >= 0  ? '#f5b3be' :
        d >= -20  ? '#9eaad7' :
        d >= -40 ? '#2288bf' :
        d >= -62   ? '#155273' :
                ''  ;
}

var legendaVarTotAlojColetivosConc21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos coletivos, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '   > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  -20 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + '  -40 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + '  -61.9 a -40' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloAlojColetivosVarConcelho21_11(feature) {
    if(feature.properties.VarAC21 <= minAlojColetivosVarConcelho21_11 || minAlojColetivosVarConcelho21_11 ===0){
        minAlojColetivosVarConcelho21_11 = feature.properties.VarAC21
    }
    if(feature.properties.VarAC21 > maxAlojColetivosVarConcelho21_11){
        maxAlojColetivosVarConcelho21_11 = feature.properties.VarAC21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojColetivosConc21_11(feature.properties.VarAC21)};
    }


function apagarAlojColetivosVarConcelho21_11(e) {
    AlojColetivosVarConcelho21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojColetivosVarConcelho21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAC21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojColetivosVarConcelho21_11,
    });
}
var AlojColetivosVarConcelho21_11= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojColetivosVarConcelho21_11,
    onEachFeature: onEachFeatureAlojColetivosVarConcelho21_11
});

let slideAlojColetivosVarConcelho21_11 = function(){
    var sliderAlojColetivosVarConcelho21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojColetivosVarConcelho21_11, {
        start: [minAlojColetivosVarConcelho21_11, maxAlojColetivosVarConcelho21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojColetivosVarConcelho21_11,
            'max': maxAlojColetivosVarConcelho21_11
        },
        });
    inputNumberMin.setAttribute("value",minAlojColetivosVarConcelho21_11);
    inputNumberMax.setAttribute("value",maxAlojColetivosVarConcelho21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojColetivosVarConcelho21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojColetivosVarConcelho21_11.noUiSlider.set([null, this.value]);
    });

    sliderAlojColetivosVarConcelho21_11.noUiSlider.on('update',function(e){
        AlojColetivosVarConcelho21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarAC21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarAC21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojColetivosVarConcelho21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderAlojColetivosVarConcelho21_11.noUiSlider;
    $(slidersGeral).append(sliderAlojColetivosVarConcelho21_11);
} 

///// Fim da Variação dos ALOJAMENTOS FAMILIARES Coletivos dos Concelhos entre 2021 e 2011 -------------- \\\\\\



////// ---------------------------- VARIAÇÃO DOS ALOJAMENTOS ENTRE 2011 E 2001 \\\\\\\\\\\\\\\\\\\\\\\\\\\

/////Variação do Total de Alojamentos entre 2011 e 001


var minAlojVarConcelho11_01 = 0;
var maxAlojVarConcelho11_01 = 0;

function CorVarTotAlojConc11_01(d) {
    return d >= 21  ? '#8c0303' :
        d >= 18  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 12  ? '#f5b3be' :
        d >= 8.13   ? '#F2C572' :
                ''  ;
}

var legendaVarTotAlojConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 21' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 18 a 21' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 15 a 18' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 12 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 8.14 a 12' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloAlojVarConcelho11_01(feature) {
    if(feature.properties.VarTot11 <= minAlojVarConcelho11_01 || minAlojVarConcelho11_01 ===0){
        minAlojVarConcelho11_01 = feature.properties.VarTot11
    }
    if(feature.properties.VarTot11 > maxAlojVarConcelho11_01){
        maxAlojVarConcelho11_01 = feature.properties.VarTot11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojConc11_01(feature.properties.VarTot11)};
    }


function apagarAlojVarConcelho11_01(e) {
    AlojVarConcelho11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojVarConcelho11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojVarConcelho11_01,
    });
}
var AlojVarConcelho11_01= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojVarConcelho11_01,
    onEachFeature: onEachFeatureAlojVarConcelho11_01
});
let slideAlojVarConcelho11_01 = function(){
    var sliderAlojVarConcelho11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 47){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojVarConcelho11_01, {
        start: [minAlojVarConcelho11_01, maxAlojVarConcelho11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojVarConcelho11_01,
            'max': maxAlojVarConcelho11_01
        },
        });
    inputNumberMin.setAttribute("value",minAlojVarConcelho11_01);
    inputNumberMax.setAttribute("value",maxAlojVarConcelho11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojVarConcelho11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojVarConcelho11_01.noUiSlider.set([null, this.value]);
    });

    sliderAlojVarConcelho11_01.noUiSlider.on('update',function(e){
        AlojVarConcelho11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarTot11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojVarConcelho11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 47;
    sliderAtivo = sliderAlojVarConcelho11_01.noUiSlider;
    $(slidersGeral).append(sliderAlojVarConcelho11_01);
} 

///// Fim da Variação do TOTAL DE ALOJAMENTOS dos Concelhos em 2011 e 2001 -------------- \\\\\\


/////Variação do Total de Alojamentos entre 2001 e 1991


var minAlojVarConcelho01_91 = 0;
var maxAlojVarConcelho01_91 = 0;

function CorVarTotAlojConc01_91(d) {
    return  d == null ? '#000000' :
        d >= 50  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -18.28   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotAlojConc01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  30 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -18.28 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloAlojVarConcelho01_91(feature) {
    if(feature.properties.VarTot01 <= minAlojVarConcelho01_91 || minAlojVarConcelho01_91 ===0){
        minAlojVarConcelho01_91 = feature.properties.VarTot01- 0.01
    }
    if(feature.properties.VarTot01 > maxAlojVarConcelho01_91){
        maxAlojVarConcelho01_91 = feature.properties.VarTot01 + 0.01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojConc01_91(feature.properties.VarTot01)};
    }


function apagarAlojVarConcelho01_91(e) {
    AlojVarConcelho01_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojVarConcelho01_91(feature, layer) {
    if(feature.properties.VarTot01 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojVarConcelho01_91,
    });
}
var AlojVarConcelho01_91= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojVarConcelho01_91,
    onEachFeature: onEachFeatureAlojVarConcelho01_91
});

let slideAlojVarConcelho01_91 = function(){
    var sliderAlojVarConcelho01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 62){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojVarConcelho01_91, {
        start: [minAlojVarConcelho01_91 , maxAlojVarConcelho01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojVarConcelho01_91,
            'max': maxAlojVarConcelho01_91
        },
        });
    inputNumberMin.setAttribute("value",minAlojVarConcelho01_91);
    inputNumberMax.setAttribute("value",maxAlojVarConcelho01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojVarConcelho01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojVarConcelho01_91.noUiSlider.set([null, this.value]);
    });

    sliderAlojVarConcelho01_91.noUiSlider.on('update',function(e){
        AlojVarConcelho01_91.eachLayer(function(layer){
            if(layer.feature.properties.VarTot01>=parseFloat(e[0])&& layer.feature.properties.VarTot01<= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojVarConcelho01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 62;
    sliderAtivo = sliderAlojVarConcelho01_91.noUiSlider;
    $(slidersGeral).append(sliderAlojVarConcelho01_91);
} 

///// Fim da Variação do TOTAL DE ALOJAMENTOS dos Concelhos entre 2001 e 1991 -------------- \\\\\\


//////------- Variação DE ALOJAMENTOS FAmiliares Concelhos entre 2011 e 2001 -----////

var minAlojFamiVarConcelho11_01 = 0;
var maxAlojFamiVarConcelho11_01 = 0;

function CorVarTotAlojFamiConc11_01(d) {
    return d >= 21  ? '#8c0303' :
        d >= 18  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 12  ? '#f5b3be' :
        d >= 8.13   ? '#F2C572' :
                ''  ;
}

var legendaVarTotAlojFamiConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 21' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  18 a 21' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 18' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  12 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + '  8.13 a 12' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloAlojFamiVarConcelho11_01(feature) {
    if(feature.properties.VarAF11 <= minAlojFamiVarConcelho11_01 || minAlojFamiVarConcelho11_01 ===0){
        minAlojFamiVarConcelho11_01 = feature.properties.VarAF11
    }
    if(feature.properties.VarAF11 > maxAlojFamiVarConcelho11_01){
        maxAlojFamiVarConcelho11_01 = feature.properties.VarAF11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamiConc11_01(feature.properties.VarAF11)};
    }


function apagarAlojFamiVarConcelho11_01(e) {
    AlojFamiVarConcelho11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojFamiVarConcelho11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAF11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamiVarConcelho11_01,
    });
}
var AlojFamiVarConcelho11_01= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojFamiVarConcelho11_01,
    onEachFeature: onEachFeatureAlojFamiVarConcelho11_01
});

let slideAlojFamiVarConcelho11_01 = function(){
    var sliderAlojFamiVarConcelho11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 48){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamiVarConcelho11_01, {
        start: [minAlojFamiVarConcelho11_01, maxAlojFamiVarConcelho11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiVarConcelho11_01,
            'max': maxAlojFamiVarConcelho11_01
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamiVarConcelho11_01);
    inputNumberMax.setAttribute("value",maxAlojFamiVarConcelho11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamiVarConcelho11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamiVarConcelho11_01.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamiVarConcelho11_01.noUiSlider.on('update',function(e){
        AlojFamiVarConcelho11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarAF11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarAF11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamiVarConcelho11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 48;
    sliderAtivo = sliderAlojFamiVarConcelho11_01.noUiSlider;
    $(slidersGeral).append(sliderAlojFamiVarConcelho11_01);
} 

///// Fim da Variação dos ALOJAMENTOS FAMILIARES dos Concelhos entre 2011 e 2001-------------- \\\\\\

//////------- Variação DE ALOJAMENTOS FAmiliares Concelhos entre 2001 e 1991 -----////

function CorVariacaoTotalFreg(d) {
    return  d == null ? '#000000' :
        d >= 50  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -18.24   ? '#9eaad7' :
                ''  ;
}
var minAlojFamiVarConcelho01_91 = 0;
var maxAlojFamiVarConcelho01_91 = 0;

function CorVarTotAlojFamiConc01_91(d) {
    return  d == null ? '#000000' :
        d >= 50  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -18.24   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotAlojFamiConc01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  30 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -18.24 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloAlojFamiVarConcelho01_91(feature) {
    if(feature.properties.VarAF01 <= minAlojFamiVarConcelho01_91 || minAlojFamiVarConcelho01_91 ===0){
        minAlojFamiVarConcelho01_91 = feature.properties.VarAF01
    }
    if(feature.properties.VarAF01 > maxAlojFamiVarConcelho01_91){
        maxAlojFamiVarConcelho01_91 = feature.properties.VarAF01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamiConc01_91(feature.properties.VarAF01)};
    }


function apagarAlojFamiVarConcelho01_91(e) {
    AlojFamiVarConcelho01_91.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeatureAlojFamiVarConcelho01_91(feature, layer) {
    if(feature.properties.VarAF01 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAF01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamiVarConcelho01_91,
    });
}
var AlojFamiVarConcelho01_91= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojFamiVarConcelho01_91,
    onEachFeature: onEachFeatureAlojFamiVarConcelho01_91
});

let slideAlojFamiVarConcelho01_91 = function(){
    var sliderAlojFamiVarConcelho01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 63){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamiVarConcelho01_91, {
        start: [minAlojFamiVarConcelho01_91, maxAlojFamiVarConcelho01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiVarConcelho01_91,
            'max': maxAlojFamiVarConcelho01_91
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamiVarConcelho01_91);
    inputNumberMax.setAttribute("value",maxAlojFamiVarConcelho01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamiVarConcelho01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamiVarConcelho01_91.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamiVarConcelho01_91.noUiSlider.on('update',function(e){
        AlojFamiVarConcelho01_91.eachLayer(function(layer){
            if(layer.feature.properties.VarAF01>=parseFloat(e[0])&& layer.feature.properties.VarAF01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamiVarConcelho01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 63;
    sliderAtivo = sliderAlojFamiVarConcelho01_91.noUiSlider;
    $(slidersGeral).append(sliderAlojFamiVarConcelho01_91);
} 

///// Fim da Variação dos ALOJAMENTOS FAMILIARES dos Concelhos entre 2001 e 1991-------------- \\\\\\



//////------- Variação DE ALOJAMENTOS FAmiliares CLÁSSICOS Concelhos entre 2011 e 2001 -----////


var minAlojFamiClassVarConcelho11_01 = 0;
var maxAlojFamiClassVarConcelho11_01 = 0;

function CorVarTotAlojFamClassConc11_01(d) {
    return  d >= 18  ? '#8c0303' :
        d >= 15  ? '#de1f35' :
        d >= 12  ? '#ff5e6e' :
        d >= 9.28   ? '#f5b3be' :
                ''  ;
}

var legendaVarTotAlojFamClassConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares clássicos, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 18' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  15 a 18' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  12 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  9.28 a 12' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloAlojFamiClassVarConcelho11_01(feature) {
    if(feature.properties.VarAFC11 <= minAlojFamiClassVarConcelho11_01 || minAlojFamiClassVarConcelho11_01 ===0){
        minAlojFamiClassVarConcelho11_01 = feature.properties.VarAFC11
    }
    if(feature.properties.VarAFC11 > maxAlojFamiClassVarConcelho11_01){
        maxAlojFamiClassVarConcelho11_01 = feature.properties.VarAFC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamClassConc11_01(feature.properties.VarAFC11)};
    }


function apagarAlojFamiClassVarConcelho11_01(e) {
    AlojFamiClassVarConcelho11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojFamiClassVarConcelho11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAFC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamiClassVarConcelho11_01,
    });
}
var AlojFamiClassVarConcelho11_01= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojFamiClassVarConcelho11_01,
    onEachFeature: onEachFeatureAlojFamiClassVarConcelho11_01
});

let slideAlojFamiClassVarConcelho11_01 = function(){
    var sliderAlojFamiClassVarConcelho11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 49){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamiClassVarConcelho11_01, {
        start: [minAlojFamiClassVarConcelho11_01, maxAlojFamiClassVarConcelho11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiClassVarConcelho11_01,
            'max': maxAlojFamiClassVarConcelho11_01
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamiClassVarConcelho11_01);
    inputNumberMax.setAttribute("value",maxAlojFamiClassVarConcelho11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamiClassVarConcelho11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamiClassVarConcelho11_01.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamiClassVarConcelho11_01.noUiSlider.on('update',function(e){
        AlojFamiClassVarConcelho11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarAFC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarAFC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamiClassVarConcelho11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 49;
    sliderAtivo = sliderAlojFamiClassVarConcelho11_01.noUiSlider;
    $(slidersGeral).append(AlojFamiClassVarConcelho11_01);
} 

///// Fim da Variação dos ALOJAMENTOS FAMILIARES CLÁSSICOS dos Concelhos entre 2011 e 2001 -------------- \\\\\\

//////------- Variação DE ALOJAMENTOS FAmiliares CLÁSSICOS Concelhos entre 2001 e 1991 -----////

var minAlojFamiClassVarConcelho01_91 = 0;
var maxAlojFamiClassVarConcelho01_91 = 0;

function CorVarTotAlojFamClassConc01_91(d) {
    return  d == null ? '#000000' :
        d >= 50  ? '#8c0303' :
        d >= 40  ? '#de1f35' :
        d >= 20  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -18.17   ? '#9eaad7' :
                ''  ;
}
var legendaVarTotAlojFamClassConc01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares clássicos, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '   > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '   40 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '   20 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '   0 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  -18.17 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + '  Sem informação disponível' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloAlojFamiClassVarConcelho01_91(feature) {
    if(feature.properties.VarAFC01 <= minAlojFamiClassVarConcelho01_91 || minAlojFamiClassVarConcelho01_91 ===0){
        minAlojFamiClassVarConcelho01_91 = feature.properties.VarAFC01 
    }
    if(feature.properties.VarAFC01 > maxAlojFamiClassVarConcelho01_91){
        maxAlojFamiClassVarConcelho01_91 = feature.properties.VarAFC01 +0.01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamClassConc01_91(feature.properties.VarAFC01)};
    }


function apagarAlojFamiClassVarConcelho01_91(e) {
    AlojFamiClassVarConcelho01_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojFamiClassVarConcelho01_91(feature, layer) {
    if(feature.properties.VarAFC01 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAFC01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamiClassVarConcelho01_91,
    });
}
var AlojFamiClassVarConcelho01_91= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojFamiClassVarConcelho01_91,
    onEachFeature: onEachFeatureAlojFamiClassVarConcelho01_91
});

let slideAlojFamiClassVarConcelho01_91 = function(){
    var sliderAlojFamiClassVarConcelho01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 64){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamiClassVarConcelho01_91, {
        start: [minAlojFamiClassVarConcelho01_91, maxAlojFamiClassVarConcelho01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiClassVarConcelho01_91,
            'max': maxAlojFamiClassVarConcelho01_91
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamiClassVarConcelho01_91);
    inputNumberMax.setAttribute("value",maxAlojFamiClassVarConcelho01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamiClassVarConcelho01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamiClassVarConcelho01_91.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamiClassVarConcelho01_91.noUiSlider.on('update',function(e){
        AlojFamiClassVarConcelho01_91.eachLayer(function(layer){
            if(layer.feature.properties.VarAFC01>=parseFloat(e[0])&& layer.feature.properties.VarAFC01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamiClassVarConcelho01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 64;
    sliderAtivo = sliderAlojFamiClassVarConcelho01_91.noUiSlider;
    $(slidersGeral).append(AlojFamiClassVarConcelho01_91);
} 

///// Fim da Variação dos ALOJAMENTOS FAMILIARES dos Concelhos entre 2001 e 1991 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS dos Concelhos entre 2011 e 2001-----////

var minAlojFamiNaoClassVarConcelho11_01 = 0;
var maxAlojFamiNaoClassVarConcelho11_01 = 0;

function CorVarTotAlojFamNaoClassConc11_01(d) {
    return  d >= -50  ? '#9eaad7' :
        d >= -75  ? '#2288bf' :
        d >= -100   ? '#155273' :
                ''  ;
}
var legendaVarTotAlojFamNaoClassConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares não clássicos, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + '  -75 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + '  -100 a -75' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloAlojFamiNaoClassVarConcelho11_01(feature) {
    if(feature.properties.VarANC11 <= minAlojFamiNaoClassVarConcelho11_01 || minAlojFamiNaoClassVarConcelho11_01 ===0){
        minAlojFamiNaoClassVarConcelho11_01 = feature.properties.VarANC11 
    }
    if(feature.properties.VarANC11 > maxAlojFamiNaoClassVarConcelho11_01){
        maxAlojFamiNaoClassVarConcelho11_01 = feature.properties.VarANC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamNaoClassConc11_01(feature.properties.VarANC11)};
    }


function apagarAlojFamiNaoClassVarConcelho11_01(e) {
    AlojFamiNaoClassVarConcelho11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojFamiNaoClassVarConcelho11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarANC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamiNaoClassVarConcelho11_01,
    });
}
var AlojFamiNaoClassVarConcelho11_01= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojFamiNaoClassVarConcelho11_01,
    onEachFeature: onEachFeatureAlojFamiNaoClassVarConcelho11_01
});

let slideAlojFamiNaoClassVarConcelho11_01 = function(){
    var sliderAlojFamiNaoClassVarConcelho11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 50){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamiNaoClassVarConcelho11_01, {
        start: [minAlojFamiNaoClassVarConcelho11_01, maxAlojFamiNaoClassVarConcelho11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiNaoClassVarConcelho11_01,
            'max': maxAlojFamiNaoClassVarConcelho11_01
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamiNaoClassVarConcelho11_01);
    inputNumberMax.setAttribute("value",maxAlojFamiNaoClassVarConcelho11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamiNaoClassVarConcelho11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamiNaoClassVarConcelho11_01.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamiNaoClassVarConcelho11_01.noUiSlider.on('update',function(e){
        AlojFamiNaoClassVarConcelho11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarANC11>=parseFloat(e[0])&& layer.feature.properties.VarANC11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamiNaoClassVarConcelho11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 50;
    sliderAtivo = sliderAlojFamiNaoClassVarConcelho11_01.noUiSlider;
    $(slidersGeral).append(sliderAlojFamiNaoClassVarConcelho11_01);
} 

///// Fim da Variação dos ALOJAMENTOS FAMILIARES  NÃO CLÁSSICOS dos Concelhos entre 2011 e 2001 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS dos Concelhos entre 2001 e 1991-----////


var minAlojFamiNaoClassVarConcelho01_91 = 0;
var maxAlojFamiNaoClassVarConcelho01_91 = 0;

function CorVarTotAlojFamNaoClassConc01_91(d) {
    return  d == null ? '#000000' :
        d >= 100  ? '#8c0303' :
        d >= 75  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -35.92   ? '#9eaad7' :
                ''  ;
}
var legendaVarTotAlojFamNaoClassConc01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares não clássicos, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '   > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '   75 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '   50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '   0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  -35.92 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + '  Sem informação disponível' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloAlojFamiNaoClassVarConcelho01_91(feature) {
    if(feature.properties.VarANC01 <= minAlojFamiNaoClassVarConcelho01_91 || minAlojFamiNaoClassVarConcelho01_91 ===0){
        minAlojFamiNaoClassVarConcelho01_91 = feature.properties.VarANC01 - 0.1
    }
    if(feature.properties.VarANC01 > maxAlojFamiNaoClassVarConcelho01_91){
        maxAlojFamiNaoClassVarConcelho01_91 = feature.properties.VarANC01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamNaoClassConc01_91(feature.properties.VarANC01)};
    }


function apagarAlojFamiNaoClassVarConcelho01_91(e) {
    AlojFamiNaoClassVarConcelho01_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojFamiNaoClassVarConcelho01_91(feature, layer) {
    if(feature.properties.VarANC01 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarANC01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamiNaoClassVarConcelho01_91,
    });
}
var AlojFamiNaoClassVarConcelho01_91= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojFamiNaoClassVarConcelho01_91,
    onEachFeature: onEachFeatureAlojFamiNaoClassVarConcelho01_91
});

let slideAlojFamiNaoClassVarConcelho01_91 = function(){
    var sliderAlojFamiNaoClassVarConcelho01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 65){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamiNaoClassVarConcelho01_91, {
        start: [minAlojFamiNaoClassVarConcelho01_91, maxAlojFamiNaoClassVarConcelho01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamiNaoClassVarConcelho01_91,
            'max': maxAlojFamiNaoClassVarConcelho01_91
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamiNaoClassVarConcelho01_91);
    inputNumberMax.setAttribute("value",maxAlojFamiNaoClassVarConcelho01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamiNaoClassVarConcelho01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamiNaoClassVarConcelho01_91.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamiNaoClassVarConcelho01_91.noUiSlider.on('update',function(e){
        AlojFamiNaoClassVarConcelho01_91.eachLayer(function(layer){
            if(layer.feature.properties.VarANC01>=parseFloat(e[0])&& layer.feature.properties.VarANC01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamiNaoClassVarConcelho01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 65;
    sliderAtivo = sliderAlojFamiNaoClassVarConcelho01_91.noUiSlider;
    $(slidersGeral).append(sliderAlojFamiNaoClassVarConcelho01_91);
} 

///// Fim da Variação dos ALOJAMENTOS FAMILIARES  NÃO CLÁSSICOS dos Concelhos entre 2001 e 1991 -------------- \\\\\\


//////------- Variação dos ALOJAMENTOS FAMILIARES Coletivos dos Concelhos entre 2011 e 2001-----////

var minAlojColetivosVarConcelho11_01 = 0;
var maxAlojColetivosVarConcelho11_01 = 0;

function CorVarTotAlojColetivosConc11_01(d) {
    return  d >= 75  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10.53   ? '#9eaad7' :
                ''  ;
}
var legendaVarTotAlojColetivosConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos coletivos, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '   > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '   50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '   25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '   0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  -10.53 a 0' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloAlojColetivosVarConcelho11_01(feature) {
    if(feature.properties.VarAC11 <= minAlojColetivosVarConcelho11_01 || minAlojColetivosVarConcelho11_01 ===0){
        minAlojColetivosVarConcelho11_01 = feature.properties.VarAC11 
    }
    if(feature.properties.VarAC11 > maxAlojColetivosVarConcelho11_01){
        maxAlojColetivosVarConcelho11_01 = feature.properties.VarAC11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojColetivosConc11_01(feature.properties.VarAC11)};
    }


function apagarAlojColetivosVarConcelho11_01(e) {
    AlojColetivosVarConcelho11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojColetivosVarConcelho11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojColetivosVarConcelho11_01,
    });
}
var AlojColetivosVarConcelho11_01= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojColetivosVarConcelho11_01,
    onEachFeature: onEachFeatureAlojColetivosVarConcelho11_01
});

let slideAlojColetivosVarConcelho11_01 = function(){
    var sliderAlojColetivosVarConcelho11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 51){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojColetivosVarConcelho11_01, {
        start: [minAlojColetivosVarConcelho11_01, maxAlojColetivosVarConcelho11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojColetivosVarConcelho11_01,
            'max': maxAlojColetivosVarConcelho11_01
        },
        });
    inputNumberMin.setAttribute("value",minAlojColetivosVarConcelho11_01);
    inputNumberMax.setAttribute("value",maxAlojColetivosVarConcelho11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojColetivosVarConcelho11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojColetivosVarConcelho11_01.noUiSlider.set([null, this.value]);
    });

    sliderAlojColetivosVarConcelho11_01.noUiSlider.on('update',function(e){
        AlojColetivosVarConcelho11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarAC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarAC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojColetivosVarConcelho11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 51;
    sliderAtivo = sliderAlojColetivosVarConcelho11_01.noUiSlider;
    $(slidersGeral).append(sliderAlojColetivosVarConcelho11_01);
} 

///// Fim da Variação dos ALOJAMENTOS FAMILIARES Coletivos dos Concelhos entre 2011 e 2001 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES Coletivos dos Concelhos entre 2001 e 1991-----////


var minAlojColetivosVarConcelho01_91 = 0;
var maxAlojColetivosVarConcelho01_91 = 0;

function CorVarTotAlojColetivosConc01_91(d) {
    return  d == null ? '#000000' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -71.88   ? '#2288bf' :
                ''  ;
}
var legendaVarTotAlojColetivosConc01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos coletivos, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '   > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '   25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '   0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + '  -71.88 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + '  Sem informação disponível' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloAlojColetivosVarConcelho01_91(feature) {
    if(feature.properties.VarAC01 <= minAlojColetivosVarConcelho01_91 || minAlojColetivosVarConcelho01_91 ===0){
        minAlojColetivosVarConcelho01_91 = feature.properties.VarAC01 
    }
    if(feature.properties.VarAC01 > maxAlojColetivosVarConcelho01_91){
        maxAlojColetivosVarConcelho01_91 = feature.properties.VarAC01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojColetivosConc01_91(feature.properties.VarAC01)};
    }


function apagarAlojColetivosVarConcelho01_91(e) {
    AlojColetivosVarConcelho01_91.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeatureAlojColetivosVarConcelho01_91(feature, layer) {
    if(feature.properties.VarAC01 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAC01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojColetivosVarConcelho01_91,
    });
}
var AlojColetivosVarConcelho01_91= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojColetivosVarConcelho01_91,
    onEachFeature: onEachFeatureAlojColetivosVarConcelho01_91
});

let slideAlojColetivosVarConcelho01_91 = function(){
    var sliderAlojColetivosVarConcelho01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 66){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojColetivosVarConcelho01_91, {
        start: [minAlojColetivosVarConcelho01_91, maxAlojColetivosVarConcelho01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojColetivosVarConcelho01_91,
            'max': maxAlojColetivosVarConcelho01_91
        },
        });
    inputNumberMin.setAttribute("value",minAlojColetivosVarConcelho01_91);
    inputNumberMax.setAttribute("value",maxAlojColetivosVarConcelho01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojColetivosVarConcelho01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojColetivosVarConcelho01_91.noUiSlider.set([null, this.value]);
    });

    sliderAlojColetivosVarConcelho01_91.noUiSlider.on('update',function(e){
        AlojColetivosVarConcelho01_91.eachLayer(function(layer){
            if(layer.feature.properties.VarAC01>=parseFloat(e[0])&& layer.feature.properties.VarAC01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojColetivosVarConcelho01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 66;
    sliderAtivo = sliderAlojColetivosVarConcelho01_91.noUiSlider;
    $(slidersGeral).append(sliderAlojColetivosVarConcelho01_91);
} 

///// Fim da Variação dos ALOJAMENTOS FAMILIARES Coletivos dos Concelhos entre 2001 e 1991 -------------- \\\\\\

/////////////////////////////////----------------------- VARIAÇÃO FREGUESIAS -------------\\\\\\\\\\\\\\\\\\\\\

//////------- Variação dos ALOJAMENTOS das Freguesias entre 2021 e 2011-----////

var minVarTotalAlojFreg21_11 = 0;
var maxVarTotalAlojFreg21_11 = 1;

function CorVarTotAlojFreg21_11(d) {
    return d >= 5  ? '#f5b3be' :
        d >= 0  ? '#f5b3be' :
        d >= -5 ? '#9eaad7' :
        d >= -12.27   ? '#2288bf' :
                ''  ;
}

var legendaVarTotAlojFreg21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos, entre 2021 e 2011, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -12.26 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalAlojFreg21_11(feature) {
    if(feature.properties.VarTot21 <= minVarTotalAlojFreg21_11 || minVarTotalAlojFreg21_11 ===0){
        minVarTotalAlojFreg21_11 = feature.properties.VarTot21 
    }
    if(feature.properties.VarTot21 > maxVarTotalAlojFreg21_11){
        maxVarTotalAlojFreg21_11 = feature.properties.VarTot21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFreg21_11(feature.properties.VarTot21)};
    }


function apagarVarTotalAlojFreg21_11(e) {
    VarTotalAlojFreg21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarTotalAlojFreg21_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarTot21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalAlojFreg21_11,
    });
}
var VarTotalAlojFreg21_11= L.geoJSON(VarTipoAlojamentoFreg, {
    style:EstiloVarTotalAlojFreg21_11,
    onEachFeature: onEachFeatureVarTotalAlojFreg21_11
});

let slideVarTotalAlojFreg21_11 = function(){
    var sliderVarTotalAlojFreg21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalAlojFreg21_11, {
        start: [minVarTotalAlojFreg21_11, maxVarTotalAlojFreg21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalAlojFreg21_11,
            'max': maxVarTotalAlojFreg21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalAlojFreg21_11);
    inputNumberMax.setAttribute("value",maxVarTotalAlojFreg21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalAlojFreg21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalAlojFreg21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalAlojFreg21_11.noUiSlider.on('update',function(e){
        VarTotalAlojFreg21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarTot21>=parseFloat(e[0])&& layer.feature.properties.VarTot21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalAlojFreg21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderVarTotalAlojFreg21_11.noUiSlider;
    $(slidersGeral).append(sliderVarTotalAlojFreg21_11);
} 

///// Fim da Variação dos ALOJAMENTOS Por Freguesia entre 2021 e 2011 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS das Freguesias entre 2011 e 2001-----////

var minVarTotalAlojFreg11_01 = 0;
var maxVarTotalAlojFreg11_01 = 1;

function CorVarTotAlojFreg11_01(d) {
    return d >= 50  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -13.67   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotAlojFreg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  30 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -13.66 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarTotalAlojFreg11_01(feature) {
    if(feature.properties.VarTot11 <= minVarTotalAlojFreg11_01 || minVarTotalAlojFreg11_01 ===0){
        minVarTotalAlojFreg11_01 = feature.properties.VarTot11
    }
    if(feature.properties.VarTot11 > maxVarTotalAlojFreg11_01){
        maxVarTotalAlojFreg11_01 = feature.properties.VarTot11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFreg11_01(feature.properties.VarTot11)};
    }


function apagarVarTotalAlojFreg11_01(e) {
    VarTotalAlojFreg11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarTotalAlojFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarTot11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalAlojFreg11_01,
    });
}
var VarTotalAlojFreg11_01= L.geoJSON(freguesiasRelativos2001, {
    style:EstiloVarTotalAlojFreg11_01,
    onEachFeature: onEachFeatureVarTotalAlojFreg11_01
});

let slideVarTotalAlojFreg11_01 = function(){
    var sliderVarTotalAlojFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 86){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalAlojFreg11_01, {
        start: [minVarTotalAlojFreg11_01, maxVarTotalAlojFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalAlojFreg11_01,
            'max': maxVarTotalAlojFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalAlojFreg11_01);
    inputNumberMax.setAttribute("value",maxVarTotalAlojFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalAlojFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalAlojFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalAlojFreg11_01.noUiSlider.on('update',function(e){
        VarTotalAlojFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarTot11>=parseFloat(e[0])&& layer.feature.properties.VarTot11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalAlojFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 86;
    sliderAtivo = sliderVarTotalAlojFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarTotalAlojFreg11_01);
} 

///// Fim da Variação dos ALOJAMENTOS Por Freguesia entre 2011 e 2001 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS das Freguesias entre 2001 e 1991-----////


var minVarTotalAlojFreg01_91 = 0;
var maxVarTotalAlojFreg01_91 = 1;

function CorVarTotAlojFreg01_91(d) {
    return d >= 50  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -54.14   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotAlojFreg01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos, entre 2001 e 1991, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  30 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -54.13 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalAlojFreg01_91(feature) {
    if(feature.properties.VarTot01 <= minVarTotalAlojFreg01_91 || minVarTotalAlojFreg01_91 ===0){
        minVarTotalAlojFreg01_91 = feature.properties.VarTot01
    }
    if(feature.properties.VarTot01 > maxVarTotalAlojFreg01_91){
        maxVarTotalAlojFreg01_91 = feature.properties.VarTot01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFreg01_91(feature.properties.VarTot01)};
    }


function apagarVarTotalAlojFreg01_91(e) {
    VarTotalAlojFreg01_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarTotalAlojFreg01_91(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarTot01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalAlojFreg01_91,
    });
}
var VarTotalAlojFreg01_91= L.geoJSON(freguesiasRelativos2001, {
    style:EstiloVarTotalAlojFreg01_91,
    onEachFeature: onEachFeatureVarTotalAlojFreg01_91
});

let slideVarTotalAlojFreg01_91 = function(){
    var sliderVarTotalAlojFreg01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 87){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalAlojFreg01_91, {
        start: [minVarTotalAlojFreg01_91, maxVarTotalAlojFreg01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalAlojFreg01_91,
            'max': maxVarTotalAlojFreg01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalAlojFreg01_91);
    inputNumberMax.setAttribute("value",maxVarTotalAlojFreg01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalAlojFreg01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalAlojFreg01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalAlojFreg01_91.noUiSlider.on('update',function(e){
        VarTotalAlojFreg01_91.eachLayer(function(layer){
            if(layer.feature.properties.VarTot01>=parseFloat(e[0])&& layer.feature.properties.VarTot01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalAlojFreg01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 87;
    sliderAtivo = sliderVarTotalAlojFreg01_91.noUiSlider;
    $(slidersGeral).append(sliderVarTotalAlojFreg01_91);
} 

///// Fim da Variação dos ALOJAMENTOS Por Freguesia entre 2001 e 1991 -------------- \\\\\\




//////------- Variação dos ALOJAMENTOS Familiares das Freguesias entre 2021 e 2011-----////

var minVarTotalAlojFamiFreg21_11 = 0;
var maxVarTotalAlojFamiFreg21_11 = 1;


function CorVarTotAlojFamFreg21_11(d) {
    return d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5 ? '#9eaad7' :
        d >= -11.89   ? '#2288bf' :
                ''  ;
}

var legendaVarTotAlojFamFreg21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares, entre 2021 e 2011, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -11.89 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarTotalAlojFamiFreg21_11(feature) {
    if(feature.properties.VarAF21 <= minVarTotalAlojFamiFreg21_11 || minVarTotalAlojFamiFreg21_11 ===0){
        minVarTotalAlojFamiFreg21_11 = feature.properties.VarAF21 
    }
    if(feature.properties.VarAF21 > maxVarTotalAlojFamiFreg21_11){
        maxVarTotalAlojFamiFreg21_11 = feature.properties.VarAF21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamFreg21_11(feature.properties.VarAF21)};
    }


function apagarVarTotalAlojFamiFreg21_11(e) {
    VarTotalAlojFamiFreg21_11.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeatureVarTotalAlojFamiFreg21_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarAF21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalAlojFamiFreg21_11,
    });
}
var VarTotalAlojFamiFreg21_11= L.geoJSON(VarTipoAlojamentoFreg, {
    style:EstiloVarTotalAlojFamiFreg21_11,
    onEachFeature: onEachFeatureVarTotalAlojFamiFreg21_11
});

let slideVarTotalAlojFamiFreg21_11 = function(){
    var sliderVarTotalAlojFamiFreg21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalAlojFamiFreg21_11, {
        start: [minVarTotalAlojFamiFreg21_11, maxVarTotalAlojFamiFreg21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalAlojFamiFreg21_11,
            'max': maxVarTotalAlojFamiFreg21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalAlojFamiFreg21_11);
    inputNumberMax.setAttribute("value",maxVarTotalAlojFamiFreg21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalAlojFamiFreg21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalAlojFamiFreg21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalAlojFamiFreg21_11.noUiSlider.on('update',function(e){
        VarTotalAlojFamiFreg21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarAF21>=parseFloat(e[0])&& layer.feature.properties.VarAF21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalAlojFamiFreg21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderVarTotalAlojFamiFreg21_11.noUiSlider;
    $(slidersGeral).append(sliderVarTotalAlojFamiFreg21_11);
} 

///// Fim da Variação dos ALOJAMENTOS Familiares Por Freguesia entre 2021 e 2011 -------------- \\\\\\


//////------- Variação dos ALOJAMENTOS Familiares das Freguesias entre 2011 e 2001-----////


var minVarTotalAlojFamiFreg11_01 = 0;
var maxVarTotalAlojFamiFreg11_01 = 1;

function CorVarTotAlojFamFreg11_01(d) {
    return d >= 50  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -13.53   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotAlojFamFreg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  30 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -13.53 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalAlojFamiFreg11_01(feature) {
    if(feature.properties.VarAF11 <= minVarTotalAlojFamiFreg11_01 || minVarTotalAlojFamiFreg11_01 ===0){
        minVarTotalAlojFamiFreg11_01 = feature.properties.VarAF11
    }
    if(feature.properties.VarAF11 > maxVarTotalAlojFamiFreg11_01){
        maxVarTotalAlojFamiFreg11_01 = feature.properties.VarAF11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamFreg11_01(feature.properties.VarAF11)};
    }


function apagarVarTotalAlojFamiFreg11_01(e) {
    VarTotalAlojFamiFreg11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarTotalAlojFamiFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarAF11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalAlojFamiFreg11_01,
    });
}
var VarTotalAlojFamiFreg11_01= L.geoJSON(freguesiasRelativos2001, {
    style:EstiloVarTotalAlojFamiFreg11_01,
    onEachFeature: onEachFeatureVarTotalAlojFamiFreg11_01
});

let slideVarTotalAlojFamiFreg11_01 = function(){
    var sliderVarTotalAlojFamiFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 88){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalAlojFamiFreg11_01, {
        start: [minVarTotalAlojFamiFreg11_01, maxVarTotalAlojFamiFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalAlojFamiFreg11_01,
            'max': maxVarTotalAlojFamiFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalAlojFamiFreg11_01);
    inputNumberMax.setAttribute("value",maxVarTotalAlojFamiFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalAlojFamiFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalAlojFamiFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalAlojFamiFreg11_01.noUiSlider.on('update',function(e){
        VarTotalAlojFamiFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarAF11>=parseFloat(e[0])&& layer.feature.properties.VarAF11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalAlojFamiFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 88;
    sliderAtivo = sliderVarTotalAlojFamiFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarTotalAlojFamiFreg11_01);
} 

///// Fim da Variação dos ALOJAMENTOS Familiares Por Freguesia entre 2011 e 2001 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS Familiares das Freguesias entre 2001 e 1991-----////



var minVarTotalAlojFamiFreg01_91 = 0;
var maxVarTotalAlojFamiFreg01_91 = 1;

function CorVarTotAlojFamFreg01_91(d) {
    return d >= 50  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -54.12   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotAlojFamFreg01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares, entre 2001 e 1991, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  30 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -54.11 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalAlojFamiFreg01_91(feature) {
    if(feature.properties.VarAF01 <= minVarTotalAlojFamiFreg01_91 || minVarTotalAlojFamiFreg01_91 ===0){
        minVarTotalAlojFamiFreg01_91 = feature.properties.VarAF01
    }
    if(feature.properties.VarAF01 > maxVarTotalAlojFamiFreg01_91){
        maxVarTotalAlojFamiFreg01_91 = feature.properties.VarAF01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamFreg01_91(feature.properties.VarAF01)};
    }


function apagarVarTotalAlojFamiFreg01_91(e) {
    VarTotalAlojFamiFreg01_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarTotalAlojFamiFreg01_91(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarAF01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalAlojFamiFreg01_91,
    });
}
var VarTotalAlojFamiFreg01_91= L.geoJSON(freguesiasRelativos2001, {
    style:EstiloVarTotalAlojFamiFreg01_91,
    onEachFeature: onEachFeatureVarTotalAlojFamiFreg01_91
});

let slideVarTotalAlojFamiFreg01_91 = function(){
    var sliderVarTotalAlojFamiFreg01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 89){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalAlojFamiFreg01_91, {
        start: [minVarTotalAlojFamiFreg01_91, maxVarTotalAlojFamiFreg01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalAlojFamiFreg01_91,
            'max': maxVarTotalAlojFamiFreg01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalAlojFamiFreg01_91);
    inputNumberMax.setAttribute("value",maxVarTotalAlojFamiFreg01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalAlojFamiFreg01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalAlojFamiFreg01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalAlojFamiFreg01_91.noUiSlider.on('update',function(e){
        VarTotalAlojFamiFreg01_91.eachLayer(function(layer){
            if(layer.feature.properties.VarAF01>=parseFloat(e[0])&& layer.feature.properties.VarAF01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalAlojFamiFreg01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 89;
    sliderAtivo = sliderVarTotalAlojFamiFreg01_91.noUiSlider;
    $(slidersGeral).append(sliderVarTotalAlojFamiFreg01_91);
} 

///// Fim da Variação dos ALOJAMENTOS Familiares Por Freguesia entre 2001 e 1991 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES CLÁSSICOS das Freguesias entre 2021 e 2011-----////


var minVarTotalAlojFamiClassFreg21_11 = 0;
var maxVarTotalAlojFamiClassFreg21_11 = 0;

function CorVarTotAlojFamClassFreg21_11(d) {
    return d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5 ? '#9eaad7' :
        d >= -11.82   ? '#2288bf' :
                ''  ;
}

var legendaVarTotAlojFamClassFreg21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares clássicos, entre 2021 e 2011, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -11.81 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalAlojFamiClassFreg21_11(feature) {
    if(feature.properties.VarAFC21 <= minVarTotalAlojFamiClassFreg21_11 || minVarTotalAlojFamiClassFreg21_11 ===0){
        minVarTotalAlojFamiClassFreg21_11 = feature.properties.VarAFC21
    }
    if(feature.properties.VarAFC21 > maxVarTotalAlojFamiClassFreg21_11){
        maxVarTotalAlojFamiClassFreg21_11 = feature.properties.VarAFC21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamClassFreg21_11(feature.properties.VarAFC21)};
    }


function apagarVarTotalAlojFamiClassFreg21_11(e) {
    VarTotalAlojFamiClassFreg21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarTotalAlojFamiClassFreg21_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarAFC21.toFixed(2) + '</b>'+ '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalAlojFamiClassFreg21_11,
    });
}
var VarTotalAlojFamiClassFreg21_11= L.geoJSON(VarTipoAlojamentoFreg, {
    style:EstiloVarTotalAlojFamiClassFreg21_11,
    onEachFeature: onEachFeatureVarTotalAlojFamiClassFreg21_11
});

let slideVarTotalAlojFamiClassFreg21_11 = function(){
    var sliderVarTotalAlojFamiClassFreg21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalAlojFamiClassFreg21_11, {
        start: [minVarTotalAlojFamiClassFreg21_11, maxVarTotalAlojFamiClassFreg21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalAlojFamiClassFreg21_11,
            'max': maxVarTotalAlojFamiClassFreg21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalAlojFamiClassFreg21_11);
    inputNumberMax.setAttribute("value",maxVarTotalAlojFamiClassFreg21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalAlojFamiClassFreg21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalAlojFamiClassFreg21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalAlojFamiClassFreg21_11.noUiSlider.on('update',function(e){
        VarTotalAlojFamiClassFreg21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarAFC21>=parseFloat(e[0])&& layer.feature.properties.VarAFC21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalAlojFamiClassFreg21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderVarTotalAlojFamiClassFreg21_11.noUiSlider;
    $(slidersGeral).append(sliderVarTotalAlojFamiClassFreg21_11);
} 

///// Fim da Variação dos ALOJAMENTOS Familiares Clássicos Por Freguesia entre 2021 e 2011 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES CLÁSSICOS das Freguesias entre 2011 e 2001-----////


var minVarTotalAlojFamiClassFreg11_01 = 0;
var maxVarTotalAlojFamiClassFreg11_01 = 0;

function CorVarTotAlojFamClassFreg11_01(d) {
    return d >= 50  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -12.94   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotAlojFamClassFreg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares clássicos, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  30 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -12.93 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalAlojFamiClassFreg11_01(feature) {
    if(feature.properties.VarAFC11 <= minVarTotalAlojFamiClassFreg11_01 || minVarTotalAlojFamiClassFreg11_01 ===0){
        minVarTotalAlojFamiClassFreg11_01 = feature.properties.VarAFC11
    }
    if(feature.properties.VarAFC11 > maxVarTotalAlojFamiClassFreg11_01){
        maxVarTotalAlojFamiClassFreg11_01 = feature.properties.VarAFC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamClassFreg11_01(feature.properties.VarAFC11)};
    }


function apagarVarTotalAlojFamiClassFreg11_01(e) {
    VarTotalAlojFamiClassFreg11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarTotalAlojFamiClassFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarAFC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalAlojFamiClassFreg11_01,
    });
}
var VarTotalAlojFamiClassFreg11_01= L.geoJSON(freguesiasRelativos2001, {
    style:EstiloVarTotalAlojFamiClassFreg11_01,
    onEachFeature: onEachFeatureVarTotalAlojFamiClassFreg11_01
});

let slideVarTotalAlojFamiClassFreg11_01 = function(){
    var sliderVarTotalAlojFamiClassFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 90){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalAlojFamiClassFreg11_01, {
        start: [minVarTotalAlojFamiClassFreg11_01, maxVarTotalAlojFamiClassFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalAlojFamiClassFreg11_01,
            'max': maxVarTotalAlojFamiClassFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalAlojFamiClassFreg11_01);
    inputNumberMax.setAttribute("value",maxVarTotalAlojFamiClassFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalAlojFamiClassFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalAlojFamiClassFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalAlojFamiClassFreg11_01.noUiSlider.on('update',function(e){
        VarTotalAlojFamiClassFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarAFC11>=parseFloat(e[0])&& layer.feature.properties.VarAFC11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalAlojFamiClassFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 90;
    sliderAtivo = sliderVarTotalAlojFamiClassFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarTotalAlojFamiClassFreg11_01);
} 

///// Fim da Variação dos ALOJAMENTOS Familiares Clássicos Por Freguesia entre 2011 e 2001 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES CLÁSSICOS das Freguesias entre 2001 e 1991-----////


var minVarTotalAlojFamiClassFreg01_91 = 0;
var maxVarTotalAlojFamiClassFreg01_91 = 0;

function CorVarTotAlojFamClassFreg01_91(d) {
    return d >= 50  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -54.66   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotAlojFamClassFreg01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares, entre 2001 e 1991, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  30 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -54.65 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalAlojFamiClassFreg01_91(feature) {
    if(feature.properties.VarAFC01 <= minVarTotalAlojFamiClassFreg01_91 || minVarTotalAlojFamiClassFreg01_91 ===0){
        minVarTotalAlojFamiClassFreg01_91 = feature.properties.VarAFC01 
    }
    if(feature.properties.VarAFC01 > maxVarTotalAlojFamiClassFreg01_91){
        maxVarTotalAlojFamiClassFreg01_91 = feature.properties.VarAFC01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamClassFreg01_91(feature.properties.VarAFC01)};
    }


function apagarVarTotalAlojFamiClassFreg01_91(e) {
    VarTotalAlojFamiClassFreg01_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarTotalAlojFamiClassFreg01_91(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarAFC01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalAlojFamiClassFreg01_91,
    });
}
var VarTotalAlojFamiClassFreg01_91= L.geoJSON(freguesiasRelativos2001, {
    style:EstiloVarTotalAlojFamiClassFreg01_91,
    onEachFeature: onEachFeatureVarTotalAlojFamiClassFreg01_91
});

let slideVarTotalAlojFamiClassFreg01_91 = function(){
    var sliderVarTotalAlojFamiClassFreg01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 91){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalAlojFamiClassFreg01_91, {
        start: [minVarTotalAlojFamiClassFreg01_91, maxVarTotalAlojFamiClassFreg01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalAlojFamiClassFreg01_91,
            'max': maxVarTotalAlojFamiClassFreg01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalAlojFamiClassFreg01_91);
    inputNumberMax.setAttribute("value",maxVarTotalAlojFamiClassFreg01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalAlojFamiClassFreg01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalAlojFamiClassFreg01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalAlojFamiClassFreg01_91.noUiSlider.on('update',function(e){
        VarTotalAlojFamiClassFreg01_91.eachLayer(function(layer){
            if(layer.feature.properties.VarAFC11>=parseFloat(e[0])&& layer.feature.properties.VarAFC11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalAlojFamiClassFreg01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 91;
    sliderAtivo = sliderVarTotalAlojFamiClassFreg01_91.noUiSlider;
    $(slidersGeral).append(sliderVarTotalAlojFamiClassFreg01_91);
} 

///// Fim da Variação dos ALOJAMENTOS Familiares Clássicos Por Freguesia entre 2001 e 1991 -------------- \\\\\\


//////------- Variação dos ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS das Freguesias entre 2021 e 2011-----////



var minVarTotAlojFamNaoClassFreg21_11 = 9999;
var maxVarTotAlojFamNaoClassFreg21_11 = 0;

function CorVarTotAlojFamNaoClassFreg21_11(d) {
    return d === null ? '#808080':
        d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -50   ? '#9eaad7' :
        d >= -100   ? '#2288bf' :
                ''  ;
}

var legendaVarTotAlojFamNaoClassFreg21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares não clássicos, entre 2021 e 2011, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotAlojFamNaoClassFreg21_11(feature) {
    if(feature.properties.VarANC21 <= minVarTotAlojFamNaoClassFreg21_11){
        minVarTotAlojFamNaoClassFreg21_11 = feature.properties.VarANC21 
    }
    if(feature.properties.VarANC21 > maxVarTotAlojFamNaoClassFreg21_11){
        maxVarTotAlojFamNaoClassFreg21_11 = feature.properties.VarANC21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamNaoClassFreg21_11(feature.properties.VarANC21),
    }
}


function apagarVarTotAlojFamNaoClassFreg21_11(e) {
    VarTotAlojFamNaoClassFreg21_11.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeatureVarTotAlojFamNaoClassFreg21_11(feature, layer) {
    if(feature.properties.VarANC21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarANC21.toFixed(2) + '</b>' + '%').openPopup()
    }    
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotAlojFamNaoClassFreg21_11,
    });
}
var VarTotAlojFamNaoClassFreg21_11= L.geoJSON(VarTipoAlojamentoFreg, {
    style:EstiloVarTotAlojFamNaoClassFreg21_11,
    onEachFeature: onEachFeatureVarTotAlojFamNaoClassFreg21_11
});

let slideVarTotAlojFamNaoClassFreg21_11 = function(){
    var sliderVarTotAlojFamNaoClassFreg21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotAlojFamNaoClassFreg21_11, {
        start: [minVarTotAlojFamNaoClassFreg21_11, maxVarTotAlojFamNaoClassFreg21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotAlojFamNaoClassFreg21_11,
            'max': maxVarTotAlojFamNaoClassFreg21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarTotAlojFamNaoClassFreg21_11);
    inputNumberMax.setAttribute("value",maxVarTotAlojFamNaoClassFreg21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotAlojFamNaoClassFreg21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotAlojFamNaoClassFreg21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarTotAlojFamNaoClassFreg21_11.noUiSlider.on('update',function(e){
        VarTotAlojFamNaoClassFreg21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarANC21 == null){
                return false
            }
            if(layer.feature.properties.VarANC21>=parseFloat(e[0])&& layer.feature.properties.VarANC21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotAlojFamNaoClassFreg21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderVarTotAlojFamNaoClassFreg21_11.noUiSlider;
    $(slidersGeral).append(sliderVarTotAlojFamNaoClassFreg21_11);
} 

///// Fim da Variação dos ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS Por Freguesia entre 2021 e 2011 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS das Freguesias entre 2011 e 2001-----////


var minVarTotAlojFamNaoClassFreg11_01 = 99999;
var maxVarTotAlojFamNaoClassFreg11_01 = 0;

function CorVarTotAlojFamNaoClassFreg11_01(d) {
    return d === null ? '#808080':
        d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -50   ? '#9eaad7' :
        d >= -100   ? '#2288bf' :
                ''  ;
}

var legendaVarTotAlojFamNaoClassFreg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares não clássicos, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotAlojFamNaoClassFreg11_01(feature) {
    if(feature.properties.VarANC11 <= minVarTotAlojFamNaoClassFreg11_01){
        minVarTotAlojFamNaoClassFreg11_01 = feature.properties.VarANC11 
    }
    if(feature.properties.VarANC11 > maxVarTotAlojFamNaoClassFreg11_01){
        maxVarTotAlojFamNaoClassFreg11_01 = feature.properties.VarANC11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamNaoClassFreg11_01(feature.properties.VarANC11)};
    }


function apagarVarTotAlojFamNaoClassFreg11_01(e) {
    VarTotAlojFamNaoClassFreg11_01.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeatureVarTotAlojFamNaoClassFreg11_01(feature, layer) {
    if(feature.properties.VarANC11 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarANC11.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotAlojFamNaoClassFreg11_01,
    });
}
var VarTotAlojFamNaoClassFreg11_01= L.geoJSON(freguesiasRelativos2001, {
    style:EstiloVarTotAlojFamNaoClassFreg11_01,
    onEachFeature: onEachFeatureVarTotAlojFamNaoClassFreg11_01
});

let slideVarTotAlojFamNaoClassFreg11_01 = function(){
    var sliderVarTotAlojFamNaoClassFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 92){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotAlojFamNaoClassFreg11_01, {
        start: [minVarTotAlojFamNaoClassFreg11_01, maxVarTotAlojFamNaoClassFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotAlojFamNaoClassFreg11_01,
            'max': maxVarTotAlojFamNaoClassFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarTotAlojFamNaoClassFreg11_01);
    inputNumberMax.setAttribute("value",maxVarTotAlojFamNaoClassFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotAlojFamNaoClassFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotAlojFamNaoClassFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarTotAlojFamNaoClassFreg11_01.noUiSlider.on('update',function(e){
        VarTotAlojFamNaoClassFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarANC11 == null){
                return false
            }
            if(layer.feature.properties.VarANC11>=parseFloat(e[0])&& layer.feature.properties.VarANC11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotAlojFamNaoClassFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 92;
    sliderAtivo = sliderVarTotAlojFamNaoClassFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarTotAlojFamNaoClassFreg11_01);
} 

///// Fim da Variação dos ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS Por Freguesia entre 2011 e 2001 -------------- \\\\\\


//////------- Variação dos ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS das Freguesias entre 2001 e 1991-----////

var minVarTotAlojFamNaoClassFreg01_91 = 9999;
var maxVarTotAlojFamNaoClassFreg01_91 = 0;

function CorVarTotAlojFamNaoClassFreg01_91(d) {
    return d === null ? '#808080':
        d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -50   ? '#9eaad7' :
        d >= -100   ? '#2288bf' :
                ''  ;
}

var legendaVarTotAlojFamNaoClassFreg01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares não clássicos, entre 2001 e 1991, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotAlojFamNaoClassFreg01_91(feature) {
    if(feature.properties.VarANC01 <= minVarTotAlojFamNaoClassFreg01_91){
        minVarTotAlojFamNaoClassFreg01_91 = feature.properties.VarANC01
    }
    if(feature.properties.VarANC01 > maxVarTotAlojFamNaoClassFreg01_91){
        maxVarTotAlojFamNaoClassFreg01_91 = feature.properties.VarANC01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojFamNaoClassFreg01_91(feature.properties.VarANC01)};
    }


function apagarVarTotAlojFamNaoClassFreg01_91(e) {
    VarTotAlojFamNaoClassFreg01_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarTotAlojFamNaoClassFreg01_91(feature, layer) {
    if(feature.properties.VarANC01 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarANC01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotAlojFamNaoClassFreg01_91,
    });
}
var VarTotAlojFamNaoClassFreg01_91= L.geoJSON(freguesiasRelativos2001, {
    style:EstiloVarTotAlojFamNaoClassFreg01_91,
    onEachFeature: onEachFeatureVarTotAlojFamNaoClassFreg01_91
});

let slideVarTotAlojFamNaoClassFreg01_91 = function(){
    var sliderVarTotAlojFamNaoClassFreg01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 93){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotAlojFamNaoClassFreg01_91, {
        start: [minVarTotAlojFamNaoClassFreg01_91, maxVarTotAlojFamNaoClassFreg01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': -100,
            'max': maxVarTotAlojFamNaoClassFreg01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarTotAlojFamNaoClassFreg01_91);
    inputNumberMax.setAttribute("value",maxVarTotAlojFamNaoClassFreg01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotAlojFamNaoClassFreg01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotAlojFamNaoClassFreg01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarTotAlojFamNaoClassFreg01_91.noUiSlider.on('update',function(e){
        VarTotAlojFamNaoClassFreg01_91.eachLayer(function(layer){
            if(layer.feature.properties.VarANC01 == null){
                return false
            }
            if(layer.feature.properties.VarANC01>=parseFloat(e[0])&& layer.feature.properties.VarANC01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotAlojFamNaoClassFreg01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 93;
    sliderAtivo = sliderVarTotAlojFamNaoClassFreg01_91.noUiSlider;
    $(slidersGeral).append(sliderVarTotAlojFamNaoClassFreg01_91);
} 

///// Fim da Variação dos ALOJAMENTOS FAMILIARES NÃO CLÁSSICOS Por Freguesia entre 1991 e 2001 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS COLETIVOS das Freguesias entre 2021 e 2011-----////

var minVarAlojColetivosFreg21_11 = 99999;
var maxVarAlojColetivosFreg21_11 = 0;

function CorVarTotAlojColetivosFreg21_11(d) {
    return d === null ? '#808080':
        d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -50   ? '#9eaad7' :
        d >= -100   ? '#2288bf' :
                ''  ;
}

var legendaVarTotAlojColetivosFreg21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos coletivos, entre 2021 e 2011, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAlojColetivosFreg21_11(feature) {
    if(feature.properties.VarAC21 <= minVarAlojColetivosFreg21_11){
        minVarAlojColetivosFreg21_11 = feature.properties.VarAC21 
    }
    if(feature.properties.VarAC21 > maxVarAlojColetivosFreg21_11){
        maxVarAlojColetivosFreg21_11 = feature.properties.VarAC21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojColetivosFreg21_11(feature.properties.VarAC21)};
    }


function apagarVarAlojColetivosFreg21_11(e) {
    VarAlojColetivosFreg21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarAlojColetivosFreg21_11(feature, layer) {
    if(feature.properties.VarAC21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAC21.toFixed(2) + '</b>' + '%').openPopup()
    }    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAlojColetivosFreg21_11,
    });
}
var VarAlojColetivosFreg21_11= L.geoJSON(VarTipoAlojamentoFreg, {
    style:EstiloVarAlojColetivosFreg21_11,
    onEachFeature: onEachFeatureVarAlojColetivosFreg21_11
});

let slideVarAlojColetivosFreg21_11 = function(){
    var sliderVarAlojColetivosFreg21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAlojColetivosFreg21_11, {
        start: [minVarAlojColetivosFreg21_11, maxVarAlojColetivosFreg21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAlojColetivosFreg21_11,
            'max': maxVarAlojColetivosFreg21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarAlojColetivosFreg21_11);
    inputNumberMax.setAttribute("value",maxVarAlojColetivosFreg21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAlojColetivosFreg21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAlojColetivosFreg21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarAlojColetivosFreg21_11.noUiSlider.on('update',function(e){
        VarAlojColetivosFreg21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarAC21 == null){
                return false
            }
            if(layer.feature.properties.VarAC21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarAC21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAlojColetivosFreg21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderVarAlojColetivosFreg21_11.noUiSlider;
    $(slidersGeral).append(sliderVarAlojColetivosFreg21_11);
} 

///// Fim da Variação dos ALOJAMENTOS COLETIVOS Por Freguesia entre 2021 e 2011 -------------- \\\\\\


//////------- Variação dos ALOJAMENTOS COLETIVOS das Freguesias entre 2011 e 2001-----////

var minVarAlojColetivosFreg11_01 = 9999;
var maxVarAlojColetivosFreg11_01 = 0;

function CorVarTotAlojColetivosFreg11_01(d) {
    return d === null ? '#808080':
        d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -50   ? '#9eaad7' :
        d >= -100   ? '#2288bf' :
                ''  ;
}

var legendaVarTotAlojColetivosFreg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos coletivos, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAlojColetivosFreg11_01(feature) {
    if(feature.properties.VarAC11 <= minVarAlojColetivosFreg11_01){
        minVarAlojColetivosFreg11_01 = feature.properties.VarAC11
    }
    if(feature.properties.VarAC11 > maxVarAlojColetivosFreg11_01){
        maxVarAlojColetivosFreg11_01 = feature.properties.VarAC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojColetivosFreg11_01(feature.properties.VarAC11)};
    }


function apagarVarAlojColetivosFreg11_01(e) {
    VarAlojColetivosFreg11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarAlojColetivosFreg11_01(feature, layer) {
    if(feature.properties.VarAC11 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAC11.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAlojColetivosFreg11_01,
    });
}
var VarAlojColetivosFreg11_01= L.geoJSON(freguesiasRelativos2001, {
    style:EstiloVarAlojColetivosFreg11_01,
    onEachFeature: onEachFeatureVarAlojColetivosFreg11_01
});

let slideVarAlojColetivosFreg11_01 = function(){
    var sliderVarAlojColetivosFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 94){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAlojColetivosFreg11_01, {
        start: [minVarAlojColetivosFreg11_01, maxVarAlojColetivosFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAlojColetivosFreg11_01,
            'max': maxVarAlojColetivosFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarAlojColetivosFreg11_01);
    inputNumberMax.setAttribute("value",maxVarAlojColetivosFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAlojColetivosFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAlojColetivosFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarAlojColetivosFreg11_01.noUiSlider.on('update',function(e){
        VarAlojColetivosFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarAC11 == null){
                return false
            }
            if(layer.feature.properties.VarAC11>=parseFloat(e[0])&& layer.feature.properties.VarAC11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAlojColetivosFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 94;
    sliderAtivo = sliderVarAlojColetivosFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarAlojColetivosFreg11_01);
} 

///// Fim da Variação dos ALOJAMENTOS COLETIVOS Por Freguesia entre 2001 e 1991 -------------- \\\\\\


//////------- Variação dos ALOJAMENTOS COLETIVOS das Freguesias entre 2001 e 1991-----////

var minVarAlojColetivosFreg01_91 = 9999;
var maxVarAlojColetivosFreg01_91 = 0;


function CorVarTotAlojColetivosFreg01_91(d) {
    return d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -50   ? '#9eaad7' :
        d >= -100   ? '#2288bf' :
                ''  ;
}

var legendaVarTotAlojColetivosFreg01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos coletivos, entre 2001 e 1991, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAlojColetivosFreg01_91(feature) {

    if(feature.properties.VarAC01 <= minVarAlojColetivosFreg01_91){
        minVarAlojColetivosFreg01_91 = feature.properties.VarAC01 
    }
    if(feature.properties.VarAC01 > maxVarAlojColetivosFreg01_91){
        maxVarAlojColetivosFreg01_91 = feature.properties.VarAC01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotAlojColetivosFreg01_91(feature.properties.VarAC01)};
    }


function apagarVarAlojColetivosFreg01_91(e) {
    VarAlojColetivosFreg01_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarAlojColetivosFreg01_91(feature, layer) {
    if(feature.properties.VarAC01 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAC01.toFixed(2) + '</b>' + '%').openPopup()
    }    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAlojColetivosFreg01_91,
    });
}
var VarAlojColetivosFreg01_91= L.geoJSON(freguesiasRelativos2001, {
    style:EstiloVarAlojColetivosFreg01_91,
    onEachFeature: onEachFeatureVarAlojColetivosFreg01_91
});

let slideVarAlojColetivosFreg01_91 = function(){
    var sliderVarAlojColetivosFreg01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 75){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAlojColetivosFreg01_91, {
        start: [minVarAlojColetivosFreg01_91, maxVarAlojColetivosFreg01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAlojColetivosFreg01_91,
            'max': maxVarAlojColetivosFreg01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarAlojColetivosFreg01_91);
    inputNumberMax.setAttribute("value",maxVarAlojColetivosFreg01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAlojColetivosFreg01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAlojColetivosFreg01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarAlojColetivosFreg01_91.noUiSlider.on('update',function(e){
        VarAlojColetivosFreg01_91.eachLayer(function(layer){
            if(layer.feature.properties.VarAC01 == null){
                return false
            }
            if(layer.feature.properties.VarAC01>=parseFloat(e[0])&& layer.feature.properties.VarAC01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAlojColetivosFreg01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 75;
    sliderAtivo = sliderVarAlojColetivosFreg01_91.noUiSlider;
    $(slidersGeral).append(sliderVarAlojColetivosFreg01_91);
} 

///// Fim da Variação dos ALOJAMENTOS COLETIVOS Por Freguesia entre 2001 e 1991 -------------- \\\\\\



var minTotAlojFamPercCon21 = 0;
var maxTotAlojFamPercCon21 = 0;

function CorPerAlojaFamiliaresConc(d) {
    return d >= 99.92 ? '#8c0303' :
        d >= 99.83  ? '#de1f35' :
        d >= 99.70 ? '#ff5e6e' :
        d >= 99.56   ? '#f5b3be' :
        d >= 99.41   ? '#F2C572' :
                ''  ;
}
var legendaPerAlojaFamiliaresConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 99.92' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 99.83 - 99.92' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 99.70 - 99.83' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 99.56 - 99.70' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 99.42 - 99.56' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloTotAlojFamPercCon21(feature) {
    if( feature.properties.PerAF21 < minTotAlojFamPercCon21 || minTotAlojFamPercCon21 === 0){
        minTotAlojFamPercCon21 = feature.properties.PerAF21
    }
    if(feature.properties.PerAF21 > maxTotAlojFamPercCon21 ){
        maxTotAlojFamPercCon21 = feature.properties.PerAF21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresConc(feature.properties.PerAF21)
    };
}


function apagarTotAlojFamPercCon21(e) {
    TotAlojFamPercCon21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureTotAlojFamPercCon21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerAF21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarTotAlojFamPercCon21,
    });
}
var TotAlojFamPercCon21= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloTotAlojFamPercCon21,
    onEachFeature: onEachFeatureTotAlojFamPercCon21
});
var legendaGradiente = function(titulo) {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'divGradiente'
    var titulo = titulo;

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>");
    $(symbolsContainer).append("<div id='minimo'>"+ ' 0 ' + "</div>");
    $(symbolsContainer).append("<div id='grad1'></div>");
    $(symbolsContainer).append("<div id='maximo'>"+ '100 '+ "</div>");

    $(legendaA).append(symbolsContainer); 
}
let slideTotAlojFamPercCon21 = function(){
    var sliderTotAlojFamPercCon21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderTotAlojFamPercCon21, {
        start: [minTotAlojFamPercCon21, maxTotAlojFamPercCon21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFamPercCon21,
            'max': maxTotAlojFamPercCon21
        },
        });
    inputNumberMin.setAttribute("value",minTotAlojFamPercCon21);
    inputNumberMax.setAttribute("value",maxTotAlojFamPercCon21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFamPercCon21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFamPercCon21.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFamPercCon21.noUiSlider.on('update',function(e){
        TotAlojFamPercCon21.eachLayer(function(layer){
            if(layer.feature.properties.PerAF21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAF21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderTotAlojFamPercCon21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderTotAlojFamPercCon21.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFamPercCon21);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares em 2021 -------------- \\\\\\

//////------- Percentagem Total de Alojamentos Familiares por Concelho em 2011-----////


var minTotAlojFamPercCon11 = 0;
var maxTotAlojFamPercCon11 = 0;

function EstiloTotAlojFamPercCon11(feature) {
    if( feature.properties.PerAF11 < minTotAlojFamPercCon11 || minTotAlojFamPercCon11 === 0){
        minTotAlojFamPercCon11 = feature.properties.PerAF11
    }
    if(feature.properties.PerAF11 > maxTotAlojFamPercCon11 ){
        maxTotAlojFamPercCon11 = feature.properties.PerAF11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresConc(feature.properties.PerAF11)
    };
}


function apagarTotAlojFamPercCon11(e) {
    TotAlojFamPercCon11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureTotAlojFamPercCon11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerAF11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarTotAlojFamPercCon11,
    });
}
var TotAlojFamPercCon11= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloTotAlojFamPercCon11,
    onEachFeature: onEachFeatureTotAlojFamPercCon11
});

let slideTotAlojFamPercCon11 = function(){
    var sliderTotAlojFamPercCon11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderTotAlojFamPercCon11, {
        start: [minTotAlojFamPercCon11, maxTotAlojFamPercCon11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFamPercCon11,
            'max': maxTotAlojFamPercCon11
        },
        });
    inputNumberMin.setAttribute("value",minTotAlojFamPercCon11);
    inputNumberMax.setAttribute("value",maxTotAlojFamPercCon11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFamPercCon11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFamPercCon11.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFamPercCon11.noUiSlider.on('update',function(e){
        TotAlojFamPercCon11.eachLayer(function(layer){
            if(layer.feature.properties.PerAF11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAF11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderTotAlojFamPercCon11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderTotAlojFamPercCon11.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFamPercCon11);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares em 2011 -------------- \\\\\\

//////------- Percentagem Total de Alojamentos Familiares por Concelho em 2001-----////

var minTotAlojFamPercCon01 = 0;
var maxTotAlojFamPercCon01 = 0;

function EstiloTotAlojFamPercCon01(feature) {
    if( feature.properties.PerAF01 < minTotAlojFamPercCon01 || minTotAlojFamPercCon01 === 0){
        minTotAlojFamPercCon01 = feature.properties.PerAF01
    }
    if(feature.properties.PerAF01 > maxTotAlojFamPercCon01 ){
        maxTotAlojFamPercCon01 = feature.properties.PerAF01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresConc(feature.properties.PerAF01)
    };
}


function apagarTotAlojFamPercCon01(e) {
    TotAlojFamPercCon01.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeatureTotAlojFamPercCon01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerAF01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarTotAlojFamPercCon01,
    });
}
var TotAlojFamPercCon01= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloTotAlojFamPercCon01,
    onEachFeature: onEachFeatureTotAlojFamPercCon01
});

let slideTotAlojFamPercCon01 = function(){
    var sliderTotAlojFamPercCon01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 67){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderTotAlojFamPercCon01, {
        start: [minTotAlojFamPercCon01, maxTotAlojFamPercCon01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFamPercCon01,
            'max': maxTotAlojFamPercCon01
        },
        });
    inputNumberMin.setAttribute("value",minTotAlojFamPercCon01);
    inputNumberMax.setAttribute("value",maxTotAlojFamPercCon01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFamPercCon01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFamPercCon01.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFamPercCon01.noUiSlider.on('update',function(e){
        TotAlojFamPercCon01.eachLayer(function(layer){
            if(layer.feature.properties.PerAF01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAF01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderTotAlojFamPercCon01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 67;
    sliderAtivo = sliderTotAlojFamPercCon01.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFamPercCon01);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares em 2001 -------------- \\\\\\

//////------- Percentagem Total de Alojamentos Familiares por Concelho em 1991-----////

var minTotAlojFamPercCon91 = 0;
var maxTotAlojFamPercCon91 = 0;

function EstiloTotAlojFamPercCon91(feature) {
    if( feature.properties.PerAF91 < minTotAlojFamPercCon91 || minTotAlojFamPercCon91 === 0){
        minTotAlojFamPercCon91 = feature.properties.PerAF91
    }
    if(feature.properties.PerAF91 > maxTotAlojFamPercCon91 ){
        maxTotAlojFamPercCon91 = feature.properties.PerAF91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresConc(feature.properties.PerAF91)
    };
}


function apagarTotAlojFamPercCon91(e) {
    TotAlojFamPercCon91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureTotAlojFamPercCon91(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerAF91 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarTotAlojFamPercCon91,
    });
}
var TotAlojFamPercCon91= L.geoJSON(concelhosRelativos1991, {
    style:EstiloTotAlojFamPercCon91,
    onEachFeature: onEachFeatureTotAlojFamPercCon91
});

let slideTotAlojFamPercCon91 = function(){
    var sliderTotAlojFamPercCon91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 71){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderTotAlojFamPercCon91, {
        start: [minTotAlojFamPercCon91, maxTotAlojFamPercCon91],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFamPercCon91,
            'max': maxTotAlojFamPercCon91
        },
        });
    inputNumberMin.setAttribute("value",minTotAlojFamPercCon91);
    inputNumberMax.setAttribute("value",maxTotAlojFamPercCon91);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFamPercCon91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFamPercCon91.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFamPercCon91.noUiSlider.on('update',function(e){
        TotAlojFamPercCon91.eachLayer(function(layer){
            if(layer.feature.properties.PerAF91>=parseFloat(e[0])&& layer.feature.properties.PerAF91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderTotAlojFamPercCon91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 71;
    sliderAtivo = sliderTotAlojFamPercCon91.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFamPercCon91);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares em 1991 -------------- \\\\\\

//////------- Percentagem Total de Alojamentos Familiares Clássicos por Concelho em 2021-----////
var minAlojFamClassPercCon21 = 0;
var maxAlojFamClassPercCon21 = 0;

function CorPerAlojaFamClassConc(d) {
    return d >= 99.89 ? '#8c0303' :
        d >= 99.73  ? '#de1f35' :
        d >= 99.47 ? '#ff5e6e' :
        d >= 99.2   ? '#f5b3be' :
        d >= 98.92   ? '#F2C572' :
                ''  ;
}
var legendaPerAlojaFamClassConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 99.89' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 99.73 - 99.89' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 99.47 - 99.73' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 99.2 - 99.47' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 98.93 - 99.2' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloAlojFamClassPercCon21(feature) {
    if( feature.properties.PerAFC21 < minAlojFamClassPercCon21 || minAlojFamClassPercCon21 === 0){
        minAlojFamClassPercCon21 = feature.properties.PerAFC21
    }
    if(feature.properties.PerAFC21 > maxAlojFamClassPercCon21 ){
        maxAlojFamClassPercCon21 = feature.properties.PerAFC21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamClassConc(feature.properties.PerAFC21)
    };
}

function apagarAlojFamClassPercCon21(e) {
    AlojFamClassPercCon21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojFamClassPercCon21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerAFC21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamClassPercCon21,
    });
}
var AlojFamClassPercCon21= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojFamClassPercCon21,
    onEachFeature: onEachFeatureAlojFamClassPercCon21
});

let slideAlojFamClassPercCon21 = function(){
    var sliderAlojFamClassPercCon21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamClassPercCon21, {
        start: [minAlojFamClassPercCon21, maxAlojFamClassPercCon21],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamClassPercCon21,
            'max': maxAlojFamClassPercCon21
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamClassPercCon21);
    inputNumberMax.setAttribute("value",maxAlojFamClassPercCon21);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamClassPercCon21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamClassPercCon21.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamClassPercCon21.noUiSlider.on('update',function(e){
        AlojFamClassPercCon21.eachLayer(function(layer){
            if(layer.feature.properties.PerAFC21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAFC21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamClassPercCon21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderAlojFamClassPercCon21.noUiSlider;
    $(slidersGeral).append(sliderAlojFamClassPercCon21);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares Clássicos em 2021 -------------- \\\\\\

//////------- Percentagem Total de Alojamentos Familiares Clássicos por Concelho em 2011-----////


var minAlojFamClassPercCon11 = 0;
var maxAlojFamClassPercCon11 = 0;

function EstiloAlojFamClassPercCon11(feature) {
    if( feature.properties.PerAFC11 < minAlojFamClassPercCon11 || minAlojFamClassPercCon11 === 0){
        minAlojFamClassPercCon11 = feature.properties.PerAFC11
    }
    if(feature.properties.PerAFC11 > maxAlojFamClassPercCon11 ){
        maxAlojFamClassPercCon11 = feature.properties.PerAFC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamClassConc(feature.properties.PerAFC11)
    };
}
function apagarAlojFamClassPercCon11(e) {
    AlojFamClassPercCon11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojFamClassPercCon11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerAFC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamClassPercCon11,
    });
}
var AlojFamClassPercCon11= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojFamClassPercCon11,
    onEachFeature: onEachFeatureAlojFamClassPercCon11
});

let slideAlojFamClassPercCon11 = function(){
    var sliderAlojFamClassPercCon11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamClassPercCon11, {
        start: [minAlojFamClassPercCon11, maxAlojFamClassPercCon11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamClassPercCon11,
            'max': maxAlojFamClassPercCon11
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamClassPercCon11);
    inputNumberMax.setAttribute("value",maxAlojFamClassPercCon11);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamClassPercCon11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamClassPercCon11.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamClassPercCon11.noUiSlider.on('update',function(e){
        AlojFamClassPercCon11.eachLayer(function(layer){
            if(layer.feature.properties.PerAFC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAFC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamClassPercCon11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderAlojFamClassPercCon11.noUiSlider;
    $(slidersGeral).append(sliderAlojFamClassPercCon11);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares Clássicos em 2011 -------------- \\\\\\

//////------- Percentagem Total de Alojamentos Familiares Clássicos por Concelho em 2001-----////

var minAlojFamClassPercCon01 = 0;
var maxAlojFamClassPercCon01 = 0;

function EstiloAlojFamClassPercCon01(feature) {
    if( feature.properties.PerAFC01 < minAlojFamClassPercCon01 || minAlojFamClassPercCon01 === 0){
        minAlojFamClassPercCon01 = feature.properties.PerAFC01
    }
    if(feature.properties.PerAFC01 > maxAlojFamClassPercCon01 ){
        maxAlojFamClassPercCon01 = feature.properties.PerAFC01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamClassConc(feature.properties.PerAFC01)
    };
}


function apagarAlojFamClassPercCon01(e) {
    AlojFamClassPercCon01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojFamClassPercCon01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerAFC01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamClassPercCon01,
    });
}
var AlojFamClassPercCon01= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojFamClassPercCon01,
    onEachFeature: onEachFeatureAlojFamClassPercCon01
});
let slideAlojFamClassPercCon01 = function(){
    var sliderAlojFamClassPercCon01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 68){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamClassPercCon01, {
        start: [minAlojFamClassPercCon01, maxAlojFamClassPercCon01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamClassPercCon01,
            'max': maxAlojFamClassPercCon01
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamClassPercCon01);
    inputNumberMax.setAttribute("value",maxAlojFamClassPercCon01);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamClassPercCon01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamClassPercCon01.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamClassPercCon01.noUiSlider.on('update',function(e){
        AlojFamClassPercCon01.eachLayer(function(layer){
            if(layer.feature.properties.PerAFC01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAFC01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamClassPercCon01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 68;
    sliderAtivo = sliderAlojFamClassPercCon01.noUiSlider;
    $(slidersGeral).append(sliderAlojFamClassPercCon01);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares Clássicos em 2001 -------------- \\\\\\

//////------- Percentagem Total de Alojamentos Familiares Clássicos por Concelho em 1991-----////

var minAlojFamClassPercCon91 = 0;
var maxAlojFamClassPercCon91 = 0;

function EstiloAlojFamClassPercCon91(feature) {
    if(!feature.properties.PerAFC91){
        feature.properties.PerAFC91 = "sem dados"
    }
    if( feature.properties.PerAFC91 < minAlojFamClassPercCon91 || minAlojFamClassPercCon91 === 0){
        minAlojFamClassPercCon91 = feature.properties.PerAFC91
    }
    if(feature.properties.PerAFC91 > maxAlojFamClassPercCon91 ){
        maxAlojFamClassPercCon91 = feature.properties.PerAFC91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamClassConc(feature.properties.PerAFC91)
    };
}


function apagarAlojFamClassPercCon91(e) {
    AlojFamClassPercCon91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojFamClassPercCon91(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerAFC91 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamClassPercCon91,
    });
}
var AlojFamClassPercCon91= L.geoJSON(concelhosRelativos1991, {
    style:EstiloAlojFamClassPercCon91,
    onEachFeature: onEachFeatureAlojFamClassPercCon91
});

let slideAlojFamClassPercCon91 = function(){
    var sliderAlojFamClassPercCon91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 72){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamClassPercCon91, {
        start: [minAlojFamClassPercCon91, maxAlojFamClassPercCon91],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamClassPercCon91,
            'max': maxAlojFamClassPercCon91
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamClassPercCon91);
    inputNumberMax.setAttribute("value",maxAlojFamClassPercCon91);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamClassPercCon91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamClassPercCon91.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamClassPercCon91.noUiSlider.on('update',function(e){
        AlojFamClassPercCon91.eachLayer(function(layer){
            if(layer.feature.properties.PerAFC91>=parseFloat(e[0])&& layer.feature.properties.PerAFC91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamClassPercCon91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 72;
    sliderAtivo = sliderAlojFamClassPercCon91.noUiSlider;
    $(slidersGeral).append(sliderAlojFamClassPercCon91);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares Clássicos em 1991 -------------- \\\\\\


//////------- Percentagem Total de Alojamentos Familiares Não Clássicos por Concelho em 2021-----////

var minAlojFamNaoClasPercCon21 = 0;
var maxAlojFamNaoClasPercCon21 = 0;

function CorPerAlojaFamNaoClassConc(d) {
    return d < 0.001 ? '#000000' :
        d >= 0.96 ? '#8c0303' :
        d >= 0.8  ? '#de1f35' :
        d >= 0.54 ? '#ff5e6e' :
        d >= 0.27   ? '#f5b3be' :
        d >= 0.00001   ? '#F2C572' :
                ''  ;
}
var legendaPerAlojaFamNaoClassConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 0.96' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 0.8 - 0.96' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 0.54 - 0.8' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0.27 - 0.54' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.01 - 0.27' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' 0 ' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloAlojFamNaoClasPercCon21(feature) {
    if(feature.properties.PerANC21 <= minAlojFamNaoClasPercCon21 || minAlojFamNaoClasPercCon21 === 0){
        minAlojFamNaoClasPercCon21 = feature.properties.PerANC21
    }
    if(feature.properties.PerANC21 >= maxAlojFamNaoClasPercCon21 ){
        maxAlojFamNaoClasPercCon21 = feature.properties.PerANC21
    }

    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamNaoClassConc(feature.properties.PerANC21)
    };
}
function apagarAlojFamNaoClasPercCon21(e) {
    AlojFamNaoClasPercCon21.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeatureAlojFamNaoClasPercCon21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerANC21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamNaoClasPercCon21,
    });
}
var AlojFamNaoClasPercCon21= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojFamNaoClasPercCon21,
    onEachFeature: onEachFeatureAlojFamNaoClasPercCon21
});

let slideAlojFamNaoClassPercCon21 = function(){
    var sliderAlojFamNaoClasPercCon21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamNaoClasPercCon21, {
        start: [0, maxAlojFamNaoClasPercCon21],
        tooltips:true,
        connect: true,
        range: {
            'min': 0,
            'max': maxAlojFamNaoClasPercCon21
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamNaoClasPercCon21);
    inputNumberMax.setAttribute("value",maxAlojFamNaoClasPercCon21);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamNaoClasPercCon21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamNaoClasPercCon21.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamNaoClasPercCon21.noUiSlider.on('update',function(e){
        AlojFamNaoClasPercCon21.eachLayer(function(layer){
            if(layer.feature.properties.PerANC21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerANC21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderAlojFamNaoClasPercCon21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderAlojFamNaoClasPercCon21.noUiSlider;
    $(slidersGeral).append(sliderAlojFamNaoClasPercCon21);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares Não Clássicos em 2021 -------------- \\\\\\



//////------- Percentagem Total de Alojamentos Familiares Não Clássicos por Concelho em 2011-----////

var minAlojFamNaoClasPercCon11 = 0;
var maxAlojFamNaoClasPercCon11 = 0;

function EstiloAlojFamNaoClasPercCon11(feature) {
    if( feature.properties.PerANC11 <= minAlojFamNaoClasPercCon11 || minAlojFamNaoClasPercCon11 === 0){
        minAlojFamNaoClasPercCon11 = feature.properties.PerANC11
    }
    if(feature.properties.PerANC11 >= maxAlojFamNaoClasPercCon11 ){
        maxAlojFamNaoClasPercCon11 = feature.properties.PerANC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamNaoClassConc(feature.properties.PerANC11)
    };
}


function apagarAlojFamNaoClasPercCon11(e) {
    AlojFamNaoClasPercCon11.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeatureAlojFamNaoClasPercCon11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerANC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamNaoClasPercCon11,
    });
}
var AlojFamNaoClasPercCon11= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojFamNaoClasPercCon11,
    onEachFeature: onEachFeatureAlojFamNaoClasPercCon11
});

let slideAlojFamNaoClasPercCon11 = function(){
    var sliderAlojFamNaoClasPercCon11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamNaoClasPercCon11, {
        start: [0, maxAlojFamNaoClasPercCon11],
        tooltips:true,
        connect: true,
        range: {
            'min': 0,
            'max': maxAlojFamNaoClasPercCon11
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamNaoClasPercCon11);
    inputNumberMax.setAttribute("value",maxAlojFamNaoClasPercCon11);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamNaoClasPercCon11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamNaoClasPercCon11.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamNaoClasPercCon11.noUiSlider.on('update',function(e){
        AlojFamNaoClasPercCon11.eachLayer(function(layer){
            if(layer.feature.properties.PerANC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerANC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamNaoClasPercCon11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderAlojFamNaoClasPercCon11.noUiSlider;
    $(slidersGeral).append(sliderAlojFamNaoClasPercCon11);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares Não Clássicos em 2011 -------------- \\\\\\

//////------- Percentagem Total de Alojamentos Familiares Não Clássicos por Concelho em 2001-----////


var minAlojFamNaoClasPercCon01 = 0;
var maxAlojFamNaoClasPercCon01 = 0;

function EstiloAlojFamNaoClasPercCon01(feature) {
    if( feature.properties.PerANC01 <= minAlojFamNaoClasPercCon01 || minAlojFamNaoClasPercCon01 === 0){
        minAlojFamNaoClasPercCon01 = feature.properties.PerANC01
    }
    if(feature.properties.PerANC01 >= maxAlojFamNaoClasPercCon01 ){
        maxAlojFamNaoClasPercCon01 = feature.properties.PerANC01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamNaoClassConc(feature.properties.PerANC01)
    };
}


function apagarAlojFamNaoClasPercCon01(e) {
    AlojFamNaoClasPercCon01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojFamNaoClasPercCon01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerANC01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamNaoClasPercCon01,
    });
}
var AlojFamNaoClasPercCon01= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojFamNaoClasPercCon01,
    onEachFeature: onEachFeatureAlojFamNaoClasPercCon01
});

let slideAlojFamNaoClasPercCon01 = function(){
    var sliderAlojFamNaoClasPercCon01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 69){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamNaoClasPercCon01, {
        start: [0, maxAlojFamNaoClasPercCon01],
        tooltips:true,
        connect: true,
        range: {
            'min': 0,
            'max': maxAlojFamNaoClasPercCon01
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamNaoClasPercCon01);
    inputNumberMax.setAttribute("value",maxAlojFamNaoClasPercCon01);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamNaoClasPercCon01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamNaoClasPercCon01.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamNaoClasPercCon01.noUiSlider.on('update',function(e){
        AlojFamNaoClasPercCon01.eachLayer(function(layer){
            if(layer.feature.properties.PerANC01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerANC01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamNaoClasPercCon01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 69;
    sliderAtivo = sliderAlojFamNaoClasPercCon01.noUiSlider;
    $(slidersGeral).append(sliderAlojFamNaoClasPercCon01);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares Não Clássicos em 2001 -------------- \\\\\\

//////------- Percentagem Total de Alojamentos Familiares Não Clássicos por Concelho em 1991-----////

var minAlojFamNaoClasPercCon91 = 0;
var maxAlojFamNaoClasPercCon91 = 0;

function EstiloAlojFamNaoClasPercCon91(feature) {
    if( feature.properties.PerANC91 <= minAlojFamNaoClasPercCon91 || minAlojFamNaoClasPercCon91 === 0){
        minAlojFamNaoClasPercCon91 = feature.properties.PerANC91
    }
    if(feature.properties.PerANC91 >= maxAlojFamNaoClasPercCon91 ){
        maxAlojFamNaoClasPercCon91 = feature.properties.PerANC91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamNaoClassConc(feature.properties.PerANC91)
    };
}

function apagarAlojFamNaoClasPercCon91(e) {
    AlojFamNaoClasPercCon91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojFamNaoClasPercCon91(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerANC91 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojFamNaoClasPercCon91,
    });
}
var AlojFamNaoClasPercCon91= L.geoJSON(concelhosRelativos1991, {
    style:EstiloAlojFamNaoClasPercCon91,
    onEachFeature: onEachFeatureAlojFamNaoClasPercCon91
});

let slideAlojFamNaoClasPercCon91 = function(){
    var sliderAlojFamNaoClasPercCon91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 73){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojFamNaoClasPercCon91, {
        start: [minAlojFamNaoClasPercCon91, maxAlojFamNaoClasPercCon91],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojFamNaoClasPercCon91,
            'max': maxAlojFamNaoClasPercCon91
        },
        });
    inputNumberMin.setAttribute("value",minAlojFamNaoClasPercCon91);
    inputNumberMax.setAttribute("value",maxAlojFamNaoClasPercCon91);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojFamNaoClasPercCon91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojFamNaoClasPercCon91.noUiSlider.set([null, this.value]);
    });

    sliderAlojFamNaoClasPercCon91.noUiSlider.on('update',function(e){
        AlojFamNaoClasPercCon91.eachLayer(function(layer){
            if(layer.feature.properties.PerANC91>=parseFloat(e[0])&& layer.feature.properties.PerANC91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojFamNaoClasPercCon91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 73;
    sliderAtivo = sliderAlojFamNaoClasPercCon91.noUiSlider;
    $(slidersGeral).append(sliderAlojFamNaoClasPercCon91);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares Não Clássicos em 1991 -------------- \\\\\\

//////------- Percentagem Total de Alojamentos Familiares Coletivos por Concelho em 2021-----////


var minAlojColePercCon21 = 0;
var maxAlojColePercCon21 = 0;

function CorPerAlojaFamColetivosConc(d) {
    return d >= 0.53 ? '#8c0303' :
        d >= 0.44  ? '#de1f35' :
        d >= 0.31 ? '#ff5e6e' :
        d >= 0.17   ? '#f5b3be' :
        d >= 0.02   ? '#F2C572' :
                ''  ;
}
var legendaPerAlojaFamColetivosConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 0.53' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 0.44 - 0.53' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 0.31 - 0.44' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0.17 - 0.31' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.03 - 0.17' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloAlojColePercCon21(feature) {
    if( feature.properties.PerAC21 <= minAlojColePercCon21 || minAlojColePercCon21 === 0){
        minAlojColePercCon21 = feature.properties.PerAC21
    }
    if(feature.properties.PerAC21 >= maxAlojColePercCon21 ){
        maxAlojColePercCon21 = feature.properties.PerAC21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamColetivosConc(feature.properties.PerAC21)
    };
}

function apagarAlojColePercCon21(e) {
    AlojColePercCon21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureAlojColePercCon21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerAC21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojColePercCon21,
    });
}
var AlojColePercCon21= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojColePercCon21,
    onEachFeature: onEachFeatureAlojColePercCon21
});

let slideAlojColePercCon21 = function(){
    var sliderAlojColePercCon21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 39){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojColePercCon21, {
        start: [minAlojColePercCon21, maxAlojColePercCon21],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojColePercCon21,
            'max': maxAlojColePercCon21
        },
        });
    inputNumberMin.setAttribute("value",minAlojColePercCon21);
    inputNumberMax.setAttribute("value",maxAlojColePercCon21);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojColePercCon21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojColePercCon21.noUiSlider.set([null, this.value]);
    });

    sliderAlojColePercCon21.noUiSlider.on('update',function(e){
        AlojColePercCon21.eachLayer(function(layer){
            if(layer.feature.properties.PerAC21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAC21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojColePercCon21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 39;
    sliderAtivo = sliderAlojColePercCon21.noUiSlider;
    $(slidersGeral).append(sliderAlojColePercCon21);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares Coletivos em 2021 -------------- \\\\\\

//////------- Percentagem Total de Alojamentos Familiares Coletivos por Concelho em 2011-----////

var minAlojColePercCon11 = 0;
var maxAlojColePercCon11 = 0;

function EstiloAlojColePercCon11(feature) {
    if( feature.properties.PerAC11 <= minAlojColePercCon11 || minAlojColePercCon11 === 0){
        minAlojColePercCon11 = feature.properties.PerAC11
    }
    if(feature.properties.PerAC11 >= maxAlojColePercCon11 ){
        maxAlojColePercCon11 = feature.properties.PerAC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamColetivosConc(feature.properties.PerAC11)
    };
}

function apagarAlojColePercCon11(e) {
    AlojColePercCon11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojColePercCon11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerAC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojColePercCon11,
    });
}
var AlojColePercCon11= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojColePercCon11,
    onEachFeature: onEachFeatureAlojColePercCon11
});

let slideAlojColePercCon11 = function(){
    var sliderAlojColePercCon11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojColePercCon11, {
        start: [minAlojColePercCon11, maxAlojColePercCon11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojColePercCon11,
            'max': maxAlojColePercCon11
        },
        });
    inputNumberMin.setAttribute("value",minAlojColePercCon11);
    inputNumberMax.setAttribute("value",maxAlojColePercCon11);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojColePercCon11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojColePercCon11.noUiSlider.set([null, this.value]);
    });

    sliderAlojColePercCon11.noUiSlider.on('update',function(e){
        AlojColePercCon11.eachLayer(function(layer){
            if(layer.feature.properties.PerAC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojColePercCon11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderAlojColePercCon11.noUiSlider;
    $(slidersGeral).append(sliderAlojColePercCon11);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares Coletivos em 2011 -------------- \\\\\\

//////------- Percentagem Total de Alojamentos Familiares Coletivos por Concelho em 2001-----////

var minAlojColePercCon01 = 0;
var maxAlojColePercCon01 = 0;

function EstiloAlojColePercCon01(feature) {
    if( feature.properties.PerAC01 <= minAlojColePercCon01 || minAlojColePercCon01 === 0){
        minAlojColePercCon01 = feature.properties.PerAC01
    }
    if(feature.properties.PerAC01 >= maxAlojColePercCon01 ){
        maxAlojColePercCon01 = feature.properties.PerAC01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamColetivosConc(feature.properties.PerAC01)
    };
}
function apagarAlojColePercCon01(e) {
    AlojColePercCon01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojColePercCon01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerAC01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojColePercCon01,
    });
}
var AlojColePercCon01= L.geoJSON(tipoAlojamentoVariacao, {
    style:EstiloAlojColePercCon01,
    onEachFeature: onEachFeatureAlojColePercCon01
});
let slideAlojColePercCon01 = function(){
    var sliderAlojColePercCon01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 70){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojColePercCon01, {
        start: [minAlojColePercCon01, maxAlojColePercCon01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojColePercCon01,
            'max': maxAlojColePercCon01
        },
        });
    inputNumberMin.setAttribute("value",minAlojColePercCon01);
    inputNumberMax.setAttribute("value",maxAlojColePercCon01);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojColePercCon01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojColePercCon01.noUiSlider.set([null, this.value]);
    });

    sliderAlojColePercCon01.noUiSlider.on('update',function(e){
        AlojColePercCon01.eachLayer(function(layer){
            if(layer.feature.properties.PerAC01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAC01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojColePercCon01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 70;
    sliderAtivo = sliderAlojColePercCon01.noUiSlider;
    $(slidersGeral).append(sliderAlojColePercCon01);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares Coletivos em 2001 -------------- \\\\\\

//////------- Percentagem Total de Alojamentos Familiares Coletivos por Concelho em 1991-----////

var minAlojColePercCon91 = 0;
var maxAlojColePercCon91 = 0;

function EstiloAlojColePercCon91(feature) {
    if( feature.properties.PerAC91 <= minAlojColePercCon91 || minAlojColePercCon91 === 0){
        minAlojColePercCon91 = feature.properties.PerAC91
    }
    if(feature.properties.PerAC91 >= maxAlojColePercCon91 ){
        maxAlojColePercCon91 = feature.properties.PerAC91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamColetivosConc(feature.properties.PerAC91)
    };
}


function apagarAlojColePercCon91(e) {
    AlojColePercCon91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAlojColePercCon91(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerAC91 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAlojColePercCon91,
    });
}
var AlojColePercCon91= L.geoJSON(concelhosRelativos1991, {
    style:EstiloAlojColePercCon91,
    onEachFeature: onEachFeatureAlojColePercCon91
});

let slideAlojColePercCon91 = function(){
    var sliderAlojColePercCon91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 74){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAlojColePercCon91, {
        start: [minAlojColePercCon91, maxAlojColePercCon91],
        tooltips:true,
        connect: true,
        range: {
            'min': minAlojColePercCon91,
            'max': maxAlojColePercCon91
        },
        });
    inputNumberMin.setAttribute("value",minAlojColePercCon91);
    inputNumberMax.setAttribute("value",maxAlojColePercCon91);

    inputNumberMin.addEventListener('change', function(){
        sliderAlojColePercCon91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAlojColePercCon91.noUiSlider.set([null, this.value]);
    });

    sliderAlojColePercCon91.noUiSlider.on('update',function(e){
        AlojColePercCon91.eachLayer(function(layer){
            if(layer.feature.properties.PerAC91>=parseFloat(e[0])&& layer.feature.properties.PerAC91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAlojColePercCon91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 74;
    sliderAtivo = sliderAlojColePercCon91.noUiSlider;
    $(slidersGeral).append(sliderAlojColePercCon91);
} 

///// Fim da Percentagem do Total de Alojamentos Familiares Coletivos em 1991 -------------- \\\\\\

/////// ------------------------- Freguesias --------------------------------- \\\\\\\\\

//////------- Percentagem de Alojamentos Familiares em 2021 POR FREGUESIAS-----///

var minPercAlojFam21Freg = 0;
var maxPercAlojFam21Freg = 0;

function CorPerAlojaFamiliaresFreg(d) {
    return d >= 99.7 ? '#8c0303' :
        d >= 99.26  ? '#de1f35' :
        d >= 98.52 ? '#ff5e6e' :
        d >= 97.78   ? '#f5b3be' :
        d >= 97.04   ? '#F2C572' :
                ''  ;
}
var legendaPerAlojaFamiliaresFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 99.70' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 99.26 - 99.70' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 98.52 - 99.26' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 97.78 - 98.52' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 97.04 - 97.78' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPercAlojFam21Freg(feature) {
    if( feature.properties.PerAF21 <= minPercAlojFam21Freg || minPercAlojFam21Freg === 0){
        minPercAlojFam21Freg = feature.properties.PerAF21
    }
    if(feature.properties.PerAF21 >= maxPercAlojFam21Freg ){
        maxPercAlojFam21Freg = feature.properties.PerAF21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresFreg(feature.properties.PerAF21)
    };
}


function apagarPercAlojFam21Freg(e) {
    PercAlojFam21Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercAlojFam21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerAF21.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojFam21Freg,
    });
}
var PercAlojFam21Freg= L.geoJSON(VarTipoAlojamentoFreg, {
    style:EstiloPercAlojFam21Freg,
    onEachFeature: onEachFeaturePercAlojFam21Freg
});
let slidePercAlojFam21Freg = function(){
    var sliderPercAlojFam21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercAlojFam21Freg, {
        start: [minPercAlojFam21Freg, maxPercAlojFam21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercAlojFam21Freg,
            'max': maxPercAlojFam21Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojFam21Freg);
    inputNumberMax.setAttribute("value",maxPercAlojFam21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojFam21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojFam21Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojFam21Freg.noUiSlider.on('update',function(e){
        PercAlojFam21Freg.eachLayer(function(layer){
            if(layer.feature.properties.PerAF21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAF21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojFam21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderPercAlojFam21Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojFam21Freg);
} 

///// Fim da Percentagem de Alojamentos Familiares em 2021 POR FREGUESIAS -------------- \\\\\\

//////------- Percentagem de Alojamentos Familiares em 2011 POR FREGUESIAS-----////

var minPercAlojFam11Freg = 0;
var maxPercAlojFam11Freg = 0;

function EstiloPercAlojFam11Freg(feature) {
    if( feature.properties.PerAF11 <= minPercAlojFam11Freg || minPercAlojFam11Freg === 0){
        minPercAlojFam11Freg = feature.properties.PerAF11
    }
    if(feature.properties.PerAF11 >= maxPercAlojFam11Freg ){
        maxPercAlojFam11Freg = feature.properties.PerAF11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresFreg(feature.properties.PerAF11)
    };
}


function apagarPercAlojFam11Freg(e) {
    PercAlojFam11Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercAlojFam11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerAF11.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojFam11Freg,
    });
}
var PercAlojFam11Freg= L.geoJSON(VarTipoAlojamentoFreg, {
    style:EstiloPercAlojFam11Freg,
    onEachFeature: onEachFeaturePercAlojFam11Freg
});

let slidePercAlojFam11Freg = function(){
    var sliderPercAlojFam11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercAlojFam11Freg, {
        start: [minPercAlojFam11Freg, maxPercAlojFam11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercAlojFam11Freg,
            'max': maxPercAlojFam11Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojFam11Freg);
    inputNumberMax.setAttribute("value",maxPercAlojFam11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojFam11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojFam11Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojFam11Freg.noUiSlider.on('update',function(e){
        PercAlojFam11Freg.eachLayer(function(layer){
            if(layer.feature.properties.PerAF11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAF11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojFam11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderPercAlojFam11Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojFam11Freg);
} 

///// Fim da Percentagem de Alojamentos Familiares em 2011 POR FREGUESIAS -------------- \\\\\\

//////------- Percentagem de Alojamentos Familiares em 2001 POR FREGUESIAS-----////

var minPercAlojFam01Freg = 0;
var maxPercAlojFam01Freg = 0;

function EstiloPercAlojFam01Freg(feature) {
    if( feature.properties.PerAF01 <= minPercAlojFam01Freg && feature.properties.PerAF01 > null|| minPercAlojFam01Freg === 0){
        minPercAlojFam01Freg = feature.properties.PerAF01
    }
    if(feature.properties.PerAF01 >= maxPercAlojFam01Freg ){
        maxPercAlojFam01Freg = feature.properties.PerAF01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresFreg(feature.properties.PerAF01)
    };
}


function apagarPercAlojFam01Freg(e) {
    PercAlojFam01Freg.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeaturePercAlojFam01Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerAF01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojFam01Freg,
    });
}
var PercAlojFam01Freg= L.geoJSON(freguesiasRelativos2001, {
    style:EstiloPercAlojFam01Freg,
    onEachFeature: onEachFeaturePercAlojFam01Freg
});
let slidePercAlojFam01Freg = function(){
    var sliderPercAlojFam01Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 95){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercAlojFam01Freg, {
        start: [minPercAlojFam01Freg, maxPercAlojFam01Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercAlojFam01Freg,
            'max': maxPercAlojFam01Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojFam01Freg);
    inputNumberMax.setAttribute("value",maxPercAlojFam01Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojFam01Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojFam01Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojFam01Freg.noUiSlider.on('update',function(e){
        PercAlojFam01Freg.eachLayer(function(layer){
            if (layer.feature.properties.PerAF01 == null){
                return false
            }
            if(layer.feature.properties.PerAF01>=parseFloat(e[0])&& layer.feature.properties.PerAF01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojFam01Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 95;
    sliderAtivo = sliderPercAlojFam01Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojFam01Freg);
} 

///// Fim da Percentagem de Alojamentos Familiares em 2001 POR FREGUESIAS -------------- \\\\\\

//////------- Percentagem de Alojamentos Familiares em 1991 POR FREGUESIAS-----////

var minPercAlojFam91Freg = 0;
var maxPercAlojFam91Freg = 0;

function EstiloPercAlojFam91Freg(feature) {
    if( feature.properties.PerAF91 <= minPercAlojFam91Freg || minPercAlojFam91Freg === 0){
        minPercAlojFam91Freg = feature.properties.PerAF91
    }
    if(feature.properties.PerAF91 >= maxPercAlojFam91Freg ){
        maxPercAlojFam91Freg = feature.properties.PerAF91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresFreg(feature.properties.PerAF91)
    };
}


function apagarPercAlojFam91Freg(e) {
    PercAlojFam91Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercAlojFam91Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerAF91.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojFam91Freg,
    });
}
var PercAlojFam91Freg= L.geoJSON(freguesiasRelativos1991, {
    style:EstiloPercAlojFam91Freg,
    onEachFeature: onEachFeaturePercAlojFam91Freg
});

let slidePercAlojFam91Freg = function(){
    var sliderPercAlojFam91Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 96){
        sliderAtivo.destroy();
    }
    noUiSlider.create(sliderPercAlojFam91Freg, {
        start: [minPercAlojFam91Freg, maxPercAlojFam91Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercAlojFam91Freg,
            'max': maxPercAlojFam91Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojFam91Freg);
    inputNumberMax.setAttribute("value",maxPercAlojFam91Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojFam91Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojFam91Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojFam91Freg.noUiSlider.on('update',function(e){
        PercAlojFam91Freg.eachLayer(function(layer){
            if (layer.feature.properties.PerAF91 == null){
                return false
            }
            if(layer.feature.properties.PerAF91>=parseFloat(e[0])&& layer.feature.properties.PerAF91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojFam91Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 96;
    sliderAtivo = sliderPercAlojFam91Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojFam91Freg);
} 

///// Fim da Percentagem de Alojamentos Familiares em 1991 POR FREGUESIAS -------------- \\\\\\

//////------- Percentagem de Alojamentos Familiares Clássicos em 2021 POR FREGUESIAS-----////

var minPercAlojClass21Freg = 0;
var maxPercAlojClass21Freg = 0;

function CorPerAlojaFamiliaresClassFreg(d) {
    return d >= 99.14 ? '#8c0303' :
        d >= 97.85  ? '#de1f35' :
        d >= 95.7 ? '#ff5e6e' :
        d >= 93.54   ? '#f5b3be' :
        d >= 91.39   ? '#F2C572' :
                ''  ;
}
var legendaPerAlojaFamiliaresClassFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 99.14' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 97.85 - 99.14' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 95.7 - 97.85' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 93.54 - 95.7' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 91.39 - 93.54' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPercAlojClass21Freg(feature) {
    if( feature.properties.PerAFC21 <= minPercAlojClass21Freg || minPercAlojClass21Freg === 0){
        minPercAlojClass21Freg = feature.properties.PerAFC21
    }
    if(feature.properties.PerAFC21 >= maxPercAlojClass21Freg ){
        maxPercAlojClass21Freg = feature.properties.PerAFC21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresClassFreg(feature.properties.PerAFC21)
    };
}


function apagarPercAlojClass21Freg(e) {
    PercAlojClass21Freg.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeaturePercAlojClass21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerAFC21.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojClass21Freg,
    });
}
var PercAlojClass21Freg= L.geoJSON(VarTipoAlojamentoFreg, {
    style:EstiloPercAlojClass21Freg,
    onEachFeature: onEachFeaturePercAlojClass21Freg
});

let slidePercAlojClass21Freg = function(){
    var sliderPercAlojClass21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercAlojClass21Freg, {
        start: [minPercAlojClass21Freg, maxPercAlojClass21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercAlojClass21Freg,
            'max': maxPercAlojClass21Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojClass21Freg);
    inputNumberMax.setAttribute("value",maxPercAlojClass21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojClass21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojClass21Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojClass21Freg.noUiSlider.on('update',function(e){
        PercAlojClass21Freg.eachLayer(function(layer){
            if(layer.feature.properties.PerAFC21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAFC21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojClass21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderPercAlojClass21Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojClass21Freg);
} 

///// Fim da Percentagem de Alojamentos Familiares Clássicos em 2021 POR FREGUESIAS -------------- \\\\\\



//////------- Percentagem de Alojamentos Familiares Clássicos em 2011 POR FREGUESIAS-----////

var minPercAlojClass11Freg = 0;
var maxPercAlojClass11Freg = 0;

function EstiloPercAlojClass11Freg(feature) {
    if( feature.properties.PerAFC11 <= minPercAlojClass11Freg || minPercAlojClass11Freg === 0){
        minPercAlojClass11Freg = feature.properties.PerAFC11
    }
    if(feature.properties.PerAFC11 >= maxPercAlojClass11Freg ){
        maxPercAlojClass11Freg = feature.properties.PerAFC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresClassFreg(feature.properties.PerAFC11)
    };
}


function apagarPercAlojClass11Freg(e) {
    PercAlojClass11Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercAlojClass11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerAFC11.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojClass11Freg,
    });
}
var PercAlojClass11Freg= L.geoJSON(VarTipoAlojamentoFreg, {
    style:EstiloPercAlojClass11Freg,
    onEachFeature: onEachFeaturePercAlojClass11Freg
});

let slidePercAlojClass11Freg = function(){
    var sliderPercAlojClass11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 42){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercAlojClass11Freg, {
        start: [minPercAlojClass11Freg, maxPercAlojClass11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercAlojClass11Freg,
            'max': maxPercAlojClass11Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojClass11Freg);
    inputNumberMax.setAttribute("value",maxPercAlojClass11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojClass11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojClass11Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojClass11Freg.noUiSlider.on('update',function(e){
        PercAlojClass11Freg.eachLayer(function(layer){
            if(layer.feature.properties.PerAFC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAFC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojClass11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 42;
    sliderAtivo = sliderPercAlojClass11Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojClass11Freg);
} 

///// Fim da Percentagem de Alojamentos Familiares Clássicos em 2011 POR FREGUESIAS -------------- \\\\\\

//////------- Percentagem de Alojamentos Familiares Clássicos em 2001 POR FREGUESIAS-----////

var minPercAlojClass01Freg = 0;
var maxPercAlojClass01Freg = 0;

function EstiloPercAlojClass01Freg(feature) {
    if( feature.properties.PerAFC01 <= minPercAlojClass01Freg && feature.properties.PerAFC01 > null || minPercAlojClass01Freg === 0){
        minPercAlojClass01Freg = feature.properties.PerAFC01
    }
    if(feature.properties.PerAFC01 >= maxPercAlojClass01Freg ){
        maxPercAlojClass01Freg = feature.properties.PerAFC01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresClassFreg(feature.properties.PerAFC01)
    };
}


function apagarPercAlojClass01Freg(e) {
    PercAlojClass01Freg.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeaturePercAlojClass01Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerAFC01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojClass01Freg,
    });
}
var PercAlojClass01Freg= L.geoJSON(freguesiasRelativos2001, {
    style:EstiloPercAlojClass01Freg,
    onEachFeature: onEachFeaturePercAlojClass01Freg
});
let slidePercAlojClass01Freg = function(){
    var sliderPercAlojClass01Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 98){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercAlojClass01Freg, {
        start: [minPercAlojClass01Freg, maxPercAlojClass01Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercAlojClass01Freg,
            'max': maxPercAlojClass01Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojClass01Freg);
    inputNumberMax.setAttribute("value",maxPercAlojClass01Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojClass01Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojClass01Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojClass01Freg.noUiSlider.on('update',function(e){
        PercAlojClass01Freg.eachLayer(function(layer){
            if (layer.feature.properties.PerAFC01 == null){
                return false
            }
            if(layer.feature.properties.PerAFC01>=parseFloat(e[0])&& layer.feature.properties.PerAFC01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojClass01Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 98;
    sliderAtivo = sliderPercAlojClass01Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojClass01Freg);
} 

///// Fim da Percentagem de Alojamentos Familiares Clássicos em 2001 POR FREGUESIAS -------------- \\\\\\

//////------- Percentagem de Alojamentos Familiares Clássicos em 1991 POR FREGUESIAS-----////

var minPercAlojClass91Freg = 0;
var maxPercAlojClass91Freg = 0;

function EstiloPercAlojClass91Freg(feature) {
    if( feature.properties.PerAFC91 <= minPercAlojClass91Freg && feature.properties.PerAFC91 > null|| minPercAlojClass91Freg === 0){
        minPercAlojClass91Freg = feature.properties.PerAFC91
    }
    if(feature.properties.PerAFC91 >= maxPercAlojClass91Freg ){
        maxPercAlojClass91Freg = feature.properties.PerAFC91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresClassFreg(feature.properties.PerAFC91)
    };
}


function apagarPercAlojClass91Freg(e) {
    PercAlojClass91Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercAlojClass91Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerAFC91.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojClass91Freg,
    });
}
var PercAlojClass91Freg= L.geoJSON(freguesiasRelativos1991, {
    style:EstiloPercAlojClass91Freg,
    onEachFeature: onEachFeaturePercAlojClass91Freg
});
let slidePercAlojClass91Freg = function(){
    var sliderPercAlojClass91Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 103){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercAlojClass91Freg, {
        start: [minPercAlojClass91Freg, maxPercAlojClass91Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercAlojClass91Freg,
            'max': maxPercAlojClass91Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojClass91Freg);
    inputNumberMax.setAttribute("value",maxPercAlojClass91Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojClass91Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojClass91Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojClass91Freg.noUiSlider.on('update',function(e){
        PercAlojClass91Freg.eachLayer(function(layer){
            if (layer.feature.properties.PerAFC91 == null){
                return false
            }
            if(layer.feature.properties.PerAFC91>=parseFloat(e[0])&& layer.feature.properties.PerAFC91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojClass91Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 103;
    sliderAtivo = sliderPercAlojClass91Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojClass91Freg);
} 

///// Fim da Percentagem de Alojamentos Familiares Clássicos em 1991 POR FREGUESIAS -------------- \\\\\\

//////------- Percentagem de Alojamentos Familiares Não Clássicos em 2021 POR FREGUESIAS-----////

var minPercAlojNClass21Freg = 0;
var maxPercAlojNClass21Freg = 0;

function CorPerAlojaFamiliaresNaoClassFreg(d) {
    return d < 0.001 ? '#000000' :
        d >= 7.72 ? '#8c0303' :
        d >= 6.44  ? '#de1f35' :
        d >= 4.29 ? '#ff5e6e' :
        d >= 2.15   ? '#f5b3be' :
        d >= 0.00001   ? '#F2C572' :
                ''  ;
}
var legendaPerAlojaFamiliaresNaoClassFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 7.72' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 6.44 - 7.72' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 4.29 - 6.44' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 2.15 - 4.29' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.01 - 2.15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' 0' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloPercAlojNClass21Freg(feature) {
    if( feature.properties.PerANC21 <= minPercAlojNClass21Freg || minPercAlojNClass21Freg === 0){
        minPercAlojNClass21Freg = feature.properties.PerANC21
    }
    if(feature.properties.PerANC21 >= maxPercAlojNClass21Freg ){
        maxPercAlojNClass21Freg = feature.properties.PerANC21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresNaoClassFreg(feature.properties.PerANC21)
    };
}


function apagarPercAlojNClass21Freg(e) {
    PercAlojNClass21Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercAlojNClass21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerANC21.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojNClass21Freg,
    });
}
var PercAlojNClass21Freg= L.geoJSON(VarTipoAlojamentoFreg, {
    style:EstiloPercAlojNClass21Freg,
    onEachFeature: onEachFeaturePercAlojNClass21Freg
});

let slidePercAlojNClass21Freg = function(){
    var sliderPercAlojNClass21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 43){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercAlojNClass21Freg, {
        start: [0, maxPercAlojNClass21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': 0,
            'max': maxPercAlojNClass21Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojNClass21Freg);
    inputNumberMax.setAttribute("value",maxPercAlojNClass21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojNClass21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojNClass21Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojNClass21Freg.noUiSlider.on('update',function(e){
        PercAlojNClass21Freg.eachLayer(function(layer){
            if(layer.feature.properties.PerANC21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerANC21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojNClass21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 43;
    sliderAtivo = sliderPercAlojNClass21Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojNClass21Freg);
} 

///// Fim da Percentagem de Alojamentos Familiares Não Clássicos em 2021 POR FREGUESIAS -------------- \\\\\\

//////------- Percentagem de Alojamentos Familiares Não Clássicos em 2011 POR FREGUESIAS-----////

var minPercAlojNClass11Freg = 0;
var maxPercAlojNClass11Freg = 0;

function EstiloPercAlojNClass11Freg(feature) {
    if( feature.properties.PerANC11 <= minPercAlojNClass11Freg || minPercAlojNClass11Freg === 0){
        minPercAlojNClass11Freg = feature.properties.PerANC11
    }
    if(feature.properties.PerANC11 >= maxPercAlojNClass11Freg ){
        maxPercAlojNClass11Freg = feature.properties.PerANC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresNaoClassFreg(feature.properties.PerANC11)
    };
}


function apagarPercAlojNClass11Freg(e) {
    PercAlojNClass11Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercAlojNClass11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerANC11.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojNClass11Freg,
    });
}
var PercAlojNClass11Freg= L.geoJSON(VarTipoAlojamentoFreg, {
    style:EstiloPercAlojNClass11Freg,
    onEachFeature: onEachFeaturePercAlojNClass11Freg
});

let slidePercAlojNClass11Freg = function(){
    var sliderPercAlojNClass11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 44){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercAlojNClass11Freg, {
        start: [0, maxPercAlojNClass11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': 0,
            'max': maxPercAlojNClass11Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojNClass11Freg);
    inputNumberMax.setAttribute("value",maxPercAlojNClass11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojNClass11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojNClass11Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojNClass11Freg.noUiSlider.on('update',function(e){
        PercAlojNClass11Freg.eachLayer(function(layer){
            if(layer.feature.properties.PerANC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerANC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojNClass11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 44;
    sliderAtivo = sliderPercAlojNClass11Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojNClass11Freg);
} 

///// Fim da Percentagem de Alojamentos Familiares Não Clássicos em 2011 POR FREGUESIAS -------------- \\\\\\

//////------- Percentagem de Alojamentos Familiares Não Clássicos em 2001 POR FREGUESIAS-----////

var minPercAlojNClass01Freg = 0;
var maxPercAlojNClass01Freg = 0;

function EstiloPercAlojNClass01Freg(feature) {
    if( feature.properties.PerANC01 <= minPercAlojNClass01Freg  || feature.properties.PerANC01 === 0){
        minPercAlojNClass01Freg = feature.properties.PerANC01
    }
    if(feature.properties.PerANC01 >= maxPercAlojNClass01Freg ){
        maxPercAlojNClass01Freg = feature.properties.PerANC01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresNaoClassFreg(feature.properties.PerANC01)
    };
}


function apagarPercAlojNClass01Freg(e) {
    PercAlojNClass01Freg.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeaturePercAlojNClass01Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerANC01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojNClass01Freg,
    });
}
var PercAlojNClass01Freg= L.geoJSON(freguesiasRelativos2001, {
    style:EstiloPercAlojNClass01Freg,
    onEachFeature: onEachFeaturePercAlojNClass01Freg
});
let slidePercAlojNClass01Freg = function(){
    var sliderPercAlojNClass01Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 99){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercAlojNClass01Freg, {
        start: [minPercAlojNClass01Freg, maxPercAlojNClass01Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercAlojNClass01Freg,
            'max': maxPercAlojNClass01Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojNClass01Freg);
    inputNumberMax.setAttribute("value",maxPercAlojNClass01Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojNClass01Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojNClass01Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojNClass01Freg.noUiSlider.on('update',function(e){
        PercAlojNClass01Freg.eachLayer(function(layer){
            if(layer.feature.properties.PerANC01>=parseFloat(e[0])&& layer.feature.properties.PerANC01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojNClass01Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 99;
    sliderAtivo = sliderPercAlojNClass01Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojNClass01Freg);
} 

///// Fim da Percentagem de Alojamentos Familiares Não Clássicos em 2001 POR FREGUESIAS -------------- \\\\\\

//////------- Percentagem de Alojamentos Familiares Não Clássicos em 1991 POR FREGUESIAS-----////

var minPercAlojNClass91Freg = 0;
var maxPercAlojNClass91Freg = 0;

function EstiloPercAlojNClass91Freg(feature) {
    if( feature.properties.PerANC91 <= minPercAlojNClass91Freg || feature.properties.PerANC91 === 0){
        minPercAlojNClass91Freg = feature.properties.PerANC91
    }
    if(feature.properties.PerANC91 >= maxPercAlojNClass91Freg ){
        maxPercAlojNClass91Freg = feature.properties.PerANC91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresNaoClassFreg(feature.properties.PerANC91)
    };
}


function apagarPercAlojNClass91Freg(e) {
    PercAlojNClass91Freg.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeaturePercAlojNClass91Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerANC91.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojNClass91Freg,
    });
}
var PercAlojNClass91Freg= L.geoJSON(freguesiasRelativos1991, {
    style:EstiloPercAlojNClass91Freg,
    onEachFeature: onEachFeaturePercAlojNClass91Freg
});
let slidePercAlojNClass91Freg = function(){
    var sliderPercAlojNClass91Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 100){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercAlojNClass91Freg, {
        start: [minPercAlojNClass91Freg, maxPercAlojNClass91Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercAlojNClass91Freg,
            'max': maxPercAlojNClass91Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojNClass91Freg);
    inputNumberMax.setAttribute("value",maxPercAlojNClass91Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojNClass91Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojNClass91Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojNClass91Freg.noUiSlider.on('update',function(e){
        PercAlojNClass91Freg.eachLayer(function(layer){
            if (layer.feature.properties.PerANC91 == null){
                return false
            }
            if(layer.feature.properties.PerANC91>=parseFloat(e[0])&& layer.feature.properties.PerANC91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojNClass91Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 100;
    sliderAtivo = sliderPercAlojNClass91Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojNClass91Freg);
} 

///// Fim da Percentagem de Alojamentos Familiares Não Clássicos em 1991 POR FREGUESIAS -------------- \\\\\\

//////------- Percentagem de Alojamentos Coletivos em 2021 POR FREGUESIAS-----////

var minPercAlojColet21Freg = 0;
var maxPercAlojColet21Freg = 0;

function CorPerAlojaFamiliaresColetivosFreg(d) {
    return d == 0.00 ? '#000000' :
        d >= 2.66 ? '#8c0303' :
        d >= 2.22  ? '#de1f35' :
        d >= 1.48 ? '#ff5e6e' :
        d >= 0.74   ? '#f5b3be' :
        d >= 0.001   ? '#F2C572' :
                ''  ;
}
var legendaPerAlojaFamiliaresColetivosFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 2.66' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 2.22 - 2.66' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 1.48 - 2.22' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0.74 - 1.48' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.01 - 0.74' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' 0' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloPercAlojColet21Freg(feature) {
    if( feature.properties.PerAC21 <= minPercAlojColet21Freg || minPercAlojColet21Freg === 0){
        minPercAlojColet21Freg = feature.properties.PerAC21
    }
    if(feature.properties.PerAC21 >= maxPercAlojColet21Freg ){
        maxPercAlojColet21Freg = feature.properties.PerAC21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresColetivosFreg(feature.properties.PerAC21)
    };
}

function apagarPercAlojColet21Freg(e) {
    PercAlojColet21Freg.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercAlojColet21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerAC21.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojColet21Freg,
    });
}
var PercAlojColet21Freg= L.geoJSON(VarTipoAlojamentoFreg, {
    style:EstiloPercAlojColet21Freg,
    onEachFeature: onEachFeaturePercAlojColet21Freg
});

let slidePercAlojColet21Freg = function(){
    var sliderPercAlojColet21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercAlojColet21Freg, {
        start: [minPercAlojColet21Freg, maxPercAlojColet21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercAlojColet21Freg,
            'max': maxPercAlojColet21Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojColet21Freg);
    inputNumberMax.setAttribute("value",maxPercAlojColet21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojColet21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojColet21Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojColet21Freg.noUiSlider.on('update',function(e){
        PercAlojColet21Freg.eachLayer(function(layer){
            if(layer.feature.properties.PerAC21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAC21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojColet21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderPercAlojColet21Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojColet21Freg);
} 

///// Fim da Percentagem de Alojamentos Coletivos em 2021 POR FREGUESIAS -------------- \\\\\\

//////------- Percentagem de Alojamentos Coletivos em 2011 POR FREGUESIAS-----////


var minPercAlojColet11Freg = 0;
var maxPercAlojColet11Freg = 0;

function EstiloPercAlojColet11Freg(feature) {
    if( feature.properties.PerAC11 <= minPercAlojColet11Freg || minPercAlojColet11Freg === 0){
        minPercAlojColet11Freg = feature.properties.PerAC11
    }
    if(feature.properties.PerAC11 >= maxPercAlojColet11Freg ){
        maxPercAlojColet11Freg = feature.properties.PerAC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresColetivosFreg(feature.properties.PerAC11)
    };
}


function apagarPercAlojColet11Freg(e) {
    PercAlojColet11Freg.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeaturePercAlojColet11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerAC11.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojColet11Freg,
    });
}
var PercAlojColet11Freg= L.geoJSON(VarTipoAlojamentoFreg, {
    style:EstiloPercAlojColet11Freg,
    onEachFeature: onEachFeaturePercAlojColet11Freg
});

let slidePercAlojColet11Freg = function(){
    var sliderPercAlojColet11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 46){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercAlojColet11Freg, {
        start: [minPercAlojColet11Freg, maxPercAlojColet11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercAlojColet11Freg,
            'max': maxPercAlojColet11Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojColet11Freg);
    inputNumberMax.setAttribute("value",maxPercAlojColet11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojColet11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojColet11Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojColet11Freg.noUiSlider.on('update',function(e){
        PercAlojColet11Freg.eachLayer(function(layer){
            if(layer.feature.properties.PerAC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojColet11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 46;
    sliderAtivo = sliderPercAlojColet11Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojColet11Freg);
} 

///// Fim da Percentagem de Alojamentos Coletivos em 2011 POR FREGUESIAS -------------- \\\\\\

//////------- Percentagem de Alojamentos Coletivos em 2001 POR FREGUESIAS-----////



var minPercAlojColet01Freg = 0;
var maxPercAlojColet01Freg = 0;

function EstiloPercAlojColet01Freg(feature) {
    if( feature.properties.PerAC01 <= minPercAlojColet01Freg && feature.properties.PerAC01 > null || minPercAlojColet01Freg === 0){
        minPercAlojColet01Freg = feature.properties.PerAC01
    }
    if(feature.properties.PerAC01 >= maxPercAlojColet01Freg ){
        maxPercAlojColet01Freg = feature.properties.PerAC01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresColetivosFreg(feature.properties.PerAC01)
    };
}


function apagarPercAlojColet01Freg(e) {
    PercAlojColet01Freg.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeaturePercAlojColet01Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerAC01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojColet01Freg,
    });
}
var PercAlojColet01Freg= L.geoJSON(freguesiasRelativos2001, {
    style:EstiloPercAlojColet01Freg,
    onEachFeature: onEachFeaturePercAlojColet01Freg
});
let slidePercAlojColet01Freg = function(){
    var sliderPercAlojColet01Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 101){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercAlojColet01Freg, {
        start: [minPercAlojColet01Freg, maxPercAlojColet01Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercAlojColet01Freg,
            'max': maxPercAlojColet01Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojColet01Freg);
    inputNumberMax.setAttribute("value",maxPercAlojColet01Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojColet01Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojColet01Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojColet01Freg.noUiSlider.on('update',function(e){
        PercAlojColet01Freg.eachLayer(function(layer){
            if (layer.feature.properties.PerAC01 == null){
                return false
            }
            if(layer.feature.properties.PerAC01>=parseFloat(e[0])&& layer.feature.properties.PerAC01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojColet01Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 101;
    sliderAtivo = sliderPercAlojColet01Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojColet01Freg);
} 

///// Fim da Percentagem de Alojamentos Coletivos em 2001 POR FREGUESIAS -------------- \\\\\\

//////------- Percentagem de Alojamentos Coletivos em 1991 POR FREGUESIAS-----////

var minPercAlojColet91Freg = 0;
var maxPercAlojColet91Freg = 0;

function EstiloPercAlojColet91Freg(feature) {
    if((feature.properties.PerAC91 <= minPercAlojColet91Freg > null)){
        minPercAlojColet91Freg = feature.properties.PerAC91
    }
    if(feature.properties.PerAC91 >= maxPercAlojColet91Freg ){
        maxPercAlojColet91Freg = feature.properties.PerAC91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAlojaFamiliaresColetivosFreg(feature.properties.PerAC91)
    };
}
function apagarPercAlojColet91Freg(e) {
    PercAlojColet91Freg.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeaturePercAlojColet91Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerAC91.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercAlojColet91Freg,
    });
}
var PercAlojColet91Freg= L.geoJSON(freguesiasRelativos1991, {
    style:EstiloPercAlojColet91Freg,
    onEachFeature: onEachFeaturePercAlojColet91Freg
});

let slidePercAlojColet91Freg = function(){
    var sliderPercAlojColet91Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 102){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercAlojColet91Freg, {
        start: [0, maxPercAlojColet91Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': 0,
            'max': maxPercAlojColet91Freg
        },
        });
    inputNumberMin.setAttribute("value",minPercAlojColet91Freg);
    inputNumberMax.setAttribute("value",maxPercAlojColet91Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPercAlojColet91Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercAlojColet91Freg.noUiSlider.set([null, this.value]);
    });

    sliderPercAlojColet91Freg.noUiSlider.on('update',function(e){
        PercAlojColet91Freg.eachLayer(function(layer){
            if (layer.feature.properties.PerAC91 == null){
                return false
            }
            if(layer.feature.properties.PerAC91>=parseFloat(e[0]) && layer.feature.properties.PerAC91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercAlojColet91Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 102;
    sliderAtivo = sliderPercAlojColet91Freg.noUiSlider;
    $(slidersGeral).append(sliderPercAlojColet91Freg);
} 

///// Fim da Percentagem de Alojamentos Coletivos em 1991 POR FREGUESIAS -------------- \\\\\\

/// Função do zoom\\\\
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}
$('#tituloMapa').html('<strong>' + 'Total de alojamentos, em 2021, por concelho.' + '</strong>');
var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Recenseamento da população e habitação';

////Ao abrir página aparecer logo a fonte e legenda


/// Não duplicar as layers
let naoDuplicar = 53
//// dizer qual a layer ativa
let layerAtiva = totalAlojamentos91Concelhos;
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

    if (layer == totalAlojamentos21 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Total de alojamentos, em 2021, por concelho.' + '</strong>');
        legenda(max, (max-min)/2,min,0.1);
        contorno.addTo(map)
        slideTotalAlojamentos21();
        baseAtiva = contorno;
        naoDuplicar = 1;
    }
    if (layer == totalAlojamentos91Concelhos && naoDuplicar == 53){
        contornoConcelhos1991.addTo(map);
        $('#tituloMapa').html('<strong>' + 'Total de alojamentos, em 2021, por concelho.' + '</strong>');
    }
    if (layer == totalAlojamentos11Concelhos && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Total de alojamentos, em 2011, por concelho.' + '</strong>');
        legenda(maxTotalAlojamentos11Concelhos,Math.round((maxTotalAlojamentos11Concelhos-minTotalAlojamentos11Concelhos)/2),minTotalAlojamentos11Concelhos,0.1);
        contorno.addTo(map)
        baseAtiva = contorno;
        slidetotalAlojamentos11Concelhos();
        naoDuplicar = 6;
    }
    if (layer == totalAlojamentos01Concelhos && naoDuplicar != 52){
        $('#tituloMapa').html('<strong>' + 'Total de alojamentos, em 2001, por concelho.' + '</strong>');
        legenda(maxTotalAlojamentos01Concelhos,Math.round((maxTotalAlojamentos01Concelhos-minTotalAlojamentos01Concelhos)/2),minTotalAlojamentos01Concelhos,0.1);
        contorno.addTo(map)
        baseAtiva = contorno;
        slidetotalAlojamentos01Concelhos();
        naoDuplicar = 52;
    }
    if (layer == totalAlojamentos91Concelhos && naoDuplicar != 53){
        $('#tituloMapa').html('<strong>' + 'Total de alojamentos, em 1991, por concelho.' + '</strong>');
        legenda(maxTotalAlojamentos91Concelhos,Math.round((maxTotalAlojamentos91Concelhos-minTotalAlojamentos91Concelhos)/2),minTotalAlojamentos91Concelhos,0.1);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991
        slidetotalAlojamentos91Concelhos();
        naoDuplicar = 53;
    }
    if (layer == AlojamentosFamiliares2021 && naoDuplicar != 7){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares, em 2021, por concelho.' + '</strong>');
        legenda(maxAlojaFam2021,Math.round((maxAlojaFam2021-minAlojaFam2021)/2),minAlojaFam2021,0.1);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideAlojamentosFamiliares2021();
        naoDuplicar = 7;
    }
    if (layer == AlojamentosFamiliares2011 && naoDuplicar != 8){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares, em 2011, por concelho.' + '</strong>');
        legenda(maxAlojamentosFamiliares11, Math.round((maxAlojamentosFamiliares11-minAlojamentosFamiliares11)/2),minAlojamentosFamiliares11,0.1);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideAlojamentosFamiliares2011();
        naoDuplicar = 8;
    }
    if (layer == AlojamentosFamiliares01 && naoDuplicar != 54){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares, em 2001, por concelho.' + '</strong>');
        legenda(maxAlojaFam01,Math.round((maxAlojaFam01-minAlojaFam01)/2),minAlojaFam01,0.1);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideAlojamentosFamiliares01();
        naoDuplicar = 54;
    }
    if (layer == AlojamentosFamiliares91 && naoDuplicar != 55){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares, em 1991, por concelho.' + '</strong>');
        legenda(maxAlojaFam91,Math.round((maxAlojaFam91-minAlojaFam91)/2),minAlojaFam91,0.1);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slideAlojamentosFamiliares91();
        naoDuplicar = 55;
    }
    if (layer == alojaFamClass2021 && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos, em 2021, por concelho.' + '</strong>');
        legenda(maxAlojFamiClass21,Math.round((maxAlojFamiClass21-minAlojFamiClass21)/2),minAlojFamiClass21,0.1);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidealojaFamClass2021();
        naoDuplicar = 4;
    }
    if (layer == alojaFamClass2011 && naoDuplicar != 9){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos, em 2011, por concelho.' + '</strong>');
        legenda(maxAlojFamiClass11, Math.round((maxAlojFamiClass11-minAlojFamiClass11)/2),minAlojFamiClass11,0.1);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidealojaFamClass2011();
        naoDuplicar = 9;
    }
    if (layer == alojaFamClass2001 && naoDuplicar != 56){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos, em 2001, por concelho.' + '</strong>');
        legenda(maxAlojFamiClass01, Math.round((maxAlojFamiClass01-minAlojFamiClass01)/2),minAlojFamiClass01,0.1);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidealojaFamClass2001();
        naoDuplicar = 56;
    }
    if (layer == alojaFamClass91 && naoDuplicar != 57){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos, em 1991, por concelho.' + '</strong>');
        legenda(maxAlojFamiClass91, Math.round((maxAlojFamiClass91-minAlojFamiClass91)/2),minAlojFamiClass91,0.1);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slidealojaFamClass91();
        naoDuplicar = 57;
    }
    if (layer == alojaFamNaoClass2021 && naoDuplicar != 18){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares não clássicos, em 2021, por concelho.' + '</strong>');
        legendaExcecao(maxAlojFamiNaoClass21, Math.round((maxAlojFamiNaoClass21-minAlojFamiNaoClass21)/2),minAlojFamiNaoClass21,1);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidealojaFamNaoClass2021();
        naoDuplicar = 18;
    }
    if (layer == alojaFamNaoClass2011 && naoDuplicar != 17){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares não clássicos, em 2011, por concelho.' + '</strong>');
        legendaExcecao(maxAlojFamiNaoClass11, Math.round((maxAlojFamiNaoClass11-minAlojFamiNaoClass11)/2),minAlojFamiNaoClass11,1);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidealojaFamNaoClass2011();
        naoDuplicar = 17;
    }
    if (layer == alojaFamNaoClass01 && naoDuplicar != 58){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares não clássicos, em 2001, por concelho.' + '</strong>');
        legendaExcecao(maxAlojFamiNaoClass01, Math.round((maxAlojFamiNaoClass01-minAlojFamiNaoClass01)/2),minAlojFamiNaoClass01,1);
        contorno.addTo(map);
        baseAtiva = contorno;
        slidealojaFamNaoClass01();
        naoDuplicar = 58;
    }
    if (layer == alojaFamNaoClass91 && naoDuplicar != 59){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares não clássicos, em 1991, por concelho.' + '</strong>');
        legendaExcecao(maxAlojFamiNaoClass91, Math.round((maxAlojFamiNaoClass91-minAlojFamiNaoClass91)/2),minAlojFamiNaoClass91,1);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slidealojaFamNaoClass91();
        naoDuplicar = 59;
    }
    if (layer == AlojaFamColetivos21 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares coletivos, em 2021, por concelho.' + '</strong>');
        legenda(maxAlojFamiColetivos21, Math.round((maxAlojFamiColetivos21-minAlojFamiColetivos21)/2),minAlojFamiColetivos21,2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideAlojaFamColetivos21();
        naoDuplicar = 5;
    }
    if (layer == AlojaFamColetivos11 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares coletivos, em 2011, por concelho.' + '</strong>');
        legenda(maxAlojFamiColetivos11, Math.round((maxAlojFamiColetivos11-minAlojFamiColetivos11)/2),minAlojFamiColetivos11,2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideAlojaFamColetivos11();
        naoDuplicar = 2;
    }
    if (layer == AlojaFamColetivos01 && naoDuplicar != 60){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares coletivos, em 2001, por concelho.' + '</strong>');
        legenda(maxAlojFamiColetivos01, Math.round((maxAlojFamiColetivos01-minAlojFamiColetivos01)/2),minAlojFamiColetivos01,2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideAlojaFamColetivos01();
        naoDuplicar = 60;
    }
    if (layer == AlojaFamColetivos91 && naoDuplicar != 61){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares coletivos, em 1991, por concelho.' + '</strong>');
        legenda(maxAlojFamiColetivos91, Math.round((maxAlojFamiColetivos91-minAlojFamiColetivos91)/2),minAlojFamiColetivos91,2);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slideAlojaFamColetivos91();
        naoDuplicar = 61;
    }
    if (layer == totalAlojaFreguesia21 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Total de alojamentos, em 2021, por freguesia.' + '</strong>');
        legenda(maxTotalAloja21Freg, Math.round((maxTotalAloja21Freg-minTotalAloja21Freg)/2),minTotalAloja21Freg,0.1);
        contornoFreg.addTo(map);
        slidetotalAlojaFreguesia21();
        baseAtiva = contornoFreg;
        naoDuplicar = 3;
    }
    if (layer == totalAlojaFreguesia11 && naoDuplicar != 10){
        $('#tituloMapa').html('<strong>' + 'Total de alojamentos, em 2011, por freguesia.' + '</strong>');
        legenda(maxTotalAloja11Freg, Math.round((maxTotalAloja11Freg-minTotalAloja11Freg)/2),minTotalAloja11Freg,0.1);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slidetotalAlojaFreguesia11();
        naoDuplicar = 10;
    }
    if (layer == totalAlojaFreguesia01 && naoDuplicar != 76){
        $('#tituloMapa').html('<strong>' + 'Total de alojamentos, em 2001, por freguesia.' + '</strong>');
        legenda(maxTotalAloja01Freg, Math.round((maxTotalAloja01Freg-minTotalAloja01Freg)/2),minTotalAloja01Freg,0.1);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slidetotalAlojaFreguesia01();
        naoDuplicar = 76;
    }
    if (layer == totalAlojaFreguesia91 && naoDuplicar != 77){
        $('#tituloMapa').html('<strong>' + 'Total de alojamentos, em 1991, por freguesia.' + '</strong>');
        legenda(maxTotalAloja91Freg, Math.round((maxTotalAloja91Freg-minTotalAloja91Freg)/2),minTotalAloja91Freg,0.1);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slidetotalAlojaFreguesia91();
        naoDuplicar = 77;
    }
    if (layer == totalAlojaFreguesia91 && naoDuplicar == 77){
        contornoFreg2001.addTo(map);
    }
    if (layer == AlojaFami21Freg && naoDuplicar != 11){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares, em 2021, por freguesia.' + '</strong>');
        legenda(maxAlojaFami21Freg, Math.round((maxAlojaFami21Freg-minAlojaFami21Freg)/2),minAlojaFami21Freg,0.1);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideAlojaFami21Freg();
        naoDuplicar = 11;
    }
    if (layer == AlojaFami11Freg && naoDuplicar != 12){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares, em 2011, por freguesia.' + '</strong>');
        legenda(maxAlojaFami11Freg, Math.round((maxAlojaFami11Freg-minAlojaFami11Freg)/2),minAlojaFami11Freg,0.1);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideAlojaFami11Freg();
        naoDuplicar = 12;
    }
    if (layer == AlojaFami01Freg && naoDuplicar != 78){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares, em 2001, por freguesia.' + '</strong>');
        legenda(maxAlojaFami01Freg, Math.round((maxAlojaFami01Freg-minAlojaFami01Freg)/2),minAlojaFami01Freg,0.1);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideAlojaFami01Freg();
        naoDuplicar = 78;
    }
    if (layer == AlojaFami91Freg && naoDuplicar != 79){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares, em 1991, por freguesia.' + '</strong>');
        legenda(maxAlojaFami91Freg, Math.round((maxAlojaFami91Freg-minAlojaFami91Freg)/2),minAlojaFami91Freg,0.1);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideAlojaFami91Freg();
        naoDuplicar = 79;
        console.log(baseAtiva)
    }
    if (layer == AlojaFamiClass21Freg && naoDuplicar != 13){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos, em 2021, por freguesia.' + '</strong>');
        legenda(maxAlojaFamiClass21Freg, Math.round((maxAlojaFamiClass21Freg-minAlojaFamiClass21Freg)/2),minAlojaFamiClass21Freg,0.1);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideAlojaFamiClass21Freg();
        naoDuplicar = 13;
    }
    if (layer == AlojaFamiClass11Freg && naoDuplicar != 14){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos, em 2011, por freguesia.' + '</strong>');
        legenda(maxAlojaFamiClass11Freg, Math.round((maxAlojaFamiClass11Freg-minAlojaFamiClass11Freg)/2),minAlojaFamiClass11Freg,0.1);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideAlojaFamiClass11Freg();
        naoDuplicar = 14;
    }
    if (layer == AlojaFamiClass01Freg && naoDuplicar != 80){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos, em 2001, por freguesia.' + '</strong>');
        legenda(maxAlojaFamiClass01Freg, Math.round((maxAlojaFamiClass01Freg-minAlojaFamiClass01Freg)/2),minAlojaFamiClass01Freg,0.1);
        contornoFreg2001.addTo(map);
        slideAlojaFamiClass01Freg();
        baseAtiva = contornoFreg2001;
        naoDuplicar = 80;
    }
    if (layer == AlojaFamiClass91Freg && naoDuplicar != 81){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos, em 1991, por freguesia.' + '</strong>');
        legenda(maxAlojaFamiClass91Freg, Math.round((maxAlojaFamiClass91Freg-minAlojaFamiClass91Freg)/2),minAlojaFamiClass91Freg,0.1);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideAlojaFamiClass91Freg();
        naoDuplicar = 81;
    }
    if (layer == AlojaFamiNaoClass21Freg && naoDuplicar != 15){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares não clássicos, em 2021, por freguesia.' + '</strong>');
        legendaExcecao(maxAlojaFamiNaoClass21Freg, Math.round((maxAlojaFamiNaoClass21Freg-minAlojaFamiNaoClass21Freg)/2),minAlojaFamiNaoClass21Freg,1);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideAlojaFamiNaoClass21Freg();
        naoDuplicar = 15;
    }
    if (layer == AlojaFamiNaoClass11Freg && naoDuplicar != 16){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares não clássicos, em 2011, por freguesia.' + '</strong>');
        legendaExcecao(maxAlojaFamiNaoClass11Freg, Math.round((maxAlojaFamiNaoClass11Freg-minAlojaFamiNaoClass11Freg)/2),minAlojaFamiNaoClass11Freg,1);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideAlojaFamiNaoClass11Freg();
        naoDuplicar = 16;
    }
    if (layer == AlojaFamiNaoClass01Freg && naoDuplicar != 82){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares não clássicos, em 2001, por freguesia.' + '</strong>');
        legendaExcecao(maxAlojaFamiNaoClass01Freg, Math.round((maxAlojaFamiNaoClass01Freg-minAlojaFamiNaoClass01Freg)/2),minAlojaFamiNaoClass01Freg,1);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideAlojaFamiNaoClass01Freg();
        naoDuplicar = 82;
    }
    if (layer == AlojaFamiNaoClass91Freg && naoDuplicar != 83){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares não clássicos, em 1991, por freguesia.' + '</strong>');
        legendaExcecao(maxAlojaFamiNaoClass91Freg, Math.round((maxAlojaFamiNaoClass91Freg-minAlojaFamiNaoClass91Freg)/2),minAlojaFamiNaoClass91Freg,1);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideAlojaFamiNaoClass91Freg();
        naoDuplicar = 83;
    }
    if (layer == AlojColetivo21Freg && naoDuplicar != 19){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos coletivos, em 2021, por freguesia.' + '</strong>');
        legendaExcecao(maxAlojColetivo21Freg, Math.round((maxAlojColetivo21Freg-minAlojColetivo21Freg)/2),minAlojColetivo21Freg,1);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideAlojColetivo21Freg();
        naoDuplicar = 19;
    }
    if (layer == AlojColetivo11Freg && naoDuplicar != 20){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos coletivos, em 2011, por freguesia.' + '</strong>');
        legendaExcecao(maxAlojColetivo11Freg, Math.round((maxAlojColetivo11Freg-minAlojColetivo11Freg)/2),minAlojColetivo11Freg,1);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideAlojColetivo11Freg();
        naoDuplicar = 20;
    }
    if (layer == AlojColetivo01Freg && naoDuplicar != 84){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos coletivos, em 2001, por freguesia.' + '</strong>');
        legendaExcecao(maxAlojColetivo01Freg, Math.round((maxAlojColetivo01Freg-minAlojColetivo01Freg)/2),minAlojColetivo01Freg,1);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideAlojColetivo01Freg();
        naoDuplicar = 84;
    }
    if (layer == AlojColetivo91Freg && naoDuplicar != 85){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos coletivos, em 1991, por freguesia.' + '</strong>');
        legendaExcecao(maxAlojColetivo91Freg, Math.round((maxAlojColetivo91Freg-0)/2),1,1);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideAlojColetivo91Freg();
        naoDuplicar = 85;
    }
    if (layer == AlojVarConcelho21_11 && naoDuplicar != 21){
        legendaVarTotAlojConc21_11();
        slideAlojVarConcelho21_11();
        naoDuplicar = 21;
    }
    if (layer == AlojFamiVarConcelho21_11 && naoDuplicar != 22){
        legendaVarTotAlojFamiConc21_11();
        slideAlojFamiVarConcelho21_11();
        naoDuplicar = 22;
    }
    if (layer == AlojFamiClassVarConcelho21_11 && naoDuplicar != 23){
        legendaVarTotAlojFamClassConc21_11();
        slideAlojFamiClassVarConcelho21_11();
        naoDuplicar = 23;
    }
    if (layer == AlojFamiNaoClassVarConcelho21_11 && naoDuplicar != 24){
        legendaVarTotAlojFamNaoClassConc21_11();
        slideAlojFamiNaoClassVarConcelho21_11();
        naoDuplicar = 24;
    }
    if (layer == AlojColetivosVarConcelho21_11 && naoDuplicar != 25){
        legendaVarTotAlojColetivosConc21_11();
        slideAlojColetivosVarConcelho21_11();
        naoDuplicar = 25;
    }
    if (layer == AlojVarConcelho11_01 && naoDuplicar != 47){
        legendaVarTotAlojConc11_01();
        slideAlojVarConcelho11_01();
        naoDuplicar = 47;
    }
    if (layer == AlojVarConcelho01_91 && naoDuplicar != 62){
        legendaVarTotAlojConc01_91();
        slideAlojVarConcelho01_91();
        naoDuplicar = 62;
    }
    if (layer == AlojFamiVarConcelho11_01 && naoDuplicar != 48){
        legendaVarTotAlojFamiConc11_01();
        slideAlojFamiVarConcelho11_01();
        naoDuplicar = 48;
    }
    if (layer == AlojFamiVarConcelho01_91 && naoDuplicar != 63){
        legendaVarTotAlojFamiConc01_91();
        slideAlojFamiVarConcelho01_91();
        naoDuplicar = 63;
    }
    
    if (layer == AlojFamiClassVarConcelho11_01 && naoDuplicar != 49){
        legendaVarTotAlojFamClassConc11_01();
        slideAlojFamiClassVarConcelho11_01();
        naoDuplicar = 49;
    }
    if (layer == AlojFamiClassVarConcelho01_91 && naoDuplicar != 64){
        legendaVarTotAlojFamClassConc01_91();
        slideAlojFamiClassVarConcelho01_91();
        naoDuplicar = 64;
    }
    if (layer == AlojFamiNaoClassVarConcelho11_01 && naoDuplicar != 50){
        legendaVarTotAlojFamNaoClassConc11_01();
        slideAlojFamiNaoClassVarConcelho11_01();
        naoDuplicar = 50;
    }
    if (layer == AlojFamiNaoClassVarConcelho01_91 && naoDuplicar != 65){
        legendaVarTotAlojFamNaoClassConc01_91();
        slideAlojFamiNaoClassVarConcelho01_91();
        naoDuplicar = 65;
    }
    if (layer == AlojColetivosVarConcelho11_01 && naoDuplicar != 51){
        legendaVarTotAlojColetivosConc11_01();
        slideAlojColetivosVarConcelho11_01();
        naoDuplicar = 51;
    }
    if (layer == AlojColetivosVarConcelho01_91 && naoDuplicar != 66){
        legendaVarTotAlojColetivosConc01_91();
        slideAlojColetivosVarConcelho01_91();
        naoDuplicar = 66;
    }
    if (layer == VarTotalAlojFreg21_11 && naoDuplicar != 26){
        legendaVarTotAlojFreg21_11();       
        slideVarTotalAlojFreg21_11();
        naoDuplicar = 26;
    }
    if (layer == VarTotalAlojFreg11_01 && naoDuplicar != 86){
        legendaVarTotAlojFreg11_01();       
        slideVarTotalAlojFreg11_01();
        naoDuplicar = 86;
    }
    if (layer == VarTotalAlojFreg01_91 && naoDuplicar != 87){
        legendaVarTotAlojFreg01_91();       
        slideVarTotalAlojFreg01_91();
        naoDuplicar = 87;
    }
    if (layer == VarTotalAlojFamiFreg21_11 && naoDuplicar != 27){
        legendaVarTotAlojFamFreg21_11();       
        slideVarTotalAlojFamiFreg21_11();
        naoDuplicar = 27;
    }
    if (layer == VarTotalAlojFamiFreg11_01 && naoDuplicar != 88){
        legendaVarTotAlojFamFreg11_01();       
        slideVarTotalAlojFamiFreg11_01();
        naoDuplicar = 88;
    }
    if (layer == VarTotalAlojFamiFreg01_91 && naoDuplicar != 89){
        legendaVarTotAlojFamFreg01_91();       
        slideVarTotalAlojFamiFreg01_91();
        naoDuplicar = 89;
    }
    if (layer == VarTotalAlojFamiClassFreg21_11 && naoDuplicar != 28){
        legendaVarTotAlojFamClassFreg21_11();       
        slideVarTotalAlojFamiClassFreg21_11();
        naoDuplicar = 28;
    }
    if (layer == VarTotalAlojFamiClassFreg11_01 && naoDuplicar != 90){
        legendaVarTotAlojFamClassFreg11_01();       
        slideVarTotalAlojFamiClassFreg11_01();
        naoDuplicar = 90;
    }
    if (layer == VarTotalAlojFamiClassFreg01_91 && naoDuplicar != 91){
        legendaVarTotAlojFamClassFreg01_91();       
        slideVarTotalAlojFamiClassFreg01_91();
        naoDuplicar = 91;
    }
    if (layer == VarTotAlojFamNaoClassFreg21_11 && naoDuplicar != 29){
        legendaVarTotAlojFamNaoClassFreg21_11();       
        slideVarTotAlojFamNaoClassFreg21_11();
        naoDuplicar = 29;
    }
    if (layer == VarTotAlojFamNaoClassFreg11_01 && naoDuplicar != 92){
        legendaVarTotAlojFamNaoClassFreg11_01();       
        slideVarTotAlojFamNaoClassFreg11_01();
        naoDuplicar = 92;
    }
    if (layer == VarTotAlojFamNaoClassFreg01_91 && naoDuplicar != 93){
        legendaVarTotAlojFamNaoClassFreg01_91();       
        slideVarTotAlojFamNaoClassFreg01_91();
        naoDuplicar = 93;
    }
    if (layer == VarAlojColetivosFreg21_11 && naoDuplicar != 30){
        legendaVarTotAlojColetivosFreg21_11();       
        slideVarAlojColetivosFreg21_11();
        naoDuplicar = 30;
    }
    if (layer == VarAlojColetivosFreg11_01 && naoDuplicar != 94){
        legendaVarTotAlojColetivosFreg11_01();       
        slideVarAlojColetivosFreg11_01();
        naoDuplicar = 94;
    }
    if (layer == VarAlojColetivosFreg01_91 && naoDuplicar != 75){
        legendaVarTotAlojColetivosFreg01_91();
        slideVarAlojColetivosFreg01_91();
        naoDuplicar = 75;
    }
    if (layer == TotAlojFamPercCon21 && naoDuplicar != 33){
        legendaPerAlojaFamiliaresConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares, em 2021, por concelho.' + '</strong>');
        slideTotAlojFamPercCon21();
        naoDuplicar = 33;
    }
    if (layer == TotAlojFamPercCon11 && naoDuplicar != 34){
        legendaPerAlojaFamiliaresConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares, em 2011, por concelho.' + '</strong>');
        slideTotAlojFamPercCon11();
        naoDuplicar = 34;
    }
    if (layer == TotAlojFamPercCon01 && naoDuplicar != 67){
        legendaPerAlojaFamiliaresConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares, em 2001, por concelho.' + '</strong>');
        slideTotAlojFamPercCon01();
        naoDuplicar = 67;
    }
    if (layer == TotAlojFamPercCon91 && naoDuplicar != 71){
        legendaPerAlojaFamiliaresConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares, em 1991, por concelho.' + '</strong>');
        slideTotAlojFamPercCon91();
        naoDuplicar = 71;
    }
    if (layer == AlojFamClassPercCon21 && naoDuplicar != 35){
        legendaPerAlojaFamClassConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos, em 2021, por concelho.' + '</strong>');
        slideAlojFamClassPercCon21();
        naoDuplicar = 35;
    }
    if (layer == AlojFamClassPercCon11 && naoDuplicar != 36){
        legendaPerAlojaFamClassConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos, em 2011, por concelho.' + '</strong>');
        slideAlojFamClassPercCon11();
        naoDuplicar = 36;
    } 
    if (layer == AlojFamClassPercCon01 && naoDuplicar != 68){
        legendaPerAlojaFamClassConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos, em 2001, por concelho.' + '</strong>');
        slideAlojFamClassPercCon01();
        naoDuplicar = 68;
    } 
    if (layer == AlojFamClassPercCon91 && naoDuplicar != 72){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos, em 1991, por concelho.' + '</strong>');
        legendaPerAlojaFamClassConc();
        slideAlojFamClassPercCon91();
        naoDuplicar = 72;
    } 
    if (layer == AlojFamNaoClasPercCon21 && naoDuplicar != 37){
        legendaPerAlojaFamNaoClassConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares não clássicos, em 2021, por concelho.' + '</strong>');
        slideAlojFamNaoClassPercCon21();
        naoDuplicar = 37;
    }
    if (layer == AlojFamNaoClasPercCon11 && naoDuplicar != 38){
        legendaPerAlojaFamNaoClassConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares não clássicos, em 2011, por concelho.' + '</strong>');
        slideAlojFamNaoClasPercCon11();
        naoDuplicar = 38;
    } 
    if (layer == AlojFamNaoClasPercCon01 && naoDuplicar != 69){
        legendaPerAlojaFamNaoClassConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares não clássicos, em 2001, por concelho.' + '</strong>');
        slideAlojFamNaoClasPercCon01();
        naoDuplicar = 69;
    } 
    if (layer == AlojFamNaoClasPercCon91 && naoDuplicar != 73){
        legendaPerAlojaFamNaoClassConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares não clássicos, em 1991, por concelho.' + '</strong>');
        slideAlojFamNaoClasPercCon91();
        naoDuplicar = 73;
    } 
    if (layer == AlojColePercCon21 && naoDuplicar != 39){
        legendaPerAlojaFamColetivosConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos coletivos, em 2021, por concelho.' + '</strong>');
        slideAlojColePercCon21();
        naoDuplicar = 39;
    }
    if (layer == AlojColePercCon11 && naoDuplicar != 40){
        legendaPerAlojaFamColetivosConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos coletivos, em 2011, por concelho.' + '</strong>');
        slideAlojColePercCon11();
        naoDuplicar = 40;
    }   
    if (layer == AlojColePercCon01 && naoDuplicar != 70){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos coletivos, em 2001, por concelho.' + '</strong>');
        legendaPerAlojaFamColetivosConc();
        slideAlojColePercCon01();
        naoDuplicar = 70;
    }
    if (layer == AlojColePercCon91 && naoDuplicar != 74){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos coletivos, em 1991, por concelho.' + '</strong>');
        legendaPerAlojaFamColetivosConc();
        slideAlojColePercCon91();
        naoDuplicar = 74;
    }  
    if (layer == PercAlojFam21Freg && naoDuplicar != 31){
        legendaPerAlojaFamiliaresFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares, em 2021, por freguesia.' + '</strong>');
        slidePercAlojFam21Freg();
        naoDuplicar = 31;
    }
    if (layer == PercAlojFam11Freg && naoDuplicar != 32){
        legendaPerAlojaFamiliaresFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares, em 2011, por freguesia.' + '</strong>');
        slidePercAlojFam11Freg();
        naoDuplicar = 32;
    }   
    if (layer == PercAlojFam01Freg && naoDuplicar != 95){
        legendaPerAlojaFamiliaresFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares, em 2001, por freguesia.' + '</strong>');
        slidePercAlojFam01Freg();
        naoDuplicar = 95;
    } 
    if (layer == PercAlojFam91Freg && naoDuplicar != 96){
        legendaPerAlojaFamiliaresFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares, em 1991, por freguesia.' + '</strong>');
        slidePercAlojFam91Freg();
        naoDuplicar = 96;
    } 
    if (layer == PercAlojClass21Freg && naoDuplicar != 41){
        legendaPerAlojaFamiliaresClassFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos, em 2021, por freguesia.' + '</strong>');
        slidePercAlojClass21Freg();
        naoDuplicar = 41;
    }   
    if (layer == PercAlojClass11Freg && naoDuplicar != 42){
        legendaPerAlojaFamiliaresClassFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos, em 2011, por freguesia.' + '</strong>');
        slidePercAlojClass11Freg();
        naoDuplicar = 42;
    } 
    if (layer == PercAlojClass01Freg && naoDuplicar != 97){
        legendaPerAlojaFamiliaresClassFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos, em 2001, por freguesia.' + '</strong>');
        slidePercAlojClass01Freg();
        naoDuplicar = 97;
    } 
    if (layer == PercAlojClass91Freg && naoDuplicar != 98){
        legendaPerAlojaFamiliaresClassFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos, em 1991, por freguesia.' + '</strong>');
        slidePercAlojClass91Freg();
        naoDuplicar = 98;
    } 
    if (layer == PercAlojNClass21Freg && naoDuplicar != 43){
        legendaPerAlojaFamiliaresNaoClassFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares não clássicos, em 2021, por freguesia.' + '</strong>');
        slidePercAlojNClass21Freg();
        naoDuplicar = 43;
    }    
    if (layer == PercAlojNClass11Freg && naoDuplicar != 44){
        legendaPerAlojaFamiliaresNaoClassFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares não clássicos, em 2011, por freguesia.' + '</strong>');
        slidePercAlojNClass11Freg();
        naoDuplicar = 44;
    }
    if (layer == PercAlojNClass01Freg && naoDuplicar != 99){
        legendaPerAlojaFamiliaresNaoClassFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares não clássicos, em 2001, por freguesia.' + '</strong>');
        slidePercAlojNClass01Freg();
        naoDuplicar = 99;
    }
    if (layer == PercAlojNClass91Freg && naoDuplicar != 100){
        legendaPerAlojaFamiliaresNaoClassFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares não clássicos, em 1991, por freguesia.' + '</strong>');
        slidePercAlojNClass91Freg();
        naoDuplicar = 100;
    }
    if (layer == PercAlojColet21Freg && naoDuplicar != 45){
        legendaPerAlojaFamiliaresColetivosFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos coletivos, em 2021, por freguesia.' + '</strong>');
        slidePercAlojColet21Freg();
        naoDuplicar = 45;
    }    
    if (layer == PercAlojColet11Freg && naoDuplicar != 46){
        legendaPerAlojaFamiliaresColetivosFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos coletivos, em 2011, por freguesia.' + '</strong>');
        slidePercAlojColet11Freg();
        naoDuplicar = 46;
    }   
    if (layer == PercAlojColet01Freg && naoDuplicar != 101){
        legendaPerAlojaFamiliaresColetivosFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos coletivos, em 2001, por freguesia.' + '</strong>');
        slidePercAlojColet01Freg();
        naoDuplicar = 101;
    }     
    if (layer == PercAlojColet91Freg && naoDuplicar != 102){
        legendaPerAlojaFamiliaresColetivosFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos coletivos, em 1991, por freguesia.' + '</strong>');
        slidePercAlojColet91Freg();
        naoDuplicar = 102;
    }       
        
    layer.addTo(map);
    layerAtiva = layer;  
}

let notaRodape = function(){
    if ($('#notaRodape').length){
        $('#notaRodape').html("Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os círculos à escala concelhia.")
    }
    else{
        $('#painel').append("<div id='notaRodape'></div>")
        $('#notaRodape').html("Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os círculos à escala concelhia.")
    }
    $('#notaRodape').css("visibility","visible")
}
let primeirovalor = function(valor,ano){
    $("#mySelect").val(ano);
    $("#opcaoSelect").val(valor)
    
}
function myFunction() {
    var tipoAlojamento = document.getElementById("opcaoSelect").value;
    var anoSelecionado = document.getElementById("mySelect").value;
    if ($('#concelho').hasClass('active2')){
        if($('#absoluto').hasClass('active4')){
            $('#notaRodape').remove();
            if (anoSelecionado == "2021" && tipoAlojamento =="Total"){
                novaLayer(totalAlojamentos21);
            };
            if (anoSelecionado == "2011" && tipoAlojamento =="Total"){
                novaLayer(totalAlojamentos11Concelhos);
            };
            if (anoSelecionado == "2001" && tipoAlojamento =="Total"){
                novaLayer(totalAlojamentos01Concelhos);
            };
            if (anoSelecionado == "1991" && tipoAlojamento =="Total"){
                novaLayer(totalAlojamentos91Concelhos);
            };
            if (anoSelecionado == "2021" && tipoAlojamento =="AF"){
                novaLayer(AlojamentosFamiliares2021);
            };
            if (anoSelecionado == "2011" && tipoAlojamento =="AF"){
                novaLayer(AlojamentosFamiliares2011)
            };
            if (anoSelecionado == "2001" && tipoAlojamento =="AF"){
                novaLayer(AlojamentosFamiliares01);
            };
            if (anoSelecionado == "1991" && tipoAlojamento =="AF"){
                novaLayer(AlojamentosFamiliares91);
            };
            if (anoSelecionado == "2021" && tipoAlojamento =="AFC"){
                novaLayer(alojaFamClass2021)
            };
            if (anoSelecionado == "2011" && tipoAlojamento =="AFC"){
                novaLayer(alojaFamClass2011)
            };
            if (anoSelecionado == "2001" && tipoAlojamento =="AFC"){
                novaLayer(alojaFamClass2001)
            };
            if (anoSelecionado == "1991" && tipoAlojamento =="AFC"){
                novaLayer(alojaFamClass91)
            };
            if (anoSelecionado == "2021" && tipoAlojamento =="AFNC"){
                novaLayer(alojaFamNaoClass2021)
            };
            if (anoSelecionado == "2011" && tipoAlojamento == "AFNC"){
                novaLayer(alojaFamNaoClass2011)
            };
            if (anoSelecionado == "2001" && tipoAlojamento == "AFNC"){
                novaLayer(alojaFamNaoClass01)
            };
            if (anoSelecionado == "1991" && tipoAlojamento == "AFNC"){
                novaLayer(alojaFamNaoClass91)
            };
            if (anoSelecionado == "2021" && tipoAlojamento =="AC"){
                novaLayer(AlojaFamColetivos21)
            };
            if (anoSelecionado == "2011" && tipoAlojamento == "AC"){
                novaLayer(AlojaFamColetivos11)
            };
            if (anoSelecionado == "2001" && tipoAlojamento == "AC"){
                novaLayer(AlojaFamColetivos01)
            };
            if (anoSelecionado == "1991" && tipoAlojamento == "AC"){
                novaLayer(AlojaFamColetivos91)
            };
        }
        if($('#taxaVariacao').hasClass('active4')){
            if (anoSelecionado == "2011" && tipoAlojamento =="Total"){
                novaLayer(AlojVarConcelho21_11);
            };
            if (anoSelecionado == "2011" && tipoAlojamento =="AF"){
                novaLayer(AlojFamiVarConcelho21_11);
            };
            if (anoSelecionado == "2011" && tipoAlojamento =="AFC"){
                novaLayer(AlojFamiClassVarConcelho21_11);
            };
            if (anoSelecionado == "2011" && tipoAlojamento =="AFNC"){
                novaLayer(AlojFamiNaoClassVarConcelho21_11);
            };  
            if (anoSelecionado == "2011" && tipoAlojamento =="AC"){
                novaLayer(AlojColetivosVarConcelho21_11);
            };  
            if (anoSelecionado == "2001" && tipoAlojamento =="Total"){
                novaLayer(AlojVarConcelho11_01);
            };
            if (anoSelecionado == "1991" && tipoAlojamento =="Total"){
                novaLayer(AlojVarConcelho01_91);
            };
            if (anoSelecionado == "2001" && tipoAlojamento =="AF"){
                novaLayer(AlojFamiVarConcelho11_01);
            };
            if (anoSelecionado == "1991" && tipoAlojamento =="AF"){
                novaLayer(AlojFamiVarConcelho01_91);
            };
            if (anoSelecionado == "2001" && tipoAlojamento =="AFC"){
                novaLayer(AlojFamiClassVarConcelho11_01);
            };
            if (anoSelecionado == "1991" && tipoAlojamento =="AFC"){
                novaLayer(AlojFamiClassVarConcelho01_91);
            };
            if (anoSelecionado == "2001" && tipoAlojamento =="AFNC"){
                novaLayer(AlojFamiNaoClassVarConcelho11_01);
            };  
            if (anoSelecionado == "1991" && tipoAlojamento =="AFNC"){
                novaLayer(AlojFamiNaoClassVarConcelho01_91);
            };  
            if (anoSelecionado == "2001" && tipoAlojamento =="AC"){
                novaLayer(AlojColetivosVarConcelho11_01);
            };     
            if (anoSelecionado == "1991" && tipoAlojamento =="AC"){
                novaLayer(AlojColetivosVarConcelho01_91);
            };     
        }
        if($('#percentagem').hasClass('active4')){
            if (anoSelecionado == "2021" && tipoAlojamento == "AF"){
                novaLayer(TotAlojFamPercCon21);
            }
            if (anoSelecionado == "2011" && tipoAlojamento == "AF"){
                novaLayer(TotAlojFamPercCon11);
            }
            if (anoSelecionado == "2001" && tipoAlojamento == "AF"){
                novaLayer(TotAlojFamPercCon01);
            }
            if (anoSelecionado == "1991" && tipoAlojamento == "AF"){
                novaLayer(TotAlojFamPercCon91);
            }
            if (anoSelecionado == "2021" && tipoAlojamento == "AFC"){
                novaLayer(AlojFamClassPercCon21);
            }
            if (anoSelecionado == "2011" && tipoAlojamento == "AFC"){
                novaLayer(AlojFamClassPercCon11);
            }
            if (anoSelecionado == "2001" && tipoAlojamento == "AFC"){
                novaLayer(AlojFamClassPercCon01);
            }
            if (anoSelecionado == "1991" && tipoAlojamento == "AFC"){
                novaLayer(AlojFamClassPercCon91);
            }
            if (anoSelecionado == "2021" && tipoAlojamento == "AFNC"){
                novaLayer(AlojFamNaoClasPercCon21);
            }
            if (anoSelecionado == "2011" && tipoAlojamento == "AFNC"){
                novaLayer(AlojFamNaoClasPercCon11);
            }
            if (anoSelecionado == "2001" && tipoAlojamento == "AFNC"){
                novaLayer(AlojFamNaoClasPercCon01);
            }
            if (anoSelecionado == "1991" && tipoAlojamento == "AFNC"){
                novaLayer(AlojFamNaoClasPercCon91);
            }
            if (anoSelecionado == "2021" && tipoAlojamento == "AC"){
                novaLayer(AlojColePercCon21);
            }
            if (anoSelecionado == "2011" && tipoAlojamento == "AC"){
                novaLayer(AlojColePercCon11);
            }
            if (anoSelecionado == "2001" && tipoAlojamento == "AC"){
                novaLayer(AlojColePercCon01);
            }
            if (anoSelecionado == "1991" && tipoAlojamento == "AC"){
                novaLayer(AlojColePercCon91);
            }
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if($('#absoluto').hasClass('active5')){
            notaRodape();
            if (anoSelecionado == "2021" && tipoAlojamento == "Total"){
                novaLayer(totalAlojaFreguesia21);
            };
            if (anoSelecionado == "2011" && tipoAlojamento == "Total"){
                novaLayer(totalAlojaFreguesia11);
            };
            if (anoSelecionado == "2001" && tipoAlojamento == "Total"){
                novaLayer(totalAlojaFreguesia01);
            };
            if (anoSelecionado == "1991" && tipoAlojamento == "Total"){
                novaLayer(totalAlojaFreguesia91);
            };
            if (anoSelecionado == "2021" && tipoAlojamento == "AF"){
                novaLayer(AlojaFami21Freg);
            };
            if (anoSelecionado == "2011" && tipoAlojamento == "AF"){
                novaLayer(AlojaFami11Freg);
            };
            if (anoSelecionado == "2001" && tipoAlojamento == "AF"){
                novaLayer(AlojaFami01Freg);
            };
            if (anoSelecionado == "1991" && tipoAlojamento == "AF"){
                novaLayer(AlojaFami91Freg);
            };
            if (anoSelecionado == "2021" && tipoAlojamento == "AFC"){
                novaLayer(AlojaFamiClass21Freg);
            };
            if (anoSelecionado == "2011" && tipoAlojamento == "AFC"){
                novaLayer(AlojaFamiClass11Freg);
            };
            if (anoSelecionado == "2001" && tipoAlojamento == "AFC"){
                novaLayer(AlojaFamiClass01Freg);
            };
            if (anoSelecionado == "1991" && tipoAlojamento == "AFC"){
                novaLayer(AlojaFamiClass91Freg);
            };
            if(tipoAlojamento == "AFNC"){
                notaRodapeNaoClass('Alojamentos Coletivos');
                if (anoSelecionado == "2021"){
                    novaLayer(AlojaFamiNaoClass21Freg);
                };
                if (anoSelecionado == "2011"){
                    novaLayer(AlojaFamiNaoClass11Freg);
                }; 
                if (anoSelecionado == "2001"){
                    novaLayer(AlojaFamiNaoClass01Freg);
                }; 
                if (anoSelecionado == "1991"){
                    novaLayer(AlojaFamiNaoClass91Freg);
                };
            }
            if(tipoAlojamento == "AC"){
                notaRodapeNaoClass('Alojamentos Familiares Não Clássicos');
                if (anoSelecionado == "2021"){
                    novaLayer(AlojColetivo21Freg);
                };
                if (anoSelecionado == "2011"){
                    novaLayer(AlojColetivo11Freg);
                };       
                if (anoSelecionado == "2001"){
                    novaLayer(AlojColetivo01Freg);
                };  
                if (anoSelecionado == "1991" ){
                    novaLayer(AlojColetivo91Freg);
                };    
            }
            
        }
        if($('#taxaVariacao').hasClass('active5')){
            $('#notaRodape').remove();
            if (anoSelecionado == "2011" && tipoAlojamento =="Total"){
                novaLayer(VarTotalAlojFreg21_11);
            };
            if (anoSelecionado == "2001" && tipoAlojamento =="Total"){
                novaLayer(VarTotalAlojFreg11_01);
            };
            if (anoSelecionado == "1991" && tipoAlojamento =="Total"){
                novaLayer(VarTotalAlojFreg01_91);
            };
            if (anoSelecionado == "2011" && tipoAlojamento =="AF"){
                novaLayer(VarTotalAlojFamiFreg21_11);
            };
            if (anoSelecionado == "2001" && tipoAlojamento =="AF"){
                novaLayer(VarTotalAlojFamiFreg11_01);
            };
            if (anoSelecionado == "1991" && tipoAlojamento =="AF"){
                novaLayer(VarTotalAlojFamiFreg01_91);
            };
            if (anoSelecionado == "2011" && tipoAlojamento =="AFC"){
                novaLayer(VarTotalAlojFamiClassFreg21_11);
            };
            if (anoSelecionado == "2001" && tipoAlojamento =="AFC"){
                novaLayer(VarTotalAlojFamiClassFreg11_01);
            };
            if (anoSelecionado == "1991" && tipoAlojamento =="AFC"){
                novaLayer(VarTotalAlojFamiClassFreg01_91);
            };
            if (anoSelecionado == "2011" && tipoAlojamento =="AFNC"){
                novaLayer(VarTotAlojFamNaoClassFreg21_11);
            };  
            if (anoSelecionado == "2001" && tipoAlojamento =="AFNC"){
                novaLayer(VarTotAlojFamNaoClassFreg11_01);
            };  
            if (anoSelecionado == "1991" && tipoAlojamento =="AFNC"){
                novaLayer(VarTotAlojFamNaoClassFreg01_91);
            };  
            if (anoSelecionado == "2011" && tipoAlojamento =="AC"){
                novaLayer(VarAlojColetivosFreg21_11);
            };  
            if (anoSelecionado == "2001" && tipoAlojamento =="AC"){
                novaLayer(VarAlojColetivosFreg11_01);
            };  
            if (anoSelecionado == "1991" && tipoAlojamento =="AC"){
                novaLayer(VarAlojColetivosFreg01_91);
            };
        }
        if($('#percentagem').hasClass('active5')){
            $('#notaRodape').remove();
            if (anoSelecionado == "2021" && tipoAlojamento =="AF"){
                novaLayer(PercAlojFam21Freg);
            };
            if (anoSelecionado == "2011" && tipoAlojamento =="AF"){
                novaLayer(PercAlojFam11Freg);
            };
            if (anoSelecionado == "2001" && tipoAlojamento =="AF"){
                novaLayer(PercAlojFam01Freg);
            };
            if (anoSelecionado == "1991" && tipoAlojamento =="AF"){
                novaLayer(PercAlojFam91Freg);
            };
            if (anoSelecionado == "2021" && tipoAlojamento =="AFC"){
                novaLayer(PercAlojClass21Freg);
            };
            if (anoSelecionado == "2011" && tipoAlojamento =="AFC"){
                novaLayer(PercAlojClass11Freg);
            };
            if (anoSelecionado == "2001" && tipoAlojamento =="AFC"){
                novaLayer(PercAlojClass01Freg);
            };
            if (anoSelecionado == "1991" && tipoAlojamento =="AFC"){
                novaLayer(PercAlojClass91Freg);
            };
            if (anoSelecionado == "2021" && tipoAlojamento =="AFNC"){
                novaLayer(PercAlojNClass21Freg);
            }; 
            if (anoSelecionado == "2011" && tipoAlojamento =="AFNC"){
                novaLayer(PercAlojNClass11Freg);
            };   
            if (anoSelecionado == "2001" && tipoAlojamento =="AFNC"){
                novaLayer(PercAlojNClass01Freg);
            };  
            if (anoSelecionado == "1991" && tipoAlojamento =="AFNC"){
                novaLayer(PercAlojNClass91Freg);
            };  
            if (anoSelecionado == "2021" && tipoAlojamento =="AC"){
                novaLayer(PercAlojColet21Freg);
            }; 
            if (anoSelecionado == "2011" && tipoAlojamento =="AC"){
                novaLayer(PercAlojColet11Freg);
            };   
            if (anoSelecionado == "2001" && tipoAlojamento =="AC"){
                novaLayer(PercAlojColet91Freg);
            };   
            if (anoSelecionado == "1991" && tipoAlojamento =="AC"){
                novaLayer(PercAlojColet91Freg);
            };   
            
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
let removerTotal = function(){
    if($('#absoluto').hasClass('active5') || $('#absoluto').hasClass('active4') || $('#taxaVariacao').hasClass('active5') || $('#taxaVariacao').hasClass('active4')){
        if ($("#opcaoSelect option[value='Total']").length == 0){
            $("#opcaoSelect option").eq(0).before($("<option></option>").val("Total").text("Total"));
        }
    }
    if($('#percentagem').hasClass('active5') || $('#percentagem').hasClass('active4')){
        $("#opcaoSelect option[value='Total']").remove();
    }
}
let reporAnos = function(){
    $('#mySelect')[0].options[0].innerHTML = "1991";
    $('#mySelect')[0].options[1].innerHTML = "2001";
    $('#mySelect')[0].options[2].innerHTML = "2011";
    if ($("#mySelect option[value='2021']").length == 0){
        $('#mySelect').append("<option value='2021'>2021</option>");;
    }
    removerTotal();
}
let reporAnosVariacao = function(){
    if ($("#mySelect option[value='2021']").length > 0){
        $("#mySelect option[value='2021']").remove();
    }
    $('#mySelect')[0].options[0].innerHTML = "2001 - 1991";
    $('#mySelect')[0].options[1].innerHTML = "2011 - 2001";
    $('#mySelect')[0].options[2].innerHTML = "2021 - 2011";
    removerTotal();
    primeirovalor('Total','1991');
}

let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}

$('#absoluto').click(function(){
    reporAnos();
    primeirovalor('Total','1991');
    fonteTitulo('N');
    tamanhoOutros();
});

$('#percentagem').click(function(){
    reporAnos();
    primeirovalor('AF','1991');
    tamanhoOutros();
    fonteTitulo('F');
});

$('#taxaVariacao').click(function(){
    reporAnosVariacao();
    tamanhoOutros();
    fonteTitulo('F');
});
function mudarEscala(){
    reporAnos();
    primeirovalor('Total','1991');
    tamanhoOutros();
    fonteTitulo('N');
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


$('#opcaoTabela').click(function(){
    $('#mapa').css("width","100%");
    $('#painel').css("position","absolute");
    $('#tabelaDadosAbsolutos').attr("class","btn active1");
    DadosAbsolutosTipoAlojamento();
    $('#opcaoMapa').attr("class","btn");
    $('#opcaoTabela').attr("class","btn active3");
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
    $('#opcaoMapa').attr("class","btn");
    $('#opcaoTabela').attr("class","btn");

    $('#tabelaVariacao').attr("class","btn");
    $('#tabelaPercentagem').attr("class","btn");
    $('#tabelaDadosAbsolutos').attr("class","btn")
    $('#notaRodape').remove();
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

let notaRodapeNaoClass = function(texto){
    if ($('#notaRodape').length){
        $('#notaRodape').html('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, apenas sendo possível comparar com os <strong>' + texto + '</strong>.');
    }
    else{
        $('#painel').append("<div id='notaRodape'></div>")
        $('#notaRodape').html('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, apenas sendo possível comparar com os <strong>' + texto + '</strong>.');
    }
}
function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }
//////// ------------ Adicionar Tabelas ------------------ \\\\\\\\\\\
var DadosAbsolutosTipoAlojamento = function(){
    $('#tituloMapa').html('Número de alojamentos, segundo o tipo, entre 2001 e 2021, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/TipodeAlojamento.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html("2001")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.TipoAlojamento == "Alojamentos Coletivos" || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom">'+value.TipoAlojamento+'</td>';
                    dados += '<td class="borderbottom">'+value.SubCategoria+'</td>';
                    dados += '<td class="borderbottom">'+value.Dados2001.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.Dados2011.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.Dados2021.toLocaleString("fr")+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Freguesia+'</td>';
                    dados += '<td>'+value.TipoAlojamento+'</td>';
                    dados += '<td>'+value.SubCategoria+'</td>';
                    dados += '<td>'+value.Dados2001.toLocaleString("fr")+'</td>';
                    dados += '<td>'+value.Dados2011.toLocaleString("fr")+'</td>';
                    dados += '<td>'+value.Dados2021.toLocaleString("fr")+'</td>';
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
    $('#tituloMapa').html('Variação do número de alojamentos, segundo o tipo, entre 2001 e 2021, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/TipodeAlojamento.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.TipoAlojamento == "Alojamentos Coletivos"  || containsAnyLetter(value.Concelho)){
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom">'+value.TipoAlojamento+'</td>';
                    dados += '<td class="borderbottom">'+value.SubCategoria+'</td>';
                    dados += '<td class="borderbottom">'+ ' '+'</td>';
                    dados += '<td class="borderbottom">'+value.VAR1101+'</td>';
                    dados += '<td class="borderbottom">'+value.VAR2111+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Freguesia+'</td>';
                    dados += '<td>'+value.TipoAlojamento+'</td>';
                    dados += '<td>'+value.SubCategoria+'</td>';
                    dados += '<td>'+ ' '+'</td>';
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
    $('#tituloMapa').html('Proporção do número de alojamentos, segundo o tipo, entre 2001 e 2021, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/TipodeAlojamento.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html("2001")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.TipoAlojamento == "Alojamentos Coletivos"  || containsAnyLetter(value.Concelho)){
                dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                dados += '<td class="borderbottom">'+value.Freguesia+'</td>';
                dados += '<td class="borderbottom">'+value.TipoAlojamento+'</td>';
                dados += '<td class="borderbottom">'+value.SubCategoria+'</td>';
                dados += '<td class="borderbottom">'+value.PER2001+'</td>';
                dados += '<td class="borderbottom">'+value.PER2011+'</td>';
                dados += '<td class="borderbottom">'+value.PER2021+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Freguesia+'</td>';
                    dados += '<td>'+value.TipoAlojamento+'</td>';
                    dados += '<td>'+value.SubCategoria+'</td>';
                    dados += '<td>'+value.PER2001+'</td>';
                    dados += '<td>'+value.PER2011+'</td>';
                    dados += '<td>'+value.PER2021+'</td>';
                }
                dados += '<tr>';
                })
        $('#juntarValores').append(dados); 
    });
    });
});

let anosSelecionados = function() {
    let anoSelecionado = document.getElementById("mySelect").value;
    if ($('#freguesias').hasClass("active2")){
        if (anoSelecionado == "2021"){
            i = 3;
        }
        if (anoSelecionado == "1991"){
            i = 0;
        }
    }
    if ($('#concelho').hasClass("active2")){
        if (anoSelecionado == "2021"){
            i = 3;
        }
        if (anoSelecionado == "1991"){
            i = 0;
        }
    }
    
    
}
  
const opcoesAnos = $('#mySelect');      
$('#next').click(function(){
    anosSelecionados();
    if ($('#freguesias').hasClass("active2")){
        if (i !== 3) {
            opcoesAnos.find('option:selected').next().prop('selected', true);
            myFunction();
            i += 1
        }
        if(i === 0){
            return false
        }
    }
    if ($('#concelho').hasClass("active2")){
        if (i !== 3) {
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
        if(i === 3){
            return false
        }
    }
    if($('#concelho').hasClass("active2")){
        if(i === 3){
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
