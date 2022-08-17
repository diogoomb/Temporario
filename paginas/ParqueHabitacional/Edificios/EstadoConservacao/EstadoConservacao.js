
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

/////////////////////-------------------- ORIENTAÇÃO---------\\
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
var contornoFreg2001 = L.geoJSON(dadosRelativosFreguesias,{
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

//////////////////////////////////////////----------- EDIFICIOS SEM NECESSECIDADE DE REPARAÇÃO 2001 CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdifiSemNec01 = 0;
var maxEdifiSemNec01 = 0;
function estiloEdifiSemNec01(feature, latlng) {
    if(feature.properties.EDI_SNEC01< minEdifiSemNec01 || minEdifiSemNec01 ===0){
        minEdifiSemNec01 = feature.properties.EDI_SNEC01
    }
    if(feature.properties.EDI_SNEC01> maxEdifiSemNec01){
        maxEdifiSemNec01 = feature.properties.EDI_SNEC01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.EDI_SNEC01,0.2)
    });
}
function apagarEdifiSemNec01(e){
    var layer = e.target;
    EdifiSemNec01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifiSemNec01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios sem necessidade de reparação:  ' + '<b>' +feature.properties.EDI_SNEC01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifiSemNec01,
    })
};

var EdifiSemNec01= L.geoJSON(dadosAbsolutosConcelho,{
    pointToLayer:estiloEdifiSemNec01,
    onEachFeature: onEachFeatureEdifiSemNec01,
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




var slideEdifiSemNec01 = function(){
    var sliderEdifiSemNec01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifiSemNec01, {
        start: [minEdifiSemNec01, maxEdifiSemNec01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifiSemNec01,
            'max': maxEdifiSemNec01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifiSemNec01);
    inputNumberMax.setAttribute("value",maxEdifiSemNec01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifiSemNec01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifiSemNec01.noUiSlider.set([null, this.value]);
    });

    sliderEdifiSemNec01.noUiSlider.on('update',function(e){
        EdifiSemNec01.eachLayer(function(layer){
            if(layer.feature.properties.EDI_SNEC01>=parseFloat(e[0])&& layer.feature.properties.EDI_SNEC01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifiSemNec01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderEdifiSemNec01.noUiSlider;
    $(slidersGeral).append(sliderEdifiSemNec01);
}
EdifiSemNec01.addTo(map);
$('#tituloMapa').html('<strong>' + 'Número de alojamentos sem necessidade de reparação, em 2001, por concelho.' + '</strong>');
legenda(maxEdifiSemNec01, ((maxEdifiSemNec01-minEdifiSemNec01)/2).toFixed(0),minEdifiSemNec01,0.2);
slideEdifiSemNec01();

///////////////////////////-------------------- FIM TOTAL EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\


//////////////////////////////////////////----------- EDIFICIOS SEM NECESSECIDADE DE REPARAÇÃO 2011 CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdifiSemNec11 = 0;
var maxEdifiSemNec11 = 0;
function estiloEdifiSemNec11(feature, latlng) {
    if(feature.properties.EDI_SNEC11< minEdifiSemNec11 || minEdifiSemNec11 ===0){
        minEdifiSemNec11 = feature.properties.EDI_SNEC11
    }
    if(feature.properties.EDI_SNEC11> maxEdifiSemNec11){
        maxEdifiSemNec11 = feature.properties.EDI_SNEC11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.EDI_SNEC11,0.2)
    });
}
function apagarEdifiSemNec11(e){
    var layer = e.target;
    EdifiSemNec11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifiSemNec11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios sem necessidade de reparação:  ' + '<b>' +feature.properties.EDI_SNEC11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifiSemNec11,
    })
};

var EdifiSemNec11= L.geoJSON(dadosAbsolutosConcelho,{
    pointToLayer:estiloEdifiSemNec11,
    onEachFeature: onEachFeatureEdifiSemNec11,
});

var slideEdifiSemNec11 = function(){
    var sliderEdifiSemNec11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifiSemNec11, {
        start: [minEdifiSemNec11, maxEdifiSemNec11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifiSemNec11,
            'max': maxEdifiSemNec11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifiSemNec11);
    inputNumberMax.setAttribute("value",maxEdifiSemNec11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifiSemNec11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifiSemNec11.noUiSlider.set([null, this.value]);
    });

    sliderEdifiSemNec11.noUiSlider.on('update',function(e){
        EdifiSemNec11.eachLayer(function(layer){
            if(layer.feature.properties.EDI_SNEC11>=parseFloat(e[0])&& layer.feature.properties.EDI_SNEC11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifiSemNec11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderEdifiSemNec11.noUiSlider;
    $(slidersGeral).append(sliderEdifiSemNec11);
}
///////////////////////////-------------------- FIM TOTAL EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM NECESSECIDADE DE REPARAÇÃO 2001 CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdifiComNec01 = 0;
var maxEdifiComNec01 = 0;
function estiloEdifiComNec01(feature, latlng) {
    if(feature.properties.EDI_CNEC01< minEdifiComNec01 || minEdifiComNec01 ===0){
        minEdifiComNec01 = feature.properties.EDI_CNEC01
    }
    if(feature.properties.EDI_CNEC01> maxEdifiComNec01){
        maxEdifiComNec01 = feature.properties.EDI_CNEC01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.EDI_CNEC01,0.2)
    });
}
function apagarEdifiComNec01(e){
    var layer = e.target;
    EdifiComNec01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifiComNec01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios com necessidade de reparação:  ' + '<b>' +feature.properties.EDI_CNEC01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifiComNec01,
    })
};

var EdifiComNec01= L.geoJSON(dadosAbsolutosConcelho,{
    pointToLayer:estiloEdifiComNec01,
    onEachFeature: onEachFeatureEdifiComNec01,
});

var slideEdifiComNec01 = function(){
    var sliderEdifiComNec01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifiComNec01, {
        start: [minEdifiComNec01, maxEdifiComNec01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifiComNec01,
            'max': maxEdifiComNec01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifiComNec01);
    inputNumberMax.setAttribute("value",maxEdifiComNec01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifiComNec01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifiComNec01.noUiSlider.set([null, this.value]);
    });

    sliderEdifiComNec01.noUiSlider.on('update',function(e){
        EdifiComNec01.eachLayer(function(layer){
            if(layer.feature.properties.EDI_CNEC01>=parseFloat(e[0])&& layer.feature.properties.EDI_CNEC01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifiComNec01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderEdifiComNec01.noUiSlider;
    $(slidersGeral).append(sliderEdifiComNec01);
}
///////////////////////////-------------------- FIM TOTAL EDIFICIOS COM NECESSIDADE DE REPARAÇÃO ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM NECESSECIDADE DE REPARAÇÃO 2011 CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdifiComNec11 = 0;
var maxEdifiComNec11 = 0;
function estiloEdifiComNec11(feature, latlng) {
    if(feature.properties.EDI_CNEC11< minEdifiComNec11 || minEdifiComNec11 ===0){
        minEdifiComNec11 = feature.properties.EDI_CNEC11
    }
    if(feature.properties.EDI_CNEC11> maxEdifiComNec11){
        maxEdifiComNec11 = feature.properties.EDI_CNEC11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.EDI_CNEC11,0.2)
    });
}
function apagarEdifiComNec11(e){
    var layer = e.target;
    EdifiComNec11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifiComNec11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios com necessidade de reparação:  ' + '<b>' +feature.properties.EDI_CNEC11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifiComNec11,
    })
};

var EdifiComNec11= L.geoJSON(dadosAbsolutosConcelho,{
    pointToLayer:estiloEdifiComNec11,
    onEachFeature: onEachFeatureEdifiComNec11,
});

var slideEdifiComNec11 = function(){
    var sliderEdifiComNec11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifiComNec11, {
        start: [minEdifiComNec11, maxEdifiComNec11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifiComNec11,
            'max': maxEdifiComNec11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifiComNec11);
    inputNumberMax.setAttribute("value",maxEdifiComNec11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifiComNec11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifiComNec11.noUiSlider.set([null, this.value]);
    });

    sliderEdifiComNec11.noUiSlider.on('update',function(e){
        EdifiComNec11.eachLayer(function(layer){
            if(layer.feature.properties.EDI_CNEC11>=parseFloat(e[0])&& layer.feature.properties.EDI_CNEC11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifiComNec11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderEdifiComNec11.noUiSlider;
    $(slidersGeral).append(sliderEdifiComNec11);
}
///////////////////////////-------------------- FIM TOTAL EDIFICIOS COM NECESSIDADE DE REPARAÇÃO ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS MUITO DEGRADADOS EM 2001, CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdifiMDegr01 = 0;
var maxEdifiMDegr01 = 0;
function estiloEdifiMDegr01(feature, latlng) {
    if(feature.properties.EDI_MDEG01< minEdifiMDegr01 || minEdifiMDegr01 ===0){
        minEdifiMDegr01 = feature.properties.EDI_MDEG01
    }
    if(feature.properties.EDI_MDEG01> maxEdifiMDegr01){
        maxEdifiMDegr01 = feature.properties.EDI_MDEG01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.EDI_MDEG01,0.45)
    });
}
function apagarEdifiMDegr01(e){
    var layer = e.target;
    EdifiMDegr01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifiMDegr01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios muito degradados:  ' + '<b>' +feature.properties.EDI_MDEG01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifiMDegr01,
    })
};

var EdifiMDegr01= L.geoJSON(dadosAbsolutosConcelho,{
    pointToLayer:estiloEdifiMDegr01,
    onEachFeature: onEachFeatureEdifiMDegr01,
});

var slideEdifiMDegr01 = function(){
    var sliderEdifiMDegr01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifiMDegr01, {
        start: [minEdifiMDegr01, maxEdifiMDegr01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifiMDegr01,
            'max': maxEdifiMDegr01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifiMDegr01);
    inputNumberMax.setAttribute("value",maxEdifiMDegr01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifiMDegr01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifiMDegr01.noUiSlider.set([null, this.value]);
    });

    sliderEdifiMDegr01.noUiSlider.on('update',function(e){
        EdifiMDegr01.eachLayer(function(layer){
            if(layer.feature.properties.EDI_MDEG01>=parseFloat(e[0])&& layer.feature.properties.EDI_MDEG01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifiMDegr01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderEdifiMDegr01.noUiSlider;
    $(slidersGeral).append(sliderEdifiMDegr01);
}
///////////////////////////-------------------- FIM TOTAL EDIFICIOS MUITO DEGRADADOS ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS MUITO DEGRADADOS EM 2011, CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdifiMDegr11 = 0;
var maxEdifiMDegr11 = 0;
function estiloEdifiMDegr11(feature, latlng) {
    if(feature.properties.EDI_MDEG11< minEdifiMDegr11 || minEdifiMDegr11 ===0){
        minEdifiMDegr11 = feature.properties.EDI_MDEG11
    }
    if(feature.properties.EDI_MDEG11> maxEdifiMDegr11){
        maxEdifiMDegr11 = feature.properties.EDI_MDEG11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.EDI_MDEG11,0.45)
    });
}
function apagarEdifiMDegr11(e){
    var layer = e.target;
    EdifiMDegr11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifiMDegr11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios muito degradados:  ' + '<b>' +feature.properties.EDI_MDEG11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifiMDegr11,
    })
};

var EdifiMDegr11= L.geoJSON(dadosAbsolutosConcelho,{
    pointToLayer:estiloEdifiMDegr11,
    onEachFeature: onEachFeatureEdifiMDegr11,
});

var slideEdifiMDegr11 = function(){
    var sliderEdifiMDegr11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifiMDegr11, {
        start: [minEdifiMDegr11, maxEdifiMDegr11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifiMDegr11,
            'max': maxEdifiMDegr11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifiMDegr11);
    inputNumberMax.setAttribute("value",maxEdifiMDegr11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifiMDegr11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifiMDegr11.noUiSlider.set([null, this.value]);
    });

    sliderEdifiMDegr11.noUiSlider.on('update',function(e){
        EdifiMDegr11.eachLayer(function(layer){
            if(layer.feature.properties.EDI_MDEG11>=parseFloat(e[0])&& layer.feature.properties.EDI_MDEG11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifiMDegr11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderEdifiMDegr11.noUiSlider;
    $(slidersGeral).append(sliderEdifiMDegr11);
}
///////////////////////////-------------------- FIM TOTAL EDIFICIOS MUITO DEGRADADOS ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\
/////////////////////////// -------------- FIM DADOS ABSOLUTOS, POR CONCELHO -------------------------\\\\\\\\\\\\\\\\\\\\\\\\
///////////////////////////----------------------- DADOS RELATIVOS, CONCELHO--------------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------- Percentagem de EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO por Concelho em 2001-----////////////////////////

var minPerEdiSemNecConc01 = 0;
var maxPerEdiSemNecConc01 = 0;

function CorPerSemNecessidadeConc(d) {
    return d >= 70.42 ? '#8c0303' :
        d >= 64.72  ? '#de1f35' :
        d >= 55.14 ? '#ff5e6e' :
        d >= 45.56   ? '#f5b3be' :
        d >= 35.98   ? '#F2C572' :
                ''  ;
}
var legendaPerSemNecessidadeConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 70.42' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 64.72 - 70.42' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 55.14 - 64.72' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 45.56 - 55.14' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 35.98 - 45.56' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEdiSemNecConc01(feature) {
    if( feature.properties.Per_SNEC01 <= minPerEdiSemNecConc01 || minPerEdiSemNecConc01 === 0){
        minPerEdiSemNecConc01 = feature.properties.Per_SNEC01
    }
    if(feature.properties.Per_SNEC01 >= maxPerEdiSemNecConc01 ){
        maxPerEdiSemNecConc01 = feature.properties.Per_SNEC01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSemNecessidadeConc(feature.properties.Per_SNEC01)
    };
}
function apagarPerEdiSemNecConc01(e) {
    PerEdiSemNecConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdiSemNecConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per_SNEC01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdiSemNecConc01,
    });
}
var PerEdiSemNecConc01= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloPerEdiSemNecConc01,
    onEachFeature: onEachFeaturePerEdiSemNecConc01
});
let slidePerEdiSemNecConc01 = function(){
    var sliderPerEdiSemNecConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdiSemNecConc01, {
        start: [minPerEdiSemNecConc01, maxPerEdiSemNecConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdiSemNecConc01,
            'max': maxPerEdiSemNecConc01
        },
        });
    inputNumberMin.setAttribute("value",minPerEdiSemNecConc01);
    inputNumberMax.setAttribute("value",maxPerEdiSemNecConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdiSemNecConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdiSemNecConc01.noUiSlider.set([null, this.value]);
    });

    sliderPerEdiSemNecConc01.noUiSlider.on('update',function(e){
        PerEdiSemNecConc01.eachLayer(function(layer){
            if(layer.feature.properties.Per_SNEC01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_SNEC01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdiSemNecConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderPerEdiSemNecConc01.noUiSlider;
    $(slidersGeral).append(sliderPerEdiSemNecConc01);
} 

/////////////////////////////////// Fim da Percentagem de EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO 2001 Concelho -------------- \\\\\\

/////////////////////------- Percentagem de EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO por Concelho em 2011-----////////////////////////

var minPerEdiSemNecConc11 = 0;
var maxPerEdiSemNecConc11 = 0;

function EstiloPerEdiSemNecConc11(feature) {
    if( feature.properties.Per_SNEC11 <= minPerEdiSemNecConc11 || minPerEdiSemNecConc11 === 0){
        minPerEdiSemNecConc11 = feature.properties.Per_SNEC11
    }
    if(feature.properties.Per_SNEC11 >= maxPerEdiSemNecConc11 ){
        maxPerEdiSemNecConc11 = feature.properties.Per_SNEC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSemNecessidadeConc(feature.properties.Per_SNEC11)
    };
}
function apagarPerEdiSemNecConc11(e) {
    PerEdiSemNecConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdiSemNecConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per_SNEC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdiSemNecConc11,
    });
}
var PerEdiSemNecConc11= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloPerEdiSemNecConc11,
    onEachFeature: onEachFeaturePerEdiSemNecConc11
});
let slidePerEdiSemNecConc11 = function(){
    var sliderPerEdiSemNecConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdiSemNecConc11, {
        start: [minPerEdiSemNecConc11, maxPerEdiSemNecConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdiSemNecConc11,
            'max': maxPerEdiSemNecConc11
        },
        });
    inputNumberMin.setAttribute("value",minPerEdiSemNecConc11);
    inputNumberMax.setAttribute("value",maxPerEdiSemNecConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdiSemNecConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdiSemNecConc11.noUiSlider.set([null, this.value]);
    });

    sliderPerEdiSemNecConc11.noUiSlider.on('update',function(e){
        PerEdiSemNecConc11.eachLayer(function(layer){
            if(layer.feature.properties.Per_SNEC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_SNEC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdiSemNecConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderPerEdiSemNecConc11.noUiSlider;
    $(slidersGeral).append(sliderPerEdiSemNecConc11);
} 

/////////////////////////////////// Fim da Percentagem de EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO 2011 Concelho -------------- \\\\\\

/////////////////////------- Percentagem de EDIFICIOS COM NECESSIDADE DE REPARAÇÃO por Concelho em 2001-----////////////////////////

var minPerEdiComNecConc01 = 0;
var maxPerEdiComNecConc01 = 0;

function CorPerComNecessidadeConc(d) {
    return d >= 53.04 ? '#8c0303' :
        d >= 48.29  ? '#de1f35' :
        d >= 40.37 ? '#ff5e6e' :
        d >= 32.44   ? '#f5b3be' :
        d >= 24.52   ? '#F2C572' :
                ''  ;
}
var legendaPerComNecessidadeConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 53.04' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 48.29 - 53.04' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 40.37 - 48.29' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 32.44 - 40.37' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 24.52 - 32.44' + '<br>'

    $(legendaA).append(symbolsContainer); 
}
function EstiloPerEdiComNecConc01(feature) {
    if( feature.properties.Per_CNEC01 <= minPerEdiComNecConc01 || minPerEdiComNecConc01 === 0){
        minPerEdiComNecConc01 = feature.properties.Per_CNEC01
    }
    if(feature.properties.Per_CNEC01 >= maxPerEdiComNecConc01 ){
        maxPerEdiComNecConc01 = feature.properties.Per_CNEC01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerComNecessidadeConc(feature.properties.Per_CNEC01)
    };
}
function apagarPerEdiComNecConc01(e) {
    PerEdiComNecConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdiComNecConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per_CNEC01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdiComNecConc01,
    });
}
var PerEdiComNecConc01= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloPerEdiComNecConc01,
    onEachFeature: onEachFeaturePerEdiComNecConc01
});
let slidePerEdiComNecConc01 = function(){
    var sliderPerEdiComNecConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdiComNecConc01, {
        start: [minPerEdiComNecConc01, maxPerEdiComNecConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdiComNecConc01,
            'max': maxPerEdiComNecConc01
        },
        });
    inputNumberMin.setAttribute("value",minPerEdiComNecConc01);
    inputNumberMax.setAttribute("value",maxPerEdiComNecConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdiComNecConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdiComNecConc01.noUiSlider.set([null, this.value]);
    });

    sliderPerEdiComNecConc01.noUiSlider.on('update',function(e){
        PerEdiComNecConc01.eachLayer(function(layer){
            if(layer.feature.properties.Per_CNEC01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_CNEC01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdiComNecConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderPerEdiComNecConc01.noUiSlider;
    $(slidersGeral).append(sliderPerEdiComNecConc01);
} 

/////////////////////////////////// Fim da Percentagem de EDIFICIOS COM NECESSIDADE DE REPARAÇÃO 2001 Concelho -------------- \\\\\\

/////////////////////------- Percentagem de EDIFICIOS COM NECESSIDADE DE REPARAÇÃO por Concelho em 2011-----////////////////////////

var minPerEdiComNecConc11 = 0;
var maxPerEdiComNecConc11 = 0;

function EstiloPerEdiComNecConc11(feature) {
    if( feature.properties.Per_CNEC11 <= minPerEdiComNecConc11 || minPerEdiComNecConc11 === 0){
        minPerEdiComNecConc11 = feature.properties.Per_CNEC11
    }
    if(feature.properties.Per_CNEC11 >= maxPerEdiComNecConc11 ){
        maxPerEdiComNecConc11 = feature.properties.Per_CNEC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerComNecessidadeConc(feature.properties.Per_CNEC11)
    };
}
function apagarPerEdiComNecConc11(e) {
    PerEdiComNecConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdiComNecConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per_CNEC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdiComNecConc11,
    });
}
var PerEdiComNecConc11= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloPerEdiComNecConc11,
    onEachFeature: onEachFeaturePerEdiComNecConc11
});
let slidePerEdiComNecConc11 = function(){
    var sliderPerEdiComNecConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdiComNecConc11, {
        start: [minPerEdiComNecConc11, maxPerEdiComNecConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdiComNecConc11,
            'max': maxPerEdiComNecConc11
        },
        });
    inputNumberMin.setAttribute("value",minPerEdiComNecConc11);
    inputNumberMax.setAttribute("value",maxPerEdiComNecConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdiComNecConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdiComNecConc11.noUiSlider.set([null, this.value]);
    });

    sliderPerEdiComNecConc11.noUiSlider.on('update',function(e){
        PerEdiComNecConc11.eachLayer(function(layer){
            if(layer.feature.properties.Per_CNEC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_CNEC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdiComNecConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderPerEdiComNecConc11.noUiSlider;
    $(slidersGeral).append(sliderPerEdiComNecConc11);
} 

/////////////////////////////////// Fim da Percentagem de EDIFICIOS COM NECESSIDADE DE REPARAÇÃO 2011 Concelho -------------- \\\\\\

/////////////////////------- Percentagem de EDIFICIOS MUITO DEGRADADOS por Concelho em 2001-----////////////////////////

var minPerEdiMuitoDegrConc01 = 0;
var maxPerEdiMuitoDegrConc01 = 0;

function CorPerMtDegradadoConc(d) {
    return d >= 7.1 ? '#8c0303' :
        d >= 6.03  ? '#de1f35' :
        d >= 4.25 ? '#ff5e6e' :
        d >= 2.46   ? '#f5b3be' :
        d >= 0.68   ? '#F2C572' :
                ''  ;
}
var legendaPerMtDegradadoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 7.1' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 6.03 - 7.1' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 4.25 - 6.03' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 2.46 - 4.25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.68 - 2.46' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEdiMuitoDegrConc01(feature) {
    if( feature.properties.Per_MDEG01 <= minPerEdiMuitoDegrConc01 || minPerEdiMuitoDegrConc01 === 0){
        minPerEdiMuitoDegrConc01 = feature.properties.Per_MDEG01
    }
    if(feature.properties.Per_MDEG01 >= maxPerEdiMuitoDegrConc01 ){
        maxPerEdiMuitoDegrConc01 = feature.properties.Per_MDEG01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerMtDegradadoConc(feature.properties.Per_MDEG01)
    };
}
function apagarPerEdiMuitoDegrConc01(e) {
    PerEdiMuitoDegrConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdiMuitoDegrConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per_MDEG01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdiMuitoDegrConc01,
    });
}
var PerEdiMuitoDegrConc01= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloPerEdiMuitoDegrConc01,
    onEachFeature: onEachFeaturePerEdiMuitoDegrConc01
});
let slidePerEdiMuitoDegrConc01 = function(){
    var sliderPerEdiMuitoDegrConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdiMuitoDegrConc01, {
        start: [minPerEdiMuitoDegrConc01, maxPerEdiMuitoDegrConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdiMuitoDegrConc01,
            'max': maxPerEdiMuitoDegrConc01
        },
        });
    inputNumberMin.setAttribute("value",minPerEdiMuitoDegrConc01);
    inputNumberMax.setAttribute("value",maxPerEdiMuitoDegrConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdiMuitoDegrConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdiMuitoDegrConc01.noUiSlider.set([null, this.value]);
    });

    sliderPerEdiMuitoDegrConc01.noUiSlider.on('update',function(e){
        PerEdiMuitoDegrConc01.eachLayer(function(layer){
            if(layer.feature.properties.Per_MDEG01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_MDEG01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdiMuitoDegrConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderPerEdiMuitoDegrConc01.noUiSlider;
    $(slidersGeral).append(sliderPerEdiMuitoDegrConc01);
} 

/////////////////////////////////// Fim da Percentagem de EDIFICIOS MUITO DEGRADADOS 2001 Concelho -------------- \\\\\\

/////////////////////------- Percentagem de EDIFICIOS MUITO DEGRADADOS por Concelho em 2011-----////////////////////////

var minPerEdiMuitoDegrConc11 = 0;
var maxPerEdiMuitoDegrConc11 = 0;

function EstiloPerEdiMuitoDegrConc11(feature) {
    if( feature.properties.Per_MDEG11 <= minPerEdiMuitoDegrConc11 || minPerEdiMuitoDegrConc11 === 0){
        minPerEdiMuitoDegrConc11 = feature.properties.Per_MDEG11
    }
    if(feature.properties.Per_MDEG11 >= maxPerEdiMuitoDegrConc11 ){
        maxPerEdiMuitoDegrConc11 = feature.properties.Per_MDEG11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerMtDegradadoConc(feature.properties.Per_MDEG11)
    };
}
function apagarPerEdiMuitoDegrConc11(e) {
    PerEdiMuitoDegrConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdiMuitoDegrConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per_MDEG11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdiMuitoDegrConc11,
    });
}
var PerEdiMuitoDegrConc11= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloPerEdiMuitoDegrConc11,
    onEachFeature: onEachFeaturePerEdiMuitoDegrConc11
});
let slidePerEdiMuitoDegrConc11 = function(){
    var sliderPerEdiMuitoDegrConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdiMuitoDegrConc11, {
        start: [minPerEdiMuitoDegrConc11, maxPerEdiMuitoDegrConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdiMuitoDegrConc11,
            'max': maxPerEdiMuitoDegrConc11
        },
        });
    inputNumberMin.setAttribute("value",minPerEdiMuitoDegrConc11);
    inputNumberMax.setAttribute("value",maxPerEdiMuitoDegrConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdiMuitoDegrConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdiMuitoDegrConc11.noUiSlider.set([null, this.value]);
    });

    sliderPerEdiMuitoDegrConc11.noUiSlider.on('update',function(e){
        PerEdiMuitoDegrConc11.eachLayer(function(layer){
            if(layer.feature.properties.Per_MDEG11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_MDEG11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdiMuitoDegrConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderPerEdiMuitoDegrConc11.noUiSlider;
    $(slidersGeral).append(sliderPerEdiMuitoDegrConc11);
} 

/////////////////////////////////// Fim da Percentagem de EDIFICIOS MUITO DEGRADADOS 2011 Concelho -------------- \\\\\\
/////////////////////////////////////--------------------- FIM DADOS RELATIVOS --------------------\\\\\\\\\\\\\\\\\\
///////////////////////////////////------------------ VARIAÇÕES, POR CONCELHO -------------------\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO 2001 e 1991 -------------------////

var minVarEdiSemNecConc11_01 = 0;
var maxVarEdiSemNecConc11_01 = 0;

function CorVarSemNecessidadeConc(d) {
    return d >= 40  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 20  ? '#ff5e6e' :
        d >= 15  ? '#f5b3be' :
        d >= 6.58   ? '#F2C572' :
                ''  ;
}

var legendaVarSemNecessidadeConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios sem necessidade de reparação, entre 2021 e 2011, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  30 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  20 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  15 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + '  6.58 a 15' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdiSemNecConc11_01(feature) {
    if(feature.properties.VarSEM_NEC <= minVarEdiSemNecConc11_01 || minVarEdiSemNecConc11_01 ===0){
        minVarEdiSemNecConc11_01 = feature.properties.VarSEM_NEC
    }
    if(feature.properties.VarSEM_NEC > maxVarEdiSemNecConc11_01){
        maxVarEdiSemNecConc11_01 = feature.properties.VarSEM_NEC 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarSemNecessidadeConc(feature.properties.VarSEM_NEC)};
    }


function apagarVarEdiSemNecConc11_01(e) {
    VarEdiSemNecConc11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdiSemNecConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarSEM_NEC.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdiSemNecConc11_01,
    });
}
var VarEdiSemNecConc11_01= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVarEdiSemNecConc11_01,
    onEachFeature: onEachFeatureVarEdiSemNecConc11_01
});

