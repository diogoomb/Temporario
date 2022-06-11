////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'


//adicionar mapa
let latitude = 41.1273;
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
    draggin:false,
});
baseoriginal.addTo(map);

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
contorno.addTo(map);
///// ---- Fim layer Concelhos --- \\\\

///// --- Adicionar Layer das Freguesias -----\\\\
var contornoFreg = L.geoJSON(contornoFreguesias,{
    style:layerContorno,
});
var x;
        $("#button").click(function(){
            x = $("#width").val();
            $("#mapDIV").css("width", x + '%');
            map.invalidateSize()
        });
var contornoFreg2001 =L.geoJSON(formaFreguesia2001Relativos,{
    style:layerContorno,
});

var contornoConcelhos1991 =L.geoJSON(formaConcelhosRelativos1991,{
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

let space = document.getElementById("space");
let opcoesTabela = document.getElementById('opcoesTabela');
let escalasConcelho = document.getElementById('escalasConcelho');
let escalasFreguesia = document.getElementById('escalasFreguesias');
var ifSlide2isActive = 1;
let slidersGeral = document.getElementById('slidersGeral');
let inputNumberMin = document.getElementById('input-number-min');
let inputNumberMax = document.getElementById('input-number-max');

$('#input-number-min').css("left","3.5%")

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
  var current = document.getElementsByClassName("active3");
  current[0].className = current[0].className.replace(" active3", "");
  this.className += " active3";
  });
}

///// --- Botões das variáveis  dos Concelhos(Número Absoluto, Taxa de Variação, Percentagem) ficarem ativos sempre que se clica \\\\\

var btns3 = escalasConcelho.getElementsByClassName("butao");
for (var i = 0; i < btns3.length; i++) {
    btns3[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active4");
    current[0].className = current[0].className.replace(" active4", "");
    this.className += " active4";
  });
}
///// --- Botões das variáveis das Freguesias (Número Absoluto, Taxa de Variação, Percentagem) ficarem ativos sempre que se clica \\\\\
var btns4 = escalasFreguesia.getElementsByClassName("butao");
for (var i = 0; i < btns4.length; i++) {
  btns4[i].addEventListener("click", function() {
  var current = document.getElementsByClassName("active5");
  current[0].className = current[0].className.replace(" active5", "");
  this.className += " active5";
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

//////////////////////////////----------------------------- CONCELHOS TOTAL DE ALOJAMENTOS EM 2021 ----------------------\\\\\\\\\\\\\\\\\\\\

var minTotAlojConcelho21 = 0;
var maxTotAlojConcelho21 = 0;
function estiloTotAlojConcelho21(feature, latlng) {
    if(feature.properties.F_O_T_21< minTotAlojConcelho21 || minTotAlojConcelho21 ===0){
        minTotAlojConcelho21 = feature.properties.F_O_T_21
    }
    if(feature.properties.F_O_T_21> maxTotAlojConcelho21){
        maxTotAlojConcelho21 = feature.properties.F_O_T_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_O_T_21,0.1)
    });
}
function apagarTotAlojConcelho21(e){
    var layer = e.target;
    TotAlojConcelho21.resetStyle(layer)
    layer.closePopup();
}

function hover(e) {
    var layer = e.target;
    layer.openPopup();
    layer.setStyle({
        weight: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}
function onEachFeatureTotAlojConcelho21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.F_O_T_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelho21,
    })
};

var TotAlojConcelho21= L.geoJSON(formaConcelhosAbsolutos,{
    pointToLayer:estiloTotAlojConcelho21,
    onEachFeature: onEachFeatureTotAlojConcelho21,
});
TotAlojConcelho21.addTo(map)  

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
legenda('Nº Total de Alojamentos em 2021',maxTotAlojConcelho21, ((maxTotAlojConcelho21-minTotAlojConcelho21)/2).toFixed(0),minTotAlojConcelho21,0.1);

var sliderAtivo = null

