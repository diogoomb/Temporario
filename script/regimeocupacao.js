////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'


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



$('#input-number-min').css("left","3.5%")
/////Buscar os ID'S todos \\\\\

let space = document.getElementById("space");
let opcoesTabela = document.getElementById('opcoesTabela');
let escalasConcelho = document.getElementById('escalasConcelho');
let escalasFreguesia = document.getElementById('escalasFreguesias');
let absolutoConcelho = document.getElementById('absoluto');
let absolutoFreguesia = document.getElementById('absolutoFreguesia');
let variacaoConcelho = document.getElementById('taxaVariacao');
let variacaoFreguesia = document.getElementById('taxaVariacaoFreguesia');
let percentagemConcelhos = document.getElementById('percentagem');
let percentagemFreguesia = document.getElementById('percentagemFreguesia');
let painel = document.getElementById('painel');
let titulo = document.getElementById('titulo')
let myDIV = document.getElementById('myDIV');
let legendaA= document.getElementById('legendaA');
var ifSlide2isActive = 1;
let slidersGeral = document.getElementById('slidersGeral');
let inputNumberMin = document.getElementById('input-number-min');
let inputNumberMax = document.getElementById('input-number-max');



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

///// Total de Alojamentos de Residência Habitual em 2021



var minTotAlojRH21 = 0;
var maxTotAlojRH21 = 0;
function estiloTotAlojRH21(feature, latlng) {
    if(feature.properties.Resi_Hab21< minTotAlojRH21 || minTotAlojRH21 ===0){
        minTotAlojRH21 = feature.properties.Resi_Hab21
    }
    if(feature.properties.Resi_Hab21> maxTotAlojRH21){
        maxTotAlojRH21 = feature.properties.Resi_Hab21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Hab21,0.1)
    });
}
function apagarTotAlojRH21(e){
    var layer = e.target;
    TotAlojRH21.resetStyle(layer)
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
function onEachFeatureTotAlojRH21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.Resi_Hab21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojRH21,
    })
};

var TotAlojRH21= L.geoJSON(formaConcelhosAbsolutos,{
    pointToLayer:estiloTotAlojRH21,
    onEachFeature: onEachFeatureTotAlojRH21,
});
TotAlojRH21.addTo(map)  

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
legenda('Nº de Alojamentos de Residência Habitual em 2021',maxTotAlojRH21, ((maxTotAlojRH21-minTotAlojRH21)/2).toFixed(0),minTotAlojRH21,0.1);

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

                if (i == 1){
                    $(legendCircle).append("<span class='legendValue excecao'>"+classes[i]+"<span>");
                }
                else if (i == 0){
                    $(legendCircle).append("<span class='legendaCirculosExcecao'>"+classes[i]+"<span>");
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

var slideTotAlojRH21 = function(){
    var sliderTotAlojRH21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojRH21, {
        start: [minTotAlojRH21, maxTotAlojRH21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojRH21,
            'max': maxTotAlojRH21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojRH21);
    inputNumberMax.setAttribute("value",maxTotAlojRH21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojRH21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojRH21.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojRH21.noUiSlider.on('update',function(e){
        TotAlojRH21.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Hab21>=parseFloat(e[0])&& layer.feature.properties.Resi_Hab21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojRH21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderTotAlojRH21.noUiSlider;
    $(slidersGeral).append(sliderTotAlojRH21);
}
slideTotAlojRH21();

//// Fim do Total de Alojamentos de Residência Habitual em 2021


//// Alojamentos Residência Habitual 2021 Concelhos //////

var minTotAlojRH11 = 0;
var maxTotAlojRH11 = 0;
function estiloTotAlojRH11(feature, latlng) {
    if(feature.properties.Resi_Hab11< minTotAlojRH11 || minTotAlojRH11 ===0){
        minTotAlojRH11 = feature.properties.Resi_Hab11
    }
    if(feature.properties.Resi_Hab11> maxTotAlojRH11){
        maxTotAlojRH11 = feature.properties.Resi_Hab11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Hab11,0.1)
    });
}
function apagarTotAlojRH11(e){
    var layer = e.target;
    ConcelhoTotAlojRH11.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotAlojRH11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.Resi_Hab11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotAlojRH11,
    })
};

var ConcelhoTotAlojRH11= L.geoJSON(formaConcelhosAbsolutos,{
    pointToLayer:estiloTotAlojRH11,
    onEachFeature: onEachFeatureTotAlojRH11,
});



var slideTotAlojRH11 = function(){
    var sliderTotAlojRH11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotAlojRH11, {
        start: [minTotAlojRH11, maxTotAlojRH11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotAlojRH11,
            'max': maxTotAlojRH11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotAlojRH11);
    inputNumberMax.setAttribute("value",maxTotAlojRH11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotAlojRH11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotAlojRH11.noUiSlider.set([null, this.value]);
    });

    sliderTotAlojRH11.noUiSlider.on('update',function(e){
        ConcelhoTotAlojRH11.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Hab11>=parseFloat(e[0])&& layer.feature.properties.Resi_Hab11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotAlojRH11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderTotAlojRH11.noUiSlider;
    $(slidersGeral).append(sliderTotAlojRH11);
}

/////Fim ALojamentos de Residência Habitual em 2011 Concelhos



//// Alojamentos Proprietário 2021 Concelhos //////

var min = 0;
var max = 0;
function estiloProprietario21(feature, latlng) {
    if(feature.properties.RProprie21< min || min ===0){
        min = feature.properties.RProprie21
    }
    if(feature.properties.RProprie21> max){
        max = feature.properties.RProprie21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.RProprie21,0.1)
    });
}
function apagarProprietario21(e){
    var layer = e.target;
    ConcelhoProprietario21.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureProprietario21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.RProprie21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarProprietario21,
    })
};

var ConcelhoProprietario21= L.geoJSON(regimeConcelhoAbsoluto,{
    pointToLayer:estiloProprietario21,
    onEachFeature: onEachFeatureProprietario21,
});



var slideProprietario21 = function(){
    var sliderProprietario21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderProprietario21, {
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
        sliderProprietario21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderProprietario21.noUiSlider.set([null, this.value]);
    });

    sliderProprietario21.noUiSlider.on('update',function(e){
        ConcelhoProprietario21.eachLayer(function(layer){
            if(layer.feature.properties.RProprie21>=parseFloat(e[0])&& layer.feature.properties.RProprie21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderProprietario21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderProprietario21.noUiSlider;
    $(slidersGeral).append(sliderProprietario21);
}

/////Fim ALojamentos Proprietário 2021 Concelhos

//// Alojamentos Proprietário 2011 Concelhos //////

var minConcProprietario11 = 0;
var maxConcProprietario11 = 0;
function estiloProprietario11(feature, latlng) {
    if(feature.properties.RProprie11< minConcProprietario11 || minConcProprietario11 ===0){
        minConcProprietario11 = feature.properties.RProprie11
    }
    if(feature.properties.RProprie11> maxConcProprietario11){
        maxConcProprietario11 = feature.properties.RProprie11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.RProprie11,0.1)
    });
}
function apagarProprietario11(e){
    var layer = e.target;
    ConcelhoProprietario11.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureProprietario11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.RProprie11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarProprietario11,
    })
};

var ConcelhoProprietario11= L.geoJSON(regimeConcelhoAbsoluto,{
    pointToLayer:estiloProprietario11,
    onEachFeature: onEachFeatureProprietario11,
});