let slideVarEdiSemNecConc11_01 = function(){
    var sliderVarEdiSemNecConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdiSemNecConc11_01, {
        start: [minVarEdiSemNecConc11_01, maxVarEdiSemNecConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdiSemNecConc11_01,
            'max': maxVarEdiSemNecConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarEdiSemNecConc11_01);
    inputNumberMax.setAttribute("value",maxVarEdiSemNecConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdiSemNecConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdiSemNecConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarEdiSemNecConc11_01.noUiSlider.on('update',function(e){
        VarEdiSemNecConc11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarSEM_NEC.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarSEM_NEC.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdiSemNecConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderVarEdiSemNecConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVarEdiSemNecConc11_01);
} 

//////////////////////--------- Fim da Variação de EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO ENTRE 2011 E 2001 -------------- \\\\\\

/////////////////////////////------- Variação EDIFICIOS Com NECESSIDADE DE REPARAÇÃO 2011 e 2001 -------------------////

var minVarEdiComNecConc11_01 = 0;
var maxVarEdiComNecConc11_01 = 0;

function CorVarComNecessidadeConc(d) {
    return d >= 0  ? '#8c0303' :
        d >= -10  ? '#de1f35' :
        d >= -20  ? '#ff5e6e' :
        d >= -25  ? '#f5b3be' :
        d >= -29.38   ? '#9eaad7' :
                ''  ;
}

var legendaVarComNecessidadeConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com necessidade de reparação, entre 2021 e 2011, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' -20 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' -20 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' -25 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -29.38 a -25' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdiComNecConc11_01(feature) {
    if(feature.properties.VarCOM_NEC <= minVarEdiComNecConc11_01 || minVarEdiComNecConc11_01 ===0){
        minVarEdiComNecConc11_01 = feature.properties.VarCOM_NEC
    }
    if(feature.properties.VarCOM_NEC > maxVarEdiComNecConc11_01){
        maxVarEdiComNecConc11_01 = feature.properties.VarCOM_NEC 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarComNecessidadeConc(feature.properties.VarCOM_NEC)};
    }


function apagarVarEdiComNecConc11_01(e) {
    VarEdiComNecConc11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdiComNecConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCOM_NEC.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdiComNecConc11_01,
    });
}
var VarEdiComNecConc11_01= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVarEdiComNecConc11_01,
    onEachFeature: onEachFeatureVarEdiComNecConc11_01
});

