
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
var contornoFreg2001 = L.geoJSON(dadosRelativosFreguesias01,{
    style:layerContorno,
});
var contornoConcelhos1991 =L.geoJSON(dadosRelativosConcelhos91,{
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

//////////////////////////////////////////-------------------------- DADOS ABSOLUTOS CONCELHOS -----------\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS 1 ALOJAMENTOS EM 1991 ------------------------------\\\\\\\\\\\\\

var minEdi1AlojConc_91 = 0;
var maxEdi1AlojConc_91 = 0;
function estiloEdi1AlojConc_91(feature, latlng) {
    if(feature.properties.ED_1ALO_91< minEdi1AlojConc_91 || minEdi1AlojConc_91 ===0){
        minEdi1AlojConc_91 = feature.properties.ED_1ALO_91
    }
    if(feature.properties.ED_1ALO_91> maxEdi1AlojConc_91){
        maxEdi1AlojConc_91 = feature.properties.ED_1ALO_91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1ALO_91,0.15)
    });
}
function apagarEdi1AlojConc_91(e){
    var layer = e.target;
    Edi1AlojConc_91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi1AlojConc_91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Edifícios com 1 alojamento:  ' + '<b>' +feature.properties.ED_1ALO_91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi1AlojConc_91,
    })
};

var Edi1AlojConc_91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloEdi1AlojConc_91,
    onEachFeature: onEachFeatureEdi1AlojConc_91,
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




var slideEdi1AlojConc_91 = function(){
    var sliderEdi1AlojConc_91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi1AlojConc_91, {
        start: [minEdi1AlojConc_91, maxEdi1AlojConc_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi1AlojConc_91,
            'max': maxEdi1AlojConc_91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi1AlojConc_91);
    inputNumberMax.setAttribute("value",maxEdi1AlojConc_91);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi1AlojConc_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi1AlojConc_91.noUiSlider.set([null, this.value]);
    });

    sliderEdi1AlojConc_91.noUiSlider.on('update',function(e){
        Edi1AlojConc_91.eachLayer(function(layer){
            if(layer.feature.properties.ED_1ALO_91>=parseFloat(e[0])&& layer.feature.properties.ED_1ALO_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi1AlojConc_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderEdi1AlojConc_91.noUiSlider;
    $(slidersGeral).append(sliderEdi1AlojConc_91);
}
contornoConcelhos1991.addTo(map)
Edi1AlojConc_91.addTo(map);
$('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 alojamento, em 1991, por concelho.' + '</strong>');
legenda(maxEdi1AlojConc_91, ((maxEdi1AlojConc_91-minEdi1AlojConc_91)/2).toFixed(0),minEdi1AlojConc_91,0.15);
slideEdi1AlojConc_91();

///////////////////////////-------------------- FIM TOTAL EDIFICIOS COM 1 ALOJAMENTO ,CONCELHO 1991 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 2 A 4 ALOJAMENTOS, 1991 POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdi2_4AlojConc_91 = 0;
var maxEdi2_4AlojConc_91 = 0;
function estiloEdi2_4AlojConc_91(feature, latlng) {
    if(feature.properties.ED_4ALO_91< minEdi2_4AlojConc_91 || minEdi2_4AlojConc_91 ===0){
        minEdi2_4AlojConc_91 = feature.properties.ED_4ALO_91
    }
    if(feature.properties.ED_4ALO_91> maxEdi2_4AlojConc_91){
        maxEdi2_4AlojConc_91 = feature.properties.ED_4ALO_91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_4ALO_91,0.15)
    });
}
function apagarEdi2_4AlojConc_91(e){
    var layer = e.target;
    Edi2_4AlojConc_91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi2_4AlojConc_91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Edifícios com 2 a 4 alojamentos:  ' + '<b>' +feature.properties.ED_4ALO_91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi2_4AlojConc_91,
    })
};

var Edi2_4AlojConc_91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloEdi2_4AlojConc_91,
    onEachFeature: onEachFeatureEdi2_4AlojConc_91,
});

var slideEdi2_4AlojConc_91 = function(){
    var sliderEdi2_4AlojConc_91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi2_4AlojConc_91, {
        start: [minEdi2_4AlojConc_91, maxEdi2_4AlojConc_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi2_4AlojConc_91,
            'max': maxEdi2_4AlojConc_91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi2_4AlojConc_91);
    inputNumberMax.setAttribute("value",maxEdi2_4AlojConc_91);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi2_4AlojConc_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi2_4AlojConc_91.noUiSlider.set([null, this.value]);
    });

    sliderEdi2_4AlojConc_91.noUiSlider.on('update',function(e){
        Edi2_4AlojConc_91.eachLayer(function(layer){
            if(layer.feature.properties.ED_4ALO_91>=parseFloat(e[0])&& layer.feature.properties.ED_4ALO_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi2_4AlojConc_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderEdi2_4AlojConc_91.noUiSlider;
    $(slidersGeral).append(sliderEdi2_4AlojConc_91);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS COM 2 A 4 ALOJAMENTOS ,CONCELHO 1991 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 5 A 9 ALOJAMENTOS, 1991 POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdi5_9AlojConc_91 = 0;
var maxEdi5_9AlojConc_91 = 0;
function estiloEdi5_9AlojConc_91(feature, latlng) {
    if(feature.properties.ED_9ALO_91< minEdi5_9AlojConc_91 || minEdi5_9AlojConc_91 ===0){
        minEdi5_9AlojConc_91 = feature.properties.ED_9ALO_91
    }
    if(feature.properties.ED_9ALO_91> maxEdi5_9AlojConc_91){
        maxEdi5_9AlojConc_91 = feature.properties.ED_9ALO_91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_9ALO_91,0.15)
    });
}
function apagarEdi5_9AlojConc_91(e){
    var layer = e.target;
    Edi5_9AlojConc_91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi5_9AlojConc_91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Edifícios com 5 a 9 alojamentos:  ' + '<b>' +feature.properties.ED_9ALO_91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi5_9AlojConc_91,
    })
};

var Edi5_9AlojConc_91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloEdi5_9AlojConc_91,
    onEachFeature: onEachFeatureEdi5_9AlojConc_91,
});

var slideEdi5_9AlojConc_91 = function(){
    var sliderEdi5_9AlojConc_91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi5_9AlojConc_91, {
        start: [minEdi5_9AlojConc_91, maxEdi5_9AlojConc_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi5_9AlojConc_91,
            'max': maxEdi5_9AlojConc_91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi5_9AlojConc_91);
    inputNumberMax.setAttribute("value",maxEdi5_9AlojConc_91);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi5_9AlojConc_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi5_9AlojConc_91.noUiSlider.set([null, this.value]);
    });

    sliderEdi5_9AlojConc_91.noUiSlider.on('update',function(e){
        Edi5_9AlojConc_91.eachLayer(function(layer){
            if(layer.feature.properties.ED_9ALO_91>=parseFloat(e[0])&& layer.feature.properties.ED_9ALO_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi5_9AlojConc_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderEdi5_9AlojConc_91.noUiSlider;
    $(slidersGeral).append(sliderEdi5_9AlojConc_91);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS COM 5 A 9 ALOJAMENTOS ,CONCELHO 1991 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 10 ou mais ALOJAMENTOS, 1991 POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdi10AlojConc_91 = 0;
var maxEdi10AlojConc_91 = 0;
function estiloEdi10AlojConc_91(feature, latlng) {
    if(feature.properties.ED_10AL_91< minEdi10AlojConc_91 || minEdi10AlojConc_91 ===0){
        minEdi10AlojConc_91 = feature.properties.ED_10AL_91
    }
    if(feature.properties.ED_10AL_91> maxEdi10AlojConc_91){
        maxEdi10AlojConc_91 = feature.properties.ED_10AL_91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_10AL_91,0.15)
    });
}
function apagarEdi10AlojConc_91(e){
    var layer = e.target;
    Edi10AlojConc_91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi10AlojConc_91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Edifícios com 10 ou mais alojamentos:  ' + '<b>' +feature.properties.ED_10AL_91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi10AlojConc_91,
    })
};

var Edi10AlojConc_91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloEdi10AlojConc_91,
    onEachFeature: onEachFeatureEdi10AlojConc_91,
});

var slideEdi10AlojConc_91 = function(){
    var sliderEdi10AlojConc_91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi10AlojConc_91, {
        start: [minEdi10AlojConc_91, maxEdi10AlojConc_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi10AlojConc_91,
            'max': maxEdi10AlojConc_91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi10AlojConc_91);
    inputNumberMax.setAttribute("value",maxEdi10AlojConc_91);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi10AlojConc_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi10AlojConc_91.noUiSlider.set([null, this.value]);
    });

    sliderEdi10AlojConc_91.noUiSlider.on('update',function(e){
        Edi10AlojConc_91.eachLayer(function(layer){
            if(layer.feature.properties.ED_10AL_91>=parseFloat(e[0])&& layer.feature.properties.ED_10AL_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi10AlojConc_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderEdi10AlojConc_91.noUiSlider;
    $(slidersGeral).append(sliderEdi10AlojConc_91);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS COM 10 ou mais ALOJAMENTOS ,CONCELHO 1991 -----------\\\\\\\\\\\\\\\\\\\\\\\


//////////////////////////////////////////----------- EDIFICIOS COM 1 ALOJAMENTO, 2001 POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdi1AlojConc_01 = 0;
var maxEdi1AlojConc_01 = 0;
function estiloEdi1AlojConc_01(feature, latlng) {
    if(feature.properties.ED_1ALO_01< minEdi1AlojConc_01 || minEdi1AlojConc_01 ===0){
        minEdi1AlojConc_01 = feature.properties.ED_1ALO_01
    }
    if(feature.properties.ED_1ALO_01> maxEdi1AlojConc_01){
        maxEdi1AlojConc_01 = feature.properties.ED_1ALO_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1ALO_01,0.15)
    });
}
function apagarEdi1AlojConc_01(e){
    var layer = e.target;
    Edi1AlojConc_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi1AlojConc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios com 1 alojamento:  ' + '<b>' +feature.properties.ED_1ALO_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi1AlojConc_01,
    })
};

var Edi1AlojConc_01= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloEdi1AlojConc_01,
    onEachFeature: onEachFeatureEdi1AlojConc_01,
});

var slideEdi1AlojConc_01 = function(){
    var sliderEdi1AlojConc_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi1AlojConc_01, {
        start: [minEdi1AlojConc_01, maxEdi1AlojConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi1AlojConc_01,
            'max': maxEdi1AlojConc_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi1AlojConc_01);
    inputNumberMax.setAttribute("value",maxEdi1AlojConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi1AlojConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi1AlojConc_01.noUiSlider.set([null, this.value]);
    });

    sliderEdi1AlojConc_01.noUiSlider.on('update',function(e){
        Edi1AlojConc_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_1ALO_01>=parseFloat(e[0])&& layer.feature.properties.ED_1ALO_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi1AlojConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderEdi1AlojConc_01.noUiSlider;
    $(slidersGeral).append(sliderEdi1AlojConc_01);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS COM 1 ALOJAMENTO ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 2 a 4 ALOJAMENTOS, 2001 POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdi2_4AlojConc_01 = 0;
var maxEdi2_4AlojConc_01 = 0;
function estiloEdi2_4AlojConc_01(feature, latlng) {
    if(feature.properties.ED_4ALO_01< minEdi2_4AlojConc_01 || minEdi2_4AlojConc_01 ===0){
        minEdi2_4AlojConc_01 = feature.properties.ED_4ALO_01
    }
    if(feature.properties.ED_4ALO_01> maxEdi2_4AlojConc_01){
        maxEdi2_4AlojConc_01 = feature.properties.ED_4ALO_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_4ALO_01,0.15)
    });
}
function apagarEdi2_4AlojConc_01(e){
    var layer = e.target;
    Edi2_4AlojConc_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi2_4AlojConc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios com 2 a 4 alojamentos:  ' + '<b>' +feature.properties.ED_4ALO_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi2_4AlojConc_01,
    })
};

var Edi2_4AlojConc_01= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloEdi2_4AlojConc_01,
    onEachFeature: onEachFeatureEdi2_4AlojConc_01,
});

var slideEdi2_4AlojConc_01 = function(){
    var sliderEdi2_4AlojConc_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi2_4AlojConc_01, {
        start: [minEdi2_4AlojConc_01, maxEdi2_4AlojConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi2_4AlojConc_01,
            'max': maxEdi2_4AlojConc_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi2_4AlojConc_01);
    inputNumberMax.setAttribute("value",maxEdi2_4AlojConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi2_4AlojConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi2_4AlojConc_01.noUiSlider.set([null, this.value]);
    });

    sliderEdi2_4AlojConc_01.noUiSlider.on('update',function(e){
        Edi2_4AlojConc_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_4ALO_01>=parseFloat(e[0])&& layer.feature.properties.ED_4ALO_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi2_4AlojConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderEdi2_4AlojConc_01.noUiSlider;
    $(slidersGeral).append(sliderEdi2_4AlojConc_01);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS COM 2 A 4 ALOJAMENTOS ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 5 a 9 ALOJAMENTOS, 2001 POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdi5_9AlojConc_01 = 0;
var maxEdi5_9AlojConc_01 = 0;
function estiloEdi5_9AlojConc_01(feature, latlng) {
    if(feature.properties.ED_9ALO_01< minEdi5_9AlojConc_01 || minEdi5_9AlojConc_01 ===0){
        minEdi5_9AlojConc_01 = feature.properties.ED_9ALO_01
    }
    if(feature.properties.ED_9ALO_01> maxEdi5_9AlojConc_01){
        maxEdi5_9AlojConc_01 = feature.properties.ED_9ALO_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_9ALO_01,0.15)
    });
}
function apagarEdi5_9AlojConc_01(e){
    var layer = e.target;
    Edi5_9AlojConc_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi5_9AlojConc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios com 5 a 9 alojamentos:  ' + '<b>' +feature.properties.ED_9ALO_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi5_9AlojConc_01,
    })
};

var Edi5_9AlojConc_01= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloEdi5_9AlojConc_01,
    onEachFeature: onEachFeatureEdi5_9AlojConc_01,
});

var slideEdi5_9AlojConc_01 = function(){
    var sliderEdi5_9AlojConc_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi5_9AlojConc_01, {
        start: [minEdi5_9AlojConc_01, maxEdi5_9AlojConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi5_9AlojConc_01,
            'max': maxEdi5_9AlojConc_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi5_9AlojConc_01);
    inputNumberMax.setAttribute("value",maxEdi5_9AlojConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi5_9AlojConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi5_9AlojConc_01.noUiSlider.set([null, this.value]);
    });

    sliderEdi5_9AlojConc_01.noUiSlider.on('update',function(e){
        Edi5_9AlojConc_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_9ALO_01>=parseFloat(e[0])&& layer.feature.properties.ED_9ALO_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi5_9AlojConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderEdi5_9AlojConc_01.noUiSlider;
    $(slidersGeral).append(sliderEdi5_9AlojConc_01);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS COM 5 A 9 ALOJAMENTOS ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////----------- EDIFICIOS COM 10 ou MAIS ALOJAMENTOS, 2001 POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdi10AlojConc_01 = 0;
var maxEdi10AlojConc_01 = 0;
function estiloEdi10AlojConc_01(feature, latlng) {
    if(feature.properties.ED_10AL_01< minEdi10AlojConc_01 || minEdi10AlojConc_01 ===0){
        minEdi10AlojConc_01 = feature.properties.ED_10AL_01
    }
    if(feature.properties.ED_10AL_01> maxEdi10AlojConc_01){
        maxEdi10AlojConc_01 = feature.properties.ED_10AL_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_10AL_01,0.15)
    });
}
function apagarEdi10AlojConc_01(e){
    var layer = e.target;
    Edi10AlojConc_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi10AlojConc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios com 10 ou mais alojamentos:  ' + '<b>' +feature.properties.ED_9ALO_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi10AlojConc_01,
    })
};

var Edi10AlojConc_01= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloEdi10AlojConc_01,
    onEachFeature: onEachFeatureEdi10AlojConc_01,
});

var slideEdi10AlojConc_01 = function(){
    var sliderEdi10AlojConc_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi10AlojConc_01, {
        start: [minEdi10AlojConc_01, maxEdi10AlojConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi10AlojConc_01,
            'max': maxEdi10AlojConc_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi10AlojConc_01);
    inputNumberMax.setAttribute("value",maxEdi10AlojConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi10AlojConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi10AlojConc_01.noUiSlider.set([null, this.value]);
    });

    sliderEdi10AlojConc_01.noUiSlider.on('update',function(e){
        Edi10AlojConc_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_10AL_01>=parseFloat(e[0])&& layer.feature.properties.ED_10AL_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi10AlojConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderEdi10AlojConc_01.noUiSlider;
    $(slidersGeral).append(sliderEdi10AlojConc_01);
}

///////////////////////////------------- FIM TOTAL EDIFICIOS COM 10 OU MAIS ALOJAMENTOS ,CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 1 ALOJAMENTO, 2011 POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdi1AlojConc_11 = 0;
var maxEdi1AlojConc_11 = 0;
function estiloEdi1AlojConc_11(feature, latlng) {
    if(feature.properties.ED_1ALO_11< minEdi1AlojConc_11 || minEdi1AlojConc_11 ===0){
        minEdi1AlojConc_11 = feature.properties.ED_1ALO_11
    }
    if(feature.properties.ED_1ALO_11> maxEdi1AlojConc_11){
        maxEdi1AlojConc_11 = feature.properties.ED_1ALO_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1ALO_11,0.15)
    });
}
function apagarEdi1AlojConc_11(e){
    var layer = e.target;
    Edi1AlojConc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi1AlojConc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios com 1 alojamento:  ' + '<b>' +feature.properties.ED_1ALO_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi1AlojConc_11,
    })
};

var Edi1AlojConc_11= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloEdi1AlojConc_11,
    onEachFeature: onEachFeatureEdi1AlojConc_11,
});

var slideEdi1AlojConc_11 = function(){
    var sliderEdi1AlojConc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi1AlojConc_11, {
        start: [minEdi1AlojConc_11, maxEdi1AlojConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi1AlojConc_11,
            'max': maxEdi1AlojConc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi1AlojConc_11);
    inputNumberMax.setAttribute("value",maxEdi1AlojConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi1AlojConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi1AlojConc_11.noUiSlider.set([null, this.value]);
    });

    sliderEdi1AlojConc_11.noUiSlider.on('update',function(e){
        Edi1AlojConc_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_1ALO_11>=parseFloat(e[0])&& layer.feature.properties.ED_1ALO_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi1AlojConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderEdi1AlojConc_11.noUiSlider;
    $(slidersGeral).append(sliderEdi1AlojConc_11);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS COM 1 ALOJAMENTO ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 2 a 4 ALOJAMENTOS, 2011 POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdi2_4AlojConc_11 = 0;
var maxEdi2_4AlojConc_11 = 0;
function estiloEdi2_4AlojConc_11(feature, latlng) {
    if(feature.properties.ED_4ALO_11< minEdi2_4AlojConc_11 || minEdi2_4AlojConc_11 ===0){
        minEdi2_4AlojConc_11 = feature.properties.ED_4ALO_11
    }
    if(feature.properties.ED_4ALO_11> maxEdi2_4AlojConc_11){
        maxEdi2_4AlojConc_11 = feature.properties.ED_4ALO_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_4ALO_11,0.15)
    });
}
function apagarEdi2_4AlojConc_11(e){
    var layer = e.target;
    Edi2_4AlojConc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi2_4AlojConc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios com 2 a 4 alojamentos:  ' + '<b>' +feature.properties.ED_4ALO_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi2_4AlojConc_11,
    })
};

var Edi2_4AlojConc_11= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloEdi2_4AlojConc_11,
    onEachFeature: onEachFeatureEdi2_4AlojConc_11,
});

var slideEdi2_4AlojConc_11 = function(){
    var sliderEdi2_4AlojConc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi2_4AlojConc_11, {
        start: [minEdi2_4AlojConc_11, maxEdi2_4AlojConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi2_4AlojConc_11,
            'max': maxEdi2_4AlojConc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi2_4AlojConc_11);
    inputNumberMax.setAttribute("value",maxEdi2_4AlojConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi2_4AlojConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi2_4AlojConc_11.noUiSlider.set([null, this.value]);
    });

    sliderEdi2_4AlojConc_11.noUiSlider.on('update',function(e){
        Edi2_4AlojConc_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_4ALO_11>=parseFloat(e[0])&& layer.feature.properties.ED_4ALO_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi2_4AlojConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderEdi2_4AlojConc_11.noUiSlider;
    $(slidersGeral).append(sliderEdi2_4AlojConc_11);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS COM 2 A 4 ALOJAMENTOS ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 5 a 9 ALOJAMENTOS, 2011 POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdi5_9AlojConc_11 = 0;
var maxEdi5_9AlojConc_11 = 0;
function estiloEdi5_9AlojConc_11(feature, latlng) {
    if(feature.properties.ED_9ALO_11< minEdi5_9AlojConc_11 || minEdi5_9AlojConc_11 ===0){
        minEdi5_9AlojConc_11 = feature.properties.ED_9ALO_11
    }
    if(feature.properties.ED_9ALO_11> maxEdi5_9AlojConc_11){
        maxEdi5_9AlojConc_11 = feature.properties.ED_9ALO_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_9ALO_11,0.15)
    });
}
function apagarEdi5_9AlojConc_11(e){
    var layer = e.target;
    Edi5_9AlojConc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi5_9AlojConc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios com 5 a 9 alojamentos:  ' + '<b>' +feature.properties.ED_9ALO_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi5_9AlojConc_11,
    })
};

var Edi5_9AlojConc_11= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloEdi5_9AlojConc_11,
    onEachFeature: onEachFeatureEdi5_9AlojConc_11,
});

var slideEdi5_9AlojConc_11 = function(){
    var sliderEdi5_9AlojConc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi5_9AlojConc_11, {
        start: [minEdi5_9AlojConc_11, maxEdi5_9AlojConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi5_9AlojConc_11,
            'max': maxEdi5_9AlojConc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi5_9AlojConc_11);
    inputNumberMax.setAttribute("value",maxEdi5_9AlojConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi5_9AlojConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi5_9AlojConc_11.noUiSlider.set([null, this.value]);
    });

    sliderEdi5_9AlojConc_11.noUiSlider.on('update',function(e){
        Edi5_9AlojConc_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_9ALO_11>=parseFloat(e[0])&& layer.feature.properties.ED_9ALO_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi5_9AlojConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderEdi5_9AlojConc_11.noUiSlider;
    $(slidersGeral).append(sliderEdi5_9AlojConc_11);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS COM 5 A 9 ALOJAMENTOS ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////----------- EDIFICIOS COM 10 ou MAIS ALOJAMENTOS, 2011 POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdi10AlojConc_11 = 0;
var maxEdi10AlojConc_11 = 0;
function estiloEdi10AlojConc_11(feature, latlng) {
    if(feature.properties.ED_10AL_11< minEdi10AlojConc_11 || minEdi10AlojConc_11 ===0){
        minEdi10AlojConc_11 = feature.properties.ED_10AL_11
    }
    if(feature.properties.ED_10AL_11> maxEdi10AlojConc_11){
        maxEdi10AlojConc_11 = feature.properties.ED_10AL_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_10AL_11,0.15)
    });
}
function apagarEdi10AlojConc_11(e){
    var layer = e.target;
    Edi10AlojConc_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi10AlojConc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios com 10 ou mais alojamentos:  ' + '<b>' +feature.properties.ED_9ALO_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi10AlojConc_11,
    })
};

var Edi10AlojConc_11= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloEdi10AlojConc_11,
    onEachFeature: onEachFeatureEdi10AlojConc_11,
});

var slideEdi10AlojConc_11 = function(){
    var sliderEdi10AlojConc_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi10AlojConc_11, {
        start: [minEdi10AlojConc_11, maxEdi10AlojConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi10AlojConc_11,
            'max': maxEdi10AlojConc_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi10AlojConc_11);
    inputNumberMax.setAttribute("value",maxEdi10AlojConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi10AlojConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi10AlojConc_11.noUiSlider.set([null, this.value]);
    });

    sliderEdi10AlojConc_11.noUiSlider.on('update',function(e){
        Edi10AlojConc_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_10AL_11>=parseFloat(e[0])&& layer.feature.properties.ED_10AL_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi10AlojConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderEdi10AlojConc_11.noUiSlider;
    $(slidersGeral).append(sliderEdi10AlojConc_11);
}

///////////////////////////------------- FIM TOTAL EDIFICIOS COM 10 OU MAIS ALOJAMENTOS ,CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\



//////////////////////////////////////////----------- EDIFICIOS COM 1 ALOJAMENTO, 2021 POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdi1AlojConc_21 = 0;
var maxEdi1AlojConc_21 = 0;
function estiloEdi1AlojConc_21(feature, latlng) {
    if(feature.properties.ED_1ALO_21< minEdi1AlojConc_21 || minEdi1AlojConc_21 ===0){
        minEdi1AlojConc_21 = feature.properties.ED_1ALO_21
    }
    if(feature.properties.ED_1ALO_21> maxEdi1AlojConc_21){
        maxEdi1AlojConc_21 = feature.properties.ED_1ALO_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1ALO_21,0.15)
    });
}
function apagarEdi1AlojConc_21(e){
    var layer = e.target;
    Edi1AlojConc_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi1AlojConc_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios com 1 alojamento:  ' + '<b>' +feature.properties.ED_1ALO_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi1AlojConc_21,
    })
};

var Edi1AlojConc_21= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloEdi1AlojConc_21,
    onEachFeature: onEachFeatureEdi1AlojConc_21,
});

