
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

///// --- Adicionar Layer dos Concelhos -----\\\\
function layerContorno() {
    return {
        weight: 1,
        opacity: 0.5,
        color: 'black',
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
var contornoFreg2001 =L.geoJSON(dadosRelativosFreguesias01,{
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


/////////////////////------ NIVEL DE ENSINO NENHUM CONCELHO 2001 ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalNenhum01 = 0;
var maxTotalNenhum01 = 0;
function estiloTotalNenhumConcelhos01(feature, latlng) {
    if(feature.properties.Nenh01< minTotalNenhum01 || minTotalNenhum01 ===0){
        minTotalNenhum01 = feature.properties.Nenh01
    }
    if(feature.properties.Nenh01> maxTotalNenhum01){
        maxTotalNenhum01 = feature.properties.Nenh01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Nenh01,0.15)
    });
}
function apagarTotalNenhumConcelhos01(e){
    var layer = e.target;
    TotalNenhumConcelhos01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalNenhumConcelhos01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.Nenh01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalNenhumConcelhos01,
    })
};

var TotalNenhumConcelhos01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalNenhumConcelhos01,
    onEachFeature: onEachFeatureTotalNenhumConcelhos01,
});


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


var sliderAtivo = null

var slideTotalNenhumConcelhos01 = function(){
    var sliderTotalNenhumConcelhos01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalNenhumConcelhos01, {
        start: [minTotalNenhum01, maxTotalNenhum01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalNenhum01,
            'max': maxTotalNenhum01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalNenhum01);
    inputNumberMax.setAttribute("value",maxTotalNenhum01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalNenhumConcelhos01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalNenhumConcelhos01.noUiSlider.set([null, this.value]);
    });

    sliderTotalNenhumConcelhos01.noUiSlider.on('update',function(e){
        TotalNenhumConcelhos01.eachLayer(function(layer){
            if(layer.feature.properties.Nenh01>=parseFloat(e[0])&& layer.feature.properties.Nenh01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalNenhumConcelhos01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderTotalNenhumConcelhos01.noUiSlider;
    $(slidersGeral).append(sliderTotalNenhumConcelhos01);
}
TotalNenhumConcelhos01.addTo(map);
legenda(maxTotalNenhum01, (maxTotalNenhum01-minTotalNenhum01)/2,minTotalNenhum01,0.15);
slideTotalNenhumConcelhos01();

/////////////////////------ FIM NIVEL DE ENSINO -  NENHUM CONCELHO 2001 --------\\\\\\\\\\\\\\\\\\\\\\
/////////////////////------ NIVEL DE ENSINO  - NENHUM CONCELHO 2011 ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalNenhum11 = 0;
var maxTotalNenhum11 = 0;
function estiloTotalNenhumConcelhos11(feature, latlng) {
    if(feature.properties.Nenh11< minTotalNenhum11 || minTotalNenhum11 ===0){
        minTotalNenhum11 = feature.properties.Nenh11
    }
    if(feature.properties.Nenh11> maxTotalNenhum11){
        maxTotalNenhum11 = feature.properties.Nenh11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Nenh11,0.15)
    });
}
function apagarTotalNenhumConcelhos11(e){
    var layer = e.target;
    TotalNenhumConcelhos11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalNenhumConcelhos11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.Nenh11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalNenhumConcelhos11,
    })
};

var TotalNenhumConcelhos11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalNenhumConcelhos11,
    onEachFeature: onEachFeatureTotalNenhumConcelhos11,
});
var slideTotalNenhumConcelhos11 = function(){
    var sliderTotalNenhumConcelhos11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalNenhumConcelhos11, {
        start: [minTotalNenhum11, maxTotalNenhum11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalNenhum11,
            'max': maxTotalNenhum11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalNenhum11);
    inputNumberMax.setAttribute("value",maxTotalNenhum11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalNenhumConcelhos11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalNenhumConcelhos11.noUiSlider.set([null, this.value]);
    });

    sliderTotalNenhumConcelhos11.noUiSlider.on('update',function(e){
        TotalNenhumConcelhos11.eachLayer(function(layer){
            if(layer.feature.properties.Nenh11>=parseFloat(e[0])&& layer.feature.properties.Nenh11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalNenhumConcelhos11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderTotalNenhumConcelhos11.noUiSlider;
    $(slidersGeral).append(sliderTotalNenhumConcelhos11);
}
/////////////////////------ FIM NIVEL DE ENSINO -  NENHUM CONCELHO 2011 --------\\\\\\\\\\\\\\\\\\\\\\
/////////////////////------ NIVEL DE ENSINO  - NENHUM CONCELHO 2021 ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalNenhum21 = 0;
var maxTotalNenhum21 = 0;
function estiloTotalNenhumConcelhos21(feature, latlng) {
    if(feature.properties.Nenh21< minTotalNenhum21 || minTotalNenhum21 ===0){
        minTotalNenhum21 = feature.properties.Nenh21
    }
    if(feature.properties.Nenh21> maxTotalNenhum21){
        maxTotalNenhum21 = feature.properties.Nenh21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Nenh21,0.15)
    });
}
function apagarTotalNenhumConcelhos21(e){
    var layer = e.target;
    TotalNenhumConcelhos21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalNenhumConcelhos21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.Nenh21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalNenhumConcelhos21,
    })
};

var TotalNenhumConcelhos21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalNenhumConcelhos21,
    onEachFeature: onEachFeatureTotalNenhumConcelhos21,
});
var slideTotalNenhumConcelhos21 = function(){
    var sliderTotalNenhumConcelhos21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalNenhumConcelhos21, {
        start: [minTotalNenhum21, maxTotalNenhum21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalNenhum21,
            'max': maxTotalNenhum21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalNenhum21);
    inputNumberMax.setAttribute("value",maxTotalNenhum21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalNenhumConcelhos21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalNenhumConcelhos21.noUiSlider.set([null, this.value]);
    });

    sliderTotalNenhumConcelhos21.noUiSlider.on('update',function(e){
        TotalNenhumConcelhos21.eachLayer(function(layer){
            if(layer.feature.properties.Nenh21>=parseFloat(e[0])&& layer.feature.properties.Nenh21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalNenhumConcelhos21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderTotalNenhumConcelhos21.noUiSlider;
    $(slidersGeral).append(sliderTotalNenhumConcelhos21);
}

/////////////////////------ FIM NIVEL DE ENSINO -  NENHUM CONCELHO 2011 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - Básico CONCELHO 2001 ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalBasico01 = 0;
var maxTotalBasico01 = 0;
function estiloTotalBasicoConcelhos01(feature, latlng) {
    if(feature.properties.EB01< minTotalBasico01 || minTotalBasico01 ===0){
        minTotalBasico01 = feature.properties.EB01
    }
    if(feature.properties.EB01> maxTotalBasico01){
        maxTotalBasico01 = feature.properties.EB01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.EB01,0.15)
    });
}
function apagarTotalBasicoConcelhos01(e){
    var layer = e.target;
    TotalBasicoConcelhos01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalBasicoConcelhos01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.EB01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalBasicoConcelhos01,
    })
};

var TotalBasicoConcelhos01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalBasicoConcelhos01,
    onEachFeature: onEachFeatureTotalBasicoConcelhos01,
});
var slideTotalBasicoConcelhos01 = function(){
    var sliderTotalBasicoConcelhos01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalBasicoConcelhos01, {
        start: [minTotalBasico01, maxTotalBasico01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalBasico01,
            'max': maxTotalBasico01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalBasico01);
    inputNumberMax.setAttribute("value",maxTotalBasico01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalBasicoConcelhos01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalBasicoConcelhos01.noUiSlider.set([null, this.value]);
    });

    sliderTotalBasicoConcelhos01.noUiSlider.on('update',function(e){
        TotalBasicoConcelhos01.eachLayer(function(layer){
            if(layer.feature.properties.EB01>=parseFloat(e[0])&& layer.feature.properties.EB01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalBasicoConcelhos01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderTotalBasicoConcelhos01.noUiSlider;
    $(slidersGeral).append(sliderTotalBasicoConcelhos01);
}
/////////////////////------ FIM NIVEL DE ENSINO Básico CONCELHO 2001 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - Básico CONCELHO 2011 ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalBasico11 = 0;
var maxTotalBasico11 = 0;
function estiloTotalBasicoConcelhos11(feature, latlng) {
    if(feature.properties.EB11< minTotalBasico11 || minTotalBasico11 ===0){
        minTotalBasico11 = feature.properties.EB11
    }
    if(feature.properties.EB11> maxTotalBasico11){
        maxTotalBasico11 = feature.properties.EB11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.EB11,0.15)
    });
}
function apagarTotalBasicoConcelhos11(e){
    var layer = e.target;
    TotalBasicoConcelhos11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalBasicoConcelhos11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.EB11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalBasicoConcelhos11,
    })
};

var TotalBasicoConcelhos11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalBasicoConcelhos11,
    onEachFeature: onEachFeatureTotalBasicoConcelhos11,
});
var slideTotalBasicoConcelhos11 = function(){
    var sliderTotalBasicoConcelhos11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalBasicoConcelhos11, {
        start: [minTotalBasico11, maxTotalBasico11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalBasico11,
            'max': maxTotalBasico11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalBasico11);
    inputNumberMax.setAttribute("value",maxTotalBasico11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalBasicoConcelhos11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalBasicoConcelhos11.noUiSlider.set([null, this.value]);
    });

    sliderTotalBasicoConcelhos11.noUiSlider.on('update',function(e){
        TotalBasicoConcelhos11.eachLayer(function(layer){
            if(layer.feature.properties.EB11>=parseFloat(e[0])&& layer.feature.properties.EB11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalBasicoConcelhos11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderTotalBasicoConcelhos11.noUiSlider;
    $(slidersGeral).append(sliderTotalBasicoConcelhos11);
}
/////////////////////------ FIM NIVEL DE ENSINO Básico CONCELHO 2011 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - Básico CONCELHO 2021 ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalBasico21 = 0;
var maxTotalBasico21 = 0;
function estiloTotalBasicoConcelhos21(feature, latlng) {
    if(feature.properties.EB21< minTotalBasico21 || minTotalBasico21 ===0){
        minTotalBasico21 = feature.properties.EB21
    }
    if(feature.properties.EB21> maxTotalBasico21){
        maxTotalBasico21 = feature.properties.EB21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.EB21,0.15)
    });
}
function apagarTotalBasicoConcelhos21(e){
    var layer = e.target;
    TotalBasicoConcelhos21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalBasicoConcelhos21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.EB21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalBasicoConcelhos21,
    })
};

var TotalBasicoConcelhos21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalBasicoConcelhos21,
    onEachFeature: onEachFeatureTotalBasicoConcelhos21,
});
var slideTotalBasicoConcelhos21 = function(){
    var sliderTotalBasicoConcelhos21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalBasicoConcelhos21, {
        start: [minTotalBasico21, maxTotalBasico21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalBasico21,
            'max': maxTotalBasico21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalBasico21);
    inputNumberMax.setAttribute("value",maxTotalBasico21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalBasicoConcelhos21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalBasicoConcelhos21.noUiSlider.set([null, this.value]);
    });

    sliderTotalBasicoConcelhos21.noUiSlider.on('update',function(e){
        TotalBasicoConcelhos21.eachLayer(function(layer){
            if(layer.feature.properties.EB21>=parseFloat(e[0])&& layer.feature.properties.EB21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalBasicoConcelhos21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderTotalBasicoConcelhos21.noUiSlider;
    $(slidersGeral).append(sliderTotalBasicoConcelhos21);
}
/////////////////////------ FIM NIVEL DE ENSINO Básico CONCELHO 2021 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - Secundario CONCELHO 2001 ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalSecundario01 = 0;
var maxTotalSecundario01 = 0;
function estiloTotalSecundarioConcelhos01(feature, latlng) {
    if(feature.properties.SEC01< minTotalSecundario01 || minTotalSecundario01 ===0){
        minTotalSecundario01 = feature.properties.SEC01
    }
    if(feature.properties.SEC01> maxTotalSecundario01){
        maxTotalSecundario01 = feature.properties.SEC01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.SEC01,0.15)
    });
}
function apagarTotalSecundarioConcelhos01(e){
    var layer = e.target;
    TotalSecundarioConcelhos01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalSecundarioConcelhos01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.SEC01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalSecundarioConcelhos01,
    })
};

var TotalSecundarioConcelhos01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalSecundarioConcelhos01,
    onEachFeature: onEachFeatureTotalSecundarioConcelhos01,
});
var slideTotalSecundarioConcelhos01 = function(){
    var sliderTotalSecundarioConcelhos01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalSecundarioConcelhos01, {
        start: [minTotalSecundario01, maxTotalSecundario01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalSecundario01,
            'max': maxTotalSecundario01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalSecundario01);
    inputNumberMax.setAttribute("value",maxTotalSecundario01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalSecundarioConcelhos01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalSecundarioConcelhos01.noUiSlider.set([null, this.value]);
    });

    sliderTotalSecundarioConcelhos01.noUiSlider.on('update',function(e){
        TotalSecundarioConcelhos01.eachLayer(function(layer){
            if(layer.feature.properties.SEC01>=parseFloat(e[0])&& layer.feature.properties.SEC01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalSecundarioConcelhos01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderTotalSecundarioConcelhos01.noUiSlider;
    $(slidersGeral).append(sliderTotalSecundarioConcelhos01);
}
/////////////////////------ FIM NIVEL DE ENSINO Secundario CONCELHO 2001 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - Secundario CONCELHO 2011 ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalSecundario11 = 0;
var maxTotalSecundario11 = 0;
function estiloTotalSecundarioConcelhos11(feature, latlng) {
    if(feature.properties.SEC11< minTotalSecundario11 || minTotalSecundario11 ===0){
        minTotalSecundario11 = feature.properties.SEC11
    }
    if(feature.properties.SEC11> maxTotalSecundario11){
        maxTotalSecundario11 = feature.properties.SEC11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.SEC11,0.15)
    });
}
function apagarTotalSecundarioConcelhos11(e){
    var layer = e.target;
    TotalSecundarioConcelhos11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalSecundarioConcelhos11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.SEC11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalSecundarioConcelhos11,
    })
};

var TotalSecundarioConcelhos11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalSecundarioConcelhos11,
    onEachFeature: onEachFeatureTotalSecundarioConcelhos11,
});
var slideTotalSecundarioConcelhos11 = function(){
    var sliderTotalSecundarioConcelhos11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalSecundarioConcelhos11, {
        start: [minTotalSecundario11, maxTotalSecundario11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalSecundario11,
            'max': maxTotalSecundario11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalSecundario11);
    inputNumberMax.setAttribute("value",maxTotalSecundario11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalSecundarioConcelhos11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalSecundarioConcelhos11.noUiSlider.set([null, this.value]);
    });

    sliderTotalSecundarioConcelhos11.noUiSlider.on('update',function(e){
        TotalSecundarioConcelhos11.eachLayer(function(layer){
            if(layer.feature.properties.SEC11>=parseFloat(e[0])&& layer.feature.properties.SEC11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalSecundarioConcelhos11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderTotalSecundarioConcelhos11.noUiSlider;
    $(slidersGeral).append(sliderTotalSecundarioConcelhos11);
}
/////////////////////------ FIM NIVEL DE ENSINO Secundario CONCELHO 2011 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - Secundario CONCELHO 2021 ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalSecundario21 = 0;
var maxTotalSecundario21 = 0;
function estiloTotalSecundarioConcelhos21(feature, latlng) {
    if(feature.properties.SEC21< minTotalSecundario21 || minTotalSecundario21 ===0){
        minTotalSecundario21 = feature.properties.SEC21
    }
    if(feature.properties.SEC21> maxTotalSecundario21){
        maxTotalSecundario21 = feature.properties.SEC21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.SEC21,0.15)
    });
}
function apagarTotalSecundarioConcelhos21(e){
    var layer = e.target;
    TotalSecundarioConcelhos21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalSecundarioConcelhos21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.SEC21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalSecundarioConcelhos21,
    })
};

var TotalSecundarioConcelhos21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalSecundarioConcelhos21,
    onEachFeature: onEachFeatureTotalSecundarioConcelhos21,
});
var slideTotalSecundarioConcelhos21 = function(){
    var sliderTotalSecundarioConcelhos21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalSecundarioConcelhos21, {
        start: [minTotalSecundario21, maxTotalSecundario21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalSecundario21,
            'max': maxTotalSecundario21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalSecundario21);
    inputNumberMax.setAttribute("value",maxTotalSecundario21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalSecundarioConcelhos21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalSecundarioConcelhos21.noUiSlider.set([null, this.value]);
    });

    sliderTotalSecundarioConcelhos21.noUiSlider.on('update',function(e){
        TotalSecundarioConcelhos21.eachLayer(function(layer){
            if(layer.feature.properties.SEC21>=parseFloat(e[0])&& layer.feature.properties.SEC21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalSecundarioConcelhos21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderTotalSecundarioConcelhos21.noUiSlider;
    $(slidersGeral).append(sliderTotalSecundarioConcelhos21);
}
/////////////////////------ FIM NIVEL DE ENSINO Secundario CONCELHO 2021 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - Ensino Superior CONCELHO 2001 ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalSuperior01 = 0;
var maxTotalSuperior01 = 0;
function estiloTotalSuperiorConcelhos01(feature, latlng) {
    if(feature.properties.ES01< minTotalSuperior01 || minTotalSuperior01 ===0){
        minTotalSuperior01 = feature.properties.ES01
    }
    if(feature.properties.ES01> maxTotalSuperior01){
        maxTotalSuperior01 = feature.properties.ES01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ES01,0.15)
    });
}
function apagarTotalSuperiorConcelhos01(e){
    var layer = e.target;
    TotalSuperiorConcelhos01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalSuperiorConcelhos01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.ES01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalSuperiorConcelhos01,
    })
};

var TotalSuperiorConcelhos01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalSuperiorConcelhos01,
    onEachFeature: onEachFeatureTotalSuperiorConcelhos01,
});
var slideTotalSuperiorConcelhos01 = function(){
    var sliderTotalSuperiorConcelhos01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalSuperiorConcelhos01, {
        start: [minTotalSuperior01, maxTotalSuperior01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalSuperior01,
            'max': maxTotalSuperior01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalSuperior01);
    inputNumberMax.setAttribute("value",maxTotalSuperior01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalSuperiorConcelhos01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalSuperiorConcelhos01.noUiSlider.set([null, this.value]);
    });

    sliderTotalSuperiorConcelhos01.noUiSlider.on('update',function(e){
        TotalSuperiorConcelhos01.eachLayer(function(layer){
            if(layer.feature.properties.ES01>=parseFloat(e[0])&& layer.feature.properties.ES01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalSuperiorConcelhos01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderTotalSuperiorConcelhos01.noUiSlider;
    $(slidersGeral).append(sliderTotalSuperiorConcelhos01);
}
/////////////////////------ FIM NIVEL DE ENSINO SUPERIOR CONCELHO 2001 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - Ensino Superior CONCELHO 2011 ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalSuperior11 = 0;
var maxTotalSuperior11 = 0;
function estiloTotalSuperiorConcelhos11(feature, latlng) {
    if(feature.properties.ES11< minTotalSuperior11 || minTotalSuperior11 ===0){
        minTotalSuperior11 = feature.properties.ES11
    }
    if(feature.properties.ES11> maxTotalSuperior11){
        maxTotalSuperior11 = feature.properties.ES11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ES11,0.15)
    });
}
function apagarTotalSuperiorConcelhos11(e){
    var layer = e.target;
    TotalSuperiorConcelhos11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalSuperiorConcelhos11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.ES11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalSuperiorConcelhos11,
    })
};

var TotalSuperiorConcelhos11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalSuperiorConcelhos11,
    onEachFeature: onEachFeatureTotalSuperiorConcelhos11,
});
var slideTotalSuperiorConcelhos11 = function(){
    var sliderTotalSuperiorConcelhos11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalSuperiorConcelhos11, {
        start: [minTotalSuperior11, maxTotalSuperior11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalSuperior11,
            'max': maxTotalSuperior11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalSuperior11);
    inputNumberMax.setAttribute("value",maxTotalSuperior11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalSuperiorConcelhos11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalSuperiorConcelhos11.noUiSlider.set([null, this.value]);
    });

    sliderTotalSuperiorConcelhos11.noUiSlider.on('update',function(e){
        TotalSuperiorConcelhos11.eachLayer(function(layer){
            if(layer.feature.properties.ES11>=parseFloat(e[0])&& layer.feature.properties.ES11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalSuperiorConcelhos11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderTotalSuperiorConcelhos11.noUiSlider;
    $(slidersGeral).append(sliderTotalSuperiorConcelhos11);
}
/////////////////////------ FIM NIVEL DE ENSINO SUPERIOR CONCELHO 2011 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - Ensino Superior CONCELHO 2021 ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalSuperior21 = 0;
var maxTotalSuperior21 = 0;
function estiloTotalSuperiorConcelhos21(feature, latlng) {
    if(feature.properties.ES21< minTotalSuperior21 || minTotalSuperior21 ===0){
        minTotalSuperior21 = feature.properties.ES21
    }
    if(feature.properties.ES21> maxTotalSuperior21){
        maxTotalSuperior21 = feature.properties.ES21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ES21,0.15)
    });
}
function apagarTotalSuperiorConcelhos21(e){
    var layer = e.target;
    TotalSuperiorConcelhos21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalSuperiorConcelhos21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.ES21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalSuperiorConcelhos21,
    })
};

var TotalSuperiorConcelhos21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalSuperiorConcelhos21,
    onEachFeature: onEachFeatureTotalSuperiorConcelhos21,
});
var slideTotalSuperiorConcelhos21 = function(){
    var sliderTotalSuperiorConcelhos21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalSuperiorConcelhos21, {
        start: [minTotalSuperior21, maxTotalSuperior21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalSuperior21,
            'max': maxTotalSuperior21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalSuperior21);
    inputNumberMax.setAttribute("value",maxTotalSuperior21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalSuperiorConcelhos21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalSuperiorConcelhos21.noUiSlider.set([null, this.value]);
    });

    sliderTotalSuperiorConcelhos21.noUiSlider.on('update',function(e){
        TotalSuperiorConcelhos21.eachLayer(function(layer){
            if(layer.feature.properties.ES21>=parseFloat(e[0])&& layer.feature.properties.ES21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalSuperiorConcelhos21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderTotalSuperiorConcelhos21.noUiSlider;
    $(slidersGeral).append(sliderTotalSuperiorConcelhos21);
}
/////////////////////------ FIM NIVEL DE ENSINO SUPERIOR CONCELHO 2021 --------\\\\\\\\\\\\\\\\\\\\\\
//////////////////// ----------- FIM DADOS ABSOLUTOS CONCELHOS --------------\\\\\\\\\\\\\\\\\\\\\\ 

//////------- Percentagem Total NIVEL NENHUM por Concelho em 2001-----////

var minPercNenhumConc01 = 0;
var maxPercNenhumConc01 = 0;

function CorPerNenhumConc(d) {
    return d >= 29.12 ? '#8c0303' :
        d >= 26.13  ? '#de1f35' :
        d >= 21.15 ? '#ff5e6e' :
        d >= 16.17   ? '#f5b3be' :
        d >= 11.19   ? '#F2C572' :
                ''  ;
}
var legendaPerNenhumConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 29.12' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 26.13 - 29.12' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 21.15 - 26.13' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 16.17 - 21.15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 11.19 - 16.17' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPercNenhumConc01(feature) {
    if( feature.properties.PercNen01 < minPercNenhumConc01 || minPercNenhumConc01 === 0){
        minPercNenhumConc01 = feature.properties.PercNen01
    }
    if(feature.properties.PercNen01 > maxPercNenhumConc01 ){
        maxPercNenhumConc01 = feature.properties.PercNen01
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
function apagarPercNenhumConc01(e) {
    PercNenhumConc01.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercNenhumConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PercNen01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercNenhumConc01,
    });
}
var PercNenhumConc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercNenhumConc01,
    onEachFeature: onEachFeaturePercNenhumConc01
});

let slidePercNenhumConc01 = function(){
    var sliderPercNenhumConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercNenhumConc01, {
        start: [minPercNenhumConc01, maxPercNenhumConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercNenhumConc01,
            'max': maxPercNenhumConc01
        },
        });
    inputNumberMin.setAttribute("value",minPercNenhumConc01);
    inputNumberMax.setAttribute("value",maxPercNenhumConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPercNenhumConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercNenhumConc01.noUiSlider.set([null, this.value]);
    });

    sliderPercNenhumConc01.noUiSlider.on('update',function(e){
        PercNenhumConc01.eachLayer(function(layer){
            if(layer.feature.properties.PercNen01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercNen01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercNenhumConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderPercNenhumConc01.noUiSlider;
    $(slidersGeral).append(sliderPercNenhumConc01);
} 

////////////------------------ Fim da Percentagem NIVEL NENHUM em 2001 -------------- \\\\\\

//////------- Percentagem Total NIVEL NENHUM por Concelho em 2011-----////

var minPercNenhumConc11 = 0;
var maxPercNenhumConc11 = 0;



function EstiloPercNenhumConc11(feature) {
    if( feature.properties.PercNen11 < minPercNenhumConc11 || minPercNenhumConc11 === 0){
        minPercNenhumConc11 = feature.properties.PercNen11
    }
    if(feature.properties.PercNen11 > maxPercNenhumConc11 ){
        maxPercNenhumConc11 = feature.properties.PercNen11
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
function apagarPercNenhumConc11(e) {
    PercNenhumConc11.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercNenhumConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PercNen11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercNenhumConc11,
    });
}
var PercNenhumConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercNenhumConc11,
    onEachFeature: onEachFeaturePercNenhumConc11
});

let slidePercNenhumConc11 = function(){
    var sliderPercNenhumConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercNenhumConc11, {
        start: [minPercNenhumConc11, maxPercNenhumConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercNenhumConc11,
            'max': maxPercNenhumConc11
        },
        });
    inputNumberMin.setAttribute("value",minPercNenhumConc11);
    inputNumberMax.setAttribute("value",maxPercNenhumConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercNenhumConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercNenhumConc11.noUiSlider.set([null, this.value]);
    });

    sliderPercNenhumConc11.noUiSlider.on('update',function(e){
        PercNenhumConc11.eachLayer(function(layer){
            if(layer.feature.properties.PercNen11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercNen11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercNenhumConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderPercNenhumConc11.noUiSlider;
    $(slidersGeral).append(sliderPercNenhumConc11);
} 

////////////------------------ Fim da Percentagem NIVEL NENHUM em 2011 -------------- \\\\\\

//////------- Percentagem Total NIVEL NENHUM por Concelho em 2021-----////

var minPercNenhumConc21 = 0;
var maxPercNenhumConc21 = 0;


function EstiloPercNenhumConc21(feature) {
    if( feature.properties.PercNen21 < minPercNenhumConc21 || minPercNenhumConc21 === 0){
        minPercNenhumConc21 = feature.properties.PercNen21
    }
    if(feature.properties.PercNen21 > maxPercNenhumConc21 ){
        maxPercNenhumConc21 = feature.properties.PercNen21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerNenhumConc(feature.properties.PercNen21)
    };
}
function apagarPercNenhumConc21(e) {
    PercNenhumConc21.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercNenhumConc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PercNen21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercNenhumConc21,
    });
}
var PercNenhumConc21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercNenhumConc21,
    onEachFeature: onEachFeaturePercNenhumConc21
});

let slidePercNenhumConc21 = function(){
    var sliderPercNenhumConc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercNenhumConc21, {
        start: [minPercNenhumConc21, maxPercNenhumConc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercNenhumConc21,
            'max': maxPercNenhumConc21
        },
        });
    inputNumberMin.setAttribute("value",minPercNenhumConc21);
    inputNumberMax.setAttribute("value",maxPercNenhumConc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPercNenhumConc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercNenhumConc21.noUiSlider.set([null, this.value]);
    });

    sliderPercNenhumConc21.noUiSlider.on('update',function(e){
        PercNenhumConc21.eachLayer(function(layer){
            if(layer.feature.properties.PercNen21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercNen21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercNenhumConc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderPercNenhumConc21.noUiSlider;
    $(slidersGeral).append(sliderPercNenhumConc21);
} 

////////////------------------ Fim da Percentagem NIVEL NENHUM em 2021 -------------- \\\\\\

//////------- Percentagem Total NIVEL BÁSICO por Concelho em 2001-----////

var minPercBasicoConc01 = 0;
var maxPercBasicoConc01 = 0;

function CorPerBasicoConc(d) {
    return d >= 61.91 ? '#8c0303' :
        d >= 57.92  ? '#de1f35' :
        d >= 51.27 ? '#ff5e6e' :
        d >= 44.61   ? '#f5b3be' :
        d >= 37.96   ? '#F2C572' :
                ''  ;
}
var legendaPerBasicoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 61.91' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 57.92 - 61.91' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 51.27 - 57.92' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 44.61 - 51.27' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 37.96 - 44.61' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPercBasicoConc01(feature) {
    if( feature.properties.PercEB01 < minPercBasicoConc01 || minPercBasicoConc01 === 0){
        minPercBasicoConc01 = feature.properties.PercEB01
    }
    if(feature.properties.PercEB01 > maxPercBasicoConc01 ){
        maxPercBasicoConc01 = feature.properties.PercEB01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerBasicoConc(feature.properties.PercEB01)
    };
}
function apagarPercBasicoConc01(e) {
    PercBasicoConc01.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercBasicoConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PercEB01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercBasicoConc01,
    });
}
var PercBasicoConc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercBasicoConc01,
    onEachFeature: onEachFeaturePercBasicoConc01
});

let slidePercBasicoConc01 = function(){
    var sliderPercBasicoConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercBasicoConc01, {
        start: [minPercBasicoConc01, maxPercBasicoConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercBasicoConc01,
            'max': maxPercBasicoConc01
        },
        });
    inputNumberMin.setAttribute("value",minPercBasicoConc01);
    inputNumberMax.setAttribute("value",maxPercBasicoConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPercBasicoConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercBasicoConc01.noUiSlider.set([null, this.value]);
    });

    sliderPercBasicoConc01.noUiSlider.on('update',function(e){
        PercBasicoConc01.eachLayer(function(layer){
            if(layer.feature.properties.PercEB01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercEB01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercBasicoConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderPercBasicoConc01.noUiSlider;
    $(slidersGeral).append(sliderPercBasicoConc01);
} 

////////////------------------ Fim da Percentagem NIVEL ENSINO BÁSICO em 2001 -------------- \\\\\\

//////------- Percentagem Total NIVEL BÁSICO por Concelho em 2011-----////

var minPercBasicoConc11 = 0;
var maxPercBasicoConc11 = 0;


function EstiloPercBasicoConc11(feature) {
    if( feature.properties.PercEB11 < minPercBasicoConc11 || minPercBasicoConc11 === 0){
        minPercBasicoConc11 = feature.properties.PercEB11
    }
    if(feature.properties.PercEB11 > maxPercBasicoConc11 ){
        maxPercBasicoConc11 = feature.properties.PercEB11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerBasicoConc(feature.properties.PercEB11)
    };
}
function apagarPercBasicoConc11(e) {
    PercBasicoConc11.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercBasicoConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PercEB11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercBasicoConc11,
    });
}
var PercBasicoConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercBasicoConc11,
    onEachFeature: onEachFeaturePercBasicoConc11
});