let slideVarEdiComNecConc11_01 = function(){
    var sliderVarEdiComNecConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdiComNecConc11_01, {
        start: [minVarEdiComNecConc11_01, maxVarEdiComNecConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdiComNecConc11_01,
            'max': maxVarEdiComNecConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarEdiComNecConc11_01);
    inputNumberMax.setAttribute("value",maxVarEdiComNecConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdiComNecConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdiComNecConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarEdiComNecConc11_01.noUiSlider.on('update',function(e){
        VarEdiComNecConc11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarCOM_NEC.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarCOM_NEC.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdiComNecConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderVarEdiComNecConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVarEdiComNecConc11_01);
} 

//////////////////////--------- Fim da Variação de EDIFICIOS Com NECESSIDADE DE REPARAÇÃO ENTRE 2011 E 2001 -------------- \\\\\\

/////////////////////////////------- Variação EDIFICIOS MUITO DEGRADADOS 2011 e 2001 -------------------////

var minVarEdiMuitoDegrConc11_01 = 0;
var maxVarEdiMuitoDegrConc11_01 = -99;

function CorVarMtDegradadosConc(d) {
    return d >= -20  ? '#8FC1B5' :
        d >= -40  ? '#f5b3be' :
        d >= -50  ? '#9ebbd7' :
        d >= -60  ? '#2288bf' :
        d >= -70.94   ? '#155273' :
                ''  ;
}

var legendaVarMtDegradadosConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios muito degradados, entre 2021 e 2011, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8FC1B5"></i>' + '  > -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' -40 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -50 a -40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -60 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -70.93 a -60' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdiMuitoDegrConc11_01(feature) {
    if(feature.properties.VarMT_DEG <= minVarEdiMuitoDegrConc11_01 || minVarEdiMuitoDegrConc11_01 ===0){
        minVarEdiMuitoDegrConc11_01 = feature.properties.VarMT_DEG
    }
    if(feature.properties.VarMT_DEG > maxVarEdiMuitoDegrConc11_01){
        maxVarEdiMuitoDegrConc11_01 = feature.properties.VarMT_DEG 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarMtDegradadosConc(feature.properties.VarMT_DEG)};
    }


function apagarVarEdiMuitoDegrConc11_01(e) {
    VarEdiMuitoDegrConc11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdiMuitoDegrConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarMT_DEG.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdiMuitoDegrConc11_01,
    });
}
var VarEdiMuitoDegrConc11_01= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVarEdiMuitoDegrConc11_01,
    onEachFeature: onEachFeatureVarEdiMuitoDegrConc11_01
});

