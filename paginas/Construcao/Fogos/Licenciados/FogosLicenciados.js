// $('#mapDIV').css("height", "85%");
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'

$('#temporal').css("padding-top","0px");
$('.ine').html('<strong>Fonte: </strong>INE, Inquérito aos projetos de obras de edificação e de demolição de edifícios.');

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
    div.innerHTML = '<img src="../../../../imagens/norte.png" alt="norte" height="40px" width="23px">';
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

let space = document.getElementById("space");
let opcoesTabela = document.getElementById('opcoesTabela');
let escalasConcelho = document.getElementById('escalasConcelho');
let myDIV = document.getElementById('myDIV');
let legendaA= document.getElementById('legendaA');
var ifSlide2isActive = 1;
let slidersGeral = document.getElementById('slidersGeral');
let inputNumberMin = document.getElementById('input-number-min');
let inputNumberMax = document.getElementById('input-number-max');
var sliderAtivo = null

///// --- Botões secundários (Concelho, Freguesia) ficarem ativos sempre que se clica \\\\\
var btns = myDIV.getElementsByClassName("butaoEscala EscalasTerritoriais ");
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
    var titulo = 'Número de fogos'
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

///////////////////////////----------------------- DADOS ABSOLUTOS, CONCELHO --------------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL FOGOS LICENCIADOS 2014, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalFogosConc14 = 99999;
var maxTotalFogosConc14 = 0;
function estiloTotalFogosConc14(feature, latlng) {
    if(feature.properties.Fog_LTot14< minTotalFogosConc14 || feature.properties.Fog_LTot14 ===0){
        minTotalFogosConc14 = feature.properties.Fog_LTot14
    }
    if(feature.properties.Fog_LTot14> maxTotalFogosConc14){
        maxTotalFogosConc14 = feature.properties.Fog_LTot14
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_LTot14,1.3)
    });
}
function apagarTotalFogosConc14(e){
    var layer = e.target;
    TotalFogosConc14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFogosConc14(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos licenciados: ' + '<b>' +feature.properties.Fog_LTot14 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFogosConc14,
    })
};

var TotalFogosConc14= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalFogosConc14,
    onEachFeature: onEachFeatureTotalFogosConc14,
});

var legenda = function(maximo,medio,minimo, multiplicador) {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'center'
    var symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Número de fogos'
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




var slideTotalFogosConc14 = function(){
    var sliderTotalFogosConc14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFogosConc14, {
        start: [minTotalFogosConc14, maxTotalFogosConc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFogosConc14,
            'max': maxTotalFogosConc14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFogosConc14);
    inputNumberMax.setAttribute("value",maxTotalFogosConc14);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFogosConc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFogosConc14.noUiSlider.set([null, this.value]);
    });

    sliderTotalFogosConc14.noUiSlider.on('update',function(e){
        TotalFogosConc14.eachLayer(function(layer){
            if(layer.feature.properties.Fog_LTot14>=parseFloat(e[0])&& layer.feature.properties.Fog_LTot14 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFogosConc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderTotalFogosConc14.noUiSlider;
    $(slidersGeral).append(sliderTotalFogosConc14);
}
contorno.addTo(map)
TotalFogosConc14.addTo(map)
$('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2014, por concelho.' + '</strong>')
legenda(maxTotalFogosConc14, ((maxTotalFogosConc14-minTotalFogosConc14)/2).toFixed(0),minTotalFogosConc14,1.3);
slideTotalFogosConc14();

///////////////////////////-------------  FIM TOTAL FOGOS LICENCIADOS 2014, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL FOGOS T1 LICENCIADOS 2014, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT1Conc14 = 99999;
var maxFogosT1Conc14 = 0;
function estiloFogosT1Conc14(feature, latlng) {
    if(feature.properties.Fog_T114< minFogosT1Conc14 || feature.properties.Fog_T114 ===0){
        minFogosT1Conc14 = feature.properties.Fog_T114
    }
    if(feature.properties.Fog_T114> maxFogosT1Conc14){
        maxFogosT1Conc14 = feature.properties.Fog_T114
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T114,1.8)
    });
}
function apagarFogosT1Conc14(e){
    var layer = e.target;
    FogosT1Conc14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT1Conc14(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T0 ou T1 licenciados: ' + '<b>' +feature.properties.Fog_T114 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT1Conc14,
    })
};

var FogosT1Conc14= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT1Conc14,
    onEachFeature: onEachFeatureFogosT1Conc14,
});

var slideFogosT1Conc14 = function(){
    var sliderFogosT1Conc14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT1Conc14, {
        start: [minFogosT1Conc14, maxFogosT1Conc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT1Conc14,
            'max': maxFogosT1Conc14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT1Conc14);
    inputNumberMax.setAttribute("value",maxFogosT1Conc14);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT1Conc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT1Conc14.noUiSlider.set([null, this.value]);
    });

    sliderFogosT1Conc14.noUiSlider.on('update',function(e){
        FogosT1Conc14.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T114>=parseFloat(e[0])&& layer.feature.properties.Fog_T114 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT1Conc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderFogosT1Conc14.noUiSlider;
    $(slidersGeral).append(sliderFogosT1Conc14);
}

///////////////////////////-------------  FIM TOTAL FOGOS T1 LICENCIADOS 2014, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T2 LICENCIADOS 2014, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT2Conc14 = 99999;
var maxFogosT2Conc14 = 0;
function estiloFogosT2Conc14(feature, latlng) {
    if(feature.properties.Fog_T214< minFogosT2Conc14 || feature.properties.Fog_T214 ===0){
        minFogosT2Conc14 = feature.properties.Fog_T214
    }
    if(feature.properties.Fog_T214> maxFogosT2Conc14){
        maxFogosT2Conc14 = feature.properties.Fog_T214
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T214,1.8)
    });
}
function apagarFogosT2Conc14(e){
    var layer = e.target;
    FogosT2Conc14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT2Conc14(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T2 licenciados: ' + '<b>' +feature.properties.Fog_T214 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT2Conc14,
    })
};

var FogosT2Conc14= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT2Conc14,
    onEachFeature: onEachFeatureFogosT2Conc14,
});

var slideFogosT2Conc14 = function(){
    var sliderFogosT2Conc14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT2Conc14, {
        start: [minFogosT2Conc14, maxFogosT2Conc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT2Conc14,
            'max': maxFogosT2Conc14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT2Conc14);
    inputNumberMax.setAttribute("value",maxFogosT2Conc14);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT2Conc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT2Conc14.noUiSlider.set([null, this.value]);
    });

    sliderFogosT2Conc14.noUiSlider.on('update',function(e){
        FogosT2Conc14.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T214>=parseFloat(e[0])&& layer.feature.properties.Fog_T214 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT2Conc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderFogosT2Conc14.noUiSlider;
    $(slidersGeral).append(sliderFogosT2Conc14);
}

///////////////////////////-------------  FIM TOTAL FOGOS T2 LICENCIADOS 2014, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T3 LICENCIADOS 2014, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT3Conc14 = 99999;
var maxFogosT3Conc14 = 0;
function estiloFogosT3Conc14(feature, latlng) {
    if(feature.properties.Fog_T314< minFogosT3Conc14 || feature.properties.Fog_T314 ===0){
        minFogosT3Conc14 = feature.properties.Fog_T314
    }
    if(feature.properties.Fog_T314> maxFogosT3Conc14){
        maxFogosT3Conc14 = feature.properties.Fog_T314
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T314,1.8)
    });
}
function apagarFogosT3Conc14(e){
    var layer = e.target;
    FogosT3Conc14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT3Conc14(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T3 licenciados: ' + '<b>' +feature.properties.Fog_T314 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT3Conc14,
    })
};

var FogosT3Conc14= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT3Conc14,
    onEachFeature: onEachFeatureFogosT3Conc14,
});

var slideFogosT3Conc14 = function(){
    var sliderFogosT3Conc14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT3Conc14, {
        start: [minFogosT3Conc14, maxFogosT3Conc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT3Conc14,
            'max': maxFogosT3Conc14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT3Conc14);
    inputNumberMax.setAttribute("value",maxFogosT3Conc14);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT3Conc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT3Conc14.noUiSlider.set([null, this.value]);
    });

    sliderFogosT3Conc14.noUiSlider.on('update',function(e){
        FogosT3Conc14.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T314>=parseFloat(e[0])&& layer.feature.properties.Fog_T314 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT3Conc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderFogosT3Conc14.noUiSlider;
    $(slidersGeral).append(sliderFogosT3Conc14);
}

///////////////////////////-------------  FIM TOTAL FOGOS T3 LICENCIADOS 2014, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T4 LICENCIADOS 2014, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT4Conc14 = 99999;
var maxFogosT4Conc14 = 0;
function estiloFogosT4Conc14(feature, latlng) {
    if(feature.properties.Fog_T414< minFogosT4Conc14 || feature.properties.Fog_T414 ===0){
        minFogosT4Conc14 = feature.properties.Fog_T414
    }
    if(feature.properties.Fog_T414> maxFogosT4Conc14){
        maxFogosT4Conc14 = feature.properties.Fog_T414
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T414,1.8)
    });
}
function apagarFogosT4Conc14(e){
    var layer = e.target;
    FogosT4Conc14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT4Conc14(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T4 ou mais licenciados: ' + '<b>' +feature.properties.Fog_T414 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT4Conc14,
    })
};

var FogosT4Conc14= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT4Conc14,
    onEachFeature: onEachFeatureFogosT4Conc14,
});

var slideFogosT4Conc14 = function(){
    var sliderFogosT4Conc14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT4Conc14, {
        start: [minFogosT4Conc14, maxFogosT4Conc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT4Conc14,
            'max': maxFogosT4Conc14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT4Conc14);
    inputNumberMax.setAttribute("value",maxFogosT4Conc14);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT4Conc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT4Conc14.noUiSlider.set([null, this.value]);
    });

    sliderFogosT4Conc14.noUiSlider.on('update',function(e){
        FogosT4Conc14.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T414>=parseFloat(e[0])&& layer.feature.properties.Fog_T414 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT4Conc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderFogosT4Conc14.noUiSlider;
    $(slidersGeral).append(sliderFogosT4Conc14);
}

///////////////////////////-------------  FIM TOTAL FOGOS T4 LICENCIADOS 2014, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS LICENCIADOS 2015, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalFogosConc15 = 99999;
var maxTotalFogosConc15 = 0;
function estiloTotalFogosConc15(feature, latlng) {
    if(feature.properties.Fog_LTot15< minTotalFogosConc15 || feature.properties.Fog_LTot15 ===0){
        minTotalFogosConc15 = feature.properties.Fog_LTot15
    }
    if(feature.properties.Fog_LTot15> maxTotalFogosConc15){
        maxTotalFogosConc15 = feature.properties.Fog_LTot15
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_LTot15,1.3)
    });
}
function apagarTotalFogosConc15(e){
    var layer = e.target;
    TotalFogosConc15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFogosConc15(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos licenciados: ' + '<b>' +feature.properties.Fog_LTot15 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFogosConc15,
    })
};

var TotalFogosConc15= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalFogosConc15,
    onEachFeature: onEachFeatureTotalFogosConc15,
});

var slideTotalFogosConc15 = function(){
    var sliderTotalFogosConc15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFogosConc15, {
        start: [minTotalFogosConc15, maxTotalFogosConc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFogosConc15,
            'max': maxTotalFogosConc15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFogosConc15);
    inputNumberMax.setAttribute("value",maxTotalFogosConc15);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFogosConc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFogosConc15.noUiSlider.set([null, this.value]);
    });

    sliderTotalFogosConc15.noUiSlider.on('update',function(e){
        TotalFogosConc15.eachLayer(function(layer){
            if(layer.feature.properties.Fog_LTot15>=parseFloat(e[0])&& layer.feature.properties.Fog_LTot15 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFogosConc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderTotalFogosConc15.noUiSlider;
    $(slidersGeral).append(sliderTotalFogosConc15);
}

///////////////////////////-------------  FIM TOTAL FOGOS LICENCIADOS 2015, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL FOGOS T1 LICENCIADOS 2015, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT1Conc15 = 99999;
var maxFogosT1Conc15 = 0;
function estiloFogosT1Conc15(feature, latlng) {
    if(feature.properties.Fog_T115< minFogosT1Conc15 || feature.properties.Fog_T115 ===0){
        minFogosT1Conc15 = feature.properties.Fog_T115
    }
    if(feature.properties.Fog_T115> maxFogosT1Conc15){
        maxFogosT1Conc15 = feature.properties.Fog_T115
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T115,1.8)
    });
}
function apagarFogosT1Conc15(e){
    var layer = e.target;
    FogosT1Conc15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT1Conc15(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T0 ou T1 licenciados: ' + '<b>' +feature.properties.Fog_T115 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT1Conc15,
    })
};

var FogosT1Conc15= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT1Conc15,
    onEachFeature: onEachFeatureFogosT1Conc15,
});

var slideFogosT1Conc15 = function(){
    var sliderFogosT1Conc15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT1Conc15, {
        start: [minFogosT1Conc15, maxFogosT1Conc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT1Conc15,
            'max': maxFogosT1Conc15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT1Conc15);
    inputNumberMax.setAttribute("value",maxFogosT1Conc15);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT1Conc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT1Conc15.noUiSlider.set([null, this.value]);
    });

    sliderFogosT1Conc15.noUiSlider.on('update',function(e){
        FogosT1Conc15.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T115>=parseFloat(e[0])&& layer.feature.properties.Fog_T115 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT1Conc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderFogosT1Conc15.noUiSlider;
    $(slidersGeral).append(sliderFogosT1Conc15);
}

///////////////////////////-------------  FIM TOTAL FOGOS T1 LICENCIADOS 2015, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T2 LICENCIADOS 2015, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT2Conc15 = 99999;
var maxFogosT2Conc15 = 0;
function estiloFogosT2Conc15(feature, latlng) {
    if(feature.properties.Fog_T215< minFogosT2Conc15 || feature.properties.Fog_T215 ===0){
        minFogosT2Conc15 = feature.properties.Fog_T215
    }
    if(feature.properties.Fog_T215> maxFogosT2Conc15){
        maxFogosT2Conc15 = feature.properties.Fog_T215
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T215,1.8)
    });
}
function apagarFogosT2Conc15(e){
    var layer = e.target;
    FogosT2Conc15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT2Conc15(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T2 licenciados: ' + '<b>' +feature.properties.Fog_T215 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT2Conc15,
    })
};

var FogosT2Conc15= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT2Conc15,
    onEachFeature: onEachFeatureFogosT2Conc15,
});

var slideFogosT2Conc15 = function(){
    var sliderFogosT2Conc15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT2Conc15, {
        start: [minFogosT2Conc15, maxFogosT2Conc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT2Conc15,
            'max': maxFogosT2Conc15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT2Conc15);
    inputNumberMax.setAttribute("value",maxFogosT2Conc15);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT2Conc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT2Conc15.noUiSlider.set([null, this.value]);
    });

    sliderFogosT2Conc15.noUiSlider.on('update',function(e){
        FogosT2Conc15.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T215>=parseFloat(e[0])&& layer.feature.properties.Fog_T215 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT2Conc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderFogosT2Conc15.noUiSlider;
    $(slidersGeral).append(sliderFogosT2Conc15);
}

///////////////////////////-------------  FIM TOTAL FOGOS T2 LICENCIADOS 2015, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T3 LICENCIADOS 2015, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT3Conc15 = 99999;
var maxFogosT3Conc15 = 0;
function estiloFogosT3Conc15(feature, latlng) {
    if(feature.properties.Fog_T315< minFogosT3Conc15 || feature.properties.Fog_T315 ===0){
        minFogosT3Conc15 = feature.properties.Fog_T315
    }
    if(feature.properties.Fog_T315> maxFogosT3Conc15){
        maxFogosT3Conc15 = feature.properties.Fog_T315
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T315,1.8)
    });
}
function apagarFogosT3Conc15(e){
    var layer = e.target;
    FogosT3Conc15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT3Conc15(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T3 licenciados: ' + '<b>' +feature.properties.Fog_T315 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT3Conc15,
    })
};

var FogosT3Conc15= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT3Conc15,
    onEachFeature: onEachFeatureFogosT3Conc15,
});

var slideFogosT3Conc15 = function(){
    var sliderFogosT3Conc15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT3Conc15, {
        start: [minFogosT3Conc15, maxFogosT3Conc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT3Conc15,
            'max': maxFogosT3Conc15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT3Conc15);
    inputNumberMax.setAttribute("value",maxFogosT3Conc15);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT3Conc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT3Conc15.noUiSlider.set([null, this.value]);
    });

    sliderFogosT3Conc15.noUiSlider.on('update',function(e){
        FogosT3Conc15.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T315>=parseFloat(e[0])&& layer.feature.properties.Fog_T315 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT3Conc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderFogosT3Conc15.noUiSlider;
    $(slidersGeral).append(sliderFogosT3Conc15);
}

///////////////////////////-------------  FIM TOTAL FOGOS T3 LICENCIADOS 2015, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T4 LICENCIADOS 2015, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT4Conc15 = 99999;
var maxFogosT4Conc15 = 0;
function estiloFogosT4Conc15(feature, latlng) {
    if(feature.properties.Fog_T415< minFogosT4Conc15 || feature.properties.Fog_T415 ===0){
        minFogosT4Conc15 = feature.properties.Fog_T415
    }
    if(feature.properties.Fog_T415> maxFogosT4Conc15){
        maxFogosT4Conc15 = feature.properties.Fog_T415
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T415,1.8)
    });
}
function apagarFogosT4Conc15(e){
    var layer = e.target;
    FogosT4Conc15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT4Conc15(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T4 ou mais licenciados: ' + '<b>' +feature.properties.Fog_T415 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT4Conc15,
    })
};

var FogosT4Conc15= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT4Conc15,
    onEachFeature: onEachFeatureFogosT4Conc15,
});

var slideFogosT4Conc15 = function(){
    var sliderFogosT4Conc15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT4Conc15, {
        start: [minFogosT4Conc15, maxFogosT4Conc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT4Conc15,
            'max': maxFogosT4Conc15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT4Conc15);
    inputNumberMax.setAttribute("value",maxFogosT4Conc15);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT4Conc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT4Conc15.noUiSlider.set([null, this.value]);
    });

    sliderFogosT4Conc15.noUiSlider.on('update',function(e){
        FogosT4Conc15.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T415>=parseFloat(e[0])&& layer.feature.properties.Fog_T415 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT4Conc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderFogosT4Conc15.noUiSlider;
    $(slidersGeral).append(sliderFogosT4Conc15);
}

///////////////////////////-------------  FIM TOTAL FOGOS T4 LICENCIADOS 2015, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS LICENCIADOS 2016, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalFogosConc16 = 99999;
var maxTotalFogosConc16 = 0;
function estiloTotalFogosConc16(feature, latlng) {
    if(feature.properties.Fog_LTot16< minTotalFogosConc16 || feature.properties.Fog_LTot16 ===0){
        minTotalFogosConc16 = feature.properties.Fog_LTot16
    }
    if(feature.properties.Fog_LTot16> maxTotalFogosConc16){
        maxTotalFogosConc16 = feature.properties.Fog_LTot16
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_LTot16,1.3)
    });
}
function apagarTotalFogosConc16(e){
    var layer = e.target;
    TotalFogosConc16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFogosConc16(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos licenciados: ' + '<b>' +feature.properties.Fog_LTot16 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFogosConc16,
    })
};

var TotalFogosConc16= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalFogosConc16,
    onEachFeature: onEachFeatureTotalFogosConc16,
});

var slideTotalFogosConc16 = function(){
    var sliderTotalFogosConc16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFogosConc16, {
        start: [minTotalFogosConc16, maxTotalFogosConc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFogosConc16,
            'max': maxTotalFogosConc16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFogosConc16);
    inputNumberMax.setAttribute("value",maxTotalFogosConc16);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFogosConc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFogosConc16.noUiSlider.set([null, this.value]);
    });

    sliderTotalFogosConc16.noUiSlider.on('update',function(e){
        TotalFogosConc16.eachLayer(function(layer){
            if(layer.feature.properties.Fog_LTot16>=parseFloat(e[0])&& layer.feature.properties.Fog_LTot16 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFogosConc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderTotalFogosConc16.noUiSlider;
    $(slidersGeral).append(sliderTotalFogosConc16);
}

///////////////////////////-------------  FIM TOTAL FOGOS LICENCIADOS 2016, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL FOGOS T1 LICENCIADOS 2016, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT1Conc16 = 99999;
var maxFogosT1Conc16 = 0;
function estiloFogosT1Conc16(feature, latlng) {
    if(feature.properties.Fog_T116< minFogosT1Conc16 || feature.properties.Fog_T116 ===0){
        minFogosT1Conc16 = feature.properties.Fog_T116
    }
    if(feature.properties.Fog_T116> maxFogosT1Conc16){
        maxFogosT1Conc16 = feature.properties.Fog_T116
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T116,1.8)
    });
}
function apagarFogosT1Conc16(e){
    var layer = e.target;
    FogosT1Conc16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT1Conc16(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T0 ou T1 licenciados: ' + '<b>' +feature.properties.Fog_T116 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT1Conc16,
    })
};

var FogosT1Conc16= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT1Conc16,
    onEachFeature: onEachFeatureFogosT1Conc16,
});

var slideFogosT1Conc16 = function(){
    var sliderFogosT1Conc16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT1Conc16, {
        start: [minFogosT1Conc16, maxFogosT1Conc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT1Conc16,
            'max': maxFogosT1Conc16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT1Conc16);
    inputNumberMax.setAttribute("value",maxFogosT1Conc16);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT1Conc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT1Conc16.noUiSlider.set([null, this.value]);
    });

    sliderFogosT1Conc16.noUiSlider.on('update',function(e){
        FogosT1Conc16.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T116>=parseFloat(e[0])&& layer.feature.properties.Fog_T116 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT1Conc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderFogosT1Conc16.noUiSlider;
    $(slidersGeral).append(sliderFogosT1Conc16);
}

///////////////////////////-------------  FIM TOTAL FOGOS T1 LICENCIADOS 2016, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T2 LICENCIADOS 2016, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT2Conc16 = 99999;
var maxFogosT2Conc16 = 0;
function estiloFogosT2Conc16(feature, latlng) {
    if(feature.properties.Fog_T216< minFogosT2Conc16 || feature.properties.Fog_T216 ===0){
        minFogosT2Conc16 = feature.properties.Fog_T216
    }
    if(feature.properties.Fog_T216> maxFogosT2Conc16){
        maxFogosT2Conc16 = feature.properties.Fog_T216
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T216,1.8)
    });
}
function apagarFogosT2Conc16(e){
    var layer = e.target;
    FogosT2Conc16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT2Conc16(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T2 licenciados: ' + '<b>' +feature.properties.Fog_T216 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT2Conc16,
    })
};

var FogosT2Conc16= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT2Conc16,
    onEachFeature: onEachFeatureFogosT2Conc16,
});

var slideFogosT2Conc16 = function(){
    var sliderFogosT2Conc16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT2Conc16, {
        start: [minFogosT2Conc16, maxFogosT2Conc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT2Conc16,
            'max': maxFogosT2Conc16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT2Conc16);
    inputNumberMax.setAttribute("value",maxFogosT2Conc16);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT2Conc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT2Conc16.noUiSlider.set([null, this.value]);
    });

    sliderFogosT2Conc16.noUiSlider.on('update',function(e){
        FogosT2Conc16.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T216>=parseFloat(e[0])&& layer.feature.properties.Fog_T216 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT2Conc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderFogosT2Conc16.noUiSlider;
    $(slidersGeral).append(sliderFogosT2Conc16);
}

///////////////////////////-------------  FIM TOTAL FOGOS T2 LICENCIADOS 2016, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T3 LICENCIADOS 2016, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT3Conc16 = 99999;
var maxFogosT3Conc16 = 0;
function estiloFogosT3Conc16(feature, latlng) {
    if(feature.properties.Fog_T316< minFogosT3Conc16 || feature.properties.Fog_T316 ===0){
        minFogosT3Conc16 = feature.properties.Fog_T316
    }
    if(feature.properties.Fog_T316> maxFogosT3Conc16){
        maxFogosT3Conc16 = feature.properties.Fog_T316
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T316,1.8)
    });
}
function apagarFogosT3Conc16(e){
    var layer = e.target;
    FogosT3Conc16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT3Conc16(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T3 licenciados: ' + '<b>' +feature.properties.Fog_T316 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT3Conc16,
    })
};

var FogosT3Conc16= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT3Conc16,
    onEachFeature: onEachFeatureFogosT3Conc16,
});

var slideFogosT3Conc16 = function(){
    var sliderFogosT3Conc16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT3Conc16, {
        start: [minFogosT3Conc16, maxFogosT3Conc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT3Conc16,
            'max': maxFogosT3Conc16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT3Conc16);
    inputNumberMax.setAttribute("value",maxFogosT3Conc16);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT3Conc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT3Conc16.noUiSlider.set([null, this.value]);
    });

    sliderFogosT3Conc16.noUiSlider.on('update',function(e){
        FogosT3Conc16.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T316>=parseFloat(e[0])&& layer.feature.properties.Fog_T316 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT3Conc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderFogosT3Conc16.noUiSlider;
    $(slidersGeral).append(sliderFogosT3Conc16);
}

///////////////////////////-------------  FIM TOTAL FOGOS T3 LICENCIADOS 2016, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T4 LICENCIADOS 2016, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT4Conc16 = 99999;
var maxFogosT4Conc16 = 0;
function estiloFogosT4Conc16(feature, latlng) {
    if(feature.properties.Fog_T416< minFogosT4Conc16 || feature.properties.Fog_T416 ===0){
        minFogosT4Conc16 = feature.properties.Fog_T416
    }
    if(feature.properties.Fog_T416> maxFogosT4Conc16){
        maxFogosT4Conc16 = feature.properties.Fog_T416
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T416,1.8)
    });
}
function apagarFogosT4Conc16(e){
    var layer = e.target;
    FogosT4Conc16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT4Conc16(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T4 ou mais licenciados: ' + '<b>' +feature.properties.Fog_T416 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT4Conc16,
    })
};

var FogosT4Conc16= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT4Conc16,
    onEachFeature: onEachFeatureFogosT4Conc16,
});

var slideFogosT4Conc16 = function(){
    var sliderFogosT4Conc16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT4Conc16, {
        start: [minFogosT4Conc16, maxFogosT4Conc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT4Conc16,
            'max': maxFogosT4Conc16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT4Conc16);
    inputNumberMax.setAttribute("value",maxFogosT4Conc16);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT4Conc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT4Conc16.noUiSlider.set([null, this.value]);
    });

    sliderFogosT4Conc16.noUiSlider.on('update',function(e){
        FogosT4Conc16.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T416>=parseFloat(e[0])&& layer.feature.properties.Fog_T416 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT4Conc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderFogosT4Conc16.noUiSlider;
    $(slidersGeral).append(sliderFogosT4Conc16);
}

///////////////////////////-------------  FIM TOTAL FOGOS T4 LICENCIADOS 2016, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS LICENCIADOS 2017, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalFogosConc17 = 99999;
var maxTotalFogosConc17 = 0;
function estiloTotalFogosConc17(feature, latlng) {
    if(feature.properties.Fog_LTot17< minTotalFogosConc17 || feature.properties.Fog_LTot17 ===0){
        minTotalFogosConc17 = feature.properties.Fog_LTot17
    }
    if(feature.properties.Fog_LTot17> maxTotalFogosConc17){
        maxTotalFogosConc17 = feature.properties.Fog_LTot17
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_LTot17,1.3)
    });
}
function apagarTotalFogosConc17(e){
    var layer = e.target;
    TotalFogosConc17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFogosConc17(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos licenciados: ' + '<b>' +feature.properties.Fog_LTot17 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFogosConc17,
    })
};

var TotalFogosConc17= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalFogosConc17,
    onEachFeature: onEachFeatureTotalFogosConc17,
});

var slideTotalFogosConc17 = function(){
    var sliderTotalFogosConc17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFogosConc17, {
        start: [minTotalFogosConc17, maxTotalFogosConc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFogosConc17,
            'max': maxTotalFogosConc17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFogosConc17);
    inputNumberMax.setAttribute("value",maxTotalFogosConc17);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFogosConc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFogosConc17.noUiSlider.set([null, this.value]);
    });

    sliderTotalFogosConc17.noUiSlider.on('update',function(e){
        TotalFogosConc17.eachLayer(function(layer){
            if(layer.feature.properties.Fog_LTot17>=parseFloat(e[0])&& layer.feature.properties.Fog_LTot17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFogosConc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderTotalFogosConc17.noUiSlider;
    $(slidersGeral).append(sliderTotalFogosConc17);
}

///////////////////////////-------------  FIM TOTAL FOGOS LICENCIADOS 2017, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL FOGOS T1 LICENCIADOS 2017, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT1Conc17 = 99999;
var maxFogosT1Conc17 = 0;
function estiloFogosT1Conc17(feature, latlng) {
    if(feature.properties.Fog_T117< minFogosT1Conc17 || feature.properties.Fog_T117 ===0){
        minFogosT1Conc17 = feature.properties.Fog_T117
    }
    if(feature.properties.Fog_T117> maxFogosT1Conc17){
        maxFogosT1Conc17 = feature.properties.Fog_T117
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T117,1.8)
    });
}
function apagarFogosT1Conc17(e){
    var layer = e.target;
    FogosT1Conc17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT1Conc17(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T0 ou T1 licenciados: ' + '<b>' +feature.properties.Fog_T117 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT1Conc17,
    })
};

var FogosT1Conc17= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT1Conc17,
    onEachFeature: onEachFeatureFogosT1Conc17,
});

var slideFogosT1Conc17 = function(){
    var sliderFogosT1Conc17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT1Conc17, {
        start: [minFogosT1Conc17, maxFogosT1Conc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT1Conc17,
            'max': maxFogosT1Conc17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT1Conc17);
    inputNumberMax.setAttribute("value",maxFogosT1Conc17);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT1Conc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT1Conc17.noUiSlider.set([null, this.value]);
    });

    sliderFogosT1Conc17.noUiSlider.on('update',function(e){
        FogosT1Conc17.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T117>=parseFloat(e[0])&& layer.feature.properties.Fog_T117 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT1Conc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderFogosT1Conc17.noUiSlider;
    $(slidersGeral).append(sliderFogosT1Conc17);
}

///////////////////////////-------------  FIM TOTAL FOGOS T1 LICENCIADOS 2017, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T2 LICENCIADOS 2017, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT2Conc17 = 99999;
var maxFogosT2Conc17 = 0;
function estiloFogosT2Conc17(feature, latlng) {
    if(feature.properties.Fog_T217< minFogosT2Conc17 || feature.properties.Fog_T217 ===0){
        minFogosT2Conc17 = feature.properties.Fog_T217
    }
    if(feature.properties.Fog_T217> maxFogosT2Conc17){
        maxFogosT2Conc17 = feature.properties.Fog_T217
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T217,1.8)
    });
}
function apagarFogosT2Conc17(e){
    var layer = e.target;
    FogosT2Conc17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT2Conc17(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T2 licenciados: ' + '<b>' +feature.properties.Fog_T217 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT2Conc17,
    })
};

var FogosT2Conc17= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT2Conc17,
    onEachFeature: onEachFeatureFogosT2Conc17,
});

var slideFogosT2Conc17 = function(){
    var sliderFogosT2Conc17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT2Conc17, {
        start: [minFogosT2Conc17, maxFogosT2Conc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT2Conc17,
            'max': maxFogosT2Conc17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT2Conc17);
    inputNumberMax.setAttribute("value",maxFogosT2Conc17);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT2Conc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT2Conc17.noUiSlider.set([null, this.value]);
    });

    sliderFogosT2Conc17.noUiSlider.on('update',function(e){
        FogosT2Conc17.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T217>=parseFloat(e[0])&& layer.feature.properties.Fog_T217 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT2Conc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderFogosT2Conc17.noUiSlider;
    $(slidersGeral).append(sliderFogosT2Conc17);
}

///////////////////////////-------------  FIM TOTAL FOGOS T2 LICENCIADOS 2017, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T3 LICENCIADOS 2017, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT3Conc17 = 99999;
var maxFogosT3Conc17 = 0;
function estiloFogosT3Conc17(feature, latlng) {
    if(feature.properties.Fog_T317< minFogosT3Conc17 || feature.properties.Fog_T317 ===0){
        minFogosT3Conc17 = feature.properties.Fog_T317
    }
    if(feature.properties.Fog_T317> maxFogosT3Conc17){
        maxFogosT3Conc17 = feature.properties.Fog_T317
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T317,1.8)
    });
}
function apagarFogosT3Conc17(e){
    var layer = e.target;
    FogosT3Conc17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT3Conc17(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T3 licenciados: ' + '<b>' +feature.properties.Fog_T317 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT3Conc17,
    })
};

var FogosT3Conc17= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT3Conc17,
    onEachFeature: onEachFeatureFogosT3Conc17,
});

var slideFogosT3Conc17 = function(){
    var sliderFogosT3Conc17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT3Conc17, {
        start: [minFogosT3Conc17, maxFogosT3Conc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT3Conc17,
            'max': maxFogosT3Conc17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT3Conc17);
    inputNumberMax.setAttribute("value",maxFogosT3Conc17);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT3Conc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT3Conc17.noUiSlider.set([null, this.value]);
    });

    sliderFogosT3Conc17.noUiSlider.on('update',function(e){
        FogosT3Conc17.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T317>=parseFloat(e[0])&& layer.feature.properties.Fog_T317 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT3Conc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderFogosT3Conc17.noUiSlider;
    $(slidersGeral).append(sliderFogosT3Conc17);
}

///////////////////////////-------------  FIM TOTAL FOGOS T3 LICENCIADOS 2017, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T4 LICENCIADOS 2017, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT4Conc17 = 99999;
var maxFogosT4Conc17 = 0;
function estiloFogosT4Conc17(feature, latlng) {
    if(feature.properties.Fog_T417< minFogosT4Conc17 || feature.properties.Fog_T417 ===0){
        minFogosT4Conc17 = feature.properties.Fog_T417
    }
    if(feature.properties.Fog_T417> maxFogosT4Conc17){
        maxFogosT4Conc17 = feature.properties.Fog_T417
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T417,1.8)
    });
}
function apagarFogosT4Conc17(e){
    var layer = e.target;
    FogosT4Conc17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT4Conc17(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T4 ou mais licenciados: ' + '<b>' +feature.properties.Fog_T417 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT4Conc17,
    })
};

var FogosT4Conc17= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT4Conc17,
    onEachFeature: onEachFeatureFogosT4Conc17,
});

var slideFogosT4Conc17 = function(){
    var sliderFogosT4Conc17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT4Conc17, {
        start: [minFogosT4Conc17, maxFogosT4Conc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT4Conc17,
            'max': maxFogosT4Conc17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT4Conc17);
    inputNumberMax.setAttribute("value",maxFogosT4Conc17);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT4Conc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT4Conc17.noUiSlider.set([null, this.value]);
    });

    sliderFogosT4Conc17.noUiSlider.on('update',function(e){
        FogosT4Conc17.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T417>=parseFloat(e[0])&& layer.feature.properties.Fog_T417 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT4Conc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderFogosT4Conc17.noUiSlider;
    $(slidersGeral).append(sliderFogosT4Conc17);
}

///////////////////////////-------------  FIM TOTAL FOGOS T4 LICENCIADOS 2017, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS LICENCIADOS 2018, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalFogosConc18 = 99999;
var maxTotalFogosConc18 = 0;
function estiloTotalFogosConc18(feature, latlng) {
    if(feature.properties.Fog_LTot18< minTotalFogosConc18 || feature.properties.Fog_LTot18 ===0){
        minTotalFogosConc18 = feature.properties.Fog_LTot18
    }
    if(feature.properties.Fog_LTot18> maxTotalFogosConc18){
        maxTotalFogosConc18 = feature.properties.Fog_LTot18
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_LTot18,1.3)
    });
}
function apagarTotalFogosConc18(e){
    var layer = e.target;
    TotalFogosConc18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFogosConc18(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos licenciados: ' + '<b>' +feature.properties.Fog_LTot18 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFogosConc18,
    })
};

var TotalFogosConc18= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalFogosConc18,
    onEachFeature: onEachFeatureTotalFogosConc18,
});

var slideTotalFogosConc18 = function(){
    var sliderTotalFogosConc18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFogosConc18, {
        start: [minTotalFogosConc18, maxTotalFogosConc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFogosConc18,
            'max': maxTotalFogosConc18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFogosConc18);
    inputNumberMax.setAttribute("value",maxTotalFogosConc18);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFogosConc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFogosConc18.noUiSlider.set([null, this.value]);
    });

    sliderTotalFogosConc18.noUiSlider.on('update',function(e){
        TotalFogosConc18.eachLayer(function(layer){
            if(layer.feature.properties.Fog_LTot18>=parseFloat(e[0])&& layer.feature.properties.Fog_LTot18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFogosConc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderTotalFogosConc18.noUiSlider;
    $(slidersGeral).append(sliderTotalFogosConc18);
}

///////////////////////////-------------  FIM TOTAL FOGOS LICENCIADOS 2018, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL FOGOS T1 LICENCIADOS 2018, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT1Conc18 = 99999;
var maxFogosT1Conc18 = 0;
function estiloFogosT1Conc18(feature, latlng) {
    if(feature.properties.Fog_T118< minFogosT1Conc18 || feature.properties.Fog_T118 ===0){
        minFogosT1Conc18 = feature.properties.Fog_T118
    }
    if(feature.properties.Fog_T118> maxFogosT1Conc18){
        maxFogosT1Conc18 = feature.properties.Fog_T118
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T118,1.8)
    });
}
function apagarFogosT1Conc18(e){
    var layer = e.target;
    FogosT1Conc18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT1Conc18(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T0 ou T1 licenciados: ' + '<b>' +feature.properties.Fog_T118 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT1Conc18,
    })
};

var FogosT1Conc18= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT1Conc18,
    onEachFeature: onEachFeatureFogosT1Conc18,
});

var slideFogosT1Conc18 = function(){
    var sliderFogosT1Conc18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT1Conc18, {
        start: [minFogosT1Conc18, maxFogosT1Conc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT1Conc18,
            'max': maxFogosT1Conc18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT1Conc18);
    inputNumberMax.setAttribute("value",maxFogosT1Conc18);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT1Conc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT1Conc18.noUiSlider.set([null, this.value]);
    });

    sliderFogosT1Conc18.noUiSlider.on('update',function(e){
        FogosT1Conc18.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T118>=parseFloat(e[0])&& layer.feature.properties.Fog_T118 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT1Conc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderFogosT1Conc18.noUiSlider;
    $(slidersGeral).append(sliderFogosT1Conc18);
}

///////////////////////////-------------  FIM TOTAL FOGOS T1 LICENCIADOS 2018, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T2 LICENCIADOS 2018, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT2Conc18 = 99999;
var maxFogosT2Conc18 = 0;
function estiloFogosT2Conc18(feature, latlng) {
    if(feature.properties.Fog_T218< minFogosT2Conc18 || feature.properties.Fog_T218 ===0){
        minFogosT2Conc18 = feature.properties.Fog_T218
    }
    if(feature.properties.Fog_T218> maxFogosT2Conc18){
        maxFogosT2Conc18 = feature.properties.Fog_T218
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T218,1.8)
    });
}
function apagarFogosT2Conc18(e){
    var layer = e.target;
    FogosT2Conc18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT2Conc18(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T2 licenciados: ' + '<b>' +feature.properties.Fog_T218 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT2Conc18,
    })
};

var FogosT2Conc18= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT2Conc18,
    onEachFeature: onEachFeatureFogosT2Conc18,
});

var slideFogosT2Conc18 = function(){
    var sliderFogosT2Conc18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT2Conc18, {
        start: [minFogosT2Conc18, maxFogosT2Conc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT2Conc18,
            'max': maxFogosT2Conc18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT2Conc18);
    inputNumberMax.setAttribute("value",maxFogosT2Conc18);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT2Conc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT2Conc18.noUiSlider.set([null, this.value]);
    });

    sliderFogosT2Conc18.noUiSlider.on('update',function(e){
        FogosT2Conc18.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T218>=parseFloat(e[0])&& layer.feature.properties.Fog_T218 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT2Conc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderFogosT2Conc18.noUiSlider;
    $(slidersGeral).append(sliderFogosT2Conc18);
}

///////////////////////////-------------  FIM TOTAL FOGOS T2 LICENCIADOS 2018, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T3 LICENCIADOS 2018, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT3Conc18 = 99999;
var maxFogosT3Conc18 = 0;
function estiloFogosT3Conc18(feature, latlng) {
    if(feature.properties.Fog_T318< minFogosT3Conc18 || feature.properties.Fog_T318 ===0){
        minFogosT3Conc18 = feature.properties.Fog_T318
    }
    if(feature.properties.Fog_T318> maxFogosT3Conc18){
        maxFogosT3Conc18 = feature.properties.Fog_T318
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T318,1.8)
    });
}
function apagarFogosT3Conc18(e){
    var layer = e.target;
    FogosT3Conc18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT3Conc18(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T3 licenciados: ' + '<b>' +feature.properties.Fog_T318 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT3Conc18,
    })
};

var FogosT3Conc18= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT3Conc18,
    onEachFeature: onEachFeatureFogosT3Conc18,
});

var slideFogosT3Conc18 = function(){
    var sliderFogosT3Conc18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT3Conc18, {
        start: [minFogosT3Conc18, maxFogosT3Conc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT3Conc18,
            'max': maxFogosT3Conc18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT3Conc18);
    inputNumberMax.setAttribute("value",maxFogosT3Conc18);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT3Conc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT3Conc18.noUiSlider.set([null, this.value]);
    });

    sliderFogosT3Conc18.noUiSlider.on('update',function(e){
        FogosT3Conc18.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T318>=parseFloat(e[0])&& layer.feature.properties.Fog_T318 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT3Conc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderFogosT3Conc18.noUiSlider;
    $(slidersGeral).append(sliderFogosT3Conc18);
}

///////////////////////////-------------  FIM TOTAL FOGOS T3 LICENCIADOS 2018, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T4 LICENCIADOS 2018, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT4Conc18 = 99999;
var maxFogosT4Conc18 = 0;
function estiloFogosT4Conc18(feature, latlng) {
    if(feature.properties.Fog_T418< minFogosT4Conc18 || feature.properties.Fog_T418 ===0){
        minFogosT4Conc18 = feature.properties.Fog_T418
    }
    if(feature.properties.Fog_T418> maxFogosT4Conc18){
        maxFogosT4Conc18 = feature.properties.Fog_T418
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T418,1.8)
    });
}
function apagarFogosT4Conc18(e){
    var layer = e.target;
    FogosT4Conc18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT4Conc18(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T4 ou mais licenciados: ' + '<b>' +feature.properties.Fog_T418 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT4Conc18,
    })
};

var FogosT4Conc18= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT4Conc18,
    onEachFeature: onEachFeatureFogosT4Conc18,
});

var slideFogosT4Conc18 = function(){
    var sliderFogosT4Conc18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT4Conc18, {
        start: [minFogosT4Conc18, maxFogosT4Conc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT4Conc18,
            'max': maxFogosT4Conc18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT4Conc18);
    inputNumberMax.setAttribute("value",maxFogosT4Conc18);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT4Conc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT4Conc18.noUiSlider.set([null, this.value]);
    });

    sliderFogosT4Conc18.noUiSlider.on('update',function(e){
        FogosT4Conc18.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T418>=parseFloat(e[0])&& layer.feature.properties.Fog_T418 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT4Conc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderFogosT4Conc18.noUiSlider;
    $(slidersGeral).append(sliderFogosT4Conc18);
}

///////////////////////////-------------  FIM TOTAL FOGOS T4 LICENCIADOS 2018, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS LICENCIADOS 2019, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalFogosConc19 = 99999;
var maxTotalFogosConc19 = 0;
function estiloTotalFogosConc19(feature, latlng) {
    if(feature.properties.Fog_LTot19< minTotalFogosConc19 || feature.properties.Fog_LTot19 ===0){
        minTotalFogosConc19 = feature.properties.Fog_LTot19
    }
    if(feature.properties.Fog_LTot19> maxTotalFogosConc19){
        maxTotalFogosConc19 = feature.properties.Fog_LTot19
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_LTot19,1.3)
    });
}
function apagarTotalFogosConc19(e){
    var layer = e.target;
    TotalFogosConc19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFogosConc19(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos licenciados: ' + '<b>' +feature.properties.Fog_LTot19 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFogosConc19,
    })
};

var TotalFogosConc19= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalFogosConc19,
    onEachFeature: onEachFeatureTotalFogosConc19,
});

var slideTotalFogosConc19 = function(){
    var sliderTotalFogosConc19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFogosConc19, {
        start: [minTotalFogosConc19, maxTotalFogosConc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFogosConc19,
            'max': maxTotalFogosConc19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFogosConc19);
    inputNumberMax.setAttribute("value",maxTotalFogosConc19);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFogosConc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFogosConc19.noUiSlider.set([null, this.value]);
    });

    sliderTotalFogosConc19.noUiSlider.on('update',function(e){
        TotalFogosConc19.eachLayer(function(layer){
            if(layer.feature.properties.Fog_LTot19>=parseFloat(e[0])&& layer.feature.properties.Fog_LTot19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFogosConc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderTotalFogosConc19.noUiSlider;
    $(slidersGeral).append(sliderTotalFogosConc19);
}

///////////////////////////-------------  FIM TOTAL FOGOS LICENCIADOS 2019, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL FOGOS T1 LICENCIADOS 2019, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT1Conc19 = 99999;
var maxFogosT1Conc19 = 0;
function estiloFogosT1Conc19(feature, latlng) {
    if(feature.properties.Fog_T119< minFogosT1Conc19 || feature.properties.Fog_T119 ===0){
        minFogosT1Conc19 = feature.properties.Fog_T119
    }
    if(feature.properties.Fog_T119> maxFogosT1Conc19){
        maxFogosT1Conc19 = feature.properties.Fog_T119
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T119,1.8)
    });
}
function apagarFogosT1Conc19(e){
    var layer = e.target;
    FogosT1Conc19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT1Conc19(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T0 ou T1 licenciados: ' + '<b>' +feature.properties.Fog_T119 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT1Conc19,
    })
};

var FogosT1Conc19= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT1Conc19,
    onEachFeature: onEachFeatureFogosT1Conc19,
});

var slideFogosT1Conc19 = function(){
    var sliderFogosT1Conc19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT1Conc19, {
        start: [minFogosT1Conc19, maxFogosT1Conc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT1Conc19,
            'max': maxFogosT1Conc19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT1Conc19);
    inputNumberMax.setAttribute("value",maxFogosT1Conc19);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT1Conc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT1Conc19.noUiSlider.set([null, this.value]);
    });

    sliderFogosT1Conc19.noUiSlider.on('update',function(e){
        FogosT1Conc19.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T119>=parseFloat(e[0])&& layer.feature.properties.Fog_T119 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT1Conc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderFogosT1Conc19.noUiSlider;
    $(slidersGeral).append(sliderFogosT1Conc19);
}

///////////////////////////-------------  FIM TOTAL FOGOS T1 LICENCIADOS 2019, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T2 LICENCIADOS 2019, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT2Conc19 = 99999;
var maxFogosT2Conc19 = 0;
function estiloFogosT2Conc19(feature, latlng) {
    if(feature.properties.Fog_T219< minFogosT2Conc19 || feature.properties.Fog_T219 ===0){
        minFogosT2Conc19 = feature.properties.Fog_T219
    }
    if(feature.properties.Fog_T219> maxFogosT2Conc19){
        maxFogosT2Conc19 = feature.properties.Fog_T219
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T219,1.8)
    });
}
function apagarFogosT2Conc19(e){
    var layer = e.target;
    FogosT2Conc19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT2Conc19(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T2 licenciados: ' + '<b>' +feature.properties.Fog_T219 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT2Conc19,
    })
};

var FogosT2Conc19= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT2Conc19,
    onEachFeature: onEachFeatureFogosT2Conc19,
});

var slideFogosT2Conc19 = function(){
    var sliderFogosT2Conc19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT2Conc19, {
        start: [minFogosT2Conc19, maxFogosT2Conc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT2Conc19,
            'max': maxFogosT2Conc19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT2Conc19);
    inputNumberMax.setAttribute("value",maxFogosT2Conc19);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT2Conc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT2Conc19.noUiSlider.set([null, this.value]);
    });

    sliderFogosT2Conc19.noUiSlider.on('update',function(e){
        FogosT2Conc19.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T219>=parseFloat(e[0])&& layer.feature.properties.Fog_T219 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT2Conc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderFogosT2Conc19.noUiSlider;
    $(slidersGeral).append(sliderFogosT2Conc19);
}

///////////////////////////-------------  FIM TOTAL FOGOS T2 LICENCIADOS 2019, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T3 LICENCIADOS 2019, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT3Conc19 = 99999;
var maxFogosT3Conc19 = 0;
function estiloFogosT3Conc19(feature, latlng) {
    if(feature.properties.Fog_T319< minFogosT3Conc19 || feature.properties.Fog_T319 ===0){
        minFogosT3Conc19 = feature.properties.Fog_T319
    }
    if(feature.properties.Fog_T319> maxFogosT3Conc19){
        maxFogosT3Conc19 = feature.properties.Fog_T319
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T319,1.8)
    });
}
function apagarFogosT3Conc19(e){
    var layer = e.target;
    FogosT3Conc19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT3Conc19(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T3 licenciados: ' + '<b>' +feature.properties.Fog_T319 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT3Conc19,
    })
};

var FogosT3Conc19= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT3Conc19,
    onEachFeature: onEachFeatureFogosT3Conc19,
});

var slideFogosT3Conc19 = function(){
    var sliderFogosT3Conc19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT3Conc19, {
        start: [minFogosT3Conc19, maxFogosT3Conc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT3Conc19,
            'max': maxFogosT3Conc19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT3Conc19);
    inputNumberMax.setAttribute("value",maxFogosT3Conc19);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT3Conc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT3Conc19.noUiSlider.set([null, this.value]);
    });

    sliderFogosT3Conc19.noUiSlider.on('update',function(e){
        FogosT3Conc19.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T319>=parseFloat(e[0])&& layer.feature.properties.Fog_T319 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT3Conc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderFogosT3Conc19.noUiSlider;
    $(slidersGeral).append(sliderFogosT3Conc19);
}

///////////////////////////-------------  FIM TOTAL FOGOS T3 LICENCIADOS 2019, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T4 LICENCIADOS 2019, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT4Conc19 = 99999;
var maxFogosT4Conc19 = 0;
function estiloFogosT4Conc19(feature, latlng) {
    if(feature.properties.Fog_T419< minFogosT4Conc19 || feature.properties.Fog_T419 ===0){
        minFogosT4Conc19 = feature.properties.Fog_T419
    }
    if(feature.properties.Fog_T419> maxFogosT4Conc19){
        maxFogosT4Conc19 = feature.properties.Fog_T419
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T419,1.8)
    });
}
function apagarFogosT4Conc19(e){
    var layer = e.target;
    FogosT4Conc19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT4Conc19(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T4 ou mais licenciados: ' + '<b>' +feature.properties.Fog_T419 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT4Conc19,
    })
};

var FogosT4Conc19= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT4Conc19,
    onEachFeature: onEachFeatureFogosT4Conc19,
});

var slideFogosT4Conc19 = function(){
    var sliderFogosT4Conc19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT4Conc19, {
        start: [minFogosT4Conc19, maxFogosT4Conc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT4Conc19,
            'max': maxFogosT4Conc19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT4Conc19);
    inputNumberMax.setAttribute("value",maxFogosT4Conc19);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT4Conc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT4Conc19.noUiSlider.set([null, this.value]);
    });

    sliderFogosT4Conc19.noUiSlider.on('update',function(e){
        FogosT4Conc19.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T419>=parseFloat(e[0])&& layer.feature.properties.Fog_T419 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT4Conc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderFogosT4Conc19.noUiSlider;
    $(slidersGeral).append(sliderFogosT4Conc19);
}

///////////////////////////-------------  FIM TOTAL FOGOS T4 LICENCIADOS 2019, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS LICENCIADOS 2020, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalFogosConc20 = 99999;
var maxTotalFogosConc20 = 0;
function estiloTotalFogosConc20(feature, latlng) {
    if(feature.properties.Fog_LTot20< minTotalFogosConc20 || feature.properties.Fog_LTot20 ===0){
        minTotalFogosConc20 = feature.properties.Fog_LTot20
    }
    if(feature.properties.Fog_LTot20> maxTotalFogosConc20){
        maxTotalFogosConc20 = feature.properties.Fog_LTot20
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_LTot20,1.3)
    });
}
function apagarTotalFogosConc20(e){
    var layer = e.target;
    TotalFogosConc20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFogosConc20(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos licenciados: ' + '<b>' +feature.properties.Fog_LTot20 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFogosConc20,
    })
};

var TotalFogosConc20= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalFogosConc20,
    onEachFeature: onEachFeatureTotalFogosConc20,
});

var slideTotalFogosConc20 = function(){
    var sliderTotalFogosConc20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFogosConc20, {
        start: [minTotalFogosConc20, maxTotalFogosConc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFogosConc20,
            'max': maxTotalFogosConc20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFogosConc20);
    inputNumberMax.setAttribute("value",maxTotalFogosConc20);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFogosConc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFogosConc20.noUiSlider.set([null, this.value]);
    });

    sliderTotalFogosConc20.noUiSlider.on('update',function(e){
        TotalFogosConc20.eachLayer(function(layer){
            if(layer.feature.properties.Fog_LTot20>=parseFloat(e[0])&& layer.feature.properties.Fog_LTot20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFogosConc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderTotalFogosConc20.noUiSlider;
    $(slidersGeral).append(sliderTotalFogosConc20);
}

///////////////////////////-------------  FIM TOTAL FOGOS LICENCIADOS 2020, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL FOGOS T1 LICENCIADOS 2020, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT1Conc20 = 99999;
var maxFogosT1Conc20 = 0;
function estiloFogosT1Conc20(feature, latlng) {
    if(feature.properties.Fog_T120< minFogosT1Conc20 || feature.properties.Fog_T120 ===0){
        minFogosT1Conc20 = feature.properties.Fog_T120
    }
    if(feature.properties.Fog_T120> maxFogosT1Conc20){
        maxFogosT1Conc20 = feature.properties.Fog_T120
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T120,1.8)
    });
}
function apagarFogosT1Conc20(e){
    var layer = e.target;
    FogosT1Conc20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT1Conc20(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T0 ou T1 licenciados: ' + '<b>' +feature.properties.Fog_T120 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT1Conc20,
    })
};

var FogosT1Conc20= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT1Conc20,
    onEachFeature: onEachFeatureFogosT1Conc20,
});

var slideFogosT1Conc20 = function(){
    var sliderFogosT1Conc20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT1Conc20, {
        start: [minFogosT1Conc20, maxFogosT1Conc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT1Conc20,
            'max': maxFogosT1Conc20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT1Conc20);
    inputNumberMax.setAttribute("value",maxFogosT1Conc20);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT1Conc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT1Conc20.noUiSlider.set([null, this.value]);
    });

    sliderFogosT1Conc20.noUiSlider.on('update',function(e){
        FogosT1Conc20.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T120>=parseFloat(e[0])&& layer.feature.properties.Fog_T120 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT1Conc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderFogosT1Conc20.noUiSlider;
    $(slidersGeral).append(sliderFogosT1Conc20);
}

///////////////////////////-------------  FIM TOTAL FOGOS T1 LICENCIADOS 2020, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T2 LICENCIADOS 2020, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT2Conc20 = 99999;
var maxFogosT2Conc20 = 0;
function estiloFogosT2Conc20(feature, latlng) {
    if(feature.properties.Fog_T220< minFogosT2Conc20 || feature.properties.Fog_T220 ===0){
        minFogosT2Conc20 = feature.properties.Fog_T220
    }
    if(feature.properties.Fog_T220> maxFogosT2Conc20){
        maxFogosT2Conc20 = feature.properties.Fog_T220
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T220,1.8)
    });
}
function apagarFogosT2Conc20(e){
    var layer = e.target;
    FogosT2Conc20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT2Conc20(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T2 licenciados: ' + '<b>' +feature.properties.Fog_T220 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT2Conc20,
    })
};

var FogosT2Conc20= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT2Conc20,
    onEachFeature: onEachFeatureFogosT2Conc20,
});

var slideFogosT2Conc20 = function(){
    var sliderFogosT2Conc20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT2Conc20, {
        start: [minFogosT2Conc20, maxFogosT2Conc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT2Conc20,
            'max': maxFogosT2Conc20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT2Conc20);
    inputNumberMax.setAttribute("value",maxFogosT2Conc20);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT2Conc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT2Conc20.noUiSlider.set([null, this.value]);
    });

    sliderFogosT2Conc20.noUiSlider.on('update',function(e){
        FogosT2Conc20.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T220>=parseFloat(e[0])&& layer.feature.properties.Fog_T220 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT2Conc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderFogosT2Conc20.noUiSlider;
    $(slidersGeral).append(sliderFogosT2Conc20);
}

///////////////////////////-------------  FIM TOTAL FOGOS T2 LICENCIADOS 2020, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T3 LICENCIADOS 2020, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT3Conc20 = 99999;
var maxFogosT3Conc20 = 0;
function estiloFogosT3Conc20(feature, latlng) {
    if(feature.properties.Fog_T320< minFogosT3Conc20 || feature.properties.Fog_T320 ===0){
        minFogosT3Conc20 = feature.properties.Fog_T320
    }
    if(feature.properties.Fog_T320> maxFogosT3Conc20){
        maxFogosT3Conc20 = feature.properties.Fog_T320
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T320,1.8)
    });
}
function apagarFogosT3Conc20(e){
    var layer = e.target;
    FogosT3Conc20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT3Conc20(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T3 licenciados: ' + '<b>' +feature.properties.Fog_T320 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT3Conc20,
    })
};

var FogosT3Conc20= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT3Conc20,
    onEachFeature: onEachFeatureFogosT3Conc20,
});

var slideFogosT3Conc20 = function(){
    var sliderFogosT3Conc20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT3Conc20, {
        start: [minFogosT3Conc20, maxFogosT3Conc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT3Conc20,
            'max': maxFogosT3Conc20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT3Conc20);
    inputNumberMax.setAttribute("value",maxFogosT3Conc20);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT3Conc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT3Conc20.noUiSlider.set([null, this.value]);
    });

    sliderFogosT3Conc20.noUiSlider.on('update',function(e){
        FogosT3Conc20.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T320>=parseFloat(e[0])&& layer.feature.properties.Fog_T320 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT3Conc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderFogosT3Conc20.noUiSlider;
    $(slidersGeral).append(sliderFogosT3Conc20);
}

///////////////////////////-------------  FIM TOTAL FOGOS T3 LICENCIADOS 2020, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL FOGOS T4 LICENCIADOS 2020, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minFogosT4Conc20 = 99999;
var maxFogosT4Conc20 = 0;
function estiloFogosT4Conc20(feature, latlng) {
    if(feature.properties.Fog_T420< minFogosT4Conc20 || feature.properties.Fog_T420 ===0){
        minFogosT4Conc20 = feature.properties.Fog_T420
    }
    if(feature.properties.Fog_T420> maxFogosT4Conc20){
        maxFogosT4Conc20 = feature.properties.Fog_T420
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T420,1.8)
    });
}
function apagarFogosT4Conc20(e){
    var layer = e.target;
    FogosT4Conc20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT4Conc20(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Fogos T4 ou mais licenciados: ' + '<b>' +feature.properties.Fog_T420 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT4Conc20,
    })
};

var FogosT4Conc20= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloFogosT4Conc20,
    onEachFeature: onEachFeatureFogosT4Conc20,
});

var slideFogosT4Conc20 = function(){
    var sliderFogosT4Conc20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT4Conc20, {
        start: [minFogosT4Conc20, maxFogosT4Conc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT4Conc20,
            'max': maxFogosT4Conc20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT4Conc20);
    inputNumberMax.setAttribute("value",maxFogosT4Conc20);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT4Conc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT4Conc20.noUiSlider.set([null, this.value]);
    });

    sliderFogosT4Conc20.noUiSlider.on('update',function(e){
        FogosT4Conc20.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T420>=parseFloat(e[0])&& layer.feature.properties.Fog_T420 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT4Conc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderFogosT4Conc20.noUiSlider;
    $(slidersGeral).append(sliderFogosT4Conc20);
}

/////////////////////////-------------  FIM TOTAL FOGOS T4 LICENCIADOS 2020, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\
/////////////////////////////////////////--------------------- FIM DADOS ABSOLUTOS CONCELHOS

/////////////////////////////////-------------------------- DADOS RELATIVOS CONCELHOS 

/////////////////////////------- Percentagem T1 CONCELHO em 2014-----////

var minPerT1Conc14 = 100;
var maxPerT1Conc14 = 0;

function CorPerPerT1Conc(d) {
    return d == null ? '#808080' :
        d >= 55.66 ? '#8c0303' :
        d >= 46.38  ? '#de1f35' :
        d >= 30.92  ? '#ff5e6e' :
        d >= 15.46   ? '#f5b3be' :
        d >= 0   ? '#F2C572' :
                ''  ;
}
var legendaPerT1Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 55.66' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 46.38 a 55.66' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 30.92 a 46.38' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 15.46 a 30.92' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0 a 15.46' + '<br>'

    $(legendaA).append(symbolsContainer); 
}


function EstiloPerT1Conc14(feature) {
    if(feature.properties.PerT1_14 <= minPerT1Conc14){
        minPerT1Conc14 = feature.properties.PerT1_14
    }
    if(feature.properties.PerT1_14 >= maxPerT1Conc14 ){
        maxPerT1Conc14 = feature.properties.PerT1_14
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT1Conc(feature.properties.PerT1_14)
    };
}
function apagarPerT1Conc14(e) {
    PerT1Conc14.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT1Conc14(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' + feature.properties.PerT1_14  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT1Conc14,
    });
}
var PerT1Conc14= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT1Conc14,
    onEachFeature: onEachFeaturePerT1Conc14
});
let slidePerT1Conc14 = function(){
    var sliderPerT1Conc14 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT1Conc14, {
        start: [minPerT1Conc14, maxPerT1Conc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT1Conc14,
            'max': maxPerT1Conc14
        },
        });
    inputNumberMin.setAttribute("value",minPerT1Conc14);
    inputNumberMax.setAttribute("value",maxPerT1Conc14);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT1Conc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT1Conc14.noUiSlider.set([null, this.value]);
    });

    sliderPerT1Conc14.noUiSlider.on('update',function(e){
        PerT1Conc14.eachLayer(function(layer){
            if(layer.feature.properties.PerT1_14.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT1_14.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT1Conc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderPerT1Conc14.noUiSlider;
    $(slidersGeral).append(sliderPerT1Conc14);
} 

/////////////////////////////// Fim da T1 CONCELHO em 2014 -------------- \\\\\\

///////////////////////////------- Percentagem T2 CONCELHO em 2014-----////

var minPerT2Conc14 = 100;
var maxPerT2Conc14 = 0;

function CorPerPerT2Conc(d) {
    return d == null ? '#808080' :
        d >= 46.8 ? '#8c0303' :
        d >= 39  ? '#de1f35' :
        d >= 26  ? '#ff5e6e' :
        d >= 13   ? '#f5b3be' :
        d >= 0   ? '#F2C572' :
                ''  ;
}
var legendaPerT2Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 46.8' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 39 a 46.8' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 26 a 39' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 13 a 26' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0 a 13' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerT2Conc14(feature) {
    if(feature.properties.PerT2_14 <= minPerT2Conc14){
        minPerT2Conc14 = feature.properties.PerT2_14
    }
    if(feature.properties.PerT2_14 >= maxPerT2Conc14 ){
        maxPerT2Conc14 = feature.properties.PerT2_14
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT2Conc(feature.properties.PerT2_14)
    };
}
function apagarPerT2Conc14(e) {
    PerT2Conc14.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT2Conc14(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T2 licenciados: ' + '<b>' + feature.properties.PerT2_14  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT2Conc14,
    });
}
var PerT2Conc14= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT2Conc14,
    onEachFeature: onEachFeaturePerT2Conc14
});
let slidePerT2Conc14 = function(){
    var sliderPerT2Conc14 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT2Conc14, {
        start: [minPerT2Conc14, maxPerT2Conc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT2Conc14,
            'max': maxPerT2Conc14
        },
        });
    inputNumberMin.setAttribute("value",minPerT2Conc14);
    inputNumberMax.setAttribute("value",maxPerT2Conc14);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT2Conc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT2Conc14.noUiSlider.set([null, this.value]);
    });

    sliderPerT2Conc14.noUiSlider.on('update',function(e){
        PerT2Conc14.eachLayer(function(layer){
            if(layer.feature.properties.PerT2_14.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT2_14.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT2Conc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderPerT2Conc14.noUiSlider;
    $(slidersGeral).append(sliderPerT2Conc14);
} 

/////////////////////////////// Fim da T2 CONCELHO em 2014 -------------- \\\\\\

///////////////////////////------- Percentagem T3 CONCELHO em 2014-----////

var minPerT3Conc14 = 100;
var maxPerT3Conc14 = 0;

function CorPerT3Conc(d) {
    return d == null ? '#808080' :
        d >= 91.12 ? '#8c0303' :
        d >= 77.8  ? '#de1f35' :
        d >= 55.59  ? '#ff5e6e' :
        d >= 33.39   ? '#f5b3be' :
        d >= 11.18   ? '#F2C572' :
                ''  ;
}
var legendaPerT3Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 91.12' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 77.8 a 91.12' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 55.59 a 77.8' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 33.39 a 55.59' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 11.18 a 33.39' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerT3Conc14(feature) {
    if(feature.properties.PerT3_14 <= minPerT3Conc14){
        minPerT3Conc14 = feature.properties.PerT3_14
    }
    if(feature.properties.PerT3_14 >= maxPerT3Conc14 ){
        maxPerT3Conc14 = feature.properties.PerT3_14
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerT3Conc(feature.properties.PerT3_14)
    };
}
function apagarPerT3Conc14(e) {
    PerT3Conc14.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT3Conc14(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T3 licenciados: ' + '<b>' + feature.properties.PerT3_14  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT3Conc14,
    });
}
var PerT3Conc14= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT3Conc14,
    onEachFeature: onEachFeaturePerT3Conc14
});
let slidePerT3Conc14 = function(){
    var sliderPerT3Conc14 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT3Conc14, {
        start: [minPerT3Conc14, maxPerT3Conc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT3Conc14,
            'max': maxPerT3Conc14
        },
        });
    inputNumberMin.setAttribute("value",minPerT3Conc14);
    inputNumberMax.setAttribute("value",maxPerT3Conc14);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT3Conc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT3Conc14.noUiSlider.set([null, this.value]);
    });

    sliderPerT3Conc14.noUiSlider.on('update',function(e){
        PerT3Conc14.eachLayer(function(layer){
            if(layer.feature.properties.PerT3_14.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT3_14.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT3Conc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderPerT3Conc14.noUiSlider;
    $(slidersGeral).append(sliderPerT3Conc14);
} 

/////////////////////////////// Fim de T3 CONCELHO em 2014 -------------- \\\\\\

///////////////////////////------- Percentagem T4 CONCELHO em 2014-----////

var minPerT4Conc14 = 100;
var maxPerT4Conc14 = 0;

function CorPerPerT4Conc(d) {
    return d == null ? '#808080' :
        d >= 48.47 ? '#8c0303' :
        d >= 40.39  ? '#de1f35' :
        d >= 26.93  ? '#ff5e6e' :
        d >= 13.46   ? '#f5b3be' :
        d >= 0   ? '#F2C572' :
                ''  ;
}
var legendaPerT4Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 48.47' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 40.39 a 48.47' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 26.93 a 40.39' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 13.46 a 26.93' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0 a 13.46' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerT4Conc14(feature) {
    if(feature.properties.PerT4_14 <= minPerT4Conc14){
        minPerT4Conc14 = feature.properties.PerT4_14
    }
    if(feature.properties.PerT4_14 >= maxPerT4Conc14 ){
        maxPerT4Conc14 = feature.properties.PerT4_14
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT4Conc(feature.properties.PerT4_14)
    };
}
function apagarPerT4Conc14(e) {
    PerT4Conc14.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT4Conc14(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' + feature.properties.PerT4_14  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT4Conc14,
    });
}
var PerT4Conc14= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT4Conc14,
    onEachFeature: onEachFeaturePerT4Conc14
});
let slidePerT4Conc14 = function(){
    var sliderPerT4Conc14 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 39){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT4Conc14, {
        start: [minPerT4Conc14, maxPerT4Conc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT4Conc14,
            'max': maxPerT4Conc14
        },
        });
    inputNumberMin.setAttribute("value",minPerT4Conc14);
    inputNumberMax.setAttribute("value",maxPerT4Conc14);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT4Conc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT4Conc14.noUiSlider.set([null, this.value]);
    });

    sliderPerT4Conc14.noUiSlider.on('update',function(e){
        PerT4Conc14.eachLayer(function(layer){
            if(layer.feature.properties.PerT4_14.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT4_14.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT4Conc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 39;
    sliderAtivo = sliderPerT4Conc14.noUiSlider;
    $(slidersGeral).append(sliderPerT4Conc14);
} 

/////////////////////////////// Fim de T4 CONCELHO em 2014 -------------- \\\\\\

//////////////////////////------- Percentagem T1 CONCELHO em 2015-----////

var minPerT1Conc15 = 100;
var maxPerT1Conc15 = 0;

function EstiloPerT1Conc15(feature) {
    if(feature.properties.PerT1_15 <= minPerT1Conc15){
        minPerT1Conc15 = feature.properties.PerT1_15
    }
    if(feature.properties.PerT1_15 >= maxPerT1Conc15 ){
        maxPerT1Conc15 = feature.properties.PerT1_15
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT1Conc(feature.properties.PerT1_15)
    };
}
function apagarPerT1Conc15(e) {
    PerT1Conc15.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT1Conc15(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' + feature.properties.PerT1_15  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT1Conc15,
    });
}
var PerT1Conc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT1Conc15,
    onEachFeature: onEachFeaturePerT1Conc15
});
let slidePerT1Conc15 = function(){
    var sliderPerT1Conc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT1Conc15, {
        start: [minPerT1Conc15, maxPerT1Conc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT1Conc15,
            'max': maxPerT1Conc15
        },
        });
    inputNumberMin.setAttribute("value",minPerT1Conc15);
    inputNumberMax.setAttribute("value",maxPerT1Conc15);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT1Conc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT1Conc15.noUiSlider.set([null, this.value]);
    });

    sliderPerT1Conc15.noUiSlider.on('update',function(e){
        PerT1Conc15.eachLayer(function(layer){
            if(layer.feature.properties.PerT1_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT1_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT1Conc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderPerT1Conc15.noUiSlider;
    $(slidersGeral).append(sliderPerT1Conc15);
} 

/////////////////////////////// Fim da T1 CONCELHO em 2015 -------------- \\\\\\

///////////////////////////------- Percentagem T2 CONCELHO em 2015-----////

var minPerT2Conc15 = 100;
var maxPerT2Conc15 = 0;

function EstiloPerT2Conc15(feature) {
    if(feature.properties.PerT2_15 <= minPerT2Conc15){
        minPerT2Conc15 = feature.properties.PerT2_15
    }
    if(feature.properties.PerT2_15 >= maxPerT2Conc15 ){
        maxPerT2Conc15 = feature.properties.PerT2_15
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT2Conc(feature.properties.PerT2_15)
    };
}
function apagarPerT2Conc15(e) {
    PerT2Conc15.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT2Conc15(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T2 licenciados: ' + '<b>' + feature.properties.PerT2_15  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT2Conc15,
    });
}
var PerT2Conc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT2Conc15,
    onEachFeature: onEachFeaturePerT2Conc15
});
let slidePerT2Conc15 = function(){
    var sliderPerT2Conc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT2Conc15, {
        start: [minPerT2Conc15, maxPerT2Conc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT2Conc15,
            'max': maxPerT2Conc15
        },
        });
    inputNumberMin.setAttribute("value",minPerT2Conc15);
    inputNumberMax.setAttribute("value",maxPerT2Conc15);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT2Conc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT2Conc15.noUiSlider.set([null, this.value]);
    });

    sliderPerT2Conc15.noUiSlider.on('update',function(e){
        PerT2Conc15.eachLayer(function(layer){
            if(layer.feature.properties.PerT2_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT2_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT2Conc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderPerT2Conc15.noUiSlider;
    $(slidersGeral).append(sliderPerT2Conc15);
} 

/////////////////////////////// Fim da T2 CONCELHO em 2015 -------------- \\\\\\

///////////////////////////------- Percentagem T3 CONCELHO em 2015-----////

var minPerT3Conc15 = 100;
var maxPerT3Conc15 = 0;

function EstiloPerT3Conc15(feature) {
    if(feature.properties.PerT3_15 <= minPerT3Conc15){
        minPerT3Conc15 = feature.properties.PerT3_15
    }
    if(feature.properties.PerT3_15 >= maxPerT3Conc15 ){
        maxPerT3Conc15 = feature.properties.PerT3_15
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerT3Conc(feature.properties.PerT3_15)
    };
}
function apagarPerT3Conc15(e) {
    PerT3Conc15.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT3Conc15(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T3 licenciados: ' + '<b>' + feature.properties.PerT3_15  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT3Conc15,
    });
}
var PerT3Conc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT3Conc15,
    onEachFeature: onEachFeaturePerT3Conc15
});
let slidePerT3Conc15 = function(){
    var sliderPerT3Conc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 42){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT3Conc15, {
        start: [minPerT3Conc15, maxPerT3Conc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT3Conc15,
            'max': maxPerT3Conc15
        },
        });
    inputNumberMin.setAttribute("value",minPerT3Conc15);
    inputNumberMax.setAttribute("value",maxPerT3Conc15);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT3Conc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT3Conc15.noUiSlider.set([null, this.value]);
    });

    sliderPerT3Conc15.noUiSlider.on('update',function(e){
        PerT3Conc15.eachLayer(function(layer){
            if(layer.feature.properties.PerT3_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT3_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT3Conc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 42;
    sliderAtivo = sliderPerT3Conc15.noUiSlider;
    $(slidersGeral).append(sliderPerT3Conc15);
} 

/////////////////////////////// Fim de T3 CONCELHO em 2015 -------------- \\\\\\

///////////////////////////------- Percentagem T4 CONCELHO em 2015-----////

var minPerT4Conc15 = 100;
var maxPerT4Conc15 = 0;

function EstiloPerT4Conc15(feature) {
    if(feature.properties.PerT4_15 <= minPerT4Conc15){
        minPerT4Conc15 = feature.properties.PerT4_15
    }
    if(feature.properties.PerT4_15 >= maxPerT4Conc15 ){
        maxPerT4Conc15 = feature.properties.PerT4_15
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT4Conc(feature.properties.PerT4_15)
    };
}
function apagarPerT4Conc15(e) {
    PerT4Conc15.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT4Conc15(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' + feature.properties.PerT4_15  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT4Conc15,
    });
}
var PerT4Conc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT4Conc15,
    onEachFeature: onEachFeaturePerT4Conc15
});
let slidePerT4Conc15 = function(){
    var sliderPerT4Conc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 43){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT4Conc15, {
        start: [minPerT4Conc15, maxPerT4Conc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT4Conc15,
            'max': maxPerT4Conc15
        },
        });
    inputNumberMin.setAttribute("value",minPerT4Conc15);
    inputNumberMax.setAttribute("value",maxPerT4Conc15);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT4Conc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT4Conc15.noUiSlider.set([null, this.value]);
    });

    sliderPerT4Conc15.noUiSlider.on('update',function(e){
        PerT4Conc15.eachLayer(function(layer){
            if(layer.feature.properties.PerT4_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT4_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT4Conc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 43;
    sliderAtivo = sliderPerT4Conc15.noUiSlider;
    $(slidersGeral).append(sliderPerT4Conc15);
} 

/////////////////////////////// Fim de T4 CONCELHO em 2015 -------------- \\\\\\


//////////////////////////------- Percentagem T1 CONCELHO em 2016-----////

var minPerT1Conc16 = 100;
var maxPerT1Conc16 = 0;

function EstiloPerT1Conc16(feature) {
    if(feature.properties.PerT1_16 <= minPerT1Conc16 ){
        minPerT1Conc16 = feature.properties.PerT1_16
    }
    if(feature.properties.PerT1_16 >= maxPerT1Conc16 ){
        maxPerT1Conc16 = feature.properties.PerT1_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT1Conc(feature.properties.PerT1_16)
    };
}
function apagarPerT1Conc16(e) {
    PerT1Conc16.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT1Conc16(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' + feature.properties.PerT1_16  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT1Conc16,
    });
}
var PerT1Conc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT1Conc16,
    onEachFeature: onEachFeaturePerT1Conc16
});
let slidePerT1Conc16 = function(){
    var sliderPerT1Conc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 44){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT1Conc16, {
        start: [minPerT1Conc16, maxPerT1Conc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT1Conc16,
            'max': maxPerT1Conc16
        },
        });
    inputNumberMin.setAttribute("value",minPerT1Conc16);
    inputNumberMax.setAttribute("value",maxPerT1Conc16);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT1Conc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT1Conc16.noUiSlider.set([null, this.value]);
    });

    sliderPerT1Conc16.noUiSlider.on('update',function(e){
        PerT1Conc16.eachLayer(function(layer){
            if(layer.feature.properties.PerT1_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT1_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT1Conc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 44;
    sliderAtivo = sliderPerT1Conc16.noUiSlider;
    $(slidersGeral).append(sliderPerT1Conc16);
} 

/////////////////////////////// Fim da T1 CONCELHO em 2016 -------------- \\\\\\

///////////////////////////------- Percentagem T2 CONCELHO em 2016-----////

var minPerT2Conc16 = 100;
var maxPerT2Conc16 = 0;

function EstiloPerT2Conc16(feature) {
    if(feature.properties.PerT2_16 <= minPerT2Conc16){
        minPerT2Conc16 = feature.properties.PerT2_16
    }
    if(feature.properties.PerT2_16 >= maxPerT2Conc16 ){
        maxPerT2Conc16 = feature.properties.PerT2_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT2Conc(feature.properties.PerT2_16)
    };
}
function apagarPerT2Conc16(e) {
    PerT2Conc16.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT2Conc16(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T2 licenciados: ' + '<b>' + feature.properties.PerT2_16  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT2Conc16,
    });
}
var PerT2Conc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT2Conc16,
    onEachFeature: onEachFeaturePerT2Conc16
});
let slidePerT2Conc16 = function(){
    var sliderPerT2Conc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT2Conc16, {
        start: [minPerT2Conc16, maxPerT2Conc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT2Conc16,
            'max': maxPerT2Conc16
        },
        });
    inputNumberMin.setAttribute("value",minPerT2Conc16);
    inputNumberMax.setAttribute("value",maxPerT2Conc16);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT2Conc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT2Conc16.noUiSlider.set([null, this.value]);
    });

    sliderPerT2Conc16.noUiSlider.on('update',function(e){
        PerT2Conc16.eachLayer(function(layer){
            if(layer.feature.properties.PerT2_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT2_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT2Conc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderPerT2Conc16.noUiSlider;
    $(slidersGeral).append(sliderPerT2Conc16);
} 

/////////////////////////////// Fim da T2 CONCELHO em 2016 -------------- \\\\\\

///////////////////////////------- Percentagem T3 CONCELHO em 2016-----////

var minPerT3Conc16 = 100;
var maxPerT3Conc16 = 0;

function EstiloPerT3Conc16(feature) {
    if(feature.properties.PerT3_16 <= minPerT3Conc16){
        minPerT3Conc16 = feature.properties.PerT3_16
    }
    if(feature.properties.PerT3_16 >= maxPerT3Conc16 ){
        maxPerT3Conc16 = feature.properties.PerT3_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerT3Conc(feature.properties.PerT3_16)
    };
}
function apagarPerT3Conc16(e) {
    PerT3Conc16.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT3Conc16(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T3 licenciados: ' + '<b>' + feature.properties.PerT3_16  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT3Conc16,
    });
}
var PerT3Conc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT3Conc16,
    onEachFeature: onEachFeaturePerT3Conc16
});
let slidePerT3Conc16 = function(){
    var sliderPerT3Conc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 46){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT3Conc16, {
        start: [minPerT3Conc16, maxPerT3Conc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT3Conc16,
            'max': maxPerT3Conc16
        },
        });
    inputNumberMin.setAttribute("value",minPerT3Conc16);
    inputNumberMax.setAttribute("value",maxPerT3Conc16);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT3Conc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT3Conc16.noUiSlider.set([null, this.value]);
    });

    sliderPerT3Conc16.noUiSlider.on('update',function(e){
        PerT3Conc16.eachLayer(function(layer){
            if(layer.feature.properties.PerT3_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT3_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT3Conc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 46;
    sliderAtivo = sliderPerT3Conc16.noUiSlider;
    $(slidersGeral).append(sliderPerT3Conc16);
} 

/////////////////////////////// Fim de T3 CONCELHO em 2016 -------------- \\\\\\

///////////////////////////------- Percentagem T4 CONCELHO em 2016-----////

var minPerT4Conc16 = 100;
var maxPerT4Conc16 = 0;

function EstiloPerT4Conc16(feature) {
    if(feature.properties.PerT4_16 <= minPerT4Conc16){
        minPerT4Conc16 = feature.properties.PerT4_16
    }
    if(feature.properties.PerT4_16 >= maxPerT4Conc16 ){
        maxPerT4Conc16 = feature.properties.PerT4_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT4Conc(feature.properties.PerT4_16)
    };
}
function apagarPerT4Conc16(e) {
    PerT4Conc16.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT4Conc16(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' + feature.properties.PerT4_16  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT4Conc16,
    });
}
var PerT4Conc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT4Conc16,
    onEachFeature: onEachFeaturePerT4Conc16
});
let slidePerT4Conc16 = function(){
    var sliderPerT4Conc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 47){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT4Conc16, {
        start: [minPerT4Conc16, maxPerT4Conc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT4Conc16,
            'max': maxPerT4Conc16
        },
        });
    inputNumberMin.setAttribute("value",minPerT4Conc16);
    inputNumberMax.setAttribute("value",maxPerT4Conc16);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT4Conc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT4Conc16.noUiSlider.set([null, this.value]);
    });

    sliderPerT4Conc16.noUiSlider.on('update',function(e){
        PerT4Conc16.eachLayer(function(layer){
            if(layer.feature.properties.PerT4_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT4_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT4Conc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 47;
    sliderAtivo = sliderPerT4Conc16.noUiSlider;
    $(slidersGeral).append(sliderPerT4Conc16);
} 

/////////////////////////////// Fim de T4 CONCELHO em 2016 -------------- \\\\\\


//////////////////////////------- Percentagem T1 CONCELHO em 2017-----////

var minPerT1Conc17 = 100;
var maxPerT1Conc17 = 0;

function EstiloPerT1Conc17(feature) {
    if(feature.properties.PerT1_17 <= minPerT1Conc17){
        minPerT1Conc17 = feature.properties.PerT1_17
    }
    if(feature.properties.PerT1_17 >= maxPerT1Conc17 ){
        maxPerT1Conc17 = feature.properties.PerT1_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT1Conc(feature.properties.PerT1_17)
    };
}
function apagarPerT1Conc17(e) {
    PerT1Conc17.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT1Conc17(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' + feature.properties.PerT1_17  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT1Conc17,
    });
}
var PerT1Conc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT1Conc17,
    onEachFeature: onEachFeaturePerT1Conc17
});
let slidePerT1Conc17 = function(){
    var sliderPerT1Conc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 48){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT1Conc17, {
        start: [minPerT1Conc17, maxPerT1Conc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT1Conc17,
            'max': maxPerT1Conc17
        },
        });
    inputNumberMin.setAttribute("value",minPerT1Conc17);
    inputNumberMax.setAttribute("value",maxPerT1Conc17);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT1Conc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT1Conc17.noUiSlider.set([null, this.value]);
    });

    sliderPerT1Conc17.noUiSlider.on('update',function(e){
        PerT1Conc17.eachLayer(function(layer){
            if(layer.feature.properties.PerT1_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT1_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT1Conc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 48;
    sliderAtivo = sliderPerT1Conc17.noUiSlider;
    $(slidersGeral).append(sliderPerT1Conc17);
} 

/////////////////////////////// Fim da T1 CONCELHO em 2017 -------------- \\\\\\

///////////////////////////------- Percentagem T2 CONCELHO em 2017-----////

var minPerT2Conc17 = 100;
var maxPerT2Conc17 = 0;

function EstiloPerT2Conc17(feature) {
    if(feature.properties.PerT2_17 <= minPerT2Conc17){
        minPerT2Conc17 = feature.properties.PerT2_17
    }
    if(feature.properties.PerT2_17 >= maxPerT2Conc17 ){
        maxPerT2Conc17 = feature.properties.PerT2_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT2Conc(feature.properties.PerT2_17)
    };
}
function apagarPerT2Conc17(e) {
    PerT2Conc17.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT2Conc17(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T2 licenciados: ' + '<b>' + feature.properties.PerT2_17  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT2Conc17,
    });
}
var PerT2Conc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT2Conc17,
    onEachFeature: onEachFeaturePerT2Conc17
});
let slidePerT2Conc17 = function(){
    var sliderPerT2Conc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 49){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT2Conc17, {
        start: [minPerT2Conc17, maxPerT2Conc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT2Conc17,
            'max': maxPerT2Conc17
        },
        });
    inputNumberMin.setAttribute("value",minPerT2Conc17);
    inputNumberMax.setAttribute("value",maxPerT2Conc17);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT2Conc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT2Conc17.noUiSlider.set([null, this.value]);
    });

    sliderPerT2Conc17.noUiSlider.on('update',function(e){
        PerT2Conc17.eachLayer(function(layer){
            if(layer.feature.properties.PerT2_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT2_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT2Conc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 49;
    sliderAtivo = sliderPerT2Conc17.noUiSlider;
    $(slidersGeral).append(sliderPerT2Conc17);
} 

/////////////////////////////// Fim da T2 CONCELHO em 2017 -------------- \\\\\\

///////////////////////////------- Percentagem T3 CONCELHO em 2017-----////

var minPerT3Conc17 = 100;
var maxPerT3Conc17 = 0;

function EstiloPerT3Conc17(feature) {
    if(feature.properties.PerT3_17 <= minPerT3Conc17){
        minPerT3Conc17 = feature.properties.PerT3_17
    }
    if(feature.properties.PerT3_17 >= maxPerT3Conc17 ){
        maxPerT3Conc17 = feature.properties.PerT3_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerT3Conc(feature.properties.PerT3_17)
    };
}
function apagarPerT3Conc17(e) {
    PerT3Conc17.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT3Conc17(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T3 licenciados: ' + '<b>' + feature.properties.PerT3_17  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT3Conc17,
    });
}
var PerT3Conc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT3Conc17,
    onEachFeature: onEachFeaturePerT3Conc17
});
let slidePerT3Conc17 = function(){
    var sliderPerT3Conc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 50){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT3Conc17, {
        start: [minPerT3Conc17, maxPerT3Conc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT3Conc17,
            'max': maxPerT3Conc17
        },
        });
    inputNumberMin.setAttribute("value",minPerT3Conc17);
    inputNumberMax.setAttribute("value",maxPerT3Conc17);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT3Conc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT3Conc17.noUiSlider.set([null, this.value]);
    });

    sliderPerT3Conc17.noUiSlider.on('update',function(e){
        PerT3Conc17.eachLayer(function(layer){
            if(layer.feature.properties.PerT3_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT3_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT3Conc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 50;
    sliderAtivo = sliderPerT3Conc17.noUiSlider;
    $(slidersGeral).append(sliderPerT3Conc17);
} 

/////////////////////////////// Fim de T3 CONCELHO em 2017 -------------- \\\\\\

///////////////////////////------- Percentagem T4 CONCELHO em 2017-----////

var minPerT4Conc17 = 100;
var maxPerT4Conc17 = 0;

function EstiloPerT4Conc17(feature) {
    if(feature.properties.PerT4_17 <= minPerT4Conc17){
        minPerT4Conc17 = feature.properties.PerT4_17
    }
    if(feature.properties.PerT4_17 >= maxPerT4Conc17 ){
        maxPerT4Conc17 = feature.properties.PerT4_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT4Conc(feature.properties.PerT4_17)
    };
}
function apagarPerT4Conc17(e) {
    PerT4Conc17.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT4Conc17(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' + feature.properties.PerT4_17  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT4Conc17,
    });
}
var PerT4Conc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT4Conc17,
    onEachFeature: onEachFeaturePerT4Conc17
});
let slidePerT4Conc17 = function(){
    var sliderPerT4Conc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 51){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT4Conc17, {
        start: [minPerT4Conc17, maxPerT4Conc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT4Conc17,
            'max': maxPerT4Conc17
        },
        });
    inputNumberMin.setAttribute("value",minPerT4Conc17);
    inputNumberMax.setAttribute("value",maxPerT4Conc17);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT4Conc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT4Conc17.noUiSlider.set([null, this.value]);
    });

    sliderPerT4Conc17.noUiSlider.on('update',function(e){
        PerT4Conc17.eachLayer(function(layer){
            if(layer.feature.properties.PerT4_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT4_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT4Conc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 51;
    sliderAtivo = sliderPerT4Conc17.noUiSlider;
    $(slidersGeral).append(sliderPerT4Conc17);
} 

/////////////////////////////// Fim de T4 CONCELHO em 2017 -------------- \\\\\\

//////////////////////////------- Percentagem T1 CONCELHO em 2018-----////

var minPerT1Conc18 = 100;
var maxPerT1Conc18 = 0;

function EstiloPerT1Conc18(feature) {
    if(feature.properties.PerT1_18 <= minPerT1Conc18){
        minPerT1Conc18 = feature.properties.PerT1_18
    }
    if(feature.properties.PerT1_18 >= maxPerT1Conc18 ){
        maxPerT1Conc18 = feature.properties.PerT1_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT1Conc(feature.properties.PerT1_18)
    };
}
function apagarPerT1Conc18(e) {
    PerT1Conc18.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT1Conc18(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' + feature.properties.PerT1_18  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT1Conc18,
    });
}
var PerT1Conc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT1Conc18,
    onEachFeature: onEachFeaturePerT1Conc18
});
let slidePerT1Conc18 = function(){
    var sliderPerT1Conc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 52){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT1Conc18, {
        start: [minPerT1Conc18, maxPerT1Conc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT1Conc18,
            'max': maxPerT1Conc18
        },
        });
    inputNumberMin.setAttribute("value",minPerT1Conc18);
    inputNumberMax.setAttribute("value",maxPerT1Conc18);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT1Conc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT1Conc18.noUiSlider.set([null, this.value]);
    });

    sliderPerT1Conc18.noUiSlider.on('update',function(e){
        PerT1Conc18.eachLayer(function(layer){
            if(layer.feature.properties.PerT1_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT1_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT1Conc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 52;
    sliderAtivo = sliderPerT1Conc18.noUiSlider;
    $(slidersGeral).append(sliderPerT1Conc18);
} 

/////////////////////////////// Fim da T1 CONCELHO em 2018 -------------- \\\\\\

///////////////////////////------- Percentagem T2 CONCELHO em 2018-----////

var minPerT2Conc18 = 100;
var maxPerT2Conc18 = 0;

function EstiloPerT2Conc18(feature) {
    if(feature.properties.PerT2_18 <= minPerT2Conc18){
        minPerT2Conc18 = feature.properties.PerT2_18
    }
    if(feature.properties.PerT2_18 >= maxPerT2Conc18 ){
        maxPerT2Conc18 = feature.properties.PerT2_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT2Conc(feature.properties.PerT2_18)
    };
}
function apagarPerT2Conc18(e) {
    PerT2Conc18.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT2Conc18(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T2 licenciados: ' + '<b>' + feature.properties.PerT2_18  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT2Conc18,
    });
}
var PerT2Conc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT2Conc18,
    onEachFeature: onEachFeaturePerT2Conc18
});
let slidePerT2Conc18 = function(){
    var sliderPerT2Conc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 53){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT2Conc18, {
        start: [minPerT2Conc18, maxPerT2Conc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT2Conc18,
            'max': maxPerT2Conc18
        },
        });
    inputNumberMin.setAttribute("value",minPerT2Conc18);
    inputNumberMax.setAttribute("value",maxPerT2Conc18);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT2Conc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT2Conc18.noUiSlider.set([null, this.value]);
    });

    sliderPerT2Conc18.noUiSlider.on('update',function(e){
        PerT2Conc18.eachLayer(function(layer){
            if(layer.feature.properties.PerT2_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT2_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT2Conc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 53;
    sliderAtivo = sliderPerT2Conc18.noUiSlider;
    $(slidersGeral).append(sliderPerT2Conc18);
} 

/////////////////////////////// Fim da T2 CONCELHO em 2018 -------------- \\\\\\

///////////////////////////------- Percentagem T3 CONCELHO em 2018-----////

var minPerT3Conc18 = 100;
var maxPerT3Conc18 = 0;

function EstiloPerT3Conc18(feature) {
    if(feature.properties.PerT3_18 <= minPerT3Conc18){
        minPerT3Conc18 = feature.properties.PerT3_18
    }
    if(feature.properties.PerT3_18 >= maxPerT3Conc18 ){
        maxPerT3Conc18 = feature.properties.PerT3_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerT3Conc(feature.properties.PerT3_18)
    };
}
function apagarPerT3Conc18(e) {
    PerT3Conc18.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT3Conc18(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T3 licenciados: ' + '<b>' + feature.properties.PerT3_18  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT3Conc18,
    });
}
var PerT3Conc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT3Conc18,
    onEachFeature: onEachFeaturePerT3Conc18
});
let slidePerT3Conc18 = function(){
    var sliderPerT3Conc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 54){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT3Conc18, {
        start: [minPerT3Conc18, maxPerT3Conc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT3Conc18,
            'max': maxPerT3Conc18
        },
        });
    inputNumberMin.setAttribute("value",minPerT3Conc18);
    inputNumberMax.setAttribute("value",maxPerT3Conc18);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT3Conc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT3Conc18.noUiSlider.set([null, this.value]);
    });

    sliderPerT3Conc18.noUiSlider.on('update',function(e){
        PerT3Conc18.eachLayer(function(layer){
            if(layer.feature.properties.PerT3_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT3_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT3Conc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 54;
    sliderAtivo = sliderPerT3Conc18.noUiSlider;
    $(slidersGeral).append(sliderPerT3Conc18);
} 

/////////////////////////////// Fim de T3 CONCELHO em 2018 -------------- \\\\\\

///////////////////////////------- Percentagem T4 CONCELHO em 2018-----////

var minPerT4Conc18 = 100;
var maxPerT4Conc18 = 0;

function EstiloPerT4Conc18(feature) {
    if(feature.properties.PerT4_18 <= minPerT4Conc18){
        minPerT4Conc18 = feature.properties.PerT4_18
    }
    if(feature.properties.PerT4_18 >= maxPerT4Conc18 ){
        maxPerT4Conc18 = feature.properties.PerT4_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT4Conc(feature.properties.PerT4_18)
    };
}
function apagarPerT4Conc18(e) {
    PerT4Conc18.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT4Conc18(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' + feature.properties.PerT4_18  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT4Conc18,
    });
}
var PerT4Conc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT4Conc18,
    onEachFeature: onEachFeaturePerT4Conc18
});
let slidePerT4Conc18 = function(){
    var sliderPerT4Conc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 55){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT4Conc18, {
        start: [minPerT4Conc18, maxPerT4Conc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT4Conc18,
            'max': maxPerT4Conc18
        },
        });
    inputNumberMin.setAttribute("value",minPerT4Conc18);
    inputNumberMax.setAttribute("value",maxPerT4Conc18);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT4Conc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT4Conc18.noUiSlider.set([null, this.value]);
    });

    sliderPerT4Conc18.noUiSlider.on('update',function(e){
        PerT4Conc18.eachLayer(function(layer){
            if(layer.feature.properties.PerT4_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT4_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT4Conc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 55;
    sliderAtivo = sliderPerT4Conc18.noUiSlider;
    $(slidersGeral).append(sliderPerT4Conc18);
} 

/////////////////////////////// Fim de T4 CONCELHO em 2018 -------------- \\\\\\


//////////////////////////------- Percentagem T1 CONCELHO em 2019-----////

var minPerT1Conc19 = 100;
var maxPerT1Conc19 = 0;

function EstiloPerT1Conc19(feature) {
    if(feature.properties.PerT1_19 <= minPerT1Conc19){
        minPerT1Conc19 = feature.properties.PerT1_19
    }
    if(feature.properties.PerT1_19 >= maxPerT1Conc19 ){
        maxPerT1Conc19 = feature.properties.PerT1_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT1Conc(feature.properties.PerT1_19)
    };
}
function apagarPerT1Conc19(e) {
    PerT1Conc19.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT1Conc19(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' + feature.properties.PerT1_19  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT1Conc19,
    });
}
var PerT1Conc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT1Conc19,
    onEachFeature: onEachFeaturePerT1Conc19
});
let slidePerT1Conc19 = function(){
    var sliderPerT1Conc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 56){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT1Conc19, {
        start: [minPerT1Conc19, maxPerT1Conc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT1Conc19,
            'max': maxPerT1Conc19
        },
        });
    inputNumberMin.setAttribute("value",minPerT1Conc19);
    inputNumberMax.setAttribute("value",maxPerT1Conc19);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT1Conc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT1Conc19.noUiSlider.set([null, this.value]);
    });

    sliderPerT1Conc19.noUiSlider.on('update',function(e){
        PerT1Conc19.eachLayer(function(layer){
            if(layer.feature.properties.PerT1_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT1_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT1Conc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 56;
    sliderAtivo = sliderPerT1Conc19.noUiSlider;
    $(slidersGeral).append(sliderPerT1Conc19);
} 

/////////////////////////////// Fim da T1 CONCELHO em 2019 -------------- \\\\\\

///////////////////////////------- Percentagem T2 CONCELHO em 2019-----////

var minPerT2Conc19 = 100;
var maxPerT2Conc19 = 0;

function EstiloPerT2Conc19(feature) {
    if(feature.properties.PerT2_19 <= minPerT2Conc19){
        minPerT2Conc19 = feature.properties.PerT2_19
    }
    if(feature.properties.PerT2_19 >= maxPerT2Conc19 ){
        maxPerT2Conc19 = feature.properties.PerT2_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT2Conc(feature.properties.PerT2_19)
    };
}
function apagarPerT2Conc19(e) {
    PerT2Conc19.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT2Conc19(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T2 licenciados: ' + '<b>' + feature.properties.PerT2_19  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT2Conc19,
    });
}
var PerT2Conc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT2Conc19,
    onEachFeature: onEachFeaturePerT2Conc19
});
let slidePerT2Conc19 = function(){
    var sliderPerT2Conc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 57){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT2Conc19, {
        start: [minPerT2Conc19, maxPerT2Conc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT2Conc19,
            'max': maxPerT2Conc19
        },
        });
    inputNumberMin.setAttribute("value",minPerT2Conc19);
    inputNumberMax.setAttribute("value",maxPerT2Conc19);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT2Conc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT2Conc19.noUiSlider.set([null, this.value]);
    });

    sliderPerT2Conc19.noUiSlider.on('update',function(e){
        PerT2Conc19.eachLayer(function(layer){
            if(layer.feature.properties.PerT2_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT2_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT2Conc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 57;
    sliderAtivo = sliderPerT2Conc19.noUiSlider;
    $(slidersGeral).append(sliderPerT2Conc19);
} 

/////////////////////////////// Fim da T2 CONCELHO em 2019 -------------- \\\\\\

///////////////////////////------- Percentagem T3 CONCELHO em 2019-----////

var minPerT3Conc19 = 100;
var maxPerT3Conc19 = 0;

function EstiloPerT3Conc19(feature) {
    if(feature.properties.PerT3_19 <= minPerT3Conc19){
        minPerT3Conc19 = feature.properties.PerT3_19
    }
    if(feature.properties.PerT3_19 >= maxPerT3Conc19 ){
        maxPerT3Conc19 = feature.properties.PerT3_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerT3Conc(feature.properties.PerT3_19)
    };
}
function apagarPerT3Conc19(e) {
    PerT3Conc19.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT3Conc19(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T3 licenciados: ' + '<b>' + feature.properties.PerT3_19  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT3Conc19,
    });
}
var PerT3Conc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT3Conc19,
    onEachFeature: onEachFeaturePerT3Conc19
});
let slidePerT3Conc19 = function(){
    var sliderPerT3Conc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 58){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT3Conc19, {
        start: [minPerT3Conc19, maxPerT3Conc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT3Conc19,
            'max': maxPerT3Conc19
        },
        });
    inputNumberMin.setAttribute("value",minPerT3Conc19);
    inputNumberMax.setAttribute("value",maxPerT3Conc19);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT3Conc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT3Conc19.noUiSlider.set([null, this.value]);
    });

    sliderPerT3Conc19.noUiSlider.on('update',function(e){
        PerT3Conc19.eachLayer(function(layer){
            if(layer.feature.properties.PerT3_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT3_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT3Conc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 58;
    sliderAtivo = sliderPerT3Conc19.noUiSlider;
    $(slidersGeral).append(sliderPerT3Conc19);
} 

/////////////////////////////// Fim de T3 CONCELHO em 2019 -------------- \\\\\\

///////////////////////////------- Percentagem T4 CONCELHO em 2019-----////

var minPerT4Conc19 = 100;
var maxPerT4Conc19 = 0;

function EstiloPerT4Conc19(feature) {
    if(feature.properties.PerT4_19 <= minPerT4Conc19){
        minPerT4Conc19 = feature.properties.PerT4_19
    }
    if(feature.properties.PerT4_19 >= maxPerT4Conc19 ){
        maxPerT4Conc19 = feature.properties.PerT4_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT4Conc(feature.properties.PerT4_19)
    };
}
function apagarPerT4Conc19(e) {
    PerT4Conc19.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT4Conc19(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' + feature.properties.PerT4_19  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT4Conc19,
    });
}
var PerT4Conc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT4Conc19,
    onEachFeature: onEachFeaturePerT4Conc19
});
let slidePerT4Conc19 = function(){
    var sliderPerT4Conc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 59){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT4Conc19, {
        start: [minPerT4Conc19, maxPerT4Conc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT4Conc19,
            'max': maxPerT4Conc19
        },
        });
    inputNumberMin.setAttribute("value",minPerT4Conc19);
    inputNumberMax.setAttribute("value",maxPerT4Conc19);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT4Conc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT4Conc19.noUiSlider.set([null, this.value]);
    });

    sliderPerT4Conc19.noUiSlider.on('update',function(e){
        PerT4Conc19.eachLayer(function(layer){
            if(layer.feature.properties.PerT4_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT4_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT4Conc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 59;
    sliderAtivo = sliderPerT4Conc19.noUiSlider;
    $(slidersGeral).append(sliderPerT4Conc19);
} 

/////////////////////////////// Fim de T4 CONCELHO em 2019 -------------- \\\\\\

//////////////////////////------- Percentagem T1 CONCELHO em 2020-----////

var minPerT1Conc20 = 100;
var maxPerT1Conc20 = 0;

function EstiloPerT1Conc20(feature) {
    if(feature.properties.PerT1_20 <= minPerT1Conc20){
        minPerT1Conc20 = feature.properties.PerT1_20
    }
    if(feature.properties.PerT1_20 >= maxPerT1Conc20 ){
        maxPerT1Conc20 = feature.properties.PerT1_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT1Conc(feature.properties.PerT1_20)
    };
}
function apagarPerT1Conc20(e) {
    PerT1Conc20.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT1Conc20(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' + feature.properties.PerT1_20  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT1Conc20,
    });
}
var PerT1Conc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT1Conc20,
    onEachFeature: onEachFeaturePerT1Conc20
});
let slidePerT1Conc20 = function(){
    var sliderPerT1Conc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 60){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT1Conc20, {
        start: [minPerT1Conc20, maxPerT1Conc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT1Conc20,
            'max': maxPerT1Conc20
        },
        });
    inputNumberMin.setAttribute("value",minPerT1Conc20);
    inputNumberMax.setAttribute("value",maxPerT1Conc20);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT1Conc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT1Conc20.noUiSlider.set([null, this.value]);
    });

    sliderPerT1Conc20.noUiSlider.on('update',function(e){
        PerT1Conc20.eachLayer(function(layer){
            if(layer.feature.properties.PerT1_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT1_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT1Conc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 60;
    sliderAtivo = sliderPerT1Conc20.noUiSlider;
    $(slidersGeral).append(sliderPerT1Conc20);
} 

/////////////////////////////// Fim da T1 CONCELHO em 2020 -------------- \\\\\\

///////////////////////////------- Percentagem T2 CONCELHO em 2020-----////

var minPerT2Conc20 = 100;
var maxPerT2Conc20 = 0;

function EstiloPerT2Conc20(feature) {
    if(feature.properties.PerT2_20 <= minPerT2Conc20){
        minPerT2Conc20 = feature.properties.PerT2_20
    }
    if(feature.properties.PerT2_20 >= maxPerT2Conc20 ){
        maxPerT2Conc20 = feature.properties.PerT2_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT2Conc(feature.properties.PerT2_20)
    };
}
function apagarPerT2Conc20(e) {
    PerT2Conc20.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT2Conc20(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T2 licenciados: ' + '<b>' + feature.properties.PerT2_20  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT2Conc20,
    });
}
var PerT2Conc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT2Conc20,
    onEachFeature: onEachFeaturePerT2Conc20
});
let slidePerT2Conc20 = function(){
    var sliderPerT2Conc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 61){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT2Conc20, {
        start: [minPerT2Conc20, maxPerT2Conc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT2Conc20,
            'max': maxPerT2Conc20
        },
        });
    inputNumberMin.setAttribute("value",minPerT2Conc20);
    inputNumberMax.setAttribute("value",maxPerT2Conc20);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT2Conc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT2Conc20.noUiSlider.set([null, this.value]);
    });

    sliderPerT2Conc20.noUiSlider.on('update',function(e){
        PerT2Conc20.eachLayer(function(layer){
            if(layer.feature.properties.PerT2_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT2_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT2Conc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 61;
    sliderAtivo = sliderPerT2Conc20.noUiSlider;
    $(slidersGeral).append(sliderPerT2Conc20);
} 

/////////////////////////////// Fim da T2 CONCELHO em 2020 -------------- \\\\\\

///////////////////////////------- Percentagem T3 CONCELHO em 2020-----////

var minPerT3Conc20 = 100;
var maxPerT3Conc20 = 0;

function EstiloPerT3Conc20(feature) {
    if(feature.properties.PerT3_20 <= minPerT3Conc20){
        minPerT3Conc20 = feature.properties.PerT3_20
    }
    if(feature.properties.PerT3_20 >= maxPerT3Conc20 ){
        maxPerT3Conc20 = feature.properties.PerT3_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerT3Conc(feature.properties.PerT3_20)
    };
}
function apagarPerT3Conc20(e) {
    PerT3Conc20.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT3Conc20(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T3 licenciados: ' + '<b>' + feature.properties.PerT3_20  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT3Conc20,
    });
}
var PerT3Conc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT3Conc20,
    onEachFeature: onEachFeaturePerT3Conc20
});
let slidePerT3Conc20 = function(){
    var sliderPerT3Conc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 62){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT3Conc20, {
        start: [minPerT3Conc20, maxPerT3Conc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT3Conc20,
            'max': maxPerT3Conc20
        },
        });
    inputNumberMin.setAttribute("value",minPerT3Conc20);
    inputNumberMax.setAttribute("value",maxPerT3Conc20);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT3Conc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT3Conc20.noUiSlider.set([null, this.value]);
    });

    sliderPerT3Conc20.noUiSlider.on('update',function(e){
        PerT3Conc20.eachLayer(function(layer){
            if(layer.feature.properties.PerT3_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT3_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT3Conc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 62;
    sliderAtivo = sliderPerT3Conc20.noUiSlider;
    $(slidersGeral).append(sliderPerT3Conc20);
} 

/////////////////////////////// Fim de T3 CONCELHO em 2020 -------------- \\\\\\

///////////////////////////------- Percentagem T4 CONCELHO em 2020-----////

var minPerT4Conc20 = 100;
var maxPerT4Conc20 = 0;

function EstiloPerT4Conc20(feature) {
    if(feature.properties.PerT4_20 <= minPerT4Conc20){
        minPerT4Conc20 = feature.properties.PerT4_20
    }
    if(feature.properties.PerT4_20 >= maxPerT4Conc20 ){
        maxPerT4Conc20 = feature.properties.PerT4_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPerT4Conc(feature.properties.PerT4_20)
    };
}
function apagarPerT4Conc20(e) {
    PerT4Conc20.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerT4Conc20(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' + feature.properties.PerT4_20  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerT4Conc20,
    });
}
var PerT4Conc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerT4Conc20,
    onEachFeature: onEachFeaturePerT4Conc20
});
let slidePerT4Conc20 = function(){
    var sliderPerT4Conc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 63){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerT4Conc20, {
        start: [minPerT4Conc20, maxPerT4Conc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT4Conc20,
            'max': maxPerT4Conc20
        },
        });
    inputNumberMin.setAttribute("value",minPerT4Conc20);
    inputNumberMax.setAttribute("value",maxPerT4Conc20);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT4Conc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT4Conc20.noUiSlider.set([null, this.value]);
    });

    sliderPerT4Conc20.noUiSlider.on('update',function(e){
        PerT4Conc20.eachLayer(function(layer){
            if(layer.feature.properties.PerT4_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerT4_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerT4Conc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 63;
    sliderAtivo = sliderPerT4Conc20.noUiSlider;
    $(slidersGeral).append(sliderPerT4Conc20);
} 

// /////////////////////////////// Fim de T4 CONCELHO em 2020 -------------- \\\\\\

/////////////////////------------------------------- FIM DADOS RELATIVOS CONCELHOS

///////////////////////////////////////// VARIAÇÕES CONCELHOS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação Total, em 2015, POR CONCELHOS -------------------////

var minVarTotalConc15 = 0;
var maxVarTotalConc15 = 0;

function CorVarTotalConc15_14(d) {
    return d >= 50  ? '#de1f35' :
        d >= 20  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -20  ? '#9eaad7' :
        d >= -50   ? '#2288bf' :
                ''  ;
}

var legendaVarTotalConc15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos licenciados, entre 2015 e 2014, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  20 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -20 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -47.3 a -20' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalConc15(feature) {
    if(feature.properties.VarTot_15 <= minVarTotalConc15 || minVarTotalConc15 === 0){
        minVarTotalConc15 = feature.properties.VarTot_15
    }
    if(feature.properties.VarTot_15 > maxVarTotalConc15){
        maxVarTotalConc15 = feature.properties.VarTot_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConc15_14(feature.properties.VarTot_15)};
    }


function apagarVarTotalConc15(e) {
    VarTotalConc15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalConc15(feature, layer) {
    if (feature.properties.VarTot_15 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalConc15,
    });
}
var VarTotalConc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarTotalConc15,
    onEachFeature: onEachFeatureVarTotalConc15
});

let slideVarTotalConc15 = function(){
    var sliderVarTotalConc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 64){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalConc15, {
        start: [minVarTotalConc15, maxVarTotalConc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalConc15,
            'max': maxVarTotalConc15
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalConc15);
    inputNumberMax.setAttribute("value",maxVarTotalConc15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalConc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalConc15.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalConc15.noUiSlider.on('update',function(e){
        VarTotalConc15.eachLayer(function(layer){
            if (layer.feature.properties.VarTot_15 == null){
                return false
            }
            if(layer.feature.properties.VarTot_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalConc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 64;
    sliderAtivo = sliderVarTotalConc15.noUiSlider;
    $(slidersGeral).append(sliderVarTotalConc15);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2015 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T1, em 2015, POR CONCELHOS -------------------////

var minVarT1Conc15 = 0;
var maxVarT1Conc15 = 0;

function CorVarT1Conc15_14(d) {
    return d == null ? '#808080' :
        d >= 50  ? '#8c0303' :
        d >= 0  ? '#de1f35' :
        d >= -50  ? '#2288bf' :
        d >= -100.1   ? '#0b2c40' :
                ''  ;
}

var legendaVarT1Conc15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T0 ou T1 licenciados, entre 2015 e 2014, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT1Conc15(feature) {
    if(feature.properties.VarT1_15 <= minVarT1Conc15){
        minVarT1Conc15 = feature.properties.VarT1_15
    }
    if(feature.properties.VarT1_15 > maxVarT1Conc15){
        maxVarT1Conc15 = feature.properties.VarT1_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT1Conc15_14(feature.properties.VarT1_15)};
    }


function apagarVarT1Conc15(e) {
    VarT1Conc15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT1Conc15(feature, layer) {
    if (feature.properties.VarT1_15 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT1_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT1Conc15,
    });
}
var VarT1Conc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT1Conc15,
    onEachFeature: onEachFeatureVarT1Conc15
});

let slideVarT1Conc15 = function(){
    var sliderVarT1Conc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 65){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT1Conc15, {
        start: [minVarT1Conc15, maxVarT1Conc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT1Conc15,
            'max': maxVarT1Conc15
        },
        });
    inputNumberMin.setAttribute("value",minVarT1Conc15);
    inputNumberMax.setAttribute("value",maxVarT1Conc15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT1Conc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT1Conc15.noUiSlider.set([null, this.value]);
    });

    sliderVarT1Conc15.noUiSlider.on('update',function(e){
        VarT1Conc15.eachLayer(function(layer){
            if (layer.feature.properties.VarT1_15 == null){
                return false
            }
            if(layer.feature.properties.VarT1_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT1_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT1Conc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 65;
    sliderAtivo = sliderVarT1Conc15.noUiSlider;
    $(slidersGeral).append(sliderVarT1Conc15);
} 

///////////////////////////// Fim VARIAÇÃO T1, em 2015 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T2, em 2015, POR CONCELHOS -------------------////

var minVarT2Conc15 = 0;
var maxVarT2Conc15 = 0;

function CorVarT2Conc15_14(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#155273' :
        d >= -40  ? '#2288bf' :
        d >= -100.1   ? '#0b2c40' :
                ''  ;
}

var legendaVarT2Conc15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T2 licenciados, entre 2015 e 2014, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -40 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT2Conc15(feature) {
    if(feature.properties.VarT2_15 <= minVarT2Conc15 || minVarT2Conc15 === 0){
        minVarT2Conc15 = feature.properties.VarT2_15
    }
    if(feature.properties.VarT2_15 > maxVarT2Conc15){
        maxVarT2Conc15 = feature.properties.VarT2_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT2Conc15_14(feature.properties.VarT2_15)};
    }


function apagarVarT2Conc15(e) {
    VarT2Conc15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT2Conc15(feature, layer) {
    if (feature.properties.VarT2_15 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT2_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT2Conc15,
    });
}
var VarT2Conc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT2Conc15,
    onEachFeature: onEachFeatureVarT2Conc15
});

let slideVarT2Conc15 = function(){
    var sliderVarT2Conc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 66){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT2Conc15, {
        start: [minVarT2Conc15, maxVarT2Conc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT2Conc15,
            'max': maxVarT2Conc15
        },
        });
    inputNumberMin.setAttribute("value",minVarT2Conc15);
    inputNumberMax.setAttribute("value",maxVarT2Conc15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT2Conc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT2Conc15.noUiSlider.set([null, this.value]);
    });

    sliderVarT2Conc15.noUiSlider.on('update',function(e){
        VarT2Conc15.eachLayer(function(layer){
            if (layer.feature.properties.VarT2_15 == null){
                return false
            }
            if(layer.feature.properties.VarT2_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT2_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT2Conc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 66;
    sliderAtivo = sliderVarT2Conc15.noUiSlider;
    $(slidersGeral).append(sliderVarT2Conc15);
} 

///////////////////////////// Fim VARIAÇÃO T2, em 2015 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T3, em 2015, POR CONCELHOS -------------------////

var minVarT3Conc15 = 0;
var maxVarT3Conc15 = 0;

function CorVarT3Conc15_14(d) {
    return d == null ? '#808080' :
        d >= 60  ? '#8c0303' :
        d >= 30  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -35.1   ? '#2288bf' :
                ''  ;
}

var legendaVarT3Conc15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T3 licenciados, entre 2015 e 2014, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  30 a 60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -34.29 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT3Conc15(feature) {
    if(feature.properties.VarT3_15 <= minVarT3Conc15){
        minVarT3Conc15 = feature.properties.VarT3_15
    }
    if(feature.properties.VarT3_15 > maxVarT3Conc15){
        maxVarT3Conc15 = feature.properties.VarT3_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT3Conc15_14(feature.properties.VarT3_15)};
    }


function apagarVarT3Conc15(e) {
    VarT3Conc15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT3Conc15(feature, layer) {
    if (feature.properties.VarT3_15 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT3_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT3Conc15,
    });
}
var VarT3Conc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT3Conc15,
    onEachFeature: onEachFeatureVarT3Conc15
});

let slideVarT3Conc15 = function(){
    var sliderVarT3Conc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 67){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT3Conc15, {
        start: [minVarT3Conc15, maxVarT3Conc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT3Conc15,
            'max': maxVarT3Conc15
        },
        });
    inputNumberMin.setAttribute("value",minVarT3Conc15);
    inputNumberMax.setAttribute("value",maxVarT3Conc15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT3Conc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT3Conc15.noUiSlider.set([null, this.value]);
    });

    sliderVarT3Conc15.noUiSlider.on('update',function(e){
        VarT3Conc15.eachLayer(function(layer){
            if (layer.feature.properties.VarT3_15 == null){
                return false
            }
            if(layer.feature.properties.VarT3_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT3_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT3Conc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 67;
    sliderAtivo = sliderVarT3Conc15.noUiSlider;
    $(slidersGeral).append(sliderVarT3Conc15);
} 

///////////////////////////// Fim VARIAÇÃO T3, em 2015 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T4, em 2015, POR CONCELHOS -------------------////

var minVarT4Conc15 = 0;
var maxVarT4Conc15 = 0;

function CorVarT4Conc15_14(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 0  ? '#de1f35' :
        d >= -50  ? '#2288bf' :
        d >= -89   ? '#0b2c40' :
                ''  ;
}

var legendaVarT4Conc15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T4 ou mais licenciados, entre 2015 e 2014, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  0 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -88.89 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT4Conc15(feature) {
    if(feature.properties.VarT4_15 <= minVarT4Conc15 || minVarT4Conc15 === 0){
        minVarT4Conc15 = feature.properties.VarT4_15
    }
    if(feature.properties.VarT4_15 > maxVarT4Conc15){
        maxVarT4Conc15 = feature.properties.VarT4_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT4Conc15_14(feature.properties.VarT4_15)};
    }


function apagarVarT4Conc15(e) {
    VarT4Conc15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT4Conc15(feature, layer) {
    if (feature.properties.VarT4_15 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT4_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT4Conc15,
    });
}
var VarT4Conc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT4Conc15,
    onEachFeature: onEachFeatureVarT4Conc15
});

let slideVarT4Conc15 = function(){
    var sliderVarT4Conc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 68){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT4Conc15, {
        start: [minVarT4Conc15, maxVarT4Conc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT4Conc15,
            'max': maxVarT4Conc15
        },
        });
    inputNumberMin.setAttribute("value",minVarT4Conc15);
    inputNumberMax.setAttribute("value",maxVarT4Conc15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT4Conc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT4Conc15.noUiSlider.set([null, this.value]);
    });

    sliderVarT4Conc15.noUiSlider.on('update',function(e){
        VarT4Conc15.eachLayer(function(layer){
            if (layer.feature.properties.VarT4_15 == null){
                return false
            }
            if(layer.feature.properties.VarT4_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT4_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT4Conc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 68;
    sliderAtivo = sliderVarT4Conc15.noUiSlider;
    $(slidersGeral).append(sliderVarT4Conc15);
} 

///////////////////////////// Fim VARIAÇÃO T4, em 2015 , POR CONCELHOS -------------- \\\\\


/////////////////////////////------- Variação Total, em 2016, POR CONCELHOS -------------------////

var minVarTotalConc16 = 0;
var maxVarTotalConc16 = 0;

function CorVarTotalConc16_15(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -51   ? '#2288bf' :
                ''  ;
}

var legendaVarTotalConc16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos licenciados, entre 2016 e 2015, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalConc16(feature) {
    if(feature.properties.VarTot_16 <= minVarTotalConc16 || minVarTotalConc16 === 0){
        minVarTotalConc16 = feature.properties.VarTot_16
    }
    if(feature.properties.VarTot_16 > maxVarTotalConc16){
        maxVarTotalConc16 = feature.properties.VarTot_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConc16_15(feature.properties.VarTot_16)};
    }


function apagarVarTotalConc16(e) {
    VarTotalConc16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalConc16(feature, layer) {
    if (feature.properties.VarTot_16 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalConc16,
    });
}
var VarTotalConc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarTotalConc16,
    onEachFeature: onEachFeatureVarTotalConc16
});

let slideVarTotalConc16 = function(){
    var sliderVarTotalConc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 69){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalConc16, {
        start: [minVarTotalConc16, maxVarTotalConc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalConc16,
            'max': maxVarTotalConc16
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalConc16);
    inputNumberMax.setAttribute("value",maxVarTotalConc16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalConc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalConc16.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalConc16.noUiSlider.on('update',function(e){
        VarTotalConc16.eachLayer(function(layer){
            if (layer.feature.properties.VarTot_16 == null){
                return false
            }
            if(layer.feature.properties.VarTot_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalConc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 69;
    sliderAtivo = sliderVarTotalConc16.noUiSlider;
    $(slidersGeral).append(sliderVarTotalConc16);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2016 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T1, em 2016, POR CONCELHOS -------------------////

var minVarT1Conc16 = 0;
var maxVarT1Conc16 = 0;

function CorVarT1Conc16_15(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT1Conc16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T0 ou T1 licenciados, entre 2016 e 2015, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}
function EstiloVarT1Conc16(feature) {
    if(feature.properties.VarT1_16 <= minVarT1Conc16 || minVarT1Conc16 === 0){
        minVarT1Conc16 = feature.properties.VarT1_16
    }
    if(feature.properties.VarT1_16 > maxVarT1Conc16){
        maxVarT1Conc16 = feature.properties.VarT1_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT1Conc16_15(feature.properties.VarT1_16)};
    }


function apagarVarT1Conc16(e) {
    VarT1Conc16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT1Conc16(feature, layer) {
    if (feature.properties.VarT1_16 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT1_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT1Conc16,
    });
}
var VarT1Conc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT1Conc16,
    onEachFeature: onEachFeatureVarT1Conc16
});

let slideVarT1Conc16 = function(){
    var sliderVarT1Conc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 70){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT1Conc16, {
        start: [minVarT1Conc16, maxVarT1Conc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT1Conc16,
            'max': maxVarT1Conc16
        },
        });
    inputNumberMin.setAttribute("value",minVarT1Conc16);
    inputNumberMax.setAttribute("value",maxVarT1Conc16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT1Conc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT1Conc16.noUiSlider.set([null, this.value]);
    });

    sliderVarT1Conc16.noUiSlider.on('update',function(e){
        VarT1Conc16.eachLayer(function(layer){
            if (layer.feature.properties.VarT1_16 == null){
                return false
            }
            if(layer.feature.properties.VarT1_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT1_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT1Conc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 70;
    sliderAtivo = sliderVarT1Conc16.noUiSlider;
    $(slidersGeral).append(sliderVarT1Conc16);
} 

///////////////////////////// Fim VARIAÇÃO T1, em 2016 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T2, em 2016, POR CONCELHOS -------------------////

var minVarT2Conc16 = 0;
var maxVarT2Conc16 = 0;

function CorVarT2Conc16_15(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT2Conc16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T2 licenciados, entre 2016 e 2015, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT2Conc16(feature) {
    if(feature.properties.VarT2_16 <= minVarT2Conc16 || minVarT2Conc16 === 0){
        minVarT2Conc16 = feature.properties.VarT2_16
    }
    if(feature.properties.VarT2_16 > maxVarT2Conc16){
        maxVarT2Conc16 = feature.properties.VarT2_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT2Conc16_15(feature.properties.VarT2_16)};
    }


function apagarVarT2Conc16(e) {
    VarT2Conc16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT2Conc16(feature, layer) {
    if (feature.properties.VarT2_16 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT2_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT2Conc16,
    });
}
var VarT2Conc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT2Conc16,
    onEachFeature: onEachFeatureVarT2Conc16
});

let slideVarT2Conc16 = function(){
    var sliderVarT2Conc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 71){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT2Conc16, {
        start: [minVarT2Conc16, maxVarT2Conc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT2Conc16,
            'max': maxVarT2Conc16
        },
        });
    inputNumberMin.setAttribute("value",minVarT2Conc16);
    inputNumberMax.setAttribute("value",maxVarT2Conc16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT2Conc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT2Conc16.noUiSlider.set([null, this.value]);
    });

    sliderVarT2Conc16.noUiSlider.on('update',function(e){
        VarT2Conc16.eachLayer(function(layer){
            if (layer.feature.properties.VarT2_16 == null){
                return false
            }
            if(layer.feature.properties.VarT2_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT2_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT2Conc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 71;
    sliderAtivo = sliderVarT2Conc16.noUiSlider;
    $(slidersGeral).append(sliderVarT2Conc16);
} 

///////////////////////////// Fim VARIAÇÃO T2, em 2016 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T3, em 2016, POR CONCELHOS -------------------////

var minVarT3Conc16 = 0;
var maxVarT3Conc16 = 0;

function CorVarT3Conc16_15(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -65   ? '#155273' :
                ''  ;
}

var legendaVarT3Conc16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T3 licenciados, entre 2016 e 2015, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -64.29 a -10' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT3Conc16(feature) {
    if(feature.properties.VarT3_16 <= minVarT3Conc16 || minVarT3Conc16 === 0){
        minVarT3Conc16 = feature.properties.VarT3_16
    }
    if(feature.properties.VarT3_16 > maxVarT3Conc16){
        maxVarT3Conc16 = feature.properties.VarT3_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT3Conc16_15(feature.properties.VarT3_16)};
    }


function apagarVarT3Conc16(e) {
    VarT3Conc16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT3Conc16(feature, layer) {
    if (feature.properties.VarT3_16 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT3_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT3Conc16,
    });
}
var VarT3Conc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT3Conc16,
    onEachFeature: onEachFeatureVarT3Conc16
});

let slideVarT3Conc16 = function(){
    var sliderVarT3Conc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 72){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT3Conc16, {
        start: [minVarT3Conc16, maxVarT3Conc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT3Conc16,
            'max': maxVarT3Conc16
        },
        });
    inputNumberMin.setAttribute("value",minVarT3Conc16);
    inputNumberMax.setAttribute("value",maxVarT3Conc16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT3Conc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT3Conc16.noUiSlider.set([null, this.value]);
    });

    sliderVarT3Conc16.noUiSlider.on('update',function(e){
        VarT3Conc16.eachLayer(function(layer){
            if (layer.feature.properties.VarT3_16 == null){
                return false
            }
            if(layer.feature.properties.VarT3_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT3_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT3Conc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 72;
    sliderAtivo = sliderVarT3Conc16.noUiSlider;
    $(slidersGeral).append(sliderVarT3Conc16);
} 

///////////////////////////// Fim VARIAÇÃO T3, em 2016 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T4, em 2016, POR CONCELHOS -------------------////

var minVarT4Conc16 = 0;
var maxVarT4Conc16 = 0;

function CorVarT4Conc16_15(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -61   ? '#2288bf' :
                ''  ;
}

var legendaVarT4Conc16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T4 licenciados, entre 2016 e 2015, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -60 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT4Conc16(feature) {
    if(feature.properties.VarT4_16 <= minVarT4Conc16 || minVarT4Conc16 === 0){
        minVarT4Conc16 = feature.properties.VarT4_16
    }
    if(feature.properties.VarT4_16 > maxVarT4Conc16){
        maxVarT4Conc16 = feature.properties.VarT4_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT4Conc16_15(feature.properties.VarT4_16)};
    }


function apagarVarT4Conc16(e) {
    VarT4Conc16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT4Conc16(feature, layer) {
    if (feature.properties.VarT4_16 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT4_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT4Conc16,
    });
}
var VarT4Conc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT4Conc16,
    onEachFeature: onEachFeatureVarT4Conc16
});

let slideVarT4Conc16 = function(){
    var sliderVarT4Conc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 73){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT4Conc16, {
        start: [minVarT4Conc16, maxVarT4Conc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT4Conc16,
            'max': maxVarT4Conc16
        },
        });
    inputNumberMin.setAttribute("value",minVarT4Conc16);
    inputNumberMax.setAttribute("value",maxVarT4Conc16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT4Conc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT4Conc16.noUiSlider.set([null, this.value]);
    });

    sliderVarT4Conc16.noUiSlider.on('update',function(e){
        VarT4Conc16.eachLayer(function(layer){
            if (layer.feature.properties.VarT4_16 == null){
                return false
            }
            if(layer.feature.properties.VarT4_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT4_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT4Conc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 73;
    sliderAtivo = sliderVarT4Conc16.noUiSlider;
    $(slidersGeral).append(sliderVarT4Conc16);
} 

///////////////////////////// Fim VARIAÇÃO T4, em 2016 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Total, em 2017, POR CONCELHOS -------------------////

var minVarTotalConc17 = 0;
var maxVarTotalConc17 = 0;

function CorVarTotalConc17_16(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -50   ? '#2288bf' :
                ''  ;
}

var legendaVarTotalConc17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos licenciados, entre 2017 e 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  30 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -47.5 a -25' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalConc17(feature) {
    if(feature.properties.VarTot_17 <= minVarTotalConc17 || minVarTotalConc17 === 0){
        minVarTotalConc17 = feature.properties.VarTot_17
    }
    if(feature.properties.VarTot_17 > maxVarTotalConc17){
        maxVarTotalConc17 = feature.properties.VarTot_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConc17_16(feature.properties.VarTot_17)};
    }


function apagarVarTotalConc17(e) {
    VarTotalConc17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalConc17(feature, layer) {
    if (feature.properties.VarTot_17 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalConc17,
    });
}
var VarTotalConc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarTotalConc17,
    onEachFeature: onEachFeatureVarTotalConc17
});

let slideVarTotalConc17 = function(){
    var sliderVarTotalConc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 74){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalConc17, {
        start: [minVarTotalConc17, maxVarTotalConc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalConc17,
            'max': maxVarTotalConc17
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalConc17);
    inputNumberMax.setAttribute("value",maxVarTotalConc17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalConc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalConc17.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalConc17.noUiSlider.on('update',function(e){
        VarTotalConc17.eachLayer(function(layer){
            if (layer.feature.properties.VarTot_17 == null){
                return false
            }
            if(layer.feature.properties.VarTot_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalConc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 74;
    sliderAtivo = sliderVarTotalConc17.noUiSlider;
    $(slidersGeral).append(sliderVarTotalConc17);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2017 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T1, em 2017, POR CONCELHOS -------------------////

var minVarT1Conc17 = 0;
var maxVarT1Conc17 = 0;

function CorVarT1Conc17_16(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -81   ? '#155273' :
                ''  ;
}

var legendaVarT1Conc17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T0 ou T1 licenciados, entre 2017 e 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -80 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT1Conc17(feature) {
    if(feature.properties.VarT1_17 <= minVarT1Conc17){
        minVarT1Conc17 = feature.properties.VarT1_17
    }
    if(feature.properties.VarT1_17 > maxVarT1Conc17){
        maxVarT1Conc17 = feature.properties.VarT1_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT1Conc17_16(feature.properties.VarT1_17)};
    }


function apagarVarT1Conc17(e) {
    VarT1Conc17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT1Conc17(feature, layer) {
    if (feature.properties.VarT1_17 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT1_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT1Conc17,
    });
}
var VarT1Conc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT1Conc17,
    onEachFeature: onEachFeatureVarT1Conc17
});

let slideVarT1Conc17 = function(){
    var sliderVarT1Conc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 75){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT1Conc17, {
        start: [minVarT1Conc17, maxVarT1Conc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT1Conc17,
            'max': maxVarT1Conc17
        },
        });
    inputNumberMin.setAttribute("value",minVarT1Conc17);
    inputNumberMax.setAttribute("value",maxVarT1Conc17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT1Conc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT1Conc17.noUiSlider.set([null, this.value]);
    });

    sliderVarT1Conc17.noUiSlider.on('update',function(e){
        VarT1Conc17.eachLayer(function(layer){
            if (layer.feature.properties.VarT1_17 == null){
                return false
            }
            if(layer.feature.properties.VarT1_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT1_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT1Conc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 75;
    sliderAtivo = sliderVarT1Conc17.noUiSlider;
    $(slidersGeral).append(sliderVarT1Conc17);
} 

///////////////////////////// Fim VARIAÇÃO T1, em 2017 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T2, em 2017, POR CONCELHOS -------------------////

var minVarT2Conc17 = 0;
var maxVarT2Conc17 = 0;

function CorVarT2Conc17_16(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 0  ? '#ff5e6e' :
        d >= -25  ? '#9ebbd7' :
        d >= -50  ? '#2288bf' :
        d >= -66   ? '#155273' :
                ''  ;
}

var legendaVarT2Conc17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T2 licenciados, entre 2017 e 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  0 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -65.22 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT2Conc17(feature) {
    if(feature.properties.VarT2_17 <= minVarT2Conc17 ){
        minVarT2Conc17 = feature.properties.VarT2_17
    }
    if(feature.properties.VarT2_17 > maxVarT2Conc17){
        maxVarT2Conc17 = feature.properties.VarT2_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT2Conc17_16(feature.properties.VarT2_17)};
    }


function apagarVarT2Conc17(e) {
    VarT2Conc17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT2Conc17(feature, layer) {
    if (feature.properties.VarT2_17 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT2_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT2Conc17,
    });
}
var VarT2Conc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT2Conc17,
    onEachFeature: onEachFeatureVarT2Conc17
});

let slideVarT2Conc17 = function(){
    var sliderVarT2Conc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 76){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT2Conc17, {
        start: [minVarT2Conc17, maxVarT2Conc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT2Conc17,
            'max': maxVarT2Conc17
        },
        });
    inputNumberMin.setAttribute("value",minVarT2Conc17);
    inputNumberMax.setAttribute("value",maxVarT2Conc17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT2Conc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT2Conc17.noUiSlider.set([null, this.value]);
    });

    sliderVarT2Conc17.noUiSlider.on('update',function(e){
        VarT2Conc17.eachLayer(function(layer){
            if (layer.feature.properties.VarT2_17 == null){
                return false
            }
            if(layer.feature.properties.VarT2_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT2_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT2Conc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 76;
    sliderAtivo = sliderVarT2Conc17.noUiSlider;
    $(slidersGeral).append(sliderVarT2Conc17);
} 

///////////////////////////// Fim VARIAÇÃO T2, em 2017 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T3, em 2017, POR CONCELHOS -------------------////

var minVarT3Conc17 = 0;
var maxVarT3Conc17 = 0;

function CorVarT3Conc17_16(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -50   ? '#2288bf' :
                ''  ;
}

var legendaVarT3Conc17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T3 licenciados, entre 2017 e 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -30 a -25' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT3Conc17(feature) {
    if(feature.properties.VarT3_17 <= minVarT3Conc17){
        minVarT3Conc17 = feature.properties.VarT3_17
    }
    if(feature.properties.VarT3_17 > maxVarT3Conc17){
        maxVarT3Conc17 = feature.properties.VarT3_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT3Conc17_16(feature.properties.VarT3_17)};
    }


function apagarVarT3Conc17(e) {
    VarT3Conc17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT3Conc17(feature, layer) {
    if (feature.properties.VarT3_17 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT3_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT3Conc17,
    });
}
var VarT3Conc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT3Conc17,
    onEachFeature: onEachFeatureVarT3Conc17
});

let slideVarT3Conc17 = function(){
    var sliderVarT3Conc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 77){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT3Conc17, {
        start: [minVarT3Conc17, maxVarT3Conc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT3Conc17,
            'max': maxVarT3Conc17
        },
        });
    inputNumberMin.setAttribute("value",minVarT3Conc17);
    inputNumberMax.setAttribute("value",maxVarT3Conc17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT3Conc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT3Conc17.noUiSlider.set([null, this.value]);
    });

    sliderVarT3Conc17.noUiSlider.on('update',function(e){
        VarT3Conc17.eachLayer(function(layer){
            if (layer.feature.properties.VarT3_17 == null){
                return false
            }
            if(layer.feature.properties.VarT3_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT3_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT3Conc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 77;
    sliderAtivo = sliderVarT3Conc17.noUiSlider;
    $(slidersGeral).append(sliderVarT3Conc17);
} 

///////////////////////////// Fim VARIAÇÃO T3, em 2017 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T4, em 2017, POR CONCELHOS -------------------////

var minVarT4Conc17 = 0;
var maxVarT4Conc17 = 0;

function CorVarT4Conc17_16(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#ff5e6e' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#155273' :
                ''  ;
}

var legendaVarT4Conc17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T4 ou mais licenciados, entre 2017 e 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -100 a -50' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT4Conc17(feature) {
    if(feature.properties.VarT4_17 <= minVarT4Conc17){
        minVarT4Conc17 = feature.properties.VarT4_17
    }
    if(feature.properties.VarT4_17 > maxVarT4Conc17){
        maxVarT4Conc17 = feature.properties.VarT4_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT4Conc17_16(feature.properties.VarT4_17)};
    }


function apagarVarT4Conc17(e) {
    VarT4Conc17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT4Conc17(feature, layer) {
    if (feature.properties.VarT4_17 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT4_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT4Conc17,
    });
}
var VarT4Conc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT4Conc17,
    onEachFeature: onEachFeatureVarT4Conc17
});

let slideVarT4Conc17 = function(){
    var sliderVarT4Conc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 78){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT4Conc17, {
        start: [minVarT4Conc17, maxVarT4Conc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT4Conc17,
            'max': maxVarT4Conc17
        },
        });
    inputNumberMin.setAttribute("value",minVarT4Conc17);
    inputNumberMax.setAttribute("value",maxVarT4Conc17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT4Conc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT4Conc17.noUiSlider.set([null, this.value]);
    });

    sliderVarT4Conc17.noUiSlider.on('update',function(e){
        VarT4Conc17.eachLayer(function(layer){
            if (layer.feature.properties.VarT4_17 == null){
                return false
            }
            if(layer.feature.properties.VarT4_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT4_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT4Conc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 78;
    sliderAtivo = sliderVarT4Conc17.noUiSlider;
    $(slidersGeral).append(sliderVarT4Conc17);
} 

///////////////////////////// Fim VARIAÇÃO T4, em 2017 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Total, em 2018, POR CONCELHOS -------------------////

var minVarTotalConc18 = 0;
var maxVarTotalConc18 = 0;

function CorVarTotalConc18_17(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -40   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotalConc18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos licenciados, entre 2018 e 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -39.13 a 0' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalConc18(feature) {
    if(feature.properties.VarTot_18 <= minVarTotalConc18 || minVarTotalConc18 === 0){
        minVarTotalConc18 = feature.properties.VarTot_18
    }
    if(feature.properties.VarTot_18 > maxVarTotalConc18){
        maxVarTotalConc18 = feature.properties.VarTot_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConc18_17(feature.properties.VarTot_18)};
    }


function apagarVarTotalConc18(e) {
    VarTotalConc18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalConc18(feature, layer) {
    if (feature.properties.VarTot_18 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalConc18,
    });
}
var VarTotalConc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarTotalConc18,
    onEachFeature: onEachFeatureVarTotalConc18
});

let slideVarTotalConc18 = function(){
    var sliderVarTotalConc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 79){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalConc18, {
        start: [minVarTotalConc18, maxVarTotalConc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalConc18,
            'max': maxVarTotalConc18
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalConc18);
    inputNumberMax.setAttribute("value",maxVarTotalConc18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalConc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalConc18.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalConc18.noUiSlider.on('update',function(e){
        VarTotalConc18.eachLayer(function(layer){
            if (layer.feature.properties.VarTot_18 == null){
                return false
            }
            if(layer.feature.properties.VarTot_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalConc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 79;
    sliderAtivo = sliderVarTotalConc18.noUiSlider;
    $(slidersGeral).append(sliderVarTotalConc18);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2018 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T1, em 2018, POR CONCELHOS -------------------////

var minVarT1Conc18 = 0;
var maxVarT1Conc18 = 0;

function CorVarT1Conc18_17(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT1Conc18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T0 ou T1 licenciados, entre 2018 e 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT1Conc18(feature) {
    if(feature.properties.VarT1_18 <= minVarT1Conc18 || minVarT1Conc18 === 0){
        minVarT1Conc18 = feature.properties.VarT1_18
    }
    if(feature.properties.VarT1_18 > maxVarT1Conc18){
        maxVarT1Conc18 = feature.properties.VarT1_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT1Conc18_17(feature.properties.VarT1_18)};
    }


function apagarVarT1Conc18(e) {
    VarT1Conc18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT1Conc18(feature, layer) {
    if (feature.properties.VarT1_18 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT1_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT1Conc18,
    });
}
var VarT1Conc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT1Conc18,
    onEachFeature: onEachFeatureVarT1Conc18
});

let slideVarT1Conc18 = function(){
    var sliderVarT1Conc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 80){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT1Conc18, {
        start: [minVarT1Conc18, maxVarT1Conc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT1Conc18,
            'max': maxVarT1Conc18
        },
        });
    inputNumberMin.setAttribute("value",minVarT1Conc18);
    inputNumberMax.setAttribute("value",maxVarT1Conc18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT1Conc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT1Conc18.noUiSlider.set([null, this.value]);
    });

    sliderVarT1Conc18.noUiSlider.on('update',function(e){
        VarT1Conc18.eachLayer(function(layer){
            if (layer.feature.properties.VarT1_18 == null){
                return false
            }
            if(layer.feature.properties.VarT1_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT1_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT1Conc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 80;
    sliderAtivo = sliderVarT1Conc18.noUiSlider;
    $(slidersGeral).append(sliderVarT1Conc18);
} 

///////////////////////////// Fim VARIAÇÃO T1, em 2018 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T2, em 2018, POR CONCELHOS -------------------////

var minVarT2Conc18 = 0;
var maxVarT2Conc18 = 0;

function CorVarT2Conc18_17(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT2Conc18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T2 licenciados, entre 2018 e 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT2Conc18(feature) {
    if(feature.properties.VarT2_18 <= minVarT2Conc18){
        minVarT2Conc18 = feature.properties.VarT2_18
    }
    if(feature.properties.VarT2_18 > maxVarT2Conc18){
        maxVarT2Conc18 = feature.properties.VarT2_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT2Conc18_17(feature.properties.VarT2_18)};
    }


function apagarVarT2Conc18(e) {
    VarT2Conc18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT2Conc18(feature, layer) {
    if (feature.properties.VarT2_18 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT2_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT2Conc18,
    });
}
var VarT2Conc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT2Conc18,
    onEachFeature: onEachFeatureVarT2Conc18
});

let slideVarT2Conc18 = function(){
    var sliderVarT2Conc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 81){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT2Conc18, {
        start: [minVarT2Conc18, maxVarT2Conc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT2Conc18,
            'max': maxVarT2Conc18
        },
        });
    inputNumberMin.setAttribute("value",minVarT2Conc18);
    inputNumberMax.setAttribute("value",maxVarT2Conc18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT2Conc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT2Conc18.noUiSlider.set([null, this.value]);
    });

    sliderVarT2Conc18.noUiSlider.on('update',function(e){
        VarT2Conc18.eachLayer(function(layer){
            if (layer.feature.properties.VarT2_18 == null){
                return false
            }
            if(layer.feature.properties.VarT2_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT2_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT2Conc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 81;
    sliderAtivo = sliderVarT2Conc18.noUiSlider;
    $(slidersGeral).append(sliderVarT2Conc18);
} 

///////////////////////////// Fim VARIAÇÃO T2, em 2018 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T3, em 2018, POR CONCELHOS -------------------////

var minVarT3Conc18 = 0;
var maxVarT3Conc18 = 0;


function CorVarT3Conc18_17(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -24   ? '#9eaad7' :
                ''  ;
}

var legendaVarT3Conc18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T3 licenciados, entre 2018 e 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -23.08 a 0' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT3Conc18(feature) {
    if(feature.properties.VarT3_18 <= minVarT3Conc18){
        minVarT3Conc18 = feature.properties.VarT3_18
    }
    if(feature.properties.VarT3_18 > maxVarT3Conc18){
        maxVarT3Conc18 = feature.properties.VarT3_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT3Conc18_17(feature.properties.VarT3_18)};
    }


function apagarVarT3Conc18(e) {
    VarT3Conc18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT3Conc18(feature, layer) {
    if (feature.properties.VarT3_18 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT3_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT3Conc18,
    });
}
var VarT3Conc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT3Conc18,
    onEachFeature: onEachFeatureVarT3Conc18
});

let slideVarT3Conc18 = function(){
    var sliderVarT3Conc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 82){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT3Conc18, {
        start: [minVarT3Conc18, maxVarT3Conc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT3Conc18,
            'max': maxVarT3Conc18
        },
        });
    inputNumberMin.setAttribute("value",minVarT3Conc18);
    inputNumberMax.setAttribute("value",maxVarT3Conc18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT3Conc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT3Conc18.noUiSlider.set([null, this.value]);
    });

    sliderVarT3Conc18.noUiSlider.on('update',function(e){
        VarT3Conc18.eachLayer(function(layer){
            if (layer.feature.properties.VarT3_18 == null){
                return false
            }
            if(layer.feature.properties.VarT3_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT3_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT3Conc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 82;
    sliderAtivo = sliderVarT3Conc18.noUiSlider;
    $(slidersGeral).append(sliderVarT3Conc18);
} 

///////////////////////////// Fim VARIAÇÃO T3, em 2018 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T4, em 2018, POR CONCELHOS -------------------////

var minVarT4Conc18 = 0;
var maxVarT4Conc18 = 0;

function CorVarT4Conc18_17(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -58   ? '#155273' :
                ''  ;
}

var legendaVarT4Conc18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T4 ou mais licenciados, entre 2018 e 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -57.14 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT4Conc18(feature) {
    if(feature.properties.VarT4_18 <= minVarT4Conc18 || minVarT4Conc18 === 0){
        minVarT4Conc18 = feature.properties.VarT4_18
    }
    if(feature.properties.VarT4_18 > maxVarT4Conc18){
        maxVarT4Conc18 = feature.properties.VarT4_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT4Conc18_17(feature.properties.VarT4_18)};
    }


function apagarVarT4Conc18(e) {
    VarT4Conc18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT4Conc18(feature, layer) {
    if (feature.properties.VarT4_18 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT4_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT4Conc18,
    });
}
var VarT4Conc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT4Conc18,
    onEachFeature: onEachFeatureVarT4Conc18
});

let slideVarT4Conc18 = function(){
    var sliderVarT4Conc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 83){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT4Conc18, {
        start: [minVarT4Conc18, maxVarT4Conc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT4Conc18,
            'max': maxVarT4Conc18
        },
        });
    inputNumberMin.setAttribute("value",minVarT4Conc18);
    inputNumberMax.setAttribute("value",maxVarT4Conc18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT4Conc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT4Conc18.noUiSlider.set([null, this.value]);
    });

    sliderVarT4Conc18.noUiSlider.on('update',function(e){
        VarT4Conc18.eachLayer(function(layer){
            if (layer.feature.properties.VarT4_18 == null){
                return false
            }
            if(layer.feature.properties.VarT4_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT4_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT4Conc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 83;
    sliderAtivo = sliderVarT4Conc18.noUiSlider;
    $(slidersGeral).append(sliderVarT4Conc18);
} 

///////////////////////////// Fim VARIAÇÃO T4, em 2018 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Total, em 2019, POR CONCELHOS -------------------////

var minVarTotalConc19 = 0;
var maxVarTotalConc19 = 0;

function CorVarTotalConc19_18(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 75  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#9eaad7' :
        d >= -35   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotalConc19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos licenciados, entre 2019 e 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  75 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -34.44 a 0' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalConc19(feature) {
    if(feature.properties.VarTot_19 <= minVarTotalConc19 || minVarTotalConc19 === 0){
        minVarTotalConc19 = feature.properties.VarTot_19
    }
    if(feature.properties.VarTot_19 > maxVarTotalConc19){
        maxVarTotalConc19 = feature.properties.VarTot_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConc19_18(feature.properties.VarTot_19)};
    }


function apagarVarTotalConc19(e) {
    VarTotalConc19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalConc19(feature, layer) {
    if (feature.properties.VarTot_19 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalConc19,
    });
}
var VarTotalConc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarTotalConc19,
    onEachFeature: onEachFeatureVarTotalConc19
});

let slideVarTotalConc19 = function(){
    var sliderVarTotalConc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 84){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalConc19, {
        start: [minVarTotalConc19, maxVarTotalConc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalConc19,
            'max': maxVarTotalConc19
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalConc19);
    inputNumberMax.setAttribute("value",maxVarTotalConc19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalConc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalConc19.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalConc19.noUiSlider.on('update',function(e){
        VarTotalConc19.eachLayer(function(layer){
            if (layer.feature.properties.VarTot_19 == null){
                return false
            }
            if(layer.feature.properties.VarTot_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalConc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 84;
    sliderAtivo = sliderVarTotalConc19.noUiSlider;
    $(slidersGeral).append(sliderVarTotalConc19);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2019 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T1, em 2019, POR CONCELHOS -------------------////

var minVarT1Conc19 = 0;
var maxVarT1Conc19 = 0;

function CorVarT1Conc19_18(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT1Conc19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T0 ou T1 licenciados, entre 2019 e 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT1Conc19(feature) {
    if(feature.properties.VarT1_19 <= minVarT1Conc19){
        minVarT1Conc19 = feature.properties.VarT1_19
    }
    if(feature.properties.VarT1_19 > maxVarT1Conc19){
        maxVarT1Conc19 = feature.properties.VarT1_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT1Conc19_18(feature.properties.VarT1_19)};
    }


function apagarVarT1Conc19(e) {
    VarT1Conc19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT1Conc19(feature, layer) {
    if (feature.properties.VarT1_19 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT1_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT1Conc19,
    });
}
var VarT1Conc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT1Conc19,
    onEachFeature: onEachFeatureVarT1Conc19
});

let slideVarT1Conc19 = function(){
    var sliderVarT1Conc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 85){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT1Conc19, {
        start: [minVarT1Conc19, maxVarT1Conc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT1Conc19,
            'max': maxVarT1Conc19
        },
        });
    inputNumberMin.setAttribute("value",minVarT1Conc19);
    inputNumberMax.setAttribute("value",maxVarT1Conc19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT1Conc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT1Conc19.noUiSlider.set([null, this.value]);
    });

    sliderVarT1Conc19.noUiSlider.on('update',function(e){
        VarT1Conc19.eachLayer(function(layer){
            if (layer.feature.properties.VarT1_19 == null){
                return false
            }
            if(layer.feature.properties.VarT1_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT1_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT1Conc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 85;
    sliderAtivo = sliderVarT1Conc19.noUiSlider;
    $(slidersGeral).append(sliderVarT1Conc19);
} 

///////////////////////////// Fim VARIAÇÃO T1, em 2019 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T2, em 2019, POR CONCELHOS -------------------////

var minVarT2Conc19 = 0;
var maxVarT2Conc19 = 0;

function CorVarT2Conc19_18(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#ff5e6e' :
        d >= -25  ? '#9eaad7' :
        d >= -50   ? '#2288bf' :
                ''  ;
}

var legendaVarT2Conc19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T2 licenciados, entre 2019 e 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -49.18 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT2Conc19(feature) {
    if(feature.properties.VarT2_19 <= minVarT2Conc19){
        minVarT2Conc19 = feature.properties.VarT2_19
    }
    if(feature.properties.VarT2_19 > maxVarT2Conc19){
        maxVarT2Conc19 = feature.properties.VarT2_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT2Conc19_18(feature.properties.VarT2_19)};
    }


function apagarVarT2Conc19(e) {
    VarT2Conc19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT2Conc19(feature, layer) {
    if (feature.properties.VarT2_19 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT2_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT2Conc19,
    });
}
var VarT2Conc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT2Conc19,
    onEachFeature: onEachFeatureVarT2Conc19
});

let slideVarT2Conc19 = function(){
    var sliderVarT2Conc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 86){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT2Conc19, {
        start: [minVarT2Conc19, maxVarT2Conc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT2Conc19,
            'max': maxVarT2Conc19
        },
        });
    inputNumberMin.setAttribute("value",minVarT2Conc19);
    inputNumberMax.setAttribute("value",maxVarT2Conc19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT2Conc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT2Conc19.noUiSlider.set([null, this.value]);
    });

    sliderVarT2Conc19.noUiSlider.on('update',function(e){
        VarT2Conc19.eachLayer(function(layer){
            if (layer.feature.properties.VarT2_19 == null){
                return false
            }
            if(layer.feature.properties.VarT2_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT2_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT2Conc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 86;
    sliderAtivo = sliderVarT2Conc19.noUiSlider;
    $(slidersGeral).append(sliderVarT2Conc19);
} 

///////////////////////////// Fim VARIAÇÃO T2, em 2019 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T3, em 2019, POR CONCELHOS -------------------////

var minVarT3Conc19 = 0;
var maxVarT3Conc19 = 0;

function CorVarT3Conc19_18(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 25  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -50   ? '#2288bf' :
                ''  ;
}

var legendaVarT3Conc19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T3 licenciados, entre 2019 e 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  25 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -45.13 a -25' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarT3Conc19(feature) {
    if(feature.properties.VarT3_19 <= minVarT3Conc19){
        minVarT3Conc19 = feature.properties.VarT3_19
    }
    if(feature.properties.VarT3_19 > maxVarT3Conc19){
        maxVarT3Conc19 = feature.properties.VarT3_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT3Conc19_18(feature.properties.VarT3_19)};
    }


function apagarVarT3Conc19(e) {
    VarT3Conc19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT3Conc19(feature, layer) {
    if (feature.properties.VarT3_19 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT3_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT3Conc19,
    });
}
var VarT3Conc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT3Conc19,
    onEachFeature: onEachFeatureVarT3Conc19
});

let slideVarT3Conc19 = function(){
    var sliderVarT3Conc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 87){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT3Conc19, {
        start: [minVarT3Conc19, maxVarT3Conc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT3Conc19,
            'max': maxVarT3Conc19
        },
        });
    inputNumberMin.setAttribute("value",minVarT3Conc19);
    inputNumberMax.setAttribute("value",maxVarT3Conc19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT3Conc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT3Conc19.noUiSlider.set([null, this.value]);
    });

    sliderVarT3Conc19.noUiSlider.on('update',function(e){
        VarT3Conc19.eachLayer(function(layer){
            if (layer.feature.properties.VarT3_19 == null){
                return false
            }
            if(layer.feature.properties.VarT3_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT3_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT3Conc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 87;
    sliderAtivo = sliderVarT3Conc19.noUiSlider;
    $(slidersGeral).append(sliderVarT3Conc19);
} 

///////////////////////////// Fim VARIAÇÃO T3, em 2019 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T4, em 2019, POR CONCELHOS -------------------////

var minVarT4Conc19 = 0;
var maxVarT4Conc19 = 0;

function CorVarT4Conc19_18(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -30  ? '#9eaad7' :
        d >= -64   ? '#2288bf' :
                ''  ;
}

var legendaVarT4Conc19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T4 ou mais licenciados, entre 2019 e 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -30 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -63.16 a -30' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT4Conc19(feature) {
    if(feature.properties.VarT4_19 <= minVarT4Conc19){
        minVarT4Conc19 = feature.properties.VarT4_19
    }
    if(feature.properties.VarT4_19 > maxVarT4Conc19){
        maxVarT4Conc19 = feature.properties.VarT4_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT4Conc19_18(feature.properties.VarT4_19)};
    }


function apagarVarT4Conc19(e) {
    VarT4Conc19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT4Conc19(feature, layer) {
    if (feature.properties.VarT4_19 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT4_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT4Conc19,
    });
}
var VarT4Conc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT4Conc19,
    onEachFeature: onEachFeatureVarT4Conc19
});

let slideVarT4Conc19 = function(){
    var sliderVarT4Conc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 88){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT4Conc19, {
        start: [minVarT4Conc19, maxVarT4Conc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT4Conc19,
            'max': maxVarT4Conc19
        },
        });
    inputNumberMin.setAttribute("value",minVarT4Conc19);
    inputNumberMax.setAttribute("value",maxVarT4Conc19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT4Conc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT4Conc19.noUiSlider.set([null, this.value]);
    });

    sliderVarT4Conc19.noUiSlider.on('update',function(e){
        VarT4Conc19.eachLayer(function(layer){
            if (layer.feature.properties.VarT4_19 == null){
                return false
            }
            if(layer.feature.properties.VarT4_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT4_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT4Conc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 88;
    sliderAtivo = sliderVarT4Conc19.noUiSlider;
    $(slidersGeral).append(sliderVarT4Conc19);
} 

///////////////////////////// Fim VARIAÇÃO T4, em 2019 , POR CONCELHOS -------------- \\\\\


/////////////////////////////------- Variação Total, em 2020, POR CONCELHOS -------------------////

var minVarTotalConc20 = 0;
var maxVarTotalConc20 = 0;

function CorVarTotalConc20_19(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -50   ? '#2288bf' :
                ''  ;
}

var legendaVarTotalConc20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos licenciados, entre 2020 e 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -47.37 a -25' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalConc20(feature) {
    if(feature.properties.VarTot_20 <= minVarTotalConc20 || minVarTotalConc20 === 0){
        minVarTotalConc20 = feature.properties.VarTot_20
    }
    if(feature.properties.VarTot_20 > maxVarTotalConc20){
        maxVarTotalConc20 = feature.properties.VarTot_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConc20_19(feature.properties.VarTot_20)};
    }


function apagarVarTotalConc20(e) {
    VarTotalConc20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalConc20(feature, layer) {
    if (feature.properties.VarTot_20 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalConc20,
    });
}
var VarTotalConc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarTotalConc20,
    onEachFeature: onEachFeatureVarTotalConc20
});

let slideVarTotalConc20 = function(){
    var sliderVarTotalConc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 89){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalConc20, {
        start: [minVarTotalConc20, maxVarTotalConc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalConc20,
            'max': maxVarTotalConc20
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalConc20);
    inputNumberMax.setAttribute("value",maxVarTotalConc20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalConc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalConc20.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalConc20.noUiSlider.on('update',function(e){
        VarTotalConc20.eachLayer(function(layer){
            if (layer.feature.properties.VarTot_20 == null){
                return false
            }
            if(layer.feature.properties.VarTot_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalConc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 89;
    sliderAtivo = sliderVarTotalConc20.noUiSlider;
    $(slidersGeral).append(sliderVarTotalConc20);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2020 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T1, em 2020, POR CONCELHOS -------------------////

var minVarT1Conc20 = 0;
var maxVarT1Conc20 = 0;

function CorVarT1Conc20_19(d) {
    return d == null ? '#808080' :
        d >= 85  ? '#8c0303' :
        d >= 20  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -71   ? '#155273' :
                ''  ;
}

var legendaVarT1Conc20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T0 ou T1 licenciados, entre 2020 e 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 85' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  20 a 85' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -70 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT1Conc20(feature) {
    if(feature.properties.VarT1_20 <= minVarT1Conc20){
        minVarT1Conc20 = feature.properties.VarT1_20
    }
    if(feature.properties.VarT1_20 > maxVarT1Conc20){
        maxVarT1Conc20 = feature.properties.VarT1_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT1Conc20_19(feature.properties.VarT1_20)};
    }


function apagarVarT1Conc20(e) {
    VarT1Conc20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT1Conc20(feature, layer) {
    if (feature.properties.VarT1_20 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT1_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT1Conc20,
    });
}
var VarT1Conc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT1Conc20,
    onEachFeature: onEachFeatureVarT1Conc20
});

let slideVarT1Conc20 = function(){
    var sliderVarT1Conc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 90){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT1Conc20, {
        start: [minVarT1Conc20, maxVarT1Conc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT1Conc20,
            'max': maxVarT1Conc20
        },
        });
    inputNumberMin.setAttribute("value",minVarT1Conc20);
    inputNumberMax.setAttribute("value",maxVarT1Conc20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT1Conc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT1Conc20.noUiSlider.set([null, this.value]);
    });

    sliderVarT1Conc20.noUiSlider.on('update',function(e){
        VarT1Conc20.eachLayer(function(layer){
            if (layer.feature.properties.VarT1_20 == null){
                return false
            }
            if(layer.feature.properties.VarT1_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT1_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT1Conc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 90;
    sliderAtivo = sliderVarT1Conc20.noUiSlider;
    $(slidersGeral).append(sliderVarT1Conc20);
} 

///////////////////////////// Fim VARIAÇÃO T1, em 2020 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T2, em 2020, POR CONCELHOS -------------------////

var minVarT2Conc20 = 0;
var maxVarT2Conc20 = 0;

function CorVarT2Conc20_19(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 20  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -79   ? '#155273' :
                ''  ;
}

var legendaVarT2Conc20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T2 licenciados, entre 2020 e 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  20 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -78.57 a -50' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT2Conc20(feature) {
    if(feature.properties.VarT2_20 <= minVarT2Conc20 || minVarT2Conc20 === 0){
        minVarT2Conc20 = feature.properties.VarT2_20
    }
    if(feature.properties.VarT2_20 > maxVarT2Conc20){
        maxVarT2Conc20 = feature.properties.VarT2_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT2Conc20_19(feature.properties.VarT2_20)};
    }


function apagarVarT2Conc20(e) {
    VarT2Conc20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT2Conc20(feature, layer) {
    if (feature.properties.VarT2_20 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT2_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT2Conc20,
    });
}
var VarT2Conc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT2Conc20,
    onEachFeature: onEachFeatureVarT2Conc20
});

let slideVarT2Conc20 = function(){
    var sliderVarT2Conc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 91){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT2Conc20, {
        start: [minVarT2Conc20, maxVarT2Conc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT2Conc20,
            'max': maxVarT2Conc20
        },
        });
    inputNumberMin.setAttribute("value",minVarT2Conc20);
    inputNumberMax.setAttribute("value",maxVarT2Conc20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT2Conc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT2Conc20.noUiSlider.set([null, this.value]);
    });

    sliderVarT2Conc20.noUiSlider.on('update',function(e){
        VarT2Conc20.eachLayer(function(layer){
            if (layer.feature.properties.VarT2_20 == null){
                return false
            }
            if(layer.feature.properties.VarT2_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT2_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT2Conc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 91;
    sliderAtivo = sliderVarT2Conc20.noUiSlider;
    $(slidersGeral).append(sliderVarT2Conc20);
} 

///////////////////////////// Fim VARIAÇÃO T2, em 2020 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T3, em 2020, POR CONCELHOS -------------------////

var minVarT3Conc20 = 0;
var maxVarT3Conc20 = 0;

function CorVarT3Conc20_19(d) {
    return d == null ? '#808080' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -40   ? '#2288bf' :
                ''  ;
}

var legendaVarT3Conc20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T3 licenciados, entre 2020 e 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -39.52 a -25' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT3Conc20(feature) {
    if(feature.properties.VarT3_20 <= minVarT3Conc20){
        minVarT3Conc20 = feature.properties.VarT3_20
    }
    if(feature.properties.VarT3_20 > maxVarT3Conc20){
        maxVarT3Conc20 = feature.properties.VarT3_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT3Conc20_19(feature.properties.VarT3_20)};
    }


function apagarVarT3Conc20(e) {
    VarT3Conc20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT3Conc20(feature, layer) {
    if (feature.properties.VarT3_20 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT3_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT3Conc20,
    });
}
var VarT3Conc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT3Conc20,
    onEachFeature: onEachFeatureVarT3Conc20
});

let slideVarT3Conc20 = function(){
    var sliderVarT3Conc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 92){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT3Conc20, {
        start: [minVarT3Conc20, maxVarT3Conc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT3Conc20,
            'max': maxVarT3Conc20
        },
        });
    inputNumberMin.setAttribute("value",minVarT3Conc20);
    inputNumberMax.setAttribute("value",maxVarT3Conc20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT3Conc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT3Conc20.noUiSlider.set([null, this.value]);
    });

    sliderVarT3Conc20.noUiSlider.on('update',function(e){
        VarT3Conc20.eachLayer(function(layer){
            if (layer.feature.properties.VarT3_20 == null){
                return false
            }
            if(layer.feature.properties.VarT3_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT3_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT3Conc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 92;
    sliderAtivo = sliderVarT3Conc20.noUiSlider;
    $(slidersGeral).append(sliderVarT3Conc20);
} 

///////////////////////////// Fim VARIAÇÃO T3, em 2020 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação T4, em 2020, POR CONCELHOS -------------------////

var minVarT4Conc20 = 0;
var maxVarT4Conc20 = 0;

function CorVarT4Conc20_19(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -75   ? '#155273' :
                ''  ;
}

var legendaVarT4Conc20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T4 ou mais licenciados, entre 2020 e 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -72.73 a -25' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarT4Conc20(feature) {
    if(feature.properties.VarT4_20 <= minVarT4Conc20 || minVarT4Conc20 === 0){
        minVarT4Conc20 = feature.properties.VarT4_20
    }
    if(feature.properties.VarT4_20 > maxVarT4Conc20){
        maxVarT4Conc20 = feature.properties.VarT4_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT4Conc20_19(feature.properties.VarT4_20)};
    }


function apagarVarT4Conc20(e) {
    VarT4Conc20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT4Conc20(feature, layer) {
    if (feature.properties.VarT4_20 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT4_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT4Conc20,
    });
}
var VarT4Conc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarT4Conc20,
    onEachFeature: onEachFeatureVarT4Conc20
});

let slideVarT4Conc20 = function(){
    var sliderVarT4Conc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 93){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT4Conc20, {
        start: [minVarT4Conc20, maxVarT4Conc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT4Conc20,
            'max': maxVarT4Conc20
        },
        });
    inputNumberMin.setAttribute("value",minVarT4Conc20);
    inputNumberMax.setAttribute("value",maxVarT4Conc20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT4Conc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT4Conc20.noUiSlider.set([null, this.value]);
    });

    sliderVarT4Conc20.noUiSlider.on('update',function(e){
        VarT4Conc20.eachLayer(function(layer){
            if (layer.feature.properties.VarT4_20 == null){
                return false
            }
            if(layer.feature.properties.VarT4_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT4_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT4Conc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 93;
    sliderAtivo = sliderVarT4Conc20.noUiSlider;
    $(slidersGeral).append(sliderVarT4Conc20);
} 

///////////////////////////// Fim VARIAÇÃO T4, em 2020 , POR CONCELHOS -------------- \\\\\

//////////////////--------------- FIM CONCELHOS

///////////////////////////--------------------------- FREGUESIASS --------------\\\\\\\\\\\\\\\\\\\

////////////////////////////----------- TOTAL FOGOS LICENCIAADOS 2014,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalFogosFreg14 = 99999;
var maxTotalFogosFreg14 = 0;
function estiloTotalFogosFreg14(feature, latlng) {
    if(feature.properties.Fog_LTot14< minTotalFogosFreg14 || feature.properties.Fog_LTot14 ===0){
        minTotalFogosFreg14 = feature.properties.Fog_LTot14
    }
    if(feature.properties.Fog_LTot14> maxTotalFogosFreg14){
        maxTotalFogosFreg14 = feature.properties.Fog_LTot14
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_LTot14,2)
    });
}
function apagarTotalFogosFreg14(e){
    var layer = e.target;
    TotalFogosFreg14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFogosFreg14(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos licenciados: '  + '<b>'+ feature.properties.Fog_LTot14+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFogosFreg14,
    })
};

var TotalFogosFreg14= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloTotalFogosFreg14,
    onEachFeature: onEachFeatureTotalFogosFreg14,
});

var slideTotalFogosFreg14 = function(){
    var sliderTotalFogosFreg14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 94){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFogosFreg14, {
        start: [minTotalFogosFreg14, maxTotalFogosFreg14],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFogosFreg14,
            'max': maxTotalFogosFreg14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFogosFreg14);
    inputNumberMax.setAttribute("value",maxTotalFogosFreg14);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFogosFreg14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFogosFreg14.noUiSlider.set([null, this.value]);
    });

    sliderTotalFogosFreg14.noUiSlider.on('update',function(e){
        TotalFogosFreg14.eachLayer(function(layer){
            if(layer.feature.properties.Fog_LTot14>=parseFloat(e[0])&& layer.feature.properties.Fog_LTot14 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFogosFreg14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 94;
    sliderAtivo = sliderTotalFogosFreg14.noUiSlider;
    $(slidersGeral).append(sliderTotalFogosFreg14);
}
///////////////////////////---------- FIM TOTAL FOGOS LICENCIADOS EM 2014,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T0 E T1 2014,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT1Freg14 = 99999;
var maxFogosT1Freg14 = 0;
function estiloFogosT1Freg14(feature, latlng) {
    if(feature.properties.Fog_T114< minFogosT1Freg14 || feature.properties.Fog_T114 ===0){
        minFogosT1Freg14 = feature.properties.Fog_T114
    }
    if(feature.properties.Fog_T114> maxFogosT1Freg14){
        maxFogosT1Freg14 = feature.properties.Fog_T114
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T114,2)
    });
}
function apagarFogosT1Freg14(e){
    var layer = e.target;
    FogosT1Freg14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT1Freg14(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T0 ou T1 licenciados: '  + '<b>'+ feature.properties.Fog_T114+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT1Freg14,
    })
};

var FogosT1Freg14= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT1Freg14,
    onEachFeature: onEachFeatureFogosT1Freg14,
});

var slideFogosT1Freg14 = function(){
    var sliderFogosT1Freg14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 95){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT1Freg14, {
        start: [minFogosT1Freg14, maxFogosT1Freg14],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT1Freg14,
            'max': maxFogosT1Freg14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT1Freg14);
    inputNumberMax.setAttribute("value",maxFogosT1Freg14);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT1Freg14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT1Freg14.noUiSlider.set([null, this.value]);
    });

    sliderFogosT1Freg14.noUiSlider.on('update',function(e){
        FogosT1Freg14.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T114>=parseFloat(e[0])&& layer.feature.properties.Fog_T114 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT1Freg14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 95;
    sliderAtivo = sliderFogosT1Freg14.noUiSlider;
    $(slidersGeral).append(sliderFogosT1Freg14);
}
///////////////////////////---------- FIM FOGOS T0 OU T1 LICENCIADOS EM 2014,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T2 2014,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT2Freg14 = 99999;
var maxFogosT2Freg14 = 0;
function estiloFogosT2Freg14(feature, latlng) {
    if(feature.properties.Fog_T214< minFogosT2Freg14 || feature.properties.Fog_T214 ===0){
        minFogosT2Freg14 = feature.properties.Fog_T214
    }
    if(feature.properties.Fog_T214> maxFogosT2Freg14){
        maxFogosT2Freg14 = feature.properties.Fog_T214
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T214,2)
    });
}
function apagarFogosT2Freg14(e){
    var layer = e.target;
    FogosT2Freg14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT2Freg14(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T2 licenciados: '  + '<b>'+ feature.properties.Fog_T214+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT2Freg14,
    })
};

var FogosT2Freg14= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT2Freg14,
    onEachFeature: onEachFeatureFogosT2Freg14,
});

var slideFogosT2Freg14 = function(){
    var sliderFogosT2Freg14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 96){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT2Freg14, {
        start: [minFogosT2Freg14, maxFogosT2Freg14],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT2Freg14,
            'max': maxFogosT2Freg14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT2Freg14);
    inputNumberMax.setAttribute("value",maxFogosT2Freg14);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT2Freg14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT2Freg14.noUiSlider.set([null, this.value]);
    });

    sliderFogosT2Freg14.noUiSlider.on('update',function(e){
        FogosT2Freg14.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T214>=parseFloat(e[0])&& layer.feature.properties.Fog_T214 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT2Freg14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 96;
    sliderAtivo = sliderFogosT2Freg14.noUiSlider;
    $(slidersGeral).append(sliderFogosT2Freg14);
}
///////////////////////////---------- FIM FOGOS T2 LICENCIADOS EM 2014,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T3 2014,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT3Freg14 = 99999;
var maxFogosT3Freg14 = 0;
function estiloFogosT3Freg14(feature, latlng) {
    if(feature.properties.Fog_T314< minFogosT3Freg14 || feature.properties.Fog_T314 ===0){
        minFogosT3Freg14 = feature.properties.Fog_T314
    }
    if(feature.properties.Fog_T314> maxFogosT3Freg14){
        maxFogosT3Freg14 = feature.properties.Fog_T314
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T314,2)
    });
}
function apagarFogosT3Freg14(e){
    var layer = e.target;
    FogosT3Freg14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT3Freg14(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T3 licenciados: '  + '<b>'+ feature.properties.Fog_T314+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT3Freg14,
    })
};

var FogosT3Freg14= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT3Freg14,
    onEachFeature: onEachFeatureFogosT3Freg14,
});

var slideFogosT3Freg14 = function(){
    var sliderFogosT3Freg14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 97){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT3Freg14, {
        start: [minFogosT3Freg14, maxFogosT3Freg14],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT3Freg14,
            'max': maxFogosT3Freg14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT3Freg14);
    inputNumberMax.setAttribute("value",maxFogosT3Freg14);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT3Freg14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT3Freg14.noUiSlider.set([null, this.value]);
    });

    sliderFogosT3Freg14.noUiSlider.on('update',function(e){
        FogosT3Freg14.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T314>=parseFloat(e[0])&& layer.feature.properties.Fog_T314 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT3Freg14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 97;
    sliderAtivo = sliderFogosT3Freg14.noUiSlider;
    $(slidersGeral).append(sliderFogosT3Freg14);
}
///////////////////////////---------- FIM FOGOS T3 LICENCIADOS EM 2014,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T4 2014,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT4Freg14 = 99999;
var maxFogosT4Freg14 = 0;
function estiloFogosT4Freg14(feature, latlng) {
    if(feature.properties.Fog_T414< minFogosT4Freg14 || feature.properties.Fog_T414 ===0){
        minFogosT4Freg14 = feature.properties.Fog_T414
    }
    if(feature.properties.Fog_T414> maxFogosT4Freg14){
        maxFogosT4Freg14 = feature.properties.Fog_T414
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T414,2)
    });
}
function apagarFogosT4Freg14(e){
    var layer = e.target;
    FogosT4Freg14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT4Freg14(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T4 licenciados: '  + '<b>'+ feature.properties.Fog_T414+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT4Freg14,
    })
};

var FogosT4Freg14= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT4Freg14,
    onEachFeature: onEachFeatureFogosT4Freg14,
});

var slideFogosT4Freg14 = function(){
    var sliderFogosT4Freg14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 98){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT4Freg14, {
        start: [minFogosT4Freg14, maxFogosT4Freg14],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT4Freg14,
            'max': maxFogosT4Freg14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT4Freg14);
    inputNumberMax.setAttribute("value",maxFogosT4Freg14);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT4Freg14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT4Freg14.noUiSlider.set([null, this.value]);
    });

    sliderFogosT4Freg14.noUiSlider.on('update',function(e){
        FogosT4Freg14.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T414>=parseFloat(e[0])&& layer.feature.properties.Fog_T414 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT4Freg14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 98;
    sliderAtivo = sliderFogosT4Freg14.noUiSlider;
    $(slidersGeral).append(sliderFogosT4Freg14);
}
///////////////////////////---------- FIM FOGOS T4 LICENCIADOS EM 2014,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- TOTAL FOGOS LICENCIAADOS 2015,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalFogosFreg15 = 99999;
var maxTotalFogosFreg15 = 0;
function estiloTotalFogosFreg15(feature, latlng) {
    if(feature.properties.Fog_LTot15< minTotalFogosFreg15 || feature.properties.Fog_LTot15 ===0){
        minTotalFogosFreg15 = feature.properties.Fog_LTot15
    }
    if(feature.properties.Fog_LTot15> maxTotalFogosFreg15){
        maxTotalFogosFreg15 = feature.properties.Fog_LTot15
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_LTot15,2)
    });
}
function apagarTotalFogosFreg15(e){
    var layer = e.target;
    TotalFogosFreg15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFogosFreg15(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos licenciados: '  + '<b>'+ feature.properties.Fog_LTot15+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFogosFreg15,
    })
};

var TotalFogosFreg15= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloTotalFogosFreg15,
    onEachFeature: onEachFeatureTotalFogosFreg15,
});

var slideTotalFogosFreg15 = function(){
    var sliderTotalFogosFreg15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 99){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFogosFreg15, {
        start: [minTotalFogosFreg15, maxTotalFogosFreg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFogosFreg15,
            'max': maxTotalFogosFreg15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFogosFreg15);
    inputNumberMax.setAttribute("value",maxTotalFogosFreg15);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFogosFreg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFogosFreg15.noUiSlider.set([null, this.value]);
    });

    sliderTotalFogosFreg15.noUiSlider.on('update',function(e){
        TotalFogosFreg15.eachLayer(function(layer){
            if(layer.feature.properties.Fog_LTot15>=parseFloat(e[0])&& layer.feature.properties.Fog_LTot15 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFogosFreg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 99;
    sliderAtivo = sliderTotalFogosFreg15.noUiSlider;
    $(slidersGeral).append(sliderTotalFogosFreg15);
}
///////////////////////////---------- FIM TOTAL FOGOS LICENCIADOS EM 2015,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T0 E T1 2015,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT1Freg15 = 99999;
var maxFogosT1Freg15 = 0;
function estiloFogosT1Freg15(feature, latlng) {
    if(feature.properties.Fog_T115< minFogosT1Freg15 || feature.properties.Fog_T115 ===0){
        minFogosT1Freg15 = feature.properties.Fog_T115
    }
    if(feature.properties.Fog_T115> maxFogosT1Freg15){
        maxFogosT1Freg15 = feature.properties.Fog_T115
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T115,2)
    });
}
function apagarFogosT1Freg15(e){
    var layer = e.target;
    FogosT1Freg15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT1Freg15(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T0 ou T1 licenciados: '  + '<b>'+ feature.properties.Fog_T115+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT1Freg15,
    })
};

var FogosT1Freg15= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT1Freg15,
    onEachFeature: onEachFeatureFogosT1Freg15,
});

var slideFogosT1Freg15 = function(){
    var sliderFogosT1Freg15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 100){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT1Freg15, {
        start: [minFogosT1Freg15, maxFogosT1Freg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT1Freg15,
            'max': maxFogosT1Freg15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT1Freg15);
    inputNumberMax.setAttribute("value",maxFogosT1Freg15);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT1Freg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT1Freg15.noUiSlider.set([null, this.value]);
    });

    sliderFogosT1Freg15.noUiSlider.on('update',function(e){
        FogosT1Freg15.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T115>=parseFloat(e[0])&& layer.feature.properties.Fog_T115 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT1Freg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 100;
    sliderAtivo = sliderFogosT1Freg15.noUiSlider;
    $(slidersGeral).append(sliderFogosT1Freg15);
}
///////////////////////////---------- FIM FOGOS T0 OU T1 LICENCIADOS EM 2015,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T2 2015,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT2Freg15 = 99999;
var maxFogosT2Freg15 = 0;
function estiloFogosT2Freg15(feature, latlng) {
    if(feature.properties.Fog_T215< minFogosT2Freg15 || feature.properties.Fog_T215 ===0){
        minFogosT2Freg15 = feature.properties.Fog_T215
    }
    if(feature.properties.Fog_T215> maxFogosT2Freg15){
        maxFogosT2Freg15 = feature.properties.Fog_T215
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T215,2)
    });
}
function apagarFogosT2Freg15(e){
    var layer = e.target;
    FogosT2Freg15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT2Freg15(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T2 licenciados: '  + '<b>'+ feature.properties.Fog_T215+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT2Freg15,
    })
};

var FogosT2Freg15= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT2Freg15,
    onEachFeature: onEachFeatureFogosT2Freg15,
});

var slideFogosT2Freg15 = function(){
    var sliderFogosT2Freg15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 101){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT2Freg15, {
        start: [minFogosT2Freg15, maxFogosT2Freg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT2Freg15,
            'max': maxFogosT2Freg15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT2Freg15);
    inputNumberMax.setAttribute("value",maxFogosT2Freg15);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT2Freg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT2Freg15.noUiSlider.set([null, this.value]);
    });

    sliderFogosT2Freg15.noUiSlider.on('update',function(e){
        FogosT2Freg15.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T215>=parseFloat(e[0])&& layer.feature.properties.Fog_T215 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT2Freg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 101;
    sliderAtivo = sliderFogosT2Freg15.noUiSlider;
    $(slidersGeral).append(sliderFogosT2Freg15);
}
///////////////////////////---------- FIM FOGOS T2 LICENCIADOS EM 2015,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T3 2015,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT3Freg15 = 99999;
var maxFogosT3Freg15 = 0;
function estiloFogosT3Freg15(feature, latlng) {
    if(feature.properties.Fog_T315< minFogosT3Freg15 || feature.properties.Fog_T315 ===0){
        minFogosT3Freg15 = feature.properties.Fog_T315
    }
    if(feature.properties.Fog_T315> maxFogosT3Freg15){
        maxFogosT3Freg15 = feature.properties.Fog_T315
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T315,2)
    });
}
function apagarFogosT3Freg15(e){
    var layer = e.target;
    FogosT3Freg15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT3Freg15(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T3 licenciados: '  + '<b>'+ feature.properties.Fog_T315+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT3Freg15,
    })
};

var FogosT3Freg15= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT3Freg15,
    onEachFeature: onEachFeatureFogosT3Freg15,
});

var slideFogosT3Freg15 = function(){
    var sliderFogosT3Freg15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 102){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT3Freg15, {
        start: [minFogosT3Freg15, maxFogosT3Freg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT3Freg15,
            'max': maxFogosT3Freg15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT3Freg15);
    inputNumberMax.setAttribute("value",maxFogosT3Freg15);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT3Freg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT3Freg15.noUiSlider.set([null, this.value]);
    });

    sliderFogosT3Freg15.noUiSlider.on('update',function(e){
        FogosT3Freg15.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T315>=parseFloat(e[0])&& layer.feature.properties.Fog_T315 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT3Freg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 102;
    sliderAtivo = sliderFogosT3Freg15.noUiSlider;
    $(slidersGeral).append(sliderFogosT3Freg15);
}
///////////////////////////---------- FIM FOGOS T3 LICENCIADOS EM 2015,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T4 2015,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT4Freg15 = 99999;
var maxFogosT4Freg15 = 0;
function estiloFogosT4Freg15(feature, latlng) {
    if(feature.properties.Fog_T415< minFogosT4Freg15 || feature.properties.Fog_T415 ===0){
        minFogosT4Freg15 = feature.properties.Fog_T415
    }
    if(feature.properties.Fog_T415> maxFogosT4Freg15){
        maxFogosT4Freg15 = feature.properties.Fog_T415
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T415,1.8)
    });
}
function apagarFogosT4Freg15(e){
    var layer = e.target;
    FogosT4Freg15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT4Freg15(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T4 licenciados: '  + '<b>'+ feature.properties.Fog_T415+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT4Freg15,
    })
};

var FogosT4Freg15= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT4Freg15,
    onEachFeature: onEachFeatureFogosT4Freg15,
});

var slideFogosT4Freg15 = function(){
    var sliderFogosT4Freg15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 103){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT4Freg15, {
        start: [minFogosT4Freg15, maxFogosT4Freg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT4Freg15,
            'max': maxFogosT4Freg15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT4Freg15);
    inputNumberMax.setAttribute("value",maxFogosT4Freg15);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT4Freg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT4Freg15.noUiSlider.set([null, this.value]);
    });

    sliderFogosT4Freg15.noUiSlider.on('update',function(e){
        FogosT4Freg15.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T415>=parseFloat(e[0])&& layer.feature.properties.Fog_T415 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT4Freg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 103;
    sliderAtivo = sliderFogosT4Freg15.noUiSlider;
    $(slidersGeral).append(sliderFogosT4Freg15);
}
///////////////////////////---------- FIM FOGOS T4 LICENCIADOS EM 2015,Por Freguesia -----------\\\\\\\\\


////////////////////////////----------- TOTAL FOGOS LICENCIAADOS 2016,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalFogosFreg16 = 99999;
var maxTotalFogosFreg16 = 0;
function estiloTotalFogosFreg16(feature, latlng) {
    if(feature.properties.Fog_LTot16< minTotalFogosFreg16 || feature.properties.Fog_LTot16 ===0){
        minTotalFogosFreg16 = feature.properties.Fog_LTot16
    }
    if(feature.properties.Fog_LTot16> maxTotalFogosFreg16){
        maxTotalFogosFreg16 = feature.properties.Fog_LTot16
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_LTot16,2)
    });
}
function apagarTotalFogosFreg16(e){
    var layer = e.target;
    TotalFogosFreg16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFogosFreg16(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos licenciados: '  + '<b>'+ feature.properties.Fog_LTot16+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFogosFreg16,
    })
};

var TotalFogosFreg16= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloTotalFogosFreg16,
    onEachFeature: onEachFeatureTotalFogosFreg16,
});

var slideTotalFogosFreg16 = function(){
    var sliderTotalFogosFreg16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 104){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFogosFreg16, {
        start: [minTotalFogosFreg16, maxTotalFogosFreg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFogosFreg16,
            'max': maxTotalFogosFreg16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFogosFreg16);
    inputNumberMax.setAttribute("value",maxTotalFogosFreg16);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFogosFreg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFogosFreg16.noUiSlider.set([null, this.value]);
    });

    sliderTotalFogosFreg16.noUiSlider.on('update',function(e){
        TotalFogosFreg16.eachLayer(function(layer){
            if(layer.feature.properties.Fog_LTot16>=parseFloat(e[0])&& layer.feature.properties.Fog_LTot16 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFogosFreg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 104;
    sliderAtivo = sliderTotalFogosFreg16.noUiSlider;
    $(slidersGeral).append(sliderTotalFogosFreg16);
}
///////////////////////////---------- FIM TOTAL FOGOS LICENCIADOS EM 2016,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T0 E T1 2016,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT1Freg16 = 99999;
var maxFogosT1Freg16 = 0;
function estiloFogosT1Freg16(feature, latlng) {
    if(feature.properties.Fog_T116< minFogosT1Freg16 || feature.properties.Fog_T116 ===0){
        minFogosT1Freg16 = feature.properties.Fog_T116
    }
    if(feature.properties.Fog_T116> maxFogosT1Freg16){
        maxFogosT1Freg16 = feature.properties.Fog_T116
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T116,2)
    });
}
function apagarFogosT1Freg16(e){
    var layer = e.target;
    FogosT1Freg16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT1Freg16(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T0 ou T1 licenciados: '  + '<b>'+ feature.properties.Fog_T116+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT1Freg16,
    })
};

var FogosT1Freg16= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT1Freg16,
    onEachFeature: onEachFeatureFogosT1Freg16,
});

var slideFogosT1Freg16 = function(){
    var sliderFogosT1Freg16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 105){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT1Freg16, {
        start: [minFogosT1Freg16, maxFogosT1Freg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT1Freg16,
            'max': maxFogosT1Freg16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT1Freg16);
    inputNumberMax.setAttribute("value",maxFogosT1Freg16);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT1Freg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT1Freg16.noUiSlider.set([null, this.value]);
    });

    sliderFogosT1Freg16.noUiSlider.on('update',function(e){
        FogosT1Freg16.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T116>=parseFloat(e[0])&& layer.feature.properties.Fog_T116 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT1Freg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 105;
    sliderAtivo = sliderFogosT1Freg16.noUiSlider;
    $(slidersGeral).append(sliderFogosT1Freg16);
}
///////////////////////////---------- FIM FOGOS T0 OU T1 LICENCIADOS EM 2016,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T2 2016,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT2Freg16 = 99999;
var maxFogosT2Freg16 = 0;
function estiloFogosT2Freg16(feature, latlng) {
    if(feature.properties.Fog_T216< minFogosT2Freg16 || feature.properties.Fog_T216 ===0){
        minFogosT2Freg16 = feature.properties.Fog_T216
    }
    if(feature.properties.Fog_T216> maxFogosT2Freg16){
        maxFogosT2Freg16 = feature.properties.Fog_T216
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T216,2)
    });
}
function apagarFogosT2Freg16(e){
    var layer = e.target;
    FogosT2Freg16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT2Freg16(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T2 licenciados: '  + '<b>'+ feature.properties.Fog_T216+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT2Freg16,
    })
};

var FogosT2Freg16= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT2Freg16,
    onEachFeature: onEachFeatureFogosT2Freg16,
});

var slideFogosT2Freg16 = function(){
    var sliderFogosT2Freg16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 106){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT2Freg16, {
        start: [minFogosT2Freg16, maxFogosT2Freg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT2Freg16,
            'max': maxFogosT2Freg16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT2Freg16);
    inputNumberMax.setAttribute("value",maxFogosT2Freg16);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT2Freg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT2Freg16.noUiSlider.set([null, this.value]);
    });

    sliderFogosT2Freg16.noUiSlider.on('update',function(e){
        FogosT2Freg16.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T216>=parseFloat(e[0])&& layer.feature.properties.Fog_T216 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT2Freg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 106;
    sliderAtivo = sliderFogosT2Freg16.noUiSlider;
    $(slidersGeral).append(sliderFogosT2Freg16);
}
///////////////////////////---------- FIM FOGOS T2 LICENCIADOS EM 2016,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T3 2016,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT3Freg16 = 99999;
var maxFogosT3Freg16 = 0;
function estiloFogosT3Freg16(feature, latlng) {
    if(feature.properties.Fog_T316< minFogosT3Freg16 || feature.properties.Fog_T316 ===0){
        minFogosT3Freg16 = feature.properties.Fog_T316
    }
    if(feature.properties.Fog_T316> maxFogosT3Freg16){
        maxFogosT3Freg16 = feature.properties.Fog_T316
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T316,2)
    });
}
function apagarFogosT3Freg16(e){
    var layer = e.target;
    FogosT3Freg16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT3Freg16(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T3 licenciados: '  + '<b>'+ feature.properties.Fog_T316+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT3Freg16,
    })
};

var FogosT3Freg16= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT3Freg16,
    onEachFeature: onEachFeatureFogosT3Freg16,
});

var slideFogosT3Freg16 = function(){
    var sliderFogosT3Freg16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 107){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT3Freg16, {
        start: [minFogosT3Freg16, maxFogosT3Freg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT3Freg16,
            'max': maxFogosT3Freg16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT3Freg16);
    inputNumberMax.setAttribute("value",maxFogosT3Freg16);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT3Freg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT3Freg16.noUiSlider.set([null, this.value]);
    });

    sliderFogosT3Freg16.noUiSlider.on('update',function(e){
        FogosT3Freg16.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T316>=parseFloat(e[0])&& layer.feature.properties.Fog_T316 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT3Freg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 107;
    sliderAtivo = sliderFogosT3Freg16.noUiSlider;
    $(slidersGeral).append(sliderFogosT3Freg16);
}
///////////////////////////---------- FIM FOGOS T3 LICENCIADOS EM 2016,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T4 2016,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT4Freg16 = 99999;
var maxFogosT4Freg16 = 0;
function estiloFogosT4Freg16(feature, latlng) {
    if(feature.properties.Fog_T416< minFogosT4Freg16 || feature.properties.Fog_T416 ===0){
        minFogosT4Freg16 = feature.properties.Fog_T416
    }
    if(feature.properties.Fog_T416> maxFogosT4Freg16){
        maxFogosT4Freg16 = feature.properties.Fog_T416
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T416,2)
    });
}
function apagarFogosT4Freg16(e){
    var layer = e.target;
    FogosT4Freg16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT4Freg16(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T4 licenciados: '  + '<b>'+ feature.properties.Fog_T416+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT4Freg16,
    })
};

var FogosT4Freg16= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT4Freg16,
    onEachFeature: onEachFeatureFogosT4Freg16,
});

var slideFogosT4Freg16 = function(){
    var sliderFogosT4Freg16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 108){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT4Freg16, {
        start: [minFogosT4Freg16, maxFogosT4Freg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT4Freg16,
            'max': maxFogosT4Freg16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT4Freg16);
    inputNumberMax.setAttribute("value",maxFogosT4Freg16);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT4Freg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT4Freg16.noUiSlider.set([null, this.value]);
    });

    sliderFogosT4Freg16.noUiSlider.on('update',function(e){
        FogosT4Freg16.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T416>=parseFloat(e[0])&& layer.feature.properties.Fog_T416 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT4Freg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 108;
    sliderAtivo = sliderFogosT4Freg16.noUiSlider;
    $(slidersGeral).append(sliderFogosT4Freg16);
}
///////////////////////////---------- FIM FOGOS T4 LICENCIADOS EM 2016,Por Freguesia -----------\\\\\\\\\



////////////////////////////----------- TOTAL FOGOS LICENCIAADOS 2017,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalFogosFreg17 = 99999;
var maxTotalFogosFreg17 = 0;
function estiloTotalFogosFreg17(feature, latlng) {
    if(feature.properties.Fog_LTot17< minTotalFogosFreg17 || feature.properties.Fog_LTot17 ===0){
        minTotalFogosFreg17 = feature.properties.Fog_LTot17
    }
    if(feature.properties.Fog_LTot17> maxTotalFogosFreg17){
        maxTotalFogosFreg17 = feature.properties.Fog_LTot17
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_LTot17,2)
    });
}
function apagarTotalFogosFreg17(e){
    var layer = e.target;
    TotalFogosFreg17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFogosFreg17(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos licenciados: '  + '<b>'+ feature.properties.Fog_LTot17+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFogosFreg17,
    })
};

var TotalFogosFreg17= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloTotalFogosFreg17,
    onEachFeature: onEachFeatureTotalFogosFreg17,
});

var slideTotalFogosFreg17 = function(){
    var sliderTotalFogosFreg17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 109){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFogosFreg17, {
        start: [minTotalFogosFreg17, maxTotalFogosFreg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFogosFreg17,
            'max': maxTotalFogosFreg17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFogosFreg17);
    inputNumberMax.setAttribute("value",maxTotalFogosFreg17);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFogosFreg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFogosFreg17.noUiSlider.set([null, this.value]);
    });

    sliderTotalFogosFreg17.noUiSlider.on('update',function(e){
        TotalFogosFreg17.eachLayer(function(layer){
            if(layer.feature.properties.Fog_LTot17>=parseFloat(e[0])&& layer.feature.properties.Fog_LTot17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFogosFreg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 109;
    sliderAtivo = sliderTotalFogosFreg17.noUiSlider;
    $(slidersGeral).append(sliderTotalFogosFreg17);
}
///////////////////////////---------- FIM TOTAL FOGOS LICENCIADOS EM 2017,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T0 E T1 2017,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT1Freg17 = 99999;
var maxFogosT1Freg17 = 0;
function estiloFogosT1Freg17(feature, latlng) {
    if(feature.properties.Fog_T117< minFogosT1Freg17 || feature.properties.Fog_T117 ===0){
        minFogosT1Freg17 = feature.properties.Fog_T117
    }
    if(feature.properties.Fog_T117> maxFogosT1Freg17){
        maxFogosT1Freg17 = feature.properties.Fog_T117
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T117,2)
    });
}
function apagarFogosT1Freg17(e){
    var layer = e.target;
    FogosT1Freg17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT1Freg17(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T0 ou T1 licenciados: '  + '<b>'+ feature.properties.Fog_T117+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT1Freg17,
    })
};

var FogosT1Freg17= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT1Freg17,
    onEachFeature: onEachFeatureFogosT1Freg17,
});

var slideFogosT1Freg17 = function(){
    var sliderFogosT1Freg17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 110){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT1Freg17, {
        start: [minFogosT1Freg17, maxFogosT1Freg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT1Freg17,
            'max': maxFogosT1Freg17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT1Freg17);
    inputNumberMax.setAttribute("value",maxFogosT1Freg17);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT1Freg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT1Freg17.noUiSlider.set([null, this.value]);
    });

    sliderFogosT1Freg17.noUiSlider.on('update',function(e){
        FogosT1Freg17.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T117>=parseFloat(e[0])&& layer.feature.properties.Fog_T117 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT1Freg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 110;
    sliderAtivo = sliderFogosT1Freg17.noUiSlider;
    $(slidersGeral).append(sliderFogosT1Freg17);
}
///////////////////////////---------- FIM FOGOS T0 OU T1 LICENCIADOS EM 2017,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T2 2017,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT2Freg17 = 99999;
var maxFogosT2Freg17 = 0;
function estiloFogosT2Freg17(feature, latlng) {
    if(feature.properties.Fog_T217< minFogosT2Freg17 || feature.properties.Fog_T217 ===0){
        minFogosT2Freg17 = feature.properties.Fog_T217
    }
    if(feature.properties.Fog_T217> maxFogosT2Freg17){
        maxFogosT2Freg17 = feature.properties.Fog_T217
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T217,2)
    });
}
function apagarFogosT2Freg17(e){
    var layer = e.target;
    FogosT2Freg17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT2Freg17(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T2 licenciados: '  + '<b>'+ feature.properties.Fog_T217+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT2Freg17,
    })
};

var FogosT2Freg17= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT2Freg17,
    onEachFeature: onEachFeatureFogosT2Freg17,
});

var slideFogosT2Freg17 = function(){
    var sliderFogosT2Freg17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 111){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT2Freg17, {
        start: [minFogosT2Freg17, maxFogosT2Freg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT2Freg17,
            'max': maxFogosT2Freg17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT2Freg17);
    inputNumberMax.setAttribute("value",maxFogosT2Freg17);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT2Freg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT2Freg17.noUiSlider.set([null, this.value]);
    });

    sliderFogosT2Freg17.noUiSlider.on('update',function(e){
        FogosT2Freg17.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T217>=parseFloat(e[0])&& layer.feature.properties.Fog_T217 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT2Freg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 111;
    sliderAtivo = sliderFogosT2Freg17.noUiSlider;
    $(slidersGeral).append(sliderFogosT2Freg17);
}
///////////////////////////---------- FIM FOGOS T2 LICENCIADOS EM 2017,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T3 2017,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT3Freg17 = 99999;
var maxFogosT3Freg17 = 0;
function estiloFogosT3Freg17(feature, latlng) {
    if(feature.properties.Fog_T317< minFogosT3Freg17 || feature.properties.Fog_T317 ===0){
        minFogosT3Freg17 = feature.properties.Fog_T317
    }
    if(feature.properties.Fog_T317> maxFogosT3Freg17){
        maxFogosT3Freg17 = feature.properties.Fog_T317
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T317,2)
    });
}
function apagarFogosT3Freg17(e){
    var layer = e.target;
    FogosT3Freg17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT3Freg17(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T3 licenciados: '  + '<b>'+ feature.properties.Fog_T317+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT3Freg17,
    })
};

var FogosT3Freg17= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT3Freg17,
    onEachFeature: onEachFeatureFogosT3Freg17,
});

var slideFogosT3Freg17 = function(){
    var sliderFogosT3Freg17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 112){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT3Freg17, {
        start: [minFogosT3Freg17, maxFogosT3Freg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT3Freg17,
            'max': maxFogosT3Freg17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT3Freg17);
    inputNumberMax.setAttribute("value",maxFogosT3Freg17);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT3Freg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT3Freg17.noUiSlider.set([null, this.value]);
    });

    sliderFogosT3Freg17.noUiSlider.on('update',function(e){
        FogosT3Freg17.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T317>=parseFloat(e[0])&& layer.feature.properties.Fog_T317 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT3Freg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 112;
    sliderAtivo = sliderFogosT3Freg17.noUiSlider;
    $(slidersGeral).append(sliderFogosT3Freg17);
}
///////////////////////////---------- FIM FOGOS T3 LICENCIADOS EM 2017,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T4 2017,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT4Freg17 = 99999;
var maxFogosT4Freg17 = 0;
function estiloFogosT4Freg17(feature, latlng) {
    if(feature.properties.Fog_T417< minFogosT4Freg17 || feature.properties.Fog_T417 ===0){
        minFogosT4Freg17 = feature.properties.Fog_T417
    }
    if(feature.properties.Fog_T417> maxFogosT4Freg17){
        maxFogosT4Freg17 = feature.properties.Fog_T417
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T417,2)
    });
}
function apagarFogosT4Freg17(e){
    var layer = e.target;
    FogosT4Freg17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT4Freg17(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T4 licenciados: '  + '<b>'+ feature.properties.Fog_T417+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT4Freg17,
    })
};

var FogosT4Freg17= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT4Freg17,
    onEachFeature: onEachFeatureFogosT4Freg17,
});

var slideFogosT4Freg17 = function(){
    var sliderFogosT4Freg17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 113){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT4Freg17, {
        start: [minFogosT4Freg17, maxFogosT4Freg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT4Freg17,
            'max': maxFogosT4Freg17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT4Freg17);
    inputNumberMax.setAttribute("value",maxFogosT4Freg17);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT4Freg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT4Freg17.noUiSlider.set([null, this.value]);
    });

    sliderFogosT4Freg17.noUiSlider.on('update',function(e){
        FogosT4Freg17.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T417>=parseFloat(e[0])&& layer.feature.properties.Fog_T417 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT4Freg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 113;
    sliderAtivo = sliderFogosT4Freg17.noUiSlider;
    $(slidersGeral).append(sliderFogosT4Freg17);
}
///////////////////////////---------- FIM FOGOS T4 LICENCIADOS EM 2017,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- TOTAL FOGOS LICENCIAADOS 2018,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalFogosFreg18 = 99999;
var maxTotalFogosFreg18 = 0;
function estiloTotalFogosFreg18(feature, latlng) {
    if(feature.properties.Fog_LTot18< minTotalFogosFreg18 || feature.properties.Fog_LTot18 ===0){
        minTotalFogosFreg18 = feature.properties.Fog_LTot18
    }
    if(feature.properties.Fog_LTot18> maxTotalFogosFreg18){
        maxTotalFogosFreg18 = feature.properties.Fog_LTot18
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_LTot18,2)
    });
}
function apagarTotalFogosFreg18(e){
    var layer = e.target;
    TotalFogosFreg18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFogosFreg18(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos licenciados: '  + '<b>'+ feature.properties.Fog_LTot18+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFogosFreg18,
    })
};

var TotalFogosFreg18= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloTotalFogosFreg18,
    onEachFeature: onEachFeatureTotalFogosFreg18,
});

var slideTotalFogosFreg18 = function(){
    var sliderTotalFogosFreg18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 114){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFogosFreg18, {
        start: [minTotalFogosFreg18, maxTotalFogosFreg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFogosFreg18,
            'max': maxTotalFogosFreg18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFogosFreg18);
    inputNumberMax.setAttribute("value",maxTotalFogosFreg18);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFogosFreg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFogosFreg18.noUiSlider.set([null, this.value]);
    });

    sliderTotalFogosFreg18.noUiSlider.on('update',function(e){
        TotalFogosFreg18.eachLayer(function(layer){
            if(layer.feature.properties.Fog_LTot18>=parseFloat(e[0])&& layer.feature.properties.Fog_LTot18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFogosFreg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 114;
    sliderAtivo = sliderTotalFogosFreg18.noUiSlider;
    $(slidersGeral).append(sliderTotalFogosFreg18);
}
///////////////////////////---------- FIM TOTAL FOGOS LICENCIADOS EM 2018,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T0 E T1 2018,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT1Freg18 = 99999;
var maxFogosT1Freg18 = 0;
function estiloFogosT1Freg18(feature, latlng) {
    if(feature.properties.Fog_T118< minFogosT1Freg18 || feature.properties.Fog_T118 ===0){
        minFogosT1Freg18 = feature.properties.Fog_T118
    }
    if(feature.properties.Fog_T118> maxFogosT1Freg18){
        maxFogosT1Freg18 = feature.properties.Fog_T118
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T118,2)
    });
}
function apagarFogosT1Freg18(e){
    var layer = e.target;
    FogosT1Freg18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT1Freg18(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T0 ou T1 licenciados: '  + '<b>'+ feature.properties.Fog_T118+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT1Freg18,
    })
};

var FogosT1Freg18= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT1Freg18,
    onEachFeature: onEachFeatureFogosT1Freg18,
});

var slideFogosT1Freg18 = function(){
    var sliderFogosT1Freg18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 115){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT1Freg18, {
        start: [minFogosT1Freg18, maxFogosT1Freg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT1Freg18,
            'max': maxFogosT1Freg18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT1Freg18);
    inputNumberMax.setAttribute("value",maxFogosT1Freg18);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT1Freg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT1Freg18.noUiSlider.set([null, this.value]);
    });

    sliderFogosT1Freg18.noUiSlider.on('update',function(e){
        FogosT1Freg18.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T118>=parseFloat(e[0])&& layer.feature.properties.Fog_T118 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT1Freg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 115;
    sliderAtivo = sliderFogosT1Freg18.noUiSlider;
    $(slidersGeral).append(sliderFogosT1Freg18);
}
///////////////////////////---------- FIM FOGOS T0 OU T1 LICENCIADOS EM 2018,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T2 2018,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT2Freg18 = 99999;
var maxFogosT2Freg18 = 0;
function estiloFogosT2Freg18(feature, latlng) {
    if(feature.properties.Fog_T218< minFogosT2Freg18 || feature.properties.Fog_T218 ===0){
        minFogosT2Freg18 = feature.properties.Fog_T218
    }
    if(feature.properties.Fog_T218> maxFogosT2Freg18){
        maxFogosT2Freg18 = feature.properties.Fog_T218
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T218,2)
    });
}
function apagarFogosT2Freg18(e){
    var layer = e.target;
    FogosT2Freg18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT2Freg18(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T2 licenciados: '  + '<b>'+ feature.properties.Fog_T218+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT2Freg18,
    })
};

var FogosT2Freg18= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT2Freg18,
    onEachFeature: onEachFeatureFogosT2Freg18,
});

var slideFogosT2Freg18 = function(){
    var sliderFogosT2Freg18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 116){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT2Freg18, {
        start: [minFogosT2Freg18, maxFogosT2Freg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT2Freg18,
            'max': maxFogosT2Freg18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT2Freg18);
    inputNumberMax.setAttribute("value",maxFogosT2Freg18);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT2Freg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT2Freg18.noUiSlider.set([null, this.value]);
    });

    sliderFogosT2Freg18.noUiSlider.on('update',function(e){
        FogosT2Freg18.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T218>=parseFloat(e[0])&& layer.feature.properties.Fog_T218 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT2Freg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 116;
    sliderAtivo = sliderFogosT2Freg18.noUiSlider;
    $(slidersGeral).append(sliderFogosT2Freg18);
}
///////////////////////////---------- FIM FOGOS T2 LICENCIADOS EM 2018,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T3 2018,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT3Freg18 = 99999;
var maxFogosT3Freg18 = 0;
function estiloFogosT3Freg18(feature, latlng) {
    if(feature.properties.Fog_T318< minFogosT3Freg18 || feature.properties.Fog_T318 ===0){
        minFogosT3Freg18 = feature.properties.Fog_T318
    }
    if(feature.properties.Fog_T318> maxFogosT3Freg18){
        maxFogosT3Freg18 = feature.properties.Fog_T318
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T318,2)
    });
}
function apagarFogosT3Freg18(e){
    var layer = e.target;
    FogosT3Freg18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT3Freg18(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T3 licenciados: '  + '<b>'+ feature.properties.Fog_T318+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT3Freg18,
    })
};

var FogosT3Freg18= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT3Freg18,
    onEachFeature: onEachFeatureFogosT3Freg18,
});

var slideFogosT3Freg18 = function(){
    var sliderFogosT3Freg18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 250){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT3Freg18, {
        start: [minFogosT3Freg18, maxFogosT3Freg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT3Freg18,
            'max': maxFogosT3Freg18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT3Freg18);
    inputNumberMax.setAttribute("value",maxFogosT3Freg18);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT3Freg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT3Freg18.noUiSlider.set([null, this.value]);
    });

    sliderFogosT3Freg18.noUiSlider.on('update',function(e){
        FogosT3Freg18.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T318>=parseFloat(e[0])&& layer.feature.properties.Fog_T318 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT3Freg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 250;
    sliderAtivo = sliderFogosT3Freg18.noUiSlider;
    $(slidersGeral).append(sliderFogosT3Freg18);
}
///////////////////////////---------- FIM FOGOS T3 LICENCIADOS EM 2018,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T4 2018,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT4Freg18 = 99999;
var maxFogosT4Freg18 = 0;
function estiloFogosT4Freg18(feature, latlng) {
    if(feature.properties.Fog_T418< minFogosT4Freg18 || feature.properties.Fog_T418 ===0){
        minFogosT4Freg18 = feature.properties.Fog_T418
    }
    if(feature.properties.Fog_T418> maxFogosT4Freg18){
        maxFogosT4Freg18 = feature.properties.Fog_T418
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T418,2)
    });
}
function apagarFogosT4Freg18(e){
    var layer = e.target;
    FogosT4Freg18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT4Freg18(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T4 licenciados: '  + '<b>'+ feature.properties.Fog_T418+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT4Freg18,
    })
};

var FogosT4Freg18= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT4Freg18,
    onEachFeature: onEachFeatureFogosT4Freg18,
});

var slideFogosT4Freg18 = function(){
    var sliderFogosT4Freg18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 118){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT4Freg18, {
        start: [minFogosT4Freg18, maxFogosT4Freg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT4Freg18,
            'max': maxFogosT4Freg18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT4Freg18);
    inputNumberMax.setAttribute("value",maxFogosT4Freg18);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT4Freg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT4Freg18.noUiSlider.set([null, this.value]);
    });

    sliderFogosT4Freg18.noUiSlider.on('update',function(e){
        FogosT4Freg18.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T418>=parseFloat(e[0])&& layer.feature.properties.Fog_T418 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT4Freg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 118;
    sliderAtivo = sliderFogosT4Freg18.noUiSlider;
    $(slidersGeral).append(sliderFogosT4Freg18);
}
///////////////////////////---------- FIM FOGOS T4 LICENCIADOS EM 2018,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- TOTAL FOGOS LICENCIAADOS 2019,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalFogosFreg19 = 99999;
var maxTotalFogosFreg19 = 0;
function estiloTotalFogosFreg19(feature, latlng) {
    if(feature.properties.Fog_LTot19< minTotalFogosFreg19 || feature.properties.Fog_LTot19 ===0){
        minTotalFogosFreg19 = feature.properties.Fog_LTot19
    }
    if(feature.properties.Fog_LTot19> maxTotalFogosFreg19){
        maxTotalFogosFreg19 = feature.properties.Fog_LTot19
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_LTot19,2)
    });
}
function apagarTotalFogosFreg19(e){
    var layer = e.target;
    TotalFogosFreg19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFogosFreg19(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos licenciados: '  + '<b>'+ feature.properties.Fog_LTot19+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFogosFreg19,
    })
};

var TotalFogosFreg19= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloTotalFogosFreg19,
    onEachFeature: onEachFeatureTotalFogosFreg19,
});

var slideTotalFogosFreg19 = function(){
    var sliderTotalFogosFreg19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 119){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFogosFreg19, {
        start: [minTotalFogosFreg19, maxTotalFogosFreg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFogosFreg19,
            'max': maxTotalFogosFreg19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFogosFreg19);
    inputNumberMax.setAttribute("value",maxTotalFogosFreg19);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFogosFreg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFogosFreg19.noUiSlider.set([null, this.value]);
    });

    sliderTotalFogosFreg19.noUiSlider.on('update',function(e){
        TotalFogosFreg19.eachLayer(function(layer){
            if(layer.feature.properties.Fog_LTot19>=parseFloat(e[0])&& layer.feature.properties.Fog_LTot19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFogosFreg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 119;
    sliderAtivo = sliderTotalFogosFreg19.noUiSlider;
    $(slidersGeral).append(sliderTotalFogosFreg19);
}
///////////////////////////---------- FIM TOTAL FOGOS LICENCIADOS EM 2019,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T0 E T1 2019,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT1Freg19 = 99999;
var maxFogosT1Freg19 = 0;
function estiloFogosT1Freg19(feature, latlng) {
    if(feature.properties.Fog_T119< minFogosT1Freg19 || feature.properties.Fog_T119 ===0){
        minFogosT1Freg19 = feature.properties.Fog_T119
    }
    if(feature.properties.Fog_T119> maxFogosT1Freg19){
        maxFogosT1Freg19 = feature.properties.Fog_T119
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T119,2)
    });
}
function apagarFogosT1Freg19(e){
    var layer = e.target;
    FogosT1Freg19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT1Freg19(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T0 ou T1 licenciados: '  + '<b>'+ feature.properties.Fog_T119+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT1Freg19,
    })
};

var FogosT1Freg19= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT1Freg19,
    onEachFeature: onEachFeatureFogosT1Freg19,
});

var slideFogosT1Freg19 = function(){
    var sliderFogosT1Freg19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 120){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT1Freg19, {
        start: [minFogosT1Freg19, maxFogosT1Freg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT1Freg19,
            'max': maxFogosT1Freg19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT1Freg19);
    inputNumberMax.setAttribute("value",maxFogosT1Freg19);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT1Freg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT1Freg19.noUiSlider.set([null, this.value]);
    });

    sliderFogosT1Freg19.noUiSlider.on('update',function(e){
        FogosT1Freg19.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T119>=parseFloat(e[0])&& layer.feature.properties.Fog_T119 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT1Freg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 120;
    sliderAtivo = sliderFogosT1Freg19.noUiSlider;
    $(slidersGeral).append(sliderFogosT1Freg19);
}
///////////////////////////---------- FIM FOGOS T0 OU T1 LICENCIADOS EM 2019,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T2 2019,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT2Freg19 = 99999;
var maxFogosT2Freg19 = 0;
function estiloFogosT2Freg19(feature, latlng) {
    if(feature.properties.Fog_T219< minFogosT2Freg19 || feature.properties.Fog_T219 ===0){
        minFogosT2Freg19 = feature.properties.Fog_T219
    }
    if(feature.properties.Fog_T219> maxFogosT2Freg19){
        maxFogosT2Freg19 = feature.properties.Fog_T219
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T219,2)
    });
}
function apagarFogosT2Freg19(e){
    var layer = e.target;
    FogosT2Freg19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT2Freg19(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T2 licenciados: '  + '<b>'+ feature.properties.Fog_T219+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT2Freg19,
    })
};

var FogosT2Freg19= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT2Freg19,
    onEachFeature: onEachFeatureFogosT2Freg19,
});

var slideFogosT2Freg19 = function(){
    var sliderFogosT2Freg19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 121){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT2Freg19, {
        start: [minFogosT2Freg19, maxFogosT2Freg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT2Freg19,
            'max': maxFogosT2Freg19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT2Freg19);
    inputNumberMax.setAttribute("value",maxFogosT2Freg19);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT2Freg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT2Freg19.noUiSlider.set([null, this.value]);
    });

    sliderFogosT2Freg19.noUiSlider.on('update',function(e){
        FogosT2Freg19.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T219>=parseFloat(e[0])&& layer.feature.properties.Fog_T219 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT2Freg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 121;
    sliderAtivo = sliderFogosT2Freg19.noUiSlider;
    $(slidersGeral).append(sliderFogosT2Freg19);
}
///////////////////////////---------- FIM FOGOS T2 LICENCIADOS EM 2019,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T3 2019,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT3Freg19 = 99999;
var maxFogosT3Freg19 = 0;
function estiloFogosT3Freg19(feature, latlng) {
    if(feature.properties.Fog_T319< minFogosT3Freg19 || feature.properties.Fog_T319 ===0){
        minFogosT3Freg19 = feature.properties.Fog_T319
    }
    if(feature.properties.Fog_T319> maxFogosT3Freg19){
        maxFogosT3Freg19 = feature.properties.Fog_T319
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T319,2)
    });
}
function apagarFogosT3Freg19(e){
    var layer = e.target;
    FogosT3Freg19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT3Freg19(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T3 licenciados: '  + '<b>'+ feature.properties.Fog_T319+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT3Freg19,
    })
};

var FogosT3Freg19= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT3Freg19,
    onEachFeature: onEachFeatureFogosT3Freg19,
});

var slideFogosT3Freg19 = function(){
    var sliderFogosT3Freg19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 122){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT3Freg19, {
        start: [minFogosT3Freg19, maxFogosT3Freg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT3Freg19,
            'max': maxFogosT3Freg19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT3Freg19);
    inputNumberMax.setAttribute("value",maxFogosT3Freg19);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT3Freg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT3Freg19.noUiSlider.set([null, this.value]);
    });

    sliderFogosT3Freg19.noUiSlider.on('update',function(e){
        FogosT3Freg19.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T319>=parseFloat(e[0])&& layer.feature.properties.Fog_T319 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT3Freg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 122;
    sliderAtivo = sliderFogosT3Freg19.noUiSlider;
    $(slidersGeral).append(sliderFogosT3Freg19);
}
///////////////////////////---------- FIM FOGOS T3 LICENCIADOS EM 2019,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T4 2019,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT4Freg19 = 99999;
var maxFogosT4Freg19 = 0;
function estiloFogosT4Freg19(feature, latlng) {
    if(feature.properties.Fog_T419< minFogosT4Freg19 || feature.properties.Fog_T419 ===0){
        minFogosT4Freg19 = feature.properties.Fog_T419
    }
    if(feature.properties.Fog_T419> maxFogosT4Freg19){
        maxFogosT4Freg19 = feature.properties.Fog_T419
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T419,2)
    });
}
function apagarFogosT4Freg19(e){
    var layer = e.target;
    FogosT4Freg19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT4Freg19(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T4 licenciados: '  + '<b>'+ feature.properties.Fog_T419+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT4Freg19,
    })
};

var FogosT4Freg19= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT4Freg19,
    onEachFeature: onEachFeatureFogosT4Freg19,
});

var slideFogosT4Freg19 = function(){
    var sliderFogosT4Freg19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 123){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT4Freg19, {
        start: [minFogosT4Freg19, maxFogosT4Freg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT4Freg19,
            'max': maxFogosT4Freg19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT4Freg19);
    inputNumberMax.setAttribute("value",maxFogosT4Freg19);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT4Freg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT4Freg19.noUiSlider.set([null, this.value]);
    });

    sliderFogosT4Freg19.noUiSlider.on('update',function(e){
        FogosT4Freg19.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T419>=parseFloat(e[0])&& layer.feature.properties.Fog_T419 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT4Freg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 123;
    sliderAtivo = sliderFogosT4Freg19.noUiSlider;
    $(slidersGeral).append(sliderFogosT4Freg19);
}
///////////////////////////---------- FIM FOGOS T4 LICENCIADOS EM 2019,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- TOTAL FOGOS LICENCIAADOS 2020,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalFogosFreg20 = 99999;
var maxTotalFogosFreg20 = 0;
function estiloTotalFogosFreg20(feature, latlng) {
    if(feature.properties.Fog_LTot20< minTotalFogosFreg20 || feature.properties.Fog_LTot20 ===0){
        minTotalFogosFreg20 = feature.properties.Fog_LTot20
    }
    if(feature.properties.Fog_LTot20> maxTotalFogosFreg20){
        maxTotalFogosFreg20 = feature.properties.Fog_LTot20
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_LTot20,2)
    });
}
function apagarTotalFogosFreg20(e){
    var layer = e.target;
    TotalFogosFreg20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFogosFreg20(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos licenciados: '  + '<b>'+ feature.properties.Fog_LTot20+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFogosFreg20,
    })
};

var TotalFogosFreg20= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloTotalFogosFreg20,
    onEachFeature: onEachFeatureTotalFogosFreg20,
});

var slideTotalFogosFreg20 = function(){
    var sliderTotalFogosFreg20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 124){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFogosFreg20, {
        start: [minTotalFogosFreg20, maxTotalFogosFreg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFogosFreg20,
            'max': maxTotalFogosFreg20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFogosFreg20);
    inputNumberMax.setAttribute("value",maxTotalFogosFreg20);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFogosFreg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFogosFreg20.noUiSlider.set([null, this.value]);
    });

    sliderTotalFogosFreg20.noUiSlider.on('update',function(e){
        TotalFogosFreg20.eachLayer(function(layer){
            if(layer.feature.properties.Fog_LTot20>=parseFloat(e[0])&& layer.feature.properties.Fog_LTot20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFogosFreg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 124;
    sliderAtivo = sliderTotalFogosFreg20.noUiSlider;
    $(slidersGeral).append(sliderTotalFogosFreg20);
}
///////////////////////////---------- FIM TOTAL FOGOS LICENCIADOS EM 2020,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T0 E T1 2020,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT1Freg20 = 99999;
var maxFogosT1Freg20 = 0;
function estiloFogosT1Freg20(feature, latlng) {
    if(feature.properties.Fog_T120< minFogosT1Freg20 || feature.properties.Fog_T120 ===0){
        minFogosT1Freg20 = feature.properties.Fog_T120
    }
    if(feature.properties.Fog_T120> maxFogosT1Freg20){
        maxFogosT1Freg20 = feature.properties.Fog_T120
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T120,2)
    });
}
function apagarFogosT1Freg20(e){
    var layer = e.target;
    FogosT1Freg20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT1Freg20(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T0 ou T1 licenciados: '  + '<b>'+ feature.properties.Fog_T120+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT1Freg20,
    })
};

var FogosT1Freg20= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT1Freg20,
    onEachFeature: onEachFeatureFogosT1Freg20,
});

var slideFogosT1Freg20 = function(){
    var sliderFogosT1Freg20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 125){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT1Freg20, {
        start: [minFogosT1Freg20, maxFogosT1Freg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT1Freg20,
            'max': maxFogosT1Freg20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT1Freg20);
    inputNumberMax.setAttribute("value",maxFogosT1Freg20);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT1Freg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT1Freg20.noUiSlider.set([null, this.value]);
    });

    sliderFogosT1Freg20.noUiSlider.on('update',function(e){
        FogosT1Freg20.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T120>=parseFloat(e[0])&& layer.feature.properties.Fog_T120 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT1Freg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 125;
    sliderAtivo = sliderFogosT1Freg20.noUiSlider;
    $(slidersGeral).append(sliderFogosT1Freg20);
}
///////////////////////////---------- FIM FOGOS T0 OU T1 LICENCIADOS EM 2020,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T2 2020,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT2Freg20 = 99999;
var maxFogosT2Freg20 = 0;
function estiloFogosT2Freg20(feature, latlng) {
    if(feature.properties.Fog_T220< minFogosT2Freg20 || feature.properties.Fog_T220 ===0){
        minFogosT2Freg20 = feature.properties.Fog_T220
    }
    if(feature.properties.Fog_T220> maxFogosT2Freg20){
        maxFogosT2Freg20 = feature.properties.Fog_T220
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T220,2)
    });
}
function apagarFogosT2Freg20(e){
    var layer = e.target;
    FogosT2Freg20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT2Freg20(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T2 licenciados: '  + '<b>'+ feature.properties.Fog_T220+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT2Freg20,
    })
};

var FogosT2Freg20= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT2Freg20,
    onEachFeature: onEachFeatureFogosT2Freg20,
});

var slideFogosT2Freg20 = function(){
    var sliderFogosT2Freg20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 126){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT2Freg20, {
        start: [minFogosT2Freg20, maxFogosT2Freg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT2Freg20,
            'max': maxFogosT2Freg20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT2Freg20);
    inputNumberMax.setAttribute("value",maxFogosT2Freg20);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT2Freg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT2Freg20.noUiSlider.set([null, this.value]);
    });

    sliderFogosT2Freg20.noUiSlider.on('update',function(e){
        FogosT2Freg20.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T220>=parseFloat(e[0])&& layer.feature.properties.Fog_T220 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT2Freg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 126;
    sliderAtivo = sliderFogosT2Freg20.noUiSlider;
    $(slidersGeral).append(sliderFogosT2Freg20);
}
///////////////////////////---------- FIM FOGOS T2 LICENCIADOS EM 2020,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T3 2020,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT3Freg20 = 99999;
var maxFogosT3Freg20 = 0;
function estiloFogosT3Freg20(feature, latlng) {
    if(feature.properties.Fog_T320< minFogosT3Freg20 || feature.properties.Fog_T320 ===0){
        minFogosT3Freg20 = feature.properties.Fog_T320
    }
    if(feature.properties.Fog_T320> maxFogosT3Freg20){
        maxFogosT3Freg20 = feature.properties.Fog_T320
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T320,2)
    });
}
function apagarFogosT3Freg20(e){
    var layer = e.target;
    FogosT3Freg20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT3Freg20(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T3 licenciados: '  + '<b>'+ feature.properties.Fog_T320+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT3Freg20,
    })
};

var FogosT3Freg20= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT3Freg20,
    onEachFeature: onEachFeatureFogosT3Freg20,
});

var slideFogosT3Freg20 = function(){
    var sliderFogosT3Freg20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 127){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT3Freg20, {
        start: [minFogosT3Freg20, maxFogosT3Freg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT3Freg20,
            'max': maxFogosT3Freg20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT3Freg20);
    inputNumberMax.setAttribute("value",maxFogosT3Freg20);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT3Freg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT3Freg20.noUiSlider.set([null, this.value]);
    });

    sliderFogosT3Freg20.noUiSlider.on('update',function(e){
        FogosT3Freg20.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T320>=parseFloat(e[0])&& layer.feature.properties.Fog_T320 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT3Freg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 127;
    sliderAtivo = sliderFogosT3Freg20.noUiSlider;
    $(slidersGeral).append(sliderFogosT3Freg20);
}
///////////////////////////---------- FIM FOGOS T3 LICENCIADOS EM 2020,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- FOGOS LICENCIADOS T4 2020,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minFogosT4Freg20 = 99999;
var maxFogosT4Freg20 = 0;
function estiloFogosT4Freg20(feature, latlng) {
    if(feature.properties.Fog_T420< minFogosT4Freg20 || feature.properties.Fog_T420 ===0){
        minFogosT4Freg20 = feature.properties.Fog_T420
    }
    if(feature.properties.Fog_T420> maxFogosT4Freg20){
        maxFogosT4Freg20 = feature.properties.Fog_T420
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fog_T420,2)
    });
}
function apagarFogosT4Freg20(e){
    var layer = e.target;
    FogosT4Freg20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureFogosT4Freg20(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de fogos T4 licenciados: '  + '<b>'+ feature.properties.Fog_T420+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarFogosT4Freg20,
    })
};

var FogosT4Freg20= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloFogosT4Freg20,
    onEachFeature: onEachFeatureFogosT4Freg20,
});

var slideFogosT4Freg20 = function(){
    var sliderFogosT4Freg20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 128){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderFogosT4Freg20, {
        start: [minFogosT4Freg20, maxFogosT4Freg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minFogosT4Freg20,
            'max': maxFogosT4Freg20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minFogosT4Freg20);
    inputNumberMax.setAttribute("value",maxFogosT4Freg20);

    inputNumberMin.addEventListener('change', function(){
        sliderFogosT4Freg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderFogosT4Freg20.noUiSlider.set([null, this.value]);
    });

    sliderFogosT4Freg20.noUiSlider.on('update',function(e){
        FogosT4Freg20.eachLayer(function(layer){
            if(layer.feature.properties.Fog_T420>=parseFloat(e[0])&& layer.feature.properties.Fog_T420 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderFogosT4Freg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 128;
    sliderAtivo = sliderFogosT4Freg20.noUiSlider;
    $(slidersGeral).append(sliderFogosT4Freg20);
}
///////////////////////////---------- FIM FOGOS T4 LICENCIADOS EM 2020,Por Freguesia -----------\\\\\\\\\
///////////////////////////////////////------------------- FIM DADOS ABSOLUTOS \\\\

////////////////////////////////////----------- PERCENTAGEM T1, EM 2014 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT1Freg14 = 99;
var maxPerT1Freg14 = 0;

function CorPerTFreg(d) {
    return d == null ? '#808080' :
        d >= 90 ? '#8c0303' :
        d >= 75  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 25   ? '#f5b3be' :
        d >= 0   ? '#F2C572' :
                ''  ;
}
var legendaPerTFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 90' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 75 a 90' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function estiloPerT1Freg14(feature) {
    if(feature.properties.PerT1_14 <= minPerT1Freg14 &&  feature.properties.PerT1_14 != null){
        minPerT1Freg14 = feature.properties.PerT1_14
    }
    if(feature.properties.PerT1_14> maxPerT1Freg14 && feature.properties.PerT1_14 != null){
        maxPerT1Freg14 = feature.properties.PerT1_14
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT1_14)
    };
}
function apagarPerT1Freg14(e){
    var layer = e.target;
    PerT1Freg14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT1Freg14(feature, layer) {
    if (feature.properties.PerT1_14 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' +feature.properties.PerT1_14 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT1Freg14,
    })
};

var PerT1Freg14= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT1Freg14,
    onEachFeature: onEachFeaturePerT1Freg14,
});

var slidePerT1Freg14 = function(){
    var sliderPerT1Freg14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 129){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT1Freg14, {
        start: [minPerT1Freg14, maxPerT1Freg14],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT1Freg14,
            'max': maxPerT1Freg14
        },
    });
    
    inputNumberMin.setAttribute("value",minPerT1Freg14);
    inputNumberMax.setAttribute("value",maxPerT1Freg14);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT1Freg14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT1Freg14.noUiSlider.set([null, this.value]);
    });

    sliderPerT1Freg14.noUiSlider.on('update',function(e){
        PerT1Freg14.eachLayer(function(layer){
            if (layer.feature.properties.PerT1_14 == null){
                return false
            }
            if(layer.feature.properties.PerT1_14>=parseFloat(e[0])&& layer.feature.properties.PerT1_14 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT1Freg14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 129;
    sliderAtivo = sliderPerT1Freg14.noUiSlider;
    $(slidersGeral).append(sliderPerT1Freg14);
}
///////////////////////////-------------------- FIM FREGUESIA T1, EM 2014,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM T2, EM 2014 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT2Freg14 = 99999;
var maxPerT2Freg14 = 0;



function estiloPerT2Freg14(feature) {
    if(feature.properties.PerT2_14< minPerT2Freg14 && feature.properties.PerT2_14 != null){
        minPerT2Freg14 = feature.properties.PerT2_14
    }
    if(feature.properties.PerT2_14> maxPerT2Freg14 && feature.properties.PerT2_14 != null){
        maxPerT2Freg14 = feature.properties.PerT2_14
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT2_14)
    };
}
function apagarPerT2Freg14(e){
    var layer = e.target;
    PerT2Freg14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT2Freg14(feature, layer) {
    if (feature.properties.PerT2_14 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T2 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T2 licenciados: ' + '<b>' +feature.properties.PerT2_14 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT2Freg14,
    })
};

var PerT2Freg14= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT2Freg14,
    onEachFeature: onEachFeaturePerT2Freg14,
});

var slidePerT2Freg14 = function(){
    var sliderPerT2Freg14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 130){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT2Freg14, {
        start: [minPerT2Freg14, maxPerT2Freg14],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT2Freg14,
            'max': maxPerT2Freg14
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT2Freg14);
    inputNumberMax.setAttribute("value",maxPerT2Freg14);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT2Freg14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT2Freg14.noUiSlider.set([null, this.value]);
    });

    sliderPerT2Freg14.noUiSlider.on('update',function(e){
        PerT2Freg14.eachLayer(function(layer){
            if (layer.feature.properties.PerT2_14 == null){
                return false
            }
            if(layer.feature.properties.PerT2_14>=parseFloat(e[0])&& layer.feature.properties.PerT2_14 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT2Freg14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 130;
    sliderAtivo = sliderPerT2Freg14.noUiSlider;
    $(slidersGeral).append(sliderPerT2Freg14);
}
///////////////////////////-------------------- FIM FREGUESIA T2, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM T3, EM 2014 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT3Freg14 = 99999;
var maxPerT3Freg14 = 0;
function estiloPerT3Freg14(feature, latlng) {
    if(feature.properties.PerT3_14< minPerT3Freg14 && feature.properties.PerT3_14 != null){
        minPerT3Freg14 = feature.properties.PerT3_14
    }
    if(feature.properties.PerT3_14> maxPerT3Freg14 && feature.properties.PerT3_14 != null){
        maxPerT3Freg14 = feature.properties.PerT3_14
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT3_14)
    };
}
function apagarPerT3Freg14(e){
    var layer = e.target;
    PerT3Freg14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT3Freg14(feature, layer) {
    if (feature.properties.PerT3_14 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T3 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T3 licenciados: ' + '<b>' +feature.properties.PerT3_14 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT3Freg14,
    })
};

var PerT3Freg14= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT3Freg14,
    onEachFeature: onEachFeaturePerT3Freg14,
});

var slidePerT3Freg14 = function(){
    var sliderPerT3Freg14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 131){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT3Freg14, {
        start: [minPerT3Freg14, maxPerT3Freg14],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT3Freg14,
            'max': maxPerT3Freg14
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT3Freg14);
    inputNumberMax.setAttribute("value",maxPerT3Freg14);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT3Freg14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT3Freg14.noUiSlider.set([null, this.value]);
    });

    sliderPerT3Freg14.noUiSlider.on('update',function(e){
        PerT3Freg14.eachLayer(function(layer){
            if (layer.feature.properties.PerT3_14 == null){
                return false
            }
            if(layer.feature.properties.PerT3_14>=parseFloat(e[0])&& layer.feature.properties.PerT3_14 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT3Freg14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 131;
    sliderAtivo = sliderPerT3Freg14.noUiSlider;
    $(slidersGeral).append(sliderPerT3Freg14);
}
///////////////////////////-------------------- FIM FREGUESIA T3, EM 2014,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM T4, EM 2014 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT4Freg14 = 99999;
var maxPerT4Freg14 = 0;



function estiloPerT4Freg14(feature) {
    if(feature.properties.PerT4_14< minPerT4Freg14  && feature.properties.PerT4_14 != null){
        minPerT4Freg14 = feature.properties.PerT4_14
    }
    if(feature.properties.PerT4_14> maxPerT4Freg14 && feature.properties.PerT4_14 != null){
        maxPerT4Freg14 = feature.properties.PerT4_14
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT4_14)
    };
}
function apagarPerT4Freg14(e){
    var layer = e.target;
    PerT4Freg14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT4Freg14(feature, layer) {
    if (feature.properties.PerT4_14 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' +feature.properties.PerT4_14 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT4Freg14,
    })
};

var PerT4Freg14= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT4Freg14,
    onEachFeature: onEachFeaturePerT4Freg14,
});

var slidePerT4Freg14 = function(){
    var sliderPerT4Freg14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 132){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT4Freg14, {
        start: [minPerT4Freg14, maxPerT4Freg14],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT4Freg14,
            'max': maxPerT4Freg14
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT4Freg14);
    inputNumberMax.setAttribute("value",maxPerT4Freg14);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT4Freg14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT4Freg14.noUiSlider.set([null, this.value]);
    });

    sliderPerT4Freg14.noUiSlider.on('update',function(e){
        PerT4Freg14.eachLayer(function(layer){
            if (layer.feature.properties.PerT4_14 == null){
                return false
            }
            if(layer.feature.properties.PerT4_14>=parseFloat(e[0])&& layer.feature.properties.PerT4_14 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT4Freg14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 132;
    sliderAtivo = sliderPerT4Freg14.noUiSlider;
    $(slidersGeral).append(sliderPerT4Freg14);
}
///////////////////////////-------------------- FIM FREGUESIA T4, EM 2014,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM T1, EM 2015 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT1Freg15 = 99999;
var maxPerT1Freg15 = 0;
function estiloPerT1Freg15(feature) {
    if(feature.properties.PerT1_15< minPerT1Freg15 && feature.properties.PerT1_15 != null){
        minPerT1Freg15 = feature.properties.PerT1_15
    }
    if(feature.properties.PerT1_15> maxPerT1Freg15 && feature.properties.PerT1_15 != null){
        maxPerT1Freg15 = feature.properties.PerT1_15
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT1_15)
    };
}
function apagarPerT1Freg15(e){
    var layer = e.target;
    PerT1Freg15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT1Freg15(feature, layer) {
    if (feature.properties.PerT1_15 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' +feature.properties.PerT1_15 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT1Freg15,
    })
};

var PerT1Freg15= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT1Freg15,
    onEachFeature: onEachFeaturePerT1Freg15,
});

var slidePerT1Freg15 = function(){
    var sliderPerT1Freg15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 133){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT1Freg15, {
        start: [minPerT1Freg15, maxPerT1Freg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT1Freg15,
            'max': maxPerT1Freg15
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT1Freg15);
    inputNumberMax.setAttribute("value",maxPerT1Freg15);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT1Freg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT1Freg15.noUiSlider.set([null, this.value]);
    });

    sliderPerT1Freg15.noUiSlider.on('update',function(e){
        PerT1Freg15.eachLayer(function(layer){
            if (layer.feature.properties.PerT1_15 == null){
                return false
            }
            if(layer.feature.properties.PerT1_15>=parseFloat(e[0])&& layer.feature.properties.PerT1_15 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT1Freg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 133;
    sliderAtivo = sliderPerT1Freg15.noUiSlider;
    $(slidersGeral).append(sliderPerT1Freg15);
}
///////////////////////////-------------------- FIM FREGUESIA T1, EM 2015,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM T2, EM 2015 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT2Freg15 = 99999;
var maxPerT2Freg15 = 0;
function estiloPerT2Freg15(feature) {
    if(feature.properties.PerT2_15< minPerT2Freg15 && feature.properties.PerT2_15 != null ){
        minPerT2Freg15 = feature.properties.PerT2_15
    }
    if(feature.properties.PerT2_15> maxPerT2Freg15 && feature.properties.PerT2_15 != null){
        maxPerT2Freg15 = feature.properties.PerT2_15
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT2_15)
    };
}
function apagarPerT2Freg15(e){
    var layer = e.target;
    PerT2Freg15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT2Freg15(feature, layer) {
    if (feature.properties.PerT2_15 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T2 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T2 licenciados: ' + '<b>' +feature.properties.PerT2_15 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT2Freg15,
    })
};

var PerT2Freg15= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT2Freg15,
    onEachFeature: onEachFeaturePerT2Freg15,
});

var slidePerT2Freg15 = function(){
    var sliderPerT2Freg15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 134){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT2Freg15, {
        start: [minPerT2Freg15, maxPerT2Freg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT2Freg15,
            'max': maxPerT2Freg15
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT2Freg15);
    inputNumberMax.setAttribute("value",maxPerT2Freg15);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT2Freg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT2Freg15.noUiSlider.set([null, this.value]);
    });

    sliderPerT2Freg15.noUiSlider.on('update',function(e){
        PerT2Freg15.eachLayer(function(layer){
            if (layer.feature.properties.PerT2_15 == null){
                return false
            }
            if(layer.feature.properties.PerT2_15>=parseFloat(e[0])&& layer.feature.properties.PerT2_15 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT2Freg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 134;
    sliderAtivo = sliderPerT2Freg15.noUiSlider;
    $(slidersGeral).append(sliderPerT2Freg15);
}
///////////////////////////-------------------- FIM FREGUESIA T2, EM 2015,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM T3, EM 2015 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT3Freg15 = 99999;
var maxPerT3Freg15 = 0;
function estiloPerT3Freg15(feature) {
    if(feature.properties.PerT3_15< minPerT3Freg15 && feature.properties.PerT3_15 != null ){
        minPerT3Freg15 = feature.properties.PerT3_15
    }
    if(feature.properties.PerT3_15> maxPerT3Freg15 && feature.properties.PerT3_15 != null){
        maxPerT3Freg15 = feature.properties.PerT3_15
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT3_15)
    };
}
function apagarPerT3Freg15(e){
    var layer = e.target;
    PerT3Freg15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT3Freg15(feature, layer) {
    if (feature.properties.PerT3_15 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T3 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T3 licenciados: ' + '<b>' +feature.properties.PerT3_15 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT3Freg15,
    })
};

var PerT3Freg15= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT3Freg15,
    onEachFeature: onEachFeaturePerT3Freg15,
});

var slidePerT3Freg15 = function(){
    var sliderPerT3Freg15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 135){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT3Freg15, {
        start: [minPerT3Freg15, maxPerT3Freg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT3Freg15,
            'max': maxPerT3Freg15
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT3Freg15);
    inputNumberMax.setAttribute("value",maxPerT3Freg15);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT3Freg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT3Freg15.noUiSlider.set([null, this.value]);
    });

    sliderPerT3Freg15.noUiSlider.on('update',function(e){
        PerT3Freg15.eachLayer(function(layer){
            if (layer.feature.properties.PerT3_15 == null){
                return false
            }
            if(layer.feature.properties.PerT3_15>=parseFloat(e[0])&& layer.feature.properties.PerT3_15 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT3Freg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 135;
    sliderAtivo = sliderPerT3Freg15.noUiSlider;
    $(slidersGeral).append(sliderPerT3Freg15);
}
///////////////////////////-------------------- FIM FREGUESIA T3, EM 2015,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM T4, EM 2015 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT4Freg15 = 99999;
var maxPerT4Freg15 = 0;
function estiloPerT4Freg15(feature) {
    if(feature.properties.PerT4_15< minPerT4Freg15 && feature.properties.PerT4_15 != null ){
        minPerT4Freg15 = feature.properties.PerT4_15
    }
    if(feature.properties.PerT4_15> maxPerT4Freg15 && feature.properties.PerT4_15 != null){
        maxPerT4Freg15 = feature.properties.PerT4_15
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT4_15)
    };
}
function apagarPerT4Freg15(e){
    var layer = e.target;
    PerT4Freg15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT4Freg15(feature, layer) {
    if (feature.properties.PerT4_15 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' +feature.properties.PerT4_15 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT4Freg15,
    })
};

var PerT4Freg15= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT4Freg15,
    onEachFeature: onEachFeaturePerT4Freg15,
});

var slidePerT4Freg15 = function(){
    var sliderPerT4Freg15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 136){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT4Freg15, {
        start: [minPerT4Freg15, maxPerT4Freg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT4Freg15,
            'max': maxPerT4Freg15
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT4Freg15);
    inputNumberMax.setAttribute("value",maxPerT4Freg15);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT4Freg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT4Freg15.noUiSlider.set([null, this.value]);
    });

    sliderPerT4Freg15.noUiSlider.on('update',function(e){
        PerT4Freg15.eachLayer(function(layer){
            if (layer.feature.properties.PerT4_15 == null){
                return false
            }
            if(layer.feature.properties.PerT4_15>=parseFloat(e[0])&& layer.feature.properties.PerT4_15 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT4Freg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 136;
    sliderAtivo = sliderPerT4Freg15.noUiSlider;
    $(slidersGeral).append(sliderPerT4Freg15);
}
///////////////////////////-------------------- FIM FREGUESIA T4, EM 2015,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM T1, EM 2016 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT1Freg16 = 99999;
var maxPerT1Freg16 = 0;
function estiloPerT1Freg16(feature) {
    if(feature.properties.PerT1_16< minPerT1Freg16  && feature.properties.PerT1_16 != null){
        minPerT1Freg16 = feature.properties.PerT1_16
    }
    if(feature.properties.PerT1_16> maxPerT1Freg16 && feature.properties.PerT1_16 != null){
        maxPerT1Freg16 = feature.properties.PerT1_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT1_16)
    };
}
function apagarPerT1Freg16(e){
    var layer = e.target;
    PerT1Freg16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT1Freg16(feature, layer) {
    if (feature.properties.PerT1_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' +feature.properties.PerT1_16 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT1Freg16,
    })
};

var PerT1Freg16= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT1Freg16,
    onEachFeature: onEachFeaturePerT1Freg16,
});

var slidePerT1Freg16 = function(){
    var sliderPerT1Freg16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 137){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT1Freg16, {
        start: [minPerT1Freg16, maxPerT1Freg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT1Freg16,
            'max': maxPerT1Freg16
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT1Freg16);
    inputNumberMax.setAttribute("value",maxPerT1Freg16);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT1Freg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT1Freg16.noUiSlider.set([null, this.value]);
    });

    sliderPerT1Freg16.noUiSlider.on('update',function(e){
        PerT1Freg16.eachLayer(function(layer){
            if (layer.feature.properties.PerT1_16 == null){
                return false
            }
            if(layer.feature.properties.PerT1_16>=parseFloat(e[0])&& layer.feature.properties.PerT1_16 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT1Freg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 137;
    sliderAtivo = sliderPerT1Freg16.noUiSlider;
    $(slidersGeral).append(sliderPerT1Freg16);
}
///////////////////////////-------------------- FIM FREGUESIA T1, EM 2016,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM T2, EM 2016 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT2Freg16 = 99999;
var maxPerT2Freg16 = 0;
function estiloPerT2Freg16(feature) {
    if(feature.properties.PerT2_16< minPerT2Freg16 && feature.properties.PerT2_16 != null){
        minPerT2Freg16 = feature.properties.PerT2_16
    }
    if(feature.properties.PerT2_16> maxPerT2Freg16 && feature.properties.PerT2_16 != null){
        maxPerT2Freg16 = feature.properties.PerT2_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT2_16)
    };
}
function apagarPerT2Freg16(e){
    var layer = e.target;
    PerT2Freg16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT2Freg16(feature, layer) {
    if (feature.properties.PerT2_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T2 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T2 licenciados: ' + '<b>' +feature.properties.PerT2_16 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT2Freg16,
    })
};

var PerT2Freg16= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT2Freg16,
    onEachFeature: onEachFeaturePerT2Freg16,
});

var slidePerT2Freg16 = function(){
    var sliderPerT2Freg16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 138){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT2Freg16, {
        start: [minPerT2Freg16, maxPerT2Freg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT2Freg16,
            'max': maxPerT2Freg16
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT2Freg16);
    inputNumberMax.setAttribute("value",maxPerT2Freg16);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT2Freg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT2Freg16.noUiSlider.set([null, this.value]);
    });

    sliderPerT2Freg16.noUiSlider.on('update',function(e){
        PerT2Freg16.eachLayer(function(layer){
            if (layer.feature.properties.PerT2_16 == null){
                return false
            }
            if(layer.feature.properties.PerT2_16>=parseFloat(e[0])&& layer.feature.properties.PerT2_16 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT2Freg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 138;
    sliderAtivo = sliderPerT2Freg16.noUiSlider;
    $(slidersGeral).append(sliderPerT2Freg16);
}
///////////////////////////-------------------- FIM FREGUESIA T2, EM 2016,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM T3, EM 2016 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT3Freg16 = 99999;
var maxPerT3Freg16 = 0;
function estiloPerT3Freg16(feature) {
    if(feature.properties.PerT3_16< minPerT3Freg16 && feature.properties.PerT3_16 != null ){
        minPerT3Freg16 = feature.properties.PerT3_16
    }
    if(feature.properties.PerT3_16> maxPerT3Freg16 && feature.properties.PerT3_16 != null){
        maxPerT3Freg16 = feature.properties.PerT3_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT3_16)
    };
}
function apagarPerT3Freg16(e){
    var layer = e.target;
    PerT3Freg16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT3Freg16(feature, layer) {
    if (feature.properties.PerT3_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T3 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T3 licenciados: ' + '<b>' +feature.properties.PerT3_16 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT3Freg16,
    })
};

var PerT3Freg16= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT3Freg16,
    onEachFeature: onEachFeaturePerT3Freg16,
});

var slidePerT3Freg16 = function(){
    var sliderPerT3Freg16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 139){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT3Freg16, {
        start: [minPerT3Freg16, maxPerT3Freg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT3Freg16,
            'max': maxPerT3Freg16
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT3Freg16);
    inputNumberMax.setAttribute("value",maxPerT3Freg16);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT3Freg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT3Freg16.noUiSlider.set([null, this.value]);
    });

    sliderPerT3Freg16.noUiSlider.on('update',function(e){
        PerT3Freg16.eachLayer(function(layer){
            if (layer.feature.properties.PerT3_16 == null){
                return false
            }
            if(layer.feature.properties.PerT3_16>=parseFloat(e[0])&& layer.feature.properties.PerT3_16 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT3Freg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 139;
    sliderAtivo = sliderPerT3Freg16.noUiSlider;
    $(slidersGeral).append(sliderPerT3Freg16);
}
///////////////////////////-------------------- FIM FREGUESIA T3, EM 2016,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM T4, EM 2016 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT4Freg16 = 99999;
var maxPerT4Freg16 = 0;
function estiloPerT4Freg16(feature) {
    if(feature.properties.PerT4_16< minPerT4Freg16  && feature.properties.PerT4_16 != null){
        minPerT4Freg16 = feature.properties.PerT4_16
    }
    if(feature.properties.PerT4_16> maxPerT4Freg16 && feature.properties.PerT4_16 != null){
        maxPerT4Freg16 = feature.properties.PerT4_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT4_16)
    };
}
function apagarPerT4Freg16(e){
    var layer = e.target;
    PerT4Freg16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT4Freg16(feature, layer) {
    if (feature.properties.PerT4_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' +feature.properties.PerT4_16 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT4Freg16,
    })
};

var PerT4Freg16= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT4Freg16,
    onEachFeature: onEachFeaturePerT4Freg16,
});

var slidePerT4Freg16 = function(){
    var sliderPerT4Freg16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 140){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT4Freg16, {
        start: [minPerT4Freg16, maxPerT4Freg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT4Freg16,
            'max': maxPerT4Freg16
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT4Freg16);
    inputNumberMax.setAttribute("value",maxPerT4Freg16);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT4Freg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT4Freg16.noUiSlider.set([null, this.value]);
    });

    sliderPerT4Freg16.noUiSlider.on('update',function(e){
        PerT4Freg16.eachLayer(function(layer){
            if (layer.feature.properties.PerT4_16 == null){
                return false
            }
            if(layer.feature.properties.PerT4_16>=parseFloat(e[0])&& layer.feature.properties.PerT4_16 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT4Freg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 140;
    sliderAtivo = sliderPerT4Freg16.noUiSlider;
    $(slidersGeral).append(sliderPerT4Freg16);
}
///////////////////////////-------------------- FIM FREGUESIA T4, EM 2016,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM T1, EM 2017 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT1Freg17 = 99999;
var maxPerT1Freg17 = 0;
function estiloPerT1Freg17(feature) {
    if(feature.properties.PerT1_17< minPerT1Freg17 && feature.properties.PerT1_17 != null ){
        minPerT1Freg17 = feature.properties.PerT1_17
    }
    if(feature.properties.PerT1_17> maxPerT1Freg17 && feature.properties.PerT1_17 != null){
        maxPerT1Freg17 = feature.properties.PerT1_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT1_17)
    };
}
function apagarPerT1Freg17(e){
    var layer = e.target;
    PerT1Freg17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT1Freg17(feature, layer) {
    if (feature.properties.PerT1_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' +feature.properties.PerT1_17 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT1Freg17,
    })
};

var PerT1Freg17= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT1Freg17,
    onEachFeature: onEachFeaturePerT1Freg17,
});

var slidePerT1Freg17 = function(){
    var sliderPerT1Freg17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 141){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT1Freg17, {
        start: [minPerT1Freg17, maxPerT1Freg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT1Freg17,
            'max': maxPerT1Freg17
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT1Freg17);
    inputNumberMax.setAttribute("value",maxPerT1Freg17);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT1Freg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT1Freg17.noUiSlider.set([null, this.value]);
    });

    sliderPerT1Freg17.noUiSlider.on('update',function(e){
        PerT1Freg17.eachLayer(function(layer){
            if (layer.feature.properties.PerT1_17 == null){
                return false
            }
            if(layer.feature.properties.PerT1_17>=parseFloat(e[0])&& layer.feature.properties.PerT1_17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT1Freg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 141;
    sliderAtivo = sliderPerT1Freg17.noUiSlider;
    $(slidersGeral).append(sliderPerT1Freg17);
}
///////////////////////////-------------------- FIM FREGUESIA T1, EM 2017,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM T2, EM 2017 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT2Freg17 = 99999;
var maxPerT2Freg17 = 0;
function estiloPerT2Freg17(feature) {
    if(feature.properties.PerT2_17< minPerT2Freg17 && feature.properties.PerT2_17 != null ){
        minPerT2Freg17 = feature.properties.PerT2_17
    }
    if(feature.properties.PerT2_17> maxPerT2Freg17 && feature.properties.PerT2_17 != null){
        maxPerT2Freg17 = feature.properties.PerT2_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT2_17)
    };
}
function apagarPerT2Freg17(e){
    var layer = e.target;
    PerT2Freg17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT2Freg17(feature, layer) {
    if (feature.properties.PerT2_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T2 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T2 licenciados: ' + '<b>' +feature.properties.PerT2_17 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT2Freg17,
    })
};

var PerT2Freg17= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT2Freg17,
    onEachFeature: onEachFeaturePerT2Freg17,
});

var slidePerT2Freg17 = function(){
    var sliderPerT2Freg17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 142){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT2Freg17, {
        start: [minPerT2Freg17, maxPerT2Freg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT2Freg17,
            'max': maxPerT2Freg17
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT2Freg17);
    inputNumberMax.setAttribute("value",maxPerT2Freg17);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT2Freg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT2Freg17.noUiSlider.set([null, this.value]);
    });

    sliderPerT2Freg17.noUiSlider.on('update',function(e){
        PerT2Freg17.eachLayer(function(layer){
            if (layer.feature.properties.PerT2_17 == null){
                return false
            }
            if(layer.feature.properties.PerT2_17>=parseFloat(e[0])&& layer.feature.properties.PerT2_17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT2Freg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 142;
    sliderAtivo = sliderPerT2Freg17.noUiSlider;
    $(slidersGeral).append(sliderPerT2Freg17);
}
///////////////////////////-------------------- FIM FREGUESIA T2, EM 2017,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM T3, EM 2017 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT3Freg17 = 99999;
var maxPerT3Freg17 = 0;
function estiloPerT3Freg17(feature) {
    if(feature.properties.PerT3_17< minPerT3Freg17  && feature.properties.PerT3_17 != null){
        minPerT3Freg17 = feature.properties.PerT3_17
    }
    if(feature.properties.PerT3_17> maxPerT3Freg17 && feature.properties.PerT3_17 != null){
        maxPerT3Freg17 = feature.properties.PerT3_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT3_17)
    };
}
function apagarPerT3Freg17(e){
    var layer = e.target;
    PerT3Freg17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT3Freg17(feature, layer) {
    if (feature.properties.PerT3_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T3 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T3 licenciados: ' + '<b>' +feature.properties.PerT3_17 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT3Freg17,
    })
};

var PerT3Freg17= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT3Freg17,
    onEachFeature: onEachFeaturePerT3Freg17,
});

var slidePerT3Freg17 = function(){
    var sliderPerT3Freg17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 143){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT3Freg17, {
        start: [minPerT3Freg17, maxPerT3Freg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT3Freg17,
            'max': maxPerT3Freg17
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT3Freg17);
    inputNumberMax.setAttribute("value",maxPerT3Freg17);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT3Freg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT3Freg17.noUiSlider.set([null, this.value]);
    });

    sliderPerT3Freg17.noUiSlider.on('update',function(e){
        PerT3Freg17.eachLayer(function(layer){
            if (layer.feature.properties.PerT3_17 == null){
                return false
            }
            if(layer.feature.properties.PerT3_17>=parseFloat(e[0])&& layer.feature.properties.PerT3_17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT3Freg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 143;
    sliderAtivo = sliderPerT3Freg17.noUiSlider;
    $(slidersGeral).append(sliderPerT3Freg17);
}
///////////////////////////-------------------- FIM FREGUESIA T3, EM 2017,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM T4, EM 2017 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT4Freg17 = 99999;
var maxPerT4Freg17 = 0;
function estiloPerT4Freg17(feature) {
    if(feature.properties.PerT4_17< minPerT4Freg17  && feature.properties.PerT4_17 != null){
        minPerT4Freg17 = feature.properties.PerT4_17
    }
    if(feature.properties.PerT4_17> maxPerT4Freg17 && feature.properties.PerT4_17 != null){
        maxPerT4Freg17 = feature.properties.PerT4_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT4_17)
    };
}
function apagarPerT4Freg17(e){
    var layer = e.target;
    PerT4Freg17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT4Freg17(feature, layer) {
    if (feature.properties.PerT4_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' +feature.properties.PerT4_17 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT4Freg17,
    })
};

var PerT4Freg17= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT4Freg17,
    onEachFeature: onEachFeaturePerT4Freg17,
});

var slidePerT4Freg17 = function(){
    var sliderPerT4Freg17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 144){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT4Freg17, {
        start: [minPerT4Freg17, maxPerT4Freg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT4Freg17,
            'max': maxPerT4Freg17
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT4Freg17);
    inputNumberMax.setAttribute("value",maxPerT4Freg17);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT4Freg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT4Freg17.noUiSlider.set([null, this.value]);
    });

    sliderPerT4Freg17.noUiSlider.on('update',function(e){
        PerT4Freg17.eachLayer(function(layer){
            if (layer.feature.properties.PerT4_17 == null){
                return false
            }
            if(layer.feature.properties.PerT4_17>=parseFloat(e[0])&& layer.feature.properties.PerT4_17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT4Freg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 144;
    sliderAtivo = sliderPerT4Freg17.noUiSlider;
    $(slidersGeral).append(sliderPerT4Freg17);
}
///////////////////////////-------------------- FIM FREGUESIA T4, EM 2017,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM T1, EM 2018 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT1Freg18 = 99999;
var maxPerT1Freg18 = 0;
function estiloPerT1Freg18(feature) {
    if(feature.properties.PerT1_18< minPerT1Freg18 && feature.properties.PerT1_18 != null ){
        minPerT1Freg18 = feature.properties.PerT1_18
    }
    if(feature.properties.PerT1_18> maxPerT1Freg18 && feature.properties.PerT1_18 != null){
        maxPerT1Freg18 = feature.properties.PerT1_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT1_18)
    };
}
function apagarPerT1Freg18(e){
    var layer = e.target;
    PerT1Freg18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT1Freg18(feature, layer) {
    if (feature.properties.PerT1_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' +feature.properties.PerT1_18 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT1Freg18,
    })
};

var PerT1Freg18= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT1Freg18,
    onEachFeature: onEachFeaturePerT1Freg18,
});

var slidePerT1Freg18 = function(){
    var sliderPerT1Freg18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 145){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT1Freg18, {
        start: [minPerT1Freg18, maxPerT1Freg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT1Freg18,
            'max': maxPerT1Freg18
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT1Freg18);
    inputNumberMax.setAttribute("value",maxPerT1Freg18);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT1Freg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT1Freg18.noUiSlider.set([null, this.value]);
    });

    sliderPerT1Freg18.noUiSlider.on('update',function(e){
        PerT1Freg18.eachLayer(function(layer){
            if (layer.feature.properties.PerT1_18 == null){
                return false
            }
            if(layer.feature.properties.PerT1_18>=parseFloat(e[0])&& layer.feature.properties.PerT1_18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT1Freg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 145;
    sliderAtivo = sliderPerT1Freg18.noUiSlider;
    $(slidersGeral).append(sliderPerT1Freg18);
}
///////////////////////////-------------------- FIM FREGUESIA T1, EM 2018,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM T2, EM 2018 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT2Freg18 = 99999;
var maxPerT2Freg18 = 0;
function estiloPerT2Freg18(feature) {
    if(feature.properties.PerT2_18< minPerT2Freg18  && feature.properties.PerT2_18 != null){
        minPerT2Freg18 = feature.properties.PerT2_18
    }
    if(feature.properties.PerT2_18> maxPerT2Freg18 && feature.properties.PerT2_18 != null){
        maxPerT2Freg18 = feature.properties.PerT2_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT2_18)
    };
}
function apagarPerT2Freg18(e){
    var layer = e.target;
    PerT2Freg18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT2Freg18(feature, layer) {
    if (feature.properties.PerT2_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T2 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T2 licenciados: ' + '<b>' +feature.properties.PerT2_18 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT2Freg18,
    })
};

var PerT2Freg18= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT2Freg18,
    onEachFeature: onEachFeaturePerT2Freg18,
});

var slidePerT2Freg18 = function(){
    var sliderPerT2Freg18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 146){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT2Freg18, {
        start: [minPerT2Freg18, maxPerT2Freg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT2Freg18,
            'max': maxPerT2Freg18
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT2Freg18);
    inputNumberMax.setAttribute("value",maxPerT2Freg18);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT2Freg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT2Freg18.noUiSlider.set([null, this.value]);
    });

    sliderPerT2Freg18.noUiSlider.on('update',function(e){
        PerT2Freg18.eachLayer(function(layer){
            if (layer.feature.properties.PerT2_18 == null){
                return false
            }
            if(layer.feature.properties.PerT2_18>=parseFloat(e[0])&& layer.feature.properties.PerT2_18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT2Freg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 146;
    sliderAtivo = sliderPerT2Freg18.noUiSlider;
    $(slidersGeral).append(sliderPerT2Freg18);
}
///////////////////////////-------------------- FIM FREGUESIA T2, EM 2018,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM T3, EM 2018 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT3Freg18 = 99999;
var maxPerT3Freg18 = 0;
function estiloPerT3Freg18(feature) {
    if(feature.properties.PerT3_18< minPerT3Freg18  && feature.properties.PerT3_18 != null){
        minPerT3Freg18 = feature.properties.PerT3_18
    }
    if(feature.properties.PerT3_18> maxPerT3Freg18 && feature.properties.PerT3_18 != null){
        maxPerT3Freg18 = feature.properties.PerT3_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT3_18)
    };
}
function apagarPerT3Freg18(e){
    var layer = e.target;
    PerT3Freg18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT3Freg18(feature, layer) {
    if (feature.properties.PerT3_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T3 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T3 licenciados: ' + '<b>' +feature.properties.PerT3_18 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT3Freg18,
    })
};

var PerT3Freg18= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT3Freg18,
    onEachFeature: onEachFeaturePerT3Freg18,
});

var slidePerT3Freg18 = function(){
    var sliderPerT3Freg18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 147){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT3Freg18, {
        start: [minPerT3Freg18, maxPerT3Freg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT3Freg18,
            'max': maxPerT3Freg18
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT3Freg18);
    inputNumberMax.setAttribute("value",maxPerT3Freg18);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT3Freg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT3Freg18.noUiSlider.set([null, this.value]);
    });

    sliderPerT3Freg18.noUiSlider.on('update',function(e){
        PerT3Freg18.eachLayer(function(layer){
            if (layer.feature.properties.PerT3_18 == null){
                return false
            }
            if(layer.feature.properties.PerT3_18>=parseFloat(e[0])&& layer.feature.properties.PerT3_18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT3Freg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 147;
    sliderAtivo = sliderPerT3Freg18.noUiSlider;
    $(slidersGeral).append(sliderPerT3Freg18);
}
///////////////////////////-------------------- FIM FREGUESIA T3, EM 2018,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM T4, EM 2018 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT4Freg18 = 99999;
var maxPerT4Freg18 = 0;
function estiloPerT4Freg18(feature) {
    if(feature.properties.PerT4_18< minPerT4Freg18  && feature.properties.PerT4_18 != null){
        minPerT4Freg18 = feature.properties.PerT4_18
    }
    if(feature.properties.PerT4_18> maxPerT4Freg18 && feature.properties.PerT4_18 != null){
        maxPerT4Freg18 = feature.properties.PerT4_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT4_18)
    };
}
function apagarPerT4Freg18(e){
    var layer = e.target;
    PerT4Freg18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT4Freg18(feature, layer) {
    if (feature.properties.PerT4_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' +feature.properties.PerT4_18 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT4Freg18,
    })
};

var PerT4Freg18= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT4Freg18,
    onEachFeature: onEachFeaturePerT4Freg18,
});

var slidePerT4Freg18 = function(){
    var sliderPerT4Freg18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 148){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT4Freg18, {
        start: [minPerT4Freg18, maxPerT4Freg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT4Freg18,
            'max': maxPerT4Freg18
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT4Freg18);
    inputNumberMax.setAttribute("value",maxPerT4Freg18);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT4Freg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT4Freg18.noUiSlider.set([null, this.value]);
    });

    sliderPerT4Freg18.noUiSlider.on('update',function(e){
        PerT4Freg18.eachLayer(function(layer){
            if (layer.feature.properties.PerT4_18 == null){
                return false
            }
            if(layer.feature.properties.PerT4_18>=parseFloat(e[0])&& layer.feature.properties.PerT4_18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT4Freg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 148;
    sliderAtivo = sliderPerT4Freg18.noUiSlider;
    $(slidersGeral).append(sliderPerT4Freg18);
}
///////////////////////////-------------------- FIM FREGUESIA T4, EM 2018,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM T1, EM 2019 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT1Freg19 = 99999;
var maxPerT1Freg19 = 0;
function estiloPerT1Freg19(feature) {
    if(feature.properties.PerT1_19< minPerT1Freg19  && feature.properties.PerT1_19 != null){
        minPerT1Freg19 = feature.properties.PerT1_19
    }
    if(feature.properties.PerT1_19> maxPerT1Freg19 && feature.properties.PerT1_19 != null){
        maxPerT1Freg19 = feature.properties.PerT1_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT1_19)
    };
}
function apagarPerT1Freg19(e){
    var layer = e.target;
    PerT1Freg19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT1Freg19(feature, layer) {
    if (feature.properties.PerT1_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' +feature.properties.PerT1_19 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT1Freg19,
    })
};

var PerT1Freg19= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT1Freg19,
    onEachFeature: onEachFeaturePerT1Freg19,
});

var slidePerT1Freg19 = function(){
    var sliderPerT1Freg19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 149){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT1Freg19, {
        start: [minPerT1Freg19, maxPerT1Freg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT1Freg19,
            'max': maxPerT1Freg19
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT1Freg19);
    inputNumberMax.setAttribute("value",maxPerT1Freg19);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT1Freg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT1Freg19.noUiSlider.set([null, this.value]);
    });

    sliderPerT1Freg19.noUiSlider.on('update',function(e){
        PerT1Freg19.eachLayer(function(layer){
            if (layer.feature.properties.PerT1_19 == null){
                return false
            }
            if(layer.feature.properties.PerT1_19>=parseFloat(e[0])&& layer.feature.properties.PerT1_19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT1Freg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 149;
    sliderAtivo = sliderPerT1Freg19.noUiSlider;
    $(slidersGeral).append(sliderPerT1Freg19);
}
///////////////////////////-------------------- FIM FREGUESIA T1, EM 2019,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM T2, EM 2019 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT2Freg19 = 99999;
var maxPerT2Freg19 = 0;
function estiloPerT2Freg19(feature) {
    if(feature.properties.PerT2_19< minPerT2Freg19  && feature.properties.PerT2_19 != null){
        minPerT2Freg19 = feature.properties.PerT2_19
    }
    if(feature.properties.PerT2_19> maxPerT2Freg19 && feature.properties.PerT2_19 != null){
        maxPerT2Freg19 = feature.properties.PerT2_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT2_19)
    };
}
function apagarPerT2Freg19(e){
    var layer = e.target;
    PerT2Freg19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT2Freg19(feature, layer) {
    if (feature.properties.PerT2_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T2 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T2 licenciados: ' + '<b>' +feature.properties.PerT2_19 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT2Freg19,
    })
};

var PerT2Freg19= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT2Freg19,
    onEachFeature: onEachFeaturePerT2Freg19,
});

var slidePerT2Freg19 = function(){
    var sliderPerT2Freg19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 150){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT2Freg19, {
        start: [minPerT2Freg19, maxPerT2Freg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT2Freg19,
            'max': maxPerT2Freg19
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT2Freg19);
    inputNumberMax.setAttribute("value",maxPerT2Freg19);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT2Freg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT2Freg19.noUiSlider.set([null, this.value]);
    });

    sliderPerT2Freg19.noUiSlider.on('update',function(e){
        PerT2Freg19.eachLayer(function(layer){
            if (layer.feature.properties.PerT2_19 == null){
                return false
            }
            if(layer.feature.properties.PerT2_19>=parseFloat(e[0])&& layer.feature.properties.PerT2_19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT2Freg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 150;
    sliderAtivo = sliderPerT2Freg19.noUiSlider;
    $(slidersGeral).append(sliderPerT2Freg19);
}
///////////////////////////-------------------- FIM FREGUESIA T2, EM 2019,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM T3, EM 2019 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT3Freg19 = 99999;
var maxPerT3Freg19 = 0;
function estiloPerT3Freg19(feature) {
    if(feature.properties.PerT3_19< minPerT3Freg19  && feature.properties.PerT3_19 != null){
        minPerT3Freg19 = feature.properties.PerT3_19
    }
    if(feature.properties.PerT3_19> maxPerT3Freg19 && feature.properties.PerT3_19 != null){
        maxPerT3Freg19 = feature.properties.PerT3_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT3_19)
    };
}
function apagarPerT3Freg19(e){
    var layer = e.target;
    PerT3Freg19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT3Freg19(feature, layer) {
    if (feature.properties.PerT3_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T3 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T3 licenciados: ' + '<b>' +feature.properties.PerT3_19 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT3Freg19,
    })
};

var PerT3Freg19= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT3Freg19,
    onEachFeature: onEachFeaturePerT3Freg19,
});

var slidePerT3Freg19 = function(){
    var sliderPerT3Freg19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 151){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT3Freg19, {
        start: [minPerT3Freg19, maxPerT3Freg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT3Freg19,
            'max': maxPerT3Freg19
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT3Freg19);
    inputNumberMax.setAttribute("value",maxPerT3Freg19);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT3Freg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT3Freg19.noUiSlider.set([null, this.value]);
    });

    sliderPerT3Freg19.noUiSlider.on('update',function(e){
        PerT3Freg19.eachLayer(function(layer){
            if (layer.feature.properties.PerT3_19 == null){
                return false
            }
            if(layer.feature.properties.PerT3_19>=parseFloat(e[0])&& layer.feature.properties.PerT3_19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT3Freg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 151;
    sliderAtivo = sliderPerT3Freg19.noUiSlider;
    $(slidersGeral).append(sliderPerT3Freg19);
}
///////////////////////////-------------------- FIM FREGUESIA T3, EM 2019,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM T4, EM 2019 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT4Freg19 = 99999;
var maxPerT4Freg19 = 0;
function estiloPerT4Freg19(feature) {
    if(feature.properties.PerT4_19< minPerT4Freg19  && feature.properties.PerT4_19 != null){
        minPerT4Freg19 = feature.properties.PerT4_19
    }
    if(feature.properties.PerT4_19> maxPerT4Freg19 && feature.properties.PerT4_19 != null){
        maxPerT4Freg19 = feature.properties.PerT4_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT4_19)
    };
}
function apagarPerT4Freg19(e){
    var layer = e.target;
    PerT4Freg19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT4Freg19(feature, layer) {
    if (feature.properties.PerT4_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' +feature.properties.PerT4_19 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT4Freg19,
    })
};

var PerT4Freg19= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT4Freg19,
    onEachFeature: onEachFeaturePerT4Freg19,
});

var slidePerT4Freg19 = function(){
    var sliderPerT4Freg19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 152){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT4Freg19, {
        start: [minPerT4Freg19, maxPerT4Freg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT4Freg19,
            'max': maxPerT4Freg19
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT4Freg19);
    inputNumberMax.setAttribute("value",maxPerT4Freg19);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT4Freg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT4Freg19.noUiSlider.set([null, this.value]);
    });

    sliderPerT4Freg19.noUiSlider.on('update',function(e){
        PerT4Freg19.eachLayer(function(layer){
            if (layer.feature.properties.PerT4_19 == null){
                return false
            }
            if(layer.feature.properties.PerT4_19>=parseFloat(e[0])&& layer.feature.properties.PerT4_19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT4Freg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 152;
    sliderAtivo = sliderPerT4Freg19.noUiSlider;
    $(slidersGeral).append(sliderPerT4Freg19);
}
///////////////////////////-------------------- FIM FREGUESIA T4, EM 2019,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM T1, EM 2020 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT1Freg20 = 99999;
var maxPerT1Freg20 = 0;
function estiloPerT1Freg20(feature) {
    if(feature.properties.PerT1_20< minPerT1Freg20  && feature.properties.PerT1_20 != null){
        minPerT1Freg20 = feature.properties.PerT1_20
    }
    if(feature.properties.PerT1_20> maxPerT1Freg20 && feature.properties.PerT1_20 != null){
        maxPerT1Freg20 = feature.properties.PerT1_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT1_20)
    };
}
function apagarPerT1Freg20(e){
    var layer = e.target;
    PerT1Freg20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT1Freg20(feature, layer) {
    if (feature.properties.PerT1_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T0 ou T1 licenciados: ' + '<b>' +feature.properties.PerT1_20 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT1Freg20,
    })
};

var PerT1Freg20= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT1Freg20,
    onEachFeature: onEachFeaturePerT1Freg20,
});

var slidePerT1Freg20 = function(){
    var sliderPerT1Freg20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 153){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT1Freg20, {
        start: [minPerT1Freg20, maxPerT1Freg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT1Freg20,
            'max': maxPerT1Freg20
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT1Freg20);
    inputNumberMax.setAttribute("value",maxPerT1Freg20);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT1Freg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT1Freg20.noUiSlider.set([null, this.value]);
    });

    sliderPerT1Freg20.noUiSlider.on('update',function(e){
        PerT1Freg20.eachLayer(function(layer){
            if (layer.feature.properties.PerT1_20 == null){
                return false
            }
            if(layer.feature.properties.PerT1_20>=parseFloat(e[0])&& layer.feature.properties.PerT1_20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT1Freg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 153;
    sliderAtivo = sliderPerT1Freg20.noUiSlider;
    $(slidersGeral).append(sliderPerT1Freg20);
}
///////////////////////////-------------------- FIM FREGUESIA T1, EM 2020,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM T2, EM 2020 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT2Freg20 = 99999;
var maxPerT2Freg20 = 0;
function estiloPerT2Freg20(feature) {
    if(feature.properties.PerT2_20< minPerT2Freg20  && feature.properties.PerT2_20 != null){
        minPerT2Freg20 = feature.properties.PerT2_20
    }
    if(feature.properties.PerT2_20> maxPerT2Freg20 && feature.properties.PerT2_20 != null){
        maxPerT2Freg20 = feature.properties.PerT2_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT2_20)
    };
}
function apagarPerT2Freg20(e){
    var layer = e.target;
    PerT2Freg20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT2Freg20(feature, layer) {
    if (feature.properties.PerT2_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T2 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T2 licenciados: ' + '<b>' +feature.properties.PerT2_20 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT2Freg20,
    })
};

var PerT2Freg20= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT2Freg20,
    onEachFeature: onEachFeaturePerT2Freg20,
});

var slidePerT2Freg20 = function(){
    var sliderPerT2Freg20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 154){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT2Freg20, {
        start: [minPerT2Freg20, maxPerT2Freg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT2Freg20,
            'max': maxPerT2Freg20
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT2Freg20);
    inputNumberMax.setAttribute("value",maxPerT2Freg20);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT2Freg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT2Freg20.noUiSlider.set([null, this.value]);
    });

    sliderPerT2Freg20.noUiSlider.on('update',function(e){
        PerT2Freg20.eachLayer(function(layer){
            if (layer.feature.properties.PerT2_20 == null){
                return false
            }
            if(layer.feature.properties.PerT2_20>=parseFloat(e[0])&& layer.feature.properties.PerT2_20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT2Freg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 154;
    sliderAtivo = sliderPerT2Freg20.noUiSlider;
    $(slidersGeral).append(sliderPerT2Freg20);
}
///////////////////////////-------------------- FIM FREGUESIA T2, EM 2020,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM T3, EM 2020 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT3Freg20 = 99999;
var maxPerT3Freg20 = 0;
function estiloPerT3Freg20(feature) {
    if(feature.properties.PerT3_20< minPerT3Freg20  && feature.properties.PerT3_20 != null){
        minPerT3Freg20 = feature.properties.PerT3_20
    }
    if(feature.properties.PerT3_20> maxPerT3Freg20 && feature.properties.PerT3_20 != null){
        maxPerT3Freg20 = feature.properties.PerT3_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT3_20)
    };
}
function apagarPerT3Freg20(e){
    var layer = e.target;
    PerT3Freg20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT3Freg20(feature, layer) {
    if (feature.properties.PerT3_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T3 licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T3 licenciados: ' + '<b>' +feature.properties.PerT3_20 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT3Freg20,
    })
};

var PerT3Freg20= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT3Freg20,
    onEachFeature: onEachFeaturePerT3Freg20,
});

var slidePerT3Freg20 = function(){
    var sliderPerT3Freg20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 155){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT3Freg20, {
        start: [minPerT3Freg20, maxPerT3Freg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT3Freg20,
            'max': maxPerT3Freg20
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT3Freg20);
    inputNumberMax.setAttribute("value",maxPerT3Freg20);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT3Freg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT3Freg20.noUiSlider.set([null, this.value]);
    });

    sliderPerT3Freg20.noUiSlider.on('update',function(e){
        PerT3Freg20.eachLayer(function(layer){
            if (layer.feature.properties.PerT3_20 == null){
                return false
            }
            if(layer.feature.properties.PerT3_20>=parseFloat(e[0])&& layer.feature.properties.PerT3_20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT3Freg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 155;
    sliderAtivo = sliderPerT3Freg20.noUiSlider;
    $(slidersGeral).append(sliderPerT3Freg20);
}
///////////////////////////-------------------- FIM FREGUESIA T3, EM 2020,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM T4, EM 2020 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerT4Freg20 = 99999;
var maxPerT4Freg20 = 0;
function estiloPerT4Freg20(feature) {
    if(feature.properties.PerT4_20< minPerT4Freg20  && feature.properties.PerT4_20 != null){
        minPerT4Freg20 = feature.properties.PerT4_20
    }
    if(feature.properties.PerT4_20> maxPerT4Freg20 && feature.properties.PerT4_20 != null){
        maxPerT4Freg20 = feature.properties.PerT4_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerTFreg(feature.properties.PerT4_20)
    };
}
function apagarPerT4Freg20(e){
    var layer = e.target;
    PerT4Freg20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerT4Freg20(feature, layer) {
    if (feature.properties.PerT4_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de fogos T4 ou mais licenciados: ' + '<b>' +feature.properties.PerT4_20 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerT4Freg20,
    })
};

var PerT4Freg20= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerT4Freg20,
    onEachFeature: onEachFeaturePerT4Freg20,
});

var slidePerT4Freg20 = function(){
    var sliderPerT4Freg20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 156){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerT4Freg20, {
        start: [minPerT4Freg20, maxPerT4Freg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerT4Freg20,
            'max': maxPerT4Freg20
        },
        });
    
    inputNumberMin.setAttribute("value",minPerT4Freg20);
    inputNumberMax.setAttribute("value",maxPerT4Freg20);

    inputNumberMin.addEventListener('change', function(){
        sliderPerT4Freg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerT4Freg20.noUiSlider.set([null, this.value]);
    });

    sliderPerT4Freg20.noUiSlider.on('update',function(e){
        PerT4Freg20.eachLayer(function(layer){
            if (layer.feature.properties.PerT4_20 == null){
                return false
            }
            if(layer.feature.properties.PerT4_20>=parseFloat(e[0])&& layer.feature.properties.PerT4_20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerT4Freg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 156;
    sliderAtivo = sliderPerT4Freg20.noUiSlider;
    $(slidersGeral).append(sliderPerT4Freg20);
}
///////////////////////////-------------------- FIM FREGUESIA T4, EM 2020,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\
//////////////////////////////////------------------------ FIM DADOS RELATIVOS ---------------\\\\\\\\\\\\\\\\\\\

//////////////////////////---------------------- VARIAÇÕES POR FREGUESIA -------------------\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação Total, em 2015, POR FREGUESIAS -------------------////

var minVarTotalFreg15 = 9999;
var maxVarTotalFreg15 = 0;

function CorVarTotalFreg15_14(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalFreg15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos licenciados, entre 2015 e 2014, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}
function EstiloVarTotalFreg15(feature) {
    if(feature.properties.VarTot_15 <= minVarTotalFreg15){
        minVarTotalFreg15 = feature.properties.VarTot_15
    }
    if(feature.properties.VarTot_15 > maxVarTotalFreg15){
        maxVarTotalFreg15 = feature.properties.VarTot_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalFreg15_14(feature.properties.VarTot_15)};
    }


function apagarVarTotalFreg15(e) {
    VarTotalFreg15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalFreg15(feature, layer) {
    if (feature.properties.VarTot_15 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalFreg15,
    });
}
var VarTotalFreg15= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarTotalFreg15,
    onEachFeature: onEachFeatureVarTotalFreg15
});

let slideVarTotalFreg15 = function(){
    var sliderVarTotalFreg15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 157){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalFreg15, {
        start: [minVarTotalFreg15, maxVarTotalFreg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalFreg15,
            'max': maxVarTotalFreg15
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalFreg15);
    inputNumberMax.setAttribute("value",maxVarTotalFreg15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalFreg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalFreg15.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalFreg15.noUiSlider.on('update',function(e){
        VarTotalFreg15.eachLayer(function(layer){
            if (layer.feature.properties.VarTot_15 == null){
                return false
            }
            if(layer.feature.properties.VarTot_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalFreg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 157;
    sliderAtivo = sliderVarTotalFreg15.noUiSlider;
    $(slidersGeral).append(sliderVarTotalFreg15);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2015 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T1, em 2015, POR FREGUESIAS -------------------////

var minVarT1Freg15 = 9999;
var maxVarT1Freg15 = 0;

function CorVarT1Freg15_14(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9ebbd7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT1Freg15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T0 ou T1 licenciados, entre 2015 e 2014, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT1Freg15(feature) {
    if(feature.properties.VarT1_15 <= minVarT1Freg15){
        minVarT1Freg15 = feature.properties.VarT1_15
    }
    if(feature.properties.VarT1_15 > maxVarT1Freg15){
        maxVarT1Freg15 = feature.properties.VarT1_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT1Freg15_14(feature.properties.VarT1_15)};
    }


function apagarVarT1Freg15(e) {
    VarT1Freg15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT1Freg15(feature, layer) {
    if (feature.properties.VarT1_15 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT1_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT1Freg15,
    });
}
var VarT1Freg15= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT1Freg15,
    onEachFeature: onEachFeatureVarT1Freg15
});

let slideVarT1Freg15 = function(){
    var sliderVarT1Freg15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 158){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT1Freg15, {
        start: [minVarT1Freg15, maxVarT1Freg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT1Freg15,
            'max': maxVarT1Freg15
        },
        });
    inputNumberMin.setAttribute("value",minVarT1Freg15);
    inputNumberMax.setAttribute("value",maxVarT1Freg15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT1Freg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT1Freg15.noUiSlider.set([null, this.value]);
    });

    sliderVarT1Freg15.noUiSlider.on('update',function(e){
        VarT1Freg15.eachLayer(function(layer){
            if (layer.feature.properties.VarT1_15 == null){
                return false
            }
            if(layer.feature.properties.VarT1_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT1_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT1Freg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 158;
    sliderAtivo = sliderVarT1Freg15.noUiSlider;
    $(slidersGeral).append(sliderVarT1Freg15);
} 

///////////////////////////// Fim VARIAÇÃO T1, em 2015 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T2, em 2015, POR FREGUESIAS -------------------////

var minVarT2Freg15 = 9999;
var maxVarT2Freg15 = 0;

function CorVarT2Freg15_14(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9ebbd7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT2Freg15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T2 licenciados, entre 2015 e 2014, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT2Freg15(feature) {
    if(feature.properties.VarT2_15 <= minVarT2Freg15){
        minVarT2Freg15 = feature.properties.VarT2_15
    }
    if(feature.properties.VarT2_15 > maxVarT2Freg15){
        maxVarT2Freg15 = feature.properties.VarT2_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT2Freg15_14(feature.properties.VarT2_15)};
    }


function apagarVarT2Freg15(e) {
    VarT2Freg15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT2Freg15(feature, layer) {
    if (feature.properties.VarT2_15 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT2_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT2Freg15,
    });
}
var VarT2Freg15= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT2Freg15,
    onEachFeature: onEachFeatureVarT2Freg15
});

let slideVarT2Freg15 = function(){
    var sliderVarT2Freg15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 159){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT2Freg15, {
        start: [minVarT2Freg15, maxVarT2Freg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT2Freg15,
            'max': maxVarT2Freg15
        },
        });
    inputNumberMin.setAttribute("value",minVarT2Freg15);
    inputNumberMax.setAttribute("value",maxVarT2Freg15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT2Freg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT2Freg15.noUiSlider.set([null, this.value]);
    });

    sliderVarT2Freg15.noUiSlider.on('update',function(e){
        VarT2Freg15.eachLayer(function(layer){
            if (layer.feature.properties.VarT2_15 == null){
                return false
            }
            if(layer.feature.properties.VarT2_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT2_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT2Freg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 159;
    sliderAtivo = sliderVarT2Freg15.noUiSlider;
    $(slidersGeral).append(sliderVarT2Freg15);
} 

///////////////////////////// Fim VARIAÇÃO T2, em 2015 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T3, em 2015, POR FREGUESIAS -------------------////

var minVarT3Freg15 = 9999;
var maxVarT3Freg15 = 0;

function CorVarT3Freg15_14(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9ebbd7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT3Freg15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T3 licenciados, entre 2015 e 2014, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT3Freg15(feature) {
    if(feature.properties.VarT3_15 <= minVarT3Freg15){
        minVarT3Freg15 = feature.properties.VarT3_15
    }
    if(feature.properties.VarT3_15 > maxVarT3Freg15){
        maxVarT3Freg15 = feature.properties.VarT3_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT3Freg15_14(feature.properties.VarT3_15)};
    }


function apagarVarT3Freg15(e) {
    VarT3Freg15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT3Freg15(feature, layer) {
    if (feature.properties.VarT3_15 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT3_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT3Freg15,
    });
}
var VarT3Freg15= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT3Freg15,
    onEachFeature: onEachFeatureVarT3Freg15
});

let slideVarT3Freg15 = function(){
    var sliderVarT3Freg15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 160){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT3Freg15, {
        start: [minVarT3Freg15, maxVarT3Freg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT3Freg15,
            'max': maxVarT3Freg15
        },
        });
    inputNumberMin.setAttribute("value",minVarT3Freg15);
    inputNumberMax.setAttribute("value",maxVarT3Freg15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT3Freg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT3Freg15.noUiSlider.set([null, this.value]);
    });

    sliderVarT3Freg15.noUiSlider.on('update',function(e){
        VarT3Freg15.eachLayer(function(layer){
            if (layer.feature.properties.VarT3_15 == null){
                return false
            }
            if(layer.feature.properties.VarT3_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT3_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT3Freg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 160;
    sliderAtivo = sliderVarT3Freg15.noUiSlider;
    $(slidersGeral).append(sliderVarT3Freg15);
} 

///////////////////////////// Fim VARIAÇÃO T3, em 2015 , POR FREGUESIAS -------------- \\\\\


/////////////////////////////------- Variação T4, em 2015, POR FREGUESIAS -------------------////

var minVarT4Freg15 = 9999;
var maxVarT4Freg15 = 0;

function CorVarT4Freg15_14(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9ebbd7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT4Freg15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T4 ou mais licenciados, entre 2015 e 2014, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT4Freg15(feature) {
    if(feature.properties.VarT4_15 <= minVarT4Freg15){
        minVarT4Freg15 = feature.properties.VarT4_15
    }
    if(feature.properties.VarT4_15 > maxVarT4Freg15){
        maxVarT4Freg15 = feature.properties.VarT4_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT4Freg15_14(feature.properties.VarT4_15)};
    }


function apagarVarT4Freg15(e) {
    VarT4Freg15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT4Freg15(feature, layer) {
    if (feature.properties.VarT4_15 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT4_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT4Freg15,
    });
}
var VarT4Freg15= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT4Freg15,
    onEachFeature: onEachFeatureVarT4Freg15
});

let slideVarT4Freg15 = function(){
    var sliderVarT4Freg15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 161){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT4Freg15, {
        start: [minVarT4Freg15, maxVarT4Freg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT4Freg15,
            'max': maxVarT4Freg15
        },
        });
    inputNumberMin.setAttribute("value",minVarT4Freg15);
    inputNumberMax.setAttribute("value",maxVarT4Freg15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT4Freg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT4Freg15.noUiSlider.set([null, this.value]);
    });

    sliderVarT4Freg15.noUiSlider.on('update',function(e){
        VarT4Freg15.eachLayer(function(layer){
            if (layer.feature.properties.VarT4_15 == null){
                return false
            }
            if(layer.feature.properties.VarT4_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT4_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT4Freg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 161;
    sliderAtivo = sliderVarT4Freg15.noUiSlider;
    $(slidersGeral).append(sliderVarT4Freg15);
} 

///////////////////////////// Fim VARIAÇÃO T4, em 2015 , POR FREGUESIAS -------------- \\\\\


/////////////////////////////------- Variação Total, em 2016, POR FREGUESIAS -------------------////

var minVarTotalFreg16 = 9999;
var maxVarTotalFreg16 = 0;

function CorVarTotalFreg16_15(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalFreg16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos licenciados, entre 2016 e 2015, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'  
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalFreg16(feature) {
    if(feature.properties.VarTot_16 <= minVarTotalFreg16){
        minVarTotalFreg16 = feature.properties.VarTot_16
    }
    if(feature.properties.VarTot_16 > maxVarTotalFreg16 ){
        maxVarTotalFreg16 = feature.properties.VarTot_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalFreg16_15(feature.properties.VarTot_16)};
    }


function apagarVarTotalFreg16(e) {
    VarTotalFreg16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalFreg16(feature, layer) {
    if (feature.properties.VarTot_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalFreg16,
    });
}
var VarTotalFreg16= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarTotalFreg16,
    onEachFeature: onEachFeatureVarTotalFreg16
});

let slideVarTotalFreg16 = function(){
    var sliderVarTotalFreg16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 162){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalFreg16, {
        start: [minVarTotalFreg16, maxVarTotalFreg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalFreg16,
            'max': maxVarTotalFreg16
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalFreg16);
    inputNumberMax.setAttribute("value",maxVarTotalFreg16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalFreg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalFreg16.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalFreg16.noUiSlider.on('update',function(e){
        VarTotalFreg16.eachLayer(function(layer){
            if (layer.feature.properties.VarTot_16 == null){
                return false
            }
            if(layer.feature.properties.VarTot_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalFreg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 162;
    sliderAtivo = sliderVarTotalFreg16.noUiSlider;
    $(slidersGeral).append(sliderVarTotalFreg16);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2016 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T1, em 2016, POR FREGUESIAS -------------------////

var minVarT1Freg16 = 9999;
var maxVarT1Freg16 = 0;

function CorVarT1Freg16_15(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT1Freg16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T0 ou T1 licenciados, entre 2016 e 2015, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT1Freg16(feature) {
    if(feature.properties.VarT1_16 <= minVarT1Freg16 ){
        minVarT1Freg16 = feature.properties.VarT1_16
    }
    if(feature.properties.VarT1_16 > maxVarT1Freg16){
        maxVarT1Freg16 = feature.properties.VarT1_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT1Freg16_15(feature.properties.VarT1_16)};
    }


function apagarVarT1Freg16(e) {
    VarT1Freg16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT1Freg16(feature, layer) {
    if (feature.properties.VarT1_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT1_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT1Freg16,
    });
}
var VarT1Freg16= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT1Freg16,
    onEachFeature: onEachFeatureVarT1Freg16
});

let slideVarT1Freg16 = function(){
    var sliderVarT1Freg16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 163){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT1Freg16, {
        start: [minVarT1Freg16, maxVarT1Freg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT1Freg16,
            'max': maxVarT1Freg16
        },
        });
    inputNumberMin.setAttribute("value",minVarT1Freg16);
    inputNumberMax.setAttribute("value",maxVarT1Freg16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT1Freg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT1Freg16.noUiSlider.set([null, this.value]);
    });

    sliderVarT1Freg16.noUiSlider.on('update',function(e){
        VarT1Freg16.eachLayer(function(layer){
            if (layer.feature.properties.VarT1_16 == null){
                return false
            }
            if(layer.feature.properties.VarT1_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT1_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT1Freg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 163;
    sliderAtivo = sliderVarT1Freg16.noUiSlider;
    $(slidersGeral).append(sliderVarT1Freg16);
} 

///////////////////////////// Fim VARIAÇÃO T1, em 2016 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T2, em 2016, POR FREGUESIAS -------------------////

var minVarT2Freg16 = 9999;
var maxVarT2Freg16 = 0;

function CorVarT2Freg16_15(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT2Freg16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T2 licenciados, entre 2016 e 2015, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT2Freg16(feature) {
    if(feature.properties.VarT2_16 <= minVarT2Freg16 ){
        minVarT2Freg16 = feature.properties.VarT2_16
    }
    if(feature.properties.VarT2_16 > maxVarT2Freg16 ){
        maxVarT2Freg16 = feature.properties.VarT2_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT2Freg16_15(feature.properties.VarT2_16)};
    }


function apagarVarT2Freg16(e) {
    VarT2Freg16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT2Freg16(feature, layer) {
    if (feature.properties.VarT2_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT2_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT2Freg16,
    });
}
var VarT2Freg16= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT2Freg16,
    onEachFeature: onEachFeatureVarT2Freg16
});

let slideVarT2Freg16 = function(){
    var sliderVarT2Freg16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 164){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT2Freg16, {
        start: [minVarT2Freg16, maxVarT2Freg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT2Freg16,
            'max': maxVarT2Freg16
        },
        });
    inputNumberMin.setAttribute("value",minVarT2Freg16);
    inputNumberMax.setAttribute("value",maxVarT2Freg16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT2Freg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT2Freg16.noUiSlider.set([null, this.value]);
    });

    sliderVarT2Freg16.noUiSlider.on('update',function(e){
        VarT2Freg16.eachLayer(function(layer){
            if (layer.feature.properties.VarT2_16 == null){
                return false
            }
            if(layer.feature.properties.VarT2_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT2_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT2Freg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 164;
    sliderAtivo = sliderVarT2Freg16.noUiSlider;
    $(slidersGeral).append(sliderVarT2Freg16);
} 

///////////////////////////// Fim VARIAÇÃO T2, em 2016 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T3, em 2016, POR FREGUESIAS -------------------////

var minVarT3Freg16 = 9999;
var maxVarT3Freg16 = 0;

function CorVarT3Freg16_15(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT3Freg16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T3 licenciados, entre 2016 e 2015, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT3Freg16(feature) {
    if(feature.properties.VarT3_16 <= minVarT3Freg16 ){
        minVarT3Freg16 = feature.properties.VarT3_16
    }
    if(feature.properties.VarT3_16 > maxVarT3Freg16){
        maxVarT3Freg16 = feature.properties.VarT3_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT3Freg16_15(feature.properties.VarT3_16)};
    }


function apagarVarT3Freg16(e) {
    VarT3Freg16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT3Freg16(feature, layer) {
    if (feature.properties.VarT3_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT3_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT3Freg16,
    });
}
var VarT3Freg16= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT3Freg16,
    onEachFeature: onEachFeatureVarT3Freg16
});

let slideVarT3Freg16 = function(){
    var sliderVarT3Freg16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 165){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT3Freg16, {
        start: [minVarT3Freg16, maxVarT3Freg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT3Freg16,
            'max': maxVarT3Freg16
        },
        });
    inputNumberMin.setAttribute("value",minVarT3Freg16);
    inputNumberMax.setAttribute("value",maxVarT3Freg16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT3Freg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT3Freg16.noUiSlider.set([null, this.value]);
    });

    sliderVarT3Freg16.noUiSlider.on('update',function(e){
        VarT3Freg16.eachLayer(function(layer){
            if (layer.feature.properties.VarT3_16 == null){
                return false
            }
            if(layer.feature.properties.VarT3_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT3_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT3Freg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 165;
    sliderAtivo = sliderVarT3Freg16.noUiSlider;
    $(slidersGeral).append(sliderVarT3Freg16);
} 

///////////////////////////// Fim VARIAÇÃO T3, em 2016 , POR FREGUESIAS -------------- \\\\\


/////////////////////////////------- Variação T4, em 2016, POR FREGUESIAS -------------------////

var minVarT4Freg16 = 9999;
var maxVarT4Freg16 = 0;

function CorVarT4Freg16_15(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT4Freg16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T4 licenciados, entre 2016 e 2015, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarT4Freg16(feature) {
    if(feature.properties.VarT4_16 <= minVarT4Freg16 ){
        minVarT4Freg16 = feature.properties.VarT4_16
    }
    if(feature.properties.VarT4_16 > maxVarT4Freg16 ){
        maxVarT4Freg16 = feature.properties.VarT4_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT4Freg16_15(feature.properties.VarT4_16)};
    }


function apagarVarT4Freg16(e) {
    VarT4Freg16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT4Freg16(feature, layer) {
    if (feature.properties.VarT4_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT4_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT4Freg16,
    });
}
var VarT4Freg16= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT4Freg16,
    onEachFeature: onEachFeatureVarT4Freg16
});

let slideVarT4Freg16 = function(){
    var sliderVarT4Freg16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 166){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT4Freg16, {
        start: [minVarT4Freg16, maxVarT4Freg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT4Freg16,
            'max': maxVarT4Freg16
        },
        });
    inputNumberMin.setAttribute("value",minVarT4Freg16);
    inputNumberMax.setAttribute("value",maxVarT4Freg16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT4Freg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT4Freg16.noUiSlider.set([null, this.value]);
    });

    sliderVarT4Freg16.noUiSlider.on('update',function(e){
        VarT4Freg16.eachLayer(function(layer){
            if (layer.feature.properties.VarT4_16 == null){
                return false
            }
            if(layer.feature.properties.VarT4_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT4_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT4Freg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 166;
    sliderAtivo = sliderVarT4Freg16.noUiSlider;
    $(slidersGeral).append(sliderVarT4Freg16);
} 

///////////////////////////// Fim VARIAÇÃO T4, em 2016 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Total, em 2017, POR FREGUESIAS -------------------////

var minVarTotalFreg17 = 9999;
var maxVarTotalFreg17 = 0;

function CorVarTotalFreg17_16(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalFreg17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos licenciados, entre 2017 e 2016, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalFreg17(feature) {
    if(feature.properties.VarTot_17 <= minVarTotalFreg17){
        minVarTotalFreg17 = feature.properties.VarTot_17
    }
    if(feature.properties.VarTot_17 > maxVarTotalFreg17){
        maxVarTotalFreg17 = feature.properties.VarTot_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalFreg17_16(feature.properties.VarTot_17)};
    }


function apagarVarTotalFreg17(e) {
    VarTotalFreg17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalFreg17(feature, layer) {
    if (feature.properties.VarTot_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalFreg17,
    });
}
var VarTotalFreg17= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarTotalFreg17,
    onEachFeature: onEachFeatureVarTotalFreg17
});

let slideVarTotalFreg17 = function(){
    var sliderVarTotalFreg17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 167){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalFreg17, {
        start: [minVarTotalFreg17, maxVarTotalFreg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalFreg17,
            'max': maxVarTotalFreg17
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalFreg17);
    inputNumberMax.setAttribute("value",maxVarTotalFreg17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalFreg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalFreg17.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalFreg17.noUiSlider.on('update',function(e){
        VarTotalFreg17.eachLayer(function(layer){
            if (layer.feature.properties.VarTot_17 == null){
                return false
            }
            if(layer.feature.properties.VarTot_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalFreg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 167;
    sliderAtivo = sliderVarTotalFreg17.noUiSlider;
    $(slidersGeral).append(sliderVarTotalFreg17);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2017 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T1, em 2017, POR FREGUESIAS -------------------////

var minVarT1Freg17 = 9999;
var maxVarT1Freg17 = 0;

function CorVarT1Freg17_16(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 0  ? '#f5b3be' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT1Freg17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T0 ou T1 licenciados, entre 2017 e 2016, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT1Freg17(feature) {
    if(feature.properties.VarT1_17 <= minVarT1Freg17){
        minVarT1Freg17 = feature.properties.VarT1_17
    }
    if(feature.properties.VarT1_17 > maxVarT1Freg17){
        maxVarT1Freg17 = feature.properties.VarT1_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT1Freg17_16(feature.properties.VarT1_17)};
    }


function apagarVarT1Freg17(e) {
    VarT1Freg17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT1Freg17(feature, layer) {
    if (feature.properties.VarT1_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT1_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT1Freg17,
    });
}
var VarT1Freg17= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT1Freg17,
    onEachFeature: onEachFeatureVarT1Freg17
});

let slideVarT1Freg17 = function(){
    var sliderVarT1Freg17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 168){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT1Freg17, {
        start: [minVarT1Freg17, maxVarT1Freg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT1Freg17,
            'max': maxVarT1Freg17
        },
        });
    inputNumberMin.setAttribute("value",minVarT1Freg17);
    inputNumberMax.setAttribute("value",maxVarT1Freg17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT1Freg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT1Freg17.noUiSlider.set([null, this.value]);
    });

    sliderVarT1Freg17.noUiSlider.on('update',function(e){
        VarT1Freg17.eachLayer(function(layer){
            if (layer.feature.properties.VarT1_17 == null){
                return false
            }
            if(layer.feature.properties.VarT1_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT1_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT1Freg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 168;
    sliderAtivo = sliderVarT1Freg17.noUiSlider;
    $(slidersGeral).append(sliderVarT1Freg17);
} 

///////////////////////////// Fim VARIAÇÃO T1, em 2017 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T2, em 2017, POR FREGUESIAS -------------------////

var minVarT2Freg17 = 9999;
var maxVarT2Freg17 = 0;

function CorVarT2Freg17_16(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT2Freg17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T2 licenciados, entre 2017 e 2016, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarT2Freg17(feature) {
    if(feature.properties.VarT2_17 <= minVarT2Freg17){
        minVarT2Freg17 = feature.properties.VarT2_17
    }
    if(feature.properties.VarT2_17 > maxVarT2Freg17){
        maxVarT2Freg17 = feature.properties.VarT2_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT2Freg17_16(feature.properties.VarT2_17)};
    }


function apagarVarT2Freg17(e) {
    VarT2Freg17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT2Freg17(feature, layer) {
    if (feature.properties.VarT2_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT2_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT2Freg17,
    });
}
var VarT2Freg17= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT2Freg17,
    onEachFeature: onEachFeatureVarT2Freg17
});

let slideVarT2Freg17 = function(){
    var sliderVarT2Freg17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 169){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT2Freg17, {
        start: [minVarT2Freg17, maxVarT2Freg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT2Freg17,
            'max': maxVarT2Freg17
        },
        });
    inputNumberMin.setAttribute("value",minVarT2Freg17);
    inputNumberMax.setAttribute("value",maxVarT2Freg17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT2Freg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT2Freg17.noUiSlider.set([null, this.value]);
    });

    sliderVarT2Freg17.noUiSlider.on('update',function(e){
        VarT2Freg17.eachLayer(function(layer){
            if (layer.feature.properties.VarT2_17 == null){
                return false
            }
            if(layer.feature.properties.VarT2_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT2_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT2Freg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 169;
    sliderAtivo = sliderVarT2Freg17.noUiSlider;
    $(slidersGeral).append(sliderVarT2Freg17);
} 

///////////////////////////// Fim VARIAÇÃO T2, em 2017 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T3, em 2017, POR FREGUESIAS -------------------////

var minVarT3Freg17 = 9999;
var maxVarT3Freg17 = 0;

function CorVarT3Freg17_16(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT3Freg17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T3 licenciados, entre 2017 e 2016, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT3Freg17(feature) {
    if(feature.properties.VarT3_17 <= minVarT3Freg17){
        minVarT3Freg17 = feature.properties.VarT3_17
    }
    if(feature.properties.VarT3_17 > maxVarT3Freg17){
        maxVarT3Freg17 = feature.properties.VarT3_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT3Freg17_16(feature.properties.VarT3_17)};
    }


function apagarVarT3Freg17(e) {
    VarT3Freg17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT3Freg17(feature, layer) {
    if (feature.properties.VarT3_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT3_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT3Freg17,
    });
}
var VarT3Freg17= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT3Freg17,
    onEachFeature: onEachFeatureVarT3Freg17
});

let slideVarT3Freg17 = function(){
    var sliderVarT3Freg17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 170){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT3Freg17, {
        start: [minVarT3Freg17, maxVarT3Freg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT3Freg17,
            'max': maxVarT3Freg17
        },
        });
    inputNumberMin.setAttribute("value",minVarT3Freg17);
    inputNumberMax.setAttribute("value",maxVarT3Freg17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT3Freg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT3Freg17.noUiSlider.set([null, this.value]);
    });

    sliderVarT3Freg17.noUiSlider.on('update',function(e){
        VarT3Freg17.eachLayer(function(layer){
            if (layer.feature.properties.VarT3_17 == null){
                return false
            }
            if(layer.feature.properties.VarT3_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT3_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT3Freg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 170;
    sliderAtivo = sliderVarT3Freg17.noUiSlider;
    $(slidersGeral).append(sliderVarT3Freg17);
} 

///////////////////////////// Fim VARIAÇÃO T3, em 2017 , POR FREGUESIAS -------------- \\\\\


/////////////////////////////------- Variação T4, em 2017, POR FREGUESIAS -------------------////

var minVarT4Freg17 = 9999;
var maxVarT4Freg17 = 0;

function CorVarT4Freg17_16(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT4Freg17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T4 ou mais licenciados, entre 2017 e 2016, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarT4Freg17(feature) {
    if(feature.properties.VarT4_17 <= minVarT4Freg17){
        minVarT4Freg17 = feature.properties.VarT4_17
    }
    if(feature.properties.VarT4_17 > maxVarT4Freg17){
        maxVarT4Freg17 = feature.properties.VarT4_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT4Freg17_16(feature.properties.VarT4_17)};
    }


function apagarVarT4Freg17(e) {
    VarT4Freg17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT4Freg17(feature, layer) {
    if (feature.properties.VarT4_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT4_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT4Freg17,
    });
}
var VarT4Freg17= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT4Freg17,
    onEachFeature: onEachFeatureVarT4Freg17
});

let slideVarT4Freg17 = function(){
    var sliderVarT4Freg17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 171){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT4Freg17, {
        start: [minVarT4Freg17, maxVarT4Freg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT4Freg17,
            'max': maxVarT4Freg17
        },
        });
    inputNumberMin.setAttribute("value",minVarT4Freg17);
    inputNumberMax.setAttribute("value",maxVarT4Freg17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT4Freg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT4Freg17.noUiSlider.set([null, this.value]);
    });

    sliderVarT4Freg17.noUiSlider.on('update',function(e){
        VarT4Freg17.eachLayer(function(layer){
            if (layer.feature.properties.VarT4_17 == null){
                return false
            }
            if(layer.feature.properties.VarT4_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT4_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT4Freg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 171;
    sliderAtivo = sliderVarT4Freg17.noUiSlider;
    $(slidersGeral).append(sliderVarT4Freg17);
} 

///////////////////////////// Fim VARIAÇÃO T4, em 2017 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Total, em 2018, POR FREGUESIAS -------------------////

var minVarTotalFreg18 = 9999;
var maxVarTotalFreg18 = 0;

function CorVarTotalFreg18_17(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#155273' :
                ''  ;
}

var legendaVarTotalFreg18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos licenciados, entre 2018 e 2017, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalFreg18(feature) {
    if(feature.properties.VarTot_18 <= minVarTotalFreg18){
        minVarTotalFreg18 = feature.properties.VarTot_18
    }
    if(feature.properties.VarTot_18 > maxVarTotalFreg18 ){
        maxVarTotalFreg18 = feature.properties.VarTot_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalFreg18_17(feature.properties.VarTot_18)};
    }


function apagarVarTotalFreg18(e) {
    VarTotalFreg18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalFreg18(feature, layer) {
    if (feature.properties.VarTot_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalFreg18,
    });
}
var VarTotalFreg18= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarTotalFreg18,
    onEachFeature: onEachFeatureVarTotalFreg18
});

let slideVarTotalFreg18 = function(){
    var sliderVarTotalFreg18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 172){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalFreg18, {
        start: [minVarTotalFreg18, maxVarTotalFreg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalFreg18,
            'max': maxVarTotalFreg18
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalFreg18);
    inputNumberMax.setAttribute("value",maxVarTotalFreg18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalFreg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalFreg18.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalFreg18.noUiSlider.on('update',function(e){
        VarTotalFreg18.eachLayer(function(layer){
            if (layer.feature.properties.VarTot_18 == null){
                return false
            }
            if(layer.feature.properties.VarTot_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalFreg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 172;
    sliderAtivo = sliderVarTotalFreg18.noUiSlider;
    $(slidersGeral).append(sliderVarTotalFreg18);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2018 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T1, em 2018, POR FREGUESIAS -------------------////

var minVarT1Freg18 = 9999;
var maxVarT1Freg18 = 0;

function CorVarT1Freg18_17(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT1Freg18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T0 ou T1 licenciados, entre 2018 e 2017, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT1Freg18(feature) {
    if(feature.properties.VarT1_18 <= minVarT1Freg18){
        minVarT1Freg18 = feature.properties.VarT1_18
    }
    if(feature.properties.VarT1_18 > maxVarT1Freg18){
        maxVarT1Freg18 = feature.properties.VarT1_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT1Freg18_17(feature.properties.VarT1_18)};
    }


function apagarVarT1Freg18(e) {
    VarT1Freg18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT1Freg18(feature, layer) {
    if (feature.properties.VarT1_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT1_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT1Freg18,
    });
}
var VarT1Freg18= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT1Freg18,
    onEachFeature: onEachFeatureVarT1Freg18
});

let slideVarT1Freg18 = function(){
    var sliderVarT1Freg18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 173){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT1Freg18, {
        start: [minVarT1Freg18, maxVarT1Freg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT1Freg18,
            'max': maxVarT1Freg18
        },
        });
    inputNumberMin.setAttribute("value",minVarT1Freg18);
    inputNumberMax.setAttribute("value",maxVarT1Freg18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT1Freg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT1Freg18.noUiSlider.set([null, this.value]);
    });

    sliderVarT1Freg18.noUiSlider.on('update',function(e){
        VarT1Freg18.eachLayer(function(layer){
            if (layer.feature.properties.VarT1_18 == null){
                return false
            }
            if(layer.feature.properties.VarT1_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT1_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT1Freg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 173;
    sliderAtivo = sliderVarT1Freg18.noUiSlider;
    $(slidersGeral).append(sliderVarT1Freg18);
} 

///////////////////////////// Fim VARIAÇÃO T1, em 2018 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T2, em 2018, POR FREGUESIAS -------------------////

var minVarT2Freg18 = 9999;
var maxVarT2Freg18 = 0;

function CorVarT2Freg18_17(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT2Freg18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T2 licenciados, entre 2018 e 2017, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT2Freg18(feature) {
    if(feature.properties.VarT2_18 <= minVarT2Freg18){
        minVarT2Freg18 = feature.properties.VarT2_18
    }
    if(feature.properties.VarT2_18 > maxVarT2Freg18){
        maxVarT2Freg18 = feature.properties.VarT2_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT2Freg18_17(feature.properties.VarT2_18)};
    }


function apagarVarT2Freg18(e) {
    VarT2Freg18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT2Freg18(feature, layer) {
    if (feature.properties.VarT2_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT2_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT2Freg18,
    });
}
var VarT2Freg18= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT2Freg18,
    onEachFeature: onEachFeatureVarT2Freg18
});

let slideVarT2Freg18 = function(){
    var sliderVarT2Freg18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 174){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT2Freg18, {
        start: [minVarT2Freg18, maxVarT2Freg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT2Freg18,
            'max': maxVarT2Freg18
        },
        });
    inputNumberMin.setAttribute("value",minVarT2Freg18);
    inputNumberMax.setAttribute("value",maxVarT2Freg18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT2Freg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT2Freg18.noUiSlider.set([null, this.value]);
    });

    sliderVarT2Freg18.noUiSlider.on('update',function(e){
        VarT2Freg18.eachLayer(function(layer){
            if (layer.feature.properties.VarT2_18 == null){
                return false
            }
            if(layer.feature.properties.VarT2_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT2_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT2Freg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 174;
    sliderAtivo = sliderVarT2Freg18.noUiSlider;
    $(slidersGeral).append(sliderVarT2Freg18);
} 

///////////////////////////// Fim VARIAÇÃO T2, em 2018 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T3, em 2018, POR FREGUESIAS -------------------////

var minVarT3Freg18 = 9999;
var maxVarT3Freg18 = 0;

function CorVarT3Freg18_17(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT3Freg18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T3 licenciados, entre 2018 e 2017, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT3Freg18(feature) {
    if(feature.properties.VarT3_18 <= minVarT3Freg18){
        minVarT3Freg18 = feature.properties.VarT3_18
    }
    if(feature.properties.VarT3_18 > maxVarT3Freg18){
        maxVarT3Freg18 = feature.properties.VarT3_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT3Freg18_17(feature.properties.VarT3_18)};
    }


function apagarVarT3Freg18(e) {
    VarT3Freg18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT3Freg18(feature, layer) {
    if (feature.properties.VarT3_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT3_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT3Freg18,
    });
}
var VarT3Freg18= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT3Freg18,
    onEachFeature: onEachFeatureVarT3Freg18
});

let slideVarT3Freg18 = function(){
    var sliderVarT3Freg18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 175){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT3Freg18, {
        start: [minVarT3Freg18, maxVarT3Freg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT3Freg18,
            'max': maxVarT3Freg18
        },
        });
    inputNumberMin.setAttribute("value",minVarT3Freg18);
    inputNumberMax.setAttribute("value",maxVarT3Freg18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT3Freg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT3Freg18.noUiSlider.set([null, this.value]);
    });

    sliderVarT3Freg18.noUiSlider.on('update',function(e){
        VarT3Freg18.eachLayer(function(layer){
            if (layer.feature.properties.VarT3_18 == null){
                return false
            }
            if(layer.feature.properties.VarT3_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT3_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT3Freg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 175;
    sliderAtivo = sliderVarT3Freg18.noUiSlider;
    $(slidersGeral).append(sliderVarT3Freg18);
} 

///////////////////////////// Fim VARIAÇÃO T3, em 2018 , POR FREGUESIAS -------------- \\\\\


/////////////////////////////------- Variação T4, em 2018, POR FREGUESIAS -------------------////

var minVarT4Freg18 = 9999;
var maxVarT4Freg18 = 0;

function CorVarT4Freg18_17(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT4Freg18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T4 ou mais licenciados, entre 2018 e 2017, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT4Freg18(feature) {
    if(feature.properties.VarT4_18 <= minVarT4Freg18){
        minVarT4Freg18 = feature.properties.VarT4_18
    }
    if(feature.properties.VarT4_18 > maxVarT4Freg18){
        maxVarT4Freg18 = feature.properties.VarT4_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT4Freg18_17(feature.properties.VarT4_18)};
    }


function apagarVarT4Freg18(e) {
    VarT4Freg18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT4Freg18(feature, layer) {
    if (feature.properties.VarT4_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT4_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT4Freg18,
    });
}
var VarT4Freg18= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT4Freg18,
    onEachFeature: onEachFeatureVarT4Freg18
});

let slideVarT4Freg18 = function(){
    var sliderVarT4Freg18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 176){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT4Freg18, {
        start: [minVarT4Freg18, maxVarT4Freg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT4Freg18,
            'max': maxVarT4Freg18
        },
        });
    inputNumberMin.setAttribute("value",minVarT4Freg18);
    inputNumberMax.setAttribute("value",maxVarT4Freg18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT4Freg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT4Freg18.noUiSlider.set([null, this.value]);
    });

    sliderVarT4Freg18.noUiSlider.on('update',function(e){
        VarT4Freg18.eachLayer(function(layer){
            if (layer.feature.properties.VarT4_18 == null){
                return false
            }
            if(layer.feature.properties.VarT4_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT4_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT4Freg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 176;
    sliderAtivo = sliderVarT4Freg18.noUiSlider;
    $(slidersGeral).append(sliderVarT4Freg18);
} 

///////////////////////////// Fim VARIAÇÃO T4, em 2018 , POR FREGUESIAS -------------- \\\\\


/////////////////////////////------- Variação Total, em 2019, POR FREGUESIAS -------------------////

var minVarTotalFreg19 = 9999;
var maxVarTotalFreg19 = 0;

function CorVarTotalFreg19_18(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalFreg19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos licenciados, entre 2019 e 2018, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalFreg19(feature) {
    if(feature.properties.VarTot_19 <= minVarTotalFreg19){
        minVarTotalFreg19 = feature.properties.VarTot_19
    }
    if(feature.properties.VarTot_19 > maxVarTotalFreg19){
        maxVarTotalFreg19 = feature.properties.VarTot_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalFreg19_18(feature.properties.VarTot_19)};
    }


function apagarVarTotalFreg19(e) {
    VarTotalFreg19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalFreg19(feature, layer) {
    if (feature.properties.VarTot_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalFreg19,
    });
}
var VarTotalFreg19= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarTotalFreg19,
    onEachFeature: onEachFeatureVarTotalFreg19
});

let slideVarTotalFreg19 = function(){
    var sliderVarTotalFreg19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 177){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalFreg19, {
        start: [minVarTotalFreg19, maxVarTotalFreg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalFreg19,
            'max': maxVarTotalFreg19
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalFreg19);
    inputNumberMax.setAttribute("value",maxVarTotalFreg19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalFreg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalFreg19.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalFreg19.noUiSlider.on('update',function(e){
        VarTotalFreg19.eachLayer(function(layer){
            if (layer.feature.properties.VarTot_19 == null){
                return false
            }
            if(layer.feature.properties.VarTot_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalFreg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 177;
    sliderAtivo = sliderVarTotalFreg19.noUiSlider;
    $(slidersGeral).append(sliderVarTotalFreg19);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2019 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T1, em 2019, POR FREGUESIAS -------------------////

var minVarT1Freg19 = 9999;
var maxVarT1Freg19 = 0;

function CorVarT1Freg19_18(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT1Freg19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T0 ou T1 licenciados, entre 2019 e 2018, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT1Freg19(feature) {
    if(feature.properties.VarT1_19 <= minVarT1Freg19){
        minVarT1Freg19 = feature.properties.VarT1_19
    }
    if(feature.properties.VarT1_19 > maxVarT1Freg19){
        maxVarT1Freg19 = feature.properties.VarT1_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT1Freg19_18(feature.properties.VarT1_19)};
    }


function apagarVarT1Freg19(e) {
    VarT1Freg19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT1Freg19(feature, layer) {
    if (feature.properties.VarT1_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT1_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT1Freg19,
    });
}
var VarT1Freg19= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT1Freg19,
    onEachFeature: onEachFeatureVarT1Freg19
});

let slideVarT1Freg19 = function(){
    var sliderVarT1Freg19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 178){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT1Freg19, {
        start: [minVarT1Freg19, maxVarT1Freg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT1Freg19,
            'max': maxVarT1Freg19
        },
        });
    inputNumberMin.setAttribute("value",minVarT1Freg19);
    inputNumberMax.setAttribute("value",maxVarT1Freg19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT1Freg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT1Freg19.noUiSlider.set([null, this.value]);
    });

    sliderVarT1Freg19.noUiSlider.on('update',function(e){
        VarT1Freg19.eachLayer(function(layer){
            if (layer.feature.properties.VarT1_19 == null){
                return false
            }
            if(layer.feature.properties.VarT1_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT1_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT1Freg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 178;
    sliderAtivo = sliderVarT1Freg19.noUiSlider;
    $(slidersGeral).append(sliderVarT1Freg19);
} 

///////////////////////////// Fim VARIAÇÃO T1, em 2019 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T2, em 2019, POR FREGUESIAS -------------------////

var minVarT2Freg19 = 9999;
var maxVarT2Freg19 = 0;

function CorVarT2Freg19_18(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT2Freg19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T2 licenciados, entre 2019 e 2018, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT2Freg19(feature) {
    if(feature.properties.VarT2_19 <= minVarT2Freg19){
        minVarT2Freg19 = feature.properties.VarT2_19
    }
    if(feature.properties.VarT2_19 > maxVarT2Freg19){
        maxVarT2Freg19 = feature.properties.VarT2_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT2Freg19_18(feature.properties.VarT2_19)};
    }


function apagarVarT2Freg19(e) {
    VarT2Freg19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT2Freg19(feature, layer) {
    if (feature.properties.VarT2_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT2_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT2Freg19,
    });
}
var VarT2Freg19= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT2Freg19,
    onEachFeature: onEachFeatureVarT2Freg19
});

let slideVarT2Freg19 = function(){
    var sliderVarT2Freg19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 179){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT2Freg19, {
        start: [minVarT2Freg19, maxVarT2Freg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT2Freg19,
            'max': maxVarT2Freg19
        },
        });
    inputNumberMin.setAttribute("value",minVarT2Freg19);
    inputNumberMax.setAttribute("value",maxVarT2Freg19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT2Freg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT2Freg19.noUiSlider.set([null, this.value]);
    });

    sliderVarT2Freg19.noUiSlider.on('update',function(e){
        VarT2Freg19.eachLayer(function(layer){
            if (layer.feature.properties.VarT2_19 == null){
                return false
            }
            if(layer.feature.properties.VarT2_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT2_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT2Freg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 179;
    sliderAtivo = sliderVarT2Freg19.noUiSlider;
    $(slidersGeral).append(sliderVarT2Freg19);
} 

///////////////////////////// Fim VARIAÇÃO T2, em 2019 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T3, em 2019, POR FREGUESIAS -------------------////

var minVarT3Freg19 = 9999;
var maxVarT3Freg19 = 0;

function CorVarT3Freg19_18(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT3Freg19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T3 licenciados, entre 2019 e 2018, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT3Freg19(feature) {
    if(feature.properties.VarT3_19 <= minVarT3Freg19){
        minVarT3Freg19 = feature.properties.VarT3_19
    }
    if(feature.properties.VarT3_19 > maxVarT3Freg19){
        maxVarT3Freg19 = feature.properties.VarT3_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT3Freg19_18(feature.properties.VarT3_19)};
    }


function apagarVarT3Freg19(e) {
    VarT3Freg19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT3Freg19(feature, layer) {
    if (feature.properties.VarT3_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT3_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT3Freg19,
    });
}
var VarT3Freg19= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT3Freg19,
    onEachFeature: onEachFeatureVarT3Freg19
});

let slideVarT3Freg19 = function(){
    var sliderVarT3Freg19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 180){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT3Freg19, {
        start: [minVarT3Freg19, maxVarT3Freg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT3Freg19,
            'max': maxVarT3Freg19
        },
        });
    inputNumberMin.setAttribute("value",minVarT3Freg19);
    inputNumberMax.setAttribute("value",maxVarT3Freg19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT3Freg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT3Freg19.noUiSlider.set([null, this.value]);
    });

    sliderVarT3Freg19.noUiSlider.on('update',function(e){
        VarT3Freg19.eachLayer(function(layer){
            if (layer.feature.properties.VarT3_19 == null){
                return false
            }
            if(layer.feature.properties.VarT3_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT3_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT3Freg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 180;
    sliderAtivo = sliderVarT3Freg19.noUiSlider;
    $(slidersGeral).append(sliderVarT3Freg19);
} 

///////////////////////////// Fim VARIAÇÃO T3, em 2019 , POR FREGUESIAS -------------- \\\\\


/////////////////////////////------- Variação T4, em 2019, POR FREGUESIAS -------------------////

var minVarT4Freg19 = 9999;
var maxVarT4Freg19 = 0;

function CorVarT4Freg19_18(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT4Freg19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T4 ou mais licenciados, entre 2019 e 2018, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT4Freg19(feature) {
    if(feature.properties.VarT4_19 <= minVarT4Freg19){
        minVarT4Freg19 = feature.properties.VarT4_19
    }
    if(feature.properties.VarT4_19 > maxVarT4Freg19){
        maxVarT4Freg19 = feature.properties.VarT4_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT4Freg19_18(feature.properties.VarT4_19)};
    }


function apagarVarT4Freg19(e) {
    VarT4Freg19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT4Freg19(feature, layer) {
    if (feature.properties.VarT4_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT4_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT4Freg19,
    });
}
var VarT4Freg19= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT4Freg19,
    onEachFeature: onEachFeatureVarT4Freg19
});

let slideVarT4Freg19 = function(){
    var sliderVarT4Freg19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 181){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT4Freg19, {
        start: [minVarT4Freg19, maxVarT4Freg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT4Freg19,
            'max': maxVarT4Freg19
        },
        });
    inputNumberMin.setAttribute("value",minVarT4Freg19);
    inputNumberMax.setAttribute("value",maxVarT4Freg19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT4Freg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT4Freg19.noUiSlider.set([null, this.value]);
    });

    sliderVarT4Freg19.noUiSlider.on('update',function(e){
        VarT4Freg19.eachLayer(function(layer){
            if (layer.feature.properties.VarT4_19 == null){
                return false
            }
            if(layer.feature.properties.VarT4_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT4_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT4Freg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 181;
    sliderAtivo = sliderVarT4Freg19.noUiSlider;
    $(slidersGeral).append(sliderVarT4Freg19);
} 

///////////////////////////// Fim VARIAÇÃO T4, em 2019 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Total, em 2020, POR FREGUESIAS -------------------////

var minVarTotalFreg20 = 9999;
var maxVarTotalFreg20 = 0;

function CorVarTotalFreg20_19(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalFreg20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos licenciados, entre 2020 e 2019, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalFreg20(feature) {
    if(feature.properties.VarTot_20 <= minVarTotalFreg20){
        minVarTotalFreg20 = feature.properties.VarTot_20
    }
    if(feature.properties.VarTot_20 > maxVarTotalFreg20){
        maxVarTotalFreg20 = feature.properties.VarTot_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalFreg20_19(feature.properties.VarTot_20)};
    }


function apagarVarTotalFreg20(e) {
    VarTotalFreg20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalFreg20(feature, layer) {
    if (feature.properties.VarTot_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalFreg20,
    });
}
var VarTotalFreg20= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarTotalFreg20,
    onEachFeature: onEachFeatureVarTotalFreg20
});

let slideVarTotalFreg20 = function(){
    var sliderVarTotalFreg20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 182){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalFreg20, {
        start: [minVarTotalFreg20, maxVarTotalFreg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalFreg20,
            'max': maxVarTotalFreg20
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalFreg20);
    inputNumberMax.setAttribute("value",maxVarTotalFreg20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalFreg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalFreg20.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalFreg20.noUiSlider.on('update',function(e){
        VarTotalFreg20.eachLayer(function(layer){
            if (layer.feature.properties.VarTot_20 == null){
                return false
            }
            if(layer.feature.properties.VarTot_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotalFreg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 182;
    sliderAtivo = sliderVarTotalFreg20.noUiSlider;
    $(slidersGeral).append(sliderVarTotalFreg20);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2020 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T1, em 2020, POR FREGUESIAS -------------------////

var minVarT1Freg20 = 9999;
var maxVarT1Freg20 = 0;

function CorVarT1Freg20_19(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT1Freg20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T0 ou T1 licenciados, entre 2020 e 2019, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT1Freg20(feature) {
    if(feature.properties.VarT1_20 <= minVarT1Freg20){
        minVarT1Freg20 = feature.properties.VarT1_20
    }
    if(feature.properties.VarT1_20 > maxVarT1Freg20){
        maxVarT1Freg20 = feature.properties.VarT1_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT1Freg20_19(feature.properties.VarT1_20)};
    }


function apagarVarT1Freg20(e) {
    VarT1Freg20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT1Freg20(feature, layer) {
    if (feature.properties.VarT1_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT1_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT1Freg20,
    });
}
var VarT1Freg20= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT1Freg20,
    onEachFeature: onEachFeatureVarT1Freg20
});

let slideVarT1Freg20 = function(){
    var sliderVarT1Freg20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 183){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT1Freg20, {
        start: [minVarT1Freg20, maxVarT1Freg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT1Freg20,
            'max': maxVarT1Freg20
        },
        });
    inputNumberMin.setAttribute("value",minVarT1Freg20);
    inputNumberMax.setAttribute("value",maxVarT1Freg20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT1Freg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT1Freg20.noUiSlider.set([null, this.value]);
    });

    sliderVarT1Freg20.noUiSlider.on('update',function(e){
        VarT1Freg20.eachLayer(function(layer){
            if (layer.feature.properties.VarT1_20 == null){
                return false
            }
            if(layer.feature.properties.VarT1_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT1_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT1Freg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 183;
    sliderAtivo = sliderVarT1Freg20.noUiSlider;
    $(slidersGeral).append(sliderVarT1Freg20);
} 

///////////////////////////// Fim VARIAÇÃO T1, em 2020 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T2, em 2020, POR FREGUESIAS -------------------////

var minVarT2Freg20 = 9999;
var maxVarT2Freg20 = 0;

function CorVarT2Freg20_19(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT2Freg20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T2 licenciados, entre 2020 e 2019, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT2Freg20(feature) {
    if(feature.properties.VarT2_20 <= minVarT2Freg20){
        minVarT2Freg20 = feature.properties.VarT2_20
    }
    if(feature.properties.VarT2_20 > maxVarT2Freg20){
        maxVarT2Freg20 = feature.properties.VarT2_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT2Freg20_19(feature.properties.VarT2_20)};
    }


function apagarVarT2Freg20(e) {
    VarT2Freg20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT2Freg20(feature, layer) {
    if (feature.properties.VarT2_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT2_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT2Freg20,
    });
}
var VarT2Freg20= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT2Freg20,
    onEachFeature: onEachFeatureVarT2Freg20
});

let slideVarT2Freg20 = function(){
    var sliderVarT2Freg20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 184){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT2Freg20, {
        start: [minVarT2Freg20, maxVarT2Freg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT2Freg20,
            'max': maxVarT2Freg20
        },
        });
    inputNumberMin.setAttribute("value",minVarT2Freg20);
    inputNumberMax.setAttribute("value",maxVarT2Freg20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT2Freg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT2Freg20.noUiSlider.set([null, this.value]);
    });

    sliderVarT2Freg20.noUiSlider.on('update',function(e){
        VarT2Freg20.eachLayer(function(layer){
            if (layer.feature.properties.VarT2_20 == null){
                return false
            }
            if(layer.feature.properties.VarT2_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT2_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT2Freg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 184;
    sliderAtivo = sliderVarT2Freg20.noUiSlider;
    $(slidersGeral).append(sliderVarT2Freg20);
} 

///////////////////////////// Fim VARIAÇÃO T2, em 2020 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação T3, em 2020, POR FREGUESIAS -------------------////

var minVarT3Freg20 = 9999;
var maxVarT3Freg20 = 0;

function CorVarT3Freg20_19(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#155273' :
                ''  ;
}

var legendaVarT3Freg20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T3 licenciados, entre 2020 e 2019, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT3Freg20(feature) {
    if(feature.properties.VarT3_20 <= minVarT3Freg20){
        minVarT3Freg20 = feature.properties.VarT3_20
    }
    if(feature.properties.VarT3_20 > maxVarT3Freg20){
        maxVarT3Freg20 = feature.properties.VarT3_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT3Freg20_19(feature.properties.VarT3_20)};
    }


function apagarVarT3Freg20(e) {
    VarT3Freg20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT3Freg20(feature, layer) {
    if (feature.properties.VarT3_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT3_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT3Freg20,
    });
}
var VarT3Freg20= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT3Freg20,
    onEachFeature: onEachFeatureVarT3Freg20
});

let slideVarT3Freg20 = function(){
    var sliderVarT3Freg20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 185){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT3Freg20, {
        start: [minVarT3Freg20, maxVarT3Freg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT3Freg20,
            'max': maxVarT3Freg20
        },
        });
    inputNumberMin.setAttribute("value",minVarT3Freg20);
    inputNumberMax.setAttribute("value",maxVarT3Freg20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT3Freg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT3Freg20.noUiSlider.set([null, this.value]);
    });

    sliderVarT3Freg20.noUiSlider.on('update',function(e){
        VarT3Freg20.eachLayer(function(layer){
            if (layer.feature.properties.VarT3_20 == null){
                return false
            }
            if(layer.feature.properties.VarT3_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT3_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT3Freg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 185;
    sliderAtivo = sliderVarT3Freg20.noUiSlider;
    $(slidersGeral).append(sliderVarT3Freg20);
} 

///////////////////////////// Fim VARIAÇÃO T3, em 2020 , POR FREGUESIAS -------------- \\\\\


/////////////////////////////------- Variação T4, em 2020, POR FREGUESIAS -------------------////

var minVarT4Freg20 = 9999;
var maxVarT4Freg20 = 0;

function CorVarT4Freg20_19(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarT4Freg20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de fogos T4 ou mais licenciados, entre 2020 e 2019, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarT4Freg20(feature) {
    if(feature.properties.VarT4_20 <= minVarT4Freg20){
        minVarT4Freg20 = feature.properties.VarT4_20
    }
    if(feature.properties.VarT4_20 > maxVarT4Freg20){
        maxVarT4Freg20 = feature.properties.VarT4_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarT4Freg20_19(feature.properties.VarT4_20)};
    }


function apagarVarT4Freg20(e) {
    VarT4Freg20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarT4Freg20(feature, layer) {
    if (feature.properties.VarT4_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarT4_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarT4Freg20,
    });
}
var VarT4Freg20= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarT4Freg20,
    onEachFeature: onEachFeatureVarT4Freg20
});

let slideVarT4Freg20 = function(){
    var sliderVarT4Freg20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 186){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarT4Freg20, {
        start: [minVarT4Freg20, maxVarT4Freg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarT4Freg20,
            'max': maxVarT4Freg20
        },
        });
    inputNumberMin.setAttribute("value",minVarT4Freg20);
    inputNumberMax.setAttribute("value",maxVarT4Freg20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarT4Freg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarT4Freg20.noUiSlider.set([null, this.value]);
    });

    sliderVarT4Freg20.noUiSlider.on('update',function(e){
        VarT4Freg20.eachLayer(function(layer){
            if (layer.feature.properties.VarT4_20 == null){
                return false
            }
            if(layer.feature.properties.VarT4_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarT4_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarT4Freg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 186;
    sliderAtivo = sliderVarT4Freg20.noUiSlider;
    $(slidersGeral).append(sliderVarT4Freg20);
} 

///////////////////////////// Fim VARIAÇÃO T4, em 2020 , POR FREGUESIAS -------------- \\\\\




/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = TotalFogosConc14;
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
    if (layer == TotalFogosConc14 && naoDuplicar != 1){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2014, por concelho.' + '</strong>')
        legenda(maxTotalFogosConc14, ((maxTotalFogosConc14-minTotalFogosConc14)/2).toFixed(0),minTotalFogosConc14,1.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalFogosConc14();
        naoDuplicar = 1;
    }
    if (layer == TotalFogosConc14 && naoDuplicar == 1){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2014, por concelho.' + '</strong>')
        contorno.addTo(map);
    }
    if (layer == FogosT1Conc14 && naoDuplicar != 2){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T0 ou T1 licenciados, em 2014, por concelho.' + '</strong>');
        legendaExcecao(maxFogosT1Conc14, ((maxFogosT1Conc14-minFogosT1Conc14)/2).toFixed(0),minFogosT1Conc14,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT1Conc14();
        naoDuplicar = 2;
    }
    if (layer == FogosT2Conc14 && naoDuplicar != 3){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T2 licenciados, em 2014, por concelho.' + '</strong>');
        legendaExcecao(maxFogosT2Conc14, ((maxFogosT2Conc14-minFogosT2Conc14)/2).toFixed(0),minFogosT2Conc14,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT2Conc14();
        naoDuplicar = 3;
    }
    if (layer == FogosT3Conc14 && naoDuplicar != 4){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T3 licenciados, em 2014, por concelho.' + '</strong>');
        legenda(maxFogosT3Conc14, ((maxFogosT3Conc14-minFogosT3Conc14)/2).toFixed(0),minFogosT3Conc14,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT3Conc14();
        naoDuplicar = 4;
    }
    if (layer == FogosT4Conc14 && naoDuplicar != 5){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T4 ou mais licenciados, em 2014, por concelho.' + '</strong>');
        legendaExcecao(maxFogosT4Conc14, ((maxFogosT4Conc14-minFogosT4Conc14)/2).toFixed(0),minFogosT4Conc14,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT4Conc14();
        naoDuplicar = 5;
    }
    if (layer == TotalFogosConc15 && naoDuplicar != 6){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2015, por concelho.' + '</strong>')
        legenda(maxTotalFogosConc15, ((maxTotalFogosConc15-minTotalFogosConc15)/2).toFixed(0),minTotalFogosConc15,1.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalFogosConc15();
        naoDuplicar = 6;
    }
    if (layer == FogosT1Conc15 && naoDuplicar != 7){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T0 ou T1 licenciados, em 2015, por concelho.' + '</strong>');
        legenda(maxFogosT1Conc15, ((maxFogosT1Conc15-minFogosT1Conc15)/2).toFixed(0),minFogosT1Conc15,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT1Conc15();
        naoDuplicar = 7;
    }
    if (layer == FogosT2Conc15 && naoDuplicar != 8){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T2 licenciados, em 2015, por concelho.' + '</strong>');
        legenda(maxFogosT2Conc15, ((maxFogosT2Conc15-minFogosT2Conc15)/2).toFixed(0),minFogosT2Conc15,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT2Conc15();
        naoDuplicar = 8;
    }
    if (layer == FogosT3Conc15 && naoDuplicar != 9){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T3 licenciados, em 2015, por concelho.' + '</strong>');
        legenda(maxFogosT3Conc15, ((maxFogosT3Conc15-minFogosT3Conc15)/2).toFixed(0),minFogosT3Conc15,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT3Conc15();
        naoDuplicar = 9;
    }
    if (layer == FogosT4Conc15 && naoDuplicar != 10){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T4 ou mais licenciados, em 2015, por concelho.' + '</strong>');
        legendaExcecao(maxFogosT4Conc15, ((maxFogosT4Conc15-minFogosT4Conc15)/2).toFixed(0),minFogosT4Conc15,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT4Conc15();
        naoDuplicar = 10;
    }
    if (layer == TotalFogosConc16 && naoDuplicar != 11){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2016, por concelho.' + '</strong>')
        legenda(maxTotalFogosConc16, ((maxTotalFogosConc16-minTotalFogosConc16)/2).toFixed(0),minTotalFogosConc16,1.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalFogosConc16();
        naoDuplicar = 11;
    }
    if (layer == FogosT1Conc16 && naoDuplicar != 12){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T0 ou T1 licenciados, em 2016, por concelho.' + '</strong>');
        legenda(maxFogosT1Conc16, ((maxFogosT1Conc16-minFogosT1Conc16)/2).toFixed(0),minFogosT1Conc16,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT1Conc16();
        naoDuplicar = 12;
    }
    if (layer == FogosT2Conc16 && naoDuplicar != 13){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T2 licenciados, em 2016, por concelho.' + '</strong>');
        legenda(maxFogosT2Conc16, ((maxFogosT2Conc16-minFogosT2Conc16)/2).toFixed(0),minFogosT2Conc16,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT2Conc16();
        naoDuplicar = 13;
    }
    if (layer == FogosT3Conc16 && naoDuplicar != 14){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T3 licenciados, em 2016, por concelho.' + '</strong>');
        legenda(maxFogosT3Conc16, ((maxFogosT3Conc16-minFogosT3Conc16)/2).toFixed(0),minFogosT3Conc16,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT3Conc16();
        naoDuplicar = 14;
    }
    if (layer == FogosT4Conc16 && naoDuplicar != 15){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T4 ou mais licenciados, em 2016, por concelho.' + '</strong>');
        legendaExcecao(maxFogosT4Conc16, ((maxFogosT4Conc16-minFogosT4Conc16)/2).toFixed(0),minFogosT4Conc16,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT4Conc16();
        naoDuplicar = 15;
    }
    if (layer == TotalFogosConc17 && naoDuplicar != 16){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2017, por concelho.' + '</strong>')
        legenda(maxTotalFogosConc17, ((maxTotalFogosConc17-minTotalFogosConc17)/2).toFixed(0),minTotalFogosConc17,1.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalFogosConc17();
        naoDuplicar = 16;
    }
    if (layer == FogosT1Conc17 && naoDuplicar != 17){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T0 ou T1 licenciados, em 2017, por concelho.' + '</strong>');
        legenda(maxFogosT1Conc17, ((maxFogosT1Conc17-minFogosT1Conc17)/2).toFixed(0),minFogosT1Conc17,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT1Conc17();
        naoDuplicar = 17;
    }
    if (layer == FogosT2Conc17 && naoDuplicar != 18){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T2 licenciados, em 2017, por concelho.' + '</strong>');
        legenda(maxFogosT2Conc17, ((maxFogosT2Conc17-minFogosT2Conc17)/2).toFixed(0),minFogosT2Conc17,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT2Conc17();
        naoDuplicar = 18;
    }
    if (layer == FogosT3Conc17 && naoDuplicar != 19){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T3 licenciados, em 2017, por concelho.' + '</strong>');
        legenda(maxFogosT3Conc17, ((maxFogosT3Conc17-minFogosT3Conc17)/2).toFixed(0),minFogosT3Conc17,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT3Conc17();
        naoDuplicar = 19;
    }
    if (layer == FogosT4Conc17 && naoDuplicar != 20){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T4 ou mais licenciados, em 2017, por concelho.' + '</strong>');
        legenda(maxFogosT4Conc17, ((maxFogosT4Conc17-minFogosT4Conc17)/2).toFixed(0),minFogosT4Conc17,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT4Conc17();
        naoDuplicar = 20;
    }
    if (layer == TotalFogosConc18 && naoDuplicar != 21){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2018, por concelho.' + '</strong>')
        legenda(maxTotalFogosConc18, ((maxTotalFogosConc18-minTotalFogosConc18)/2).toFixed(0),minTotalFogosConc18,1.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalFogosConc18();
        naoDuplicar = 21;
    }
    if (layer == FogosT1Conc18 && naoDuplicar != 22){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T0 ou T1 licenciados, em 2018, por concelho.' + '</strong>');
        legenda(maxFogosT1Conc18, ((maxFogosT1Conc18-minFogosT1Conc18)/2).toFixed(0),minFogosT1Conc18,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT1Conc18();
        naoDuplicar = 22;
    }
    if (layer == FogosT2Conc18 && naoDuplicar != 23){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T2 licenciados, em 2018, por concelho.' + '</strong>');
        legenda(maxFogosT2Conc18, ((maxFogosT2Conc18-minFogosT2Conc18)/2).toFixed(0),minFogosT2Conc18,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT2Conc18();
        naoDuplicar = 23;
    }
    if (layer == FogosT3Conc18 && naoDuplicar != 24){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T3 licenciados, em 2018, por concelho.' + '</strong>');
        legenda(maxFogosT3Conc18, ((maxFogosT3Conc18-minFogosT3Conc18)/2).toFixed(0),minFogosT3Conc18,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT3Conc18();
        naoDuplicar = 24;
    }
    if (layer == FogosT4Conc18 && naoDuplicar != 25){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T4 ou mais licenciados, em 2018, por concelho.' + '</strong>');
        legenda(maxFogosT4Conc18, ((maxFogosT4Conc18-minFogosT4Conc18)/2).toFixed(0),minFogosT4Conc18,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT4Conc18();
        naoDuplicar = 25;
    }
    if (layer == TotalFogosConc19 && naoDuplicar != 26){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2019, por concelho.' + '</strong>')
        legenda(maxTotalFogosConc19, ((maxTotalFogosConc19-minTotalFogosConc19)/2).toFixed(0),minTotalFogosConc19,1.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalFogosConc19();
        naoDuplicar = 26;
    }
    if (layer == FogosT1Conc19 && naoDuplicar != 27){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T0 ou T1 licenciados, em 2019, por concelho.' + '</strong>');
        legenda(maxFogosT1Conc19, ((maxFogosT1Conc19-minFogosT1Conc19)/2).toFixed(0),minFogosT1Conc19,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT1Conc19();
        naoDuplicar = 27;
    }
    if (layer == FogosT2Conc19 && naoDuplicar != 28){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T2 licenciados, em 2019, por concelho.' + '</strong>');
        legenda(maxFogosT2Conc19, ((maxFogosT2Conc19-minFogosT2Conc19)/2).toFixed(0),minFogosT2Conc19,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT2Conc19();
        naoDuplicar = 28;
    }
    if (layer == FogosT3Conc19 && naoDuplicar != 29){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T3 licenciados, em 2019, por concelho.' + '</strong>');
        legenda(maxFogosT3Conc19, ((maxFogosT3Conc19-minFogosT3Conc19)/2).toFixed(0),minFogosT3Conc19,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT3Conc19();
        naoDuplicar = 29;
    }
    if (layer == FogosT4Conc19 && naoDuplicar != 30){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T4 ou mais licenciados, em 2019, por concelho.' + '</strong>');
        legenda(maxFogosT4Conc19, ((maxFogosT4Conc19-minFogosT4Conc19)/2).toFixed(0),minFogosT4Conc19,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT4Conc19();
        naoDuplicar = 30;
    }
    if (layer == TotalFogosConc20 && naoDuplicar != 31){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2020, por concelho.' + '</strong>')
        legenda(maxTotalFogosConc20, ((maxTotalFogosConc20-minTotalFogosConc20)/2).toFixed(0),minTotalFogosConc20,1.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalFogosConc20();
        naoDuplicar = 31;
    }
    if (layer == FogosT1Conc20 && naoDuplicar != 32){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T0 ou T1 licenciados, em 2020, por concelho.' + '</strong>');
        legenda(maxFogosT1Conc20, ((maxFogosT1Conc20-minFogosT1Conc20)/2).toFixed(0),minFogosT1Conc20,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT1Conc20();
        naoDuplicar = 32;
    }
    if (layer == FogosT2Conc20 && naoDuplicar != 33){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T2 licenciados, em 2020, por concelho.' + '</strong>');
        legenda(maxFogosT2Conc20, ((maxFogosT2Conc20-minFogosT2Conc20)/2).toFixed(0),minFogosT2Conc20,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT2Conc20();
        naoDuplicar = 33;
    }
    if (layer == FogosT3Conc20 && naoDuplicar != 34){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T3 licenciados, em 2020, por concelho.' + '</strong>');
        legenda(maxFogosT3Conc20, ((maxFogosT3Conc20-minFogosT3Conc20)/2).toFixed(0),minFogosT3Conc20,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT3Conc20();
        naoDuplicar = 34;
    }
    if (layer == FogosT4Conc20 && naoDuplicar != 35){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T4 ou mais licenciados, em 2020, por concelho.' + '</strong>');
        legenda(maxFogosT4Conc20, ((maxFogosT4Conc20-minFogosT4Conc20)/2).toFixed(0),minFogosT4Conc20,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideFogosT4Conc20();
        naoDuplicar = 35;
    }
    if (layer == PerT1Conc14 && naoDuplicar != 36){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T0 ou T1 licenciados, em 2014, por concelho.' + '</strong>')
        legendaPerT1Conc();
        slidePerT1Conc14();
        naoDuplicar = 36;
    }
    if (layer == PerT2Conc14 && naoDuplicar != 37){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T2 licenciados, em 2014, por concelho.' + '</strong>')
        legendaPerT2Conc();
        slidePerT2Conc14();
        naoDuplicar = 37;
    }
    if (layer == PerT3Conc14 && naoDuplicar != 38){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T3 licenciados, em 2014, por concelho.' + '</strong>')
        legendaPerT3Conc();
        slidePerT3Conc14();
        naoDuplicar = 38;
    }
    if (layer == PerT4Conc14 && naoDuplicar != 39){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T4 ou mais licenciados, em 2014, por concelho.' + '</strong>')
        legendaPerT4Conc();
        slidePerT4Conc14();
        naoDuplicar = 39;
    }
    if (layer == PerT1Conc15 && naoDuplicar != 40){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T0 ou T1 licenciados, em 2015, por concelho.' + '</strong>')
        legendaPerT1Conc();
        slidePerT1Conc15();
        naoDuplicar = 40;
    }
    if (layer == PerT2Conc15 && naoDuplicar != 41){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T2 licenciados, em 2015, por concelho.' + '</strong>')
        legendaPerT2Conc();
        slidePerT2Conc15();
        naoDuplicar = 41;
    }
    if (layer == PerT3Conc15 && naoDuplicar != 42){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T3 licenciados, em 2015, por concelho.' + '</strong>')
        legendaPerT3Conc();
        slidePerT3Conc15();
        naoDuplicar = 42;
    }
    if (layer == PerT4Conc15 && naoDuplicar != 43){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T4 ou mais licenciados, em 2015, por concelho.' + '</strong>')
        legendaPerT4Conc();
        slidePerT4Conc15();
        naoDuplicar = 43;
    }
    if (layer == PerT1Conc16 && naoDuplicar != 44){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T0 ou T1 licenciados, em 2016, por concelho.' + '</strong>')
        legendaPerT1Conc();
        slidePerT1Conc16();
        naoDuplicar = 44;
    }
    if (layer == PerT2Conc16 && naoDuplicar != 45){
        legendaPerT2Conc();
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T2 licenciados, em 2016, por concelho.' + '</strong>')
        slidePerT2Conc16();
        naoDuplicar = 45;
    }
    if (layer == PerT3Conc16 && naoDuplicar != 46){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T3 licenciados, em 2016, por concelho.' + '</strong>')
        legendaPerT3Conc();
        slidePerT3Conc16();
        naoDuplicar = 46;
    }
    if (layer == PerT4Conc16 && naoDuplicar != 47){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T4 ou mais licenciados, em 2016, por concelho.' + '</strong>')
        legendaPerT4Conc();
        slidePerT4Conc16();
        naoDuplicar = 47;
    }
    if (layer == PerT1Conc17 && naoDuplicar != 48){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T0 ou T1 licenciados, em 2017, por concelho.' + '</strong>')
        legendaPerT1Conc();
        slidePerT1Conc17();
        naoDuplicar = 48;
    }
    if (layer == PerT2Conc17 && naoDuplicar != 49){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T2 licenciados, em 2017, por concelho.' + '</strong>')
        legendaPerT2Conc();
        slidePerT2Conc17();
        naoDuplicar = 49;
    }
    if (layer == PerT3Conc17 && naoDuplicar != 50){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T3 licenciados, em 2017, por concelho.' + '</strong>')
        legendaPerT3Conc();
        slidePerT3Conc17();
        naoDuplicar = 50;
    }
    if (layer == PerT4Conc17 && naoDuplicar != 51){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T4 ou mais licenciados, em 2017, por concelho.' + '</strong>')
        legendaPerT4Conc();
        slidePerT4Conc17();
        naoDuplicar = 51;
    }
    if (layer == PerT1Conc18 && naoDuplicar != 52){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T0 ou T1 licenciados, em 2018, por concelho.' + '</strong>')
        legendaPerT1Conc();
        slidePerT1Conc18();
        naoDuplicar = 52;
    }
    if (layer == PerT2Conc18 && naoDuplicar != 53){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T2 licenciados, em 2018, por concelho.' + '</strong>')
        legendaPerT2Conc();
        slidePerT2Conc18();
        naoDuplicar = 53;
    }
    if (layer == PerT3Conc18 && naoDuplicar != 54){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T3 licenciados, em 2018, por concelho.' + '</strong>')
        legendaPerT3Conc();
        slidePerT3Conc18();
        naoDuplicar = 54;
    }
    if (layer == PerT4Conc18 && naoDuplicar != 55){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T4 ou mais licenciados, em 2018, por concelho.' + '</strong>')
        legendaPerT4Conc();
        slidePerT4Conc18();
        naoDuplicar = 55;
    }
    if (layer == PerT1Conc19 && naoDuplicar != 56){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T0 ou T1 licenciados, em 2019, por concelho.' + '</strong>')
        legendaPerT1Conc();
        slidePerT1Conc19();
        naoDuplicar = 56;
    }
    if (layer == PerT2Conc19 && naoDuplicar != 57){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T2 licenciados, em 2019, por concelho.' + '</strong>')
        legendaPerT2Conc();
        slidePerT2Conc19();
        naoDuplicar = 57;
    }
    if (layer == PerT3Conc19 && naoDuplicar != 58){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T3 licenciados, em 2019, por concelho.' + '</strong>')
        legendaPerT3Conc();
        slidePerT3Conc19();
        naoDuplicar = 58;
    }
    if (layer == PerT4Conc19 && naoDuplicar != 59){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T4 ou mais licenciados, em 2019, por concelho.' + '</strong>')
        legendaPerT4Conc();
        slidePerT4Conc19();
        naoDuplicar = 59;
    }
    if (layer == PerT1Conc20 && naoDuplicar != 60){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T0 ou T1 licenciados, em 2020, por concelho.' + '</strong>')
        legendaPerT1Conc();
        slidePerT1Conc20();
        naoDuplicar = 60;
    }
    if (layer == PerT2Conc20 && naoDuplicar != 61){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T2 licenciados, em 2020, por concelho.' + '</strong>')
        legendaPerT2Conc();
        slidePerT2Conc20();
        naoDuplicar = 61;
    }
    if (layer == PerT3Conc20 && naoDuplicar != 62){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T3 licenciados, em 2020, por concelho.' + '</strong>')
        legendaPerT3Conc();
        slidePerT3Conc20();
        naoDuplicar = 62;
    }
    if (layer == PerT4Conc20 && naoDuplicar != 63){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T4 ou mais licenciados, em 2020, por concelho.' + '</strong>')
        legendaPerT4Conc();
        slidePerT4Conc20();
        naoDuplicar = 63;
    }
    if (layer == VarTotalConc15 && naoDuplicar != 64){
        legendaVarTotalConc15_14();
        slideVarTotalConc15();
        naoDuplicar = 64;
    }
    if (layer == VarT1Conc15 && naoDuplicar != 65){
        legendaVarT1Conc15_14();
        slideVarT1Conc15();
        naoDuplicar = 65;
    }
    if (layer == VarT2Conc15 && naoDuplicar != 66){
        legendaVarT2Conc15_14();
        slideVarT2Conc15();
        naoDuplicar = 66;
    }
    if (layer == VarT3Conc15 && naoDuplicar != 67){
        legendaVarT3Conc15_14();
        slideVarT3Conc15();
        naoDuplicar = 67;
    }
    if (layer == VarT4Conc15 && naoDuplicar != 68){
        legendaVarT4Conc15_14();
        slideVarT4Conc15();
        naoDuplicar = 68;
    }
    if (layer == VarTotalConc16 && naoDuplicar != 69){
        legendaVarTotalConc16_15();
        slideVarTotalConc16();
        naoDuplicar = 69;
    }
    if (layer == VarT1Conc16 && naoDuplicar != 70){
        legendaVarT1Conc16_15();
        slideVarT1Conc16();
        naoDuplicar = 70;
    }
    if (layer == VarT2Conc16 && naoDuplicar != 71){
        legendaVarT2Conc16_15();
        slideVarT2Conc16();
        naoDuplicar = 71;
    }
    if (layer == VarT3Conc16 && naoDuplicar != 72){
        legendaVarT3Conc16_15();
        slideVarT3Conc16();
        naoDuplicar = 72;
    }
    if (layer == VarT4Conc16 && naoDuplicar != 73){
        legendaVarT4Conc16_15();
        slideVarT4Conc16();
        naoDuplicar = 73;
    }
    if (layer == VarTotalConc17 && naoDuplicar != 74){
        legendaVarTotalConc17_16();
        slideVarTotalConc17();
        naoDuplicar = 74;
    }
    if (layer == VarT1Conc17 && naoDuplicar != 75){
        legendaVarT1Conc17_16();
        slideVarT1Conc17();
        naoDuplicar = 75;
    }
    if (layer == VarT2Conc17 && naoDuplicar != 76){
        legendaVarT2Conc17_16();
        slideVarT2Conc17();
        naoDuplicar = 76;
    }
    if (layer == VarT3Conc17 && naoDuplicar != 77){
        legendaVarT3Conc17_16();
        slideVarT3Conc17();
        naoDuplicar = 77;
    }
    if (layer == VarT4Conc17 && naoDuplicar != 78){
        legendaVarT4Conc17_16();
        slideVarT4Conc17();
        naoDuplicar = 78;
    }
    if (layer == VarTotalConc18 && naoDuplicar != 79){
        legendaVarTotalConc18_17();
        slideVarTotalConc18();
        naoDuplicar = 79;
    }
    if (layer == VarT1Conc18 && naoDuplicar != 80){
        legendaVarT1Conc18_17();
        slideVarT1Conc18();
        naoDuplicar = 80;
    }
    if (layer == VarT2Conc18 && naoDuplicar != 81){
        legendaVarT2Conc18_17();
        slideVarT2Conc18();
        naoDuplicar = 81;
    }
    if (layer == VarT3Conc18 && naoDuplicar != 82){
        legendaVarT3Conc18_17();
        slideVarT3Conc18();
        naoDuplicar = 82;
    }
    if (layer == VarT4Conc18 && naoDuplicar != 83){
        legendaVarT4Conc18_17();
        slideVarT4Conc18();
        naoDuplicar = 83;
    }
    if (layer == VarTotalConc19 && naoDuplicar != 84){
        legendaVarTotalConc19_18();
        slideVarTotalConc19();
        naoDuplicar = 84;
    }
    if (layer == VarT1Conc19 && naoDuplicar != 85){
        legendaVarT1Conc19_18();
        slideVarT1Conc19();
        naoDuplicar = 85;
    }
    if (layer == VarT2Conc19 && naoDuplicar != 86){
        legendaVarT2Conc19_18();
        slideVarT2Conc19();
        naoDuplicar = 86;
    }
    if (layer == VarT3Conc19 && naoDuplicar != 87){
        legendaVarT3Conc19_18();
        slideVarT3Conc19();
        naoDuplicar = 87;
    }
    if (layer == VarT4Conc19 && naoDuplicar != 88){
        legendaVarT4Conc19_18();
        slideVarT4Conc19();
        naoDuplicar = 88;
    }
    if (layer == VarTotalConc20 && naoDuplicar != 89){
        legendaVarTotalConc20_19();
        slideVarTotalConc20();
        naoDuplicar = 89;
    }
    if (layer == VarT1Conc20 && naoDuplicar != 90){
        legendaVarT1Conc20_19();
        slideVarT1Conc20();
        naoDuplicar = 90;
    }
    if (layer == VarT2Conc20 && naoDuplicar != 91){
        legendaVarT2Conc20_19();
        slideVarT2Conc20();
        naoDuplicar = 91;
    }
    if (layer == VarT3Conc20 && naoDuplicar != 92){
        legendaVarT3Conc20_19();
        slideVarT3Conc20();
        naoDuplicar = 92;
    }
    if (layer == VarT4Conc20 && naoDuplicar != 93){
        legendaVarT4Conc20_19();
        slideVarT4Conc20();
        naoDuplicar = 93;
    }
    if (layer == TotalFogosFreg14 && naoDuplicar != 94){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2014, por freguesia.' + '</strong>');
        legendaExcecao(maxTotalFogosFreg14, ((maxTotalFogosFreg14-minTotalFogosFreg14)/2).toFixed(0),minTotalFogosFreg14,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalFogosFreg14();
        naoDuplicar = 94;
    }
    if (layer == FogosT1Freg14 && naoDuplicar != 95){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T0 ou T1 licenciados, em 2014, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT1Freg14, ((maxFogosT1Freg14-minFogosT1Freg14)/2).toFixed(0),minFogosT1Freg14,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT1Freg14();
        naoDuplicar = 95;
    }
    if (layer == FogosT2Freg14 && naoDuplicar != 96){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T2 licenciados, em 2014, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT2Freg14, ((maxFogosT2Freg14-minFogosT2Freg14)/2).toFixed(0),minFogosT2Freg14,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT2Freg14();
        naoDuplicar = 96;
    }
    if (layer == FogosT3Freg14 && naoDuplicar != 97){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T3 licenciados, em 2014, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT3Freg14, ((maxFogosT3Freg14-minFogosT3Freg14)/2).toFixed(0),minFogosT3Freg14,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT3Freg14();
        naoDuplicar = 97;
    }
    if (layer == FogosT4Freg14 && naoDuplicar != 98){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T4 ou mais licenciados, em 2014, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT4Freg14, ((maxFogosT4Freg14-minFogosT4Freg14)/2).toFixed(0),minFogosT4Freg14,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT4Freg14();
        naoDuplicar = 98;
    }
    if (layer == TotalFogosFreg15 && naoDuplicar != 99){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2015, por freguesia.' + '</strong>');
        legenda(maxTotalFogosFreg15, ((maxTotalFogosFreg15-minTotalFogosFreg15)/2).toFixed(0),minTotalFogosFreg15,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalFogosFreg15();
        naoDuplicar = 99;
    }
    if (layer == FogosT1Freg15 && naoDuplicar != 100){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T0 ou T1 licenciados, em 2015, por freguesia.' + '</strong>');
        legenda(maxFogosT1Freg15, ((maxFogosT1Freg15-minFogosT1Freg15)/2).toFixed(0),minFogosT1Freg15,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT1Freg15();
        naoDuplicar = 100;
    }
    if (layer == FogosT2Freg15 && naoDuplicar != 101){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T2 licenciados, em 2015, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT2Freg15, ((maxFogosT2Freg15-minFogosT2Freg15)/2).toFixed(0),minFogosT2Freg15,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT2Freg15();
        naoDuplicar = 101;
    }
    if (layer == FogosT3Freg15 && naoDuplicar != 102){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T3 licenciados, em 2015, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT3Freg15, ((maxFogosT3Freg15-minFogosT3Freg15)/2).toFixed(0),minFogosT3Freg15,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT3Freg15();
        naoDuplicar = 102;
    }
    if (layer == FogosT4Freg15 && naoDuplicar != 103){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T4 ou mais licenciados, em 2015, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT4Freg15, ((maxFogosT4Freg15-minFogosT4Freg15)/2).toFixed(0),minFogosT4Freg15,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT4Freg15();
        naoDuplicar = 103;
    }
    if (layer == TotalFogosFreg16 && naoDuplicar != 104){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2016, por freguesia.' + '</strong>');
        legenda(maxTotalFogosFreg16, ((maxTotalFogosFreg16-minTotalFogosFreg16)/2).toFixed(0),minTotalFogosFreg16,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalFogosFreg16();
        naoDuplicar = 104;
    }
    if (layer == FogosT1Freg16 && naoDuplicar != 105){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T0 ou T1 licenciados, em 2016, por freguesia.' + '</strong>');
        legenda(maxFogosT1Freg16, ((maxFogosT1Freg16-minFogosT1Freg16)/2).toFixed(0),minFogosT1Freg16,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT1Freg16();
        naoDuplicar = 105;
    }
    if (layer == FogosT2Freg16 && naoDuplicar != 106){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T2 licenciados, em 2016, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT2Freg16, ((maxFogosT2Freg16-minFogosT2Freg16)/2).toFixed(0),minFogosT2Freg16,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT2Freg16();
        naoDuplicar = 106;
    }
    if (layer == FogosT3Freg16 && naoDuplicar != 107){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T3 licenciados, em 2016, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT3Freg16, ((maxFogosT3Freg16-minFogosT3Freg16)/2).toFixed(0),minFogosT3Freg16,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT3Freg16();
        naoDuplicar = 107;
    }
    if (layer == FogosT4Freg16 && naoDuplicar != 108){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T4 ou mais licenciados, em 2016, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT4Freg16, ((maxFogosT4Freg16-minFogosT4Freg16)/2).toFixed(0),minFogosT4Freg16,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT4Freg16();
        naoDuplicar = 108;
    }
    if (layer == TotalFogosFreg17 && naoDuplicar != 109){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2017, por freguesia.' + '</strong>');
        legenda(maxTotalFogosFreg17, ((maxTotalFogosFreg17-minTotalFogosFreg17)/2).toFixed(0),minTotalFogosFreg17,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalFogosFreg17();
        naoDuplicar = 109;
    }
    if (layer == FogosT1Freg17 && naoDuplicar != 110){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T0 ou T1 licenciados, em 2017, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT1Freg17, ((maxFogosT1Freg17-minFogosT1Freg17)/2).toFixed(0),minFogosT1Freg17,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT1Freg17();
        naoDuplicar = 110;
    }
    if (layer == FogosT2Freg17 && naoDuplicar != 111){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T2 licenciados, em 2017, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT2Freg17, ((maxFogosT2Freg17-minFogosT2Freg17)/2).toFixed(0),minFogosT2Freg17,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT2Freg17();
        naoDuplicar = 111;
    }
    if (layer == FogosT3Freg17 && naoDuplicar != 112){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T3 licenciados, em 2017, por freguesia.' + '</strong>');
        legenda(maxFogosT3Freg17, ((maxFogosT3Freg17-minFogosT3Freg17)/2).toFixed(0),minFogosT3Freg17,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT3Freg17();
        naoDuplicar = 112;
    }
    if (layer == FogosT4Freg17 && naoDuplicar != 113){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T4 ou mais licenciados, em 2017, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT4Freg17, ((maxFogosT4Freg17-minFogosT4Freg17)/2).toFixed(0),minFogosT4Freg17,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT4Freg17();
        naoDuplicar = 113;
    }
    if (layer == TotalFogosFreg18 && naoDuplicar != 114){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2018, por freguesia.' + '</strong>');
        legenda(maxTotalFogosFreg18, ((maxTotalFogosFreg18-minTotalFogosFreg18)/2).toFixed(0),minTotalFogosFreg18,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalFogosFreg18();
        naoDuplicar = 114;
    }
    if (layer == FogosT1Freg18 && naoDuplicar != 115){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T0 ou T1 licenciados, em 2018, por freguesia.' + '</strong>');
        legenda(maxFogosT1Freg18, ((maxFogosT1Freg18-minFogosT1Freg18)/2).toFixed(0),minFogosT1Freg18,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT1Freg18();
        naoDuplicar = 115;
    }
    if (layer == FogosT2Freg18 && naoDuplicar != 116){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T2 licenciados, em 2018, por freguesia.' + '</strong>');
        legenda(maxFogosT2Freg18, ((maxFogosT2Freg18-minFogosT2Freg18)/2).toFixed(0),minFogosT2Freg18,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT2Freg18();
        naoDuplicar = 116;
    }
    if (layer == FogosT3Freg18 && naoDuplicar != 250){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T3 licenciados, em 2018, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT3Freg18, ((maxFogosT3Freg18-minFogosT3Freg18)/2).toFixed(0),minFogosT3Freg18,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT3Freg18();
        naoDuplicar = 117;
    }
    if (layer == FogosT4Freg18 && naoDuplicar != 118){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T4 ou mais licenciados, em 2018, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT4Freg18, ((maxFogosT4Freg18-minFogosT4Freg18)/2).toFixed(0),minFogosT4Freg18,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT4Freg18();
        naoDuplicar = 118;
    }
    if (layer == TotalFogosFreg19 && naoDuplicar != 119){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2019, por freguesia.' + '</strong>');
        legenda(maxTotalFogosFreg19, ((maxTotalFogosFreg19-minTotalFogosFreg19)/2).toFixed(0),minTotalFogosFreg19,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalFogosFreg19();
        naoDuplicar = 119;
    }
    if (layer == FogosT1Freg19 && naoDuplicar != 120){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T0 ou T1 licenciados, em 2019, por freguesia.' + '</strong>');
        legenda(maxFogosT1Freg19, ((maxFogosT1Freg19-minFogosT1Freg19)/2).toFixed(0),minFogosT1Freg19,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT1Freg19();
        naoDuplicar = 120;
    }
    if (layer == FogosT2Freg19 && naoDuplicar != 121){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T2 licenciados, em 2019, por freguesia.' + '</strong>');
        legenda(maxFogosT2Freg19, ((maxFogosT2Freg19-minFogosT2Freg19)/2).toFixed(0),minFogosT2Freg19,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT2Freg19();
        naoDuplicar = 121;
    }
    if (layer == FogosT3Freg19 && naoDuplicar != 122){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T3 licenciados, em 2019, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT3Freg19, ((maxFogosT3Freg19-minFogosT3Freg19)/2).toFixed(0),minFogosT3Freg19,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT3Freg19();
        naoDuplicar = 122;
    }
    if (layer == FogosT4Freg19 && naoDuplicar != 123){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T4 ou mais licenciados, em 2019, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT4Freg19, ((maxFogosT4Freg19-minFogosT4Freg19)/2).toFixed(0),minFogosT4Freg19,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT4Freg19();
        naoDuplicar = 123;
    }
    if (layer == TotalFogosFreg20 && naoDuplicar != 124){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos licenciados, em 2020, por freguesia.' + '</strong>');
        legenda(maxTotalFogosFreg20, ((maxTotalFogosFreg20-minTotalFogosFreg20)/2).toFixed(0),minTotalFogosFreg20,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalFogosFreg20();
        naoDuplicar = 124;
    }
    if (layer == FogosT1Freg20 && naoDuplicar != 125){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T0 ou T1 licenciados, em 2020, por freguesia.' + '</strong>');
        legenda(maxFogosT1Freg20, ((maxFogosT1Freg20-minFogosT1Freg20)/2).toFixed(0),minFogosT1Freg20,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT1Freg20();
        naoDuplicar = 125;
    }
    if (layer == FogosT2Freg20 && naoDuplicar != 126){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T2 licenciados, em 2020, por freguesia.' + '</strong>');
        legenda(maxFogosT2Freg20, ((maxFogosT2Freg20-minFogosT2Freg20)/2).toFixed(0),minFogosT2Freg20,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT2Freg20();
        naoDuplicar = 126;
    }
    if (layer == FogosT3Freg20 && naoDuplicar != 127){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T3 licenciados, em 2020, por freguesia.' + '</strong>');
        legenda(maxFogosT3Freg20, ((maxFogosT3Freg20-minFogosT3Freg20)/2).toFixed(0),minFogosT3Freg20,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT3Freg20();
        naoDuplicar = 127;
    }
    if (layer == FogosT4Freg20 && naoDuplicar != 128){
        $('#tituloMapa').html(' <strong>' + 'Total de fogos T4 ou mais licenciados, em 2020, por freguesia.' + '</strong>');
        legendaExcecao(maxFogosT4Freg20, ((maxFogosT4Freg20-minFogosT4Freg20)/2).toFixed(0),minFogosT4Freg20,1.3);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideFogosT4Freg20();
        naoDuplicar = 128;
    }
    if (layer == PerT1Freg14 && naoDuplicar != 129){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T0 ou T1 licenciados, em 2014, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT1Freg14();
        naoDuplicar = 129;
    }
    if (layer == PerT2Freg14 && naoDuplicar != 130){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T2 licenciados, em 2014, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT2Freg14();
        naoDuplicar = 130;
    }
    if (layer == PerT3Freg14 && naoDuplicar != 131){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T3 licenciados, em 2014, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT3Freg14();
        naoDuplicar = 131;
    }
    if (layer == PerT4Freg14 && naoDuplicar != 132){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T4 licenciados, em 2014, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT4Freg14();
        naoDuplicar = 132;
    }
    if (layer == PerT1Freg15 && naoDuplicar != 133){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T0 ou T1 licenciados, em 2015, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT1Freg15();
        naoDuplicar = 133;
    }
    if (layer == PerT2Freg15 && naoDuplicar != 134){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T2 licenciados, em 2015, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT2Freg15();
        naoDuplicar = 134;
    }
    if (layer == PerT3Freg15 && naoDuplicar != 135){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T3 licenciados, em 2015, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT3Freg15();
        naoDuplicar = 135;
    }
    if (layer == PerT4Freg15 && naoDuplicar != 136){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T4 licenciados, em 2015, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT4Freg15();
        naoDuplicar = 136;
    }
    if (layer == PerT1Freg16 && naoDuplicar != 137){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T0 ou T1 licenciados, em 2016, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT1Freg16();
        naoDuplicar = 137;
    }
    if (layer == PerT2Freg16 && naoDuplicar != 138){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T2 licenciados, em 2016, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT2Freg16();
        naoDuplicar = 138;
    }
    if (layer == PerT3Freg16 && naoDuplicar != 139){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T3 licenciados, em 2016, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT3Freg16();
        naoDuplicar = 139;
    }
    if (layer == PerT4Freg16 && naoDuplicar != 140){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T4 licenciados, em 2016, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT4Freg16();
        naoDuplicar = 140;
    }
    if (layer == PerT1Freg17 && naoDuplicar != 141){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T0 ou T1 licenciados, em 2017, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT1Freg17();
        naoDuplicar = 141;
    }
    if (layer == PerT2Freg17 && naoDuplicar != 142){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T2 licenciados, em 2017, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT2Freg17();
        naoDuplicar = 142;
    }
    if (layer == PerT3Freg17 && naoDuplicar != 143){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T3 licenciados, em 2017, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT3Freg17();
        naoDuplicar = 143;
    }
    if (layer == PerT4Freg17 && naoDuplicar != 144){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T4 licenciados, em 2017, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT4Freg17();
        naoDuplicar = 144;
    }
    if (layer == PerT1Freg18 && naoDuplicar != 145){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T0 ou T1 licenciados, em 2018, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT1Freg18();
        naoDuplicar = 145;
    }
    if (layer == PerT2Freg18 && naoDuplicar != 146){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T2 licenciados, em 2018, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT2Freg18();
        naoDuplicar = 146;
    }
    if (layer == PerT3Freg18 && naoDuplicar != 147){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T3 licenciados, em 2018, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT3Freg18();
        naoDuplicar = 147;
    }
    if (layer == PerT4Freg18 && naoDuplicar != 148){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T4 licenciados, em 2018, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT4Freg18();
        naoDuplicar = 148;
    }
    if (layer == PerT1Freg19 && naoDuplicar != 149){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T0 ou T1 licenciados, em 2019, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT1Freg19();
        naoDuplicar = 149;
    }
    if (layer == PerT2Freg19 && naoDuplicar != 150){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T2 licenciados, em 2019, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT2Freg19();
        naoDuplicar = 150;
    }
    if (layer == PerT3Freg19 && naoDuplicar != 151){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T3 licenciados, em 2019, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT3Freg19();
        naoDuplicar = 151;
    }
    if (layer == PerT4Freg19 && naoDuplicar != 152){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T4 licenciados, em 2019, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT4Freg19();
        naoDuplicar = 152;
    }
    if (layer == PerT1Freg20 && naoDuplicar != 153){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T0 ou T1 licenciados, em 2020, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT1Freg20();
        naoDuplicar = 153;
    }
    if (layer == PerT2Freg20 && naoDuplicar != 154){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T2 licenciados, em 2020, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT2Freg20();
        naoDuplicar = 154;
    }
    if (layer == PerT3Freg20 && naoDuplicar != 155){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T3 licenciados, em 2020, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT3Freg20();
        naoDuplicar = 155;
    }
    if (layer == PerT4Freg20 && naoDuplicar != 156){
        $('#tituloMapa').html(' <strong>' + 'Proporção de fogos T4 licenciados, em 2020, por freguesia.' + '</strong>');
        legendaPerTFreg();
        slidePerT4Freg20();
        naoDuplicar = 156;
    }
    if (layer == VarTotalFreg15 && naoDuplicar != 157){
        legendaVarTotalFreg15_14();
        slideVarTotalFreg15();
        naoDuplicar = 157;
    }
    if (layer == VarT1Freg15 && naoDuplicar != 158){
        legendaVarT1Freg15_14();
        slideVarT1Freg15();
        naoDuplicar = 158;
    }
    if (layer == VarT2Freg15 && naoDuplicar != 159){
        legendaVarT2Freg15_14();
        slideVarT2Freg15();
        naoDuplicar = 159;
    }
    if (layer == VarT3Freg15 && naoDuplicar != 160){
        legendaVarT3Freg15_14();
        slideVarT3Freg15();
        naoDuplicar = 160;
    }
    if (layer == VarT4Freg15 && naoDuplicar != 161){
        legendaVarT4Freg15_14();
        slideVarT4Freg15();
        naoDuplicar = 161;
    }
    if (layer == VarTotalFreg16 && naoDuplicar != 162){
        legendaVarTotalFreg16_15();
        slideVarTotalFreg16();
        naoDuplicar = 162;
    }
    if (layer == VarT1Freg16 && naoDuplicar != 163){
        legendaVarT1Freg16_15();
        slideVarT1Freg16();
        naoDuplicar = 163;
    }
    if (layer == VarT2Freg16 && naoDuplicar != 164){
        legendaVarT2Freg16_15();
        slideVarT2Freg16();
        naoDuplicar = 164;
    }
    if (layer == VarT3Freg16 && naoDuplicar != 165){
        legendaVarT3Freg16_15();
        slideVarT3Freg16();
        naoDuplicar = 165;
    }
    if (layer == VarT4Freg16 && naoDuplicar != 166){
        legendaVarT4Freg16_15();
        slideVarT4Freg16();
        naoDuplicar = 166;
    }
    if (layer == VarTotalFreg17 && naoDuplicar != 167){
        legendaVarTotalFreg17_16();
        slideVarTotalFreg17();
        naoDuplicar = 167;
    }
    if (layer == VarT1Freg17 && naoDuplicar != 168){
        legendaVarT1Freg17_16();
        slideVarT1Freg17();
        naoDuplicar = 168;
    }
    if (layer == VarT2Freg17 && naoDuplicar != 169){
        legendaVarT2Freg17_16();
        slideVarT2Freg17();
        naoDuplicar = 169;
    }
    if (layer == VarT3Freg17 && naoDuplicar != 170){
        legendaVarT3Freg17_16();
        slideVarT3Freg17();
        naoDuplicar = 170;
    }
    if (layer == VarT4Freg17 && naoDuplicar != 171){
        legendaVarT4Freg17_16();
        slideVarT4Freg17();
        naoDuplicar = 171;
    }
    if (layer == VarTotalFreg18 && naoDuplicar != 172){
        legendaVarTotalFreg18_17();
        slideVarTotalFreg18();
        naoDuplicar = 172;
    }
    if (layer == VarT1Freg18 && naoDuplicar != 173){
        legendaVarT1Freg18_17();
        slideVarT1Freg18();
        naoDuplicar = 173;
    }
    if (layer == VarT2Freg18 && naoDuplicar != 174){
        legendaVarT2Freg18_17();
        slideVarT2Freg18();
        naoDuplicar = 174;
    }
    if (layer == VarT3Freg18 && naoDuplicar != 175){
        legendaVarT3Freg18_17();
        slideVarT3Freg18();
        naoDuplicar = 175;
    }
    if (layer == VarT4Freg18 && naoDuplicar != 176){
        legendaVarT4Freg18_17();
        slideVarT4Freg18();
        naoDuplicar = 176;
    }
    if (layer == VarTotalFreg19 && naoDuplicar != 177){
        legendaVarTotalFreg19_18();
        slideVarTotalFreg19();
        naoDuplicar = 177;
    }
    if (layer == VarT1Freg19 && naoDuplicar != 178){
        legendaVarT1Freg19_18();
        slideVarT1Freg19();
        naoDuplicar = 178;
    }
    if (layer == VarT2Freg19 && naoDuplicar != 179){
        legendaVarT2Freg19_18();
        slideVarT2Freg19();
        naoDuplicar = 179;
    }
    if (layer == VarT3Freg19 && naoDuplicar != 180){
        legendaVarT3Freg19_18();
        slideVarT3Freg19();
        naoDuplicar = 180;
    }
    if (layer == VarT4Freg19 && naoDuplicar != 181){
        legendaVarT4Freg19_18();
        slideVarT4Freg19();
        naoDuplicar = 181;
    }
    if (layer == VarTotalFreg20 && naoDuplicar != 182){
        legendaVarTotalFreg20_19();
        slideVarTotalFreg20();
        naoDuplicar = 182;
    }
    if (layer == VarT1Freg20 && naoDuplicar != 183){
        legendaVarT1Freg20_19();
        slideVarT1Freg20();
        naoDuplicar = 183;
    }
    if (layer == VarT2Freg20 && naoDuplicar != 184){
        legendaVarT2Freg20_19();
        slideVarT2Freg20();
        naoDuplicar = 184;
    }
    if (layer == VarT3Freg20 && naoDuplicar != 185){
        legendaVarT3Freg20_19();
        slideVarT3Freg20();
        naoDuplicar = 185;
    }
    if (layer == VarT4Freg20 && naoDuplicar != 186){
        legendaVarT4Freg20_19();
        slideVarT4Freg20();
        naoDuplicar = 186;
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
}

function myFunction() {
    var ano = document.getElementById("mySelect").value;
    var tipologia = document.getElementById("opcaoSelect").value;
    if ($('#concelho').hasClass('active2')){
        if ($('#absoluto').hasClass('active4')){
            if (tipologia == "Total"){
                $('#notaRodape').remove();
            }
            if (ano == "2014" && tipologia == "Total"){
                novaLayer(TotalFogosConc14)
            }
            if (ano == "2014" && tipologia == "T1"){
                novaLayer(FogosT1Conc14)
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }
            if (ano == "2014" && tipologia == "T2"){
                novaLayer(FogosT2Conc14)
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            } 
            if (ano == "2014" && tipologia == "T3"){
                novaLayer(FogosT3Conc14)
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }
            if (ano == "2014" && tipologia == "T4"){
                novaLayer(FogosT4Conc14);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }      
            if (ano == "2015" && tipologia == "Total"){
                novaLayer(TotalFogosConc15)
            }     
            if (ano == "2015" && tipologia == "T1"){
                novaLayer(FogosT1Conc15)
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>');
            }
            if (ano == "2015" && tipologia == "T2"){
                novaLayer(FogosT2Conc15);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            } 
            if (ano == "2015" && tipologia == "T3"){
                novaLayer(FogosT3Conc15);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }
            if (ano == "2015" && tipologia == "T4"){
                novaLayer(FogosT4Conc15);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }
            if (ano == "2016" && tipologia == "Total"){
                novaLayer(TotalFogosConc16)
            }
            if (ano == "2016" && tipologia == "T1"){
                novaLayer(FogosT1Conc16);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }
            if (ano == "2016" && tipologia == "T2"){
                novaLayer(FogosT2Conc16);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            } 
            if (ano == "2016" && tipologia == "T3"){
                novaLayer(FogosT3Conc16);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }
            if (ano == "2016" && tipologia == "T4"){
                novaLayer(FogosT4Conc16);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            } 
            if (ano == "2017" && tipologia == "Total"){
                novaLayer(TotalFogosConc17)
            }
            if (ano == "2017" && tipologia == "T1"){
                novaLayer(FogosT1Conc17);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }
            if (ano == "2017" && tipologia == "T2"){
                novaLayer(FogosT2Conc17);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            } 
            if (ano == "2017" && tipologia == "T3"){
                novaLayer(FogosT3Conc17);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }
            if (ano == "2017" && tipologia == "T4"){
                novaLayer(FogosT4Conc17);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            } 
            if (ano == "2018" && tipologia == "Total"){
                novaLayer(TotalFogosConc18)
            }
            if (ano == "2018" && tipologia == "T1"){
                novaLayer(FogosT1Conc18);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }
            if (ano == "2018" && tipologia == "T2"){
                novaLayer(FogosT2Conc18);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            } 
            if (ano == "2018" && tipologia == "T3"){
                novaLayer(FogosT3Conc18);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }
            if (ano == "2018" && tipologia == "T4"){
                novaLayer(FogosT4Conc18);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            } 
            if (ano == "2019" && tipologia == "Total"){
                novaLayer(TotalFogosConc19)
            }
            if (ano == "2019" && tipologia == "T1"){
                novaLayer(FogosT1Conc19);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }
            if (ano == "2019" && tipologia == "T2"){
                novaLayer(FogosT2Conc19);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            } 
            if (ano == "2019" && tipologia == "T3"){
                novaLayer(FogosT3Conc19);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }
            if (ano == "2019" && tipologia == "T4"){
                novaLayer(FogosT4Conc19);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }
            if (ano == "2020" && tipologia == "Total"){
                novaLayer(TotalFogosConc20)
            }
            if (ano == "2020" && tipologia == "T1"){
                novaLayer(FogosT1Conc20);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }
            if (ano == "2020" && tipologia == "T2"){
                novaLayer(FogosT2Conc20);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            } 
            if (ano == "2020" && tipologia == "T3"){
                novaLayer(FogosT3Conc20);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }
            if (ano == "2020" && tipologia == "T4"){
                novaLayer(FogosT4Conc20);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados à escala da freguesia.'  + '</b>')
            }  
        }
    if ($('#percentagem').hasClass('active4')){
            if ($('#notaRodape').length){
                $('#notaRodape').remove();
            }
            if (ano == "2014" && tipologia == "T1"){
                novaLayer(PerT1Conc14)
            }
            if (ano == "2014" && tipologia == "T2"){
                novaLayer(PerT2Conc14)
            } 
            if (ano == "2014" && tipologia == "T3"){
                novaLayer(PerT3Conc14)
            }
            if (ano == "2014" && tipologia == "T4"){
                novaLayer(PerT4Conc14)
            }           
            if (ano == "2015" && tipologia == "T1"){
                novaLayer(PerT1Conc15)
            }
            if (ano == "2015" && tipologia == "T2"){
                novaLayer(PerT2Conc15)
            } 
            if (ano == "2015" && tipologia == "T3"){
                novaLayer(PerT3Conc15)
            }
            if (ano == "2015" && tipologia == "T4"){
                novaLayer(PerT4Conc15)
            }
            if (ano == "2016" && tipologia == "T1"){
                novaLayer(PerT1Conc16)
            }
            if (ano == "2016" && tipologia == "T2"){
                novaLayer(PerT2Conc16)
            } 
            if (ano == "2016" && tipologia == "T3"){
                novaLayer(PerT3Conc16)
            }
            if (ano == "2016" && tipologia == "T4"){
                novaLayer(PerT4Conc16)
            } 
            if (ano == "2017" && tipologia == "T1"){
                novaLayer(PerT1Conc17)
            }
            if (ano == "2017" && tipologia == "T2"){
                novaLayer(PerT2Conc17)
            } 
            if (ano == "2017" && tipologia == "T3"){
                novaLayer(PerT3Conc17)
            }
            if (ano == "2017" && tipologia == "T4"){
                novaLayer(PerT4Conc17)
            } 
            if (ano == "2018" && tipologia == "T1"){
                novaLayer(PerT1Conc18)
            }
            if (ano == "2018" && tipologia == "T2"){
                novaLayer(PerT2Conc18)
            } 
            if (ano == "2018" && tipologia == "T3"){
                novaLayer(PerT3Conc18)
            }
            if (ano == "2018" && tipologia == "T4"){
                novaLayer(PerT4Conc18)
            } 
            if (ano == "2019" && tipologia == "T1"){
                novaLayer(PerT1Conc19)
            }
            if (ano == "2019" && tipologia == "T2"){
                novaLayer(PerT2Conc19)
            } 
            if (ano == "2019" && tipologia == "T3"){
                novaLayer(PerT3Conc19)
            }
            if (ano == "2019" && tipologia == "T4"){
                novaLayer(PerT4Conc19)
            }
            if (ano == "2020" && tipologia == "T1"){
                novaLayer(PerT1Conc20)
            }
            if (ano == "2020" && tipologia == "T2"){
                novaLayer(PerT2Conc20)
            } 
            if (ano == "2020" && tipologia == "T3"){
                novaLayer(PerT3Conc20)
            }
            if (ano == "2020" && tipologia == "T4"){
                novaLayer(PerT4Conc20)
            }  
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if ($('#notaRodape').length){
                $('#notaRodape').remove();
            }
            if (ano == "2015" && tipologia == "Total"){
                novaLayer(VarTotalConc15)
            }
            if (ano == "2015" && tipologia == "T1"){
                novaLayer(VarT1Conc15)
            }
            if (ano == "2015" && tipologia == "T2"){
                novaLayer(VarT2Conc15)
            } 
            if (ano == "2015" && tipologia == "T3"){
                novaLayer(VarT3Conc15)
            }
            if (ano == "2015" && tipologia == "T4"){
                novaLayer(VarT4Conc15)
            }       
            if (ano == "2016" && tipologia == "Total"){
                novaLayer(VarTotalConc16)
            }
            if (ano == "2016" && tipologia == "T1"){
                novaLayer(VarT1Conc16)
            }
            if (ano == "2016" && tipologia == "T2"){
                novaLayer(VarT2Conc16)
            } 
            if (ano == "2016" && tipologia == "T3"){
                novaLayer(VarT3Conc16)
            }
            if (ano == "2016" && tipologia == "T4"){
                novaLayer(VarT4Conc16)
            } 
            if (ano == "2017" && tipologia == "Total"){
                novaLayer(VarTotalConc17)
            }
            if (ano == "2017" && tipologia == "T1"){
                novaLayer(VarT1Conc17)
            }
            if (ano == "2017" && tipologia == "T2"){
                novaLayer(VarT2Conc17)
            } 
            if (ano == "2017" && tipologia == "T3"){
                novaLayer(VarT3Conc17)
            }
            if (ano == "2017" && tipologia == "T4"){
                novaLayer(VarT4Conc17)
            }
            if (ano == "2018" && tipologia == "Total"){
                novaLayer(VarTotalConc18)
            }
            if (ano == "2018" && tipologia == "T1"){
                novaLayer(VarT1Conc18)
            }
            if (ano == "2018" && tipologia == "T2"){
                novaLayer(VarT2Conc18)
            } 
            if (ano == "2018" && tipologia == "T3"){
                novaLayer(VarT3Conc18)
            }
            if (ano == "2018" && tipologia == "T4"){
                novaLayer(VarT4Conc18)
            } 
            if (ano == "2019" && tipologia == "Total"){
                novaLayer(VarTotalConc19)
            }
            if (ano == "2019" && tipologia == "T1"){
                novaLayer(VarT1Conc19)
            }
            if (ano == "2019" && tipologia == "T2"){
                novaLayer(VarT2Conc19)
            } 
            if (ano == "2019" && tipologia == "T3"){
                novaLayer(VarT3Conc19)
            }
            if (ano == "2019" && tipologia == "T4"){
                novaLayer(VarT4Conc19)
            }
            if (ano == "2020" && tipologia == "Total"){
                novaLayer(VarTotalConc20)
            }
            if (ano == "2020" && tipologia == "T1"){
                novaLayer(VarT1Conc20)
            }
            if (ano == "2020" && tipologia == "T2"){
                novaLayer(VarT2Conc20)
            } 
            if (ano == "2020" && tipologia == "T3"){
                novaLayer(VarT3Conc20)
            }
            if (ano == "2020" && tipologia == "T4"){
                novaLayer(VarT4Conc20)
            }           
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if ($('#absoluto').hasClass('active5')){
            if (tipologia != "Total"){
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os dados' + '<b>' + ' totais à escala concelhia e à escala da freguesia.'  + '</b>')
            }
            if (ano == "2014" && tipologia == "Total"){
                novaLayer(TotalFogosFreg14)
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados das várias tipologias de fogo.'  + '</b>')
            }
            if (ano == "2014" && tipologia == "T1"){
                novaLayer(FogosT1Freg14)
            }
            if (ano == "2014" && tipologia == "T2"){
                novaLayer(FogosT2Freg14)
            } 
            if (ano == "2014" && tipologia == "T3"){
                novaLayer(FogosT3Freg14)
            }
            if (ano == "2014" && tipologia == "T4"){
                novaLayer(FogosT4Freg14)
            }      
            if (ano == "2015" && tipologia == "Total"){
                novaLayer(TotalFogosFreg15)
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados das várias tipologias de fogo.'  + '</b>');
            }     
            if (ano == "2015" && tipologia == "T1"){
                novaLayer(FogosT1Freg15)
            }
            if (ano == "2015" && tipologia == "T2"){
                novaLayer(FogosT2Freg15)
            } 
            if (ano == "2015" && tipologia == "T3"){
                novaLayer(FogosT3Freg15)
            }
            if (ano == "2015" && tipologia == "T4"){
                novaLayer(FogosT4Freg15)
            }
            if (ano == "2016" && tipologia == "Total"){
                novaLayer(TotalFogosFreg16);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados das várias tipologias de fogo.'  + '</b>')
            }
            if (ano == "2016" && tipologia == "T1"){
                novaLayer(FogosT1Freg16)
            }
            if (ano == "2016" && tipologia == "T2"){
                novaLayer(FogosT2Freg16)
            } 
            if (ano == "2016" && tipologia == "T3"){
                novaLayer(FogosT3Freg16)
            }
            if (ano == "2016" && tipologia == "T4"){
                novaLayer(FogosT4Freg16)
            } 
            if (ano == "2017" && tipologia == "Total"){
                novaLayer(TotalFogosFreg17);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados das várias tipologias de fogo.'  + '</b>')
            }
            if (ano == "2017" && tipologia == "T1"){
                novaLayer(FogosT1Freg17)
            }
            if (ano == "2017" && tipologia == "T2"){
                novaLayer(FogosT2Freg17)
            } 
            if (ano == "2017" && tipologia == "T3"){
                novaLayer(FogosT3Freg17)
            }
            if (ano == "2017" && tipologia == "T4"){
                novaLayer(FogosT4Freg17)
            } 
            if (ano == "2018" && tipologia == "Total"){
                novaLayer(TotalFogosFreg18);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados das várias tipologias de fogo.'  + '</b>')
            }
            if (ano == "2018" && tipologia == "T1"){
                novaLayer(FogosT1Freg18)
            }
            if (ano == "2018" && tipologia == "T2"){
                novaLayer(FogosT2Freg18)
            } 
            if (ano == "2018" && tipologia == "T3"){
                novaLayer(FogosT3Freg18)
            }
            if (ano == "2018" && tipologia == "T4"){
                novaLayer(FogosT4Freg18)
            } 
            if (ano == "2019" && tipologia == "Total"){
                novaLayer(TotalFogosFreg19);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados das várias tipologias de fogo.'  + '</b>')
            }
            if (ano == "2019" && tipologia == "T1"){
                novaLayer(FogosT1Freg19)
            }
            if (ano == "2019" && tipologia == "T2"){
                novaLayer(FogosT2Freg19)
            } 
            if (ano == "2019" && tipologia == "T3"){
                novaLayer(FogosT3Freg19)
            }
            if (ano == "2019" && tipologia == "T4"){
                novaLayer(FogosT4Freg19)
            }
            if (ano == "2020" && tipologia == "Total"){
                novaLayer(TotalFogosFreg20);
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os' + '<b>' + ' dados totais à escala concelhia e aos dados das várias tipologias de fogo.'  + '</b>')
            }
            if (ano == "2020" && tipologia == "T1"){
                novaLayer(FogosT1Freg20)
            }
            if (ano == "2020" && tipologia == "T2"){
                novaLayer(FogosT2Freg20)
            } 
            if (ano == "2020" && tipologia == "T3"){
                novaLayer(FogosT3Freg20)
            }
            if (ano == "2020" && tipologia == "T4"){
                novaLayer(FogosT4Freg20)
            }  
        }
        if ($('#percentagem').hasClass('active5')){
            if ($('#notaRodape').length){
                $('#notaRodape').remove();
            }
            if (ano == "2014" && tipologia == "T1"){
                novaLayer(PerT1Freg14)
            }
            if (ano == "2014" && tipologia == "T2"){
                novaLayer(PerT2Freg14)
            } 
            if (ano == "2014" && tipologia == "T3"){
                novaLayer(PerT3Freg14)
            }
            if (ano == "2014" && tipologia == "T4"){
                novaLayer(PerT4Freg14)
            }           
            if (ano == "2015" && tipologia == "T1"){
                novaLayer(PerT1Freg15)
            }
            if (ano == "2015" && tipologia == "T2"){
                novaLayer(PerT2Freg15)
            } 
            if (ano == "2015" && tipologia == "T3"){
                novaLayer(PerT3Freg15)
            }
            if (ano == "2015" && tipologia == "T4"){
                novaLayer(PerT4Freg15)
            }
            if (ano == "2016" && tipologia == "T1"){
                novaLayer(PerT1Freg16)
            }
            if (ano == "2016" && tipologia == "T2"){
                novaLayer(PerT2Freg16)
            } 
            if (ano == "2016" && tipologia == "T3"){
                novaLayer(PerT3Freg16)
            }
            if (ano == "2016" && tipologia == "T4"){
                novaLayer(PerT4Freg16)
            } 
            if (ano == "2017" && tipologia == "T1"){
                novaLayer(PerT1Freg17)
            }
            if (ano == "2017" && tipologia == "T2"){
                novaLayer(PerT2Freg17)
            } 
            if (ano == "2017" && tipologia == "T3"){
                novaLayer(PerT3Freg17)
            }
            if (ano == "2017" && tipologia == "T4"){
                novaLayer(PerT4Freg17)
            } 
            if (ano == "2018" && tipologia == "T1"){
                novaLayer(PerT1Freg18)
            }
            if (ano == "2018" && tipologia == "T2"){
                novaLayer(PerT2Freg18)
            } 
            if (ano == "2018" && tipologia == "T3"){
                novaLayer(PerT3Freg18)
            }
            if (ano == "2018" && tipologia == "T4"){
                novaLayer(PerT4Freg18)
            } 
            if (ano == "2019" && tipologia == "T1"){
                novaLayer(PerT1Freg19)
            }
            if (ano == "2019" && tipologia == "T2"){
                novaLayer(PerT2Freg19)
            } 
            if (ano == "2019" && tipologia == "T3"){
                novaLayer(PerT3Freg19)
            }
            if (ano == "2019" && tipologia == "T4"){
                novaLayer(PerT4Freg19)
            }
            if (ano == "2020" && tipologia == "T1"){
                novaLayer(PerT1Freg20)
            }
            if (ano == "2020" && tipologia == "T2"){
                novaLayer(PerT2Freg20)
            } 
            if (ano == "2020" && tipologia == "T3"){
                novaLayer(PerT3Freg20)
            }
            if (ano == "2020" && tipologia == "T4"){
                novaLayer(PerT4Freg20)
            }  
        }
        if ($('#taxaVariacao').hasClass('active5')){
            if ($('#notaRodape').length){
                $('#notaRodape').remove();
            }
            if (ano == "2015" && tipologia == "Total"){
                novaLayer(VarTotalFreg15)
            }
            if (ano == "2015" && tipologia == "T1"){
                novaLayer(VarT1Freg15)
            }
            if (ano == "2015" && tipologia == "T2"){
                novaLayer(VarT2Freg15)
            } 
            if (ano == "2015" && tipologia == "T3"){
                novaLayer(VarT3Freg15)
            }
            if (ano == "2015" && tipologia == "T4"){
                novaLayer(VarT4Freg15)
            }       
            if (ano == "2016" && tipologia == "Total"){
                novaLayer(VarTotalFreg16)
            }
            if (ano == "2016" && tipologia == "T1"){
                novaLayer(VarT1Freg16)
            }
            if (ano == "2016" && tipologia == "T2"){
                novaLayer(VarT2Freg16)
            } 
            if (ano == "2016" && tipologia == "T3"){
                novaLayer(VarT3Freg16)
            }
            if (ano == "2016" && tipologia == "T4"){
                novaLayer(VarT4Freg16)
            } 
            if (ano == "2017" && tipologia == "Total"){
                novaLayer(VarTotalFreg17)
            }
            if (ano == "2017" && tipologia == "T1"){
                novaLayer(VarT1Freg17)
            }
            if (ano == "2017" && tipologia == "T2"){
                novaLayer(VarT2Freg17)
            } 
            if (ano == "2017" && tipologia == "T3"){
                novaLayer(VarT3Freg17)
            }
            if (ano == "2017" && tipologia == "T4"){
                novaLayer(VarT4Freg17)
            }
            if (ano == "2018" && tipologia == "Total"){
                novaLayer(VarTotalFreg18)
            }
            if (ano == "2018" && tipologia == "T1"){
                novaLayer(VarT1Freg18)
            }
            if (ano == "2018" && tipologia == "T2"){
                novaLayer(VarT2Freg18)
            } 
            if (ano == "2018" && tipologia == "T3"){
                novaLayer(VarT3Freg18)
            }
            if (ano == "2018" && tipologia == "T4"){
                novaLayer(VarT4Freg18)
            } 
            if (ano == "2019" && tipologia == "Total"){
                novaLayer(VarTotalFreg19)
            }
            if (ano == "2019" && tipologia == "T1"){
                novaLayer(VarT1Freg19)
            }
            if (ano == "2019" && tipologia == "T2"){
                novaLayer(VarT2Freg19)
            } 
            if (ano == "2019" && tipologia == "T3"){
                novaLayer(VarT3Freg19)
            }
            if (ano == "2019" && tipologia == "T4"){
                novaLayer(VarT4Freg19)
            }
            if (ano == "2020" && tipologia == "Total"){
                novaLayer(VarTotalFreg20)
            }
            if (ano == "2020" && tipologia == "T1"){
                novaLayer(VarT1Freg20)
            }
            if (ano == "2020" && tipologia == "T2"){
                novaLayer(VarT2Freg20)
            } 
            if (ano == "2020" && tipologia == "T3"){
                novaLayer(VarT3Freg20)
            }
            if (ano == "2020" && tipologia == "T4"){
                novaLayer(VarT4Freg20)
            }           
        }
    }
}

let fonteTitulo = function(valor){
    if(valor == 'N'){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' INE, Inquérito aos projetos de obras de edificação e de demolição de edifícios.' );
    }
    else{
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' Cálculos próprios; INE, Inquérito aos projetos de obras de edificação e de demolição de edifícios.' );
    }
}

let tipologiasAbsolutos = function(){
    if ($('#absoluto').hasClass('active4') ||  $('#taxaVariacao').hasClass('active4') || $('#absoluto').hasClass('active5') ||  $('#taxaVariacao').hasClass('active5')){
        if ($("#opcaoSelect option[value='Total']").length == 0){
            $("#opcaoSelect option").eq(0).before($("<option></option>").val("Total").text("Total"));
        }
    }
    if ($('#percentagem').hasClass('active4') || $('#percentagem').hasClass('active5')){
        $("#opcaoSelect option[value='Total']").remove();
    }
}
let reporAnos = function(){
    if ($('#absoluto').hasClass('active4') || $('#percentagem').hasClass('active4') || $('#absoluto').hasClass('active5') || $('#percentagem').hasClass('active5')){
        if ($("#mySelect option[value='2014']").length == 0){
            $("#mySelect option").eq(0).before($("<option></option>").val("2014").text("2014"));
        }
        $("#mySelect option[value='2015']").html("2015");
        $("#mySelect option[value='2016']").html("2016");
        $("#mySelect option[value='2017']").html("2017");
        $("#mySelect option[value='2018']").html("2018");
        $("#mySelect option[value='2019']").html("2019");
        $("#mySelect option[value='2020']").html("2020");
        if ($('#absoluto').hasClass('active4')|| $('#absoluto').hasClass('active5') ){
            primeirovalor('2014','Total');
        }
        if ($('#percentagem').hasClass('active4')|| $('#percentagem').hasClass('active5')){
            primeirovalor('2014','T1')
        }

    }
    if ($('#taxaVariacao').hasClass('active4') || $('#taxaVariacao').hasClass('active5')){
        $("#mySelect option[value='2014']").remove();
        $("#mySelect option[value='2015']").html("2015 - 2014");
        $("#mySelect option[value='2016']").html("2016 - 2015");
        $("#mySelect option[value='2017']").html("2017 - 2016");
        $("#mySelect option[value='2018']").html("2018 - 2017");
        $("#mySelect option[value='2019']").html("2019 - 2018");
        $("#mySelect option[value='2020']").html("2020 - 2019");

        primeirovalor('2015','Total');
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
    tipologiasAbsolutos();
    reporAnos();
    tamanhoOutros();
    fonteTitulo('N');
}
$('#absoluto').click(function(){
    mudarEscala();
});
$('#percentagem').click(function(){
    mudarEscala();
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
    $('#tituloMapa').html('Número de fogos licenciados, segundo a tipologia, entre 2014 e 2020, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/FogosLicenciadosProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2014').html("2014")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Tipologia == "T4 ou mais"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom">'+value.Tipologia+'</td>';
                    dados += '<td class="borderbottom">'+value.Dados2014.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.Dados2015.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.Dados2016.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.Dados2017.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.Dados2018.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.Dados2019.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.Dados2020.toLocaleString("fr")+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Tipologia+'</td>';
                    dados += '<td>'+value.Dados2014.toLocaleString("fr")+'</td>';
                    dados += '<td>'+value.Dados2015.toLocaleString("fr")+'</td>';
                    dados += '<td>'+value.Dados2016.toLocaleString("fr")+'</td>';
                    dados += '<td>'+value.Dados2017.toLocaleString("fr")+'</td>';
                    dados += '<td>'+value.Dados2018.toLocaleString("fr")+'</td>';
                    dados += '<td>'+value.Dados2019.toLocaleString("fr")+'</td>';
                    dados += '<td>'+value.Dados2020.toLocaleString("fr")+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})};

$('#tabelaPercentagem').click(function(){
    $('#tituloMapa').html('Proporção do número de fogos licenciados, segundo a tipologia, entre 2014 e 2020, %.')
        $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/FogosLicenciadosProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2014').html("2014")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Tipologia == "T4 ou mais"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Tipologia+'</td>';
                    dados += '<td class="borderbottom">'+value.Per2014+'</td>';
                    dados += '<td class="borderbottom">'+value.Per2015+'</td>';
                    dados += '<td class="borderbottom">'+value.Per2016+'</td>';
                    dados += '<td class="borderbottom">'+value.Per2017+'</td>';
                    dados += '<td class="borderbottom">'+value.Per2018+'</td>';
                    dados += '<td class="borderbottom">'+value.Per2019+'</td>';
                    dados += '<td class="borderbottom">'+value.Per2020+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Tipologia+'</td>';
                    dados += '<td>'+value.Per2014+'</td>';
                    dados += '<td>'+value.Per2015+'</td>';
                    dados += '<td>'+value.Per2016+'</td>';
                    dados += '<td>'+value.Per2017+'</td>';
                    dados += '<td>'+value.Per2018+'</td>';
                    dados += '<td>'+value.Per2019+'</td>';
                    dados += '<td>'+value.Per2020+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});

$('#tabelaVariacao').click(function(){  
    $('#tituloMapa').html('Variação do número de fogos licenciados, segundo a tipologia, entre 2014 e 2020, %.')
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/FogosLicenciadosProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2014').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Tipologia == "T4 ou mais"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Tipologia+'</td>';
                    dados += '<td class="borderbottom">'+ ''+'</td>';
                    dados += '<td class="borderbottom">'+value.Var1514+'</td>';
                    dados += '<td class="borderbottom">'+value.Var1615+'</td>';
                    dados += '<td class="borderbottom">'+value.Var1716+'</td>';
                    dados += '<td class="borderbottom">'+value.Var1817+'</td>';
                    dados += '<td class="borderbottom">'+value.Var1918+'</td>';
                    dados += '<td class="borderbottom">'+value.Var2019+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Tipologia+'</td>';
                    dados += '<td>'+ ''+'</td>';
                    dados += '<td>'+value.Var1514+'</td>';
                    dados += '<td>'+value.Var1615+'</td>';
                    dados += '<td>'+value.Var1716+'</td>';
                    dados += '<td>'+value.Var1817+'</td>';
                    dados += '<td>'+value.Var1918+'</td>';
                    dados += '<td>'+value.Var2019+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});

let anosSelecionados = function() {
    let ano = document.getElementById("mySelect").value;
    if ($('#freguesias').hasClass("active2") || $('#concelho').hasClass("active2")){
        if (ano != "2020" || ano != "2014"){
            i = 1
        }
        if (ano == "2020"){
            i = $('#mySelect').children('option').length - 1 ;
        }
        if (ano == "2014"){
            i = 0;
        }
    }
    if ($('#taxaVariacao').hasClass('active4')){
        if (ano == "2011"){
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