var slideProprietario11 = function(){
    var sliderProprietario11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderProprietario11, {
        start: [minConcProprietario11, maxConcProprietario11],
        tooltips:true,
        connect: true,
        range: {
            'min': minConcProprietario11,
            'max': maxConcProprietario11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minConcProprietario11);
    inputNumberMax.setAttribute("value",maxConcProprietario11);

    inputNumberMin.addEventListener('change', function(){
        sliderProprietario11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderProprietario11.noUiSlider.set([null, this.value]);
    });

    sliderProprietario11.noUiSlider.on('update',function(e){
        ConcelhoProprietario11.eachLayer(function(layer){
            if(layer.feature.properties.RProprie11>=parseFloat(e[0])&& layer.feature.properties.RProprie11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderProprietario11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderProprietario11.noUiSlider;
    $(slidersGeral).append(sliderProprietario11);

}
/// Fim alojamentos proprietário 2021 Concelhos

//// Alojamentos Arrendatario 2021 Concelhos //////

var minConcArrendatario21 = 0;
var maxConcArrendatario21 = 0;
function estiloArrendatario21(feature, latlng) {
    if(feature.properties.RArrend21< minConcArrendatario21 || minConcArrendatario21 ===0){
        minConcArrendatario21 = feature.properties.RArrend21
    }
    if(feature.properties.RArrend21> maxConcArrendatario21){
        maxConcArrendatario21 = feature.properties.RArrend21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.RArrend21,0.1)
    });
}
function apagarArrendatario21(e){
    var layer = e.target;
    ConcelhoArrendatario21.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureArrendatario21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.RArrend21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarArrendatario21,
    })
};

var ConcelhoArrendatario21= L.geoJSON(regimeConcelhoAbsoluto,{
    pointToLayer:estiloArrendatario21,
    onEachFeature: onEachFeatureArrendatario21,
});


var slideArrendatario21 = function(){
    var sliderArrendatario21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderArrendatario21, {
        start: [minConcArrendatario21, maxConcArrendatario21],
        tooltips:true,
        connect: true,
        range: {
            'min': minConcArrendatario21,
            'max': maxConcArrendatario21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minConcArrendatario21);
    inputNumberMax.setAttribute("value",maxConcArrendatario21);

    inputNumberMin.addEventListener('change', function(){
        sliderArrendatario21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderArrendatario21.noUiSlider.set([null, this.value]);
    });

    sliderArrendatario21.noUiSlider.on('update',function(e){
        ConcelhoArrendatario21.eachLayer(function(layer){
            if(layer.feature.properties.RArrend21>=parseFloat(e[0])&& layer.feature.properties.RArrend21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderArrendatario21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderArrendatario21.noUiSlider;
    $(slidersGeral).append(sliderArrendatario21);

}
/// Fim alojamentos Arrendatario 2021 Concelhos

//// Alojamentos Arrendatario 2011 Concelhos //////

var minConcArrendatario11 = 0;
var maxConcArrendatario11 = 0;
function estiloArrendatario11(feature, latlng) {
    if(feature.properties.RArrend11< minConcArrendatario11 || minConcArrendatario11 ===0){
        minConcArrendatario11 = feature.properties.RArrend11
    }
    if(feature.properties.RArrend11> maxConcArrendatario11){
        maxConcArrendatario11 = feature.properties.RArrend11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.RArrend11,0.1)
    });
}
function apagarArrendatario11(e){
    var layer = e.target;
    ConcelhoArrendatario11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureArrendatario11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.RArrend11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarArrendatario11,
    })
};

var ConcelhoArrendatario11= L.geoJSON(regimeConcelhoAbsoluto,{
    pointToLayer:estiloArrendatario11,
    onEachFeature: onEachFeatureArrendatario11,
});


var slideArrendatario11 = function(){
    var sliderArrendatario11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderArrendatario11, {
        start: [minConcArrendatario11, maxConcArrendatario11],
        tooltips:true,
        connect: true,
        range: {
            'min': minConcArrendatario11,
            'max': maxConcArrendatario11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minConcArrendatario11);
    inputNumberMax.setAttribute("value",maxConcArrendatario11);

    inputNumberMin.addEventListener('change', function(){
        sliderArrendatario11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderArrendatario11.noUiSlider.set([null, this.value]);
    });

    sliderArrendatario11.noUiSlider.on('update',function(e){
        ConcelhoArrendatario11.eachLayer(function(layer){
            if(layer.feature.properties.RArrend11>=parseFloat(e[0])&& layer.feature.properties.RArrend11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderArrendatario11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderArrendatario11.noUiSlider;
    $(slidersGeral).append(sliderArrendatario11);

}

/// FIM Alojamentos Arrendatario em 2011 Concelhos

//// Alojamentos Outras Situações 2021 Concelhos //////

var minConcOutrasSituacoes21 = 0;
var maxConcOutrasSituacoes21 = 0;
function estiloOutrasSituacoes21(feature, latlng) {
    if(feature.properties.ROutrSit21< minConcOutrasSituacoes21 || minConcOutrasSituacoes21 ===0){
        minConcOutrasSituacoes21 = feature.properties.ROutrSit21
    }
    if(feature.properties.ROutrSit21> maxConcOutrasSituacoes21){
        maxConcOutrasSituacoes21 = feature.properties.ROutrSit21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ROutrSit21,0.1)
    });
}
function apagarOutrasSituacoes21(e){
    var layer = e.target;
    ConcelhoOutrasSituacoes21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureOutrasSituacoes21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.ROutrSit21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarOutrasSituacoes21,
    })
};

var ConcelhoOutrasSituacoes21= L.geoJSON(regimeConcelhoAbsoluto,{
    pointToLayer:estiloOutrasSituacoes21,
    onEachFeature: onEachFeatureOutrasSituacoes21,
});


var slideOutrasSituacoes21 = function(){
    var sliderOutrasSituacoes21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderOutrasSituacoes21, {
        start: [minConcOutrasSituacoes21, maxConcOutrasSituacoes21],
        tooltips:true,
        connect: true,
        range: {
            'min': minConcOutrasSituacoes21,
            'max': maxConcOutrasSituacoes21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minConcOutrasSituacoes21);
    inputNumberMax.setAttribute("value",maxConcOutrasSituacoes21);

    inputNumberMin.addEventListener('change', function(){
        sliderOutrasSituacoes21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderOutrasSituacoes21.noUiSlider.set([null, this.value]);
    });

    sliderOutrasSituacoes21.noUiSlider.on('update',function(e){
        ConcelhoOutrasSituacoes21.eachLayer(function(layer){
            if(layer.feature.properties.ROutrSit21>=parseFloat(e[0])&& layer.feature.properties.ROutrSit21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderOutrasSituacoes21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderOutrasSituacoes21.noUiSlider;
    $(slidersGeral).append(sliderOutrasSituacoes21);

}

/// FIM Alojamentos Outras Situações em 2021 Concelhos

//// Alojamentos Outras Situações 2011 Concelhos //////

var minConcOutrasSituacoes11 = 0;
var maxConcOutrasSituacoes11 = 0;
function estiloOutrasSituacoes11(feature, latlng) {
    if(feature.properties.ROutrSit11< minConcOutrasSituacoes11 || minConcOutrasSituacoes11 ===0){
        minConcOutrasSituacoes11 = feature.properties.ROutrSit11
    }
    if(feature.properties.ROutrSit11> maxConcOutrasSituacoes11){
        maxConcOutrasSituacoes11 = feature.properties.ROutrSit11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ROutrSit11,0.1)
    });
}
function apagarOutrasSituacoes11(e){
    var layer = e.target;
    ConcelhoOutrasSituacoes11.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureOutrasSituacoes11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos: ' + '<b>' +feature.properties.ROutrSit11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarOutrasSituacoes11,
    })
};

var ConcelhoOutrasSituacoes11= L.geoJSON(regimeConcelhoAbsoluto,{
    pointToLayer:estiloOutrasSituacoes11,
    onEachFeature: onEachFeatureOutrasSituacoes11,
});


var slideOutrasSituacoes11 = function(){
    var sliderOutrasSituacoes11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderOutrasSituacoes11, {
        start: [minConcOutrasSituacoes11, maxConcOutrasSituacoes11],
        tooltips:true,
        connect: true,
        range: {
            'min': minConcOutrasSituacoes11,
            'max': maxConcOutrasSituacoes11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minConcOutrasSituacoes11);
    inputNumberMax.setAttribute("value",maxConcOutrasSituacoes11);

    inputNumberMin.addEventListener('change', function(){
        sliderOutrasSituacoes11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderOutrasSituacoes11.noUiSlider.set([null, this.value]);
    });

    sliderOutrasSituacoes11.noUiSlider.on('update',function(e){
        ConcelhoOutrasSituacoes11.eachLayer(function(layer){
            if(layer.feature.properties.ROutrSit11>=parseFloat(e[0])&& layer.feature.properties.ROutrSit11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderOutrasSituacoes11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderOutrasSituacoes11.noUiSlider;
    $(slidersGeral).append(sliderOutrasSituacoes11);

}

/// FIM Alojamentos Outras Situações em 2011 Concelhos

 //// FIM DADOS ABSOLUTOS

 ///// DADOS RELATIVOS
 

//// Percentagem de Alojamentos regime Proprietário em 2021 Concelhos //////




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
function CorVariacao(d) {
    return d === 300 ? '#ff5e6e' :
        d > 60  ? '#fb8290' :
        d > 40  ? '#f79fab' :
        d > 20   ? '#f7bebb' :
        d > 0  ? '#fbd5b5' :
        d > -20   ? '#ffebaf' :
        d > -40   ? '#d2ccc2' :
        d > -60  ? '#b9bccc' :
        d > -80   ? '#89a4d3' :
        d > -100   ? '#5e98cb' :
                  '#2288bf';
    }

var minPerProprietario21 = 0;
var maxPerProprietario21 = 0;

function EstiloPerProprietario21(feature) {
    if( feature.properties.PerPropr21 < minPerProprietario21 || minPerProprietario21 === 0){
        minPerProprietario21 = feature.properties.PerPropr21
    }
    if(feature.properties.PerPropr21 > maxPerProprietario21 ){
        maxPerProprietario21 = feature.properties.PerPropr21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.PerPropr21)
    };
}


function apagarPerProprietario21(e) {
    PerProprietario21.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeaturePerProprietario21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerPropr21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerProprietario21,
    });
}
var PerProprietario21= L.geoJSON(regimeConcelhoRelativos, {
    style:EstiloPerProprietario21,
    onEachFeature: onEachFeaturePerProprietario21
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
let slidePerProprietario21 = function(){
    var sliderPerProprietario21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerProprietario21, {
        start: [minPerProprietario21, maxPerProprietario21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerProprietario21,
            'max': maxPerProprietario21
        },
        });
    inputNumberMin.setAttribute("value",minPerProprietario21);
    inputNumberMax.setAttribute("value",maxPerProprietario21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerProprietario21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerProprietario21.noUiSlider.set([null, this.value]);
    });

    sliderPerProprietario21.noUiSlider.on('update',function(e){
        PerProprietario21.eachLayer(function(layer){
            if(layer.feature.properties.PerPropr21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerPropr21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerProprietario21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderPerProprietario21.noUiSlider;
    $(slidersGeral).append(sliderPerProprietario21);
} 
/// FIM Percentagem Proprietários 2021 Concelhos

//// Percentagem de Alojamentos regime Proprietário em 2011 Concelhos //////



var minPerProprietario11 = 0;
var maxPerProprietario11 = 0;

function EstiloPerProprietario11(feature) {
    if( feature.properties.PerPropr11 < minPerProprietario11 || minPerProprietario11 === 0){
        minPerProprietario11 = feature.properties.PerPropr11
    }
    if(feature.properties.PerPropr11 > maxPerProprietario11 ){
        maxPerProprietario11 = feature.properties.PerPropr11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.PerPropr11)
    };
}


function apagarPerProprietario11(e) {
    PerProprietario11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeaturePerProprietario11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerPropr11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerProprietario11,
    });
}
var PerProprietario11= L.geoJSON(regimeConcelhoRelativos, {
    style:EstiloPerProprietario11,
    onEachFeature: onEachFeaturePerProprietario11
});
let slidePerProprietario11 = function(){
    var sliderPerProprietario11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerProprietario11, {
        start: [minPerProprietario11, maxPerProprietario11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerProprietario11,
            'max': maxPerProprietario11
        },
        });
    inputNumberMin.setAttribute("value",minPerProprietario11);
    inputNumberMax.setAttribute("value",maxPerProprietario11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerProprietario11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerProprietario11.noUiSlider.set([null, this.value]);
    });

    sliderPerProprietario11.noUiSlider.on('update',function(e){
        PerProprietario11.eachLayer(function(layer){
            if(layer.feature.properties.PerPropr11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerPropr11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerProprietario11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderPerProprietario11.noUiSlider;
    $(slidersGeral).append(sliderPerProprietario11);
} 
/// FIM Percentagem Proprietários 2011 Concelhos

//// Percentagem de Alojamentos regime Arrendatario em 2021 Concelhos //////

var minPerArrendatario21 = 0;
var maxPerArrendatario21 = 0;

function EstiloPerArrendatario21(feature) {
    if( feature.properties.PerArren21 < minPerArrendatario21 || minPerArrendatario21 === 0){
        minPerArrendatario21 = feature.properties.PerArren21
    }
    if(feature.properties.PerArren21 > maxPerArrendatario21 ){
        maxPerArrendatario21 = feature.properties.PerArren21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.PerArren21)
    };
}


function apagarPerArrendatario21(e) {
    PerArrendatario21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerArrendatario21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerArren21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerArrendatario21,
    });
}
var PerArrendatario21= L.geoJSON(regimeConcelhoRelativos, {
    style:EstiloPerArrendatario21,
    onEachFeature: onEachFeaturePerArrendatario21
});
let slidePerArrendatario21 = function(){
    var sliderPerArrendatario21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerArrendatario21, {
        start: [minPerArrendatario21, maxPerArrendatario21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerArrendatario21,
            'max': maxPerArrendatario21
        },
        });
    inputNumberMin.setAttribute("value",minPerArrendatario21);
    inputNumberMax.setAttribute("value",maxPerArrendatario21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerArrendatario21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerArrendatario21.noUiSlider.set([null, this.value]);
    });

    sliderPerArrendatario21.noUiSlider.on('update',function(e){
        PerArrendatario21.eachLayer(function(layer){
            if(layer.feature.properties.PerArren21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerArren21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerArrendatario21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderPerArrendatario21.noUiSlider;
    $(slidersGeral).append(sliderPerArrendatario21);
} 
/// FIM Percentagem Arrendatários 2021 Concelhos

//// Percentagem de Alojamentos regime Arrendatario em 2011 Concelhos //////


var minPerArrendatario11 = 0;
var maxPerArrendatario11 = 0;

function EstiloPerArrendatario11(feature) {
    if( feature.properties.PerArren11 < minPerArrendatario11 || minPerArrendatario11 === 0){
        minPerArrendatario11 = feature.properties.PerArren11
    }
    if(feature.properties.PerArren11 > maxPerArrendatario11 ){
        maxPerArrendatario11 = feature.properties.PerArren11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.PerArren11)
    };
}


function apagarPerArrendatario11(e) {
    PerArrendatario11.resetStyle(e.target)
    e.target.closePopup();

} 
function onEachFeaturePerArrendatario11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerArren11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerArrendatario11,
    });
}
var PerArrendatario11= L.geoJSON(regimeConcelhoRelativos, {
    style:EstiloPerArrendatario11,
    onEachFeature: onEachFeaturePerArrendatario11
});

let slidePerArrendatario11 = function(){
    var sliderPerArrendatario11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerArrendatario11, {
        start: [minPerArrendatario11, maxPerArrendatario11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerArrendatario11,
            'max': maxPerArrendatario11
        },
        });
    inputNumberMin.setAttribute("value",minPerArrendatario11);
    inputNumberMax.setAttribute("value",maxPerArrendatario11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerArrendatario11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerArrendatario11.noUiSlider.set([null, this.value]);
    });

    sliderPerArrendatario11.noUiSlider.on('update',function(e){
        PerArrendatario11.eachLayer(function(layer){
            if(layer.feature.properties.PerArren11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerArren11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerArrendatario11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderPerArrendatario11.noUiSlider;
    $(slidersGeral).append(sliderPerArrendatario11);
} 
/// FIM Percentagem Arrendatários 2011 Concelhos

//// Percentagem de Alojamentos regime Outras situações em 2021 Concelhos //////

var minPerOutras21 = 0;
var maxPerOutras21 = 0;

function EstiloPerOutras21(feature) {
    if( feature.properties.PerOutra21 < minPerOutras21 || minPerOutras21 === 0){
        minPerOutras21 = feature.properties.PerOutra21
    }
    if(feature.properties.PerOutra21 > maxPerOutras21 ){
        maxPerOutras21 = feature.properties.PerOutra21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.PerOutra21)
    };
}


function apagarPerOutras21(e) {
    PerOutras21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerOutras21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerOutra21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerOutras21,
    });
}
var PerOutras21= L.geoJSON(regimeConcelhoRelativos, {
    style:EstiloPerOutras21,
    onEachFeature: onEachFeaturePerOutras21
});

let slidePerOutras21 = function(){
    var sliderPerOutras21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerOutras21, {
        start: [minPerOutras21, maxPerOutras21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerOutras21,
            'max': maxPerOutras21
        },
        });
    inputNumberMin.setAttribute("value",minPerOutras21);
    inputNumberMax.setAttribute("value",maxPerOutras21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerOutras21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerOutras21.noUiSlider.set([null, this.value]);
    });

    sliderPerOutras21.noUiSlider.on('update',function(e){
        PerOutras21.eachLayer(function(layer){
            if(layer.feature.properties.PerOutra21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerOutra21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerOutras21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderPerOutras21.noUiSlider;
    $(slidersGeral).append(sliderPerOutras21);
} 
/// FIM Percentagem Outras Situações 2021 Concelhos

//// Percentagem de Alojamentos regime Outras situações em 2011 Concelhos //////

var minPerOutras11 = 0;
var maxPerOutras11 = 0;

function EstiloPerOutras11(feature) {
    if( feature.properties.PerOutra11 < minPerOutras11 || minPerOutras11 === 0){
        minPerOutras11 = feature.properties.PerOutra11
    }
    if(feature.properties.PerOutra11 > maxPerOutras11 ){
        maxPerOutras11 = feature.properties.PerOutra11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.PerOutra11)
    };
}


function apagarPerOutras11(e) {
    PerOutras11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerOutras11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PerOutra11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerOutras11,
    });
}
var PerOutras11= L.geoJSON(regimeConcelhoRelativos, {
    style:EstiloPerOutras11,
    onEachFeature: onEachFeaturePerOutras11
});
let slidePerOutras11 = function(){
    var sliderPerOutras11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerOutras11, {
        start: [minPerOutras11, maxPerOutras11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerOutras11,
            'max': maxPerOutras11
        },
        });
    inputNumberMin.setAttribute("value",minPerOutras11);
    inputNumberMax.setAttribute("value",maxPerOutras11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerOutras11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerOutras11.noUiSlider.set([null, this.value]);
    });

    sliderPerOutras11.noUiSlider.on('update',function(e){
        PerOutras11.eachLayer(function(layer){
            if(layer.feature.properties.PerOutra11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerOutra11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerOutras11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderPerOutras11.noUiSlider;
    $(slidersGeral).append(sliderPerOutras11);
} 
/// FIM Percentagem Outras Situações 2011 Concelhos

//////------- Variação Do Regime Proprietário Concelhos entre 2021 e 2011 -----////


function CorVariacaoProprietarioConc(d) {

    return d === null ? '#A9A9A9':
        d === 4.34 ? '#ff7f7f' :
        d > 3.576  ? '#ff9388' :
        d > 2.812  ? '#ffa690' :
        d > 2.048  ? '#ffb999' :
        d > 1.284   ? '#ffcca1' :
        d > 0.52   ? '#ffdfaa' :
        d > -0.244  ? '#eee3b1' :
        d > -1.008   ? '#bbccb4' :
        d > -1.772   ? '#88b5b8' :
        d > -2.536 ? '#559ebc':
        d >= -3.3   ? '#2288bf' :
                  '';
    }

var minVarProprietario21_11 = 0;
var maxVarProprietario21_11 = 0;

function EstiloVarProprietario21_11(feature) {
    if(feature.properties.VarPropr21 <= minVarProprietario21_11 || minVarProprietario21_11 ===0){
        minVarProprietario21_11 = feature.properties.VarPropr21
    }
    if(feature.properties.VarPropr21 > maxVarProprietario21_11){
        maxVarProprietario21_11 = feature.properties.VarPropr21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVariacaoProprietarioConc(feature.properties.VarPropr21)};
    }


function apagarVarProprietario21_11(e) {
    VarProprietario21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarProprietario21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de Variação: ' + '<b>' + feature.properties.VarPropr21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarProprietario21_11,
    });
}
var VarProprietario21_11= L.geoJSON(regimeConcelhoRelativos, {
    style:EstiloVarProprietario21_11,
    onEachFeature: onEachFeatureVarProprietario21_11
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
    if (left < 0){
        return false
    }
    else{
        $('#grad1').append("<div id='barra'></div>");
        $('#barra').append("<div class='zero'></div>");
        $('.zero').html("0");
        $('#grad1').css("background",gradiente);
        $('#barra').css("left",left + "%")
    }
    $(legendaA).append(symbolsContainer); 

}
let slideVarProprietario21_11 = function(){
    var sliderVarProprietario21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarProprietario21_11, {
        start: [minVarProprietario21_11, maxVarProprietario21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarProprietario21_11,
            'max': maxVarProprietario21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarProprietario21_11);
    inputNumberMax.setAttribute("value",maxVarProprietario21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarProprietario21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarProprietario21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarProprietario21_11.noUiSlider.on('update',function(e){
        VarProprietario21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarPropr21>=parseFloat(e[0])&& layer.feature.properties.VarPropr21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarProprietario21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderVarProprietario21_11.noUiSlider;
    $(slidersGeral).append(sliderVarProprietario21_11);
} 

///// Fim da Variação do Regime Proprietário dos Concelhos entre 2021 e 2011 -------------- \\\\\\

//////------- Variação Do Regime Arrendatário Concelhos entre 2021 e 2011 -----////


function CorVariacaoArrendatarioConc(d) {

    return d === null ? '#A9A9A9':
        d === 29.58 ? '#ff7f7f' :
        d > 27.039  ? '#ff8a84' :
        d > 24.498  ? '#ff9589' :
        d > 21.957  ? '#ffa08e' :
        d > 19.416   ? '#ffab93' :
        d > 16.875   ? '#ffb698' :
        d > 14.334  ? '#ffc09c' :
        d > 11.793   ? '#ffcba1' :
        d > 9.252   ? '#ffd6a6' :
        d > 6.711 ? '#ffe1ab':
        d >= 4.17   ? '#ffeba0' :
                  '';
    }


var minVarArrendatario21_11 = 0;
var maxVarArrendatario21_11 = 0;

function EstiloVarArrendatario21_11(feature) {
    if(feature.properties.VarArren21 <= minVarArrendatario21_11 || minVarArrendatario21_11 ===0){
        minVarArrendatario21_11 = feature.properties.VarArren21
    }
    if(feature.properties.VarArren21 > maxVarArrendatario21_11){
        maxVarArrendatario21_11 = feature.properties.VarArren21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVariacaoArrendatarioConc(feature.properties.VarArren21)};
    }


function apagarVarArrendatario21_11(e) {
    VarArrendatario21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarArrendatario21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de Variação: ' + '<b>' + feature.properties.VarArren21 + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarArrendatario21_11,
    });
}
var VarArrendatario21_11= L.geoJSON(regimeConcelhoRelativos, {
    style:EstiloVarArrendatario21_11,
    onEachFeature: onEachFeatureVarArrendatario21_11
});
let slideVarArrendatario21_11 = function(){
    var sliderVarArrendatario21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarArrendatario21_11, {
        start: [minVarArrendatario21_11, maxVarArrendatario21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarArrendatario21_11,
            'max': maxVarArrendatario21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarArrendatario21_11);
    inputNumberMax.setAttribute("value",maxVarArrendatario21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarArrendatario21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarArrendatario21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarArrendatario21_11.noUiSlider.on('update',function(e){
        VarArrendatario21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarArren21>=parseFloat(e[0])&& layer.feature.properties.VarArren21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarArrendatario21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderVarArrendatario21_11.noUiSlider;
    $(slidersGeral).append(sliderVarArrendatario21_11);
} 

///// Fim da Variação do Regime Arrendatário dos Concelhos entre 2021 e 2011 -------------- \\\\\\

//////------- Variação Do Regime Outras Situações Concelhos entre 2021 e 2011 -----////

function CorVariacaoOutrasSituacoesConc(d) {

    return d === null ? '#A9A9A9':
        d === 27.06 ? '#FF7F7F' :
        d > 24.117  ? '#ff8b85' :
        d > 21.174  ? '#ff978a' :
        d > 18.231  ? '#ffa38f' :
        d > 15.288   ? '#ffae94' :
        d > 12.345   ? '#ffba9a' :
        d > 9.402  ? '#ffc69f' :
        d > 6.459   ? '#ffd2a4' :
        d > 3.516   ? '#ffdda9' :
        d > 0.573 ? '#ffe9a2':
        d >= -2.37   ? '#2288bf' :
                  '';
    }



var minVarOutras21_11 = 0;
var maxVarOutras21_11 = 0;

function EstiloVarOutras21_11(feature) {
    if(feature.properties.VarOutra21 <= minVarOutras21_11 || minVarOutras21_11 ===0){
        minVarOutras21_11 = feature.properties.VarOutra21
    }
    if(feature.properties.VarOutra21 > maxVarOutras21_11){
        maxVarOutras21_11 = feature.properties.VarOutra21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVariacaoOutrasSituacoesConc(feature.properties.VarOutra21)};
    }


function apagarVarOutras21_11(e) {
    VarOutras21_11.resetStyle(e.target)
    e.target.closePopup();

} 


function onEachFeatureVarOutras21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de Variação: ' + '<b>' + feature.properties.VarOutra21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarOutras21_11,
    });
}
var VarOutras21_11= L.geoJSON(regimeConcelhoRelativos, {
    style:EstiloVarOutras21_11,
    onEachFeature: onEachFeatureVarOutras21_11
});

let slideVarOutras21_11 = function(){
    var sliderVarOutras21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarOutras21_11, {
        start: [minVarOutras21_11, maxVarOutras21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarOutras21_11,
            'max': maxVarOutras21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarOutras21_11);
    inputNumberMax.setAttribute("value",maxVarOutras21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarOutras21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarOutras21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarOutras21_11.noUiSlider.on('update',function(e){
        VarOutras21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarOutra21>=parseFloat(e[0])&& layer.feature.properties.VarOutra21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarOutras21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderVarOutras21_11.noUiSlider;
    $(slidersGeral).append(sliderVarOutras21_11);
} 

///// Fim da Variação do Regime Outras situações entre 2021 e 2011 -------------- \\\\\\

///-------------------------------------------------- FIM CONCELHOS ------------------------------------///


//// -------  FREGUESIAS -  TOTAL DE ALOJAMENTOS  RESIDÊNCIA HABITUAL EM 2021 ---------- \\\\\

var minTotalRH21Freg = 0;
var maxTotalRH21Freg = 0;
function estiloTotalRH21Freg(feature, latlng) {
    if(feature.properties.Resi_Hab21< minTotalRH21Freg || minTotalRH21Freg ===0){
        minTotalRH21Freg = feature.properties.Resi_Hab21
    }
    if(feature.properties.Resi_Hab21> maxTotalRH21Freg){
        maxTotalRH21Freg = feature.properties.Resi_Hab21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Hab21,0.15)
    });
}
function apagarTotalRH21Freg(e){
    var layer = e.target;
    TotalRH21Freg.resetStyle(layer)
    layer.closePopup();
}
function onEachFeatureTotalRH21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos: ' + '<b>' + feature.properties.Resi_Hab21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalRH21Freg,
    })
};


var TotalRH21Freg = L.geoJSON(formaFreguesiasAbsolutos,{
    pointToLayer:estiloTotalRH21Freg,
    onEachFeature: onEachFeatureTotalRH21Freg,
});


var slideTotalRH21Freg = function(){
    var sliderTotalRH21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderTotalRH21Freg, {
        start: [minTotalRH21Freg, maxTotalRH21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalRH21Freg,
            'max': maxTotalRH21Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalRH21Freg);
    inputNumberMax.setAttribute("value",maxTotalRH21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalRH21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalRH21Freg.noUiSlider.set([null, this.value]);
    });

    sliderTotalRH21Freg.noUiSlider.on('update',function(e){
        TotalRH21Freg.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Hab21>=parseFloat(e[0])&& layer.feature.properties.Resi_Hab21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderTotalRH21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 33;
    sliderAtivo = sliderTotalRH21Freg.noUiSlider;
    $(slidersGeral).append(sliderTotalRH21Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS de RESIDÊNCIA HABITUAL EM 2021 POR FREGUESIA

//// -------  FREGUESIAS -  TOTAL DE ALOJAMENTOS  RESIDÊNCIA HABITUAL EM 2011 ---------- \\\\\

var minTotalRH11Freg = 0;
var maxTotalRH11Freg = 0;
function estiloTotalRH11Freg(feature, latlng) {
    if(feature.properties.Resi_Hab11< minTotalRH11Freg || minTotalRH11Freg ===0){
        minTotalRH11Freg = feature.properties.Resi_Hab11
    }
    if(feature.properties.Resi_Hab11> maxTotalRH11Freg){
        maxTotalRH11Freg = feature.properties.Resi_Hab11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Resi_Hab11,0.15)
    });
}
function apagarTotalRH11Freg(e){
    var layer = e.target;
    TotalRH11Freg.resetStyle(layer)
    layer.closePopup();
}
function onEachFeatureTotalRH11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos: ' + '<b>' + feature.properties.Resi_Hab11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalRH11Freg,
    })
};


var TotalRH11Freg = L.geoJSON(formaFreguesiasAbsolutos,{
    pointToLayer:estiloTotalRH11Freg,
    onEachFeature: onEachFeatureTotalRH11Freg,
});


var slideTotalRH11Freg = function(){
    var sliderTotalRH11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderTotalRH11Freg, {
        start: [minTotalRH11Freg, maxTotalRH11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalRH11Freg,
            'max': maxTotalRH11Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalRH11Freg);
    inputNumberMax.setAttribute("value",maxTotalRH11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalRH11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalRH11Freg.noUiSlider.set([null, this.value]);
    });

    sliderTotalRH11Freg.noUiSlider.on('update',function(e){
        TotalRH11Freg.eachLayer(function(layer){
            if(layer.feature.properties.Resi_Hab11>=parseFloat(e[0])&& layer.feature.properties.Resi_Hab11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderTotalRH11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 34;
    sliderAtivo = sliderTotalRH11Freg.noUiSlider;
    $(slidersGeral).append(sliderTotalRH11Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS de RESIDÊNCIA HABITUAL EM 2011 POR FREGUESIA


//// -------  FREGUESIAS -  TOTAL DE ALOJAMENTOS  PROPRIETÁRIOS 2021 ---------- \\\\\

var minTotalProprietario21Freg = 0;
var maxTotalProprietario21Freg = 0;
function estiloTotalProprietario21Freg(feature, latlng) {
    if(feature.properties.F_REG_PR21< minTotalProprietario21Freg || minTotalProprietario21Freg ===0){
        minTotalProprietario21Freg = feature.properties.F_REG_PR21
    }
    if(feature.properties.F_REG_PR21> maxTotalProprietario21Freg){
        maxTotalProprietario21Freg = feature.properties.F_REG_PR21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_REG_PR21,0.15)
    });
}
function apagarTotalProprietario21Freg(e){
    var layer = e.target;
    TotalProprietario21Freg.resetStyle(layer)
    layer.closePopup();
}
function onEachFeatureTotalProprietario21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos: ' + '<b>' + feature.properties.F_REG_PR21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalProprietario21Freg,
    })
};


var TotalProprietario21Freg = L.geoJSON(freguesiaAbsolutos,{
    pointToLayer:estiloTotalProprietario21Freg,
    onEachFeature: onEachFeatureTotalProprietario21Freg,
});


var slideTotalProprietario21Freg = function(){
    var sliderTotalProprietario21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderTotalProprietario21Freg, {
        start: [minTotalProprietario21Freg, maxTotalProprietario21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalProprietario21Freg,
            'max': maxTotalProprietario21Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalProprietario21Freg);
    inputNumberMax.setAttribute("value",maxTotalProprietario21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalProprietario21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalProprietario21Freg.noUiSlider.set([null, this.value]);
    });

    sliderTotalProprietario21Freg.noUiSlider.on('update',function(e){
        TotalProprietario21Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_REG_PR21>=parseFloat(e[0])&& layer.feature.properties.F_REG_PR21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderTotalProprietario21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 18;
    sliderAtivo = sliderTotalProprietario21Freg.noUiSlider;
    $(slidersGeral).append(sliderTotalProprietario21Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS Proprietários EM 2021 POR FREGUESIA

//// -------   TOTAL DE ALOJAMENTOS  PROPRIETÁRIOS 2011 ---------- \\\\\

var minTotalProprietario11Freg = 0;
var maxTotalProprietario11Freg = 0;
function estiloTotalProprietario11Freg(feature, latlng) {
    if(feature.properties.F_REG_PR11< minTotalProprietario11Freg || minTotalProprietario11Freg ===0){
        minTotalProprietario11Freg = feature.properties.F_REG_PR11
    }
    if(feature.properties.F_REG_PR11> maxTotalProprietario11Freg){
        maxTotalProprietario11Freg = feature.properties.F_REG_PR11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_REG_PR11,0.15)
    });
}
function apagarTotalProprietario11Freg(e){
    var layer = e.target;
    TotalProprietario11Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalProprietario11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos: ' + '<b>' + feature.properties.F_REG_PR11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalProprietario11Freg,
    })
};


var TotalProprietario11Freg = L.geoJSON(freguesiaAbsolutos,{
    pointToLayer:estiloTotalProprietario11Freg,
    onEachFeature: onEachFeatureTotalProprietario11Freg,
});


var slideTotalProprietario11Freg = function(){
    var sliderTotalProprietario11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderTotalProprietario11Freg, {
        start: [minTotalProprietario11Freg, maxTotalProprietario11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalProprietario11Freg,
            'max': maxTotalProprietario11Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalProprietario11Freg);
    inputNumberMax.setAttribute("value",maxTotalProprietario11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalProprietario11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalProprietario11Freg.noUiSlider.set([null, this.value]);
    });

    sliderTotalProprietario11Freg.noUiSlider.on('update',function(e){
        TotalProprietario11Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_REG_PR11>=parseFloat(e[0])&& layer.feature.properties.F_REG_PR11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderTotalProprietario11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 19;
    sliderAtivo = sliderTotalProprietario11Freg.noUiSlider;
    $(slidersGeral).append(sliderTotalProprietario11Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS Proprietários EM 2011 POR FREGUESIA

//// -------   TOTAL DE ALOJAMENTOS ARRENDATÁRIOS 2021 ---------- \\\\\

var minTotalArrendatario21Freg = 0;
var maxTotalArrendatario21Freg = 0;
function estiloTotalArrendatario21Freg(feature, latlng) {
    if(feature.properties.F_REG_AR21< minTotalArrendatario21Freg || minTotalArrendatario21Freg ===0){
        minTotalArrendatario21Freg = feature.properties.F_REG_AR21
    }
    if(feature.properties.F_REG_AR21> maxTotalArrendatario21Freg){
        maxTotalArrendatario21Freg = feature.properties.F_REG_AR21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_REG_AR21,0.15)
    });
}
function apagarTotalArrendatario21Freg(e){
    var layer = e.target;
    TotalArrendatario21Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalArrendatario21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos: ' + '<b>' + feature.properties.F_REG_AR21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalArrendatario21Freg,
    })
};


var TotalArrendatario21Freg = L.geoJSON(freguesiaAbsolutos,{
    pointToLayer:estiloTotalArrendatario21Freg,
    onEachFeature: onEachFeatureTotalArrendatario21Freg,
});


var slideTotalArrendatario21Freg = function(){
    var sliderTotalArrendatario21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderTotalArrendatario21Freg, {
        start: [minTotalArrendatario21Freg, maxTotalArrendatario21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalArrendatario21Freg,
            'max': maxTotalArrendatario21Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalArrendatario21Freg);
    inputNumberMax.setAttribute("value",maxTotalArrendatario21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalArrendatario21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalArrendatario21Freg.noUiSlider.set([null, this.value]);
    });

    sliderTotalArrendatario21Freg.noUiSlider.on('update',function(e){
        TotalArrendatario21Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_REG_AR21>=parseFloat(e[0])&& layer.feature.properties.F_REG_AR21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderTotalArrendatario21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 20;
    sliderAtivo = sliderTotalArrendatario21Freg.noUiSlider;
    $(slidersGeral).append(sliderTotalArrendatario21Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS Arrendatários EM 2021 POR FREGUESIA

//// -------   TOTAL DE ALOJAMENTOS ARRENDATÁRIOS 2011 ---------- \\\\\

var minTotalArrendatario11Freg = 0;
var maxTotalArrendatario11Freg = 0;
function estiloTotalArrendatario11Freg(feature, latlng) {
    if(feature.properties.F_REG_AR11< minTotalArrendatario11Freg || minTotalArrendatario11Freg ===0){
        minTotalArrendatario11Freg = feature.properties.F_REG_AR11
    }
    if(feature.properties.F_REG_AR11> maxTotalArrendatario11Freg){
        maxTotalArrendatario11Freg = feature.properties.F_REG_AR11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_REG_AR11,0.15)
    });
}
function apagarTotalArrendatario11Freg(e){
    var layer = e.target;
    TotalArrendatario11Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalArrendatario11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos: ' + '<b>' + feature.properties.F_REG_AR11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalArrendatario11Freg,
    })
};


var TotalArrendatario11Freg = L.geoJSON(freguesiaAbsolutos,{
    pointToLayer:estiloTotalArrendatario11Freg,
    onEachFeature: onEachFeatureTotalArrendatario11Freg,
});


var slideTotalArrendatario11Freg = function(){
    var sliderTotalArrendatario11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderTotalArrendatario11Freg, {
        start: [minTotalArrendatario11Freg, maxTotalArrendatario11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalArrendatario11Freg,
            'max': maxTotalArrendatario11Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalArrendatario11Freg);
    inputNumberMax.setAttribute("value",maxTotalArrendatario11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalArrendatario11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalArrendatario11Freg.noUiSlider.set([null, this.value]);
    });

    sliderTotalArrendatario11Freg.noUiSlider.on('update',function(e){
        TotalArrendatario11Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_REG_AR11>=parseFloat(e[0])&& layer.feature.properties.F_REG_AR11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderTotalArrendatario11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 21;
    sliderAtivo = sliderTotalArrendatario11Freg.noUiSlider;
    $(slidersGeral).append(sliderTotalArrendatario11Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS Arrendatários EM 2011 POR FREGUESIA


//// -------   TOTAL DE ALOJAMENTOS OUTRAS SITUAÇÕES 2021 ---------- \\\\\

var minTotalOutras21Freg = 0;
var maxTotalOutras21Freg = 0;
function estiloTotalOutras21Freg(feature, latlng) {
    if(feature.properties.F_REG_OS21< minTotalOutras21Freg || minTotalOutras21Freg ===0){
        minTotalOutras21Freg = feature.properties.F_REG_OS21
    }
    if(feature.properties.F_REG_OS21> maxTotalOutras21Freg){
        maxTotalOutras21Freg = feature.properties.F_REG_OS21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_REG_OS21,0.15)
    });
}
function apagarTotalOutras21Freg(e){
    var layer = e.target;
    TotalOutras21Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalOutras21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos: ' + '<b>' + feature.properties.F_REG_OS21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalOutras21Freg,
    })
};


var TotalOutras21Freg = L.geoJSON(freguesiaAbsolutos,{
    pointToLayer:estiloTotalOutras21Freg,
    onEachFeature: onEachFeatureTotalOutras21Freg,
});


var slideTotalOutras21Freg = function(){
    var sliderTotalOutras21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderTotalOutras21Freg, {
        start: [minTotalOutras21Freg, maxTotalOutras21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalOutras21Freg,
            'max': maxTotalOutras21Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalOutras21Freg);
    inputNumberMax.setAttribute("value",maxTotalOutras21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalOutras21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalOutras21Freg.noUiSlider.set([null, this.value]);
    });

    sliderTotalOutras21Freg.noUiSlider.on('update',function(e){
        TotalOutras21Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_REG_OS21>=parseFloat(e[0])&& layer.feature.properties.F_REG_OS21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderTotalOutras21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 22;
    sliderAtivo = sliderTotalOutras21Freg.noUiSlider;
    $(slidersGeral).append(sliderTotalOutras21Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS Outras situações EM 2021 POR FREGUESIA

//// -------   TOTAL DE ALOJAMENTOS OUTRAS SITUAÇÕES 2011 ---------- \\\\\

var minTotalOutras11Freg = 0;
var maxTotalOutras11Freg = 0;
function estiloTotalOutras11Freg(feature, latlng) {
    if(feature.properties.F_REG_OS11< minTotalOutras11Freg || minTotalOutras11Freg ===0){
        minTotalOutras11Freg = feature.properties.F_REG_OS11
    }
    if(feature.properties.F_REG_OS11> maxTotalOutras11Freg){
        maxTotalOutras11Freg = feature.properties.F_REG_OS11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_REG_OS11,0.15)
    });
}
function apagarTotalOutras11Freg(e){
    var layer = e.target;
    TotalOutras11Freg.resetStyle(layer)
    layer.closePopup();
}

function onEachFeatureTotalOutras11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos: ' + '<b>' + feature.properties.F_REG_OS11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalOutras11Freg,
    })
};


var TotalOutras11Freg = L.geoJSON(freguesiaAbsolutos,{
    pointToLayer:estiloTotalOutras11Freg,
    onEachFeature: onEachFeatureTotalOutras11Freg,
});


var slideTotalOutras11Freg = function(){
    var sliderTotalOutras11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderTotalOutras11Freg, {
        start: [minTotalOutras11Freg, maxTotalOutras11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalOutras11Freg,
            'max': maxTotalOutras11Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalOutras11Freg);
    inputNumberMax.setAttribute("value",maxTotalOutras11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalOutras11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalOutras11Freg.noUiSlider.set([null, this.value]);
    });

    sliderTotalOutras11Freg.noUiSlider.on('update',function(e){
        TotalOutras11Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_REG_OS11>=parseFloat(e[0])&& layer.feature.properties.F_REG_OS11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderTotalOutras11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 23;
    sliderAtivo = sliderTotalOutras11Freg.noUiSlider;
    $(slidersGeral).append(sliderTotalOutras11Freg);
}
///////// ------------ FIM TOTAL DE ALOJAMENTOS Outras situações EM 2011 POR FREGUESIA

//// Percentagem de Alojamentos regime Proprietário em 2021 Freguesias //////


var minPerProprietario21Freg = 0;
var maxPerProprietario21Freg = 0;

function EstiloPerProprietario21Freg(feature) {
    if( feature.properties.F_PER_PR21 < minPerProprietario21Freg || minPerProprietario21Freg === 0){
        minPerProprietario21Freg = feature.properties.F_PER_PR21
    }
    if(feature.properties.F_PER_PR21 > maxPerProprietario21Freg ){
        maxPerProprietario21Freg = feature.properties.F_PER_PR21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.F_PER_PR21)
    };
}


function apagarPerProprietario21Freg(e) {
    PerProprietario21Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerProprietario21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.F_PER_PR21.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerProprietario21Freg,
    });
}
var PerProprietario21Freg= L.geoJSON(freguesiasRelativos, {
    style:EstiloPerProprietario21Freg,
    onEachFeature: onEachFeaturePerProprietario21Freg
});

let slidePerProprietario21Freg = function(){
    var sliderPerProprietario21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerProprietario21Freg, {
        start: [minPerProprietario21Freg, maxPerProprietario21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerProprietario21Freg,
            'max': maxPerProprietario21Freg
        },
        });
    inputNumberMin.setAttribute("value",minPerProprietario21Freg);
    inputNumberMax.setAttribute("value",maxPerProprietario21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPerProprietario21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerProprietario21Freg.noUiSlider.set([null, this.value]);
    });

    sliderPerProprietario21Freg.noUiSlider.on('update',function(e){
        PerProprietario21Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_PER_PR21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F_PER_PR21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerProprietario21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderPerProprietario21Freg.noUiSlider;
    $(slidersGeral).append(sliderPerProprietario21Freg);
} 
/// FIM Percentagem Proprietários 2021 Freguesias

//// Percentagem de Alojamentos regime Proprietário em 2011 Freguesias //////


var minPerProprietario11Freg = 0;
var maxPerProprietario11Freg = 0;

function EstiloPerProprietario11Freg(feature) {
    if( feature.properties.F_PER_PR11 < minPerProprietario11Freg || minPerProprietario11Freg === 0){
        minPerProprietario11Freg = feature.properties.F_PER_PR11
    }
    if(feature.properties.F_PER_PR11 > maxPerProprietario11Freg ){
        maxPerProprietario11Freg = feature.properties.F_PER_PR11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.F_PER_PR11)
    };
}


function apagarPerProprietario11Freg(e) {
    PerProprietario11Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerProprietario11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.F_PER_PR11.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerProprietario11Freg,
    });
}
var PerProprietario11Freg= L.geoJSON(freguesiasRelativos, {
    style:EstiloPerProprietario11Freg,
    onEachFeature: onEachFeaturePerProprietario11Freg
});

let slidePerProprietario11Freg = function(){
    var sliderPerProprietario11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerProprietario11Freg, {
        start: [minPerProprietario11Freg, maxPerProprietario11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerProprietario11Freg,
            'max': maxPerProprietario11Freg
        },
        });
    inputNumberMin.setAttribute("value",minPerProprietario11Freg);
    inputNumberMax.setAttribute("value",maxPerProprietario11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPerProprietario11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerProprietario11Freg.noUiSlider.set([null, this.value]);
    });

    sliderPerProprietario11Freg.noUiSlider.on('update',function(e){
        PerProprietario11Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_PER_PR11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F_PER_PR11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerProprietario11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderPerProprietario11Freg.noUiSlider;
    $(slidersGeral).append(sliderPerProprietario11Freg);
} 
/// FIM Percentagem Proprietários 2011 Freguesias


//// Percentagem de Alojamentos regime arrendatário e subarrendatário em 2021 Freguesias //////

var minPerArrendatario21Freg = 0;
var maxPerArrendatario21Freg = 0;

function EstiloPerArrendatario21Freg(feature) {
    if( feature.properties.F_PER_AR21 < minPerArrendatario21Freg || minPerArrendatario21Freg === 0){
        minPerArrendatario21Freg = feature.properties.F_PER_AR21
    }
    if(feature.properties.F_PER_AR21 > maxPerArrendatario21Freg ){
        maxPerArrendatario21Freg = feature.properties.F_PER_AR21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.F_PER_AR21)
    };
}


function apagarPerArrendatario21Freg(e) {
    PerArrendatario21Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerArrendatario21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.F_PER_PR11.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerArrendatario21Freg,
    });
}
var PerArrendatario21Freg= L.geoJSON(freguesiasRelativos, {
    style:EstiloPerArrendatario21Freg,
    onEachFeature: onEachFeaturePerArrendatario21Freg
});

let slidePerArrendatario21Freg = function(){
    var sliderPerArrendatario21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerArrendatario21Freg, {
        start: [minPerArrendatario21Freg, maxPerArrendatario21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerArrendatario21Freg,
            'max': maxPerArrendatario21Freg
        },
        });
    inputNumberMin.setAttribute("value",minPerArrendatario21Freg);
    inputNumberMax.setAttribute("value",maxPerArrendatario21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPerArrendatario21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerArrendatario21Freg.noUiSlider.set([null, this.value]);
    });

    sliderPerArrendatario21Freg.noUiSlider.on('update',function(e){
        PerArrendatario21Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_PER_AR21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F_PER_AR21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerArrendatario21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderPerArrendatario21Freg.noUiSlider;
    $(slidersGeral).append(sliderPerArrendatario21Freg);
} 
/// FIM Percentagem Arrendatários 2021 Freguesias

//// Percentagem de Alojamentos regime arrendatário e subarrendatário em 2011 Freguesias //////

var minPerArrendatario11Freg = 0;
var maxPerArrendatario11Freg = 0;

function EstiloPerArrendatario11Freg(feature) {
    if( feature.properties.F_PER_AR11 < minPerArrendatario11Freg || minPerArrendatario11Freg === 0){
        minPerArrendatario11Freg = feature.properties.F_PER_AR11
    }
    if(feature.properties.F_PER_AR11 > maxPerArrendatario11Freg ){
        maxPerArrendatario11Freg = feature.properties.F_PER_AR11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.F_PER_AR11)
    };
}


function apagarPerArrendatario11Freg(e) {
    PerArrendatario11Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerArrendatario11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.F_PER_AR11.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerArrendatario11Freg,
    });
}
var PerArrendatario11Freg= L.geoJSON(freguesiasRelativos, {
    style:EstiloPerArrendatario11Freg,
    onEachFeature: onEachFeaturePerArrendatario11Freg
});

let slidePerArrendatario11Freg = function(){
    var sliderPerArrendatario11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerArrendatario11Freg, {
        start: [minPerArrendatario11Freg, maxPerArrendatario11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerArrendatario11Freg,
            'max': maxPerArrendatario11Freg
        },
        });
    inputNumberMin.setAttribute("value",minPerArrendatario11Freg);
    inputNumberMax.setAttribute("value",maxPerArrendatario11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPerArrendatario11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerArrendatario11Freg.noUiSlider.set([null, this.value]);
    });

    sliderPerArrendatario11Freg.noUiSlider.on('update',function(e){
        PerArrendatario11Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_PER_AR11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F_PER_AR11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerArrendatario11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderPerArrendatario11Freg.noUiSlider;
    $(slidersGeral).append(sliderPerArrendatario11Freg);
} 
/// FIM Percentagem Arrendatários 2011 Freguesias

//// Percentagem de Alojamentos regime Outras situações em 2021 Freguesias //////

var minPerOutras21Freg = 0;
var maxPerOutras21Freg = 0;

function EstiloPerOutras21Freg(feature) {
    if( feature.properties.F_PER_OS21 < minPerOutras21Freg || minPerOutras21Freg === 0){
        minPerOutras21Freg = feature.properties.F_PER_OS21
    }
    if(feature.properties.F_PER_OS21 > maxPerOutras21Freg ){
        maxPerOutras21Freg = feature.properties.F_PER_OS21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.F_PER_OS21)
    };
}


function apagarPerOutras21Freg(e) {
    PerOutras21Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerOutras21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.F_PER_OS21.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerOutras21Freg,
    });
}
var PerOutras21Freg= L.geoJSON(freguesiasRelativos, {
    style:EstiloPerOutras21Freg,
    onEachFeature: onEachFeaturePerOutras21Freg
});

let slidePerOutras21Freg = function(){
    var sliderPerOutras21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerOutras21Freg, {
        start: [minPerOutras21Freg, maxPerOutras21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerOutras21Freg,
            'max': maxPerOutras21Freg
        },
        });
    inputNumberMin.setAttribute("value",minPerOutras21Freg);
    inputNumberMax.setAttribute("value",maxPerOutras21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPerOutras21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerOutras21Freg.noUiSlider.set([null, this.value]);
    });

    sliderPerOutras21Freg.noUiSlider.on('update',function(e){
        PerOutras21Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_PER_OS21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F_PER_OS21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerOutras21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderPerOutras21Freg.noUiSlider;
    $(slidersGeral).append(sliderPerOutras21Freg);
} 
/// FIM Percentagem Outras Situações 2021 Freguesias

//// Percentagem de Alojamentos regime Outras situações em 2011 Freguesias //////


var minPerOutras11Freg = 0;
var maxPerOutras11Freg = 0;

function EstiloPerOutras11Freg(feature) {
    if( feature.properties.F_PER_OS11 < minPerOutras11Freg || minPerOutras11Freg === 0){
        minPerOutras11Freg = feature.properties.F_PER_OS11
    }
    if(feature.properties.F_PER_OS11 > maxPerOutras11Freg ){
        maxPerOutras11Freg = feature.properties.F_PER_OS11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorPercentagem(feature.properties.F_PER_OS11)
    };
}


function apagarPerOutras11Freg(e) {
    PerOutras11Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerOutras11Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.F_PER_OS11.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerOutras11Freg,
    });
}
var PerOutras11Freg= L.geoJSON(freguesiasRelativos, {
    style:EstiloPerOutras11Freg,
    onEachFeature: onEachFeaturePerOutras11Freg
});

let slidePerOutras11Freg = function(){
    var sliderPerOutras11Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerOutras11Freg, {
        start: [minPerOutras11Freg, maxPerOutras11Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerOutras11Freg,
            'max': maxPerOutras11Freg
        },
        });
    inputNumberMin.setAttribute("value",minPerOutras11Freg);
    inputNumberMax.setAttribute("value",maxPerOutras11Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPerOutras11Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerOutras11Freg.noUiSlider.set([null, this.value]);
    });

    sliderPerOutras11Freg.noUiSlider.on('update',function(e){
        PerOutras11Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_PER_OS11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F_PER_OS11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerOutras11Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderPerOutras11Freg.noUiSlider;
    $(slidersGeral).append(sliderPerOutras11Freg);
} 
/// FIM Percentagem Outras Situações 2011 Freguesias


//// Variação REGIME PROPRIETÁRIO entre 2021 e 2011 Freguesias //////

function CorVariacaoProprietario21Freguesia(d) {

    return d === null ? '#A9A9A9':
        d === 15.33 ? '#FF7F7F' :
        d > 11.849  ? '#ff988a' :
        d > 8.368  ? '#ffb195' :
        d > 4.887  ? '#ffc9a0' :
        d > 1.406   ? '#ffe2ab' :
        d > -2.075   ? '#e7e0b1' :
        d > -5.556  ? '#bfceb4' :
        d > -9.037   ? '#98bdb7' :
        d > -12.518   ? '#70abba' :
        d > -15.99 ? '#4999bd':
        d >= -19.48   ? '#2288bf' :
                  '';
    }

var minVarProprietario21Freg = 0;
var maxVarProprietario21Freg = 0;

function EstiloVarProprietario21Freg(feature) {
    if( feature.properties.F_VarPro21 < minVarProprietario21Freg || minVarProprietario21Freg === 0){
        minVarProprietario21Freg = feature.properties.F_VarPro21
    }
    if(feature.properties.F_VarPro21 > maxVarProprietario21Freg ){
        maxVarProprietario21Freg = feature.properties.F_VarPro21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacaoProprietario21Freguesia(feature.properties.F_VarPro21)
    };
}

function apagarVarProprietario21Freg(e) {
    VarProprietario21Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarProprietario21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.F_VarPro21.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarProprietario21Freg,
    });
}
var VarProprietario21Freg= L.geoJSON(freguesiasRelativos, {
    style:EstiloVarProprietario21Freg,
    onEachFeature: onEachFeatureVarProprietario21Freg
});