let slideVarEdiMuitoDegrConc11_01 = function(){
    var sliderVarEdiMuitoDegrConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdiMuitoDegrConc11_01, {
        start: [minVarEdiMuitoDegrConc11_01, maxVarEdiMuitoDegrConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdiMuitoDegrConc11_01,
            'max': maxVarEdiMuitoDegrConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarEdiMuitoDegrConc11_01);
    inputNumberMax.setAttribute("value",maxVarEdiMuitoDegrConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdiMuitoDegrConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdiMuitoDegrConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarEdiMuitoDegrConc11_01.noUiSlider.on('update',function(e){
        VarEdiMuitoDegrConc11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarMT_DEG.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarMT_DEG.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdiMuitoDegrConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderVarEdiMuitoDegrConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVarEdiMuitoDegrConc11_01);
} 

//////////////////////--------- Fim da Variação de EDIFICIOS MUITO DEGRADADOS ENTRE 2011 E 2001 -------------- \\\\\\
//////////////////////----------------------- FIM DADOS CONCELHOS ----------------------------\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS SEM NECESSECIDADE DE REPARAÇÃO 2001 FREGUESIA -------------------\\\\\\\\\\\\

var minEdifiSemNecFreg01 = 99;
var maxEdifiSemNecFreg01 = 0;
function estiloEdifiSemNecFreg01(feature, latlng) {
    if(feature.properties.SemN_EDI01< minEdifiSemNecFreg01){
        minEdifiSemNecFreg01 = feature.properties.SemN_EDI01
    }
    if(feature.properties.SemN_EDI01> maxEdifiSemNecFreg01){
        maxEdifiSemNecFreg01 = feature.properties.SemN_EDI01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.SemN_EDI01,0.25)
    });
}
function apagarEdifiSemNecFreg01(e){
    var layer = e.target;
    EdifiSemNecFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifiSemNecFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios sem necessidade de reparação: ' + '<b>' + feature.properties.SemN_EDI01.toFixed(0) + '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifiSemNecFreg01,
    })
};

var EdifiSemNecFreg01= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdifiSemNecFreg01,
    onEachFeature: onEachFeatureEdifiSemNecFreg01,
});

var slideEdifiSemNecFreg01 = function(){
    var sliderEdifiSemNecFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifiSemNecFreg01, {
        start: [minEdifiSemNecFreg01, maxEdifiSemNecFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifiSemNecFreg01,
            'max': maxEdifiSemNecFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifiSemNecFreg01);
    inputNumberMax.setAttribute("value",maxEdifiSemNecFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifiSemNecFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifiSemNecFreg01.noUiSlider.set([null, this.value]);
    });

    sliderEdifiSemNecFreg01.noUiSlider.on('update',function(e){
        EdifiSemNecFreg01.eachLayer(function(layer){
            if(layer.feature.properties.SemN_EDI01>=parseFloat(e[0])&& layer.feature.properties.SemN_EDI01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifiSemNecFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderEdifiSemNecFreg01.noUiSlider;
    $(slidersGeral).append(sliderEdifiSemNecFreg01);
}
///////////////////////////-------------------- FIM  EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO , FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS SEM NECESSECIDADE DE REPARAÇÃO 2011 FREGUESIA -------------------\\\\\\\\\\\\

var minEdifiSemNecFreg11 = 0;
var maxEdifiSemNecFreg11 = 0;
function estiloEdifiSemNecFreg11(feature, latlng) {
    if(feature.properties.SemN_EDI11< minEdifiSemNecFreg11 || minEdifiSemNecFreg11 ===0){
        minEdifiSemNecFreg11 = feature.properties.SemN_EDI11
    }
    if(feature.properties.SemN_EDI11> maxEdifiSemNecFreg11){
        maxEdifiSemNecFreg11 = feature.properties.SemN_EDI11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.SemN_EDI11,0.25)
    });
}
function apagarEdifiSemNecFreg11(e){
    var layer = e.target;
    EdifiSemNecFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifiSemNecFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios sem necessidade de reparação: ' + '<b>' + feature.properties.SemN_EDI11.toFixed(0) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifiSemNecFreg11,
    })
};

var EdifiSemNecFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdifiSemNecFreg11,
    onEachFeature: onEachFeatureEdifiSemNecFreg11,
});

var slideEdifiSemNecFreg11 = function(){
    var sliderEdifiSemNecFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifiSemNecFreg11, {
        start: [minEdifiSemNecFreg11, maxEdifiSemNecFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifiSemNecFreg11,
            'max': maxEdifiSemNecFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifiSemNecFreg11);
    inputNumberMax.setAttribute("value",maxEdifiSemNecFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifiSemNecFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifiSemNecFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdifiSemNecFreg11.noUiSlider.on('update',function(e){
        EdifiSemNecFreg11.eachLayer(function(layer){
            if(layer.feature.properties.SemN_EDI11>=parseFloat(e[0])&& layer.feature.properties.SemN_EDI11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifiSemNecFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderEdifiSemNecFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdifiSemNecFreg11);
}
///////////////////////////-------------------- FIM  EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO , FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM NECESSECIDADE DE REPARAÇÃO 2001 FREGUESIA -------------------\\\\\\\\\\\\

var minEdifiComNecFreg01 = 0;
var maxEdifiComNecFreg01 = 0;
function estiloEdifiComNecFreg01(feature, latlng) {
    if(feature.properties.ComN_EDI11< minEdifiComNecFreg01 || minEdifiComNecFreg01 ===0){
        minEdifiComNecFreg01 = feature.properties.ComN_EDI01
    }
    if(feature.properties.ComN_EDI01> maxEdifiComNecFreg01){
        maxEdifiComNecFreg01 = feature.properties.ComN_EDI01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ComN_EDI01,0.25)
    });
}
function apagarEdifiComNecFreg01(e){
    var layer = e.target;
    EdifiComNecFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifiComNecFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios com necessidade de reparação: ' + '<b>' + feature.properties.ComN_EDI01.toFixed(0) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifiComNecFreg01,
    })
};

var EdifiComNecFreg01= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdifiComNecFreg01,
    onEachFeature: onEachFeatureEdifiComNecFreg01,
});

var slideEdifiComNecFreg01 = function(){
    var sliderEdifiComNecFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifiComNecFreg01, {
        start: [minEdifiComNecFreg01, maxEdifiComNecFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifiComNecFreg01,
            'max': maxEdifiComNecFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifiComNecFreg01);
    inputNumberMax.setAttribute("value",maxEdifiComNecFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifiComNecFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifiComNecFreg01.noUiSlider.set([null, this.value]);
    });

    sliderEdifiComNecFreg01.noUiSlider.on('update',function(e){
        EdifiComNecFreg01.eachLayer(function(layer){
            if(layer.feature.properties.ComN_EDI01>=parseFloat(e[0])&& layer.feature.properties.ComN_EDI01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifiComNecFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderEdifiComNecFreg01.noUiSlider;
    $(slidersGeral).append(sliderEdifiComNecFreg01);
}
///////////////////////////-------------------- FIM  EDIFICIOS COM NECESSIDADE DE REPARAÇÃO , FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM NECESSECIDADE DE REPARAÇÃO 2011 FREGUESIA -------------------\\\\\\\\\\\\

var minEdifiComNecFreg11 = 0;
var maxEdifiComNecFreg11 = 0;
function estiloEdifiComNecFreg11(feature, latlng) {
    if(feature.properties.ComN_EDI11< minEdifiComNecFreg11 || minEdifiComNecFreg11 ===0){
        minEdifiComNecFreg11 = feature.properties.ComN_EDI11
    }
    if(feature.properties.ComN_EDI11> maxEdifiComNecFreg11){
        maxEdifiComNecFreg11 = feature.properties.ComN_EDI11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ComN_EDI11,0.25)
    });
}
function apagarEdifiComNecFreg11(e){
    var layer = e.target;
    EdifiComNecFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifiComNecFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios com necessidade de reparação: ' + '<b>' + feature.properties.ComN_EDI11.toFixed(0) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifiComNecFreg11,
    })
};

var EdifiComNecFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdifiComNecFreg11,
    onEachFeature: onEachFeatureEdifiComNecFreg11,
});

var slideEdifiComNecFreg11 = function(){
    var sliderEdifiComNecFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifiComNecFreg11, {
        start: [minEdifiComNecFreg11, maxEdifiComNecFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifiComNecFreg11,
            'max': maxEdifiComNecFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifiComNecFreg11);
    inputNumberMax.setAttribute("value",maxEdifiComNecFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifiComNecFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifiComNecFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdifiComNecFreg11.noUiSlider.on('update',function(e){
        EdifiComNecFreg11.eachLayer(function(layer){
            if(layer.feature.properties.ComN_EDI11>=parseFloat(e[0])&& layer.feature.properties.ComN_EDI11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifiComNecFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderEdifiComNecFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdifiComNecFreg11);
}
///////////////////////////-------------------- FIM  EDIFICIOS COM NECESSIDADE DE REPARAÇÃO , FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS MUITO DEGRADOS 2001 FREGUESIA -------------------\\\\\\\\\\\\

var minEdifiMuitoDegrFreg01 = 99;
var maxEdifiMuitoDegrFreg01 = 0;
function estiloEdifiMuitoDegrFreg01(feature, latlng) {
    if(feature.properties.Degr_EDI01< minEdifiMuitoDegrFreg01){
        minEdifiMuitoDegrFreg01 = feature.properties.Degr_EDI01
    }
    if(feature.properties.Degr_EDI01> maxEdifiMuitoDegrFreg01){
        maxEdifiMuitoDegrFreg01 = feature.properties.Degr_EDI01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Degr_EDI01,1)
    });
}
function apagarEdifiMuitoDegrFreg01(e){
    var layer = e.target;
    EdifiMuitoDegrFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifiMuitoDegrFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios muito degradados: ' + '<b>' + feature.properties.Degr_EDI01.toFixed(0) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifiMuitoDegrFreg01,
    })
};

var EdifiMuitoDegrFreg01= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdifiMuitoDegrFreg01,
    onEachFeature: onEachFeatureEdifiMuitoDegrFreg01,
});

