
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
$('#temporal').css("padding-top","0px");

//adicionar mapa
let latitude = 41.1073;
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
var contornoFreg2001 =L.geoJSON(dadosRelativosFreguesias01,{
    style:layerContorno,
});
var contornoConcelhos1991 =L.geoJSON(dadosRelativosConcelhos91,{
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
var legendaExcecao = function(tituloescrito, maximo,medio,minimo, multiplicador) {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'center'
    var symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = tituloescrito
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
function CorVariacao(d) {

    return d === null ? '#A9A9A9':
        d >= 100 ? '#ff7f7f' :
        d >= 80  ? '#ff8e86' :
        d >= 60   ? '#ff9d8d' :
        d >= 40 ? '#ffac93' :
        d >= 20 ? '#ffbb9a' :
        d >= 0  ? '#ffcaa1' :
        d >= -20  ? '#ffd9a7' :
        d >= -40   ? '#ffe8ae' :
        d >= -60   ? '#c3d0b4' :
        d >= -80 ? '#72acba':
        d >= -100   ? '#2288bf' :
                  '';
    }


//////////////////////////////////////////-------------------------- DADOS ABSOLUTOS CONCELHOS -----------\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- TOTAL DE EDIFÍCIOS EM 1991 CONCELHO ------------------------------\\\\\\\\\\\\\
////////////////////------  TOTAL EDIFICIOS , por concelho 1991---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalEdificiosConc91 = 0;
var maxTotalEdificiosConc91 = 0;
function estiloTotalEdificiosConc91(feature, latlng) {
    if(feature.properties.N_EDI91< minTotalEdificiosConc91 || minTotalEdificiosConc91 ===0){
        minTotalEdificiosConc91 = feature.properties.N_EDI91
    }
    if(feature.properties.N_EDI91> maxTotalEdificiosConc91){
        maxTotalEdificiosConc91 = feature.properties.N_EDI91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.N_EDI91,0.15)
    });
}
function apagarTotalEdificiosConc91(e){
    var layer = e.target;
    TotalEdificiosConc91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosConc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Edifícios:  ' + '<b>' +feature.properties.N_EDI91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosConc91,
    })
};

var TotalEdificiosConc91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloTotalEdificiosConc91,
    onEachFeature: onEachFeatureTotalEdificiosConc91,
});


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




var slideTotalEdificiosConc91 = function(){
    var sliderTotalEdificiosConc91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosConc91, {
        start: [minTotalEdificiosConc91, maxTotalEdificiosConc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosConc91,
            'max': maxTotalEdificiosConc91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosConc91);
    inputNumberMax.setAttribute("value",maxTotalEdificiosConc91);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosConc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosConc91.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosConc91.noUiSlider.on('update',function(e){
        TotalEdificiosConc91.eachLayer(function(layer){
            if(layer.feature.properties.N_EDI91>=parseFloat(e[0])&& layer.feature.properties.N_EDI91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosConc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderTotalEdificiosConc91.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosConc91);
}
TotalEdificiosConc91.addTo(map);
$('#tituloMapa').html('<strong>' + 'Total de edifícios em 1991, por concelho.' + '</strong>');
legenda(maxTotalEdificiosConc91, ((maxTotalEdificiosConc91-minTotalEdificiosConc91)/2).toFixed(0),minTotalEdificiosConc91,0.1);
slideTotalEdificiosConc91();

///////////////////////////-------------------- FIM TOTAL EDIFICIOS CONCELHO 1991 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////------  TOTAL EDIFICIOS , por concelho 2001---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalEdificiosConc01 = 0;
var maxTotalEdificiosConc01 = 0;
function estiloTotalEdificiosConc01(feature, latlng) {
    if(feature.properties.N_EDI01< minTotalEdificiosConc01 || minTotalEdificiosConc01 ===0){
        minTotalEdificiosConc01 = feature.properties.N_EDI01
    }
    if(feature.properties.N_EDI01> maxTotalEdificiosConc01){
        maxTotalEdificiosConc01 = feature.properties.N_EDI01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.N_EDI01,0.15)
    });
}
function apagarTotalEdificiosConc01(e){
    var layer = e.target;
    TotalEdificiosConc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios:  ' + '<b>' +feature.properties.N_EDI01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosConc01,
    })
};

var TotalEdificiosConc01= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloTotalEdificiosConc01,
    onEachFeature: onEachFeatureTotalEdificiosConc01,
});