var slideEdi1AlojConc_21 = function(){
    var sliderEdi1AlojConc_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi1AlojConc_21, {
        start: [minEdi1AlojConc_21, maxEdi1AlojConc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi1AlojConc_21,
            'max': maxEdi1AlojConc_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi1AlojConc_21);
    inputNumberMax.setAttribute("value",maxEdi1AlojConc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi1AlojConc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi1AlojConc_21.noUiSlider.set([null, this.value]);
    });

    sliderEdi1AlojConc_21.noUiSlider.on('update',function(e){
        Edi1AlojConc_21.eachLayer(function(layer){
            if(layer.feature.properties.ED_1ALO_21>=parseFloat(e[0])&& layer.feature.properties.ED_1ALO_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi1AlojConc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderEdi1AlojConc_21.noUiSlider;
    $(slidersGeral).append(sliderEdi1AlojConc_21);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS COM 1 ALOJAMENTO ,CONCELHO 2021 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 2 a 4 ALOJAMENTOS, 2021 POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdi2_4AlojConc_21 = 0;
var maxEdi2_4AlojConc_21 = 0;
function estiloEdi2_4AlojConc_21(feature, latlng) {
    if(feature.properties.ED_4ALO_21< minEdi2_4AlojConc_21 || minEdi2_4AlojConc_21 ===0){
        minEdi2_4AlojConc_21 = feature.properties.ED_4ALO_21
    }
    if(feature.properties.ED_4ALO_21> maxEdi2_4AlojConc_21){
        maxEdi2_4AlojConc_21 = feature.properties.ED_4ALO_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_4ALO_21,0.15)
    });
}
function apagarEdi2_4AlojConc_21(e){
    var layer = e.target;
    Edi2_4AlojConc_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi2_4AlojConc_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios com 2 a 4 alojamentos:  ' + '<b>' +feature.properties.ED_4ALO_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi2_4AlojConc_21,
    })
};

var Edi2_4AlojConc_21= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloEdi2_4AlojConc_21,
    onEachFeature: onEachFeatureEdi2_4AlojConc_21,
});

var slideEdi2_4AlojConc_21 = function(){
    var sliderEdi2_4AlojConc_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi2_4AlojConc_21, {
        start: [minEdi2_4AlojConc_21, maxEdi2_4AlojConc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi2_4AlojConc_21,
            'max': maxEdi2_4AlojConc_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi2_4AlojConc_21);
    inputNumberMax.setAttribute("value",maxEdi2_4AlojConc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi2_4AlojConc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi2_4AlojConc_21.noUiSlider.set([null, this.value]);
    });

    sliderEdi2_4AlojConc_21.noUiSlider.on('update',function(e){
        Edi2_4AlojConc_21.eachLayer(function(layer){
            if(layer.feature.properties.ED_4ALO_21>=parseFloat(e[0])&& layer.feature.properties.ED_4ALO_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi2_4AlojConc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderEdi2_4AlojConc_21.noUiSlider;
    $(slidersGeral).append(sliderEdi2_4AlojConc_21);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS COM 2 A 4 ALOJAMENTOS ,CONCELHO 2021 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 5 a 9 ALOJAMENTOS, 2021 POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdi5_9AlojConc_21 = 0;
var maxEdi5_9AlojConc_21 = 0;
function estiloEdi5_9AlojConc_21(feature, latlng) {
    if(feature.properties.ED_9ALO_21< minEdi5_9AlojConc_21 || minEdi5_9AlojConc_21 ===0){
        minEdi5_9AlojConc_21 = feature.properties.ED_9ALO_21
    }
    if(feature.properties.ED_9ALO_21> maxEdi5_9AlojConc_21){
        maxEdi5_9AlojConc_21 = feature.properties.ED_9ALO_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_9ALO_21,0.15)
    });
}
function apagarEdi5_9AlojConc_21(e){
    var layer = e.target;
    Edi5_9AlojConc_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi5_9AlojConc_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios com 5 a 9 alojamentos:  ' + '<b>' +feature.properties.ED_9ALO_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi5_9AlojConc_21,
    })
};

var Edi5_9AlojConc_21= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloEdi5_9AlojConc_21,
    onEachFeature: onEachFeatureEdi5_9AlojConc_21,
});