var slideEdifiMuitoDegrFreg01 = function(){
    var sliderEdifiMuitoDegrFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifiMuitoDegrFreg01, {
        start: [minEdifiMuitoDegrFreg01, maxEdifiMuitoDegrFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifiMuitoDegrFreg01,
            'max': maxEdifiMuitoDegrFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifiMuitoDegrFreg01);
    inputNumberMax.setAttribute("value",maxEdifiMuitoDegrFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifiMuitoDegrFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifiMuitoDegrFreg01.noUiSlider.set([null, this.value]);
    });

    sliderEdifiMuitoDegrFreg01.noUiSlider.on('update',function(e){
        EdifiMuitoDegrFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Degr_EDI01>=parseFloat(e[0])&& layer.feature.properties.Degr_EDI01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifiMuitoDegrFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderEdifiMuitoDegrFreg01.noUiSlider;
    $(slidersGeral).append(sliderEdifiMuitoDegrFreg01);
}
///////////////////////////-------------------- FIM  EDIFICIOS MUITO DEGRADOS, FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS MUITO DEGRADOS 2011 FREGUESIA -------------------\\\\\\\\\\\\

var minEdifiMuitoDegrFreg11 = 99;
var maxEdifiMuitoDegrFreg11 = 0;
function estiloEdifiMuitoDegrFreg11(feature, latlng) {
    if(feature.properties.Degr_EDI11< minEdifiMuitoDegrFreg11){
        minEdifiMuitoDegrFreg11 = feature.properties.Degr_EDI11
    }
    if(feature.properties.Degr_EDI11> maxEdifiMuitoDegrFreg11){
        maxEdifiMuitoDegrFreg11 = feature.properties.Degr_EDI11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Degr_EDI11,1)
    });
}
function apagarEdifiMuitoDegrFreg11(e){
    var layer = e.target;
    EdifiMuitoDegrFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdifiMuitoDegrFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios muito degradados: ' + '<b>' + feature.properties.Degr_EDI11.toFixed(0) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdifiMuitoDegrFreg11,
    })
};

var EdifiMuitoDegrFreg11= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdifiMuitoDegrFreg11,
    onEachFeature: onEachFeatureEdifiMuitoDegrFreg11,
});