var slideTotalEdificiosConc01 = function(){
    var sliderTotalEdificiosConc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosConc01, {
        start: [minTotalEdificiosConc01, maxTotalEdificiosConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosConc01,
            'max': maxTotalEdificiosConc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosConc01);
    inputNumberMax.setAttribute("value",maxTotalEdificiosConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosConc01.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosConc01.noUiSlider.on('update',function(e){
        TotalEdificiosConc01.eachLayer(function(layer){
            if(layer.feature.properties.N_EDI01>=parseFloat(e[0])&& layer.feature.properties.N_EDI01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderTotalEdificiosConc01.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosConc01);
}
///////////////////////////-------------------- FIM TOTAL EDIFICIOS CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////------  TOTAL EDIFICIOS , por concelho 2011---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalEdificiosConc11 = 0;
var maxTotalEdificiosConc11 = 0;
function estiloTotalEdificiosConc11(feature, latlng) {
    if(feature.properties.N_EDI11< minTotalEdificiosConc11 || minTotalEdificiosConc11 ===0){
        minTotalEdificiosConc11 = feature.properties.N_EDI11
    }
    if(feature.properties.N_EDI11> maxTotalEdificiosConc11){
        maxTotalEdificiosConc11 = feature.properties.N_EDI11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.N_EDI11,0.15)
    });
}
function apagarTotalEdificiosConc11(e){
    var layer = e.target;
    TotalEdificiosConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios:  ' + '<b>' +feature.properties.N_EDI11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosConc11,
    })
};

var TotalEdificiosConc11= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloTotalEdificiosConc11,
    onEachFeature: onEachFeatureTotalEdificiosConc11,
});

var slideTotalEdificiosConc11 = function(){
    var sliderTotalEdificiosConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosConc11, {
        start: [minTotalEdificiosConc11, maxTotalEdificiosConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosConc11,
            'max': maxTotalEdificiosConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosConc11);
    inputNumberMax.setAttribute("value",maxTotalEdificiosConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosConc11.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosConc11.noUiSlider.on('update',function(e){
        TotalEdificiosConc11.eachLayer(function(layer){
            if(layer.feature.properties.N_EDI11>=parseFloat(e[0])&& layer.feature.properties.N_EDI11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderTotalEdificiosConc11.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosConc11);
}
///////////////////////////-------------------- FIM TOTAL EDIFICIOS CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////------  TOTAL EDIFICIOS , por concelho 2021---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalEdificiosConc21 = 0;
var maxTotalEdificiosConc21 = 0;
function estiloTotalEdificiosConc21(feature, latlng) {
    if(feature.properties.N_EDI21< minTotalEdificiosConc21 || minTotalEdificiosConc21 ===0){
        minTotalEdificiosConc21 = feature.properties.N_EDI21
    }
    if(feature.properties.N_EDI21> maxTotalEdificiosConc21){
        maxTotalEdificiosConc21 = feature.properties.N_EDI21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.N_EDI21,0.15)
    });
}
function apagarTotalEdificiosConc21(e){
    var layer = e.target;
    TotalEdificiosConc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosConc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios:  ' + '<b>' +feature.properties.N_EDI21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosConc21,
    })
};

var TotalEdificiosConc21= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloTotalEdificiosConc21,
    onEachFeature: onEachFeatureTotalEdificiosConc21,
});