let slidePercBasicoConc11 = function(){
    var sliderPercBasicoConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercBasicoConc11, {
        start: [minPercBasicoConc11, maxPercBasicoConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercBasicoConc11,
            'max': maxPercBasicoConc11
        },
        });
    inputNumberMin.setAttribute("value",minPercBasicoConc11);
    inputNumberMax.setAttribute("value",maxPercBasicoConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercBasicoConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercBasicoConc11.noUiSlider.set([null, this.value]);
    });

    sliderPercBasicoConc11.noUiSlider.on('update',function(e){
        PercBasicoConc11.eachLayer(function(layer){
            if(layer.feature.properties.PercEB11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercEB11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercBasicoConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderPercBasicoConc11.noUiSlider;
    $(slidersGeral).append(sliderPercBasicoConc11);
} 

////////////------------------ Fim da Percentagem NIVEL ENSINO BÁSICO em 2011 -------------- \\\\\\

//////------- Percentagem Total NIVEL BÁSICO por Concelho em 2021-----////

var minPercBasicoConc21 = 0;
var maxPercBasicoConc21 = 0;


function EstiloPercBasicoConc21(feature) {
    if( feature.properties.PercEB21 < minPercBasicoConc21 || minPercBasicoConc21 === 0){
        minPercBasicoConc21 = feature.properties.PercEB21
    }
    if(feature.properties.PercEB21 > maxPercBasicoConc21 ){
        maxPercBasicoConc21 = feature.properties.PercEB21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerBasicoConc(feature.properties.PercEB21)
    };
}
function apagarPercBasicoConc21(e) {
    PercBasicoConc21.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercBasicoConc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PercEB21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercBasicoConc21,
    });
}
var PercBasicoConc21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercBasicoConc21,
    onEachFeature: onEachFeaturePercBasicoConc21
});

let slidePercBasicoConc21 = function(){
    var sliderPercBasicoConc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercBasicoConc21, {
        start: [minPercBasicoConc21, maxPercBasicoConc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercBasicoConc21,
            'max': maxPercBasicoConc21
        },
        });
    inputNumberMin.setAttribute("value",minPercBasicoConc21);
    inputNumberMax.setAttribute("value",maxPercBasicoConc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPercBasicoConc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercBasicoConc21.noUiSlider.set([null, this.value]);
    });

    sliderPercBasicoConc21.noUiSlider.on('update',function(e){
        PercBasicoConc21.eachLayer(function(layer){
            if(layer.feature.properties.PercEB21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercEB21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercBasicoConc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderPercBasicoConc21.noUiSlider;
    $(slidersGeral).append(sliderPercBasicoConc21);
} 

////////////------------------ Fim da Percentagem NIVEL ENSINO BÁSICO em 2021 -------------- \\\\\\

//////------- Percentagem Total NIVEL SECUNDÁRIO por Concelho em 2001-----////

var minPercSecundarioConc01 = 0;
var maxPercSecundarioConc01 = 0;

function CorPerSecundarioConc(d) {
    return d >= 21.32 ? '#8c0303' :
        d >= 18.76  ? '#de1f35' :
        d >= 14.5 ? '#ff5e6e' :
        d >= 10.23   ? '#f5b3be' :
        d >= 5.97   ? '#F2C572' :
                ''  ;
}
var legendaPerSecundarioConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 21.32' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 18.76 - 21.32' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 14.5 - 18.76' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 10.23 - 14.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 5.97 - 10.23' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPercSecundarioConc01(feature) {
    if( feature.properties.PercSEC01 < minPercSecundarioConc01 || minPercSecundarioConc01 === 0){
        minPercSecundarioConc01 = feature.properties.PercSEC01
    }
    if(feature.properties.PercSEC01 > maxPercSecundarioConc01 ){
        maxPercSecundarioConc01 = feature.properties.PercSEC01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSecundarioConc(feature.properties.PercSEC01)
    };
}
function apagarPercSecundarioConc01(e) {
    PercSecundarioConc01.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercSecundarioConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PercSEC01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercSecundarioConc01,
    });
}
var PercSecundarioConc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercSecundarioConc01,
    onEachFeature: onEachFeaturePercSecundarioConc01
});

let slidePercSecundarioConc01 = function(){
    var sliderPercSecundarioConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercSecundarioConc01, {
        start: [minPercSecundarioConc01, maxPercSecundarioConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercSecundarioConc01,
            'max': maxPercSecundarioConc01
        },
        });
    inputNumberMin.setAttribute("value",minPercSecundarioConc01);
    inputNumberMax.setAttribute("value",maxPercSecundarioConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPercSecundarioConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercSecundarioConc01.noUiSlider.set([null, this.value]);
    });

    sliderPercSecundarioConc01.noUiSlider.on('update',function(e){
        PercSecundarioConc01.eachLayer(function(layer){
            if(layer.feature.properties.PercSEC01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercSEC01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercSecundarioConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderPercSecundarioConc01.noUiSlider;
    $(slidersGeral).append(sliderPercSecundarioConc01);
} 

////////////------------------ Fim da Percentagem NIVEL ENSINO SECUNDÁRIO em 2001 -------------- \\\\\\

//////------- Percentagem Total NIVEL SECUNDÁRIO por Concelho em 2011-----////

var minPercSecundarioConc11 = 0;
var maxPercSecundarioConc11 = 0;


function EstiloPercSecundarioConc11(feature) {
    if( feature.properties.PercSEC11 < minPercSecundarioConc11 || minPercSecundarioConc11 === 0){
        minPercSecundarioConc11 = feature.properties.PercSEC11
    }
    if(feature.properties.PercSEC11 > maxPercSecundarioConc11 ){
        maxPercSecundarioConc11 = feature.properties.PercSEC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSecundarioConc(feature.properties.PercSEC11)
    };
}
function apagarPercSecundarioConc11(e) {
    PercSecundarioConc11.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercSecundarioConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PercSEC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercSecundarioConc11,
    });
}
var PercSecundarioConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercSecundarioConc11,
    onEachFeature: onEachFeaturePercSecundarioConc11
});

let slidePercSecundarioConc11 = function(){
    var sliderPercSecundarioConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercSecundarioConc11, {
        start: [minPercSecundarioConc11, maxPercSecundarioConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercSecundarioConc11,
            'max': maxPercSecundarioConc11
        },
        });
    inputNumberMin.setAttribute("value",minPercSecundarioConc11);
    inputNumberMax.setAttribute("value",maxPercSecundarioConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercSecundarioConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercSecundarioConc11.noUiSlider.set([null, this.value]);
    });

    sliderPercSecundarioConc11.noUiSlider.on('update',function(e){
        PercSecundarioConc11.eachLayer(function(layer){
            if(layer.feature.properties.PercSEC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercSEC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercSecundarioConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderPercSecundarioConc11.noUiSlider;
    $(slidersGeral).append(sliderPercSecundarioConc11);
} 

////////////------------------ Fim da Percentagem NIVEL ENSINO SECUNDÁRIO em 2011 -------------- \\\\\\

//////------- Percentagem Total NIVEL SECUNDÁRIO por Concelho em 2021-----////

var minPercSecundarioConc21 = 0;
var maxPercSecundarioConc21 = 0;


function EstiloPercSecundarioConc21(feature) {
    if( feature.properties.PercSEC21 < minPercSecundarioConc21 || minPercSecundarioConc21 === 0){
        minPercSecundarioConc21 = feature.properties.PercSEC21
    }
    if(feature.properties.PercSEC21 > maxPercSecundarioConc21 ){
        maxPercSecundarioConc21 = feature.properties.PercSEC21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSecundarioConc(feature.properties.PercSEC21)
    };
}
function apagarPercSecundarioConc21(e) {
    PercSecundarioConc21.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercSecundarioConc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PercSEC21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercSecundarioConc21,
    });
}
var PercSecundarioConc21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercSecundarioConc21,
    onEachFeature: onEachFeaturePercSecundarioConc21
});

