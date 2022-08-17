
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'


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
        opacity: 0.7,
        color: 'black',
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
/////////////////////------ POPULAÇÃO RESIDENTE EM 1991, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalPopResiCon91 = 0;
var maxTotalPopResiCon91 = 0;
function estiloTotalPopResiCon91(feature, latlng) {
    if(feature.properties.Pop_Resi91< minTotalPopResiCon91 || minTotalPopResiCon91 ===0){
        minTotalPopResiCon91 = feature.properties.Pop_Resi91
    }
    if(feature.properties.Pop_Resi91> maxTotalPopResiCon91){
        maxTotalPopResiCon91 = feature.properties.Pop_Resi91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Pop_Resi91,0.1)
    });
}
function apagarTotalPopResiCon91(e){
    var layer = e.target;
    TotalPopResiCon91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopResiCon91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.Pop_Resi91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopResiCon91,
    })
};

var TotalPopResiCon91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloTotalPopResiCon91,
    onEachFeature: onEachFeatureTotalPopResiCon91,
});


var legenda = function(tituloescrito, maximo,medio,minimo, multiplicador) {
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




var slideTotalPopResiCon91 = function(){
    var sliderTotalPopResiCon91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopResiCon91, {
        start: [minTotalPopResiCon91, maxTotalPopResiCon91],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalPopResiCon91,
            'max': maxTotalPopResiCon91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalPopResiCon91);
    inputNumberMax.setAttribute("value",maxTotalPopResiCon91);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopResiCon91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopResiCon91.noUiSlider.set([null, this.value]);
    });

    sliderTotalPopResiCon91.noUiSlider.on('update',function(e){
        TotalPopResiCon91.eachLayer(function(layer){
            if(layer.feature.properties.Pop_Resi91>=parseFloat(e[0])&& layer.feature.properties.Pop_Resi91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopResiCon91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderTotalPopResiCon91.noUiSlider;
    $(slidersGeral).append(sliderTotalPopResiCon91);
}
TotalPopResiCon91.addTo(map);
legenda('Nº de Residentes em 1991, por concelho',maxTotalPopResiCon91, (maxTotalPopResiCon91-minTotalPopResiCon91)/2,minTotalPopResiCon91,0.1);
slideTotalPopResiCon91();


///////////////////////////-------------------- FIM POPULAÇÃO RESIDENTE CONCELHO 1991 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ POPULAÇÃO RESIDENTE EM 2001, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalPopResiCon01 = 0;
var maxTotalPopResiCon01 = 0;
function estiloTotalPopResiCon01(feature, latlng) {
    if(feature.properties.Pop_Resi01< minTotalPopResiCon01 || minTotalPopResiCon01 ===0){
        minTotalPopResiCon01 = feature.properties.Pop_Resi01
    }
    if(feature.properties.Pop_Resi01> maxTotalPopResiCon01){
        maxTotalPopResiCon01 = feature.properties.Pop_Resi01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Pop_Resi01,0.1)
    });
}
function apagarTotalPopResiCon01(e){
    var layer = e.target;
    TotalPopResiCon01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopResiCon01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.Pop_Resi01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopResiCon01,
    })
};

var TotalPopResiCon01= L.geoJSON(dadosAbsolutosConcelhos2111,{
    pointToLayer:estiloTotalPopResiCon01,
    onEachFeature: onEachFeatureTotalPopResiCon01,
});