var slideTotalEdificiosConc21 = function(){
    var sliderTotalEdificiosConc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosConc21, {
        start: [minTotalEdificiosConc21, maxTotalEdificiosConc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosConc21,
            'max': maxTotalEdificiosConc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosConc21);
    inputNumberMax.setAttribute("value",maxTotalEdificiosConc21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosConc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosConc21.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosConc21.noUiSlider.on('update',function(e){
        TotalEdificiosConc21.eachLayer(function(layer){
            if(layer.feature.properties.N_EDI21>=parseFloat(e[0])&& layer.feature.properties.N_EDI21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosConc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderTotalEdificiosConc21.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosConc21);
}
///////////////////////////-------------------- FIM TOTAL EDIFICIOS CONCELHO 2021 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação EDIFICIOS entre 2001 e 1991 -------------------////

var minVarTotEdi01_91 = 0;
var maxVarTotEdi01_91 = 0;

function CorVarEdi01_91Conc(d) {
    return  d == null ? '#000000' :
        d >= 20  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -20.77   ? '#2288bf' :
                ''  ;
}

var legendaVarEdi01_91Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios, entre 2001 e 1991, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -20.76 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' sem informação disponível' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarTotEdi01_91(feature) {
    if(feature.properties.Var01_91 <= minVarTotEdi01_91 || minVarTotEdi01_91 ===0){
        minVarTotEdi01_91 = feature.properties.Var01_91
    }
    if(feature.properties.Var01_91 > maxVarTotEdi01_91){
        maxVarTotEdi01_91 = feature.properties.Var01_91 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEdi01_91Conc(feature.properties.Var01_91)};
    }


function apagarVarTotEdi01_91(e) {
    VarTotEdi01_91.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotEdi01_91(feature, layer) {
    if(feature.properties.Var01_91 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var01_91.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotEdi01_91,
    });
}
var VarTotEdi01_91= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarTotEdi01_91,
    onEachFeature: onEachFeatureVarTotEdi01_91
});

let slideVarTotEdi01_91 = function(){
    var sliderVarTotEdi01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotEdi01_91, {
        start: [minVarTotEdi01_91, maxVarTotEdi01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotEdi01_91,
            'max': maxVarTotEdi01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarTotEdi01_91);
    inputNumberMax.setAttribute("value",maxVarTotEdi01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotEdi01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotEdi01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarTotEdi01_91.noUiSlider.on('update',function(e){
        VarTotEdi01_91.eachLayer(function(layer){
            if (!layer.feature.properties.Var01_91){
                return false
            }
            if(layer.feature.properties.Var01_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var01_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotEdi01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderVarTotEdi01_91.noUiSlider;
    $(slidersGeral).append(sliderVarTotEdi01_91);
} 

//////////////////////--------- Fim da Variação EDIFICIOS POR CONCELHO ENTRE 2001 E 1991 -------------- \\\\\\

/////////////////////////////------- Variação EDIFICIOS entre 2011 e 2001 -------------------////

var minVarTotEdi11_01 = 0;
var maxVarTotEdi11_01 = 0;

function CorVarEdi11_01Conc(d) {
    return  d == null ? '#000000' :
        d >= 15  ? '#8c0303' :
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5.06   ? '#9eaad7' :
                ''  ;
}

var legendaVarEdi11_01Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios, entre 2011 e 2001, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5.05 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotEdi11_01(feature) {
    if(feature.properties.Var11_01 <= minVarTotEdi11_01 || minVarTotEdi11_01 ===0){
        minVarTotEdi11_01 = feature.properties.Var11_01
    }
    if(feature.properties.Var11_01 > maxVarTotEdi11_01){
        maxVarTotEdi11_01 = feature.properties.Var11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEdi11_01Conc(feature.properties.Var11_01)};
    }


function apagarVarTotEdi11_01(e) {
    VarTotEdi11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotEdi11_01(feature, layer) {
    if(feature.properties.Var11_01 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var11_01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotEdi11_01,
    });
}
var VarTotEdi11_01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarTotEdi11_01,
    onEachFeature: onEachFeatureVarTotEdi11_01
});

let slideVarTotEdi11_01 = function(){
    var sliderVarTotEdi11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotEdi11_01, {
        start: [minVarTotEdi11_01, maxVarTotEdi11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotEdi11_01,
            'max': maxVarTotEdi11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarTotEdi11_01);
    inputNumberMax.setAttribute("value",maxVarTotEdi11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotEdi11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotEdi11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarTotEdi11_01.noUiSlider.on('update',function(e){
        VarTotEdi11_01.eachLayer(function(layer){
            if (!layer.feature.properties.Var11_01){
                return false
            }
            if(layer.feature.properties.Var11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotEdi11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderVarTotEdi11_01.noUiSlider;
    $(slidersGeral).append(sliderVarTotEdi11_01);
} 

//////////////////////--------- Fim da Variação EDIFICIOS POR CONCELHO ENTRE 2011 E 2001 -------------- \\\\\\

/////////////////////////////------- Variação EDIFICIOS entre 2021 e 2011 -------------------////

var minVarTotEdi21_11 = 0;
var maxVarTotEdi21_11 = 0;

function CorVarEdi21_11Conc(d) {
    return  d == null ? '#000000' :
        d >= 3  ? '#de1f35' :
        d >= 1.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -11.34   ? '#2288bf' :
                ''  ;
}

var legendaVarEdi21_11Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios, entre 2021 e 2011, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  1.5 a 3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 1.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -11.33 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarTotEdi21_11(feature) {
    if(feature.properties.Var21_11 <= minVarTotEdi21_11 || minVarTotEdi21_11 ===0){
        minVarTotEdi21_11 = feature.properties.Var21_11
    }
    if(feature.properties.Var21_11 > maxVarTotEdi21_11){
        maxVarTotEdi21_11 = feature.properties.Var21_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEdi21_11Conc(feature.properties.Var21_11)};
    }


function apagarVarTotEdi21_11(e) {
    VarTotEdi21_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotEdi21_11(feature, layer) {
    if(feature.properties.Var21_11 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var21_11.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotEdi21_11,
    });
}
var VarTotEdi21_11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarTotEdi21_11,
    onEachFeature: onEachFeatureVarTotEdi21_11
});

let slideVarTotEdi21_11 = function(){
    var sliderVarTotEdi21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotEdi21_11, {
        start: [minVarTotEdi21_11, maxVarTotEdi21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotEdi21_11,
            'max': maxVarTotEdi21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarTotEdi21_11);
    inputNumberMax.setAttribute("value",maxVarTotEdi21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotEdi21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotEdi21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarTotEdi21_11.noUiSlider.on('update',function(e){
        VarTotEdi21_11.eachLayer(function(layer){
            if (!layer.feature.properties.Var21_11){
                return false
            }
            if(layer.feature.properties.Var21_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var21_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotEdi21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderVarTotEdi21_11.noUiSlider;
    $(slidersGeral).append(sliderVarTotEdi21_11);
} 

//////////////////////--------- Fim da Variação EDIFICIOS POR CONCELHO ENTRE 2021 E 2011 -------------- \\\\\\

//////////////////------------- FIM DADOS VARIAÇÃO -------------\\\\\\\\\\\\\

//////////////////////////--------------------------- DADOS FREGUESIA ----------------------\\\\\\\\\\\\\\\\
////////////////////------  TOTAL EDIFICIOS , por FREGUESIA 1991---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalEdificiosFreg91 = 0;
var maxTotalEdificiosFreg91 = 0;
function estiloTotalEdificiosFreg91(feature, latlng) {
    if(feature.properties.N_EDI91< minTotalEdificiosFreg91 || minTotalEdificiosFreg91 ===0){
        minTotalEdificiosFreg91 = feature.properties.N_EDI91
    }
    if(feature.properties.N_EDI91> maxTotalEdificiosFreg91){
        maxTotalEdificiosFreg91 = feature.properties.N_EDI91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.N_EDI91,0.15)
    });
}
function apagarTotalEdificiosFreg91(e){
    var layer = e.target;
    TotalEdificiosFreg91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosFreg91(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios: ' + '<b>' + feature.properties.N_EDI91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosFreg91,
    })
};

var TotalEdificiosFreg91= L.geoJSON(dadosAbsolutosFreguesias91,{
    pointToLayer:estiloTotalEdificiosFreg91,
    onEachFeature: onEachFeatureTotalEdificiosFreg91,
});


var slideTotalEdificiosFreg91 = function(){
    var sliderTotalEdificiosFreg91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosFreg91, {
        start: [minTotalEdificiosFreg91, maxTotalEdificiosFreg91],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosFreg91,
            'max': maxTotalEdificiosFreg91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosFreg91);
    inputNumberMax.setAttribute("value",maxTotalEdificiosFreg91);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosFreg91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosFreg91.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosFreg91.noUiSlider.on('update',function(e){
        TotalEdificiosFreg91.eachLayer(function(layer){
            if(layer.feature.properties.N_EDI91>=parseFloat(e[0])&& layer.feature.properties.N_EDI91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosFreg91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderTotalEdificiosFreg91.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosFreg91);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS CONCELHO 1991 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////------  TOTAL EDIFICIOS , por FREGUESIA 2001---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalEdificiosFreg01 = 0;
var maxTotalEdificiosFreg01 = 0;
function estiloTotalEdificiosFreg01(feature, latlng) {
    if(feature.properties.N_EDI01< minTotalEdificiosFreg01 || minTotalEdificiosFreg01 ===0){
        minTotalEdificiosFreg01 = feature.properties.N_EDI01
    }
    if(feature.properties.N_EDI01> maxTotalEdificiosFreg01){
        maxTotalEdificiosFreg01 = feature.properties.N_EDI01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.N_EDI01,0.15)
    });
}
function apagarTotalEdificiosFreg01(e){
    var layer = e.target;
    TotalEdificiosFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios: ' + '<b>' + feature.properties.N_EDI01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosFreg01,
    })
};

var TotalEdificiosFreg01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloTotalEdificiosFreg01,
    onEachFeature: onEachFeatureTotalEdificiosFreg01,
});


var slideTotalEdificiosFreg01 = function(){
    var sliderTotalEdificiosFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosFreg01, {
        start: [minTotalEdificiosFreg01, maxTotalEdificiosFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosFreg01,
            'max': maxTotalEdificiosFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosFreg01);
    inputNumberMax.setAttribute("value",maxTotalEdificiosFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosFreg01.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosFreg01.noUiSlider.on('update',function(e){
        TotalEdificiosFreg01.eachLayer(function(layer){
            if(layer.feature.properties.N_EDI01>=parseFloat(e[0])&& layer.feature.properties.N_EDI01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderTotalEdificiosFreg01.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosFreg01);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////------  TOTAL EDIFICIOS , por FREGUESIA 2011---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalEdificiosFreg11 = 0;
var maxTotalEdificiosFreg11 = 0;
function estiloTotalEdificiosFreg11(feature, latlng) {
    if(feature.properties.N_EDI11< minTotalEdificiosFreg11 || minTotalEdificiosFreg11 ===0){
        minTotalEdificiosFreg11 = feature.properties.N_EDI11
    }
    if(feature.properties.N_EDI11> maxTotalEdificiosFreg11){
        maxTotalEdificiosFreg11 = feature.properties.N_EDI11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.N_EDI11,0.15)
    });
}
function apagarTotalEdificiosFreg11(e){
    var layer = e.target;
    TotalEdificiosFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios: ' + '<b>' + feature.properties.N_EDI11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosFreg11,
    })
};

var TotalEdificiosFreg11= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloTotalEdificiosFreg11,
    onEachFeature: onEachFeatureTotalEdificiosFreg11,
});


var slideTotalEdificiosFreg11 = function(){
    var sliderTotalEdificiosFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosFreg11, {
        start: [minTotalEdificiosFreg11, maxTotalEdificiosFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosFreg11,
            'max': maxTotalEdificiosFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosFreg11);
    inputNumberMax.setAttribute("value",maxTotalEdificiosFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosFreg11.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosFreg11.noUiSlider.on('update',function(e){
        TotalEdificiosFreg11.eachLayer(function(layer){
            if(layer.feature.properties.N_EDI11>=parseFloat(e[0])&& layer.feature.properties.N_EDI11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderTotalEdificiosFreg11.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosFreg11);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////------  TOTAL EDIFICIOS , por FREGUESIA 2021---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalEdificiosFreg21 = 0;
var maxTotalEdificiosFreg21 = 0;
function estiloTotalEdificiosFreg21(feature, latlng) {
    if(feature.properties.N_EDI21< minTotalEdificiosFreg21 || minTotalEdificiosFreg21 ===0){
        minTotalEdificiosFreg21 = feature.properties.N_EDI21
    }
    if(feature.properties.N_EDI21> maxTotalEdificiosFreg21){
        maxTotalEdificiosFreg21 = feature.properties.N_EDI21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.N_EDI21,0.15)
    });
}
function apagarTotalEdificiosFreg21(e){
    var layer = e.target;
    TotalEdificiosFreg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosFreg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios: ' + '<b>' + feature.properties.N_EDI21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosFreg21,
    })
};

var TotalEdificiosFreg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloTotalEdificiosFreg21,
    onEachFeature: onEachFeatureTotalEdificiosFreg21,
});


var slideTotalEdificiosFreg21 = function(){
    var sliderTotalEdificiosFreg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosFreg21, {
        start: [minTotalEdificiosFreg21, maxTotalEdificiosFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosFreg21,
            'max': maxTotalEdificiosFreg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosFreg21);
    inputNumberMax.setAttribute("value",maxTotalEdificiosFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosFreg21.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosFreg21.noUiSlider.on('update',function(e){
        TotalEdificiosFreg21.eachLayer(function(layer){
            if(layer.feature.properties.N_EDI21>=parseFloat(e[0])&& layer.feature.properties.N_EDI21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderTotalEdificiosFreg21.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosFreg21);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS FREGUESIA 2021 -----------\\\\\\\\\\\\\\\\\\\\\\\
/////////////////////////----------------------- FIM DADOS ABSOLUTOS FREGUESIA -----------------\\\\\\\\\\\\\\\\\\

//////////////////////////--------------- VARIAÇÃO FREGUESIAS -------------------------\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação EDIFICIOS  FREGUESIA entre 2001 e 1991 -------------------////

var minVarTotEdiFreg01_91 = 0;
var maxVarTotEdiFreg01_91 = 0;

function CorVarEdi01_91Freg(d) {
    return  d == null ? '#000000' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -19.56   ? '#2288bf' :
                ''  ;
}

var legendaVarEdi01_91Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios, entre 2001 e 1991, por freguesia' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -19.56 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotEdiFreg01_91(feature) {
    if(feature.properties.Var01_91 <= minVarTotEdiFreg01_91 || minVarTotEdiFreg01_91 ===0){
        minVarTotEdiFreg01_91 = feature.properties.Var01_91
    }
    if(feature.properties.Var01_91 > maxVarTotEdiFreg01_91){
        maxVarTotEdiFreg01_91 = feature.properties.Var01_91 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEdi01_91Freg(feature.properties.Var01_91)};
    }


function apagarVarTotEdiFreg01_91(e) {
    VarTotEdiFreg01_91.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotEdiFreg01_91(feature, layer) {
    if(feature.properties.Var01_91 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var01_91 + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotEdiFreg01_91,
    });
}
var VarTotEdiFreg01_91= L.geoJSON(dadosRelativosFreguesias91, {
    style:EstiloVarTotEdiFreg01_91,
    onEachFeature: onEachFeatureVarTotEdiFreg01_91
});

let slideVarTotEdiFreg01_91 = function(){
    var sliderVarTotEdiFreg01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotEdiFreg01_91, {
        start: [minVarTotEdiFreg01_91, maxVarTotEdiFreg01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotEdiFreg01_91,
            'max': maxVarTotEdiFreg01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarTotEdiFreg01_91);
    inputNumberMax.setAttribute("value",maxVarTotEdiFreg01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotEdiFreg01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotEdiFreg01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarTotEdiFreg01_91.noUiSlider.on('update',function(e){
        VarTotEdiFreg01_91.eachLayer(function(layer){
            if (!layer.feature.properties.Var01_91){
                return false
            }
            if(layer.feature.properties.Var01_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var01_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotEdiFreg01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderVarTotEdiFreg01_91.noUiSlider;
    $(slidersGeral).append(sliderVarTotEdiFreg01_91);
} 

//////////////////////--------- Fim da Variação EDIFICIOS POR CONCELHO ENTRE 2001 E 1991 -------------- \\\\\\

/////////////////////////////------- Variação EDIFICIOS  FREGUESIA entre 2011 e 2001 -------------------////

var minVarTotEdiFreg11_01 = 0;
var maxVarTotEdiFreg11_01 = 0;

function CorVarEdi11_01Freg(d) {
    return  d == null ? '#000000' :
        d >= 30  ? '#8c0303' :
        d >= 20  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -18.61 ? '#9eaad7' :
                ''  ;
}

var legendaVarEdi11_01Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios, entre 2011 e 2001, por freguesia' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  20 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -18.6 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}
function EstiloVarTotEdiFreg11_01(feature) {
    if(feature.properties.Var11_01 <= minVarTotEdiFreg11_01 || minVarTotEdiFreg11_01 ===0){
        minVarTotEdiFreg11_01 = feature.properties.Var11_01
    }
    if(feature.properties.Var11_01 > maxVarTotEdiFreg11_01){
        maxVarTotEdiFreg11_01 = feature.properties.Var11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEdi11_01Freg(feature.properties.Var11_01)};
    }


function apagarVarTotEdiFreg11_01(e) {
    VarTotEdiFreg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotEdiFreg11_01(feature, layer) {
    if(feature.properties.Var11_01 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var11_01 + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotEdiFreg11_01,
    });
}
var VarTotEdiFreg11_01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarTotEdiFreg11_01,
    onEachFeature: onEachFeatureVarTotEdiFreg11_01
});

let slideVarTotEdiFreg11_01 = function(){
    var sliderVarTotEdiFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotEdiFreg11_01, {
        start: [minVarTotEdiFreg11_01, maxVarTotEdiFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotEdiFreg11_01,
            'max': maxVarTotEdiFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarTotEdiFreg11_01);
    inputNumberMax.setAttribute("value",maxVarTotEdiFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotEdiFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotEdiFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarTotEdiFreg11_01.noUiSlider.on('update',function(e){
        VarTotEdiFreg11_01.eachLayer(function(layer){
            if (!layer.feature.properties.Var11_01){
                return false
            }
            if(layer.feature.properties.Var11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotEdiFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderVarTotEdiFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarTotEdiFreg11_01);
} 

//////////////////////--------- Fim da Variação EDIFICIOS POR CONCELHO ENTRE 2011 E 2001 -------------- \\\\\\


/////////////////////////////------- Variação EDIFICIOS  FREGUESIA entre 2021 e 2011 -------------------////

var minVarTotEdiFreg21_11 = 0;
var maxVarTotEdiFreg21_11 = 0;

function CorVarEdi21_11Freg(d) {
    return  d == null ? '#000000' :
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -22.57 ? '#2288bf' :
                ''  ;
}

var legendaVarEdi21_11Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios, entre 2021 e 2011, por freguesia' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -22.56 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotEdiFreg21_11(feature) {
    if(feature.properties.Var21_11 <= minVarTotEdiFreg21_11 || minVarTotEdiFreg21_11 ===0){
        minVarTotEdiFreg21_11 = feature.properties.Var21_11
    }
    if(feature.properties.Var21_11 > maxVarTotEdiFreg21_11){
        maxVarTotEdiFreg21_11 = feature.properties.Var21_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarEdi21_11Freg(feature.properties.Var21_11)};
    }


function apagarVarTotEdiFreg21_11(e) {
    VarTotEdiFreg21_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotEdiFreg21_11(feature, layer) {
    if(feature.properties.Var21_11 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var21_11 + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotEdiFreg21_11,
    });
}
var VarTotEdiFreg21_11= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVarTotEdiFreg21_11,
    onEachFeature: onEachFeatureVarTotEdiFreg21_11
});

let slideVarTotEdiFreg21_11 = function(){
    var sliderVarTotEdiFreg21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotEdiFreg21_11, {
        start: [minVarTotEdiFreg21_11, maxVarTotEdiFreg21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotEdiFreg21_11,
            'max': maxVarTotEdiFreg21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarTotEdiFreg21_11);
    inputNumberMax.setAttribute("value",maxVarTotEdiFreg21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotEdiFreg21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotEdiFreg21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarTotEdiFreg21_11.noUiSlider.on('update',function(e){
        VarTotEdiFreg21_11.eachLayer(function(layer){
            if (!layer.feature.properties.Var21_11){
                return false
            }
            if(layer.feature.properties.Var21_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var21_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotEdiFreg21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderVarTotEdiFreg21_11.noUiSlider;
    $(slidersGeral).append(sliderVarTotEdiFreg21_11);
} 

//////////////////////--------- Fim da Variação EDIFICIOS POR CONCELHO ENTRE 2021 E 2011 -------------- \\\\\\

var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Recenseamento da população e habitação';

/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = TotalEdificiosConc91;
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
    if (layer == TotalEdificiosConc91 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Total de edifícios em 1991, por concelho.' + '</strong>');
        legenda(maxTotalEdificiosConc91, ((maxTotalEdificiosConc91-minTotalEdificiosConc91)/2).toFixed(0),minTotalEdificiosConc91,0.15);
        contornoConcelhos1991.addTo(map)
        baseAtiva = contornoConcelhos1991;
        slideTotalEdificiosConc91();
        naoDuplicar = 1;
    }
    if (layer == TotalEdificiosConc91 && naoDuplicar == 1){
        $('#tituloMapa').html('<strong>' + 'Total de edifícios em 1991, por concelho.' + '</strong>');
        contornoConcelhos1991.addTo(map);
    } 
    if (layer == TotalEdificiosConc01 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Total de edifícios em 2001, por concelho.' + '</strong>');
        legenda(maxTotalEdificiosConc01, ((maxTotalEdificiosConc01-minTotalEdificiosConc01)/2).toFixed(0),minTotalEdificiosConc01,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalEdificiosConc01();  
        naoDuplicar = 2;
    }
    if (layer == TotalEdificiosConc11 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Total de edifícios em 2011, por concelho.' + '</strong>');
        legenda(maxTotalEdificiosConc11, ((maxTotalEdificiosConc11-minTotalEdificiosConc11)/2).toFixed(0),minTotalEdificiosConc11,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalEdificiosConc11();  
        naoDuplicar = 3;
    }
    if (layer == TotalEdificiosConc21 && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Total de edifícios em 2021, por concelho.' + '</strong>');
        legenda(maxTotalEdificiosConc21, ((maxTotalEdificiosConc21-minTotalEdificiosConc21)/2).toFixed(0),minTotalEdificiosConc21,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalEdificiosConc21();  
        naoDuplicar = 4;
    }
    if (layer == VarTotEdi01_91 && naoDuplicar != 5){
        legendaVarEdi01_91Conc();
        slideVarTotEdi01_91();
        naoDuplicar = 5;
    }
    if (layer == VarTotEdi11_01 && naoDuplicar != 6){
        legendaVarEdi11_01Conc();
        slideVarTotEdi11_01();
        naoDuplicar = 6;
    }
    if (layer == VarTotEdi21_11 && naoDuplicar != 7){
        legendaVarEdi21_11Conc();
        slideVarTotEdi21_11();
        naoDuplicar = 7;
    }
    if (layer == TotalEdificiosFreg91 && naoDuplicar != 8){
        $('#tituloMapa').html('<strong>' + 'Total de edifícios em 1991, por freguesia.' + '</strong>');
        legenda(maxTotalEdificiosFreg91, ((maxTotalEdificiosFreg91-minTotalEdificiosFreg91)/2).toFixed(0),minTotalEdificiosFreg91,0.15);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalEdificiosFreg91();  
        naoDuplicar = 8;
    }
    if (layer == TotalEdificiosFreg01 && naoDuplicar != 9){
        $('#tituloMapa').html('<strong>' + 'Total de edifícios em 2001, por freguesia.' + '</strong>');
        legenda(maxTotalEdificiosFreg01, ((maxTotalEdificiosFreg01-minTotalEdificiosFreg01)/2).toFixed(0),minTotalEdificiosFreg01,0.15);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalEdificiosFreg01();  
        naoDuplicar = 9;
    }
    if (layer == TotalEdificiosFreg11 && naoDuplicar != 10){
        $('#tituloMapa').html('<strong>' + 'Total de edifícios em 2011, por freguesia.' + '</strong>');
        legenda(maxTotalEdificiosFreg11, ((maxTotalEdificiosFreg11-minTotalEdificiosFreg11)/2).toFixed(0),minTotalEdificiosFreg11,0.15);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideTotalEdificiosFreg11();  
        naoDuplicar = 10;
    }
    if (layer == TotalEdificiosFreg21 && naoDuplicar != 11){
        $('#tituloMapa').html('<strong>' + 'Total de edifícios em 2021, por freguesia.' + '</strong>');
        legenda(maxTotalEdificiosFreg21, ((maxTotalEdificiosFreg21-minTotalEdificiosFreg21)/2).toFixed(0),minTotalEdificiosFreg21,0.15);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideTotalEdificiosFreg21();  
        naoDuplicar = 11;
    }
    if (layer == VarTotEdiFreg01_91 && naoDuplicar != 12){
        legendaVarEdi01_91Freg();
        slideVarTotEdiFreg01_91();
        naoDuplicar = 12;
    }
    if (layer == VarTotEdiFreg11_01 && naoDuplicar != 13){
        legendaVarEdi11_01Freg();
        slideVarTotEdiFreg11_01();
        naoDuplicar = 13;
    }
    if (layer == VarTotEdiFreg21_11 && naoDuplicar != 14){
        legendaVarEdi21_11Freg();
        slideVarTotEdiFreg21_11();
        naoDuplicar = 14;
    }

    layer.addTo(map);
    layerAtiva = layer;  
}

function myFunction() {
    var anoSelecionado = document.getElementById("mySelect").value;
    if ($('#concelho').hasClass('active2')){
        if($('#absoluto').hasClass('active4')){
            if (anoSelecionado == "1991"){
                novaLayer(TotalEdificiosConc91);
            };
            if (anoSelecionado == "2001"){
                novaLayer(TotalEdificiosConc01);
            };
            if (anoSelecionado == "2011"){
                novaLayer(TotalEdificiosConc11);
            }; 
            if (anoSelecionado == "2021"){
                novaLayer(TotalEdificiosConc21);
            }; 
        }
        if($('#taxaVariacao').hasClass('active4')){
            if (anoSelecionado == "1991"){
                novaLayer(VarTotEdi01_91);
            }; 
            if (anoSelecionado == "2001"){
                novaLayer(VarTotEdi11_01);
            }; 
            if (anoSelecionado == "2011"){
                novaLayer(VarTotEdi21_11);
            }; 
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if($('#absoluto').hasClass('active5')){
            if (anoSelecionado == "1991"){
                novaLayer(TotalEdificiosFreg91);
            };
            if (anoSelecionado == "2001"){
                novaLayer(TotalEdificiosFreg01);
            };
            if (anoSelecionado == "2011"){
                novaLayer(TotalEdificiosFreg11);
            }; 
            if (anoSelecionado == "2021"){
                novaLayer(TotalEdificiosFreg21);
            }; 
        }
        if($('#taxaVariacao').hasClass('active5')){
            if (anoSelecionado == "1991"){
                novaLayer(VarTotEdiFreg01_91);
            };
            if (anoSelecionado == "2001"){
                novaLayer(VarTotEdiFreg11_01);
            }; 
            if (anoSelecionado == "2011"){
                novaLayer(VarTotEdiFreg21_11);
            }; 
        }
    }
}


function mudarEscala(){
    reporAnos();
    tamanhoOutros();
    fonteTitulo('N');
}
let primeirovalor = function(valor,ano){
    $("#mySelect").val(ano);
    $("#opcaoSelect").val(valor)
    
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
let reporAnos = function(){
    $('#mySelect')[0].options[0].innerHTML = "1991";
    $('#mySelect')[0].options[1].innerHTML = "2001";
    $('#mySelect')[0].options[2].innerHTML = "2011";
    if($('#absoluto').hasClass('active4') || $('#absoluto').hasClass('active5')){
        if ($("#mySelect option[value='2021']").length == 0){
            $('#mySelect').append("<option value='2021'>2021</option>");;
        }
    }
    if($('#taxaVariacao').hasClass('active4') || $('#taxaVariacao').hasClass('active5')){
        if ($("#mySelect option[value='2021']").length > 0){
            $("#mySelect option[value='2021']").remove();
        }
        $('#mySelect')[0].options[0].innerHTML = "2001 - 1991";
        $('#mySelect')[0].options[1].innerHTML = "2011 - 2001";
        $('#mySelect')[0].options[2].innerHTML = "2021 - 2011";
    }
    primeirovalor('Total','1991');
}

$('#absoluto').click(function(){
    reporAnos();
    fonteTitulo('N');
    tamanhoOutros();
});

$('#taxaVariacao').click(function(){
    reporAnos();
    fonteTitulo('F');
    tamanhoOutros();
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
function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }

$('#tabelaDadosAbsolutos').click(function(){
    DadosAbsolutos();   
});
var DadosAbsolutos = function(){
    $('#tituloMapa').html('Número de edifícios, entre 1991 e 2021, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/NumeroEdificiosProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';7
            $('#1991').html("1991")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom bordertop">'+value.Edificios+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.DADOS1991.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.DADOS2011.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.DADOS2021.toLocaleString("fr")+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Edificios+'</td>';
                    dados += '<td>'+value.DADOS1991.toLocaleString("fr")+'</td>';
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

$('#tabelaVariacao').click(function(){  
    $('#tituloMapa').html('Variação do número de edifícios, entre 1991 e 2021, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/NumeroEdificiosProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#1991').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom bordertop">'+value.Edificios+'</td>';
                    dados += '<td class="borderbottom bordertop">'+ ''+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR0191+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR1101+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR2111+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Edificios+'</td>';
                    dados += '<td>'+ ''+'</td>';
                    dados += '<td>'+value.VAR0191+'</td>';
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
    let anoSelecionado = document.getElementById("mySelect").value;
    if ($('#freguesias').hasClass("active2")){
        if (anoSelecionado != "2021" || anoSelecionado != "1991"){
            i = 1
        }
        if (anoSelecionado == "2021"){
            i = $('#mySelect').children('option').length - 1 ;
        }
        if (anoSelecionado == "1991"){
            i = 0;
        }
    }
    if ($('#concelho').hasClass("active2")){
        if (anoSelecionado != "2021" || anoSelecionado != "1991"){
            i = 1
        }
        if (anoSelecionado == "2021"){
            i = $('#mySelect').children('option').length - 1 ;
            console.log(i)
        }
        if (anoSelecionado == "1991"){
            i = 0;
            console.log(i)
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