let slidePercSecundarioConc21 = function(){
    var sliderPercSecundarioConc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercSecundarioConc21, {
        start: [minPercSecundarioConc21, maxPercSecundarioConc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercSecundarioConc21,
            'max': maxPercSecundarioConc21
        },
        });
    inputNumberMin.setAttribute("value",minPercSecundarioConc21);
    inputNumberMax.setAttribute("value",maxPercSecundarioConc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPercSecundarioConc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercSecundarioConc21.noUiSlider.set([null, this.value]);
    });

    sliderPercSecundarioConc21.noUiSlider.on('update',function(e){
        PercSecundarioConc21.eachLayer(function(layer){
            if(layer.feature.properties.PercSEC21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercSEC21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercSecundarioConc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderPercSecundarioConc21.noUiSlider;
    $(slidersGeral).append(sliderPercSecundarioConc21);
} 

////////////------------------ Fim da Percentagem NIVEL ENSINO SECUNDÁRIO em 2021 -------------- \\\\\\

//////------- Percentagem Total NIVEL SUPERIOR por Concelho em 2001-----////

var minPercSuperiorConc01 = 0;
var maxPercSuperiorConc01 = 0;

function CorPerSuperiorConc(d) {
    return d >= 29.10 ? '#8c0303' :
        d >= 24.65  ? '#de1f35' :
        d >= 17.25 ? '#ff5e6e' :
        d >= 9.84   ? '#f5b3be' :
        d >= 2.43   ? '#F2C572' :
                ''  ;
}
var legendaPerSuperiorConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 29.10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 24.65 - 29.10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 17.25 - 24.65' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 9.84 - 17.25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 2.43 - 9.84' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPercSuperiorConc01(feature) {
    if( feature.properties.PercES01 < minPercSuperiorConc01 || minPercSuperiorConc01 === 0){
        minPercSuperiorConc01 = feature.properties.PercES01
    }
    if(feature.properties.PercES01 > maxPercSuperiorConc01 ){
        maxPercSuperiorConc01 = feature.properties.PercES01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSuperiorConc(feature.properties.PercES01)
    };
}
function apagarPercSuperiorConc01(e) {
    PercSuperiorConc01.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercSuperiorConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PercES01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercSuperiorConc01,
    });
}
var PercSuperiorConc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercSuperiorConc01,
    onEachFeature: onEachFeaturePercSuperiorConc01
});

let slidePercSuperiorConc01 = function(){
    var sliderPercSuperiorConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercSuperiorConc01, {
        start: [minPercSuperiorConc01, maxPercSuperiorConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercSuperiorConc01,
            'max': maxPercSuperiorConc01
        },
        });
    inputNumberMin.setAttribute("value",minPercSuperiorConc01);
    inputNumberMax.setAttribute("value",maxPercSuperiorConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPercSuperiorConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercSuperiorConc01.noUiSlider.set([null, this.value]);
    });

    sliderPercSuperiorConc01.noUiSlider.on('update',function(e){
        PercSuperiorConc01.eachLayer(function(layer){
            if(layer.feature.properties.PercES01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercES01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercSuperiorConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderPercSuperiorConc01.noUiSlider;
    $(slidersGeral).append(sliderPercSuperiorConc01);
} 

////////////------------------ Fim da Percentagem NIVEL ENSINO SUPERIOR em 2001 -------------- \\\\\\


//////------- Percentagem Total NIVEL SUPERIOR por Concelho em 2011-----////

var minPercSuperiorConc11 = 0;
var maxPercSuperiorConc11 = 0;


function EstiloPercSuperiorConc11(feature) {
    if( feature.properties.PercES11 < minPercSuperiorConc11 || minPercSuperiorConc11 === 0){
        minPercSuperiorConc11 = feature.properties.PercES11
    }
    if(feature.properties.PercES11 > maxPercSuperiorConc11 ){
        maxPercSuperiorConc11 = feature.properties.PercES11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSuperiorConc(feature.properties.PercES11)
    };
}
function apagarPercSuperiorConc11(e) {
    PercSuperiorConc11.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercSuperiorConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PercES11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercSuperiorConc11,
    });
}
var PercSuperiorConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercSuperiorConc11,
    onEachFeature: onEachFeaturePercSuperiorConc11
});

let slidePercSuperiorConc11 = function(){
    var sliderPercSuperiorConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercSuperiorConc11, {
        start: [minPercSuperiorConc11, maxPercSuperiorConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercSuperiorConc11,
            'max': maxPercSuperiorConc11
        },
        });
    inputNumberMin.setAttribute("value",minPercSuperiorConc11);
    inputNumberMax.setAttribute("value",maxPercSuperiorConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercSuperiorConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercSuperiorConc11.noUiSlider.set([null, this.value]);
    });

    sliderPercSuperiorConc11.noUiSlider.on('update',function(e){
        PercSuperiorConc11.eachLayer(function(layer){
            if(layer.feature.properties.PercES11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercES11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercSuperiorConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderPercSuperiorConc11.noUiSlider;
    $(slidersGeral).append(sliderPercSuperiorConc11);
} 

////////////------------------ Fim da Percentagem NIVEL ENSINO SUPERIOR em 2011 -------------- \\\\\\


//////------- Percentagem Total NIVEL SUPERIOR por Concelho em 2021-----////

var minPercSuperiorConc21 = 0;
var maxPercSuperiorConc21 = 0;

function EstiloPercSuperiorConc21(feature) {
    if( feature.properties.PercES21 < minPercSuperiorConc21 || minPercSuperiorConc21 === 0){
        minPercSuperiorConc21 = feature.properties.PercES21
    }
    if(feature.properties.PercES21 > maxPercSuperiorConc21 ){
        maxPercSuperiorConc21 = feature.properties.PercES21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSuperiorConc(feature.properties.PercES21)
    };
}
function apagarPercSuperiorConc21(e) {
    PercSuperiorConc21.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercSuperiorConc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.PercES21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercSuperiorConc21,
    });
}
var PercSuperiorConc21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercSuperiorConc21,
    onEachFeature: onEachFeaturePercSuperiorConc21
});

let slidePercSuperiorConc21 = function(){
    var sliderPercSuperiorConc21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercSuperiorConc21, {
        start: [minPercSuperiorConc21, maxPercSuperiorConc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercSuperiorConc21,
            'max': maxPercSuperiorConc21
        },
        });
    inputNumberMin.setAttribute("value",minPercSuperiorConc21);
    inputNumberMax.setAttribute("value",maxPercSuperiorConc21);

    inputNumberMin.addEventListener('change', function(){
        sliderPercSuperiorConc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercSuperiorConc21.noUiSlider.set([null, this.value]);
    });

    sliderPercSuperiorConc21.noUiSlider.on('update',function(e){
        PercSuperiorConc21.eachLayer(function(layer){
            if(layer.feature.properties.PercES21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercES21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercSuperiorConc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderPercSuperiorConc21.noUiSlider;
    $(slidersGeral).append(sliderPercSuperiorConc21);
} 

////////////------------------ Fim da Percentagem NIVEL ENSINO SUPERIOR em 2021 -------------- \\\\\\

//////////////////// -------------------- FIM DADOS RELATIVOS CONCELHOS ---------\\\\\\\\\\\\\\\\\

/////////////////////------------------ VARIAÇÕES CONCELHOS --------------------\\\\\\\\\\\\\\            

////////////////////////////////-------  Variação do NÍVEL NENHUM ENTRE 2011 E 2001-----/////


var minVarNenhumConc11_01 = 0;
var maxVarNenhumConc11_01 = -999;

function CorVarNenhumConc11(d) {
    return d >= -20 ? '#9ebbd7' :
        d >= -25  ? '#2288bf' :
        d >= -30  ? '#155273' :
        d >= -36.89   ? '#0b2c40' :
                ''  ;
}
var legendaVarNenhumConc11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + '  > -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -25 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -30 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -36.89 a -30' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes sem algum nível de ensino, entre 2011 e 2001, por concelho.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarNenhumConc11_01(feature) {
    if(feature.properties.VarNenh11 <= minVarNenhumConc11_01 || minVarNenhumConc11_01 ===0){
        minVarNenhumConc11_01 = feature.properties.VarNenh11
    }
    if(feature.properties.VarNenh11 > maxVarNenhumConc11_01){
        maxVarNenhumConc11_01 = feature.properties.VarNenh11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarNenhumConc11(feature.properties.VarNenh11)};
}


function apagarVarNenhumConc11_01(e) {
    VarNenhumConc11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarNenhumConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarNenh11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarNenhumConc11_01,
    });
}
var VarNenhumConc11_01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarNenhumConc11_01,
    onEachFeature: onEachFeatureVarNenhumConc11_01
});

let slideVarNenhumConc11_01 = function(){
    var sliderVarNenhumConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 64){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarNenhumConc11_01, {
        start: [minVarNenhumConc11_01, maxVarNenhumConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarNenhumConc11_01,
            'max': maxVarNenhumConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarNenhumConc11_01);
    inputNumberMax.setAttribute("value",maxVarNenhumConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarNenhumConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarNenhumConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarNenhumConc11_01.noUiSlider.on('update',function(e){
        VarNenhumConc11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarNenh11>=parseFloat(e[0])&& layer.feature.properties.VarNenh11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarNenhumConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 64;
    sliderAtivo = sliderVarNenhumConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVarNenhumConc11_01);
} 

////////////////////--------------- Fim da Variação do NÍVEL NENHUM ENTRE 2011 E 2001 -------------- \\\\\\

////////////////////////////////-------  Variação do NÍVEL NENHUM ENTRE 2021 E 2011-----/////

var minVarNenhumConc21_11 = 0;
var maxVarNenhumConc21_11 = -999;

function CorVarNenhumConc21(d) {
    return d >= -25 ? '#9ebbd7' :
        d >= -30  ? '#2288bf' :
        d >= -33  ? '#155273' :
        d >= -36.84   ? '#0b2c40' :
                ''  ;
}
var legendaVarNenhumConc21 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + '  > -24' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -30 a -24' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -33 a -30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -36.84 a -33' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes sem algum nível de ensino, entre 2021 e 2011, por concelho.' + '</strong>')
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarNenhumConc21_11(feature) {
    if(feature.properties.VarNenh21 <= minVarNenhumConc21_11 || minVarNenhumConc21_11 ===0){
        minVarNenhumConc21_11 = feature.properties.VarNenh21
    }
    if(feature.properties.VarNenh21 > maxVarNenhumConc21_11){
        maxVarNenhumConc21_11 = feature.properties.VarNenh21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarNenhumConc21(feature.properties.VarNenh21)};
    }


function apagarVarNenhumConc21_11(e) {
    VarNenhumConc21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarNenhumConc21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarNenh21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarNenhumConc21_11,
    });
}
var VarNenhumConc21_11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarNenhumConc21_11,
    onEachFeature: onEachFeatureVarNenhumConc21_11
});

let slideVarNenhumConc21_11 = function(){
    var sliderVarNenhumConc21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarNenhumConc21_11, {
        start: [minVarNenhumConc21_11, maxVarNenhumConc21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarNenhumConc21_11,
            'max': maxVarNenhumConc21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarNenhumConc21_11);
    inputNumberMax.setAttribute("value",maxVarNenhumConc21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarNenhumConc21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarNenhumConc21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarNenhumConc21_11.noUiSlider.on('update',function(e){
        VarNenhumConc21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarNenh21>=parseFloat(e[0])&& layer.feature.properties.VarNenh21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarNenhumConc21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderVarNenhumConc21_11.noUiSlider;
    $(slidersGeral).append(sliderVarNenhumConc21_11);
} 

////////////////////--------------- Fim da Variação do NÍVEL NENHUM ENTRE 2021 E 2011 -------------- \\\\\\

////////////////////////////////-------  Variação do NÍVEL BÁSICO ENTRE 2011 E 2001-----/////

var minVarBasicoConc11_01 = 0;
var maxVarBasicoConc11_01 = -999;

function CorVarBasicoConc11(d) {
    return d >= 2.5 ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -11.58   ? '#2288bf' :
                ''  ;
}
var legendaVarBasicoConc11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -11.58 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com ensino básico, entre 2011 e 2001, por concelho.' + '</strong>')
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarBasicoConc11_01(feature) {
    if(feature.properties.VarEB11 <= minVarBasicoConc11_01){
        minVarBasicoConc11_01 = feature.properties.VarEB11
    }
    if(feature.properties.VarEB11 > maxVarBasicoConc11_01){
        maxVarBasicoConc11_01 = feature.properties.VarEB11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarBasicoConc11(feature.properties.VarEB11)};
    }


function apagarVarBasicoConc11_01(e) {
    VarBasicoConc11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarBasicoConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarEB11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarBasicoConc11_01,
    });
}
var VarBasicoConc11_01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarBasicoConc11_01,
    onEachFeature: onEachFeatureVarBasicoConc11_01
});

let slideVarBasicoConc11_01 = function(){
    var sliderVarBasicoConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarBasicoConc11_01, {
        start: [minVarBasicoConc11_01, maxVarBasicoConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarBasicoConc11_01,
            'max': maxVarBasicoConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarBasicoConc11_01);
    inputNumberMax.setAttribute("value",maxVarBasicoConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarBasicoConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarBasicoConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarBasicoConc11_01.noUiSlider.on('update',function(e){
        VarBasicoConc11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarEB11>=parseFloat(e[0])&& layer.feature.properties.VarEB11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarBasicoConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderVarBasicoConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVarBasicoConc11_01);
} 

////////////////////--------------- Fim da Variação do NÍVEL BÁSICO ENTRE 2011 E 2001 -------------- \\\\\\

////////////////////////////////-------  Variação do NÍVEL BÁSICO ENTRE 2021 E 2011-----/////

var minVarBasicoConc21_11 = 0;
var maxVarBasicoConc21_11 = -999;

function CorVarBasicoConc21(d) {
    return d >= -13 ? '#9ebbd7' :
        d >= -15  ? '#2288bf' :
        d >= -17  ? '#155273' :
        d >= -24.95   ? '#0b2c40' :
                ''  ;
}
var legendaVarBasicoConc21 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + '  > -13' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -15 a -13' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -17 a -15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -24.95 a -17' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com ensino básico, entre 2021 e 2011, por concelho.' + '</strong>')

    $(legendaA).append(symbolsContainer); 
}

function EstiloVarBasicoConc21_11(feature) {
    if(feature.properties.VarEB21 <= minVarBasicoConc21_11){
        minVarBasicoConc21_11 = feature.properties.VarEB21
    }
    if(feature.properties.VarEB21 > maxVarBasicoConc21_11){
        maxVarBasicoConc21_11 = feature.properties.VarEB21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarBasicoConc21(feature.properties.VarEB21)};
    }


function apagarVarBasicoConc21_11(e) {
    VarBasicoConc21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarBasicoConc21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarEB21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarBasicoConc21_11,
    });
}
var VarBasicoConc21_11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarBasicoConc21_11,
    onEachFeature: onEachFeatureVarBasicoConc21_11
});

let slideVarBasicoConc21_11 = function(){
    var sliderVarBasicoConc21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarBasicoConc21_11, {
        start: [minVarBasicoConc21_11, maxVarBasicoConc21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarBasicoConc21_11,
            'max': maxVarBasicoConc21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarBasicoConc21_11);
    inputNumberMax.setAttribute("value",maxVarBasicoConc21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarBasicoConc21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarBasicoConc21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarBasicoConc21_11.noUiSlider.on('update',function(e){
        VarBasicoConc21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarEB21>=parseFloat(e[0])&& layer.feature.properties.VarEB21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarBasicoConc21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderVarBasicoConc21_11.noUiSlider;
    $(slidersGeral).append(sliderVarBasicoConc21_11);
} 

////////////////////--------------- Fim da Variação do NÍVEL BÁSICO ENTRE 2021 E 2011 -------------- \\\\\\



////////////////////////////////-------  Variação do NÍVEL SECUNDÁRIO ENTRE 2011 E 2021-----/////

var minVarSecundarioConc11_01 = 0;
var maxVarSecundarioConc11_01 = 0;

function CorVarSecundarioConc11(d) {
    return d >= 15 ? '#8c0303' :
        d >= 13  ? '#de1f35' :
        d >= 11  ? '#ff5e6e' :
        d >= 9.54   ? '#f5b3be' :
                ''  ;
}
var legendaVarSecundarioConc11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 13 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 11 a 13' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 9.54 a 11' + '<br>'

    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com ensino secundário, entre 2011 e 2001, por concelho.' + '</strong>')
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarSecundarioConc11_01(feature) {
    if(feature.properties.PercSEC11 <= minVarSecundarioConc11_01 || minVarSecundarioConc11_01 ===0){
        minVarSecundarioConc11_01 = feature.properties.PercSEC11
    }
    if(feature.properties.PercSEC11 > maxVarSecundarioConc11_01){
        maxVarSecundarioConc11_01 = feature.properties.PercSEC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarSecundarioConc11(feature.properties.PercSEC11)};
    }


function apagarVarSecundarioConc11_01(e) {
    VarSecundarioConc11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarSecundarioConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.PercSEC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarSecundarioConc11_01,
    });
}
var VarSecundarioConc11_01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarSecundarioConc11_01,
    onEachFeature: onEachFeatureVarSecundarioConc11_01
});