var slideTotAlojConcelho21 = function(){
    var sliderTotAlojConcelho21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelho21, {
        start: [minTotAlojConcelho21, maxTotAlojConcelho21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojConcelho21,
            'max': maxTotAlojConcelho21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojConcelho21);
    inputNumberMax.setAttribute("value",maxTotAlojConcelho21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelho21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelho21.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelho21.noUiSlider.on('update',function(e){
        TotAlojConcelho21.eachLayer(function(layer){
            if(layer.feature.properties.F_O_T_21>=parseFloat(e[0])&& layer.feature.properties.F_O_T_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelho21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderTotAlojConcelho21.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelho21);
}
slideTotAlojConcelho21();

//// Fim do Total de Alojamentos em 2021


//// Total de Alojamentos em 2011 Concelhos //////

var minTotAlojConcelho11 = 0;
var maxTotAlojConcelho11 = 0;
function estiloTotAlojConcelho11(feature, latlng) {
    if(feature.properties.F_O_T_11< minTotAlojConcelho11 || minTotAlojConcelho11 ===0){
        minTotAlojConcelho11 = feature.properties.F_O_T_11
    }
    if(feature.properties.F_O_T_11> maxTotAlojConcelho11){
        maxTotAlojConcelho11 = feature.properties.F_O_T_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_O_T_11,0.1)
    });
}
function apagarTotAlojConcelho11(e){
    var layer = e.target;
    TotAlojConcelho11.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojConcelho11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.F_O_T_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelho11,
    })
};

var TotAlojConcelho11= L.geoJSON(formaConcelhosAbsolutos,{
    pointToLayer:estiloTotAlojConcelho11,
    onEachFeature: onEachFeatureTotAlojConcelho11,
});



var slideTotAlojConcelho11 = function(){
    var sliderTotAlojConcelho11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelho11, {
        start: [minTotAlojConcelho11, maxTotAlojConcelho11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojConcelho11,
            'max': maxTotAlojConcelho11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojConcelho11);
    inputNumberMax.setAttribute("value",maxTotAlojConcelho11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelho11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelho11.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelho11.noUiSlider.on('update',function(e){
        TotAlojConcelho11.eachLayer(function(layer){
            if(layer.feature.properties.F_O_T_11>=parseFloat(e[0])&& layer.feature.properties.F_O_T_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelho11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderTotAlojConcelho11.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelho11);
}

/////Fim do TOTAL ALojamentos EM 2011

//// Total de Alojamentos em 2001 Concelhos //////

var minTotAlojConcelho01 = 0;
var maxTotAlojConcelho01 = 0;
function estiloTotAlojConcelho01(feature, latlng) {
    if(feature.properties.F_O_T_01< minTotAlojConcelho01 || minTotAlojConcelho01 ===0){
        minTotAlojConcelho01 = feature.properties.F_O_T_01
    }
    if(feature.properties.F_O_T_01> maxTotAlojConcelho01){
        maxTotAlojConcelho01 = feature.properties.F_O_T_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_O_T_01,0.1)
    });
}
function apagarTotAlojConcelho01(e){
    var layer = e.target;
    TotAlojConcelho01.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojConcelho01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.F_O_T_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelho01,
    })
};

var TotAlojConcelho01= L.geoJSON(formaConcelhosAbsolutos,{
    pointToLayer:estiloTotAlojConcelho01,
    onEachFeature: onEachFeatureTotAlojConcelho01,
});



var slideTotAlojConcelho01 = function(){
    var sliderTotAlojConcelho01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelho01, {
        start: [minTotAlojConcelho01, maxTotAlojConcelho01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojConcelho01,
            'max': maxTotAlojConcelho01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojConcelho01);
    inputNumberMax.setAttribute("value",maxTotAlojConcelho01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelho01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelho01.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelho01.noUiSlider.on('update',function(e){
        TotAlojConcelho01.eachLayer(function(layer){
            if(layer.feature.properties.F_O_T_01>=parseFloat(e[0])&& layer.feature.properties.F_O_T_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelho01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderTotAlojConcelho01.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelho01);
}

/////Fim do TOTAL ALojamentos EM 2001

//// Total de Alojamentos em 1991 Concelhos //////

var minTotAlojConcelho91 = 0;
var maxTotAlojConcelho91 = 0;
var segundoTotAlojConcelho91 = 0;
function estiloTotAlojConcelho91(feature, latlng) {
    if(feature.properties.F_O_T_91< minTotAlojConcelho91 || minTotAlojConcelho91 ===0){
        segundoTotAlojConcelho91 = minTotAlojConcelho91
        minTotAlojConcelho91 = feature.properties.F_O_T_91
    }
    if(feature.properties.F_O_T_91> maxTotAlojConcelho91){
        maxTotAlojConcelho91 = feature.properties.F_O_T_91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_O_T_91,0.1)
    });
}
function apagarTotAlojConcelho91(e){
    var layer = e.target;
    TotAlojConcelho91.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojConcelho91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.F_O_T_91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelho91,
    })
};

var TotAlojConcelho91= L.geoJSON(formaConcelhosAbsolutos1991,{
    pointToLayer:estiloTotAlojConcelho91,
    onEachFeature: onEachFeatureTotAlojConcelho91,
});



var slideTotAlojConcelho91 = function(){
    var sliderTotAlojConcelho91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelho91, {
        start: [segundoTotAlojConcelho91, maxTotAlojConcelho91],
        tooltips:true,
        connect: true,
        range: {
            'min': segundoTotAlojConcelho91,
            'max': maxTotAlojConcelho91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",segundoTotAlojConcelho91);
    inputNumberMax.setAttribute("value",maxTotAlojConcelho91);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelho91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelho91.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelho91.noUiSlider.on('update',function(e){
        TotAlojConcelho91.eachLayer(function(layer){
            if(layer.feature.properties.F_O_T_91>=parseFloat(e[0])&& layer.feature.properties.F_O_T_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelho91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderTotAlojConcelho91.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelho91);
}

/////Fim do TOTAL ALojamentos EM 1991

//// Total de Alojamentos de Residência Habitual em 2021 Concelhos //////

var minTotAlojConcelhoRH21 = 0;
var maxTotAlojConcelhoRH21 = 0;
function estiloTotAlojConcelhoRH21(feature, latlng) {
    if(feature.properties.Resi_Hab21< minTotAlojConcelhoRH21 || minTotAlojConcelhoRH21 ===0){
        minTotAlojConcelhoRH21 = feature.properties.Resi_Hab21
    }
    if(feature.properties.Resi_Hab21> maxTotAlojConcelhoRH21){
        maxTotAlojConcelhoRH21 = feature.properties.Resi_Hab21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Hab21,0.1)
    });
}
function apagarTotAlojConcelhoRH21(e){
    var layer = e.target;
    TotAlojConcelhoRH21.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojConcelhoRH21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.Resi_Hab21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelhoRH21,
    })
};

var TotAlojConcelhoRH21= L.geoJSON(formaConcelhosAbsolutos,{
    pointToLayer:estiloTotAlojConcelhoRH21,
    onEachFeature: onEachFeatureTotAlojConcelhoRH21,
});



var slideTotAlojConcelhoRH21 = function(){
    var sliderTotAlojConcelhoRH21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelhoRH21, {
        start: [minTotAlojConcelhoRH21, maxTotAlojConcelhoRH21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojConcelhoRH21,
            'max': maxTotAlojConcelhoRH21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojConcelhoRH21);
    inputNumberMax.setAttribute("value",maxTotAlojConcelhoRH21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelhoRH21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelhoRH21.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelhoRH21.noUiSlider.on('update',function(e){
        TotAlojConcelhoRH21.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Hab21>=parseFloat(e[0])&& layer.feature.properties.Resi_Hab21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelhoRH21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderTotAlojConcelhoRH21.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelhoRH21);
}

/////Fim do TOTAL ALojamentos DE Residência Habitual EM 2021

//// Total de Alojamentos de Residência Habitual em 2011 Concelhos //////

var minTotAlojConcelhoRH11 = 0;
var maxTotAlojConcelhoRH11 = 0;
function estiloTotAlojConcelhoRH11(feature, latlng) {
    if(feature.properties.Resi_Hab01< minTotAlojConcelhoRH11 || minTotAlojConcelhoRH11 ===0){
        minTotAlojConcelhoRH11 = feature.properties.Resi_Hab11
    }
    if(feature.properties.Resi_Hab11> maxTotAlojConcelhoRH11){
        maxTotAlojConcelhoRH11 = feature.properties.Resi_Hab11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Hab11,0.1)
    });
}
function apagarTotAlojConcelhoRH11(e){
    var layer = e.target;
    TotAlojConcelhoRH11.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojConcelhoRH11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.Resi_Hab11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelhoRH11,
    })
};

var TotAlojConcelhoRH11= L.geoJSON(formaConcelhosAbsolutos,{
    pointToLayer:estiloTotAlojConcelhoRH11,
    onEachFeature: onEachFeatureTotAlojConcelhoRH11,
});



var slideTotAlojConcelhoRH11 = function(){
    var sliderTotAlojConcelhoRH11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelhoRH11, {
        start: [minTotAlojConcelhoRH11, maxTotAlojConcelhoRH11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojConcelhoRH11,
            'max': maxTotAlojConcelhoRH11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojConcelhoRH11);
    inputNumberMax.setAttribute("value",maxTotAlojConcelhoRH11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelhoRH11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelhoRH11.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelhoRH11.noUiSlider.on('update',function(e){
        TotAlojConcelhoRH11.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Hab11>=parseFloat(e[0])&& layer.feature.properties.Resi_Hab11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelhoRH11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderTotAlojConcelhoRH11.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelhoRH11);
}

/////Fim do TOTAL ALojamentos DE Residência Habitual EM 2011

//// Total de Alojamentos de Residência Habitual em 2001 Concelhos //////

var minTotAlojConcelhoRH01 = 0;
var maxTotAlojConcelhoRH01 = 0;
function estiloTotAlojConcelhoRH01(feature, latlng) {
    if(feature.properties.Resi_Hab01< minTotAlojConcelhoRH01 || minTotAlojConcelhoRH01 ===0){
        minTotAlojConcelhoRH01 = feature.properties.Resi_Hab01
    }
    if(feature.properties.Resi_Hab01> maxTotAlojConcelhoRH01){
        maxTotAlojConcelhoRH01 = feature.properties.Resi_Hab01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Hab01,0.1)
    });
}
function apagarTotAlojConcelhoRH01(e){
    var layer = e.target;
    TotAlojConcelhoRH01.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojConcelhoRH01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.Resi_Hab01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelhoRH01,
    })
};

var TotAlojConcelhoRH01= L.geoJSON(formaConcelhosAbsolutos,{
    pointToLayer:estiloTotAlojConcelhoRH01,
    onEachFeature: onEachFeatureTotAlojConcelhoRH01,
});



var slideTotAlojConcelhoRH01 = function(){
    var sliderTotAlojConcelhoRH01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelhoRH01, {
        start: [minTotAlojConcelhoRH01, maxTotAlojConcelhoRH01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojConcelhoRH01,
            'max': maxTotAlojConcelhoRH01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojConcelhoRH01);
    inputNumberMax.setAttribute("value",maxTotAlojConcelhoRH01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelhoRH01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelhoRH01.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelhoRH01.noUiSlider.on('update',function(e){
        TotAlojConcelhoRH01.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Hab01>=parseFloat(e[0])&& layer.feature.properties.Resi_Hab01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelhoRH01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderTotAlojConcelhoRH01.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelhoRH01);
}

/////Fim do TOTAL ALojamentos DE Residência Habitual EM 2001

//// Total de Alojamentos de Residência Habitual em 1991 Concelhos //////

var minTotAlojConcelhoRH91 = 0;
var maxTotAlojConcelhoRH91 = 0;
var segundoTotAlojConcelhoRH91 = 0;
function estiloTotAlojConcelhoRH91(feature, latlng) {
    if(feature.properties.Resi_Hab91< minTotAlojConcelhoRH91 || minTotAlojConcelhoRH91 ===0){
        segundoTotAlojConcelhoRH91 = minTotAlojConcelhoRH91
        minTotAlojConcelhoRH91 = feature.properties.Resi_Hab91
    }
    if(feature.properties.Resi_Hab91> maxTotAlojConcelhoRH91){
        maxTotAlojConcelhoRH91 = feature.properties.Resi_Hab91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Hab91,0.1)
    });
}
function apagarTotAlojConcelhoRH91(e){
    var layer = e.target;
    TotAlojConcelhoRH91.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojConcelhoRH91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.Resi_Hab91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelhoRH91,
    })
};

var TotAlojConcelhoRH91= L.geoJSON(formaConcelhosAbsolutos1991,{
    pointToLayer:estiloTotAlojConcelhoRH91,
    onEachFeature: onEachFeatureTotAlojConcelhoRH91,
});



var slideTotAlojConcelhoRH91 = function(){
    var sliderTotAlojConcelhoRH91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelhoRH91, {
        start: [segundoTotAlojConcelhoRH91, maxTotAlojConcelhoRH91],
        tooltips:true,
        connect: true,
        range: {
            'min': segundoTotAlojConcelhoRH91,
            'max': maxTotAlojConcelhoRH91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",segundoTotAlojConcelhoRH91);
    inputNumberMax.setAttribute("value",maxTotAlojConcelhoRH91);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelhoRH91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelhoRH91.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelhoRH91.noUiSlider.on('update',function(e){
        TotAlojConcelhoRH91.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Hab91>=parseFloat(e[0])&& layer.feature.properties.Resi_Hab91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelhoRH91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderTotAlojConcelhoRH91.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelhoRH91);
}

/////Fim do TOTAL ALojamentos DE Residência Habitual EM 1991

//// Total de Alojamentos de Residência Secundária em 2021 Concelhos //////

var minTotAlojConcelhoRS21 = 0;
var maxTotAlojConcelhoRS21 = 0;
function estiloTotAlojConcelhoRS21(feature, latlng) {
    if(feature.properties.Resi_Sec21< minTotAlojConcelhoRS21 || minTotAlojConcelhoRS21 ===0){
        minTotAlojConcelhoRS21 = feature.properties.Resi_Sec21
    }
    if(feature.properties.Resi_Sec21> maxTotAlojConcelhoRS21){
        maxTotAlojConcelhoRS21 = feature.properties.Resi_Sec21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Sec21,0.1)
    });
}
function apagarTotAlojConcelhoRS21(e){
    var layer = e.target;
    TotAlojConcelhoRS21.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojConcelhoRS21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.Resi_Sec21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelhoRS21,
    })
};

var TotAlojConcelhoRS21= L.geoJSON(formaConcelhosAbsolutos,{
    pointToLayer:estiloTotAlojConcelhoRS21,
    onEachFeature: onEachFeatureTotAlojConcelhoRS21,
});



var slideTotAlojConcelhoRS21 = function(){
    var sliderTotAlojConcelhoRS21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelhoRS21, {
        start: [minTotAlojConcelhoRS21, maxTotAlojConcelhoRS21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojConcelhoRS21,
            'max': maxTotAlojConcelhoRS21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojConcelhoRS21);
    inputNumberMax.setAttribute("value",maxTotAlojConcelhoRS21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelhoRS21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelhoRS21.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelhoRS21.noUiSlider.on('update',function(e){
        TotAlojConcelhoRS21.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Sec21>=parseFloat(e[0])&& layer.feature.properties.Resi_Sec21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelhoRS21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderTotAlojConcelhoRS21.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelhoRS21);
}

/////Fim do TOTAL ALojamentos DE Residência Secundária EM 2021

//// Total de Alojamentos de Residência Secundária em 2011 Concelhos //////

var minTotAlojConcelhoRS11 = 0;
var maxTotAlojConcelhoRS11 = 0;
function estiloTotAlojConcelhoRS11(feature, latlng) {
    if(feature.properties.Resi_Sec11< minTotAlojConcelhoRS11 || minTotAlojConcelhoRS11 ===0){
        minTotAlojConcelhoRS11 = feature.properties.Resi_Sec11
    }
    if(feature.properties.Resi_Sec11> maxTotAlojConcelhoRS11){
        maxTotAlojConcelhoRS11 = feature.properties.Resi_Sec11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Sec11,0.1)
    });
}
function apagarTotAlojConcelhoRS11(e){
    var layer = e.target;
    TotAlojConcelhoRS11.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojConcelhoRS11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.Resi_Sec11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelhoRS11,
    })
};

var TotAlojConcelhoRS11= L.geoJSON(formaConcelhosAbsolutos,{
    pointToLayer:estiloTotAlojConcelhoRS11,
    onEachFeature: onEachFeatureTotAlojConcelhoRS11,
});



var slideTotAlojConcelhoRS11 = function(){
    var sliderTotAlojConcelhoRS11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelhoRS11, {
        start: [minTotAlojConcelhoRS11, maxTotAlojConcelhoRS11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojConcelhoRS11,
            'max': maxTotAlojConcelhoRS11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojConcelhoRS11);
    inputNumberMax.setAttribute("value",maxTotAlojConcelhoRS11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelhoRS11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelhoRS11.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelhoRS11.noUiSlider.on('update',function(e){
        TotAlojConcelhoRS11.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Sec11>=parseFloat(e[0])&& layer.feature.properties.Resi_Sec11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelhoRS11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderTotAlojConcelhoRS11.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelhoRS11);
}

/////Fim do TOTAL ALojamentos DE Residência Secundária EM 2011

//// Total de Alojamentos de Residência Secundária em 2001 Concelhos //////

var minTotAlojConcelhoRS01 = 0;
var maxTotAlojConcelhoRS01 = 0;
function estiloTotAlojConcelhoRS01(feature, latlng) {
    if(feature.properties.Resi_Sec01< minTotAlojConcelhoRS01 || minTotAlojConcelhoRS01 ===0){
        minTotAlojConcelhoRS01 = feature.properties.Resi_Sec01
    }
    if(feature.properties.Resi_Sec01> maxTotAlojConcelhoRS01){
        maxTotAlojConcelhoRS01 = feature.properties.Resi_Sec01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Sec01,0.1)
    });
}
function apagarTotAlojConcelhoRS01(e){
    var layer = e.target;
    TotAlojConcelhoRS01.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojConcelhoRS01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.Resi_Sec01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelhoRS01,
    })
};

var TotAlojConcelhoRS01= L.geoJSON(formaConcelhosAbsolutos,{
    pointToLayer:estiloTotAlojConcelhoRS01,
    onEachFeature: onEachFeatureTotAlojConcelhoRS01,
});



var slideTotAlojConcelhoRS01 = function(){
    var sliderTotAlojConcelhoRS01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelhoRS01, {
        start: [minTotAlojConcelhoRS01, maxTotAlojConcelhoRS01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojConcelhoRS01,
            'max': maxTotAlojConcelhoRS01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojConcelhoRS01);
    inputNumberMax.setAttribute("value",maxTotAlojConcelhoRS01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelhoRS01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelhoRS01.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelhoRS01.noUiSlider.on('update',function(e){
        TotAlojConcelhoRS01.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Sec01>=parseFloat(e[0])&& layer.feature.properties.Resi_Sec01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelhoRS01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderTotAlojConcelhoRS01.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelhoRS01);
}

/////Fim do TOTAL ALojamentos DE Residência Secundária EM 2001

//// Total de Alojamentos de Residência Secundária em 1991 Concelhos //////

var minTotAlojConcelhoRS91 = 0;
var maxTotAlojConcelhoRS91 = 0;
var segundoTotAlojConcelhoRS91 = 0;
function estiloTotAlojConcelhoRS91(feature, latlng) {
    if(feature.properties.Resi_Sec91< minTotAlojConcelhoRS91 || minTotAlojConcelhoRS91 ===0){
        segundoTotAlojConcelhoRS91 = minTotAlojConcelhoRS91
        minTotAlojConcelhoRS91 = feature.properties.Resi_Sec91
    }
    if(feature.properties.Resi_Sec91> maxTotAlojConcelhoRS91){
        maxTotAlojConcelhoRS91 = feature.properties.Resi_Sec91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Sec91,0.1)
    });
}
function apagarTotAlojConcelhoRS91(e){
    var layer = e.target;
    TotAlojConcelhoRS91.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojConcelhoRS91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.Resi_Sec91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelhoRS91,
    })
};

var TotAlojConcelhoRS91= L.geoJSON(formaConcelhosAbsolutos1991,{
    pointToLayer:estiloTotAlojConcelhoRS91,
    onEachFeature: onEachFeatureTotAlojConcelhoRS91,
});



var slideTotAlojConcelhoRS91 = function(){
    var sliderTotAlojConcelhoRS91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelhoRS91, {
        start: [segundoTotAlojConcelhoRS91, maxTotAlojConcelhoRS91],
        tooltips:true,
        connect: true,
        range: {
            'min': segundoTotAlojConcelhoRS91,
            'max': maxTotAlojConcelhoRS91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",segundoTotAlojConcelhoRS91);
    inputNumberMax.setAttribute("value",maxTotAlojConcelhoRS91);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelhoRS91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelhoRS91.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelhoRS91.noUiSlider.on('update',function(e){
        TotAlojConcelhoRS91.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Sec91>=parseFloat(e[0])&& layer.feature.properties.Resi_Sec91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelhoRS91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderTotAlojConcelhoRS91.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelhoRS91);
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
                    $(legendCircle).append("<span class='legendValue legendaCirculosExcecao '>"+classes[i]+"<span>");
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

/////Fim do TOTAL ALojamentos DE Residência Secundária EM 1991

//// Total de Alojamentos VAGOS em 2021 Concelhos //////

var minTotAlojConcelhoVago21 = 0;
var maxTotAlojConcelhoVago21 = 0;
function estiloTotAlojConcelhoVago21(feature, latlng) {
    if(feature.properties.AlojVago21< minTotAlojConcelhoVago21 || minTotAlojConcelhoVago21 ===0){
        minTotAlojConcelhoVago21 = feature.properties.AlojVago21
    }
    if(feature.properties.AlojVago21> maxTotAlojConcelhoVago21){
        maxTotAlojConcelhoVago21 = feature.properties.AlojVago21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlojVago21,0.1)
    });
}
function apagarTotAlojConcelhoVago21(e){
    var layer = e.target;
    TotAlojConcelhoVago21.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojConcelhoVago21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.AlojVago21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelhoVago21,
    })
};

var TotAlojConcelhoVago21= L.geoJSON(formaConcelhosAbsolutos,{
    pointToLayer:estiloTotAlojConcelhoVago21,
    onEachFeature: onEachFeatureTotAlojConcelhoVago21,
});



var slideTotAlojConcelhoVago21 = function(){
    var sliderTotAlojConcelhoVago21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelhoVago21, {
        start: [minTotAlojConcelhoVago21, maxTotAlojConcelhoVago21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojConcelhoVago21,
            'max': maxTotAlojConcelhoVago21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojConcelhoVago21);
    inputNumberMax.setAttribute("value",maxTotAlojConcelhoVago21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelhoVago21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelhoVago21.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelhoVago21.noUiSlider.on('update',function(e){
        TotAlojConcelhoVago21.eachLayer(function(layer){
            if(layer.feature.properties.AlojVago21>=parseFloat(e[0])&& layer.feature.properties.AlojVago21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelhoVago21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderTotAlojConcelhoVago21.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelhoVago21);
}

var legendaExcecaoVagos = function(tituloescrito, maximo,medio,minimo, multiplicador) {
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
                    $(legendCircle).append("<span class='legendValue2 legendaCirculosExcecao margin0'>"+classes[i]+"<span>");
                }
                if (i == 1){
                    $(legendCircle).append("<span class='legendValue excecaoVagos'>"+classes[i]+"<span>");
                }
                if(i == 2){
                    $(legendCircle).append("<span class='legendValue legendaExcecaoBaixar'>"+classes[i]+"<span>");
                }

            $(symbolsContainer).append(legendCircle);

            lastRadius = currentRadius;

        }
        $(legendaA).append(symbolsContainer);
        legendaA.style.visibility = "visible"
        }


/////Fim do TOTAL ALojamentos DE Residência Vago EM 2021

//// Total de Alojamentos VAGOS em 2011 Concelhos //////

var minTotAlojConcelhoVago11 = 0;
var maxTotAlojConcelhoVago11 = 0;
function estiloTotAlojConcelhoVago11(feature, latlng) {
    if(feature.properties.AlojVago11< minTotAlojConcelhoVago11 || minTotAlojConcelhoVago11 ===0){
        minTotAlojConcelhoVago11 = feature.properties.AlojVago11
    }
    if(feature.properties.AlojVago11> maxTotAlojConcelhoVago11){
        maxTotAlojConcelhoVago11 = feature.properties.AlojVago11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlojVago11,0.1)
    });
}
function apagarTotAlojConcelhoVago11(e){
    var layer = e.target;
    TotAlojConcelhoVago11.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojConcelhoVago11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.AlojVago11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelhoVago11,
    })
};

var TotAlojConcelhoVago11= L.geoJSON(formaConcelhosAbsolutos,{
    pointToLayer:estiloTotAlojConcelhoVago11,
    onEachFeature: onEachFeatureTotAlojConcelhoVago11,
});



var slideTotAlojConcelhoVago11 = function(){
    var sliderTotAlojConcelhoVago11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelhoVago11, {
        start: [minTotAlojConcelhoVago11, maxTotAlojConcelhoVago11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojConcelhoVago11,
            'max': maxTotAlojConcelhoVago11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojConcelhoVago11);
    inputNumberMax.setAttribute("value",maxTotAlojConcelhoVago11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelhoVago11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelhoVago11.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelhoVago11.noUiSlider.on('update',function(e){
        TotAlojConcelhoVago11.eachLayer(function(layer){
            if(layer.feature.properties.AlojVago11>=parseFloat(e[0])&& layer.feature.properties.AlojVago11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelhoVago11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderTotAlojConcelhoVago11.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelhoVago11);
}

/////Fim do TOTAL ALojamentos DE Residência Vago EM 2011


//// Total de Alojamentos VAGOS em 2001 Concelhos //////

var minTotAlojConcelhoVago01 = 0;
var maxTotAlojConcelhoVago01 = 0;
function estiloTotAlojConcelhoVago01(feature, latlng) {
    if(feature.properties.AlojVago01< minTotAlojConcelhoVago01 || minTotAlojConcelhoVago01 ===0){
        minTotAlojConcelhoVago01 = feature.properties.AlojVago01
    }
    if(feature.properties.AlojVago01> maxTotAlojConcelhoVago01){
        maxTotAlojConcelhoVago01 = feature.properties.AlojVago01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlojVago01,0.1)
    });
}
function apagarTotAlojConcelhoVago01(e){
    var layer = e.target;
    TotAlojConcelhoVago01.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojConcelhoVago01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.AlojVago01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelhoVago01,
    })
};

var TotAlojConcelhoVago01= L.geoJSON(formaConcelhosAbsolutos,{
    pointToLayer:estiloTotAlojConcelhoVago01,
    onEachFeature: onEachFeatureTotAlojConcelhoVago01,
});



var slideTotAlojConcelhoVago01 = function(){
    var sliderTotAlojConcelhoVago01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelhoVago01, {
        start: [minTotAlojConcelhoVago01, maxTotAlojConcelhoVago01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojConcelhoVago01,
            'max': maxTotAlojConcelhoVago01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojConcelhoVago01);
    inputNumberMax.setAttribute("value",maxTotAlojConcelhoVago01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelhoVago01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelhoVago01.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelhoVago01.noUiSlider.on('update',function(e){
        TotAlojConcelhoVago01.eachLayer(function(layer){
            if(layer.feature.properties.AlojVago01>=parseFloat(e[0])&& layer.feature.properties.AlojVago01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelhoVago01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderTotAlojConcelhoVago01.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelhoVago01);
}

/////Fim do TOTAL ALojamentos DE Residência Vago EM 2001

//// Total de Alojamentos VAGOS em 1991 Concelhos //////

var minTotAlojConcelhoVago91 = 0;
var maxTotAlojConcelhoVago91 = 0;
var segundoTotAlojConcelhoVago91 = 0;
function estiloTotAlojConcelhoVago91(feature, latlng) {
    if(feature.properties.AlojVago91< minTotAlojConcelhoVago91 || minTotAlojConcelhoVago91 ===0){
        segundoTotAlojConcelhoVago91 = minTotAlojConcelhoVago91
        minTotAlojConcelhoVago91 = feature.properties.AlojVago91
    }
    if(feature.properties.AlojVago91> maxTotAlojConcelhoVago91){
        maxTotAlojConcelhoVago91 = feature.properties.AlojVago91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlojVago91,0.1)
    });
}
function apagarTotAlojConcelhoVago91(e){
    var layer = e.target;
    TotAlojConcelhoVago91.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojConcelhoVago91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.AlojVago91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojConcelhoVago91,
    })
};

var TotAlojConcelhoVago91= L.geoJSON(formaConcelhosAbsolutos1991,{
    pointToLayer:estiloTotAlojConcelhoVago91,
    onEachFeature: onEachFeatureTotAlojConcelhoVago91,
});



var slideTotAlojConcelhoVago91 = function(){
    var sliderTotAlojConcelhoVago91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojConcelhoVago91, {
        start: [segundoTotAlojConcelhoVago91, maxTotAlojConcelhoVago91],
        tooltips:true,
        connect: true,
        range: {
            'min': segundoTotAlojConcelhoVago91,
            'max': maxTotAlojConcelhoVago91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",segundoTotAlojConcelhoVago91);
    inputNumberMax.setAttribute("value",maxTotAlojConcelhoVago91);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojConcelhoVago91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojConcelhoVago91.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojConcelhoVago91.noUiSlider.on('update',function(e){
        TotAlojConcelhoVago91.eachLayer(function(layer){
            if(layer.feature.properties.AlojVago91>=parseFloat(e[0])&& layer.feature.properties.AlojVago91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojConcelhoVago91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderTotAlojConcelhoVago91.noUiSlider;
    $(slidersGeral).append(sliderTotAlojConcelhoVago91);
}

/////Fim do TOTAL ALojamentos DE Residência Vago EM 1991
////// --------------------------------------- FIM DADOS ABSOLUTOS CONCELHOS ------------------------------------------ \\\\\\\\\\\\\\\\

////// --------------------------------------- DADOS RELATIVOS CONCELHOS ------------------------------------------------\\\\\\\\\\\\

///---------------------------- Percentagem de Alojamentos RESIDÊNCIA HABITUAL2021 Concelhos //////



function CorPercentagem(d) {
    return d === 100 ? '#fe821c' :
        d >= 95  ? '#fe8420' :
        d >= 90  ? '#fd8825' :
        d >= 85  ? '#fd8a28' :
        d >= 80   ? '#fd9131' :
        d >= 75  ? '#fc983c' :
        d >= 70   ? '#fb9c43' :
        d >= 65   ? '#fb9f47' :
        d >= 60  ? '#fba54f' :
        d >= 55   ? '#fbaa56' :
        d >= 50   ? '#fbb05e' :
        d >= 45  ? '#fbb666' :
        d >= 40   ? '#fbbe71' :
        d >= 35  ? '#fbc378' :
        d >= 30   ? '#fbc77e' :
        d >= 25   ? '#fbcb83' :
        d >= 20  ? '#fbd490' :
        d >= 15   ? '#fbd997' :
        d >= 10   ? '#fbe0a1' :
        d >= 5 ?  '#fbe9ad' :
        d >= 0 ?  '#fbf0b6' :
        d === null ? 'rgb(125,125,125':
                ''  ;
    }

var minPerConcelhoRH21 = 0;
var maxPerConcelhoRH21 = 0;

function EstiloPerConcelhoRH21(feature) {
    if( feature.properties.Per_RHab21 < minPerConcelhoRH21 || minPerConcelhoRH21 === 0){
        minPerConcelhoRH21 = feature.properties.Per_RHab21
    }
    if(feature.properties.Per_RHab21 > maxPerConcelhoRH21 ){
        maxPerConcelhoRH21 = feature.properties.Per_RHab21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.Per_RHab21)
    };
}


function apagarPerConcelhoRH21(e) {
    PerConcelhoRH21.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerConcelhoRH21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per_RHab21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConcelhoRH21,
    });
}
var PerConcelhoRH21= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloPerConcelhoRH21,
    onEachFeature: onEachFeaturePerConcelhoRH21
});
var legendaPerConcelhoRH21 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Percentagem de Alojamentos Familiares Clássicos de Residência Habitual em 2021'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 20 - 25' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 10 - 17.2' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 7 - 10' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' 3 - 7' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' 0 - 3' + '<br>'



    $(legendaA).append(symbolsContainer); 
}
let slidePerConcelhoRH21 = function(){
    var sliderPerConcelhoRH21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConcelhoRH21, {
        start: [minPerConcelhoRH21, maxPerConcelhoRH21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConcelhoRH21,
            'max': maxPerConcelhoRH21
        },
        });
    inputNumberMin.setAttribute("value",minPerConcelhoRH21);
    inputNumberMax.setAttribute("value",maxPerConcelhoRH21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConcelhoRH21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConcelhoRH21.noUiSlider.set([null, this.value]);
    });

    sliderPerConcelhoRH21.noUiSlider.on('update',function(e){
        PerConcelhoRH21.eachLayer(function(layer){
            if(layer.feature.properties.Per_RHab21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_RHab21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConcelhoRH21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderPerConcelhoRH21.noUiSlider;
    $(slidersGeral).append(sliderPerConcelhoRH21);
} 
/// --------------------------------------  FIM Percentagem RESIDÊNCIA HABITUAL 2021 Concelhos


/////-------------------- PERCENTAGEM RESIDÊNCIA HABITUAL 2011 Concelhos ----------

var minPerConcelhoRH11 = 0;
var maxPerConcelhoRH11 = 0;

function EstiloPerConcelhoRH11(feature) {
    if( feature.properties.Per_RHab11 < minPerConcelhoRH11 || minPerConcelhoRH11 === 0){
        minPerConcelhoRH11 = feature.properties.Per_RHab11
    }
    if(feature.properties.Per_RHab11 > maxPerConcelhoRH11 ){
        maxPerConcelhoRH11 = feature.properties.Per_RHab11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.Per_RHab11)
    };
}


function apagarPerConcelhoRH11(e) {
    PerConcelhoRH11.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerConcelhoRH11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per_RHab11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConcelhoRH11,
    });
}
var PerConcelhoRH11= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloPerConcelhoRH11,
    onEachFeature: onEachFeaturePerConcelhoRH11
});
var legendaPerConcelhoRH11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Percentagem de Alojamentos Familiares Clássicos de Residência Habitual em 2011'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 20 - 25' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 10 - 17.2' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 7 - 10' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' 3 - 7' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' 0 - 3' + '<br>'



    $(legendaA).append(symbolsContainer); 
}
let slidePerConcelhoRH11 = function(){
    var sliderPerConcelhoRH11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConcelhoRH11, {
        start: [minPerConcelhoRH11, maxPerConcelhoRH11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConcelhoRH11,
            'max': maxPerConcelhoRH11
        },
        });
    inputNumberMin.setAttribute("value",minPerConcelhoRH11);
    inputNumberMax.setAttribute("value",maxPerConcelhoRH11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConcelhoRH11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConcelhoRH11.noUiSlider.set([null, this.value]);
    });

    sliderPerConcelhoRH11.noUiSlider.on('update',function(e){
        PerConcelhoRH11.eachLayer(function(layer){
            if(layer.feature.properties.Per_RHab11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_RHab11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConcelhoRH11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderPerConcelhoRH11.noUiSlider;
    $(slidersGeral).append(sliderPerConcelhoRH11);
} 
/// --------------------------------------  FIM Percentagem RESIDÊNCIA HABITUAL 2011 Concelhos

/////-------------------- PERCENTAGEM RESIDÊNCIA HABITUAL 2001 Concelhos ----------

var minPerConcelhoRH01 = 0;
var maxPerConcelhoRH01 = 0;

function EstiloPerConcelhoRH01(feature) {
    if( feature.properties.Per_RHab01 < minPerConcelhoRH01 || minPerConcelhoRH01 === 0){
        minPerConcelhoRH01 = feature.properties.Per_RHab01
    }
    if(feature.properties.Per_RHab01 > maxPerConcelhoRH01 ){
        maxPerConcelhoRH01 = feature.properties.Per_RHab01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.Per_RHab01)
    };
}


function apagarPerConcelhoRH01(e) {
    PerConcelhoRH01.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerConcelhoRH01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per_RHab01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConcelhoRH01,
    });
}
var PerConcelhoRH01= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloPerConcelhoRH01,
    onEachFeature: onEachFeaturePerConcelhoRH01
});
var legendaPerConcelhoRH01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Percentagem de Alojamentos Familiares Clássicos de Residência Habitual em 2001'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 20 - 25' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 10 - 17.2' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 7 - 10' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' 3 - 7' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' 0 - 3' + '<br>'



    $(legendaA).append(symbolsContainer); 
}
let slidePerConcelhoRH01 = function(){
    var sliderPerConcelhoRH01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConcelhoRH01, {
        start: [minPerConcelhoRH01, maxPerConcelhoRH01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConcelhoRH01,
            'max': maxPerConcelhoRH01
        },
        });
    inputNumberMin.setAttribute("value",minPerConcelhoRH01);
    inputNumberMax.setAttribute("value",maxPerConcelhoRH01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConcelhoRH01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConcelhoRH01.noUiSlider.set([null, this.value]);
    });

    sliderPerConcelhoRH01.noUiSlider.on('update',function(e){
        PerConcelhoRH01.eachLayer(function(layer){
            if(layer.feature.properties.Per_RHab01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_RHab01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConcelhoRH01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderPerConcelhoRH01.noUiSlider;
    $(slidersGeral).append(sliderPerConcelhoRH01);
} 
/// --------------------------------------  FIM Percentagem RESIDÊNCIA HABITUAL 2001 Concelhos

/////-------------------- PERCENTAGEM RESIDÊNCIA HABITUAL 2001 Concelhos ----------

var minPerConcelhoRH91 = 0;
var maxPerConcelhoRH91 = 0;

function EstiloPerConcelhoRH91(feature) {
    if( feature.properties.Per_RHab91 < minPerConcelhoRH91 && feature.properties.Per_RHab91 > null || minPerConcelhoRH91 === 0){
        minPerConcelhoRH91 = feature.properties.Per_RHab91
    }
    if(feature.properties.Per_RHab91 > maxPerConcelhoRH91 ){
        maxPerConcelhoRH91 = feature.properties.Per_RHab91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.Per_RHab91)
    };
}


function apagarPerConcelhoRH91(e) {
    PerConcelhoRH91.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerConcelhoRH91(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per_RHab91 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConcelhoRH91,
    });
}
var PerConcelhoRH91= L.geoJSON(formaConcelhosRelativos1991, {
    style:EstiloPerConcelhoRH91,
    onEachFeature: onEachFeaturePerConcelhoRH91
});
var legendaPerConcelhoRH91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Percentagem de Alojamentos Familiares Clássicos de Residência Habitual em 1991'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 20 - 25' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 10 - 17.2' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 7 - 10' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' 3 - 7' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' 0 - 3' + '<br>'



    $(legendaA).append(symbolsContainer); 
}
let slidePerConcelhoRH91 = function(){
    var sliderPerConcelhoRH91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConcelhoRH91, {
        start: [minPerConcelhoRH91, maxPerConcelhoRH91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConcelhoRH91,
            'max': maxPerConcelhoRH91
        },
        });
    inputNumberMin.setAttribute("value",minPerConcelhoRH91);
    inputNumberMax.setAttribute("value",maxPerConcelhoRH91);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConcelhoRH91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConcelhoRH91.noUiSlider.set([null, this.value]);
    });

    sliderPerConcelhoRH91.noUiSlider.on('update',function(e){
        PerConcelhoRH91.eachLayer(function(layer){
            if (layer.feature.properties.Per_RHab91 == null){
                return false
            }
            if(layer.feature.properties.Per_RHab91>=parseFloat(e[0])&& layer.feature.properties.Per_RHab91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConcelhoRH91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderPerConcelhoRH91.noUiSlider;
    $(slidersGeral).append(sliderPerConcelhoRH91);
} 
/// --------------------------------------  FIM Percentagem RESIDÊNCIA HABITUAL 1991 Concelhos

///---------------------------- Percentagem de Alojamentos RESIDÊNCIA SECUNDÁRIA Concelhos //////


var minPerConcelhoRS21 = 0;
var maxPerConcelhoRS21 = 0;

function EstiloPerConcelhoRS21(feature) {
    if( feature.properties.Per_RSec21 < minPerConcelhoRS21 || minPerConcelhoRS21 === 0){
        minPerConcelhoRS21 = feature.properties.Per_RSec21
    }
    if(feature.properties.Per_RSec21 > maxPerConcelhoRS21 ){
        maxPerConcelhoRS21 = feature.properties.Per_RSec21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.Per_RSec21)
    };
}


function apagarPerConcelhoRS21(e) {
    PerConcelhoRS21.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerConcelhoRS21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per_RSec21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConcelhoRS21,
    });
}
var PerConcelhoRS21= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloPerConcelhoRS21,
    onEachFeature: onEachFeaturePerConcelhoRS21
});
var legendaPerConcelhoRS21 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Percentagem de Alojamentos Familiares Clássicos de Residência Secundária em 2021'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 20 - 25' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 10 - 17.2' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 7 - 10' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' 3 - 7' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' 0 - 3' + '<br>'



    $(legendaA).append(symbolsContainer); 
}
let slidePerConcelhoRS21 = function(){
    var sliderPerConcelhoRS21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConcelhoRS21, {
        start: [minPerConcelhoRS21, maxPerConcelhoRS21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConcelhoRS21,
            'max': maxPerConcelhoRS21
        },
        });
    inputNumberMin.setAttribute("value",minPerConcelhoRS21);
    inputNumberMax.setAttribute("value",maxPerConcelhoRS21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConcelhoRS21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConcelhoRS21.noUiSlider.set([null, this.value]);
    });

    sliderPerConcelhoRS21.noUiSlider.on('update',function(e){
        PerConcelhoRS21.eachLayer(function(layer){
            if(layer.feature.properties.Per_RSec21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_RSec21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConcelhoRS21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderPerConcelhoRS21.noUiSlider;
    $(slidersGeral).append(sliderPerConcelhoRS21);
} 
/// --------------------------------------  FIM Percentagem RESIDÊNCIA SECUNDÁRIA 2021 Concelhos


/////-------------------- PERCENTAGEM RESIDÊNCIA SECUNDÁRIA 2011 Concelhos ----------

var minPerConcelhoRS11 = 0;
var maxPerConcelhoRS11 = 0;

function EstiloPerConcelhoRS11(feature) {
    if( feature.properties.Per_RSec11 < minPerConcelhoRS11 || minPerConcelhoRS11 === 0){
        minPerConcelhoRS11 = feature.properties.Per_RSec11
    }
    if(feature.properties.Per_RSec11 > maxPerConcelhoRS11 ){
        maxPerConcelhoRS11 = feature.properties.Per_RSec11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.Per_RSec11)
    };
}


function apagarPerConcelhoRS11(e) {
    PerConcelhoRS11.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerConcelhoRS11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per_RSec11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConcelhoRS11,
    });
}
var PerConcelhoRS11= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloPerConcelhoRS11,
    onEachFeature: onEachFeaturePerConcelhoRS11
});
var legendaPerConcelhoRS11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Percentagem de Alojamentos Familiares Clássicos de Residência Secundária em 2011'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 20 - 25' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 10 - 17.2' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 7 - 10' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' 3 - 7' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' 0 - 3' + '<br>'



    $(legendaA).append(symbolsContainer); 
}
let slidePerConcelhoRS11 = function(){
    var sliderPerConcelhoRS11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConcelhoRS11, {
        start: [minPerConcelhoRS11, maxPerConcelhoRS11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConcelhoRS11,
            'max': maxPerConcelhoRS11
        },
        });
    inputNumberMin.setAttribute("value",minPerConcelhoRS11);
    inputNumberMax.setAttribute("value",maxPerConcelhoRS11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConcelhoRS11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConcelhoRS11.noUiSlider.set([null, this.value]);
    });

    sliderPerConcelhoRS11.noUiSlider.on('update',function(e){
        PerConcelhoRS11.eachLayer(function(layer){
            if(layer.feature.properties.Per_RSec11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_RSec11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConcelhoRS11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderPerConcelhoRS11.noUiSlider;
    $(slidersGeral).append(sliderPerConcelhoRS11);
} 
/// --------------------------------------  FIM Percentagem RESIDÊNCIA SECUNDÁRIA 2011 Concelhos

/////-------------------- PERCENTAGEM RESIDÊNCIA SECUNDÁRIA 2001 Concelhos ----------

var minPerConcelhoRS01 = 0;
var maxPerConcelhoRS01 = 0;

function EstiloPerConcelhoRS01(feature) {
    if( feature.properties.Per_RSec11 < minPerConcelhoRS01 || minPerConcelhoRS01 === 0){
        minPerConcelhoRS01 = feature.properties.Per_RSec11
    }
    if(feature.properties.Per_RSec11 > maxPerConcelhoRS01 ){
        maxPerConcelhoRS01 = feature.properties.Per_RSec11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.Per_RSec11)
    };
}


function apagarPerConcelhoRS01(e) {
    PerConcelhoRS01.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerConcelhoRS01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per_RSec11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConcelhoRS01,
    });
}
var PerConcelhoRS01= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloPerConcelhoRS01,
    onEachFeature: onEachFeaturePerConcelhoRS01
});
var legendaPerConcelhoRS01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Percentagem de Alojamentos Familiares Clássicos de Residência Secundária em 2001'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 20 - 25' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 10 - 17.2' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 7 - 10' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' 3 - 7' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' 0 - 3' + '<br>'



    $(legendaA).append(symbolsContainer); 
}
let slidePerConcelhoRS01 = function(){
    var sliderPerConcelhoRS01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConcelhoRS01, {
        start: [minPerConcelhoRS01, maxPerConcelhoRS01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConcelhoRS01,
            'max': maxPerConcelhoRS01
        },
        });
    inputNumberMin.setAttribute("value",minPerConcelhoRS01);
    inputNumberMax.setAttribute("value",maxPerConcelhoRS01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConcelhoRS01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConcelhoRS01.noUiSlider.set([null, this.value]);
    });

    sliderPerConcelhoRS01.noUiSlider.on('update',function(e){
        PerConcelhoRS01.eachLayer(function(layer){
            if(layer.feature.properties.Per_RSec11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_RSec11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConcelhoRS01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderPerConcelhoRS01.noUiSlider;
    $(slidersGeral).append(sliderPerConcelhoRS01);
} 
/// --------------------------------------  FIM Percentagem RESIDÊNCIA SECUNDÁRIA 2001 Concelhos



/////-------------------- PERCENTAGEM RESIDÊNCIA SECUNDÁRIA 1991 Concelhos ----------

var minPerConcelhoRS91 = 0;
var maxPerConcelhoRS91 = 0;

function EstiloPerConcelhoRS91(feature) {
    if( feature.properties.Per_RSec91 < minPerConcelhoRS91 && feature.properties.Per_RSec91 > null || minPerConcelhoRS91 === 0){
        minPerConcelhoRS91 = feature.properties.Per_RSec91
    }
    if(feature.properties.Per_RSec91 > maxPerConcelhoRS91 ){
        maxPerConcelhoRS91 = feature.properties.Per_RSec91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.Per_RSec91)
    };
}


function apagarPerConcelhoRS91(e) {
    PerConcelhoRS91.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerConcelhoRS91(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per_RSec91 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConcelhoRS91,
    });
}
var PerConcelhoRS91= L.geoJSON(formaConcelhosRelativos1991, {
    style:EstiloPerConcelhoRS91,
    onEachFeature: onEachFeaturePerConcelhoRS91
});
var legendaPerConcelhoRS91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Percentagem de Alojamentos Familiares Clássicos de Residência Secundária em 1991'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 20 - 25' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 10 - 17.2' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 7 - 10' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' 3 - 7' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' 0 - 3' + '<br>'



    $(legendaA).append(symbolsContainer); 
}
let slidePerConcelhoRS91 = function(){
    var sliderPerConcelhoRS91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConcelhoRS91, {
        start: [minPerConcelhoRS91, maxPerConcelhoRS91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConcelhoRS91,
            'max': maxPerConcelhoRS91
        },
        });
    inputNumberMin.setAttribute("value",minPerConcelhoRS91);
    inputNumberMax.setAttribute("value",maxPerConcelhoRS91);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConcelhoRS91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConcelhoRS91.noUiSlider.set([null, this.value]);
    });

    sliderPerConcelhoRS91.noUiSlider.on('update',function(e){
        PerConcelhoRS91.eachLayer(function(layer){
            if (layer.feature.properties.Per_RSec91 == null){
                return false
            }
            if(layer.feature.properties.Per_RSec91>=parseFloat(e[0])&& layer.feature.properties.Per_RSec91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConcelhoRS91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderPerConcelhoRS91.noUiSlider;
    $(slidersGeral).append(sliderPerConcelhoRS91);
} 
/// --------------------------------------  FIM Percentagem RESIDÊNCIA SECUNDÁRIA 1991 Concelhos

///---------------------------- Percentagem de Alojamentos VAGOS  Concelhos 2021 //////


var minPerConcelhoVago21 = 0;
var maxPerConcelhoVago21 = 0;

function EstiloPerConcelhoVago21(feature) {
    if( feature.properties.PerVago21 < minPerConcelhoVago21 || minPerConcelhoVago21 === 0){
        minPerConcelhoVago21 = feature.properties.PerVago21
    }
    if(feature.properties.PerVago21 > maxPerConcelhoVago21 ){
        maxPerConcelhoVago21 = feature.properties.PerVago21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.PerVago21)
    };
}


function apagarPerConcelhoVago21(e) {
    PerConcelhoVago21.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerConcelhoVago21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerVago21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConcelhoVago21,
    });
}
var PerConcelhoVago21= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloPerConcelhoVago21,
    onEachFeature: onEachFeaturePerConcelhoVago21
});
var legendaPerConcelhoVago21 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Percentagem de Alojamentos Familiares Clássicos Vagos em 2021'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 20 - 25' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 10 - 17.2' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 7 - 10' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' 3 - 7' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' 0 - 3' + '<br>'



    $(legendaA).append(symbolsContainer); 
}
let slidePerConcelhoVago21 = function(){
    var sliderPerConcelhoVago21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConcelhoVago21, {
        start: [minPerConcelhoVago21, maxPerConcelhoVago21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConcelhoVago21,
            'max': maxPerConcelhoVago21
        },
        });
    inputNumberMin.setAttribute("value",minPerConcelhoVago21);
    inputNumberMax.setAttribute("value",maxPerConcelhoVago21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConcelhoVago21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConcelhoVago21.noUiSlider.set([null, this.value]);
    });

    sliderPerConcelhoVago21.noUiSlider.on('update',function(e){
        PerConcelhoVago21.eachLayer(function(layer){
            if(layer.feature.properties.PerVago21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerVago21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConcelhoVago21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderPerConcelhoVago21.noUiSlider;
    $(slidersGeral).append(sliderPerConcelhoVago21);
} 
/// --------------------------------------  FIM Percentagem ALOJAMENTOS VAGOS 2021 Concelhos


/////-------------------- PERCENTAGEM ALOJAMENTOS VAGOS 2011 Concelhos ----------

var minPerConcelhoVago11 = 0;
var maxPerConcelhoVago11 = 0;

function EstiloPerConcelhoVago11(feature) {
    if( feature.properties.PerVago11 < minPerConcelhoVago11 || minPerConcelhoVago11 === 0){
        minPerConcelhoVago11 = feature.properties.PerVago11
    }
    if(feature.properties.PerVago11 > maxPerConcelhoVago11 ){
        maxPerConcelhoVago11 = feature.properties.PerVago11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.PerVago11)
    };
}


function apagarPerConcelhoVago11(e) {
    PerConcelhoVago11.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerConcelhoVago11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerVago11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConcelhoVago11,
    });
}
var PerConcelhoVago11= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloPerConcelhoVago11,
    onEachFeature: onEachFeaturePerConcelhoVago11
});
var legendaPerConcelhoVago11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Percentagem de Alojamentos Familiares Clássicos Vagos em 2011'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 20 - 25' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 10 - 17.2' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 7 - 10' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' 3 - 7' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' 0 - 3' + '<br>'



    $(legendaA).append(symbolsContainer); 
}
let slidePerConcelhoVago11 = function(){
    var sliderPerConcelhoVago11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConcelhoVago11, {
        start: [minPerConcelhoVago11, maxPerConcelhoVago11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConcelhoVago11,
            'max': maxPerConcelhoVago11
        },
        });
    inputNumberMin.setAttribute("value",minPerConcelhoVago11);
    inputNumberMax.setAttribute("value",maxPerConcelhoVago11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConcelhoVago11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConcelhoVago11.noUiSlider.set([null, this.value]);
    });

    sliderPerConcelhoVago11.noUiSlider.on('update',function(e){
        PerConcelhoVago11.eachLayer(function(layer){
            if(layer.feature.properties.PerVago11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerVago11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConcelhoVago11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderPerConcelhoVago11.noUiSlider;
    $(slidersGeral).append(sliderPerConcelhoVago11);
} 
/// --------------------------------------  FIM Percentagem ALOJAMENTOS VAGOS 2011 Concelhos

/////-------------------- PERCENTAGEM ALOJAMENTOS VAGOS 2001 Concelhos ----------

var minPerConcelhoVago01 = 0;
var maxPerConcelhoVago01 = 0;

function EstiloPerConcelhoVago01(feature) {
    if( feature.properties.PerVago01 < minPerConcelhoVago01 || minPerConcelhoVago01 === 0){
        minPerConcelhoVago01 = feature.properties.PerVago01
    }
    if(feature.properties.PerVago21 > maxPerConcelhoVago01 ){
        maxPerConcelhoVago01 = feature.properties.PerVago01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.PerVago01)
    };
}


function apagarPerConcelhoVago01(e) {
    PerConcelhoVago01.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerConcelhoVago01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerVago01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConcelhoVago01,
    });
}
var PerConcelhoVago01= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloPerConcelhoVago01,
    onEachFeature: onEachFeaturePerConcelhoVago01
});
var legendaPerConcelhoVago01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Percentagem de Alojamentos Familiares Clássicos Vagos em 2001'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 20 - 25' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 10 - 17.2' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 7 - 10' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' 3 - 7' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' 0 - 3' + '<br>'



    $(legendaA).append(symbolsContainer); 
}
let slidePerConcelhoVago01 = function(){
    var sliderPerConcelhoVago01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConcelhoVago01, {
        start: [minPerConcelhoVago01, maxPerConcelhoVago01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConcelhoVago01,
            'max': maxPerConcelhoVago01
        },
        });
    inputNumberMin.setAttribute("value",minPerConcelhoVago01);
    inputNumberMax.setAttribute("value",maxPerConcelhoVago01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConcelhoVago01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConcelhoVago01.noUiSlider.set([null, this.value]);
    });

    sliderPerConcelhoVago01.noUiSlider.on('update',function(e){
        PerConcelhoVago01.eachLayer(function(layer){
            if(layer.feature.properties.PerVago01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerVago01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConcelhoVago01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderPerConcelhoVago01.noUiSlider;
    $(slidersGeral).append(sliderPerConcelhoVago01);
} 
/// --------------------------------------  FIM Percentagem ALOJAMENTOS VAGOS 2001 Concelhos

/////-------------------- PERCENTAGEM ALOJAMENTOS VAGOS 1991 Concelhos ----------

var minPerConcelhoVago91 = 0;
var maxPerConcelhoVago91 = 0;

function EstiloPerConcelhoVago91(feature) {
    if( feature.properties.PerVago91 < minPerConcelhoVago91 && feature.properties.PerVago91 > null || minPerConcelhoVago91 === 0){
        minPerConcelhoVago91 = feature.properties.PerVago91
    }
    if(feature.properties.PerVago91 > maxPerConcelhoVago91 ){
        maxPerConcelhoVago91 = feature.properties.PerVago91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.PerVago91)
    };
}


function apagarPerConcelhoVago91(e) {
    PerConcelhoVago91.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeaturePerConcelhoVago91(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerVago91 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConcelhoVago91,
    });
}
var PerConcelhoVago91= L.geoJSON(formaConcelhosRelativos1991, {
    style:EstiloPerConcelhoVago91,
    onEachFeature: onEachFeaturePerConcelhoVago91
});
var legendaPerConcelhoVago91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Percentagem de Alojamentos Familiares Vagos em 1991'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 20 - 25' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 10 - 17.2' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 7 - 10' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' 3 - 7' + '<br>'
    // symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' 0 - 3' + '<br>'



    $(legendaA).append(symbolsContainer); 
}
let slidePerConcelhoVago91 = function(){
    var sliderPerConcelhoVago91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConcelhoVago91, {
        start: [minPerConcelhoVago91, maxPerConcelhoVago91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConcelhoVago91,
            'max': maxPerConcelhoVago91
        },
        });
    inputNumberMin.setAttribute("value",minPerConcelhoVago91);
    inputNumberMax.setAttribute("value",maxPerConcelhoVago91);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConcelhoVago91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConcelhoVago91.noUiSlider.set([null, this.value]);
    });

    sliderPerConcelhoVago91.noUiSlider.on('update',function(e){
        PerConcelhoVago91.eachLayer(function(layer){
            if (layer.feature.properties.PerVago91 == null){
                return false
            }
            if(layer.feature.properties.PerVago91>=parseFloat(e[0])&& layer.feature.properties.PerVago91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConcelhoVago91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderPerConcelhoVago91.noUiSlider;
    $(slidersGeral).append(sliderPerConcelhoVago91);
} 
/// --------------------------------------  FIM Percentagem ALOJAMENTOS VAGOS EM 1991 Concelhos


//////------- Variação dos ALOJAMENTOS FAMILIARES DE RESIDÊNCIA HABITUAL Concelhos entre 2021 e 2011 -----////
function CorVariacao(d) {

    return d === null ? '#A9A9A9':
        d === 51.45 ? '#ff7f7f' :
        d > 44.37  ? '#ff8e86' :
        d > 37.29  ? '#ff9d8d' :
        d > 30.21  ? '#ffac93' :
        d > 23.13   ? '#ffbb9a' :
        d > 16.05   ? '#ffcaa1' :
        d > 8.97  ? '#ffd9a7' :
        d > 1.89   ? '#ffe8ae' :
        d > -5.19   ? '#c3d0b4' :
        d > -12.27 ? '#72acba':
        d > -19.36   ? '#2288bf' :
                  '';
    }

var minVarRH21_11Concelho = 0;
var maxVarRH21_11Concelho = 0;

function EstiloVarRH21_11Concelho(feature) {
    if(feature.properties.Var_RHab21 <= minVarRH21_11Concelho || minVarRH21_11Concelho ===0){
        minVarRH21_11Concelho = feature.properties.Var_RHab21
    }
    if(feature.properties.Var_RHab21 > maxVarRH21_11Concelho){
        maxVarRH21_11Concelho = feature.properties.Var_RHab21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacao(feature.properties.Var_RHab21)};
    }


function apagarVarRH21_11Concelho(e) {
    VarRH21_11Concelho.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarRH21_11Concelho(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_RHab21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarRH21_11Concelho,
    });
}
var VarRH21_11Concelho= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloVarRH21_11Concelho,
    onEachFeature: onEachFeatureVarRH21_11Concelho
});
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
let slideVarRH21_11Concelho = function(){
    var sliderVarRH21_11Concelho = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarRH21_11Concelho, {
        start: [minVarRH21_11Concelho, maxVarRH21_11Concelho],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarRH21_11Concelho,
            'max': maxVarRH21_11Concelho
        },
        });
    inputNumberMin.setAttribute("value",minVarRH21_11Concelho);
    inputNumberMax.setAttribute("value",maxVarRH21_11Concelho);

    inputNumberMin.addEventListener('change', function(){
        sliderVarRH21_11Concelho.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarRH21_11Concelho.noUiSlider.set([null, this.value]);
    });

    sliderVarRH21_11Concelho.noUiSlider.on('update',function(e){
        VarRH21_11Concelho.eachLayer(function(layer){
            if(layer.feature.properties.Var_RHab21>=parseFloat(e[0])&& layer.feature.properties.Var_RHab21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarRH21_11Concelho.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderVarRH21_11Concelho.noUiSlider;
    $(slidersGeral).append(sliderVarRH21_11Concelho);
} 

///// Fim da Variação dos Alojamentos RESIDÊNCIA HABITUAL  Concelhos entre 2021 e 2011 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES DE RESIDÊNCIA HABITUAL Concelhos entre 2011 e 2001 -----////

var minVarRH11_01Concelho = 0;
var maxVarRH11_01Concelho = 0;

function EstiloVarRH11_01Concelho(feature) {
    if(feature.properties.Var_RHab11 <= minVarRH11_01Concelho || minVarRH11_01Concelho ===0){
        minVarRH11_01Concelho = feature.properties.Var_RHab11
    }
    if(feature.properties.Var_RHab11 > maxVarRH11_01Concelho){
        maxVarRH11_01Concelho = feature.properties.Var_RHab11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacao(feature.properties.Var_RHab11)};
    }


function apagarVarRH11_01Concelho(e) {
    VarRH11_01Concelho.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarRH11_01Concelho(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_RHab11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarRH11_01Concelho,
    });
}
var VarRH11_01Concelho= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloVarRH11_01Concelho,
    onEachFeature: onEachFeatureVarRH11_01Concelho
});

let slideVarRH11_01Concelho = function(){
    var sliderVarRH11_01Concelho = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarRH11_01Concelho, {
        start: [minVarRH11_01Concelho, maxVarRH11_01Concelho],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarRH11_01Concelho,
            'max': maxVarRH11_01Concelho
        },
        });
    inputNumberMin.setAttribute("value",minVarRH11_01Concelho);
    inputNumberMax.setAttribute("value",maxVarRH11_01Concelho);

    inputNumberMin.addEventListener('change', function(){
        sliderVarRH11_01Concelho.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarRH11_01Concelho.noUiSlider.set([null, this.value]);
    });

    sliderVarRH11_01Concelho.noUiSlider.on('update',function(e){
        VarRH11_01Concelho.eachLayer(function(layer){
            if(layer.feature.properties.Var_RHab11>=parseFloat(e[0])&& layer.feature.properties.Var_RHab11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarRH11_01Concelho.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderVarRH11_01Concelho.noUiSlider;
    $(slidersGeral).append(sliderVarRH11_01Concelho);
} 

///// Fim da Variação dos Alojamentos RESIDÊNCIA HABITUAL  Concelhos entre 2011 e 2001 -------------- \\\\\\


//////------- Variação dos ALOJAMENTOS FAMILIARES DE RESIDÊNCIA HABITUAL Concelhos entre 2001 e 1991 -----////

var minVarRH01_91Concelho = 0;
var maxVarRH01_91Concelho = 0;

function EstiloVarRH01_91Concelho(feature) {
    if(feature.properties.Var_RHab01 <= minVarRH01_91Concelho || minVarRH01_91Concelho ===0){
        minVarRH01_91Concelho = feature.properties.Var_RHab01
    }
    if(feature.properties.Var_RHab01 > maxVarRH01_91Concelho){
        maxVarRH01_91Concelho = feature.properties.Var_RHab01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacao(feature.properties.Var_RHab01)};
    }


function apagarVarRH01_91Concelho(e) {
    VarRH01_91Concelho.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarRH01_91Concelho(feature, layer) {
    if(feature.properties.Var_RHab01 === null){
        layer.bindPopup('Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'sem dados' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_RHab01 + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarRH01_91Concelho,
    });
}
var VarRH01_91Concelho= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloVarRH01_91Concelho,
    onEachFeature: onEachFeatureVarRH01_91Concelho
});
let slideVarRH01_91Concelho = function(){
    var sliderVarRH01_91Concelho = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarRH01_91Concelho, {
        start: [minVarRH01_91Concelho, maxVarRH01_91Concelho],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarRH01_91Concelho,
            'max': maxVarRH01_91Concelho
        },
        });
    inputNumberMin.setAttribute("value",minVarRH01_91Concelho);
    inputNumberMax.setAttribute("value",maxVarRH01_91Concelho);

    inputNumberMin.addEventListener('change', function(){
        sliderVarRH01_91Concelho.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarRH01_91Concelho.noUiSlider.set([null, this.value]);
    });

    sliderVarRH01_91Concelho.noUiSlider.on('update',function(e){
        VarRH01_91Concelho.eachLayer(function(layer){
            if (layer.feature.properties.Var_RHab01 == null){
                return false
            }
            if(layer.feature.properties.Var_RHab01>=parseFloat(e[0])&& layer.feature.properties.Var_RHab01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarRH01_91Concelho.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderVarRH01_91Concelho.noUiSlider;
    $(slidersGeral).append(sliderVarRH01_91Concelho);
} 

///// Fim da Variação dos Alojamentos RESIDÊNCIA HABITUAL  Concelhos entre 2001 e 1991 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES DE RESIDÊNCIA SECUNDÁRIA Concelhos entre 2021 e 2011 -----////

function CorVariacaoRS(d) {

    return d === null ? '#A9A9A9':
        d === 90.09 ? '#ff7f7f' :
        d > 77.119 ? '#ff8f86' :
        d > 64.148  ? '#ff9f8d' :
        d > 38.206  ? '#ffae94' :
        d > 23.13   ? '#ffbe9b' :
        d > 25.235   ? '#ffcda2' :
        d > 12.264  ? '#ffdaa9' :
        d > -0.707   ? '#fbe9b0' :
        d > -13.678   ? '#b2c8b5' :
        d > -26.649 ? '#6aa8ba':
        d > -39.62   ? '#2288bf' :
                  '';
    }

var minVarRS21_11Concelho = 0;
var maxVarRS21_11Concelho = 0;

function EstiloVarRS21_11Concelho(feature) {
    if(feature.properties.Var_RSec21 <= minVarRS21_11Concelho || minVarRS21_11Concelho ===0){
        minVarRS21_11Concelho = feature.properties.Var_RSec21
    }
    if(feature.properties.Var_RSec21 > maxVarRS21_11Concelho){
        maxVarRS21_11Concelho = feature.properties.Var_RSec21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacaoRS(feature.properties.Var_RSec21)};
    }


function apagarVarRS21_11Concelho(e) {
    VarRS21_11Concelho.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarRS21_11Concelho(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_RSec21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarRS21_11Concelho,
    });
}
var VarRS21_11Concelho= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloVarRS21_11Concelho,
    onEachFeature: onEachFeatureVarRS21_11Concelho
});

let slideVarRS21_11Concelho = function(){
    var sliderVarRS21_11Concelho = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarRS21_11Concelho, {
        start: [minVarRS21_11Concelho, maxVarRS21_11Concelho],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarRS21_11Concelho,
            'max': maxVarRS21_11Concelho
        },
        });
    inputNumberMin.setAttribute("value",minVarRS21_11Concelho);
    inputNumberMax.setAttribute("value",maxVarRS21_11Concelho);

    inputNumberMin.addEventListener('change', function(){
        sliderVarRS21_11Concelho.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarRS21_11Concelho.noUiSlider.set([null, this.value]);
    });

    sliderVarRS21_11Concelho.noUiSlider.on('update',function(e){
        VarRS21_11Concelho.eachLayer(function(layer){
            if(layer.feature.properties.Var_RSec21>=parseFloat(e[0])&& layer.feature.properties.Var_RSec21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarRS21_11Concelho.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderVarRS21_11Concelho.noUiSlider;
    $(slidersGeral).append(sliderVarRS21_11Concelho);
} 

///// Fim da Variação dos Alojamentos RESIDENCIA SECUNDARIA  Concelhos entre 2021 e 2011 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES DE RESIDÊNCIA SECUNDÁRIA Concelhos entre 2011 e 2001 -----////

var minVarRS11_01Concelho = 0;
var maxVarRS11_01Concelho = 0;

function EstiloVarRS11_01Concelho(feature) {
    if(feature.properties.Var_RSec11 <= minVarRS11_01Concelho || minVarRS11_01Concelho ===0){
        minVarRS11_01Concelho = feature.properties.Var_RSec11
    }
    if(feature.properties.Var_RSec11 > maxVarRS11_01Concelho){
        maxVarRS11_01Concelho = feature.properties.Var_RSec11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacaoRS(feature.properties.Var_RSec11)};
    }


function apagarVarRS11_01Concelho(e) {
    VarRS11_01Concelho.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarRS11_01Concelho(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_RSec11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarRS11_01Concelho,
    });
}
var VarRS11_01Concelho= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloVarRS11_01Concelho,
    onEachFeature: onEachFeatureVarRS11_01Concelho
});

let slideVarRS11_01Concelho = function(){
    var sliderVarRS11_01Concelho = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarRS11_01Concelho, {
        start: [minVarRS11_01Concelho, maxVarRS11_01Concelho],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarRS11_01Concelho,
            'max': maxVarRS11_01Concelho
        },
        });
    inputNumberMin.setAttribute("value",minVarRS11_01Concelho);
    inputNumberMax.setAttribute("value",maxVarRS11_01Concelho);

    inputNumberMin.addEventListener('change', function(){
        sliderVarRS11_01Concelho.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarRS11_01Concelho.noUiSlider.set([null, this.value]);
    });

    sliderVarRS11_01Concelho.noUiSlider.on('update',function(e){
        VarRS11_01Concelho.eachLayer(function(layer){
            if(layer.feature.properties.Var_RSec11>=parseFloat(e[0])&& layer.feature.properties.Var_RSec11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarRS11_01Concelho.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderVarRS11_01Concelho.noUiSlider;
    $(slidersGeral).append(sliderVarRS11_01Concelho);
} 

///// Fim da Variação dos Alojamentos RESIDENCIA SECUNDARIA  Concelhos entre 2011 e 2001 -------------- \\\\\\

///------- Variação dos ALOJAMENTOS FAMILIARES DE RESIDÊNCIA SECUNDÁRIA Concelhos entre 2001 e 1991 -----////

var minVarRS01_91Concelho = 0;
var maxVarRS01_91Concelho = 0;

function EstiloVarRS01_91Concelho(feature) {
    if(feature.properties.Var_RSec01 <= minVarRS01_91Concelho || minVarRS01_91Concelho ===0){
        minVarRS01_91Concelho = feature.properties.Var_RSec01
    }
    if(feature.properties.Var_RSec01 > maxVarRS01_91Concelho){
        maxVarRS01_91Concelho = feature.properties.Var_RSec01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacaoRS(feature.properties.Var_RSec01)};
    }


function apagarVarRS01_91Concelho(e) {
    VarRS01_91Concelho.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarRS01_91Concelho(feature, layer) {
    if(feature.properties.Var_RSec01 === null){
        layer.bindPopup('Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_RSec01 + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarRS01_91Concelho,
    });
}
var VarRS01_91Concelho= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloVarRS01_91Concelho,
    onEachFeature: onEachFeatureVarRS01_91Concelho
});

let slideVarRS01_91Concelho = function(){
    var sliderVarRS01_91Concelho = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarRS01_91Concelho, {
        start: [minVarRS01_91Concelho, maxVarRS01_91Concelho],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarRS01_91Concelho,
            'max': maxVarRS01_91Concelho
        },
        });
    inputNumberMin.setAttribute("value",minVarRS01_91Concelho);
    inputNumberMax.setAttribute("value",maxVarRS01_91Concelho);

    inputNumberMin.addEventListener('change', function(){
        sliderVarRS01_91Concelho.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarRS01_91Concelho.noUiSlider.set([null, this.value]);
    });

    sliderVarRS01_91Concelho.noUiSlider.on('update',function(e){
        VarRS01_91Concelho.eachLayer(function(layer){
            if (layer.feature.properties.Var_RSec01 == null){
                return false
            }
            if(layer.feature.properties.Var_RSec01>=parseFloat(e[0])&& layer.feature.properties.Var_RSec01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarRS01_91Concelho.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderVarRS01_91Concelho.noUiSlider;
    $(slidersGeral).append(sliderVarRS01_91Concelho);
} 

///// Fim da Variação dos Alojamentos RESIDÊNCIA SECUNDÁRIA  Concelhos entre 2001 e 1991 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS VAGOS Concelhos entre 2021 e 2011 -----////

var minVarVago21_11Concelho = 0;
var maxVarVago21_11Concelho = 0;

function CorVariacaoVago(d) {

    return d === null ? '#A9A9A9':
        d >= 100 ? '#ff7f7f' :
        d >= 86.798  ? '#ff8d85' :
        d >= 73.596  ? '#ff9a8b' :
        d >= 60.394   ? '#ffa791' :
        d >= 47.192   ? '#ffb497' :
        d >= 33.99  ? '#ffc19D' :
        d >= 20.788   ? '#ffcea2' :
        d >= 7.586 ? '#ffdba8' :
        d >= -5.616   ? '#ffe8ae' :
        d >= -18.818 ? '#a0c0b6':
        d >= -32.02   ? '#2288bf' :
                  '';
    }

function EstiloVarVago21_11Concelho(feature) {
    if(feature.properties.VarVago21 <= minVarVago21_11Concelho || minVarVago21_11Concelho ===0){
        minVarVago21_11Concelho = feature.properties.VarVago21
    }
    if(feature.properties.VarVago21 > maxVarVago21_11Concelho){
        maxVarVago21_11Concelho = feature.properties.VarVago21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacaoVago(feature.properties.VarVago21)};
    }


function apagarVarVago21_11Concelho(e) {
    VarVago21_11Concelho.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarVago21_11Concelho(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarVago21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarVago21_11Concelho,
    });
}
var VarVago21_11Concelho= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloVarVago21_11Concelho,
    onEachFeature: onEachFeatureVarVago21_11Concelho
});

let slideVarVago21_11Concelho = function(){
    var sliderVarVago21_11Concelho = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarVago21_11Concelho, {
        start: [minVarVago21_11Concelho, maxVarVago21_11Concelho],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarVago21_11Concelho,
            'max': maxVarVago21_11Concelho
        },
        });
    inputNumberMin.setAttribute("value",minVarVago21_11Concelho);
    inputNumberMax.setAttribute("value",maxVarVago21_11Concelho);

    inputNumberMin.addEventListener('change', function(){
        sliderVarVago21_11Concelho.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarVago21_11Concelho.noUiSlider.set([null, this.value]);
    });

    sliderVarVago21_11Concelho.noUiSlider.on('update',function(e){
        VarVago21_11Concelho.eachLayer(function(layer){
            if(layer.feature.properties.VarVago21>=parseFloat(e[0])&& layer.feature.properties.VarVago21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarVago21_11Concelho.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderVarVago21_11Concelho.noUiSlider;
    $(slidersGeral).append(sliderVarVago21_11Concelho);
} 

///// Fim da Variação dos Alojamentos VAGOS  Concelhos entre 2021 e 2011 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS VAGOS Concelhos entre 2011 e 2001 -----////

var minVarVago11_01Concelho = 0;
var maxVarVago11_01Concelho = 0;

function EstiloVarVago11_01Concelho(feature) {
    if(feature.properties.VarVago11 <= minVarVago11_01Concelho || minVarVago11_01Concelho ===0){
        minVarVago11_01Concelho = feature.properties.VarVago11
    }
    if(feature.properties.VarVago11 > maxVarVago11_01Concelho){
        maxVarVago11_01Concelho = feature.properties.VarVago11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacaoVago(feature.properties.VarVago11)};
    }


function apagarVarVago11_01Concelho(e) {
    VarVago11_01Concelho.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarVago11_01Concelho(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarVago11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarVago11_01Concelho,
    });
}
var VarVago11_01Concelho= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloVarVago11_01Concelho,
    onEachFeature: onEachFeatureVarVago11_01Concelho
});

let slideVarVago11_01Concelho = function(){
    var sliderVarVago11_01Concelho = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarVago11_01Concelho, {
        start: [minVarVago11_01Concelho, maxVarVago11_01Concelho],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarVago11_01Concelho,
            'max': maxVarVago11_01Concelho
        },
        });
    inputNumberMin.setAttribute("value",minVarVago11_01Concelho);
    inputNumberMax.setAttribute("value",maxVarVago11_01Concelho);

    inputNumberMin.addEventListener('change', function(){
        sliderVarVago11_01Concelho.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarVago11_01Concelho.noUiSlider.set([null, this.value]);
    });

    sliderVarVago11_01Concelho.noUiSlider.on('update',function(e){
        VarVago11_01Concelho.eachLayer(function(layer){
            if(layer.feature.properties.VarVago11>=parseFloat(e[0])&& layer.feature.properties.VarVago11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarVago11_01Concelho.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderVarVago11_01Concelho.noUiSlider;
    $(slidersGeral).append(sliderVarVago11_01Concelho);
} 

///// Fim da Variação dos Alojamentos VAGOS  Concelhos entre 2011 e 2001 -------------- \\\\\\

///------- Variação dos ALOJAMENTOS FAMILIARES DE RESIDÊNCIA SECUNDÁRIA Concelhos entre 2001 e 1991 -----////

var minVarVago01_91Concelho = 0;
var maxVarVago01_91Concelho = 0;

function EstiloVarVago01_91Concelho(feature) {
    if(feature.properties.VarVago01 <= minVarVago01_91Concelho || minVarVago01_91Concelho ===0){
        minVarVago01_91Concelho = feature.properties.VarVago01
    }
    if(feature.properties.VarVago01 > maxVarVago01_91Concelho){
        maxVarVago01_91Concelho = feature.properties.VarVago01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacaoVago(feature.properties.VarVago01)};
    }


function apagarVarVago01_91Concelho(e) {
    VarVago01_91Concelho.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarVago01_91Concelho(feature, layer) {
    if(feature.properties.VarVago01 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.VarVago01 + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarVago01_91Concelho,
    });
}
var VarVago01_91Concelho= L.geoJSON(formaConcelhosRelativos, {
    style:EstiloVarVago01_91Concelho,
    onEachFeature: onEachFeatureVarVago01_91Concelho
});

let slideVarVago01_91Concelho = function(){
    var sliderVarVago01_91Concelho = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarVago01_91Concelho, {
        start: [minVarVago01_91Concelho, maxVarVago01_91Concelho],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarVago01_91Concelho,
            'max': maxVarVago01_91Concelho
        },
        });
    inputNumberMin.setAttribute("value",minVarVago01_91Concelho);
    inputNumberMax.setAttribute("value",maxVarVago01_91Concelho);

    inputNumberMin.addEventListener('change', function(){
        sliderVarVago01_91Concelho.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarVago01_91Concelho.noUiSlider.set([null, this.value]);
    });

    sliderVarVago01_91Concelho.noUiSlider.on('update',function(e){
        VarVago01_91Concelho.eachLayer(function(layer){
            if (layer.feature.properties.VarVago01 == null){
                return false
            }
            if(layer.feature.properties.VarVago01>=parseFloat(e[0])&& layer.feature.properties.VarVago01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarVago01_91Concelho.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderVarVago01_91Concelho.noUiSlider;
    $(slidersGeral).append(sliderVarVago01_91Concelho);
} 

///// Fim da Variação dos Alojamentos VAGOS  Concelhos entre 2001 e 1991 -------------- \\\\\\



/////////////////////------------------------------- FIM CONCELHOS ------------------------------\\\\\\\\\\\\\\\\\\\

//////////////////// ------------------------------ FREGUESIAS -------------------------------------\\\\\\\\\\\\\\\

//// Total de Alojamentos em 2021 Freguesias //////

var minTotAlojFreguesia21 = 0;
var maxTotAlojFreguesia21 = 0;
function estiloTotAlojFreguesia21(feature, latlng) {
    if(feature.properties.F_O_T_21< minTotAlojFreguesia21 || minTotAlojFreguesia21 ===0){
        minTotAlojFreguesia21 = feature.properties.F_O_T_21
    }
    if(feature.properties.F_O_T_21> maxTotAlojFreguesia21){
        maxTotAlojFreguesia21 = feature.properties.F_O_T_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_O_T_21,0.1)
    });
}
function apagarTotAlojFreguesia21(e){
    var layer = e.target;
    TotAlojFreguesia21.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojFreguesia21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos: ' + '<b>' + feature.properties.F_O_T_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojFreguesia21,
    })
};

var TotAlojFreguesia21= L.geoJSON(formaFreguesiasAbsolutos,{
    pointToLayer:estiloTotAlojFreguesia21,
    onEachFeature: onEachFeatureTotAlojFreguesia21,
});



var slideTotAlojFreguesia21 = function(){
    var sliderTotAlojFreguesia21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojFreguesia21, {
        start: [minTotAlojFreguesia21, maxTotAlojFreguesia21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFreguesia21,
            'max': maxTotAlojFreguesia21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojFreguesia21);
    inputNumberMax.setAttribute("value",maxTotAlojFreguesia21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFreguesia21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFreguesia21.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFreguesia21.noUiSlider.on('update',function(e){
        TotAlojFreguesia21.eachLayer(function(layer){
            if(layer.feature.properties.F_O_T_21>=parseFloat(e[0])&& layer.feature.properties.F_O_T_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojFreguesia21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderTotAlojFreguesia21.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFreguesia21);
}

///////////-----------------------------Fim do TOTAL ALojamentos EM 2021

//// Total de Alojamentos em 2011 Freguesias //////

var minTotAlojFreguesia11 = 0;
var maxTotAlojFreguesia11 = 0;
function estiloTotAlojFreguesia11(feature, latlng) {
    if(feature.properties.F_O_T_11< minTotAlojFreguesia11 || minTotAlojFreguesia11 ===0){
        minTotAlojFreguesia11 = feature.properties.F_O_T_11
    }
    if(feature.properties.F_O_T_11> maxTotAlojFreguesia11){
        maxTotAlojFreguesia11 = feature.properties.F_O_T_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_O_T_11,0.1)
    });
}
function apagarTotAlojFreguesia11(e){
    var layer = e.target;
    TotAlojFreguesia11.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojFreguesia11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos: ' + '<b>' + feature.properties.F_O_T_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojFreguesia11,
    })
};

var TotAlojFreguesia11= L.geoJSON(formaFreguesiasAbsolutos,{
    pointToLayer:estiloTotAlojFreguesia11,
    onEachFeature: onEachFeatureTotAlojFreguesia11,
});



var slideTotAlojFreguesia11 = function(){
    var sliderTotAlojFreguesia11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 39){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojFreguesia11, {
        start: [minTotAlojFreguesia11, maxTotAlojFreguesia11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFreguesia11,
            'max': maxTotAlojFreguesia11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojFreguesia11);
    inputNumberMax.setAttribute("value",maxTotAlojFreguesia11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFreguesia11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFreguesia11.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFreguesia11.noUiSlider.on('update',function(e){
        TotAlojFreguesia11.eachLayer(function(layer){
            if(layer.feature.properties.F_O_T_11>=parseFloat(e[0])&& layer.feature.properties.F_O_T_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojFreguesia11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 39;
    sliderAtivo = sliderTotAlojFreguesia11.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFreguesia11);
}

///////////-----------------------------Fim do TOTAL ALojamentos EM 2011 FREGUESIAS

//// Total de Alojamentos em 2001 Freguesias //////

var minTotAlojFreguesia01 = 0;
var maxTotAlojFreguesia01 = 0;
function estiloTotAlojFreguesia01(feature, latlng) {
    if(feature.properties.F_Tot_01< minTotAlojFreguesia01 && feature.properties.F_Tot_01 > null || minTotAlojFreguesia01 ===0){
        minTotAlojFreguesia01 = feature.properties.F_Tot_01
    }
    if(feature.properties.F_Tot_01> maxTotAlojFreguesia01){
        maxTotAlojFreguesia01 = feature.properties.F_Tot_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_Tot_01,0.1)
    });
}
function apagarTotAlojFreguesia01(e){
    var layer = e.target;
    TotAlojFreguesia01.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojFreguesia01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos: ' + '<b>' + feature.properties.F_Tot_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojFreguesia01,
    })
};

var TotAlojFreguesia01= L.geoJSON(formaFreguesia2001Absolutos,{
    pointToLayer:estiloTotAlojFreguesia01,
    onEachFeature: onEachFeatureTotAlojFreguesia01,
});



var slideTotAlojFreguesia01 = function(){
    var sliderTotAlojFreguesia01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojFreguesia01, {
        start: [minTotAlojFreguesia01, maxTotAlojFreguesia01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFreguesia01,
            'max': maxTotAlojFreguesia01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojFreguesia01);
    inputNumberMax.setAttribute("value",maxTotAlojFreguesia01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFreguesia01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFreguesia01.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFreguesia01.noUiSlider.on('update',function(e){
        TotAlojFreguesia01.eachLayer(function(layer){           
            if(layer.feature.properties.F_Tot_01>=parseFloat(e[0])&& layer.feature.properties.F_Tot_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojFreguesia01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderTotAlojFreguesia01.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFreguesia01);
}
///////////-----------------------------Fim do TOTAL ALojamentos EM 2001 FREGUESIAS

//// Total de Alojamentos em 2021 de RESIDÊNCIA HABITUAL Freguesias //////

var minTotAlojFreguesiaRH21 = 0;
var maxTotAlojFreguesiaRH21 = 0;
function estiloTotAlojFreguesiaRH21(feature, latlng) {
    if(feature.properties.Resi_Hab21< minTotAlojFreguesiaRH21 || minTotAlojFreguesiaRH21 ===0){
        minTotAlojFreguesiaRH21 = feature.properties.Resi_Hab21
    }
    if(feature.properties.Resi_Hab21> maxTotAlojFreguesiaRH21){
        maxTotAlojFreguesiaRH21 = feature.properties.Resi_Hab21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Hab21,0.1)
    });
}
function apagarTotAlojFreguesiaRH21(e){
    var layer = e.target;
    TotAlojFreguesiaRH21.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojFreguesiaRH21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos de Residência Habitual: ' + '<b>' + feature.properties.Resi_Hab21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojFreguesiaRH21,
    })
};

var TotAlojFreguesiaRH21= L.geoJSON(formaFreguesiasAbsolutos,{
    pointToLayer:estiloTotAlojFreguesiaRH21,
    onEachFeature: onEachFeatureTotAlojFreguesiaRH21,
});



var slideTotAlojFreguesiaRH21 = function(){
    var sliderTotAlojFreguesiaRH21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 42){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojFreguesiaRH21, {
        start: [minTotAlojFreguesiaRH21, maxTotAlojFreguesiaRH21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFreguesiaRH21,
            'max': maxTotAlojFreguesiaRH21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojFreguesiaRH21);
    inputNumberMax.setAttribute("value",maxTotAlojFreguesiaRH21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFreguesiaRH21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFreguesiaRH21.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFreguesiaRH21.noUiSlider.on('update',function(e){
        TotAlojFreguesiaRH21.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Hab21>=parseFloat(e[0])&& layer.feature.properties.Resi_Hab21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojFreguesiaRH21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 42;
    sliderAtivo = sliderTotAlojFreguesiaRH21.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFreguesiaRH21);
}

///////////-----------------------------Fim do TOTAL ALojamentos de RESIDÊNCIA HABITUAL EM 2021

//// Total de Alojamentos em 2011 de RESIDÊNCIA HABITUAL Freguesias //////

var minTotAlojFreguesiaRH11 = 0;
var maxTotAlojFreguesiaRH11 = 0;
function estiloTotAlojFreguesiaRH11(feature, latlng) {
    if(feature.properties.Resi_Hab11< minTotAlojFreguesiaRH11 || minTotAlojFreguesiaRH11 ===0){
        minTotAlojFreguesiaRH11 = feature.properties.Resi_Hab11
    }
    if(feature.properties.Resi_Hab11> maxTotAlojFreguesiaRH11){
        maxTotAlojFreguesiaRH11 = feature.properties.Resi_Hab11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Hab11,0.1)
    });
}
function apagarTotAlojFreguesiaRH11(e){
    var layer = e.target;
    TotAlojFreguesiaRH11.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojFreguesiaRH11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos de Residência Habitual: ' + '<b>' + feature.properties.Resi_Hab11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojFreguesiaRH11,
    })
};

var TotAlojFreguesiaRH11= L.geoJSON(formaFreguesiasAbsolutos,{
    pointToLayer:estiloTotAlojFreguesiaRH11,
    onEachFeature: onEachFeatureTotAlojFreguesiaRH11,
});



var slideTotAlojFreguesiaRH11 = function(){
    var sliderTotAlojFreguesiaRH11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 43){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojFreguesiaRH11, {
        start: [minTotAlojFreguesiaRH11, maxTotAlojFreguesiaRH11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFreguesiaRH11,
            'max': maxTotAlojFreguesiaRH11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojFreguesiaRH11);
    inputNumberMax.setAttribute("value",maxTotAlojFreguesiaRH11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFreguesiaRH11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFreguesiaRH11.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFreguesiaRH11.noUiSlider.on('update',function(e){
        TotAlojFreguesiaRH11.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Hab11>=parseFloat(e[0])&& layer.feature.properties.Resi_Hab11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojFreguesiaRH11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 43;
    sliderAtivo = sliderTotAlojFreguesiaRH11.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFreguesiaRH11);
}

///////////-----------------------------Fim do TOTAL ALojamentos de RESIDÊNCIA HABITUAL EM 2011

//////////////////////////// Total de Alojamentos de RESIDÊNCIA HABITUAL em 2001 Freguesias //////

var minTotAlojFreguesiaRH01 = 0;
var maxTotAlojFreguesiaRH01 = 0;
function estiloTotAlojFreguesiaRH01(feature, latlng) {
    if(feature.properties.F_ReHab_01< minTotAlojFreguesiaRH01 && feature.properties.F_ReHab_01 > null || minTotAlojFreguesiaRH01 ===0){
        minTotAlojFreguesiaRH01 = feature.properties.F_ReHab_01
    }
    if(feature.properties.F_ReHab_01> maxTotAlojFreguesiaRH01){
        maxTotAlojFreguesiaRH01 = feature.properties.F_ReHab_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_ReHab_01,0.1)
    });
}
function apagarTotAlojFreguesiaRH01(e){
    var layer = e.target;
    TotAlojFreguesiaRH01.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojFreguesiaRH01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos de Residência Habitual: ' + '<b>' + feature.properties.Resi_Hab01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojFreguesiaRH01,
    })
};

var TotAlojFreguesiaRH01= L.geoJSON(formaFreguesia2001Absolutos,{
    pointToLayer:estiloTotAlojFreguesiaRH01,
    onEachFeature: onEachFeatureTotAlojFreguesiaRH01,
});



var slideTotAlojFreguesiaRH01 = function(){
    var sliderTotAlojFreguesiaRH01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 44){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojFreguesiaRH01, {
        start: [minTotAlojFreguesiaRH01, maxTotAlojFreguesiaRH01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFreguesiaRH01,
            'max': maxTotAlojFreguesiaRH01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojFreguesiaRH01);
    inputNumberMax.setAttribute("value",maxTotAlojFreguesiaRH01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFreguesiaRH01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFreguesiaRH01.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFreguesiaRH01.noUiSlider.on('update',function(e){
        TotAlojFreguesiaRH01.eachLayer(function(layer){      
            if(layer.feature.properties.F_ReHab_01>=parseFloat(e[0])&& layer.feature.properties.F_ReHab_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojFreguesiaRH01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 44;
    sliderAtivo = sliderTotAlojFreguesiaRH01.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFreguesiaRH01);
}
///////////-----------------------------Fim do TOTAL ALojamentos RESIDÊNCIA HABITUAL EM 2001 FREGUESIAS

////////////-------------------- ALOJAMENTOS RESIDÊNCIA SECUNDÁRIA EM 2021 FREGUESIAS

//// Total de Alojamentos em 2021 de RESIDÊNCIA SECUNDÁRIA Freguesias //////

var minTotAlojFreguesiaRS21 = 0;
var maxTotAlojFreguesiaRS21 = 0;
function estiloTotAlojFreguesiaRS21(feature, latlng) {
    if(feature.properties.Resi_Sec21< minTotAlojFreguesiaRS21 || minTotAlojFreguesiaRS21 ===0){
        minTotAlojFreguesiaRS21 = feature.properties.Resi_Sec21
    }
    if(feature.properties.Resi_Sec21> maxTotAlojFreguesiaRS21){
        maxTotAlojFreguesiaRS21 = feature.properties.Resi_Sec21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Sec21,0.1)
    });
}
function apagarTotAlojFreguesiaRS21(e){
    var layer = e.target;
    TotAlojFreguesiaRS21.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojFreguesiaRS21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos de Residência Secundária: ' + '<b>' + feature.properties.Resi_Sec21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojFreguesiaRS21,
    })
};

var TotAlojFreguesiaRS21= L.geoJSON(formaFreguesiasAbsolutos,{
    pointToLayer:estiloTotAlojFreguesiaRS21,
    onEachFeature: onEachFeatureTotAlojFreguesiaRS21,
});



var slideTotAlojFreguesiaRS21 = function(){
    var sliderTotAlojFreguesiaRS21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojFreguesiaRS21, {
        start: [minTotAlojFreguesiaRS21, maxTotAlojFreguesiaRS21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFreguesiaRS21,
            'max': maxTotAlojFreguesiaRS21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojFreguesiaRS21);
    inputNumberMax.setAttribute("value",maxTotAlojFreguesiaRS21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFreguesiaRS21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFreguesiaRS21.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFreguesiaRS21.noUiSlider.on('update',function(e){
        TotAlojFreguesiaRS21.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Sec21>=parseFloat(e[0])&& layer.feature.properties.Resi_Sec21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojFreguesiaRS21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderTotAlojFreguesiaRS21.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFreguesiaRS21);
}

///////////-----------------------------Fim do TOTAL ALojamentos de RESIDÊNCIA SECUNDÁRIA EM 2021

//// Total de Alojamentos em 2011 de RESIDÊNCIA SECUNDÁRIA Freguesias //////

var minTotAlojFreguesiaRS11 = 0;
var maxTotAlojFreguesiaRS11 = 0;
function estiloTotAlojFreguesiaRS11(feature, latlng) {
    if(feature.properties.Resi_Sec11< minTotAlojFreguesiaRS11 || minTotAlojFreguesiaRS11 ===0){
        minTotAlojFreguesiaRS11 = feature.properties.Resi_Sec11
    }
    if(feature.properties.Resi_Sec11> maxTotAlojFreguesiaRS11){
        maxTotAlojFreguesiaRS11 = feature.properties.Resi_Sec11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Sec11,0.1)
    });
}
function apagarTotAlojFreguesiaRS11(e){
    var layer = e.target;
    TotAlojFreguesiaRS11.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojFreguesiaRS11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos de Residência Secundária: ' + '<b>' + feature.properties.Resi_Sec11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojFreguesiaRS11,
    })
};

var TotAlojFreguesiaRS11= L.geoJSON(formaFreguesiasAbsolutos,{
    pointToLayer:estiloTotAlojFreguesiaRS11,
    onEachFeature: onEachFeatureTotAlojFreguesiaRS11,
});



var slideTotAlojFreguesiaRS11 = function(){
    var sliderTotAlojFreguesiaRS11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 46){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojFreguesiaRS11, {
        start: [minTotAlojFreguesiaRS11, maxTotAlojFreguesiaRS11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFreguesiaRS11,
            'max': maxTotAlojFreguesiaRS11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojFreguesiaRS11);
    inputNumberMax.setAttribute("value",maxTotAlojFreguesiaRS11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFreguesiaRS11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFreguesiaRS11.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFreguesiaRS11.noUiSlider.on('update',function(e){
        TotAlojFreguesiaRS11.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Sec11>=parseFloat(e[0])&& layer.feature.properties.Resi_Sec11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojFreguesiaRS11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 46;
    sliderAtivo = sliderTotAlojFreguesiaRS11.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFreguesiaRS11);
}

///////////-----------------------------Fim do TOTAL ALojamentos de RESIDÊNCIA SECUNDÁRIA EM 2011

//////////////////////////// Total de Alojamentos de RESIDÊNCIA SECUNDÁRIA em 2001 Freguesias //////

var minTotAlojFreguesiaRS01 = 0;
var maxTotAlojFreguesiaRS01 = 0;
function estiloTotAlojFreguesiaRS01(feature, latlng) {
    if(feature.properties.F_ReSec_01< minTotAlojFreguesiaRS01 && feature.properties.F_ReSec_01 > null || minTotAlojFreguesiaRS01 ===0){
        minTotAlojFreguesiaRS01 = feature.properties.F_ReSec_01
    }
    if(feature.properties.F_ReSec_01> maxTotAlojFreguesiaRS01){
        maxTotAlojFreguesiaRS01 = feature.properties.F_ReSec_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_ReSec_01,0.1)
    });
}
function apagarTotAlojFreguesiaRS01(e){
    var layer = e.target;
    TotAlojFreguesiaRS01.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojFreguesiaRS01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos de Residência Secundária: ' + '<b>' + feature.properties.Resi_Sec01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojFreguesiaRS01,
    })
};

var TotAlojFreguesiaRS01= L.geoJSON(formaFreguesia2001Absolutos,{
    pointToLayer:estiloTotAlojFreguesiaRS01,
    onEachFeature: onEachFeatureTotAlojFreguesiaRS01,
});



var slideTotAlojFreguesiaRS01 = function(){
    var sliderTotAlojFreguesiaRS01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 47){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojFreguesiaRS01, {
        start: [minTotAlojFreguesiaRS01, maxTotAlojFreguesiaRS01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFreguesiaRS01,
            'max': maxTotAlojFreguesiaRS01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojFreguesiaRS01);
    inputNumberMax.setAttribute("value",maxTotAlojFreguesiaRS01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFreguesiaRS01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFreguesiaRS01.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFreguesiaRS01.noUiSlider.on('update',function(e){
        TotAlojFreguesiaRS01.eachLayer(function(layer){       
            if(layer.feature.properties.F_ReSec_01>=parseFloat(e[0])&& layer.feature.properties.F_ReSec_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojFreguesiaRS01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 47;
    sliderAtivo = sliderTotAlojFreguesiaRS01.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFreguesiaRS01);
}
///////////-----------------------------Fim do TOTAL ALojamentos RESIDÊNCIA SECUNDÁRIA EM 2001 FREGUESIAS

//// Total de Alojamentos Vagos em 2021 Freguesias //////

var minTotAlojFreguesiaVago21 = 0;
var maxTotAlojFreguesiaVago21 = 0;
function estiloTotAlojFreguesiaVago21(feature, latlng) {
    if(feature.properties.AlojVago21< minTotAlojFreguesiaVago21 || minTotAlojFreguesiaVago21 ===0){
        minTotAlojFreguesiaVago21 = feature.properties.AlojVago21
    }
    if(feature.properties.AlojVago21> maxTotAlojFreguesiaVago21){
        maxTotAlojFreguesiaVago21 = feature.properties.AlojVago21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlojVago21,0.1)
    });
}
function apagarTotAlojFreguesiaVago21(e){
    var layer = e.target;
    TotAlojFreguesiaVago21.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojFreguesiaVago21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Vagos: ' + '<b>' + feature.properties.AlojVago21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojFreguesiaVago21,
    })
};

var TotAlojFreguesiaVago21= L.geoJSON(formaFreguesiasAbsolutos,{
    pointToLayer:estiloTotAlojFreguesiaVago21,
    onEachFeature: onEachFeatureTotAlojFreguesiaVago21,
});



var slideTotAlojFreguesiaVago21 = function(){
    var sliderTotAlojFreguesiaVago21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 48){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojFreguesiaVago21, {
        start: [minTotAlojFreguesiaVago21, maxTotAlojFreguesiaVago21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFreguesiaVago21,
            'max': maxTotAlojFreguesiaVago21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojFreguesiaVago21);
    inputNumberMax.setAttribute("value",maxTotAlojFreguesiaVago21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFreguesiaVago21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFreguesiaVago21.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFreguesiaVago21.noUiSlider.on('update',function(e){
        TotAlojFreguesiaVago21.eachLayer(function(layer){
            if(layer.feature.properties.AlojVago21>=parseFloat(e[0])&& layer.feature.properties.AlojVago21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojFreguesiaVago21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 48;
    sliderAtivo = sliderTotAlojFreguesiaVago21.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFreguesiaVago21);
}

///////////-----------------------------Fim do TOTAL ALojamentos VAGOS EM 2021

//// Total de Alojamentos Vagos em 2011 Freguesias //////

var minTotAlojFreguesiaVago11 = 0;
var maxTotAlojFreguesiaVago11 = 0;
function estiloTotAlojFreguesiaVago11(feature, latlng) {
    if(feature.properties.AlojVago11< minTotAlojFreguesiaVago11 || minTotAlojFreguesiaVago11 ===0){
        minTotAlojFreguesiaVago11 = feature.properties.AlojVago11
    }
    if(feature.properties.AlojVago11> maxTotAlojFreguesiaVago11){
        maxTotAlojFreguesiaVago11 = feature.properties.AlojVago11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.AlojVago11,0.1)
    });
}
function apagarTotAlojFreguesiaVago11(e){
    var layer = e.target;
    TotAlojFreguesiaVago11.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojFreguesiaVago11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Vagos: ' + '<b>' + feature.properties.AlojVago11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojFreguesiaVago11,
    })
};

var TotAlojFreguesiaVago11= L.geoJSON(formaFreguesiasAbsolutos,{
    pointToLayer:estiloTotAlojFreguesiaVago11,
    onEachFeature: onEachFeatureTotAlojFreguesiaVago11,
});



var slideTotAlojFreguesiaVago11 = function(){
    var sliderTotAlojFreguesiaVago11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 49){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojFreguesiaVago11, {
        start: [minTotAlojFreguesiaVago11, maxTotAlojFreguesiaVago11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFreguesiaVago11,
            'max': maxTotAlojFreguesiaVago11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojFreguesiaVago11);
    inputNumberMax.setAttribute("value",maxTotAlojFreguesiaVago11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFreguesiaVago11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFreguesiaVago11.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFreguesiaVago11.noUiSlider.on('update',function(e){
        TotAlojFreguesiaVago11.eachLayer(function(layer){
            if(layer.feature.properties.AlojVago11>=parseFloat(e[0])&& layer.feature.properties.AlojVago11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojFreguesiaVago11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 49;
    sliderAtivo = sliderTotAlojFreguesiaVago11.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFreguesiaVago11);
}

///////////-----------------------------Fim do TOTAL ALojamentos VAGOS EM 2011

//////////////////////////// Total de Alojamentos de RESIDÊNCIA SECUNDÁRIA em 2001 Freguesias //////

var minTotAlojFreguesiaVago01 = 0;
var maxTotAlojFreguesiaVago01 = 0;
function estiloTotAlojFreguesiaVago01(feature, latlng) {
    if(feature.properties.F_Vago_01< minTotAlojFreguesiaVago01 || minTotAlojFreguesiaVago01 ===0){
        minTotAlojFreguesiaVago01 = feature.properties.F_Vago_01
    }
    if(feature.properties.F_Vago_01> maxTotAlojFreguesiaVago01){
        maxTotAlojFreguesiaVago01 = feature.properties.F_Vago_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_Vago_01,0.2)
    });
}
function apagarTotAlojFreguesiaVago01(e){
    var layer = e.target;
    TotAlojFreguesiaVago01.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojFreguesiaVago01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos Vagos: ' + '<b>' + feature.properties.AlojVago01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojFreguesiaVago01,
    })
};

var TotAlojFreguesiaVago01= L.geoJSON(formaFreguesia2001Absolutos,{
    pointToLayer:estiloTotAlojFreguesiaVago01,
    onEachFeature: onEachFeatureTotAlojFreguesiaVago01,
});



var slideTotAlojFreguesiaVago01 = function(){
    var sliderTotAlojFreguesiaVago01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 50){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojFreguesiaVago01, {
        start: [minTotAlojFreguesiaVago01, maxTotAlojFreguesiaVago01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojFreguesiaVago01,
            'max': maxTotAlojFreguesiaVago01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojFreguesiaVago01);
    inputNumberMax.setAttribute("value",maxTotAlojFreguesiaVago01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojFreguesiaVago01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojFreguesiaVago01.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojFreguesiaVago01.noUiSlider.on('update',function(e){
        TotAlojFreguesiaVago01.eachLayer(function(layer){           
            if(layer.feature.properties.F_Vago_01>=parseFloat(e[0])&& layer.feature.properties.F_Vago_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojFreguesiaVago01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 50;
    sliderAtivo = sliderTotAlojFreguesiaVago01.noUiSlider;
    $(slidersGeral).append(sliderTotAlojFreguesiaVago01);
}
///////////-----------------------------Fim do TOTAL ALojamentos  VAGOS EM 2001 FREGUESIAS

//////////////////--------------------- PERCENTAGEM FREGUESIAS ------------------\\\\\\\\\\\\\\\\\\
/////-------------------- PERCENTAGEM RESIDÊNCIA SECUNDÁRIA 2021 FREGUESIAS ----------

var minPerFreguesiaRH21 = 0;
var maxPerFreguesiaRH21 = 0;

function EstiloPerFreguesiaRH21(feature) {
    if( feature.properties.Per_RHab21 < minPerFreguesiaRH21 || minPerFreguesiaRH21 === 0){
        minPerFreguesiaRH21 = feature.properties.Per_RHab21
    }
    if(feature.properties.Per_RHab21 > maxPerFreguesiaRH21 ){
        maxPerFreguesiaRH21 = feature.properties.Per_RHab21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.Per_RHab21)
    };
}


function apagarPerFreguesiaRH21(e) {
    PerFreguesiaRH21.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerFreguesiaRH21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per_RHab21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFreguesiaRH21,
    });
}
var PerFreguesiaRH21= L.geoJSON(formaFreguesiaRelativos, {
    style:EstiloPerFreguesiaRH21,
    onEachFeature: onEachFeaturePerFreguesiaRH21
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
let slidePerFreguesiaRH21 = function(){
    var sliderPerFreguesiaRH21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 51){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFreguesiaRH21, {
        start: [minPerFreguesiaRH21, maxPerFreguesiaRH21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFreguesiaRH21,
            'max': maxPerFreguesiaRH21
        },
        });
    inputNumberMin.setAttribute("value",minPerFreguesiaRH21);
    inputNumberMax.setAttribute("value",maxPerFreguesiaRH21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFreguesiaRH21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFreguesiaRH21.noUiSlider.set([null, this.value]);
    });

    sliderPerFreguesiaRH21.noUiSlider.on('update',function(e){
        PerFreguesiaRH21.eachLayer(function(layer){
            if(layer.feature.properties.Per_RHab21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_RHab21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFreguesiaRH21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 51;
    sliderAtivo = sliderPerFreguesiaRH21.noUiSlider;
    $(slidersGeral).append(sliderPerFreguesiaRH21);
} 
/// --------------------------------------  FIM Percentagem RESIDÊNCIA Habitual 2021 Freguesias

/////-------------------- PERCENTAGEM RESIDÊNCIA SECUNDÁRIA 2011 FREGUESIAS ----------

var minPerFreguesiaRH11 = 0;
var maxPerFreguesiaRH11 = 0;

function EstiloPerFreguesiaRH11(feature) {
    if( feature.properties.Per_RHab11 < minPerFreguesiaRH11 || minPerFreguesiaRH11 === 0){
        minPerFreguesiaRH11 = feature.properties.Per_RHab11
    }
    if(feature.properties.Per_RHab11 > maxPerFreguesiaRH11 ){
        maxPerFreguesiaRH11 = feature.properties.Per_RHab11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.Per_RHab11)
    };
}


function apagarPerFreguesiaRH11(e) {
    PerFreguesiaRH11.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerFreguesiaRH11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per_RHab11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFreguesiaRH11,
    });
}
var PerFreguesiaRH11= L.geoJSON(formaFreguesiaRelativos, {
    style:EstiloPerFreguesiaRH11,
    onEachFeature: onEachFeaturePerFreguesiaRH11
});

let slidePerFreguesiaRH11 = function(){
    var sliderPerFreguesiaRH11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 52){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFreguesiaRH11, {
        start: [minPerFreguesiaRH11, maxPerFreguesiaRH11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFreguesiaRH11,
            'max': maxPerFreguesiaRH11
        },
        });
    inputNumberMin.setAttribute("value",minPerFreguesiaRH11);
    inputNumberMax.setAttribute("value",maxPerFreguesiaRH11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFreguesiaRH11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFreguesiaRH11.noUiSlider.set([null, this.value]);
    });

    sliderPerFreguesiaRH11.noUiSlider.on('update',function(e){
        PerFreguesiaRH11.eachLayer(function(layer){
            if(layer.feature.properties.Per_RHab11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_RHab11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFreguesiaRH11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 52;
    sliderAtivo = sliderPerFreguesiaRH11.noUiSlider;
    $(slidersGeral).append(sliderPerFreguesiaRH11);
} 
/// --------------------------------------  FIM Percentagem RESIDÊNCIA Habitual 2011 Freguesias

/////-------------------- PERCENTAGEM ALOJAMENTOS RESIDÊNCIA HABITUAL FREGUESIAS 2001----------

var minPerFreguesiaRH01 = 0;
var maxPerFreguesiaRH01 = 0;

function EstiloPerFreguesiaRH01(feature) {
    if( feature.properties.Per_RHab01 < minPerFreguesiaRH01 && feature.properties.Per_RHab01 > null || minPerFreguesiaRH01 === 0){
        minPerFreguesiaRH01 = feature.properties.Per_RHab01
    }
    if(feature.properties.Per_RHab01 > maxPerFreguesiaRH01 ){
        maxPerFreguesiaRH01 = feature.properties.Per_RHab01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.Per_RHab01)
    };
}


function apagarPerFreguesiaRH01(e) {
    PerFreguesiaRH01.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerFreguesiaRH01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per_RHab01.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFreguesiaRH01,
    });
}
var PerFreguesiaRH01= L.geoJSON(formaFreguesia2001Relativos, {
    style:EstiloPerFreguesiaRH01,
    onEachFeature: onEachFeaturePerFreguesiaRH01
});

let slidePerFreguesiaRH01 = function(){
    var sliderPerFreguesiaRH01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 53){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFreguesiaRH01, {
        start: [minPerFreguesiaRH01, maxPerFreguesiaRH01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFreguesiaRH01,
            'max': maxPerFreguesiaRH01
        },
        });
    inputNumberMin.setAttribute("value",minPerFreguesiaRH01);
    inputNumberMax.setAttribute("value",maxPerFreguesiaRH01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFreguesiaRH01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFreguesiaRH01.noUiSlider.set([null, this.value]);
    });

    sliderPerFreguesiaRH01.noUiSlider.on('update',function(e){
        PerFreguesiaRH01.eachLayer(function(layer){
            if (layer.feature.properties.Per_RHab01 == null){
                return false
            }
            if(layer.feature.properties.Per_RHab01>=parseFloat(e[0])&& layer.feature.properties.Per_RHab01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFreguesiaRH01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 53;
    sliderAtivo = sliderPerFreguesiaRH01.noUiSlider;
    $(slidersGeral).append(sliderPerFreguesiaRH01);
} 
/// --------------------------------------  FIM Percentagem RESIDÊNCIA HABITUAL EM 2001 Freguesias

/////-------------------- PERCENTAGEM RESIDÊNCIA SECUNDÁRIA 2021 FREGUESIAS ----------

var minPerFreguesiaRS21 = 0;
var maxPerFreguesiaRS21 = 0;

function EstiloPerFreguesiaRS21(feature) {
    if( feature.properties.Per_RSec21 < minPerFreguesiaRS21 || minPerFreguesiaRS21 === 0){
        minPerFreguesiaRS21 = feature.properties.Per_RSec21
    }
    if(feature.properties.Per_RSec21 > maxPerFreguesiaRS21 ){
        maxPerFreguesiaRS21 = feature.properties.Per_RSec21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.Per_RSec21)
    };
}


function apagarPerFreguesiaRS21(e) {
    PerFreguesiaRS21.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerFreguesiaRS21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per_RSec21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFreguesiaRS21,
    });
}
var PerFreguesiaRS21= L.geoJSON(formaFreguesiaRelativos, {
    style:EstiloPerFreguesiaRS21,
    onEachFeature: onEachFeaturePerFreguesiaRS21
});

let slidePerFreguesiaRS21 = function(){
    var sliderPerFreguesiaRS21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 54){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFreguesiaRS21, {
        start: [minPerFreguesiaRS21, maxPerFreguesiaRS21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFreguesiaRS21,
            'max': maxPerFreguesiaRS21
        },
        });
    inputNumberMin.setAttribute("value",minPerFreguesiaRS21);
    inputNumberMax.setAttribute("value",maxPerFreguesiaRS21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFreguesiaRS21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFreguesiaRS21.noUiSlider.set([null, this.value]);
    });

    sliderPerFreguesiaRS21.noUiSlider.on('update',function(e){
        PerFreguesiaRS21.eachLayer(function(layer){
            if(layer.feature.properties.Per_RSec21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_RSec21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFreguesiaRS21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 54;
    sliderAtivo = sliderPerFreguesiaRS21.noUiSlider;
    $(slidersGeral).append(sliderPerFreguesiaRS21);
} 
/// --------------------------------------  FIM Percentagem RESIDÊNCIA Secundária 2021 Freguesias

/////-------------------- PERCENTAGEM RESIDÊNCIA SECUNDÁRIA 2011 FREGUESIAS ----------

var minPerFreguesiaRS11 = 0;
var maxPerFreguesiaRS11 = 0;

function EstiloPerFreguesiaRS11(feature) {
    if( feature.properties.Per_RSec11 < minPerFreguesiaRS11 || minPerFreguesiaRS11 === 0){
        minPerFreguesiaRS11 = feature.properties.Per_RSec11
    }
    if(feature.properties.Per_RSec11 > maxPerFreguesiaRS11 ){
        maxPerFreguesiaRS11 = feature.properties.Per_RSec11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.Per_RSec11)
    };
}


function apagarPerFreguesiaRS11(e) {
    PerFreguesiaRS11.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerFreguesiaRS11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per_RSec11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFreguesiaRS11,
    });
}
var PerFreguesiaRS11= L.geoJSON(formaFreguesiaRelativos, {
    style:EstiloPerFreguesiaRS11,
    onEachFeature: onEachFeaturePerFreguesiaRS11
});

let slidePerFreguesiaRS11 = function(){
    var sliderPerFreguesiaRS11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 55){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFreguesiaRS11, {
        start: [minPerFreguesiaRS11, maxPerFreguesiaRS11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFreguesiaRS11,
            'max': maxPerFreguesiaRS11
        },
        });
    inputNumberMin.setAttribute("value",minPerFreguesiaRS11);
    inputNumberMax.setAttribute("value",maxPerFreguesiaRS11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFreguesiaRS11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFreguesiaRS11.noUiSlider.set([null, this.value]);
    });

    sliderPerFreguesiaRS11.noUiSlider.on('update',function(e){
        PerFreguesiaRS11.eachLayer(function(layer){
            if(layer.feature.properties.Per_RSec11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per_RSec11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFreguesiaRS11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 55;
    sliderAtivo = sliderPerFreguesiaRS11.noUiSlider;
    $(slidersGeral).append(sliderPerFreguesiaRS11);
} 
/// --------------------------------------  FIM Percentagem RESIDÊNCIA Secundária 2011 Freguesias

/////-------------------- PERCENTAGEM ALOJAMENTOS RESIDÊNCIA SECUNDÁRIA FREGUESIAS 2001----------

var minPerFreguesiaRS01 = 0;
var maxPerFreguesiaRS01 = 0;

function EstiloPerFreguesiaRS01(feature) {
    if( feature.properties.Per_RSec01 < minPerFreguesiaRS01 && feature.properties.Per_RSec01 > null || minPerFreguesiaRS01 === 0){
        minPerFreguesiaRS01 = feature.properties.Per_RSec01
    }
    if(feature.properties.Per_RSec01 > maxPerFreguesiaRS01 ){
        maxPerFreguesiaRS01 = feature.properties.Per_RSec01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.Per_RSec01)
    };
}


function apagarPerFreguesiaRS01(e) {
    PerFreguesiaRS01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFreguesiaRS01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per_RSec01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFreguesiaRS01,
    });
}
var PerFreguesiaRS01= L.geoJSON(formaFreguesia2001Relativos, {
    style:EstiloPerFreguesiaRS01,
    onEachFeature: onEachFeaturePerFreguesiaRS01
});

let slidePerFreguesiaRS01 = function(){
    var sliderPerFreguesiaRS01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 56){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFreguesiaRS01, {
        start: [minPerFreguesiaRS01, maxPerFreguesiaRS01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFreguesiaRS01,
            'max': maxPerFreguesiaRS01
        },
        });
    inputNumberMin.setAttribute("value",minPerFreguesiaRS01);
    inputNumberMax.setAttribute("value",maxPerFreguesiaRS01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFreguesiaRS01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFreguesiaRS01.noUiSlider.set([null, this.value]);
    });

    sliderPerFreguesiaRS01.noUiSlider.on('update',function(e){
        PerFreguesiaRS01.eachLayer(function(layer){
            if (layer.feature.properties.Per_RSec01 == null){
                return false
            }
            if(layer.feature.properties.Per_RSec01>=parseFloat(e[0])&& layer.feature.properties.Per_RSec01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFreguesiaRS01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 56;
    sliderAtivo = sliderPerFreguesiaRS01.noUiSlider;
    $(slidersGeral).append(sliderPerFreguesiaRS01);
} 
/// --------------------------------------  FIM Percentagem RESIDÊNCIA SECUNDÁRIA EM 2001 Freguesias

/////-------------------- PERCENTAGEM ALOJAMENTOS VAGOS 2021 FREGUESIAS ----------

var minPerFreguesiaVago21 = 0;
var maxPerFreguesiaVago21 = 0;

function EstiloPerFreguesiaVago21(feature) {
    if( feature.properties.PerVago21 < minPerFreguesiaVago21 || minPerFreguesiaVago21 === 0){
        minPerFreguesiaVago21 = feature.properties.PerVago21
    }
    if(feature.properties.PerVago21 > maxPerFreguesiaVago21 ){
        maxPerFreguesiaVago21 = feature.properties.PerVago21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.PerVago21)
    };
}
function apagarPerFreguesiaVago21(e) {
    PerFreguesiaVago21.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeaturePerFreguesiaVago21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerVago21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFreguesiaVago21,
    });
}
var PerFreguesiaVago21= L.geoJSON(formaFreguesiaRelativos, {
    style:EstiloPerFreguesiaVago21,
    onEachFeature: onEachFeaturePerFreguesiaVago21
});

let slidePerFreguesiaVago21 = function(){
    var sliderPerFreguesiaVago21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 57){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFreguesiaVago21, {
        start: [minPerFreguesiaVago21, maxPerFreguesiaVago21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFreguesiaVago21,
            'max': maxPerFreguesiaVago21
        },
        });
    inputNumberMin.setAttribute("value",minPerFreguesiaVago21);
    inputNumberMax.setAttribute("value",maxPerFreguesiaVago21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFreguesiaVago21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFreguesiaVago21.noUiSlider.set([null, this.value]);
    });

    sliderPerFreguesiaVago21.noUiSlider.on('update',function(e){
        PerFreguesiaVago21.eachLayer(function(layer){
            if(layer.feature.properties.PerVago21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerVago21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFreguesiaVago21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 57;
    sliderAtivo = sliderPerFreguesiaVago21.noUiSlider;
    $(slidersGeral).append(sliderPerFreguesiaVago21);
} 
/// --------------------------------------  FIM Percentagem Vagos 2021 Freguesias

/////-------------------- PERCENTAGEM ALOJAMENTOS VAGOS 2011 FREGUESIAS ----------

var minPerFreguesiaVago11 = 0;
var maxPerFreguesiaVago11 = 0;

function EstiloPerFreguesiaVago11(feature) {
    if( feature.properties.PerVago11 < minPerFreguesiaVago11 || minPerFreguesiaVago11 === 0){
        minPerFreguesiaVago11 = feature.properties.PerVago11
    }
    if(feature.properties.PerVago11 > maxPerFreguesiaVago11 ){
        maxPerFreguesiaVago11 = feature.properties.PerVago11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.PerVago11)
    };
}
function apagarPerFreguesiaVago11(e) {
    PerFreguesiaVago11.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeaturePerFreguesiaVago11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerVago11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFreguesiaVago11,
    });
}
var PerFreguesiaVago11= L.geoJSON(formaFreguesiaRelativos, {
    style:EstiloPerFreguesiaVago11,
    onEachFeature: onEachFeaturePerFreguesiaVago11
});

let slidePerFreguesiaVago11 = function(){
    var sliderPerFreguesiaVago11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 58){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFreguesiaVago11, {
        start: [minPerFreguesiaVago11, maxPerFreguesiaVago11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFreguesiaVago11,
            'max': maxPerFreguesiaVago11
        },
        });
    inputNumberMin.setAttribute("value",minPerFreguesiaVago11);
    inputNumberMax.setAttribute("value",maxPerFreguesiaVago11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFreguesiaVago11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFreguesiaVago11.noUiSlider.set([null, this.value]);
    });

    sliderPerFreguesiaVago11.noUiSlider.on('update',function(e){
        PerFreguesiaVago11.eachLayer(function(layer){
            if(layer.feature.properties.PerVago11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerVago11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFreguesiaVago11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 58;
    sliderAtivo = sliderPerFreguesiaVago11.noUiSlider;
    $(slidersGeral).append(sliderPerFreguesiaVago11);
} 
/// --------------------------------------  FIM Percentagem Vagos 2011 Freguesias

/////-------------------- PERCENTAGEM ALOJAMENTOS RESIDÊNCIA SECUNDÁRIA FREGUESIAS 2001----------

var minPerFreguesiaVago01 = 0;
var maxPerFreguesiaVago01 = 0;

function EstiloPerFreguesiaVago01(feature) {
    if( feature.properties.PerVago01 < minPerFreguesiaVago01 && feature.properties.PerVago01 > null || minPerFreguesiaVago01 === 0){
        minPerFreguesiaVago01 = feature.properties.PerVago01
    }
    if(feature.properties.PerVago01 > maxPerFreguesiaVago01 ){
        maxPerFreguesiaVago01 = feature.properties.PerVago01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.PerVago01)
    };
}


function apagarPerFreguesiaVago01(e) {
    PerFreguesiaVago01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFreguesiaVago01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PerVago01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFreguesiaVago01,
    });
}
var PerFreguesiaVago01= L.geoJSON(formaFreguesia2001Relativos, {
    style:EstiloPerFreguesiaVago01,
    onEachFeature: onEachFeaturePerFreguesiaVago01
});
let slidePerFreguesiaVago01 = function(){
    var sliderPerFreguesiaVago01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 59){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFreguesiaVago01, {
        start: [minPerFreguesiaVago01, maxPerFreguesiaVago01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFreguesiaVago01,
            'max': maxPerFreguesiaVago01
        },
        });
    inputNumberMin.setAttribute("value",minPerFreguesiaVago01);
    inputNumberMax.setAttribute("value",maxPerFreguesiaVago01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFreguesiaVago01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFreguesiaVago01.noUiSlider.set([null, this.value]);
    });

    sliderPerFreguesiaVago01.noUiSlider.on('update',function(e){
        PerFreguesiaVago01.eachLayer(function(layer){
            if(layer.feature.properties.PerVago01>=parseFloat(e[0])&& layer.feature.properties.PerVago01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFreguesiaVago01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 59;
    sliderAtivo = sliderPerFreguesiaVago01.noUiSlider;
    $(slidersGeral).append(sliderPerFreguesiaVago01);
} 
/// --------------------------------------  FIM Percentagem ALOJAMENTOS VAGOS EM 2001 Freguesias

///////////////////----------------------- VARIAÇÃO FREGUESIAS ---------------------- \\\\\\\\\\\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES DE RESIDÊNCIA HABITUAL FREGUESIAS entre 2021 e 2011 -----////

var minVarRH21_11Freguesia = 0;
var maxVarRH21_11Freguesia = 0;
function CorVariacaoRH21Freguesia(d) {

    return d === null ? '#A9A9A9':
        d >= 70.89 ? '#FF7F7F' :
        d >= 61.378  ? '#ff8e86' :
        d >= 51.866  ? '#ff9c8c' :
        d >= 42.354  ? '#ffab93' :
        d >= 32.842   ? '#ffb999' :
        d >= 23.33   ? '#ffc8a0' :
        d >= 13.818  ? '#ffd6a6' :
        d >= 4.306   ? '#ffe5ad' :
        d >= -5.206   ? '#cfd5b3' :
        d >= -14.718 ? '#78aeb9':
        d >= -24.23   ? '#2288bf' :
                  '';
    }

function EstiloVarRH21_11Freguesia(feature) {
    if(feature.properties.Var_RHab21 <= minVarRH21_11Freguesia || minVarRH21_11Freguesia ===0){
        minVarRH21_11Freguesia = feature.properties.Var_RHab21
    }
    if(feature.properties.Var_RHab21 > maxVarRH21_11Freguesia){
        maxVarRH21_11Freguesia = feature.properties.Var_RHab21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacaoRH21Freguesia(feature.properties.Var_RHab21)};
    }


function apagarVarRH21_11Freguesia(e) {
    VarRH21_11Freguesia.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarRH21_11Freguesia(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var_RHab21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarRH21_11Freguesia,
    });
}
var VarRH21_11Freguesia= L.geoJSON(formaFreguesiaRelativos, {
    style:EstiloVarRH21_11Freguesia,
    onEachFeature: onEachFeatureVarRH21_11Freguesia
});

let slideVarRH21_11Freguesia = function(){
    var sliderVarRH21_11Freguesia = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 60){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarRH21_11Freguesia, {
        start: [minVarRH21_11Freguesia, maxVarRH21_11Freguesia],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarRH21_11Freguesia,
            'max': maxVarRH21_11Freguesia
        },
        });
    inputNumberMin.setAttribute("value",minVarRH21_11Freguesia);
    inputNumberMax.setAttribute("value",maxVarRH21_11Freguesia);

    inputNumberMin.addEventListener('change', function(){
        sliderVarRH21_11Freguesia.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarRH21_11Freguesia.noUiSlider.set([null, this.value]);
    });

    sliderVarRH21_11Freguesia.noUiSlider.on('update',function(e){
        VarRH21_11Freguesia.eachLayer(function(layer){
            if(layer.feature.properties.Var_RHab21>=parseFloat(e[0])&& layer.feature.properties.Var_RHab21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarRH21_11Freguesia.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 60;
    sliderAtivo = sliderVarRH21_11Freguesia.noUiSlider;
    $(slidersGeral).append(sliderVarRH21_11Freguesia);
} 

///// Fim da Variação dos Alojamentos RESIDÊNCIA HABITUAL  Concelhos entre 2021 e 2011 -------------- \\\\\\


//////------- Variação dos ALOJAMENTOS FAMILIARES DE RESIDÊNCIA HABITUAL FREGUESIAS entre 2011 e 2001 -----////

var minVarRH11_01Freguesia = 0;
var maxVarRH11_01Freguesia = 0;

function EstiloVarRH11_01Freguesia(feature) {
    if(feature.properties.Var_RHab11 <= minVarRH11_01Freguesia || minVarRH11_01Freguesia ===0){
        minVarRH11_01Freguesia = feature.properties.Var_RHab11
    }
    if(feature.properties.Var_RHab11 > maxVarRH11_01Freguesia){
        maxVarRH11_01Freguesia = feature.properties.Var_RHab11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacaoRH21Freguesia(feature.properties.Var_RHab11)};
    }


function apagarVarRH11_01Freguesia(e) {
    VarRH11_01Freguesia.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarRH11_01Freguesia(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var_RHab11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarRH11_01Freguesia,
    });
}
var VarRH11_01Freguesia= L.geoJSON(formaFreguesia2001Relativos, {
    style:EstiloVarRH11_01Freguesia,
    onEachFeature: onEachFeatureVarRH11_01Freguesia
});

let slideVarRH11_01Freguesia = function(){
    var sliderVarRH11_01Freguesia = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 61){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarRH11_01Freguesia, {
        start: [minVarRH11_01Freguesia, maxVarRH11_01Freguesia],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarRH11_01Freguesia,
            'max': maxVarRH11_01Freguesia
        },
        });
    inputNumberMin.setAttribute("value",minVarRH11_01Freguesia);
    inputNumberMax.setAttribute("value",maxVarRH11_01Freguesia);

    inputNumberMin.addEventListener('change', function(){
        sliderVarRH11_01Freguesia.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarRH11_01Freguesia.noUiSlider.set([null, this.value]);
    });

    sliderVarRH11_01Freguesia.noUiSlider.on('update',function(e){
        VarRH11_01Freguesia.eachLayer(function(layer){
            if (layer.feature.properties.Var_RHab11 == null){
                return false
            }
            if(layer.feature.properties.Var_RHab11>=parseFloat(e[0])&& layer.feature.properties.Var_RHab11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarRH11_01Freguesia.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 61;
    sliderAtivo = sliderVarRH11_01Freguesia.noUiSlider;
    $(slidersGeral).append(sliderVarRH11_01Freguesia);
} 

///// Fim da Variação dos Alojamentos RESIDÊNCIA HABITUAL  Concelhos entre 2011 e 2001 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES DE RESIDÊNCIA SECUNDÁRIA FREGUESIAS entre 2021 e 2011 -----////

var minVarRS21_11Freguesia = 0;
var maxVarRS21_11Freguesia = 0;
function CorVariacaoRS21Freguesia(d) {

    return d === null ? '#A9A9A9':
        d >= 100 ? '#FF7F7F' :
        d >= 83.984  ? '#ff8a84' :
        d >= 67.968  ? '#ff9589' :
        d >= 51.952  ? '#ffa08e' :
        d >= 35.936   ? '#ffab93' :
        d >= 19.92   ? '#ffb698' :
        d >= 3.904  ? '#ffc19d' :
        d >= -12.112   ? '#ffcca2' :
        d >= -28.128   ? '#ffd7a7' :
        d >= -44.144 ? '#ffe2ab':
        d >= -60.16   ? '#2288bf' :
                  '';
    }
function EstiloVarRS21_11Freguesia(feature) {
    if(feature.properties.Var_RSec21 <= minVarRS21_11Freguesia || minVarRS21_11Freguesia ===0){
        minVarRS21_11Freguesia = feature.properties.Var_RSec21
    }
    if(feature.properties.Var_RSec21 > maxVarRS21_11Freguesia){
        maxVarRS21_11Freguesia = feature.properties.Var_RSec21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'gray',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacaoRS21Freguesia(feature.properties.Var_RSec21)};
    }
function hoverBlack(e) {
    var layer = e.target;
    layer.openPopup();
    layer.setStyle({
        weight: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}

function apagarVarRS21_11Freguesia(e) {
    VarRS21_11Freguesia.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarRS21_11Freguesia(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var_RSec21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hoverBlack,
        mouseout: apagarVarRS21_11Freguesia,
    });
}
var VarRS21_11Freguesia= L.geoJSON(formaFreguesiaRelativos, {
    style:EstiloVarRS21_11Freguesia,
    onEachFeature: onEachFeatureVarRS21_11Freguesia
});
let slideVarRS21_11Freguesia = function(){
    var sliderVarRS21_11Freguesia = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 62){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarRS21_11Freguesia, {
        start: [minVarRS21_11Freguesia, maxVarRS21_11Freguesia],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarRS21_11Freguesia,
            'max': maxVarRS21_11Freguesia
        },
        });
    inputNumberMin.setAttribute("value",minVarRS21_11Freguesia);
    inputNumberMax.setAttribute("value",maxVarRS21_11Freguesia);

    inputNumberMin.addEventListener('change', function(){
        sliderVarRS21_11Freguesia.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarRS21_11Freguesia.noUiSlider.set([null, this.value]);
    });

    sliderVarRS21_11Freguesia.noUiSlider.on('update',function(e){
        VarRS21_11Freguesia.eachLayer(function(layer){
            if(layer.feature.properties.Var_RSec21>=parseFloat(e[0])&& layer.feature.properties.Var_RSec21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarRS21_11Freguesia.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 62;
    sliderAtivo = sliderVarRS21_11Freguesia.noUiSlider;
    $(slidersGeral).append(sliderVarRS21_11Freguesia);
} 

///// Fim da Variação dos Alojamentos RESIDÊNCIA SECUNDÁRIA  Concelhos entre 2021 e 2011 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES DE RESIDÊNCIA SECUNDÁRIA FREGUESIAS entre 2011 e 2001 -----////

var minVarRS11_01Freguesia = 0;
var maxVarRS11_01Freguesia = 0;

function EstiloVarRS11_01Freguesia(feature) {
    if(feature.properties.Var_RSec11 <= minVarRS11_01Freguesia || minVarRS11_01Freguesia ===0){
        minVarRS11_01Freguesia = feature.properties.Var_RSec11
    }
    if(feature.properties.Var_RSec11 > maxVarRS11_01Freguesia){
        maxVarRS11_01Freguesia = feature.properties.Var_RSec11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'gray',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacaoRS21Freguesia(feature.properties.Var_RSec11)};
    }


function apagarVarRS11_01Freguesia(e) {
    VarRS11_01Freguesia.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarRS11_01Freguesia(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var_RSec11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hoverBlack,
        mouseout: apagarVarRS11_01Freguesia,
    });
}
var VarRS11_01Freguesia= L.geoJSON(formaFreguesia2001Relativos, {
    style:EstiloVarRS11_01Freguesia,
    onEachFeature: onEachFeatureVarRS11_01Freguesia
});

let slideVarRS11_01Freguesia = function(){
    var sliderVarRS11_01Freguesia = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 63){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarRS11_01Freguesia, {
        start: [minVarRS11_01Freguesia, maxVarRS11_01Freguesia],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarRS11_01Freguesia,
            'max': maxVarRS11_01Freguesia
        },
        });
    inputNumberMin.setAttribute("value",minVarRS11_01Freguesia);
    inputNumberMax.setAttribute("value",maxVarRS11_01Freguesia);

    inputNumberMin.addEventListener('change', function(){
        sliderVarRS11_01Freguesia.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarRS11_01Freguesia.noUiSlider.set([null, this.value]);
    });

    sliderVarRS11_01Freguesia.noUiSlider.on('update',function(e){
        VarRS11_01Freguesia.eachLayer(function(layer){
            if (layer.feature.properties.Var_RSec11 == null){
                return false
            }
            if(layer.feature.properties.Var_RSec11>=parseFloat(e[0])&& layer.feature.properties.Var_RSec11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarRS11_01Freguesia.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 63;
    sliderAtivo = sliderVarRS11_01Freguesia.noUiSlider;
    $(slidersGeral).append(sliderVarRS11_01Freguesia);
} 
///// Fim da Variação dos Alojamentos RESIDÊNCIA SECUNDÁRIA  FREGUESIAS entre 2011 e 2001 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES CLÁSSICOS VAGOS FREGUESIAS entre 2021 e 2011 -----////

var minVarVago21_11Freguesia = 0;
var maxVarVago21_11Freguesia = 0;

function CorVariacaoVago21Freguesia(d) {

    return d === null ? '#A9A9A9':
        d >=100 ? '#FF7F7F' :
        d >= 80  ? '#ff8b84' :
        d >= 60  ? '#ff9689' :
        d >= 40  ? '#ffa18e' :
        d >= 20   ? '#ffac93' :
        d >= 0   ? '#ffb898' :
        d >= -20  ? '#ffc39d' :
        d >= -40   ? '#ffcea2' :
        d >= -60   ? '#ffd9a7' :
        d >= -80 ? '#ffe4ac':
        d >= -100   ? '#2288bf' :
                  '';
    }
function EstiloVarVago21_11Freguesia(feature) {
    if(feature.properties.VarVago21 <= minVarVago21_11Freguesia || minVarVago21_11Freguesia ===0){
        minVarVago21_11Freguesia = feature.properties.VarVago21
    }
    if(feature.properties.VarVago21 > maxVarVago21_11Freguesia){
        maxVarVago21_11Freguesia = feature.properties.VarVago21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'gray',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacaoVago21Freguesia(feature.properties.VarVago21)};
    }


function apagarVarVago21_11Freguesia(e) {
    VarVago21_11Freguesia.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarVago21_11Freguesia(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarVago21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hoverBlack,
        mouseout: apagarVarVago21_11Freguesia,
    });
}
var VarVago21_11Freguesia= L.geoJSON(formaFreguesiaRelativos, {
    style:EstiloVarVago21_11Freguesia,
    onEachFeature: onEachFeatureVarVago21_11Freguesia
});

let slideVarVago21_11Freguesia = function(){
    var sliderVarVago21_11Freguesia = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 64){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarVago21_11Freguesia, {
        start: [minVarVago21_11Freguesia, maxVarVago21_11Freguesia],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarVago21_11Freguesia,
            'max': maxVarVago21_11Freguesia
        },
        });
    inputNumberMin.setAttribute("value",minVarVago21_11Freguesia);
    inputNumberMax.setAttribute("value",maxVarVago21_11Freguesia);

    inputNumberMin.addEventListener('change', function(){
        sliderVarVago21_11Freguesia.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarVago21_11Freguesia.noUiSlider.set([null, this.value]);
    });

    sliderVarVago21_11Freguesia.noUiSlider.on('update',function(e){
        VarVago21_11Freguesia.eachLayer(function(layer){
            if(layer.feature.properties.VarVago21>=parseFloat(e[0])&& layer.feature.properties.VarVago21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarVago21_11Freguesia.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 64;
    sliderAtivo = sliderVarVago21_11Freguesia.noUiSlider;
    $(slidersGeral).append(sliderVarVago21_11Freguesia);
} 

///// Fim da Variação dos Alojamentos Vagos  Freguesias entre 2021 e 2011 -------------- \\\\\\

//////------- Variação dos ALOJAMENTOS FAMILIARES VAGOS FREGUESIAS entre 2011 e 2001 -----////

var minVarVago11_01Freguesia = 0;
var maxVarVago11_01Freguesia = 0;

function EstiloVarVago11_01Freguesia(feature) {
    if(feature.properties.VarVago11 <= minVarVago11_01Freguesia || minVarVago11_01Freguesia ===0){
        minVarVago11_01Freguesia = feature.properties.VarVago11
    }
    if(feature.properties.VarVago11 > maxVarVago11_01Freguesia){
        maxVarVago11_01Freguesia = feature.properties.VarVago11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'gray',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacaoVago21Freguesia(feature.properties.VarVago11)};
    }


function apagarVarVago11_01Freguesia(e) {
    VarVago11_01Freguesia.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarVago11_01Freguesia(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarVago11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hoverBlack,
        mouseout: apagarVarVago11_01Freguesia,
    });
}
var VarVago11_01Freguesia= L.geoJSON(formaFreguesia2001Relativos, {
    style:EstiloVarVago11_01Freguesia,
    onEachFeature: onEachFeatureVarVago11_01Freguesia
});

let slideVarVago11_01Freguesia = function(){
    var sliderVarVago11_01Freguesia = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 65){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarVago11_01Freguesia, {
        start: [minVarVago11_01Freguesia, maxVarVago11_01Freguesia],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarVago11_01Freguesia,
            'max': maxVarVago11_01Freguesia
        },
        });
    inputNumberMin.setAttribute("value",minVarVago11_01Freguesia);
    inputNumberMax.setAttribute("value",maxVarVago11_01Freguesia);

    inputNumberMin.addEventListener('change', function(){
        sliderVarVago11_01Freguesia.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarVago11_01Freguesia.noUiSlider.set([null, this.value]);
    });

    sliderVarVago11_01Freguesia.noUiSlider.on('update',function(e){
        VarVago11_01Freguesia.eachLayer(function(layer){
            if (layer.feature.properties.VarVago11 == null){
                return false
            }
            if(layer.feature.properties.VarVago11>=parseFloat(e[0])&& layer.feature.properties.VarVago11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarVago11_01Freguesia.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 65;
    sliderAtivo = sliderVarVago11_01Freguesia.noUiSlider;
    $(slidersGeral).append(sliderVarVago11_01Freguesia);
} 
///// Fim da Variação dos Alojamentos Familiares Clássicos Vagos  FREGUESIAS entre 2011 e 2001 -------------- \\\\\\


////Ao abrir página aparecer logo a fonte e legenda
var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Recenseamento da população e habitação';

/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = TotAlojConcelho21;
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
    if (layer == TotAlojConcelho21 && naoDuplicar != 1){
        legenda('Nº Total de Alojamentos Familiares Clássicos em 2021',maxTotAlojConcelho21, ((maxTotAlojConcelho21-minTotAlojConcelho21)/2).toFixed(0),minTotAlojConcelho21,0.1);
        contorno.addTo(map)
        slideTotAlojConcelho21();
        baseAtiva = contorno;
        naoDuplicar = 1;
    }
    if (layer == TotAlojConcelho21 && naoDuplicar == 1){
        contorno.addTo(map);
    }
    if (layer == TotAlojConcelho11 && naoDuplicar != 2){
        legenda('Nº Total de Alojamentos Familiares Clássicos em 2011',maxTotAlojConcelho11,Math.round((maxTotAlojConcelho11-minTotAlojConcelho11)/2),minTotAlojConcelho11,0.1);
        contorno.addTo(map)
        slideTotAlojConcelho11();
        naoDuplicar = 2;
    }
    if (layer == TotAlojConcelho01 && naoDuplicar != 3){
        legenda('Nº Total de Alojamentos Familiares Clássicos em 2001',maxTotAlojConcelho01,Math.round((maxTotAlojConcelho01-minTotAlojConcelho01)/2),minTotAlojConcelho01,0.1);
        contorno.addTo(map);
        slideTotAlojConcelho01();
        naoDuplicar = 3;
    }
    if (layer == TotAlojConcelho91 && naoDuplicar != 4){
        legenda('Nº Total de Alojamentos Familiares Clássicos em 1991',maxTotAlojConcelho91,Math.round((maxTotAlojConcelho91-segundoTotAlojConcelho91)/2),segundoTotAlojConcelho91,0.1);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slideTotAlojConcelho91();
        naoDuplicar = 4;
    }
    if (layer == TotAlojConcelhoRH21 && naoDuplicar != 5){
        legenda('Nº de Alojamentos Familiares Clássicos de Residência Habitual em 2021',maxTotAlojConcelhoRH21,Math.round((maxTotAlojConcelhoRH21-minTotAlojConcelhoRH21)/2),minTotAlojConcelhoRH21,0.1);
        contorno.addTo(map)
        slideTotAlojConcelhoRH21();
        naoDuplicar = 5;
    }
    if (layer == TotAlojConcelhoRH11 && naoDuplicar != 6){
        legenda('Nº de Alojamentos Familiares Clássicos de Residência Habitual em 2011',maxTotAlojConcelhoRH11,Math.round((maxTotAlojConcelhoRH11-minTotAlojConcelhoRH11)/2),minTotAlojConcelhoRH11,0.1);
        contorno.addTo(map)
        slideTotAlojConcelhoRH11();
        naoDuplicar = 6;
    }
    if (layer == TotAlojConcelhoRH01 && naoDuplicar != 7){
        legenda('Nº de Alojamentos Familiares Clássicos de Residência Habitual em 2001',maxTotAlojConcelhoRH01,Math.round((maxTotAlojConcelhoRH01-minTotAlojConcelhoRH01)/2),minTotAlojConcelhoRH01,0.1);
        contorno.addTo(map)
        slideTotAlojConcelhoRH01();
        naoDuplicar = 7;
    }
    if (layer == TotAlojConcelhoRH91 && naoDuplicar != 8){
        legenda('Nº de Alojamentos Familiares Clássicos de Residência Habitual em 1991',maxTotAlojConcelhoRH91,Math.round((maxTotAlojConcelhoRH91-segundoTotAlojConcelhoRH91)/2),segundoTotAlojConcelhoRH91,0.1);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slideTotAlojConcelhoRH91();
        naoDuplicar = 8;
    }
    if (layer == TotAlojConcelhoRS21 && naoDuplicar != 9){
        legendaExcecao('Nº de Alojamentos Familiares Clássicos de Residência Secundária em 2021',maxTotAlojConcelhoRS21,Math.round((maxTotAlojConcelhoRS21-minTotAlojConcelhoRS21)/2),minTotAlojConcelhoRS21,0.1);
        contorno.addTo(map)
        slideTotAlojConcelhoRS21();
        naoDuplicar = 9;
    }
    if (layer == TotAlojConcelhoRS11 && naoDuplicar != 10){
        legendaExcecao('Nº de Alojamentos Familiares Clássicos de Residência Secundária em 2011',maxTotAlojConcelhoRS11,Math.round((maxTotAlojConcelhoRS11-minTotAlojConcelhoRS11)/2),minTotAlojConcelhoRS11,0.1);
        contorno.addTo(map)
        slideTotAlojConcelhoRS11();
        naoDuplicar = 10;
    }
    if (layer == TotAlojConcelhoRS01 && naoDuplicar != 11){
        legendaExcecao('Nº de Alojamentos Familiares Clássicos de Residência Secundária em 2001',maxTotAlojConcelhoRS01,Math.round((maxTotAlojConcelhoRS01-minTotAlojConcelhoRS01)/2),minTotAlojConcelhoRS01,0.1);
        contorno.addTo(map)
        slideTotAlojConcelhoRS01();
        naoDuplicar = 11;
    }
    if (layer == TotAlojConcelhoRS91 && naoDuplicar != 12){
        legendaExcecao('Nº de Alojamentos Familiares Clássicos de Residência Secundária em 1991',maxTotAlojConcelhoRS91,Math.round((maxTotAlojConcelhoRS91-segundoTotAlojConcelhoRS91)/2),segundoTotAlojConcelhoRS91,0.1);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slideTotAlojConcelhoRS91();
        naoDuplicar = 12;
    }
    if (layer == TotAlojConcelhoVago21 && naoDuplicar != 13){
        legendaExcecaoVagos('Nº de Alojamentos Familiares Clássicos Vagos em 2021',maxTotAlojConcelhoVago21,Math.round((maxTotAlojConcelhoVago21-377)/2),377,0.1);
        contorno.addTo(map)
        slideTotAlojConcelhoVago21();
        naoDuplicar = 13;
    }
    if (layer == TotAlojConcelhoVago11 && naoDuplicar != 14){
        legendaExcecaoVagos('Nº de Alojamentos Familiares Clássicos Vagos em 2011',maxTotAlojConcelhoVago11,Math.round((maxTotAlojConcelhoVago11-377)/2),377,0.1);
        contorno.addTo(map)
        slideTotAlojConcelhoVago11();
        naoDuplicar = 14;
    }
    if (layer == TotAlojConcelhoVago01 && naoDuplicar != 15){
        legendaExcecaoVagos('Nº de Alojamentos Familiares Clássicos Vagos em 2001',maxTotAlojConcelhoVago01,Math.round((maxTotAlojConcelhoVago01-377)/2),377,0.1);
        contorno.addTo(map);
        slideTotAlojConcelhoVago01();
        naoDuplicar = 15;
    }
    if (layer == TotAlojConcelhoVago91 && naoDuplicar != 16){
        legendaExcecaoVagos('Nº de Alojamentos Familiares Clássicos Vagos em 1991',maxTotAlojConcelhoVago91,Math.round((maxTotAlojConcelhoVago91-segundoTotAlojConcelhoVago91)/2),segundoTotAlojConcelhoVago91,0.1);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slideTotAlojConcelhoVago91();
        naoDuplicar = 16;
    }
    if (layer == PerConcelhoRH21 && naoDuplicar != 17){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em 2021');
        slidePerConcelhoRH21();
        naoDuplicar = 17;
    }
    if (layer == PerConcelhoRH11 && naoDuplicar != 18){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em 2011');
        slidePerConcelhoRH11();
        naoDuplicar = 18;
    }
    if (layer == PerConcelhoRH01 && naoDuplicar != 19){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em 2001');
        slidePerConcelhoRH01();
        naoDuplicar = 19;
    }
    if (layer == PerConcelhoRH91 && naoDuplicar != 20){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em 1991');
        slidePerConcelhoRH91();
        naoDuplicar = 20;
    }
    if (layer == PerConcelhoRS21 && naoDuplicar != 21){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Secundária em 2021');
        slidePerConcelhoRS21();
        naoDuplicar = 21;
    }
    if (layer == PerConcelhoRS11 && naoDuplicar != 22){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Secundária em 2011');
        slidePerConcelhoRS11();
        naoDuplicar = 22;
    }
    if (layer == PerConcelhoRS01 && naoDuplicar != 23){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Secundária em 2001');
        slidePerConcelhoRS01();
        naoDuplicar = 23;
    }
    if (layer == PerConcelhoRS91 && naoDuplicar != 24){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Secundária em 1991');
        slidePerConcelhoRS91();
        naoDuplicar = 24;
    }
    if (layer == PerConcelhoVago21 && naoDuplicar != 25){
        legendaGradiente('Percentagem de Alojamentos Familiares Vagos em 2021');
        slidePerConcelhoVago21();
        naoDuplicar = 25;
    }
    if (layer == PerConcelhoVago11 && naoDuplicar != 26){
        legendaGradiente('Percentagem de Alojamentos Familiares Vagos em 2011');
        slidePerConcelhoVago11();
        naoDuplicar = 26;
    }
    if (layer == PerConcelhoVago01 && naoDuplicar != 27){
        legendaGradiente('Percentagem de Alojamentos Familiares Vagos em 2001');
        slidePerConcelhoVago01();
        naoDuplicar = 27;
    }
    if (layer == PerConcelhoVago91 && naoDuplicar != 28){
        legendaGradiente('Percentagem de Alojamentos Familiares Vagos em 1991');
        slidePerConcelhoVago91();
        naoDuplicar = 28;
    }
    if (layer == VarRH21_11Concelho && naoDuplicar != 29){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Habitual entre 2021 e 2011', minVarRH01_91Concelho,maxVarRH01_91Concelho,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(114,172,186,1) 10%, rgba(195,208,180,1) 20%, rgba(255,232,174,1) 30%, rgba(255,217,167,1) 40%, rgba(255,202,161,1) 50%, rgba(255,187,154,1) 60%, rgba(255,172,147,1) 70%, rgba(255,157,141,1) 80%, rgba(255,142,134,1) 90%, rgba(255,127,127,1) 100%");
        slideVarRH21_11Concelho();
        naoDuplicar = 29;
    }
    if (layer == VarRH11_01Concelho && naoDuplicar != 30){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Habitual entre 2011 e 2001',minVarRH01_91Concelho,maxVarRH01_91Concelho,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(114,172,186,1) 10%, rgba(195,208,180,1) 20%, rgba(255,232,174,1) 30%, rgba(255,217,167,1) 40%, rgba(255,202,161,1) 50%, rgba(255,187,154,1) 60%, rgba(255,172,147,1) 70%, rgba(255,157,141,1) 80%, rgba(255,142,134,1) 90%, rgba(255,127,127,1) 100%");
        slideVarRH11_01Concelho();
        naoDuplicar = 30;
    }
    if (layer == VarRH01_91Concelho && naoDuplicar != 31){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Habitual entre 2001 e 1991', minVarRH01_91Concelho,maxVarRH01_91Concelho,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(114,172,186,1) 10%, rgba(195,208,180,1) 20%, rgba(255,232,174,1) 30%, rgba(255,217,167,1) 40%, rgba(255,202,161,1) 50%, rgba(255,187,154,1) 60%, rgba(255,172,147,1) 70%, rgba(255,157,141,1) 80%, rgba(255,142,134,1) 90%, rgba(255,127,127,1) 100%");
        slideVarRH01_91Concelho();
        naoDuplicar = 31;
    }
    if (layer == VarRS21_11Concelho && naoDuplicar != 32){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Secundária entre 2021 e 2011', minVarRS21_11Concelho,maxVarRS01_91Concelho,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(106,168,186,1) 10%, rgba(178,200,181,1) 20%, rgba(251,233,176,1) 30%, rgba(255,221,169,1) 40%, rgba(255,205,162,1) 50%, rgba(255,190,155,1) 60%, rgba(255,174,148,1) 70%, rgba(255,159,141,1) 80%, rgba(255,143,134,1) 90%, rgba(255,127,127,1) 100%");
        slideVarRS21_11Concelho();
        naoDuplicar = 32;
    }
    if (layer == VarRS11_01Concelho && naoDuplicar != 33){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Secundária entre 2011 e 2001', minVarRS21_11Concelho,maxVarRS01_91Concelho,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(106,168,186,1) 10%, rgba(178,200,181,1) 20%, rgba(251,233,176,1) 30%, rgba(255,221,169,1) 40%, rgba(255,205,162,1) 50%, rgba(255,190,155,1) 60%, rgba(255,174,148,1) 70%, rgba(255,159,141,1) 80%, rgba(255,143,134,1) 90%, rgba(255,127,127,1) 100%");
        slideVarRS11_01Concelho();
        naoDuplicar = 33;
    }
    if (layer == VarRS01_91Concelho && naoDuplicar != 34){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Secundária entre 2001 e 1991', minVarRS21_11Concelho,maxVarRS01_91Concelho,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(114,172,186,1) 10%, rgba(195,208,180,1) 20%, rgba(255,232,174,1) 30%, rgba(255,217,167,1) 40%, rgba(255,202,161,1) 50%, rgba(255,187,154,1) 60%, rgba(255,172,147,1) 70%, rgba(255,157,141,1) 80%, rgba(255,142,134,1) 90%, rgba(255,127,127,1) 100%");
        slideVarRS01_91Concelho();
        naoDuplicar = 34;
    }
    
    if (layer == VarVago21_11Concelho && naoDuplicar != 35){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos Vagos entre 2021 e 2011', minVarVago11_01Concelho,100,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(160,192,182,1) 10%, rgba(255,232,174,1) 20%, rgba(255,219,168,1) 30%, rgba(255,206,162,1) 40%, rgba(255,193,157,1) 50%, rgba(255,180,151,1) 60%, rgba(255,167,145,1) 70%, rgba(255,154,139,1) 80%, rgba(255,141,133,1) 90%, rgba(255,127,127,1) 100%");
        slideVarVago21_11Concelho();
        naoDuplicar = 35;
    }
    if (layer == VarVago11_01Concelho && naoDuplicar != 36){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos Vagos entre 2011 e 2001', minVarVago11_01Concelho,100,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(160,192,182,1) 10%, rgba(255,232,174,1) 20%, rgba(255,219,168,1) 30%, rgba(255,206,162,1) 40%, rgba(255,193,157,1) 50%, rgba(255,180,151,1) 60%, rgba(255,167,145,1) 70%, rgba(255,154,139,1) 80%, rgba(255,141,133,1) 90%, rgba(255,127,127,1) 100%");
        slideVarVago11_01Concelho();
        naoDuplicar = 36;
    }
    if (layer == VarVago01_91Concelho && naoDuplicar != 37){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos Vagos entre 2001 e 1991', minVarVago11_01Concelho,100,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(160,192,182,1) 10%, rgba(255,232,174,1) 20%, rgba(255,219,168,1) 30%, rgba(255,206,162,1) 40%, rgba(255,193,157,1) 50%, rgba(255,180,151,1) 60%, rgba(255,167,145,1) 70%, rgba(255,154,139,1) 80%, rgba(255,141,133,1) 90%, rgba(255,127,127,1) 100%");
        slideVarVago01_91Concelho();
        naoDuplicar = 37;
    }
    if (layer == TotAlojFreguesia21 && naoDuplicar != 38){
        legenda('Nº Total de Alojamentos Familiares Clássicos em 2021',maxTotAlojFreguesia21, ((maxTotAlojFreguesia21-minTotAlojFreguesia21)/2).toFixed(0),minTotAlojFreguesia21,0.2);
        contornoFreg.addTo(map)
        slideTotAlojFreguesia21();
        baseAtiva = contornoFreg;
        naoDuplicar = 38;
    }
    if (layer == TotAlojFreguesia11 && naoDuplicar != 39){
        legenda('Nº Total de Alojamentos Familiares Clássicos em 2011',maxTotAlojFreguesia11, ((maxTotAlojFreguesia11-minTotAlojFreguesia11)/2).toFixed(0),minTotAlojFreguesia11,0.2);
        contornoFreg.addTo(map)
        slideTotAlojFreguesia11();
        naoDuplicar = 39;
    }
    if (layer == TotAlojFreguesia01 && naoDuplicar != 40){
        legenda('Nº Total de Alojamentos Familiares Clássicos em 2001',maxTotAlojFreguesia01, ((maxTotAlojFreguesia01-minTotAlojFreguesia01)/2).toFixed(0),minTotAlojFreguesia01,0.2);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideTotAlojFreguesia01();
        naoDuplicar = 40;
    }
    if (layer == TotAlojFreguesiaRH21 && naoDuplicar != 42){
        legenda('Nº Total de Alojamentos Familiares Clássicos de Residência Habitual em 2021',maxTotAlojFreguesiaRH21, ((maxTotAlojFreguesiaRH21-minTotAlojFreguesiaRH21)/2).toFixed(0),minTotAlojFreguesiaRH21,0.2);
        contornoFreg.addTo(map)
        slideTotAlojFreguesiaRH21();
        naoDuplicar = 42;
    }
    if (layer == TotAlojFreguesiaRH11 && naoDuplicar != 43){
        legenda('Nº Total de Alojamentos Familiares Clássicos de Residência Habitual em 2011',maxTotAlojFreguesiaRH11, ((maxTotAlojFreguesiaRH11-minTotAlojFreguesiaRH11)/2).toFixed(0),minTotAlojFreguesiaRH11,0.2);
        contornoFreg.addTo(map)
        slideTotAlojFreguesiaRH11();
        naoDuplicar = 43;
    }
    if (layer == TotAlojFreguesiaRH01 && naoDuplicar != 44){
        legenda('Nº Total de Alojamentos Familiares Clássicos de Residência Habitual em 2001',maxTotAlojFreguesiaRH01, ((maxTotAlojFreguesiaRH01-minTotAlojFreguesiaRH01)/2).toFixed(0),minTotAlojFreguesiaRH01,0.2);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideTotAlojFreguesiaRH01();
        naoDuplicar = 44;
    }
    if (layer == TotAlojFreguesiaRS21 && naoDuplicar != 45){
        legenda('Nº Total de Alojamentos Familiares Clássicos de Residência Secundária em 2021',maxTotAlojFreguesiaRS21, ((maxTotAlojFreguesiaRS21-minTotAlojFreguesiaRS21)/2).toFixed(0),minTotAlojFreguesiaRS21,0.20);
        contornoFreg.addTo(map)
        slideTotAlojFreguesiaRS21();
        naoDuplicar = 45;
    }
    if (layer == TotAlojFreguesiaRS11 && naoDuplicar != 46){
        legenda('Nº Total de Alojamentos Familiares Clássicos de Residência Secundária em 2011',maxTotAlojFreguesiaRS11, ((maxTotAlojFreguesiaRS11-minTotAlojFreguesiaRS11)/2).toFixed(0),minTotAlojFreguesiaRS11,0.2);
        contornoFreg.addTo(map)
        slideTotAlojFreguesiaRS11();
        naoDuplicar = 46;
    }
    if (layer == TotAlojFreguesiaRS01 && naoDuplicar != 47){
        legenda('Nº Total de Alojamentos Familiares Clássicos de Residência Secundária em 2001',maxTotAlojFreguesiaRS01, ((maxTotAlojFreguesiaRS01-minTotAlojFreguesiaRS01)/2).toFixed(0),minTotAlojFreguesiaRS01,0.2);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideTotAlojFreguesiaRS01();
        naoDuplicar = 47;
    }
    if (layer == TotAlojFreguesiaVago21 && naoDuplicar != 48){
        legenda('Nº Total de Alojamentos Familiares Clássicos Vagos em 2021',maxTotAlojFreguesiaVago21, ((maxTotAlojFreguesiaVago21-minTotAlojFreguesiaVago21)/2).toFixed(0),minTotAlojFreguesiaVago21,0.2);
        contornoFreg.addTo(map)
        slideTotAlojFreguesiaVago21();
        naoDuplicar = 48;
    }
    if (layer == TotAlojFreguesiaVago11 && naoDuplicar != 49){
        legenda('Nº Total de Alojamentos Familiares Clássicos Vagos em 2011',maxTotAlojFreguesiaVago11, ((maxTotAlojFreguesiaVago11-minTotAlojFreguesiaVago11)/2).toFixed(0),minTotAlojFreguesiaVago11,0.2);
        contornoFreg.addTo(map)
        slideTotAlojFreguesiaVago11();
        naoDuplicar = 49;
    }
    if (layer == TotAlojFreguesiaVago01 && naoDuplicar != 50){
        legenda('Nº Total de Alojamentos Familiares Clássicos Vagos em 2001',maxTotAlojFreguesiaVago01, ((maxTotAlojFreguesiaVago01-minTotAlojFreguesiaVago01)/2).toFixed(0),minTotAlojFreguesiaVago01,0.2);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideTotAlojFreguesiaVago01();
        naoDuplicar = 50;
    }
    if (layer == PerFreguesiaRH21 && naoDuplicar != 51){
        legendaGradiente('Percentagem de Alojamentos Familiares Clássicos de Residência Habitual em 2021');
        slidePerFreguesiaRH21();
        naoDuplicar = 51;
    }
    if (layer == PerFreguesiaRH11 && naoDuplicar != 52){
        legendaGradiente('Percentagem de Alojamentos Familiares Clássicos de Residência Habitual em 2011');
        slidePerFreguesiaRH11();
        naoDuplicar = 52;
    }
    if (layer == PerFreguesiaRH01 && naoDuplicar != 53){
        legendaGradiente('Percentagem de Alojamentos Familiares Clássicos de Residência Habitual em 2001');
        slidePerFreguesiaRH01();
        naoDuplicar = 53;
    }
    if (layer == PerFreguesiaRS21 && naoDuplicar != 54){
        legendaGradiente('Percentagem de Alojamentos Familiares Clássicos de Residência Secundária em 2021');
        slidePerFreguesiaRS21();
        naoDuplicar = 54;
    }
    if (layer == PerFreguesiaRS11 && naoDuplicar != 55){
        legendaGradiente('Percentagem de Alojamentos Familiares Clássicos de Residência Secundária em 2011');
        slidePerFreguesiaRS11();
        naoDuplicar = 55;
    }
    if (layer == PerFreguesiaRS01 && naoDuplicar != 56){
        legendaGradiente('Percentagem de Alojamentos Familiares Clássicos de Residência Secundária em 2001');
        slidePerFreguesiaRS01();
        naoDuplicar = 56;
    }
    if (layer == PerFreguesiaVago21 && naoDuplicar != 57){
        legendaGradiente('Percentagem de Alojamentos Familiares Clássicos Vagos em 2021');
        slidePerFreguesiaVago21();
        naoDuplicar = 57;
    }
    if (layer == PerFreguesiaVago11 && naoDuplicar != 58){
        legendaGradiente('Percentagem de Alojamentos Familiares Clássicos Vagos em 2011');
        slidePerFreguesiaVago11();
        naoDuplicar = 58;
    }
    if (layer == PerFreguesiaVago01 && naoDuplicar != 59){
        legendaGradiente('Percentagem de Alojamentos Familiares Clássicos Vagos em 2001');
        slidePerFreguesiaVago01();
        naoDuplicar = 59;
    }
    if (layer == VarRH21_11Freguesia && naoDuplicar != 60){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Habitual entre 2021 e 2011', minVarRH21_11Freguesia,maxVarRH11_01Freguesia,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(120,174,185,1) 10%, rgba(207,213,179,1) 20%, rgba(255,229,173,1) 30%, rgba(255,214,166,1) 40%, rgba(255,200,160,1) 50%, rgba(255,185,153,1) 60%, rgba(255,171,147,1) 70%, rgba(255,156,140,1) 80%, rgba(255,142,134,1) 90%, rgba(255,127,127,1) 100%");
        slideVarRH21_11Freguesia();
        naoDuplicar = 60;
    }
    if (layer == VarRH11_01Freguesia && naoDuplicar != 61){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Habitual entre 2011 e 2001', minVarRH11_01Freguesia,maxVarRH11_01Freguesia,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(120,174,185,1) 10%, rgba(207,213,179,1) 20%, rgba(255,229,173,1) 30%, rgba(255,214,166,1) 40%, rgba(255,200,160,1) 50%, rgba(255,185,153,1) 60%, rgba(255,171,147,1) 70%, rgba(255,156,140,1) 80%, rgba(255,142,134,1) 90%, rgba(255,127,127,1) 100%");
        slideVarRH11_01Freguesia();
        naoDuplicar = 61;
    }
    if (layer == VarRS21_11Freguesia && naoDuplicar != 62){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Secundária entre 2021 e 2011', minVarRS21_11Freguesia,100,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(255,226,171,1) 10%, rgba(255,215,167,1) 20%, rgba(255,204,162,1) 30%, rgba(255,193,157,1) 40%, rgba(255,182,152,1) 50%, rgba(255,171,147,1) 60%, rgba(255,160,142,1) 70%, rgba(255,149,137,1) 80%, rgba(255,138,132,1) 90%, rgba(255,127,127,1) 100%");
        slideVarRS21_11Freguesia();
        naoDuplicar = 62;
    }
    if (layer == VarRS11_01Freguesia && naoDuplicar != 63){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Secundária entre 2011 e 2001', minVarRS21_11Freguesia,100,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(255,226,171,1) 10%, rgba(255,215,167,1) 20%, rgba(255,204,162,1) 30%, rgba(255,193,157,1) 40%, rgba(255,182,152,1) 50%, rgba(255,171,147,1) 60%, rgba(255,160,142,1) 70%, rgba(255,149,137,1) 80%, rgba(255,138,132,1) 90%, rgba(255,127,127,1) 100%");
        slideVarRS11_01Freguesia();
        naoDuplicar = 63;
    }
    if (layer == VarVago21_11Freguesia && naoDuplicar != 64){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos Vagos entre 2021 e 2011', minVarVago11_01Freguesia,100,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(255,228,172,1) 10%, rgba(255,217,167,1) 20%, rgba(255,206,162,1) 30%, rgba(255,195,157,1) 40%, rgba(255,184,152,1) 50%, rgba(255,172,147,1) 60%, rgba(255,161,142,1) 70%, rgba(255,150,137,1) 80%, rgba(255,139,132,1) 90%, rgba(255,127,127,1) 100%");
        slideVarVago21_11Freguesia();
        naoDuplicar = 64;
    }
    if (layer == VarVago11_01Freguesia && naoDuplicar != 65){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos Vagos entre 2011 e 2001', minVarVago11_01Freguesia,100,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(255,228,172,1) 10%, rgba(255,217,167,1) 20%, rgba(255,206,162,1) 30%, rgba(255,195,157,1) 40%, rgba(255,184,152,1) 50%, rgba(255,172,147,1) 60%, rgba(255,161,142,1) 70%, rgba(255,150,137,1) 80%, rgba(255,139,132,1) 90%, rgba(255,127,127,1) 100%");
        slideVarVago11_01Freguesia();
        naoDuplicar = 65;
    }
    layer.addTo(map);
    layerAtiva = layer;  
}
let notaRodape = function(){
    $('#painel').append("<div id='notaRodape'></div>")
    $('#notaRodape').html("Devido aos valores mais reduzidos, optou-se por aumentar a proporção dos círculos, de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os círculos à escala concelhia.")
}
let primeirovalor = function(valor){
    $("#mySelect").val("2021");
    $("#opcaoSelect").val(valor)
    
}
let reporAnos = function(){
    $('#mySelect').empty();
    $('#mySelect').append("<option value='2021'>2021</option>");
    $('#mySelect').append("<option value='2011'>2011</option>");
    $('#mySelect').append("<option value='2001'>2001</option>");
    $('#mySelect').append("<option value='1991'>1991</option>");
}
let reporAnosVariacao = function(){
    primeirovalor('RH');
    reporAnos();
    $('#mySelect')[0].options[0].innerHTML = "2021 - 2011";
    $('#mySelect')[0].options[1].innerHTML = "2011 - 2001";
    $('#mySelect')[0].options[2].innerHTML = "2001 - 1991";
    $("#mySelect option[value='1991']").remove();
}
let tamanhoTotal = function(){
    $("#opcaoSelect option[value='Total']").show();
    $("#opcaoSelect").css('width', '60px');
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
let esconderTotal = function(){
    $("#opcaoSelect option[value='Total']").hide();
}

$('#absoluto').click(function(){
    novaLayer(TotAlojConcelho21);
    tamanhoTotal();
    reporAnos();
    primeirovalor('Total');
    $('#tituloMapa').html('<strong>' + 'Alojamentos familiares Clássicos por forma de ocupação, Nº.' + '</strong>');
});

$('#percentagem').click(function(){
    novaLayer(PerConcelhoRH21); 
    reporAnos();
    esconderTotal();
    primeirovalor('RH');
    tamanhoOutros();
    $('#tituloMapa').html('<strong>' + 'Alojamentos familiares Clássicos por forma de ocupação, %.' + '</strong>')
});

$('#taxaVariacao').click(function(){
    novaLayer(VarRH21_11Concelho);
    reporAnosVariacao();
    esconderTotal();
    tamanhoOutros();
    $('#tituloMapa').html('<strong>' + 'Alojamentos familiares Clássicos de residência habitual por forma de ocupação, %.' + '</strong>')
});
$('#absolutoFreguesia').click(function(){
    novaLayer(TotAlojFreguesia21);
    tamanhoTotal();
    reporAnos();
    primeirovalor('Total');
    $('#tituloMapa').html('<strong>' + 'Alojamentos familiares Clássicos de residência habitual por forma de ocupação, Nº.' + '</strong>')
    $("#mySelect option[value='1991']").remove();
    notaRodape();
});

$('#freguesias').click(function(){
    variaveisMapaFreguesias();
    reporAnos();
    $("#mySelect option[value='1991']").remove();
});
$('#concelho').click(function(){
    variaveisMapaConcelho();
    reporAnos();
    $('#notaRodape').remove();
});
$('#percentagemFreguesia').click(function(){
    novaLayer(PerFreguesiaRH21);
    reporAnos();
    esconderTotal();
    primeirovalor('RH');
    tamanhoOutros();
    $('#tituloMapa').html('<strong>' + 'Alojamentos familiares clássicos de residência habitual por forma de ocupação, %.' + '</strong>')
    $("#mySelect option[value='1991']").remove();
    $('#notaRodape').remove();
});
$('#taxaVariacaoFreguesia').click(function(){
    novaLayer(VarRH21_11Freguesia);
    reporAnosVariacao();
    esconderTotal();
    tamanhoOutros();
    $('#tituloMapa').html('<strong>' + 'Alojamentos familiares clássicos de residência habitual por forma de ocupação, %.' + '</strong>')
    $("#mySelect option[value='1991']").remove();
    $("#mySelect option[value='2001']").remove();
    $('#notaRodape').remove();
});

$('#absolutoFreguesia').attr("class", "btn");
let variaveisMapaConcelho = function(){
    $('#escalasConcelho').css("visibility", "visible");
    $('#escalasFreguesias').css("visibility", "hidden");
    $('#absolutoFreguesia').attr("class", "butao");
    if($('#absoluto').hasClass('active4')){
        return false;
    }
    else{
        $('#concelho').attr("class", " btn active2")
        $('#freguesias').attr('class',"butaoEscala")
        $('#absoluto').attr('class',"butao active4")
        $('#absolutoFreguesia').attr('class',"butao")
        $('#percentagemFreguesia').attr('class',"butao")
        $('#taxaVariacaoFreguesia').attr('class',"butao")
        novaLayer(TotAlojConcelho21);
        tamanhoTotal();
        reporAnos();
        primeirovalor('Total');
    }

}

let variaveisMapaFreguesias = function(){
    $('#escalasConcelho').css("visibility", "hidden");
    $('#escalasFreguesias').css("visibility", "visible");
    if($('#absolutoFreguesia').hasClass('active5')){
        return false;
    }
    else{
        $('#freguesias').attr('class',"btn active2")
        $('#absolutoFreguesia').attr('class',"butao active5")
        $('#variacaoFreguesia').attr('class',"butao")
        $('#percentagemFreguesia').attr('class',"butao")
        ////Preciso de colocar este absoluto como active5, para que mude para a escala concelho
        $('#absoluto').attr('class',"butao")
        $('#percentagem').attr('class',"butao")
        $('#taxaVariacao').attr('class',"butao")
        $('#concelho').attr("class","butaoEscala");
        novaLayer(TotAlojFreguesia21);
        tamanhoTotal();
        reporAnos();
        primeirovalor('Total');
        notaRodape();
    }
}
function myFunction() {
    var formaOcupacao = document.getElementById("opcaoSelect").value;
    var anoSelecionado = document.getElementById("mySelect").value;
    if($(absoluto).hasClass('active4')){
        $('#notaRodape').remove();
        if (anoSelecionado == "2021" && formaOcupacao =="Total"){
            novaLayer(TotAlojConcelho21);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="Total"){
            novaLayer(TotAlojConcelho11);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="Total"){
            novaLayer(TotAlojConcelho01);
        };
        if (anoSelecionado == "1991" && formaOcupacao =="Total"){
            novaLayer(TotAlojConcelho91);
        };
        if (anoSelecionado == "2021" && formaOcupacao =="RH"){
            novaLayer(TotAlojConcelhoRH21);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="RH"){
            novaLayer(TotAlojConcelhoRH11);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="RH"){
            novaLayer(TotAlojConcelhoRH01);
        };
        if (anoSelecionado == "1991" && formaOcupacao =="RH"){
            novaLayer(TotAlojConcelhoRH91);
        };
        if (anoSelecionado == "2021" && formaOcupacao =="RS"){
            novaLayer(TotAlojConcelhoRS21);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="RS"){
            novaLayer(TotAlojConcelhoRS11);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="RS"){
            novaLayer(TotAlojConcelhoRS01);
        };
        if (anoSelecionado == "1991" && formaOcupacao =="RS"){
            novaLayer(TotAlojConcelhoRS91);
        };
        if (anoSelecionado == "2021" && formaOcupacao =="Vago"){
            novaLayer(TotAlojConcelhoVago21);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="Vago"){
            novaLayer(TotAlojConcelhoVago11);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="Vago"){
            novaLayer(TotAlojConcelhoVago01);
        };
        if (anoSelecionado == "1991" && formaOcupacao =="Vago"){
            novaLayer(TotAlojConcelhoVago91);
        };
    }
    if($(percentagem).hasClass('active4')){
        if (anoSelecionado == "2021" && formaOcupacao =="RH"){
            novaLayer(PerConcelhoRH21);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="RH"){
            novaLayer(PerConcelhoRH11);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="RH"){
            novaLayer(PerConcelhoRH01);
        };
        if (anoSelecionado == "1991" && formaOcupacao =="RH"){
            novaLayer(PerConcelhoRH91);
        };
        if (anoSelecionado == "2021" && formaOcupacao =="RS"){
            novaLayer(PerConcelhoRS21);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="RS"){
            novaLayer(PerConcelhoRS11);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="RS"){
            novaLayer(PerConcelhoRS01);
        };
        if (anoSelecionado == "1991" && formaOcupacao =="RS"){
            novaLayer(PerConcelhoRS91);
        };
        if (anoSelecionado == "2021" && formaOcupacao =="Vago"){
            novaLayer(PerConcelhoVago21);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="Vago"){
            novaLayer(PerConcelhoVago11);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="Vago"){
            novaLayer(PerConcelhoVago01);
        };
        if (anoSelecionado == "1991" && formaOcupacao =="Vago"){
            novaLayer(PerConcelhoVago91);
        };
    }
    if($(taxaVariacao).hasClass('active4')){
        if (anoSelecionado == "2021" && formaOcupacao =="RH"){
            novaLayer(VarRH21_11Concelho);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="RH"){
            novaLayer(VarRH11_01Concelho);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="RH"){
            novaLayer(VarRH01_91Concelho);
        };
        if (anoSelecionado == "2021" && formaOcupacao =="RS"){
            novaLayer(VarRS21_11Concelho);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="RS"){
            novaLayer(VarRS11_01Concelho);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="RS"){
            novaLayer(VarRS01_91Concelho);
        };
        if (anoSelecionado == "2021" && formaOcupacao =="Vago"){
            novaLayer(VarVago21_11Concelho);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="Vago"){
            novaLayer(VarVago11_01Concelho);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="Vago"){
            novaLayer(VarVago01_91Concelho);
        };
    }
    if($('#absolutoFreguesia').hasClass('active5')){
        if (anoSelecionado == "2021" && formaOcupacao =="Total"){
            novaLayer(TotAlojFreguesia21);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="Total"){
            novaLayer(TotAlojFreguesia11);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="Total"){
            novaLayer(TotAlojFreguesia01);
        };
        if (anoSelecionado == "2021" && formaOcupacao =="RH"){
            novaLayer(TotAlojFreguesiaRH21);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="RH"){
            novaLayer(TotAlojFreguesiaRH11);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="RH"){
            novaLayer(TotAlojFreguesiaRH01);
        };
        if (anoSelecionado == "2021" && formaOcupacao =="RS"){
            novaLayer(TotAlojFreguesiaRS21);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="RS"){
            novaLayer(TotAlojFreguesiaRS11);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="RS"){
            novaLayer(TotAlojFreguesiaRS01);
        };
        if (anoSelecionado == "2021" && formaOcupacao =="Vago"){
            novaLayer(TotAlojFreguesiaVago21);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="Vago"){
            novaLayer(TotAlojFreguesiaVago11);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="Vago"){
            novaLayer(TotAlojFreguesiaVago01);
        };
    }
    if($('#percentagemFreguesia').hasClass('active5')){
        if (anoSelecionado == "2021" && formaOcupacao =="RH"){
            novaLayer(PerFreguesiaRH21);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="RH"){
            novaLayer(PerFreguesiaRH11);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="RH"){
            novaLayer(PerFreguesiaRH01);
        };
        if (anoSelecionado == "2021" && formaOcupacao =="RS"){
            novaLayer(PerFreguesiaRS21);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="RS"){
            novaLayer(PerFreguesiaRS11);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="RS"){
            novaLayer(PerFreguesiaRS01);
        };
        if (anoSelecionado == "2021" && formaOcupacao =="Vago"){
            novaLayer(PerFreguesiaVago21);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="Vago"){
            novaLayer(PerFreguesiaVago11);
        };
        if (anoSelecionado == "2001" && formaOcupacao =="Vago"){
            novaLayer(PerFreguesiaVago01);
        };
    }
    if($('#taxaVariacaoFreguesia').hasClass('active5')){
        if (anoSelecionado == "2021" && formaOcupacao =="RH"){
            novaLayer(VarRH21_11Freguesia);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="RH"){
            novaLayer(VarRH11_01Freguesia);
        };
        if (anoSelecionado == "2021" && formaOcupacao =="RS"){
            novaLayer(VarRS21_11Freguesia);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="RS"){
            novaLayer(VarRS11_01Freguesia);
        };
        if (anoSelecionado == "2021" && formaOcupacao =="Vago"){
            novaLayer(VarVago21_11Freguesia);
        };
        if (anoSelecionado == "2011" && formaOcupacao =="Vago"){
            novaLayer(VarVago11_01Freguesia);
        };
    }   
}



let anosSelecionados = function() {
    let anoSelecionado = document.getElementById("mySelect").value;
    if ($('#freguesias').hasClass("active2")){
        if (anoSelecionado == "2021"){
            i = 0;
        }
        if (anoSelecionado == "2001"){
            i = 2;
        }
    }
    if ($('#concelho').hasClass("active2")){
        if (anoSelecionado == "2021"){
            i = 0;
        }
        if (anoSelecionado == "1991"){
            i = 3;
        }
    }
    
    
}
  
const opcoesAnos = $('#mySelect');      
$('#next').click(function(){
    anosSelecionados();
    if ($('#freguesias').hasClass("active2")){
        if (i !== 2) {
            opcoesAnos.find('option:selected').next().prop('selected', true);
            myFunction();
            i += 1
            console.log(i)
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
            console.log(i)
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
        if(i === 2){
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


$('#opcaoTabela').click(function(){

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
    $('#escalasFreguesias').css("visibility","hidden");
    $('#metaInformacao').css("visibility","hidden");


    $('#concelho').attr("class", "butaoEscala active2");
    $('#freguesias').attr('class',"butaoEscala");
    $('.btn').css("top","10%");

    $('#tabelaDadosAbsolutos').attr("class","btn active1")


    $('#tabela').css("visibility","visible");
    $('#opcoesTabela').css("visibility","visible")
    $('#opcoesTabela').css("top","15%")
    $('#tituloMapa').css("visibility","visible");
    $('.ine').css("visibility","visible");
    DadosAbsolutosForma();


});

$('#opcaoFonte').click(function(){
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

    $('#tabelaVariacao').attr("class","btn");
    $('#tabelaPercentagem').attr("class","btn");
    $('#tabelaDadosAbsolutos').attr("class","btn")
    
    $('#metaInformacao').css("visibility","visible");
    $('.btn').css("top","50%")
})

$('#opcaoMapa').click(function(){
    novaLayer(TotAlojConcelho21);
    $('#mapDIV').css("visibility","visible");
    $('#myDIV').css("visibility","visible");
    $('#painelLegenda').css("visibility","visible");
    $('#tabela').css("visibility","hidden");
    $('#opcoesTabela').css("visibility","hidden");
    $('#metaInformacao').css("visibility","hidden");

    $('#filtrar').css("visibility","visible");
    $('#escalasConcelho').css("visibility","visible"); 
    $('#legendaA').css("visibility","visible"); 
    $('#variavel').css("visibility","visible");
    $('#tituloMapa').css("visibility","visible");
    $('.ine').css("visibility","visible");

    $('#absoluto').attr("class"," butao active4");
    $('#taxaVariacao').attr("class","butao");
    $('#percentagem').attr("class","butao");

    $('#tabelaVariacao').attr("class","btn");
    $('#tabelaPercentagem').attr("class","btn");
    $('#tabelaDadosAbsolutos').attr("class","btn")

    $('#temporal').css("visibility","visible");
    $('#slidersGeral').css("visibility","visible");
    $('.btn').css("top","50%")



})

$('#tabelaDadosAbsolutos').click(function(){
    DadosAbsolutosForma();
});

var DadosAbsolutosForma = function(){
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/waza/main/FormaOcupacao.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.GrupoEtario == "Vago"){
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.GrupoEtario+'</td>';
                    if(!value.DADOS1991){
                        dados += '<td class="borderbottom">'+' '+'</td>';
                    }
                    else{
                        dados += '<td class="borderbottom">'+value.DADOS1991+'</td>';
                    }
                    if(!value.DADOS2001){
                        dados += '<td class="borderbottom">'+' '+'</td>';
                    }
                    else{
                        dados += '<td class="borderbottom">'+value.DADOS2001+'</td>';
                    }
                    dados += '<td class="borderbottom">'+value.DADOS2011+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2021+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Freguesia+'</td>';
                    dados += '<td>'+value.GrupoEtario+'</td>';
                    if(!value.DADOS1991){
                        dados += '<td>'+' '+'</td>';
                    }
                    else{
                        dados += '<td>'+value.DADOS1991+'</td>';
                    }
                    if(!value.DADOS2001){
                        dados += '<td>'+' '+'</td>';
                    }
                    else{
                        dados += '<td>'+value.DADOS2001+'</td>';
                    }
                    dados += '<td>'+value.DADOS2011+'</td>';
                    dados += '<td>'+value.DADOS2021+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})};

$('#tabelaPercentagem').click(function(){
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/waza/main/FormaOcupacao.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.GrupoEtario == "Vago"){
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.GrupoEtario+'</td>';
                    if(!value.PER1991){
                        dados += '<td class="borderbottom">'+' '+'</td>';
                    }
                    else{
                        dados += '<td class="borderbottom">'+value.PER1991+'%'+'</td>';
                    }
                    if(!value.PER2001){
                        dados += '<td class="borderbottom">'+' '+'</td>';
                    }
                    else{
                        dados += '<td class="borderbottom">'+value.PER2001+'%'+'</td>';
                    }
                    if(!value.PER2011){
                        dados += '<td class="borderbottom">'+' '+'</td>';
                    }
                    else{
                        dados += '<td class="borderbottom">'+value.PER2011+'%'+'</td>';
                    }
                    dados += '<td class="borderbottom">'+value.PER2021+'%'+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Freguesia+'</td>';
                    dados += '<td>'+value.GrupoEtario+'</td>';
                    if(!value.PER1991){
                        dados += '<td>'+' '+'</td>';
                    }
                    else{
                        dados += '<td>'+value.PER1991+'%'+'</td>';
                    }
                    if(!value.PER2001){
                        dados += '<td>'+' '+'</td>';
                    }
                    else{
                        dados += '<td>'+value.PER2001+'%'+'</td>';
                    }
                    if(!value.PER2011){
                        dados += '<td>'+' '+'</td>';
                    }
                    else{
                        dados += '<td>'+value.PER2011+'%'+'</td>';
                    }
                    dados += '<td>'+value.PER2021+'%'+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});

$('#tabelaVariacao').click(function(){
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/waza/main/FormaOcupacao.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#1991').html("")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.GrupoEtario == "Vago"){
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.GrupoEtario+'</td>';
                    dados += '<td class="borderbottom">'+ ' '+'</td>';
                    if(!value.VAR0191){
                        dados += '<td class="borderbottom">'+' '+'</td>';
                    }
                    else{
                        dados += '<td class="borderbottom">'+value.VAR0191+'</td>';
                    }

                    if(!value.VAR1101){
                        dados += '<td class="borderbottom">'+' '+'</td>';
                    }

                    else{
                        dados += '<td class="borderbottom">'+value.VAR1101+'</td>';
                    }
                    dados += '<td class="borderbottom">'+value.VAR2111+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Freguesia+'</td>';
                    dados += '<td>'+value.GrupoEtario+'</td>';
                    dados += '<td>'+ ' '+'</td>';
                    if(!value.VAR0191){
                        dados += '<td>'+' '+'</td>';
                    }
                    else{
                        dados += '<td>'+value.VAR0191+'</td>';
                    }

                    if(!value.VAR1101){
                        if(value.VAR1101 == 0){
                            dados += '<td>'+ "0" +'</td>';
                        }
                        else{
                        dados += '<td>'+' '+'</td>';
                        }
                    }
                    else{
                        dados += '<td>'+value.VAR1101+'</td>';
                    }
                    dados += '<td>'+value.VAR2111+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});


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