var slideEdifiMuitoDegrFreg11 = function(){
    var sliderEdifiMuitoDegrFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdifiMuitoDegrFreg11, {
        start: [minEdifiMuitoDegrFreg11, maxEdifiMuitoDegrFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdifiMuitoDegrFreg11,
            'max': maxEdifiMuitoDegrFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdifiMuitoDegrFreg11);
    inputNumberMax.setAttribute("value",maxEdifiMuitoDegrFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdifiMuitoDegrFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdifiMuitoDegrFreg11.noUiSlider.set([null, this.value]);
    });

    sliderEdifiMuitoDegrFreg11.noUiSlider.on('update',function(e){
        EdifiMuitoDegrFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Degr_EDI11>=parseFloat(e[0])&& layer.feature.properties.Degr_EDI11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdifiMuitoDegrFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderEdifiMuitoDegrFreg11.noUiSlider;
    $(slidersGeral).append(sliderEdifiMuitoDegrFreg11);
}
///////////////////////////-------------------- FIM  EDIFICIOS MUITO DEGRADOS, FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\
/////////////////////////-------------------- FIM DADOS ABSOLUTOS FREGUESIAS ------------------------\\\\\\\\\\\\\
/////////////////////////---------------------- DADOS RELATIVOS, FREGUESIAS -------------------\\\\\\\\\\\\\\\\\\

/////////////////////------- DADOS RELATIVOS de EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO por FREGUESIA em 2001-----////////////////////////

var minPerEdiSemNecFreg01 = 0;
var maxPerEdiSemNecFreg01 = 0;

function CorPerSemNecessidadeFreg(d) {
    return d >= 83.97 ? '#8c0303' :
        d >= 70.95  ? '#de1f35' :
        d >= 49.25 ? '#ff5e6e' :
        d >= 27.55   ? '#f5b3be' :
        d >= 5.85   ? '#F2C572' :
                ''  ;
}
var legendaPerSemNecessidadeFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 83.97' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 70.95 - 83.97' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 49.25 - 70.95' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 27.55 - 49.25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 5.85 - 27.55' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEdiSemNecFreg01(feature) {
    if( feature.properties.Per_SNEC01 <= minPerEdiSemNecFreg01 || minPerEdiSemNecFreg01 === 0){
        minPerEdiSemNecFreg01 = feature.properties.Per_SNEC01
    }
    if(feature.properties.Per_SNEC01 >= maxPerEdiSemNecFreg01 ){
        maxPerEdiSemNecFreg01 = feature.properties.Per_SNEC01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSemNecessidadeFreg(feature.properties.Per_SNEC01)
    };
}
function apagarPerEdiSemNecFreg01(e) {
    PerEdiSemNecFreg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdiSemNecFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per_SNEC01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdiSemNecFreg01,
    });
}
var PerEdiSemNecFreg01= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPerEdiSemNecFreg01,
    onEachFeature: onEachFeaturePerEdiSemNecFreg01
});
let slidePerEdiSemNecFreg01 = function(){
    var sliderPerEdiSemNecFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdiSemNecFreg01, {
        start: [minPerEdiSemNecFreg01, maxPerEdiSemNecFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdiSemNecFreg01,
            'max': maxPerEdiSemNecFreg01
        },
        });
    inputNumberMin.setAttribute("value",minPerEdiSemNecFreg01);
    inputNumberMax.setAttribute("value",maxPerEdiSemNecFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdiSemNecFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdiSemNecFreg01.noUiSlider.set([null, this.value]);
    });

    sliderPerEdiSemNecFreg01.noUiSlider.on('update',function(e){
        PerEdiSemNecFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Per_SNEC01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_SNEC01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdiSemNecFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderPerEdiSemNecFreg01.noUiSlider;
    $(slidersGeral).append(sliderPerEdiSemNecFreg01);
} 

/////////////////////////////////// Fim DADOS RELATIVOS EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO 2001 FREGUESIA -------------- \\\\\\

/////////////////////------- DADOS RELATIVOS de EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO por FREGUESIA em 2011-----////////////////////////

var minPerEdiSemNecFreg11 = 0;
var maxPerEdiSemNecFreg11 = 0;

function EstiloPerEdiSemNecFreg11(feature) {
    if( feature.properties.Per_SNEC11 <= minPerEdiSemNecFreg11 || minPerEdiSemNecFreg11 === 0){
        minPerEdiSemNecFreg11 = feature.properties.Per_SNEC11
    }
    if(feature.properties.Per_SNEC11 >= maxPerEdiSemNecFreg11 ){
        maxPerEdiSemNecFreg11 = feature.properties.Per_SNEC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSemNecessidadeFreg(feature.properties.Per_SNEC11)
    };
}
function apagarPerEdiSemNecFreg11(e) {
    PerEdiSemNecFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdiSemNecFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per_SNEC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdiSemNecFreg11,
    });
}
var PerEdiSemNecFreg11= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPerEdiSemNecFreg11,
    onEachFeature: onEachFeaturePerEdiSemNecFreg11
});
let slidePerEdiSemNecFreg11 = function(){
    var sliderPerEdiSemNecFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdiSemNecFreg11, {
        start: [minPerEdiSemNecFreg11, maxPerEdiSemNecFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdiSemNecFreg11,
            'max': maxPerEdiSemNecFreg11
        },
        });
    inputNumberMin.setAttribute("value",minPerEdiSemNecFreg11);
    inputNumberMax.setAttribute("value",maxPerEdiSemNecFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdiSemNecFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdiSemNecFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPerEdiSemNecFreg11.noUiSlider.on('update',function(e){
        PerEdiSemNecFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Per_SNEC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_SNEC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdiSemNecFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderPerEdiSemNecFreg11.noUiSlider;
    $(slidersGeral).append(sliderPerEdiSemNecFreg11);
} 

/////////////////////////////////// Fim DADOS RELATIVOS EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO 2011 FREGUESIA -------------- \\\\\\

/////////////////////------- DADOS RELATIVOS de EDIFICIOS COM NECESSIDADE DE REPARAÇÃO por FREGUESIA em 2001-----////////////////////////

var minPerEdiComNecFreg01 = 0;
var maxPerEdiComNecFreg01 = 0;

function CorPerComNecessidadeFreg(d) {
    return d >= 79.83 ? '#8c0303' :
        d >= 67.68  ? '#de1f35' :
        d >= 47.43 ? '#ff5e6e' :
        d >= 27.18  ? '#f5b3be' :
        d >= 6.93   ? '#F2C572' :
                ''  ;
}
var legendaPerComNecessidadeFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 79.83' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 67.68 - 79.83' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 47.43 - 67.68' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 27.18 - 47.43' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 6.93 - 27.18' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEdiComNecFreg01(feature) {
    if( feature.properties.Per_CNEC01 <= minPerEdiComNecFreg01 || minPerEdiComNecFreg01 === 0){
        minPerEdiComNecFreg01 = feature.properties.Per_CNEC01
    }
    if(feature.properties.Per_CNEC01 >= maxPerEdiComNecFreg01 ){
        maxPerEdiComNecFreg01 = feature.properties.Per_CNEC01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerComNecessidadeFreg(feature.properties.Per_CNEC01)
    };
}
function apagarPerEdiComNecFreg01(e) {
    PerEdiComNecFreg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdiComNecFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per_CNEC01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdiComNecFreg01,
    });
}
var PerEdiComNecFreg01= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPerEdiComNecFreg01,
    onEachFeature: onEachFeaturePerEdiComNecFreg01
});
let slidePerEdiComNecFreg01 = function(){
    var sliderPerEdiComNecFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdiComNecFreg01, {
        start: [minPerEdiComNecFreg01, maxPerEdiComNecFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdiComNecFreg01,
            'max': maxPerEdiComNecFreg01
        },
        });
    inputNumberMin.setAttribute("value",minPerEdiComNecFreg01);
    inputNumberMax.setAttribute("value",maxPerEdiComNecFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdiComNecFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdiComNecFreg01.noUiSlider.set([null, this.value]);
    });

    sliderPerEdiComNecFreg01.noUiSlider.on('update',function(e){
        PerEdiComNecFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Per_CNEC01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_CNEC01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdiComNecFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderPerEdiComNecFreg01.noUiSlider;
    $(slidersGeral).append(sliderPerEdiComNecFreg01);
} 

/////////////////////////////////// Fim DADOS RELATIVOS EDIFICIOS COM NECESSIDADE DE REPARAÇÃO 2001 FREGUESIA -------------- \\\\\\

/////////////////////------- DADOS RELATIVOS de EDIFICIOS COM NECESSIDADE DE REPARAÇÃO por FREGUESIA em 2011-----////////////////////////

var minPerEdiComNecFreg11 = 0;
var maxPerEdiComNecFreg11 = 0;

function EstiloPerEdiComNecFreg11(feature) {
    if( feature.properties.Per_CNEC11 <= minPerEdiComNecFreg11 || minPerEdiComNecFreg11 === 0){
        minPerEdiComNecFreg11 = feature.properties.Per_CNEC11
    }
    if(feature.properties.Per_CNEC11 >= maxPerEdiComNecFreg11 ){
        maxPerEdiComNecFreg11 = feature.properties.Per_CNEC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerComNecessidadeFreg(feature.properties.Per_CNEC11)
    };
}
function apagarPerEdiComNecFreg11(e) {
    PerEdiComNecFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdiComNecFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per_CNEC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdiComNecFreg11,
    });
}
var PerEdiComNecFreg11= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPerEdiComNecFreg11,
    onEachFeature: onEachFeaturePerEdiComNecFreg11
});
let slidePerEdiComNecFreg11 = function(){
    var sliderPerEdiComNecFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdiComNecFreg11, {
        start: [minPerEdiComNecFreg11, maxPerEdiComNecFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdiComNecFreg11,
            'max': maxPerEdiComNecFreg11
        },
        });
    inputNumberMin.setAttribute("value",minPerEdiComNecFreg11);
    inputNumberMax.setAttribute("value",maxPerEdiComNecFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdiComNecFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdiComNecFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPerEdiComNecFreg11.noUiSlider.on('update',function(e){
        PerEdiComNecFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Per_CNEC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_CNEC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdiComNecFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderPerEdiComNecFreg11.noUiSlider;
    $(slidersGeral).append(sliderPerEdiComNecFreg11);
} 

/////////////////////////////////// Fim DADOS RELATIVOS EDIFICIOS COM NECESSIDADE DE REPARAÇÃO 2011 FREGUESIA -------------- \\\\\\

/////////////////////------- DADOS RELATIVOS de EDIFICIOS MUITO DEGRADADOS por FREGUESIA em 2001-----////////////////////////

var minPerEdiMuitoDegrFreg01 = 99;
var maxPerEdiMuitoDegrFreg01 = 0;

function CorPerMtDegradadoFreg(d) {
    return d == 0 ? '#000000' :
        d >= 34.98 ? '#8c0303' :
        d >= 29.21  ? '#de1f35' :
        d >= 19.58 ? '#ff5e6e' :
        d >= 9.96  ? '#f5b3be' :
        d >= 0.01   ? '#F2C572' :
                ''  ;
}
var legendaPerMtDegradadoFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 34.98' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 29.21 - 34.98' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 19.58 - 29.21' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 9.96 - 19.58' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.33 - 9.96' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' 0' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEdiMuitoDegrFreg01(feature) {
    if( feature.properties.Per_MDEG01 <= minPerEdiMuitoDegrFreg01 || feature.properties.Per_MDEG01 === 0){
        minPerEdiMuitoDegrFreg01 = feature.properties.Per_MDEG01
    }
    if(feature.properties.Per_MDEG01 >= maxPerEdiMuitoDegrFreg01 ){
        maxPerEdiMuitoDegrFreg01 = feature.properties.Per_MDEG01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerMtDegradadoFreg(feature.properties.Per_MDEG01)
    };
}
function apagarPerEdiMuitoDegrFreg01(e) {
    PerEdiMuitoDegrFreg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdiMuitoDegrFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per_MDEG01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdiMuitoDegrFreg01,
    });
}
var PerEdiMuitoDegrFreg01= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPerEdiMuitoDegrFreg01,
    onEachFeature: onEachFeaturePerEdiMuitoDegrFreg01
});
let slidePerEdiMuitoDegrFreg01 = function(){
    var sliderPerEdiMuitoDegrFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdiMuitoDegrFreg01, {
        start: [minPerEdiMuitoDegrFreg01, maxPerEdiMuitoDegrFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdiMuitoDegrFreg01,
            'max': maxPerEdiMuitoDegrFreg01
        },
        });
    inputNumberMin.setAttribute("value",minPerEdiMuitoDegrFreg01);
    inputNumberMax.setAttribute("value",maxPerEdiMuitoDegrFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdiMuitoDegrFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdiMuitoDegrFreg01.noUiSlider.set([null, this.value]);
    });

    sliderPerEdiMuitoDegrFreg01.noUiSlider.on('update',function(e){
        PerEdiMuitoDegrFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Per_MDEG01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_MDEG01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdiMuitoDegrFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderPerEdiMuitoDegrFreg01.noUiSlider;
    $(slidersGeral).append(sliderPerEdiMuitoDegrFreg01);
} 

/////////////////////////////////// Fim DADOS RELATIVOS EDIFICIOS MUITO DEGRADADOS 2001 FREGUESIA -------------- \\\\\\

/////////////////////------- DADOS RELATIVOS de EDIFICIOS MUITO DEGRADADOS por FREGUESIA em 2011-----////////////////////////

var minPerEdiMuitoDegrFreg11 = 99;
var maxPerEdiMuitoDegrFreg11 = 0;

function EstiloPerEdiMuitoDegrFreg11(feature) {
    if( feature.properties.Per_MDEG11 <= minPerEdiMuitoDegrFreg11 || feature.properties.Per_MDEG11 === 0){
        minPerEdiMuitoDegrFreg11 = feature.properties.Per_MDEG11
    }
    if(feature.properties.Per_MDEG11 >= maxPerEdiMuitoDegrFreg11 ){
        maxPerEdiMuitoDegrFreg11 = feature.properties.Per_MDEG11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerMtDegradadoFreg(feature.properties.Per_MDEG11)
    };
}
function apagarPerEdiMuitoDegrFreg11(e) {
    PerEdiMuitoDegrFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdiMuitoDegrFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per_MDEG11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdiMuitoDegrFreg11,
    });
}
var PerEdiMuitoDegrFreg11= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPerEdiMuitoDegrFreg11,
    onEachFeature: onEachFeaturePerEdiMuitoDegrFreg11
});
let slidePerEdiMuitoDegrFreg11 = function(){
    var sliderPerEdiMuitoDegrFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdiMuitoDegrFreg11, {
        start: [minPerEdiMuitoDegrFreg11, maxPerEdiMuitoDegrFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdiMuitoDegrFreg11,
            'max': maxPerEdiMuitoDegrFreg11
        },
        });
    inputNumberMin.setAttribute("value",minPerEdiMuitoDegrFreg11);
    inputNumberMax.setAttribute("value",maxPerEdiMuitoDegrFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdiMuitoDegrFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdiMuitoDegrFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPerEdiMuitoDegrFreg11.noUiSlider.on('update',function(e){
        PerEdiMuitoDegrFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Per_MDEG11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_MDEG11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdiMuitoDegrFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderPerEdiMuitoDegrFreg11.noUiSlider;
    $(slidersGeral).append(sliderPerEdiMuitoDegrFreg11);
} 

/////////////////////////////////// Fim DADOS RELATIVOS EDIFICIOS MUITO DEGRADADOS 2011 FREGUESIA -------------- \\\\\\
///////////////////////////---------------------- FIM DADOS RELATIVOS FREGUESIA -----------------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////------------------ VARIAÇÃO FREGUESIAS ---------------------------------\\\\\\\\\\\\\\\\\\\
/////////////////////////////------- Variação EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO 2001 e 1991, FREGUESIA -------------------////

var minVarEdiSemNecFreg11_01 = 0;
var maxVarEdiSemNecFreg11_01 = 0;

function CorVarSemNecessidadeFreg(d) {
    return d >= 75  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -45.12   ? '#9eaad7' :
                ''  ;
}

var legendaVarSemNecessidadeFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios sem necessidade, entre 2021 e 2011, por freguesia' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -45.11 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdiSemNecFreg11_01(feature) {
    if(feature.properties.VarSEM_NEC <= minVarEdiSemNecFreg11_01 || minVarEdiSemNecFreg11_01 ===0){
        minVarEdiSemNecFreg11_01 = feature.properties.VarSEM_NEC
    }
    if(feature.properties.VarSEM_NEC > maxVarEdiSemNecFreg11_01){
        maxVarEdiSemNecFreg11_01 = feature.properties.VarSEM_NEC 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarSemNecessidadeFreg(feature.properties.VarSEM_NEC)};
    }


function apagarVarEdiSemNecFreg11_01(e) {
    VarEdiSemNecFreg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdiSemNecFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarSEM_NEC.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdiSemNecFreg11_01,
    });
}
var VarEdiSemNecFreg11_01= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarEdiSemNecFreg11_01,
    onEachFeature: onEachFeatureVarEdiSemNecFreg11_01
});

let slideVarEdiSemNecFreg11_01 = function(){
    var sliderVarEdiSemNecFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdiSemNecFreg11_01, {
        start: [minVarEdiSemNecFreg11_01, maxVarEdiSemNecFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdiSemNecFreg11_01,
            'max': maxVarEdiSemNecFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarEdiSemNecFreg11_01);
    inputNumberMax.setAttribute("value",maxVarEdiSemNecFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdiSemNecFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdiSemNecFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarEdiSemNecFreg11_01.noUiSlider.on('update',function(e){
        VarEdiSemNecFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarSEM_NEC.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarSEM_NEC.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdiSemNecFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderVarEdiSemNecFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarEdiSemNecFreg11_01);
} 

//////////////////////--------- Fim da Variação de EDIFICIOS SEM NECESSIDADE DE REPARAÇÃO ENTRE 2011 E 2001 -------------- \\\\\\

/////////////////////////////------- Variação EDIFICIOS COM NECESSIDADE DE REPARAÇÃO 2001 e 1991, FREGUESIA -------------------////

var minVarEdiComNecFreg11_01 = 0;
var maxVarEdiComNecFreg11_01 = 0;

function CorVarComNecessidadeFreg(d) {
    return d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -50  ? '#2288bf' :
        d >= -81.15   ? '#155273' :
                ''  ;
}

var legendaVarComNecessidadeFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com necessidade, entre 2021 e 2011, por freguesia' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -81.14 a -50' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdiComNecFreg11_01(feature) {
    if(feature.properties.VarCOM_NEC <= minVarEdiComNecFreg11_01 || minVarEdiComNecFreg11_01 ===0){
        minVarEdiComNecFreg11_01 = feature.properties.VarCOM_NEC
    }
    if(feature.properties.VarCOM_NEC > maxVarEdiComNecFreg11_01){
        maxVarEdiComNecFreg11_01 = feature.properties.VarCOM_NEC 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarComNecessidadeFreg(feature.properties.VarCOM_NEC)};
    }


function apagarVarEdiComNecFreg11_01(e) {
    VarEdiComNecFreg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdiComNecFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarCOM_NEC.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdiComNecFreg11_01,
    });
}
var VarEdiComNecFreg11_01= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarEdiComNecFreg11_01,
    onEachFeature: onEachFeatureVarEdiComNecFreg11_01
});