let slideVarSecundarioConc11_01 = function(){
    var sliderVarSecundarioConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarSecundarioConc11_01, {
        start: [minVarSecundarioConc11_01, maxVarSecundarioConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarSecundarioConc11_01,
            'max': maxVarSecundarioConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarSecundarioConc11_01);
    inputNumberMax.setAttribute("value",maxVarSecundarioConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarSecundarioConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarSecundarioConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarSecundarioConc11_01.noUiSlider.on('update',function(e){
        VarSecundarioConc11_01.eachLayer(function(layer){
            if(layer.feature.properties.PercSEC11>=parseFloat(e[0])&& layer.feature.properties.PercSEC11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarSecundarioConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderVarSecundarioConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVarSecundarioConc11_01);
} 

////////////////////--------------- Fim da Variação do NÍVEL SECUNDÁRIO ENTRE 2011 E 2001 -------------- \\\\\\

////////////////////////////////-------  Variação do NÍVEL SECUNDÁRIO ENTRE 2021 E 2011-----/////

var minVarSecundarioConc21_11 = 0;
var maxVarSecundarioConc21_11 = 0;

function CorVarSecundarioConc21(d) {
    return d >= 22 ? '#8c0303' :
        d >= 20  ? '#de1f35' :
        d >= 18  ? '#ff5e6e' :
        d >= 16.66   ? '#f5b3be' :
                ''  ;
}
var legendaVarSecundarioConc21 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 22' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 20 a 22' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 18 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 16.66 a 18' + '<br>'

    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com ensino secundário, entre 2021 e 2011, por concelho.' + '</strong>');
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarSecundarioConc21_11(feature) {
    if(feature.properties.PercSEC21 <= minVarSecundarioConc21_11 || minVarSecundarioConc21_11 ===0){
        minVarSecundarioConc21_11 = feature.properties.PercSEC21
    }
    if(feature.properties.PercSEC21 > maxVarSecundarioConc21_11){
        maxVarSecundarioConc21_11 = feature.properties.PercSEC21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarSecundarioConc21(feature.properties.PercSEC21)};
    }


function apagarVarSecundarioConc21_11(e) {
    VarSecundarioConc21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarSecundarioConc21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.PercSEC21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarSecundarioConc21_11,
    });
}
var VarSecundarioConc21_11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarSecundarioConc21_11,
    onEachFeature: onEachFeatureVarSecundarioConc21_11
});

let slideVarSecundarioConc21_11 = function(){
    var sliderVarSecundarioConc21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarSecundarioConc21_11, {
        start: [minVarSecundarioConc21_11, maxVarSecundarioConc21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarSecundarioConc21_11,
            'max': maxVarSecundarioConc21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarSecundarioConc21_11);
    inputNumberMax.setAttribute("value",maxVarSecundarioConc21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarSecundarioConc21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarSecundarioConc21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarSecundarioConc21_11.noUiSlider.on('update',function(e){
        VarSecundarioConc21_11.eachLayer(function(layer){
            if(layer.feature.properties.PercSEC21>=parseFloat(e[0])&& layer.feature.properties.PercSEC21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarSecundarioConc21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderVarSecundarioConc21_11.noUiSlider;
    $(slidersGeral).append(sliderVarSecundarioConc21_11);
} 

////////////////////--------------- Fim da Variação do NÍVEL SECUNDÁRIO ENTRE 2021 E 2011 -------------- \\\\\\

////////////////////////////////-------  Variação do NÍVEL SUPERIOR ENTRE 2011 E 2001-----/////

var minVarSuperiorConc11_01 = 0;
var maxVarSuperiorConc11_01 = 0;

function CorVarSuperiorConc11(d) {
    return d >= 16 ? '#8c0303' :
        d >= 12  ? '#de1f35' :
        d >= 8   ? '#ff5e6e' :
        d >= 5.72   ? '#f5b3be' :
                ''  ;
}
var legendaVarSuperiorConc11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 16' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 12 a 16' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 8 a 12' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 5.72 a 8' + '<br>'

    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com ensino superior, entre 2011 e 2001, por concelho.' + '</strong>');
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarSuperiorConc11_01(feature) {
    if(feature.properties.PercES11 <= minVarSuperiorConc11_01 || minVarSuperiorConc11_01 ===0){
        minVarSuperiorConc11_01 = feature.properties.PercES11
    }
    if(feature.properties.PercES11 > maxVarSuperiorConc11_01){
        maxVarSuperiorConc11_01 = feature.properties.PercES11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarSuperiorConc11(feature.properties.PercES11)};
}


function apagarVarSuperiorConc11_01(e) {
    VarSuperiorConc11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarSuperiorConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.PercES11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarSuperiorConc11_01,
    });
}
var VarSuperiorConc11_01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarSuperiorConc11_01,
    onEachFeature: onEachFeatureVarSuperiorConc11_01
});

let slideVarSuperiorConc11_01 = function(){
    var sliderVarSuperiorConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarSuperiorConc11_01, {
        start: [minVarSuperiorConc11_01, maxVarSuperiorConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarSuperiorConc11_01,
            'max': maxVarSuperiorConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarSuperiorConc11_01);
    inputNumberMax.setAttribute("value",maxVarSuperiorConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarSuperiorConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarSuperiorConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarSuperiorConc11_01.noUiSlider.on('update',function(e){
        VarSuperiorConc11_01.eachLayer(function(layer){
            if(layer.feature.properties.PercES11>=parseFloat(e[0])&& layer.feature.properties.PercES11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarSuperiorConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderVarSuperiorConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVarSuperiorConc11_01);
} 

////////////////////--------------- Fim da Variação do NÍVEL SUPERIOR ENTRE 2011 E 2001 -------------- \\\\\\

////////////////////////////////-------  Variação do NÍVEL SUPERIOR ENTRE 2021 E 2011-----/////

var minVarSuperiorConc21_11 = 0;
var maxVarSuperiorConc21_11 = 0;

function CorVarSuperiorConc21(d) {
    return d >= 25 ? '#8c0303' :
        d >= 18  ? '#de1f35' :
        d >= 12   ? '#ff5e6e' :
        d >= 9.62   ? '#f5b3be' :
                ''  ;
}
var legendaVarSuperiorConc21 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 18 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 12 a 18' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 9.62 a 12' + '<br>'

    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com ensino superior, entre 2021 e 2011, por concelho.' + '</strong>');
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarSuperiorConc21_11(feature) {
    if(feature.properties.PercES21 <= minVarSuperiorConc21_11 || minVarSuperiorConc21_11 ===0){
        minVarSuperiorConc21_11 = feature.properties.PercES21
    }
    if(feature.properties.PercES21 > maxVarSuperiorConc21_11){
        maxVarSuperiorConc21_11 = feature.properties.PercES21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarSuperiorConc21(feature.properties.PercES21)};
    }


function apagarVarSuperiorConc21_11(e) {
    VarSuperiorConc21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarSuperiorConc21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.PercES21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarSuperiorConc21_11,
    });
}
var VarSuperiorConc21_11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarSuperiorConc21_11,
    onEachFeature: onEachFeatureVarSuperiorConc21_11
});

let slideVarSuperiorConc21_11 = function(){
    var sliderVarSuperiorConc21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarSuperiorConc21_11, {
        start: [minVarSuperiorConc21_11, maxVarSuperiorConc21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarSuperiorConc21_11,
            'max': maxVarSuperiorConc21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarSuperiorConc21_11);
    inputNumberMax.setAttribute("value",maxVarSuperiorConc21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarSuperiorConc21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarSuperiorConc21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarSuperiorConc21_11.noUiSlider.on('update',function(e){
        VarSuperiorConc21_11.eachLayer(function(layer){
            if(layer.feature.properties.PercES21>=parseFloat(e[0])&& layer.feature.properties.PercES21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarSuperiorConc21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderVarSuperiorConc21_11.noUiSlider;
    $(slidersGeral).append(sliderVarSuperiorConc21_11);
} 

////////////////////--------------- Fim da Variação do NÍVEL SUPERIOR ENTRE 2021 E 2011 -------------- \\\\\\

///////////////// ----------------- FIM DA VARIAÇÃO DE CONCELHOS -------------------\\\\\\\\\\\\\\\\\

/////////////////////////////////-------- FREGUESIAS ----------------------------\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - NENHUM Freguesias 2001 ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalNenhumFreg01 = 0;
var maxTotalNenhumFreg01 = 0;
function estiloTotalNenhumFreguesias01(feature, latlng) {
    if(feature.properties.Nenh01< minTotalNenhumFreg01 || minTotalNenhumFreg01 ===0){
        minTotalNenhumFreg01 = feature.properties.Nenh01
    }
    if(feature.properties.Nenh01> maxTotalNenhumFreg01){
        maxTotalNenhumFreg01 = feature.properties.Nenh01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Nenh01,0.15)
    });
}
function apagarTotalNenhumFreguesias01(e){
    var layer = e.target;
    TotalNenhumFreguesias01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalNenhumFreguesias01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.Nenh01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalNenhumFreguesias01,
    })
};

var TotalNenhumFreguesias01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloTotalNenhumFreguesias01,
    onEachFeature: onEachFeatureTotalNenhumFreguesias01,
});
var slideTotalNenhumFreguesias01 = function(){
    var sliderTotalNenhumFreguesias01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalNenhumFreguesias01, {
        start: [minTotalNenhumFreg01, maxTotalNenhumFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalNenhumFreg01,
            'max': maxTotalNenhumFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalNenhumFreg01);
    inputNumberMax.setAttribute("value",maxTotalNenhumFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalNenhumFreguesias01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalNenhumFreguesias01.noUiSlider.set([null, this.value]);
    });

    sliderTotalNenhumFreguesias01.noUiSlider.on('update',function(e){
        TotalNenhumFreguesias01.eachLayer(function(layer){
            if(layer.feature.properties.Nenh01>=parseFloat(e[0])&& layer.feature.properties.Nenh01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalNenhumFreguesias01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderTotalNenhumFreguesias01.noUiSlider;
    $(slidersGeral).append(sliderTotalNenhumFreguesias01);
}

/////////////////////------ FIM NIVEL DE ENSINO -  NENHUM FREGUESIAS 2001 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - NENHUM Freguesias 2011 ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalNenhumFreg11 = 0;
var maxTotalNenhumFreg11 = 0;
function estiloTotalNenhumFreguesias11(feature, latlng) {
    if(feature.properties.Nenh11< minTotalNenhumFreg11 || minTotalNenhumFreg11 ===0){
        minTotalNenhumFreg11 = feature.properties.Nenh11
    }
    if(feature.properties.Nenh11> maxTotalNenhumFreg11){
        maxTotalNenhumFreg11 = feature.properties.Nenh11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Nenh11,0.15)
    });
}
function apagarTotalNenhumFreguesias11(e){
    var layer = e.target;
    TotalNenhumFreguesias11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalNenhumFreguesias11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.Nenh11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalNenhumFreguesias11,
    })
};

var TotalNenhumFreguesias11= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloTotalNenhumFreguesias11,
    onEachFeature: onEachFeatureTotalNenhumFreguesias11,
});
var slideTotalNenhumFreguesias11 = function(){
    var sliderTotalNenhumFreguesias11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalNenhumFreguesias11, {
        start: [minTotalNenhumFreg11, maxTotalNenhumFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalNenhumFreg11,
            'max': maxTotalNenhumFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalNenhumFreg11);
    inputNumberMax.setAttribute("value",maxTotalNenhumFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalNenhumFreguesias11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalNenhumFreguesias11.noUiSlider.set([null, this.value]);
    });

    sliderTotalNenhumFreguesias11.noUiSlider.on('update',function(e){
        TotalNenhumFreguesias11.eachLayer(function(layer){
            if(layer.feature.properties.Nenh11>=parseFloat(e[0])&& layer.feature.properties.Nenh11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalNenhumFreguesias11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderTotalNenhumFreguesias11.noUiSlider;
    $(slidersGeral).append(sliderTotalNenhumFreguesias11);
}

/////////////////////------ FIM NIVEL DE ENSINO -  NENHUM FREGUESIAS 2011 --------\\\\\\\\\\\\\\\\\\\\\\


/////////////////////------ NIVEL DE ENSINO  - NENHUM Freguesias 2021 ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalNenhumFreg21 = 0;
var maxTotalNenhumFreg21 = 0;
function estiloTotalNenhumFreguesias21(feature, latlng) {
    if(feature.properties.Nenh21< minTotalNenhumFreg21 || minTotalNenhumFreg21 ===0){
        minTotalNenhumFreg21 = feature.properties.Nenh21
    }
    if(feature.properties.Nenh21> maxTotalNenhumFreg21){
        maxTotalNenhumFreg21 = feature.properties.Nenh21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Nenh21,0.15)
    });
}
function apagarTotalNenhumFreguesias21(e){
    var layer = e.target;
    TotalNenhumFreguesias21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalNenhumFreguesias21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.Nenh21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalNenhumFreguesias21,
    })
};

var TotalNenhumFreguesias21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloTotalNenhumFreguesias21,
    onEachFeature: onEachFeatureTotalNenhumFreguesias21,
});
var slideTotalNenhumFreguesias21 = function(){
    var sliderTotalNenhumFreguesias21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalNenhumFreguesias21, {
        start: [minTotalNenhumFreg21, maxTotalNenhumFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalNenhumFreg21,
            'max': maxTotalNenhumFreg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalNenhumFreg21);
    inputNumberMax.setAttribute("value",maxTotalNenhumFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalNenhumFreguesias21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalNenhumFreguesias21.noUiSlider.set([null, this.value]);
    });

    sliderTotalNenhumFreguesias21.noUiSlider.on('update',function(e){
        TotalNenhumFreguesias21.eachLayer(function(layer){
            if(layer.feature.properties.Nenh21>=parseFloat(e[0])&& layer.feature.properties.Nenh21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalNenhumFreguesias21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderTotalNenhumFreguesias21.noUiSlider;
    $(slidersGeral).append(sliderTotalNenhumFreguesias21);
}

/////////////////////------ FIM NIVEL DE ENSINO -  NENHUM FREGUESIAS 2021 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - BÁSICO Freguesias 2001 ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalBasicoFreg01 = 0;
var maxTotalBasicoFreg01 = 0;
function estiloTotalBasicoFreguesias01(feature, latlng) {
    if(feature.properties.EB01< minTotalBasicoFreg01 || minTotalBasicoFreg01 ===0){
        minTotalBasicoFreg01 = feature.properties.EB01
    }
    if(feature.properties.EB01> maxTotalBasicoFreg01){
        maxTotalBasicoFreg01 = feature.properties.EB01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.EB01,0.15)
    });
}
function apagarTotalBasicoFreguesias01(e){
    var layer = e.target;
    TotalBasicoFreguesias01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalBasicoFreguesias01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.EB01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalBasicoFreguesias01,
    })
};

var TotalBasicoFreguesias01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloTotalBasicoFreguesias01,
    onEachFeature: onEachFeatureTotalBasicoFreguesias01,
});
var slideTotalBasicoFreguesias01 = function(){
    var sliderTotalBasicoFreguesias01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalBasicoFreguesias01, {
        start: [minTotalBasicoFreg01, maxTotalBasicoFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalBasicoFreg01,
            'max': maxTotalBasicoFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalBasicoFreg01);
    inputNumberMax.setAttribute("value",maxTotalBasicoFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalBasicoFreguesias01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalBasicoFreguesias01.noUiSlider.set([null, this.value]);
    });

    sliderTotalBasicoFreguesias01.noUiSlider.on('update',function(e){
        TotalBasicoFreguesias01.eachLayer(function(layer){
            if(layer.feature.properties.EB01>=parseFloat(e[0])&& layer.feature.properties.EB01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalBasicoFreguesias01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderTotalBasicoFreguesias01.noUiSlider;
    $(slidersGeral).append(sliderTotalBasicoFreguesias01);
}

/////////////////////------ FIM NIVEL DE ENSINO -  BÁSICO FREGUESIAS 2001 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - BÁSICO Freguesias 2011 ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalBasicoFreg11 = 0;
var maxTotalBasicoFreg11 = 0;
function estiloTotalBasicoFreguesias11(feature, latlng) {
    if(feature.properties.EB11< minTotalBasicoFreg11 || minTotalBasicoFreg11 ===0){
        minTotalBasicoFreg11 = feature.properties.EB11
    }
    if(feature.properties.EB11> maxTotalBasicoFreg11){
        maxTotalBasicoFreg11 = feature.properties.EB11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.EB11,0.15)
    });
}
function apagarTotalBasicoFreguesias11(e){
    var layer = e.target;
    TotalBasicoFreguesias11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalBasicoFreguesias11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.EB11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalBasicoFreguesias11,
    })
};

var TotalBasicoFreguesias11= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloTotalBasicoFreguesias11,
    onEachFeature: onEachFeatureTotalBasicoFreguesias11,
});
var slideTotalBasicoFreguesias11 = function(){
    var sliderTotalBasicoFreguesias11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalBasicoFreguesias11, {
        start: [minTotalBasicoFreg11, maxTotalBasicoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalBasicoFreg11,
            'max': maxTotalBasicoFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalBasicoFreg11);
    inputNumberMax.setAttribute("value",maxTotalBasicoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalBasicoFreguesias11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalBasicoFreguesias11.noUiSlider.set([null, this.value]);
    });

    sliderTotalBasicoFreguesias11.noUiSlider.on('update',function(e){
        TotalBasicoFreguesias11.eachLayer(function(layer){
            if(layer.feature.properties.EB11>=parseFloat(e[0])&& layer.feature.properties.EB11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalBasicoFreguesias11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderTotalBasicoFreguesias11.noUiSlider;
    $(slidersGeral).append(sliderTotalBasicoFreguesias11);
}

/////////////////////------ FIM NIVEL DE ENSINO -  BÁSICO FREGUESIAS 2011 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - BÁSICO Freguesias 2021 ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalBasicoFreg21 = 0;
var maxTotalBasicoFreg21 = 0;
function estiloTotalBasicoFreguesias21(feature, latlng) {
    if(feature.properties.EB21< minTotalBasicoFreg21 || minTotalBasicoFreg21 ===0){
        minTotalBasicoFreg21 = feature.properties.EB21
    }
    if(feature.properties.EB21> maxTotalBasicoFreg21){
        maxTotalBasicoFreg21 = feature.properties.EB21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.EB21,0.15)
    });
}
function apagarTotalBasicoFreguesias21(e){
    var layer = e.target;
    TotalBasicoFreguesias21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalBasicoFreguesias21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.EB21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalBasicoFreguesias21,
    })
};

var TotalBasicoFreguesias21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloTotalBasicoFreguesias21,
    onEachFeature: onEachFeatureTotalBasicoFreguesias21,
});
var slideTotalBasicoFreguesias21 = function(){
    var sliderTotalBasicoFreguesias21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalBasicoFreguesias21, {
        start: [minTotalBasicoFreg21, maxTotalBasicoFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalBasicoFreg21,
            'max': maxTotalBasicoFreg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalBasicoFreg21);
    inputNumberMax.setAttribute("value",maxTotalBasicoFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalBasicoFreguesias21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalBasicoFreguesias21.noUiSlider.set([null, this.value]);
    });

    sliderTotalBasicoFreguesias21.noUiSlider.on('update',function(e){
        TotalBasicoFreguesias21.eachLayer(function(layer){
            if(layer.feature.properties.EB21>=parseFloat(e[0])&& layer.feature.properties.EB21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalBasicoFreguesias21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderTotalBasicoFreguesias21.noUiSlider;
    $(slidersGeral).append(sliderTotalBasicoFreguesias21);
}

/////////////////////------ FIM NIVEL DE ENSINO -  BÁSICO FREGUESIAS 2021 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - SECUNDÁRIO Freguesias 2001 ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalSecundarioFreg01 = 0;
var maxTotalSecundarioFreg01 = 0;
function estiloTotalSecundarioFreguesias01(feature, latlng) {
    if(feature.properties.SEC01< minTotalSecundarioFreg01 || minTotalSecundarioFreg01 ===0){
        minTotalSecundarioFreg01 = feature.properties.SEC01
    }
    if(feature.properties.SEC01> maxTotalSecundarioFreg01){
        maxTotalSecundarioFreg01 = feature.properties.SEC01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.SEC01,0.15)
    });
}
function apagarTotalSecundarioFreguesias01(e){
    var layer = e.target;
    TotalSecundarioFreguesias01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalSecundarioFreguesias01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.SEC01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalSecundarioFreguesias01,
    })
};

var TotalSecundarioFreguesias01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloTotalSecundarioFreguesias01,
    onEachFeature: onEachFeatureTotalSecundarioFreguesias01,
});
var slideTotalSecundarioFreguesias01 = function(){
    var sliderTotalSecundarioFreguesias01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalSecundarioFreguesias01, {
        start: [minTotalSecundarioFreg01, maxTotalSecundarioFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalSecundarioFreg01,
            'max': maxTotalSecundarioFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalSecundarioFreg01);
    inputNumberMax.setAttribute("value",maxTotalSecundarioFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalSecundarioFreguesias01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalSecundarioFreguesias01.noUiSlider.set([null, this.value]);
    });

    sliderTotalSecundarioFreguesias01.noUiSlider.on('update',function(e){
        TotalSecundarioFreguesias01.eachLayer(function(layer){
            if(layer.feature.properties.SEC01>=parseFloat(e[0])&& layer.feature.properties.SEC01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalSecundarioFreguesias01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderTotalSecundarioFreguesias01.noUiSlider;
    $(slidersGeral).append(sliderTotalSecundarioFreguesias01);
}

/////////////////////------ FIM NIVEL DE ENSINO -  SECUNDÁRIO FREGUESIAS 2001 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - SECUNDÁRIO Freguesias 2011 ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalSecundarioFreg11 = 0;
var maxTotalSecundarioFreg11 = 0;
function estiloTotalSecundarioFreguesias11(feature, latlng) {
    if(feature.properties.SEC11< minTotalSecundarioFreg11 || minTotalSecundarioFreg11 ===0){
        minTotalSecundarioFreg11 = feature.properties.SEC11
    }
    if(feature.properties.SEC11> maxTotalSecundarioFreg11){
        maxTotalSecundarioFreg11 = feature.properties.SEC11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.SEC11,0.15)
    });
}
function apagarTotalSecundarioFreguesias11(e){
    var layer = e.target;
    TotalSecundarioFreguesias11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalSecundarioFreguesias11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.SEC11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalSecundarioFreguesias11,
    })
};

var TotalSecundarioFreguesias11= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloTotalSecundarioFreguesias11,
    onEachFeature: onEachFeatureTotalSecundarioFreguesias11,
});
var slideTotalSecundarioFreguesias11 = function(){
    var sliderTotalSecundarioFreguesias11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 39){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalSecundarioFreguesias11, {
        start: [minTotalSecundarioFreg11, maxTotalSecundarioFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalSecundarioFreg11,
            'max': maxTotalSecundarioFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalSecundarioFreg11);
    inputNumberMax.setAttribute("value",maxTotalSecundarioFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalSecundarioFreguesias11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalSecundarioFreguesias11.noUiSlider.set([null, this.value]);
    });

    sliderTotalSecundarioFreguesias11.noUiSlider.on('update',function(e){
        TotalSecundarioFreguesias11.eachLayer(function(layer){
            if(layer.feature.properties.SEC11>=parseFloat(e[0])&& layer.feature.properties.SEC11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalSecundarioFreguesias11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 39;
    sliderAtivo = sliderTotalSecundarioFreguesias11.noUiSlider;
    $(slidersGeral).append(sliderTotalSecundarioFreguesias11);
}

/////////////////////------ FIM NIVEL DE ENSINO -  SECUNDÁRIO FREGUESIAS 2011 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - SECUNDÁRIO Freguesias 2021 ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalSecundarioFreg21 = 0;
var maxTotalSecundarioFreg21 = 0;
function estiloTotalSecundarioFreguesias21(feature, latlng) {
    if(feature.properties.SEC21< minTotalSecundarioFreg21 || minTotalSecundarioFreg21 ===0){
        minTotalSecundarioFreg21 = feature.properties.SEC21
    }
    if(feature.properties.SEC21> maxTotalSecundarioFreg21){
        maxTotalSecundarioFreg21 = feature.properties.SEC21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.SEC21,0.15)
    });
}
function apagarTotalSecundarioFreguesias21(e){
    var layer = e.target;
    TotalSecundarioFreguesias21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalSecundarioFreguesias21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.SEC21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalSecundarioFreguesias21,
    })
};

var TotalSecundarioFreguesias21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloTotalSecundarioFreguesias21,
    onEachFeature: onEachFeatureTotalSecundarioFreguesias21,
});
var slideTotalSecundarioFreguesias21 = function(){
    var sliderTotalSecundarioFreguesias21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalSecundarioFreguesias21, {
        start: [minTotalSecundarioFreg21, maxTotalSecundarioFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalSecundarioFreg21,
            'max': maxTotalSecundarioFreg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalSecundarioFreg21);
    inputNumberMax.setAttribute("value",maxTotalSecundarioFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalSecundarioFreguesias21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalSecundarioFreguesias21.noUiSlider.set([null, this.value]);
    });

    sliderTotalSecundarioFreguesias21.noUiSlider.on('update',function(e){
        TotalSecundarioFreguesias21.eachLayer(function(layer){
            if(layer.feature.properties.SEC21>=parseFloat(e[0])&& layer.feature.properties.SEC21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalSecundarioFreguesias21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderTotalSecundarioFreguesias21.noUiSlider;
    $(slidersGeral).append(sliderTotalSecundarioFreguesias21);
}

/////////////////////------ FIM NIVEL DE ENSINO -  SECUNDÁRIO FREGUESIAS 2021 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - Superior Freguesias 2001 ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalSuperiorFreg01 = 0;
var maxTotalSuperiorFreg01 = 0;
function estiloTotalSuperiorFreguesias01(feature, latlng) {
    if(feature.properties.ES01< minTotalSuperiorFreg01 || minTotalSuperiorFreg01 ===0){
        minTotalSuperiorFreg01 = feature.properties.ES01
    }
    if(feature.properties.ES01> maxTotalSuperiorFreg01){
        maxTotalSuperiorFreg01 = feature.properties.ES01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ES01,0.15)
    });
}
function apagarTotalSuperiorFreguesias01(e){
    var layer = e.target;
    TotalSuperiorFreguesias01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalSuperiorFreguesias01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.ES01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalSuperiorFreguesias01,
    })
};

var TotalSuperiorFreguesias01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloTotalSuperiorFreguesias01,
    onEachFeature: onEachFeatureTotalSuperiorFreguesias01,
});
var slideTotalSuperiorFreguesias01 = function(){
    var sliderTotalSuperiorFreguesias01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalSuperiorFreguesias01, {
        start: [minTotalSuperiorFreg01, maxTotalSuperiorFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalSuperiorFreg01,
            'max': maxTotalSuperiorFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalSuperiorFreg01);
    inputNumberMax.setAttribute("value",maxTotalSuperiorFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalSuperiorFreguesias01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalSuperiorFreguesias01.noUiSlider.set([null, this.value]);
    });

    sliderTotalSuperiorFreguesias01.noUiSlider.on('update',function(e){
        TotalSuperiorFreguesias01.eachLayer(function(layer){
            if(layer.feature.properties.SEC01>=parseFloat(e[0])&& layer.feature.properties.SEC01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalSuperiorFreguesias01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderTotalSuperiorFreguesias01.noUiSlider;
    $(slidersGeral).append(sliderTotalSuperiorFreguesias01);
}

/////////////////////------ FIM NIVEL DE ENSINO -  SUPERIOR FREGUESIAS 2001 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - SECUNDÁRIO Freguesias 2011 ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalSuperiorFreg11 = 0;
var maxTotalSuperiorFreg11 = 0;
function estiloTotalSuperiorFreguesias11(feature, latlng) {
    if(feature.properties.ES11< minTotalSuperiorFreg11 || minTotalSuperiorFreg11 ===0){
        minTotalSuperiorFreg11 = feature.properties.ES11
    }
    if(feature.properties.ES11> maxTotalSuperiorFreg11){
        maxTotalSuperiorFreg11 = feature.properties.ES11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ES11,0.15)
    });
}
function apagarTotalSuperiorFreguesias11(e){
    var layer = e.target;
    TotalSuperiorFreguesias11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalSuperiorFreguesias11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.ES11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalSuperiorFreguesias11,
    })
};

var TotalSuperiorFreguesias11= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloTotalSuperiorFreguesias11,
    onEachFeature: onEachFeatureTotalSuperiorFreguesias11,
});
var slideTotalSuperiorFreguesias11 = function(){
    var sliderTotalSuperiorFreguesias11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 42){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalSuperiorFreguesias11, {
        start: [minTotalSuperiorFreg11, maxTotalSuperiorFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalSuperiorFreg11,
            'max': maxTotalSuperiorFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalSuperiorFreg11);
    inputNumberMax.setAttribute("value",maxTotalSuperiorFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalSuperiorFreguesias11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalSuperiorFreguesias11.noUiSlider.set([null, this.value]);
    });

    sliderTotalSuperiorFreguesias11.noUiSlider.on('update',function(e){
        TotalSuperiorFreguesias11.eachLayer(function(layer){
            if(layer.feature.properties.ES11>=parseFloat(e[0])&& layer.feature.properties.ES11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalSuperiorFreguesias11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 42;
    sliderAtivo = sliderTotalSuperiorFreguesias11.noUiSlider;
    $(slidersGeral).append(sliderTotalSuperiorFreguesias11);
}

/////////////////////------ FIM NIVEL DE ENSINO -  SECUNDÁRIO FREGUESIAS 2011 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ NIVEL DE ENSINO  - SECUNDÁRIO Freguesias 2021 ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalSuperiorFreg21 = 0;
var maxTotalSuperiorFreg21 = 0;
function estiloTotalSuperiorFreguesias21(feature, latlng) {
    if(feature.properties.ES21< minTotalSuperiorFreg21 || minTotalSuperiorFreg21 ===0){
        minTotalSuperiorFreg21 = feature.properties.ES21
    }
    if(feature.properties.ES21> maxTotalSuperiorFreg21){
        maxTotalSuperiorFreg21 = feature.properties.ES21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ES21,0.15)
    });
}
function apagarTotalSuperiorFreguesias21(e){
    var layer = e.target;
    TotalSuperiorFreguesias21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalSuperiorFreguesias21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Residentes: ' + '<b>' + feature.properties.ES21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalSuperiorFreguesias21,
    })
};

var TotalSuperiorFreguesias21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloTotalSuperiorFreguesias21,
    onEachFeature: onEachFeatureTotalSuperiorFreguesias21,
});
var slideTotalSuperiorFreguesias21 = function(){
    var sliderTotalSuperiorFreguesias21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 43){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalSuperiorFreguesias21, {
        start: [minTotalSuperiorFreg21, maxTotalSuperiorFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalSuperiorFreg21,
            'max': maxTotalSuperiorFreg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalSuperiorFreg21);
    inputNumberMax.setAttribute("value",maxTotalSuperiorFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalSuperiorFreguesias21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalSuperiorFreguesias21.noUiSlider.set([null, this.value]);
    });

    sliderTotalSuperiorFreguesias21.noUiSlider.on('update',function(e){
        TotalSuperiorFreguesias21.eachLayer(function(layer){
            if(layer.feature.properties.ES21>=parseFloat(e[0])&& layer.feature.properties.ES21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalSuperiorFreguesias21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 43;
    sliderAtivo = sliderTotalSuperiorFreguesias21.noUiSlider;
    $(slidersGeral).append(sliderTotalSuperiorFreguesias21);
}

/////////////////////------ FIM NIVEL DE ENSINO -  SECUNDÁRIO FREGUESIAS 2021 --------\\\\\\\\\\\\\\\\\\\\\\

/////////////////// --------------- FIM DADOS ABSOLUTOS FREGUESIAS --------------------------------------
///////////////////----------------- DADOS RELATIVOS FREGUESIAS ----------------\\\\\\\\\\\\\\\\\\\\\\\

//////------- Percentagem Total NIVEL NENHUM por FREGUEIAS em 2001-----////

var minPercNenhumFreg01 = 0;
var maxPercNenhumFreg01 = 0;

function CorPerNenhumFreg(d) {
    return d >= 48.91 ? '#8c0303' :
        d >= 42.42  ? '#de1f35' :
        d >= 31.62 ? '#ff5e6e' :
        d >= 20.81   ? '#f5b3be' :
        d >= 10   ? '#F2C572' :
                ''  ;
}
var legendaPerNenhumFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 48.91' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 42.42 - 48.91' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 31.62 - 42.42' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 20.81 - 31.62' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 10 - 20.81' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPercNenhumFreg01(feature) {
    if( feature.properties.PercNen01 < minPercNenhumFreg01 || minPercNenhumFreg01 === 0){
        minPercNenhumFreg01 = feature.properties.PercNen01
    }
    if(feature.properties.PercNen01 > maxPercNenhumFreg01 ){
        maxPercNenhumFreg01 = feature.properties.PercNen01
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
function apagarPercNenhumFreg01(e) {
    PercNenhumFreg01.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercNenhumFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PercNen01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercNenhumFreg01,
    });
}
var PercNenhumFreg01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPercNenhumFreg01,
    onEachFeature: onEachFeaturePercNenhumFreg01
});

let slidePercNenhumFreg01 = function(){
    var sliderPercNenhumFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 44){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercNenhumFreg01, {
        start: [minPercNenhumFreg01, maxPercNenhumFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercNenhumFreg01,
            'max': maxPercNenhumFreg01
        },
        });
    inputNumberMin.setAttribute("value",minPercNenhumFreg01);
    inputNumberMax.setAttribute("value",maxPercNenhumFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPercNenhumFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercNenhumFreg01.noUiSlider.set([null, this.value]);
    });

    sliderPercNenhumFreg01.noUiSlider.on('update',function(e){
        PercNenhumFreg01.eachLayer(function(layer){
            if(layer.feature.properties.PercNen01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercNen01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercNenhumFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 44;
    sliderAtivo = sliderPercNenhumFreg01.noUiSlider;
    $(slidersGeral).append(sliderPercNenhumFreg01);
} 

////////////------------------ Fim da Percentagem NIVEL NENHUM em 2001 Freguesias -------------- \\\\\\

/////------- Percentagem Total NIVEL NENHUM por FREGUEIAS em 2011-----////

var minPercNenhumFreg11 = 0;
var maxPercNenhumFreg11 = 0;


function EstiloPercNenhumFreg11(feature) {
    if( feature.properties.PercNen11 < minPercNenhumFreg11 || minPercNenhumFreg11 === 0){
        minPercNenhumFreg11 = feature.properties.PercNen11
    }
    if(feature.properties.PercNen11 > maxPercNenhumFreg11 ){
        maxPercNenhumFreg11 = feature.properties.PercNen11
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
function apagarPercNenhumFreg11(e) {
    PercNenhumFreg11.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercNenhumFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PercNen11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercNenhumFreg11,
    });
}
var PercNenhumFreg11= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPercNenhumFreg11,
    onEachFeature: onEachFeaturePercNenhumFreg11
});

let slidePercNenhumFreg11 = function(){
    var sliderPercNenhumFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercNenhumFreg11, {
        start: [minPercNenhumFreg11, maxPercNenhumFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercNenhumFreg11,
            'max': maxPercNenhumFreg11
        },
        });
    inputNumberMin.setAttribute("value",minPercNenhumFreg11);
    inputNumberMax.setAttribute("value",maxPercNenhumFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercNenhumFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercNenhumFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPercNenhumFreg11.noUiSlider.on('update',function(e){
        PercNenhumFreg11.eachLayer(function(layer){
            if(layer.feature.properties.PercNen11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercNen11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercNenhumFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderPercNenhumFreg11.noUiSlider;
    $(slidersGeral).append(sliderPercNenhumFreg11);
} 

////////////------------------ Fim da Percentagem NIVEL NENHUM em 2011 Freguesias -------------- \\\\\\

/////------- Percentagem Total NIVEL NENHUM por FREGUEIAS em 2021-----////

var minPercNenhumFreg21 = 0;
var maxPercNenhumFreg21 = 0;


function EstiloPercNenhumFreg21(feature) {
    if( feature.properties.PercNen21 < minPercNenhumFreg21 || minPercNenhumFreg21 === 0){
        minPercNenhumFreg21 = feature.properties.PercNen21
    }
    if(feature.properties.PercNen21 > maxPercNenhumFreg21 ){
        maxPercNenhumFreg21 = feature.properties.PercNen21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerNenhumFreg(feature.properties.PercNen21)
    };
}
function apagarPercNenhumFreg21(e) {
    PercNenhumFreg21.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercNenhumFreg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PercNen21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercNenhumFreg21,
    });
}
var PercNenhumFreg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPercNenhumFreg21,
    onEachFeature: onEachFeaturePercNenhumFreg21
});

let slidePercNenhumFreg21 = function(){
    var sliderPercNenhumFreg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 46){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercNenhumFreg21, {
        start: [minPercNenhumFreg21, maxPercNenhumFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercNenhumFreg21,
            'max': maxPercNenhumFreg21
        },
        });
    inputNumberMin.setAttribute("value",minPercNenhumFreg21);
    inputNumberMax.setAttribute("value",maxPercNenhumFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPercNenhumFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercNenhumFreg21.noUiSlider.set([null, this.value]);
    });

    sliderPercNenhumFreg21.noUiSlider.on('update',function(e){
        PercNenhumFreg21.eachLayer(function(layer){
            if(layer.feature.properties.PercNen21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercNen21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercNenhumFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 46;
    sliderAtivo = sliderPercNenhumFreg21.noUiSlider;
    $(slidersGeral).append(sliderPercNenhumFreg21);
} 

////////////------------------ Fim da Percentagem NIVEL NENHUM em 2021 Freguesias -------------- \\\\\\

//////------- Percentagem Total NIVEL BÁSICO por FREGUEIAS em 2001-----////

var minPercBasicoFreg01 = 0;
var maxPercBasicoFreg01 = 0;

function CorPerBasicoFreg(d) {
    return d >= 67.79 ? '#8c0303' :
        d >= 61.74  ? '#de1f35' :
        d >= 51.65 ? '#ff5e6e' :
        d >= 41.55   ? '#f5b3be' :
        d >= 31.46   ? '#F2C572' :
                ''  ;
}
var legendaPerBasicoFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 67.79' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 61.74 - 67.79' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 51.65 - 61.74' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 41.55 - 51.65' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 31.46 - 41.55' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPercBasicoFreg01(feature) {
    if( feature.properties.PercEB01 < minPercBasicoFreg01 || minPercBasicoFreg01 === 0){
        minPercBasicoFreg01 = feature.properties.PercEB01
    }
    if(feature.properties.PercEB01 > maxPercBasicoFreg01 ){
        maxPercBasicoFreg01 = feature.properties.PercEB01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerBasicoFreg(feature.properties.PercEB01)
    };
}
function apagarPercBasicoFreg01(e) {
    PercBasicoFreg01.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercBasicoFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PercEB01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercBasicoFreg01,
    });
}
var PercBasicoFreg01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPercBasicoFreg01,
    onEachFeature: onEachFeaturePercBasicoFreg01
});

let slidePercBasicoFreg01 = function(){
    var sliderPercBasicoFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 47){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercBasicoFreg01, {
        start: [minPercBasicoFreg01, maxPercBasicoFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercBasicoFreg01,
            'max': maxPercBasicoFreg01
        },
        });
    inputNumberMin.setAttribute("value",minPercBasicoFreg01);
    inputNumberMax.setAttribute("value",maxPercBasicoFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPercBasicoFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercBasicoFreg01.noUiSlider.set([null, this.value]);
    });

    sliderPercBasicoFreg01.noUiSlider.on('update',function(e){
        PercBasicoFreg01.eachLayer(function(layer){
            if(layer.feature.properties.PercEB01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercEB01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercBasicoFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 47;
    sliderAtivo = sliderPercBasicoFreg01.noUiSlider;
    $(slidersGeral).append(sliderPercBasicoFreg01);
} 

////////////------------------ Fim da Percentagem NIVEL BÁSICO em 2001 Freguesias -------------- \\\\\

//////------- Percentagem Total NIVEL BÁSICO por FREGUEIAS em 2011-----////

var minPercBasicoFreg11 = 0;
var maxPercBasicoFreg11 = 0;


function EstiloPercBasicoFreg11(feature) {
    if( feature.properties.PercEB11 < minPercBasicoFreg11 || minPercBasicoFreg11 === 0){
        minPercBasicoFreg11 = feature.properties.PercEB11
    }
    if(feature.properties.PercEB11 > maxPercBasicoFreg11 ){
        maxPercBasicoFreg11 = feature.properties.PercEB11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerBasicoFreg(feature.properties.PercEB11)
    };
}
function apagarPercBasicoFreg11(e) {
    PercBasicoFreg11.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercBasicoFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PercEB11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercBasicoFreg11,
    });
}
var PercBasicoFreg11= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPercBasicoFreg11,
    onEachFeature: onEachFeaturePercBasicoFreg11
});

let slidePercBasicoFreg11 = function(){
    var sliderPercBasicoFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 48){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercBasicoFreg11, {
        start: [minPercBasicoFreg11, maxPercBasicoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercBasicoFreg11,
            'max': maxPercBasicoFreg11
        },
        });
    inputNumberMin.setAttribute("value",minPercBasicoFreg11);
    inputNumberMax.setAttribute("value",maxPercBasicoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercBasicoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercBasicoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPercBasicoFreg11.noUiSlider.on('update',function(e){
        PercBasicoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.PercEB11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercEB11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercBasicoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 48;
    sliderAtivo = sliderPercBasicoFreg11.noUiSlider;
    $(slidersGeral).append(sliderPercBasicoFreg11);
} 

////////////------------------ Fim da Percentagem NIVEL BÁSICO em 2011 Freguesias -------------- \\\\\

//////------- Percentagem Total NIVEL BÁSICO por FREGUEIAS em 2021-----////

var minPercBasicoFreg21 = 0;
var maxPercBasicoFreg21 = 0;

function EstiloPercBasicoFreg21(feature) {
    if( feature.properties.PercEB21 < minPercBasicoFreg21 || minPercBasicoFreg21 === 0){
        minPercBasicoFreg21 = feature.properties.PercEB21
    }
    if(feature.properties.PercEB21 > maxPercBasicoFreg21 ){
        maxPercBasicoFreg21 = feature.properties.PercEB21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerBasicoFreg(feature.properties.PercEB21)
    };
}
function apagarPercBasicoFreg21(e) {
    PercBasicoFreg21.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercBasicoFreg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PercEB21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercBasicoFreg21,
    });
}
var PercBasicoFreg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPercBasicoFreg21,
    onEachFeature: onEachFeaturePercBasicoFreg21
});