var slideEdi5_9AlojConc_21 = function(){
    var sliderEdi5_9AlojConc_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi5_9AlojConc_21, {
        start: [minEdi5_9AlojConc_21, maxEdi5_9AlojConc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi5_9AlojConc_21,
            'max': maxEdi5_9AlojConc_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi5_9AlojConc_21);
    inputNumberMax.setAttribute("value",maxEdi5_9AlojConc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi5_9AlojConc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi5_9AlojConc_21.noUiSlider.set([null, this.value]);
    });

    sliderEdi5_9AlojConc_21.noUiSlider.on('update',function(e){
        Edi5_9AlojConc_21.eachLayer(function(layer){
            if(layer.feature.properties.ED_9ALO_21>=parseFloat(e[0])&& layer.feature.properties.ED_9ALO_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi5_9AlojConc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderEdi5_9AlojConc_21.noUiSlider;
    $(slidersGeral).append(sliderEdi5_9AlojConc_21);
}

///////////////////////////-------------------- FIM TOTAL EDIFICIOS COM 5 A 9 ALOJAMENTOS ,CONCELHO 2021 -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////----------- EDIFICIOS COM 10 ou MAIS ALOJAMENTOS, 2021 POR CONCELHO-----------------------\\\\\\\\\\\\\

var minEdi10AlojConc_21 = 0;
var maxEdi10AlojConc_21 = 0;
function estiloEdi10AlojConc_21(feature, latlng) {
    if(feature.properties.ED_10AL_21< minEdi10AlojConc_21 || minEdi10AlojConc_21 ===0){
        minEdi10AlojConc_21 = feature.properties.ED_10AL_21
    }
    if(feature.properties.ED_10AL_21> maxEdi10AlojConc_21){
        maxEdi10AlojConc_21 = feature.properties.ED_10AL_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_10AL_21,0.15)
    });
}
function apagarEdi10AlojConc_21(e){
    var layer = e.target;
    Edi10AlojConc_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi10AlojConc_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios com 10 ou mais alojamentos:  ' + '<b>' +feature.properties.ED_9ALO_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi10AlojConc_21,
    })
};

var Edi10AlojConc_21= L.geoJSON(dadosAbsolutosConcelhos21,{
    pointToLayer:estiloEdi10AlojConc_21,
    onEachFeature: onEachFeatureEdi10AlojConc_21,
});

var slideEdi10AlojConc_21 = function(){
    var sliderEdi10AlojConc_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi10AlojConc_21, {
        start: [minEdi10AlojConc_21, maxEdi10AlojConc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi10AlojConc_21,
            'max': maxEdi10AlojConc_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi10AlojConc_21);
    inputNumberMax.setAttribute("value",maxEdi10AlojConc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi10AlojConc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi10AlojConc_21.noUiSlider.set([null, this.value]);
    });

    sliderEdi10AlojConc_21.noUiSlider.on('update',function(e){
        Edi10AlojConc_21.eachLayer(function(layer){
            if(layer.feature.properties.ED_10AL_21>=parseFloat(e[0])&& layer.feature.properties.ED_10AL_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi10AlojConc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderEdi10AlojConc_21.noUiSlider;
    $(slidersGeral).append(sliderEdi10AlojConc_21);
}

///////////////////////////------------- FIM TOTAL EDIFICIOS COM 10 OU MAIS ALOJAMENTOS ,CONCELHO 2021 -----------\\\\\\\\\\\\\\\\\\\\
/////////////////////////////////////----------------------- FIM DADOS ABSOLUTOS CONCELHOS \\\\\\\\\\\\\\\\\\
//////////////////////////------------------------- DADOS RELATIVOS ---------------------\\\\\\\\\\\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 1 ALOJAMENTO Concelho em 1991-----////

var minPerEdi1AlojConc_91 = 0;
var maxPerEdi1AlojConc_91 = 0;

function CorPerEdi1AlojConc(d) {
    return d >= 93.22 ? '#8c0303' :
        d >= 87.91  ? '#de1f35' :
        d >= 79.05 ? '#ff5e6e' :
        d >= 70.2   ? '#f5b3be' :
        d >= 61.34   ? '#F2C572' :
                ''  ;
}
var legendaPerEdi1AlojConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 93.22' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 87.91 - 93.22' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 79.05 - 87.91' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 70.2 - 79.05' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 61.34 - 70.2' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEdi1AlojConc_91(feature) {
    if( feature.properties.P_ED_1AL91 <= minPerEdi1AlojConc_91 || minPerEdi1AlojConc_91 === 0){
        minPerEdi1AlojConc_91 = feature.properties.P_ED_1AL91
    }
    if(feature.properties.P_ED_1AL91 >= maxPerEdi1AlojConc_91 ){
        maxPerEdi1AlojConc_91 = feature.properties.P_ED_1AL91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi1AlojConc(feature.properties.P_ED_1AL91)
    };
}
function apagarPerEdi1AlojConc_91(e) {
    PerEdi1AlojConc_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi1AlojConc_91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED_1AL91.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi1AlojConc_91,
    });
}
var PerEdi1AlojConc_91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloPerEdi1AlojConc_91,
    onEachFeature: onEachFeaturePerEdi1AlojConc_91
});
let slidePerEdi1AlojConc_91 = function(){
    var sliderPerEdi1AlojConc_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi1AlojConc_91, {
        start: [minPerEdi1AlojConc_91, maxPerEdi1AlojConc_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi1AlojConc_91,
            'max': maxPerEdi1AlojConc_91
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi1AlojConc_91);
    inputNumberMax.setAttribute("value",maxPerEdi1AlojConc_91);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi1AlojConc_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi1AlojConc_91.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi1AlojConc_91.noUiSlider.on('update',function(e){
        PerEdi1AlojConc_91.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_1AL91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_1AL91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi1AlojConc_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderPerEdi1AlojConc_91.noUiSlider;
    $(slidersGeral).append(sliderPerEdi1AlojConc_91);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 1 ALOJAMENTO Concelho em 1991 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 2 a 4 ALOJAMENTOS Concelho em 1991-----////

var minPerEdi2_4AlojConc_91 = 0;
var maxPerEdi2_4AlojConc_91 = 0;

function CorPerEdi2a4AlojConc(d) {
    return d >= 18.46 ? '#8c0303' :
        d >= 15.9  ? '#de1f35' :
        d >= 11.65 ? '#ff5e6e' :
        d >= 7.39   ? '#f5b3be' :
        d >= 3.13   ? '#F2C572' :
                ''  ;
}
var legendaPerEdi2a4AlojConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 18.46' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 15.9 - 18.46' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 11.65 - 15.9' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 7.39 - 11.65' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 3.13 - 7.39' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEdi2_4AlojConc_91(feature) {
    if( feature.properties.P_ED_4AL91 <= minPerEdi2_4AlojConc_91 || minPerEdi2_4AlojConc_91 === 0){
        minPerEdi2_4AlojConc_91 = feature.properties.P_ED_4AL91
    }
    if(feature.properties.P_ED_4AL91 >= maxPerEdi2_4AlojConc_91 ){
        maxPerEdi2_4AlojConc_91 = feature.properties.P_ED_4AL91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi2a4AlojConc(feature.properties.P_ED_4AL91)
    };
}
function apagarPerEdi2_4AlojConc_91(e) {
    PerEdi2_4AlojConc_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi2_4AlojConc_91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED_4AL91.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi2_4AlojConc_91,
    });
}
var PerEdi2_4AlojConc_91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloPerEdi2_4AlojConc_91,
    onEachFeature: onEachFeaturePerEdi2_4AlojConc_91
});
let slidePerEdi2_4AlojConc_91 = function(){
    var sliderPerEdi2_4AlojConc_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi2_4AlojConc_91, {
        start: [minPerEdi2_4AlojConc_91, maxPerEdi2_4AlojConc_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi2_4AlojConc_91,
            'max': maxPerEdi2_4AlojConc_91
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi2_4AlojConc_91);
    inputNumberMax.setAttribute("value",maxPerEdi2_4AlojConc_91);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi2_4AlojConc_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi2_4AlojConc_91.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi2_4AlojConc_91.noUiSlider.on('update',function(e){
        PerEdi2_4AlojConc_91.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_4AL91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_4AL91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi2_4AlojConc_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderPerEdi2_4AlojConc_91.noUiSlider;
    $(slidersGeral).append(sliderPerEdi2_4AlojConc_91);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 2 a 4 ALOJAMENTOS Concelho em 1991 -------------- \\\\\\


////////////////////////////------- Percentagem Total de EDIFICIOS COM 5 a 9 ALOJAMENTOS Concelho em 1991-----////

var minPerEdi5_9AlojConc_91 = 0;
var maxPerEdi5_9AlojConc_91 = 0;

function CorPerEdi5a9AlojConc(d) {
    return d >= 11.35 ? '#8c0303' :
        d >= 9.47  ? '#de1f35' :
        d >= 6.35 ? '#ff5e6e' :
        d >= 3.22   ? '#f5b3be' :
        d >= 0.09   ? '#F2C572' :
                ''  ;
}
var legendaPerEdi5a9AlojConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 11.35' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 9.47 - 11.35' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 6.35 - 9.47' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 3.22 - 6.35' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.09 - 3.22' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEdi5_9AlojConc_91(feature) {
    if( feature.properties.P_ED_9AL91 <= minPerEdi5_9AlojConc_91 || minPerEdi5_9AlojConc_91 === 0){
        minPerEdi5_9AlojConc_91 = feature.properties.P_ED_9AL91
    }
    if(feature.properties.P_ED_9AL91 >= maxPerEdi5_9AlojConc_91 ){
        maxPerEdi5_9AlojConc_91 = feature.properties.P_ED_9AL91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi5a9AlojConc(feature.properties.P_ED_9AL91)
    };
}
function apagarPerEdi5_9AlojConc_91(e) {
    PerEdi5_9AlojConc_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi5_9AlojConc_91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED_9AL91.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi5_9AlojConc_91,
    });
}
var PerEdi5_9AlojConc_91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloPerEdi5_9AlojConc_91,
    onEachFeature: onEachFeaturePerEdi5_9AlojConc_91
});
let slidePerEdi5_9AlojConc_91 = function(){
    var sliderPerEdi5_9AlojConc_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi5_9AlojConc_91, {
        start: [minPerEdi5_9AlojConc_91, maxPerEdi5_9AlojConc_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi5_9AlojConc_91,
            'max': maxPerEdi5_9AlojConc_91
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi5_9AlojConc_91);
    inputNumberMax.setAttribute("value",maxPerEdi5_9AlojConc_91);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi5_9AlojConc_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi5_9AlojConc_91.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi5_9AlojConc_91.noUiSlider.on('update',function(e){
        PerEdi5_9AlojConc_91.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_9AL91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_9AL91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi5_9AlojConc_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderPerEdi5_9AlojConc_91.noUiSlider;
    $(slidersGeral).append(sliderPerEdi5_9AlojConc_91);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 5 a 9 ALOJAMENTOS Concelho em 1991 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 10 OU MAIS ALOJAMENTOS Concelho em 1991-----////

var minPerEdi10AlojConc_91 = 0;
var maxPerEdi10AlojConc_91 = 0;

function CorPerEdi10AlojConc(d) {
    return d >= 8.53 ? '#8c0303' :
        d >= 7.11  ? '#de1f35' :
        d >= 4.75 ? '#ff5e6e' :
        d >= 2.38   ? '#f5b3be' :
        d >= 0.01   ? '#F2C572' :
                ''  ;
}
var legendaPerEdi10AlojConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 8.53' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 7.11 - 8.53' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 4.75 - 7.11' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 2.38 - 4.75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.01 - 2.38' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEdi10AlojConc_91(feature) {
    if( feature.properties.P_ED10AL91 <= minPerEdi10AlojConc_91 || minPerEdi10AlojConc_91 === 0){
        minPerEdi10AlojConc_91 = feature.properties.P_ED10AL91
    }
    if(feature.properties.P_ED10AL91 >= maxPerEdi10AlojConc_91 ){
        maxPerEdi10AlojConc_91 = feature.properties.P_ED10AL91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi10AlojConc(feature.properties.P_ED10AL91)
    };
}
function apagarPerEdi10AlojConc_91(e) {
    PerEdi10AlojConc_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi10AlojConc_91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED10AL91.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi10AlojConc_91,
    });
}
var PerEdi10AlojConc_91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloPerEdi10AlojConc_91,
    onEachFeature: onEachFeaturePerEdi10AlojConc_91
});
let slidePerEdi10AlojConc_91 = function(){
    var sliderPerEdi10AlojConc_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi10AlojConc_91, {
        start: [minPerEdi10AlojConc_91, maxPerEdi10AlojConc_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi10AlojConc_91,
            'max': maxPerEdi10AlojConc_91
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi10AlojConc_91);
    inputNumberMax.setAttribute("value",maxPerEdi10AlojConc_91);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi10AlojConc_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi10AlojConc_91.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi10AlojConc_91.noUiSlider.on('update',function(e){
        PerEdi10AlojConc_91.eachLayer(function(layer){
            if(layer.feature.properties.P_ED10AL91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED10AL91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi10AlojConc_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderPerEdi10AlojConc_91.noUiSlider;
    $(slidersGeral).append(sliderPerEdi10AlojConc_91);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 10 ou MAIS ALOJAMENTOS Concelho em 1991 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 1 ALOJAMENTO Concelho em 2001-----////

var minPerEdi1AlojConc_01 = 0;
var maxPerEdi1AlojConc_01 = 0;

function EstiloPerEdi1AlojConc_01(feature) {
    if( feature.properties.P_ED_1AL01 <= minPerEdi1AlojConc_01 || minPerEdi1AlojConc_01 === 0){
        minPerEdi1AlojConc_01 = feature.properties.P_ED_1AL01
    }
    if(feature.properties.P_ED_1AL01 >= maxPerEdi1AlojConc_01 ){
        maxPerEdi1AlojConc_01 = feature.properties.P_ED_1AL01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi1AlojConc(feature.properties.P_ED_1AL01)
    };
}
function apagarPerEdi1AlojConc_01(e) {
    PerEdi1AlojConc_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi1AlojConc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED_1AL01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi1AlojConc_01,
    });
}
var PerEdi1AlojConc_01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerEdi1AlojConc_01,
    onEachFeature: onEachFeaturePerEdi1AlojConc_01
});
let slidePerEdi1AlojConc_01 = function(){
    var sliderPerEdi1AlojConc_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi1AlojConc_01, {
        start: [minPerEdi1AlojConc_01, maxPerEdi1AlojConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi1AlojConc_01,
            'max': maxPerEdi1AlojConc_01
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi1AlojConc_01);
    inputNumberMax.setAttribute("value",maxPerEdi1AlojConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi1AlojConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi1AlojConc_01.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi1AlojConc_01.noUiSlider.on('update',function(e){
        PerEdi1AlojConc_01.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_1AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_1AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi1AlojConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderPerEdi1AlojConc_01.noUiSlider;
    $(slidersGeral).append(sliderPerEdi1AlojConc_01);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 1 ALOJAMENTO Concelho em 2001 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 2 a 4 ALOJAMENTOS Concelho em 2001-----////

var minPerEdi2_4AlojConc_01 = 0;
var maxPerEdi2_4AlojConc_01 = 0;

function EstiloPerEdi2_4AlojConc_01(feature) {
    if( feature.properties.P_ED_4AL01 <= minPerEdi2_4AlojConc_01 || minPerEdi2_4AlojConc_01 === 0){
        minPerEdi2_4AlojConc_01 = feature.properties.P_ED_4AL01
    }
    if(feature.properties.P_ED_4AL01 >= maxPerEdi2_4AlojConc_01 ){
        maxPerEdi2_4AlojConc_01 = feature.properties.P_ED_4AL01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi2a4AlojConc(feature.properties.P_ED_4AL01)
    };
}
function apagarPerEdi2_4AlojConc_01(e) {
    PerEdi2_4AlojConc_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi2_4AlojConc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED_4AL01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi2_4AlojConc_01,
    });
}
var PerEdi2_4AlojConc_01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerEdi2_4AlojConc_01,
    onEachFeature: onEachFeaturePerEdi2_4AlojConc_01
});
let slidePerEdi2_4AlojConc_01 = function(){
    var sliderPerEdi2_4AlojConc_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi2_4AlojConc_01, {
        start: [minPerEdi2_4AlojConc_01, maxPerEdi2_4AlojConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi2_4AlojConc_01,
            'max': maxPerEdi2_4AlojConc_01
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi2_4AlojConc_01);
    inputNumberMax.setAttribute("value",maxPerEdi2_4AlojConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi2_4AlojConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi2_4AlojConc_01.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi2_4AlojConc_01.noUiSlider.on('update',function(e){
        PerEdi2_4AlojConc_01.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_4AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_4AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi2_4AlojConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderPerEdi2_4AlojConc_01.noUiSlider;
    $(slidersGeral).append(sliderPerEdi2_4AlojConc_01);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 2 a 4 ALOJAMENTOS Concelho em 2001 -------------- \\\\\\


////////////////////////////------- Percentagem Total de EDIFICIOS COM 5 a 9 ALOJAMENTOS Concelho em 2001-----////

var minPerEdi5_9AlojConc_01 = 0;
var maxPerEdi5_9AlojConc_01 = 0;

function EstiloPerEdi5_9AlojConc_01(feature) {
    if( feature.properties.P_ED_9AL01 <= minPerEdi5_9AlojConc_01 || minPerEdi5_9AlojConc_01 === 0){
        minPerEdi5_9AlojConc_01 = feature.properties.P_ED_9AL01
    }
    if(feature.properties.P_ED_9AL01 >= maxPerEdi5_9AlojConc_01 ){
        maxPerEdi5_9AlojConc_01 = feature.properties.P_ED_9AL01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi5a9AlojConc(feature.properties.P_ED_9AL01)
    };
}
function apagarPerEdi5_9AlojConc_01(e) {
    PerEdi5_9AlojConc_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi5_9AlojConc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED_9AL01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi5_9AlojConc_01,
    });
}
var PerEdi5_9AlojConc_01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerEdi5_9AlojConc_01,
    onEachFeature: onEachFeaturePerEdi5_9AlojConc_01
});
let slidePerEdi5_9AlojConc_01 = function(){
    var sliderPerEdi5_9AlojConc_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi5_9AlojConc_01, {
        start: [minPerEdi5_9AlojConc_01, maxPerEdi5_9AlojConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi5_9AlojConc_01,
            'max': maxPerEdi5_9AlojConc_01
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi5_9AlojConc_01);
    inputNumberMax.setAttribute("value",maxPerEdi5_9AlojConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi5_9AlojConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi5_9AlojConc_01.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi5_9AlojConc_01.noUiSlider.on('update',function(e){
        PerEdi5_9AlojConc_01.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_9AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_9AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi5_9AlojConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderPerEdi5_9AlojConc_01.noUiSlider;
    $(slidersGeral).append(sliderPerEdi5_9AlojConc_01);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 5 a 9 ALOJAMENTOS Concelho em 2001 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 10 OU MAIS ALOJAMENTOS Concelho em 2001-----////

var minPerEdi10AlojConc_01 = 0;
var maxPerEdi10AlojConc_01 = 0;

function EstiloPerEdi10AlojConc_01(feature) {
    if( feature.properties.P_ED10AL01 <= minPerEdi10AlojConc_01 || minPerEdi10AlojConc_01 === 0){
        minPerEdi10AlojConc_01 = feature.properties.P_ED10AL01
    }
    if(feature.properties.P_ED10AL01 >= maxPerEdi10AlojConc_01 ){
        maxPerEdi10AlojConc_01 = feature.properties.P_ED10AL01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi10AlojConc(feature.properties.P_ED10AL01)
    };
}
function apagarPerEdi10AlojConc_01(e) {
    PerEdi10AlojConc_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi10AlojConc_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED10AL01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi10AlojConc_01,
    });
}
var PerEdi10AlojConc_01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerEdi10AlojConc_01,
    onEachFeature: onEachFeaturePerEdi10AlojConc_01
});
let slidePerEdi10AlojConc_01 = function(){
    var sliderPerEdi10AlojConc_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi10AlojConc_01, {
        start: [minPerEdi10AlojConc_01, maxPerEdi10AlojConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi10AlojConc_01,
            'max': maxPerEdi10AlojConc_01
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi10AlojConc_01);
    inputNumberMax.setAttribute("value",maxPerEdi10AlojConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi10AlojConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi10AlojConc_01.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi10AlojConc_01.noUiSlider.on('update',function(e){
        PerEdi10AlojConc_01.eachLayer(function(layer){
            if(layer.feature.properties.P_ED10AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED10AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi10AlojConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderPerEdi10AlojConc_01.noUiSlider;
    $(slidersGeral).append(sliderPerEdi10AlojConc_01);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 10 ou MAIS ALOJAMENTOS Concelho em 2001 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 1 ALOJAMENTO Concelho em 2011-----////

var minPerEdi1AlojConc_11 = 0;
var maxPerEdi1AlojConc_11 = 0;

function EstiloPerEdi1AlojConc_11(feature) {
    if( feature.properties.P_ED_1AL11 <= minPerEdi1AlojConc_11 || minPerEdi1AlojConc_11 === 0){
        minPerEdi1AlojConc_11 = feature.properties.P_ED_1AL11
    }
    if(feature.properties.P_ED_1AL11 >= maxPerEdi1AlojConc_11 ){
        maxPerEdi1AlojConc_11 = feature.properties.P_ED_1AL11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi1AlojConc(feature.properties.P_ED_1AL11)
    };
}
function apagarPerEdi1AlojConc_11(e) {
    PerEdi1AlojConc_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi1AlojConc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED_1AL11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi1AlojConc_11,
    });
}
var PerEdi1AlojConc_11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerEdi1AlojConc_11,
    onEachFeature: onEachFeaturePerEdi1AlojConc_11
});
let slidePerEdi1AlojConc_11 = function(){
    var sliderPerEdi1AlojConc_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi1AlojConc_11, {
        start: [minPerEdi1AlojConc_11, maxPerEdi1AlojConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi1AlojConc_11,
            'max': maxPerEdi1AlojConc_11
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi1AlojConc_11);
    inputNumberMax.setAttribute("value",maxPerEdi1AlojConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi1AlojConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi1AlojConc_11.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi1AlojConc_11.noUiSlider.on('update',function(e){
        PerEdi1AlojConc_11.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_1AL11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_1AL11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi1AlojConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderPerEdi1AlojConc_11.noUiSlider;
    $(slidersGeral).append(sliderPerEdi1AlojConc_11);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 1 ALOJAMENTO Concelho em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 2 a 4 ALOJAMENTOS Concelho em 2011-----////

var minPerEdi2_4AlojConc_11 = 0;
var maxPerEdi2_4AlojConc_11 = 0;

function EstiloPerEdi2_4AlojConc_11(feature) {
    if( feature.properties.P_ED_4AL11 <= minPerEdi2_4AlojConc_11 || minPerEdi2_4AlojConc_11 === 0){
        minPerEdi2_4AlojConc_11 = feature.properties.P_ED_4AL11
    }
    if(feature.properties.P_ED_4AL11 >= maxPerEdi2_4AlojConc_11 ){
        maxPerEdi2_4AlojConc_11 = feature.properties.P_ED_4AL11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi2a4AlojConc(feature.properties.P_ED_4AL11)
    };
}
function apagarPerEdi2_4AlojConc_11(e) {
    PerEdi2_4AlojConc_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi2_4AlojConc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED_4AL11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi2_4AlojConc_11,
    });
}
var PerEdi2_4AlojConc_11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerEdi2_4AlojConc_11,
    onEachFeature: onEachFeaturePerEdi2_4AlojConc_11
});
let slidePerEdi2_4AlojConc_11 = function(){
    var sliderPerEdi2_4AlojConc_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi2_4AlojConc_11, {
        start: [minPerEdi2_4AlojConc_11, maxPerEdi2_4AlojConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi2_4AlojConc_11,
            'max': maxPerEdi2_4AlojConc_11
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi2_4AlojConc_11);
    inputNumberMax.setAttribute("value",maxPerEdi2_4AlojConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi2_4AlojConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi2_4AlojConc_11.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi2_4AlojConc_11.noUiSlider.on('update',function(e){
        PerEdi2_4AlojConc_11.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_4AL11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_4AL11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi2_4AlojConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderPerEdi2_4AlojConc_11.noUiSlider;
    $(slidersGeral).append(sliderPerEdi2_4AlojConc_11);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 2 a 4 ALOJAMENTOS Concelho em 2011 -------------- \\\\\\


////////////////////////////------- Percentagem Total de EDIFICIOS COM 5 a 9 ALOJAMENTOS Concelho em 2011-----////

var minPerEdi5_9AlojConc_11 = 0;
var maxPerEdi5_9AlojConc_11 = 0;

function EstiloPerEdi5_9AlojConc_11(feature) {
    if( feature.properties.P_ED_9AL11 <= minPerEdi5_9AlojConc_11 || minPerEdi5_9AlojConc_11 === 0){
        minPerEdi5_9AlojConc_11 = feature.properties.P_ED_9AL11
    }
    if(feature.properties.P_ED_9AL11 >= maxPerEdi5_9AlojConc_11 ){
        maxPerEdi5_9AlojConc_11 = feature.properties.P_ED_9AL11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi5a9AlojConc(feature.properties.P_ED_9AL11)
    };
}
function apagarPerEdi5_9AlojConc_11(e) {
    PerEdi5_9AlojConc_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi5_9AlojConc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED_9AL11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi5_9AlojConc_11,
    });
}
var PerEdi5_9AlojConc_11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerEdi5_9AlojConc_11,
    onEachFeature: onEachFeaturePerEdi5_9AlojConc_11
});
let slidePerEdi5_9AlojConc_11 = function(){
    var sliderPerEdi5_9AlojConc_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi5_9AlojConc_11, {
        start: [minPerEdi5_9AlojConc_11, maxPerEdi5_9AlojConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi5_9AlojConc_11,
            'max': maxPerEdi5_9AlojConc_11
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi5_9AlojConc_11);
    inputNumberMax.setAttribute("value",maxPerEdi5_9AlojConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi5_9AlojConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi5_9AlojConc_11.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi5_9AlojConc_11.noUiSlider.on('update',function(e){
        PerEdi5_9AlojConc_11.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_9AL11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_9AL11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi5_9AlojConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderPerEdi5_9AlojConc_11.noUiSlider;
    $(slidersGeral).append(sliderPerEdi5_9AlojConc_11);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 5 a 9 ALOJAMENTOS Concelho em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 10 OU MAIS ALOJAMENTOS Concelho em 2011-----////

var minPerEdi10AlojConc_11 = 0;
var maxPerEdi10AlojConc_11 = 0;

function EstiloPerEdi10AlojConc_11(feature) {
    if( feature.properties.P_ED10AL11 <= minPerEdi10AlojConc_11 || minPerEdi10AlojConc_11 === 0){
        minPerEdi10AlojConc_11 = feature.properties.P_ED10AL11
    }
    if(feature.properties.P_ED10AL11 >= maxPerEdi10AlojConc_11 ){
        maxPerEdi10AlojConc_11 = feature.properties.P_ED10AL11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi10AlojConc(feature.properties.P_ED10AL11)
    };
}
function apagarPerEdi10AlojConc_11(e) {
    PerEdi10AlojConc_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi10AlojConc_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED10AL11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi10AlojConc_11,
    });
}
var PerEdi10AlojConc_11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerEdi10AlojConc_11,
    onEachFeature: onEachFeaturePerEdi10AlojConc_11
});
let slidePerEdi10AlojConc_11 = function(){
    var sliderPerEdi10AlojConc_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi10AlojConc_11, {
        start: [minPerEdi10AlojConc_11, maxPerEdi10AlojConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi10AlojConc_11,
            'max': maxPerEdi10AlojConc_11
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi10AlojConc_11);
    inputNumberMax.setAttribute("value",maxPerEdi10AlojConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi10AlojConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi10AlojConc_11.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi10AlojConc_11.noUiSlider.on('update',function(e){
        PerEdi10AlojConc_11.eachLayer(function(layer){
            if(layer.feature.properties.P_ED10AL11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED10AL11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi10AlojConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderPerEdi10AlojConc_11.noUiSlider;
    $(slidersGeral).append(sliderPerEdi10AlojConc_11);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 10 ou MAIS ALOJAMENTOS Concelho em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 1 ALOJAMENTO Concelho em 2021-----////

var minPerEdi1AlojConc_21 = 0;
var maxPerEdi1AlojConc_21 = 0;

function EstiloPerEdi1AlojConc_21(feature) {
    if( feature.properties.P_ED_1AL21 <= minPerEdi1AlojConc_21 || minPerEdi1AlojConc_21 === 0){
        minPerEdi1AlojConc_21 = feature.properties.P_ED_1AL21
    }
    if(feature.properties.P_ED_1AL21 >= maxPerEdi1AlojConc_21 ){
        maxPerEdi1AlojConc_21 = feature.properties.P_ED_1AL21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi1AlojConc(feature.properties.P_ED_1AL21)
    };
}
function apagarPerEdi1AlojConc_21(e) {
    PerEdi1AlojConc_21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi1AlojConc_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED_1AL21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi1AlojConc_21,
    });
}
var PerEdi1AlojConc_21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerEdi1AlojConc_21,
    onEachFeature: onEachFeaturePerEdi1AlojConc_21
});
let slidePerEdi1AlojConc_21 = function(){
    var sliderPerEdi1AlojConc_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi1AlojConc_21, {
        start: [minPerEdi1AlojConc_21, maxPerEdi1AlojConc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi1AlojConc_21,
            'max': maxPerEdi1AlojConc_21
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi1AlojConc_21);
    inputNumberMax.setAttribute("value",maxPerEdi1AlojConc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi1AlojConc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi1AlojConc_21.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi1AlojConc_21.noUiSlider.on('update',function(e){
        PerEdi1AlojConc_21.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_1AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_1AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi1AlojConc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderPerEdi1AlojConc_21.noUiSlider;
    $(slidersGeral).append(sliderPerEdi1AlojConc_21);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 1 ALOJAMENTO Concelho em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 2 a 4 ALOJAMENTOS Concelho em 2021-----////

var minPerEdi2_4AlojConc_21 = 0;
var maxPerEdi2_4AlojConc_21 = 0;

function EstiloPerEdi2_4AlojConc_21(feature) {
    if( feature.properties.P_ED_4AL21 <= minPerEdi2_4AlojConc_21 || minPerEdi2_4AlojConc_21 === 0){
        minPerEdi2_4AlojConc_21 = feature.properties.P_ED_4AL21
    }
    if(feature.properties.P_ED_4AL21 >= maxPerEdi2_4AlojConc_21 ){
        maxPerEdi2_4AlojConc_21 = feature.properties.P_ED_4AL21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi2a4AlojConc(feature.properties.P_ED_4AL21)
    };
}
function apagarPerEdi2_4AlojConc_21(e) {
    PerEdi2_4AlojConc_21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi2_4AlojConc_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED_4AL21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi2_4AlojConc_21,
    });
}
var PerEdi2_4AlojConc_21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerEdi2_4AlojConc_21,
    onEachFeature: onEachFeaturePerEdi2_4AlojConc_21
});
let slidePerEdi2_4AlojConc_21 = function(){
    var sliderPerEdi2_4AlojConc_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi2_4AlojConc_21, {
        start: [minPerEdi2_4AlojConc_21, maxPerEdi2_4AlojConc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi2_4AlojConc_21,
            'max': maxPerEdi2_4AlojConc_21
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi2_4AlojConc_21);
    inputNumberMax.setAttribute("value",maxPerEdi2_4AlojConc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi2_4AlojConc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi2_4AlojConc_21.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi2_4AlojConc_21.noUiSlider.on('update',function(e){
        PerEdi2_4AlojConc_21.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_4AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_4AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi2_4AlojConc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderPerEdi2_4AlojConc_21.noUiSlider;
    $(slidersGeral).append(sliderPerEdi2_4AlojConc_21);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 2 a 4 ALOJAMENTOS Concelho em 2021 -------------- \\\\\\


////////////////////////////------- Percentagem Total de EDIFICIOS COM 5 a 9 ALOJAMENTOS Concelho em 2021-----////

var minPerEdi5_9AlojConc_21 = 0;
var maxPerEdi5_9AlojConc_21 = 0;

function EstiloPerEdi5_9AlojConc_21(feature) {
    if( feature.properties.P_ED_9AL21 <= minPerEdi5_9AlojConc_21 || minPerEdi5_9AlojConc_21 === 0){
        minPerEdi5_9AlojConc_21 = feature.properties.P_ED_9AL21
    }
    if(feature.properties.P_ED_9AL21 >= maxPerEdi5_9AlojConc_21 ){
        maxPerEdi5_9AlojConc_21 = feature.properties.P_ED_9AL21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi5a9AlojConc(feature.properties.P_ED_9AL21)
    };
}
function apagarPerEdi5_9AlojConc_21(e) {
    PerEdi5_9AlojConc_21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi5_9AlojConc_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED_9AL21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi5_9AlojConc_21,
    });
}
var PerEdi5_9AlojConc_21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerEdi5_9AlojConc_21,
    onEachFeature: onEachFeaturePerEdi5_9AlojConc_21
});
let slidePerEdi5_9AlojConc_21 = function(){
    var sliderPerEdi5_9AlojConc_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi5_9AlojConc_21, {
        start: [minPerEdi5_9AlojConc_21, maxPerEdi5_9AlojConc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi5_9AlojConc_21,
            'max': maxPerEdi5_9AlojConc_21
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi5_9AlojConc_21);
    inputNumberMax.setAttribute("value",maxPerEdi5_9AlojConc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi5_9AlojConc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi5_9AlojConc_21.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi5_9AlojConc_21.noUiSlider.on('update',function(e){
        PerEdi5_9AlojConc_21.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_9AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_9AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi5_9AlojConc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderPerEdi5_9AlojConc_21.noUiSlider;
    $(slidersGeral).append(sliderPerEdi5_9AlojConc_21);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 5 a 9 ALOJAMENTOS Concelho em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 10 OU MAIS ALOJAMENTOS Concelho em 2021-----////

var minPerEdi10AlojConc_21 = 0;
var maxPerEdi10AlojConc_21 = 0;

function EstiloPerEdi10AlojConc_21(feature) {
    if( feature.properties.P_ED10AL21 <= minPerEdi10AlojConc_21 || minPerEdi10AlojConc_21 === 0){
        minPerEdi10AlojConc_21 = feature.properties.P_ED10AL21
    }
    if(feature.properties.P_ED10AL21 >= maxPerEdi10AlojConc_21 ){
        maxPerEdi10AlojConc_21 = feature.properties.P_ED10AL21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi10AlojConc(feature.properties.P_ED10AL21)
    };
}
function apagarPerEdi10AlojConc_21(e) {
    PerEdi10AlojConc_21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi10AlojConc_21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.P_ED10AL21.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi10AlojConc_21,
    });
}
var PerEdi10AlojConc_21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloPerEdi10AlojConc_21,
    onEachFeature: onEachFeaturePerEdi10AlojConc_21
});
let slidePerEdi10AlojConc_21 = function(){
    var sliderPerEdi10AlojConc_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi10AlojConc_21, {
        start: [minPerEdi10AlojConc_21, maxPerEdi10AlojConc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi10AlojConc_21,
            'max': maxPerEdi10AlojConc_21
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi10AlojConc_21);
    inputNumberMax.setAttribute("value",maxPerEdi10AlojConc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi10AlojConc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi10AlojConc_21.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi10AlojConc_21.noUiSlider.on('update',function(e){
        PerEdi10AlojConc_21.eachLayer(function(layer){
            if(layer.feature.properties.P_ED10AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED10AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi10AlojConc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderPerEdi10AlojConc_21.noUiSlider;
    $(slidersGeral).append(sliderPerEdi10AlojConc_21);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 10 ou MAIS ALOJAMENTOS Concelho em 2021 -------------- \\\\\\
///////////////////////////////------------------------ FIM DADOS RELATIVOS ---------------------\\\\\\\\\\\\\\\\\\\
////////////////////////////// ------------------ DADOS VARIAÇÃO CONCELHO ----------------------------------\\\\\\\\\\\\\\\

/////////////////////////////------- Variação Edifícios com 1 ALOJAMENTO, CONCELHO 2001 1991 -------------------////

var minVarEdi1AlojConc_01 = 0;
var maxVarEdi1AlojConc_01 = 0;

function CorVar1AlojConc01_91(d) {
    return d == null ? '#000000' :
        d >= 20  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -21.63   ? '#2288bf' :
                ''  ;
}

var legendaVar1AlojConc01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 1 alojamento, entre 2001 e 1991, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -21.62 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' Sem informação disponível' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi1AlojConc_01(feature) {
    if(feature.properties.V_ED_1AL01 <= minVarEdi1AlojConc_01 || minVarEdi1AlojConc_01 ===0){
        minVarEdi1AlojConc_01 = feature.properties.V_ED_1AL01
    }
    if(feature.properties.V_ED_1AL01 > maxVarEdi1AlojConc_01){
        maxVarEdi1AlojConc_01 = feature.properties.V_ED_1AL01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1AlojConc01_91(feature.properties.V_ED_1AL01)};
    }


function apagarVarEdi1AlojConc_01(e) {
    VarEdi1AlojConc_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi1AlojConc_01(feature, layer) {
    if(feature.properties.V_ED_1AL01 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED_1AL01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi1AlojConc_01,
    });
}
var VarEdi1AlojConc_01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarEdi1AlojConc_01,
    onEachFeature: onEachFeatureVarEdi1AlojConc_01
});

let slideVarEdi1AlojConc_01 = function(){
    var sliderVarEdi1AlojConc_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi1AlojConc_01, {
        start: [minVarEdi1AlojConc_01, maxVarEdi1AlojConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi1AlojConc_01,
            'max': maxVarEdi1AlojConc_01
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi1AlojConc_01);
    inputNumberMax.setAttribute("value",maxVarEdi1AlojConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi1AlojConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi1AlojConc_01.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi1AlojConc_01.noUiSlider.on('update',function(e){
        VarEdi1AlojConc_01.eachLayer(function(layer){
            if (!layer.feature.properties.V_ED_1AL01){
                return false
            }
            if(layer.feature.properties.V_ED_1AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED_1AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi1AlojConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderVarEdi1AlojConc_01.noUiSlider;
    $(slidersGeral).append(sliderVarEdi1AlojConc_01);
} 

//////////////////////--------- Fim da Variação Edifícios com 1 ALOJAMENTO, CONCELHO 2001 1991-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 2 a 4 ALOJAMENTOS, CONCELHO 2001 1991 -------------------////

var minVarEdi2_4AlojConc_01 = 0;
var maxVarEdi2_4AlojConc_01 = 0;

function CorVar2a4AlojConc01_91(d) {
    return d == null ? '#000000' :
        d >= 25  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -19.16   ? '#2288bf' :
                ''  ;
}

var legendaVar2a4AlojConc01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 2 a 4 alojamentos, entre 2001 e 1991, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -19.15 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi2_4AlojConc_01(feature) {
    if(feature.properties.V_ED_4AL01 <= minVarEdi2_4AlojConc_01 || minVarEdi2_4AlojConc_01 ===0){
        minVarEdi2_4AlojConc_01 = feature.properties.V_ED_4AL01
    }
    if(feature.properties.V_ED_4AL01 > maxVarEdi2_4AlojConc_01){
        maxVarEdi2_4AlojConc_01 = feature.properties.V_ED_4AL01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2a4AlojConc01_91(feature.properties.V_ED_4AL01)};
    }


function apagarVarEdi2_4AlojConc_01(e) {
    VarEdi2_4AlojConc_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi2_4AlojConc_01(feature, layer) {
    if(feature.properties.V_ED_4AL01 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED_4AL01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi2_4AlojConc_01,
    });
}
var VarEdi2_4AlojConc_01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarEdi2_4AlojConc_01,
    onEachFeature: onEachFeatureVarEdi2_4AlojConc_01
});

let slideVarEdi2_4AlojConc_01 = function(){
    var sliderVarEdi2_4AlojConc_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi2_4AlojConc_01, {
        start: [minVarEdi2_4AlojConc_01, maxVarEdi2_4AlojConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi2_4AlojConc_01,
            'max': maxVarEdi2_4AlojConc_01
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi2_4AlojConc_01);
    inputNumberMax.setAttribute("value",maxVarEdi2_4AlojConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi2_4AlojConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi2_4AlojConc_01.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi2_4AlojConc_01.noUiSlider.on('update',function(e){
        VarEdi2_4AlojConc_01.eachLayer(function(layer){
            if (!layer.feature.properties.V_ED_4AL01){
                return false
            }
            if(layer.feature.properties.V_ED_4AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED_4AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi2_4AlojConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderVarEdi2_4AlojConc_01.noUiSlider;
    $(slidersGeral).append(sliderVarEdi2_4AlojConc_01);
} 

//////////////////////--------- Fim da Variação Edifícios com 2 A 4 ALOJAMENTO, CONCELHO 2001 1991-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 5 a 9 ALOJAMENTOS, CONCELHO 2001 1991 -------------------////

var minVarEdi5_9AlojConc_01 = 0;
var maxVarEdi5_9AlojConc_01 = 0;

function CorVar5a9AlojConc01_91(d) {
    return d == null ? '#000000' :
        d >= 100  ? '#8c0303' :
        d >= 75  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 25  ? '#f5b3be' :
        d >= 9.02   ? '#F2C572' :
                ''  ;
}

var legendaVar5a9AlojConc01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 5 a 9 alojamentos, entre 2001 e 1991, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 75 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 9.02 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi5_9AlojConc_01(feature) {
    if(feature.properties.V_ED_9AL01 <= minVarEdi5_9AlojConc_01 &&  feature.properties.V_ED_9AL01 > null || minVarEdi5_9AlojConc_01 ===0){
        minVarEdi5_9AlojConc_01 = feature.properties.V_ED_9AL01
    }
    if(feature.properties.V_ED_9AL01 > maxVarEdi5_9AlojConc_01){
        maxVarEdi5_9AlojConc_01 = feature.properties.V_ED_9AL01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar5a9AlojConc01_91(feature.properties.V_ED_9AL01)};
    }


function apagarVarEdi5_9AlojConc_01(e) {
    VarEdi5_9AlojConc_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi5_9AlojConc_01(feature, layer) {
    if(feature.properties.V_ED_9AL01 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED_9AL01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi5_9AlojConc_01,
    });
}
var VarEdi5_9AlojConc_01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarEdi5_9AlojConc_01,
    onEachFeature: onEachFeatureVarEdi5_9AlojConc_01
});

let slideVarEdi5_9AlojConc_01 = function(){
    var sliderVarEdi5_9AlojConc_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi5_9AlojConc_01, {
        start: [minVarEdi5_9AlojConc_01, maxVarEdi5_9AlojConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi5_9AlojConc_01,
            'max': maxVarEdi5_9AlojConc_01
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi5_9AlojConc_01);
    inputNumberMax.setAttribute("value",maxVarEdi5_9AlojConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi5_9AlojConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi5_9AlojConc_01.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi5_9AlojConc_01.noUiSlider.on('update',function(e){
        VarEdi5_9AlojConc_01.eachLayer(function(layer){
            if (!layer.feature.properties.V_ED_9AL01){
                return false
            }
            if(layer.feature.properties.V_ED_9AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED_9AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi5_9AlojConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderVarEdi5_9AlojConc_01.noUiSlider;
    $(slidersGeral).append(sliderVarEdi5_9AlojConc_01);
} 

//////////////////////--------- Fim da Variação Edifícios com 5 A 9 ALOJAMENTO, CONCELHO 2001 1991-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 10 OU MAIS ALOJAMENTOS, CONCELHO 2001 1991 -------------------////

var minVarEdi10AlojConc_01 = 99;
var maxVarEdi10AlojConc_01 = 0;

function CorVar10AlojConc01_91(d) {
    return d == null ? '#000000' :
        d >= 100  ? '#de1f35' :
        d >= 75   ? '#ff5e6e' :
        d >= 50  ? '#f5b3be' :
        d >= 19.23   ? '#F2C572' :
        d >= 0.00  ? '#506266' :
                ''  ;
}

var legendaVar10AlojConc01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 10 ou mais alojamentos, entre 2001 e 1991, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + ' > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 75 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 19.23 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#506266"></i>' + ' 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi10AlojConc_01(feature) {
    if(feature.properties.V_ED10AL01 <= minVarEdi10AlojConc_01  && feature.properties.V_ED10AL01 > null|| feature.properties.V_ED10AL01 ===0){
        minVarEdi10AlojConc_01 = feature.properties.V_ED10AL01
    }
    if(feature.properties.V_ED10AL01 > maxVarEdi10AlojConc_01){
        maxVarEdi10AlojConc_01 = feature.properties.V_ED10AL01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar10AlojConc01_91(feature.properties.V_ED10AL01)};
    }


function apagarVarEdi10AlojConc_01(e) {
    VarEdi10AlojConc_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi10AlojConc_01(feature, layer) {
    if(feature.properties.V_ED10AL01 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED10AL01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi10AlojConc_01,
    });
}
var VarEdi10AlojConc_01= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarEdi10AlojConc_01,
    onEachFeature: onEachFeatureVarEdi10AlojConc_01
});

let slideVarEdi10AlojConc_01 = function(){
    var sliderVarEdi10AlojConc_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi10AlojConc_01, {
        start: [minVarEdi10AlojConc_01, maxVarEdi10AlojConc_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi10AlojConc_01,
            'max': maxVarEdi10AlojConc_01
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi10AlojConc_01);
    inputNumberMax.setAttribute("value",maxVarEdi10AlojConc_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi10AlojConc_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi10AlojConc_01.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi10AlojConc_01.noUiSlider.on('update',function(e){
        VarEdi10AlojConc_01.eachLayer(function(layer){
            if (!layer.feature.properties.V_ED10AL01){
                return false
            }
            if(layer.feature.properties.V_ED10AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED10AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi10AlojConc_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderVarEdi10AlojConc_01.noUiSlider;
    $(slidersGeral).append(sliderVarEdi10AlojConc_01);
} 

//////////////////////--------- Fim da Variação Edifícios com 10 ou MAIS ALOJAMENTO, CONCELHO 2001 1991-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 1 ALOJAMENTO, CONCELHO 2011 2001 -------------------////

var minVarEdi1AlojConc_11 = 0;
var maxVarEdi1AlojConc_11 = 0;

function CorVar1AlojConc11_01(d) {
    return d == null ? '#000000' :
        d >= 15  ? '#8c0303' :
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10.56   ? '#9eaad7' :
                ''  ;
}

var legendaVar1AlojConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 1 alojamento, entre 2011 e 2001, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  10 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10.55 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi1AlojConc_11(feature) {
    if(feature.properties.V_ED_1AL11 <= minVarEdi1AlojConc_11 || minVarEdi1AlojConc_11 ===0){
        minVarEdi1AlojConc_11 = feature.properties.V_ED_1AL11
    }
    if(feature.properties.V_ED_1AL11 > maxVarEdi1AlojConc_11){
        maxVarEdi1AlojConc_11 = feature.properties.V_ED_1AL11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1AlojConc11_01(feature.properties.V_ED_1AL11)};
    }


function apagarVarEdi1AlojConc_11(e) {
    VarEdi1AlojConc_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi1AlojConc_11(feature, layer) {
    if(feature.properties.V_ED_1AL11 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED_1AL11.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi1AlojConc_11,
    });
}
var VarEdi1AlojConc_11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarEdi1AlojConc_11,
    onEachFeature: onEachFeatureVarEdi1AlojConc_11
});

let slideVarEdi1AlojConc_11 = function(){
    var sliderVarEdi1AlojConc_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi1AlojConc_11, {
        start: [minVarEdi1AlojConc_11, maxVarEdi1AlojConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi1AlojConc_11,
            'max': maxVarEdi1AlojConc_11
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi1AlojConc_11);
    inputNumberMax.setAttribute("value",maxVarEdi1AlojConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi1AlojConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi1AlojConc_11.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi1AlojConc_11.noUiSlider.on('update',function(e){
        VarEdi1AlojConc_11.eachLayer(function(layer){
            if (!layer.feature.properties.V_ED_1AL11){
                return false
            }
            if(layer.feature.properties.V_ED_1AL11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED_1AL11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi1AlojConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderVarEdi1AlojConc_11.noUiSlider;
    $(slidersGeral).append(sliderVarEdi1AlojConc_11);
} 

//////////////////////--------- Fim da Variação Edifícios com 1 ALOJAMENTO, CONCELHO 2011 2001-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 2 a 4 ALOJAMENTOS, CONCELHO 2011 2001 -------------------////

var minVarEdi2_4AlojConc_11 = 0;
var maxVarEdi2_4AlojConc_11 = 0;

function CorVar2a4AlojConc11_01(d) {
    return d == null ? '#000000' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -15  ? '#9eaad7' :
        d >= -23.45   ? '#2288bf' :
                ''  ;
}

var legendaVar2a4AlojConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 2 a 4 alojamentos, entre 2011 e 2001, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -15 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -23.44 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi2_4AlojConc_11(feature) {
    if(feature.properties.V_ED_4AL11 <= minVarEdi2_4AlojConc_11 || minVarEdi2_4AlojConc_11 ===0){
        minVarEdi2_4AlojConc_11 = feature.properties.V_ED_4AL11
    }
    if(feature.properties.V_ED_4AL11 > maxVarEdi2_4AlojConc_11){
        maxVarEdi2_4AlojConc_11 = feature.properties.V_ED_4AL11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2a4AlojConc11_01(feature.properties.V_ED_4AL11)};
    }


function apagarVarEdi2_4AlojConc_11(e) {
    VarEdi2_4AlojConc_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi2_4AlojConc_11(feature, layer) {
    if(feature.properties.V_ED_4AL11 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED_4AL11.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi2_4AlojConc_11,
    });
}
var VarEdi2_4AlojConc_11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarEdi2_4AlojConc_11,
    onEachFeature: onEachFeatureVarEdi2_4AlojConc_11
});

let slideVarEdi2_4AlojConc_11 = function(){
    var sliderVarEdi2_4AlojConc_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi2_4AlojConc_11, {
        start: [minVarEdi2_4AlojConc_11, maxVarEdi2_4AlojConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi2_4AlojConc_11,
            'max': maxVarEdi2_4AlojConc_11
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi2_4AlojConc_11);
    inputNumberMax.setAttribute("value",maxVarEdi2_4AlojConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi2_4AlojConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi2_4AlojConc_11.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi2_4AlojConc_11.noUiSlider.on('update',function(e){
        VarEdi2_4AlojConc_11.eachLayer(function(layer){
            if (!layer.feature.properties.V_ED_4AL11){
                return false
            }
            if(layer.feature.properties.V_ED_4AL11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED_4AL11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi2_4AlojConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderVarEdi2_4AlojConc_11.noUiSlider;
    $(slidersGeral).append(sliderVarEdi2_4AlojConc_11);
} 

//////////////////////--------- Fim da Variação Edifícios com 2 A 4 ALOJAMENTO, CONCELHO 2011 2001-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 5 a 9 ALOJAMENTOS, CONCELHO 2011 2001 -------------------////

var minVarEdi5_9AlojConc_11 = 0;
var maxVarEdi5_9AlojConc_11 = 0;

function CorVar5a9AlojConc11_01(d) {
    return d == null ? '#000000' :
        d >= 40  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 20   ? '#ff5e6e' :
        d >= 10  ? '#f5b3be' :
        d >= 6.16   ? '#F2C572' :
                ''  ;
}

var legendaVar5a9AlojConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 5 a 9 alojamentos, entre 2011 e 2001, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 30 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 20 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 6.16 a 10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi5_9AlojConc_11(feature) {
    if(feature.properties.V_ED_9AL11 <= minVarEdi5_9AlojConc_11 || minVarEdi5_9AlojConc_11 ===0){
        minVarEdi5_9AlojConc_11 = feature.properties.V_ED_9AL11
    }
    if(feature.properties.V_ED_9AL11 > maxVarEdi5_9AlojConc_11){
        maxVarEdi5_9AlojConc_11 = feature.properties.V_ED_9AL11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar5a9AlojConc11_01(feature.properties.V_ED_9AL11)};
    }


function apagarVarEdi5_9AlojConc_11(e) {
    VarEdi5_9AlojConc_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi5_9AlojConc_11(feature, layer) {
    if(feature.properties.V_ED_9AL11 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED_9AL11.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi5_9AlojConc_11,
    });
}
var VarEdi5_9AlojConc_11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarEdi5_9AlojConc_11,
    onEachFeature: onEachFeatureVarEdi5_9AlojConc_11
});

let slideVarEdi5_9AlojConc_11 = function(){
    var sliderVarEdi5_9AlojConc_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 39){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi5_9AlojConc_11, {
        start: [minVarEdi5_9AlojConc_11, maxVarEdi5_9AlojConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi5_9AlojConc_11,
            'max': maxVarEdi5_9AlojConc_11
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi5_9AlojConc_11);
    inputNumberMax.setAttribute("value",maxVarEdi5_9AlojConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi5_9AlojConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi5_9AlojConc_11.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi5_9AlojConc_11.noUiSlider.on('update',function(e){
        VarEdi5_9AlojConc_11.eachLayer(function(layer){
            if (!layer.feature.properties.V_ED_9AL11){
                return false
            }
            if(layer.feature.properties.V_ED_9AL11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED_9AL11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi5_9AlojConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 39;
    sliderAtivo = sliderVarEdi5_9AlojConc_11.noUiSlider;
    $(slidersGeral).append(sliderVarEdi5_9AlojConc_11);
} 

//////////////////////--------- Fim da Variação Edifícios com 5 A 9 ALOJAMENTO, CONCELHO 2011 2001-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 10 OU MAIS ALOJAMENTOS, CONCELHO 2011 2001

var minVarEdi10AlojConc_11 = 0;
var maxVarEdi10AlojConc_11 = 0;

function CorVar10AlojConc11_01(d) {
    return d == null ? '#000000' :
        d >= 50  ? '#8c0303' :
        d >= 40  ? '#de1f35' :
        d >= 30   ? '#ff5e6e' :
        d >= 20  ? '#f5b3be' :
        d >= 7.32   ? '#F2C572' :
        d >= 0.00  ? '#000000' :
                ''  ;
}

var legendaVar10AlojConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 10 ou mais alojamentos, entre 2011 e 2001, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + ' > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 40 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 30 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 20 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 7.32 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' 0' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi10AlojConc_11(feature) {
    if(feature.properties.V_ED10AL11 <= minVarEdi10AlojConc_11 || minVarEdi10AlojConc_11 ===0){
        minVarEdi10AlojConc_11 = feature.properties.V_ED10AL11
    }
    if(feature.properties.V_ED10AL11 > maxVarEdi10AlojConc_11){
        maxVarEdi10AlojConc_11 = feature.properties.V_ED10AL11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar10AlojConc11_01(feature.properties.V_ED10AL11)};
    }


function apagarVarEdi10AlojConc_11(e) {
    VarEdi10AlojConc_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi10AlojConc_11(feature, layer) {
    if(feature.properties.V_ED10AL11 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED10AL11.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi10AlojConc_11,
    });
}
var VarEdi10AlojConc_11= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarEdi10AlojConc_11,
    onEachFeature: onEachFeatureVarEdi10AlojConc_11
});

let slideVarEdi10AlojConc_11 = function(){
    var sliderVarEdi10AlojConc_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi10AlojConc_11, {
        start: [minVarEdi10AlojConc_11, maxVarEdi10AlojConc_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi10AlojConc_11,
            'max': maxVarEdi10AlojConc_11
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi10AlojConc_11);
    inputNumberMax.setAttribute("value",maxVarEdi10AlojConc_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi10AlojConc_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi10AlojConc_11.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi10AlojConc_11.noUiSlider.on('update',function(e){
        VarEdi10AlojConc_11.eachLayer(function(layer){
            if (!layer.feature.properties.V_ED10AL11){
                return false
            }
            if(layer.feature.properties.V_ED10AL11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED10AL11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi10AlojConc_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderVarEdi10AlojConc_11.noUiSlider;
    $(slidersGeral).append(sliderVarEdi10AlojConc_11);
} 

//////////////////////--------- Fim da Variação Edifícios com 10 ou MAIS ALOJAMENTO, CONCELHO 2011 2001-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 1 ALOJAMENTO, CONCELHO 2021 2011 -------------------////

var minVarEdi1AlojConc_21 = 0;
var maxVarEdi1AlojConc_21 = 0;

function CorVar1AlojConc21_11(d) {
    return d == null ? '#000000' :
        d >= 1.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -10  ? '#2288bf' :
        d >= -15.34   ? '#155273' :
                ''  ;
}

var legendaVar1AlojConc21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 1 alojamento, entre 2021 e 2011, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 1.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 1.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -15.34 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}
function EstiloVarEdi1AlojConc_21(feature) {
    if(feature.properties.V_ED_1AL21 <= minVarEdi1AlojConc_21 || minVarEdi1AlojConc_21 ===0){
        minVarEdi1AlojConc_21 = feature.properties.V_ED_1AL21
    }
    if(feature.properties.V_ED_1AL21 > maxVarEdi1AlojConc_21){
        maxVarEdi1AlojConc_21 = feature.properties.V_ED_1AL21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1AlojConc21_11(feature.properties.V_ED_1AL21)};
    }


function apagarVarEdi1AlojConc_21(e) {
    VarEdi1AlojConc_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi1AlojConc_21(feature, layer) {
    if(feature.properties.V_ED_1AL21 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED_1AL21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi1AlojConc_21,
    });
}
var VarEdi1AlojConc_21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarEdi1AlojConc_21,
    onEachFeature: onEachFeatureVarEdi1AlojConc_21
});

let slideVarEdi1AlojConc_21 = function(){
    var sliderVarEdi1AlojConc_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi1AlojConc_21, {
        start: [minVarEdi1AlojConc_21, maxVarEdi1AlojConc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi1AlojConc_21,
            'max': maxVarEdi1AlojConc_21
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi1AlojConc_21);
    inputNumberMax.setAttribute("value",maxVarEdi1AlojConc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi1AlojConc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi1AlojConc_21.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi1AlojConc_21.noUiSlider.on('update',function(e){
        VarEdi1AlojConc_21.eachLayer(function(layer){
            if (!layer.feature.properties.V_ED_1AL21){
                return false
            }
            if(layer.feature.properties.V_ED_1AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED_1AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi1AlojConc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderVarEdi1AlojConc_21.noUiSlider;
    $(slidersGeral).append(sliderVarEdi1AlojConc_21);
} 

//////////////////////--------- Fim da Variação Edifícios com 1 ALOJAMENTO, CONCELHO 2021 2011-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 2 a 4 ALOJAMENTOS, CONCELHO 2021 2011 -------------------////

var minVarEdi2_4AlojConc_21 = 0;
var maxVarEdi2_4AlojConc_21 = 0;

function CorVar2a4AlojConc21_11(d) {
    return d == null ? '#000000' :
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -10.71   ? '#2288bf' :
                ''  ;
}

var legendaVar2a4AlojConc21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 2 a 4 alojamentos, entre 2021 e 2011, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10.7 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi2_4AlojConc_21(feature) {
    if(feature.properties.V_ED_4AL21 <= minVarEdi2_4AlojConc_21 || minVarEdi2_4AlojConc_21 ===0){
        minVarEdi2_4AlojConc_21 = feature.properties.V_ED_4AL21
    }
    if(feature.properties.V_ED_4AL21 > maxVarEdi2_4AlojConc_21){
        maxVarEdi2_4AlojConc_21 = feature.properties.V_ED_4AL21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2a4AlojConc21_11(feature.properties.V_ED_4AL21)};
    }


function apagarVarEdi2_4AlojConc_21(e) {
    VarEdi2_4AlojConc_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi2_4AlojConc_21(feature, layer) {
    if(feature.properties.V_ED_4AL21 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED_4AL21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi2_4AlojConc_21,
    });
}
var VarEdi2_4AlojConc_21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarEdi2_4AlojConc_21,
    onEachFeature: onEachFeatureVarEdi2_4AlojConc_21
});

let slideVarEdi2_4AlojConc_21 = function(){
    var sliderVarEdi2_4AlojConc_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 42){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi2_4AlojConc_21, {
        start: [minVarEdi2_4AlojConc_21, maxVarEdi2_4AlojConc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi2_4AlojConc_21,
            'max': maxVarEdi2_4AlojConc_21
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi2_4AlojConc_21);
    inputNumberMax.setAttribute("value",maxVarEdi2_4AlojConc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi2_4AlojConc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi2_4AlojConc_21.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi2_4AlojConc_21.noUiSlider.on('update',function(e){
        VarEdi2_4AlojConc_21.eachLayer(function(layer){
            if (!layer.feature.properties.V_ED_4AL21){
                return false
            }
            if(layer.feature.properties.V_ED_4AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED_4AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi2_4AlojConc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 42;
    sliderAtivo = sliderVarEdi2_4AlojConc_21.noUiSlider;
    $(slidersGeral).append(sliderVarEdi2_4AlojConc_21);
} 

//////////////////////--------- Fim da Variação Edifícios com 2 A 4 ALOJAMENTO, CONCELHO 2021 2011-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 5 a 9 ALOJAMENTOS, CONCELHO 2021 2011 -------------------////

var minVarEdi5_9AlojConc_21 = 0;
var maxVarEdi5_9AlojConc_21 = 0;

function CorVar5a9AlojConc21_11(d) {
    return d == 0 ? '#000000' :
        d >= 6  ? '#8c0303' :
        d >= 4   ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0.01   ? '#f5b3be' :
                ''  ;
}

var legendaVar5a9AlojConc21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 5 a 9 alojamentos, entre 2021 e 2011, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 4 a 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 2 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0.46 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi5_9AlojConc_21(feature) {
    if(feature.properties.V_ED_9AL21 <= minVarEdi5_9AlojConc_21 || minVarEdi5_9AlojConc_21 ===0){
        minVarEdi5_9AlojConc_21 = feature.properties.V_ED_9AL21
    }
    if(feature.properties.V_ED_9AL21 > maxVarEdi5_9AlojConc_21){
        maxVarEdi5_9AlojConc_21 = feature.properties.V_ED_9AL21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar5a9AlojConc21_11(feature.properties.V_ED_9AL21)};
    }


function apagarVarEdi5_9AlojConc_21(e) {
    VarEdi5_9AlojConc_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi5_9AlojConc_21(feature, layer) {
    if(feature.properties.V_ED_9AL21 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED_9AL21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi5_9AlojConc_21,
    });
}
var VarEdi5_9AlojConc_21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarEdi5_9AlojConc_21,
    onEachFeature: onEachFeatureVarEdi5_9AlojConc_21
});

let slideVarEdi5_9AlojConc_21 = function(){
    var sliderVarEdi5_9AlojConc_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 43){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi5_9AlojConc_21, {
        start: [minVarEdi5_9AlojConc_21, maxVarEdi5_9AlojConc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi5_9AlojConc_21,
            'max': maxVarEdi5_9AlojConc_21
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi5_9AlojConc_21);
    inputNumberMax.setAttribute("value",maxVarEdi5_9AlojConc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi5_9AlojConc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi5_9AlojConc_21.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi5_9AlojConc_21.noUiSlider.on('update',function(e){
        VarEdi5_9AlojConc_21.eachLayer(function(layer){
            if (!layer.feature.properties.V_ED_9AL21){
                return false
            }
            if(layer.feature.properties.V_ED_9AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED_9AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi5_9AlojConc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 43;
    sliderAtivo = sliderVarEdi5_9AlojConc_21.noUiSlider;
    $(slidersGeral).append(sliderVarEdi5_9AlojConc_21);
} 

//////////////////////--------- Fim da Variação Edifícios com 5 A 9 ALOJAMENTO, CONCELHO 2021 2011-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 10 OU MAIS ALOJAMENTOS, CONCELHO 2021 2011 -------------------////

var minVarEdi10AlojConc_21 = 0;
var maxVarEdi10AlojConc_21 = 0;
function CorVar10AlojConc21_11(d) {
    return d == null ? '#000000' :
        d >= 10  ? '#8c0303' :
        d >= 6   ? '#de1f35' :
        d >= 3  ? '#ff5e6e' :
        d >= 1.66   ? '#f5b3be' :
                ''  ;
}

var legendaVar10AlojConc21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 10 ou mais alojamentos, entre 2021 e 2011, por concelho' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + ' > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 6 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 3 a 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 1.66 a 3' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi10AlojConc_21(feature) {
    if(feature.properties.V_ED10AL21 <= minVarEdi10AlojConc_21 || minVarEdi10AlojConc_21 ===0){
        minVarEdi10AlojConc_21 = feature.properties.V_ED10AL21
    }
    if(feature.properties.V_ED10AL21 > maxVarEdi10AlojConc_21){
        maxVarEdi10AlojConc_21 = feature.properties.V_ED10AL21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar10AlojConc21_11(feature.properties.V_ED10AL21)};
    }


function apagarVarEdi10AlojConc_21(e) {
    VarEdi10AlojConc_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi10AlojConc_21(feature, layer) {
    if(feature.properties.V_ED10AL21 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED10AL21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi10AlojConc_21,
    });
}
var VarEdi10AlojConc_21= L.geoJSON(dadosRelativosConcelhos21, {
    style:EstiloVarEdi10AlojConc_21,
    onEachFeature: onEachFeatureVarEdi10AlojConc_21
});

let slideVarEdi10AlojConc_21 = function(){
    var sliderVarEdi10AlojConc_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 44){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi10AlojConc_21, {
        start: [minVarEdi10AlojConc_21, maxVarEdi10AlojConc_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi10AlojConc_21,
            'max': maxVarEdi10AlojConc_21
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi10AlojConc_21);
    inputNumberMax.setAttribute("value",maxVarEdi10AlojConc_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi10AlojConc_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi10AlojConc_21.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi10AlojConc_21.noUiSlider.on('update',function(e){
        VarEdi10AlojConc_21.eachLayer(function(layer){
            if (!layer.feature.properties.V_ED10AL21){
                return false
            }
            if(layer.feature.properties.V_ED10AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED10AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi10AlojConc_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 44;
    sliderAtivo = sliderVarEdi10AlojConc_21.noUiSlider;
    $(slidersGeral).append(sliderVarEdi10AlojConc_21);
} 

//////////////////////--------- Fim da Variação Edifícios com 10 ou MAIS ALOJAMENTO, CONCELHO 2021 2011-------------- \\\\\\
//////////////////////////------------------------------------ FIM DADOS VARIAÇÃO CONCELHO--------------\\\\\\\\\\\\\\\
////////////////////////////////----------------------- DADOS FREGUESIAS---------------------------\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 1 ALOJAMENTO, 2001 POR FREGUESIA-----------------------\\\\\\\\\\\

var minEdi1AlojFreg_01 = 0;
var maxEdi1AlojFreg_01 = 0;
function estiloEdi1AlojFreg_01(feature, latlng) {
    if(feature.properties.ED_1Al01 < minEdi1AlojFreg_01 || minEdi1AlojFreg_01 ===0){
        minEdi1AlojFreg_01 = feature.properties.ED_1Al01
    }
    if(feature.properties.ED_1Al01> maxEdi1AlojFreg_01){
        maxEdi1AlojFreg_01 = feature.properties.ED_1Al01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1Al01,0.2)
    });
}
function apagarEdi1AlojFreg_01(e){
    var layer = e.target;
    Edi1AlojFreg_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi1AlojFreg_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios com 1 alojamento: ' + '<b>' + feature.properties.ED_1Al01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi1AlojFreg_01,
    })
};

var Edi1AlojFreg_01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloEdi1AlojFreg_01,
    onEachFeature: onEachFeatureEdi1AlojFreg_01,
});

var slideEdi1AlojFreg_01 = function(){
    var sliderEdi1AlojFreg_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi1AlojFreg_01, {
        start: [minEdi1AlojFreg_01, maxEdi1AlojFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi1AlojFreg_01,
            'max': maxEdi1AlojFreg_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi1AlojFreg_01);
    inputNumberMax.setAttribute("value",maxEdi1AlojFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi1AlojFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi1AlojFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderEdi1AlojFreg_01.noUiSlider.on('update',function(e){
        Edi1AlojFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_1Al01>=parseFloat(e[0])&& layer.feature.properties.ED_1Al01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi1AlojFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderEdi1AlojFreg_01.noUiSlider;
    $(slidersGeral).append(sliderEdi1AlojFreg_01);
}

///////////////////////////-------------------- FIM EDIFICIOS COM 1 ALOJAMENTO, 2001 POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 2 A 4 ALOJAMENTOS, 2001 POR FREGUESIA-----------------------\\\\\\\\\\\

var minEdi2_4AlojFreg_01 = 0;
var maxEdi2_4AlojFreg_01 = 0;
function estiloEdi2_4AlojFreg_01(feature, latlng) {
    if(feature.properties.ED_2_4Al01< minEdi2_4AlojFreg_01 || feature.properties.ED_2_4Al01 ===0){
        minEdi2_4AlojFreg_01 = feature.properties.ED_2_4Al01
    }
    if(feature.properties.ED_2_4Al01> maxEdi2_4AlojFreg_01){
        maxEdi2_4AlojFreg_01 = feature.properties.ED_2_4Al01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_2_4Al01,0.5)
    });
}
function apagarEdi2_4AlojFreg_01(e){
    var layer = e.target;
    Edi2_4AlojFreg_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi2_4AlojFreg_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios com 2 a 4 alojamentos: ' + '<b>' + feature.properties.ED_2_4Al01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi2_4AlojFreg_01,
    })
};

var Edi2_4AlojFreg_01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloEdi2_4AlojFreg_01,
    onEachFeature: onEachFeatureEdi2_4AlojFreg_01,
});

var slideEdi2_4AlojFreg_01 = function(){
    var sliderEdi2_4AlojFreg_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 46){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi2_4AlojFreg_01, {
        start: [minEdi2_4AlojFreg_01, maxEdi2_4AlojFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi2_4AlojFreg_01,
            'max': maxEdi2_4AlojFreg_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi2_4AlojFreg_01);
    inputNumberMax.setAttribute("value",maxEdi2_4AlojFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi2_4AlojFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi2_4AlojFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderEdi2_4AlojFreg_01.noUiSlider.on('update',function(e){
        Edi2_4AlojFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_2_4Al01>=parseFloat(e[0])&& layer.feature.properties.ED_2_4Al01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi2_4AlojFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 46;
    sliderAtivo = sliderEdi2_4AlojFreg_01.noUiSlider;
    $(slidersGeral).append(sliderEdi2_4AlojFreg_01);
}

///////////////////////////-------------------- FIM EDIFICIOS COM 2 a 4 ALOJAMENTOS, 2001 POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 5 A 9 ALOJAMENTOS, 2001 POR FREGUESIA-----------------------\\\\\\\\\\\

var minEdi5_9AlojFreg_01 = 0;
var maxEdi5_9AlojFreg_01 = 0;
function estiloEdi5_9AlojFreg_01(feature, latlng) {
    if(feature.properties.ED_5_9Al01< minEdi5_9AlojFreg_01 || feature.properties.ED_5_9Al01 ===0){
        minEdi5_9AlojFreg_01 = feature.properties.ED_5_9Al01
    }
    if(feature.properties.ED_5_9Al01> maxEdi5_9AlojFreg_01){
        maxEdi5_9AlojFreg_01 = feature.properties.ED_5_9Al01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_5_9Al01,0.7)
    });
}
function apagarEdi5_9AlojFreg_01(e){
    var layer = e.target;
    Edi5_9AlojFreg_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi5_9AlojFreg_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios com 5 a 9 alojamentos: ' + '<b>' + feature.properties.ED_5_9Al01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi5_9AlojFreg_01,
    })
};

var Edi5_9AlojFreg_01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloEdi5_9AlojFreg_01,
    onEachFeature: onEachFeatureEdi5_9AlojFreg_01,
});

var slideEdi5_9AlojFreg_01 = function(){
    var sliderEdi5_9AlojFreg_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 47){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi5_9AlojFreg_01, {
        start: [minEdi5_9AlojFreg_01, maxEdi5_9AlojFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi5_9AlojFreg_01,
            'max': maxEdi5_9AlojFreg_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi5_9AlojFreg_01);
    inputNumberMax.setAttribute("value",maxEdi5_9AlojFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi5_9AlojFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi5_9AlojFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderEdi5_9AlojFreg_01.noUiSlider.on('update',function(e){
        Edi5_9AlojFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_5_9Al01>=parseFloat(e[0])&& layer.feature.properties.ED_5_9Al01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi5_9AlojFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 47;
    sliderAtivo = sliderEdi5_9AlojFreg_01.noUiSlider;
    $(slidersGeral).append(sliderEdi5_9AlojFreg_01);
}

///////////////////////////-------------------- FIM EDIFICIOS COM 5 a 9 ALOJAMENTOS, 2001 POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////----------- EDIFICIOS COM 10 OU MAIS ALOJAMENTOS, 2001 POR FREGUESIA--------------------\\\\\\\\\\\

var minEdi10AlojFreg_01 = 0;
var maxEdi10AlojFreg_01 = 0;
function estiloEdi10AlojFreg_01(feature, latlng) {
    if(feature.properties.ED_M10Al01< minEdi10AlojFreg_01 || feature.properties.ED_M10Al01 ===0){
        minEdi10AlojFreg_01 = feature.properties.ED_M10Al01
    }
    if(feature.properties.ED_M10Al01> maxEdi10AlojFreg_01){
        maxEdi10AlojFreg_01 = feature.properties.ED_M10Al01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_M10Al01,0.7)
    });
}
function apagarEdi10AlojFreg_01(e){
    var layer = e.target;
    Edi10AlojFreg_01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi10AlojFreg_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios com 10 ou mais alojamentos: ' + '<b>' + feature.properties.ED_M10Al01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi10AlojFreg_01,
    })
};

var Edi10AlojFreg_01= L.geoJSON(dadosAbsolutosFreguesias01,{
    pointToLayer:estiloEdi10AlojFreg_01,
    onEachFeature: onEachFeatureEdi10AlojFreg_01,
});

var slideEdi10AlojFreg_01 = function(){
    var sliderEdi10AlojFreg_01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 48){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi10AlojFreg_01, {
        start: [minEdi10AlojFreg_01, maxEdi10AlojFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi10AlojFreg_01,
            'max': maxEdi10AlojFreg_01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi10AlojFreg_01);
    inputNumberMax.setAttribute("value",maxEdi10AlojFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi10AlojFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi10AlojFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderEdi10AlojFreg_01.noUiSlider.on('update',function(e){
        Edi10AlojFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.ED_M10Al01>=parseFloat(e[0])&& layer.feature.properties.ED_M10Al01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi10AlojFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 48;
    sliderAtivo = sliderEdi10AlojFreg_01.noUiSlider;
    $(slidersGeral).append(sliderEdi10AlojFreg_01);
}

///////////////////////////-------------------- FIM EDIFICIOS COM 10 OU MAIS ALOJAMENTOS, 2001 POR FREGUESIA --------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 1 ALOJAMENTO, 2011 POR FREGUESIA-----------------------\\\\\\\\\\\

var minEdi1AlojFreg_11 = 0;
var maxEdi1AlojFreg_11 = 0;
function estiloEdi1AlojFreg_11(feature, latlng) {
    if(feature.properties.ED_1Al11< minEdi1AlojFreg_11 || minEdi1AlojFreg_11 ===0){
        minEdi1AlojFreg_11 = feature.properties.ED_1Al11
    }
    if(feature.properties.ED_1Al11> maxEdi1AlojFreg_11){
        maxEdi1AlojFreg_11 = feature.properties.ED_1Al11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1Al11,0.2)
    });
}
function apagarEdi1AlojFreg_11(e){
    var layer = e.target;
    Edi1AlojFreg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi1AlojFreg_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios com 1 alojamento: ' + '<b>' + feature.properties.ED_1Al11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi1AlojFreg_11,
    })
};

var Edi1AlojFreg_11= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdi1AlojFreg_11,
    onEachFeature: onEachFeatureEdi1AlojFreg_11,
});

var slideEdi1AlojFreg_11 = function(){
    var sliderEdi1AlojFreg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 49){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi1AlojFreg_11, {
        start: [minEdi1AlojFreg_11, maxEdi1AlojFreg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi1AlojFreg_11,
            'max': maxEdi1AlojFreg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi1AlojFreg_11);
    inputNumberMax.setAttribute("value",maxEdi1AlojFreg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi1AlojFreg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi1AlojFreg_11.noUiSlider.set([null, this.value]);
    });

    sliderEdi1AlojFreg_11.noUiSlider.on('update',function(e){
        Edi1AlojFreg_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_1Al11>=parseFloat(e[0])&& layer.feature.properties.ED_1Al11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi1AlojFreg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 49;
    sliderAtivo = sliderEdi1AlojFreg_11.noUiSlider;
    $(slidersGeral).append(sliderEdi1AlojFreg_11);
}

///////////////////////////-------------------- FIM EDIFICIOS COM 1 ALOJAMENTO, 2011 POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 2 A 4 ALOJAMENTOS, 2011 POR FREGUESIA-----------------------\\\\\\\\\\\

var minEdi2_4AlojFreg_11 = 0;
var maxEdi2_4AlojFreg_11 = 0;
function estiloEdi2_4AlojFreg_11(feature, latlng) {
    if(feature.properties.ED_2_4Al11< minEdi2_4AlojFreg_11 || feature.properties.ED_2_4Al11 ===0){
        minEdi2_4AlojFreg_11 = feature.properties.ED_2_4Al11
    }
    if(feature.properties.ED_2_4Al11> maxEdi2_4AlojFreg_11){
        maxEdi2_4AlojFreg_11 = feature.properties.ED_2_4Al11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_2_4Al11,0.5)
    });
}
function apagarEdi2_4AlojFreg_11(e){
    var layer = e.target;
    Edi2_4AlojFreg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi2_4AlojFreg_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios com 2 a 4 alojamentos: ' + '<b>' + feature.properties.ED_2_4Al11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi2_4AlojFreg_11,
    })
};

var Edi2_4AlojFreg_11= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdi2_4AlojFreg_11,
    onEachFeature: onEachFeatureEdi2_4AlojFreg_11,
});

var slideEdi2_4AlojFreg_11 = function(){
    var sliderEdi2_4AlojFreg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 50){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi2_4AlojFreg_11, {
        start: [minEdi2_4AlojFreg_11, maxEdi2_4AlojFreg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi2_4AlojFreg_11,
            'max': maxEdi2_4AlojFreg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi2_4AlojFreg_11);
    inputNumberMax.setAttribute("value",maxEdi2_4AlojFreg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi2_4AlojFreg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi2_4AlojFreg_11.noUiSlider.set([null, this.value]);
    });

    sliderEdi2_4AlojFreg_11.noUiSlider.on('update',function(e){
        Edi2_4AlojFreg_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_2_4Al11>=parseFloat(e[0])&& layer.feature.properties.ED_2_4Al11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi2_4AlojFreg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 50;
    sliderAtivo = sliderEdi2_4AlojFreg_11.noUiSlider;
    $(slidersGeral).append(sliderEdi2_4AlojFreg_11);
}

///////////////////////////-------------------- FIM EDIFICIOS COM 2 a 4 ALOJAMENTOS, 2011 POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 5 A 9 ALOJAMENTOS, 2011 POR FREGUESIA-----------------------\\\\\\\\\\\

var minEdi5_9AlojFreg_11 = 0;
var maxEdi5_9AlojFreg_11 = 0;
function estiloEdi5_9AlojFreg_11(feature, latlng) {
    if(feature.properties.ED_5_9Al11< minEdi5_9AlojFreg_11 || feature.properties.ED_5_9Al11 === 0){
        minEdi5_9AlojFreg_11 = feature.properties.ED_5_9Al11
    }
    if(feature.properties.ED_5_9Al11> maxEdi5_9AlojFreg_11){
        maxEdi5_9AlojFreg_11 = feature.properties.ED_5_9Al11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_5_9Al11,0.7)
    });
}
function apagarEdi5_9AlojFreg_11(e){
    var layer = e.target;
    Edi5_9AlojFreg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi5_9AlojFreg_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios com 5 a 9 alojamentos: ' + '<b>' + feature.properties.ED_5_9Al11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi5_9AlojFreg_11,
    })
};

var Edi5_9AlojFreg_11= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdi5_9AlojFreg_11,
    onEachFeature: onEachFeatureEdi5_9AlojFreg_11,
});

var slideEdi5_9AlojFreg_11 = function(){
    var sliderEdi5_9AlojFreg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 51){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi5_9AlojFreg_11, {
        start: [minEdi5_9AlojFreg_11, maxEdi5_9AlojFreg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi5_9AlojFreg_11,
            'max': maxEdi5_9AlojFreg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi5_9AlojFreg_11);
    inputNumberMax.setAttribute("value",maxEdi5_9AlojFreg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi5_9AlojFreg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi5_9AlojFreg_11.noUiSlider.set([null, this.value]);
    });

    sliderEdi5_9AlojFreg_11.noUiSlider.on('update',function(e){
        Edi5_9AlojFreg_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_5_9Al11>=parseFloat(e[0])&& layer.feature.properties.ED_5_9Al11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi5_9AlojFreg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 51;
    sliderAtivo = sliderEdi5_9AlojFreg_11.noUiSlider;
    $(slidersGeral).append(sliderEdi5_9AlojFreg_11);
}

///////////////////////////-------------------- FIM EDIFICIOS COM 5 a 9 ALOJAMENTOS, 2011 POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////----------- EDIFICIOS COM 10 OU MAIS ALOJAMENTOS, 2011 POR FREGUESIA--------------------\\\\\\\\\\\

var minEdi10AlojFreg_11 = 0;
var maxEdi10AlojFreg_11 = 0;
function estiloEdi10AlojFreg_11(feature, latlng) {
    if(feature.properties.ED_M10Al11< minEdi10AlojFreg_11 || feature.properties.ED_M10Al11 ===0){
        minEdi10AlojFreg_11 = feature.properties.ED_M10Al11
    }
    if(feature.properties.ED_M10Al11> maxEdi10AlojFreg_11){
        maxEdi10AlojFreg_11 = feature.properties.ED_M10Al11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_M10Al11,0.7)
    });
}
function apagarEdi10AlojFreg_11(e){
    var layer = e.target;
    Edi10AlojFreg_11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi10AlojFreg_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios com 10 ou mais alojamentos: ' + '<b>' + feature.properties.ED_M10Al11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi10AlojFreg_11,
    })
};

var Edi10AlojFreg_11= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdi10AlojFreg_11,
    onEachFeature: onEachFeatureEdi10AlojFreg_11,
});

var slideEdi10AlojFreg_11 = function(){
    var sliderEdi10AlojFreg_11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 52){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi10AlojFreg_11, {
        start: [minEdi10AlojFreg_11, maxEdi10AlojFreg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi10AlojFreg_11,
            'max': maxEdi10AlojFreg_11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi10AlojFreg_11);
    inputNumberMax.setAttribute("value",maxEdi10AlojFreg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi10AlojFreg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi10AlojFreg_11.noUiSlider.set([null, this.value]);
    });

    sliderEdi10AlojFreg_11.noUiSlider.on('update',function(e){
        Edi10AlojFreg_11.eachLayer(function(layer){
            if(layer.feature.properties.ED_M10Al11>=parseFloat(e[0])&& layer.feature.properties.ED_M10Al11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi10AlojFreg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 52;
    sliderAtivo = sliderEdi10AlojFreg_11.noUiSlider;
    $(slidersGeral).append(sliderEdi10AlojFreg_11);
}

///////////////////////////-------------------- FIM EDIFICIOS COM 10 OU MAIS ALOJAMENTOS, 2011 POR FREGUESIA --------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 1 ALOJAMENTO, 2021 POR FREGUESIA-----------------------\\\\\\\\\\\

var minEdi1AlojFreg_21 = 0;
var maxEdi1AlojFreg_21 = 0;
function estiloEdi1AlojFreg_21(feature, latlng) {
    if(feature.properties.ED_1Al21< minEdi1AlojFreg_21 || minEdi1AlojFreg_21 ===0){
        minEdi1AlojFreg_21 = feature.properties.ED_1Al21
    }
    if(feature.properties.ED_1Al21> maxEdi1AlojFreg_21){
        maxEdi1AlojFreg_21 = feature.properties.ED_1Al21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_1Al21,0.2)
    });
}
function apagarEdi1AlojFreg_21(e){
    var layer = e.target;
    Edi1AlojFreg_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi1AlojFreg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios com 1 alojamento: ' + '<b>' + feature.properties.ED_1Al21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi1AlojFreg_21,
    })
};

var Edi1AlojFreg_21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdi1AlojFreg_21,
    onEachFeature: onEachFeatureEdi1AlojFreg_21,
});

var slideEdi1AlojFreg_21 = function(){
    var sliderEdi1AlojFreg_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 53){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi1AlojFreg_21, {
        start: [minEdi1AlojFreg_21, maxEdi1AlojFreg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi1AlojFreg_21,
            'max': maxEdi1AlojFreg_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi1AlojFreg_21);
    inputNumberMax.setAttribute("value",maxEdi1AlojFreg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi1AlojFreg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi1AlojFreg_21.noUiSlider.set([null, this.value]);
    });

    sliderEdi1AlojFreg_21.noUiSlider.on('update',function(e){
        Edi1AlojFreg_21.eachLayer(function(layer){
            if(layer.feature.properties.ED_1Al21>=parseFloat(e[0])&& layer.feature.properties.ED_1Al21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi1AlojFreg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 53;
    sliderAtivo = sliderEdi1AlojFreg_21.noUiSlider;
    $(slidersGeral).append(sliderEdi1AlojFreg_21);
}

///////////////////////////-------------------- FIM EDIFICIOS COM 1 ALOJAMENTO, 2021 POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 2 A 4 ALOJAMENTOS, 2021 POR FREGUESIA-----------------------\\\\\\\\\\\

var minEdi2_4AlojFreg_21 = 0;
var maxEdi2_4AlojFreg_21 = 0;
function estiloEdi2_4AlojFreg_21(feature, latlng) {
    if(feature.properties.ED_2_4Al21< minEdi2_4AlojFreg_21 || feature.properties.ED_2_4Al21 ===0){
        minEdi2_4AlojFreg_21 = feature.properties.ED_2_4Al21
    }
    if(feature.properties.ED_2_4Al21> maxEdi2_4AlojFreg_21){
        maxEdi2_4AlojFreg_21 = feature.properties.ED_2_4Al21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_2_4Al21,0.5)
    });
}
function apagarEdi2_4AlojFreg_21(e){
    var layer = e.target;
    Edi2_4AlojFreg_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi2_4AlojFreg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios com 2 a 4 alojamentos: ' + '<b>' + feature.properties.ED_2_4Al21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi2_4AlojFreg_21,
    })
};

var Edi2_4AlojFreg_21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdi2_4AlojFreg_21,
    onEachFeature: onEachFeatureEdi2_4AlojFreg_21,
});

var slideEdi2_4AlojFreg_21 = function(){
    var sliderEdi2_4AlojFreg_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 54){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi2_4AlojFreg_21, {
        start: [minEdi2_4AlojFreg_21, maxEdi2_4AlojFreg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi2_4AlojFreg_21,
            'max': maxEdi2_4AlojFreg_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi2_4AlojFreg_21);
    inputNumberMax.setAttribute("value",maxEdi2_4AlojFreg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi2_4AlojFreg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi2_4AlojFreg_21.noUiSlider.set([null, this.value]);
    });

    sliderEdi2_4AlojFreg_21.noUiSlider.on('update',function(e){
        Edi2_4AlojFreg_21.eachLayer(function(layer){
            if(layer.feature.properties.ED_2_4Al21>=parseFloat(e[0])&& layer.feature.properties.ED_2_4Al21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi2_4AlojFreg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 54;
    sliderAtivo = sliderEdi2_4AlojFreg_21.noUiSlider;
    $(slidersGeral).append(sliderEdi2_4AlojFreg_21);
}

///////////////////////////-------------------- FIM EDIFICIOS COM 2 a 4 ALOJAMENTOS, 2021 POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////////////----------- EDIFICIOS COM 5 A 9 ALOJAMENTOS, 2021 POR FREGUESIA-----------------------\\\\\\\\\\\

var minEdi5_9AlojFreg_21 = 0;
var maxEdi5_9AlojFreg_21 = 0;
function estiloEdi5_9AlojFreg_21(feature, latlng) {
    if(feature.properties.ED_5_9Al21 < minEdi5_9AlojFreg_21 || feature.properties.ED_5_9Al21 ===0){
        minEdi5_9AlojFreg_21 = feature.properties.ED_5_9Al21
    }
    if(feature.properties.ED_5_9Al21> maxEdi5_9AlojFreg_21){
        maxEdi5_9AlojFreg_21 = feature.properties.ED_5_9Al21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_5_9Al21,0.7)
    });
}
function apagarEdi5_9AlojFreg_21(e){
    var layer = e.target;
    Edi5_9AlojFreg_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi5_9AlojFreg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios com 5 a 9 alojamentos: ' + '<b>' + feature.properties.ED_5_9Al21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi5_9AlojFreg_21,
    })
};

var Edi5_9AlojFreg_21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdi5_9AlojFreg_21,
    onEachFeature: onEachFeatureEdi5_9AlojFreg_21,
});

var slideEdi5_9AlojFreg_21 = function(){
    var sliderEdi5_9AlojFreg_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 55){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi5_9AlojFreg_21, {
        start: [minEdi5_9AlojFreg_21, maxEdi5_9AlojFreg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi5_9AlojFreg_21,
            'max': maxEdi5_9AlojFreg_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi5_9AlojFreg_21);
    inputNumberMax.setAttribute("value",maxEdi5_9AlojFreg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi5_9AlojFreg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi5_9AlojFreg_21.noUiSlider.set([null, this.value]);
    });

    sliderEdi5_9AlojFreg_21.noUiSlider.on('update',function(e){
        Edi5_9AlojFreg_21.eachLayer(function(layer){
            if(layer.feature.properties.ED_5_9Al21>=parseFloat(e[0])&& layer.feature.properties.ED_5_9Al21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi5_9AlojFreg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 55;
    sliderAtivo = sliderEdi5_9AlojFreg_21.noUiSlider;
    $(slidersGeral).append(sliderEdi5_9AlojFreg_21);
}

///////////////////////////-------------------- FIM EDIFICIOS COM 5 a 9 ALOJAMENTOS, 2021 POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////----------- EDIFICIOS COM 10 OU MAIS ALOJAMENTOS, 2021 POR FREGUESIA--------------------\\\\\\\\\\\

var minEdi10AlojFreg_21 = 0;
var maxEdi10AlojFreg_21 = 0;
function estiloEdi10AlojFreg_21(feature, latlng) {
    if(feature.properties.ED_M10Al21 <= minEdi10AlojFreg_21 ||feature.properties.ED_M10Al21 == 0 ){
        minEdi10AlojFreg_21 = feature.properties.ED_M10Al21
    }
    if(feature.properties.ED_M10Al21> maxEdi10AlojFreg_21){
        maxEdi10AlojFreg_21 = feature.properties.ED_M10Al21
    }

    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.ED_M10Al21,0.7)
    })
};
function apagarEdi10AlojFreg_21(e){
    var layer = e.target;
    Edi10AlojFreg_21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdi10AlojFreg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Edifícios com 10 ou mais alojamentos: ' + '<b>' + feature.properties.ED_M10Al21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdi10AlojFreg_21,
    })
};

var Edi10AlojFreg_21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEdi10AlojFreg_21,
    onEachFeature: onEachFeatureEdi10AlojFreg_21,
});

var slideEdi10AlojFreg_21 = function(){
    var sliderEdi10AlojFreg_21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 56){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdi10AlojFreg_21, {
        start: [minEdi10AlojFreg_21, maxEdi10AlojFreg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdi10AlojFreg_21,
            'max': maxEdi10AlojFreg_21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdi10AlojFreg_21);
    inputNumberMax.setAttribute("value",maxEdi10AlojFreg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderEdi10AlojFreg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdi10AlojFreg_21.noUiSlider.set([null, this.value]);
    });

    sliderEdi10AlojFreg_21.noUiSlider.on('update',function(e){
        Edi10AlojFreg_21.eachLayer(function(layer){
            if(layer.feature.properties.ED_M10Al21>=parseFloat(e[0])&& layer.feature.properties.ED_M10Al21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdi10AlojFreg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 56;
    sliderAtivo = sliderEdi10AlojFreg_21.noUiSlider;
    $(slidersGeral).append(sliderEdi10AlojFreg_21);
}

///////////////////////////-------------------- FIM EDIFICIOS COM 10 OU MAIS ALOJAMENTOS, 2021 POR FREGUESIA --------\\\\\\\\\\\\\\\\\\\\\\\
/////////////////////////////////------------------------- FIM DADOS ABSOLUTOS, POR FREGUESIA ------------\\\\\\\\\\\\\\\
////////////////////////////////////------------------- DADOS RELATIVOS FREGUESIAS ------------\\\\\\\\\\\\\\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 1 ALOJAMENTO FREGUESIA em 2001-----////

var minPerEdi1AlojFreg_01 = 0;
var maxPerEdi1AlojFreg_01 = 0;

function CorPerEdi1AlojFreg(d) {
    return d >= 91.37 ? '#8c0303' :
        d >= 78.42  ? '#de1f35' :
        d >= 56.84 ? '#ff5e6e' :
        d >= 35.25   ? '#f5b3be' :
        d >= 13.67   ? '#F2C572' :
                ''  ;
}
var legendaPerEdi1AlojFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 91.37' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 78.42 - 91.37' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 56.84 - 78.42' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 35.25 - 56.84' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 13.67 - 35.25' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEdi1AlojFreg_01(feature) {
    if( feature.properties.P_ED_1AL01 <= minPerEdi1AlojFreg_01 || minPerEdi1AlojFreg_01 === 0){
        minPerEdi1AlojFreg_01 = feature.properties.P_ED_1AL01
    }
    if(feature.properties.P_ED_1AL01 >= maxPerEdi1AlojFreg_01 ){
        maxPerEdi1AlojFreg_01 = feature.properties.P_ED_1AL01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi1AlojFreg(feature.properties.P_ED_1AL01)
    };
}
function apagarPerEdi1AlojFreg_01(e) {
    PerEdi1AlojFreg_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi1AlojFreg_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_ED_1AL01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi1AlojFreg_01,
    });
}
var PerEdi1AlojFreg_01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPerEdi1AlojFreg_01,
    onEachFeature: onEachFeaturePerEdi1AlojFreg_01
});
let slidePerEdi1AlojFreg_01 = function(){
    var sliderPerEdi1AlojFreg_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 57){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi1AlojFreg_01, {
        start: [minPerEdi1AlojFreg_01, maxPerEdi1AlojFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi1AlojFreg_01,
            'max': maxPerEdi1AlojFreg_01
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi1AlojFreg_01);
    inputNumberMax.setAttribute("value",maxPerEdi1AlojFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi1AlojFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi1AlojFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi1AlojFreg_01.noUiSlider.on('update',function(e){
        PerEdi1AlojFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_1AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_1AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi1AlojFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 57;
    sliderAtivo = sliderPerEdi1AlojFreg_01.noUiSlider;
    $(slidersGeral).append(sliderPerEdi1AlojFreg_01);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 1 ALOJAMENTO FREGUESIA em 2001 -------------- \\\\\\


////////////////////////////------- Percentagem Total de EDIFICIOS COM 2 A 4 ALOJAMENTOS FREGUESIA em 2001-----////

var minPerEdi2_4AlojFreg_01 = 0;
var maxPerEdi2_4AlojFreg_01 = 0;

function CorPerEdi2a4AlojFreg(d) {
    return d == 0.00 ? '#506266' :
        d >= 29.53 ? '#8c0303' :
        d >= 24.61  ? '#de1f35' :
        d >= 16.41 ? '#ff5e6e' :
        d >= 8.2   ? '#f5b3be' :
        d >= 0.01   ? '#F2C572' :
                ''  ;
}
var legendaPerEdi2a4AlojFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 29.53' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 24.61 - 29.53' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 16.41 - 24.61' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 8.2 - 16.41' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.01 - 8.2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#506266"></i>' + ' 0' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEdi2_4AlojFreg_01(feature) {
    if(feature.properties.P_ED_4AL01 <= minPerEdi2_4AlojFreg_01 || feature.properties.P_ED_4AL01 === 0){
        minPerEdi2_4AlojFreg_01 = feature.properties.P_ED_4AL01
    }
    if(feature.properties.P_ED_4AL01 >= maxPerEdi2_4AlojFreg_01 ){
        maxPerEdi2_4AlojFreg_01 = feature.properties.P_ED_4AL01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi2a4AlojFreg(feature.properties.P_ED_4AL01)
    };
}
function apagarPerEdi2_4AlojFreg_01(e) {
    PerEdi2_4AlojFreg_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi2_4AlojFreg_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_ED_4AL01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi2_4AlojFreg_01,
    });
}
var PerEdi2_4AlojFreg_01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPerEdi2_4AlojFreg_01,
    onEachFeature: onEachFeaturePerEdi2_4AlojFreg_01
});
let slidePerEdi2_4AlojFreg_01 = function(){
    var sliderPerEdi2_4AlojFreg_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 58){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi2_4AlojFreg_01, {
        start: [minPerEdi2_4AlojFreg_01, maxPerEdi2_4AlojFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi2_4AlojFreg_01,
            'max': maxPerEdi2_4AlojFreg_01
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi2_4AlojFreg_01);
    inputNumberMax.setAttribute("value",maxPerEdi2_4AlojFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi2_4AlojFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi2_4AlojFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi2_4AlojFreg_01.noUiSlider.on('update',function(e){
        PerEdi2_4AlojFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_4AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_4AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi2_4AlojFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 58;
    sliderAtivo = sliderPerEdi2_4AlojFreg_01.noUiSlider;
    $(slidersGeral).append(sliderPerEdi2_4AlojFreg_01);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 2 a 4 ALOJAMENTOS FREGUESIA em 2001 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 5 A 9 ALOJAMENTOS FREGUESIA em 2001-----////

var minPerEdi5_9AlojFreg_01 = 0;
var maxPerEdi5_9AlojFreg_01 = 0;

function CorPerEdi5a9AlojFreg(d) {
    return d == 0.00 ? '#506266' :
        d >= 18.46 ? '#8c0303' :
        d >= 15.38  ? '#de1f35' :
        d >= 10.26 ? '#ff5e6e' :
        d >= 5.13   ? '#f5b3be' :
        d >= 0.01   ? '#F2C572' :
                ''  ;
}
var legendaPerEdi5a9AlojFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 18.46' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 15.38 - 18.46' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 10.26 - 15.38' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 5.13 - 10.26' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.01 - 5.13' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#506266"></i>' + ' 0' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEdi5_9AlojFreg_01(feature) {
    if( feature.properties.P_ED_9AL01 <= minPerEdi5_9AlojFreg_01 || feature.properties.P_ED_9AL01 === 0){
        minPerEdi5_9AlojFreg_01 = feature.properties.P_ED_9AL01
    }
    if(feature.properties.P_ED_9AL01 >= maxPerEdi5_9AlojFreg_01 ){
        maxPerEdi5_9AlojFreg_01 = feature.properties.P_ED_9AL01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi5a9AlojFreg(feature.properties.P_ED_9AL01)
    };
}
function apagarPerEdi5_9AlojFreg_01(e) {
    PerEdi5_9AlojFreg_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi5_9AlojFreg_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_ED_9AL01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi5_9AlojFreg_01,
    });
}
var PerEdi5_9AlojFreg_01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPerEdi5_9AlojFreg_01,
    onEachFeature: onEachFeaturePerEdi5_9AlojFreg_01
});
let slidePerEdi5_9AlojFreg_01 = function(){
    var sliderPerEdi5_9AlojFreg_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 59){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi5_9AlojFreg_01, {
        start: [minPerEdi5_9AlojFreg_01, maxPerEdi5_9AlojFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi5_9AlojFreg_01,
            'max': maxPerEdi5_9AlojFreg_01
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi5_9AlojFreg_01);
    inputNumberMax.setAttribute("value",maxPerEdi5_9AlojFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi5_9AlojFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi5_9AlojFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi5_9AlojFreg_01.noUiSlider.on('update',function(e){
        PerEdi5_9AlojFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_9AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_9AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi5_9AlojFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 59;
    sliderAtivo = sliderPerEdi5_9AlojFreg_01.noUiSlider;
    $(slidersGeral).append(sliderPerEdi5_9AlojFreg_01);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 5 a 9 ALOJAMENTOS FREGUESIA em 2001 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 10 OU MAIS ALOJAMENTOS FREGUESIA em 2001-----////

var minPerEdi10AlojFreg_01 = 0;
var maxPerEdi10AlojFreg_01 = 0;

function CorPerEdi10AlojFreg(d) {
    return d == 0.00 ? '#506266' :
        d >= 11.23 ? '#8c0303' :
        d >= 9.36  ? '#de1f35' :
        d >= 6.24 ? '#ff5e6e' :
        d >= 3.12   ? '#f5b3be' :
        d >= 0.01   ? '#F2C572' :
                ''  ;
}
var legendaPerEdi10AlojFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + ' > 11.23' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 9.36 - 11.23' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 6.24 - 9.36' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 3.12 - 6.24' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.01 - 3.12' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#506266"></i>' + ' 0' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloPerEdi10AlojFreg_01(feature) {
    if( feature.properties.P_ED10AL01 <= minPerEdi10AlojFreg_01 || feature.properties.P_ED10AL01 === 0){
        minPerEdi10AlojFreg_01 = feature.properties.P_ED10AL01
    }
    if(feature.properties.P_ED10AL01 >= maxPerEdi10AlojFreg_01 ){
        maxPerEdi10AlojFreg_01 = feature.properties.P_ED10AL01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi10AlojFreg(feature.properties.P_ED10AL01)
    };
}
function apagarPerEdi10AlojFreg_01(e) {
    PerEdi10AlojFreg_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi10AlojFreg_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_ED10AL01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi10AlojFreg_01,
    });
}
var PerEdi10AlojFreg_01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloPerEdi10AlojFreg_01,
    onEachFeature: onEachFeaturePerEdi10AlojFreg_01
});
let slidePerEdi10AlojFreg_01 = function(){
    var sliderPerEdi10AlojFreg_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 60){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi10AlojFreg_01, {
        start: [minPerEdi10AlojFreg_01, maxPerEdi10AlojFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi10AlojFreg_01,
            'max': maxPerEdi10AlojFreg_01
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi10AlojFreg_01);
    inputNumberMax.setAttribute("value",maxPerEdi10AlojFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi10AlojFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi10AlojFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi10AlojFreg_01.noUiSlider.on('update',function(e){
        PerEdi10AlojFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.P_ED10AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED10AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi10AlojFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 60;
    sliderAtivo = sliderPerEdi10AlojFreg_01.noUiSlider;
    $(slidersGeral).append(sliderPerEdi10AlojFreg_01);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 10 ou MAIS ALOJAMENTOS FREGUESIA em 2001 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 1 ALOJAMENTO FREGUESIA em 2011-----////

var minPerEdi1AlojFreg_11 = 0;
var maxPerEdi1AlojFreg_11 = 0;

function EstiloPerEdi1AlojFreg_11(feature) {
    if(feature.properties.P_ED_1AL11 <= minPerEdi1AlojFreg_11 || feature.properties.P_ED_1AL11 === 0){
        minPerEdi1AlojFreg_11 = feature.properties.P_ED_1AL11
    }
    if(feature.properties.P_ED_1AL11 >= maxPerEdi1AlojFreg_11 ){
        maxPerEdi1AlojFreg_11 = feature.properties.P_ED_1AL11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi1AlojFreg(feature.properties.P_ED_1AL11)
    };
}
function apagarPerEdi1AlojFreg_11(e) {
    PerEdi1AlojFreg_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi1AlojFreg_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_ED_1AL11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi1AlojFreg_11,
    });
}
var PerEdi1AlojFreg_11= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPerEdi1AlojFreg_11,
    onEachFeature: onEachFeaturePerEdi1AlojFreg_11
});
let slidePerEdi1AlojFreg_11 = function(){
    var sliderPerEdi1AlojFreg_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 61){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi1AlojFreg_11, {
        start: [minPerEdi1AlojFreg_11, maxPerEdi1AlojFreg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi1AlojFreg_11,
            'max': maxPerEdi1AlojFreg_11
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi1AlojFreg_11);
    inputNumberMax.setAttribute("value",maxPerEdi1AlojFreg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi1AlojFreg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi1AlojFreg_11.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi1AlojFreg_11.noUiSlider.on('update',function(e){
        PerEdi1AlojFreg_11.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_1AL11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_1AL11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi1AlojFreg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 61;
    sliderAtivo = sliderPerEdi1AlojFreg_11.noUiSlider;
    $(slidersGeral).append(sliderPerEdi1AlojFreg_11);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 1 ALOJAMENTO FREGUESIA em 2011 -------------- \\\\\\


////////////////////////////------- Percentagem Total de EDIFICIOS COM 2 A 4 ALOJAMENTOS FREGUESIA em 2011-----////

var minPerEdi2_4AlojFreg_11 = 0;
var maxPerEdi2_4AlojFreg_11 = 0;

function EstiloPerEdi2_4AlojFreg_11(feature) {
    if(feature.properties.P_ED_4AL11 <= minPerEdi2_4AlojFreg_11 || feature.properties.P_ED_4AL11 === 0){
        minPerEdi2_4AlojFreg_11 = feature.properties.P_ED_4AL11
    }
    if(feature.properties.P_ED_4AL11 >= maxPerEdi2_4AlojFreg_11 ){
        maxPerEdi2_4AlojFreg_11 = feature.properties.P_ED_4AL11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi2a4AlojFreg(feature.properties.P_ED_4AL11)
    };
}
function apagarPerEdi2_4AlojFreg_11(e) {
    PerEdi2_4AlojFreg_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi2_4AlojFreg_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_ED_4AL11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi2_4AlojFreg_11,
    });
}
var PerEdi2_4AlojFreg_11= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPerEdi2_4AlojFreg_11,
    onEachFeature: onEachFeaturePerEdi2_4AlojFreg_11
});
let slidePerEdi2_4AlojFreg_11 = function(){
    var sliderPerEdi2_4AlojFreg_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 62){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi2_4AlojFreg_11, {
        start: [minPerEdi2_4AlojFreg_11, maxPerEdi2_4AlojFreg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi2_4AlojFreg_11,
            'max': maxPerEdi2_4AlojFreg_11
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi2_4AlojFreg_11);
    inputNumberMax.setAttribute("value",maxPerEdi2_4AlojFreg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi2_4AlojFreg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi2_4AlojFreg_11.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi2_4AlojFreg_11.noUiSlider.on('update',function(e){
        PerEdi2_4AlojFreg_11.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_4AL11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_4AL11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi2_4AlojFreg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 62;
    sliderAtivo = sliderPerEdi2_4AlojFreg_11.noUiSlider;
    $(slidersGeral).append(sliderPerEdi2_4AlojFreg_11);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 2 a 4 ALOJAMENTOS FREGUESIA em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 5 A 9 ALOJAMENTOS FREGUESIA em 2011-----////

var minPerEdi5_9AlojFreg_11 = 0;
var maxPerEdi5_9AlojFreg_11 = 0;

function EstiloPerEdi5_9AlojFreg_11(feature) {
    if(feature.properties.P_ED_9AL11 <= minPerEdi5_9AlojFreg_11 || feature.properties.P_ED_9AL11 === 0){
        minPerEdi5_9AlojFreg_11 = feature.properties.P_ED_9AL11
    }
    if(feature.properties.P_ED_9AL11 >= maxPerEdi5_9AlojFreg_11 ){
        maxPerEdi5_9AlojFreg_11 = feature.properties.P_ED_9AL11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi5a9AlojFreg(feature.properties.P_ED_9AL11)
    };
}
function apagarPerEdi5_9AlojFreg_11(e) {
    PerEdi5_9AlojFreg_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi5_9AlojFreg_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_ED_9AL11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi5_9AlojFreg_11,
    });
}
var PerEdi5_9AlojFreg_11= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPerEdi5_9AlojFreg_11,
    onEachFeature: onEachFeaturePerEdi5_9AlojFreg_11
});
let slidePerEdi5_9AlojFreg_11 = function(){
    var sliderPerEdi5_9AlojFreg_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 63){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi5_9AlojFreg_11, {
        start: [minPerEdi5_9AlojFreg_11, maxPerEdi5_9AlojFreg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi5_9AlojFreg_11,
            'max': maxPerEdi5_9AlojFreg_11
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi5_9AlojFreg_11);
    inputNumberMax.setAttribute("value",maxPerEdi5_9AlojFreg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi5_9AlojFreg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi5_9AlojFreg_11.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi5_9AlojFreg_11.noUiSlider.on('update',function(e){
        PerEdi5_9AlojFreg_11.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_9AL11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_9AL11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi5_9AlojFreg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 63;
    sliderAtivo = sliderPerEdi5_9AlojFreg_11.noUiSlider;
    $(slidersGeral).append(sliderPerEdi5_9AlojFreg_11);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 5 a 9 ALOJAMENTOS FREGUESIA em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 10 OU MAIS ALOJAMENTOS FREGUESIA em 2011-----////

var minPerEdi10AlojFreg_11 = 0;
var maxPerEdi10AlojFreg_11 = 0;

function EstiloPerEdi10AlojFreg_11(feature) {
    if(feature.properties.P_ED10AL11 <= minPerEdi10AlojFreg_11 || feature.properties.P_ED10AL11 === 0){
        minPerEdi10AlojFreg_11 = feature.properties.P_ED10AL11
    }
    if(feature.properties.P_ED10AL11 >= maxPerEdi10AlojFreg_11 ){
        maxPerEdi10AlojFreg_11 = feature.properties.P_ED10AL11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi10AlojFreg(feature.properties.P_ED10AL11)
    };
}
function apagarPerEdi10AlojFreg_11(e) {
    PerEdi10AlojFreg_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi10AlojFreg_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_ED10AL11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi10AlojFreg_11,
    });
}
var PerEdi10AlojFreg_11= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPerEdi10AlojFreg_11,
    onEachFeature: onEachFeaturePerEdi10AlojFreg_11
});
let slidePerEdi10AlojFreg_11 = function(){
    var sliderPerEdi10AlojFreg_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 64){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi10AlojFreg_11, {
        start: [minPerEdi10AlojFreg_11, maxPerEdi10AlojFreg_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi10AlojFreg_11,
            'max': maxPerEdi10AlojFreg_11
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi10AlojFreg_11);
    inputNumberMax.setAttribute("value",maxPerEdi10AlojFreg_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi10AlojFreg_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi10AlojFreg_11.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi10AlojFreg_11.noUiSlider.on('update',function(e){
        PerEdi10AlojFreg_11.eachLayer(function(layer){
            if(layer.feature.properties.P_ED10AL11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED10AL11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi10AlojFreg_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 64;
    sliderAtivo = sliderPerEdi10AlojFreg_11.noUiSlider;
    $(slidersGeral).append(sliderPerEdi10AlojFreg_11);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 10 ou MAIS ALOJAMENTOS FREGUESIA em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 1 ALOJAMENTO FREGUESIA em 2021-----////

var minPerEdi1AlojFreg_21 = 0;
var maxPerEdi1AlojFreg_21 = 0;

function EstiloPerEdi1AlojFreg_21(feature) {
    if(feature.properties.P_ED_1AL21 <= minPerEdi1AlojFreg_21 || feature.properties.P_ED_1AL21 === 0){
        minPerEdi1AlojFreg_21 = feature.properties.P_ED_1AL21
    }
    if(feature.properties.P_ED_1AL21 >= maxPerEdi1AlojFreg_21 ){
        maxPerEdi1AlojFreg_21 = feature.properties.P_ED_1AL21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi1AlojFreg(feature.properties.P_ED_1AL21)
    };
}
function apagarPerEdi1AlojFreg_21(e) {
    PerEdi1AlojFreg_21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi1AlojFreg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_ED_1AL21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi1AlojFreg_21,
    });
}
var PerEdi1AlojFreg_21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPerEdi1AlojFreg_21,
    onEachFeature: onEachFeaturePerEdi1AlojFreg_21
});
let slidePerEdi1AlojFreg_21 = function(){
    var sliderPerEdi1AlojFreg_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 65){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi1AlojFreg_21, {
        start: [minPerEdi1AlojFreg_21, maxPerEdi1AlojFreg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi1AlojFreg_21,
            'max': maxPerEdi1AlojFreg_21
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi1AlojFreg_21);
    inputNumberMax.setAttribute("value",maxPerEdi1AlojFreg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi1AlojFreg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi1AlojFreg_21.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi1AlojFreg_21.noUiSlider.on('update',function(e){
        PerEdi1AlojFreg_21.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_1AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_1AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi1AlojFreg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 65;
    sliderAtivo = sliderPerEdi1AlojFreg_21.noUiSlider;
    $(slidersGeral).append(sliderPerEdi1AlojFreg_21);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 1 ALOJAMENTO FREGUESIA em 2021 -------------- \\\\\\


////////////////////////////------- Percentagem Total de EDIFICIOS COM 2 A 4 ALOJAMENTOS FREGUESIA em 2021-----////

var minPerEdi2_4AlojFreg_21 = 0;
var maxPerEdi2_4AlojFreg_21 = 0;

function EstiloPerEdi2_4AlojFreg_21(feature) {
    if(feature.properties.P_ED_4AL21 <= minPerEdi2_4AlojFreg_21 || feature.properties.P_ED_4AL21 === 0){
        minPerEdi2_4AlojFreg_21 = feature.properties.P_ED_4AL21
    }
    if(feature.properties.P_ED_4AL21 >= maxPerEdi2_4AlojFreg_21 ){
        maxPerEdi2_4AlojFreg_21 = feature.properties.P_ED_4AL21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi2a4AlojFreg(feature.properties.P_ED_4AL21)
    };
}
function apagarPerEdi2_4AlojFreg_21(e) {
    PerEdi2_4AlojFreg_21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi2_4AlojFreg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_ED_4AL21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi2_4AlojFreg_21,
    });
}
var PerEdi2_4AlojFreg_21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPerEdi2_4AlojFreg_21,
    onEachFeature: onEachFeaturePerEdi2_4AlojFreg_21
});
let slidePerEdi2_4AlojFreg_21 = function(){
    var sliderPerEdi2_4AlojFreg_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 66){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi2_4AlojFreg_21, {
        start: [minPerEdi2_4AlojFreg_21, maxPerEdi2_4AlojFreg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi2_4AlojFreg_21,
            'max': maxPerEdi2_4AlojFreg_21
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi2_4AlojFreg_21);
    inputNumberMax.setAttribute("value",maxPerEdi2_4AlojFreg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi2_4AlojFreg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi2_4AlojFreg_21.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi2_4AlojFreg_21.noUiSlider.on('update',function(e){
        PerEdi2_4AlojFreg_21.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_4AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_4AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi2_4AlojFreg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 66;
    sliderAtivo = sliderPerEdi2_4AlojFreg_21.noUiSlider;
    $(slidersGeral).append(sliderPerEdi2_4AlojFreg_21);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 2 a 4 ALOJAMENTOS FREGUESIA em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 5 A 9 ALOJAMENTOS FREGUESIA em 2021-----////

var minPerEdi5_9AlojFreg_21 = 0;
var maxPerEdi5_9AlojFreg_21 = 0;

function EstiloPerEdi5_9AlojFreg_21(feature) {
    if(feature.properties.P_ED_9AL21 <= minPerEdi5_9AlojFreg_21 || feature.properties.P_ED_9AL21 === 0){
        minPerEdi5_9AlojFreg_21 = feature.properties.P_ED_9AL21
    }
    if(feature.properties.P_ED_9AL21 >= maxPerEdi5_9AlojFreg_21 ){
        maxPerEdi5_9AlojFreg_21 = feature.properties.P_ED_9AL21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi5a9AlojFreg(feature.properties.P_ED_9AL21)
    };
}
function apagarPerEdi5_9AlojFreg_21(e) {
    PerEdi5_9AlojFreg_21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi5_9AlojFreg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_ED_9AL21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi5_9AlojFreg_21,
    });
}
var PerEdi5_9AlojFreg_21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPerEdi5_9AlojFreg_21,
    onEachFeature: onEachFeaturePerEdi5_9AlojFreg_21
});
let slidePerEdi5_9AlojFreg_21 = function(){
    var sliderPerEdi5_9AlojFreg_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 67){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi5_9AlojFreg_21, {
        start: [minPerEdi5_9AlojFreg_21, maxPerEdi5_9AlojFreg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi5_9AlojFreg_21,
            'max': maxPerEdi5_9AlojFreg_21
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi5_9AlojFreg_21);
    inputNumberMax.setAttribute("value",maxPerEdi5_9AlojFreg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi5_9AlojFreg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi5_9AlojFreg_21.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi5_9AlojFreg_21.noUiSlider.on('update',function(e){
        PerEdi5_9AlojFreg_21.eachLayer(function(layer){
            if(layer.feature.properties.P_ED_9AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED_9AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi5_9AlojFreg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 67;
    sliderAtivo = sliderPerEdi5_9AlojFreg_21.noUiSlider;
    $(slidersGeral).append(sliderPerEdi5_9AlojFreg_21);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 5 a 9 ALOJAMENTOS FREGUESIA em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem Total de EDIFICIOS COM 10 OU MAIS ALOJAMENTOS FREGUESIA em 2021-----////

var minPerEdi10AlojFreg_21 = 0;
var maxPerEdi10AlojFreg_21 = 0;

function EstiloPerEdi10AlojFreg_21(feature) {
    if(feature.properties.P_ED10AL21 <= minPerEdi10AlojFreg_21 || feature.properties.P_ED10AL21 === 0){
        minPerEdi10AlojFreg_21 = feature.properties.P_ED10AL21
    }
    if(feature.properties.P_ED10AL21 >= maxPerEdi10AlojFreg_21 ){
        maxPerEdi10AlojFreg_21 = feature.properties.P_ED10AL21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerEdi10AlojFreg(feature.properties.P_ED10AL21)
    };
}
function apagarPerEdi10AlojFreg_21(e) {
    PerEdi10AlojFreg_21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerEdi10AlojFreg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.P_ED10AL21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerEdi10AlojFreg_21,
    });
}
var PerEdi10AlojFreg_21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPerEdi10AlojFreg_21,
    onEachFeature: onEachFeaturePerEdi10AlojFreg_21
});
let slidePerEdi10AlojFreg_21 = function(){
    var sliderPerEdi10AlojFreg_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 68){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerEdi10AlojFreg_21, {
        start: [minPerEdi10AlojFreg_21, maxPerEdi10AlojFreg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerEdi10AlojFreg_21,
            'max': maxPerEdi10AlojFreg_21
        },
        });
    inputNumberMin.setAttribute("value",minPerEdi10AlojFreg_21);
    inputNumberMax.setAttribute("value",maxPerEdi10AlojFreg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderPerEdi10AlojFreg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerEdi10AlojFreg_21.noUiSlider.set([null, this.value]);
    });

    sliderPerEdi10AlojFreg_21.noUiSlider.on('update',function(e){
        PerEdi10AlojFreg_21.eachLayer(function(layer){
            if(layer.feature.properties.P_ED10AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.P_ED10AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerEdi10AlojFreg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 68;
    sliderAtivo = sliderPerEdi10AlojFreg_21.noUiSlider;
    $(slidersGeral).append(sliderPerEdi10AlojFreg_21);
} 

/////////////////////////////// Fim da Percentagem Total de EDIFICIOS COM 10 ou MAIS ALOJAMENTOS FREGUESIA em 2021 -------------- \\\\\\
/////////////////////////////-------------------------- FIM DADOS RELATIVOS FREGUESIA --------\\\\\\\\\\\\\\\\\\\\\\
///////////////////////////////------------------------ VARIACAO FREGUESIAS ----------------------------\\\\\\\\\\

/////////////////////////////------- Variação Edifícios com 1 ALOJAMENTO, FREGUESIA 2011 2001 -------------------////

var minVarEdi1AlojFreg_01 = 0;
var maxVarEdi1AlojFreg_01 = 0;

function CorVar1AlojFreg11_01(d) {
    return d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -15  ? '#9eaad7' :
        d >= -33   ? '#2288bf' :
                ''  ;
}

var legendaVar1AlojFreg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 1 alojamento, entre 2011 e 2001, por freguesia' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -15 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -32.99 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi1AlojFreg_01(feature) {
    if(feature.properties.V_ED_1AL01 <= minVarEdi1AlojFreg_01 || minVarEdi1AlojFreg_01 ===0){
        minVarEdi1AlojFreg_01 = feature.properties.V_ED_1AL01
    }
    if(feature.properties.V_ED_1AL01 > maxVarEdi1AlojFreg_01){
        maxVarEdi1AlojFreg_01 = feature.properties.V_ED_1AL01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1AlojFreg11_01(feature.properties.V_ED_1AL01)};
    }


function apagarVarEdi1AlojFreg_01(e) {
    VarEdi1AlojFreg_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi1AlojFreg_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.V_ED_1AL01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi1AlojFreg_01,
    });
}
var VarEdi1AlojFreg_01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarEdi1AlojFreg_01,
    onEachFeature: onEachFeatureVarEdi1AlojFreg_01
});

let slideVarEdi1AlojFreg_01 = function(){
    var sliderVarEdi1AlojFreg_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 69){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi1AlojFreg_01, {
        start: [minVarEdi1AlojFreg_01, maxVarEdi1AlojFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi1AlojFreg_01,
            'max': maxVarEdi1AlojFreg_01
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi1AlojFreg_01);
    inputNumberMax.setAttribute("value",maxVarEdi1AlojFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi1AlojFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi1AlojFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi1AlojFreg_01.noUiSlider.on('update',function(e){
        VarEdi1AlojFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.V_ED_1AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED_1AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi1AlojFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 69;
    sliderAtivo = sliderVarEdi1AlojFreg_01.noUiSlider;
    $(slidersGeral).append(sliderVarEdi1AlojFreg_01);
} 

//////////////////////--------- Fim da Variação Edifícios com 1 ALOJAMENTO, FREGUESIA 2011 2001-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 2 a 4 ALOJAMENTOS, FREGUESIA 2011 2001 -------------------////

var minVarEdi2_4AlojFreg_01 = 9999;
var maxVarEdi2_4AlojFreg_01 = 0;

function CorVar2a4AlojFreg11_01(d) {
    return d === null ? '#808080':
        d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -91.68   ? '#2288bf' :
                ''  ;
}

var legendaVar2a4AlojFreg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 2 a 4 alojamentos, entre 2011 e 2001, por freguesia' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -91.67 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarEdi2_4AlojFreg_01(feature) {
    if(feature.properties.V_ED_4AL01 <= minVarEdi2_4AlojFreg_01){
        minVarEdi2_4AlojFreg_01 = feature.properties.V_ED_4AL01
    }
    if(feature.properties.V_ED_4AL01 > maxVarEdi2_4AlojFreg_01){
        maxVarEdi2_4AlojFreg_01 = feature.properties.V_ED_4AL01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2a4AlojFreg11_01(feature.properties.V_ED_4AL01)};
    }


function apagarVarEdi2_4AlojFreg_01(e) {
    VarEdi2_4AlojFreg_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi2_4AlojFreg_01(feature, layer) {
    if(feature.properties.V_ED_4AL01 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED_4AL01.toFixed(2) + '</b>' + '%').openPopup()
    }    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi2_4AlojFreg_01,
    });
}
var VarEdi2_4AlojFreg_01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarEdi2_4AlojFreg_01,
    onEachFeature: onEachFeatureVarEdi2_4AlojFreg_01
});

let slideVarEdi2_4AlojFreg_01 = function(){
    var sliderVarEdi2_4AlojFreg_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 70){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi2_4AlojFreg_01, {
        start: [minVarEdi2_4AlojFreg_01, maxVarEdi2_4AlojFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi2_4AlojFreg_01,
            'max': maxVarEdi2_4AlojFreg_01
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi2_4AlojFreg_01);
    inputNumberMax.setAttribute("value",maxVarEdi2_4AlojFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi2_4AlojFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi2_4AlojFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi2_4AlojFreg_01.noUiSlider.on('update',function(e){
        VarEdi2_4AlojFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.V_ED_4AL01 == null){
                return false
            }
            if(layer.feature.properties.V_ED_4AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED_4AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi2_4AlojFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 70;
    sliderAtivo = sliderVarEdi2_4AlojFreg_01.noUiSlider;
    $(slidersGeral).append(sliderVarEdi2_4AlojFreg_01);
} 

//////////////////////--------- Fim da Variação Edifícios com 2 a 4 ALOJAMENTOS, FREGUESIA 2011 2001-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 5 a 9 ALOJAMENTOS, FREGUESIA 2011 2001 -------------------////

var minVarEdi5_9AlojFreg_01 = 99999;
var maxVarEdi5_9AlojFreg_01 = 0;

function CorVar5a9AlojFreg11_01(d) {
    return d === null ? '#808080':
        d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#2288bf' :
                ''  ;
}

var legendaVar5a9AlojFreg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 5 a 9 alojamentos, entre 2011 e 2001, por freguesia' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi5_9AlojFreg_01(feature) {
    if(feature.properties.V_ED_9AL01 <= minVarEdi5_9AlojFreg_01){
        minVarEdi5_9AlojFreg_01 = feature.properties.V_ED_9AL01
    }
    if(feature.properties.V_ED_9AL01 > maxVarEdi5_9AlojFreg_01){
        maxVarEdi5_9AlojFreg_01 = feature.properties.V_ED_9AL01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar5a9AlojFreg11_01(feature.properties.V_ED_9AL01)};
    }


function apagarVarEdi5_9AlojFreg_01(e) {
    VarEdi5_9AlojFreg_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi5_9AlojFreg_01(feature, layer) {
    if(feature.properties.V_ED_9AL01 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED_9AL01.toFixed(2) + '</b>' + '%').openPopup()
    }        
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi5_9AlojFreg_01,
    });
}
var VarEdi5_9AlojFreg_01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarEdi5_9AlojFreg_01,
    onEachFeature: onEachFeatureVarEdi5_9AlojFreg_01
});

let slideVarEdi5_9AlojFreg_01 = function(){
    var sliderVarEdi5_9AlojFreg_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 71){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi5_9AlojFreg_01, {
        start: [minVarEdi5_9AlojFreg_01, maxVarEdi5_9AlojFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi5_9AlojFreg_01,
            'max': maxVarEdi5_9AlojFreg_01
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi5_9AlojFreg_01);
    inputNumberMax.setAttribute("value",maxVarEdi5_9AlojFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi5_9AlojFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi5_9AlojFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi5_9AlojFreg_01.noUiSlider.on('update',function(e){
        VarEdi5_9AlojFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.V_ED_9AL01 == null){
                return false
            }
            if(layer.feature.properties.V_ED_9AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED_9AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi5_9AlojFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 71;
    sliderAtivo = sliderVarEdi5_9AlojFreg_01.noUiSlider;
    $(slidersGeral).append(sliderVarEdi5_9AlojFreg_01);
} 

//////////////////////--------- Fim da Variação Edifícios com 5 a 9 ALOJAMENTOS, FREGUESIA 2011 2001-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 10 OU MAIS ALOJAMENTOS, FREGUESIA 2011 2001 -------------------////

var minVarEdi10AlojFreg_01 = 9999;
var maxVarEdi10AlojFreg_01 = 0;


function CorVar10AlojFreg11_01(d) {
    return d === null ? '#808080':
        d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#2288bf' :
                ''  ;
}

var legendaVar10AlojFreg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 10 ou mais alojamentos, entre 2011 e 2001, por freguesia' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi10AlojFreg_01(feature) {
    if(feature.properties.V_ED10AL01 <= minVarEdi10AlojFreg_01){
        minVarEdi10AlojFreg_01 = feature.properties.V_ED10AL01
    }
    if(feature.properties.V_ED10AL01 > maxVarEdi10AlojFreg_01){
        maxVarEdi10AlojFreg_01 = feature.properties.V_ED10AL01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar10AlojFreg11_01(feature.properties.V_ED10AL01)};
    }


function apagarVarEdi10AlojFreg_01(e) {
    VarEdi10AlojFreg_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi10AlojFreg_01(feature, layer) {
    if(feature.properties.V_ED10AL01 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED10AL01.toFixed(2) + '</b>' + '%').openPopup()
    }      layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi10AlojFreg_01,
    });
}
var VarEdi10AlojFreg_01= L.geoJSON(dadosRelativosFreguesias01, {
    style:EstiloVarEdi10AlojFreg_01,
    onEachFeature: onEachFeatureVarEdi10AlojFreg_01
});

let slideVarEdi10AlojFreg_01 = function(){
    var sliderVarEdi10AlojFreg_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 72){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi10AlojFreg_01, {
        start: [minVarEdi10AlojFreg_01, maxVarEdi10AlojFreg_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi10AlojFreg_01,
            'max': maxVarEdi10AlojFreg_01
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi10AlojFreg_01);
    inputNumberMax.setAttribute("value",maxVarEdi10AlojFreg_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi10AlojFreg_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi10AlojFreg_01.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi10AlojFreg_01.noUiSlider.on('update',function(e){
        VarEdi10AlojFreg_01.eachLayer(function(layer){
            if(layer.feature.properties.V_ED10AL01 == null){
                return false
            }
            if(layer.feature.properties.V_ED10AL01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED10AL01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi10AlojFreg_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 72;
    sliderAtivo = sliderVarEdi10AlojFreg_01.noUiSlider;
    $(slidersGeral).append(sliderVarEdi10AlojFreg_01);
} 

//////////////////////--------- Fim da Variação Edifícios com 10 ou MAIS ALOJAMENTOS, FREGUESIA 2011 2001-------------- \\\\\\


/////////////////////////////------- Variação Edifícios com 1 ALOJAMENTO, FREGUESIA 2021 2011 -------------------////

var minVarEdi1AlojFreg_21 = 0;
var maxVarEdi1AlojFreg_21 = 0;

function CorVar1AlojFreg21_11(d) {
    return d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -28.12   ? '#2288bf' :
                ''  ;
}

var legendaVar1AlojFreg21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 1 alojamento, entre 2021 e 2011, por freguesia' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -28.11 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi1AlojFreg_21(feature) {
    if(feature.properties.V_ED_1AL21 <= minVarEdi1AlojFreg_21 || minVarEdi1AlojFreg_21 ===0){
        minVarEdi1AlojFreg_21 = feature.properties.V_ED_1AL21
    }
    if(feature.properties.V_ED_1AL21 > maxVarEdi1AlojFreg_21){
        maxVarEdi1AlojFreg_21 = feature.properties.V_ED_1AL21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1AlojFreg21_11(feature.properties.V_ED_1AL21)};
    }


function apagarVarEdi1AlojFreg_21(e) {
    VarEdi1AlojFreg_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi1AlojFreg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.V_ED_1AL21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi1AlojFreg_21,
    });
}
var VarEdi1AlojFreg_21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVarEdi1AlojFreg_21,
    onEachFeature: onEachFeatureVarEdi1AlojFreg_21
});

let slideVarEdi1AlojFreg_21 = function(){
    var sliderVarEdi1AlojFreg_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 73){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi1AlojFreg_21, {
        start: [minVarEdi1AlojFreg_21, maxVarEdi1AlojFreg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi1AlojFreg_21,
            'max': maxVarEdi1AlojFreg_21
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi1AlojFreg_21);
    inputNumberMax.setAttribute("value",maxVarEdi1AlojFreg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi1AlojFreg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi1AlojFreg_21.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi1AlojFreg_21.noUiSlider.on('update',function(e){
        VarEdi1AlojFreg_21.eachLayer(function(layer){
            if(layer.feature.properties.V_ED_1AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED_1AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi1AlojFreg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 73;
    sliderAtivo = sliderVarEdi1AlojFreg_21.noUiSlider;
    $(slidersGeral).append(sliderVarEdi1AlojFreg_21);
} 

//////////////////////--------- Fim da Variação Edifícios com 1 ALOJAMENTO, FREGUESIA 2021 2011-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 2 a 4 ALOJAMENTOS, FREGUESIA 2021 2011 -------------------////

var minVarEdi2_4AlojFreg_21 = 0;
var maxVarEdi2_4AlojFreg_21 = 0;

function CorVar2a4AlojFreg21_11(d) {
    return d >= 20  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#2288bf' :
                ''  ;
}

var legendaVar2a4AlojFreg21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 2 a 4 alojamentos, entre 2021 e 2011, por freguesia' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi2_4AlojFreg_21(feature) {
    if(feature.properties.V_ED_4AL21 <= minVarEdi2_4AlojFreg_21 || minVarEdi2_4AlojFreg_21 ===0){
        minVarEdi2_4AlojFreg_21 = feature.properties.V_ED_4AL21
    }
    if(feature.properties.V_ED_4AL21 > maxVarEdi2_4AlojFreg_21){
        maxVarEdi2_4AlojFreg_21 = feature.properties.V_ED_4AL21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2a4AlojFreg21_11(feature.properties.V_ED_4AL21)};
    }


function apagarVarEdi2_4AlojFreg_21(e) {
    VarEdi2_4AlojFreg_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi2_4AlojFreg_21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.V_ED_4AL21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi2_4AlojFreg_21,
    });
}
var VarEdi2_4AlojFreg_21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVarEdi2_4AlojFreg_21,
    onEachFeature: onEachFeatureVarEdi2_4AlojFreg_21
});

let slideVarEdi2_4AlojFreg_21 = function(){
    var sliderVarEdi2_4AlojFreg_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 74){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi2_4AlojFreg_21, {
        start: [minVarEdi2_4AlojFreg_21, maxVarEdi2_4AlojFreg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi2_4AlojFreg_21,
            'max': maxVarEdi2_4AlojFreg_21
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi2_4AlojFreg_21);
    inputNumberMax.setAttribute("value",maxVarEdi2_4AlojFreg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi2_4AlojFreg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi2_4AlojFreg_21.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi2_4AlojFreg_21.noUiSlider.on('update',function(e){
        VarEdi2_4AlojFreg_21.eachLayer(function(layer){
            if(layer.feature.properties.V_ED_4AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED_4AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi2_4AlojFreg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 74;
    sliderAtivo = sliderVarEdi2_4AlojFreg_21.noUiSlider;
    $(slidersGeral).append(sliderVarEdi2_4AlojFreg_21);
} 

//////////////////////--------- Fim da Variação Edifícios com 2 a 4 ALOJAMENTOS, FREGUESIA 2021 2011-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 5 a 9 ALOJAMENTOS, FREGUESIA 2021 2011 -------------------////

var minVarEdi5_9AlojFreg_21 = 0;
var maxVarEdi5_9AlojFreg_21 = 0;

function CorVar5a9AlojFreg21_11(d) {
    return d === null ? '#808080':
        d >= 20  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -66.68   ? '#2288bf' :
                ''  ;
}

var legendaVar5a9AlojFreg21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 5 a 9 alojamentos, entre 2021 e 2011, por freguesia' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -66.67 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi5_9AlojFreg_21(feature) {
    if(feature.properties.V_ED_9AL21 <= minVarEdi5_9AlojFreg_21){
        minVarEdi5_9AlojFreg_21 = feature.properties.V_ED_9AL21
    }
    if(feature.properties.V_ED_9AL21 > maxVarEdi5_9AlojFreg_21){
        maxVarEdi5_9AlojFreg_21 = feature.properties.V_ED_9AL21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar5a9AlojFreg21_11(feature.properties.V_ED_9AL21)};
    }


function apagarVarEdi5_9AlojFreg_21(e) {
    VarEdi5_9AlojFreg_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi5_9AlojFreg_21(feature, layer) {
    if(feature.properties.V_ED_9AL21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED_9AL21.toFixed(2) + '</b>' + '%').openPopup()
    }     layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi5_9AlojFreg_21,
    });
}
var VarEdi5_9AlojFreg_21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVarEdi5_9AlojFreg_21,
    onEachFeature: onEachFeatureVarEdi5_9AlojFreg_21
});

let slideVarEdi5_9AlojFreg_21 = function(){
    var sliderVarEdi5_9AlojFreg_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 75){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi5_9AlojFreg_21, {
        start: [minVarEdi5_9AlojFreg_21, maxVarEdi5_9AlojFreg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi5_9AlojFreg_21,
            'max': maxVarEdi5_9AlojFreg_21
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi5_9AlojFreg_21);
    inputNumberMax.setAttribute("value",maxVarEdi5_9AlojFreg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi5_9AlojFreg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi5_9AlojFreg_21.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi5_9AlojFreg_21.noUiSlider.on('update',function(e){
        VarEdi5_9AlojFreg_21.eachLayer(function(layer){
            if(layer.feature.properties.V_ED_9AL21 == null){
                return false
            }
            if(layer.feature.properties.V_ED_9AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED_9AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi5_9AlojFreg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 75;
    sliderAtivo = sliderVarEdi5_9AlojFreg_21.noUiSlider;
    $(slidersGeral).append(sliderVarEdi5_9AlojFreg_21);
} 

//////////////////////--------- Fim da Variação Edifícios com 5 a 9 ALOJAMENTOS, FREGUESIA 2021 2011-------------- \\\\\\

/////////////////////////////------- Variação Edifícios com 10 OU MAIS ALOJAMENTOS, FREGUESIA 2021 2011 -------------------////

var minVarEdi10AlojFreg_21 = 9999;
var maxVarEdi10AlojFreg_21 = 0;

function CorVar10AlojFreg21_11(d) {
    return  d === null ? '#808080':
        d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#2288bf' :
                ''  ;
}

var legendaVar10AlojFreg21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de edifícios com 10 ou mais alojamentos, entre 2021 e 2011, por freguesia' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarEdi10AlojFreg_21(feature) {
    if(feature.properties.V_ED10AL21 <= minVarEdi10AlojFreg_21){
        minVarEdi10AlojFreg_21 = feature.properties.V_ED10AL21
    }
    if(feature.properties.V_ED10AL21 > maxVarEdi10AlojFreg_21){
        maxVarEdi10AlojFreg_21 = feature.properties.V_ED10AL21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar10AlojFreg21_11(feature.properties.V_ED10AL21)};
    }


function apagarVarEdi10AlojFreg_21(e) {
    VarEdi10AlojFreg_21.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarEdi10AlojFreg_21(feature, layer) {
    if(feature.properties.V_ED10AL21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_ED10AL21.toFixed(2) + '</b>' + '%').openPopup()
    }       layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarEdi10AlojFreg_21,
    });
}
var VarEdi10AlojFreg_21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloVarEdi10AlojFreg_21,
    onEachFeature: onEachFeatureVarEdi10AlojFreg_21
});

let slideVarEdi10AlojFreg_21 = function(){
    var sliderVarEdi10AlojFreg_21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 76){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarEdi10AlojFreg_21, {
        start: [minVarEdi10AlojFreg_21, maxVarEdi10AlojFreg_21],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarEdi10AlojFreg_21,
            'max': maxVarEdi10AlojFreg_21
        },
        });
    inputNumberMin.setAttribute("value",minVarEdi10AlojFreg_21);
    inputNumberMax.setAttribute("value",maxVarEdi10AlojFreg_21);

    inputNumberMin.addEventListener('change', function(){
        sliderVarEdi10AlojFreg_21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarEdi10AlojFreg_21.noUiSlider.set([null, this.value]);
    });

    sliderVarEdi10AlojFreg_21.noUiSlider.on('update',function(e){
        VarEdi10AlojFreg_21.eachLayer(function(layer){
            if(layer.feature.properties.V_ED10AL21 == null){
                return false
            }
            if(layer.feature.properties.V_ED10AL21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_ED10AL21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarEdi10AlojFreg_21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 76;
    sliderAtivo = sliderVarEdi10AlojFreg_21.noUiSlider;
    $(slidersGeral).append(sliderVarEdi10AlojFreg_21);
} 

//////////////////////--------- Fim da Variação Edifícios com 10 ou MAIS ALOJAMENTOS, FREGUESIA 2021 2011-------------- \\\\\\





var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Recenseamento da população e habitação';

/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = Edi1AlojConc_91;
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
    if (layer == Edi1AlojConc_91 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 alojamento, em 1991, por concelho.' + '</strong>');
        legenda(maxEdi1AlojConc_91, ((maxEdi1AlojConc_91-minEdi1AlojConc_91)/2).toFixed(0),minEdi1AlojConc_91,0.15);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slideEdi1AlojConc_91();
        naoDuplicar = 1;
    }
    if (layer == Edi1AlojConc_91 && naoDuplicar == 1){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 alojamento, em 1991, por concelho.' + '</strong>');
        contornoConcelhos1991.addTo(map);
    } 
    if (layer == Edi2_4AlojConc_91 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 2 a 4 alojamentos, em 1991, por concelho.' + '</strong>');
        legendaExcecao(maxEdi2_4AlojConc_91, ((maxEdi2_4AlojConc_91-minEdi2_4AlojConc_91)/2).toFixed(0),minEdi2_4AlojConc_91,0.15);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slideEdi2_4AlojConc_91();
        naoDuplicar = 2;
    }
    if (layer == Edi5_9AlojConc_91 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 5 a 9 alojamentos, em 1991, por concelho.' + '</strong>');
        legendaExcecao(maxEdi5_9AlojConc_91, ((maxEdi5_9AlojConc_91-minEdi5_9AlojConc_91)/2).toFixed(0),minEdi5_9AlojConc_91,0.15);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slideEdi5_9AlojConc_91();
        naoDuplicar = 3;
    }
    if (layer == Edi10AlojConc_91 && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 10 ou mais alojamentos, em 1991, por concelho.' + '</strong>');
        legendaExcecao(maxEdi10AlojConc_91, ((maxEdi10AlojConc_91-minEdi10AlojConc_91)/2).toFixed(0),minEdi10AlojConc_91,0.15);
        contornoConcelhos1991.addTo(map);
        baseAtiva = contornoConcelhos1991;
        slideEdi10AlojConc_91();
        naoDuplicar = 4;
    }
    if (layer == Edi1AlojConc_01 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 alojamento, em 2001, por concelho.' + '</strong>');
        legenda(maxEdi1AlojConc_01, ((maxEdi1AlojConc_01-minEdi1AlojConc_01)/2).toFixed(0),minEdi1AlojConc_01,0.15);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdi1AlojConc_01();
        naoDuplicar = 5;
    }
    if (layer == Edi2_4AlojConc_01 && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 2 a 4 alojamentos, em 2001, por concelho.' + '</strong>');
        legendaExcecao(maxEdi2_4AlojConc_01, ((maxEdi2_4AlojConc_01-minEdi2_4AlojConc_01)/2).toFixed(0),minEdi2_4AlojConc_01,0.15);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdi2_4AlojConc_01();
        naoDuplicar = 6;
    }
    if (layer == Edi5_9AlojConc_01 && naoDuplicar != 7){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 5 a 9 alojamentos, em 2001, por concelho.' + '</strong>');
        legendaExcecao(maxEdi5_9AlojConc_01, ((maxEdi5_9AlojConc_01-minEdi5_9AlojConc_01)/2).toFixed(0),minEdi5_9AlojConc_01,0.15);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdi5_9AlojConc_01();
        naoDuplicar = 7;
    }
    if (layer == Edi10AlojConc_01 && naoDuplicar != 8){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 10 ou mais alojamentos, em 2001, por concelho.' + '</strong>');
        legendaExcecao(maxEdi10AlojConc_01, ((maxEdi10AlojConc_01-minEdi10AlojConc_01)/2).toFixed(0),minEdi10AlojConc_01,0.15);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdi10AlojConc_01();
        naoDuplicar = 8;
    }
    if (layer == Edi1AlojConc_11 && naoDuplicar != 9){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 alojamento, em 2011, por concelho.' + '</strong>');
        legenda(maxEdi1AlojConc_11, ((maxEdi1AlojConc_11-minEdi1AlojConc_11)/2).toFixed(0),minEdi1AlojConc_11,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdi1AlojConc_11();
        naoDuplicar = 9;
    }
    if (layer == Edi2_4AlojConc_11 && naoDuplicar != 10){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 2 a 4 alojamentos, em 2011, por concelho.' + '</strong>');
        legendaExcecao(maxEdi2_4AlojConc_11, ((maxEdi2_4AlojConc_11-minEdi2_4AlojConc_11)/2).toFixed(0),minEdi2_4AlojConc_11,0.15);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdi2_4AlojConc_11();
        naoDuplicar = 10;
    }
    if (layer == Edi5_9AlojConc_11 && naoDuplicar != 11){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 5 a 9 alojamentos, em 2011, por concelho.' + '</strong>');
        legendaExcecao(maxEdi5_9AlojConc_11, ((maxEdi5_9AlojConc_11-minEdi5_9AlojConc_11)/2).toFixed(0),minEdi5_9AlojConc_11,0.15);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdi5_9AlojConc_11();
        naoDuplicar = 11;
    }
    if (layer == Edi10AlojConc_11 && naoDuplicar != 12){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 10 ou mais alojamentos, em 2011, por concelho.' + '</strong>');
        legendaExcecao(maxEdi10AlojConc_11, ((maxEdi10AlojConc_11-minEdi10AlojConc_11)/2).toFixed(0),minEdi10AlojConc_11,0.15);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdi10AlojConc_11();
        naoDuplicar = 12;
    }
    if (layer == Edi1AlojConc_21 && naoDuplicar != 13){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 alojamento, em 2021, por concelho.' + '</strong>');
        legenda(maxEdi1AlojConc_21, ((maxEdi1AlojConc_21-minEdi1AlojConc_21)/2).toFixed(0),minEdi1AlojConc_21,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideEdi1AlojConc_21();
        naoDuplicar = 13;
    }
    if (layer == Edi2_4AlojConc_21 && naoDuplicar != 14){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 2 a 4 alojamentos, em 2021, por concelho.' + '</strong>');
        legenda(maxEdi2_4AlojConc_21, ((maxEdi2_4AlojConc_21-minEdi2_4AlojConc_21)/2).toFixed(0),minEdi2_4AlojConc_21,0.15);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdi2_4AlojConc_21();
        naoDuplicar = 14;
    }
    if (layer == Edi5_9AlojConc_21 && naoDuplicar != 15){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 5 a 9 alojamentos, em 2021, por concelho.' + '</strong>');
        legenda(maxEdi5_9AlojConc_21, ((maxEdi5_9AlojConc_21-minEdi5_9AlojConc_21)/2).toFixed(0),minEdi5_9AlojConc_21,0.15);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdi5_9AlojConc_21();
        naoDuplicar = 15;
    }
    if (layer == Edi10AlojConc_21 && naoDuplicar != 16){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 10 ou mais alojamentos, em 2021, por concelho.' + '</strong>');
        legenda(maxEdi10AlojConc_21, ((maxEdi10AlojConc_21-minEdi10AlojConc_21)/2).toFixed(0),minEdi10AlojConc_21,0.15);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdi10AlojConc_21();
        naoDuplicar = 16;
    }
    if (layer == PerEdi1AlojConc_91 && naoDuplicar != 17){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 1 alojamento, em 1991, por concelho.' + '</strong>');
        legendaPerEdi1AlojConc();
        slidePerEdi1AlojConc_91();
        naoDuplicar = 17;
    }
    if (layer == PerEdi2_4AlojConc_91 && naoDuplicar != 18){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 2 a 4 alojamentos, em 1991, por concelho.' + '</strong>');
        legendaPerEdi2a4AlojConc();
        slidePerEdi2_4AlojConc_91();
        naoDuplicar = 18;
    }
    if (layer == PerEdi5_9AlojConc_91 && naoDuplicar != 19){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 5 a 9 alojamentos, em 1991, por concelho.' + '</strong>');
        legendaPerEdi5a9AlojConc();
        slidePerEdi5_9AlojConc_91();
        naoDuplicar = 19;
    }
    if (layer == PerEdi10AlojConc_91 && naoDuplicar != 20){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 10 ou mais alojamentos, em 1991, por concelho.' + '</strong>');
        legendaPerEdi10AlojConc();
        slidePerEdi10AlojConc_91();
        naoDuplicar = 20;
    }
    if (layer == PerEdi1AlojConc_01 && naoDuplicar != 21){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 1 alojamento, em 2001, por concelho.' + '</strong>');
        legendaPerEdi1AlojConc();
        slidePerEdi1AlojConc_01();
        naoDuplicar = 21;
    }
    if (layer == PerEdi2_4AlojConc_01 && naoDuplicar != 22){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 2 a 4 alojamentos, em 2001, por concelho.' + '</strong>');
        legendaPerEdi2a4AlojConc();
        slidePerEdi2_4AlojConc_01();
        naoDuplicar = 22;
    }
    if (layer == PerEdi5_9AlojConc_01 && naoDuplicar != 23){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 5 a 9 alojamentos, em 2001, por concelho.' + '</strong>');
        legendaPerEdi5a9AlojConc();
        slidePerEdi5_9AlojConc_01();
        naoDuplicar = 23;
    }
    if (layer == PerEdi10AlojConc_01 && naoDuplicar != 24){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 10 ou mais alojamentos, em 2001, por concelho.' + '</strong>');
        legendaPerEdi10AlojConc();
        slidePerEdi10AlojConc_01();
        naoDuplicar = 24;
    }
    if (layer == PerEdi1AlojConc_11 && naoDuplicar != 25){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 1 alojamento, em 2011, por concelho.' + '</strong>');
        legendaPerEdi1AlojConc();
        slidePerEdi1AlojConc_11();
        naoDuplicar = 25;
    }
    if (layer == PerEdi2_4AlojConc_11 && naoDuplicar != 26){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 2 a 4 alojamentos, em 2011, por concelho.' + '</strong>');
        legendaPerEdi2a4AlojConc();
        slidePerEdi2_4AlojConc_11();
        naoDuplicar = 26;
    }
    if (layer == PerEdi5_9AlojConc_11 && naoDuplicar != 27){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 5 a 9 alojamentos, em 2011, por concelho.' + '</strong>');
        legendaPerEdi5a9AlojConc();
        slidePerEdi5_9AlojConc_11();
        naoDuplicar = 27;
    }
    if (layer == PerEdi10AlojConc_11 && naoDuplicar != 28){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 10 ou mais alojamentos, em 2011, por concelho.' + '</strong>');
        legendaPerEdi10AlojConc();
        slidePerEdi10AlojConc_11();
        naoDuplicar = 28;
    }
    if (layer == PerEdi1AlojConc_21 && naoDuplicar != 29){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 1 alojamento, em 2021, por concelho.' + '</strong>');
        legendaPerEdi1AlojConc();
        slidePerEdi1AlojConc_21();
        naoDuplicar = 29;
    }
    if (layer == PerEdi2_4AlojConc_21 && naoDuplicar != 30){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 2 a 4 alojamentos, em 2021, por concelho.' + '</strong>');
        legendaPerEdi2a4AlojConc();
        slidePerEdi2_4AlojConc_21();
        naoDuplicar = 30;
    }
    if (layer == PerEdi5_9AlojConc_21 && naoDuplicar != 31){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 5 a 9 alojamentos, em 2021, por concelho.' + '</strong>');
        legendaPerEdi5a9AlojConc();
        slidePerEdi5_9AlojConc_21();
        naoDuplicar = 31;
    }
    if (layer == PerEdi10AlojConc_21 && naoDuplicar != 32){
        $('#tituloMapa').html('<strong>' + 'Proporção de edifícios com 10 ou mais alojamentos, em 2021, por concelho.' + '</strong>');
        legendaPerEdi10AlojConc();
        slidePerEdi10AlojConc_21();
        naoDuplicar = 32;
    }
    if (layer == VarEdi1AlojConc_01 && naoDuplicar != 33){
        legendaVar1AlojConc01_91();
        slideVarEdi1AlojConc_01();
        naoDuplicar = 33;
    }
    if (layer == VarEdi2_4AlojConc_01 && naoDuplicar != 34){
        legendaVar2a4AlojConc01_91();
        slideVarEdi2_4AlojConc_01();
        naoDuplicar = 34;
    }
    if (layer == VarEdi5_9AlojConc_01 && naoDuplicar != 35){
        legendaVar5a9AlojConc01_91();
        slideVarEdi5_9AlojConc_01();
        naoDuplicar = 35;
    }
    if (layer == VarEdi10AlojConc_01 && naoDuplicar != 36){
        legendaVar10AlojConc01_91();
        slideVarEdi10AlojConc_01();
        naoDuplicar = 36;
    }
    if (layer == VarEdi1AlojConc_11 && naoDuplicar != 37){
        legendaVar1AlojConc11_01();
        slideVarEdi1AlojConc_11();
        naoDuplicar = 37;
    }
    if (layer == VarEdi2_4AlojConc_11 && naoDuplicar != 38){
        legendaVar2a4AlojConc11_01();
        slideVarEdi2_4AlojConc_11();
        naoDuplicar = 38;
    }
    if (layer == VarEdi5_9AlojConc_11 && naoDuplicar != 39){
        legendaVar5a9AlojConc11_01();
        slideVarEdi5_9AlojConc_11();
        naoDuplicar = 39;
    }
    if (layer == VarEdi10AlojConc_11 && naoDuplicar != 40){
        legendaVar10AlojConc11_01();
        slideVarEdi10AlojConc_11();
        naoDuplicar = 40;
    }
    if (layer == VarEdi1AlojConc_21 && naoDuplicar != 41){
        legendaVar1AlojConc21_11();
        slideVarEdi1AlojConc_21();
        naoDuplicar = 41;
    }
    if (layer == VarEdi2_4AlojConc_21 && naoDuplicar != 42){
        legendaVar2a4AlojConc21_11();
        slideVarEdi2_4AlojConc_21();
        naoDuplicar = 42;
    }
    if (layer == VarEdi5_9AlojConc_21 && naoDuplicar != 43){
        legendaVar5a9AlojConc21_11();
        slideVarEdi5_9AlojConc_21();
        naoDuplicar = 43;
    }
    if (layer == VarEdi10AlojConc_21 && naoDuplicar != 44){
        legendaVar10AlojConc21_11();
        slideVarEdi10AlojConc_21();
        naoDuplicar = 44;
    }
    if (layer == Edi1AlojFreg_01 && naoDuplicar != 45){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 alojamento, em 2001, por freguesia.' + '</strong>');
        legendaExcecao(maxEdi1AlojFreg_01, ((maxEdi1AlojFreg_01-minEdi1AlojFreg_01)/2).toFixed(0),minEdi1AlojFreg_01,0.2);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEdi1AlojFreg_01();
        naoDuplicar = 45;
    }
    if (layer == Edi1AlojFreg_01 && naoDuplicar == 45){
        contornoFreg2001.addTo(map);
    } 
    if (layer == Edi2_4AlojFreg_01 && naoDuplicar != 46){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 2 a 4 alojamentos, em 2001, por freguesia.' + '</strong>');
        legendaExcecao(maxEdi2_4AlojFreg_01, ((maxEdi2_4AlojFreg_01-minEdi2_4AlojFreg_01)/2).toFixed(0),minEdi2_4AlojFreg_01,0.5);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEdi2_4AlojFreg_01();
        naoDuplicar = 46;
    }
    if (layer == Edi5_9AlojFreg_01 && naoDuplicar != 47){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 5 a 9 alojamentos, em 2001, por freguesia.' + '</strong>');
        legenda(maxEdi5_9AlojFreg_01, ((maxEdi5_9AlojFreg_01-minEdi5_9AlojFreg_01)/2).toFixed(0),minEdi5_9AlojFreg_01,0.7);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEdi5_9AlojFreg_01();
        naoDuplicar = 47;
    }
    if (layer == Edi10AlojFreg_01 && naoDuplicar != 48){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 10 ou mais alojamentos, em 2001, por freguesia.' + '</strong>');
        legenda(maxEdi10AlojFreg_01, ((maxEdi10AlojFreg_01-minEdi10AlojFreg_01)/2).toFixed(0),minEdi10AlojFreg_01,0.7);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEdi10AlojFreg_01();
        naoDuplicar = 48;
    }
    if (layer == Edi1AlojFreg_11 && naoDuplicar != 49){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 alojamento, em 2011, por freguesia.' + '</strong>');
        legendaExcecao(maxEdi1AlojFreg_11, ((maxEdi1AlojFreg_11-minEdi1AlojFreg_11)/2).toFixed(0),minEdi1AlojFreg_11,0.2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi1AlojFreg_11();
        naoDuplicar = 49;
    }
    if (layer == Edi2_4AlojFreg_11 && naoDuplicar != 50){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 2 a 4 alojamentos, em 2011, por freguesia.' + '</strong>');
        legendaExcecao(maxEdi2_4AlojFreg_11, ((maxEdi2_4AlojFreg_11-minEdi2_4AlojFreg_11)/2).toFixed(0),minEdi2_4AlojFreg_11,0.5);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi2_4AlojFreg_11();
        naoDuplicar = 50;
    }
    if (layer == Edi5_9AlojFreg_11 && naoDuplicar != 51){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 5 a 9 alojamentos, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdi5_9AlojFreg_11, ((maxEdi5_9AlojFreg_11-minEdi5_9AlojFreg_11)/2).toFixed(0),minEdi5_9AlojFreg_11,0.7);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi5_9AlojFreg_11();
        naoDuplicar = 51;
    }
    if (layer == Edi10AlojFreg_11 && naoDuplicar != 52){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 10 ou mais alojamentos, em 2011, por freguesia.' + '</strong>');
        legenda(maxEdi10AlojFreg_11, ((maxEdi10AlojFreg_11-minEdi10AlojFreg_11)/2).toFixed(0),minEdi10AlojFreg_11,0.7);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi10AlojFreg_11();
        naoDuplicar = 52;
    }
    if (layer == Edi1AlojFreg_21 && naoDuplicar != 53){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 1 alojamento, em 2021, por freguesia.' + '</strong>');
        legendaExcecao(maxEdi1AlojFreg_21, ((maxEdi1AlojFreg_21-minEdi1AlojFreg_21)/2).toFixed(0),minEdi1AlojFreg_21,0.2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi1AlojFreg_21();
        naoDuplicar = 53;
    }
    if (layer == Edi2_4AlojFreg_21 && naoDuplicar != 54){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 2 a 4 alojamentos, em 2021, por freguesia.' + '</strong>');
        legendaExcecao(maxEdi2_4AlojFreg_21, ((maxEdi2_4AlojFreg_21-minEdi2_4AlojFreg_21)/2).toFixed(0),minEdi2_4AlojFreg_21,0.5);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi2_4AlojFreg_21();
        naoDuplicar = 54;
    }
    if (layer == Edi5_9AlojFreg_21 && naoDuplicar != 55){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 5 a 9 alojamentos, em 2021, por freguesia.' + '</strong>');
        legenda(maxEdi5_9AlojFreg_21, ((maxEdi5_9AlojFreg_21-minEdi5_9AlojFreg_21)/2).toFixed(0),minEdi5_9AlojFreg_21,0.7);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi5_9AlojFreg_21();
        naoDuplicar = 55;
    }
    if (layer == Edi10AlojFreg_21 && naoDuplicar != 56){
        $('#tituloMapa').html('<strong>' + 'Número de edifícios com 10 ou mais alojamentos, em 2021, por freguesia.' + '</strong>');
        legenda(maxEdi10AlojFreg_21, ((maxEdi10AlojFreg_21-minEdi10AlojFreg_21)/2).toFixed(0),minEdi10AlojFreg_21,0.7);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdi10AlojFreg_21();
        naoDuplicar = 56;
    }
    if (layer == PerEdi1AlojFreg_01 && naoDuplicar != 57){
        legendaPerEdi1AlojFreg();
        slidePerEdi1AlojFreg_01();
        naoDuplicar = 57;
    }
    if (layer == PerEdi2_4AlojFreg_01 && naoDuplicar != 58){
        legendaPerEdi2a4AlojFreg();
        slidePerEdi2_4AlojFreg_01();
        naoDuplicar = 58;
    }
    if (layer == PerEdi5_9AlojFreg_01 && naoDuplicar != 59){
        legendaPerEdi5a9AlojFreg();
        slidePerEdi5_9AlojFreg_01();
        naoDuplicar = 59;
    }
    if (layer == PerEdi10AlojFreg_01 && naoDuplicar != 60){
        legendaPerEdi10AlojFreg();
        slidePerEdi10AlojFreg_01();
        naoDuplicar = 60;
    }
    if (layer == PerEdi1AlojFreg_11 && naoDuplicar != 61){
        legendaPerEdi1AlojFreg();
        slidePerEdi1AlojFreg_11();
        naoDuplicar = 61;
    }
    if (layer == PerEdi2_4AlojFreg_11 && naoDuplicar != 62){
        legendaPerEdi2a4AlojFreg();
        slidePerEdi2_4AlojFreg_11();
        naoDuplicar = 62;
    }
    if (layer == PerEdi5_9AlojFreg_11 && naoDuplicar != 63){
        legendaPerEdi5a9AlojFreg();
        slidePerEdi5_9AlojFreg_11();
        naoDuplicar = 63;
    }
    if (layer == PerEdi10AlojFreg_11 && naoDuplicar != 64){
        legendaPerEdi10AlojFreg();
        slidePerEdi10AlojFreg_11();
        naoDuplicar = 64;
    }
    if (layer == PerEdi1AlojFreg_21 && naoDuplicar != 65){
        legendaPerEdi1AlojFreg();
        slidePerEdi1AlojFreg_21();
        naoDuplicar = 65;
    }
    if (layer == PerEdi2_4AlojFreg_21 && naoDuplicar != 66){
        legendaPerEdi2a4AlojFreg();
        slidePerEdi2_4AlojFreg_21();
        naoDuplicar = 66;
    }
    if (layer == PerEdi5_9AlojFreg_21 && naoDuplicar != 67){
        legendaPerEdi5a9AlojFreg();
        slidePerEdi5_9AlojFreg_21();
        naoDuplicar = 67;
    }
    if (layer == PerEdi10AlojFreg_21 && naoDuplicar != 68){
        legendaPerEdi10AlojFreg();
        slidePerEdi10AlojFreg_21();
        naoDuplicar = 68;
    }
    if (layer == VarEdi1AlojFreg_01 && naoDuplicar != 69){
        legendaVar1AlojFreg11_01();
        slideVarEdi1AlojFreg_01();
        naoDuplicar = 69;
    }
    if (layer == VarEdi2_4AlojFreg_01 && naoDuplicar != 70){
        legendaVar2a4AlojFreg11_01();
        slideVarEdi2_4AlojFreg_01();
        naoDuplicar = 70;
    }
    if (layer == VarEdi5_9AlojFreg_01 && naoDuplicar != 71){
        legendaVar5a9AlojFreg11_01();
        slideVarEdi5_9AlojFreg_01();
        naoDuplicar = 71;
    }
    if (layer == VarEdi10AlojFreg_01 && naoDuplicar != 72){
        legendaVar10AlojFreg11_01();
        slideVarEdi10AlojFreg_01();
        naoDuplicar = 72;
    }
    if (layer == VarEdi1AlojFreg_21 && naoDuplicar != 73){
        legendaVar1AlojFreg21_11();
        slideVarEdi1AlojFreg_21();
        naoDuplicar = 73;
    }
    if (layer == VarEdi2_4AlojFreg_21 && naoDuplicar != 74){
        legendaVar2a4AlojFreg21_11();
        slideVarEdi2_4AlojFreg_21();
        naoDuplicar = 74;
    }
    if (layer == VarEdi5_9AlojFreg_21 && naoDuplicar != 75){
        legendaVar5a9AlojFreg21_11();
        slideVarEdi5_9AlojFreg_21();
        naoDuplicar = 75;
    }
    if (layer == VarEdi10AlojFreg_21 && naoDuplicar != 76){
        legendaVar10AlojFreg21_11();
        slideVarEdi10AlojFreg_21();
        naoDuplicar = 76;
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
    $('#notaRodape').css("visibility","visible")
}
function myFunction() {
    var dimensao = document.getElementById("opcaoSelect").value;
    var anoSelecionado = document.getElementById("mySelect").value;
    if($('#absoluto').hasClass('active4')){
        if (anoSelecionado == "1991" && dimensao == "1"){
            novaLayer(Edi1AlojConc_91);
        }
        if (anoSelecionado == "1991" && dimensao == "4"){
            novaLayer(Edi2_4AlojConc_91);
        }
        if (anoSelecionado == "1991" && dimensao == "9"){
            novaLayer(Edi5_9AlojConc_91);
        }
        if (anoSelecionado == "1991" && dimensao == "10"){
            novaLayer(Edi10AlojConc_91);
        }
        if (anoSelecionado == "2001" && dimensao == "1"){
            novaLayer(Edi1AlojConc_01);
        }
        if (anoSelecionado == "2001" && dimensao == "4"){
            novaLayer(Edi2_4AlojConc_01);
        }
        if (anoSelecionado == "2001" && dimensao == "9"){
            novaLayer(Edi5_9AlojConc_01);
        }
        if (anoSelecionado == "2001" && dimensao == "10"){
            novaLayer(Edi10AlojConc_01);
        }
        if (anoSelecionado == "2011" && dimensao == "1"){
            novaLayer(Edi1AlojConc_11);
        }
        if (anoSelecionado == "2011" && dimensao == "4"){
            novaLayer(Edi2_4AlojConc_11);
        }
        if (anoSelecionado == "2011" && dimensao == "9"){
            novaLayer(Edi5_9AlojConc_11);
        }
        if (anoSelecionado == "2011" && dimensao == "10"){
            novaLayer(Edi10AlojConc_11);
        }
        if (anoSelecionado == "2021" && dimensao == "1"){
            novaLayer(Edi1AlojConc_21);
        }
        if (anoSelecionado == "2021" && dimensao == "4"){
            novaLayer(Edi2_4AlojConc_21);
        }
        if (anoSelecionado == "2021" && dimensao == "9"){
            novaLayer(Edi5_9AlojConc_21);
        }
        if (anoSelecionado == "2021" && dimensao == "10"){
            novaLayer(Edi10AlojConc_21);
        }

    }
    if($('#taxaVariacao').hasClass('active4')){
        $('#notaRodape').remove();
        if (anoSelecionado == "2001" && dimensao == "1"){
            novaLayer(VarEdi1AlojConc_01);
        }
        if (anoSelecionado == "2001" && dimensao == "4"){
            novaLayer(VarEdi2_4AlojConc_01);
        }
        if (anoSelecionado == "2001" && dimensao == "9"){
            novaLayer(VarEdi5_9AlojConc_01);
        }
        if (anoSelecionado == "2001" && dimensao == "10"){
            novaLayer(VarEdi10AlojConc_01);
        }
        if (anoSelecionado == "2011" && dimensao == "1"){
            novaLayer(VarEdi1AlojConc_11);
        }
        if (anoSelecionado == "2011" && dimensao == "4"){
            novaLayer(VarEdi2_4AlojConc_11);
        }
        if (anoSelecionado == "2011" && dimensao == "9"){
            novaLayer(VarEdi5_9AlojConc_11);
        }
        if (anoSelecionado == "2011" && dimensao == "10"){
            novaLayer(VarEdi10AlojConc_11);
        }
        if (anoSelecionado == "2021" && dimensao == "1"){
            novaLayer(VarEdi1AlojConc_21);
        }
        if (anoSelecionado == "2021" && dimensao == "4"){
            novaLayer(VarEdi2_4AlojConc_21);
        }
        if (anoSelecionado == "2021" && dimensao == "9"){
            novaLayer(VarEdi5_9AlojConc_21);
        }
        if (anoSelecionado == "2021" && dimensao == "10"){
            novaLayer(VarEdi10AlojConc_21);
        }
    }
    if ($('#percentagem').hasClass('active4')){
        $('#notaRodape').remove();
        if (anoSelecionado == "1991" && dimensao == "1"){
            novaLayer(PerEdi1AlojConc_91);
        }
        if (anoSelecionado == "1991" && dimensao == "4"){
            novaLayer(PerEdi2_4AlojConc_91);
        }
        if (anoSelecionado == "1991" && dimensao == "9"){
            novaLayer(PerEdi5_9AlojConc_91);
        }
        if (anoSelecionado == "1991" && dimensao == "10"){
            novaLayer(PerEdi10AlojConc_91);
        }
        if (anoSelecionado == "2001" && dimensao == "1"){
            novaLayer(PerEdi1AlojConc_01);
        }
        if (anoSelecionado == "2001" && dimensao == "4"){
            novaLayer(PerEdi2_4AlojConc_01);
        }
        if (anoSelecionado == "2001" && dimensao == "9"){
            novaLayer(PerEdi5_9AlojConc_01);
        }
        if (anoSelecionado == "2001" && dimensao == "10"){
            novaLayer(PerEdi10AlojConc_01);
        }
        if (anoSelecionado == "2011" && dimensao == "1"){
            novaLayer(PerEdi1AlojConc_11);
        }
        if (anoSelecionado == "2011" && dimensao == "4"){
            novaLayer(PerEdi2_4AlojConc_11);
        }
        if (anoSelecionado == "2011" && dimensao == "9"){
            novaLayer(PerEdi5_9AlojConc_11);
        }
        if (anoSelecionado == "2011" && dimensao == "10"){
            novaLayer(PerEdi10AlojConc_11);
        }
        if (anoSelecionado == "2021" && dimensao == "1"){
            novaLayer(PerEdi1AlojConc_21);
        }
        if (anoSelecionado == "2021" && dimensao == "4"){
            novaLayer(PerEdi2_4AlojConc_21);
        }
        if (anoSelecionado == "2021" && dimensao == "9"){
            novaLayer(PerEdi5_9AlojConc_21);
        }
        if (anoSelecionado == "2021" && dimensao == "10"){
            novaLayer(PerEdi10AlojConc_21);
        }
        
    }
    if($('#absoluto').hasClass('active5')){
        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong>não devendo, assim, comparar com mais nenhum escalão de dimensão de alojamentos.</strong>')
        if (anoSelecionado == "2001" && dimensao == "1"){
            novaLayer(Edi1AlojFreg_01);
        }
        if (anoSelecionado == "2001" && dimensao == "4"){
            novaLayer(Edi2_4AlojFreg_01);
        }
        if (anoSelecionado == "2001" && dimensao == "9"){
            novaLayer(Edi5_9AlojFreg_01);
        }
        if (anoSelecionado == "2001" && dimensao == "10"){
            novaLayer(Edi10AlojFreg_01);
        }
        if (anoSelecionado == "2011" && dimensao == "1"){
            novaLayer(Edi1AlojFreg_11);
        }
        if (anoSelecionado == "2011" && dimensao == "4"){
            novaLayer(Edi2_4AlojFreg_11);
        }
        if (anoSelecionado == "2011" && dimensao == "9"){
            novaLayer(Edi5_9AlojFreg_11);
        }
        if (anoSelecionado == "2011" && dimensao == "10"){
            novaLayer(Edi10AlojFreg_11);
        }
        if (anoSelecionado == "2021" && dimensao == "1"){
            novaLayer(Edi1AlojFreg_21);
        }
        if (anoSelecionado == "2021" && dimensao == "4"){
            novaLayer(Edi2_4AlojFreg_21);
        }
        if (anoSelecionado == "2021" && dimensao == "9"){
            novaLayer(Edi5_9AlojFreg_21);
        }
        if (anoSelecionado == "2021" && dimensao == "10"){
            novaLayer(Edi10AlojFreg_21);
        }
    }
    if($('#taxaVariacao').hasClass('active5')){
        $('#notaRodape').remove();
        if (anoSelecionado == "2011" && dimensao == "1"){
            novaLayer(VarEdi1AlojFreg_01);
        }
        if (anoSelecionado == "2011" && dimensao == "4"){
            novaLayer(VarEdi2_4AlojFreg_01);
        }
        if (anoSelecionado == "2011" && dimensao == "9"){
            novaLayer(VarEdi5_9AlojFreg_01);
        }
        if (anoSelecionado == "2011" && dimensao == "10"){
            novaLayer(VarEdi10AlojFreg_01);
        }
        if (anoSelecionado == "2021" && dimensao == "1"){
            novaLayer(VarEdi1AlojFreg_21);
        }
        if (anoSelecionado == "2021" && dimensao == "4"){
            novaLayer(VarEdi2_4AlojFreg_21);
        }
        if (anoSelecionado == "2021" && dimensao == "9"){
            novaLayer(VarEdi5_9AlojFreg_21);
        }
        if (anoSelecionado == "2021" && dimensao == "10"){
            novaLayer(VarEdi10AlojFreg_21);
        }

    }
    if($('#percentagem').hasClass('active5')){
        $('#notaRodape').remove();
        if (anoSelecionado == "2001" && dimensao == "1"){
            novaLayer(PerEdi1AlojFreg_01);
        }
        if (anoSelecionado == "2001" && dimensao == "4"){
            novaLayer(PerEdi2_4AlojFreg_01);
        }
        if (anoSelecionado == "2001" && dimensao == "9"){
            novaLayer(PerEdi5_9AlojFreg_01);
        }
        if (anoSelecionado == "2001" && dimensao == "10"){
            novaLayer(PerEdi10AlojFreg_01);
        }
        if (anoSelecionado == "2011" && dimensao == "1"){
            novaLayer(PerEdi1AlojFreg_11);
        }
        if (anoSelecionado == "2011" && dimensao == "4"){
            novaLayer(PerEdi2_4AlojFreg_11);
        }
        if (anoSelecionado == "2011" && dimensao == "9"){
            novaLayer(PerEdi5_9AlojFreg_11);
        }
        if (anoSelecionado == "2011" && dimensao == "10"){
            novaLayer(PerEdi10AlojFreg_11);
        }
        if (anoSelecionado == "2021" && dimensao == "1"){
            novaLayer(PerEdi1AlojFreg_21);
        }
        if (anoSelecionado == "2021" && dimensao == "4"){
            novaLayer(PerEdi2_4AlojFreg_21);
        }
        if (anoSelecionado == "2021" && dimensao == "9"){
            novaLayer(PerEdi5_9AlojFreg_21);
        }
        if (anoSelecionado == "2021" && dimensao == "10"){
            novaLayer(PerEdi10AlojFreg_21);
        }
    }
}

let primeirovalor = function(ano){
    $("#mySelect").val(ano);
    $("#opcaoSelect").val('1')
    
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
    $('#mySelect').empty();
    if($('#concelho').hasClass('active2')){
        if($('#absoluto').hasClass('active4') || $('#percentagem').hasClass('active4')){
            var ano = 1991;
            while (ano <= 2021){
                $('#mySelect').append("<option value="+ '' + ano + '' + '>' + ano + '</option>');
                ano += 10;
            }
            primeirovalor('1991');
        }
        if($('#taxaVariacao').hasClass('active4')){
            var ano = 2001;
            var anoAnterior = 1991;
            while (anoAnterior < 2021){
                $('#mySelect').append("<option value="+ '' + ano + '' + '>' + ano + '-' + anoAnterior + '</option>');
                ano += 10;
                anoAnterior += 10;
            }
            primeirovalor('2001');
        }
    }
    if($('#freguesias').hasClass('active2')){
        if($('#absoluto').hasClass('active5') || $('#percentagem').hasClass('active5')){
            var ano = 2001;
            while (ano <= 2021){
                $('#mySelect').append("<option value="+ '' + ano + '' + '>' + ano + '</option>');
                ano += 10;
            }
            primeirovalor('2001');
        }
        if($('#taxaVariacao').hasClass('active5')){
            var ano = 2011;
            var anoAnterior = 2001;
            while (anoAnterior < 2021){
                $('#mySelect').append("<option value="+ '' + ano + '' + '>' + ano + '-' + anoAnterior + '</option>');
                ano += 10;
                anoAnterior += 10;
            }
            primeirovalor('2011');
        }   
    }
}

$('#absoluto').click(function(){
    mudarEscala();
});
$('#percentagem').click(function(){
    reporAnos();
    tamanhoOutros();
    fonteTitulo('F');
});
$('#taxaVariacao').click(function(){
    reporAnos();
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
    $('#tituloMapa').html('Número de edifícios, segundo a dimensão dos alojamentos, entre 1991 e 2021, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/DimensaoAlojamentosProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#1991').html("1991")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Dimensao == "10 ou mais alojamentos"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Dimensao+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS1991.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2011.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2021.toLocaleString("fr")+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Dimensao+'</td>';
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

$('#tabelaPercentagem').click(function(){
    $('#tituloMapa').html('Proporção do número de edifícios, segundo a dimensão dos alojamentos, entre 1991 e 2021, %.');
        $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/DimensaoAlojamentosProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#1991').html("1991")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Dimensao == "10 ou mais alojamentos"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Dimensao+'</td>';
                    dados += '<td class="borderbottom">'+value.Per91+'</td>';
                    dados += '<td class="borderbottom">'+value.Per01+'</td>';
                    dados += '<td class="borderbottom">'+value.Per11+'</td>';
                    dados += '<td class="borderbottom">'+value.Per21+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Dimensao+'</td>';
                    dados += '<td>'+value.Per91+'</td>';
                    dados += '<td>'+value.Per01+'</td>';
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
    $('#tituloMapa').html('Variação do número de edifícios, segundo a dimensão dos alojamentos, entre 1991 e 2021, %.');
    $('#1991').html(" ")
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/DimensaoAlojamentosProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Dimensao == "10 ou mais alojamentos"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Dimensao+'</td>';
                    dados += '<td class="borderbottom">'+ ''+'</td>';
                    dados += '<td class="borderbottom">'+value.Var0191+'</td>';
                    dados += '<td class="borderbottom">'+value.VAR1101+'</td>';
                    dados += '<td class="borderbottom">'+value.VAR2111+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Dimensao+'</td>';
                    dados += '<td>'+ ''+'</td>';
                    dados += '<td>'+value.Var0191+'</td>';
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
    if ($('#concelho').hasClass("active2")){
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
    if ($('#freguesias').hasClass("active2")){
        if (anoSelecionado == "2021"){
            i = $('#mySelect').children('option').length - 1 ;
            console.log(i)
        }
        if (anoSelecionado == "2011"){
            i =  1 ;
        }
        if (anoSelecionado == "2001"){
            i = 0;
        }
    }  
    if ($('#freguesias').hasClass("active2") && $('#taxaVariacao').hasClass('active5')){
        if (anoSelecionado != "2021"){
            i = $('#mySelect').children('option').length - 1 ;
        }
        if (anoSelecionado == "2011"){
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