var slideTotalPopResiCon01 = function(){
    var sliderTotalPopResiCon01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopResiCon01, {
        start: [minTotalPopResiCon01, maxTotalPopResiCon01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalPopResiCon01,
            'max': maxTotalPopResiCon01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalPopResiCon01);
    inputNumberMax.setAttribute("value",maxTotalPopResiCon01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopResiCon01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopResiCon01.noUiSlider.set([null, this.value]);
    });

    sliderTotalPopResiCon01.noUiSlider.on('update',function(e){
        TotalPopResiCon01.eachLayer(function(layer){
            if(layer.feature.properties.Pop_Resi01>=parseFloat(e[0])&& layer.feature.properties.Pop_Resi01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopResiCon01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderTotalPopResiCon01.noUiSlider;
    $(slidersGeral).append(sliderTotalPopResiCon01);
}

///////////////////////////-------------------- FIM POPULAÇÃO RESIDENTE CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ POPULAÇÃO RESIDENTE EM 2011, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalPopResiCon11 = 0;
var maxTotalPopResiCon11 = 0;
function estiloTotalPopResiCon11(feature, latlng) {
    if(feature.properties.Pop_Resi11< minTotalPopResiCon11 || minTotalPopResiCon11 ===0){
        minTotalPopResiCon11 = feature.properties.Pop_Resi11
    }
    if(feature.properties.Pop_Resi11> maxTotalPopResiCon11){
        maxTotalPopResiCon11 = feature.properties.Pop_Resi11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Pop_Resi11,0.1)
    });
}
function apagarTotalPopResiCon11(e){
    var layer = e.target;
    TotalPopResiCon11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopResiCon11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.Pop_Resi11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopResiCon11,
    })
};

var TotalPopResiCon11= L.geoJSON(dadosAbsolutosConcelhos2111,{
    pointToLayer:estiloTotalPopResiCon11,
    onEachFeature: onEachFeatureTotalPopResiCon11,
});

var slideTotalPopResiCon11 = function(){
    var sliderTotalPopResiCon11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopResiCon11, {
        start: [minTotalPopResiCon11, maxTotalPopResiCon11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalPopResiCon11,
            'max': maxTotalPopResiCon11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalPopResiCon11);
    inputNumberMax.setAttribute("value",maxTotalPopResiCon11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopResiCon11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopResiCon11.noUiSlider.set([null, this.value]);
    });

    sliderTotalPopResiCon11.noUiSlider.on('update',function(e){
        TotalPopResiCon11.eachLayer(function(layer){
            if(layer.feature.properties.Pop_Resi11>=parseFloat(e[0])&& layer.feature.properties.Pop_Resi11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopResiCon11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderTotalPopResiCon11.noUiSlider;
    $(slidersGeral).append(sliderTotalPopResiCon11);
}

///////////////////////////-------------------- FIM POPULAÇÃO RESIDENTE CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ POPULAÇÃO RESIDENTE EM 2021, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalPopResiCon21 = 0;
var maxTotalPopResiCon21 = 0;
function estiloTotalPopResiCon21(feature, latlng) {
    if(feature.properties.Pop_Resi21< minTotalPopResiCon21 || minTotalPopResiCon21 ===0){
        minTotalPopResiCon21 = feature.properties.Pop_Resi21
    }
    if(feature.properties.Pop_Resi21> maxTotalPopResiCon21){
        maxTotalPopResiCon21 = feature.properties.Pop_Resi21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Pop_Resi21,0.1)
    });
}
function apagarTotalPopResiCon21(e){
    var layer = e.target;
    TotalPopResiCon21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopResiCon21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.Pop_Resi21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopResiCon21,
    })
};

var TotalPopResiCon21= L.geoJSON(dadosAbsolutosConcelhos2111,{
    pointToLayer:estiloTotalPopResiCon21,
    onEachFeature: onEachFeatureTotalPopResiCon21,
});

var slideTotalPopResiCon21 = function(){
    var sliderTotalPopResiCon21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopResiCon21, {
        start: [minTotalPopResiCon21, maxTotalPopResiCon21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalPopResiCon21,
            'max': maxTotalPopResiCon21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalPopResiCon21);
    inputNumberMax.setAttribute("value",maxTotalPopResiCon21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopResiCon21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopResiCon21.noUiSlider.set([null, this.value]);
    });

    sliderTotalPopResiCon21.noUiSlider.on('update',function(e){
        TotalPopResiCon21.eachLayer(function(layer){
            if(layer.feature.properties.Pop_Resi21>=parseFloat(e[0])&& layer.feature.properties.Pop_Resi21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopResiCon21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderTotalPopResiCon21.noUiSlider;
    $(slidersGeral).append(sliderTotalPopResiCon21);
}

///////////////////////////-------------------- FIM POPULAÇÃO RESIDENTE CONCELHO 2021 -----------\\\\\\\\\\\\\\\\\\\\\\
////////////////////// --------------------- FIM DADOS ABSOLUTOS CONCELHOS ----------------\\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////-------  Variação DA POPULAÇÃO, CONCELHOS 2001 - 1991-----/////

function CorVariacoes(d) {
    return d === null ? '#A9A9A9':
    d >= 100 ? '#ff7f7f' :
    d >= 80  ? '#ff9589' :
    d >= 60   ? '#ffab93' :
    d >= 40 ? '#ffc09c' :
    d >= 20 ? '#ffd6a6' :
    d >=  0  ? '#ffebaf' :
    d >= -20  ? '#d2d7b3' :
    d >= -40  ? '#a6c3b6' :
    d >= -60   ? '#7aafb9' :
    d >= -80 ? '#4e9bbc':
    d >= -100   ? '#2288bf' :
              '';
}

function CorVarConc91(d) {
    return  d == null ? '#a6a6a6' :
        d > 25 ? '#ff5e6e' :
        d >= 10  ? '#f5b3be' :
        d >= 0  ? '#faceb7' :
        d >= -4  ? '#9eaad7' :
        d >= -14   ? '#2288bf' :
                ''  ;
}
var minVarPopConc01_91 = 0;
var maxVarPopConc01_91 = 0;

var legendaVariacaoConc91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da população residente entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 10 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#faceb7"></i>' + ' 0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -4 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -14 a -4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a6a6a6"></i>' + ' sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.9")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarPopConc01_91(feature) {
    if(feature.properties.Var01_91 <= minVarPopConc01_91 || minVarPopConc01_91 ===0){
        minVarPopConc01_91 = feature.properties.Var01_91
    }
    if(feature.properties.Var01_91 > maxVarPopConc01_91){
        maxVarPopConc01_91 = feature.properties.Var01_91
    }
    return {
        weight: 1,
        opacity: 0.9,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.9,
        fillColor: CorVarConc91(feature.properties.Var01_91)};
    }


function apagarVarPopConc01_91(e) {
    VarPopConc01_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarPopConc01_91(feature, layer) {
    if(feature.properties.Var01_91 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var01_91.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarPopConc01_91,
    });
}
var VarPopConc01_91= L.geoJSON(dadosRelativosConcelhos2101, {
    style:EstiloVarPopConc01_91,
    onEachFeature: onEachFeatureVarPopConc01_91
});

let slideVarPopConc01_91 = function(){
    var sliderVarPopConc01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarPopConc01_91, {
        start: [minVarPopConc01_91, maxVarPopConc01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarPopConc01_91,
            'max': maxVarPopConc01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarPopConc01_91);
    inputNumberMax.setAttribute("value",maxVarPopConc01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarPopConc01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarPopConc01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarPopConc01_91.noUiSlider.on('update',function(e){
        VarPopConc01_91.eachLayer(function(layer){
            if(!layer.feature.properties.Var01_91){
                return false
            }
            if(layer.feature.properties.Var01_91>=parseFloat(e[0])&& layer.feature.properties.Var01_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarPopConc01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderVarPopConc01_91.noUiSlider;
    $(slidersGeral).append(sliderVarPopConc01_91);
} 

////////////////////--------------- Fim da Variação do NÍVEL NENHUM ENTRE 2001 E 1991 -------------- \\\\\\

////////////////////////////////-------  Variação DA POPULAÇÃO, CONCELHOS 2011 - 2001-----/////

var minVarPopConc11_01 = 0;
var maxVarPopConc11_01 = 0;

function CorVarConc01(d) {
    return  d == null ? '#a6a6a6' :
        d > 9 ? '#ff5e6e' :
        d >= 5  ? '#f5b3be' :
        d >= 0  ? '#faceb7' :
        d >= -5  ? '#9eaad7' :
        d >= -10   ? '#2288bf' :
                ''  ;
}

var legendaVariacaoConc01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da população residente entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' > 9' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 5 a 9' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#faceb7"></i>' + ' 0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.9")
    
    $(legendaA).append(symbolsContainer); 
}
function EstiloVarPopConc11_01(feature) {
    if(feature.properties.Var11_01 <= minVarPopConc11_01 || minVarPopConc11_01 ===0){
        minVarPopConc11_01 = feature.properties.Var11_01
    }
    if(feature.properties.Var11_01 > maxVarPopConc11_01){
        maxVarPopConc11_01 = feature.properties.Var11_01
    }
    return {
        weight: 1,
        opacity: 0.9,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.9,
        fillColor: CorVarConc01(feature.properties.Var11_01)};
    }


function apagarVarPopConc11_01(e) {
    VarPopConc11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarPopConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarPopConc11_01,
    });
}
var VarPopConc11_01= L.geoJSON(dadosRelativosConcelhos2101, {
    style:EstiloVarPopConc11_01,
    onEachFeature: onEachFeatureVarPopConc11_01
});

let slideVarPopConc11_01 = function(){
    var sliderVarPopConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarPopConc11_01, {
        start: [minVarPopConc11_01, maxVarPopConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarPopConc11_01,
            'max': maxVarPopConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarPopConc11_01);
    inputNumberMax.setAttribute("value",maxVarPopConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarPopConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarPopConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarPopConc11_01.noUiSlider.on('update',function(e){
        VarPopConc11_01.eachLayer(function(layer){
            if(layer.feature.properties.Var11_01>=parseFloat(e[0])&& layer.feature.properties.Var11_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarPopConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderVarPopConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVarPopConc11_01);
} 

////////////////////--------------- Fim da Variação do NÍVEL NENHUM ENTRE 2011 E 2001 -------------- \\\\\\

////////////////////////////////-------  Variação DA POPULAÇÃO, CONCELHOS 2021 - 2011-----/////

var minVarPopConc21_11 = 0;
var maxVarPopConc21_11 = 0;

function CorVarConc11(d) {
    return  d == null ? '#a6a6a6' :
        d >= 0  ? '#f5b3be' :
        d >= -2.5  ? '#CCD3D9' :
        d >= -5  ? '#9eaad7' :
        d >= -7   ? '#2288bf' :
                ''  ;
}

var legendaVariacaoConc11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da população residente entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#CCD3D9"></i>' + '-3 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a -2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -7 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.9")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarPopConc21_11(feature) {
    if(feature.properties.Var21_11 <= minVarPopConc21_11 || minVarPopConc21_11 ===0){
        minVarPopConc21_11 = feature.properties.Var21_11
    }
    if(feature.properties.Var21_11 > maxVarPopConc21_11){
        maxVarPopConc21_11 = feature.properties.Var21_11
    }
    return {
        weight: 1,
        opacity: 0.9,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.9,
        fillColor: CorVarConc11(feature.properties.Var21_11)};
    }


function apagarVarPopConc21_11(e) {
    VarPopConc21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarPopConc21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var21_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarPopConc21_11,
    });
}
var VarPopConc21_11= L.geoJSON(dadosRelativosConcelhos2101, {
    style:EstiloVarPopConc21_11,
    onEachFeature: onEachFeatureVarPopConc21_11
});

let slideVarPopConc21_11 = function(){
    var sliderVarPopConc21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarPopConc21_11, {
        start: [minVarPopConc21_11, maxVarPopConc21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarPopConc21_11,
            'max': maxVarPopConc21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarPopConc21_11);
    inputNumberMax.setAttribute("value",maxVarPopConc21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarPopConc21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarPopConc21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarPopConc21_11.noUiSlider.on('update',function(e){
        VarPopConc21_11.eachLayer(function(layer){
            if(layer.feature.properties.Var21_11>=parseFloat(e[0])&& layer.feature.properties.Var21_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarPopConc21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderVarPopConc21_11.noUiSlider;
    $(slidersGeral).append(sliderVarPopConc21_11);
} 

////////////////////--------------- Fim da Variação do NÍVEL NENHUM ENTRE 2021 E 2011 -------------- \\\\\\
//////////////////------------- FIM VARIAÇÕES POR CONCELHO ---------------------\\\\\\\\\\\\\\\\

///////////////////----------DADOS ABSOLUTOS, POR FREGUESIA-----------------\\\\\\\\\\\\\\
/////////////////////------ POPULAÇÃO RESIDENTE EM 1991, por FREGUESIA ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalPopResiFreg91 = 0;
var maxTotalPopResiFreg91 = 0;
function estiloTotalPopResiFreg91(feature, latlng) {
    if(feature.properties.Pop1991< minTotalPopResiFreg91 || minTotalPopResiFreg91 ===0){
        minTotalPopResiFreg91 = feature.properties.Pop1991
    }
    if(feature.properties.Pop1991> maxTotalPopResiFreg91){
        maxTotalPopResiFreg91 = feature.properties.Pop1991
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Pop1991,0.1)
    });
}
function apagarTotalPopResiFreg91(e){
    var layer = e.target;
    TotalPopResiFreg91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopResiFreg91(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.Pop1991).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopResiFreg91,
    })
};

var TotalPopResiFreg91= L.geoJSON(dadosAbsolutosFreg91,{
    pointToLayer:estiloTotalPopResiFreg91,
    onEachFeature: onEachFeatureTotalPopResiFreg91,
});

var slideTotalPopResiFreg91 = function(){
    var sliderTotalPopResiFreg91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopResiFreg91, {
        start: [minTotalPopResiFreg91, maxTotalPopResiFreg91],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalPopResiFreg91,
            'max': maxTotalPopResiFreg91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalPopResiFreg91);
    inputNumberMax.setAttribute("value",maxTotalPopResiFreg91);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopResiFreg91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopResiFreg91.noUiSlider.set([null, this.value]);
    });

    sliderTotalPopResiFreg91.noUiSlider.on('update',function(e){
        TotalPopResiFreg91.eachLayer(function(layer){
            if(layer.feature.properties.Pop1991>=parseFloat(e[0])&& layer.feature.properties.Pop1991 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopResiFreg91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderTotalPopResiFreg91.noUiSlider;
    $(slidersGeral).append(sliderTotalPopResiFreg91);
}

///////////////////////////-------------------- FIM POPULAÇÃO RESIDENTE FREGUESIA 1991 -----------\\\\\\\\\\\\\\\\\\\\\\\
/////////////////////------ POPULAÇÃO RESIDENTE EM 2001, por FREGUESIA ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalPopResiFreg01 = 0;
var maxTotalPopResiFreg01 = 0;
function estiloTotalPopResiFreg01(feature, latlng) {
    if(feature.properties.Pop2001< minTotalPopResiFreg01 || minTotalPopResiFreg01 ===0){
        minTotalPopResiFreg01 = feature.properties.Pop2001
    }
    if(feature.properties.Pop2001> maxTotalPopResiFreg01){
        maxTotalPopResiFreg01 = feature.properties.Pop2001
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Pop2001,0.1)
    });
}
function apagarTotalPopResiFreg01(e){
    var layer = e.target;
    TotalPopResiFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopResiFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.Pop2001).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopResiFreg01,
    })
};

var TotalPopResiFreg01= L.geoJSON(dadosAbsolutosFreg01,{
    pointToLayer:estiloTotalPopResiFreg01,
    onEachFeature: onEachFeatureTotalPopResiFreg01,
});

var slideTotalPopResiFreg01 = function(){
    var sliderTotalPopResiFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopResiFreg01, {
        start: [minTotalPopResiFreg01, maxTotalPopResiFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalPopResiFreg01,
            'max': maxTotalPopResiFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalPopResiFreg01);
    inputNumberMax.setAttribute("value",maxTotalPopResiFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopResiFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopResiFreg01.noUiSlider.set([null, this.value]);
    });

    sliderTotalPopResiFreg01.noUiSlider.on('update',function(e){
        TotalPopResiFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Pop2001>=parseFloat(e[0])&& layer.feature.properties.Pop2001 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopResiFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderTotalPopResiFreg01.noUiSlider;
    $(slidersGeral).append(sliderTotalPopResiFreg01);
}

///////////////////////////-------------------- FIM POPULAÇÃO RESIDENTE FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ POPULAÇÃO RESIDENTE EM 2011, por FREGUESIA ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalPopResiFreg11 = 0;
var maxTotalPopResiFreg11 = 0;
function estiloTotalPopResiFreg11(feature, latlng) {
    if(feature.properties.Pop2011< minTotalPopResiFreg11 || minTotalPopResiFreg11 ===0){
        minTotalPopResiFreg11 = feature.properties.Pop2011
    }
    if(feature.properties.Pop2011> maxTotalPopResiFreg11){
        maxTotalPopResiFreg11 = feature.properties.Pop2011
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Pop2011,0.1)
    });
}
function apagarTotalPopResiFreg11(e){
    var layer = e.target;
    TotalPopResiFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopResiFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.Pop2011).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopResiFreg11,
    })
};

var TotalPopResiFreg11= L.geoJSON(dadosAbsolutosFreg2111,{
    pointToLayer:estiloTotalPopResiFreg11,
    onEachFeature: onEachFeatureTotalPopResiFreg11,
});

var slideTotalPopResiFreg11 = function(){
    var sliderTotalPopResiFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopResiFreg11, {
        start: [minTotalPopResiFreg11, maxTotalPopResiFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalPopResiFreg11,
            'max': maxTotalPopResiFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalPopResiFreg11);
    inputNumberMax.setAttribute("value",maxTotalPopResiFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopResiFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopResiFreg11.noUiSlider.set([null, this.value]);
    });

    sliderTotalPopResiFreg11.noUiSlider.on('update',function(e){
        TotalPopResiFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Pop2011>=parseFloat(e[0])&& layer.feature.properties.Pop2011 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopResiFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderTotalPopResiFreg11.noUiSlider;
    $(slidersGeral).append(sliderTotalPopResiFreg11);
}

///////////////////////////-------------------- FIM POPULAÇÃO RESIDENTE FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ POPULAÇÃO RESIDENTE EM 2021, por FREGUESIA ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalPopResiFreg21 = 0;
var maxTotalPopResiFreg21 = 0;
function estiloTotalPopResiFreg21(feature, latlng) {
    if(feature.properties.Pop2021< minTotalPopResiFreg21 || minTotalPopResiFreg21 ===0){
        minTotalPopResiFreg21 = feature.properties.Pop2021
    }
    if(feature.properties.Pop2021> maxTotalPopResiFreg21){
        maxTotalPopResiFreg21 = feature.properties.Pop2021
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Pop2021,0.1)
    });
}
function apagarTotalPopResiFreg21(e){
    var layer = e.target;
    TotalPopResiFreg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopResiFreg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.Pop2021).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopResiFreg21,
    })
};

var TotalPopResiFreg21= L.geoJSON(dadosAbsolutosFreg2111,{
    pointToLayer:estiloTotalPopResiFreg21,
    onEachFeature: onEachFeatureTotalPopResiFreg21,
});

var slideTotalPopResiFreg21 = function(){
    var sliderTotalPopResiFreg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopResiFreg21, {
        start: [minTotalPopResiFreg21, maxTotalPopResiFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalPopResiFreg21,
            'max': maxTotalPopResiFreg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalPopResiFreg21);
    inputNumberMax.setAttribute("value",maxTotalPopResiFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopResiFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopResiFreg21.noUiSlider.set([null, this.value]);
    });

    sliderTotalPopResiFreg21.noUiSlider.on('update',function(e){
        TotalPopResiFreg21.eachLayer(function(layer){
            if(layer.feature.properties.Pop2021>=parseFloat(e[0])&& layer.feature.properties.Pop2021 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopResiFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderTotalPopResiFreg21.noUiSlider;
    $(slidersGeral).append(sliderTotalPopResiFreg21);
}

///////////////////////////-------------------- FIM POPULAÇÃO RESIDENTE FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\
//////////////////////////--------------------- FIM DADOS ABSOLUTOS FREGUESIA -------------------\\\\\\\\\\\\\\\\\

////////////////////////////////-------  Variação DA POPULAÇÃO, FREGUESIAS 2001 - 1991-----/////

var minVarPopResi01_91 = 0;
var maxVarPopResi01_91 = 0;

function CorVarFreg91(d) {
    return  d == null ? '#a6a6a6' :
        d > 30 ? '#ff5e6e' :
        d >= 15  ? '#f5b3be' :
        d >= 0  ? '#faceb7' :
        d >= -15  ? '#9eaad7' :
        d >= -42   ? '#2288bf' :
                ''  ;
}

var legendaVariacaoFreg91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da população residente entre 2001 e 1991, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' > 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#faceb7"></i>' + ' 0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -15 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -42 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.9")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarPopResi01_91(feature) {
    if(feature.properties.Var01_91 <= minVarPopResi01_91 || minVarPopResi01_91 ===0){
        minVarPopResi01_91 = feature.properties.Var01_91
    }
    if(feature.properties.Var01_91 > maxVarPopResi01_91){
        maxVarPopResi01_91 = feature.properties.Var01_91
    }
    return {
        weight: 1,
        opacity: 0.9,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.9,
        fillColor: CorVarFreg91(feature.properties.Var01_91)};
    }


function apagarVarPopResi01_91(e) {
    VarPopResi01_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarPopResi01_91(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var01_91.toFixed(2) + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarPopResi01_91,
    });
}
var VarPopResi01_91= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarPopResi01_91,
    onEachFeature: onEachFeatureVarPopResi01_91
});

let slideVarPopResi01_91 = function(){
    var sliderVarPopResi01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarPopResi01_91, {
        start: [minVarPopResi01_91, maxVarPopResi01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarPopResi01_91,
            'max': maxVarPopResi01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarPopResi01_91);
    inputNumberMax.setAttribute("value",maxVarPopResi01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarPopResi01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarPopResi01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarPopResi01_91.noUiSlider.on('update',function(e){
        VarPopResi01_91.eachLayer(function(layer){
            if(!layer.feature.properties.Var01_91){
                return false
            }
            if(layer.feature.properties.Var01_91>=parseFloat(e[0])&& layer.feature.properties.Var01_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarPopResi01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderVarPopResi01_91.noUiSlider;
    $(slidersGeral).append(sliderVarPopResi01_91);
} 

////////////////////--------------- Fim da Variação POPULAÇÃO RESIDENTE ENTRE 2001 E 1991 -------------- \\\\\\

////////////////////////////////-------  Variação DA POPULAÇÃO, CONCELHOS 2011 - 2001-----/////

var minVarPopResi11_01 = 0;
var maxVarPopResi11_01 = 0;

function CorVarFreg01(d) {
    return  d == null ? '#a6a6a6' :
        d > 25 ? '#ff5e6e' :
        d >= 10  ? '#f5b3be' :
        d >= 0  ? '#faceb7' :
        d >= -15  ? '#9eaad7' :
        d >= -40   ? '#2288bf' :
                ''  ;
}

var legendaVariacaoFreg01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da população residente entre 2001 e 1991, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 10 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#faceb7"></i>' + ' 0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -15 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -40 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.9")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarPopResi11_01(feature) {
    if(feature.properties.Var11_01 <= minVarPopResi11_01 || minVarPopResi11_01 ===0){
        minVarPopResi11_01 = feature.properties.Var11_01
    }
    if(feature.properties.Var11_01 > maxVarPopResi11_01){
        maxVarPopResi11_01 = feature.properties.Var11_01
    }
    return {
        weight: 1,
        opacity: 0.9,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.9,
        fillColor: CorVarFreg01(feature.properties.Var11_01)};
    }


function apagarVarPopResi11_01(e) {
    VarPopResi11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarPopResi11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var11_01.toFixed(2) + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarPopResi11_01,
    });
}
var VarPopResi11_01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarPopResi11_01,
    onEachFeature: onEachFeatureVarPopResi11_01
});

let slideVarPopResi11_01 = function(){
    var sliderVarPopResi11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarPopResi11_01, {
        start: [minVarPopResi11_01, maxVarPopResi11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarPopResi11_01,
            'max': maxVarPopResi11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarPopResi11_01);
    inputNumberMax.setAttribute("value",maxVarPopResi11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarPopResi11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarPopResi11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarPopResi11_01.noUiSlider.on('update',function(e){
        VarPopResi11_01.eachLayer(function(layer){
            if(!layer.feature.properties.Var11_01){
                return false
            }
            if(layer.feature.properties.Var11_01>=parseFloat(e[0])&& layer.feature.properties.Var11_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarPopResi11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderVarPopResi11_01.noUiSlider;
    $(slidersGeral).append(sliderVarPopResi11_01);
} 

////////////////////--------------- Fim da Variação POPULAÇÃO RESIDENTE ENTRE 2011 E 2001 -------------- \\\\\\

////////////////////////////////-------  Variação DA POPULAÇÃO, CONCELHOS 2021 - 2011-----/////

var minVarPopResi21_11 = 0;
var maxVarPopResi21_11 = 0;

function CorVarFreg11(d) {
    return  d == null ? '#a6a6a6' :
        d > 5 ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#CCD3D9' :
        d >= -10  ? '#9eaad7' :
        d >= -23   ? '#2288bf' :
                ''  ;
}

var legendaVariacaoFreg11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da população residente entre 2001 e 1991, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#CCD3D9"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -23 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.9")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarPopResi21_11(feature) {
    if(feature.properties.Var21_11 <= minVarPopResi21_11 || minVarPopResi21_11 ===0){
        minVarPopResi21_11 = feature.properties.Var21_11
    }
    if(feature.properties.Var21_11 > maxVarPopResi21_11){
        maxVarPopResi21_11 = feature.properties.Var21_11
    }
    return {
        weight: 1,
        opacity: 0.9,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.9,
        fillColor: CorVarFreg11(feature.properties.Var21_11)};
    }


function apagarVarPopResi21_11(e) {
    VarPopResi21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarPopResi21_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var21_11.toFixed(2) + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarPopResi21_11,
    });
}
var VarPopResi21_11= L.geoJSON(dadosRelativosFreg2111, {
    style:EstiloVarPopResi21_11,
    onEachFeature: onEachFeatureVarPopResi21_11
});

let slideVarPopResi21_11 = function(){
    var sliderVarPopResi21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarPopResi21_11, {
        start: [minVarPopResi21_11, maxVarPopResi21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarPopResi21_11,
            'max': maxVarPopResi21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarPopResi21_11);
    inputNumberMax.setAttribute("value",maxVarPopResi21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarPopResi21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarPopResi21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarPopResi21_11.noUiSlider.on('update',function(e){
        VarPopResi21_11.eachLayer(function(layer){
            if(!layer.feature.properties.Var21_11){
                return false
            }
            if(layer.feature.properties.Var21_11>=parseFloat(e[0])&& layer.feature.properties.Var21_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarPopResi21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderVarPopResi21_11.noUiSlider;
    $(slidersGeral).append(sliderVarPopResi21_11);
} 

////////////////////--------------- Fim da Variação POPULAÇÃO RESIDENTE ENTRE 2021 E 2011 -------------- \\\\\\


//////////////////////////////////------------------------ DENSIDADE POPULACIONAL CONCELHOS -------------------------\\\\\\\\\\\\\
//////////////////////////////// -------------------------- 1991 -----------------------\\\\\\\\\\\\\\\\\\\\\

var minDensidadePop91 = 0;
var maxDensidadePop91 = 0;

function CorDensPop91Conc(d) {
    return d > 1200 ? '#0D0D0D' :
        d >= 800  ? '#400D01' :
        d >= 400  ? '#8C2703' :
        d >= 200  ? '#D95204' :
        d >= 0   ? '#F2A516' :
                ''  ;
}
var legendaDensPop91Concelho = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $('#tituloMapa').html(' <strong>' + 'Densidade populacional em 1991, por concelho.' + '</strong>')
    $(legendaA).append("<div class='subheader'>" + 'Nº de habitantes/km²' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#0D0D0D"></i>' + ' > 1200' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#400D01"></i>' + ' ]800 - 1200]' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#8C2703"></i>' + ']400 - 800]' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#D95204"></i>' + ' ]200 - 400]' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2A516"></i>' + ' < 200' + '<br>'

    $(legendaA).append(symbolsContainer); 
}
function EstiloDensidadePop91(feature) {
    if(feature.properties.Dens91 <= minDensidadePop91 || minDensidadePop91 === 0){
        minDensidadePop91 = feature.properties.Dens91
    }
    if(feature.properties.Dens91 >= maxDensidadePop91 ){
        maxDensidadePop91 = feature.properties.Dens91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorDensPop91Conc(feature.properties.Dens91)
    };
}
function apagarDensidadePop91(e) {
    DensidadePop91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureDensidadePop91(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelhos + '</b>' + '<br>' + 'Densidade Populacional: ' + '<b>' + feature.properties.Dens91.toFixed(0)  + '</b>' + ' hab/km²').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarDensidadePop91,
    });
}
var DensidadePop91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloDensidadePop91,
    onEachFeature: onEachFeatureDensidadePop91
});

let slideDensidadePop91 = function(){
    var sliderDensidadePop91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderDensidadePop91, {
        start: [minDensidadePop91, maxDensidadePop91],
        tooltips:true,
        connect: true,
        range: {
            'min': minDensidadePop91,
            'max': maxDensidadePop91
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minDensidadePop91);
    inputNumberMax.setAttribute("value",maxDensidadePop91);

    inputNumberMin.addEventListener('change', function(){
        sliderDensidadePop91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderDensidadePop91.noUiSlider.set([null, this.value]);
    });

    sliderDensidadePop91.noUiSlider.on('update',function(e){
        DensidadePop91.eachLayer(function(layer){
            if(layer.feature.properties.Dens91.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Dens91.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderDensidadePop91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderDensidadePop91.noUiSlider;
    $(slidersGeral).append(sliderDensidadePop91);
} 

/////////////////////////////// Fim  CONCELHO em 1991 -------------- \\\\\\

//////////////////////////////// -------------------------- 2001 -----------------------\\\\\\\\\\\\\\\\\\\\\

var minDensidadePop01 = 0;
var maxDensidadePop01 = 0;
function CorDensPop01Conc(d) {
    return d > 1200 ? '#0D0D0D' :
        d >= 800  ? '#400D01' :
        d >= 500  ? '#8C2703' :
        d >= 200  ? '#D95204' :
        d >= 0   ? '#F2A516' :
                ''  ;
}
var legendaDensPop01Concelho = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $('#tituloMapa').html(' <strong>' + 'Densidade populacional em 2001, por concelho.' + '</strong>')
    $(legendaA).append("<div class='subheader'>" + 'Nº de habitantes/km²' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#0D0D0D"></i>' + ' > 1200' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#400D01"></i>' + ' ]800 - 1200]' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#8C2703"></i>' + ']500 - 800]' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#D95204"></i>' + ' ]200 - 500]' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2A516"></i>' + ' < 200' + '<br>'

    $(legendaA).append(symbolsContainer); 
}
function EstiloDensidadePop01(feature) {
    if(feature.properties.Dens01 <= minDensidadePop01 || minDensidadePop01 === 0){
        minDensidadePop01 = feature.properties.Dens01
    }
    if(feature.properties.Dens01 >= maxDensidadePop01 ){
        maxDensidadePop01 = feature.properties.Dens01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorDensPop01Conc(feature.properties.Dens01)
    };
}
function apagarDensidadePop01(e) {
    DensidadePop01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureDensidadePop01(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelhos + '</b>' + '<br>' + 'Densidade Populacional: ' + '<b>' + feature.properties.Dens01.toFixed(0)  + '</b>' + ' hab/km²').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarDensidadePop01,
    });
}
var DensidadePop01= L.geoJSON(dadosRelativosConcelhos2101, {
    style:EstiloDensidadePop01,
    onEachFeature: onEachFeatureDensidadePop01
});
let slideDensidadePop01 = function(){
    var sliderDensidadePop01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderDensidadePop01, {
        start: [minDensidadePop01, maxDensidadePop01],
        tooltips:true,
        connect: true,
        range: {
            'min': minDensidadePop01,
            'max': maxDensidadePop01
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minDensidadePop01);
    inputNumberMax.setAttribute("value",maxDensidadePop01);

    inputNumberMin.addEventListener('change', function(){
        sliderDensidadePop01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderDensidadePop01.noUiSlider.set([null, this.value]);
    });

    sliderDensidadePop01.noUiSlider.on('update',function(e){
        DensidadePop01.eachLayer(function(layer){
            if(layer.feature.properties.Dens01.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Dens01.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderDensidadePop01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderDensidadePop01.noUiSlider;
    $(slidersGeral).append(sliderDensidadePop01);
} 

/////////////////////////////// Fim  CONCELHO em 2001 -------------- \\\\\\

//////////////////////////////// -------------------------- 2011 -----------------------\\\\\\\\\\\\\\\\\\\\\

var minDensidadePop11 = 0;
var maxDensidadePop11 = 0;
function CorDensPop11Conc(d) {
    return d > 1200 ? '#0D0D0D' :
        d >= 800  ? '#400D01' :
        d >= 500  ? '#8C2703' :
        d >= 200  ? '#D95204' :
        d >= 0   ? '#F2A516' :
                ''  ;
}
var legendaDensPop11Concelho = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $('#tituloMapa').html(' <strong>' + 'Densidade populacional em 2011, por concelho.' + '</strong>')
    $(legendaA).append("<div class='subheader'>" + 'Nº de habitantes/km²' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#0D0D0D"></i>' + ' > 1200' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#400D01"></i>' + ' ]800 - 1200]' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#8C2703"></i>' + ']500 - 800]' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#D95204"></i>' + ' ]200 - 500]' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2A516"></i>' + ' < 200' + '<br>'

    $(legendaA).append(symbolsContainer); 
}
function EstiloDensidadePop11(feature) {
    if(feature.properties.Dens11 <= minDensidadePop11 || minDensidadePop11 === 0){
        minDensidadePop11 = feature.properties.Dens11
    }
    if(feature.properties.Dens11 >= maxDensidadePop11 ){
        maxDensidadePop11 = feature.properties.Dens11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorDensPop11Conc(feature.properties.Dens11)
    };
}
function apagarDensidadePop11(e) {
    DensidadePop11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureDensidadePop11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelhos + '</b>' + '<br>' + 'Densidade Populacional: ' + '<b>' + feature.properties.Dens11.toFixed(0)  + '</b>' + ' hab/km²').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarDensidadePop11,
    });
}
var DensidadePop11= L.geoJSON(dadosRelativosConcelhos2101, {
    style:EstiloDensidadePop11,
    onEachFeature: onEachFeatureDensidadePop11
});
let slideDensidadePop11 = function(){
    var sliderDensidadePop11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderDensidadePop11, {
        start: [minDensidadePop11, maxDensidadePop11],
        tooltips:true,
        connect: true,
        range: {
            'min': minDensidadePop11,
            'max': maxDensidadePop11
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minDensidadePop11);
    inputNumberMax.setAttribute("value",maxDensidadePop11);

    inputNumberMin.addEventListener('change', function(){
        sliderDensidadePop11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderDensidadePop11.noUiSlider.set([null, this.value]);
    });

    sliderDensidadePop11.noUiSlider.on('update',function(e){
        DensidadePop11.eachLayer(function(layer){
            if(layer.feature.properties.Dens11.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Dens11.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderDensidadePop11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderDensidadePop11.noUiSlider;
    $(slidersGeral).append(sliderDensidadePop11);
} 

/////////////////////////////// Fim  CONCELHO em 2011 -------------- \\\\\\

//////////////////////////////// -------------------------- 2021 -----------------------\\\\\\\\\\\\\\\\\\\\\

var minDensidadePop21 = 0;
var maxDensidadePop21 = 0;

function CorDensPop21Conc(d) {
    return d > 1200 ? '#0D0D0D' :
        d >= 800  ? '#400D01' :
        d >= 500  ? '#8C2703' :
        d >= 200  ? '#D95204' :
        d >= 0   ? '#F2A516' :
                ''  ;
}
var legendaDensPop21Concelho = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $('#tituloMapa').html(' <strong>' + 'Densidade populacional em 2021, por concelho.' + '</strong>')
    $(legendaA).append("<div class='subheader'>" + 'Nº de habitantes/km²' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#0D0D0D"></i>' + ' > 1200' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#400D01"></i>' + ' ]800 - 1200]' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#8C2703"></i>' + ']500 - 800]' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#D95204"></i>' + ' ]200 - 500]' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2A516"></i>' + ' < 200' + '<br>'

    $(legendaA).append(symbolsContainer); 
}
function EstiloDensidadePop21(feature) {
    if(feature.properties.Dens21 <= minDensidadePop21 || minDensidadePop21 === 0){
        minDensidadePop21 = feature.properties.Dens21
    }
    if(feature.properties.Dens21 >= maxDensidadePop21 ){
        maxDensidadePop21 = feature.properties.Dens21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorDensPop21Conc(feature.properties.Dens21)
    };
}
function apagarDensidadePop21(e) {
    DensidadePop21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureDensidadePop21(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelhos + '</b>' + '<br>' + 'Densidade Populacional: ' + '<b>' + feature.properties.Dens21.toFixed(0)  + '</b>' + ' hab/km²').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarDensidadePop21,
    });
}
var DensidadePop21= L.geoJSON(dadosRelativosConcelhos2101, {
    style:EstiloDensidadePop21,
    onEachFeature: onEachFeatureDensidadePop21
});
let slideDensidadePop21 = function(){
    var sliderDensidadePop21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderDensidadePop21, {
        start: [minDensidadePop21, maxDensidadePop21],
        tooltips:true,
        connect: true,
        range: {
            'min': minDensidadePop21,
            'max': maxDensidadePop21
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minDensidadePop21);
    inputNumberMax.setAttribute("value",maxDensidadePop21);

    inputNumberMin.addEventListener('change', function(){
        sliderDensidadePop21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderDensidadePop21.noUiSlider.set([null, this.value]);
    });

    sliderDensidadePop21.noUiSlider.on('update',function(e){
        DensidadePop21.eachLayer(function(layer){
            if(layer.feature.properties.Dens21.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Dens21.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderDensidadePop21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderDensidadePop21.noUiSlider;
    $(slidersGeral).append(sliderDensidadePop21);
} 

/////////////////////////////// Fim  CONCELHO em 2021 -------------- \\\\\\


//////////////////////////////// -------------------------- 1991 -----------------------\\\\\\\\\\\\\\\\\\\\\

var minDensidadePop91Freg = 0;
var maxDensidadePop91Freg = 0;


function EstiloDensidadePop91Freg(feature) {
    if(feature.properties.Dens91 <= minDensidadePop91Freg || minDensidadePop91Freg === 0){
        minDensidadePop91Freg = feature.properties.Dens91
    }
    if(feature.properties.Dens91 >= maxDensidadePop91Freg ){
        maxDensidadePop91Freg = feature.properties.Dens91
    }
    return {
        weight: 1,
        opacity: 0.5,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorDensPop21Freg(feature.properties.Dens91)
    };
}
function apagarDensidadePop91Freg(e) {
    DensidadePop91Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureDensidadePop91Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' + feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Densidade Populacional: ' + '<b>' + feature.properties.Dens91.toFixed(0)  + '</b>' + ' hab/km²').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarDensidadePop91Freg,
    });
}
var DensidadePop91Freg= L.geoJSON(dadosRelativosFreguesias91, {
    style:EstiloDensidadePop91Freg,
    onEachFeature: onEachFeatureDensidadePop91Freg
});

let slideDensidadePop91Freg = function(){
    var sliderDensidadePop91Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderDensidadePop91Freg, {
        start: [minDensidadePop91Freg, maxDensidadePop91Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minDensidadePop91Freg,
            'max': maxDensidadePop91Freg
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minDensidadePop91Freg);
    inputNumberMax.setAttribute("value",maxDensidadePop91Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderDensidadePop91Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderDensidadePop91Freg.noUiSlider.set([null, this.value]);
    });

    sliderDensidadePop91Freg.noUiSlider.on('update',function(e){
        DensidadePop91Freg.eachLayer(function(layer){
            if(layer.feature.properties.Dens91.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Dens91.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderDensidadePop91Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderDensidadePop91Freg.noUiSlider;
    $(slidersGeral).append(sliderDensidadePop91Freg);
} 

/////////////////////////////// Fim  CONCELHO em 1991 -------------- \\\\\\

//////////////////////////////// -------------------------- 2001 -----------------------\\\\\\\\\\\\\\\\\\\\\

var minDensidadePop01Freg = 0;
var maxDensidadePop01Freg = 0;

function EstiloDensidadePop01Freg(feature) {
    if(feature.properties.Dens01 <= minDensidadePop01Freg || minDensidadePop01Freg === 0){
        minDensidadePop01Freg = feature.properties.Dens01
    }
    if(feature.properties.Dens01 >= maxDensidadePop01Freg ){
        maxDensidadePop01Freg = feature.properties.Dens01
    }
    return {
        weight: 1,
        opacity: 0.5,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorDensPop21Freg(feature.properties.Dens01)
    };
}
function apagarDensidadePop01Freg(e) {
    DensidadePop01Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureDensidadePop01Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' + feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Densidade Populacional: ' + '<b>' + feature.properties.Dens01.toFixed(0)  + '</b>' + ' hab/km²').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarDensidadePop01Freg,
    });
}
var DensidadePop01Freg= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloDensidadePop01Freg,
    onEachFeature: onEachFeatureDensidadePop01Freg
});
let slideDensidadePop01Freg = function(){
    var sliderDensidadePop01Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderDensidadePop01Freg, {
        start: [minDensidadePop01Freg, maxDensidadePop01Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minDensidadePop01Freg,
            'max': maxDensidadePop01Freg
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minDensidadePop01Freg);
    inputNumberMax.setAttribute("value",maxDensidadePop01Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderDensidadePop01Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderDensidadePop01Freg.noUiSlider.set([null, this.value]);
    });

    sliderDensidadePop01Freg.noUiSlider.on('update',function(e){
        DensidadePop01Freg.eachLayer(function(layer){
            if(layer.feature.properties.Dens01.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Dens01.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderDensidadePop01Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderDensidadePop01Freg.noUiSlider;
    $(slidersGeral).append(sliderDensidadePop01Freg);
} 

/////////////////////////////// Fim  CONCELHO em 2001 -------------- \\\\\\

//////////////////////////////// -------------------------- 2011 -----------------------\\\\\\\\\\\\\\\\\\\\\

var minDensidadePop11Freg = 0;
var maxDensidadePop11Freg = 0;


function EstiloDensidadePop11Freg(feature) {
    if(feature.properties.Dens11 <= minDensidadePop11Freg || minDensidadePop11Freg === 0){
        minDensidadePop11Freg = feature.properties.Dens11
    }
    if(feature.properties.Dens11 >= maxDensidadePop11Freg ){
        maxDensidadePop11Freg = feature.properties.Dens11
    }
    return {
        weight: 1,
        opacity: 0.5,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorDensPop21Freg(feature.properties.Dens11)
    };
}
function apagarDensidadePop11Freg(e) {
    DensidadePop11Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureDensidadePop11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' + feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Densidade Populacional: ' + '<b>' + feature.properties.Dens11.toFixed(0)  + '</b>' + ' hab/km²').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarDensidadePop11Freg,
    });
}
var DensidadePop11Freg= L.geoJSON(dadosRelativosFreg2111, {
    style:EstiloDensidadePop11Freg,
    onEachFeature: onEachFeatureDensidadePop11Freg
});
let slideDensidadePop11Freg = function(){
    var sliderDensidadePop11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderDensidadePop11Freg, {
        start: [minDensidadePop11Freg, maxDensidadePop11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minDensidadePop11Freg,
            'max': maxDensidadePop11Freg
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minDensidadePop11Freg);
    inputNumberMax.setAttribute("value",maxDensidadePop11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderDensidadePop11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderDensidadePop11Freg.noUiSlider.set([null, this.value]);
    });

    sliderDensidadePop11Freg.noUiSlider.on('update',function(e){
        DensidadePop11Freg.eachLayer(function(layer){
            if(layer.feature.properties.Dens11.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Dens11.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderDensidadePop11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderDensidadePop11Freg.noUiSlider;
    $(slidersGeral).append(sliderDensidadePop11Freg);
} 

/////////////////////////////// Fim  CONCELHO em 2011 -------------- \\\\\\

//////////////////////////////// -------------------------- 2021 -----------------------\\\\\\\\\\\\\\\\\\\\\

var minDensidadePop21Freg = 0;
var maxDensidadePop21Freg = 0;
function CorDensPop21Freg(d) {
    return d > 1200 ? '#0D0D0D' :
        d >= 800  ? '#400D01' :
        d >= 500  ? '#8C2703' :
        d >= 200  ? '#D95204' :
        d >= 0   ? '#F2A516' :
                ''  ;
}
var legendaDensPop21Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Nº de habitantes/km²' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#0D0D0D"></i>' + ' > 1200' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#400D01"></i>' + ' ]800 - 1200]' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#8C2703"></i>' + ']500 - 800]' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#D95204"></i>' + ' ]200 - 500]' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2A516"></i>' + ' < 200' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloDensidadePop21Freg(feature) {
    if(feature.properties.Dens21 <= minDensidadePop21Freg || minDensidadePop21Freg === 0){
        minDensidadePop21Freg = feature.properties.Dens21
    }
    if(feature.properties.Dens21 >= maxDensidadePop21Freg ){
        maxDensidadePop21Freg = feature.properties.Dens21
    }
    return {
        weight: 1,
        opacity: 0.5,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorDensPop21Freg(feature.properties.Dens21)
    };
}
function apagarDensidadePop21Freg(e) {
    DensidadePop21Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureDensidadePop21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' + feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Densidade Populacional: ' + '<b>' + feature.properties.Dens21.toFixed(0)  + '</b>' + ' hab/km²').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarDensidadePop21Freg,
    });
}
var DensidadePop21Freg= L.geoJSON(dadosRelativosFreg2111, {
    style:EstiloDensidadePop21Freg,
    onEachFeature: onEachFeatureDensidadePop21Freg
});
let slideDensidadePop21Freg = function(){
    var sliderDensidadePop21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderDensidadePop21Freg, {
        start: [minDensidadePop21Freg, maxDensidadePop21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minDensidadePop21Freg,
            'max': maxDensidadePop21Freg
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minDensidadePop21Freg);
    inputNumberMax.setAttribute("value",maxDensidadePop21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderDensidadePop21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderDensidadePop21Freg.noUiSlider.set([null, this.value]);
    });

    sliderDensidadePop21Freg.noUiSlider.on('update',function(e){
        DensidadePop21Freg.eachLayer(function(layer){
            if(layer.feature.properties.Dens21.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Dens21.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderDensidadePop21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } 
        else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderDensidadePop21Freg.noUiSlider;
    $(slidersGeral).append(sliderDensidadePop21Freg);
} 

/////////////////////////////// Fim  CONCELHO em 2021 -------------- \\\\\\


$('#tituloMapa').html(' <strong>' + 'Número de residentes em 1991, por concelho, Nº.' + '</strong>')
var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Recenseamento da população e habitação';

/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = TotalPopResiCon91;
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
    if (layer == TotalPopResiCon91 && naoDuplicar != 1){
        $('#tituloMapa').html(' <strong>' + 'Número de residentes em 1991, por concelho, Nº.' + '</strong>')
        legenda('Nº de Residentes em 1991, por concelho',maxTotalPopResiCon91, (maxTotalPopResiCon91-minTotalPopResiCon91)/2,minTotalPopResiCon91,0.1);
        contornoConcelhos1991.addTo(map)
        baseAtiva = contornoConcelhos1991;
        slideTotalPopResiCon91();   
        naoDuplicar = 1;
    }
    if (layer == TotalPopResiCon91 && naoDuplicar == 1){
        $('#tituloMapa').html(' <strong>' + 'Número de residentes em 1991, por concelho, Nº.' + '</strong>')
        contornoConcelhos1991.addTo(map);
    } 
    if (layer == TotalPopResiCon01 && naoDuplicar != 2){
        $('#tituloMapa').html(' <strong>' + 'Número de residentes em 2001, por concelho, Nº.' + '</strong>')
        legenda('Nº de Residentes em 2001, por concelho',maxTotalPopResiCon01,((maxTotalPopResiCon01-minTotalPopResiCon01)/2).toFixed(0),minTotalPopResiCon01,0.1);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalPopResiCon01();  
        naoDuplicar = 2;
    }
    if (layer == TotalPopResiCon11 && naoDuplicar != 3){
        $('#tituloMapa').html(' <strong>' + 'Número de residentes em 2011, por concelho, Nº.' + '</strong>')
        legenda('Nº de Residentes em 2011, por concelho',maxTotalPopResiCon11,((maxTotalPopResiCon11-minTotalPopResiCon11)/2).toFixed(0),minTotalPopResiCon11,0.1);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalPopResiCon11();  
        naoDuplicar = 3;
    }
    if (layer == TotalPopResiCon21 && naoDuplicar != 4){
        $('#tituloMapa').html(' <strong>' + 'Número de residentes em 2021, por concelho, Nº.' + '</strong>')
        legenda('Nº de Residentes em 2021, por concelho',maxTotalPopResiCon21,((maxTotalPopResiCon21-minTotalPopResiCon21)/2).toFixed(0),minTotalPopResiCon21,0.1);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalPopResiCon21();  
        naoDuplicar = 4;
    }
    if (layer == VarPopConc01_91 && naoDuplicar != 5){
        legendaVariacaoConc91();
        slideVarPopConc01_91();
        naoDuplicar = 5;
    }
    if (layer == VarPopConc11_01 && naoDuplicar != 6){
        legendaVariacaoConc01();
        slideVarPopConc11_01();
        naoDuplicar = 6;
    }
    if (layer == VarPopConc21_11 && naoDuplicar != 7){
        legendaVariacaoConc11();
        slideVarPopConc21_11();
        naoDuplicar = 7;
    }
    if (layer == TotalPopResiFreg91 && naoDuplicar != 8){
        $('#tituloMapa').html(' <strong>' + 'Número de residentes em 1991, por freguesia, Nº.' + '</strong>')
        legenda('Nº de Residentes em 1991, por freguesia',maxTotalPopResiFreg91,((maxTotalPopResiFreg91-minTotalPopResiFreg91)/2).toFixed(0),minTotalPopResiFreg91,0.1);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalPopResiFreg91();  
        naoDuplicar = 8;
    }
    if (layer == TotalPopResiFreg01 && naoDuplicar != 9){
        $('#tituloMapa').html(' <strong>' + 'Número de residentes em 2001, por freguesia, Nº.' + '</strong>')
        legenda('Nº de Residentes em 2001, por freguesia',maxTotalPopResiFreg01,((maxTotalPopResiFreg01-minTotalPopResiFreg01)/2).toFixed(0),minTotalPopResiFreg01,0.1);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalPopResiFreg01();  
        naoDuplicar = 9;
    }
    if (layer == TotalPopResiFreg11 && naoDuplicar != 10){
        $('#tituloMapa').html(' <strong>' + 'Número de residentes em 2011, por freguesia, Nº.' + '</strong>')
        legenda('Nº de Residentes em 2011, por freguesia',maxTotalPopResiFreg11,((maxTotalPopResiFreg11-minTotalPopResiFreg11)/2).toFixed(0),minTotalPopResiFreg11,0.1);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideTotalPopResiFreg11();  
        naoDuplicar = 10;
    }
        if (layer == TotalPopResiFreg21 && naoDuplicar != 11){
        $('#tituloMapa').html(' <strong>' + 'Número de residentes em 2021, por freguesia, Nº.' + '</strong>')
        legenda('Nº de Residentes em 2021, por freguesia',maxTotalPopResiFreg21,((maxTotalPopResiFreg21-minTotalPopResiFreg21)/2).toFixed(0),minTotalPopResiFreg21,0.1);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideTotalPopResiFreg21();  
        naoDuplicar = 11;
    }
    if (layer == VarPopResi01_91 && naoDuplicar != 12){
        legendaVariacaoFreg91();
        slideVarPopResi01_91();
        naoDuplicar = 12;
    }
    if (layer == VarPopResi11_01 && naoDuplicar != 13){
        legendaVariacaoFreg01();
        slideVarPopResi11_01();
        naoDuplicar = 13;
    }
    if (layer == VarPopResi21_11 && naoDuplicar != 14){
        legendaVariacaoFreg11();
        slideVarPopResi21_11();
        naoDuplicar = 14;
    }
    if (layer == DensidadePop91 && naoDuplicar != 15){
        legendaDensPop91Concelho();
        slideDensidadePop91();
        naoDuplicar = 15;    
    }
    if (layer == DensidadePop01 && naoDuplicar != 16){
        legendaDensPop01Concelho();
        slideDensidadePop01();
        naoDuplicar = 16;    
    }
    if (layer == DensidadePop11 && naoDuplicar != 17){
        legendaDensPop11Concelho();
        slideDensidadePop11();
        naoDuplicar = 17;    
    }
    if (layer == DensidadePop21 && naoDuplicar != 18){
        legendaDensPop21Concelho();
        slideDensidadePop21();
        naoDuplicar = 18;    
    }
    if (layer == DensidadePop91Freg && naoDuplicar != 19){
        $('#tituloMapa').html(' <strong>' + 'Densidade populacional em 1991, por freguesia.' + '</strong>')
        legendaDensPop21Freg();
        slideDensidadePop91Freg();
        naoDuplicar = 19;    
    }
    if (layer == DensidadePop01Freg && naoDuplicar != 20){
        $('#tituloMapa').html(' <strong>' + 'Densidade populacional em 2001, por freguesia.' + '</strong>')
        legendaDensPop21Freg();
        slideDensidadePop01Freg();
        naoDuplicar = 20;    
    }
    if (layer == DensidadePop11Freg && naoDuplicar != 21){
        $('#tituloMapa').html(' <strong>' + 'Densidade populacional em 2011, por freguesia.' + '</strong>')
        legendaDensPop21Freg();
        slideDensidadePop11Freg();
        naoDuplicar = 21;    
    }
    if (layer == DensidadePop21Freg && naoDuplicar != 22){
        $('#tituloMapa').html(' <strong>' + 'Densidade populacional em 2021, por freguesia.' + '</strong>')
        legendaDensPop21Freg();
        slideDensidadePop21Freg();
        naoDuplicar = 22;    
    }
    layer.addTo(map);
    layerAtiva = layer;  
}

function myFunction() {
    var anoSelecionado = document.getElementById("mySelect").value;
    if($('#absoluto').hasClass('active4')){
        if (anoSelecionado == "1991"){
            novaLayer(TotalPopResiCon91);
        };
        if (anoSelecionado == "2001"){
            novaLayer(TotalPopResiCon01);
        };
        if (anoSelecionado == "2011"){
            novaLayer(TotalPopResiCon11);
        };
        if (anoSelecionado == "2021"){
            novaLayer(TotalPopResiCon21);
        };   
    }
    if($('#percentagem').hasClass('active4')){
        if (anoSelecionado == "1991"){
            novaLayer(DensidadePop91);
        };
        if (anoSelecionado == "2001"){
            novaLayer(DensidadePop01);
        };
        if (anoSelecionado == "2011"){
            novaLayer(DensidadePop11);
        };
        if (anoSelecionado == "2021"){
            novaLayer(DensidadePop21);
        };   
    }
    if($('#taxaVariacao').hasClass('active4')){
        if (anoSelecionado == "1991"){
            novaLayer(VarPopConc01_91);
        };
        if (anoSelecionado == "2001"){
            novaLayer(VarPopConc11_01);
        };
        if (anoSelecionado == "2011"){
            novaLayer(VarPopConc21_11);
        };
    }
    if($('#absoluto').hasClass('active5')){
        if (anoSelecionado == "1991"){
            novaLayer(TotalPopResiFreg91);
        };
        if (anoSelecionado == "2001"){
            novaLayer(TotalPopResiFreg01);
        };
        if (anoSelecionado == "2011"){
            novaLayer(TotalPopResiFreg11);
        };
        if (anoSelecionado == "2021"){
            novaLayer(TotalPopResiFreg21);
        };
    }
    if($('#percentagem').hasClass('active5')){
        if (anoSelecionado == "1991"){
            novaLayer(DensidadePop91Freg);
        };
        if (anoSelecionado == "2001"){
            novaLayer(DensidadePop01Freg);
        };
        if (anoSelecionado == "2011"){
            novaLayer(DensidadePop11Freg);
        };
        if (anoSelecionado == "2021"){
            novaLayer(DensidadePop21Freg);
        };   
    }
    if($('#taxaVariacao').hasClass('active5')){
        if (anoSelecionado == "1991"){
            novaLayer(VarPopResi01_91);
        };
        if (anoSelecionado == "2001"){
            novaLayer(VarPopResi11_01);
        };
        if (anoSelecionado == "2011"){
            novaLayer(VarPopResi21_11);
        };
    }
}

function mudarEscala(){
    reporAnos();
    primeirovalor('1991')
    tamanhoOutros();
    fonteTitulo('N');
}
let primeirovalor = function(ano){
    $("#mySelect").val(ano);
}
let fonteTitulo = function(valor){
    if(valor == 'A'){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' INE, Recenseamento da população e habitação.' );
    }
    if(valor == 'D'){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' Cálculos próprios; INE, Recenseamento da população e habitação.' );
    }
}
let reporAnos = function(){
    $('#mySelect').empty();
    var ano = 1991;
    while (ano <= 2021){
        $('#mySelect').append("<option value="+ '' + ano + '' + '>' + ano + '</option>');
        ano += 10;
    }
    primeirovalor('1991');
    myFunction();
}
let reporAnosVariacao = function(){
    $('#mySelect').empty();
    var ano = 2001;
    var anoAnterior = 1991;
    while (anoAnterior <= 2011){
        $('#mySelect').append("<option value="+ '' + anoAnterior + '' + '>' + ano + '-' + anoAnterior + '</option>');
        ano += 10;
        anoAnterior += 10;
    }
    primeirovalor('1991');
    myFunction();
}
$('#absoluto').click(function(){
    reporAnos();
    $('#painelLegenda').css('height',"30%");
    fonteTitulo('A');
});
$('#percentagem').click(function(){
    reporAnos();
    $('#painelLegenda').css('height',"39%");
    fonteTitulo('D');
});
$('#taxaVariacao').click(function(){
    reporAnosVariacao();
    $('#painelLegenda').css('height',"39%");
    fonteTitulo('D');
});


$('#freguesias').click(function(){
    variaveisMapaFreguesias();
    reporAnos();
});
$('#concelho').click(function(){
    variaveisMapaConcelho();
    reporAnos();
});
$('#mySelect').change(function(){
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

    $('#concelho').attr("class", "butaoEscala EscalasTerritoriais");
    $('#freguesias').attr('class',"butaoEscala EscalasTerritoriais");
    $('.btn').css("top","10%");

});
function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }
  //////// ------------ Adicionar Tabelas ------------------ \\\\\\\\\\\
var DadosAbsolutosTipoAlojamento = function(){
    $('#tituloMapa').html(' <strong>' + 'Número de residentes, entre 1991 e 2021, Nº.' + '</strong>')
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/vamoslaver2.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#1991').html("1991");
            $('#PopResi').html("População Residente")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.GrupoEtario+'</td>';
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
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes, entre 1991 e 2021, %.' + '</strong>')
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/vamoslaver2.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#1991').html(" ")
            $('#PopResi').html("População Residente")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.GrupoEtario+'</td>';;
                    dados += '<td class="borderbottom bordertop">'+ ' '+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR0191+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR1101+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR2111+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="negrito">'+value.Freguesia+'</td>';
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
    $('#tituloMapa').html(' <strong>' + 'Proporção do número de residentes, entre 1991 e 2021, %.' + '</strong>')
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/vamoslaver2.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#1991').html("1991")
            $('#PopResi').html("Densidade Populacional (Hab/km²)")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom bordertop">'+'Total'+'</td>';
                    dados += '<td class="borderbottom">'+value.DensPop91+'</td>';
                    dados += '<td class="borderbottom">'+value.DensPop01+'</td>';
                    dados += '<td class="borderbottom">'+value.DensPop11+'</td>';
                    dados += '<td class="borderbottom">'+value.DensPop21+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+'Total'+'</td>';
                    dados += '<td class="borderbottom">'+value.DensPop91+'</td>';
                    dados += '<td class="borderbottom">'+value.DensPop01+'</td>';
                    dados += '<td class="borderbottom">'+value.DensPop11+'</td>';
                    dados += '<td class="borderbottom">'+value.DensPop21+'</td>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});

let anosSelecionados = function() {
    let anoSelecionado = document.getElementById("mySelect").value;
    if ($('#freguesias').hasClass("active2")){
        if (anoSelecionado == "2021"){
            i = $('#mySelect').children('option').length - 1 ;
        }
        if (anoSelecionado == "1991"){
            i = 0;
        }
    }
    if ($('#concelho').hasClass("active2")){
        if (anoSelecionado == "2021"){
            i = $('#mySelect').children('option').length - 1 ;
        }
        if (anoSelecionado == "1991"){
            i = 0;
        }
    }
    if ($('#taxaVariacao').hasClass("active4") || $('#taxaVariacao').hasClass("active5") ){
        if (anoSelecionado == "2011"){
            i = $('#mySelect').children('option').length - 1 ;
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