let slidePercBasicoFreg21 = function(){
    var sliderPercBasicoFreg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 49){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercBasicoFreg21, {
        start: [minPercBasicoFreg21, maxPercBasicoFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercBasicoFreg21,
            'max': maxPercBasicoFreg21
        },
        });
    inputNumberMin.setAttribute("value",minPercBasicoFreg21);
    inputNumberMax.setAttribute("value",maxPercBasicoFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPercBasicoFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercBasicoFreg21.noUiSlider.set([null, this.value]);
    });

    sliderPercBasicoFreg21.noUiSlider.on('update',function(e){
        PercBasicoFreg21.eachLayer(function(layer){
            if(layer.feature.properties.PercEB21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercEB21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercBasicoFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 49;
    sliderAtivo = sliderPercBasicoFreg21.noUiSlider;
    $(slidersGeral).append(sliderPercBasicoFreg21);
} 

////////////------------------ Fim da Percentagem NIVEL BÁSICO em 2021 Freguesias -------------- \\\\\

//////------- Percentagem Total NIVEL SECUNDARIO por FREGUEIAS em 2001-----////

var minPercSecundarioFreg01 = 0;
var maxPercSecundarioFreg01 = 0;

function CorPerSecundarioFreg(d) {
    return d >= 23.18 ? '#8c0303' :
        d >= 19.59  ? '#de1f35' :
        d >= 13.6 ? '#ff5e6e' :
        d >= 7.60   ? '#f5b3be' :
        d >= 1.61   ? '#F2C572' :
                ''  ;
}
var legendaPerSecundarioFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 23.18' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 19.59 - 23.18' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 13.6 - 19.59' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 7.60 - 13.6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 1.61 - 7.60' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPercSecundarioFreg01(feature) {
    if( feature.properties.PercSEC01 < minPercSecundarioFreg01 || minPercSecundarioFreg01 === 0){
        minPercSecundarioFreg01 = feature.properties.PercSEC01
    }
    if(feature.properties.PercSEC01 > maxPercSecundarioFreg01 ){
        maxPercSecundarioFreg01 = feature.properties.PercSEC01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSecundarioFreg(feature.properties.PercSEC01)
    };
}
function apagarPercSecundarioFreg01(e) {
    PercSecundarioFreg01.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercSecundarioFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PercSEC01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercSecundarioFreg01,
    });
}
var PercSecundarioFreg01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPercSecundarioFreg01,
    onEachFeature: onEachFeaturePercSecundarioFreg01
});