let slideVarProprietario21Freg = function(){
    var sliderVarProprietario21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarProprietario21Freg, {
        start: [minVarProprietario21Freg, maxVarProprietario21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarProprietario21Freg,
            'max': maxVarProprietario21Freg
        },
        });
    inputNumberMin.setAttribute("value",minVarProprietario21Freg);
    inputNumberMax.setAttribute("value",maxVarProprietario21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVarProprietario21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarProprietario21Freg.noUiSlider.set([null, this.value]);
    });

    sliderVarProprietario21Freg.noUiSlider.on('update',function(e){
        VarProprietario21Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_VarPro21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F_VarPro21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarProprietario21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderVarProprietario21Freg.noUiSlider;
    $(slidersGeral).append(sliderVarProprietario21Freg);
} 
/// FIM Variação Regime Proprietário entre 2021 e 2011 Freguesia

//// Variação REGIME Arrendatário entre 2021 e 2011 Freguesias //////

function CorVariacaoArrendatario21Freguesia(d) {

    return d === null ? '#A9A9A9':
        d >= 100 ? '#FF7F7F' :
        d >= 87.356  ? '#ff8b85' :
        d >= 74.712  ? '#ff978a' :
        d >= 62.068  ? '#ffa38f' :
        d >= 49.424   ? '#ffaf94' :
        d >= 36.78   ? '#ffba9a' :
        d >= 24.136  ? '#ffc69f' :
        d >= 11.492   ? '#ffd2a4' :
        d >= -1.152   ? '#ffdea9' :
        d >= -13.796 ? '#ffe9af':
        d >= -26.44   ? '#2288bf' :
                  '';
    }

var minVarArrendatario21Freg = 0;
var maxVarArrendatario21Freg = 0;

function EstiloVarArrendatario21Freg(feature) {
    if( feature.properties.F_VarArr21 < minVarArrendatario21Freg || minVarArrendatario21Freg === 0){
        minVarArrendatario21Freg = feature.properties.F_VarArr21
    }
    if(feature.properties.F_VarArr21 > maxVarArrendatario21Freg ){
        maxVarArrendatario21Freg = feature.properties.F_VarArr21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVariacaoArrendatario21Freguesia(feature.properties.F_VarArr21)
    };
}

function apagarVarArrendatario21Freg(e) {
    VarArrendatario21Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarArrendatario21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.F_VarArr21.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarArrendatario21Freg,
    });
}
var VarArrendatario21Freg= L.geoJSON(freguesiasRelativos, {
    style:EstiloVarArrendatario21Freg,
    onEachFeature: onEachFeatureVarArrendatario21Freg
});
let slideVarArrendatario21Freg = function(){
    var sliderVarArrendatario21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarArrendatario21Freg, {
        start: [minVarArrendatario21Freg, maxVarArrendatario21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarArrendatario21Freg,
            'max': maxVarArrendatario21Freg
        },
        });
    inputNumberMin.setAttribute("value",minVarArrendatario21Freg);
    inputNumberMax.setAttribute("value",maxVarArrendatario21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVarArrendatario21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarArrendatario21Freg.noUiSlider.set([null, this.value]);
    });

    sliderVarArrendatario21Freg.noUiSlider.on('update',function(e){
        VarArrendatario21Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_VarArr21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F_VarArr21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarArrendatario21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderVarArrendatario21Freg.noUiSlider;
    $(slidersGeral).append(sliderVarArrendatario21Freg);
} 
/// FIM Variação Regime Arrendatário entre 2021 e 2011 Freguesia

//// Variação REGIME Outras Situaçõesentre 2021 e 2011 Freguesias //////


function CorVarOutras21Freg(d) {

    return d === null ? '#A9A9A9':
        d === 83.72 ? '#FF7F7F' :
        d > 66.459  ? '#ff9689' :
        d > 49.198  ? '#ffac93' :
        d > 31.937  ? '#ffc29d' :
        d > 14.676   ? '#ffd9a7' :
        d > -2.585   ? '#f8e8b0' :
        d > -19.846  ? '#cdd4b3' :
        d > -37.107   ? '#a2c1b6' :
        d > -54.368   ? '#77aeb9' :
        d > -71.629 ? '#4c9bbc':
        d >= -88.89   ? '#2288bf' :
                  '';
    }

var minVarOutras21Freg = 0;
var maxVarOutras21Freg = 0;

function EstiloVarOutras21Freg(feature) {
    if( feature.properties.F_VarOut21 < minVarOutras21Freg || minVarOutras21Freg === 0){
        minVarOutras21Freg = feature.properties.F_VarOut21
    }
    if(feature.properties.F_VarOut21 > maxVarOutras21Freg ){
        maxVarOutras21Freg = feature.properties.F_VarOut21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 1,
        fillColor: CorVarOutras21Freg(feature.properties.F_VarOut21)
    };
}

function apagarVarOutras21Freg(e) {
    VarOutras21Freg.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarOutras21Freg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.F_VarOut21.toFixed(2) + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarOutras21Freg,
    });
}
var VarOutras21Freg= L.geoJSON(freguesiasRelativos, {
    style:EstiloVarOutras21Freg,
    onEachFeature: onEachFeatureVarOutras21Freg
});
var legendaVarOutras21Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Variação de Alojamentos de regime outras situações entre 2021 e 2011'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    // symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 20 - 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 10 - 17.2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 7 - 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' 3 - 7' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' 0 - 3' + '<br>'



    $(legendaA).append(symbolsContainer); 
}
let slideVarOutras21Freg = function(){
    var sliderVarOutras21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarOutras21Freg, {
        start: [minVarOutras21Freg, maxVarOutras21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarOutras21Freg,
            'max': maxVarOutras21Freg
        },
        });
    inputNumberMin.setAttribute("value",minVarOutras21Freg);
    inputNumberMax.setAttribute("value",maxVarOutras21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVarOutras21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarOutras21Freg.noUiSlider.set([null, this.value]);
    });

    sliderVarOutras21Freg.noUiSlider.on('update',function(e){
        VarOutras21Freg.eachLayer(function(layer){
            if(layer.feature.properties.F_VarOut21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F_VarOut21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarOutras21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderVarOutras21Freg.noUiSlider;
    $(slidersGeral).append(sliderVarOutras21Freg);
}

//// FIM VARIAÇÃO DE REGIME OUTRAS SITUAÇÕES ENTRE 2021 E 2011





////Ao abrir página aparecer logo a fonte e legenda
var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Recenseamento da população e habitação';


/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = TotAlojRH21;
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
    if (layer == TotAlojRH21 && naoDuplicar != 1){
        legenda('Número de Alojamentos de Residência Habitual em 2021',maxTotAlojRH21, ((maxTotAlojRH21-minTotAlojRH21)/2).toFixed(0),minTotAlojRH21,0.1);
        contorno.addTo(map)
        slideTotAlojRH21();
        baseAtiva = contorno;
        naoDuplicar = 1;
    }
    if (layer == TotAlojRH21 && naoDuplicar == 1){
        contorno.addTo(map);
    }
    if (layer == ConcelhoTotAlojRH11 && naoDuplicar != 17){
        legenda('Número de Alojamentos de Residência Habitual em 2011',maxTotAlojRH11,Math.round((maxTotAlojRH11-minTotAlojRH11)/2),minTotAlojRH11,0.1);
        contorno.addTo(map)
        slideTotAlojRH11();
        naoDuplicar = 17;
    }
    if (layer == ConcelhoProprietario21 && naoDuplicar != 2){
        legenda('Número de Alojamentos de regime proprietário ou coproprietário em 2021',max,Math.round((max-min)/2),min,0.1);
        contorno.addTo(map)
        slideProprietario21();
        naoDuplicar = 2;
    }
    if (layer == ConcelhoProprietario11 && naoDuplicar != 3){
        legenda('Número de Alojamentos de regime proprietário ou coproprietário em 2011',maxConcProprietario11,Math.round((maxConcProprietario11-minConcProprietario11)/2),minConcProprietario11,0.1);
        contorno.addTo(map)
        slideProprietario11();
        naoDuplicar = 3;
    }
    if (layer == ConcelhoArrendatario21 && naoDuplicar != 4){
        legenda('Número de Alojamentos de regime Arrendatario ou subArrendatario em 2021',maxConcArrendatario21,Math.round((maxConcArrendatario21-minConcArrendatario21)/2),minConcArrendatario21,0.1);
        contorno.addTo(map)
        slideArrendatario21();
        naoDuplicar = 4;
    }
    if (layer == ConcelhoArrendatario11 && naoDuplicar != 5){
        legenda('Número de Alojamentos de regime Arrendatario ou subArrendatario em 2011',maxConcArrendatario11,Math.round((maxConcArrendatario11-minConcArrendatario11)/2),minConcArrendatario11,0.1);
        contorno.addTo(map)
        slideArrendatario11();
        naoDuplicar = 5;
    }
    if (layer == ConcelhoOutrasSituacoes21 && naoDuplicar != 6){
        legenda('Número de Alojamentos de regime outras situações em 2021',maxConcOutrasSituacoes21,Math.round((maxConcOutrasSituacoes21-minConcOutrasSituacoes21)/2),minConcOutrasSituacoes21,0.1);
        contorno.addTo(map)
        slideOutrasSituacoes21();
        naoDuplicar = 6;
    }
    if (layer == ConcelhoOutrasSituacoes11 && naoDuplicar != 7){
        legenda('Número de Alojamentos de regime outras situações em 2011',maxConcOutrasSituacoes11,Math.round((maxConcOutrasSituacoes11-minConcOutrasSituacoes11)/2),minConcOutrasSituacoes11,0.1);
        contorno.addTo(map)
        slideOutrasSituacoes11();
        naoDuplicar = 7;
    }
    if (layer == PerProprietario21 && naoDuplicar != 8){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em regime proprietário ou coproprietário em 2021');
        slidePerProprietario21();
        naoDuplicar = 8;
    }
    if (layer == PerProprietario11 && naoDuplicar != 9){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em regime proprietário ou coproprietário em 2011');
        slidePerProprietario11();
        naoDuplicar = 9;
    }
    if (layer == PerArrendatario21 && naoDuplicar != 10){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em regime arrendatário ou subarrendatário em 2021');
        slidePerArrendatario21();
        naoDuplicar = 10;
    }
    if (layer == PerArrendatario11 && naoDuplicar != 11){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em regime arrendatário ou subarrendatário em 2011');
        slidePerArrendatario11();
        naoDuplicar = 11;
    }
    if (layer == PerOutras21 && naoDuplicar != 12){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em regime de outras situações em 2021');
        slidePerOutras21();
        naoDuplicar = 12;
    }
    if (layer == PerOutras11 && naoDuplicar != 13){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em regime de outras situações em 2021');
        slidePerOutras11();
        naoDuplicar = 13;
    }
    if (layer == VarProprietario21_11 && naoDuplicar != 14){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Secundária em regime proprietário ou cooproprietário entre 2021 e 2011', minVarProprietario21_11,maxVarProprietario21_11,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(85,158,188,1) 10%, rgba(136,181,184,1) 20%, rgba(187,204,180,1) 30%, rgba(238,227,177,1) 40%, rgba(255,223,170,1) 50%, rgba(255,204,161,1) 60%, rgba(255,185,153,1) 70%, rgba(255,166,144,1) 80%, rgba(255,147,136,1) 90%, rgba(255,127,127,1) 100%");
        slideVarProprietario21_11();
        naoDuplicar = 14;
    }
    if (layer == VarArrendatario21_11 && naoDuplicar != 15){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Secundária em regime arrendatário ou subarrendatário entre 2021 e 2011', minVarArrendatario21_11,maxVarArrendatario21_11," linear-gradient(90deg, rgba(255,235,160,1) 0%, rgba(255,225,171,1) 10%, rgba(255,214,166,1) 20%, rgba(255,203,161,1) 30%, rgba(255,192,156,1) 40%, rgba(255,182,152,1) 50%, rgba(255,171,147,1) 60%, rgba(255,160,142,1) 70%, rgba(255,149,137,1) 80%, rgba(255,138,132,1) 90%, rgba(255,127,127,1) 100%");
        slideVarArrendatario21_11();
        naoDuplicar = 15;
    }
    if (layer == VarOutras21_11 && naoDuplicar != 16){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Secundária em outras situações entre 2021 e 2011', minVarOutras21_11,maxVarOutras21_11,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(255,233,162,1) 10%, rgba(255,221,169,1) 20%, rgba(255,210,164,1) 30%, rgba(255,198,159,1) 40%, rgba(255,186,154,1) 50%, rgba(255,174,148,1) 60%, rgba(255,163,143,1) 70%, rgba(255,151,138,1) 80%, rgba(255,139,133,1) 90%, rgba(255,127,127,1) 100%");
        slideVarOutras21_11();
        naoDuplicar = 16;
    }
    if (layer == TotalProprietario21Freg && naoDuplicar != 18){
        legenda('Nº de Alojamentos em regime de proprietário ou coproprietário em 2021', maxTotalProprietario21Freg, Math.round((maxTotalProprietario21Freg-minTotalProprietario21Freg)/2),minTotalProprietario21Freg,0.15);
        contornoFreg.addTo(map);
        slideTotalProprietario21Freg();
        naoDuplicar = 18;
    }
    if (layer == TotalProprietario11Freg && naoDuplicar != 19){
        legenda('Nº de Alojamentos em regime de proprietário ou coproprietário em 2011', maxTotalProprietario11Freg, Math.round((maxTotalProprietario11Freg-minTotalProprietario11Freg)/2),minTotalProprietario11Freg,0.15);
        contornoFreg.addTo(map);
        slideTotalProprietario11Freg();
        naoDuplicar = 19;
    }
    if (layer == TotalArrendatario21Freg && naoDuplicar != 20){
        legenda('Nº de Alojamentos em regime de arrendatário ou subarrendatário em 2021', maxTotalArrendatario21Freg, Math.round((maxTotalArrendatario21Freg-minTotalArrendatario21Freg)/2),minTotalArrendatario21Freg,0.15);
        contornoFreg.addTo(map);
        slideTotalArrendatario21Freg();
        naoDuplicar = 20;
    }
    if (layer == TotalArrendatario11Freg && naoDuplicar != 21){
        legenda('Nº de Alojamentos em regime de arrendatário ou subarrendatário em 2011', maxTotalArrendatario11Freg, Math.round((maxTotalArrendatario11Freg-minTotalArrendatario11Freg)/2),minTotalArrendatario11Freg,0.15);
        contornoFreg.addTo(map);
        slideTotalArrendatario11Freg();
        naoDuplicar = 21;
    }
    if (layer == TotalOutras21Freg && naoDuplicar != 22){
        legendaExcecao('Nº de Alojamentos em regime de outras situações em 2021', maxTotalOutras21Freg, Math.round((maxTotalOutras21Freg-minTotalOutras21Freg)/2),minTotalOutras21Freg,0.2);
        contornoFreg.addTo(map);
        slideTotalOutras21Freg();
        naoDuplicar = 22;
    }
    if (layer == TotalOutras11Freg && naoDuplicar != 23){
        legendaExcecao('Nº de Alojamentos em regime de outras situações em 2011', maxTotalOutras11Freg, Math.round((maxTotalOutras11Freg-minTotalOutras11Freg)/2),minTotalOutras11Freg,0.2);
        contornoFreg.addTo(map);
        slideTotalOutras11Freg();
        naoDuplicar = 23;
    }
    if (layer == PerProprietario21Freg && naoDuplicar != 24){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em regime proprietário ou coproprietário em 2021');
        slidePerProprietario21Freg();
        naoDuplicar = 24;
    }
    if (layer == PerProprietario11Freg && naoDuplicar != 25){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em regime proprietário ou coproprietário em 2011');
        slidePerProprietario11Freg();
        naoDuplicar = 25;
    }
    if (layer == PerArrendatario21Freg && naoDuplicar != 26){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em regime arrendatário ou subarrendatário em 2021');
        slidePerArrendatario21Freg();
        naoDuplicar = 26;
    }
    if (layer == PerArrendatario11Freg && naoDuplicar != 27){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em regime arrendatário ou subarrendatário em 2011');
        slidePerArrendatario11Freg();
        naoDuplicar = 27;
    }
    if (layer == PerOutras21Freg && naoDuplicar != 28){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em regime de outras situações em 2021');
        slidePerOutras21Freg();
        naoDuplicar = 28;
    }
    if (layer == PerOutras11Freg && naoDuplicar != 29){
        legendaGradiente('Percentagem de Alojamentos Familiares de Residência Habitual em regime de outras situações em 2021');
        slidePerOutras11Freg();
        naoDuplicar = 29;
    }
    if (layer == VarProprietario21Freg && naoDuplicar != 30){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Secundária em regime proprietário ou cooproprietário entre 2021 e 2011', minVarProprietario21Freg,maxVarProprietario21Freg,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(73,153,189,1) 10%, rgba(112,171,186,1) 20%, rgba(152,189,183,1) 30%, rgba(191,206,180,1) 40%, rgba(231,224,177,1) 50%, rgba(255,226,171,1) 60%, rgba(255,201,160,1) 70%, rgba(255,177,149,1) 80%, rgba(255,152,138,1) 90%, rgba(255,127,127,1) 100%");
        slideVarProprietario21Freg();
        naoDuplicar = 30;
    }
    if (layer == VarArrendatario21Freg && naoDuplicar != 31){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Secundária em regime arrendatário ou subarrendatário entre 2021 e 2011', minVarArrendatario21Freg,100,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(255,233,175,1) 10%, rgba(255,222,169,1) 20%, rgba(255,210,164,1) 30%, rgba(255,198,159,1) 40%, rgba(255,186,154,1) 50%, rgba(255,175,148,1) 60%, rgba(255,163,143,1) 70%, rgba(255,151,138,1) 80%, rgba(255,139,133,1) 90%, rgba(255,127,127,1) 100%");
        slideVarArrendatario21Freg();
        naoDuplicar = 31;
    }
    if (layer == VarOutras21Freg && naoDuplicar != 32){
        LegendaVariacoes('Variação dos Alojamentos Familiares Clássicos de Residência Secundária em outras situações entre 2021 e 2011', minVarOutras21Freg,maxVarOutras21Freg,"linear-gradient(90deg, rgba(34,136,191,1) 0%, rgba(76,155,188,1) 10%, rgba(119,174,185,1) 20%, rgba(162,193,182,1) 30%, rgba(205,212,179,1) 40%, rgba(248,232,176,1) 50%, rgba(255,217,167,1) 60%, rgba(255,194,157,1) 70%, rgba(255,172,147,1) 80%, rgba(255,150,137,1) 90%, rgba(255,127,127,1) 100%");
        slideVarOutras21Freg();
        naoDuplicar = 32;
    }
    if (layer == TotalRH21Freg && naoDuplicar != 33){
        legenda('Nº de Alojamentos de residência habitual em 2021', maxTotalRH21Freg, Math.round((maxTotalRH21Freg-minTotalRH21Freg)/2),minTotalRH21Freg,0.1);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalRH21Freg();
        naoDuplicar = 33;
    }
    if (layer == TotalRH11Freg && naoDuplicar != 34){
        legenda('Nº de Alojamentos de residência habitual em 2011', maxTotalRH11Freg, Math.round((maxTotalRH11Freg-minTotalRH11Freg)/2),minTotalRH11Freg,0.1);
        contornoFreg.addTo(map);
        slideTotalRH11Freg();
        naoDuplicar = 34;
    }
    
    layer.addTo(map);
    layerAtiva = layer;  
}

let primeirovalor = function(valor){
    $("#mySelect").val("2021");
    $("#opcaoSelect").val(valor)
    
}
let reporAnos = function(){
    $('#mySelect').empty();
    $('#mySelect').append("<option value='2021'>2021</option>");
    $('#mySelect').append("<option value='2011'>2011</option>");
}
let reporAnosVariacao = function(){
    primeirovalor('Proprietario');
    reporAnos();
    $('#mySelect')[0].options[0].innerHTML = "2021 - 2011";
    $("#mySelect option[value='2011']").remove();
}
let tamanhoTotal = function(){
    $("#opcaoSelect option[value='Total']").show();
    $("#opcaoSelect").css('width', '60px');
}
let tamanhoOutros = function(){
    $("#opcaoSelect").css('width', 'fit-content');
}
let esconderTotal = function(){
    $("#opcaoSelect option[value='Total']").hide();
}
var i = 0;

let notaRodape = function(){
    $('#painel').append("<div id='notaRodape'></div>")
    $('#notaRodape').html("Devido aos valores mais reduzidos, optou-se por aumentar a proporção dos círculos, de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os círculos à escala concelhia.")
}

$('#absoluto').click(function(){
    novaLayer(TotAlojRH21);
    tamanhoTotal();
    reporAnos();
    primeirovalor('Total');
    $('#tituloMapa').html('<strong>' + 'Alojamentos familiares clássicos de residência habitual por Regime de ocupação, Nº.' + '</strong>');
});
$('#percentagem').click(function(){
    novaLayer(PerProprietario21); 
    reporAnos();
    esconderTotal();
    primeirovalor('Proprietario');
    tamanhoOutros();
    $('#tituloMapa').html('<strong>' + 'Alojamentos familiares clássicos de residência habitual por Regime de ocupação, %.' + '</strong>')
});
$('#taxaVariacao').click(function(){
    novaLayer(VarProprietario21_11);
    reporAnosVariacao();
    esconderTotal();
    tamanhoOutros();
    $('#tituloMapa').html('<strong>' + 'Alojamentos familiares clássicos de residência habitual por Regime de ocupação, %.' + '</strong>')
});
$('#absolutoFreguesia').click(function(){
    novaLayer(TotalProprietario21Freg);
    tamanhoTotal();
    reporAnos();
    primeirovalor('Total');
    $('#tituloMapa').html('<strong>' + 'Alojamentos familiares clássicos de residência habitual por Regime de ocupação, Nº.' + '</strong>');
    notaRodape();
});
$('#percentagemFreguesia').click(function(){
    novaLayer(PerProprietario21Freg);
    reporAnos();
    esconderTotal();
    primeirovalor('Proprietario');
    tamanhoOutros();
    $('#tituloMapa').html('<strong>' + 'Alojamentos familiares clássicos de residência habitual por Regime de ocupação, %.' + '</strong>')
    $('#notaRodape').remove();
});
$('#taxaVariacaoFreguesia').click(function(){
    novaLayer(VarProprietario21Freg);
    reporAnosVariacao();
    esconderTotal();
    tamanhoOutros();
    $('#tituloMapa').html('<strong>' + 'Alojamentos familiares clássicos de residência habitual por Regime de ocupação, %.' + '</strong>')
    $('#notaRodape').remove();
});

$('#freguesias').click(function(){
    variaveisMapaFreguesias();
    reporAnos();
});
$('#concelho').click(function(){
    variaveisMapaConcelho();
    reporAnos();
    $('#notaRodape').remove();
});


$('#absolutoFreguesia').attr("class", "btn");
let variaveisMapaConcelho = function(){
    $('#escalasConcelho').css("visibility", "visible");
    $('#escalasFreguesias').css("visibility", "hidden");
    $('#absolutoFreguesia').attr("class", "btn");
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
        novaLayer(TotAlojRH21);
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
        novaLayer(TotalRH21Freg);
        tamanhoTotal();
        reporAnos();
        primeirovalor('Total');
        notaRodape();
    }
}

function myFunction() {
    var regimeOcupacao = document.getElementById("opcaoSelect").value;
    var anoSelecionado = document.getElementById("mySelect").value;
    if($(absoluto).hasClass('active4')){
        $('#notaRodape').remove();
        if (anoSelecionado == "2021" && regimeOcupacao =="Total"){
            novaLayer(TotAlojRH21);
        };
        if (anoSelecionado == "2011" && regimeOcupacao =="Total"){
            novaLayer(ConcelhoTotAlojRH11);
        };
        if (anoSelecionado == "2021" && regimeOcupacao =="Proprietario"){
            novaLayer(ConcelhoProprietario21);
        };
        if (anoSelecionado == "2011" && regimeOcupacao =="Proprietario"){
            novaLayer(ConcelhoProprietario11);
        };
        if (anoSelecionado == "2021" && regimeOcupacao =="Arrendatario"){
            novaLayer(ConcelhoArrendatario21);
        };
        if (anoSelecionado == "2011" && regimeOcupacao =="Arrendatario"){
            novaLayer(ConcelhoArrendatario11);
        };
        if (anoSelecionado == "2021" && regimeOcupacao =="Outras"){
            novaLayer(ConcelhoOutrasSituacoes21);
        };
        if (anoSelecionado == "2011" && regimeOcupacao =="Outras"){
            novaLayer(ConcelhoOutrasSituacoes11);
        };
    }
    if($(percentagem).hasClass('active4')){
        $('#notaRodape').remove();
        if (anoSelecionado == "2021" && regimeOcupacao == "Proprietario"){
            novaLayer(PerProprietario21);
        }
        if (anoSelecionado == "2011" && regimeOcupacao == "Proprietario"){
            novaLayer(PerProprietario11);
        }
        if (anoSelecionado == "2021" && regimeOcupacao == "Arrendatario"){
            novaLayer(PerArrendatario21);
        }
        if (anoSelecionado == "2011" && regimeOcupacao == "Arrendatario"){
            novaLayer(PerArrendatario11);
        }
        if (anoSelecionado == "2021" && regimeOcupacao == "Outras"){
            novaLayer(PerOutras21);
        }
        if (anoSelecionado == "2011" && regimeOcupacao == "Outras"){
            novaLayer(PerOutras11);
        }
    }
    if($(taxaVariacao).hasClass('active4')){
        $('#notaRodape').remove();
        if (anoSelecionado == "2021" && regimeOcupacao =="Proprietario"){
            novaLayer(VarProprietario21_11);
        };
        if (anoSelecionado == "2021" && regimeOcupacao =="Arrendatario"){
            novaLayer(VarArrendatario21_11);
        };
        if (anoSelecionado == "2021" && regimeOcupacao =="Outras"){
            novaLayer(VarOutras21_11);
        };
    }
    if($(absolutoFreguesia).hasClass('active5')){
        if (anoSelecionado == "2021" && regimeOcupacao == "Total"){
            novaLayer(TotalRH21Freg);
        };
        if (anoSelecionado == "2011" && regimeOcupacao == "Total"){
            novaLayer(TotalRH11Freg);
        };
        if (anoSelecionado == "2021" && regimeOcupacao == "Proprietario"){
            novaLayer(TotalProprietario21Freg);
        };
        if (anoSelecionado == "2011" && regimeOcupacao == "Proprietario"){
            novaLayer(TotalProprietario11Freg);
        };
        if (anoSelecionado == "2021" && regimeOcupacao == "Arrendatario"){
            novaLayer(TotalArrendatario21Freg);
        };
        if (anoSelecionado == "2011" && regimeOcupacao == "Arrendatario"){
            novaLayer(TotalArrendatario11Freg);
        };
        if (anoSelecionado == "2021" && regimeOcupacao == "Outras"){
            novaLayer(TotalOutras21Freg);
        };
        if (anoSelecionado == "2011" && regimeOcupacao == "Outras"){
            novaLayer(TotalOutras11Freg);
        };
    };
    if($(percentagemFreguesia).hasClass('active5')){
        if (anoSelecionado == "2021" && regimeOcupacao =="Proprietario"){
            novaLayer(PerProprietario21Freg);
        };
        if (anoSelecionado == "2011" && regimeOcupacao =="Proprietario"){
            novaLayer(PerProprietario11Freg);
        };
        if (anoSelecionado == "2021" && regimeOcupacao =="Arrendatario"){
            novaLayer(PerArrendatario21Freg);
        };
        if (anoSelecionado == "2011" && regimeOcupacao =="Arrendatario"){
            novaLayer(PerArrendatario11Freg);
        };
        if (anoSelecionado == "2021" && regimeOcupacao =="Outras"){
            novaLayer(PerOutras21Freg);
        };
        if (anoSelecionado == "2011" && regimeOcupacao =="Outras"){
            novaLayer(PerOutras11Freg);
        };
    }
    if($(taxaVariacaoFreguesia).hasClass('active5')){
        if (anoSelecionado == "2021" && regimeOcupacao =="Proprietario"){
            novaLayer(VarProprietario21Freg);
        };
        if (anoSelecionado == "2021" && regimeOcupacao =="Arrendatario"){
            novaLayer(VarArrendatario21Freg);
        };
        if (anoSelecionado == "2021" && regimeOcupacao =="Outras"){
            novaLayer(VarOutras21Freg);
        };
    }
}

let anosSelecionados = function() {
    let anoSelecionado = document.getElementById("mySelect").value;
    if ($('#freguesias').hasClass("active2")){
        if (anoSelecionado == "2021"){
            i = 0;
        }
        if (anoSelecionado == "2011"){
            i = 1;
        }
    }
    if ($('#concelho').hasClass("active2")){
        if (anoSelecionado == "2021"){
            i = 0;
        }
        if (anoSelecionado == "2011"){
            i = 1;
        }
    }
}
    
    
  

const opcoesAnos = $('#mySelect');      
$('#next').click(function(){
    anosSelecionados();
    if ($('#freguesias').hasClass("active2")){
        if (i !== 1) {
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
        if (i !== 1) {
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
        if(i === 1){
            return false
        }
    }
    if($('#concelho').hasClass("active2")){
        if(i === 1){
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

    DadosAbsolutosRegime();

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
    novaLayer(TotAlojRH21);


})

$('#tabelaDadosAbsolutos').click(function(){
    DadosAbsolutosRegime();;   
    });


var DadosAbsolutosRegime = function(){
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/waza/main/TabelaRegime.json", function(data){
            $('#juntarValores').empty();
            var dados = '';7
            $('#2011').html("2011")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.GrupoEtario == "Outras Situações"){
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.GrupoEtario+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2011+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2021+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Freguesia+'</td>';
                    dados += '<td>'+value.GrupoEtario+'</td>';
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
        $.getJSON("https://raw.githubusercontent.com/diogoomb/waza/main/TabelaRegime.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2011').html("2011")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.GrupoEtario == "Outras Situações"){
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.GrupoEtario+'</td>';
                    dados += '<td class="borderbottom">'+value.PER2011+'%'+'</td>';
                    dados += '<td class="borderbottom">'+value.PER2021+'%'+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Freguesia+'</td>';
                    dados += '<td>'+value.GrupoEtario+'</td>';
                    dados += '<td>'+value.PER2011+'%'+'</td>';
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
        $.getJSON("https://raw.githubusercontent.com/diogoomb/waza/main/TabelaRegime.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2011').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.GrupoEtario == "Outras Situações"){
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.GrupoEtario+'</td>';
                    dados += '<td class="borderbottom">'+ ' '+'</td>';
                    dados += '<td class="borderbottom">'+value.VAR2111+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Freguesia+'</td>';
                    dados += '<td>'+value.GrupoEtario+'</td>';
                    dados += '<td>'+ ' '+'</td>';
                    dados += '<td>'+value.VAR2111+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});