let slideVarEdiComNecFreg11_01 = function(){
    var sliderVarEdiComNecFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdiComNecFreg11_01, {
        start: [minVarEdiComNecFreg11_01, maxVarEdiComNecFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdiComNecFreg11_01,
            'max': maxVarEdiComNecFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarEdiComNecFreg11_01);
    inputNumberMax.setAttribute("value",maxVarEdiComNecFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdiComNecFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdiComNecFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarEdiComNecFreg11_01.noUiSlider.on('update',function(e){
        VarEdiComNecFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarCOM_NEC.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarCOM_NEC.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdiComNecFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderVarEdiComNecFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarEdiComNecFreg11_01);
} 

//////////////////////--------- Fim da Variação de EDIFICIOS COM NECESSIDADE DE REPARAÇÃO ENTRE 2011 E 2001 -------------- \\\\\\

/////////////////////////////------- Variação EDIFICIOS COM NECESSIDADE DE REPARAÇÃO 2001 e 1991, FREGUESIA -------------------////

var minVarEdiMuitoDegrFreg11_01 = 0;
var maxVarEdiMuitoDegrFreg11_01 = 0;

function CorVarMtDegradadoFreg(d) {
    return d === null ? '#808080':
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -50  ? '#2288bf' :
        d >= -75  ? '#155273' :
        d >= -101  ? '#0b2c40' :
                ''  ;
}

var legendaVarMtDegradadoFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios muito degradados, entre 2021 e 2011, por freguesia' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -75 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdiMuitoDegrFreg11_01(feature) {
    if(feature.properties.VarMT_DEG <= minVarEdiMuitoDegrFreg11_01 || minVarEdiMuitoDegrFreg11_01 ===0){
        minVarEdiMuitoDegrFreg11_01 = feature.properties.VarMT_DEG
    }
    if(feature.properties.VarMT_DEG > maxVarEdiMuitoDegrFreg11_01){
        maxVarEdiMuitoDegrFreg11_01 = feature.properties.VarMT_DEG 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarMtDegradadoFreg(feature.properties.VarMT_DEG)};
    }


function apagarVarEdiMuitoDegrFreg11_01(e) {
    VarEdiMuitoDegrFreg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdiMuitoDegrFreg11_01(feature, layer) {
    if(feature.properties.VarMT_DEG === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarMT_DEG.toFixed(2) + '</b>' + '%').openPopup()
    } 
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdiMuitoDegrFreg11_01,
    });
}
var VarEdiMuitoDegrFreg11_01= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarEdiMuitoDegrFreg11_01,
    onEachFeature: onEachFeatureVarEdiMuitoDegrFreg11_01
});