let slidePercSecundarioFreg01 = function(){
    var sliderPercSecundarioFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 50){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercSecundarioFreg01, {
        start: [minPercSecundarioFreg01, maxPercSecundarioFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercSecundarioFreg01,
            'max': maxPercSecundarioFreg01
        },
        });
    inputNumberMin.setAttribute("value",minPercSecundarioFreg01);
    inputNumberMax.setAttribute("value",maxPercSecundarioFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPercSecundarioFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercSecundarioFreg01.noUiSlider.set([null, this.value]);
    });

    sliderPercSecundarioFreg01.noUiSlider.on('update',function(e){
        PercSecundarioFreg01.eachLayer(function(layer){
            if(layer.feature.properties.PercSEC01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercSEC01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercSecundarioFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 50;
    sliderAtivo = sliderPercSecundarioFreg01.noUiSlider;
    $(slidersGeral).append(sliderPercSecundarioFreg01);
} 

////////////------------------ Fim da Percentagem NIVEL SECUNDÁRIO em 2001 Freguesias -------------- \\\\\

//////------- Percentagem Total NIVEL SECUNDARIO por FREGUEIAS em 2011-----////

var minPercSecundarioFreg11 = 0;
var maxPercSecundarioFreg11 = 0;


function EstiloPercSecundarioFreg11(feature) {
    if( feature.properties.PercSEC11 < minPercSecundarioFreg11 || minPercSecundarioFreg11 === 0){
        minPercSecundarioFreg11 = feature.properties.PercSEC11
    }
    if(feature.properties.PercSEC11 > maxPercSecundarioFreg11 ){
        maxPercSecundarioFreg11 = feature.properties.PercSEC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSecundarioFreg(feature.properties.PercSEC11)
    };
}
function apagarPercSecundarioFreg11(e) {
    PercSecundarioFreg11.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercSecundarioFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PercSEC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercSecundarioFreg11,
    });
}
var PercSecundarioFreg11= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPercSecundarioFreg11,
    onEachFeature: onEachFeaturePercSecundarioFreg11
});

let slidePercSecundarioFreg11 = function(){
    var sliderPercSecundarioFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 51){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercSecundarioFreg11, {
        start: [minPercSecundarioFreg11, maxPercSecundarioFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercSecundarioFreg11,
            'max': maxPercSecundarioFreg11
        },
        });
    inputNumberMin.setAttribute("value",minPercSecundarioFreg11);
    inputNumberMax.setAttribute("value",maxPercSecundarioFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercSecundarioFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercSecundarioFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPercSecundarioFreg11.noUiSlider.on('update',function(e){
        PercSecundarioFreg11.eachLayer(function(layer){
            if(layer.feature.properties.PercSEC11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercSEC11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercSecundarioFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 51;
    sliderAtivo = sliderPercSecundarioFreg11.noUiSlider;
    $(slidersGeral).append(sliderPercSecundarioFreg11);
} 

////////////------------------ Fim da Percentagem NIVEL SECUNDÁRIO em 2011 Freguesias -------------- \\\\\

//////------- Percentagem Total NIVEL SECUNDARIO por FREGUEIAS em 2021-----////

var minPercSecundarioFreg21 = 0;
var maxPercSecundarioFreg21 = 0;


function EstiloPercSecundarioFreg21(feature) {
    if( feature.properties.PercSEC21 < minPercSecundarioFreg21 || minPercSecundarioFreg21 === 0){
        minPercSecundarioFreg21 = feature.properties.PercSEC21
    }
    if(feature.properties.PercSEC21 > maxPercSecundarioFreg21 ){
        maxPercSecundarioFreg21 = feature.properties.PercSEC21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSecundarioFreg(feature.properties.PercSEC21)
    };
}
function apagarPercSecundarioFreg21(e) {
    PercSecundarioFreg21.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercSecundarioFreg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PercSEC21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercSecundarioFreg21,
    });
}
var PercSecundarioFreg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPercSecundarioFreg21,
    onEachFeature: onEachFeaturePercSecundarioFreg21
});

let slidePercSecundarioFreg21 = function(){
    var sliderPercSecundarioFreg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 52){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercSecundarioFreg21, {
        start: [minPercSecundarioFreg21, maxPercSecundarioFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercSecundarioFreg21,
            'max': maxPercSecundarioFreg21
        },
        });
    inputNumberMin.setAttribute("value",minPercSecundarioFreg21);
    inputNumberMax.setAttribute("value",maxPercSecundarioFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPercSecundarioFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercSecundarioFreg21.noUiSlider.set([null, this.value]);
    });

    sliderPercSecundarioFreg21.noUiSlider.on('update',function(e){
        PercSecundarioFreg21.eachLayer(function(layer){
            if(layer.feature.properties.PercSEC21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercSEC21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercSecundarioFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 52;
    sliderAtivo = sliderPercSecundarioFreg21.noUiSlider;
    $(slidersGeral).append(sliderPercSecundarioFreg21);
} 

////////////------------------ Fim da Percentagem NIVEL SECUNDÁRIO em 2021 Freguesias -------------- \\\\\

/////------- Percentagem Total NIVEL SUPERIOR por FREGUEIAS em 2001-----////

var minPercSuperiorFreg01 = 99;
var maxPercSuperiorFreg01 = 0;

function CorPerSuperiorFreg(d) {
    return d == 0.00 ? '#000000':
        d >= 36.34 ? '#8c0303' :
        d >= 30.38  ? '#de1f35' :
        d >= 20.46 ? '#ff5e6e' :
        d >= 10.53   ? '#f5b3be' :
        d >= 0.6   ? '#F2C572' :
                ''  ;
}
var legendaPerSuperiorFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 36.34' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 30.38 - 36.34' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 20.46 - 30.38' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 10.53 - 20.46' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.6 - 10.53' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' 0' + '<br>'

    $(legendaA).append(symbolsContainer); 
}
function EstiloPercSuperiorFreg01(feature) {
    if( feature.properties.PercES01 < minPercSuperiorFreg01){
        minPercSuperiorFreg01 = feature.properties.PercES01
    }
    if(feature.properties.PercES01 > maxPercSuperiorFreg01 ){
        maxPercSuperiorFreg01 = feature.properties.PercES01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSuperiorFreg(feature.properties.PercES01)
    };
}
function apagarPercSuperiorFreg01(e) {
    PercSuperiorFreg01.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercSuperiorFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PercES01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercSuperiorFreg01,
    });
}
var PercSuperiorFreg01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPercSuperiorFreg01,
    onEachFeature: onEachFeaturePercSuperiorFreg01
});

let slidePercSuperiorFreg01 = function(){
    var sliderPercSuperiorFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 53){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercSuperiorFreg01, {
        start: [minPercSuperiorFreg01, maxPercSuperiorFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercSuperiorFreg01,
            'max': maxPercSuperiorFreg01
        },
        });
    inputNumberMin.setAttribute("value",minPercSuperiorFreg01);
    inputNumberMax.setAttribute("value",maxPercSuperiorFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPercSuperiorFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercSuperiorFreg01.noUiSlider.set([null, this.value]);
    });

    sliderPercSuperiorFreg01.noUiSlider.on('update',function(e){
        PercSuperiorFreg01.eachLayer(function(layer){
            if(layer.feature.properties.PercES01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercES01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercSuperiorFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 53;
    sliderAtivo = sliderPercSuperiorFreg01.noUiSlider;
    $(slidersGeral).append(sliderPercSuperiorFreg01);
} 

////////////------------------ Fim da Percentagem NIVEL SUPERIOR em 2001 Freguesias -------------- \\\\\

/////------- Percentagem Total NIVEL SUPERIOR por FREGUEIAS em 2011-----////

var minPercSuperiorFreg11 = 99;
var maxPercSuperiorFreg11 = 0;


function EstiloPercSuperiorFreg11(feature) {
    if(feature.properties.PercES11 < minPercSuperiorFreg11){
        minPercSuperiorFreg11 = feature.properties.PercES11
    }
    if(feature.properties.PercES11 > maxPercSuperiorFreg11 ){
        maxPercSuperiorFreg11 = feature.properties.PercES11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSuperiorFreg(feature.properties.PercES11)
    };
}
function apagarPercSuperiorFreg11(e) {
    PercSuperiorFreg11.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercSuperiorFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PercES11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercSuperiorFreg11,
    });
}
var PercSuperiorFreg11= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPercSuperiorFreg11,
    onEachFeature: onEachFeaturePercSuperiorFreg11
});

let slidePercSuperiorFreg11 = function(){
    var sliderPercSuperiorFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 54){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercSuperiorFreg11, {
        start: [minPercSuperiorFreg11, maxPercSuperiorFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercSuperiorFreg11,
            'max': maxPercSuperiorFreg11
        },
        });
    inputNumberMin.setAttribute("value",minPercSuperiorFreg11);
    inputNumberMax.setAttribute("value",maxPercSuperiorFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercSuperiorFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercSuperiorFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPercSuperiorFreg11.noUiSlider.on('update',function(e){
        PercSuperiorFreg11.eachLayer(function(layer){
            if(layer.feature.properties.PercES11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercES11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercSuperiorFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 54;
    sliderAtivo = sliderPercSuperiorFreg11.noUiSlider;
    $(slidersGeral).append(sliderPercSuperiorFreg11);
} 

////////////------------------ Fim da Percentagem NIVEL SUPERIOR em 2011 Freguesias -------------- \\\\\

/////------- Percentagem Total NIVEL SUPERIOR por FREGUEIAS em 2021-----////

var minPercSuperiorFreg21 = 0;
var maxPercSuperiorFreg21 = 0;

function EstiloPercSuperiorFreg21(feature) {
    if( feature.properties.PercES21 < minPercSuperiorFreg21 || minPercSuperiorFreg21 === 0){
        minPercSuperiorFreg21 = feature.properties.PercES21
    }
    if(feature.properties.PercES21 > maxPercSuperiorFreg21 ){
        maxPercSuperiorFreg21 = feature.properties.PercES21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSuperiorFreg(feature.properties.PercES21)
    };
}
function apagarPercSuperiorFreg21(e) {
    PercSuperiorFreg21.resetStyle(e.target)
    e.target.closePopup();
} 
function onEachFeaturePercSuperiorFreg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.PercES21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercSuperiorFreg21,
    });
}
var PercSuperiorFreg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPercSuperiorFreg21,
    onEachFeature: onEachFeaturePercSuperiorFreg21
});

let slidePercSuperiorFreg21 = function(){
    var sliderPercSuperiorFreg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 55){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercSuperiorFreg21, {
        start: [minPercSuperiorFreg21, maxPercSuperiorFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercSuperiorFreg21,
            'max': maxPercSuperiorFreg21
        },
        });
    inputNumberMin.setAttribute("value",minPercSuperiorFreg21);
    inputNumberMax.setAttribute("value",maxPercSuperiorFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPercSuperiorFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercSuperiorFreg21.noUiSlider.set([null, this.value]);
    });

    sliderPercSuperiorFreg21.noUiSlider.on('update',function(e){
        PercSuperiorFreg21.eachLayer(function(layer){
            if(layer.feature.properties.PercES21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PercES21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercSuperiorFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 55;
    sliderAtivo = sliderPercSuperiorFreg21.noUiSlider;
    $(slidersGeral).append(sliderPercSuperiorFreg21);
} 

////////////------------------ Fim da Percentagem NIVEL SUPERIOR em 2021 Freguesias -------------- \\\\\

//////////------------------ FIM DADOS RELATIVOS FREGUESIA ---------------------- \\\\\\\\\\\\\\\\

///////////------------------------ DADOS VARIAÇÃO FREGUESIA -------------------\\\\\\\\\\\\\\
////////////////////////////////-------  Variação do NÍVEL NENHUM ENTRE 2011 E 2001-----/////

var minVarNenhumFreg11_01 = 999;
var maxVarNenhumFreg11_01 = -999;

function CorVarNenhumFreg11(d) {
    return d >= 10 ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -20  ? '#9eaad7' :
        d >= -40   ? '#2288bf' :
        d >= -57.84   ? '#155273' :
                ''  ;
}
var legendaVarNenhumFreg11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -20 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -40 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -57.84 a -40' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes sem algum nível de ensino, entre 2011 e 2001, por freguesia.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarNenhumFreg11_01(feature) {
    if(feature.properties.VarNenh11 <= minVarNenhumFreg11_01 ){
        minVarNenhumFreg11_01 = feature.properties.VarNenh11
    }
    if(feature.properties.VarNenh11 > maxVarNenhumFreg11_01){
        maxVarNenhumFreg11_01 = feature.properties.VarNenh11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarNenhumFreg11(feature.properties.VarNenh11)
    };
}


function apagarVarNenhumFreg11_01(e) {
    VarNenhumFreg11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarNenhumFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarNenh11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarNenhumFreg11_01,
    });
}
var VarNenhumFreg11_01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarNenhumFreg11_01,
    onEachFeature: onEachFeatureVarNenhumFreg11_01
});

let slideVarNenhumFreg11_01 = function(){
    var sliderVarNenhumFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 56){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarNenhumFreg11_01, {
        start: [minVarNenhumFreg11_01, maxVarNenhumFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarNenhumFreg11_01,
            'max': maxVarNenhumFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarNenhumFreg11_01);
    inputNumberMax.setAttribute("value",maxVarNenhumFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarNenhumFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarNenhumFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarNenhumFreg11_01.noUiSlider.on('update',function(e){
        VarNenhumFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarNenh11>=parseFloat(e[0])&& layer.feature.properties.VarNenh11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarNenhumFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 56;
    sliderAtivo = sliderVarNenhumFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarNenhumFreg11_01);
} 

////////////////////--------------- Fim da Variação do NÍVEL NENHUM ENTRE 2011 E 2001 -------------- \\\\\\

////////////////////////////////-------  Variação do NÍVEL NENHUM ENTRE 2021 E 2011-----/////

var minVarNenhumFreg21_11 = 0;
var maxVarNenhumFreg21_11 = -999;

function CorVarNenhumFreg21(d) {
    return d >= 0 ? '#ff5e6e' :
        d >= -20  ? '#f5b3be' :
        d >= -30  ? '#9eaad7' :
        d >= -40   ? '#2288bf' :
        d >= -56.94   ? '#155273' :
                ''  ;
}
var legendaVarNenhumFreg21 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' -20 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -30 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -40 a -30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -56.94 a -40' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes sem algum nível de ensino, entre 2021 e 2011, por freguesia.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarNenhumFreg21_11(feature) {
    if(feature.properties.VarNenh21 <= minVarNenhumFreg21_11 || minVarNenhumFreg21_11 ===0){
        minVarNenhumFreg21_11 = feature.properties.VarNenh21
    }
    if(feature.properties.VarNenh21 > maxVarNenhumFreg21_11){
        maxVarNenhumFreg21_11 = feature.properties.VarNenh21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarNenhumFreg21(feature.properties.VarNenh21)};
    }


function apagarVarNenhumFreg21_11(e) {
    VarNenhumFreg21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarNenhumFreg21_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarNenh21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarNenhumFreg21_11,
    });
}
var VarNenhumFreg21_11= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVarNenhumFreg21_11,
    onEachFeature: onEachFeatureVarNenhumFreg21_11
});

let slideVarNenhumFreg21_11 = function(){
    var sliderVarNenhumFreg21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 57){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarNenhumFreg21_11, {
        start: [minVarNenhumFreg21_11, maxVarNenhumFreg21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarNenhumFreg21_11,
            'max': maxVarNenhumFreg21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarNenhumFreg21_11);
    inputNumberMax.setAttribute("value",maxVarNenhumFreg21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarNenhumFreg21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarNenhumFreg21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarNenhumFreg21_11.noUiSlider.on('update',function(e){
        VarNenhumFreg21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarNenh21>=parseFloat(e[0])&& layer.feature.properties.VarNenh21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarNenhumFreg21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 57;
    sliderAtivo = sliderVarNenhumFreg21_11.noUiSlider;
    $(slidersGeral).append(sliderVarNenhumFreg21_11);
} 

////////////////////--------------- Fim da Variação do NÍVEL NENHUM ENTRE 2021 E 2011 -------------- \\\\\\

////////////////////////////////-------  Variação do NÍVEL Basico ENTRE 2011 E 2001-----/////

var minVarBasicoFreg11_01 = 0;
var maxVarBasicoFreg11_01 = -999;

function CorVarBasicoFreg11(d) {
    return d >= 25 ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -15   ? '#9eaad7' :
        d >= -36.45   ? '#2288bf' :
                ''  ;
}
var legendaVarBasicoFreg11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -15 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -36.45 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com ensino básico, entre 2011 e 2001, por freguesia.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarBasicoFreg11_01(feature) {
    if(feature.properties.VarEB11 <= minVarBasicoFreg11_01 || minVarBasicoFreg11_01 ===0){
        minVarBasicoFreg11_01 = feature.properties.VarEB11
    }
    if(feature.properties.VarEB11 > maxVarBasicoFreg11_01){
        maxVarBasicoFreg11_01 = feature.properties.VarEB11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarBasicoFreg11(feature.properties.VarEB11)};
}


function apagarVarBasicoFreg11_01(e) {
    VarBasicoFreg11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarBasicoFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarEB11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarBasicoFreg11_01,
    });
}
var VarBasicoFreg11_01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarBasicoFreg11_01,
    onEachFeature: onEachFeatureVarBasicoFreg11_01
});

let slideVarBasicoFreg11_01 = function(){
    var sliderVarBasicoFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 58){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarBasicoFreg11_01, {
        start: [minVarBasicoFreg11_01, maxVarBasicoFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarBasicoFreg11_01,
            'max': maxVarBasicoFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarBasicoFreg11_01);
    inputNumberMax.setAttribute("value",maxVarBasicoFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarBasicoFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarBasicoFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarBasicoFreg11_01.noUiSlider.on('update',function(e){
        VarBasicoFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarEB11>=parseFloat(e[0])&& layer.feature.properties.VarEB11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarBasicoFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 58;
    sliderAtivo = sliderVarBasicoFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarBasicoFreg11_01);
} 

////////////////////--------------- Fim da Variação do NÍVEL BÁSICO ENTRE 2011 E 2001 -------------- \\\\\\

////////////////////////////////-------  Variação do NÍVEL Basico ENTRE 2021 E 2011-----/////

var minVarBasicoFreg21_11 = 0;
var maxVarBasicoFreg21_11 = -999;

function CorVarBasicoFreg21(d) {
    return d >= -10  ? '#9ebbd7' :
        d >= -20  ? '#2288bf' :
        d >= -30   ? '#155273' :
        d >= -36.68   ? '#0b2c40' :
                ''  ;
}
var legendaVarBasicoFreg21 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + '  > -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -20 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -30 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -36.68 a -30' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com ensino básico, entre 2021 e 2011, por freguesia.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarBasicoFreg21_11(feature) {
    if(feature.properties.VarEB21 <= minVarBasicoFreg21_11 || minVarBasicoFreg21_11 ===0){
        minVarBasicoFreg21_11 = feature.properties.VarEB21
    }
    if(feature.properties.VarEB21 > maxVarBasicoFreg21_11){
        maxVarBasicoFreg21_11 = feature.properties.VarEB21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarBasicoFreg21(feature.properties.VarEB21)};
    }


function apagarVarBasicoFreg21_11(e) {
    VarBasicoFreg21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarBasicoFreg21_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarEB21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarBasicoFreg21_11,
    });
}
var VarBasicoFreg21_11= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVarBasicoFreg21_11,
    onEachFeature: onEachFeatureVarBasicoFreg21_11
});

let slideVarBasicoFreg21_11 = function(){
    var sliderVarBasicoFreg21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 59){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarBasicoFreg21_11, {
        start: [minVarBasicoFreg21_11, maxVarBasicoFreg21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarBasicoFreg21_11,
            'max': maxVarBasicoFreg21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarBasicoFreg21_11);
    inputNumberMax.setAttribute("value",maxVarBasicoFreg21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarBasicoFreg21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarBasicoFreg21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarBasicoFreg21_11.noUiSlider.on('update',function(e){
        VarBasicoFreg21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarEB21>=parseFloat(e[0])&& layer.feature.properties.VarEB21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarBasicoFreg21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 59;
    sliderAtivo = sliderVarBasicoFreg21_11.noUiSlider;
    $(slidersGeral).append(sliderVarBasicoFreg21_11);
} 

////////////////////--------------- Fim da Variação do NÍVEL BÁSICO ENTRE 2021 E 2011 -------------- \\\\\\

////////////////////////////////-------  Variação do NÍVEL Secundario ENTRE 2011 E 2001-----/////

var minVarSecundarioFreg11_01 = 0;
var maxVarSecundarioFreg11_01 = -999;

function CorVarSecundarioFreg11(d) {
    return d >= 80 ? '#de1f35' :
        d >= 40  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -20   ? '#9eaad7' :
        d >= -43.51   ? '#2288bf' :
                ''  ;
}
var legendaVarSecundarioFreg11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 80' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  40 a 80' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -20 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -43.51 a -20' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com ensino secundário, entre 2011 e 2001, por freguesia.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarSecundarioFreg11_01(feature) {
    if(feature.properties.VarSEC11 <= minVarSecundarioFreg11_01 || minVarSecundarioFreg11_01 ===0){
        minVarSecundarioFreg11_01 = feature.properties.VarSEC11
    }
    if(feature.properties.VarSEC11 > maxVarSecundarioFreg11_01){
        maxVarSecundarioFreg11_01 = feature.properties.VarSEC11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarSecundarioFreg11(feature.properties.VarSEC11)};
    }


function apagarVarSecundarioFreg11_01(e) {
    VarSecundarioFreg11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarSecundarioFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarSEC11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarSecundarioFreg11_01,
    });
}
var VarSecundarioFreg11_01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarSecundarioFreg11_01,
    onEachFeature: onEachFeatureVarSecundarioFreg11_01
});

let slideVarSecundarioFreg11_01 = function(){
    var sliderVarSecundarioFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 60){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarSecundarioFreg11_01, {
        start: [minVarSecundarioFreg11_01, maxVarSecundarioFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarSecundarioFreg11_01,
            'max': maxVarSecundarioFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarSecundarioFreg11_01);
    inputNumberMax.setAttribute("value",maxVarSecundarioFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarSecundarioFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarSecundarioFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarSecundarioFreg11_01.noUiSlider.on('update',function(e){
        VarSecundarioFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarSEC11>=parseFloat(e[0])&& layer.feature.properties.VarSEC11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarSecundarioFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 60;
    sliderAtivo = sliderVarSecundarioFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarSecundarioFreg11_01);
} 

////////////////////--------------- Fim da Variação do NÍVEL SECUNDÁRIO ENTRE 2011 E 2001 -------------- \\\\\\

////////////////////////////////-------  Variação do NÍVEL Secundario ENTRE 2021 E 2011-----/////

var minVarSecundarioFreg21_11 = 0;
var maxVarSecundarioFreg21_11 = -999;

function CorVarSecundarioFreg21(d) {
    return d >= 80 ? '#8c0303' :
        d >= 60  ? '#de1f35' :
        d >= 30   ? '#ff5e6e' :
        d >= 11.26   ? '#f5b3be' :
                ''  ;
}
var legendaVarSecundarioFreg21 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 80' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  60 a 80' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  30 a 60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 11.26 a 30' + '<br>'

    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com ensino secundário, entre 2021 e 2011, por freguesia.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarSecundarioFreg21_11(feature) {
    if(feature.properties.VarSEC21 <= minVarSecundarioFreg21_11 || minVarSecundarioFreg21_11 ===0){
        minVarSecundarioFreg21_11 = feature.properties.VarSEC21
    }
    if(feature.properties.VarSEC21 > maxVarSecundarioFreg21_11){
        maxVarSecundarioFreg21_11 = feature.properties.VarSEC21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarSecundarioFreg21(feature.properties.VarSEC21)};
    }


function apagarVarSecundarioFreg21_11(e) {
    VarSecundarioFreg21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarSecundarioFreg21_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarSEC21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarSecundarioFreg21_11,
    });
}
var VarSecundarioFreg21_11= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVarSecundarioFreg21_11,
    onEachFeature: onEachFeatureVarSecundarioFreg21_11
});

let slideVarSecundarioFreg21_11 = function(){
    var sliderVarSecundarioFreg21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 61){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarSecundarioFreg21_11, {
        start: [minVarSecundarioFreg21_11, maxVarSecundarioFreg21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarSecundarioFreg21_11,
            'max': maxVarSecundarioFreg21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarSecundarioFreg21_11);
    inputNumberMax.setAttribute("value",maxVarSecundarioFreg21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarSecundarioFreg21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarSecundarioFreg21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarSecundarioFreg21_11.noUiSlider.on('update',function(e){
        VarSecundarioFreg21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarSEC21>=parseFloat(e[0])&& layer.feature.properties.VarSEC21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarSecundarioFreg21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 61;
    sliderAtivo = sliderVarSecundarioFreg21_11.noUiSlider;
    $(slidersGeral).append(sliderVarSecundarioFreg21_11);
} 

////////////////////--------------- Fim da Variação do NÍVEL SECUNDÁRIO ENTRE 2021 E 2011 -------------- \\\\\\

////////////////////////////////-------  Variação do NÍVEL SUPERIOR ENTRE 2011 E 2011-----/////

var minVarSuperiorFreg11_01 = 0;
var maxVarSuperiorFreg11_01 = -999;

function CorVarSuperiorFreg11(d) {
    return d >= 100 ? '#8c0303' :
        d >= 75  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0   ? '#f5b3be' :
        d >= -50   ? '#9eaad7' :
                ''  ;
}
var legendaVarSuperiorFreg11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  75 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com ensino superior, entre 2011 e 2001, por freguesia.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarSuperiorFreg11_01(feature) {
    if(feature.properties.VarES11 <= minVarSuperiorFreg11_01 || minVarSuperiorFreg11_01 ===0){
        minVarSuperiorFreg11_01 = feature.properties.VarES11
    }
    if(feature.properties.VarES11 > maxVarSuperiorFreg11_01){
        maxVarSuperiorFreg11_01 = feature.properties.VarES11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarSuperiorFreg11(feature.properties.VarES11)};
    }


function apagarVarSuperiorFreg11_01(e) {
    VarSuperiorFreg11_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarSuperiorFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarES11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarSuperiorFreg11_01,
    });
}
var VarSuperiorFreg11_01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarSuperiorFreg11_01,
    onEachFeature: onEachFeatureVarSuperiorFreg11_01
});

let slideVarSuperiorFreg11_01 = function(){
    var sliderVarSuperiorFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 62){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarSuperiorFreg11_01, {
        start: [minVarSuperiorFreg11_01, maxVarSuperiorFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarSuperiorFreg11_01,
            'max': maxVarSuperiorFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarSuperiorFreg11_01);
    inputNumberMax.setAttribute("value",maxVarSuperiorFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarSuperiorFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarSuperiorFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarSuperiorFreg11_01.noUiSlider.on('update',function(e){
        VarSuperiorFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarES11>=parseFloat(e[0])&& layer.feature.properties.VarES11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarSuperiorFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 62;
    sliderAtivo = sliderVarSuperiorFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarSuperiorFreg11_01);
} 

////////////////////--------------- Fim da Variação do NÍVEL SUPERIOR ENTRE 2011 E 2001 -------------- \\\\\\

////////////////////////////////-------  Variação do NÍVEL SUPERIOR ENTRE 2021 E 2011-----/////

var minVarSuperiorFreg21_11 = 0;
var maxVarSuperiorFreg21_11 = -999;

function CorVarSuperiorFreg21(d) {
    return d >= 75  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25   ? '#ff5e6e' :
        d >= 11.43   ? '#f5b3be' :
                ''  ;
}
var legendaVarSuperiorFreg21 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  11.43 a 25' + '<br>'

    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes com ensino superior, entre 2021 e 2011, por freguesia.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarSuperiorFreg21_11(feature) {
    if(feature.properties.VarES21 <= minVarSuperiorFreg21_11 || minVarSuperiorFreg21_11 ===0){
        minVarSuperiorFreg21_11 = feature.properties.VarES21
    }
    if(feature.properties.VarES21 > maxVarSuperiorFreg21_11){
        maxVarSuperiorFreg21_11 = feature.properties.VarES21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarSuperiorFreg21(feature.properties.VarES21)};
    }


function apagarVarSuperiorFreg21_11(e) {
    VarSuperiorFreg21_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVarSuperiorFreg21_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarES21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarSuperiorFreg21_11,
    });
}
var VarSuperiorFreg21_11= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVarSuperiorFreg21_11,
    onEachFeature: onEachFeatureVarSuperiorFreg21_11
});