let slideVarEdiMuitoDegrFreg11_01 = function(){
    var sliderVarEdiMuitoDegrFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdiMuitoDegrFreg11_01, {
        start: [minVarEdiMuitoDegrFreg11_01, maxVarEdiMuitoDegrFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdiMuitoDegrFreg11_01,
            'max': maxVarEdiMuitoDegrFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarEdiMuitoDegrFreg11_01);
    inputNumberMax.setAttribute("value",maxVarEdiMuitoDegrFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdiMuitoDegrFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdiMuitoDegrFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarEdiMuitoDegrFreg11_01.noUiSlider.on('update',function(e){
        VarEdiMuitoDegrFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarMT_DEG == null){
                return false
            }
            if(layer.feature.properties.VarMT_DEG.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarMT_DEG.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdiMuitoDegrFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderVarEdiMuitoDegrFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarEdiMuitoDegrFreg11_01);
} 

//////////////////////--------- Fim da Variação de EDIFICIOS MUITO DEGRADADOS ENTRE 2011 E 2001 -------------- \\\\\\


var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Recenseamento da população e habitação';

/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = EdifiSemNec01;
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
    if (layer == EdifiSemNec01 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos sem necessidade de reparação, em 2001, por concelho.' + '</strong>');
        legenda(maxEdifiSemNec01, ((maxEdifiSemNec01-minEdifiSemNec01)/2).toFixed(0),minEdifiSemNec01,0.2);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifiSemNec01();
        naoDuplicar = 1;
    }
    if (layer == EdifiSemNec01 && naoDuplicar == 1){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos sem necessidade de reparação, em 2001, por concelho.' + '</strong>');
        contorno.addTo(map);
    } 
    if (layer == EdifiSemNec11 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos sem necessidade de reparação, em 2011, por concelho.' + '</strong>');
        legenda(maxEdifiSemNec11, ((maxEdifiSemNec11-minEdifiSemNec11)/2).toFixed(0),minEdifiSemNec11,0.2);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifiSemNec11();
        naoDuplicar = 2;
    }
    if (layer == EdifiComNec01 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos com necessidade de reparação, em 2001, por concelho.' + '</strong>');
        legenda(maxEdifiComNec01, ((maxEdifiComNec01-minEdifiComNec01)/2).toFixed(0),minEdifiComNec01,0.2);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifiComNec01();
        naoDuplicar = 3;
    }
    if (layer == EdifiComNec11 && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos com necessidade de reparação, em 2011, por concelho.' + '</strong>');
        legenda(maxEdifiComNec11, ((maxEdifiComNec11-minEdifiComNec11)/2).toFixed(0),minEdifiComNec11,0.2);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifiComNec11();
        naoDuplicar = 4;
    }
    if (layer == EdifiMDegr01 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos muito degradados, em 2001, por concelho.' + '</strong>');
        legenda(maxEdifiMDegr01, ((maxEdifiMDegr01-minEdifiMDegr01)/2).toFixed(0),minEdifiMDegr01,0.45);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifiMDegr01();
        naoDuplicar = 5;
    }
    if (layer == EdifiMDegr11 && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos muito degradados, em 2011, por concelho.' + '</strong>');
        legendaExcecao(maxEdifiMDegr11, ((maxEdifiMDegr11-minEdifiMDegr11)/2).toFixed(0),minEdifiMDegr11,0.45);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdifiMDegr11();
        naoDuplicar = 6;
    }
    if (layer == PerEdiSemNecConc01 && naoDuplicar != 7){
        legendaPerSemNecessidadeConc();
        slidePerEdiSemNecConc01();
        naoDuplicar = 7;
    }
    if (layer == PerEdiSemNecConc11 && naoDuplicar != 8){
        legendaPerSemNecessidadeConc();
        slidePerEdiSemNecConc11();
        naoDuplicar = 8;
    }
    if (layer == PerEdiComNecConc01 && naoDuplicar != 9){
        legendaPerComNecessidadeConc();
        slidePerEdiComNecConc01();
        naoDuplicar = 9;
    }
    if (layer == PerEdiComNecConc11 && naoDuplicar != 10){
        legendaPerComNecessidadeConc();
        slidePerEdiComNecConc11();
        naoDuplicar = 10;
    }
    if (layer == PerEdiMuitoDegrConc01 && naoDuplicar != 11){
        legendaPerMtDegradadoConc();
        slidePerEdiMuitoDegrConc01();
        naoDuplicar = 11;
    }
    if (layer == PerEdiMuitoDegrConc11 && naoDuplicar != 12){
        legendaPerMtDegradadoConc();
        slidePerEdiMuitoDegrConc11();
        naoDuplicar = 12;
    }
    if (layer == VarEdiSemNecConc11_01 && naoDuplicar != 13){
        legendaVarSemNecessidadeConc();
        slideVarEdiSemNecConc11_01();
        naoDuplicar = 13;
    }
    if (layer == VarEdiComNecConc11_01 && naoDuplicar != 14){
        legendaVarComNecessidadeConc();
        slideVarEdiComNecConc11_01();
        naoDuplicar = 14;
    }
    if (layer == VarEdiMuitoDegrConc11_01 && naoDuplicar != 15){
        legendaVarMtDegradadosConc();
        slideVarEdiMuitoDegrConc11_01();
        naoDuplicar = 15;
    }
    if (layer == EdifiSemNecFreg01 && naoDuplicar != 16){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos sem necessidade de reparação, em 2001, por freguesia.' + '</strong>');
        legenda(maxEdifiSemNecFreg01, ((maxEdifiSemNecFreg01-minEdifiSemNecFreg01)/2).toFixed(0),minEdifiSemNecFreg01,0.25);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideEdifiSemNecFreg01();
        naoDuplicar = 16;
    }
    if (layer == EdifiSemNecFreg01 && naoDuplicar == 16){
        contornoFreg2001.addTo(map);
    } 
    if (layer == EdifiSemNecFreg11 && naoDuplicar != 17){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos sem necessidade de reparação, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdifiSemNecFreg11, ((maxEdifiSemNecFreg11-minEdifiSemNecFreg11)/2).toFixed(0),minEdifiSemNecFreg11,0.25);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideEdifiSemNecFreg11();
        naoDuplicar = 17;
    }
    if (layer == EdifiComNecFreg01 && naoDuplicar != 18){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos com necessidade de reparação, em 2001, por freguesia.' + '</strong>');
        legenda(maxEdifiComNecFreg01, ((maxEdifiComNecFreg01-minEdifiComNecFreg01)/2).toFixed(0),minEdifiComNecFreg01,0.25);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideEdifiComNecFreg01();
        naoDuplicar = 18;
    }
    if (layer == EdifiComNecFreg11 && naoDuplicar != 19){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos com necessidade de reparação, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdifiComNecFreg11, ((maxEdifiComNecFreg11-minEdifiComNecFreg11)/2).toFixed(0),minEdifiComNecFreg11,0.25);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEdifiComNecFreg11();
        naoDuplicar = 19;
    }
    if (layer == EdifiMuitoDegrFreg01 && naoDuplicar != 20){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos muito degradados, em 2001, por freguesia.' + '</strong>');
        legenda(maxEdifiMuitoDegrFreg01, ((maxEdifiMuitoDegrFreg01-minEdifiMuitoDegrFreg01)/2).toFixed(0),minEdifiMuitoDegrFreg01,1);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEdifiMuitoDegrFreg01();
        naoDuplicar = 20;
    }
    if (layer == EdifiMuitoDegrFreg11 && naoDuplicar != 21){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos muito degradados, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdifiMuitoDegrFreg11, ((maxEdifiMuitoDegrFreg11-minEdifiMuitoDegrFreg11)/2).toFixed(0),minEdifiMuitoDegrFreg11,1);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEdifiMuitoDegrFreg11();
        naoDuplicar = 21;
    }
    if (layer == PerEdiSemNecFreg01 && naoDuplicar != 22){
        legendaPerSemNecessidadeFreg();
        slidePerEdiSemNecFreg01();
        naoDuplicar = 22;
    }
    if (layer == PerEdiSemNecFreg11 && naoDuplicar != 23){
        legendaPerSemNecessidadeFreg();
        slidePerEdiSemNecFreg11();
        naoDuplicar = 23;
    }
    if (layer == PerEdiComNecFreg01 && naoDuplicar != 24){
        legendaPerComNecessidadeFreg();
        slidePerEdiComNecFreg01();
        naoDuplicar = 24;
    }
    if (layer == PerEdiComNecFreg11 && naoDuplicar != 25){
        legendaPerComNecessidadeFreg();
        slidePerEdiComNecFreg11();
        naoDuplicar = 25;
    }
    if (layer == PerEdiMuitoDegrFreg01 && naoDuplicar != 26){
        legendaPerMtDegradadoFreg();
        slidePerEdiMuitoDegrFreg01();
        naoDuplicar = 26;
    }
    if (layer == PerEdiMuitoDegrFreg11 && naoDuplicar != 27){
        legendaPerMtDegradadoFreg();
        slidePerEdiMuitoDegrFreg11();
        naoDuplicar = 27;
    }
    if (layer == VarEdiSemNecFreg11_01 && naoDuplicar != 28){
        legendaVarSemNecessidadeFreg();
        slideVarEdiSemNecFreg11_01();
        naoDuplicar = 28;
    }
    if (layer == VarEdiComNecFreg11_01 && naoDuplicar != 29){
        legendaVarComNecessidadeFreg();
        slideVarEdiComNecFreg11_01();
        naoDuplicar = 29;
    }
    if (layer == VarEdiMuitoDegrFreg11_01 && naoDuplicar != 30){
        legendaVarMtDegradadoFreg();
        slideVarEdiMuitoDegrFreg11_01();
        naoDuplicar = 30;
    }
    layer.addTo(map);
    layerAtiva = layer;  
}
let notaRodape = function(){
    if ($('#notaRodape').length){
        $('#notaRodape').html("Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong>não devendo</strong>, assim, comparar com os restantes estados de conservação.")
    }
    else{
        $('#painel').append("<div id='notaRodape'></div>")
        $('#notaRodape').html("Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong>não devendo</strong>, assim, comparar com os restantes estados de conservação.")
    }
    $('#notaRodape').css("visibility","visible")
}
function myFunction() {
    var tipoEstado = document.getElementById("opcaoSelect").value;
    var anoSelecionado = document.getElementById("mySelect").value;
    if ($('#concelho').hasClass('active2')){
        if($('#absoluto').hasClass('active4')){
            if (anoSelecionado == "2001" && tipoEstado == "SNec"){
                novaLayer(EdifiSemNec01);
            };
            if (anoSelecionado == "2011" && tipoEstado == "SNec"){
                novaLayer(EdifiSemNec11);
            };
            if (anoSelecionado == "2001" && tipoEstado == "CNec"){
                novaLayer(EdifiComNec01);
            };
            if (anoSelecionado == "2011" && tipoEstado == "CNec"){
                novaLayer(EdifiComNec11);
            };
            if (tipoEstado == "Degr"){
                notaRodape();
                if (anoSelecionado == "2001"){
                    novaLayer(EdifiMDegr01);
                };
                if (anoSelecionado == "2011"){
                    novaLayer(EdifiMDegr11);
                };
            }
            if (tipoEstado != "Degr"){
                $('#notaRodape').remove();
            }
        }
        if($('#taxaVariacao').hasClass('active4')){
            if (anoSelecionado == "2001" && tipoEstado == "SNec"){
                novaLayer(VarEdiSemNecConc11_01);
            }; 
            if (anoSelecionado == "2001" && tipoEstado == "CNec"){
                novaLayer(VarEdiComNecConc11_01);
            }; 
            if (anoSelecionado == "2001" && tipoEstado == "Degr"){
                novaLayer(VarEdiMuitoDegrConc11_01);
            }; 
        }
        if ($('#percentagem').hasClass('active4')){
            if (anoSelecionado == "2001" && tipoEstado == "SNec"){
                novaLayer(PerEdiSemNecConc01);
            }; 
            if (anoSelecionado == "2011" && tipoEstado == "SNec"){
                novaLayer(PerEdiSemNecConc11);
            }; 
            if (anoSelecionado == "2001" && tipoEstado == "CNec"){
                novaLayer(PerEdiComNecConc01);
            }; 
            if (anoSelecionado == "2011" && tipoEstado == "CNec"){
                novaLayer(PerEdiComNecConc11);
            }; 
            if (anoSelecionado == "2001" && tipoEstado == "Degr"){
                novaLayer(PerEdiMuitoDegrConc01);
            }; 
            if (anoSelecionado == "2011" && tipoEstado == "Degr"){
                novaLayer(PerEdiMuitoDegrConc11);
            }; 
            
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if($('#absoluto').hasClass('active5')){
            if (anoSelecionado == "2001" && tipoEstado == "SNec"){
                novaLayer(EdifiSemNecFreg01);
            };
            if (anoSelecionado == "2011" && tipoEstado == "SNec"){
                novaLayer(EdifiSemNecFreg11);
            };  
            if (anoSelecionado == "2001" && tipoEstado == "CNec"){
                novaLayer(EdifiComNecFreg01);
            };
            if (anoSelecionado == "2011" && tipoEstado == "CNec"){
                novaLayer(EdifiComNecFreg11);
            };  
            if (tipoEstado == "Degr"){
                notaRodape();
                if (anoSelecionado == "2001"){
                    novaLayer(EdifiMuitoDegrFreg01);
                }
                if (anoSelecionado == "2011"){
                    novaLayer(EdifiMuitoDegrFreg11);
                }
            }  
            if (tipoEstado != "Degr"){
                $('#notaRodape').remove();
            } 
        }
        if($('#taxaVariacao').hasClass('active5')){
            $('#notaRodape').remove();
            if (anoSelecionado == "2001" && tipoEstado == "SNec"){
                novaLayer(VarEdiSemNecFreg11_01);
            };
            if (anoSelecionado == "2001" && tipoEstado == "CNec"){
                novaLayer(VarEdiComNecFreg11_01);
            }; 
            if (anoSelecionado == "2001" && tipoEstado == "Degr"){
                novaLayer(VarEdiMuitoDegrFreg11_01);
            }; 
        }
        if($('#percentagem').hasClass('active5')){
            $('#notaRodape').remove();
            if (anoSelecionado == "2001" && tipoEstado == "SNec"){
                novaLayer(PerEdiSemNecFreg01);
            }
            if (anoSelecionado == "2011" && tipoEstado == "SNec"){
                novaLayer(PerEdiSemNecFreg11);
            }
            if (anoSelecionado == "2001" && tipoEstado == "CNec"){
                novaLayer(PerEdiComNecFreg01);
            }
            if (anoSelecionado == "2011" && tipoEstado == "CNec"){
                novaLayer(PerEdiComNecFreg11);
            }
            if (anoSelecionado == "2001" && tipoEstado == "Degr"){
                novaLayer(PerEdiMuitoDegrFreg01);
            }
            if (anoSelecionado == "2011" && tipoEstado == "Degr"){
                novaLayer(PerEdiMuitoDegrFreg11);
            }
        }
    }
}


let primeirovalor = function(){
    $("#mySelect").val('2001');
    $("#opcaoSelect").val('SNec')
    
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
let reporAnos = function(){
    if ($("#mySelect option[value='2001']").length == 0){
        $('#mySelect').append("<option value='2001'>2001</option>")
    }
    if ($("#mySelect option[value='2001']").length > 0){
        $('#mySelect')[0].options[0].innerHTML = "2001";
    }
    if ($("#mySelect option[value='2011']").length == 0){
        $('#mySelect').append("<option value='2011'>2011</option>")
    }
    primeirovalor();
}
$('#mySelect').change(function(){
    myFunction();
})
$('#opcaoSelect').change(function(){
    myFunction();
})
let reporAnosVariacao = function(){
    $('#mySelect').empty();
    $('#mySelect').append("<option value='2001'>2011 - 2001</option>");
    primeirovalor();
}
function mudarEscala(){
    reporAnos();
    primeirovalor();
    tamanhoOutros();
    fonteTitulo('N');
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
    $('#tituloMapa').html('Número de edifícios, segundo o estado de construção, entre 2001 e 2021, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EstadoConservacaoProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html("2001")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.EstadoConservacao == "Muito degradado"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.EstadoConservacao+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2011.toLocaleString("fr")+'</td>';  
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.EstadoConservacao+'</td>';
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
    $('#tituloMapa').html('Proporção do número de edifícios, segundo o estado de construção, entre 2001 e 2021, %.');
        $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EstadoConservacaoProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html("2001")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.EstadoConservacao == "Muito degradado"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.EstadoConservacao+'</td>';
                    dados += '<td class="borderbottom">'+value.Per01+'</td>';
                    dados += '<td class="borderbottom">'+value.Per11+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.EstadoConservacao+'</td>';
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
    $('#tituloMapa').html('Variação do número de edifícios, segundo o estado de construção, entre 2001 e 2021, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EstadoConservacaoProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.EstadoConservacao == "Muito degradado"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.EstadoConservacao+'</td>';
                    dados += '<td class="borderbottom">'+ ''+'</td>';
                    dados += '<td class="borderbottom">'+value.VAR1101+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.EstadoConservacao+'</td>';
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
    let anoSelecionado = document.getElementById("mySelect").value;
    if ($('#freguesias').hasClass("active2")){
        if (anoSelecionado != "2011"){
            i = 1
        }
        if (anoSelecionado == "2001"){
            i = 0;
        }
    }
    if ($('#concelho').hasClass("active2")){
        if (anoSelecionado != "2011"){
            i = 1
        }
        if (anoSelecionado == "2001"){
            i = 0;
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