let slideVarSuperiorFreg21_11 = function(){
    var sliderVarSuperiorFreg21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 63){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarSuperiorFreg21_11, {
        start: [minVarSuperiorFreg21_11, maxVarSuperiorFreg21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarSuperiorFreg21_11,
            'max': maxVarSuperiorFreg21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarSuperiorFreg21_11);
    inputNumberMax.setAttribute("value",maxVarSuperiorFreg21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarSuperiorFreg21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarSuperiorFreg21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarSuperiorFreg21_11.noUiSlider.on('update',function(e){
        VarSuperiorFreg21_11.eachLayer(function(layer){
            if(layer.feature.properties.VarES21>=parseFloat(e[0])&& layer.feature.properties.VarES21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarSuperiorFreg21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 63;
    sliderAtivo = sliderVarSuperiorFreg21_11.noUiSlider;
    $(slidersGeral).append(sliderVarSuperiorFreg21_11);
} 

////////////////////--------------- Fim da Variação do NÍVEL SUPERIOR ENTRE 2021 E 2011 -------------- \\\\\\

$('#tituloMapa').html('<strong>' + 'Número de residentes sem algum nível de ensino, em 2001, por concelho, Nº.' + '</strong>')

var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Recenseamento da população e habitação';

////Ao abrir página aparecer logo a fonte e legenda


/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = TotalNenhumConcelhos01;
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
    if (layer == TotalNenhumConcelhos01 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Número de residentes sem algum nível de ensino, em 2001, por concelho, Nº.' + '</strong>')
        legenda(maxTotalNenhum01, (maxTotalNenhum01-minTotalNenhum01)/2,minTotalNenhum01,0.15);
        contorno.addTo(map)
        slideTotalNenhumConcelhos01();
        baseAtiva = contorno;
        naoDuplicar = 1;
    }
    if (layer == TotalNenhumConcelhos01 && naoDuplicar == 1){
        contorno.addTo(map);
        $('#tituloMapa').html('<strong>' + 'Número de residentes sem algum nível de ensino, em 2001, por concelho, Nº.' + '</strong>')
    }  
    if (layer == TotalNenhumConcelhos11 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Número de residentes sem algum nível de ensino, em 2011, por concelho, Nº.' + '</strong>');
        legenda(maxTotalNenhum11, (maxTotalNenhum11-minTotalNenhum11)/2,minTotalNenhum11,0.15);
        contorno.addTo(map)
        slideTotalNenhumConcelhos11();
        naoDuplicar = 2;
    }
    if (layer == TotalNenhumConcelhos21 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Número de residentes sem algum nível de ensino, em 2021, por concelho, Nº.' + '</strong>');
        legenda(maxTotalNenhum21, ((maxTotalNenhum21-minTotalNenhum21)/2).toFixed(0),minTotalNenhum21,0.15);
        contorno.addTo(map)
        slideTotalNenhumConcelhos21();
        naoDuplicar = 3;
    }
    if (layer == TotalBasicoConcelhos01 && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com ensino básico, em 2001, por concelho, Nº.' + '</strong>');
        legenda(maxTotalBasico01, ((maxTotalBasico01-minTotalBasico01)/2).toFixed(0),minTotalBasico01,0.15);
        contorno.addTo(map)
        slideTotalBasicoConcelhos01();
        naoDuplicar = 4;
    }
    if (layer == TotalBasicoConcelhos11 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com ensino básico, em 2011, por concelho, Nº.' + '</strong>');
        legenda(maxTotalBasico11, ((maxTotalBasico11-minTotalBasico11)/2).toFixed(0),minTotalBasico11,0.15);
        contorno.addTo(map)
        slideTotalBasicoConcelhos11();
        naoDuplicar = 5;
    }
    if (layer == TotalBasicoConcelhos21 && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com ensino básico, em 2021, por concelho, Nº.' + '</strong>');
        legenda(maxTotalBasico21, ((maxTotalBasico21-minTotalBasico21)/2).toFixed(0),minTotalBasico21,0.15);
        contorno.addTo(map)
        slideTotalBasicoConcelhos21();
        naoDuplicar = 6;
    }
    if (layer == TotalSecundarioConcelhos01 && naoDuplicar != 7){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com ensino secundário, em 2001, por concelho, Nº.' + '</strong>');
        legenda(maxTotalSecundario01, ((maxTotalSecundario01-minTotalSecundario01)/2).toFixed(0),minTotalSecundario01,0.15);
        contorno.addTo(map)
        slideTotalSecundarioConcelhos01();
        naoDuplicar = 7;
    }
    if (layer == TotalSecundarioConcelhos11 && naoDuplicar != 8){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com ensino secundário, em 2011, por concelho, Nº.' + '</strong>');
        legenda(maxTotalSecundario11, ((maxTotalSecundario11-minTotalSecundario11)/2).toFixed(0),minTotalSecundario11,0.15);
        contorno.addTo(map)
        slideTotalSecundarioConcelhos11();
        naoDuplicar = 8;
    }
    if (layer == TotalSecundarioConcelhos21 && naoDuplicar != 9){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com ensino secundário, em 2021, por concelho, Nº.' + '</strong>');
        legenda(maxTotalSecundario21, ((maxTotalSecundario21-minTotalSecundario21)/2).toFixed(0),minTotalSecundario21,0.15);
        contorno.addTo(map)
        slideTotalSecundarioConcelhos21();
        naoDuplicar = 9;
    }
    if (layer == TotalSuperiorConcelhos01 && naoDuplicar != 10){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com ensino superior, em 2001, por concelho, Nº.' + '</strong>');
        legenda(maxTotalSuperior01, ((maxTotalSuperior01-minTotalSuperior01)/2).toFixed(0),minTotalSuperior01,0.15);
        contorno.addTo(map)
        slideTotalSuperiorConcelhos01();
        naoDuplicar = 10;
    }
    if (layer == TotalSuperiorConcelhos11 && naoDuplicar != 11){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com ensino superior, em 2011, por concelho, Nº.' + '</strong>');
        legenda(maxTotalSuperior11, ((maxTotalSuperior11-minTotalSuperior11)/2).toFixed(0),minTotalSuperior11,0.15);
        contorno.addTo(map)
        slideTotalSuperiorConcelhos11();
        naoDuplicar = 11;
    }
    if (layer == TotalSuperiorConcelhos21 && naoDuplicar != 12){
        $('#tituloMapa').html('<strong>' + 'Número de residentes com ensino superior, em 2021, por concelho, Nº.' + '</strong>');
        legenda(maxTotalSuperior21, ((maxTotalSuperior21-minTotalSuperior21)/2).toFixed(0),minTotalSuperior21,0.15);
        contorno.addTo(map)
        slideTotalSuperiorConcelhos21();
        naoDuplicar = 12;
    }
    if (layer == PercNenhumConc01 && naoDuplicar != 13){
        legendaPerNenhumConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes sem algum nível de ensino, em 2001, por concelho.' + '</strong>');
        slidePercNenhumConc01();
        naoDuplicar = 13;
    }
    if (layer == PercNenhumConc11 && naoDuplicar != 14){
        legendaPerNenhumConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes sem algum nível de ensino, em 2011, por concelho.' + '</strong>');
        slidePercNenhumConc11();
        naoDuplicar = 14;
    }
    if (layer == PercNenhumConc21 && naoDuplicar != 15){
        legendaPerNenhumConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes sem algum nível de ensino, em 2021, por concelho.' + '</strong>');
        slidePercNenhumConc21();
        naoDuplicar = 15;
    }
    if (layer == PercBasicoConc01 && naoDuplicar != 16){
        legendaPerBasicoConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino básico, em 2001, por concelho.' + '</strong>');
        slidePercBasicoConc01();
        naoDuplicar = 16;
    }
    if (layer == PercBasicoConc11 && naoDuplicar != 17){
        legendaPerBasicoConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino básico, em 2011, por concelho.' + '</strong>');
        slidePercBasicoConc11();
        naoDuplicar = 17;
    }
    if (layer == PercBasicoConc21 && naoDuplicar != 18){
        legendaPerBasicoConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino básico, em 2021, por concelho.' + '</strong>');
        slidePercBasicoConc21();
        naoDuplicar = 18;
    }
    if (layer == PercSecundarioConc01 && naoDuplicar != 19){
        legendaPerSecundarioConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino secundário, em 2001, por concelho.' + '</strong>');
        slidePercSecundarioConc01();
        naoDuplicar = 19;
    }
    if (layer == PercSecundarioConc11 && naoDuplicar != 20){
        legendaPerSecundarioConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino secundário, em 2011, por concelho.' + '</strong>');
        slidePercSecundarioConc11();
        naoDuplicar = 20;
    }
    if (layer == PercSecundarioConc21 && naoDuplicar != 21){
        legendaPerSecundarioConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino secundário, em 2021, por concelho.' + '</strong>');
        slidePercSecundarioConc21();
        naoDuplicar = 21;
    }
    if (layer == PercSuperiorConc01 && naoDuplicar != 22){
        legendaPerSuperiorConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino superior, em 2001, por concelho.' + '</strong>');
        slidePercSuperiorConc01();
        naoDuplicar = 22;
    }
    if (layer == PercSuperiorConc11 && naoDuplicar != 23){
        legendaPerSuperiorConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino superior, em 2011, por concelho.' + '</strong>');
        slidePercSuperiorConc11();
        naoDuplicar = 23;
    }
    if (layer == PercSuperiorConc21 && naoDuplicar != 24){
        legendaPerSuperiorConc();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino superior, em 2021, por concelho.' + '</strong>');
        slidePercSuperiorConc21();
        naoDuplicar = 24;
    }
    if (layer == VarNenhumConc11_01 && naoDuplicar != 64){
        legendaVarNenhumConc11();
        slideVarNenhumConc11_01();
        naoDuplicar = 64;
    }
    if (layer == VarNenhumConc21_11 && naoDuplicar != 25){
        legendaVarNenhumConc21();        
        slideVarNenhumConc21_11();
        naoDuplicar = 25;
    }
    if (layer == VarBasicoConc11_01 && naoDuplicar != 26){
        legendaVarBasicoConc11();
        slideVarBasicoConc11_01();
        naoDuplicar = 26;
    }
    if (layer == VarBasicoConc21_11 && naoDuplicar != 27){
        legendaVarBasicoConc21();
        slideVarBasicoConc21_11();
        naoDuplicar = 27;
    }
    if (layer == VarSecundarioConc11_01 && naoDuplicar != 28){
        legendaVarSecundarioConc11();
        slideVarSecundarioConc11_01();
        naoDuplicar = 28;
    }
    if (layer == VarSecundarioConc21_11 && naoDuplicar != 29){
        legendaVarSecundarioConc21();
        slideVarSecundarioConc21_11();
        naoDuplicar = 29;
    }
    if (layer == VarSuperiorConc11_01 && naoDuplicar != 30){
        legendaVarSuperiorConc11();
        slideVarSuperiorConc11_01();
        naoDuplicar = 30;
    }
    if (layer == VarSuperiorConc21_11 && naoDuplicar != 31){
        legendaVarSuperiorConc21();
        slideVarSuperiorConc21_11();
        naoDuplicar = 31;
    }
    if (layer == TotalNenhumFreguesias01 && naoDuplicar != 32){
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes sem algum nível de ensino, em 2001, por freguesia.' + '</strong>');
        legenda(maxTotalNenhumFreg01, ((maxTotalNenhumFreg01-minTotalNenhumFreg01)/2).toFixed(0),minTotalNenhumFreg01,0.15);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalNenhumFreguesias01();
        naoDuplicar = 32;
    }
    if (layer == TotalNenhumFreguesias11 && naoDuplicar != 33){
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes sem algum nível de ensino, em 2011, por freguesia.' + '</strong>');
        legendaExcecao(maxTotalNenhumFreg11, ((maxTotalNenhumFreg11-minTotalNenhumFreg11)/2).toFixed(0),minTotalNenhumFreg11,0.15);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideTotalNenhumFreguesias11();
        naoDuplicar = 33;
    }
    if (layer == TotalNenhumFreguesias21 && naoDuplicar != 34){
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes sem algum nível de ensino, em 2021, por freguesia.' + '</strong>');
        legendaExcecao(maxTotalNenhumFreg21, ((maxTotalNenhumFreg21-minTotalNenhumFreg21)/2).toFixed(0),minTotalNenhumFreg21,0.15);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideTotalNenhumFreguesias21();
        naoDuplicar = 34;
    }
    if (layer == TotalBasicoFreguesias01 && naoDuplicar != 35){
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino básico, em 2001, por freguesia.' + '</strong>');
        legenda(maxTotalBasicoFreg01, ((maxTotalBasicoFreg01-minTotalBasicoFreg01)/2).toFixed(0),minTotalBasicoFreg01,0.15);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalBasicoFreguesias01();
        naoDuplicar = 35;
    }
    if (layer == TotalBasicoFreguesias11 && naoDuplicar != 36){
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino básico, em 2011, por freguesia.' + '</strong>');
        legenda(maxTotalBasicoFreg11, ((maxTotalBasicoFreg11-minTotalBasicoFreg11)/2).toFixed(0),minTotalBasicoFreg11,0.15);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideTotalBasicoFreguesias11();
        naoDuplicar = 36;
    }
    if (layer == TotalBasicoFreguesias21 && naoDuplicar != 37){
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino básico, em 2021, por freguesia.' + '</strong>');
        legenda(maxTotalBasicoFreg21, ((maxTotalBasicoFreg21-minTotalBasicoFreg21)/2).toFixed(0),minTotalBasicoFreg21,0.15);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideTotalBasicoFreguesias21();
        naoDuplicar = 37;
    }
    if (layer == TotalSecundarioFreguesias01 && naoDuplicar != 38){
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino secundário, em 2001, por freguesia.' + '</strong>');
        legenda(maxTotalSecundarioFreg01, ((maxTotalSecundarioFreg01-minTotalSecundarioFreg01)/2).toFixed(0),minTotalSecundarioFreg01,0.15);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalSecundarioFreguesias01();
        naoDuplicar = 38;
    }
    if (layer == TotalSecundarioFreguesias11 && naoDuplicar != 39){
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino secundário, em 2011, por freguesia.' + '</strong>');
        legenda(maxTotalSecundarioFreg11, ((maxTotalSecundarioFreg11-minTotalSecundarioFreg11)/2).toFixed(0),minTotalSecundarioFreg11,0.15);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideTotalSecundarioFreguesias11();
        naoDuplicar = 39;
    }
    if (layer == TotalSecundarioFreguesias21 && naoDuplicar != 40){
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino secundário, em 2021, por freguesia.' + '</strong>');
        legenda(maxTotalSecundarioFreg21, ((maxTotalSecundarioFreg21-minTotalSecundarioFreg21)/2).toFixed(0),minTotalSecundarioFreg21,0.15);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideTotalSecundarioFreguesias21();
        naoDuplicar = 40;
    }
    if (layer == TotalSuperiorFreguesias01 && naoDuplicar != 41){
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino superior, em 2001, por freguesia.' + '</strong>');
        legenda(maxTotalSuperiorFreg01, ((maxTotalSuperiorFreg01-minTotalSuperiorFreg01)/2).toFixed(0),minTotalSuperiorFreg01,0.15);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalSuperiorFreguesias01();
        naoDuplicar = 41;
    }
    if (layer == TotalSuperiorFreguesias11 && naoDuplicar != 42){
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino superior, em 2011, por freguesia.' + '</strong>');
        legenda(maxTotalSuperiorFreg11, ((maxTotalSuperiorFreg11-minTotalSuperiorFreg11)/2).toFixed(0),minTotalSuperiorFreg11,0.15);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideTotalSuperiorFreguesias11();
        naoDuplicar = 42;
    }
    if (layer == TotalSuperiorFreguesias21 && naoDuplicar != 43){
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino superior, em 2021, por freguesia.' + '</strong>');
        legenda(maxTotalSuperiorFreg21, ((maxTotalSuperiorFreg21-minTotalSuperiorFreg21)/2).toFixed(0),minTotalSuperiorFreg21,0.15);
        contornoFreg.addTo(map)
        baseAtiva = contornoFreg;
        slideTotalSuperiorFreguesias21();
        naoDuplicar = 43;
    }
    if (layer == PercNenhumFreg01 && naoDuplicar != 44){
        legendaPerNenhumFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes sem algum nível de ensino, em 2001, por freguesia.' + '</strong>');
        slidePercNenhumFreg01();
        naoDuplicar = 44;
    }
    if (layer == PercNenhumFreg11 && naoDuplicar != 45){
        legendaPerNenhumFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes sem algum nível de ensino, em 2011, por freguesia.' + '</strong>');
        slidePercNenhumFreg11();
        naoDuplicar = 45;
    }
    if (layer == PercNenhumFreg21 && naoDuplicar != 46){
        legendaPerNenhumFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes sem algum nível de ensino, em 2021, por freguesia.' + '</strong>');
        slidePercNenhumFreg21();
        naoDuplicar = 46;
    }
    if (layer == PercBasicoFreg01 && naoDuplicar != 47){
        legendaPerBasicoFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino básico, em 2001, por freguesia.' + '</strong>');
        slidePercBasicoFreg01();
        naoDuplicar = 47;
    }
    if (layer == PercBasicoFreg11 && naoDuplicar != 48){
        legendaPerBasicoFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino básico, em 2011, por freguesia.' + '</strong>');
        slidePercBasicoFreg11();
        naoDuplicar = 48;
    }
    if (layer == PercBasicoFreg21 && naoDuplicar != 49){
        legendaPerBasicoFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino básico, em 2021, por freguesia.' + '</strong>');
        slidePercBasicoFreg21();
        naoDuplicar = 49;
    }
    if (layer == PercSecundarioFreg01 && naoDuplicar != 50){
        legendaPerSecundarioFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino secundário, em 2001, por freguesia.' + '</strong>');
        slidePercSecundarioFreg01();
        naoDuplicar = 50;
    }
    if (layer == PercSecundarioFreg11 && naoDuplicar != 51){
        legendaPerSecundarioFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino secundário, em 2011, por freguesia.' + '</strong>');
        slidePercSecundarioFreg11();
        naoDuplicar = 51;
    }
    if (layer == PercSecundarioFreg21 && naoDuplicar != 52){
        legendaPerSecundarioFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino secundário, em 2021, por freguesia.' + '</strong>');
        slidePercSecundarioFreg21();
        naoDuplicar = 52;
    }
    if (layer == PercSuperiorFreg01 && naoDuplicar != 53){
        legendaPerSuperiorFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino superior, em 2001, por freguesia.' + '</strong>');
        slidePercSuperiorFreg01();
        naoDuplicar = 53;
    }
    if (layer == PercSuperiorFreg11 && naoDuplicar != 54){
        legendaPerSuperiorFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino superior, em 2011, por freguesia.' + '</strong>');
        slidePercSuperiorFreg11();
        naoDuplicar = 54;
    }
    if (layer == PercSuperiorFreg21 && naoDuplicar != 55){
        legendaPerSuperiorFreg();
        $('#tituloMapa').html('<strong>' + 'Proporção de residentes com ensino superior, em 2021, por freguesia.' + '</strong>');
        slidePercSuperiorFreg21();
        naoDuplicar = 55;
    }
    if (layer == VarNenhumFreg11_01 && naoDuplicar != 56){
        legendaVarNenhumFreg11();        
        slideVarNenhumFreg11_01();
        naoDuplicar = 56;
    }
    if (layer == VarNenhumFreg21_11 && naoDuplicar != 57){
        legendaVarNenhumFreg21();        
        slideVarNenhumFreg21_11();
        naoDuplicar = 57;
    }
    if (layer == VarBasicoFreg11_01 && naoDuplicar != 58){
        legendaVarBasicoFreg11();        
        slideVarBasicoFreg11_01();
        naoDuplicar = 58;
    }
    if (layer == VarBasicoFreg21_11 && naoDuplicar != 59){
        legendaVarBasicoFreg21();        
        slideVarBasicoFreg21_11();
        naoDuplicar = 59;
    }
    if (layer == VarSecundarioFreg11_01 && naoDuplicar != 60){
        legendaVarSecundarioFreg11();        
        slideVarSecundarioFreg11_01();
        naoDuplicar = 60;
    }
    if (layer == VarSecundarioFreg21_11 && naoDuplicar != 61){
        legendaVarSecundarioFreg21();        
        slideVarSecundarioFreg21_11();
        naoDuplicar = 61;
    }
    if (layer == VarSuperiorFreg11_01 && naoDuplicar != 62){
        legendaVarSuperiorFreg11();        
        slideVarSuperiorFreg11_01();
        naoDuplicar = 62;
    }
    if (layer == VarSuperiorFreg21_11 && naoDuplicar != 63){
        legendaVarSuperiorFreg21();        
        slideVarSuperiorFreg21_11();
        naoDuplicar = 63;
    }
    layer.addTo(map);
    layerAtiva = layer;  
}


function myFunction() {
    var NivelEnsino = document.getElementById("opcaoSelect").value;
    var anoSelecionado = document.getElementById("mySelect").value;
    if($('#absoluto').hasClass('active4')){
        if (anoSelecionado == "2001" && NivelEnsino =="Nenhum"){
            novaLayer(TotalNenhumConcelhos01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Nenhum"){
            novaLayer(TotalNenhumConcelhos11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Nenhum"){
            novaLayer(TotalNenhumConcelhos21);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Basico"){
            novaLayer(TotalBasicoConcelhos01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Basico"){
            novaLayer(TotalBasicoConcelhos11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Basico"){
            novaLayer(TotalBasicoConcelhos21);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Secundario"){
            novaLayer(TotalSecundarioConcelhos01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Secundario"){
            novaLayer(TotalSecundarioConcelhos11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Secundario"){
            novaLayer(TotalSecundarioConcelhos21);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Superior"){
            novaLayer(TotalSuperiorConcelhos01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Superior"){
            novaLayer(TotalSuperiorConcelhos11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Superior"){
            novaLayer(TotalSuperiorConcelhos21);
        };
    }
    if($('#percentagem').hasClass('active4')){
        if (anoSelecionado == "2001" && NivelEnsino =="Nenhum"){
            novaLayer(PercNenhumConc01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Nenhum"){
            novaLayer(PercNenhumConc11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Nenhum"){
            novaLayer(PercNenhumConc21);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Basico"){
            novaLayer(PercBasicoConc01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Basico"){
            novaLayer(PercBasicoConc11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Basico"){
            novaLayer(PercBasicoConc21);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Secundario"){
            novaLayer(PercSecundarioConc01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Secundario"){
            novaLayer(PercSecundarioConc11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Secundario"){
            novaLayer(PercSecundarioConc21);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Superior"){
            novaLayer(PercSuperiorConc01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Superior"){
            novaLayer(PercSuperiorConc11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Superior"){
            novaLayer(PercSuperiorConc21);
        };
    }
    if($('#taxaVariacao').hasClass('active4')){
        if (anoSelecionado == "2001" && NivelEnsino =="Nenhum"){
            novaLayer(VarNenhumConc11_01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Nenhum"){
            novaLayer(VarNenhumConc21_11);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Basico"){
            novaLayer(VarBasicoConc11_01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Basico"){
            novaLayer(VarBasicoConc21_11);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Secundario"){
            novaLayer(VarSecundarioConc11_01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Secundario"){
            novaLayer(VarSecundarioConc21_11);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Superior"){
            novaLayer(VarSuperiorConc11_01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Superior"){
            novaLayer(VarSuperiorConc21_11);
        };
    } 
    if($('#absoluto').hasClass('active5')){
        if (anoSelecionado == "2001" && NivelEnsino =="Nenhum"){
            novaLayer(TotalNenhumFreguesias01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Nenhum"){
            novaLayer(TotalNenhumFreguesias11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Nenhum"){
            novaLayer(TotalNenhumFreguesias21);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Basico"){
            novaLayer(TotalBasicoFreguesias01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Basico"){
            novaLayer(TotalBasicoFreguesias11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Basico"){
            novaLayer(TotalBasicoFreguesias21);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Secundario"){
            novaLayer(TotalSecundarioFreguesias01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Secundario"){
            novaLayer(TotalSecundarioFreguesias11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Secundario"){
            novaLayer(TotalSecundarioFreguesias21);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Superior"){
            novaLayer(TotalSuperiorFreguesias01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Superior"){
            novaLayer(TotalSuperiorFreguesias11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Superior"){
            novaLayer(TotalSuperiorFreguesias21);
        };
    }
    if($('#percentagem').hasClass('active5')){
        if (anoSelecionado == "2001" && NivelEnsino =="Nenhum"){
            novaLayer(PercNenhumFreg01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Nenhum"){
            novaLayer(PercNenhumFreg11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Nenhum"){
            novaLayer(PercNenhumFreg21);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Basico"){
            novaLayer(PercBasicoFreg01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Basico"){
            novaLayer(PercBasicoFreg11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Basico"){
            novaLayer(PercBasicoFreg21);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Secundario"){
            novaLayer(PercSecundarioFreg01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Secundario"){
            novaLayer(PercSecundarioFreg11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Secundario"){
            novaLayer(PercSecundarioFreg21);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Superior"){
            novaLayer(PercSuperiorFreg01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Superior"){
            novaLayer(PercSuperiorFreg11);
        };
        if (anoSelecionado == "2021" && NivelEnsino =="Superior"){
            novaLayer(PercSuperiorFreg21);
        };   
    }
    if($('#taxaVariacao').hasClass('active5')){
        if (anoSelecionado == "2001" && NivelEnsino =="Nenhum"){
            novaLayer(VarNenhumFreg11_01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Nenhum"){
            novaLayer(VarNenhumFreg21_11);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Basico"){
            novaLayer(VarBasicoFreg11_01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Basico"){
            novaLayer(VarBasicoFreg21_11);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Secundario"){
            novaLayer(VarSecundarioFreg11_01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Secundario"){
            novaLayer(VarSecundarioFreg21_11);
        };
        if (anoSelecionado == "2001" && NivelEnsino =="Superior"){
            novaLayer(VarSuperiorFreg11_01);
        };
        if (anoSelecionado == "2011" && NivelEnsino =="Superior"){
            novaLayer(VarSuperiorFreg21_11);
        };
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

let primeirovalor = function(valor,ano){
    $("#mySelect").val(ano);
    $("#opcaoSelect").val(valor)
    
}
let reporAnos = function(){
    $('#mySelect')[0].options[0].innerHTML = "2001";
    $('#mySelect')[0].options[1].innerHTML = "2011";
    if ($("#mySelect option[value='2021']").length == 0){
        $('#mySelect').append("<option value='2021'>2021</option>");
    }
    primeirovalor('Nenhum','2001')
}
let reporAnosVariacao = function(){
    $("#mySelect option[value='2021']").remove();
    $('#mySelect')[0].options[0].innerHTML = "2011 - 2001";
    $('#mySelect')[0].options[1].innerHTML = "2021 - 2011";
}

let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}

$('#absoluto').click(function(){
    mudarEscala();
});

$('#percentagem').click(function(){
    reporAnos();
    fonteTitulo('F');
    tamanhoOutros();
});

$('#taxaVariacao').click(function(){
    reporAnosVariacao();
    fonteTitulo('F');
    tamanhoOutros();
});

$('#mySelect').change(function(){
    myFunction();
})
$('#opcaoSelect').change(function(){
    myFunction();
})

$('#freguesias').click(function(){
    variaveisMapaFreguesias();
});
$('#concelho').click(function(){
    variaveisMapaConcelho();
});

function mudarEscala(){
    reporAnos();
    tamanhoOutros();
    fonteTitulo('N');
}

let variaveisMapaConcelho = function(){
    if($('#absoluto').hasClass('active4')){
        return false;
    }
    else{
        $('#absoluto').attr('class',"butao active4")
        $('#percentagem').attr('class',"butao")
        $('#taxaVariacao').attr('class',"butao")
        mudarEscala();
    }
}

let variaveisMapaFreguesias = function(){
    if($('#absolutoFreguesia').hasClass('active5')){
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


    $('#concelho').attr("class", "butaoEscala EscalasTerritoriais");
    $('#freguesias').attr('class',"butaoEscala EscalasTerritoriais");
    $('.btn').css("top","10%");

});
function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }
var DadosAbsolutosTipoAlojamento = function(){
    $('#tituloMapa').html('Número de residentes, por nível de ensino, entre 2001 e 2021, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/NivelEnsinoProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html("2001")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.NivelEnsino+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2011.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2021.toLocaleString("fr")+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.NivelEnsino+'</td>';
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
    $('#tituloMapa').html('Variação do número de residentes, por nível de ensino, entre 2001 e 2021, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/NivelEnsinoProv.json", function(data){
            $('#juntarValores').empty();
            $('#2001').html(" ")
            var dados = '';
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.NivelEnsino+'</td>';;
                    dados += '<td class="borderbottom bordertop">'+ ' '+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR1101+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR2111+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Freguesia+'</td>';
                    dados += '<td>'+value.NivelEnsino+'</td>';
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
    $('#2001').html("2001")
    $('#tituloMapa').html('Proporção do número de residente, por nível de ensino, entre 2001 e 2021, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/NivelEnsinoProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.NivelEnsino+'</td>';;
                    dados += '<td class="borderbottom">'+value.Per01+'</td>';
                    dados += '<td class="borderbottom">'+value.Per11+'</td>';
                    dados += '<td class="borderbottom">'+value.Per21+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.NivelEnsino+'</td>';;
                    dados += '<td class="borderbottom">'+value.Per01+'</td>';
                    dados += '<td class="borderbottom">'+value.Per11+'</td>';
                    dados += '<td class="borderbottom">'+value.Per21+'</td>';
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
        if (anoSelecionado == "2001"){
            i = 0;
        }
    }
    if ($('#concelho').hasClass("active2")){
        if (anoSelecionado == "2021"){
            i = $('#mySelect').children('option').length - 1 ;
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
        if (i !== 2) {
            opcoesAnos.find('option:selected').next().prop('selected', true);
            myFunction();
            i += 1
        }
        if(i === 0){
            return false
        }
    }
    if ($('#concelho').hasClass("active2")){
        if (i !== 2) {
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
        if(i === 2){
            return false
        }
    }
    if($('#concelho').hasClass("active2")){
        if(i === 2){
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

